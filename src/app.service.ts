import { Injectable } from '@nestjs/common';
import { uuid } from 'uuidv4';
import * as AWS from 'aws-sdk';

@Injectable()
export class AppService {
  async fileUploadS3(
    file: string,
    folder: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const s3 = new AWS.S3({
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });

    try {
      const fileName = `file-${uuid()}.pdf`;
      const rawFile = file.replace(/^data:([A-Za-z-+\/]+);base64,(.+)$/, '');

      const fileBuffer = Buffer.from(rawFile, 'base64');

      const params: AWS.S3.PutObjectRequest = {
        Bucket: process.env.S3_BUCKET,
        Key: '',
        Body: fileBuffer,
        ACL: 'public-read',
      };

      if (folder) {
        params.Key = `${folder}/${fileName}`;
      } else {
        params.Key = fileName;
      }

      return new Promise((resolve, reject) => {
        s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
          if (err) {
            reject(err);
            throw new Error(`Error: ${err.message}`);
          }

          resolve(data);
        });
      });
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
}
