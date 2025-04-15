import { 
  User, MissingPerson, InsertUser, SuccessStory, 
  InsertMissingPerson, InsertSuccessStory, SearchMissingPersonParams 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private missingPersons: Map<number, MissingPerson>;
  private successStories: Map<number, SuccessStory>;
  private userCurrentId: number;
  private personCurrentId: number;
  private storyCurrentId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.missingPersons = new Map();
    this.successStories = new Map();
    this.userCurrentId = 1;
    this.personCurrentId = 1;
    this.storyCurrentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Initialize with some data for development
    this.initializeSampleData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async getMissingPerson(id: number): Promise<MissingPerson | undefined> {
    return this.missingPersons.get(id);
  }

  async searchMissingPersons(params: SearchMissingPersonParams): Promise<MissingPerson[]> {
    let results = Array.from(this.missingPersons.values());

    if (params.name) {
      results = results.filter(p => 
        p.name.toLowerCase().includes(params.name!.toLowerCase())
      );
    }

    if (params.location) {
      results = results.filter(p => 
        p.lastLocation.toLowerCase().includes(params.location!.toLowerCase())
      );
    }

    if (params.age) {
      results = results.filter(p => p.age === params.age);
    }

    if (params.gender) {
      results = results.filter(p => p.gender === params.gender);
    }

    if (params.status) {
      results = results.filter(p => p.status === params.status);
    }

    if (params.lastSeenDate) {
      const searchDate = new Date(params.lastSeenDate);
      results = results.filter(p => {
        const personDate = new Date(p.lastSeenDate);
        return personDate.toDateString() === searchDate.toDateString();
      });
    }

    return results;
  }

  async createMissingPerson(person: InsertMissingPerson): Promise<MissingPerson> {
    const id = this.personCurrentId++;
    const now = new Date();
    const missingPerson: MissingPerson = {
      ...person,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.missingPersons.set(id, missingPerson);
    return missingPerson;
  }

  async updateMissingPerson(id: number, updateData: InsertMissingPerson): Promise<MissingPerson> {
    const existingPerson = this.missingPersons.get(id);
    
    if (!existingPerson) {
      throw new Error("Missing person not found");
    }
    
    const now = new Date();
    const updatedPerson: MissingPerson = {
      ...existingPerson,
      ...updateData,
      id,
      updatedAt: now
    };
    
    this.missingPersons.set(id, updatedPerson);
    return updatedPerson;
  }

  async getSuccessStories(): Promise<SuccessStory[]> {
    return Array.from(this.successStories.values());
  }

  async createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory> {
    const id = this.storyCurrentId++;
    const now = new Date();
    const successStory: SuccessStory = { ...story, id, createdAt: now };
    this.successStories.set(id, successStory);
    
    // Also update the missing person status to "found"
    const missingPerson = this.missingPersons.get(story.missingPersonId);
    if (missingPerson) {
      missingPerson.status = "found";
      this.missingPersons.set(missingPerson.id, missingPerson);
    }
    
    return successStory;
  }

  async getStatistics(): Promise<Statistics> {
    const allPersons = Array.from(this.missingPersons.values());
    const foundPersons = allPersons.filter(p => p.status === "found");
    
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const monthlyCount = allPersons.filter(p => new Date(p.createdAt) >= oneMonthAgo).length;
    const yearlyCount = allPersons.filter(p => new Date(p.createdAt) >= oneYearAgo).length;
    
    return {
      totalMissingPersons: allPersons.length,
      foundPersons: foundPersons.length,
      monthlyCount,
      yearlyCount
    };
  }
  
  private initializeSampleData() {
    // This method would initialize data but is intentionally left empty
    // as per the guidelines not to generate mock data
  }
}

export const storage = new MemStorage();
