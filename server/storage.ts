import { IStorage } from "./storage";
import createMemoryStore from "memorystore";
import session from "express-session";
import { User, InsertUser, Pathway, Tool } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pathways: Map<number, Pathway>;
  private tools: Map<number, Tool>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.pathways = new Map();
    this.tools = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getPathways(): Promise<Pathway[]> {
    return Array.from(this.pathways.values());
  }

  async getTools(): Promise<Tool[]> {
    return Array.from(this.tools.values());
  }
}

export const storage = new MemStorage();
