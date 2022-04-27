const minimist = require('minimist');
const runnerHelpers = require('./runner-helpers');

const argv = minimist(process.argv.slice(2));

const commandName = argv._[0];

const commands = {
    migrate: runnerHelpers.migrate,
    domain: runnerHelpers.domain,
    build: runnerHelpers.build,
    run: runnerHelpers.run,
    deploy: runnerHelpers.deploy,
    _: async () => {
        return Promise.resolve(process.error(`Command: ${commandName} not supported`));
    }
}

const runCommand = commands[commandName] || commands._;

runCommand(argv);


