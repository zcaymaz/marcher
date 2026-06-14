import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReferencesService } from './references.service';
import { CreateReferenceDto } from '../common/dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('references')
export class ReferencesController {
  constructor(private referencesService: ReferencesService) {}

  @Get()
  findAll() {
    return this.referencesService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.referencesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateReferenceDto) {
    return this.referencesService.create(dto);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('slug') slug: string, @Body() dto: Partial<CreateReferenceDto>) {
    return this.referencesService.update(slug, dto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('slug') slug: string) {
    return this.referencesService.remove(slug);
  }
}
