// Currently not in use
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage, Bucket } from '@google-cloud/storage';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private storage: Storage;
  private bucket: Bucket;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('GCP_STORAGE_BUCKET');
    this.initializeStorage();
  }

  private initializeStorage(): void {
    try {
      const privateKey = this.configService
        .getOrThrow<string>('GCP_PRIVATE_KEY')
        .replace(/\\n/g, '\n');

      this.storage = new Storage({
        projectId: this.configService.getOrThrow<string>('GCP_PROJECT_ID'),
        credentials: {
          client_email: this.configService.getOrThrow<string>('GCP_CLIENT_EMAIL'),
          private_key: privateKey,
        },
      });

      this.bucket = this.storage.bucket(this.bucketName);
      this.logger.log(`Storage initialized for bucket: ${this.bucketName}`);
    } catch (error) {
      this.logger.error('Storage initialization failed', error);
      throw new InternalServerErrorException('Storage initialization failed');
    }
  }

  async uploadFile(path: string, buffer: Buffer, contentType = 'application/octet-stream'): Promise<string> {
    try {
      const file = this.bucket.file(path);
      await file.save(buffer, { contentType });
      return this.getPublicUrl(path);
    } catch (error) {
      this.logger.error(`Upload failed for ${path}`, error);
      throw new InternalServerErrorException('File upload failed');
    }
  }

  async downloadFile(path: string): Promise<Buffer> {
    try {
      const [buffer] = await this.bucket.file(path).download();
      return buffer;
    } catch (error) {
      if (error.code === 404) {
        throw new InternalServerErrorException('File not found');
      }
      this.logger.error(`Download failed for ${path}`, error);
      throw new InternalServerErrorException('File download failed');
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await this.bucket.file(path).delete();
    } catch (error) {
      if (error.code !== 404) {
        this.logger.error(`Delete failed for ${path}`, error);
        throw new InternalServerErrorException('File deletion failed');
      }
    }
  }

  getPublicUrl(path: string): string {
    return `https://storage.googleapis.com/${this.bucketName}/${path}`;
  }
}