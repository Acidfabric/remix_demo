import type {
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import * as Sentry from "@sentry/remix";

import styles from "./styles/app.css";
import { getUser } from "./session.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export async function loader({ request, context }: LoaderArgs) {
  return json({
    user: await getUser(request, context),
  });
}

type Props = {
  children: React.ReactNode;
  title?: string;
};

function Document({ children, title }: Props) {
  const renderTitle = () => {
    if (!title) return null;

    return <title>{title}</title>;
  };

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {renderTitle()}
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  );
}

function App() {
  return (
    <Document>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  Sentry.captureException(error);

  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}

export default Sentry.withSentry(App);
