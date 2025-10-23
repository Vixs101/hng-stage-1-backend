# 🔤 String Analyzer API

A RESTful API service that analyzes strings and stores their computed properties. Built with Node.js and Express.

## ✨ Features

- **String Analysis**: Automatically computes length, palindrome status, unique characters, word count, SHA-256 hash, and character frequency
- **RESTful API**: Standard HTTP methods (GET, POST, DELETE) with proper status codes
- **Flexible Filtering**: Filter strings by multiple criteria
- **Natural Language Queries**: Parse plain English queries into structured filters
- **In-Memory Storage**: Fast, lightweight data storage (no external database required)
- **Comprehensive Error Handling**: Clear, actionable error messages

---

## 📋 Table of Contents

- [Installation](#installation)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vixs101/hng-stage-1-backend.git
   cd hng-stage-1-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in project root
   cp .env.example .env
   # Or manually create .env with:
   PORT=3000
   NODE_ENV=development
   ```

---

## 🏃 Running Locally

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. Create/Analyze String

**Endpoint:** `POST /strings`

**Request Body:**
```json
{
  "value": "hello world"
}
```

**Success Response (201 Created):**
```json
{
  "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
  "value": "hello world",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      " ": 1,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2025-10-22T10:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Missing "value" field
- `422 Unprocessable Entity` - "value" is not a string
- `409 Conflict` - String already exists

---

### 2. Get Specific String

**Endpoint:** `GET /strings/:value`

**Example:** `GET /strings/hello%20world`

**Success Response (200 OK):**
```json
{
  "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
  "value": "hello world",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      " ": 1,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2025-10-22T10:00:00.000Z"
}
```

**Error Response:**
- `404 Not Found` - String does not exist

---

### 3. Get All Strings with Filtering

**Endpoint:** `GET /strings`

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `is_palindrome` | boolean | Filter palindromes | `?is_palindrome=true` |
| `min_length` | integer | Minimum string length | `?min_length=5` |
| `max_length` | integer | Maximum string length | `?max_length=20` |
| `word_count` | integer | Exact word count | `?word_count=2` |
| `contains_character` | string | Single character | `?contains_character=a` |

**Example:** `GET /strings?is_palindrome=true&min_length=5`

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "hash1",
      "value": "racecar",
      "properties": { ... },
      "created_at": "2025-10-22T10:00:00.000Z"
    },
    {
      "id": "hash2",
      "value": "madam",
      "properties": { ... },
      "created_at": "2025-10-22T10:05:00.000Z"
    }
  ],
  "count": 2,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5
  }
}
```

**Error Response:**
- `400 Bad Request` - Invalid query parameter values

---

### 4. Natural Language Filtering

**Endpoint:** `GET /strings/filter-by-natural-language`

**Query Parameter:** `query` (required)

**Supported Queries:**
- `"all single word palindromic strings"` → `{word_count: 1, is_palindrome: true}`
- `"strings longer than 10 characters"` → `{min_length: 11}`
- `"palindromic strings containing the letter z"` → `{is_palindrome: true, contains_character: "z"}`
- `"strings containing the first vowel"` → `{contains_character: "a"}`

**Example:** `GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings`

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "hash1",
      "value": "racecar",
      "properties": { ... },
      "created_at": "2025-10-22T10:00:00.000Z"
    }
  ],
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

**Error Responses:**
- `400 Bad Request` - Unable to parse query or missing query parameter
- `422 Unprocessable Entity` - Conflicting filters detected

---

### 5. Delete String

**Endpoint:** `DELETE /strings/:value`

**Example:** `DELETE /strings/hello%20world`

**Success Response:** `204 No Content` (empty body)

**Error Response:**
- `404 Not Found` - String does not exist

---

## 💡 Usage Examples

### Using cURL

```bash
# Create a string
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'

# Get a specific string
curl http://localhost:3000/strings/racecar

# Get all palindromes
curl "http://localhost:3000/strings?is_palindrome=true"

# Natural language query
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"

