export function getToken() {
  if (window.sessionStorage.getItem('hcToken')) {
    return window.atob(window.sessionStorage.getItem('hcToken'));
  }
  return false;
}

export function setToken(token) {
  if (!token) return false;
  window.sessionStorage.setItem('hcToken', window.btoa(token));
}
