import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findUnique({
    where: { email: 'seller@3d-stock.local' },
    include: { sellerAccount: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        externalId: 'clerk_seed_seller_1',
        email: 'seller@3d-stock.local',
        firstName: 'Seed',
        lastName: 'Seller',
        role: 'SELLER',
        sellerAccount: {
          create: {
            onboarded: true,
            defaultPayoutCurrency: 'EUR',
          },
        },
      },
      include: { sellerAccount: true },
    });
  } else if (!user.sellerAccount) {
    await prisma.sellerAccount.create({
      data: {
        userId: user.id,
        onboarded: true,
        defaultPayoutCurrency: 'EUR',
      },
    });
    user = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      include: { sellerAccount: true },
    });
  }

  const sellerId = user.sellerAccount?.id;
  if (!sellerId) {
    throw new Error('Seed: seller account missing');
  }

  const samples = [
    {
      slug: 'minimal-desk-lamp',
      title: 'Minimal Desk Lamp',
      description: 'Clean GLB preview asset for catalog smoke tests.',
      priceCents: 899,
    },
    {
      slug: 'sci-fi-crate-pack',
      title: 'Sci-Fi Crate Pack',
      description: 'Modular crates — placeholder listing for development.',
      priceCents: 1200,
    },
    {
      slug: 'stylized-rock-formation',
      title: 'Stylized Rock Formation',
      description: 'Environment rock set for outdoor scenes.',
      priceCents: 599,
    },
  ];

  for (const row of samples) {
    await prisma.asset.upsert({
      where: { slug: row.slug },
      create: {
        sellerId,
        slug: row.slug,
        title: row.title,
        description: row.description,
        priceCents: row.priceCents,
        currency: 'EUR',
        status: 'PUBLISHED',
        previewReady: true,
      },
      update: {
        title: row.title,
        description: row.description,
        priceCents: row.priceCents,
        status: 'PUBLISHED',
        previewReady: true,
      },
    });
  }

  console.log('Seed completed: seller + published assets');
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
