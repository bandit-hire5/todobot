import { resolve } from "path";

export const IS_PRODUCTION_MODE = process.env.NODE_ENV === "production";
export const WORKERS_FOLDER = resolve(__dirname, `./workers`);

export const CONNECTION_NAME = "default";
export const CONNECTION_TYPE = "mysql";
export const MYSQL_HOST = process.env.MYSQL_HOST || "localhost";
export const MYSQL_PORT = parseInt(process.env.MYSQL_PORT) || 3306;
export const MYSQL_USER = process.env.MYSQL_USER;
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "todonotes";
export const CONNECTION_SYNCHRONIZE = false;
export const MYSQL_LOGGING = process.env.MYSQL_LOGGING || false;
export const MYSQL_CONNECTION_LIMIT = parseInt(process.env.MYSQL_CONNECTION_LIMIT) || 100;
export const CONNECTION_ENTITIES = [resolve(__dirname, `./entities/**/*.js`)];
export const CONNECTION_MIGRATIONS = [resolve(__dirname, `./migrations/**/*.js`)];
export const CONNECTION_SUBSCRIBERS = [resolve(__dirname, `./subscribers/**/*.js`)];
