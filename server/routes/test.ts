import { Router } from "express";
import { createDb } from "../db";

const router = Router();

router.get("/test-db", async (req, res) => {
  try {
    const db = await createDb();
    const result = await db.execute(/* sql */`SELECT 1 + 1 AS result`);
    res.json({ connected: true, result });
  } catch (error) {
    res.status(500).json({ connected: false, error: String(error) });
  }
});

export default router;