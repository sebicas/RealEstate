import Link from 'next/link';

export default function ListingCard({ listing }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const imageUrl = listing.images?.[0] || '/images/placeholder.jpg';

  return (
    <Link href={`/listings/${listing.id}`} className="listing-card">
      <div className="listing-card-image">
        <img src={imageUrl} alt={listing.title} />
        <div className="listing-card-price">{formatPrice(listing.price)}</div>
        {listing.featured && (
          <div className="listing-card-featured">
            <span className="badge badge-gold">Featured</span>
          </div>
        )}
      </div>
      <div className="listing-card-body">
        <h3 className="listing-card-title">{listing.title}</h3>
        <div className="listing-card-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {listing.city}, {listing.state}
        </div>
        <div className="listing-card-details">
          <div className="listing-card-detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7"/><path d="M21 7H3l2-4h14l2 4z"/><path d="M12 4v16"/></svg>
            <strong>{listing.bedrooms}</strong> Beds
          </div>
          <div className="listing-card-detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16a1 1 0 011 1v3a3 3 0 01-3 3H6a3 3 0 01-3-3v-3a1 1 0 011-1z"/><path d="M6 12V5a2 2 0 012-2h3v2.25"/></svg>
            <strong>{listing.bathrooms}</strong> Baths
          </div>
          <div className="listing-card-detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18"/><path d="M12 3v18"/></svg>
            <strong>{listing.sqft?.toLocaleString()}</strong> sqft
          </div>
        </div>
      </div>
    </Link>
  );
}
