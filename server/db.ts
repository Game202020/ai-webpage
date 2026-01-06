import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, analyses, resumes, ownerNotifications } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

/**
 * Hobby-related queries
 */
export async function createAnalysis(userId: number, data: {
  hobbiesInput: string;
  careerPath: string;
  description?: string;
  suggestedCourses?: string;
  suggestedJobs?: string;
  salaryRange?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create analysis: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(analyses).values({
      userId,
      hobbiesInput: data.hobbiesInput,
      careerPath: data.careerPath,
      description: data.description,
      suggestedCourses: data.suggestedCourses,
      suggestedJobs: data.suggestedJobs,
      salaryRange: data.salaryRange,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create analysis:", error);
    throw error;
  }
}

export async function getUserAnalyses(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get analyses: database not available");
    return [];
  }

  try {
    const result = await db.select().from(analyses).where(eq(analyses.userId, userId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get analyses:", error);
    throw error;
  }
}

export async function createResume(userId: number, data: {
  fileName: string;
  fileKey: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create resume: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(resumes).values({
      userId,
      fileName: data.fileName,
      fileKey: data.fileKey,
      fileUrl: data.fileUrl,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create resume:", error);
    throw error;
  }
}

export async function getUserResume(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get resume: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(resumes).where(eq(resumes.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get resume:", error);
    throw error;
  }
}

export async function createOwnerNotification(data: {
  userId: number;
  analysisId?: number;
  title: string;
  content: string;
  hobbiesInput?: string;
  suggestedCareer?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create notification: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(ownerNotifications).values({
      userId: data.userId,
      analysisId: data.analysisId,
      title: data.title,
      content: data.content,
      hobbiesInput: data.hobbiesInput,
      suggestedCareer: data.suggestedCareer,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create notification:", error);
    throw error;
  }
}
