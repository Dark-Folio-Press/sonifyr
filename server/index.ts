import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

/* ─────────────────────────────
   Config
   ───────────────────────────── */
const AUTH_ENABLED = process.env.AUTH_ENABLED !== "false";

/* ─────────────────────────────
   Core middleware
   ───────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ─────────────────────────────
   Request logging (API only)
   ───────────────────────────── */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      const duration = Date.now() - start;
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine.slice(0, 80));
    }
  });

  next();
});

/* ─────────────────────────────
   Auth interceptors (OPTIONAL)
   Only enabled if AUTH_ENABLED !== false
   ───────────────────────────── */
if (AUTH_ENABLED) {
  app.all("/api/login*", (_req, res) => {
    res.redirect(302, "/login");
  });

  app.all("/api/logout*", (req, res) => {
    req.session?.destroy?.(() => {});
    res.redirect(302, "/");
  });

  app.all("/api/callback*", (_req, res) => {
    res.redirect(302, "/login");
  });

  app.all("/auth/*", (_req, res) => {
    res.redirect(302, "/login");
  });
}

/* ─────────────────────────────
   App bootstrap
   ───────────────────────────── */
(async () => {
  const server = await registerRoutes(app);

  /* ─────────────────────────────
     Error handler
     ───────────────────────────── */
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  /* ─────────────────────────────
     Frontend handling
     ───────────────────────────── */
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  /* ─────────────────────────────
     Start server
     ───────────────────────────── */
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
