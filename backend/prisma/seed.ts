import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import * as bcrypt from 'bcrypt';
import { createPrismaClient } from '../src/prisma/prisma.factory';

const envCandidates = [
  resolve(__dirname, '../../../.env'), // dist/prisma/seed.js → kök
  resolve(__dirname, '../../.env'),    // prisma/seed.ts → kök
];
const envPath = envCandidates.find((p) => existsSync(p)) ?? envCandidates[1];
config({ path: envPath });

const prisma = createPrismaClient();

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
      googleMapsEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991!2d2.3522!3d48.8566',
      socialLinks: {
        instagram: 'https://instagram.com/marchercoffee',
        facebook: 'https://facebook.com/marchercoffee',
      },
    },
  });

  const menuItems = [
    {
      slug: 'espresso',
      category: 'coffee',
      name: { tr: 'Espresso', en: 'Espresso', fr: 'Espresso' },
      description: {
        tr: 'Yoğun ve dengeli tek shot espresso',
        en: 'Rich and balanced single shot espresso',
        fr: 'Espresso corsé et équilibré',
      },
      details: {
        tr: '100% Arabica çekirdeklerinden hazırlanır.',
        en: 'Prepared from 100% Arabica beans.',
        fr: 'Préparé à partir de grains 100% Arabica.',
      },
      price: 3.5,
      allergens: [] as string[],
      isFeatured: true,
      sortOrder: 1,
    },
    {
      slug: 'latte',
      category: 'coffee',
      name: { tr: 'Latte', en: 'Latte', fr: 'Latte' },
      description: {
        tr: 'Kremsi süt köpüğü ile espresso',
        en: 'Espresso with creamy steamed milk',
        fr: 'Espresso avec lait mousseux crémeux',
      },
      price: 4.8,
      allergens: ['milk'],
      isFeatured: true,
      sortOrder: 2,
    },
    {
      slug: 'croissant-beurre',
      category: 'croissant',
      name: {
        tr: 'Tereyağlı Kruvasan',
        en: 'Butter Croissant',
        fr: 'Croissant au Beurre',
      },
      description: {
        tr: 'Geleneksel Fransız tereyağlı kruvasan',
        en: 'Traditional French butter croissant',
        fr: 'Croissant traditionnel au beurre français',
      },
      price: 3.2,
      allergens: ['gluten', 'milk', 'eggs'],
      isFeatured: true,
      sortOrder: 3,
    },
    {
      slug: 'croissant-amande',
      category: 'croissant',
      name: {
        tr: 'Bademli Kruvasan',
        en: 'Almond Croissant',
        fr: 'Croissant aux Amandes',
      },
      description: {
        tr: 'Badem kreması ve dilim badem ile',
        en: 'Filled with almond cream and sliced almonds',
        fr: "Garni de crème d'amande et amandes effilées",
      },
      price: 4.5,
      allergens: ['gluten', 'milk', 'eggs', 'nuts'],
      sortOrder: 4,
    },
    {
      slug: 'iced-latte',
      category: 'cold',
      name: { tr: 'Soğuk Latte', en: 'Iced Latte', fr: 'Latte Glacé' },
      description: {
        tr: 'Buzlu latte, yaz için ideal',
        en: 'Iced latte, perfect for summer',
        fr: "Latte glacé, parfait pour l'été",
      },
      price: 5.2,
      allergens: ['milk'],
      sortOrder: 5,
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
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
