"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const fs_1 = require("fs");
const path_1 = require("path");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma_factory_1 = require("../src/prisma/prisma.factory");
const menu_data_1 = require("./menu-data");
const envCandidates = [
    (0, path_1.resolve)(__dirname, '../../../.env'),
    (0, path_1.resolve)(__dirname, '../../.env'),
];
const envPath = envCandidates.find((p) => (0, fs_1.existsSync)(p)) ?? envCandidates[1];
(0, dotenv_1.config)({ path: envPath });
const prisma = (0, prisma_factory_1.createPrismaClient)();
async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@marchercoffee.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Marcher2026!';
    const adminName = process.env.ADMIN_NAME || 'Marcher Admin';
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            name: adminName,
            email: adminEmail,
            password: hashed,
            isAdmin: true,
        },
    });
    await prisma.siteSettings.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            whatsappNumber: '905339170698',
            phone: '+33 1 00 00 00 00',
            email: 'paris@marchercoffee.com',
            address: {
                tr: 'Marcher Coffee Paris, 12 Rue de Rivoli, Paris',
                en: 'Marcher Coffee Paris, 12 Rue de Rivoli, Paris',
                fr: 'Marcher Coffee Paris, 12 Rue de Rivoli, Paris',
            },
            googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991!2d2.3522!3d48.8566',
            addressUrl: 'https://maps.google.com/?q=Marcher+Coffee+Paris',
            socialLinks: {
                instagram: 'https://instagram.com/marchercoffee',
                facebook: 'https://facebook.com/marchercoffee',
            },
        },
    });
    const menuSlugs = menu_data_1.menuItems.map((item) => item.slug);
    await prisma.menuItem.deleteMany({
        where: { slug: { notIn: menuSlugs } },
    });
    for (const item of menu_data_1.menuItems) {
        const { details, allergens, isFeatured, ...rest } = item;
        const shared = {
            ...rest,
            allergens: allergens ?? [],
            isFeatured: isFeatured ?? false,
            images: [],
        };
        await prisma.menuItem.upsert({
            where: { slug: item.slug },
            update: {
                ...shared,
                details: details ?? client_1.Prisma.DbNull,
            },
            create: {
                ...shared,
                ...(details ? { details } : {}),
            },
        });
    }
    const existingCampaign = await prisma.campaign.findFirst({
        where: { placement: 'HOME_HERO' },
    });
    if (!existingCampaign) {
        await prisma.campaign.create({
            data: {
                title: {
                    tr: "Paris'te Yeni Bir Lezzet",
                    en: 'A New Taste in Paris',
                    fr: 'Une Nouvelle Saveur à Paris',
                },
                subtitle: {
                    tr: 'Kruvasan ve kahve tutkusunun buluştuğu adres',
                    en: 'Where croissant and coffee passion meet',
                    fr: 'Là où la passion du croissant et du café se rencontrent',
                },
                ctaText: { tr: 'Menüyü Keşfet', en: 'Explore Menu', fr: 'Découvrir le Menu' },
                ctaLink: '/menu',
                isActive: true,
                placement: 'HOME_HERO',
                sortOrder: 1,
            },
        });
    }
    await prisma.blogPost.upsert({
        where: { slug: 'paris-acilis' },
        update: {},
        create: {
            slug: 'paris-acilis',
            category: 'news',
            title: {
                tr: 'Marcher Coffee Paris Açıldı',
                en: 'Marcher Coffee Paris is Open',
                fr: 'Marcher Coffee Paris est Ouvert',
            },
            excerpt: {
                tr: 'Paris konseptli ilk şubemizle sizlerleyiz.',
                en: 'We are here with our first Paris concept branch.',
                fr: 'Nous sommes là avec notre première succursale au concept parisien.',
            },
            content: {
                tr: '<p>Marcher Coffee Paris, kruvasan ağırlıklı mutfağı ve özel kahve çekirdekleriyle hizmetinizde.</p>',
                en: '<p>Marcher Coffee Paris is at your service with its croissant-focused kitchen and specialty coffee beans.</p>',
                fr: '<p>Marcher Coffee Paris est à votre service avec sa cuisine axée sur les croissants et ses grains de café de spécialité.</p>',
            },
            keywords: ['paris', 'opening', 'coffee'],
        },
    });
    const reviews = [
        {
            authorName: 'Sophie Martin',
            rating: 5,
            text: {
                tr: "Paris'teki en iyi kruvasan! Kahveleri de mükemmel.",
                en: 'The best croissant in Paris! Coffee is amazing too.',
                fr: 'Le meilleur croissant de Paris ! Le café est également excellent.',
            },
            sortOrder: 1,
        },
        {
            authorName: 'Ahmet Yılmaz',
            rating: 5,
            text: {
                tr: 'Atmosfer çok şık, personel çok ilgili.',
                en: 'Very chic atmosphere, staff is very attentive.',
                fr: 'Atmosphère très chic, personnel très attentionné.',
            },
            sortOrder: 2,
        },
    ];
    for (const review of reviews) {
        const existing = await prisma.review.findFirst({
            where: { authorName: review.authorName },
        });
        if (!existing) {
            await prisma.review.create({ data: review });
        }
    }
    await prisma.reference.upsert({
        where: { slug: 'lavazza' },
        update: {},
        create: {
            slug: 'lavazza',
            type: 'BRAND',
            name: { tr: 'Lavazza', en: 'Lavazza', fr: 'Lavazza' },
            description: {
                tr: 'Premium kahve çekirdeği partnerimiz',
                en: 'Our premium coffee bean partner',
                fr: 'Notre partenaire de grains de café premium',
            },
            sortOrder: 1,
        },
    });
    console.log('Seed completed successfully');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map