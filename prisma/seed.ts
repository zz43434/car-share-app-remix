import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const family = await prisma.family.create({
    data: {
      name: "The Smiths",
      members: {
        create: {
          email,
          password: {
            create: {
              hash: hashedPassword,
            },
          },
        },
      },
    }
  });

  await prisma.car.create({
    data: {
      name: "Honda Civic",
      familyId: family.id
    }
  })

  // const user = await prisma.user.upsert({
  //   where: { email: 'rachel@remix.run' },
  //   create: {
      
  //     familyId: family.id
  //   },
  // });

  // await prisma.note.create({
  //   data: {
  //     title: "My first note",
  //     body: "Hello, world!",
  //     userId: user.id,
  //   },
  // });

  // await prisma.note.create({
  //   data: {
  //     title: "My second note",
  //     body: "Hello, world!",
  //     userId: user.id,
  //   },
  // });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
