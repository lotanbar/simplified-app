export declare const hashPassword: (password: string) => Promise<string>;
export declare const validatePassword: (password: string, hashedPassword: string) => Promise<boolean>;
