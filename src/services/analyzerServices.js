const crypto = require("crypto");

/**
 * Analyzes a given string and returns its requiree properties.
 * @param {string} inputString - The string to be analyzed.
 * @returns {Object} An object containing the analyzed properties.
 */

function analyzeString(inputString) {
  const length = inputString.length;

  const isPalindrome = checkIsPalindrome(inputString);

  const uniqueCharacters = countUniqueCharacters(inputString);

  const wordCount = countWords(inputString);

  const sha256Hash = generateHash(inputString);

  const characterFrequencyMap = buildFrequencyMap(inputString);

  return {
    length,
    is_palindrome: isPalindrome,
    unique_characters: uniqueCharacters,
    word_count: wordCount,
    sha256_hash: sha256Hash,
    character_frequency_map: characterFrequencyMap,
  };
}

/**
 * Checks if a string is a palindrome (case-insensitive).
 * @param {string} str - The string to check.
 * @returns {boolean} True if the string is a palindrome, false otherwise.
 */

function checkIsPalindrome(str) {
  const normalizedStr = str.toLowerCase();
  const reversedStr = normalizedStr.split("").reverse().join("");
  return normalizedStr === reversedStr;
}

/**
 * Counts the number of unique characters in a string.
 * @param {string} str - The string to analyze.
 * @returns {number} The count of unique characters.
 */

function countUniqueCharacters(str) {
  const uniqueChars = new Set(str);
  return uniqueChars.size;
}

/**
 * Counts the number of words in a string.
 * @param {string} str - The string to analyze.
 * @returns {number} The word count.
 */

function countWords(str) {
  const words = str
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  return words.length;
}

/**
 * Generates a SHA-256 hash of the input string.
 * @param {string} str - The string to hash.
 * @returns {string} The SHA-256 hash in hexadecimal format.
 */

function generateHash(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

/**
 * Builds a frequency map of characters in the string.
 * @param {string} str - The string to analyze.
 * @returns {Object} An object mapping characters to their frequencies.
 */

function buildFrequencyMap(str) {
  const frequencyMap = {};

  for (const char of str) {
    frequencyMap[char] = (frequencyMap[char] || 0) + 1;
  }

  return frequencyMap;
}

module.exports = {
  analyzeString,
  checkIsPalindrome,
  countUniqueCharacters,
  countWords,
  generateHash,
  buildFrequencyMap,
};
