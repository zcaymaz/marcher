import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

const MAX_UPLOAD_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = diskStorage({
  destination: './uploads',
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${extname(file.originalname)}`);
  },
});

const imageFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
    cb(new Error('Only image files allowed'), false);
    return;
  }
  cb(null, true);
};

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('image', { storage, fileFilter: imageFilter, limits: { fileSize: MAX_UPLOAD_FILE_SIZE } }),
  )
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('images', 10, { storage, fileFilter: imageFilter, limits: { fileSize: MAX_UPLOAD_FILE_SIZE } }),
  )
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    return { urls: files.map((f) => `/uploads/${f.filename}`) };
  }
}
