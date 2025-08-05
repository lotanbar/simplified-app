"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortLinksController = void 0;
const common_1 = require("@nestjs/common");
const short_links_service_1 = require("./short-links.service");
let ShortLinksController = class ShortLinksController {
    constructor(shortLinksService) {
        this.shortLinksService = shortLinksService;
    }
    async resolve(code, res) {
        const url = await this.shortLinksService.resolve(code);
        return res.redirect(url);
    }
};
exports.ShortLinksController = ShortLinksController;
__decorate([
    (0, common_1.Get)(':code'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShortLinksController.prototype, "resolve", null);
exports.ShortLinksController = ShortLinksController = __decorate([
    (0, common_1.Controller)('r'),
    __metadata("design:paramtypes", [short_links_service_1.ShortLinksService])
], ShortLinksController);
//# sourceMappingURL=short-links.controller.js.map