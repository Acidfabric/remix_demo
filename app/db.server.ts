const getPrismaClient = async (url: string) => {
  const { PrismaClient } = await import("@prisma/client/edge");

  return new PrismaClient({ datasources: { db: { url } } });
};

export { getPrismaClient };
