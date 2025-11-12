import { User } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string
    }
  }
}

export type ReadingType = "daily" | "weekly" | "monthly" | "compatibility"

export interface TransitData {
  sun?: string;
  moon?: string;
  mercury?: string;
  venus?: string;
  mars?: string;
  jupiter?: string;
  saturn?: string;
  [key: string]: string | undefined;
}
