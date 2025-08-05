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
exports.OcrController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const google_vision_service_1 = require("./google-vision.service");
const aadhaar_parser_util_1 = require("../../utils/aadhaar-parser.util");
const pan_parser_util_1 = require("../../utils/pan-parser.util");
let OcrController = class OcrController {
    visionService;
    constructor(visionService) {
        this.visionService = visionService;
    }
    async extractBothSides(files) {
        const { aadhaarFront, aadhaarBack, pan } = files;
        const aadhaarResult = {
            name: '',
            gender: '',
            dob: '',
            aadhaarNumber: '',
            address: '',
        };
        let panData = null;
        if (aadhaarFront?.[0]) {
            const frontText = await this.visionService.extractTextFromImage(aadhaarFront[0].buffer);
            const parsedFront = (0, aadhaar_parser_util_1.parseAadhaarFront)(frontText);
            Object.assign(aadhaarResult, parsedFront);
        }
        if (aadhaarBack?.[0]) {
            const backText = await this.visionService.extractTextFromImage(aadhaarBack[0].buffer);
            aadhaarResult.address = (0, aadhaar_parser_util_1.parseAadhaarBack)(backText);
        }
        if (pan?.[0]) {
            const panText = await this.visionService.extractTextFromImage(pan[0].buffer);
            panData = (0, pan_parser_util_1.parsePanText)(panText);
        }
        return {
            aadhaarData: aadhaarResult,
            panData: panData,
        };
    }
};
exports.OcrController = OcrController;
__decorate([
    (0, common_1.Post)('extract'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'aadhaarFront', maxCount: 1 },
        { name: 'aadhaarBack', maxCount: 1 },
        { name: 'pan', maxCount: 1 },
    ])),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OcrController.prototype, "extractBothSides", null);
exports.OcrController = OcrController = __decorate([
    (0, common_1.Controller)('ocr'),
    __metadata("design:paramtypes", [google_vision_service_1.GoogleVisionService])
], OcrController);
//# sourceMappingURL=ocr.controller.js.map