# Delete a string
curl -X DELETE http://localhost:3000/strings/racecar
```

### Using JavaScript (fetch)

```javascript
// Create a string
const response = await fetch('http://localhost:3000/strings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ value: 'hello world' })
});
const data = await response.json();
console.log(data);

// Get all strings with filters
const filtered = await fetch('http://localhost:3000/strings?is_palindrome=true&min_length=5');
const results = await filtered.json();
console.log(results);
```

### Using Postman

1. **Create String:**
   - Method: `POST`
   - URL: `http://localhost:3000/strings`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON): `{"value": "test string"}`

2. **Get String:**
   - Method: `GET`
   - URL: `http://localhost:3000/strings/test string`

---

## 📁 Project Structure

```
string-analyzer-api/
├── src/
│   ├── app.js                      # Express app configuration
│   ├── server.js                   # Server entry point
│   ├── routes/
│   │   └── strings.js              # API route definitions
│   ├── controllers/
│   │   └── stringController.js     # Request handlers
│   ├── services/
│   │   ├── analyzerService.js      # String analysis logic
│   │   └── nlpService.js           # Natural language parser
│   └── config/
│       └── database.js             # In-memory database
├── .env                            # Environment variables
├── .gitignore                      # Git ignore file
├── package.json                    # Project dependencies
└── README.md                       # This file
```

---

## 📦 Dependencies

### Production Dependencies

```json
{
  "express": "^4.18.2",
  "dotenv": "^16.3.1"
}
```

- **express**: Web framework for Node.js
- **dotenv**: Loads environment variables from .env file

### Development Dependencies

```json
{
  "nodemon": "^3.0.1"
}
```

- **nodemon**: Auto-restarts server on file changes

### Installation Command

```bash
npm install
```

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
```

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | 3000 | No |
| `NODE_ENV` | Environment (development/production) | development | No |

---

## 🧪 Testing

### Manual Testing

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test endpoints using cURL or Postman** (see Usage Examples above)

### Test Checklist

- [ ] POST /strings - Create valid string
- [ ] POST /strings - Reject invalid input (missing value)
- [ ] POST /strings - Reject non-string value
- [ ] POST /strings - Detect duplicate strings (409)
- [ ] GET /strings/:value - Retrieve existing string
- [ ] GET /strings/:value - Return 404 for non-existent string
- [ ] GET /strings - List all strings
- [ ] GET /strings?is_palindrome=true - Filter palindromes
- [ ] GET /strings?min_length=10 - Filter by min length
- [ ] GET /strings?word_count=2 - Filter by word count
- [ ] GET /strings/filter-by-natural-language - Parse queries
- [ ] DELETE /strings/:value - Delete existing string
- [ ] DELETE /strings/:value - Return 404 for non-existent

### Sample Test Data

```bash
# Create test strings
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "racecar"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "hello world"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "madam"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "test"}'
```

---

## 🌐 Deployment

### Recommended Platforms

1. **Railway** (Recommended)
   - Free tier available
   - Easy deployment from GitHub
   - Good performance

2. **Heroku**
   - Popular platform
   - Simple deployment process
   - Free tier with limitations

3. **AWS EC2**
   - More control
   - Requires more setup
   - Free tier available

### Deployment Steps (Railway)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/string-analyzer-api.git
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect Node.js and deploy

3. **Configure environment**
   - In Railway dashboard, go to Variables
   - Add: `PORT` (Railway provides this automatically)
   - Add: `NODE_ENV=production`

4. **Get your URL**
   - Railway will provide a public URL
   - Test your API at that URL


   ```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Cannot Find Module
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### API Not Responding
- Check if server is running: `npm run dev`
- Check PORT in .env matches your requests
- Check firewall settings

---

## 📝 API Response Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE request |
| 400 | Bad Request | Invalid input or query parameters |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Invalid data type |
| 500 | Internal Server Error | Server error |

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [RESTful API Design](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

---

## 👨‍💻 Author

**Elijah Victor**
- GitHub: [@Vixs101](https://github.com/Vixs101)
- Twitter: [@vixs101](https://x.com/vixs101)

---

## 📄 License

This project is part of an internship task.

---


**Last Updated:** October 2025