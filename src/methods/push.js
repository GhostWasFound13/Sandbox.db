// Require lodash's get and set functions for safely accessing and modifying properties
const get = require('lodash/get');
const set = require('lodash/set');

module.exports = function(db, params, options) {

  // Fetch the entry from the database by ID
  let fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id);

  // If no entry is found, create a new row with an empty JSON object
  if (!fetched) {
    db.prepare(`INSERT INTO ${options.table} (ID, json) VALUES (?, ?)`).run(params.id, '{}');
    fetched = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id);
  }

  // Parse the fetched data
  fetched = JSON.parse(fetched.json);

  // Parse the incoming data
  params.data = JSON.parse(params.data);

  // Check if a target (specific key or path) was provided in params.ops
  if (params.ops && params.ops.target) {
    if (typeof fetched !== 'object') throw new TypeError('Cannot push into a non-object.');

    // Get the target array from the fetched object
    let targetArray = get(fetched, params.ops.target);

    // Ensure the target is an array
    if (targetArray === undefined) targetArray = [];
    else if (!Array.isArray(targetArray)) {
      // If the target is not an array, convert it to one
      targetArray = [targetArray];
    } 

    // Push the new data into the target array
    targetArray.push(params.data);

    // Set the updated array back into the fetched object
    set(fetched, params.ops.target, targetArray);
  } else {
    // If no target is specified, ensure the fetched data is an array
    if (fetched === '{}') fetched = [];
    else if (!Array.isArray(fetched)) {
      // Convert the fetched data to an array if it's not already
      fetched = [fetched]; 
    }

    // Push the new data into the root array
    fetched.push(params.data);
  }

  // Stringify the updated data before storing it
  const updatedData = JSON.stringify(fetched);

  // Update the entry with the new data in the database
  db.prepare(`UPDATE ${options.table} SET json = ? WHERE ID = ?`).run(updatedData, params.id);

  // Fetch and return the updated data
  let newData = db.prepare(`SELECT * FROM ${options.table} WHERE ID = ?`).get(params.id).json;

  // Parse the new data before returning it
  newData = JSON.parse(newData);

  // Return the updated data
  return newData;
}