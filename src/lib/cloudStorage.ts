// Cloud Storage конфигурация для продакшена

export interface CloudStorageConfig {
  provider: 'cloudinary' | 'local';
  bucket?: string;
  region?: string;
  apiKey?: string;
  apiSecret?: string;
}

// Конфигурация для разных провайдеров
export const cloudStorageConfig: CloudStorageConfig = {
  provider: process.env.CLOUD_STORAGE_PROVIDER as any || 'local',
  bucket: process.env.CLOUD_STORAGE_BUCKET,
  region: process.env.CLOUD_STORAGE_REGION,
  apiKey: process.env.CLOUD_STORAGE_API_KEY,
  apiSecret: process.env.CLOUD_STORAGE_API_SECRET,
};

// Абстрактный интерфейс для загрузки файлов
export interface FileUploadResult {
  url: string;
  publicId?: string;
  fileName: string;
}

export interface CloudStorageProvider {
  uploadFile(
    file: Buffer, 
    fileName: string, 
    folder: string,
    mimeType: string
  ): Promise<FileUploadResult>;
  
  deleteFile(publicId: string): Promise<boolean>;
}

// Локальное хранение (для разработки)
export class LocalStorageProvider implements CloudStorageProvider {
  async uploadFile(
    file: Buffer, 
    fileName: string, 
    folder: string,
    mimeType: string
  ): Promise<FileUploadResult> {
    const path = require('path');
    const fs = require('fs').promises;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    const filePath = path.join(uploadDir, fileName);
    
    // Создаем папку если не существует
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Сохраняем файл
    await fs.writeFile(filePath, file);
    
    return {
      url: `/uploads/${folder}/${fileName}`,
      fileName
    };
  }
  
  async deleteFile(publicId: string): Promise<boolean> {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      // publicId в локальном хранилище - это путь к файлу
      const filePath = path.join(process.cwd(), 'public', publicId);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

// Cloudinary провайдер (рекомендуется)
export class CloudinaryProvider implements CloudStorageProvider {
  private cloudinary: any;
  
  constructor() {
    // Ленивая загрузка модуля
  }
  
  private async loadCloudinaryModule() {
    if (!this.cloudinary) {
      try {
        const cloudinary = (await import('cloudinary')).v2;
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        this.cloudinary = cloudinary;
      } catch (error) {
        throw new Error('cloudinary package not found. Please install it with: npm install cloudinary');
      }
    }
    return this.cloudinary;
  }
  
  async uploadFile(
    file: Buffer, 
    fileName: string, 
    folder: string,
    mimeType: string
  ): Promise<FileUploadResult> {
    const cloudinary = await this.loadCloudinaryModule();
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `granit-memory/${folder}`,
          public_id: fileName.replace(/\.[^/.]+$/, ""), // убираем расширение
          resource_type: 'auto',
        },
        (error: any, result: any) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              fileName
            });
          }
        }
      );
      
      uploadStream.end(file);
    });
  }
  
  async deleteFile(publicId: string): Promise<boolean> {
    try {
      const cloudinary = await this.loadCloudinaryModule();
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch {
      return false;
    }
  }
}


// Фабрика провайдеров
export function createStorageProvider(): CloudStorageProvider {
  switch (cloudStorageConfig.provider) {
    case 'cloudinary':
      return new CloudinaryProvider();
    case 'local':
    default:
      return new LocalStorageProvider();
  }
}
