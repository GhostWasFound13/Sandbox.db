// Require lodash's unset function to handle deep object property deletion
const unset = require('lodash/unset');

module.exports = function(db, params, options) {
  
  // Fetch the entry from the database by ID
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id);
  
  // If the entry doesn't exist, return false
  if (!fetched) return false;
  
  // Parse the stored JSON data
  fetched = JSON.parse(fetched.json);
  
  // If a specific target property is specified and the fetched data is an object
  if (typeof fetched === 'object' && params.ops.target) {
    // Use lodash's unset to remove the target property
    const success = unset(fetched, params.ops.target);
    
    // If the property was successfully deleted, update the database
    if (success) {
      db.prepare(`UPDATE ${options.table} SET json = ? WHERE ID = ?`).run(JSON.stringify(fetched), params.id);
      return true;
    } else {
      // If the property doesn't exist in the object, return false
      return false;
    }
  }
  
  // If target is provided but the fetched data isn't an object, throw an error
  if (params.ops.target && typeof fetched !== 'object') {
    throw new TypeError('Target specified but the data is not an object.');
  }

  // If no target is provided, delete the entire entry
  db.prepare(`DELETE FROM ${options.table} WHERE ID = ?`).run(params.id);
  
  // Return true indicating successful deletion
  return true;
};