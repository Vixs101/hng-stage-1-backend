const express = require("express");
const router = express.Router();
const stringController = require("../controllers/stringController");

/**
 * @route   POST /strings
 * @desc    Create and analyze a new string
 * @access  Public
 */
router.post("/", stringController.createString);

/**
 * @route   GET /strings/filter-by-natural-language
 * @desc    Filter strings using natural language query
 * @access  Public
 * @note    This route MUST come before GET /strings/:value to avoid conflicts
 */
router.get(
  "/filter-by-natural-language",
  stringController.filterByNaturalLanguage
);

/**
 * @route   GET /strings/:value
 * @desc    Get a specific string by its value
 * @access  Public
 */
router.get("/:value", stringController.getString);

/**
 * @route   GET /strings
 * @desc    Get all strings with optional filtering
 * @access  Public
 */
router.get("/", stringController.getAllStrings);

/**
 * @route   DELETE /strings/:value
 * @desc    Delete a specific string by its value
 * @access  Public
 */
router.delete("/:value", stringController.deleteString);

module.exports = router;
