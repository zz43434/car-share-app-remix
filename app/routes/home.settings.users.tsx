import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getCarsByFamilyId } from "~/models/car.server";
import { getFamilyById } from "~/models/family.server";

import { getUserById, getUsersByFamilyId } from "~/models/user.server";
import { requireFamilyId, requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { useParams } from "react-router-dom";
import styled from "styled-components";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const familyId = await requireFamilyId(request);
  
  const [users] = await Promise.all([
    getUsersByFamilyId(familyId)
 ]);

  return json({ users });
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
  const currentUser = useUser();

  console.log(currentUser);

  return (
    <div className="">

        <Tile>
          <Link to="new" className="text-xl text-blue-500">
            + New User
          </Link>
        </Tile>
          

        <hr />
        <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <div className="bg-white shadow-md rounded my-6">
            <table className="min-w-max w-full table-auto">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">ID</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">Is Admin</th>
                        <th className="py-3 px-6 text-left">Edit</th>
                        <th className="py-3 px-6 text-left">Delete</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {data.users.map((user) => (
                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={user.id}>
                      <td className="py-3 px-6 text-left whitespace-nowrap">{user.id}</td>
                      <td className="py-3 px-6 text-left">{user.email}</td>
                      <td className="py-3 px-6 text-left">{user.isAdmin.toString()}</td>
                      <td className="py-3 px-6 text-left"><button className="button">Edit</button></td>
                      <td className="py-3 px-6 text-left">{user.id == currentUser.id ? (<></>) : (<button>Delete</button>)}</td>
                    </tr>
                  ))}
                </tbody>
            </table>
        </div>
    </div>

        <div className="">
          <Outlet />
         </div>
    </div>
  );
}
