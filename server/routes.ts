import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertMissingPersonSchema, insertSuccessStorySchema, searchMissingPersonSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Missing persons routes
  app.get("/api/missing-persons", async (req, res) => {
    try {
      const queryParams = req.query;
      const searchParams = searchMissingPersonSchema.parse({
        name: queryParams.name ? String(queryParams.name) : undefined,
        location: queryParams.location ? String(queryParams.location) : undefined,
        age: queryParams.age ? Number(queryParams.age) : undefined,
        gender: queryParams.gender ? String(queryParams.gender) : undefined,
        status: queryParams.status ? String(queryParams.status) : undefined,
        lastSeenDate: queryParams.lastSeenDate ? String(queryParams.lastSeenDate) : undefined,
      });

      const missingPersons = await storage.searchMissingPersons(searchParams);
      res.json(missingPersons);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to fetch missing persons" });
      }
    }
  });

  app.get("/api/missing-persons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const missingPerson = await storage.getMissingPerson(id);
      
      if (!missingPerson) {
        return res.status(404).json({ message: "Missing person not found" });
      }
      
      res.json(missingPerson);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch missing person" });
    }
  });

  app.post("/api/missing-persons", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const validatedData = insertMissingPersonSchema.parse({
        ...req.body,
        reportedBy: req.user.id,
      });
      
      const missingPerson = await storage.createMissingPerson(validatedData);
      res.status(201).json(missingPerson);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create missing person record" });
      }
    }
  });

  app.put("/api/missing-persons/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const id = parseInt(req.params.id);
      const existingPerson = await storage.getMissingPerson(id);
      
      if (!existingPerson) {
        return res.status(404).json({ message: "Missing person not found" });
      }
      
      if (existingPerson.reportedBy !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this record" });
      }

      const validatedData = insertMissingPersonSchema.parse({
        ...req.body,
        reportedBy: req.user.id,
      });
      
      const updatedPerson = await storage.updateMissingPerson(id, validatedData);
      res.json(updatedPerson);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update missing person record" });
      }
    }
  });

  // Success stories routes
  app.get("/api/success-stories", async (req, res) => {
    try {
      const successStories = await storage.getSuccessStories();
      res.json(successStories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch success stories" });
    }
  });

  app.post("/api/success-stories", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const validatedData = insertSuccessStorySchema.parse(req.body);
      const successStory = await storage.createSuccessStory(validatedData);
      res.status(201).json(successStory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create success story" });
      }
    }
  });

  // Statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
