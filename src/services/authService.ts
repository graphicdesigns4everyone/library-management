// Authentication service for library owners
export interface LibraryOwner {
  id: string;
  username: string;
  email: string;
  libraryName: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  libraryName: string;
}

// Simulated database - in production, use a real database
const OWNERS_KEY = 'library_owners';
const CURRENT_USER_KEY = 'current_library_owner';

// Default Cosmic Library account
const DEFAULT_OWNER = {
  id: 'cosmic-library-001',
  username: 'COSMICLIBRARY',
  email: 'Abhiraj15.cs@gmail.com',
  password: 'COSMIC37',
  libraryName: 'Cosmic Library',
  createdAt: new Date().toISOString(),
};

// Initialize with default account and clear all other data
const initializeDefaultAccount = () => {
  // Clear all existing data
  const keysToKeep = [OWNERS_KEY, CURRENT_USER_KEY];
  const allKeys = Object.keys(localStorage);

  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });

  // Set only the default account
  localStorage.setItem(OWNERS_KEY, JSON.stringify([DEFAULT_OWNER]));
};

// Check and initialize on module load
const checkInitialization = () => {
  try {
    const stored = localStorage.getItem(OWNERS_KEY);
    if (!stored) {
      initializeDefaultAccount();
      return [DEFAULT_OWNER];
    }
    const owners = JSON.parse(stored);
    // Check if default account exists
    const hasDefault = owners.some((o: any) => o.username === DEFAULT_OWNER.username);
    if (!hasDefault) {
      initializeDefaultAccount();
      return [DEFAULT_OWNER];
    }
    return owners;
  } catch {
    initializeDefaultAccount();
    return [DEFAULT_OWNER];
  }
};

const getStoredOwners = () => {
  return checkInitialization();
};

export const login = async (credentials: LoginCredentials): Promise<LibraryOwner> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const owners = getStoredOwners();
      const owner = owners.find((o: any) => 
        o.username === credentials.username && o.password === credentials.password
      );
      
      if (owner) {
        const { password, ...ownerWithoutPassword } = owner;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(ownerWithoutPassword));
        resolve(ownerWithoutPassword);
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, 1000);
  });
};

export const register = async (data: RegisterData): Promise<LibraryOwner> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const owners = getStoredOwners();
      
      // Check if username or email already exists
      const existingOwner = owners.find((o: any) => 
        o.username === data.username || o.email === data.email
      );
      
      if (existingOwner) {
        reject(new Error('Username or email already exists'));
        return;
      }
      
      const newOwner = {
        id: Date.now().toString(),
        username: data.username,
        email: data.email,
        password: data.password, // In production, hash this
        libraryName: data.libraryName,
        createdAt: new Date().toISOString(),
      };
      
      const updatedOwners = [...owners, newOwner];
      localStorage.setItem(OWNERS_KEY, JSON.stringify(updatedOwners));
      
      const { password, ...ownerWithoutPassword } = newOwner;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(ownerWithoutPassword));
      resolve(ownerWithoutPassword);
    }, 1000);
  });
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): LibraryOwner | null => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};