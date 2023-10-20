module.exports = [
  {
    name: "default",
    type: "postgres",
    url: process.env.DATABASE_URL,
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
