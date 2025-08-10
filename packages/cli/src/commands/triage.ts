import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import dotenv from 'dotenv';
import { listThreads, GmailMessage } from '@inbox/gmail';
import { listMentions, SlackMessage } from '@inbox/slack';
import { saveMessage } from '@inbox/storage';

dotenv.config();

interface Rule {
  conditions: {
    sender?: string;
    keywords?: string[];
    labels?: string[];
    channel?: string;
  };
  actions: {
    category?: string;
    labels?: string[];
    snooze?: string;
  };
}

 export function loadRules(): Rule[] {
  const file = path.join(process.cwd(), 'config', 'rules.yaml');
  if (!fs.existsSync(file)) return [];
  const content = fs.readFileSync(file, 'utf8');
  return YAML.parse(content) as Rule[];
}

function matchRule(msg: any, rule: Rule): boolean {
  const { conditions } = rule;
  if (conditions.sender && msg.sender !== conditions.sender) return false;
  if (conditions.channel && msg.channel !== conditions.channel) return false;
  if (conditions.labels && !conditions.labels.every((l) => msg.labels?.includes(l))) return false;
  if (conditions.keywords && !conditions.keywords.some((k) => msg.snippet?.includes(k) || msg.text?.includes(k))) return false;
  return true;
}

 export function categorize(msg: any, rules: Rule[]): string {
  for (const rule of rules) {
    if (matchRule(msg, rule)) {
      if (rule.actions.labels) msg.labels = Array.from(new Set([...(msg.labels || []), ...rule.actions.labels]));
      if (rule.actions.category) return rule.actions.category;
    }
  }
  return 'Archive';
}

function summarizeGmail(message: GmailMessage) {
  return `${message.subject} - ${message.snippet}`;
}

function summarizeSlack(message: SlackMessage) {
  return `${message.user}: ${message.text}`;
}

export default async function triage(opts: { since: string }) {
  const rules = loadRules();
  const gmail = await listThreads(opts.since);
  const slack = await listMentions(opts.since);

  const messages: any[] = [];
  for (const g of gmail) messages.push({ ...g, channel: 'gmail', summary: summarizeGmail(g) });
  for (const s of slack) messages.push({ ...s, channel: 'slack', summary: summarizeSlack(s) });

  const report: Record<string, any[]> = {
    'Must Reply': [],
    'Important': [],
    'Low Priority': [],
    'Newsletters': []
  };

  for (const msg of messages) {
    const category = categorize(msg, rules);
    const entry = { id: msg.id, summary: msg.summary, sender: msg.sender || msg.user };
    saveMessage({ id: msg.id, channel: msg.channel, data: msg, category, createdAt: new Date().toISOString() });
    if (msg.labels?.includes('NEWSLETTER') || category === 'Archive') {
      report['Newsletters'].push(entry);
    } else if (category === 'Reply') {
      report['Must Reply'].push(entry);
    } else if (category === 'Defer') {
      report['Important'].push(entry);
    } else {
      report['Low Priority'].push(entry);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const reportDir = path.join(process.cwd(), 'reports');
  fs.mkdirSync(reportDir, { recursive: true });
  const reportFile = path.join(reportDir, `inbox-${today}.md`);
  const lines = [`# Inbox Report ${today}`];
  for (const section of Object.keys(report)) {
    lines.push(`\n## ${section}`);
    for (const item of report[section]) {
      lines.push(`- [${item.id}] ${item.summary} (${item.sender})`);
    }
  }
  fs.writeFileSync(reportFile, lines.join('\n'));
  console.log(`Report written to ${reportFile}`);
}
