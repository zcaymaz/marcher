type Localized = {
    tr: string;
    en: string;
    fr: string;
};
export type MenuSeedItem = {
    slug: string;
    category: 'coffee' | 'croissant' | 'pastry' | 'food' | 'cold';
    name: Localized;
    description: Localized;
    details?: Localized;
    price: number;
    allergens?: string[];
    isFeatured?: boolean;
    sortOrder: number;
};
export declare const menuItems: MenuSeedItem[];
export {};
