
const helpers = require('./config-helpers');

const deploy = async () => {
    const gitBranch = await helpers.getGitBranch();

    const stage = process.argv[2] || gitBranch;

    return helpers.runProcess(`SLS_DEBUG=* sls deploy --stage ${stage} --force`);
}

deploy();
