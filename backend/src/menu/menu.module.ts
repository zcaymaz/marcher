import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuExcelService } from './menu-excel.service';
import { MenuController } from './menu.controller';

@Module({
  controllers: [MenuController],
  providers: [MenuService, MenuExcelService],
  exports: [MenuService],
})
export class MenuModule {}
