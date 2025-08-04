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
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const storage_1 = require("@google-cloud/storage");
let StorageService = StorageService_1 = class StorageService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(StorageService_1.name);
        this.bucketName = this.configService.getOrThrow('GCP_STORAGE_BUCKET');
        this.initializeStorage();
    }
    initializeStorage() {
        try {
            const privateKey = this.configService
                .getOrThrow('GCP_PRIVATE_KEY')
                .replace(/\\n/g, '\n');
            this.storage = new storage_1.Storage({
                projectId: this.configService.getOrThrow('GCP_PROJECT_ID'),
                credentials: {
                    client_email: this.configService.getOrThrow('GCP_CLIENT_EMAIL'),
                    private_key: privateKey,
                },
            });
            this.bucket = this.storage.bucket(this.bucketName);
            this.logger.log(`Storage initialized for bucket: ${this.bucketName}`);
        }
        catch (error) {
            this.logger.error('Storage initialization failed', error);
            throw new common_1.InternalServerErrorException('Storage initialization failed');
        }
    }
    async uploadFile(path, buffer, contentType = 'application/octet-stream') {
        try {
            const file = this.bucket.file(path);
            await file.save(buffer, { contentType });
            return this.getPublicUrl(path);
        }
        catch (error) {
            this.logger.error(`Upload failed for ${path}`, error);
            throw new common_1.InternalServerErrorException('File upload failed');
        }
    }
    async downloadFile(path) {
        try {
            const [buffer] = await this.bucket.file(path).download();
            return buffer;
        }
        catch (error) {
            if (error.code === 404) {
                throw new common_1.InternalServerErrorException('File not found');
            }
            this.logger.error(`Download failed for ${path}`, error);
            throw new common_1.InternalServerErrorException('File download failed');
        }
    }
    async deleteFile(path) {
        try {
            await this.bucket.file(path).delete();
        }
        catch (error) {
            if (error.code !== 404) {
                this.logger.error(`Delete failed for ${path}`, error);
                throw new common_1.InternalServerErrorException('File deletion failed');
            }
        }
    }
    getPublicUrl(path) {
        return `https://storage.googleapis.com/${this.bucketName}/${path}`;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map