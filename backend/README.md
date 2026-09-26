# MYSTIQ Backend — phase 1

This backend is the server-side foundation for MYSTIQ. It deliberately keeps the existing frontend untouched.

## Included now

- SQLite database
- Telegram Mini App `initData` validation
- user upsert/profile endpoint
- 24-hour anonymous prediction entitlement check
- anonymous prediction creation
- opaque, hashed, expiring tokens
- anonymous prediction retrieval
- CORS + environment configuration

Telegram says `initDataUnsafe` must not be trusted; the backend therefore validates the raw `Telegram.WebApp.initData` using the bot token before accepting the user identity. citeturn0search0

## Run

```powershell
cd backend
copy .env.example .env
# Put your bot token and bot username into .env
npm install
npm run dev
```

Backend: `http://localhost:3001`

Health: `GET /health`

## Frontend integration

Send the raw value from:

```ts
window.Telegram?.WebApp?.initData
```

in the `X-Telegram-Init-Data` header. Do not send `initDataUnsafe` as proof of identity.

## Next phase: Telegram Stars

The free window is intentionally enforced server-side. Paid access is not granted by a frontend click.

For digital goods/services, Telegram's payment docs specify Stars (`XTR`) and require the bot to process the pre-checkout update and then grant the purchased entitlement only after a `successful_payment` update is received. The Bot API also supports `createInvoiceLink` for generating invoice links. citeturn0search1turn0search2

The next backend migration should add an `entitlements`/`payments` table and wire:

1. create invoice;
2. pre-checkout handling;
3. successful payment handling;
4. persistent access-until timestamp;
5. frontend invoice opening and access refresh.
