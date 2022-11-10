const getPrismaClient = async (url: string) => {
  const { PrismaClient } = await import("@prisma/client/edge");

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
  });

  return prisma;
};

export { getPrismaClient };
