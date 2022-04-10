const helpers = require('./config-helpers');


module.exports = async ({ options, resolveVariable }) => {
    const fqdn = await helpers.getFQDN(options, resolveVariable);
    const env = await helpers.getEnvironmentBonafides(options, resolveVariable);
    const stackName = await helpers.getStackName(options, resolveVariable);
    const username = helpers.getUsername();

    return {
        timestamp: new Date().getTime(),
        username,
        stackName,
        env,
        fqdn
    }
  }