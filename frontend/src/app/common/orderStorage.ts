const orderStorage = {
  get(key: string) {
    return window.localStorage.getItem(key);
  },
  getJson(key: string) {
    return JSON.parse(window.localStorage.getItem(key) || "{}");
  },
  set(key: string, value: string) {
    window.localStorage.setItem(key, value);
  },
  setJson(key: string, value: object) {
    window.localStorage.removeItem(key)
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  clear(key: string) {
    window.localStorage.removeItem(key);
  },
};

export default orderStorage;
