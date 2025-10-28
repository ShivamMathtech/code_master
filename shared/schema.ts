import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Problems table
export const problems = pgTable("problems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // "easy", "medium", "hard"
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  starterCode: text("starter_code").notNull(),
  testCases: jsonb("test_cases").notNull(), // { input: any, expected: any }[]
  constraints: text("constraints").array().notNull().default(sql`'{}'::text[]`),
  examples: jsonb("examples").notNull(), // { input: string, output: string, explanation?: string }[]
  acceptanceRate: integer("acceptance_rate").notNull().default(0),
  totalSubmissions: integer("total_submissions").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
  createdAt: true,
  acceptanceRate: true,
  totalSubmissions: true,
});

export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Problem = typeof problems.$inferSelect;

// Submissions table
export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  problemId: varchar("problem_id").notNull().references(() => problems.id),
  code: text("code").notNull(),
  language: text("language").notNull().default("javascript"),
  status: text("status").notNull(), // "accepted", "wrong_answer", "runtime_error", "time_limit"
  runtime: integer("runtime"), // in milliseconds
  memory: integer("memory"), // in KB
  testResults: jsonb("test_results"), // { passed: boolean, input: any, expected: any, actual: any }[]
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submittedAt: true,
});

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// User progress tracking
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  problemId: varchar("problem_id").notNull().references(() => problems.id),
  status: text("status").notNull(), // "solved", "attempted", "not_started"
  attempts: integer("attempts").notNull().default(0),
  lastAttemptAt: timestamp("last_attempt_at"),
  solvedAt: timestamp("solved_at"),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
