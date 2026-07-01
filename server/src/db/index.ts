import { Pool } from "pg";
import config from "../config";

const db = new Pool({
  connectionString: config.databaseUrl,
});

export default db;
