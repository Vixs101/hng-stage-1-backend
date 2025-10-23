/**
 * In-Memory Database
 * using a simplee array to store analyzed strings and their properties.
 */

const stringsDB = [];

/**
 * save a new sttring to the db
 * @param {Object} stringData - The string data to be saved.
 * @return {Object} The saved string data.
 */

function saveString(stringData) {
  stringsDB.push(stringData);
  return stringData;
}

/**
 * find string by it's SHA256 hash
 * @param {string} sha256Hash - The SHA256 hash of the string to find.
 * @return {Object|null} The found string data or null if not found.
 */

function findById(id) {
  return stringsDB.find((item) => item.id === id) || null;
}

/**
 * Find a string by it's exact value
 * @param {string} value - The exact string value to find.
 * @return {Object|null} The found string data or null if not found.
 */

function findByValue(value) {
  return stringsDB.find((item) => item.value === value) || null;
}

/**
 * get all strings with optional filtering
 * @param {Object} filter - The filter criteria.
 * @return {Array} An array of matching string data.
 */

function findAll(filter = {}) {
  let results = [...stringsDB];

  if (filter.isPalindrome !== undefined) {
    results = results.filter(
      (item) => item.properties.is_palindrome === filters.is_palindrome
    );
  }

  if (filters.min_length !== undefined) {
    results = results.filter(
      (item) => item.properties.length >= filters.min_length
    );
  }

  if (filters.max_length !== undefined) {
    results = results.filter(
      (item) => item.properties.length <= filters.max_length
    );
  }

  if (filters.word_count !== undefined) {
    results = results.filter(
      (item) => item.properties.word_count === filters.word_count
    );
  }

  if (filters.contains_character !== undefined) {
    results = results.filter((item) =>
      item.value.includes(filters.contains_character)
    );
  }

  return results;
}

/**
 * delete a string by it's value
 * @param {string} value - The exact string value to delete.
 * @return {boolean} True if deletion was successful, false otherwise.
 */

function deletedByValue(value) {
    const index = stringsDB.findIndex(item => item.value === value);

    if (index === -1) {
        return false;
    }

    stringsDB.splice(index, 1);
    return true;
}

/**
 * get count of all string in db
 * @returns {number} The total count of strings in the database.
 */

function count() {
    return stringsDB.length;
}

/**
 * clear all data in the database
 * @returns {void}
 */

function clear() {
    stringsDB.length = 0;
}

module.exports = {
    saveString,
    findById,
    findByValue,
    findAll,
    deletedByValue,
    count,
    clear,
}