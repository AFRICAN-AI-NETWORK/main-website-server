import {
  Controller,
  Delete,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestErrorResponseEntity,
  InternalServerErrorResponseEntity,
} from '../core/core.entity';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload single image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    description: 'The image to be uploaded',
    type: File,
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        public_url: 'https://res.cloudinary.com/.../image.jpeg',
      },
    },
    description: 'Image uploaded successfully',
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorResponseEntity,
    description: 'Image not provided or invalid image provided',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorResponseEntity,
    description: 'Internal server error',
  })
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /image\// })],
        fileIsRequired: true,
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.uploadService.uploadImage(image);
  }

  @Post('images')
  @ApiOperation({
    summary: 'Upload multiple images',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    isArray: true,
    required: true,
    description: 'An array of images to be uploaded',
    type: File,
  })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      example: {
        1: 'https://res.cloudinary.com/.../image.jpeg',
        2: 'https://res.cloudinary.com/.../image.jpeg',
        3: 'https://res.cloudinary.com/.../image.jpeg',
      },
    },
    description: 'Images uploaded successfully',
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorResponseEntity,
    description: 'Images not provided or invalid images provided',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorResponseEntity,
    description: 'Internal server error',
  })
  @UseInterceptors(FilesInterceptor('images'))
  uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /image\// })],
        fileIsRequired: true,
      }),
    )
    images: Array<Express.Multer.File>,
  ) {
    return this.uploadService.uploadImages(images);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a resource by its url' })
  @ApiNoContentResponse({
    description: 'Resource deleted successfully',
  })
  deleteImage(@Query('url') url: string) {
    return this.uploadService.delete(url);
  }
}
