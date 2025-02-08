import "clsx";
import { g as get, w as writable, r as readable } from "./index2.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
const stores = {};
function localStorageStore(key, initialValue, options) {
  if (!stores[key]) {
    const store = writable(initialValue, (set2) => {
    });
    const { subscribe, set } = store;
    stores[key] = {
      set(value) {
        set(value);
      },
      update(updater) {
        const value = updater(get(store));
        set(value);
      },
      subscribe
    };
  }
  return stores[key];
}
localStorageStore("modeOsPrefers", false);
localStorageStore("modeUserPrefers", void 0);
const modeCurrent = localStorageStore("modeCurrent", false);
function setInitialClassState() {
  const elemHtmlClasses = document.documentElement.classList;
  const condLocalStorageUserPrefs = localStorage.getItem("modeUserPrefers") === "false";
  const condLocalStorageUserPrefsExists = !("modeUserPrefers" in localStorage);
  const condMatchMedia = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (condLocalStorageUserPrefs || condLocalStorageUserPrefsExists && condMatchMedia) {
    elemHtmlClasses.add("dark");
  } else {
    elemHtmlClasses.remove("dark");
  }
}
function prefersReducedMotion() {
  return false;
}
const prefersReducedMotionStore = readable(prefersReducedMotion(), (set) => {
});
const yayState = {
  enabled_rulesets: [],
  is_loading: false,
  log_messages: [],
  targets: [],
  matches: [],
  matches_map: {}
};
const get_matches = () => {
  const matches = [];
  for (let path in yayState.matches_map) {
    let match = {
      "path": path,
      "rules": yayState.matches_map[path]
    };
    console.log(match);
    matches.push(match);
  }
  return matches;
};
export {
  get_matches as g,
  html as h,
  modeCurrent as m,
  prefersReducedMotionStore as p,
  setInitialClassState as s,
  yayState as y
};
