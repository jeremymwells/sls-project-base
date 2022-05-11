# A Serverless Project Base

## Getting Started

1. ### Update package.json

    *** *values will automatically populate serverless IaC configurations* ***
  

    - change `name` to your application
      - make note of this for use in your .aws/config and .aws/credentials profiles
    - change `domain > name` to your domain name (eg. animus-bi.com)
    - change `domain > cert-arn` to the arn for your domain certificate; cert should be a wildcard cert (eg. *.animus-bi.com)

    - **Optional property changes**:
      - `api` - determines the path the web client access api gateway through
      - `prod-cname` - determines the cname for production releases (ie. the `www` in www.yourdomain.com)

2. ### AWS Web Console

    - Obtain a domain via Route53
    - Create a certificate for your domain (eg. *.my-domain.com)
        - make note of the the certificate ARN for use in `serverless.yml`

3. ### Create aws profiles for local deployment

    - This base app will support 3 primary environments:
        1. `nonprod` // every non `master` branch
        2. `dev`
        3. `prod`
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

        [myapp-prd]
        aws_access_key_id={access key here}
        aws_secret_access_key={secret access key here}
        ```
    - If you wish to change the convention by which profiles are read, change the value of `serverless.yml > provider > profile`

4. ### Configuring deployments in GH Actions

    - Create an Environment in GH for each of the environments mentioned above (`nonprod`, `dev`, `prod`)
        - See [here](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) for more insight about creating gh environments
    
    - In each environment, you will need to create secrets for `AWS_CONFIG` and `AWS_CREDENTIALS`, which are the config and credentials profiles base64 encoded
        - To create those variables, create `config.tmp` and `credentials.tmp` with ONE environment profile in each (if you create these files in the project root, git will ignore them)
            - `config.tmp`
            ```
            [profile myapp-dev]
            output=json
            region=us-east-1
            ```
            - `credentials.tmp`
            ```
            [myapp-dev]
            aws_access_key_id={access key here}
            aws_secret_access_key={secret access key here}
            ```

            - Did you notice the `-dev` suffix on the profile names? 
              - That's because these config/crentials are for a `dev` environment configuration. 
              - It's important that these line up (eg. a `dev` github environment contains a `{your profile name here}-dev` aws profile)
        - Then for each file, run `base64 ./path/to/file`
          - The output for each will become your `AWS_CONFIG` and `AWS_CREDENTIALS` environment secrets (respectively)
            - Examples: 
            - running `base64 config.tmp`
                - should produce something like this: `W3Byb2ZpbGUgbXlhcHAtZGV2XQpvdXRwdXQ9anNvbgpyZWdpb249dXMtZWFzdC0x`
            - running `base64 credentials.tmp`
                - should produce something like this: `W215YXBwLWRldl0KYXdzX2FjY2Vzc19rZXlfaWQ9e2FjY2VzcyBrZXkgaGVyZX0KYXdzX3NlY3JldF9hY2Nlc3Nfa2V5PXtzZWNyZXQgYWNjZXNzIGtleSBoZXJlfQ==`

            - !!! Be sure you are not copying any extra whitespace into your environment secret. 
              - Doing so may prevent access to environments, which would hinder the ability to deploy.
        - Rinse and repeat these steps to create environment and secrets for each environment you wish to support
          - the `config.tmp` and `credentials.tmp` files only serve to produce the base64 encoded output; when you're done, they may be deleted. You may also keep them, as git will ignore them. Up to you.

5. ### Path to prod
   1. **Branch environments**
      - pushing to any branch (not `master`) will create an environment for the branch if it passes all the [quality gates](./docs/cicd.md)
        - these short-lived environments get cleaned up when the branch is deleted (presumably after being merged to an integration branch like `master`)
        - *Protip*: don't let branches and environments linger; it's bad practice and the aws resources will eat $
   2. **Deploying to Dev**
      - pushing any new commit to `master` will deploy changes to `dev.{your-domain.com|net|biz|whatever}` if all [quality gates](./docs/cicd.md) are passed
   3. **Deploying to Prod**
       - make sure `package.json` version and `src/web/package.json` version are the same, and the version adheres to [npm semver rules](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#version)
        - from your master branch, create a tag that matches the `package.json` and `src/web/package.json` version (you may prefix with `v` - eg `v.1.1.1`)
        - push tag to origin
        - (ideally, a PR is what determines commits on `master`)
        - #### Deployment ***will fail*** if:
          - `package.json` version and `src/web/package.json` version do not match and they do not match tag semver
          - the inbound tag must be valid semver (a `v` prefix is allowed and preferred)
          - the commit hash for the tag is not in `master` commit history
          - [quality gates](./docs/cicd.md) do not pass
        
   4. **Reverting Prod**
      - Warning - this is slightly anacronyistic 
      - Create a new tag from any previous tag with a `-revert-` suffix
        - The commit that you tag does not actually matter at all; it's used to trigger reversion, then deleted
        - The original tag must be valid semver with and cannot contain the `-revert-` reversion token
          - The tag without the `-revert-` reversion token will get checked out
            - It must match the versions in `package.json` and `src/web/package.json`
      - Quality gates are omitted/not run
        - The presumption is that they were run and passed with the original prod deployment and this is truly a reversion
          - This might could change 😬
      - The prod code from the commit/tag recreates and deploys to production environment

6. ### Data Migrations
     - This project uses a library called [mograte](https://www.npmjs.com/package/mograte) for DynamoDB migrations
       - There is an example in `src/db/migrations/1651600563981_customers.ts`
         - You may notice this migration imports utility ts files and seed json. `mograte` is a nice little utility.
     - running `npm run migrations` to interact with the `mograte` package will set up an environment variable for you: `DDB_TABLE_PREFIX`
       - You should use this env var to prefix table names so that there aren't collisions, as seen in the example provided
     - Github actions will capture the number of new migrations it will run, migrate those up, and if anything fails, it will migrate those back down. 
        
7. ### TODOs
    - add multi-browser testing strategy to client integration tests
    - automate release notes generation with production releases
    - add separate suites of integration tests to client and api for long-lived path-to-prod environments
        - these tests should smoke test actual environment integrations, not local configurations/infrastructure
    - potentially add manual deploy jobs and reviewers to allow non-tech people to deploy versions
    - Reversion might be better if the original artifacts were retained
        - TODO: examine configuration interface versioning to ensure any relevant configuration is also reverted (perhaps SSM version pairing with a gh repo/commits)
    - NICE TO HAVES:
        - accessibility testing in actions
        - i18n in client (and testing for it)
        - an responsive layout convention established in client
