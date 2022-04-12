const proxyProc = require('child_process');
const exec = require('shelljs').exec;
const urlSafeString = require('url-safe-string');
const camelify = require('camelify');

const safeCamelString = (str) => {
    return camelify(new urlSafeString().generate(str));
}

const getGitBranch = async (branchName) => {
    if (branchName) {
        branchName = branchName.replace('refs/heads/', '').replace('refs/tags/', '');
        return Promise.resolve(safeCamelString(branchName));
    }

    return new Promise((resolve, reject) => {
        proxyProc.exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
        
            if (typeof stdout === 'string') {
                const result = safeCamelString(stdout.trim());
                resolve(result);
            }
        });
    });
}

const runProcess = async (command) => {
    return new Promise((resolve, _reject) => {
        const proc = exec(command, { async:true });
        proc.stdout.on('data', function (data) {
            console.log(data.toString());
        });
        
        proc.stderr.on('data', function (data) {
            console.error(data.toString());
        });
        
        proc.on('exit', function (code) {
            console.log('child process exited with code ' + code.toString());
            resolve(code);
        });
    });
}

const getEnvironmentBonafides = async (options, resolveVariable) => {
    let cliStage = await resolveVariable('self:provider.stage');
    cliStage = cliStage || '';
    let result;
    switch (cliStage.toLowerCase()) {
        case 'dev':
        case 'stg':
        case 'tst':
        case 'uat':
        case 'prod':
            result = {
                isEphemeral: false, // is path-to-production
                isProd: cliStage.toLowerCase() === 'prod',
                key: cliStage.toLowerCase(),
            };
            break;
        default:
            result = {
                isEphemeral: true, // is branch
                isProd: false,
                key: 'nonprod'
            }
            break;
    }
    return Promise.resolve(result);
}

const getUsername = () => {
    return safeCamelString(process.env.GITHUB_ACTOR || require('os').userInfo().username).toLowerCase();
}

const getStackName = async (options, resolveVariable) => {
    const environment = await getEnvironmentBonafides(options, resolveVariable);
    let cliStage = await resolveVariable('self:provider.stage');
    const service = await resolveVariable('self:service');
    const username = getUsername();
    const branchName = await getGitBranch(process.env.GITHUB_REF);
    let stackSuffix = branchName.toLowerCase();
    const segments = [service];
    if (environment.isEphemeral) {
        segments.push(username);
        segments.push(stackSuffix);
    } else {
        segments.push(cliStage);
    }

    return segments.join('-').toLowerCase();
}

const getFQDN = async (options, resolveVariable) => {
    const environment = await getEnvironmentBonafides(options, resolveVariable);
    const branchName = await getGitBranch(process.env.GITHUB_REF);
    const domainName = await resolveVariable('self:custom.domain-name');
    const prodCNAME = await resolveVariable('self:custom.prod-CNAME')

    // non-master branch
    if (environment.isEphemeral) {
        return Promise.resolve(`${getUsername()}-${branchName}.${domainName}`.toLowerCase());
    }

    // long-lived non-prod branch
    if (!environment.isProd) {
        return Promise.resolve(`${environment.key}.${domainName}`.toLowerCase());
    }
    
    // prod
    return Promise.resolve(`${prodCNAME}.${domainName}`.toLowerCase());
}

const getEnvironmentKey = async (options, resolveVariable) => {
    const environment = await getEnvironmentBonafides(options, resolveVariable);
    return environment.key;
}



module.exports = {
    getUsername,
    getEnvironmentKey,
    getFQDN,
    getGitBranch,
    getEnvironmentBonafides,
    runProcess,
    getStackName,
}