export function loadFromStorage() {
  return JSON.parse(localStorage.getItem('data')) || [];
}

export function loadThemeFromStorage() {
  return localStorage.getItem('dark');
}
