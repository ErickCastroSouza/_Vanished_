import { 
  User, MissingPerson, InsertUser, SuccessStory, 
  InsertMissingPerson, InsertSuccessStory, SearchMissingPersonParams,
  users, missingPersons, successStories
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db, pool } from './db';
import { eq, like, and, gte, lt } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

interface Statistics {
  totalMissingPersons: number;
  foundPersons: number;
  monthlyCount: number;
  yearlyCount: number;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMissingPerson(id: number): Promise<MissingPerson | undefined>;
  searchMissingPersons(params: SearchMissingPersonParams): Promise<MissingPerson[]>;
  createMissingPerson(person: InsertMissingPerson): Promise<MissingPerson>;
  updateMissingPerson(id: number, person: InsertMissingPerson): Promise<MissingPerson>;
  
  getSuccessStories(): Promise<SuccessStory[]>;
  createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory>;
  
  getStatistics(): Promise<Statistics>;
  
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getMissingPerson(id: number): Promise<MissingPerson | undefined> {
    const [person] = await db.select().from(missingPersons).where(eq(missingPersons.id, id));
    return person;
  }

  async searchMissingPersons(params: SearchMissingPersonParams): Promise<MissingPerson[]> {
    let query = db.select().from(missingPersons);
    const conditions = [];

    if (params.name) {
      conditions.push(like(missingPersons.name, `%${params.name}%`));
    }

    if (params.location) {
      conditions.push(like(missingPersons.lastLocation, `%${params.location}%`));
    }

    if (params.age) {
      conditions.push(eq(missingPersons.age, params.age));
    }

    if (params.gender) {
      conditions.push(eq(missingPersons.gender, params.gender));
    }

    if (params.status) {
      conditions.push(eq(missingPersons.status, params.status));
    }

    if (params.lastSeenDate) {
      // Convert to Date and get day boundaries
      const searchDate = new Date(params.lastSeenDate);
      searchDate.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      conditions.push(
        and(
          gte(missingPersons.lastSeenDate, searchDate),
          eq(missingPersons.lastSeenDate, searchDate)
        )
      );
    }

    if (conditions.length > 0) {
      // Combine all conditions with AND
      query = query.where(and(...conditions));
    }

    return await query;
  }

  async createMissingPerson(person: InsertMissingPerson): Promise<MissingPerson> {
    const [createdPerson] = await db.insert(missingPersons).values(person).returning();
    return createdPerson;
  }

  async updateMissingPerson(id: number, updateData: InsertMissingPerson): Promise<MissingPerson> {
    const [updated] = await db
      .update(missingPersons)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(missingPersons.id, id))
      .returning();

    if (!updated) {
      throw new Error("Missing person not found");
    }

    return updated;
  }

  async getSuccessStories(): Promise<SuccessStory[]> {
    return await db.select().from(successStories);
  }

  async createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory> {
    // First, update the missing person's status to "found"
    await db
      .update(missingPersons)
      .set({ status: "found", updatedAt: new Date() })
      .where(eq(missingPersons.id, story.missingPersonId));

    // Then create the success story
    const [createdStory] = await db.insert(successStories).values(story).returning();
    return createdStory;
  }

  async getStatistics(): Promise<Statistics> {
    // Count total missing persons
    const [{ count: totalCount }] = await db
      .select({ count: db.fn.count() })
      .from(missingPersons);
    
    // Count found persons
    const [{ count: foundCount }] = await db
      .select({ count: db.fn.count() })
      .from(missingPersons)
      .where(eq(missingPersons.status, "found"));
    
    // Get the date for one month ago
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Get the date for one year ago
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    // Count monthly new cases
    const [{ count: monthlyCount }] = await db
      .select({ count: db.fn.count() })
      .from(missingPersons)
      .where(gte(missingPersons.createdAt, oneMonthAgo));
    
    // Count yearly new cases
    const [{ count: yearlyCount }] = await db
      .select({ count: db.fn.count() })
      .from(missingPersons)
      .where(gte(missingPersons.createdAt, oneYearAgo));
    
    return {
      totalMissingPersons: Number(totalCount),
      foundPersons: Number(foundCount),
      monthlyCount: Number(monthlyCount),
      yearlyCount: Number(yearlyCount)
    };
  }
}

export const storage = new DatabaseStorage();
