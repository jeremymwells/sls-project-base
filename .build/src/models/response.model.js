export class Response {
    constructor(statusCode, body) {
        this.statusCode = statusCode;
        if (typeof body === 'object') {
            this.body = JSON.stringify(body);
        }
        else {
            this.body = body.toString();
        }
    }
    asPromise() {
        return Promise.resolve(this);
    }
    send() {
        console.log('SENDING RESPONSE', this);
        return this;
    }
    static GetDefault(statusCode) {
        switch (statusCode) {
            case 200: return new Response(200, 'Ok');
            case 202: return new Response(202, 'Created');
            case 401: return new Response(401, 'Unauthorized');
            case 403: return new Response(403, 'Forbidden');
            case 406: return new Response(406, 'Not Acceptable');
            default: return new Response(500, 'Internal Server Error');
        }
    }
}
//# sourceMappingURL=response.model.js.map