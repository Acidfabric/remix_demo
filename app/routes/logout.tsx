import type { ActionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";

import { logout } from "~/session.server";

export async function action({ request, context }: ActionArgs) {
  return logout(request, context);
}

export async function loader() {
  return redirect("/");
}
