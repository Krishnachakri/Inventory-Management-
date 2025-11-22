import React, { useMemo } from 'react';
import './DataVisualization.css';

function DataVisualization({ products }) {
  // Calculate statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const inStockCount = products.filter(p => p.stock > 0).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    // Category distribution
    const categoryData = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      categoryData[category] = (categoryData[category] || 0) + 1;
    });

    // Brand distribution
    const brandData = {};
    products.forEach(product => {
      const brand = product.brand || 'Unknown';
      brandData[brand] = (brandData[brand] || 0) + 1;
    });

    // Stock levels (high/medium/low)
    const stockLevels = {
      high: products.filter(p => p.stock > 50).length,
      medium: products.filter(p => p.stock > 10 && p.stock <= 50).length,
      low: products.filter(p => p.stock > 0 && p.stock <= 10).length,
      out: products.filter(p => p.stock === 0).length,
    };

    return {
      totalProducts,
      totalStock,
      inStockCount,
      outOfStockCount,
      categoryData,
      brandData,
      stockLevels,
    };
  }, [products]);

  const getCategoryPercentage = (count) => {
    return stats.totalProducts > 0 ? ((count / stats.totalProducts) * 100).toFixed(1) : 0;
  };

  const topCategories = Object.entries(stats.categoryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topBrands = Object.entries(stats.brandData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="data-visualization">
      <h2 className="viz-title">📊 Dashboard Analytics</h2>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalProducts}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalStock}</div>
            <div className="stat-label">Total Stock Units</div>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.inStockCount}</div>
            <div className="stat-label">In Stock Items</div>
          </div>
        </div>

        <div className="stat-card stat-danger">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.outOfStockCount}</div>
            <div className="stat-label">Out of Stock</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Category Distribution */}
        <div className="chart-card">
          <h3>📂 Top Categories</h3>
          <div className="chart-content">
            {topCategories.length > 0 ? (
              topCategories.map(([category, count]) => {
                const percentage = getCategoryPercentage(count);
                return (
                  <div key={category} className="chart-bar-item">
                    <div className="bar-label">{category}</div>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, #667eea 0%, #764ba2 100%)`,
                        }}
                      >
                        <span className="bar-value">{count}</span>
                      </div>
                    </div>
                    <div className="bar-percentage">{percentage}%</div>
                  </div>
                );
              })
            ) : (
              <p className="no-data">No category data available</p>
            )}
          </div>
        </div>

        {/* Stock Levels */}
        <div className="chart-card">
          <h3>📊 Stock Levels</h3>
          <div className="chart-content">
            <div className="stock-level-item">
              <span className="level-label">High (50+)</span>
              <div className="level-bar">
                <div
                  className="level-fill level-high"
                  style={{ width: `${getCategoryPercentage(stats.stockLevels.high)}%` }}
                >
                  <span>{stats.stockLevels.high}</span>
                </div>
              </div>
            </div>
            <div className="stock-level-item">
              <span className="level-label">Medium (11-50)</span>
              <div className="level-bar">
                <div
                  className="level-fill level-medium"
                  style={{ width: `${getCategoryPercentage(stats.stockLevels.medium)}%` }}
                >
                  <span>{stats.stockLevels.medium}</span>
                </div>
              </div>
            </div>
            <div className="stock-level-item">
              <span className="level-label">Low (1-10)</span>
              <div className="level-bar">
                <div
                  className="level-fill level-low"
                  style={{ width: `${getCategoryPercentage(stats.stockLevels.low)}%` }}
                >
                  <span>{stats.stockLevels.low}</span>
                </div>
              </div>
            </div>
            <div className="stock-level-item">
              <span className="level-label">Out of Stock</span>
              <div className="level-bar">
                <div
                  className="level-fill level-out"
                  style={{ width: `${getCategoryPercentage(stats.stockLevels.out)}%` }}
                >
                  <span>{stats.stockLevels.out}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Distribution */}
        <div className="chart-card">
          <h3>🏢 Top Brands</h3>
          <div className="chart-content">
            {topBrands.length > 0 ? (
              topBrands.map(([brand, count]) => {
                const percentage = getCategoryPercentage(count);
                return (
                  <div key={brand} className="chart-bar-item">
                    <div className="bar-label">{brand}</div>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)`,
                        }}
                      >
                        <span className="bar-value">{count}</span>
                      </div>
                    </div>
                    <div className="bar-percentage">{percentage}%</div>
                  </div>
                );
              })
            ) : (
              <p className="no-data">No brand data available</p>
            )}
          </div>
        </div>

        {/* Status Pie Chart (visual representation) */}
        <div className="chart-card">
          <h3>📈 Stock Status</h3>
          <div className="pie-chart">
            <div className="pie-segment in-stock" style={{ '--percentage': `${getCategoryPercentage(stats.inStockCount)}%` }}>
              <div className="segment-label">
                <span className="segment-color"></span>
                <span>In Stock: {stats.inStockCount}</span>
              </div>
            </div>
            <div className="pie-segment out-stock" style={{ '--percentage': `${getCategoryPercentage(stats.outOfStockCount)}%` }}>
              <div className="segment-label">
                <span className="segment-color"></span>
                <span>Out of Stock: {stats.outOfStockCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataVisualization;

