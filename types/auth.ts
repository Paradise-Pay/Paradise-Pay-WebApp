export * from './user';

// Re-export the User type for backward compatibility
export type { AuthUser as User } from './user';
// Re-export the context type for backward compatibility
export type { AuthContextType } from './user';
