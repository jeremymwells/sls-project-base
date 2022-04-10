const helpers = require('./config-helpers');

const buildTarget = (process.argv[2] || '_').toLowerCase();

const buildActions = {
    web: async () => {
        const gitBranch = await helpers.getGitBranch();
        const publicUrl = `/${gitBranch}`;
        const apiPrefix = `${publicUrl}/api`;
        const appStage = 'nonprod';

        return helpers.runProcess(`
            REACT_APP_API_ROOT=${apiPrefix} \
            REACT_APP_STAGE=${appStage} \
            REACT_APP_PUBLIC_URL=${publicUrl} \
            PUBLIC_URL=${publicUrl} \
            react-scripts start
        `.trim());
    },
    api: async () => {
        process.env.BROWSER = 'none';
        process.env.FAST_REFRESH = 'false';
        process.env.SLS_DEBUG='*';
        const gitBranch = await helpers.getGitBranch();
        return helpers.runProcess(`sls offline start --printOutput --httpPort 8080 --stage ${gitBranch}`);
    },
    _: async () => {
        return Promise.resolve(process.error(`You must specify a target for argv[2] (supported options: 'web', 'api')`));
    }
}

const run = buildActions[buildTarget] || buildActions._;

run();
