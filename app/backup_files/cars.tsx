import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getCarsByFamilyId } from "~/models/car.server";
import { getFamilyById } from "~/models/family.server";

import { getUserById } from "~/models/user.server";
import { requireFamilyId, requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const familyId = await requireFamilyId(request);
  
  const [user, family, cars] = await Promise.all([
    getUserById(userId),
    getFamilyById(familyId),
    getCarsByFamilyId(familyId)
 ]);

  return json({ user, family, cars });
}

export default function Cars() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  console.log(data);

  return (
    <div className="">
        <div className="h-80 w-80 border-r bg-gray-50"> 
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Car
          </Link>

          <hr />

          {data.cars.length === 0 ? (
            <p className="p-4">No cars yet</p>
          ) : (
            <div>
              {data.cars.map((car) => (
                  <NavLink
                    key={car.id }
                    className={({ isActive }) =>
                      `w-50 h-50 bg-gray-500 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={car.id}
                  >
                    📝 {car.name}
                  </NavLink>
              ))}
            </div>
          )}
        </div>

        <div className="">
          <Outlet />
         </div>
      {/*</main> */}
    </div>
  );
}
