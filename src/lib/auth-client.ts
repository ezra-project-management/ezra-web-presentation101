/** Demo session flag for client-side UI (nav Book Now, etc.). Not a security boundary. */
export const EZRA_SESSION_KEY = 'ezra-session'

export function setEzraSessionLoggedIn(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(EZRA_SESSION_KEY, '1')
    window.dispatchEvent(new Event('ezra-auth-change'))
  } catch {
    /* ignore */
  }
}

export function clearEzraSession(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(EZRA_SESSION_KEY)
    window.dispatchEvent(new Event('ezra-auth-change'))
  } catch {
    /* ignore */
  }
}

export function isEzraSessionLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(EZRA_SESSION_KEY) === '1'
  } catch {
    return false
  }
}
