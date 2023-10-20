import "reflect-metadata";
import {
  CONNECTION_NAME,
  CONNECTION_TYPE,
  CONNECTION_ENTITIES,
  CONNECTION_MIGRATIONS,
  CONNECTION_SUBSCRIBERS,
  CONNECTION_SYNCHRONIZE,
  DATABASE_URL,
  DB_DATABASE,
  DB_HOST,
  DB_LOGGING,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  DB_CONNECTION_LIMIT,
  DB_SSL,
} from "~src/constants";
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import waitPort from "wait-port";

export async function establishConnection(overrideOptions?: Partial<ConnectionOptions>): Promise<Connection> {
  const defaultOptions: PostgresConnectionOptions = {
    url: DATABASE_URL,
    name: CONNECTION_NAME,
    type: CONNECTION_TYPE,
    synchronize: CONNECTION_SYNCHRONIZE,
    logging: DB_LOGGING,
    entities: CONNECTION_ENTITIES,
    migrations: CONNECTION_MIGRATIONS,
    subscribers: CONNECTION_SUBSCRIBERS,
    extra: {
      connectionLimit: DB_CONNECTION_LIMIT,
      waitForConnections: true,
    },
    cache: true,
  } as PostgresConnectionOptions;

  const options = {
    ...defaultOptions,
    ...overrideOptions,
  } as PostgresConnectionOptions;

  try {
    await waitPort({
      host: options.host,
      port: options.port,
    });
  } catch (e) {
    process.exit(e.code);
  }

  return createConnection(options);
}
