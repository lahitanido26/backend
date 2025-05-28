import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FolderBucketType } from '../../helpers/helper';

@Injectable()
export class GatewayStorageBucketRepository {
    // private readonly bucketName = process.env.STORAGE_BUCKET_NAME;
    // private readonly storage = new Storage({
    //     credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
    // });

    // async createFolderIfNotExists(folder: FolderBucketType): Promise<void> {
    //     // const bucket = this.storage.bucket(this.bucketName);
    //     const folderExists = await this.checkFolderExists(bucket, folder);
    //     if (!folderExists) {
    //         await bucket.file(`${folder}/.keep`).save('');
    //     }
    // }

    // private async checkFolderExists(bucket: any, folder: FolderBucketType): Promise<boolean> {
    //     const [files] = await bucket.getFiles({ prefix: `${folder}/`, maxResults: 1 });
    //     return files.length > 0;
    // }

    // async uploadFile(file: Express.Multer.File, fileName: string, folder: FolderBucketType): Promise<string> {
    //     await this.createFolderIfNotExists(folder);

    //     const bucket = this.storage.bucket(this.bucketName);
    //     const fileBuffer = Buffer.from(file.buffer);
    //     const remoteFileName = folder ? `${folder}/${fileName}` : fileName;

    //     await bucket.file(remoteFileName).save(fileBuffer, {
    //         gzip: true,
    //         metadata: {
    //             cacheControl: 'public, max-age=31536000',
    //         },
    //         public: true,
    //     });

    //     const publicUrl = bucket.file(remoteFileName).publicUrl();
    //     return publicUrl;
    // }


    // // async deleteFile(remoteFileName: string): Promise<void> {
    // //     const bucket = this.storage.bucket(this.bucketName);
    // //     await bucket.file(remoteFileName).delete();
    // // }

    // // async getSignedUrl(remoteFileName: string): Promise<string> {
    // //     const bucket = this.storage.bucket(this.bucketName);
    // //     const file = bucket.file(remoteFileName);
    // //     const [url] = await file.getSignedUrl({
    // //         action: 'read',
    // //         expires: Date.now() + 1000 * 60 * 60, // 1 hour
    // //     });
    // //     return url;
    // // }
}