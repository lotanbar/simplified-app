import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private configService;
    private readonly logger;
    private storage;
    private bucket;
    private bucketName;
    constructor(configService: ConfigService);
    private initializeStorage;
    uploadFile(path: string, buffer: Buffer, contentType?: string): Promise<string>;
    downloadFile(path: string): Promise<Buffer>;
    deleteFile(path: string): Promise<void>;
    getPublicUrl(path: string): string;
}
