import { config } from "./src/database";

export default config


// criar migration
// npm run knex -- migrate:make name_migration
// executar migration: 
// npm run knex -- migrate:latest
// rollback migration: 
// npm run knex -- migrate:rollback