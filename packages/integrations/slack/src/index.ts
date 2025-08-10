import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface SlackMessage {
  id: string;
  user: string;
  text: string;
  ts: string;
}

export async function listMentions(_since: string): Promise<SlackMessage[]> {
  if (process.env.DRY_RUN !== 'false') {
    return [
      {
        id: 'slack1',
        user: 'alice',
        text: 'Can you review the doc?',
        ts: String(Date.now())
      },
      {
        id: 'slack2',
        user: 'newsletterbot',
        text: 'Daily summary for you',
        ts: String(Date.now())
      }
    ];
  }
  const token = process.env.SLACK_TOKEN;
  if (!token) throw new Error('Missing SLACK_TOKEN');
  const res = await axios.get('https://slack.com/api/conversations.history', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.messages;
}
