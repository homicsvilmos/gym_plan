import { UserProfile, WorkoutDay, GymMachine } from './types';

export interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  profile?: UserProfile;
  workoutPlan?: WorkoutDay[];
  equipment?: GymMachine[];
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

// Initialize default admin user
export function initializeUsers(): User[] {
  const stored = localStorage.getItem('gymUsers');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Create default admin user
  const defaultUsers: User[] = [
    {
      id: 'admin-vili',
      username: 'Vili',
      password: '123456',
      isAdmin: true,
    }
  ];
  
  localStorage.setItem('gymUsers', JSON.stringify(defaultUsers));
  return defaultUsers;
}

export function getUsers(): User[] {
  const stored = localStorage.getItem('gymUsers');
  if (!stored) {
    return initializeUsers();
  }
  return JSON.parse(stored);
}

export function saveUsers(users: User[]): void {
  localStorage.setItem('gymUsers', JSON.stringify(users));
}

export function authenticateUser(username: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
}

export function createUser(username: string, password: string, isAdmin: boolean = false): User | null {
  const users = getUsers();
  
  // Check if username already exists
  if (users.some(u => u.username === username)) {
    return null;
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    password,
    isAdmin,
  };
  
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function deleteUser(userId: string): boolean {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== userId);
  
  if (filtered.length === users.length) {
    return false;
  }
  
  saveUsers(filtered);
  return true;
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) {
    return null;
  }
  
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return users[index];
}

export function grantAdminRights(userId: string): User | null {
  return updateUser(userId, { isAdmin: true });
}

export function revokeAdminRights(userId: string): User | null {
  return updateUser(userId, { isAdmin: false });
}

export function saveUserData(userId: string, data: { profile?: UserProfile; workoutPlan?: WorkoutDay[]; equipment?: GymMachine[] }): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...data };
    saveUsers(users);
  }
}

export function loadUserData(userId: string): { profile?: UserProfile; workoutPlan?: WorkoutDay[]; equipment?: GymMachine[] } {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return {};
  }
  
  return {
    profile: user.profile,
    workoutPlan: user.workoutPlan,
    equipment: user.equipment,
  };
}
