'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const navClass = isHome && !scrolled ? 'navbar navbar-transparent' : 'navbar navbar-solid';
  const textColor = isHome && !scrolled ? 'white' : undefined;

  return (
    <nav className={navClass}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" style={{ color: textColor }}>
          <div className="navbar-logo-icon">LE</div>
          Luxe Estates
        </Link>

        <div className="navbar-links">
          <Link href="/" className={`navbar-link ${pathname === '/' ? 'active' : ''}`} style={{ color: textColor ? 'rgba(255,255,255,0.8)' : undefined }}>
            Home
          </Link>
          <Link href="/listings" className={`navbar-link ${pathname === '/listings' ? 'active' : ''}`} style={{ color: textColor ? 'rgba(255,255,255,0.8)' : undefined }}>
            Listings
          </Link>
          {user && (
            <Link href="/dashboard" className={`navbar-link ${pathname.startsWith('/dashboard') ? 'active' : ''}`} style={{ color: textColor ? 'rgba(255,255,255,0.8)' : undefined }}>
              Dashboard
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <span style={{ fontSize: '0.875rem', color: textColor || 'var(--color-text-secondary)' }}>
                Hi, {user.name?.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-sm btn-outline" style={textColor ? { color: 'white', borderColor: 'rgba(255,255,255,0.3)' } : {}}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-sm btn-ghost" style={{ color: textColor || undefined }}>
                Log In
              </Link>
              <Link href="/auth/signup" className="btn btn-sm btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          <span style={{ background: textColor || 'var(--color-text)' }} />
          <span style={{ background: textColor || 'var(--color-text)' }} />
          <span style={{ background: textColor || 'var(--color-text)' }} />
        </button>
      </div>

      {mobileOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          padding: '16px 24px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'fadeInDown 0.3s ease'
        }}>
          <Link href="/" onClick={() => setMobileOpen(false)} style={{ padding: '8px 0', fontWeight: 500 }}>Home</Link>
          <Link href="/listings" onClick={() => setMobileOpen(false)} style={{ padding: '8px 0', fontWeight: 500 }}>Listings</Link>
          {user && <Link href="/dashboard" onClick={() => setMobileOpen(false)} style={{ padding: '8px 0', fontWeight: 500 }}>Dashboard</Link>}
          {user ? (
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn btn-sm btn-outline" style={{ marginTop: '8px' }}>Logout</button>
          ) : (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="btn btn-sm btn-outline" style={{ flex: 1 }}>Log In</Link>
              <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="btn btn-sm btn-primary" style={{ flex: 1 }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
