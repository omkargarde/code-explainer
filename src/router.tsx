import { createRouter } from "@tanstack/react-router";

// Import the generated route tree
import * as Sentry from "@sentry/tanstackstart-react";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  // return createRouter({
  //   routeTree,
  //   scrollRestoration: true,
  //   defaultPreloadStaleTime: 0,
  // });
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  if (!router.isServer) {
    Sentry.init({
      dsn: "https://c506d3de479ab4659d3cd255b6a55f95@o4510493443358720.ingest.us.sentry.io/4510493473439744",
      integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
      // Adds request headers and IP for users, for more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
      sendDefaultPii: true,
    });
  }

  return router;
};
