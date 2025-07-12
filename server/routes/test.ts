import { Router } from "express";
import { db } from "../db";

const router = Router();

router.get("/test-db", async (req, res) => {
  try {
    const result = await db.execute(/* use uma query simples */`
      SELECT 1 + 1 AS result
    `);
    res.json({ connected: true, result });
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
    res.status(500).json({ connected: false, error: String(error) });
  }
});

export default router;