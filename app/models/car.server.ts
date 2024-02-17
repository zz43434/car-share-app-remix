import type { Car, Family } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Car } from "@prisma/client";

export async function getCarById(id: string) {
  return prisma.car.findUnique({ where: { id } });
}

export async function getCarsByFamilyId(id: string) {
  return prisma.car.findMany({ where: { familyId: id } });
}

export async function createCar(name: string, familyId: string) {
  console.log("createCar", name, familyId);
  return prisma.car.create({
    data: {
      name,
      familyId,
    },
  });
}

export async function deleteCarById(id: string) {
  return prisma.car.delete({ where: { id } });
}

