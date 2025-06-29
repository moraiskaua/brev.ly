import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import * as path from 'path';
import { Link } from '../database/schema';

export class CsvService {
  private r2Client: S3Client;

  constructor() {
    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
    });
  }

  async generateAndUploadCsv(links: Link[]): Promise<string> {
    const { nanoid } = await import('nanoid');
    const fileName = `links-${nanoid(10)}.csv`;
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const filePath = path.join(tempDir, fileName);
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'originalUrl', title: 'URL Original' },
        { id: 'shortUrl', title: 'URL Encurtada' },
        { id: 'accessCount', title: 'Contagem de Acessos' },
        { id: 'createdAt', title: 'Data de Criação' },
      ],
    });
    const csvData = links.map((link) => ({
      originalUrl: link.originalUrl,
      shortUrl: `${process.env.CLOUDFLARE_PUBLIC_URL}/${link.shortUrl}`,
      accessCount: link.accessCount,
      createdAt: link.createdAt.toISOString(),
    }));
    await csvWriter.writeRecords(csvData);
    const fileStream = fs.createReadStream(filePath);
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET!,
      Key: fileName,
      Body: fileStream,
      ContentType: 'text/csv',
    });
    await this.r2Client.send(uploadCommand);
    fs.unlinkSync(filePath);
    return `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`;
  }
}
