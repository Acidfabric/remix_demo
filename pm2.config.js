module.exports = {
  apps: [
    {
      name: "Prisma",
      script: "prisma generate",
      watch: ["./prisma"],
      autorestart: false,
      env: {
        NODE_ENV: process.env.NODE_ENV ?? "development",
        PRISMA_CLIENT_ENGINE_TYPE: "dataproxy",
      },
    },
    {
      name: "Tailwind",
      script: "tailwindcss -o ./app/app.css --watch",
      ignore_watch: ["."],
      env: {
        NODE_ENV: process.env.NODE_ENV ?? "development",
      },
    },
    {
      name: "Remix",
      script: "remix watch",
      ignore_watch: ["."],
      env: {
        NODE_ENV: process.env.NODE_ENV ?? "development",
        DATABASE_URL: process.env.DATABASE_URL,
      },
    },
    {
      name: "Wrangler",
      script: "npx wrangler pages dev ./public --kv SESSIONS",
      ignore_watch: ["."],
      env: {
        NODE_ENV: process.env.NODE_ENV ?? "development",
        BROWSER: "none",
        DATABASE_URL: process.env.DATABASE_URL,
      },
    },
  ],
};
