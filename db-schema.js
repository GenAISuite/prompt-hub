const { Client } = require('pg');
require('dotenv').config(); // Load environment variables

// Extract the database name from the connection URL
const DATABASE_URL  = 'postgres://postgres:postgres@localhost:5432/prompt_hub';
const DB_NAME = "prompt_hub";

// Connection string for connecting to the PostgreSQL server without the target database
const connectionStringWithoutDB = DATABASE_URL.replace(`/${DB_NAME}`, '/postgres');

// SQL query to check if the target database exists
const checkDatabaseExistsQuery = `
  SELECT 1 AS result
  FROM pg_database
  WHERE datname = '${DB_NAME}';
`;

// SQL query to create the database if it doesn't exist
const createDatabaseQuery = `CREATE DATABASE "${DB_NAME}";`;

// SQL query to create the User table
const createUserTable = `
  CREATE TABLE IF NOT EXISTS "prompt_user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  );
`;

// SQL query to create the Prompt table
const createPromptTable = `
  CREATE TABLE IF NOT EXISTS "prompt" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    prompt TEXT NOT NULL,
    updated_on TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    edit_access TEXT[],
    CONSTRAINT fk_user FOREIGN KEY(updated_by) REFERENCES "prompt_user"(id)
  );
`;

// Function to create the database if it doesn't exist
const createDatabaseIfNotExists = async () => {
  const client = new Client({ connectionString: connectionStringWithoutDB });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL server (without specific database).");

    // Check if the database exists
    const result = await client.query(checkDatabaseExistsQuery);
    if (result.rows.length === 0) {
      // Database does not exist, create it
      await client.query(createDatabaseQuery);
      console.log(`Database "${DB_NAME}" created successfully.`);
    } else {
      console.log(`Database "${DB_NAME}" already exists.`);
    }
  } catch (error) {
    console.error("Error checking/creating database:", error.stack);
  } finally {
    await client.end();
  }
};

// Function to run the schema update (create tables)
const runSchemaUpdate = async () => {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log(`Connected to database "${DB_NAME}".`);

    // Execute queries to create the tables if they don't exist
    await client.query(createUserTable);
    console.log("User table checked/created.");

    await client.query(createPromptTable);
    console.log("Prompt table checked/created.");
    
  } catch (error) {
    console.error("Error updating schema:", error.stack);
  } finally {
    await client.end();
    console.log("Disconnected from the database.");
  }
};

// Main function to run both database creation and schema updates
const main = async () => {
  await createDatabaseIfNotExists();  // Step to create the database if it doesn't exist
  await runSchemaUpdate();            // Step to update the schema (create tables)
};

main();