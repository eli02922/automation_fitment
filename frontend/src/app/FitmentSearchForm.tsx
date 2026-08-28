'use client';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

interface Props {
  initialValues: { make?: string; model?: string; year?: string; partNumber?: string };
}

export function FitmentSearchForm({ initialValues }: Props) {
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (value) params.set(key, String(value));
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <input name="make" placeholder="Make" defaultValue={initialValues.make} />
      <input name="model" placeholder="Model" defaultValue={initialValues.model} />
      <input name="year" placeholder="Year" defaultValue={initialValues.year} />
      <input name="partNumber" placeholder="Part Number" defaultValue={initialValues.partNumber} />
      <button type="submit">Search</button>
    </form>
  );
}
