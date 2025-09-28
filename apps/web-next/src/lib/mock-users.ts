// Mock user database for development
interface MockUser {
  id: string;
  email: string;
  name: string;
  role: string;
  password: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 'admin-1',
    email: 'admin@oreliya.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: 'user-2',
    email: 'user@oreliya.com',
    name: 'Regular User',
    role: 'user',
    password: 'user123',
  },
];

export function findUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find(user => user.email === email);
}

export function findUserById(id: string): MockUser | undefined {
  return mockUsers.find(user => user.id === id);
}

export function updateUser(id: string, updates: Partial<MockUser>): MockUser | null {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return null;
  
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
  return mockUsers[userIndex];
}

export function addUser(user: Omit<MockUser, 'id'>): MockUser {
  const newUser: MockUser = {
    ...user,
    id: `user-${Date.now()}`,
  };
  mockUsers.push(newUser);
  return newUser;
}
