import { resolve } from "path";

export const IS_PRODUCTION_MODE = process.env.NODE_ENV === "production";
export const WORKERS_FOLDER = resolve(__dirname, `./workers`);

export const CONNECTION_NAME = "default";
export const CONNECTION_TYPE = "postgres";
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = parseInt(process.env.DB_PORT) || 3306;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE || "todonotes";
export const CONNECTION_SYNCHRONIZE = false;
export const DB_LOGGING = process.env.DB_LOGGING || false;
export const DB_CONNECTION_LIMIT = parseInt(process.env.DB_CONNECTION_LIMIT) || 100;
export const CONNECTION_ENTITIES = [resolve(__dirname, `./entities/**/*.js`)];
export const CONNECTION_MIGRATIONS = [resolve(__dirname, `./migrations/**/*.js`)];
export const CONNECTION_SUBSCRIBERS = [resolve(__dirname, `./subscribers/**/*.js`)];
