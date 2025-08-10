import { describe, it, expect } from 'vitest';
import { categorize } from '../src/commands/triage.js';

describe('rule categorization', () => {
  const rules = [
    { conditions: { sender: 'boss@example.com' }, actions: { category: 'Reply' } },
    { conditions: { channel: 'slack' }, actions: { category: 'Defer' } }
  ];

  it('matches sender rule', () => {
    const msg = { sender: 'boss@example.com', channel: 'gmail' };
    expect(categorize(msg, rules)).toBe('Reply');
  });

  it('matches channel rule', () => {
    const msg = { user: 'alice', channel: 'slack' };
    expect(categorize(msg, rules)).toBe('Defer');
  });

  it('defaults to Archive', () => {
    const msg = { sender: 'other', channel: 'gmail' };
    expect(categorize(msg, rules)).toBe('Archive');
  });
});
