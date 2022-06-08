import * as AWS from 'aws-sdk';
// const { sendResponse, validateInput } = require("../functions");
import { Response } from '../api/models';

export class AuthService {

  constructor (
    private event: any,
    private cognito = new AWS.CognitoIdentityServiceProvider()
  ) { }

  async getRegisterResponse (): Promise<Response> {
    if (!this.event.queryStringParameters?.message) {
      return Response.GetDefault(406);
    }

    const { email, password } = this.event.body;
    const userPoolName = process.env.USER_POOL_NAME

    const params = {
      UserPoolId: userPoolName,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' } // sets flag indicating user has verified email address
      ],
      MessageAction: 'SUPPRESS' // prevents sending user an email to verify their email address
    };

    let registerUserResponse, registerUserPasswordResponse;
    try {
      console.log('REGISTER USER PARAMS: ', params);
      registerUserResponse = await this.cognito.adminCreateUser(params).promise();
    } catch(createUserErr) {
      console.error('ERROR REGISTERING USER: ', createUserErr);
      return new Response(500, { success: false }).asPromise();
    }

    console.log('REGISTER USER RESPONSE: ', registerUserResponse);

    const passwordParams = {
      Password: password,
      UserPoolId: userPoolName,
      Username: email,
      Permanent: true
    };
    try {
      console.log('REGISTER USER PASSWORD PARAMS: ', passwordParams)
      registerUserPasswordResponse = await this.cognito.adminSetUserPassword(passwordParams).promise()
    } catch (createPasswordErr) {
      console.error('ERROR REGISTERING USER PASSWORD: ', createPasswordErr);
      return new Response(500, { success: false }).asPromise();
    }

    console.log('REGISTER USER SUCCESSFUL', registerUserResponse, registerUserPasswordResponse);

    return new Response(200, { success: true }).asPromise();
  }

  async getLoginResponse (): Promise<Response> {
    const { email, password } = this.event.body;
    const userPoolName = process.env.USER_POOL_NAME;
    const clientId = process.env.USER_POOL_CLIENT_NAME;
    
    const params = {
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      UserPoolId: userPoolName,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };

    let loginResponse;
    try {
      console.log('LOGIN USER PARAMS: ', params);
      loginResponse = await this.cognito.adminInitiateAuth(params).promise();
    } catch (loginErr) {
      console.error('ERROR LOGGING USER IN: ', loginErr);
      return new Response(401, { success: false }).asPromise();
    }

    console.log('LOGIN USER SUCCESS: ', loginResponse);

    return new Response(200, {
      success: true,
      token: loginResponse.AuthenticationResult.IdToken
    }).asPromise();
  }

}
