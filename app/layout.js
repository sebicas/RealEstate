import './globals.css';

export const metadata = {
  title: 'Luxe Estates — Premium Real Estate Listings',
  description: 'Discover luxury homes and properties. Browse listings, find your dream home, or list your property for sale on Luxe Estates.',
  keywords: 'real estate, luxury homes, property listings, houses for sale, apartments',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
