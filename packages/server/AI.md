# Task improvement API

Initial backend implementation using the OpenAI Responses API, `gpt-4.1-mini`, and structured JSON output. The endpoint returns a suggestion without creating or updating a task.

## Local review

Set `AI_ENABLED=true` and `OPENAI_API_KEY` in the server's `.env`, then restart the server. AI defaults to disabled. Missing configuration returns 503 without affecting task CRUD. Never place the key in client variables or commit it.

After logging in, send `POST /api/tasks/improve` with the authentication cookie or Bearer token and `Content-Type: application/json`:

```json
{ "title": "fix login", "description": "error msg not showing for wrong password" }
```

Both fields are trimmed. At least one must contain text; title is limited to 200 characters and description to 4,000. Omitted fields become empty strings; null and unknown fields are rejected. Example success response (wording varies):

```json
{
   "statusCode": 200,
   "data": {
      "title": "Fix login error message",
      "description": "Display an error message when an incorrect password is entered."
   },
   "message": "Task suggestion generated",
   "success": true
}
```

The Create Task dialog includes an optional **Improve with AI** action. It sends the current draft to this endpoint and displays an editable suggestion without changing the original fields. **Use Suggestion** fills the form; **Keep Original** discards the preview. The existing **Create Task** action saves the chosen values. Editing an original field dismisses its preview, and closing the dialog clears AI state. The edit-task dialog does not expose AI improvement.

For UI review, verify title-only and description-only drafts, editing a suggestion before applying, keeping the original, and closing/reopening during a request. Empty drafts cannot request suggestions. While the request is pending, the original fields are read-only and duplicate requests are disabled; creating with the original remains available. While reviewing a suggestion, choose Use Suggestion or Keep Original before creating. AI errors leave manual creation available. The frontend uses a 20-second timeout and no automatic mutation retries.

## Behavior and errors

Calls use a 15-second SDK timeout, at most 1,500 output tokens, no automatic retries, and `store: false`. The prompt preserves intent and avoids inventing facts; returned fields are validated locally. No submitted task text or raw provider errors are logged by this feature.

Errors use the existing JSON envelope with `success: false` and `data: null`:

| Status | Meaning                                                        |
| ------ | -------------------------------------------------------------- |
| 400    | Invalid input or malformed JSON                                |
| 401    | Missing or invalid authentication                              |
| 422    | Model refusal                                                  |
| 502    | Invalid/incomplete output or other provider failure            |
| 503    | AI disabled, key missing, or provider quota/rate limit reached |
| 504    | Provider timeout                                               |

## Initial implementation limits

There are no application rate limits or daily spend quotas yet. Keep AI disabled on the public deployment until persistent per-user/global limits and cookie-origin/CSRF protection are added. In-memory counters would not reliably enforce quotas across Vercel instances. Input/output bounds constrain individual calls, not total spend.

Run `bun run --cwd packages/server check` and `bun run --cwd packages/server test --run` from the repository root. AI tests exercise the route with a mocked provider and incur no API charges. Live model quality and account access still need manual validation.
