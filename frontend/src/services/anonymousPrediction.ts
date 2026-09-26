const STORAGE_KEY = 'mystiq_anonymous_prediction_access_v1'

type AccessState = {
  firstAccessAt: number
  paidAccessUntil: number
}

const FREE_WINDOW_MS = 24 * 60 * 60 * 1000

function readState(): AccessState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeState(state: AccessState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be unavailable in private/embedded contexts.
  }
}

export function getAnonymousPredictionAccess() {
  const now = Date.now()
  const state = readState()

  if (!state) {
    const next = { firstAccessAt: now, paidAccessUntil: 0 }
    writeState(next)
    return {
      isFree: true,
      isUnlocked: true,
      freeUntil: now + FREE_WINDOW_MS,
      paidUntil: 0,
    }
  }

  const freeUntil = state.firstAccessAt + FREE_WINDOW_MS
  const isFree = now < freeUntil
  const isPaid = now < state.paidAccessUntil

  return {
    isFree,
    isUnlocked: isFree || isPaid,
    freeUntil,
    paidUntil: state.paidAccessUntil,
  }
}

/**
 * Local MVP only.
 * Real Stars verification MUST happen on the backend before granting paid access.
 */
export function grantLocalAnonymousPredictionAccess(days = 1) {
  const state = readState() ?? {
    firstAccessAt: Date.now(),
    paidAccessUntil: 0,
  }

  state.paidAccessUntil = Math.max(
    state.paidAccessUntil,
    Date.now() + days * FREE_WINDOW_MS,
  )

  writeState(state)
}
