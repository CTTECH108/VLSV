import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get student verification by certificate number
  app.get("/api/verify/:certificateNumber", async (req, res) => {
    try {
      const { certificateNumber } = req.params;
      
      if (!certificateNumber) {
        return res.status(400).json({ message: "Certificate number is required" });
      }

      const verification = await storage.getStudentVerificationByCertificateNumber(certificateNumber);
      
      if (!verification) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      res.json(verification);
    } catch (error) {
      console.error("Error verifying certificate:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all student verifications (for admin purposes)
  app.get("/api/verifications", async (req, res) => {
    try {
      const verifications = await storage.getAllStudentVerifications();
      res.json(verifications);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
