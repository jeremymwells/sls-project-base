import { WebResponse } from "../services/web.response";


class WebHandler {

  
  async render(event, _context, callback) {

    const response = await new WebResponse(event).getAsync();

    callback(null, response);

  }
}

export const { render } = new WebHandler();
