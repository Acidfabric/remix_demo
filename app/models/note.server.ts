import type { User, Note } from "@prisma/client";
import type { AppLoadContext } from "@remix-run/cloudflare";

import { getPrismaClient } from "~/db.server";

export type { Note } from "@prisma/client";

export async function getNote({
  id,
  userId,
  context,
}: Pick<Note, "id"> & {
  userId: User["id"];
  context: AppLoadContext;
}) {
  const prisma = await getPrismaClient(context.DATABASE_URL as string);

  return prisma.note.findFirst({
    select: { id: true, body: true, title: true },
    where: { id, userId },
  });
}

export async function getNoteListItems({
  userId,
  context,
}: {
  userId: User["id"];
  context: AppLoadContext;
}) {
  const prisma = await getPrismaClient(context.DATABASE_URL as string);

  return prisma.note.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createNote({
  body,
  title,
  userId,
  context,
}: Pick<Note, "body" | "title"> & {
  userId: User["id"];
  context: AppLoadContext;
}) {
  const prisma = await getPrismaClient(context.DATABASE_URL as string);

  return prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function deleteNote({
  id,
  userId,
  context,
}: Pick<Note, "id"> & { userId: User["id"]; context: AppLoadContext }) {
  const prisma = await getPrismaClient(context.DATABASE_URL as string);

  return prisma.note.deleteMany({
    where: { id, userId },
  });
}
