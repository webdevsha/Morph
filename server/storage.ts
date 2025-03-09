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

    // Initialize with governance course sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Governance Track Pathways (based on AI Safety Fundamentals)
    const introToGovernance: Pathway = {
      id: 1,
      title: "Introduction to AI Governance",
      description: "Understanding the landscape of AI governance and policy",
      difficulty: "beginner",
      duration: "2 weeks",
      category: "governance",
      persona: "policymaker",
      steps: [
        { title: "AI Governance Landscape", description: "Overview of key stakeholders and frameworks" },
        { title: "Current Challenges", description: "Major challenges in AI governance" }
      ],
      dependencies: [],
      skills_required: [],
      skills_gained: ["governance-basics", "policy-frameworks"],
      resources: [
        {
          title: "AI Governance: A Research Agenda",
          type: "paper",
          url: "https://example.com/governance-agenda",
          provider: "AI Safety Fundamentals"
        }
      ],
      related_concepts: [
        { id: "regulation", title: "Regulation Approaches" },
        { id: "ethics", title: "AI Ethics" }
      ],
      ecosystem_links: [
        {
          title: "Global Partnership on AI",
          url: "https://gpai.ai",
          type: "organization"
        },
        {
          title: "IEEE AI Standards",
          url: "https://standards.ieee.org",
          type: "standards"
        }
      ],
      completion_criteria: {
        required_readings: true,
        assessment: true
      }
    };

    const policyFrameworks: Pathway = {
      id: 2,
      title: "AI Policy Frameworks",
      description: "Deep dive into existing and proposed AI policy frameworks",
      difficulty: "intermediate",
      duration: "3 weeks",
      category: "governance",
      persona: "policymaker",
      steps: [
        { title: "International Frameworks", description: "Global AI governance initiatives" },
        { title: "National Policies", description: "Country-specific AI strategies" }
      ],
      dependencies: [1],
      skills_required: ["governance-basics"],
      skills_gained: ["policy-analysis", "framework-development"],
      resources: [
        {
          title: "EU AI Act Overview",
          type: "analysis",
          url: "https://example.com/eu-ai-act",
          provider: "AI Safety Fundamentals"
        }
      ],
      related_concepts: [
        { id: "compliance", title: "Regulatory Compliance" },
        { id: "impact", title: "Impact Assessment" }
      ],
      ecosystem_links: [
        {
          title: "OECD AI Policy Observatory",
          url: "https://oecd.ai",
          type: "resource"
        }
      ],
      completion_criteria: {
        case_study: true,
        policy_brief: true
      }
    };

    this.pathways.set(1, introToGovernance);
    this.pathways.set(2, policyFrameworks);
  }

  // Storage interface methods
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
    const user: User = { ...insertUser, id, progress: {}, skills: [] };
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

  async getPathways(persona?: string): Promise<Pathway[]> {
    const pathways = Array.from(this.pathways.values());
    if (persona) {
      return pathways.filter(p => p.persona === persona);
    }
    return pathways;
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