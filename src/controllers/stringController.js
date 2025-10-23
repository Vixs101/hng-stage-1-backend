const { analyzeString, generateHash } = require("../services/analyzerServices");
const { parseNLPQuery, hasValidFilters } = require("../services/nlpService");
const db = require("../config/database");

/**
 * POST /strings
 * create and analyze a new string
 */

async function createString(req, res) {
  try {
    const { value } = req.body;

    // checking if value exists
    if (value === undefined || value === null) {
      return res.status(400).json({
        error: "Bad request: 'value' is required",
        message: "Missing required field 'value'",
      });
    }

    // checking if value is a string
    if (typeof value !== "string") {
      return res.status(422).json({
        error: "Unprocessable Entity",
        message: 'Field "value" must be a string',
      });
    }

    // checking if string already exists
    const existingString = db.findByValue(value);
    if (existingString) {
      return res.status(409).json({
        error: "Conflict",
        message: "String already exists in the system",
      });
    }

    // analyzing the string
    const properties = analyzeString(value);

    // creating string object
    const stringData = {
      id: properties.sha256_hash,
      value: value,
      properties: properties,
      created_at: new Date().toISOString(),
    };

    
    if (!stringData.id) {
      console.error("Missing SHA-256 hash in properties:", properties);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to generate string ID",
      });
    }

    // save to db
    db.saveString(stringData);

    return res.status(201).json(stringData);
  } catch (error) {
    console.error("Error creating string:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing the request",
    });
  }
}

/**
 * GET /strings/:value
 * Get a specific string by it's value
 */

async function getString(req, res) {
  try {
    const { value } = req.params;

    // find string in db
    const stringData = db.findByValue(value);

    if (!stringData) {
      return res.status(404).json({
        error: "Not Found",
        message: "String does not exist in the system",
      });
    }

    return res.status(200).json(stringData);
  } catch (error) {
    console.error("Error getting string:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing the request",
    });
  }
}

/**
 * GET /strings
 * Get all strings with optional filtering
 *
 */

async function getAllStrings(req, res) {
  try {
    const filters = {};

    // parse query params
    if (req.query.is_palindrome !== undefined) {
      const value = req.query.is_palindrome.toLowerCase();
      if (value !== "true" && value !== "false") {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid value for is_palindrome. Must be true or false",
        });
      }

      filters.is_palindrome = value === "true";
    }

    if (req.query.min_length !== undefined) {
      const value = parseInt(req.query.min_length);
      if (isNaN(value) || value < 0) {
        return res.status(400).json({
          error: "Bad Request",
          message:
            "Invalid value for min_length. Must be a non-negative integer",
        });
      }
      filters.min_length = value;
    }

    if (req.query.max_length !== undefined) {
      const value = parseInt(req.query.max_length);
      if (isNaN(value) || value < 0) {
        return res.status(400).json({
          error: "Bad Request",
          message:
            "Invalid value for max_length. Must be a non-negative integer",
        });
      }
      filters.max_length = value;
    }

    if (req.query.word_count !== undefined) {
      const value = parseInt(req.query.word_count);
      if (isNaN(value) || value < 0) {
        return res.status(400).json({
          error: "Bad Request",
          message:
            "Invalid value for word_count. Must be a non-negative integer",
        });
      }
      filters.word_count = value;
    }

    if (req.query.contains_character !== undefined) {
      const value = req.query.contains_character;
      if (typeof value !== "string" || value.length !== 1) {
        return res.status(400).json({
          error: "Bad Request",
          message:
            "Invalid value for contains_character. Must be a single character",
        });
      }
      filters.contains_character = value;
    }

    // Query database with filters
    const results = db.findAll(filters);

    return res.status(200).json({
      data: results,
      count: results.length,
      filters_applied: filters,
    });
  } catch (error) {
    console.error("Error getting all strings:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing the request",
    });
  }
}

/**
 * GET /strings/filter-by-natural-language
 * Filter strings using natural language query
 */
async function filterByNaturalLanguage(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        error: "Bad Request",
        message: 'Missing required query parameter: "query"',
      });
    }

    // Parse natural language query
    let parsedFilters;
    try {
      parsedFilters = parseNLPQuery(query);
    } catch (error) {
      return res.status(422).json({
        error: "Unprocessable Entity",
        message: error.message,
      });
    }

    // Check if we extracted any filters
    if (!hasValidFilters(parsedFilters)) {
      return res.status(400).json({
        error: "Bad Request",
        message:
          "Unable to parse natural language query. No recognizable filters found.",
      });
    }

    // Query database with parsed filters
    const results = db.findAll(parsedFilters);

    return res.status(200).json({
      data: results,
      count: results.length,
      interpreted_query: {
        original: query,
        parsed_filters: parsedFilters,
      },
    });
  } catch (error) {
    console.error("Error filtering by natural language:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing the request",
    });
  }
}

/**
 * DELETE /strings/:value
 * Delete a specific string by its value
 */
async function deleteString(req, res) {
  try {
    const { value } = req.params;

    // Try to delete the string
    const deleted = db.deletedByValue(value);

    if (!deleted) {
      return res.status(404).json({
        error: "Not Found",
        message: "String does not exist in the system",
      });
    }

    // Return 204 No Content (no response body)
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting string:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing the request",
    });
  }
}

module.exports = {
  createString,
  getString,
  getAllStrings,
  filterByNaturalLanguage,
  deleteString,
};
