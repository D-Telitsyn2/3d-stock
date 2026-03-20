import 'express';

declare global {
  namespace Express {
    interface Request {
      /** Clerk user id (`sub` from verified session JWT) */
      clerkUserId?: string;
    }
  }
}

export {};
