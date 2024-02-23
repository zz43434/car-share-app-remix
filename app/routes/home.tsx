import type { MetaFunction } from "@remix-run/node";
import { Form, Link, NavLink, Outlet } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Home</Link> 
        </h1>
        <p>{user?.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
            <div className="p-6">
                <ul className="mt-4">
                    <li><Link to="cars" className="block py-2">Cars</Link></li>
                    <li><Link to="booking" className="block py-2">Bookings</Link></li>
                    <li><Link to="settings" className="block py-2">Settings</Link></li>
                </ul>
            </div>
        </div>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
