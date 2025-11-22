import React, { useState, useEffect } from 'react';
import './ProductManagement.css';
import ProductTable from './ProductTable';
import SearchAndFilter from './SearchAndFilter';
import AdvancedFilters from './AdvancedFilters';
import DataVisualization from './DataVisualization';
import ImportExportButtons from './ImportExportButtons';
import AddProductModal from './AddProductModal';
import InventoryHistory from './InventoryHistory';
import Pagination from './Pagination';
import { productsAPI } from '../services/api';

const showToast = (message, type = 'success') => {
  if (type === 'success') {
    alert(`✓ ${message}`);
  } else {
    alert(`✗ ${message}`);
  }
};

function ProductManagement({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showVisualization, setShowVisualization] = useState(true);
  const [advancedFilters, setAdvancedFilters] = useState({});
  
  // Pagination and Sorting state
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // For visualization

  // Fetch products with pagination and sorting
  const fetchProducts = async (page = currentPage, sort = sortBy, order = sortOrder, search = searchQuery, category = categoryFilter) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pageSize,
        sortBy: sort,
        sortOrder: order,
        ...(search && { name: search }),
        ...(category && { category }),
      };

      const response = await productsAPI.getAll(params);
      
      if (response.data.products && response.data.pagination) {
        // New paginated response
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
        setPagination(response.data.pagination);
      } else {
        // Fallback for old API response
        const productsData = Array.isArray(response.data) ? response.data : [];
        setProducts(productsData);
        let filtered = productsData;
        
        // Apply advanced filters
        if (advancedFilters.minStock) {
          filtered = filtered.filter(p => (p.stock || 0) >= parseInt(advancedFilters.minStock));
        }
        if (advancedFilters.maxStock) {
          filtered = filtered.filter(p => (p.stock || 0) <= parseInt(advancedFilters.maxStock));
        }
        if (advancedFilters.status) {
          filtered = filtered.filter(p => p.status === advancedFilters.status);
        }
        if (advancedFilters.multipleCategories && advancedFilters.multipleCategories.length > 0) {
          filtered = filtered.filter(p => advancedFilters.multipleCategories.includes(p.category));
        }
        if (advancedFilters.brands && advancedFilters.brands.length > 0) {
          filtered = filtered.filter(p => advancedFilters.brands.includes(p.brand));
        }
        
        setFilteredProducts(filtered);
      }

      // Fetch all products for visualization and categories
      const allProductsResponse = await productsAPI.getAll({ limit: 1000 });
      const allProductsData = allProductsResponse.data.products || allProductsResponse.data;
      setAllProducts(allProductsData);
      const uniqueCategories = [...new Set(allProductsData.map((p) => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, sortBy, sortOrder, searchQuery, categoryFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, sortOrder]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchProducts(1, sortBy, sortOrder, query, categoryFilter);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
    fetchProducts(1, sortBy, sortOrder, searchQuery, category);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
    setCurrentPage(1);
  };

  // Handle product selection for history
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowHistory(true);
  };

  // Handle product update
  const handleProductUpdate = async (id, updatedData) => {
    try {
      await productsAPI.update(id, updatedData);
      showToast('Product updated successfully');
      fetchProducts(currentPage, sortBy, sortOrder, searchQuery, categoryFilter);
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('Failed to update product', 'error');
      throw error;
    }
  };

  // Handle product delete
  const handleProductDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productsAPI.delete(id);
      showToast('Product deleted successfully');
      fetchProducts(currentPage, sortBy, sortOrder, searchQuery, categoryFilter);
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product', 'error');
    }
  };

  // Handle add new product
  const handleAddProduct = async (productData) => {
    try {
      await productsAPI.create(productData);
      showToast('Product added successfully');
      setShowAddModal(false);
      fetchProducts(currentPage, sortBy, sortOrder, searchQuery, categoryFilter);
    } catch (error) {
      console.error('Error adding product:', error);
      showToast(error.response?.data?.error || 'Failed to add product', 'error');
      throw error;
    }
  };

  // Handle CSV import
  const handleImport = async (file) => {
    try {
      const response = await productsAPI.importCSV(file);
      const { added, skipped, duplicates } = response.data;
      showToast(
        `Import completed! Added: ${added}, Skipped: ${skipped}${duplicates.length > 0 ? ` (${duplicates.length} duplicates)` : ''}`
      );
      fetchProducts(currentPage, sortBy, sortOrder, searchQuery, categoryFilter);
    } catch (error) {
      console.error('Error importing CSV:', error);
      showToast('Failed to import CSV', 'error');
    }
  };

  // Handle CSV export
  const handleExport = async () => {
    try {
      const response = await productsAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Products exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showToast('Failed to export CSV', 'error');
    }
  };

  return (
    <div className="product-management">
      <header className="management-header">
        <div className="header-top">
          <h1 className="page-title">📦 Inventory Management</h1>
          {user && (
            <div className="user-info">
              <span>👤 {user.username}</span>
              <button className="btn btn-secondary btn-small" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
        <div className="header-controls">
          <div className="header-left">
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearch={handleSearch}
              categories={categories}
              categoryFilter={categoryFilter}
              onCategoryFilter={handleCategoryFilter}
            />
            <button
              className="btn btn-primary btn-gradient"
              onClick={() => setShowAddModal(true)}
            >
              + Add New Product
            </button>
          </div>
          <div className="header-right">
            <ImportExportButtons onImport={handleImport} onExport={handleExport} />
          </div>
        </div>
      </header>

      <main className="management-main">
        {/* Toggle buttons */}
        <div className="view-controls">
          <button
            className={`btn-toggle ${showVisualization ? 'active' : ''}`}
            onClick={() => setShowVisualization(!showVisualization)}
          >
            {showVisualization ? '📊 Hide Dashboard' : '📊 Show Dashboard'}
          </button>
          <button
            className={`btn-toggle ${showAdvancedFilters ? 'active' : ''}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            {showAdvancedFilters ? '🔍 Hide Filters' : '🔍 Advanced Filters'}
          </button>
        </div>

        {/* Data Visualization Dashboard */}
        {showVisualization && allProducts.length > 0 && (
          <DataVisualization products={allProducts} />
        )}

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <AdvancedFilters
            onFilterChange={(filters) => {
              setAdvancedFilters(filters);
              // Apply filters to current products
              let filtered = products;
              if (filters.minStock) {
                filtered = filtered.filter(p => (p.stock || 0) >= parseInt(filters.minStock));
              }
              if (filters.maxStock) {
                filtered = filtered.filter(p => (p.stock || 0) <= parseInt(filters.maxStock));
              }
              if (filters.status) {
                filtered = filtered.filter(p => p.status === filters.status);
              }
              if (filters.multipleCategories && filters.multipleCategories.length > 0) {
                filtered = filtered.filter(p => filters.multipleCategories.includes(p.category));
              }
              if (filters.brands && filters.brands.length > 0) {
                filtered = filtered.filter(p => filters.brands.includes(p.brand));
              }
              setFilteredProducts(filtered);
            }}
            categories={categories}
            onReset={() => {
              setFilteredProducts(products);
            }}
          />
        )}

        <ProductTable
          products={filteredProducts}
          loading={loading}
          onUpdate={handleProductUpdate}
          onDelete={handleProductDelete}
          onProductSelect={handleProductSelect}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {pagination && (
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}

        {showHistory && selectedProduct && (
          <InventoryHistory
            product={selectedProduct}
            onClose={() => {
              setShowHistory(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </main>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}
    </div>
  );
}

export default ProductManagement;
