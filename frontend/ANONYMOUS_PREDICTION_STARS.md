# Anonymous Prediction — 24h Free + Telegram Stars

## Intended business rule

- A new user gets 24 hours of free access to the anonymous prediction.
- After the free window expires, access requires Telegram Stars.
- The purchase must unlock the feature only after Telegram confirms a successful payment.

## Important

The current frontend includes the UI and a LOCAL demo unlock so the flow can be tested.
The local unlock is NOT a real payment and must NOT be used in production.

## Production flow

1. Frontend sends authenticated Telegram `initData` to the backend.
2. Backend verifies Telegram Mini App `initData`.
3. Backend checks the user's anonymous prediction access.
4. If paid access is required, backend creates a Telegram Stars invoice.
5. Frontend opens the invoice with `Telegram.WebApp.openInvoice(...)`.
6. Backend verifies the successful Telegram payment.
7. Backend stores the entitlement for the user.
8. Frontend refreshes `/api/me` or `/api/anonymous-prediction/access`.
9. User can open the anonymous prediction.

## Suggested database fields

User:
- telegramUserId
- anonymousFreeStartedAt

AnonymousPredictionEntitlement:
- userId
- accessUntil
- source
- telegramPaymentChargeId
- createdAt

Never grant production access solely because a frontend button was clicked.
