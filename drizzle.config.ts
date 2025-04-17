import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/missing_hopes";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
