import { prisma } from "~/db.server";
export type { Booking } from "@prisma/client";

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({ where: { id } });
}

export async function getBookingByUserId(id: string) {
  return prisma.booking.findMany({ where: { userId: id } });
}

export async function getBookingByCarId(id: string) {
  return prisma.booking.findMany({ where: { carId: id }, include: {car: true, user: true} });
}

export async function getBookingsByFamily(id: string) {
  return prisma.booking.findMany({ where: { familyId: id } });
}

export async function createBooking(name: string, familyId: string, userId: string, carId: string, startDate: Date, endDate: Date) {
  return prisma.booking.create({
    data: {
      name,
      familyId,
      carId,
      userId,
      startDate,
      endDate
    },
  });
}

export async function deleteBookingById(id: string) {
  return prisma.booking.delete({ where: { id } });
}

