import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.C0Ve6-vh.js","_app/immutable/chunks/CmOt4mDQ.js","_app/immutable/chunks/pf7KOJrY.js","_app/immutable/chunks/D2TcuHkd.js","_app/immutable/chunks/1bXq2FG_.js","_app/immutable/chunks/BIIlYxzt.js","_app/immutable/chunks/Ckouh465.js","_app/immutable/chunks/C8bEiUpu.js","_app/immutable/chunks/DLpg7eLt.js","_app/immutable/chunks/G9UG2Ga4.js","_app/immutable/chunks/D8g41Pc6.js","_app/immutable/chunks/C_ntv7qB.js"];
export const stylesheets = ["_app/immutable/assets/0.D14d60yT.css","_app/immutable/assets/ProgressBar.c6i8ireL.css"];
export const fonts = [];
