

class CFHandler {

    async origin(event, _context, callback) {
        console.log('EVENT', event);
        console.log('CONTEXT', _context);

        const request = event.Records[0].cf.request;
        console.log('REQUEST_URI', request.uri)
        // if url is an api request
        if (~request.uri.indexOf(`/${process.env.API_SEGMENT}/`)){
          request.uri = `/${process.env.STAGE}${request.uri}`;
        }
        callback(null, request);
    }

}

export const {
  origin,
} = new CFHandler();
