import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, NavLink, useActionData, useLoaderData, useParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { createBooking } from "~/models/booking.server";
import { createCar, getCarsByFamilyId } from "~/models/car.server";

import { getFamilyId, requireFamilyId, requireUserId } from "~/session.server";

const checkFields = (name?: string, car? : string, dateTimeStart?: Date, dateTimeEnd?: Date) => {
  const errors: any = {};

  if (typeof name !== "string" || name.length === 0) {
    errors.name = "Name is required";
  }

  if (typeof car !== "string" || car === "0") {
    errors.car = "Car is required";
  }

  if (dateTimeStart == null) {
    errors.dateTimeStart = "DateTime Start is required";
  }

  if (dateTimeEnd == null) {
    errors.dateTimeEnd = "DateTime End is required";
  }

  return errors;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const familyId = await requireFamilyId(request);

  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const car = formData.get("car")?.toString();
  const dateTimeStart = new Date(formData.get("dateTimeStart")?.toString() ?? '');
  const dateTimeEnd = new Date(formData.get("dateTimeEnd")?.toString() ?? '');

  console.log(dateTimeStart, dateTimeEnd);
  console.log(name, car, dateTimeStart, dateTimeEnd);

  // const errors = checkFields(name, car, dateTimeStart, dateTimeEnd);

  // console.log('Errors: ', errors);
  // if (errors) {
  //   return json(
  //     { errors },
  //     { status: 400 },
  //   );
  // }

  const boooking = await createBooking(name ?? '', familyId, userId, car ?? '', dateTimeStart, dateTimeEnd);

  console.log('Booking: ', boooking);

  // const note = await createCar(name, familyId);

  return redirect(`/home/booking`);
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const familyId = await requireFamilyId(request);

  const cars = await getCarsByFamilyId(familyId);
  if (!cars) {
    throw new Response("Not Found", { status: 404 });
  }
  
  return json({ cars });
};

export default function NewBookingPage() {
  const data = useLoaderData<typeof loader>();
  
  const { newId } = useParams()
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Name: </span>
          <input
            name="name"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          /> 
        </label>
        {actionData?.errors?.title ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.name}
          </div>
        ) : null}
      </div>

       <div>
        <label className="flex w-full flex-col gap-1">
          <span>Car: </span>
          <select name="car">
            <option value="0">Select a car</option>
            {data.cars.map((car) => (
              <option value={car.id}>{car.name}</option>
            ))}
          </select>
        </label>
        {actionData?.errors?.car ? (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.car}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>DateTime Start: </span>
          <input type="date" name="dateTimeStart"/>
        </label>
        {actionData?.errors?.dateTimeStart ? (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.dateTimeStart}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>DateTime End: </span>
          <input type="date" name="dateTimeEnd"/>
        </label>
        {actionData?.errors?.dateTimeEnd ? (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.dateTimeEnd}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
