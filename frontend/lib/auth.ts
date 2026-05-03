const TOKEN_KEY = 'kbw_auth_token'

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(TOKEN_KEY)
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(TOKEN_KEY)
}
