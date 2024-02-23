import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getCarsByFamilyId } from "~/models/car.server";
import { getFamilyById } from "~/models/family.server";

import { getUserById } from "~/models/user.server";
import { requireFamilyId, requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { useParams } from "react-router-dom";
import styled from "styled-components";

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

const Tile = styled.div`
  width: 100%;
  height: 150px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 5px;
`;

export default function Cars() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  console.log(data);

  return (
    <div className="">

        {data.cars.length === 0 ? ( 
          <Tile>
            <Link to="new" className="text-xl text-blue-500">
              + New Car
            </Link>
          </Tile>) : (
          <></>
        )}
          

          <hr />

          {data.cars.length === 0 ? (
            <p className="p-4">No cars yet</p>
          ) : (
            <div className="grid grid-cols-4 gap-4 ">
              {data.cars.map((car) => (
                <div key={car.id}>
                  
                    <NavLink
                      className={({ isActive }) =>
                        `h-full w-full text-xl  ${isActive ? "bg-white" : ""}`
                      }
                      to={car.id}
                    >
                      <Tile>
                        📝 {car.name}
                      </Tile>
                    </NavLink>
                  
                </div>
              ))}
              <Tile className="col-start-1 row-start-1">
                <Link to="new" className="text-xl text-blue-500">
                  + New Car
                </Link>
              </Tile>
            </div>
          )}

        <div className="">
          <Outlet />
         </div>
    </div>
  );
}
