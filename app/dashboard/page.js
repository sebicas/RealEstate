'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) {
          router.push('/auth/login');
          return;
        }
        const userData = await userRes.json();
        setUser(userData.user);

        const listingsRes = await fetch('/api/listings');
        const listingsData = await listingsRes.json();
        const myListings = listingsData.listings.filter(l => l.userId === userData.user.id);
        setListings(myListings);
      } catch {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setListings(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-wrapper">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="spinner" />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container dashboard animate-fade-in">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">My Dashboard</h1>
              <p className="dashboard-subtitle">Welcome back, {user?.name} 👋</p>
            </div>
            <Link href="/dashboard/new" className="btn btn-primary">
              + Add New Listing
            </Link>
          </div>

          {listings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {listings.map(listing => (
                <div key={listing.id} className="card" style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr auto',
                  alignItems: 'center',
                  overflow: 'hidden',
                  cursor: 'default',
                }}>
                  <div style={{ height: '140px', overflow: 'hidden' }}>
                    <img
                      src={listing.images?.[0] || '/images/placeholder.jpg'}
                      alt={listing.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>{listing.title}</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>
                      {listing.city}, {listing.state}
                    </p>
                    <p style={{ fontWeight: 700, color: 'var(--color-secondary-dark)', fontSize: '1.125rem' }}>
                      {formatPrice(listing.price)}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.813rem', color: 'var(--color-text-secondary)' }}>
                      <span>{listing.bedrooms} beds</span>
                      <span>{listing.bathrooms} baths</span>
                      <span>{listing.sqft?.toLocaleString()} sqft</span>
                    </div>
                  </div>
                  <div style={{ padding: '20px 24px', display: 'flex', gap: '8px' }}>
                    <Link href={`/listings/${listing.id}`} className="btn btn-sm btn-outline">View</Link>
                    <Link href={`/dashboard/edit/${listing.id}`} className="btn btn-sm btn-secondary">Edit</Link>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="btn btn-sm btn-danger"
                      disabled={deleting === listing.id}
                    >
                      {deleting === listing.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">🏡</div>
              <h3 className="dashboard-empty-title">No listings yet</h3>
              <p className="dashboard-empty-text">Create your first property listing and start attracting buyers.</p>
              <Link href="/dashboard/new" className="btn btn-primary">
                + Create Your First Listing
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
