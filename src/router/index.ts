import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Dashboard } from "src/components/Dashboard/Dashboard";
import { RootLayout } from "src/components/Layout/RootLayout";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const routeTree = rootRoute.addChildren([dashboardRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
