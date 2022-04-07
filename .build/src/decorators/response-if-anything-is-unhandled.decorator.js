const handleError = (response, callback, error) => {
    console.error('UNHANDLED ERROR', error);
    callback(null, response);
};
export function responseIfAnythingIsUnhandled(response) {
    return function wrapper(_methodClass, _propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const value = function wrapUnhandled(event, context, callback) {
            try {
                const result = originalMethod.apply(this, [event, context, callback]);
                if (result && result.then) {
                    result.catch((error) => {
                        handleError(response, callback, error);
                    });
                }
            }
            catch (error) {
                handleError(response, callback, error);
            }
        };
        Object.assign(descriptor, { value });
    };
}
//# sourceMappingURL=response-if-anything-is-unhandled.decorator.js.map