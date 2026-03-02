import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ListingCard from '../../components/ListingCard';
import { getListingById, getListings } from '@/lib/db';

export default async function ListingDetailPage({ params }) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    notFound();
  }

  const allListings = getListings();
  const related = allListings
    .filter(l => l.id !== listing.id && l.propertyType === listing.propertyType)
    .slice(0, 3);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const imageUrl = listing.images?.[0] || '/images/placeholder.jpg';
  const agentInitials = listing.agentName?.split(' ').map(n => n[0]).join('') || '?';

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container listing-detail animate-fade-in">
          {/* Back link */}
          <Link href="/listings" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-text-secondary)',
            marginBottom: '24px',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}>
            ← Back to Listings
          </Link>

          {/* Hero Image */}
          <div className="listing-detail-hero">
            <img src={imageUrl} alt={listing.title} />
            <div className="listing-detail-hero-overlay">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span className="badge badge-gold">{listing.propertyType}</span>
              </div>
              <div className="listing-detail-price">{formatPrice(listing.price)}</div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="listing-detail-grid">
            <div className="listing-detail-info">
              <div>
                <h1 className="listing-detail-title heading-display">{listing.title}</h1>
                <p className="listing-detail-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {listing.address}, {listing.city}, {listing.state} {listing.zip}
                </p>
              </div>

              {/* Meta */}
              <div className="listing-detail-meta">
                <div className="listing-detail-meta-item">
                  <div className="listing-detail-meta-value">{listing.bedrooms}</div>
                  <div className="listing-detail-meta-label">Bedrooms</div>
                </div>
                <div className="listing-detail-meta-item">
                  <div className="listing-detail-meta-value">{listing.bathrooms}</div>
                  <div className="listing-detail-meta-label">Bathrooms</div>
                </div>
                <div className="listing-detail-meta-item">
                  <div className="listing-detail-meta-value">{listing.sqft?.toLocaleString()}</div>
                  <div className="listing-detail-meta-label">Sq Ft</div>
                </div>
                <div className="listing-detail-meta-item">
                  <div className="listing-detail-meta-value">{listing.propertyType}</div>
                  <div className="listing-detail-meta-label">Type</div>
                </div>
              </div>

              {/* Description */}
              <div className="listing-detail-description">
                <h3>About This Property</h3>
                <p>{listing.description}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="listing-detail-sidebar">
              <div className="listing-detail-agent">
                <div className="listing-detail-agent-avatar">{agentInitials}</div>
                <div className="listing-detail-agent-name">{listing.agentName}</div>
                <div className="listing-detail-agent-title">Listing Agent</div>
                <div className="listing-detail-agent-info">
                  {listing.agentPhone && <span>📞 {listing.agentPhone}</span>}
                  {listing.agentEmail && <span>✉️ {listing.agentEmail}</span>}
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }}>Contact Agent</button>
              </div>
            </div>
          </div>

          {/* Related Listings */}
          {related.length > 0 && (
            <section style={{ marginTop: '64px' }}>
              <h2 className="section-title heading-display" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
                Similar Properties
              </h2>
              <div className="listings-grid">
                {related.map(l => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
