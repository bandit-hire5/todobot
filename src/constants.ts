import { resolve } from "path";

export const IS_PRODUCTION_MODE = process.env.NODE_ENV === "production";
export const WORKERS_FOLDER = resolve(__dirname, `./workers`);

export const CONNECTION_NAME = "default";
export const CONNECTION_TYPE = "sqlite";
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "sqlite.db";
export const CONNECTION_SYNCHRONIZE = false;
export const MYSQL_LOGGING = process.env.MYSQL_LOGGING || false;
export const MYSQL_CONNECTION_LIMIT = parseInt(process.env.MYSQL_CONNECTION_LIMIT) || 100;
export const CONNECTION_ENTITIES = [resolve(__dirname, `./entities/**/*.js`)];
export const CONNECTION_MIGRATIONS = [resolve(__dirname, `./migrations/**/*.js`)];
export const CONNECTION_SUBSCRIBERS = [resolve(__dirname, `./subscribers/**/*.js`)];
