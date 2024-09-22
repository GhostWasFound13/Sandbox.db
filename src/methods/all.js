module.exports = function(db, params, options) {
  
  // Prepare the SQL statement to fetch all entries where ID is not null
  const stmt = db.prepare(`SELECT * FROM ${options.table} WHERE ID IS NOT NULL`);
  
  // Initialize an empty array to store the response
  const response = [];

  // Iterate over the rows returned by the SQL statement
  for (const row of stmt.iterate()) {
    try {
      // Parse the JSON stored in the 'json' column
      let data = JSON.parse(row.json);

      // If the parsed data is still a string (double stringified), parse again
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      // Push the parsed data and its corresponding ID into the response array
      response.push({
        ID: row.ID,
        data
      });
    } catch (error) {
      // Log the error but continue processing other rows
      console.error(`Error parsing data for ID: ${row.ID}`, error);
    }
  }

  // Return the full response array containing all the parsed rows
  return response;
};