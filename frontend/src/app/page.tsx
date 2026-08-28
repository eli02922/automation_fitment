import { searchFitments } from '@/lib/fitmentApi';
import { FitmentSearchForm } from './FitmentSearchForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { make?: string; model?: string; year?: string; partNumber?: string };
}

export default async function CatalogPage({ searchParams }: PageProps) {
  let result;
  let error: string | null = null;

  try {
    result = await searchFitments({
      make: searchParams.make,
      model: searchParams.model,
      partNumber: searchParams.partNumber,
      year: searchParams.year ? Number(searchParams.year) : undefined,
    });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error fetching fitments';
  }

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Vehicle Fitment Catalog</h1>
      <FitmentSearchForm initialValues={searchParams} />

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {result && (
        <>
          <p>
            {result.total} result{result.total === 1 ? '' : 's'}
          </p>
          <table width="100%" cellPadding={8} style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #ccc' }}>
                <th>Part #</th>
                <th>Make</th>
                <th>Model</th>
                <th>Years</th>
                <th>Trim</th>
                <th>Engine</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((f) => (
                <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td>{f.partNumber}</td>
                  <td>{f.make}</td>
                  <td>{f.model}</td>
                  <td>
                    {f.yearStart}–{f.yearEnd}
                  </td>
                  <td>{f.trim ?? '-'}</td>
                  <td>{f.engine ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
