# Deployment Checklist

## Pre-Deployment

- [ ] Ensure all dependencies are installed in both `backend` and `frontend`
- [ ] Test the application locally
- [ ] Update API URL in `frontend/src/config/api.js` or set `REACT_APP_API_URL` environment variable
- [ ] Ensure backend `.env` file is configured (if using environment variables)
- [ ] Test CSV import/export functionality
- [ ] Verify database is initialized correctly

## Backend Deployment

### Render.com
1. Create a new Web Service
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty or `npm install`)
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `PORT`: (auto-set by Render)
     - `NODE_ENV`: `production`
4. Deploy and note the URL (e.g., `https://your-app.onrender.com`)

### Railway
1. Create a new project
2. Connect your GitHub repository
3. Set Root Directory to `backend`
4. Configure Start Command: `npm start`
5. Add environment variables as needed
6. Deploy and note the URL

### Important Notes
- SQLite works for development, but for production consider using PostgreSQL
- The database file (`inventory.db`) will be created automatically
- Ensure the `uploads` directory is writable (create it if needed)

## Frontend Deployment

### Netlify
1. Create a new site from Git
2. Connect your GitHub repository
3. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
   - **Environment Variables**:
     - `REACT_APP_API_URL`: Your deployed backend URL (e.g., `https://your-backend.onrender.com`)
4. Deploy and note the URL

### Vercel
1. Import your GitHub repository
2. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Environment Variables**:
     - `REACT_APP_API_URL`: Your deployed backend URL
3. Deploy and note the URL

## Post-Deployment

- [ ] Test all API endpoints
- [ ] Test CSV import/export
- [ ] Verify product CRUD operations
- [ ] Test inventory history tracking
- [ ] Check responsive design on mobile devices
- [ ] Verify CORS is working correctly

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
```

### Frontend (Netlify/Vercel Environment Variables)
```
REACT_APP_API_URL=https://your-backend-url.com
```

## Testing URLs

After deployment, test these endpoints:

- `GET {backend-url}/api/health` - Health check
- `GET {backend-url}/api/products` - Get all products
- `GET {backend-url}/api/products/export` - Export CSV
- `POST {backend-url}/api/products/import` - Import CSV

## Troubleshooting

1. **CORS Errors**: Ensure backend CORS is enabled and allows your frontend domain
2. **API Connection**: Verify `REACT_APP_API_URL` is set correctly in frontend deployment
3. **Database Issues**: For production, consider migrating to PostgreSQL instead of SQLite
4. **File Uploads**: Ensure `uploads` directory exists and is writable

## Submission Checklist

- [ ] GitHub repository is public
- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] All features are working:
  - [ ] Product search
  - [ ] Category filtering
  - [ ] Add new product
  - [ ] Edit product (inline)
  - [ ] Delete product
  - [ ] CSV import
  - [ ] CSV export
  - [ ] Inventory history
- [ ] README includes setup instructions
- [ ] README includes deployment instructions


