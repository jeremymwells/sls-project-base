
function parseEventHeader(headers, headerName) {
  const normalizedHeaders = Array.isArray(headers || []) ? headers : Object.keys(headers);
  const caseInsensitiveHeaderMatch = (normalizedHeaders || []).filter(x => x.toLowerCase() === headerName.toLowerCase())[0] || '';
  return (headers || {})[caseInsensitiveHeaderMatch] || '';
}

function parseEventBody(eventBody) {
  let body;
  if (typeof eventBody === 'string') {
    try { 
      body = JSON.parse(eventBody);
    } catch (_) {
      body = JSON.parse(Buffer.from(eventBody, 'base64').toString('utf-8'));
    }
  } else {
    body = eventBody;
  }

  return body;
}

export function parseBody(): any {
  return function wrapper(
    _methodClass: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): any {
    const originalMethod: any = descriptor.value;
    const value = function authorizeDescriptor(event: any, context, callback) {

      const [ contentTypeHeader ] = parseEventHeader(event.headers, 'content-type').split(' ');
      console.log('EVENT BEFORE TRANSFORMING BODY', event, contentTypeHeader);
      console.log('CONTENT TYPE', contentTypeHeader);

      switch (contentTypeHeader.toLowerCase()) {
        case 'application/json':
        case 'application/json;':
        case 'text/json':
        case 'text/json;':
        case 'text/plain':
        case 'text/plain;':
          event.body = parseEventBody(event.body || {});
          break;
        default: break;
      }

      console.log('EVENT AFTER TRANSFORMING BODY', event);

      originalMethod.apply(this, [event, context, callback]);
    };

    Object.assign(descriptor, { value });
  };
}
