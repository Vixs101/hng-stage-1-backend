/**
 * natural language processing service
 * parses natural language queries into filter objects
 */

/**
 * Parse a natural language query into structured filters
 * @param {string} query - The natural language query
 * @returns {object} Parsed filters object
 */

function parseNLPQuery(query) {
  filters = {};

  const lowercaseQuery = query.toLowerCase();

  if (lowercaseQuery.includes("single word")) {
    filters.word_count = 1;
  }

  // "two words" or "2 words" -> word_count = 2
  const twoWordsMatch = lowercaseQuery.match(/two words|2 words/);
  if (twoWordsMatch) {
    filters.word_count = 2;
  }

  // Generic: "X word" or "X words" where X is a number
  const wordCountMatch = lowercaseQuery.match(/(\d+)\s+words?/);
  if (wordCountMatch) {
    filters.word_count = parseInt(wordCountMatch[1]);
  }

  // Pattern 2: Palindrome
  // "palindrome" or "palindromic"
  if (
    lowercaseQuery.includes("palindrome") ||
    lowercaseQuery.includes("palindromic")
  ) {
    filters.is_palindrome = true;
  }

  // Pattern 3: Length constraints
  // "longer than X" or "greater than X characters"
  const longerThanMatch = lowercaseQuery.match(
    /longer than (\d+)|greater than (\d+)/
  );
  if (longerThanMatch) {
    const threshold = parseInt(longerThanMatch[1] || longerThanMatch[2]);
    filters.min_length = threshold + 1;
  }

  // "shorter than X" or "less than X characters"
  const shorterThanMatch = lowercaseQuery.match(
    /shorter than (\d+)|less than (\d+)/
  );
  if (shorterThanMatch) {
    const threshold = parseInt(shorterThanMatch[1] || shorterThanMatch[2]);
    filters.max_length = threshold - 1;
  }

  // "at least X characters"
  const atLeastMatch = lowercaseQuery.match(/at least (\d+)/);
  if (atLeastMatch) {
    filters.min_length = parseInt(atLeastMatch[1]);
  }

  // "at most X characters"
  const atMostMatch = lowercaseQuery.match(/at most (\d+)/);
  if (atMostMatch) {
    filters.max_length = parseInt(atMostMatch[1]);
  }

  // Pattern 4: Contains character
  // "containing the letter X" or "contains letter X" or "with letter X"
  const containsLetterMatch = lowercaseQuery.match(
    /contain(?:ing|s)? (?:the )?letter ([a-z])|with letter ([a-z])/
  );
  if (containsLetterMatch) {
    filters.contains_character =
      containsLetterMatch[1] || containsLetterMatch[2];
  }

  // "containing X" where X is a single character
  const containsCharMatch = lowercaseQuery.match(/containing ([a-z])\b/);
  if (containsCharMatch) {
    filters.contains_character = containsCharMatch[1];
  }

  // Pattern 5: Special vowel references
  // "first vowel" -> 'a'
  if (lowercaseQuery.includes("first vowel")) {
    filters.contains_character = "a";
  }

  // "last vowel" -> 'u'
  if (lowercaseQuery.includes("last vowel")) {
    filters.contains_character = "u";
  }

  // Check for conflicting filters
  if (
    filters.min_length &&
    filters.max_length &&
    filters.min_length > filters.max_length
  ) {
    throw new Error(
      "Conflicting filters: min_length cannot be greater than max_length"
    );
  }

  return filters;
}

/**
 * validate that the query was parseablee
 * @param {object} filters - The parsed filters object
 * @returns {boolean} True if valid, false otherwise
 */

function hasValidFilters(filters) {
  return Object.keys(filters).length > 0;
}

module.exports = {
  parseNLPQuery,
  hasValidFilters,
};
