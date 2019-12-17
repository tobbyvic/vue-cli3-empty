export const removeValue = (value) => {
  localStorage.removeItem(value);
};

export const getValue = (value) => {
  return localStorage.getItem(value);
};

export const setValue = (item, value) => {
  localStorage.setItem(item, value);
};
