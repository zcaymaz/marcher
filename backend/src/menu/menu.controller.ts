import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { MenuService } from './menu.service';
import { MenuExcelService } from './menu-excel.service';
import { CreateMenuItemDto } from '../common/dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

const EXCEL_MIME_TYPES = new Set([
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/octet-stream',
]);

@Controller('menu')
export class MenuController {
  constructor(
    private menuService: MenuService,
    private menuExcelService: MenuExcelService,
  ) {}

  @Get()
  findAll(@Query('available') available?: string) {
    return this.menuService.findAll(available === 'true');
  }

  @Get('export/excel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.menuExcelService.exportToBuffer();
    const filename = `marcher-menu-${new Date().toISOString().slice(0, 10)}.xlsx`;

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }

  @Post('import/excel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async importExcel(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Excel dosyası gerekli.');
    }

    const isExcel =
      /\.xlsx$/i.test(file.originalname) ||
      EXCEL_MIME_TYPES.has(file.mimetype);

    if (!isExcel) {
      throw new BadRequestException('Yalnızca .xlsx dosyaları desteklenir.');
    }

    return this.menuExcelService.importFromBuffer(file.buffer);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.menuService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuService.create(dto);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('slug') slug: string, @Body() dto: Partial<CreateMenuItemDto>) {
    return this.menuService.update(slug, dto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('slug') slug: string) {
    return this.menuService.remove(slug);
  }
}
