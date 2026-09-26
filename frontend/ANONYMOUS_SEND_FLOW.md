# Anonymous Prediction — implemented flow

1. User opens Anonymous Prediction.
2. Enters recipient (`@username` or Telegram link).
3. Optionally writes a personal message (300 chars).
4. Reviews the message.
5. Frontend calls backend.
6. Backend creates an unpredictable one-time token and stores the prediction/message.
7. App creates a Telegram Mini App deep link and share URL.
8. Sender shares it in Telegram.
9. Recipient opens the link and sees the optional message + prediction inside the MYSTIQ card.

The sender identity is never put into the public token. The token is random and stored server-side as a SHA-256 hash.

Production: set `REQUIRE_TELEGRAM_AUTH=true`, configure the bot token and use a real database instead of `data.json`.
