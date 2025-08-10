import { Command } from 'commander';
import triage from './commands/triage.js';
import { reply, snooze, label } from './commands/actions.js';

const program = new Command();
program.name('inbox').description('Inbox Triage Assistant');

program.command('triage')
  .option('--since <duration>', 'look back duration like 24h', '24h')
  .action(triage);

program.command('reply <id>').action(reply);
program.command('snooze <id>').option('--until <duration>', 'duration to snooze', '1d').action(snooze);
program.command('label <id> <label>').action(label);

program.parse();
