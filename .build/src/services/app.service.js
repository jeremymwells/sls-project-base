var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Response } from '../models';
import { responseIfPropAbsent } from '../decorators/response-if-prop-absent.decorator';
export class AppService {
    constructor(event) {
        this.event = event;
    }
    getResponse() {
        var _a;
        return new Response(200, (_a = this.event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.message);
    }
}
__decorate([
    responseIfPropAbsent(Response.GetDefault(406), (event) => { var _a; return (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.message; })
], AppService.prototype, "getResponse", null);
//# sourceMappingURL=app.service.js.map