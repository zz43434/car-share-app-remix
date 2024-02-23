import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { getBookingByCarId } from "~/models/booking.server";
import { deleteCarById, getCarById } from "~/models/car.server";

import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  invariant(params.noteId, "noteId not found");

  const note = await getCarById(params.noteId);
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }

  const [bookings, car] = await Promise.all([
    getBookingByCarId(params.noteId),
    getCarById(params.noteId)
 ]);

  return json({ bookings, car });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteCarById(params.noteId);

  return redirect("/home/cars");
};

export default function CarId() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.car?.name}</h3>
      <p className="py-6">{data.car?.name}</p>
      <hr className="my-4" />

      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
        <div className="bg-white shadow-md rounded my-6">
            <table className="min-w-max w-full table-auto">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">User</th>
                        <th className="py-3 px-6 text-left">Start Time</th>
                        <th className="py-3 px-6 text-left">End Time</th>
                        <th className="py-3 px-6 text-left">Edit</th>
                        <th className="py-3 px-6 text-left">Delete</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {data.bookings.map((booking) => (
                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={booking.id}>
                      <td className="py-3 px-6 text-left">{booking.user?.email}</td>
                      <td className="py-3 px-6 text-left">{booking.startDate}</td>
                      <td className="py-3 px-6 text-left">{booking.endDate}</td>
                      <td className="py-3 px-6 text-left"><button className="button">Edit</button></td>
                      <td className="py-3 px-6 text-left"><button>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
