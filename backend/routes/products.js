const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { body, validationResult, param } = require('express-validator');

const upload = multer({ dest: 'uploads/' });

module.exports = (db, dbAll, dbGet, dbRun) => {
  const router = express.Router();

  
  router.get('/', async (req, res) => {
    try {
      let query = 'SELECT * FROM products WHERE 1=1';
      let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
      const params = [];

      // Search by name
      if (req.query.name) {
        query += ' AND name LIKE ?';
        countQuery += ' AND name LIKE ?';
        params.push(`%${req.query.name}%`);
      }

      // Filter by category
      if (req.query.category) {
        query += ' AND category = ?';
        countQuery += ' AND category = ?';
        params.push(req.query.category);
      }

      // Get total count
      const countParams = [...params];
      const countResult = await dbGet(countQuery, countParams);
      const total = countResult ? countResult.total : 0;

      // Sorting
      const sortBy = req.query.sortBy || 'id';
      const sortOrder = (req.query.sortOrder || 'ASC').toUpperCase();
      // Validate sortBy to prevent SQL injection
      const allowedSortFields = ['id', 'name', 'unit', 'category', 'brand', 'stock', 'status'];
      const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
      const safeSortOrder = sortOrder === 'DESC' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const products = await dbAll(query, params);
      
      res.json({
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  
  router.get('/search', async (req, res) => {
    try {
      const name = req.query.name || '';
      const query = 'SELECT * FROM products WHERE name LIKE ? ORDER BY name';
      const products = await dbAll(query, [`%${name}%`]);
      res.json(products);
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ error: 'Failed to search products' });
    }
  });

  // POST /api/products/import - Import products from CSV (must be before /:id route)
  router.post('/import', upload.single('csvFile'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    const results = [];
    const duplicates = [];
    let added = 0;
    let skipped = 0;

    try {
      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });

      for (const row of results) {
        const name = (row.name || '').trim();
        const stock = parseInt(row.stock || 0, 10);

        if (!name) {
          skipped++;
          continue;
        }

        const existing = await dbGet('SELECT id FROM products WHERE LOWER(name) = LOWER(?)', [name]);

        if (existing) {
          skipped++;
          duplicates.push({ name, existingId: existing.id });
        } else {
          await dbRun(
            'INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
              name,
              (row.unit || '').trim() || null,
              (row.category || '').trim() || null,
              (row.brand || '').trim() || null,
              isNaN(stock) ? 0 : stock,
              stock > 0 ? 'In Stock' : 'Out of Stock',
              (row.image || '').trim() || null,
            ]
          );
          added++;
        }
      }

      fs.unlinkSync(req.file.path);

      res.json({
        added,
        skipped,
        duplicates,
      });
    } catch (error) {
      console.error('Error importing CSV:', error);
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Failed to import CSV' });
    }
  });

  // GET /api/products/export - Export products to CSV (must be before /:id route)
  router.get('/export', async (req, res) => {
    try {
      const products = await dbAll('SELECT * FROM products ORDER BY id');

      const headers = ['id', 'name', 'unit', 'category', 'brand', 'stock', 'status', 'image'];

      let csv = headers.join(',') + '\n';
      products.forEach((product) => {
        const row = headers
          .map((header) => {
            const value = product[header];
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          })
          .join(',');
        csv += row + '\n';
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
      res.status(200).send(csv);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      res.status(500).json({ error: 'Failed to export CSV' });
    }
  });
  
  router.get('/:id', async (req, res) => {
    try {
      const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  
  router.post(
    '/',
    [
      body('name').notEmpty().withMessage('Name is required'),
      body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { name, unit, category, brand, stock, status, image } = req.body;

        
        const existing = await dbGet('SELECT id FROM products WHERE LOWER(name) = LOWER(?)', [name]);
        if (existing) {
          return res.status(400).json({ error: 'Product with this name already exists' });
        }

        const result = await dbRun(
          'INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, unit || null, category || null, brand || null, stock || 0, status || 'In Stock', image || null]
        );

        const newProduct = await dbGet('SELECT * FROM products WHERE id = ?', [result.id]);
        res.status(201).json(newProduct);
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
      }
    }
  );

  
  router.put(
    '/:id',
    [
      param('id').isInt().withMessage('Invalid product ID'),
      body('name').notEmpty().withMessage('Name is required'),
      body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, unit, category, brand, stock, status, image } = req.body;

        
        const existingProduct = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
        if (!existingProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }

        
        const nameConflict = await dbGet(
          'SELECT id FROM products WHERE LOWER(name) = LOWER(?) AND id != ?',
          [name, id]
        );
        if (nameConflict) {
          return res.status(400).json({ error: 'Product with this name already exists' });
        }

        
        const oldStock = existingProduct.stock;
        if (oldStock !== stock) {
          await dbRun(
            'INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date, user_info) VALUES (?, ?, ?, ?, ?)',
            [id, oldStock, stock, new Date().toISOString(), req.body.changedBy || 'admin']
          );
        }

        
        await dbRun(
          'UPDATE products SET name = ?, unit = ?, category = ?, brand = ?, stock = ?, status = ?, image = ? WHERE id = ?',
          [name, unit || null, category || null, brand || null, stock, status || (stock > 0 ? 'In Stock' : 'Out of Stock'), image || null, id]
        );

        const updatedProduct = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
        res.json(updatedProduct);
      } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
      }
    }
  );

  
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      
      const product = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      
      await dbRun('DELETE FROM inventory_history WHERE product_id = ?', [id]);

      
      await dbRun('DELETE FROM products WHERE id = ?', [id]);

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  
  router.get('/:id/history', async (req, res) => {
    try {
      const { id } = req.params;
      const history = await dbAll(
        'SELECT * FROM inventory_history WHERE product_id = ? ORDER BY change_date DESC',
        [id]
      );
      res.json(history);
    } catch (error) {
      console.error('Error fetching inventory history:', error);
      res.status(500).json({ error: 'Failed to fetch inventory history' });
    }
  });

  return router;
};


