const helpers = require('./config-helpers');

const getWebEnvVars = (o) => {
    return `
        REACT_APP_API_ROOT=${o.apiPrefix} \
        REACT_APP_STAGE=${o.appStage} \
        REACT_APP_PUBLIC_URL=${o.publicUrl} \
        PUBLIC_URL=${o.publicUrl}
    `.trim();
}

const getCypressEnvVars = (o) => {
    return `
        CYPRESS_API_PREFIX=${o.apiPrefix} \
        CYPRESS_STAGE=${o.appStage} \
        CYPRESS_PUBLIC_URL=${o.publicUrl} \
        PUBLIC_URL=${o.publicUrl}
    `.trim();
}

const runActions = {
    web: async (argv) => {
        const gitBranch = await helpers.getGitBranch(process.env.GITHUB_REF);
        const publicUrl = `/${gitBranch}`;
        const apiPrefix = `${publicUrl}/api`;
        const appStage = 'nonprod';

        const startResultCode = await helpers.runProcess(`
            ${getWebEnvVars({ apiPrefix, appStage, publicUrl })} react-scripts start
        `.trim());
        
        if (startResultCode) {
            process.exit(startResultCode);
        }
    },
    api: async (argv) => {
        process.env.BROWSER = 'none';
        process.env.FAST_REFRESH = 'false';
        process.env.SLS_DEBUG='*';
        const port = argv.port || '8080';
        const gitBranch = await helpers.getGitBranch(process.env.GITHUB_REF);
        const runOfflineCode = await helpers.runProcess(`sls offline start --printOutput --httpPort ${port} --stage ${gitBranch}`);
        if (runOfflineCode) {
            process.exit(runOfflineCode);
        }
    },
    unit: async (argv) => {
        const gitBranch = await helpers.getGitBranch(process.env.GITHUB_REF);

        const publicUrl = argv.publicUrl || `/${gitBranch}`;
        const apiPrefix = argv.apiPrefix || `${publicUrl}/api`;
        const appStage = argv.stage || 'nonprod';
        const command = argv.command;

        const startResultCode = await helpers.runProcess(`
            ${getWebEnvVars({ apiPrefix, appStage, publicUrl })} ${command}
        `.trim());
        
        if (startResultCode) {
            process.exit(startResultCode);
        }
    },
    cypress: async (argv) => {
        const runOrOpen = argv.l || argv.local ? 'open': 'run --headless';
        const gitBranch = await helpers.getGitBranch(process.env.GITHUB_REF);
        const publicUrl = `http://localhost:8080/${gitBranch}`;
        const apiPrefix = `api`;
        const appStage = 'nonprod';

        const runCypressCode = await helpers.runProcess(`
            ${getCypressEnvVars({ apiPrefix, appStage, publicUrl })} $(npm bin)/cypress ${runOrOpen}
        `.trim());
        if (runCypressCode) {
            process.exit(runCypressCode);
        }
    },
    _: async () => {
        return Promise.resolve(process.error(`You must specify a target for argv[2] (supported options: 'web', 'api')`));
    }
}

/*
 * returns void
 * argv: { publicUrl: string, apiPrefix: string, stage: string }
*/
module.exports.build = async (argv) => {
    
    const gitBranch = await helpers.getGitBranch(process.env.GITHUB_REF);

    const publicUrl = argv.publicUrl || `/${gitBranch}`;
    const apiPrefix = argv.apiPrefix || `${publicUrl}/api`;
    const appStage = argv.stage || 'nonprod';

    const buildResultCode = await helpers.runProcess(`
        ${getWebEnvVars({ apiPrefix, appStage, publicUrl })} react-scripts build
    `.trim());
    
    if (buildResultCode) {
        process.exit(buildResultCode);
    }
}

/* 
 * returns void
 * argv: { stage: string, r|remove?: boolean  }
*/
module.exports.deploy  = async (argv) => { 
    const deployOrRemove = argv.r || argv.remove ? 'remove': 'deploy';

    const gitBranch = await helpers.getGitBranch(process.env.GITHUB_REF);

    const stage = argv.stage || gitBranch;

    const deployResultCode = await helpers.runProcess(`SLS_DEBUG=* sls ${deployOrRemove} --stage ${stage}`);

    if (deployResultCode) {
        process.exit(deployResultCode);
    }
}

/* 
 * returns Promise<any>
 * argv: { target: string }
*/
module.exports.run = async (argv) => { 
    return (runActions[argv.target] || runActions._)(argv);
}
