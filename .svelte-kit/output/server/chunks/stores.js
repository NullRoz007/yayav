import { w as writable } from "./index2.js";
import { a4 as getContext, V as setContext } from "./index.js";
const DRAWER_STORE_KEY = "drawerStore";
function getDrawerStore() {
  const drawerStore = getContext(DRAWER_STORE_KEY);
  if (!drawerStore)
    throw new Error("drawerStore is not initialized. Please ensure that `initializeStores()` is invoked in the root layout file of this app!");
  return drawerStore;
}
function initializeDrawerStore() {
  const drawerStore = drawerService();
  return setContext(DRAWER_STORE_KEY, drawerStore);
}
function drawerService() {
  const { subscribe, set, update } = writable({});
  return {
    subscribe,
    set,
    update,
    /** Open the drawer. */
    open: (newSettings) => update(() => {
      return { open: true, ...newSettings };
    }),
    /** Close the drawer. */
    close: () => update((d) => {
      d.open = false;
      return d;
    })
  };
}
export {
  getDrawerStore as g,
  initializeDrawerStore as i
};
