# a serverless project base

## Getting Started

1. Update package.json

    - change name to your application
    - make note of this for use in your .aws/config and .aws/credentials profiles

1. AWS Web Console

    - Obtain a domain via Route53
    - Create a certificate for your domain (eg. *.my-domain.com)
        - make note of the the certificate ARN for use in `serverless.yml`

1. Create aws profiles

    - This base app will support 6 environments:
        1. `nonprod`
        1. `dev`
        1. `tst`
        1. `stg`
        1. `uat`
        1. `prod`
    - For any aws environments you want to deploy to, you will need to have aws profiles that correspond to those environments. Your profile names should align with the app name from `package.json`, with a simple suffix.
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
