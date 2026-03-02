'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function NewListingPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [images, setImages] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    propertyType: 'house',
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setUser(data.user))
      .catch(() => router.push('/auth/login'));
  }, [router]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (files) => {
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setImages(prev => [...prev, { url: data.url, preview: URL.createObjectURL(file) }]);
        }
      }
    } catch {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) handleImageUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) handleImageUpload(files);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title || !form.price || !form.city || !form.state) {
      setError('Please fill in all required fields (title, price, city, state)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          images: images.map(img => img.url),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create listing');
        return;
      }

      setSuccess('Listing created successfully!');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
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
        <div className="create-listing animate-fade-in">
          <div className="create-listing-header">
            <Link href="/dashboard" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', display: 'inline-block', marginBottom: '16px' }}>
              ← Back to Dashboard
            </Link>
            <h1 className="create-listing-title">Create New Listing</h1>
            <p className="create-listing-subtitle">Fill in the details below to list your property</p>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}
          {success && <div className="alert alert-success">✅ {success}</div>}

          <form onSubmit={handleSubmit} className="create-listing-form">
            {/* Property Details */}
            <div className="create-listing-section">
              <h3 className="create-listing-section-title">🏠 Property Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    placeholder="e.g., Modern Luxury Villa with Ocean View"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-input form-textarea"
                    placeholder="Describe your property in detail..."
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (USD) *</label>
                    <input
                      type="number"
                      name="price"
                      className="form-input"
                      placeholder="500000"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Property Type</label>
                    <select name="propertyType" className="form-input form-select" value={form.propertyType} onChange={handleChange}>
                      <option value="house">House</option>
                      <option value="condo">Condo</option>
                      <option value="apartment">Apartment</option>
                      <option value="townhouse">Townhouse</option>
                    </select>
                  </div>
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">Bedrooms</label>
                    <input type="number" name="bedrooms" className="form-input" placeholder="3" value={form.bedrooms} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bathrooms</label>
                    <input type="number" name="bathrooms" className="form-input" placeholder="2" value={form.bathrooms} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sq Ft</label>
                    <input type="number" name="sqft" className="form-input" placeholder="2000" value={form.sqft} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="create-listing-section">
              <h3 className="create-listing-section-title">📍 Location</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input type="text" name="address" className="form-input" placeholder="123 Main Street" value={form.address} onChange={handleChange} />
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input type="text" name="city" className="form-input" placeholder="Los Angeles" value={form.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input type="text" name="state" className="form-input" placeholder="CA" value={form.state} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP Code</label>
                    <input type="text" name="zip" className="form-input" placeholder="90001" value={form.zip} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="create-listing-section">
              <h3 className="create-listing-section-title">📸 Photos</h3>
              <div
                className={`image-upload-zone ${dragging ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <div className="image-upload-icon">📷</div>
                <p className="image-upload-title">
                  {uploading ? 'Uploading...' : 'Drag & drop images here or click to browse'}
                </p>
                <p className="image-upload-text">JPG, PNG up to 10MB each</p>
              </div>

              {images.length > 0 && (
                <div className="image-previews">
                  {images.map((img, i) => (
                    <div key={i} className="image-preview">
                      <img src={img.preview || img.url} alt={`Upload ${i + 1}`} />
                      <button type="button" className="image-preview-remove" onClick={() => removeImage(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Publishing Listing...' : 'Publish Listing'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
