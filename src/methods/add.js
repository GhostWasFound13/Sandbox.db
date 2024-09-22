// Import lodash functions for handling deep object manipulation
const get = require('lodash/get');
const set = require('lodash/set');

module.exports = function(db, params, options) {

  // Fetch the entry from the database using the given ID
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id);

  // If no entry exists for the given ID, insert a new empty row
  if (!fetched) {
    db.prepare(`INSERT INTO ${options.table} (ID, json) VALUES (?, ?)`).run(params.id, '{}');
    fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id); 
  }

  // Parse the fetched JSON data
  fetched = JSON.parse(fetched.json);

  // Check if a target (dot notation) was supplied, meaning we're modifying a nested value
  if (params.ops.target) {
    params.data = JSON.parse(params.data); // Parse the incoming data
    let oldValue = get(fetched, params.ops.target); // Get the value from the nested object

    // If no value was found, default it to 0
    if (oldValue === undefined) oldValue = 0;

    // Ensure the current value is a number before proceeding
    if (isNaN(oldValue)) {
      throw new Error(`Data @ ID: "${params.id}" is not a number. Found: ${oldValue}, Expected: number.`);
    }

    // Add the incoming data to the existing value
    set(fetched, params.ops.target, oldValue + params.data);

  } else {
    // If no target was supplied, handle the root value directly
    // If the fetched data is an empty object, set it to 0
    if (fetched === '{}') {
      fetched = 0;
    } else if (typeof fetched === 'object') {
      // If the fetched data is an object, handle it as a nested value
      fetched = get(fetched, params.ops.target); 
      if (fetched === undefined) {
        fetched = 0;
      } else if (isNaN(fetched)) {
        throw new Error(`Data @ ID: "${params.id}" is not a number. Found: ${fetched}, Expected: number.`);
      }
    } else if (isNaN(fetched)) {
      // If the fetched data is not an object and is not a number, throw an error
      throw new Error(`Data @ ID: "${params.id}" is not a number. Found: ${fetched}, Expected: number.`);
    }

    // Add the incoming data to the existing root value
    fetched = parseFloat(fetched) + parseFloat(params.data);
  }

  // Stringify the updated data before saving it back to the database
  const updatedData = typeof fetched === 'string' ? fetched : JSON.stringify(fetched);

  // Update the entry in the database with the new data
  db.prepare(`UPDATE ${options.table} SET json = ? WHERE ID = ?`).run(updatedData, params.id);

  // Fetch the updated entry to return
  const newData = db.prepare(`SELECT json FROM ${options.table} WHERE ID = ?`).get(params.id).json;

  // Return the updated data or null if it is an empty object
  return newData === '{}' ? null : JSON.parse(newData);
};