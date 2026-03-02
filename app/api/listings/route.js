import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getListings, createListing } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    let listings = getListings();
    const { searchParams } = new URL(request.url);

    const q = searchParams.get('q')?.toLowerCase();
    const type = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');

    if (q) {
      listings = listings.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
      );
    }

    if (type) {
      listings = listings.filter(l => l.propertyType === type);
    }

    if (minPrice) {
      listings = listings.filter(l => l.price >= Number(minPrice));
    }

    if (maxPrice) {
      listings = listings.filter(l => l.price <= Number(maxPrice));
    }

    if (bedrooms) {
      listings = listings.filter(l => l.bedrooms >= Number(bedrooms));
    }

    // Sort by newest first
    listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ listings });
  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, price, address, city, state, zip, bedrooms, bathrooms, sqft, propertyType, images } = body;

    if (!title || !price || !city || !state) {
      return NextResponse.json({ error: 'Title, price, city, and state are required' }, { status: 400 });
    }

    const listing = {
      id: uuidv4(),
      userId: user.id,
      title,
      description: description || '',
      price: Number(price),
      address: address || '',
      city,
      state,
      zip: zip || '',
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      sqft: Number(sqft) || 0,
      propertyType: propertyType || 'house',
      images: images || [],
      featured: false,
      agentName: user.name,
      agentPhone: user.phone || '',
      agentEmail: user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createListing(listing);

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
