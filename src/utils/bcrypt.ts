import { hash, compare } from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, SALT_ROUNDS);
};

export const validatePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return compare(password, hashedPassword);
};