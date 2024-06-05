import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'fs/promises';
import cloudinary from 'src/lib/cloudinary';
import constants from 'src/utils/constants';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UploadService {
  private readonly redisKeyPrefix = 'UPLOAD';

  constructor(private readonly redisService: RedisService) {}

  async uploadImage(
    image: Express.Multer.File,
  ): Promise<{ public_url: string }> {
    if (!image) throw new BadRequestException('Image is required');

    if (!image.mimetype.includes('image'))
      throw new BadRequestException('Invalid image provided');

    const imagePath = `${Date.now()}_${image.filename}`;

    const uploadResult = await cloudinary.uploader.upload(image.path, {
      folder: constants.IMAGE_UPLOAD_PATH,
      filename_override: imagePath,
    });

    // delete image after upload
    await unlink(image.path).catch((err) => {
      console.log('Unable to delete image after upload', err);
    });

    // save public_url:id pair to redis
    await this.redisService
      .save(
        `${this.redisKeyPrefix}:${uploadResult.secure_url}`,
        uploadResult.public_id,
      )
      .catch((err) => console.error('Unable to save public_id to redis', err));

    return { public_url: uploadResult.secure_url };
  }

  async uploadImages(
    images: Express.Multer.File[],
  ): Promise<{ [index: number]: string }> {
    if (!images) throw new BadRequestException('Images not provided');

    const imagePromises = images.map(async (image) => {
      if (!image.mimetype.includes('image'))
        throw new BadRequestException('Invalid image provided');

      return this.uploadImage(image);
    });

    const results = await Promise.all(imagePromises);
    return results.reduce((acc, result, index) => {
      acc[index] = result.public_url;
      return acc;
    }, {});
  }

  async delete(public_url: string): Promise<any> {
    // fetch image_id from redis
    const public_id = await this.redisService.get(
      `${this.redisKeyPrefix}:${public_url}`,
    );
    if (!public_id) return;

    if (typeof public_id !== 'string')
      throw new BadRequestException('Invalid public id');

    const response = await cloudinary.uploader.destroy(public_id, {
      invalidate: true,
    });
    if (response && response.result === 'not found') {
      throw new NotFoundException('Resource not found');
    }

    // delete public_url:id pair from redis
    await this.redisService.delete(public_id);

    return response;
  }
}
