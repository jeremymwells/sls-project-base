var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { responseIfAnythingIsUnhandled } from '../../decorators/response-if-anything-is-unhandled.decorator';
import { Response } from '../../models';
import { AppService } from '../../services';
class AppHandler {
    async message(event, _context, callback) {
        const response = await new AppService(event).getResponse();
        callback(null, response.send());
    }
}
__decorate([
    responseIfAnythingIsUnhandled(Response.GetDefault(500))
], AppHandler.prototype, "message", null);
export const { message, } = new AppHandler();
//# sourceMappingURL=app.js.map