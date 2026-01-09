# Product Info Lookup

A simple Node.js + Express web application that allows users to look up Lenovo product information (model and warranty status) using a device serial number. The app consists of a backend API and a minimal frontend UI.

---

## Features

- 🔍 Look up Lenovo product model information by serial number  
- 🛡️ Determine whether a device is still under warranty  
- 🌐 Simple web-based UI  
- 🚀 REST API endpoint for programmatic access  

---

## Tech Stack

- **Backend**
  - Node.js
  - Express
  - Axios

- **Frontend**
  - HTML
  - Vanilla JavaScript

---

## Project Structure

```

.
├── index.js              # Express server and API logic
├── public/
│   └── index.html        # Frontend UI
├── package.json
└── README.md

````

---

## How It Works

1. A user enters a Lenovo serial number in the browser.
2. The frontend sends a `POST` request to the backend API.
3. The backend calls Lenovo’s public support API.
4. The response is parsed to extract:
   - Product model
   - Warranty end date
   - Warranty status (under warranty or not)
5. The results are displayed in the browser.

---

## API Endpoint

### `POST /api/product-info`

Fetches product and warranty information for a given serial number.

#### Request Body

```json
{
  "serialNumber": "XXXXXXXX"
}
````

#### Successful Response

```json
{
  "serialNumber": "XXXXXXXX",
  "model": "ThinkPad T14",
  "warrantyEndDate": "2025-06-30",
  "underWarranty": true
}
```

#### Error Response

```json
{
  "error": "Failed to fetch product info."
}
```

---

## Running Locally

### Prerequisites

* Node.js (v16+ recommended)
* npm

### Installation

```bash
npm install
```

### Start the Server

```bash
node index.js
```

The server will start on:

```
http://localhost:3000
```

Open your browser and navigate to that URL to use the application.

---

## Frontend Configuration

If you are running the backend locally, update this line to:

```js
const apiUrl = '/api/product-info';
```

---

## Notes & Limitations

* This project relies on an unofficial Lenovo support API and may break if the endpoint changes.
* No authentication or rate limiting is implemented.
* Intended for educational or internal tooling purposes.

---

## License

MIT License

---

## Author

Built as a lightweight utility for quick Lenovo product and warranty lookups.

