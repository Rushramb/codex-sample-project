import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface GmailMessage {
  id: string;
  threadId: string;
  sender: string;
  subject: string;
  snippet: string;
  labels: string[];
}

export async function listThreads(_since: string): Promise<GmailMessage[]> {
  if (process.env.DRY_RUN !== 'false') {
    // return sample data in dry-run
    return [
      {
        id: 'gmail1',
        threadId: 't1',
        sender: 'boss@example.com',
        subject: 'Project Update',
        snippet: 'Please send the latest report...'
        ,
        labels: ['INBOX']
      },
      {
        id: 'gmail2',
        threadId: 't2',
        sender: 'newsletter@example.com',
        subject: 'Weekly News',
        snippet: 'Here is your weekly newsletter...',
        labels: ['INBOX', 'NEWSLETTER']
      }
    ];
  }
  // Placeholder for real Gmail API calls
  const token = process.env.GMAIL_TOKEN;
  if (!token) throw new Error('Missing GMAIL_TOKEN');
  // Real implementation would use Google API, simplified here
  const res = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.messages;
}
