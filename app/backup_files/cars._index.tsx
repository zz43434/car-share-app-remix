import { Link } from "@remix-run/react";

export default function Cars() {
  return (
    <p>
      No car selected. Select a car on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new car.
      </Link>
    </p>
  );
}
