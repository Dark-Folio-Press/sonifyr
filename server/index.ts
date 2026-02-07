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

// Override any potential Replit Auth routes with highest priority
app.all("/api/login*", (req, res) => {
  console.log(`Intercepted ${req.method} ${req.url} from ${req.get('User-Agent')}, redirecting to /login`);
  res.redirect(302, "/login");
});

app.all("/api/logout*", (req, res) => {
  console.log("Intercepted /api/logout request, redirecting to /");
  req.session?.destroy?.(() => {});
  res.redirect(302, "/");
});

app.all("/api/callback*", (req, res) => {
  console.log("Intercepted /api/callback request, redirecting to /login");
  res.redirect(302, "/login");
});

// Block all auth routes that could trigger Replit Auth
app.all("/auth/*", (req, res) => {
  console.log(`Intercepted ${req.method} ${req.url}, redirecting to /login`);
  res.redirect(302, "/login");
});

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
