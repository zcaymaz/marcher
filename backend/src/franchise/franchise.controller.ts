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
import { Throttle } from '@nestjs/throttler';
import { FranchiseService } from './franchise.service';
import {
  CreateFranchiseInquiryDto,
  UpdateFranchiseStatusDto,
} from '../common/dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('franchise')
export class FranchiseController {
  constructor(private franchiseService: FranchiseService) {}

  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  create(@Body() dto: CreateFranchiseInquiryDto) {
    return this.franchiseService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.franchiseService.findAll();
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateFranchiseStatusDto,
  ) {
    return this.franchiseService.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.franchiseService.remove(id);
  }
}
