export const TOKEN_KEY = 'birthday_rsvp_token'

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}
export function getAuthHeader() {
  const t = getToken()
  return t ? `Bearer ${t}` : undefined
}
