import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getBookingByUserId } from "~/models/booking.server";

import { requireFamilyId, requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const familyId = await requireFamilyId(request);
  
  const [bookings] = await Promise.all([
    getBookingByUserId(userId)
 ]);

  return json({ bookings });
}

export default function BookingPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  console.log(data);

  return (
    <div className="flex h-full min-h-screen flex-col">

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Bookings
          </Link>

          <hr />

          {data.bookings.length === 0 ? (
            <p className="p-4">No bookings yet</p>
          ) : (
            <ol>
              {data.bookings.map((booking) => (
                <li key={booking.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={booking.id}
                  >
                    📝{booking.name}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

