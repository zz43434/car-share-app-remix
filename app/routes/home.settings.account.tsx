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
      <h1>Profile: </h1>
      <p>Email: {user.email}</p>
      <p>IsAdmin: {user.isAdmin}</p>
    </div>
    
  );
}
