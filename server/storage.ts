import { IStorage } from "./storage";
import createMemoryStore from "memorystore";
import session from "express-session";
import { User, InsertUser, Pathway, Tool, Resource } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pathways: Map<number, Pathway>;
  private tools: Map<number, Tool>;
  private resources: Map<number, Resource>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.pathways = new Map();
    this.tools = new Map();
    this.resources = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample pathways
    const fundamentals: Pathway = {
      id: 1,
      title: "AI Safety Fundamentals",
      description: "Core concepts and principles of AI safety",
      difficulty: "beginner",
      duration: "4 weeks",
      category: "foundations",
      steps: [
        { title: "Introduction to AI Safety", description: "Basic concepts and importance" },
        { title: "Risk Assessment", description: "Identifying and evaluating AI risks" },
        { title: "Safety Frameworks", description: "Current approaches to AI safety" }
      ],
      dependencies: [],
      skills_required: [],
      skills_gained: ["risk-assessment", "safety-principles"],
      resources: [
        { title: "AI Safety Basics", type: "article", url: "https://example.com/basics", pathway_id: 1 }
      ],
      completion_criteria: { 
        min_exercises: 3,
        final_assessment: true
      }
    };

    const technical: Pathway = {
      id: 2,
      title: "Technical Implementation",
      description: "Hands-on implementation of AI safety measures",
      difficulty: "intermediate",
      duration: "6 weeks",
      category: "technical",
      steps: [
        { title: "Safety Testing Methods", description: "Practical testing approaches" },
        { title: "Monitoring Systems", description: "Building monitoring solutions" }
      ],
      dependencies: [1], // Requires Fundamentals
      skills_required: ["safety-principles"],
      skills_gained: ["safety-testing", "monitoring"],
      resources: [
        { title: "Testing Guide", type: "tutorial", url: "https://example.com/testing", pathway_id: 2 }
      ],
      completion_criteria: {
        project_submission: true
      }
    };

    this.pathways.set(1, fundamentals);
    this.pathways.set(2, technical);
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

  async getPathwayById(id: number): Promise<Pathway | undefined> {
    return this.pathways.get(id);
  }

  async getPathwaysByCategory(category: string): Promise<Pathway[]> {
    return Array.from(this.pathways.values())
      .filter(pathway => pathway.category === category);
  }

  async getTools(): Promise<Tool[]> {
    return Array.from(this.tools.values());
  }

  async getResources(pathwayId?: number): Promise<Resource[]> {
    const resources = Array.from(this.resources.values());
    if (pathwayId) {
      return resources.filter(resource => resource.pathway_id === pathwayId);
    }
    return resources;
  }
}

export const storage = new MemStorage();