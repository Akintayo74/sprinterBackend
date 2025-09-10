import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private uploadDir: string;

  constructor(private config: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads/voicenotes');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  getPublicUrl(filename: string): string {
    // Later swap to S3/Supabase here
    const baseUrl =
      this.config.get<string>('BASE_URL') || 'http://localhost:3000';
    return `${baseUrl}/uploads/voicenotes/${filename}`;
  }

  getUploadPath(): string {
    return this.uploadDir;
  }
}

// Example result from findAll
// [
//   {
//     id: 1,
//     url: 'http://localhost:3000/uploads/voicenotes/1757111206134-367364593.mp3',
//     userId: 2,
//     cardId: 1,
//     createdAt: '2025-09-05T22:26:46.170Z',
//     updatedAt: '2025-09-05T22:26:46.170Z',
//     user: {
//       id: 2,
//       email: 'pammafeng13+gunner@gmail.com',
//       password: '$2b$10$PalRo.dDfWVUPpLZfZL01Oge95YQZVV9t7j9JG2CuOisX8xMZb74K',
//       firstName: 'James',
//       lastName: 'Gunn',
//       isVerified: true,
//       createdAt: '2025-09-04T22:25:15.058Z',
//       updatedAt: '2025-09-04T22:28:58.436Z',
//     },
//   },
//   {
//     id: 3,
//     url: 'http://localhost:3000/uploads/voicenotes/1757111693272-707969920.mp3',
//     userId: 2,
//     cardId: 1,
//     createdAt: '2025-09-05T22:34:53.312Z',
//     updatedAt: '2025-09-05T22:34:53.312Z',
//     user: {
//       id: 2,
//       email: 'pammafeng13+gunner@gmail.com',
//       password: '$2b$10$PalRo.dDfWVUPpLZfZL01Oge95YQZVV9t7j9JG2CuOisX8xMZb74K',
//       firstName: 'James',
//       lastName: 'Gunn',
//       isVerified: true,
//       createdAt: '2025-09-04T22:25:15.058Z',
//       updatedAt: '2025-09-04T22:28:58.436Z',
//     },
//   },
// ];
