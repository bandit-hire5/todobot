module.exports = [
  {
    name: "default",
    type: "sqlite",
    database: process.env.MYSQL_DATABASE || "default.db",
    synchronize: false,
    logging: process.env.MYSQL_LOGGING || false,
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
