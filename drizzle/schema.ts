import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Hobbies table - stores user's hobbies/interests
 */
export const hobbies = mysqlTable("hobbies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  hobby: text("hobby").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Hobby = typeof hobbies.$inferSelect;
export type InsertHobby = typeof hobbies.$inferInsert;

/**
 * Analyses table - stores AI analysis results for hobbies
 */
export const analyses = mysqlTable("analyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  hobbiesInput: text("hobbiesInput").notNull(),
  careerPath: text("careerPath").notNull(),
  description: text("description"),
  suggestedCourses: text("suggestedCourses"), // JSON string
  suggestedJobs: text("suggestedJobs"), // JSON string
  salaryRange: varchar("salaryRange", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = typeof analyses.$inferInsert;

/**
 * Resumes table - stores user's resume information and S3 file references
 */
export const resumes = mysqlTable("resumes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: text("fileKey").notNull(), // S3 file key
  fileUrl: text("fileUrl").notNull(), // S3 file URL
  fileSize: int("fileSize"),
  mimeType: varchar("mimeType", { length: 100 }),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = typeof resumes.$inferInsert;

/**
 * Owner Notifications table - tracks notifications sent to the project owner
 */
export const ownerNotifications = mysqlTable("ownerNotifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  analysisId: int("analysisId"),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  hobbiesInput: text("hobbiesInput"),
  suggestedCareer: text("suggestedCareer"),
  isRead: mysqlEnum("isRead", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OwnerNotification = typeof ownerNotifications.$inferSelect;
export type InsertOwnerNotification = typeof ownerNotifications.$inferInsert;