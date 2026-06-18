export const MENU_CATEGORIES = ['coffee', 'croissant', 'pastry', 'food', 'cold'] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

/** Excel sütun tanımları — dışa aktarma başlıkları ve içe aktarma eşlemesi */
export const MENU_EXCEL_COLUMNS = [
  { key: 'slug', header: 'slug' },
  { key: 'category', header: 'kategori' },
  { key: 'name_tr', header: 'ad_tr' },
  { key: 'name_en', header: 'ad_en' },
  { key: 'name_fr', header: 'ad_fr' },
  { key: 'description_tr', header: 'aciklama_tr' },
  { key: 'description_en', header: 'aciklama_en' },
  { key: 'description_fr', header: 'aciklama_fr' },
  { key: 'details_tr', header: 'detay_tr' },
  { key: 'details_en', header: 'detay_en' },
  { key: 'details_fr', header: 'detay_fr' },
  { key: 'price', header: 'fiyat' },
  { key: 'oldPrice', header: 'eski_fiyat' },
  { key: 'image', header: 'gorsel' },
  { key: 'tags', header: 'etiketler' },
  { key: 'allergens', header: 'alerjenler' },
  { key: 'isFeatured', header: 'one_cikan' },
  { key: 'isAvailable', header: 'aktif' },
  { key: 'sortOrder', header: 'sira' },
] as const;

export type MenuExcelFieldKey = (typeof MENU_EXCEL_COLUMNS)[number]['key'];

const HEADER_TO_KEY: Record<string, MenuExcelFieldKey> = Object.fromEntries(
  MENU_EXCEL_COLUMNS.flatMap((col) => [
    [col.header.toLowerCase(), col.key],
    [col.key.toLowerCase(), col.key],
  ]),
) as Record<string, MenuExcelFieldKey>;

export function resolveExcelHeader(header: string): MenuExcelFieldKey | undefined {
  const normalized = header.trim().toLowerCase();
  return HEADER_TO_KEY[normalized];
}
