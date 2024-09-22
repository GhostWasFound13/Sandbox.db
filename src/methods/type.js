// Require lodash's get function for property retrieval
const get = require('lodash/get');

module.exports = function(db, params, options) {

  // Fetch entry from the database by ID
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id);
  
  // If no entry is found, return null
  if (!fetched) return null;

  // Parse the JSON data
  fetched = JSON.parse(fetched.json);

  // Check if a target property is supplied
  if (params.ops.target) {
    fetched = get(fetched, params.ops.target); // Get property using dot notation
  }

  // Return the type of the fetched data
  return typeof fetched;
}