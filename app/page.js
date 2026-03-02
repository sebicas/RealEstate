import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ListingCard from './components/ListingCard';
import { getListings } from '@/lib/db';

export default function HomePage() {
  const allListings = getListings();
  const featured = allListings.filter(l => l.featured).slice(0, 3);
  const totalListings = allListings.length;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="hero">
          <div className="hero-bg" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80)',
          }} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-badge">✦ Premium Real Estate Platform</div>
            <h1 className="hero-title">
              Find Your Dream <br />
              <span className="text-gradient">Luxury Home</span>
            </h1>
            <p className="hero-subtitle">
              Discover exceptional properties curated for discerning buyers. Browse listings or list your own property on our exclusive platform.
            </p>
            <form className="hero-search" action="/listings" method="GET">
              <input
                type="text"
                name="q"
                placeholder="Search by city, neighborhood, or address..."
              />
              <select name="type">
                <option value="">All Types</option>
                <option value="house">Houses</option>
                <option value="condo">Condos</option>
                <option value="apartment">Apartments</option>
                <option value="townhouse">Townhouses</option>
              </select>
              <button type="submit" className="hero-search-btn">Search</button>
            </form>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-number">{totalListings}+</div>
                <div className="hero-stat-label">Active Listings</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">200+</div>
                <div className="hero-stat-label">Happy Clients</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">50+</div>
                <div className="hero-stat-label">Cities Covered</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Curated Selection</span>
              <h2 className="section-title heading-display">Featured Properties</h2>
              <p className="section-subtitle">
                Hand-picked luxury properties that represent the finest in real estate
              </p>
            </div>
            <div className="listings-grid">
              {featured.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href="/listings" className="btn btn-lg btn-outline">
                View All Listings →
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">Why Choose Us</span>
              <h2 className="section-title heading-display">Everything You Need</h2>
              <p className="section-subtitle">
                We make buying, selling, and listing properties effortless
              </p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🏡</div>
                <h3 className="feature-title">Browse Listings</h3>
                <p className="feature-text">
                  Explore our curated collection of premium properties with detailed information and high-quality photos.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h3 className="feature-title">List Your Property</h3>
                <p className="feature-text">
                  Sign up and easily upload your property listing with photos, pricing, and all the details buyers need.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3 className="feature-title">Smart Search</h3>
                <p className="feature-text">
                  Find exactly what you&apos;re looking for with our powerful search and filtering capabilities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <h2 className="cta-title heading-display">Ready to List Your Property?</h2>
            <p className="cta-text">
              Join thousands of homeowners who trust Luxe Estates to showcase their properties to qualified buyers.
            </p>
            <Link href="/auth/signup" className="btn btn-lg btn-primary" style={{ position: 'relative' }}>
              Get Started Free →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
