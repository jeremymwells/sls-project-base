
const helpers = require('./config-helpers');

const build = async () => {
    const gitBranch = await helpers.getGitBranch();

    const publicUrl = process.argv[2] || `/${gitBranch}`;
    const apiPrefix = process.argv[3] || `${publicUrl}/api`;
    const appStage = process.argv[4] || 'nonprod';

    return helpers.runProcess(`
        REACT_APP_API_ROOT=${apiPrefix} \
        REACT_APP_STAGE=${appStage} \
        REACT_APP_PUBLIC_URL=${publicUrl} \
        PUBLIC_URL=${publicUrl} \
        react-scripts build
    `.trim());
}

build();
