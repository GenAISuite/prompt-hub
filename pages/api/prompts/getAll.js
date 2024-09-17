// pages/api/prompts/index.js
import pool from "../../../lib/db"; // Assuming you have a db.js file for database connection

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Assuming userId is passed as a query parameter
    const { page, size, query,userId } = req.body;
    const offset = page * size;
    console.log("userId:", userId);
    var updatedQuery = query ? `%${query}%` : "";
    
    try {
      // where user have edit_access
      if(updatedQuery === ""){
      const result = await pool.query(
        "SELECT * FROM prompt WHERE $1 = ANY(edit_access) ORDER BY updated_on DESC LIMIT $2 OFFSET $3 ",
        [userId, size, offset]
      );
      res.status(200).json(result.rows);
    }else{
      const result = await pool.query(
        "SELECT * FROM prompt WHERE $1 = ANY(edit_access) AND (name LIKE $2 OR prompt LIKE $2) ORDER BY updated_on DESC LIMIT $3 OFFSET $4 ",
        [userId, updatedQuery, size, offset]
      );
      res.status(200).json(result.rows);
    }
      //
      // result.rows.map
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  }
}

// /Users/ashokreddy/repo/prompt-hub/pages/api/prompts/index.js
