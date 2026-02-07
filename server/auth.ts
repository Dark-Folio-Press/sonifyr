import passport from "passport";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User as UserType } from "@shared/schema";
import connectPg from "connect-pg-simple";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

export function setupAuth(app: Express) {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  console.log("SESSION_SECRET value:", process.env.SESSION_SECRET);
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => done(null, (user as UserType).id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      console.error("Deserialize error:", error);
      done(null, false);
    }
  });

  // Auth Routes - Spotify-only authentication
  
  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Override any potential Replit Auth routes
  app.get("/api/login", (req, res) => {
    res.redirect("/login");
  });

  app.get("/api/logout", (req, res) => {
    res.redirect("/");
  });

  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json({ ...req.user, password: undefined });
  });

  // Profile completion route for Spotify OAuth users
  app.post("/api/auth/complete-profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { birthDate, birthTime, birthLocation } = req.body;
      const userId = (req.user as UserType).id;
      
      const updatedUser = await storage.updateUser(userId, {
        birthDate,
        birthTime,
        birthLocation,
      });
      
      res.json({ user: { ...updatedUser, password: undefined } });
    } catch (error) {
      console.error("Profile completion error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
}

// Middleware to check authentication
export function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Middleware to check if user has complete profile
export function requireCompleteProfile(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const user = req.user as UserType;
  if (!user.birthDate || !user.birthTime || !user.birthLocation) {
    return res.status(400).json({ 
      message: "Profile incomplete", 
      needsProfileCompletion: true 
    });
  }
  
  next();
}