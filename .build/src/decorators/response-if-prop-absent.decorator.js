export function responseIfPropAbsent(response, ...predicates) {
    return function wrapper(_methodClass, _propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const value = function wrapResponseIfPropAbsent(event, context, callback) {
            for (let i = 0; i < predicates.length; i++) {
                const prop = predicates[i](event);
                if (prop === undefined) {
                    console.error(`REQUIRED PROPERTY UNDEFINED BUT WHATEVZ`, predicates[i].toString(), event);
                    callback(null, response);
                    return;
                }
            }
            ;
            originalMethod.apply(this, [event, context, callback]);
        };
        Object.assign(descriptor, { value });
    };
}
//# sourceMappingURL=response-if-prop-absent.decorator.js.map