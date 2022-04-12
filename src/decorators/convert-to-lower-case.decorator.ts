export function convertObjectToLowerCase(obj: any) {
  if (!obj || typeof obj !== 'object') {
    return;
  }

  Object.keys(obj).forEach(key => {
    obj[key.toLowerCase()] = obj[key];
  });
}

export function convertToLowerCase(...predicates: ((e:any) => any)[]): any {
  return function (
    _methodClass: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): any {
    const originalMethod: any = descriptor.value;
    const value = function (event: any, context, callback) {
      console.log('CONVERTING EVENT', predicates.map(x => x.toString()).join(', '));
      console.info('EVENT BEFORE LOWERCASE CONVERSION', event);
      predicates.forEach(predicate => {
        convertObjectToLowerCase(predicate(event));
      });
      console.info('EVENT AFTER LOWERCASE CONVERSION', event);
      originalMethod.apply(this, [event, context, callback]);
    };

    Object.assign(descriptor, { value });
  };
}
