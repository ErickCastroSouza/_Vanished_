import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http"; // importe o createServer
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import testDbRouter from "./routes/test";
import cors from "cors";
import { storage } from './storage';

async function main() {
  await storage.init();

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // (middlewares, rotas, etc — seu código normal)

  app.get('/api/test', (req, res) => {
    res.send("Servidor funcionando!");
  });

  app.use("/api", testDbRouter);

  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Crie o server HTTP a partir do Express app
  const server = createServer(app);

  if (app.get("env") === "development") {
    // Agora passe app e server para setupVite
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`Servidor rodando na porta ${port}`);
  });
}

main().catch(err => {
  console.error("Erro ao iniciar o servidor:", err);
  process.exit(1);
});
