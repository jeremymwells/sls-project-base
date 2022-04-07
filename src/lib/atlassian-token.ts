import * as jwt from 'atlassian-jwt';
import { config } from '../config';
import { AppInstance } from "../data";
import { HttpClient } from './http-client';

export const getJiraTokenResponseAsync = async (http: HttpClient, appInstance: AppInstance, atlassianAccountId: string): Promise<any | { accessToken: string }> => {
    const now = new Date().getTime();
    // const authServer = 'oauth-2-authorization-server.services.atlassian.com';
    const authServer = 'auth.atlassian.io'
    const authServerEndpoint = `https://${authServer}`;
    const outboundToken = jwt.encodeSymmetric({
      iss: `urn:atlassian:connect:clientid:${appInstance.oauthClientId}`,
      sub: `urn:atlassian:connect:useraccountid:${atlassianAccountId}`,
      tnt: appInstance.baseUrl,
      aud: authServerEndpoint,
      iat: Math.floor(now/1000),
      exp: Math.floor(now/1000) + 59
    }, appInstance.sharedSecret);

    const body = [
      `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}`,
      `assertion=${outboundToken}`,
      `scope=${config['atlassian-connect'].scopes.join('+')}`
    ].join('&');

    return http.post(`${authServerEndpoint}/oauth2/token`, body, { 
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': body.length,
        Accept: 'application/json',
        Host: authServer,
      } 
    }).then((rawResponse: string) => {
      return Promise.resolve(JSON.parse(rawResponse));
    });
  }