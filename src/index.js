module.exports = function(file) {
    const Database = require("better-sqlite3");
    let db = new Database(file || "./json.sqlite");

    const methods = {
        fetch: require("./methods/fetch.js"),
        set: require("./methods/set.js"),
        add: require("./methods/add.js"),
        subtract: require("./methods/subtract.js"),
        push: require("./methods/push.js"),
        delete: require("./methods/delete.js"),
        has: require("./methods/has.js"),
        all: require("./methods/all.js"),
        type: require("./methods/type"),
    };

    const module = {
        version: require("../package.json").version,

        fetch(key, ops) {
            if (!key) throw new TypeError("No key specified.");
            return arbitrate("fetch", { id: key, ops: ops || {} });
        },
        get(key, ops) {
            if (!key) throw new TypeError("No key specified.");
            return arbitrate("fetch", { id: key, ops: ops || {} });
        },
        set(key, value, ops) {
            if (!key) throw new TypeError("No key specified.");
            if (value === undefined) throw new TypeError("No value specified.");
            return arbitrate("set", { id: key, data: value, ops: ops || {} });
        },
        add(key, value, ops) {
            if (!key) throw new TypeError("No key specified.");
            if (isNaN(value)) throw new TypeError("Must specify a value to add.");
            return arbitrate("add", { id: key, data: value, ops: ops || {} });
        },
        subtract(key, value, ops) {
            if (!key) throw new TypeError("No key specified.");
            if (isNaN(value)) throw new TypeError("Must specify a value to subtract.");
            return arbitrate("subtract", { id: key, data: value, ops: ops || {} });
        },
        push(key, value, ops) {
            if (!key) throw new TypeError("No key specified.");
            if (value === undefined) throw new TypeError("Must specify a value to push.");
            return arbitrate("push", { id: key, data: value, ops: ops || {} });
        },
        delete(key, ops) {
            if (!key) throw new TypeError("No key specified.");
            return arbitrate("delete", { id: key, ops: ops || {} });
        },
        has(key, ops) {
            if (!key) throw new TypeError("No key specified.");
            return arbitrate("has", { id: key, ops: ops || {} });
        },
        includes(key, ops) {
            if (!key) throw new TypeError("No key specified.");
            return arbitrate("has", { id: key, ops: ops || {} });
        },
        all(ops) {
            return arbitrate("all", { ops: ops || {} });
        },
        fetchAll(ops) {
            return arbitrate("all", { ops: ops || {} });
        },
        type(key, ops) {
            if (!key) throw new TypeError("No key specified.");
            return arbitrate("type", { id: key, ops: ops || {} });
        },
        table(tableName, options = {}) {
            if (typeof tableName !== "string") throw new TypeError("Table name must be a string.");
            if (tableName.includes(" ")) throw new TypeError("Table name cannot include spaces.");
            this.tableName = tableName;

            Object.assign(this, {
                fetch(key, ops) {
                    if (!key) throw new TypeError("No key specified.");
                    return arbitrate("fetch", { id: key, ops: ops || {} }, this.tableName);
                },
                get(key, ops) {
                    if (!key) throw new TypeError("No key specified.");
                    return arbitrate("fetch", { id: key, ops: ops || {} }, this.tableName);
                },
                set(key, value, ops) {
                    if (!key) throw new TypeError("No key specified.");
                    if (value === undefined) throw new TypeError("No value specified.");
                    return arbitrate("set", { id: key, data: value, ops: ops || {} }, this.tableName);
                },
                add(key, value, ops) {
                    if (!key) throw new TypeError("No key specified.");
                    if (isNaN(value)) throw new TypeError("Must specify a value to add.");
                    return arbitrate("add", { id: key, data: value, ops: ops || {} }, this.tableName);
                },
                subtract(key, value, ops) {
                    if (!key) throw new TypeError("No key specified.");
                    if (isNaN(value)) throw new TypeError("Must specify a value to subtract.");
                    return arbitrate("subtract", { id: key, data: value, ops: ops || {} }, this.tableName);
                },
                push(key, value, ops) {
                    if (!key) throw new TypeError("No key specified.");
                    if (value === undefined) throw new TypeError("Must specify a value to push.");
                    return arbitrate("push", { id: key, data: value, ops: ops || {} }, this.tableName);
                },
                delete(key, ops) {
                    if (!key) throw new TypeError("No key specified.");
                    return arbitrate("delete", { id: key, ops: ops || {} }, this.tableName);
                },
                has(key, ops) {
                    if (!key) throw new TypeError("No key specified.");
                    return arbitrate("has", { id: key, ops: ops || {} }, this.tableName);
                },
                includes(key, ops) {
                    if (!key) throw new TypeError("No key specified.");
                    return arbitrate("has", { id: key, ops: ops || {} }, this.tableName);
                },
                fetchAll(ops) {
                    return arbitrate("all", { ops: ops || {} }, this.tableName);
                },
                all(ops) {
                    return arbitrate("all", { ops: ops || {} }, this.tableName);
                }
            });
        }
    };

    function arbitrate(method, params, tableName) {
        if (!['string', 'number'].includes(typeof params.id)) throw new TypeError("params.id should be a string or number");
        if (typeof params.id === 'number') params.id = params.id.toString();

        const options = {
            table: tableName || params.ops.table || "json",
        };

        db.prepare(`CREATE TABLE IF NOT EXISTS ${options.table} (ID TEXT, json TEXT)`).run();

        if (params.ops.target && params.ops.target[0] === ".")
            params.ops.target = params.ops.target.slice(1);
        if (params.data === Infinity) throw new TypeError(`Cannot set Infinity into the database @ ID: ${params.id}`);

        try {
            params.data = JSON.stringify(params.data);
        } catch (e) {
            throw new TypeError(`Invalid input @ ID: ${params.id}\nError: ${e.message}`);
        }

        if (params.id.includes(".")) {
            const unparsed = params.id.split(".");
            params.id = unparsed.shift();
            params.ops.target = unparsed.join(".");
        }

        return methods[method](db, params, options);
    }

    return module;
};