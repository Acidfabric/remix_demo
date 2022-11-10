import type { AppLoadContext } from "@remix-run/cloudflare";
import {
  createCloudflareKVSessionStorage,
  createCookie,
  redirect,
} from "@remix-run/cloudflare";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";

function getSessionStorage(context: AppLoadContext) {
  invariant(context.SESSION_SECRET, "SESSION_SECRET must be set");

  return createCloudflareKVSessionStorage({
    kv: context["SESSION"] as KVNamespace,
    cookie: createCookie("__session", {
      httpOnly: true,
      path: "/",
      sameSite: true,
      secrets: [context.SESSION_SECRET as string],
      secure: process.env.NODE_ENV === "production",
    }),
  });
}

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request, context: AppLoadContext) {
  const cookie = request.headers.get("Cookie");
  const sessionStorage = getSessionStorage(context);

  return await sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request,
  context: AppLoadContext
): Promise<User["id"] | undefined> {
  const session = await getSession(request, context);
  const userId = session.get(USER_SESSION_KEY);

  return userId;
}

export async function getUser(request: Request, context: AppLoadContext) {
  const userId = await getUserId(request, context);

  if (userId === undefined) return null;

  const user = await getUserById(userId, context);

  if (user) return user;

  throw await logout(request, context);
}

export async function requireUserId(
  request: Request,
  context: AppLoadContext,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request, context);

  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return userId;
}

export async function requireUser(request: Request, context: AppLoadContext) {
  const userId = await requireUserId(request, context);

  const user = await getUserById(userId, context);

  if (user) return user;

  throw await logout(request, context);
}

export async function createUserSession({
  request,
  context,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  context: AppLoadContext;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const cookie = request.headers.get("Cookie");
  const sessionStorage = getSessionStorage(context);
  const session = await sessionStorage.getSession(cookie);

  session.set(USER_SESSION_KEY, userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request, context: AppLoadContext) {
  const cookie = request.headers.get("Cookie");
  const sessionStorage = getSessionStorage(context);
  const session = await sessionStorage.getSession(cookie);

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
