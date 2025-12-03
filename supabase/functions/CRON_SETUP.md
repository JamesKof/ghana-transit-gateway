# Setting Up Automated E-Visa Reminder Emails

This project includes an automated reminder system that sends emails to applicants whose e-visa applications have been under review for 5 or more business days.

## How It Works

The `send-evisa-reminder` edge function:
- Checks all applications with status "pending" or "submitted"
- Calculates business days (excluding weekends) since submission
- Sends reminder emails to applicants waiting 5+ business days
- Provides updated timeline expectations and status information

## Setting Up the Cron Job

To enable automated daily reminders, you need to schedule the function using Supabase's pg_cron extension.

### Step 1: Enable Required Extensions

Run this SQL in your Supabase SQL editor:

```sql
-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Step 2: Schedule the Reminder Function

Run this SQL to schedule daily reminders at 9 AM UTC:

```sql
SELECT cron.schedule(
  'send-evisa-reminders-daily',
  '0 9 * * *', -- Run at 9:00 AM UTC every day
  $$
  SELECT
    net.http_post(
        url:='https://ipxmforozcdzkkqtjhgl.supabase.co/functions/v1/send-evisa-reminder',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweG1mb3JvemNkemtrcXRqaGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MjA5ODQsImV4cCI6MjA4MDA5Njk4NH0.dT-HtbXmG9Z49viJdWGNandodV54yDFxOKAnsP8QeLQ"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);
```

### Step 3: Verify the Cron Job

Check if the cron job was created successfully:

```sql
SELECT * FROM cron.job WHERE jobname = 'send-evisa-reminders-daily';
```

### Step 4: View Cron Job Execution History

Monitor the cron job execution:

```sql
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'send-evisa-reminders-daily')
ORDER BY start_time DESC
LIMIT 10;
```

## Customizing the Schedule

You can adjust the cron schedule using standard cron syntax:

- `'0 9 * * *'` - Daily at 9 AM UTC
- `'0 9 * * 1-5'` - Weekdays only at 9 AM UTC
- `'0 9,14 * * *'` - Twice daily at 9 AM and 2 PM UTC
- `'0 */6 * * *'` - Every 6 hours

## Manual Testing

To manually trigger the reminder function (useful for testing):

```sql
SELECT
  net.http_post(
      url:='https://ipxmforozcdzkkqtjhgl.supabase.co/functions/v1/send-evisa-reminder',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweG1mb3JvemNkemtrcXRqaGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MjA5ODQsImV4cCI6MjA4MDA5Njk4NH0.dT-HtbXmG9Z49viJdWGNandodV54yDFxOKAnsP8QeLQ"}'::jsonb,
      body:='{}'::jsonb
  ) as request_id;
```

## Removing the Cron Job

If you need to remove or disable the cron job:

```sql
SELECT cron.unschedule('send-evisa-reminders-daily');
```

## Monitoring

The function logs all activity which can be viewed in:
1. Supabase Edge Function Logs
2. The function returns a detailed response with success/failure counts

## Notes

- The function uses **business days** calculation (excludes weekends)
- Reminders are only sent for applications in "pending" or "submitted" status
- Each reminder includes updated timeline expectations
- The function is idempotent and safe to run multiple times
