// Require lodash's get function for safely accessing properties
const get = require('lodash/get');

module.exports = function(db, params, options) {

  // Fetch the entry from the database by ID
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id);
  
  // If no entry is found, return null
  if (!fetched) return null;
  
  // Parse the stored JSON data
  fetched = JSON.parse(fetched.json);
  
  // If a specific target (nested property) is supplied in params.ops, use lodash's get to retrieve it
  if (params.ops && params.ops.target) {
    fetched = get(fetched, params.ops.target);
    
    // If the target property is undefined, return null to indicate it doesn't exist
    if (fetched === undefined) return null;
  }
  
  // Return the fetched data (either the full object or the specific target property)
  return fetched;
}