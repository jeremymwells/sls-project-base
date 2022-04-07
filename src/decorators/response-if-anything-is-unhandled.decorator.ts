type HttpResponse = { statusCode: number, body: string, headers?: any };

const handleError = (response, callback, error) => {
  console.error('UNHANDLED ERROR', error);
  callback(null, response)
}

export function responseIfAnythingIsUnhandled(response: HttpResponse): any {
  return function wrapper(
    _methodClass: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): any {

    const originalMethod: any = descriptor.value;

    const value = function wrapUnhandled(event: any, context, callback) {
      try {

        const result = originalMethod.apply(this, [event, context, callback]);
        if (result && result.then) {
          result.catch((error) => {
            handleError(response, callback, error);
          });
        }

      } catch(error) {
        handleError(response, callback, error);
      }
    };

    Object.assign(descriptor, { value });
  };
}
