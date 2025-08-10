# Inbox Triage Assistant

CLI tool to triage Gmail and Slack messages with YAML rules and daily report.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set tokens. Dry-run is true by default.
3. Add rules in `config/rules.yaml`.

## Usage

```
npm run build
npx inbox triage --since 24h
```

Generates report in `reports/inbox-YYYY-MM-DD.md`.

Available actions:
```
inbox reply <id>
inbox snooze <id> --until 2d
inbox label <id> <label>
```

## Testing

```
npm test
```

## Sample

See `config/rules.yaml` and `reports/sample-report.md`.
