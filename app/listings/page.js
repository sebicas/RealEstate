'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';

function ListingsContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    type: searchParams.get('type') || '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  const fetchListings = async (params) => {
    setLoading(true);
    const queryString = new URLSearchParams(Object.fromEntries(
      Object.entries(params).filter(([, v]) => v)
    )).toString();

    try {
      const res = await fetch(`/api/listings?${queryString}`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(filters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(filters);
  };

  const handleChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container search-page">
          <div style={{ marginBottom: '32px' }}>
            <h1 className="section-title heading-display" style={{ textAlign: 'left', marginBottom: '8px' }}>
              Browse Properties
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Discover your perfect home from our curated collection
            </p>
          </div>

          <form className="search-filters" onSubmit={handleSearch}>
            <input
              type="text"
              name="q"
              className="form-input"
              placeholder="Search location, title..."
              value={filters.q}
              onChange={handleChange}
              style={{ flex: 2 }}
            />
            <select name="type" className="form-input form-select" value={filters.type} onChange={handleChange}>
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="apartment">Apartment</option>
              <option value="townhouse">Townhouse</option>
            </select>
            <input
              type="number"
              name="minPrice"
              className="form-input"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleChange}
            />
            <input
              type="number"
              name="maxPrice"
              className="form-input"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleChange}
            />
            <select name="bedrooms" className="form-input form-select" value={filters.bedrooms} onChange={handleChange}>
              <option value="">Any Beds</option>
              <option value="1">1+ Bed</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
            </select>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <p className="search-results-count">
            {loading ? 'Searching...' : `${listings.length} ${listings.length === 1 ? 'property' : 'properties'} found`}
          </p>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
              <div className="spinner" />
            </div>
          ) : listings.length > 0 ? (
            <div className="listings-grid">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">🏠</div>
              <h3 className="dashboard-empty-title">No properties found</h3>
              <p className="dashboard-empty-text">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    }>
      <ListingsContent />
    </Suspense>
  );
}
