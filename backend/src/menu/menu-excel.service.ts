import { BadRequestException, Injectable } from '@nestjs/common';
import { MenuItem, Prisma } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import { PrismaService } from '../prisma/prisma.service';
import { generateSlug, getNameForSlug } from '../common/utils/slug.util';
import {
  MENU_CATEGORIES,
  MENU_EXCEL_COLUMNS,
  MenuCategory,
  MenuExcelFieldKey,
  resolveExcelHeader,
} from './menu-excel.constants';

export type MenuImportResult = {
  created: number;
  updated: number;
  failed: number;
  errors: { row: number; message: string }[];
};

type ParsedRow = {
  slug?: string;
  category: string;
  name: { tr: string; en: string; fr: string };
  description: { tr: string; en: string; fr: string };
  details?: { tr: string; en: string; fr: string };
  price: number;
  oldPrice?: number;
  image?: string;
  tags: string[];
  allergens: string[];
  isFeatured: boolean;
  isAvailable: boolean;
  sortOrder: number;
};

@Injectable()
export class MenuExcelService {
  constructor(private prisma: PrismaService) {}

  async exportToBuffer(): Promise<Buffer> {
    const items = await this.prisma.menuItem.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Marcher Coffee';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Menü', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    sheet.columns = MENU_EXCEL_COLUMNS.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.key === 'slug' ? 28 : col.key.includes('description') || col.key.includes('details') ? 36 : 16,
    }));

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF5EFE6' },
    };

    for (const item of items) {
      sheet.addRow(this.itemToRow(item));
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async importFromBuffer(buffer: Buffer): Promise<MenuImportResult> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);

    const sheet = workbook.worksheets[0];
    if (!sheet) {
      throw new BadRequestException('Excel dosyasında sayfa bulunamadı.');
    }

    const headerRow = sheet.getRow(1);
    const columnMap = new Map<number, MenuExcelFieldKey>();

    headerRow.eachCell((cell, colNumber) => {
      const key = resolveExcelHeader(String(cell.value ?? ''));
      if (key) columnMap.set(colNumber, key);
    });

    const requiredKeys: MenuExcelFieldKey[] = [
      'category',
      'name_tr',
      'name_en',
      'name_fr',
      'description_tr',
      'description_en',
      'description_fr',
      'price',
    ];
    const presentKeys = new Set(columnMap.values());
    const missing = requiredKeys.filter((key) => !presentKeys.has(key));
    if (missing.length > 0) {
      throw new BadRequestException(
        `Eksik sütunlar: ${missing.join(', ')}. Lütfen dışa aktarılan şablonu kullanın.`,
      );
    }

    const result: MenuImportResult = {
      created: 0,
      updated: 0,
      failed: 0,
      errors: [],
    };

    for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
      const row = sheet.getRow(rowNumber);
      if (this.isRowEmpty(row, columnMap)) continue;

      try {
        const parsed = this.parseRow(row, columnMap, rowNumber);
        const slug = parsed.slug || generateSlug(getNameForSlug(parsed.name));
        const existing = await this.prisma.menuItem.findUnique({ where: { slug } });

        const data = {
          slug,
          category: parsed.category,
          name: parsed.name,
          description: parsed.description,
          details: parsed.details ?? Prisma.DbNull,
          price: parsed.price,
          oldPrice: parsed.oldPrice ?? null,
          image: parsed.image ?? null,
          tags: parsed.tags,
          allergens: parsed.allergens,
          isFeatured: parsed.isFeatured,
          isAvailable: parsed.isAvailable,
          sortOrder: parsed.sortOrder,
        };

        if (existing) {
          await this.prisma.menuItem.update({
            where: { id: existing.id },
            data,
          });
          result.updated += 1;
        } else {
          await this.prisma.menuItem.create({
            data: {
              ...data,
              images: [],
            },
          });
          result.created += 1;
        }
      } catch (error) {
        result.failed += 1;
        result.errors.push({
          row: rowNumber,
          message: error instanceof Error ? error.message : 'Bilinmeyen hata',
        });
      }
    }

    return result;
  }

  private itemToRow(item: MenuItem): Record<string, string | number | boolean> {
    const name = item.name as { tr: string; en: string; fr: string };
    const description = item.description as { tr: string; en: string; fr: string };
    const details = item.details as { tr: string; en: string; fr: string } | null;

    return {
      slug: item.slug,
      category: item.category,
      name_tr: name.tr,
      name_en: name.en,
      name_fr: name.fr,
      description_tr: description.tr,
      description_en: description.en,
      description_fr: description.fr,
      details_tr: details?.tr ?? '',
      details_en: details?.en ?? '',
      details_fr: details?.fr ?? '',
      price: item.price,
      oldPrice: item.oldPrice ?? '',
      image: item.image ?? '',
      tags: item.tags.join(', '),
      allergens: item.allergens.join(', '),
      isFeatured: item.isFeatured ? 'evet' : 'hayır',
      isAvailable: item.isAvailable ? 'evet' : 'hayır',
      sortOrder: item.sortOrder,
    };
  }

  private isRowEmpty(
    row: ExcelJS.Row,
    columnMap: Map<number, MenuExcelFieldKey>,
  ): boolean {
    for (const [colNumber] of columnMap) {
      const value = this.cellText(row.getCell(colNumber).value);
      if (value) return false;
    }
    return true;
  }

  private parseRow(
    row: ExcelJS.Row,
    columnMap: Map<number, MenuExcelFieldKey>,
    rowNumber: number,
  ): ParsedRow {
    const values: Partial<Record<MenuExcelFieldKey, string>> = {};

    for (const [colNumber, key] of columnMap) {
      values[key] = this.cellText(row.getCell(colNumber).value);
    }

    const category = values.category?.trim().toLowerCase() ?? '';
    if (!MENU_CATEGORIES.includes(category as MenuCategory)) {
      throw new Error(
        `Satır ${rowNumber}: Geçersiz kategori "${values.category}". Geçerli değerler: ${MENU_CATEGORIES.join(', ')}`,
      );
    }

    const name = {
      tr: values.name_tr?.trim() ?? '',
      en: values.name_en?.trim() ?? '',
      fr: values.name_fr?.trim() ?? '',
    };
    const description = {
      tr: values.description_tr?.trim() ?? '',
      en: values.description_en?.trim() ?? '',
      fr: values.description_fr?.trim() ?? '',
    };

    if (!name.tr || !name.en || !name.fr) {
      throw new Error(`Satır ${rowNumber}: Ad alanları (TR/EN/FR) zorunludur.`);
    }
    if (!description.tr || !description.en || !description.fr) {
      throw new Error(`Satır ${rowNumber}: Açıklama alanları (TR/EN/FR) zorunludur.`);
    }

    const price = this.parseNumber(values.price, `Satır ${rowNumber}: Fiyat`);
    if (price <= 0) {
      throw new Error(`Satır ${rowNumber}: Fiyat 0'dan büyük olmalıdır.`);
    }

    let oldPrice: number | undefined;
    if (values.oldPrice?.trim()) {
      oldPrice = this.parseNumber(values.oldPrice, `Satır ${rowNumber}: Eski fiyat`);
      if (oldPrice <= 0) {
        throw new Error(`Satır ${rowNumber}: Eski fiyat 0'dan büyük olmalıdır.`);
      }
    }

    const detailsValues = {
      tr: values.details_tr?.trim() ?? '',
      en: values.details_en?.trim() ?? '',
      fr: values.details_fr?.trim() ?? '',
    };
    const hasDetails = detailsValues.tr || detailsValues.en || detailsValues.fr;

    return {
      slug: values.slug?.trim() || undefined,
      category,
      name,
      description,
      details: hasDetails ? detailsValues : undefined,
      price,
      oldPrice,
      image: values.image?.trim() || undefined,
      tags: this.parseList(values.tags),
      allergens: this.parseList(values.allergens),
      isFeatured: this.parseBool(values.isFeatured),
      isAvailable: values.isAvailable?.trim()
        ? this.parseBool(values.isAvailable)
        : true,
      sortOrder: values.sortOrder?.trim()
        ? Math.round(this.parseNumber(values.sortOrder, `Satır ${rowNumber}: Sıra`))
        : 0,
    };
  }

  private cellText(value: ExcelJS.CellValue): string {
    if (value == null) return '';
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return String(value).trim();
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'object') {
      if ('text' in value && typeof value.text === 'string') {
        return value.text.trim();
      }
      if ('richText' in value && Array.isArray(value.richText)) {
        return value.richText.map((part) => part.text).join('').trim();
      }
      if ('result' in value) {
        return String(value.result ?? '').trim();
      }
    }
    return String(value).trim();
  }

  private parseList(value?: string): string[] {
    if (!value?.trim()) return [];
    return value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }

  private parseBool(value?: string): boolean {
    const normalized = (value ?? '').trim().toLowerCase();
    if (!normalized) return false;
    return ['1', 'true', 'evet', 'yes', 'e', 'aktif'].includes(normalized);
  }

  private parseNumber(value: string | undefined, label: string): number {
    const normalized = (value ?? '').replace(/\s/g, '').replace(',', '.');
    const parsed = Number(normalized);
    if (!normalized || Number.isNaN(parsed)) {
      throw new Error(`${label} geçerli bir sayı olmalıdır.`);
    }
    return parsed;
  }
}
