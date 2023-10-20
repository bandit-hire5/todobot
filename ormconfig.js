module.exports = [
  {
    name: "default",
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "todonotes",
    synchronize: false,
    logging: process.env.DB_LOGGING || false,
    entities: ["dist/entities/**/*.js"],
    migrations: ["dist/migrations/**/*.js"],
    subscribers: ["dist/subscribers/**/*.js"],
    cli: {
      entitiesDir: "src/entities",
      migrationsDir: "src/migrations",
      subscribersDir: "src/subscribers",
    },
  },
];
