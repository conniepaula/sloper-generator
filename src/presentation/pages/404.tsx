import { Link, useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-rose-100">
        <div id="error-page">
          <h1 className="text-2xl font-bold text-gray-800 lg:text-6xl">
            Oops!
          </h1>
          <p className="text-xl text-gray-700">
            Sorry, an unexpected error has occurred.
          </p>
          <p className="text-3xl text-white">{error}</p>
          <div className="mt-4">
            <Link
              to="/"
              className="rounded-md bg-white px-5 py-2 hover:bg-gray-100"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
