export const metadata = {
  title: 'Automotive Fitment Catalog',
  description: 'Search and manage vehicle fitment records across the enterprise catalog.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
