export type UserRole = "USER" | "ADMIN";

export type UserCurrency = "IDR" | "USD";

export type ThemeMode = "light" | "dark" | "system";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  currency: UserCurrency;
  themeMode: ThemeMode;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  accessToken: string;
  refreshToken?: string | null;
  user: UserProfile;
}
