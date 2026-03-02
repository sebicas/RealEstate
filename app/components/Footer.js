import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: '0.875rem' }}>LE</div>
              Luxe Estates
            </div>
            <p className="footer-desc">
              Your premier destination for luxury real estate. Discover exceptional properties and find your perfect home.
            </p>
          </div>
          <div>
            <h4 className="footer-title">Explore</h4>
            <div className="footer-links">
              <Link href="/listings">All Listings</Link>
              <Link href="/listings?type=house">Houses</Link>
              <Link href="/listings?type=condo">Condos</Link>
              <Link href="/listings?type=apartment">Apartments</Link>
            </div>
          </div>
          <div>
            <h4 className="footer-title">Account</h4>
            <div className="footer-links">
              <Link href="/auth/signup">Sign Up</Link>
              <Link href="/auth/login">Log In</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/dashboard/new">List Property</Link>
            </div>
          </div>
          <div>
            <h4 className="footer-title">Contact</h4>
            <div className="footer-links">
              <span>info@luxeestates.com</span>
              <span>(310) 555-0100</span>
              <span>Beverly Hills, CA</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Luxe Estates. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
