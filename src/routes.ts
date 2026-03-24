import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/bodice", "./presentation/pages/bodice.tsx"),
  // * matches all URLs, the ? makes it optional so it will match / as well
  route("*?", "./presentation/pages/404.tsx"),
] satisfies RouteConfig;
