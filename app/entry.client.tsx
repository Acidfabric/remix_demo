import { useLocation, useMatches } from "@remix-run/react";
import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

import * as Sentry from "@sentry/remix";
import { useEffect } from "react";

Sentry.init({
  dsn: "https://129c08d8167c44229b2e8506172cda1e:4623a55d47b84b9ab69e40a226308f80@o1187403.ingest.sentry.io/4504148329037824",
  tracesSampleRate: 1,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        useEffect,
        useLocation,
        useMatches
      ),
    }),
  ],
});

hydrate(<RemixBrowser />, document);
