import { getMessage, saveMessage } from '@inbox/storage';

export function reply(id: string) {
  const msg = getMessage(id);
  if (!msg) return console.log('Message not found');
  console.log(`Would reply to ${id}:`, msg.data.summary || msg.data.text);
}

export function snooze(id: string, opts: { until: string }) {
  const msg = getMessage(id);
  if (!msg) return console.log('Message not found');
  msg.category = `Snoozed until ${opts.until}`;
  saveMessage(msg);
  console.log(`Snoozed ${id} until ${opts.until}`);
}

export function label(id: string, label: string) {
  const msg = getMessage(id);
  if (!msg) return console.log('Message not found');
  msg.data.labels = Array.from(new Set([...(msg.data.labels || []), label]));
  saveMessage(msg);
  console.log(`Labeled ${id} with ${label}`);
}
