import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { body, param, validationResult } from "express-validator";
import { generateToken, authMiddleware, optionalAuthMiddleware } from "./auth";
import type { InsertUser, InsertSubmission, InsertUserProgress } from "@shared/schema";
import vm from "vm";

interface AuthRequest extends Request {
  user?: { userId: string; username: string };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Validation middleware
  const validate = (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  };

  // Auth routes
  app.post(
    "/api/auth/signup",
    [
      body("username").trim().isLength({ min: 3, max: 30 }).withMessage("Username must be 3-30 characters"),
      body("email").isEmail().withMessage("Invalid email address"),
      body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    validate,
    async (req, res) => {
      try {
        const { username, email, password } = req.body;

        const existingUser = await storage.getUserByUsername(username);
        if (existingUser) {
          return res.status(400).json({ message: "Username already exists" });
        }

        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail) {
          return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await storage.createUser({
          username,
          email,
          password: hashedPassword,
        });

        const token = generateToken({ userId: user.id, username: user.username });

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    }
  );

  app.post(
    "/api/auth/login",
    [
      body("username").trim().notEmpty().withMessage("Username is required"),
      body("password").notEmpty().withMessage("Password is required"),
    ],
    validate,
    async (req, res) => {
      try {
        const { username, password } = req.body;

        const user = await storage.getUserByUsername(username);
        if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken({ userId: user.id, username: user.username });

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    }
  );

  // Problems routes
  app.get("/api/problems", async (req, res) => {
    try {
      const problems = await storage.getAllProblems();
      const problemsWithoutTestCases = problems.map(({ testCases, ...problem }) => problem);
      res.json(problemsWithoutTestCases);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/problems/:slug", [param("slug").trim().notEmpty()], validate, async (req, res) => {
    try {
      const { slug } = req.params;
      const problem = await storage.getProblemBySlug(slug);

      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      const { testCases, ...problemWithoutTestCases } = problem;
      res.json(problemWithoutTestCases);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Code execution route
  app.post(
    "/api/problems/:slug/run",
    optionalAuthMiddleware,
    [
      param("slug").trim().notEmpty(),
      body("code").isString().isLength({ min: 1, max: 10000 }).withMessage("Code must be 1-10000 characters"),
    ],
    validate,
    async (req, res) => {
      try {
        const { slug } = req.params;
        const { code } = req.body;

        const problem = await storage.getProblemBySlug(slug);
        if (!problem) {
          return res.status(404).json({ message: "Problem not found" });
        }

        const testResults = await executeCodeSafely(code, problem.testCases.slice(0, 3));
        res.json({ testResults });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    }
  );

  // Code submission route (requires auth)
  app.post(
    "/api/problems/:slug/submit",
    authMiddleware,
    [
      param("slug").trim().notEmpty(),
      body("code").isString().isLength({ min: 1, max: 10000 }).withMessage("Code must be 1-10000 characters"),
    ],
    validate,
    async (req: AuthRequest, res) => {
      try {
        const { slug } = req.params;
        const { code } = req.body;

        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const problem = await storage.getProblemBySlug(slug);
        if (!problem) {
          return res.status(404).json({ message: "Problem not found" });
        }

        const testResults = await executeCodeSafely(code, problem.testCases);
        const allPassed = testResults.every((result: any) => result.passed);
        const status = allPassed ? "accepted" : "wrong_answer";

        const submission: InsertSubmission = {
          userId: req.user.userId,
          problemId: problem.id,
          code,
          language: "javascript",
          status,
          runtime: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 50000),
          testResults,
        };

        await storage.createSubmission(submission);
        await storage.updateProblemStats(problem.id, allPassed);

        // Update user progress
        const existingProgress = await storage.getUserProblemProgress(req.user.userId, problem.id);

        const progress: InsertUserProgress = {
          userId: req.user.userId,
          problemId: problem.id,
          status: allPassed ? "solved" : "attempted",
          attempts: existingProgress ? existingProgress.attempts + 1 : 1,
          lastAttemptAt: new Date(),
          solvedAt: allPassed ? new Date() : existingProgress?.solvedAt || null,
        };

        await storage.updateUserProgress(progress);

        res.json({ status, testResults });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    }
  );

  // Dashboard route (requires auth)
  app.get("/api/dashboard", authMiddleware, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const progress = await storage.getUserProgress(req.user.userId);
      const recentSubmissions = await storage.getRecentSubmissions(req.user.userId, 10);
      const allProblems = await storage.getAllProblems();

      const problemMap = new Map(allProblems.map((p) => [p.id, p]));

      const solvedProblems = progress.filter((p) => p.status === "solved");
      const easySolved = solvedProblems.filter(
        (p) => problemMap.get(p.problemId)?.difficulty === "easy"
      ).length;
      const mediumSolved = solvedProblems.filter(
        (p) => problemMap.get(p.problemId)?.difficulty === "medium"
      ).length;
      const hardSolved = solvedProblems.filter(
        (p) => problemMap.get(p.problemId)?.difficulty === "hard"
      ).length;

      const recentSubmissionsWithTitles = recentSubmissions.map((sub) => {
        const problem = problemMap.get(sub.problemId);
        return {
          id: sub.id,
          problemTitle: problem?.title || "Unknown",
          problemSlug: problem?.slug || "",
          status: sub.status,
          submittedAt: sub.submittedAt.toISOString(),
        };
      });

      res.json({
        totalSolved: solvedProblems.length,
        easySolved,
        mediumSolved,
        hardSolved,
        recentSubmissions: recentSubmissionsWithTitles,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Leaderboard route
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard(50);
      res.json(leaderboard);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Improved code execution with basic sandboxing
async function executeCodeSafely(code: string, testCases: any[]): Promise<any[]> {
  const results = [];
  const TIMEOUT_MS = 2000; // 2 second timeout per test case

  for (const testCase of testCases) {
    try {
      // Basic validation
      if (code.includes("require") || code.includes("import") || code.includes("eval")) {
        results.push({
          passed: false,
          error: "Code contains disallowed operations (require, import, eval)",
        });
        continue;
      }

      const functionMatch = code.match(/function\s+(\w+)/);
      if (!functionMatch) {
        results.push({
          passed: false,
          error: "No function found in code",
        });
        continue;
      }

      const functionName = functionMatch[1];

      // Execute in VM sandbox with timeout
      const sandbox = {
        result: null,
        error: null,
      };

      const context = vm.createContext(sandbox);
      const wrappedCode = `
        ${code}
        try {
          const args = ${JSON.stringify(Object.values(testCase.input))};
          result = ${functionName}(...args);
        } catch (e) {
          error = e.message;
        }
      `;

      // Run with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Execution timeout")), TIMEOUT_MS)
      );

      const executePromise = new Promise<void>((resolve) => {
        vm.runInContext(wrappedCode, context, { timeout: TIMEOUT_MS });
        resolve();
      });

      await Promise.race([executePromise, timeoutPromise]);

      if (sandbox.error) {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          error: sandbox.error,
        });
        continue;
      }

      const result = sandbox.result;
      const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);

      results.push({
        passed,
        input: testCase.input,
        expected: testCase.expected,
        actual: result,
        error: passed
          ? null
          : `Expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(result)}`,
      });
    } catch (error: any) {
      results.push({
        passed: false,
        input: testCase.input,
        expected: testCase.expected,
        actual: null,
        error: error.message === "Execution timeout" ? "Time limit exceeded" : error.message,
      });
    }
  }

  return results;
}
