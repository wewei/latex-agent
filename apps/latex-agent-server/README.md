# LaTeX Agent Server

A RESTful API server for handling LaTeX document processing and compilation.

## Overview

This server provides API endpoints for managing LaTeX documents and their compilation, following RESTful API standards. All API routes are mapped to the `/latex/api/v1/` path.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Start production server
npm start
```

The server will start on port 3000 by default, but you can set a custom port by setting the `PORT` environment variable.

## API Endpoints

All API endpoints are prefixed with `/latex/api/v1`.

### Health Check

- `GET /latex/api/v1/health` - Check API health status

### Documents

- `GET /latex/api/v1/documents` - Get all documents
- `GET /latex/api/v1/documents/:id` - Get a document by ID
- `POST /latex/api/v1/documents` - Create a new document
- `PUT /latex/api/v1/documents/:id` - Update a document
- `DELETE /latex/api/v1/documents/:id` - Delete a document

### Compilation

- `POST /latex/api/v1/compile` - Compile a LaTeX document
- `GET /latex/api/v1/compile/:id` - Get compilation status
- `GET /latex/api/v1/compile/:id/result` - Get compilation result
- `POST /latex/api/v1/compile/:id/cancel` - Cancel a running compilation

## Development

The server structure follows these conventions:

- `src/server.js` - Main server setup
- `src/routes/` - API route definitions
- `src/controllers/` - Business logic for handling requests
- `src/models/` - Data models
- `src/middleware/` - Custom middleware functions 