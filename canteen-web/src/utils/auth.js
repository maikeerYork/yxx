export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem('token')
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return localStorage.setItem('token', token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return localStorage.removeItem('token')
}