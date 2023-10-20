import "reflect-metadata";
import {
  CONNECTION_NAME,
  CONNECTION_TYPE,
  CONNECTION_ENTITIES,
  CONNECTION_MIGRATIONS,
  CONNECTION_SUBSCRIBERS,
  CONNECTION_SYNCHRONIZE,
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_LOGGING,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_CONNECTION_LIMIT,
} from "~src/constants";
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import waitPort from "wait-port";

export async function establishConnection(overrideOptions?: Partial<ConnectionOptions>): Promise<Connection> {
  const defaultOptions: MysqlConnectionOptions = {
    name: CONNECTION_NAME,
    type: CONNECTION_TYPE,
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    synchronize: CONNECTION_SYNCHRONIZE,
    logging: MYSQL_LOGGING,
    entities: CONNECTION_ENTITIES,
    migrations: CONNECTION_MIGRATIONS,
    subscribers: CONNECTION_SUBSCRIBERS,
    extra: {
      connectionLimit: MYSQL_CONNECTION_LIMIT,
      waitForConnections: true,
    },
    cache: true,
  } as MysqlConnectionOptions;

  const options = {
    ...defaultOptions,
    ...overrideOptions,
  } as MysqlConnectionOptions;

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
