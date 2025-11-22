# Inventory Management System

A full-stack inventory management application built with React (Frontend), Node.js (Backend), and SQLite (Database).

## Features

- ✅ Product Search & Filtering (by name and category)
- ✅ Product Table with Image, Name, Unit, Category, Brand, Stock, Status, and Actions
- ✅ Inline Editing for products
- ✅ CSV Import/Export functionality
- ✅ Inventory Change History Tracking
- ✅ Add New Product functionality
- ✅ Responsive Design
- ✅ Stock Status Color Coding (Green for In Stock, Red for Out of Stock)

## Tech Stack

### Frontend
- React 18.2.0
- Axios for API calls
- CSS3 for styling

### Backend
- Node.js
- Express.js
- SQLite3
- Multer for file uploads
- CSV Parser for CSV processing
- Express Validator for input validation

## Project Structure

```
Inventory Management/
├── backend/
│   ├── routes/
│   │   └── products.js       # Product API routes
│   ├── uploads/              # Temporary CSV uploads (auto-created)
│   ├── server.js             # Express server setup
│   ├── package.json
│   └── inventory.db          # SQLite database (auto-created)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductManagement.js
│   │   │   ├── ProductTable.js
│   │   │   ├── ProductRow.js
│   │   │   ├── SearchAndFilter.js
│   │   │   ├── ImportExportButtons.js
│   │   │   ├── AddProductModal.js
│   │   │   └── InventoryHistory.js
│   │   ├── services/
│   │   │   └── api.js        # API service layer
│   │   ├── config/
│   │   │   └── api.js        # API base URL configuration
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create the `uploads` directory (if it doesn't exist):
```bash
mkdir uploads
```

4. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

The backend server will run on `http://localhost:5000` by default.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` by default.

4. **Important:** Before deploying, update the API URL in `frontend/src/config/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

For production, set the `REACT_APP_API_URL` environment variable to your deployed backend URL.

## API Endpoints

### Products
- `GET /api/products` - Get all products (with optional query params: `name`, `category`, `sortBy`, `sortOrder`)
- `GET /api/products/search?name=<query>` - Search products by name
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Import/Export
- `POST /api/products/import` - Import products from CSV (multipart/form-data, field name: `csvFile`)
- `GET /api/products/export` - Export all products as CSV

### History
- `GET /api/products/:id/history` - Get inventory change history for a product

### Health Check
- `GET /api/health` - Server health check

## CSV Format

### Import CSV Format
The CSV file should have the following columns (case-insensitive):
```
name,unit,category,brand,stock,status,image
```

Example:
```csv
name,unit,category,brand,stock,status,image
Laptop,pcs,Electronics,Dell,10,In Stock,https://example.com/laptop.jpg
Mouse,pcs,Electronics,Logitech,50,In Stock,https://example.com/mouse.jpg
```

### Export CSV Format
The exported CSV will include all columns:
```
id,name,unit,category,brand,stock,status,image
```

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  unit TEXT,
  category TEXT,
  brand TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT,
  image TEXT
);
```

### Inventory History Table
```sql
CREATE TABLE inventory_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  old_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  change_date TEXT NOT NULL,
  user_info TEXT DEFAULT 'admin',
  FOREIGN KEY(product_id) REFERENCES products(id)
);
```

## Deployment

### Backend Deployment (Render/Railway/Fly.io)

1. **Render:**
   - Create a new Web Service
   - Connect your GitHub repository
   - Root Directory: `backend`
   - Build Command: (leave empty or `npm install`)
   - Start Command: `npm start`
   - Environment Variables:
     - `PORT`: (auto-set by Render)
     - `NODE_ENV`: `production`

2. **Railway:**
   - Create a new project
   - Connect your GitHub repository
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Add environment variables as needed

3. **Important Notes:**
   - SQLite works for development, but for production on platforms like Render, consider using PostgreSQL
   - Ensure the `uploads` directory is writable
   - Database file (`inventory.db`) will be created automatically

### Frontend Deployment (Netlify/Vercel)

1. **Netlify:**
   - Create a new site from Git
   - Connect your GitHub repository
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
   - Environment Variables:
     - `REACT_APP_API_URL`: Your deployed backend URL (e.g., `https://your-backend.onrender.com`)

2. **Vercel:**
   - Import your GitHub repository
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Environment Variables:
     - `REACT_APP_API_URL`: Your deployed backend URL

3. **After Deployment:**
   - Update the API URL in your frontend environment variables
   - Rebuild and redeploy the frontend

## Usage

1. **Adding Products:**
   - Click "Add New Product" button
   - Fill in the form and click "Add Product"

2. **Searching Products:**
   - Type in the search bar to search by product name
   - Use the category dropdown to filter by category

3. **Editing Products:**
   - Click the "Edit" button on any product row
   - Modify the fields inline
   - Click "Save" to save changes or "Cancel" to discard

4. **Deleting Products:**
   - Click the "Delete" button on any product row
   - Confirm the deletion

5. **Importing Products:**
   - Click the "Import" button
   - Select a CSV file with product data
   - The system will import new products and skip duplicates

6. **Exporting Products:**
   - Click the "Export" button
   - A CSV file will be downloaded with all products

7. **Viewing Inventory History:**
   - Click on any product row to view its inventory change history
   - The history sidebar will show all stock changes with timestamps

## Testing

### Backend Testing
You can test the API using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)

Example API calls:
```bash
# Get all products
curl http://localhost:5000/api/products

# Search products
curl http://localhost:5000/api/products/search?name=laptop

# Create product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","stock":10,"unit":"pcs"}'

# Export CSV
curl http://localhost:5000/api/products/export -o products.csv
```

## Troubleshooting

1. **Backend not starting:**
   - Ensure all dependencies are installed: `npm install`
   - Check if port 5000 is available
   - Verify database file permissions

2. **Frontend not connecting to backend:**
   - Check CORS settings in backend
   - Verify API URL in `frontend/src/config/api.js`
   - Check browser console for errors

3. **CSV Import failing:**
   - Ensure `uploads` directory exists and is writable
   - Verify CSV format matches the expected structure
   - Check backend logs for detailed error messages

4. **Database issues:**
   - Ensure SQLite3 is properly installed
   - Check file permissions on `inventory.db`
   - Delete `inventory.db` to reset the database (will lose all data)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Contact

For issues or questions, please open an issue on GitHub.


