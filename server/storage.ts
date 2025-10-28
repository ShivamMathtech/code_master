import {
  type User,
  type InsertUser,
  type Problem,
  type InsertProblem,
  type Submission,
  type InsertSubmission,
  type UserProgress,
  type InsertUserProgress,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Problem methods
  getAllProblems(): Promise<Problem[]>;
  getProblem(id: string): Promise<Problem | undefined>;
  getProblemBySlug(slug: string): Promise<Problem | undefined>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  updateProblemStats(id: string, accepted: boolean): Promise<void>;

  // Submission methods
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissionsByUser(userId: string): Promise<Submission[]>;
  getSubmissionsByProblem(problemId: string): Promise<Submission[]>;
  getRecentSubmissions(userId: string, limit: number): Promise<Submission[]>;

  // User progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserProblemProgress(userId: string, problemId: string): Promise<UserProgress | undefined>;

  // Leaderboard
  getLeaderboard(limit: number): Promise<Array<{ userId: string; username: string; solvedCount: number }>>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private problems: Map<string, Problem>;
  private submissions: Map<string, Submission>;
  private userProgress: Map<string, UserProgress>;

  constructor() {
    this.users = new Map();
    this.problems = new Map();
    this.submissions = new Map();
    this.userProgress = new Map();
    this.seedProblems();
  }

  // Seed some initial problems
  private seedProblems() {
    const sampleProblems: InsertProblem[] = [
      {
        title: "Two Sum",
        slug: "two-sum",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        difficulty: "easy",
        category: "Array",
        tags: ["Array", "Hash Table"],
        starterCode: `function twoSum(nums, target) {
  // Write your code here
  
}`,
        testCases: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
        ],
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists",
        ],
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
          },
        ],
      },
      {
        title: "Reverse String",
        slug: "reverse-string",
        description: "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
        difficulty: "easy",
        category: "String",
        tags: ["String", "Two Pointers"],
        starterCode: `function reverseString(s) {
  // Write your code here
  
}`,
        testCases: [
          { input: { s: ["h", "e", "l", "l", "o"] }, expected: ["o", "l", "l", "e", "h"] },
          { input: { s: ["H", "a", "n", "n", "a", "h"] }, expected: ["h", "a", "n", "n", "a", "H"] },
        ],
        constraints: [
          "1 <= s.length <= 10^5",
          "s[i] is a printable ascii character",
        ],
        examples: [
          {
            input: 's = ["h","e","l","l","o"]',
            output: '["o","l","l","e","h"]',
          },
        ],
      },
      {
        title: "Valid Parentheses",
        slug: "valid-parentheses",
        description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
        difficulty: "medium",
        category: "Stack",
        tags: ["String", "Stack"],
        starterCode: `function isValid(s) {
  // Write your code here
  
}`,
        testCases: [
          { input: { s: "()" }, expected: true },
          { input: { s: "()[]{}" }, expected: true },
          { input: { s: "(]" }, expected: false },
          { input: { s: "([)]" }, expected: false },
          { input: { s: "{[]}" }, expected: true },
        ],
        constraints: [
          "1 <= s.length <= 10^4",
          "s consists of parentheses only '()[]{}'",
        ],
        examples: [
          {
            input: 's = "()"',
            output: "true",
          },
          {
            input: 's = "()[]{}"',
            output: "true",
          },
          {
            input: 's = "(]"',
            output: "false",
          },
        ],
      },
      {
        title: "Merge Two Sorted Lists",
        slug: "merge-two-sorted-lists",
        description: "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
        difficulty: "medium",
        category: "Linked List",
        tags: ["Linked List", "Recursion"],
        starterCode: `function mergeTwoLists(list1, list2) {
  // Write your code here
  // Note: Lists are represented as arrays for simplicity
  // Return merged sorted array
  
}`,
        testCases: [
          { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expected: [1, 1, 2, 3, 4, 4] },
          { input: { list1: [], list2: [] }, expected: [] },
          { input: { list1: [], list2: [0] }, expected: [0] },
        ],
        constraints: [
          "The number of nodes in both lists is in the range [0, 50]",
          "-100 <= Node.val <= 100",
          "Both list1 and list2 are sorted in non-decreasing order",
        ],
        examples: [
          {
            input: "list1 = [1,2,4], list2 = [1,3,4]",
            output: "[1,1,2,3,4,4]",
          },
        ],
      },
      {
        title: "Maximum Subarray",
        slug: "maximum-subarray",
        description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
        difficulty: "hard",
        category: "Dynamic Programming",
        tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
        starterCode: `function maxSubArray(nums) {
  // Write your code here
  
}`,
        testCases: [
          { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6 },
          { input: { nums: [1] }, expected: 1 },
          { input: { nums: [5, 4, -1, 7, 8] }, expected: 23 },
        ],
        constraints: [
          "1 <= nums.length <= 10^5",
          "-10^4 <= nums[i] <= 10^4",
        ],
        examples: [
          {
            input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
            output: "6",
            explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
          },
        ],
      },
    ];

    sampleProblems.forEach((problem) => {
      const id = randomUUID();
      this.problems.set(id, {
        ...problem,
        id,
        acceptanceRate: Math.floor(Math.random() * 40 + 30), // Random 30-70%
        totalSubmissions: Math.floor(Math.random() * 10000 + 1000),
        createdAt: new Date(),
      });
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Problem methods
  async getAllProblems(): Promise<Problem[]> {
    return Array.from(this.problems.values());
  }

  async getProblem(id: string): Promise<Problem | undefined> {
    return this.problems.get(id);
  }

  async getProblemBySlug(slug: string): Promise<Problem | undefined> {
    return Array.from(this.problems.values()).find((p) => p.slug === slug);
  }

  async createProblem(insertProblem: InsertProblem): Promise<Problem> {
    const id = randomUUID();
    const problem: Problem = {
      ...insertProblem,
      id,
      acceptanceRate: 0,
      totalSubmissions: 0,
      createdAt: new Date(),
    };
    this.problems.set(id, problem);
    return problem;
  }

  async updateProblemStats(id: string, accepted: boolean): Promise<void> {
    const problem = this.problems.get(id);
    if (problem) {
      problem.totalSubmissions += 1;
      if (accepted) {
        problem.acceptanceRate = Math.round(
          ((problem.acceptanceRate * (problem.totalSubmissions - 1)) + 100) / problem.totalSubmissions
        );
      }
      this.problems.set(id, problem);
    }
  }

  // Submission methods
  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = {
      ...insertSubmission,
      id,
      submittedAt: new Date(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async getSubmissionsByUser(userId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }

  async getSubmissionsByProblem(problemId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter((s) => s.problemId === problemId);
  }

  async getRecentSubmissions(userId: string, limit: number): Promise<Submission[]> {
    return Array.from(this.submissions.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
      .slice(0, limit);
  }

  // User progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter((p) => p.userId === userId);
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = Array.from(this.userProgress.values()).find(
      (p) => p.userId === progress.userId && p.problemId === progress.problemId
    );

    if (existing) {
      const updated = { ...existing, ...progress };
      this.userProgress.set(existing.id, updated);
      return updated;
    }

    const id = randomUUID();
    const newProgress: UserProgress = { ...progress, id };
    this.userProgress.set(id, newProgress);
    return newProgress;
  }

  async getUserProblemProgress(userId: string, problemId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      (p) => p.userId === userId && p.problemId === problemId
    );
  }

  // Leaderboard
  async getLeaderboard(limit: number): Promise<Array<{ userId: string; username: string; solvedCount: number }>> {
    const progressByUser = new Map<string, number>();

    Array.from(this.userProgress.values())
      .filter((p) => p.status === "solved")
      .forEach((p) => {
        const count = progressByUser.get(p.userId) || 0;
        progressByUser.set(p.userId, count + 1);
      });

    const leaderboard = Array.from(progressByUser.entries())
      .map(([userId, solvedCount]) => {
        const user = this.users.get(userId);
        return {
          userId,
          username: user?.username || "Unknown",
          solvedCount,
        };
      })
      .sort((a, b) => b.solvedCount - a.solvedCount)
      .slice(0, limit);

    return leaderboard;
  }
}

export const storage = new MemStorage();
