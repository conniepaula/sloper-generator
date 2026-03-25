import { isRouteErrorResponse, Link } from "react-router";
import { Button } from "../ui/Button";

interface ErrorPageProps {
  error: unknown;
}

interface ErrorPageContents {
  title: string;
  description: string;
  stack?: string;
}

export const ErrorPage = (props: ErrorPageProps) => {
  const { error } = props;

  const contents: ErrorPageContents = {
    title: "Unknown Error",
    description:
      "An unknown error happened following your request. Please try again later.",
  };
  if (isRouteErrorResponse(error)) {
    contents.title = `${error.status}: ${error.statusText} `;
    contents.description =
      error.status === 404
        ? "The page you tried to access doesn't exist."
        : error.data;
  } else if (error instanceof Error) {
    contents.title = "An error has occurred";
    contents.description = error.message;
    contents.stack = error.stack;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold text-gray-800 lg:text-6xl">
        {contents.title}
      </h1>
      <p className="text-xl text-gray-700">{contents.description}</p>
      <div className="mt-4">
        <Button as={Link} to="/">
          Home
        </Button>
      </div>
    </div>
  );
};
