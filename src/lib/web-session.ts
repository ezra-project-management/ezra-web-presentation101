/** Demo “logged in” flag for marketing nav + hero (set on login/register, cleared on sign out). */
export const WEB_SESSION_KEY = 'ezra-web-logged-in'

export function setWebSessionLoggedIn() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(WEB_SESSION_KEY, '1')
    window.dispatchEvent(new Event('ezra-web-session'))
  } catch {
    /* ignore */
  }
}

export function clearWebSession() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(WEB_SESSION_KEY)
    window.dispatchEvent(new Event('ezra-web-session'))
  } catch {
    /* ignore */
  }
}

export function isWebSessionLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(WEB_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

/** Public membership entry: dashboard for signed-in demo users, register with redirect otherwise. */
export function membershipEntryHref(isLoggedIn: boolean): string {
  return isLoggedIn
    ? '/dashboard/membership'
    : '/auth/register?redirect=/dashboard/membership'
}
