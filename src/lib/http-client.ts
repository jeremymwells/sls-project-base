import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { parse as parsUrl } from 'url';
import * as querystring from 'querystring';

const requestTypes = {
  'https:': httpsRequest,
  'http:': httpRequest,
};

const request = (url, requestOptions, body?) => {
  const urlParts = parsUrl(url, true, true);
  const request = requestTypes[urlParts.protocol];
  if (!request) {
    throw `Protocol ${urlParts.protocol} not supported`;
  }

  return new Promise((resolve, reject) => {
    console.info('HTTP REQUEST BEFORE TRANSFORM: ', url, { ...urlParts, ...requestOptions, ...{ body } });
    const req = request(
      { ...urlParts, ...requestOptions },
      stringResponseParser((resp, err) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp);
        }
      }),
    );

    req.on('abort', error => {
      console.error('REQUEST ABORT ERROR', error);
      reject(error);
    });

    req.on('error', error => {
      console.error('REQUEST ABORT ERROR', error);
      reject(error);
    });

    switch (requestOptions.method) {
      case 'POST':
      case 'PUT': {
        const strBody = typeof body === 'object' ? JSON.stringify(body) : body;
        req.write(strBody);
        break;
      }
    }

    req.end();
  });
};

const stringResponseParser = callback => response => {
  let resp = '';
  let err = '';
  response.on('data', chunk => {
    resp += chunk;
  });

  response.on('error', error => {
    err += error;
  });

  response.on('end', () => {
    if (err || response.statusCode < 200 || response.statusCode > 299) {
      console.error(`HTTP RESPONSE ERROR [${response.statusCode}]`, err);
      callback(undefined, { statusCode: response.statusCode, response: resp });
    } else {
      console.info(`HTTP RESPONSE [${response.statusCode}]`, resp);
      callback(resp, err);
    }
  });
};

export class HttpClient {

  constructor(private defaultHttpClientOptions = {}) { }

  get<T>(url, options = {}) {
    return request(url, { ...this.defaultHttpClientOptions, ...options, method: 'GET' }) as Promise<T>;
  }

  post(url, body, options = {}) {
    return request(url, { ...this.defaultHttpClientOptions, ...options, method: 'POST' }, body);
  }

  put(url, body, options = {}) {
    return request(url, { ...this.defaultHttpClientOptions, ...options, method: 'PUT' }, body);
  }

  request(method: string, url: string, options = {}, body = '') {
    return request(
      url,
      { ...this.defaultHttpClientOptions, ...options, method: method.toUpperCase() },
      body,
    );
  }

  stringifyQuery(query) {
    if (!Object.keys(query || {}).length) {
      return '';
    }
    return `?${querystring.stringify(query)}`;

  }

}
