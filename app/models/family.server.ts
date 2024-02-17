import type { Car, Family } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Family } from "@prisma/client";

export async function getFamilyById(id: string) {
  return prisma.family.findUnique({ where: { id: id } });
}

export async function getFamilyByName(id: Family["name"]) {
  return prisma.family.findUnique({ where: { id } });
}

export async function getCarsByFamily(name: Car["name"]) {
  return prisma.car.findMany({ where: { name } });
}

// export async function createCar(name: Car["name"], familyId: Family["id"]) {
//   return prisma.car.create({
//     data: {
//       name,
//       familyId,
//     },
//   });
// }

// export async function deleteCarById(id: Car["id"]) {
//   return prisma.car.delete({ where: { id } });
// }

