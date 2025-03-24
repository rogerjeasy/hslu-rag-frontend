export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;       
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
  profilePicture?: string;
  bio?: string;
  role: string[]; 
  graduationYear?: number;
  interests?: string[];
  createdAt?: string;
  accountCreatedAt?: string;
  lastLoginAt?: string;
  isActive?: boolean;
  program?: string;
  semester?: number;
  courses?: string[];
  languages?: string[];
  studentId?: string;
  preferences?: string[];
}

// Rest of the interfaces remain the same...
export interface UserCreateDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  role?: UserRole; // Single role for creation
  graduationYear?: number;
  interests?: string[];
  program?: string;
  languages?: string[];
}


export interface UserCreateDTO {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  role?: UserRole; // Single role for creation
  graduationYear?: number;
  interests?: string[];
  program?: string;
  languages?: string[];
}

export interface UserUpdateDTO {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePicture?: string;
  bio?: string;
  graduationYear?: number;
  interests?: string[];
  program?: string;
  languages?: string[];
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  uid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  bio: string;
  role: string[];
  graduationYear: number;
  interests: string[];
  accountCreatedAt: string;
  isActive: boolean;
  program: string;
  languages: string[];
}

export interface TokenDTO {
  access_token: string;
  token_type: string;
  user: UserResponseDTO;
}