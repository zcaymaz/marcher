import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSiteSettingsDto } from '../common/dto';
import { toJson } from '../common/utils/json.util';

@Injectable()
export class SiteSettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    let settings = await this.prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });
    if (!settings) {
      settings = await this.prisma.siteSettings.create({
        data: {
          id: 'default',
          whatsappNumber: '905000000000',
          address: {
            tr: 'Marcher Coffee Paris',
            en: 'Marcher Coffee Paris',
            fr: 'Marcher Coffee Paris',
          },
          socialLinks: {
            instagram: 'https://instagram.com/marchercoffee',
          },
        },
      });
    }
    return settings;
  }

  async update(dto: UpdateSiteSettingsDto) {
    await this.get();
    return this.prisma.siteSettings.update({
      where: { id: 'default' },
      data: {
        ...dto,
        address: dto.address ? toJson(dto.address) : undefined,
      },
    });
  }
}
