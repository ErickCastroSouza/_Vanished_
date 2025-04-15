import { 
  User, MissingPerson, InsertUser, SuccessStory, 
  InsertMissingPerson, InsertSuccessStory, SearchMissingPersonParams,
  users, missingPersons, successStories
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db, pool } from './db';
import { eq, like, and, gte, lt, sql, count } from "drizzle-orm";

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
  
  sessionStore: any; // Using any as a temporary workaround for the session type issue
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any as a temporary workaround for the session type issue

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  async getMissingPerson(id: number): Promise<MissingPerson | undefined> {
    try {
      const result = await db.select().from(missingPersons).where(eq(missingPersons.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error("Error fetching missing person:", error);
      return undefined;
    }
  }

  async searchMissingPersons(params: SearchMissingPersonParams): Promise<MissingPerson[]> {
    try {
      let conditions = [];

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
            lt(missingPersons.lastSeenDate, nextDay)
          )
        );
      }

      // Build query with conditions
      let query = db.select().from(missingPersons);
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const result = await query;
      return result;
    } catch (error) {
      console.error("Error searching missing persons:", error);
      return [];
    }
  }

  async createMissingPerson(person: InsertMissingPerson): Promise<MissingPerson> {
    try {
      const result = await db.insert(missingPersons).values(person).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating missing person:", error);
      throw new Error("Failed to create missing person");
    }
  }

  async updateMissingPerson(id: number, updateData: InsertMissingPerson): Promise<MissingPerson> {
    try {
      const now = new Date();
      const result = await db
        .update(missingPersons)
        .set({
          ...updateData,
          updatedAt: now
        })
        .where(eq(missingPersons.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error("Missing person not found");
      }

      return result[0];
    } catch (error) {
      console.error("Error updating missing person:", error);
      throw new Error("Failed to update missing person");
    }
  }

  async getSuccessStories(): Promise<SuccessStory[]> {
    try {
      return await db.select().from(successStories);
    } catch (error) {
      console.error("Error fetching success stories:", error);
      return [];
    }
  }

  async createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory> {
    try {
      // First, update the missing person's status to "found"
      await db
        .update(missingPersons)
        .set({ 
          status: "found", 
          updatedAt: new Date() 
        })
        .where(eq(missingPersons.id, story.missingPersonId));

      // Then create the success story
      const result = await db.insert(successStories).values(story).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating success story:", error);
      throw new Error("Failed to create success story");
    }
  }

  async getStatistics(): Promise<Statistics> {
    try {
      // Count total missing persons
      const totalResult = await db
        .select({ value: count() })
        .from(missingPersons);
      const totalCount = totalResult[0]?.value || 0;
      
      // Count found persons
      const foundResult = await db
        .select({ value: count() })
        .from(missingPersons)
        .where(eq(missingPersons.status, "found"));
      const foundCount = foundResult[0]?.value || 0;
      
      // Get the date for one month ago
      const now = new Date();
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      // Get the date for one year ago
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      // Count monthly new cases
      const monthlyResult = await db
        .select({ value: count() })
        .from(missingPersons)
        .where(gte(missingPersons.createdAt, oneMonthAgo));
      const monthlyCount = monthlyResult[0]?.value || 0;
      
      // Count yearly new cases
      const yearlyResult = await db
        .select({ value: count() })
        .from(missingPersons)
        .where(gte(missingPersons.createdAt, oneYearAgo));
      const yearlyCount = yearlyResult[0]?.value || 0;
      
      return {
        totalMissingPersons: Number(totalCount),
        foundPersons: Number(foundCount),
        monthlyCount: Number(monthlyCount),
        yearlyCount: Number(yearlyCount)
      };
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return {
        totalMissingPersons: 0,
        foundPersons: 0,
        monthlyCount: 0,
        yearlyCount: 0
      };
    }
  }
}

export const storage = new DatabaseStorage();
