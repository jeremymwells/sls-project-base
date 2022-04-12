# a serverless project base

## Getting Started

1. Update package.json

    - change name to your application
    - make note of this for use in your .aws/config and .aws/credentials profiles

1. AWS Web Console

    - Obtain a domain via Route53
    - Create a certificate for your domain (eg. *.my-domain.com)
        - make note of the the certificate ARN for use in `serverless.yml`

1. Create aws profiles for local deployment

    - This base app will support 5 environments:
        1. `nonprod` // ephemeral branches
        1. `dev`
        1. `tst`
        1. `stg`
        1. `prod`
    - For any aws environments you want to deploy to, you will need to have aws profiles that correspond to 1) your service name (eg. the `serverless.yml > service` value), and 2) your environment target (eg. `dev`, `prod`). Your profile names should align with the app name from `package.json`, with a simple suffix.
        - For example, if you changed your app name to `myapp`, your aws config and credentials files might look like this:
        
        *.aws/config -->*
        ```
        [profile myapp-nonprod]
        output=json
        region=us-east-1

        [profile myapp-dev]
        output=json
        region=us-east-1

        [profile myapp-tst]
        output=json
        region=us-east-1

        [profile myapp-stg]
        output=json
        region=us-east-1

        [profile myapp-prd]
        output=json
        region=us-east-1
        ```

        *.aws/credentials -->*
        ```
        [myapp-nonprod]
        aws_access_key_id={access key here}
        aws_secret_access_key={secret access key here}

        [myapp-dev]
        aws_access_key_id={access key here}
        aws_secret_access_key={secret access key here}

        [myapp-tst]
        aws_access_key_id={access key here}
        aws_secret_access_key={secret access key here}

        [myapp-stg]
        aws_access_key_id={access key here}
        aws_secret_access_key={secret access key here}

        [myapp-prd]
        aws_access_key_id={access key here}
        aws_secret_access_key={secret access key here}
        ```
    - If you wish to change the convention by which profiles are read, change the value of `serverless.yml > provider > profile`
    
1. Update `serverless.yml` 

    - Change domain name in `serverless.yml > custom > domainName` to your Route53 domain name
    - Change certificateArn in `serverless.yml > custom > certificateArn` to your certificate ARN

1. Configuring deployments in GH Actions

    - Create an Environment in GH for each of the environments mentioned above (`nonprod`, `dev`, `tst`, `stg`, `prod`)
        - See [here](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) for help
    
    - In each environment, you will need to create secrets for `AWS_CONFIG` and `AWS_CREDENTIALS`, which are the config and credentials profiles base64 encoded
        - To create those variables, create `config.tmp` and `credentials.tmp` with ONE environment profile in each (if you create these files in the project root, git will ignore them)
            - config.tmp
            ```
            [profile myapp-dev]
            output=json
            region=us-east-1
            ```
            - credentials.tmp
            ```
            [myapp-dev]
            aws_access_key_id={access key here}
            aws_secret_access_key={secret access key here}
            ```
            - NOTES: 
                - notice the `-dev` suffix on the profile names? This is for a `dev` environment configuration. It's important that these line up (eg. a `dev` github environment contains a `*-dev` aws profile)
        - Then for each file, run `base64 ./path/to/file`; the output for each will become your `AWS_CONFIG` and `AWS_CREDENTIALS` environment secrets respectively
            - Examples: 
            - `base64 config.tmp`
                - should produce something like this: `W3Byb2ZpbGUgbXlhcHAtZGV2XQpvdXRwdXQ9anNvbgpyZWdpb249dXMtZWFzdC0x`
            - `base64 credentials.tmp`
                - should produce something like this: `W215YXBwLWRldl0KYXdzX2FjY2Vzc19rZXlfaWQ9e2FjY2VzcyBrZXkgaGVyZX0KYXdzX3NlY3JldF9hY2Nlc3Nfa2V5PXtzZWNyZXQgYWNjZXNzIGtleSBoZXJlfQ==`
            - NOTES:
                - Be sure you are not copying any extra whitespace into your environment secret. Doing so may prevent access to environments, which would hinder the ability to deploy.
        - rinse and repeat these steps to create environment and secrets for each environment you wish to support
            - the `config.tmp` and `credentials.tmp` files only serve to produce the base64 encoded output; when you're done, they may be deleted. You may also keep them, as git will ignore them. Up to you.

1. Path to prod
    - pushing to any branch (not `master`) will create an ephemeral environment
        - these environments are cleaned up when the branch is merged to `master`
        - if a branch does not get merged to master, you should manually clean up resources
    - pushing to `master` will deploy changes to `dev.{your-domain.com|net|biz|whatever}`
    - to deploy to production
        - make sure `package.json` version and `src/web/package.json` version are the same, and the version adheres to [npm semver rules](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#version)
        - from your master branch, create a tag that matches the `package.json` version (you may prefix with `v` - eg `v.1.1.1`)
            - deployment will *not* work if:
                - `package.json` version and `src/web/package.json` version do not match
                - the inbound tag does not match the version in package.json files (`v` prefix is allowed)
                - the tag hash is not in `master` commit history
        - push tag to origin
    - to revert production
        - create tag from previous tag with `-revert-` suffix
    - See [here](./docs/cicd.md) for specifics on cicd workflow
        
2. TODOs
    - add multi-browser testing strategy to client integration tests
    - automate release notes generation with production releases
    - implement path-to-prod behaviors on merge
        - add separate suites of integration tests to client and api for long-lived path-to-prod environments
            - these tests should smoke test actual environment integrations, not local configurations/infrastructure
    - potentially add manual deploy jobs and reviewers to allow non-tech people to deploy versions
    - refactor path to prod so there isn't need for a personal access token
    - NICE TO HAVES:
        - unit test coverage gates
        - accessibility testing in actions
        - i18n in client (and testing for it)
        - an responsive layout convention established in client
