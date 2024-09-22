// Require lodash's set function for safely updating properties
const set = require('lodash/set');

module.exports = function(db, params, options) {
  
  // Fetch the entry from the database by ID
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id);
  
  // If no entry is found, create a new row with an empty JSON object
  if (!fetched) {
    db.prepare(`INSERT INTO ${options.table} (ID, json) VALUES (?, ?)`).run(params.id, '{}');
    fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id);
  }
  
  // Parse the fetched JSON data
  fetched = JSON.parse(fetched.json);

  // Parse the incoming data
  let newData = JSON.parse(params.data);

  // Check if a target (specific key or path) is provided and is working with an object
  if (typeof fetched === 'object' && params.ops.target) {
    // Set the new data at the target location in the fetched object
    set(fetched, params.ops.target, newData);
  } else if (params.ops.target) {
    throw new TypeError('Cannot target a non-object.');
  } else {
    // If no target, replace the root-level data
    fetched = newData;
  }

  // Stringify the updated data before storing it in the database
  const updatedData = JSON.stringify(fetched);

  // Update the database entry with the new data
  db.prepare(`UPDATE ${options.table} SET json = ? WHERE ID = ?`).run(updatedData, params.id);
  
  // Fetch and return the updated data
  let finalData = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id).json;
  
  // Parse the final data before returning
  finalData = JSON.parse(finalData);

  // Return the updated data
  return finalData;
}