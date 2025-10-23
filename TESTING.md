# 🧪 Testing Guide for String Analyzer API

This guide provides comprehensive testing steps for all API endpoints.

---

## Quick Start Testing

### Step 1: Start the Server
```bash
npm run dev
```

You should see:
```
=================================
String Analyzer API Started
Server running on port 3000
Environment: development
URL: http://localhost:3000
=================================
```

### Step 2: Test Root Endpoint
```bash
curl http://localhost:3000/
```

Expected response:
```json
{
  "message": "String Analyzer API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

## 📋 Endpoint Testing Checklist

### ✅ POST /strings (Create String)

#### Test 1: Create Valid String
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'
```

**Expected:** `201 Created`
```json
{
  "id": "...",
  "value": "racecar",
  "properties": {
    "length": 7,
    "is_palindrome": true,
    "unique_characters": 4,
    "word_count": 1,
    "sha256_hash": "...",
    "character_frequency_map": {
      "r": 2,
      "a": 2,
      "c": 2,
      "e": 1
    }
  },
  "created_at": "..."
}
```

#### Test 2: Create String with Spaces
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "hello world"}'
```

**Expected:** `201 Created` with `word_count: 2`

#### Test 3: Missing "value" Field (Error Test)
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:** `400 Bad Request`
```json
{
  "error": "Bad Request",
  "message": "Missing required field: \"value\""
}
```

#### Test 4: Non-String Value (Error Test)
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": 123}'
```

**Expected:** `422 Unprocessable Entity`
```json
{
  "error": "Unprocessable Entity",
  "message": "Field \"value\" must be a string"
}
```

#### Test 5: Duplicate String (Error Test)
```bash
# Create first time
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "duplicate"}'

# Try to create again
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "duplicate"}'
```

**Expected (second request):** `409 Conflict`
```json
{
  "error": "Conflict",
  "message": "String already exists in the system"
}
```

---

### ✅ GET /strings/:value (Get Specific String)

#### Test 6: Get Existing String
```bash
curl http://localhost:3000/strings/racecar
```

**Expected:** `200 OK` with full string data

#### Test 7: Get String with Spaces (URL Encoding)
```bash
curl "http://localhost:3000/strings/hello%20world"
```

**Expected:** `200 OK` with full string data

#### Test 8: Get Non-Existent String (Error Test)
```bash
curl http://localhost:3000/strings/nonexistent
```

**Expected:** `404 Not Found`
```json
{
  "error": "Not Found",
  "message": "String does not exist in the system"
}
```

---

### ✅ GET /strings (Get All Strings with Filters)

#### Test 9: Get All Strings (No Filters)
```bash
curl http://localhost:3000/strings
```

**Expected:** `200 OK`
```json
{
  "data": [ ... ],
  "count": 3,
  "filters_applied": {}
}
```

#### Test 10: Filter by Palindrome
```bash
curl "http://localhost:3000/strings?is_palindrome=true"
```

**Expected:** Only palindromic strings returned

#### Test 11: Filter by Minimum Length
```bash
curl "http://localhost:3000/strings?min_length=10"
```

**Expected:** Only strings with 10+ characters

#### Test 12: Filter by Maximum Length
```bash
curl "http://localhost:3000/strings?max_length=5"
```

**Expected:** Only strings with ≤5 characters

#### Test 13: Filter by Word Count
```bash
curl "http://localhost:3000/strings?word_count=2"
```

**Expected:** Only strings with exactly 2 words

#### Test 14: Filter by Contains Character
```bash
curl "http://localhost:3000/strings?contains_character=a"
```

**Expected:** Only strings containing the letter 'a'

#### Test 15: Multiple Filters
```bash
curl "http://localhost:3000/strings?is_palindrome=true&min_length=5"
```

**Expected:** Palindromes with 5+ characters

#### Test 16: Invalid Filter Value (Error Test)
```bash
curl "http://localhost:3000/strings?min_length=abc"
```

**Expected:** `400 Bad Request`
```json
{
  "error": "Bad Request",
  "message": "Invalid value for min_length. Must be a non-negative integer"
}
```

---

