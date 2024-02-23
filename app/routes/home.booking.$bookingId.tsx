import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getBookingById } from "~/models/booking.server";
import { getCarById } from "~/models/car.server";
import { getUserById } from "~/models/user.server";


export const loader = async ({ params }: LoaderFunctionArgs) => {
  const bookingId = params.bookingId;

  if (!bookingId) {
    throw new Response("Not Found", { status: 404 });
  }

  const booking = await getBookingById(bookingId);

  if (!booking) {
    throw new Response("Not Found", { status: 404 });
  }

  const car = await getCarById(booking?.carId);
  const user = await getUserById(booking?.userId);

  
  return json({ booking, car, user });
};

export default function NewBookingPage() {
  const data = useLoaderData<typeof loader>();

  return (
   <div>
    <p>Booking Name: {data.booking?.name}</p>
    <p>Booking Car: {data.car?.name}</p>
    <p>Booking Start: {data.booking?.startDate}</p>
    <p>Booking End: {data.booking?.endDate}</p>
    <p>Booking User: {data.user?.email}</p>
   </div>
  ); 
}
