// Require lodash's get and set functions for property manipulation
const get = require('lodash/get');
const set = require('lodash/set');

module.exports = function(db, params, options) {

  // Fetch entry from the database by ID
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id);

  // If no entry is found, create a new row with an empty JSON object
  if (!fetched) {
    db.prepare(`INSERT INTO ${options.table} (ID, json) VALUES (?, ?)`).run(params.id, '{}');
    fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id);
  }

  // Parse the fetched JSON data (assuming it's a string)
  try {
    fetched = JSON.parse(fetched.json); 
  } catch (err) {
    // Handle the case where the fetched data is not valid JSON
    console.error("Error parsing fetched data:", err);
    fetched = {}; // Default to an empty object if parsing fails
  }

  // Check if a target was supplied
  if (params.ops.target) {
    params.data = JSON.parse(params.data);
    let oldValue = get(fetched, params.ops.target, 0); // Default to 0 if undefined

    if (isNaN(oldValue)) {
      throw new Error('Target is not a number.');
    }

    // Update the value at the target with the subtraction
    set(fetched, params.ops.target, oldValue - params.data);
  } else {
    // Handle root-level subtraction
    if (fetched.json === '{}' || fetched.json === null) {
      fetched.json = 0;
    } else {
      fetched.json = JSON.parse(fetched.json);
    }

    if (isNaN(fetched.json)) {
      throw new Error('Target is not a number.');
    }

    params.data = parseFloat(fetched.json) - parseFloat(params.data);
  }

  // Stringify the updated data before storing it in the database
  const updatedData = JSON.stringify(fetched);

  // Update the entry in the database with the new data
  db.prepare(`UPDATE ${options.table} SET json = ? WHERE ID = ?`).run(updatedData, params.id);

  // Fetch and return the updated data
  let newData = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id).json;

  // Handle empty JSON case or undefined data
  if (newData === '{}' || newData === null || newData === undefined) {
    return null; 
  } else {
    try {
      return JSON.parse(newData);
    } catch (err) {
      console.error("Error parsing new data:", err);
      return null; // Handle potential parsing errors
    }
  }
}