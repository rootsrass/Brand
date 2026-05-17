import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { DiscoveryAgent } from "./src/server/services/DiscoveryAgent";
import { LTMAgent } from "./src/server/services/LTMAgent";
import { SwarmOrchestrator } from "./src/server/services/SwarmOrchestrator";
import { validateConfig } from "./src/server/config";

async function startServer() {
  validateConfig();
  
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes for the AI Swarm ---
  app.post("/api/discovery", DiscoveryAgent.scan);
  app.post("/api/ltm/ingest", LTMAgent.ingest);
  app.post("/api/dispatch", SwarmOrchestrator.dispatch);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
