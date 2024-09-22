// Require lodash's get function for safely accessing properties
const get = require('lodash/get');

module.exports = function(db, params, options) {

  // Fetch the entry from the database by ID
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id);
  
  // If no entry is found, return false
  if (!fetched) return false;

  // Parse the stored JSON data
  fetched = JSON.parse(fetched.json);

  // If a target (specific key or path) is supplied in params.ops, check its existence
  if (params.ops && params.ops.target) {
    fetched = get(fetched, params.ops.target);
  }

  // Return true if the fetched value is not undefined, otherwise return false
  return (typeof fetched !== 'undefined');
}