### ✅ GET /strings/filter-by-natural-language (NLP Filtering)

#### Test 17: Single Word Palindromes
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"
```

**Expected:** `200 OK`
```json
{
  "data": [ ... ],
  "count": 1,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

#### Test 18: Longer Than Query
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20longer%20than%2010%20characters"
```

**Expected:** `parsed_filters: { min_length: 11 }`

#### Test 19: Contains Letter Query
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20containing%20the%20letter%20z"
```

**Expected:** `parsed_filters: { contains_character: "z" }`

#### Test 20: First Vowel Query
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=palindromic%20strings%20containing%20the%20first%20vowel"
```

**Expected:** `parsed_filters: { is_palindrome: true, contains_character: "a" }`

#### Test 21: Missing Query Parameter (Error Test)
```bash
curl "http://localhost:3000/strings/filter-by-natural-language"
```

**Expected:** `400 Bad Request`

#### Test 22: Unparseable Query (Error Test)
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=xyz123"
```

**Expected:** `400 Bad Request` with message about unable to parse

---

### ✅ DELETE /strings/:value (Delete String)

#### Test 23: Delete Existing String
```bash
curl -X DELETE http://localhost:3000/strings/racecar
```

**Expected:** `204 No Content` (no response body)

#### Test 24: Verify Deletion
```bash
curl http://localhost:3000/strings/racecar
```

**Expected:** `404 Not Found`

#### Test 25: Delete Non-Existent String (Error Test)
```bash
curl -X DELETE http://localhost:3000/strings/nonexistent
```

**Expected:** `404 Not Found`

---

## 🔄 Complete Test Flow

Run this complete test sequence:

```bash
# 1. Create test data
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "racecar"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "hello world"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "madam"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "test string here"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "a"}'

# 2. Get all strings
curl http://localhost:3000/strings

# 3. Filter palindromes
curl "http://localhost:3000/strings?is_palindrome=true"

# 4. Get specific string
curl http://localhost:3000/strings/racecar

# 5. Natural language query
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"

# 6. Delete a string
curl -X DELETE http://localhost:3000/strings/test%20string%20here

# 7. Verify deletion
curl http://localhost:3000/strings/test%20string%20here
```

---

## 🎯 Testing with Postman

### Import Collection

Create a new Postman collection with these requests:

1. **POST Create String**
   - URL: `http://localhost:3000/strings`
   - Method: POST
   - Body: `{"value": "test"}`

2. **GET Specific String**
   - URL: `http://localhost:3000/strings/test`
   - Method: GET

3. **GET All Strings**
   - URL: `http://localhost:3000/strings`
   - Method: GET

4. **GET Filtered Strings**
   - URL: `http://localhost:3000/strings?is_palindrome=true`
   - Method: GET

5. **GET Natural Language**
   - URL: `http://localhost:3000/strings/filter-by-natural-language?query=all single word palindromic strings`
   - Method: GET

6. **DELETE String**
   - URL: `http://localhost:3000/strings/test`
   - Method: DELETE

---

## 📊 Expected Results Summary

| Endpoint | Success Code | Error Codes |
|----------|--------------|-------------|
| POST /strings | 201 | 400, 409, 422 |
| GET /strings/:value | 200 | 404 |
| GET /strings | 200 | 400 |
| GET /strings/filter-by-natural-language | 200 | 400, 422 |
| DELETE /strings/:value | 204 | 404 |

---

## ✅ Final Checklist Before Submission

- [ ] All POST tests pass (create, error handling)
- [ ] All GET tests pass (specific, all, filtered)
- [ ] Natural language parsing works for all examples
- [ ] DELETE works correctly
- [ ] Error responses have proper status codes
- [ ] Response format matches requirements
- [ ] Server logs requests correctly
- [ ] No console errors or warnings

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot POST /strings"
**Solution:** Make sure `Content-Type: application/json` header is set

### Issue: String not found after creation
**Solution:** Check URL encoding for spaces (use %20)

### Issue: Filters not working
**Solution:** Verify query parameter types (boolean as "true"/"false", integers as numbers)

### Issue: Natural language not parsing
**Solution:** URL encode the query parameter properly

---
