import { config } from 'dotenv';

config();

export const secretJwt = process.env.SECRET_AUTH;
