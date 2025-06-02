import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
}

export function generateUserId(): string
{
    return uuidv4();
}