/**
 * quick.db Type Definitions
 */

declare module 'sandbox.db' {
    export interface Options {
        target?: string | null;
        table?: string;
    }

    export type ValueData = string | object | number | null | boolean | bigint | symbol | any[];

    /**
     * Package version.
     * ```ts
     * console.log(require('quick.db').version);
     * ```
     */
    const version: string;

    /**
     * Fetches data from a specified key in the database.
     * @param key The key to fetch data from (supports dot notation).
     * @param ops Options for the request.
     * @returns The data associated with the key.
     */
    function fetch(key: string, ops?: Options): any;

    /**
     * Fetches data from a specified key in the database (alias of fetch).
     * @param key The key to fetch data from (supports dot notation).
     * @param ops Options for the request.
     * @returns The data associated with the key.
     */
    function get(key: string, ops?: Options): any;

    /**
     * Sets new data for a specified key in the database.
     * @param key The key to set data for (supports dot notation).
     * @param value The value to set.
     * @param ops Options for the request.
     * @returns The updated data.
     */
    function set(key: string, value: ValueData, ops?: Options): any;

    /**
     * Adds a number to a specified key in the database.
     * @param key The key to add to (supports dot notation).
     * @param value The number to add.
     * @param ops Options for the request.
     * @returns The updated data.
     */
    function add(key: string, value: number, ops?: Options): any;

    /**
     * Subtracts a number from a specified key in the database.
     * @param key The key to subtract from (supports dot notation).
     * @param value The number to subtract.
     * @param ops Options for the request.
     * @returns The updated data.
     */
    function subtract(key: string, value: number, ops?: Options): any;

    /**
     * Pushes a value into an array at a specified key in the database.
     * @param key The key to push to (supports dot notation).
     * @param value The value to push.
     * @param ops Options for the request.
     * @returns The updated array.
     */
    function push(key: string, value: ValueData, ops?: Options): any[];

    /**
     * Checks if a specified key exists in the database.
     * @param key The key to check (supports dot notation).
     * @param ops Options for the request.
     * @returns True if the key exists, false otherwise.
     */
    function has(key: string, ops?: Options): boolean;

    /**
     * Checks if a specified key exists in the database (alias of has).
     * @param key The key to check (supports dot notation).
     * @param ops Options for the request.
     * @returns True if the key exists, false otherwise.
     */
    function includes(key: string, ops?: Options): boolean;

    /**
     * Fetches all entries from the active table.
     * @param ops Options for the request.
     * @returns An array of entries in the format { ID: string; data: any; }.
     */
    function all(ops?: Options): { ID: string; data: any }[];

    /**
     * Fetches all entries from the active table (alias of all).
     * @param ops Options for the request.
     * @returns An array of entries in the format { ID: string; data: any; }.
     */
    function fetchAll(ops?: Options): { ID: string; data: any }[];

    /**
     * Deletes a specified key from the database.
     * @param key The key to delete (supports dot notation).
     * @param ops Options for the request.
     * @returns True if deletion was successful, false otherwise.
     */
    function del(key: string, ops?: Options): boolean;

    /**
     * Gets the type of value associated with a specified key.
     * @param key The key to check (supports dot notation).
     * @param ops Options for the request.
     * @returns The type of the value as a string.
     */
    function dataType(key: string, ops?: Options): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

    class Table {
        tableName: string;

        /**
         * Creates a new instance of a table.
         * @param tableName The name of the table.
         * @param options Options for the table.
         */
        constructor(tableName: string, options?: object);

        /**
         * Sets new data for a specified key in the table.
         * @param key The key to set data for (supports dot notation).
         * @param value The value to set.
         * @param ops Options for the request.
         * @returns The updated data.
         */
        set(key: string, value: ValueData, ops?: Options): any;

        /**
         * Fetches data from a specified key in the table.
         * @param key The key to fetch data from (supports dot notation).
         * @param ops Options for the request.
         * @returns The data associated with the key.
         */
        get(key: string, ops?: Options): any;

        /**
         * Fetches data from a specified key in the table (alias of get).
         * @param key The key to fetch data from (supports dot notation).
         * @param ops Options for the request.
         * @returns The data associated with the key.
         */
        fetch(key: string, ops?: Options): any;

        /**
         * Adds a number to a specified key in the table.
         * @param key The key to add to (supports dot notation).
         * @param value The number to add.
         * @param ops Options for the request.
         * @returns The updated data.
         */
        add(key: string, value: number, ops?: Options): any;

        /**
         * Subtracts a number from a specified key in the table.
         * @param key The key to subtract from (supports dot notation).
         * @param value The number to subtract.
         * @param ops Options for the request.
         * @returns The updated data.
         */
        subtract(key: string, value: number, ops?: Options): any;

        /**
         * Pushes a value into an array at a specified key in the table.
         * @param key The key to push to (supports dot notation).
         * @param value The value to push.
         * @param ops Options for the request.
         * @returns The updated array.
         */
        push(key: string, value: ValueData, ops?: Options): any[];

        /**
         * Checks if a specified key exists in the table.
         * @param key The key to check (supports dot notation).
         * @param ops Options for the request.
         * @returns True if the key exists, false otherwise.
         */
        has(key: string, ops?: Options): boolean;

        /**
         * Checks if a specified key exists in the table (alias of has).
         * @param key The key to check (supports dot notation).
         * @param ops Options for the request.
         * @returns True if the key exists, false otherwise.
         */
        includes(key: string, ops?: Options): boolean;

        /**
         * Fetches all entries from the active table.
         * @param ops Options for the request.
         * @returns An array of entries in the format { ID: string; data: any; }.
         */
        all(ops?: Options): { ID: string; data: any }[];

        /**
         * Fetches all entries from the active table (alias of all).
         * @param ops Options for the request.
         * @returns An array of entries in the format { ID: string; data: any; }.
         */
        fetchAll(ops?: Options): { ID: string; data: any }[];

        /**
         * Deletes a specified key from the table.
         * @param key The key to delete (supports dot notation).
         * @param ops Options for the request.
         * @returns True if deletion was successful, false otherwise.
         */
        delete(key: string, ops?: Options): boolean;
    }

    export {
        fetch,
        get,
        set,
        add,
        subtract,
        push,
        has,
        includes,
        all,
        fetchAll,
        del as delete,
        dataType as type,
        Table as table,
        version
    };
}