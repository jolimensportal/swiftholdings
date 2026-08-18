import { describe, expect, it } from 'vitest';
import { documents } from './documents';

describe('documents', () => {
  it('lists the three gated documents', () => {
    expect(documents).toHaveLength(3);
  });

  it('keeps the approved titles and page counts', () => {
    const titles = documents.map(document => document.title);

    expect(titles).toContain('Partnership Summary');
    expect(documents[0].pages).toBe(42);

    expect(titles).toContain('Investor Summary & Partnership Models');
    expect(documents[1].pages).toBe(38);

    expect(titles).toContain('Institutional Modular Hospitality in Ghana');
    expect(documents[2].pages).toBe(24);
  });

  it('gives every document a form, a length, and a gate', () => {
    for (const document of documents) {
      expect(document.form).toBeTruthy();
      expect(document.length).toMatch(/min|hours/);
      expect(document.gate).toBeTruthy();
    }
  });
});