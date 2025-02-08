import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.DjcF9fFD.js","_app/immutable/chunks/Bv2CX0pF.js","_app/immutable/chunks/BZzQXbv5.js","_app/immutable/chunks/CWPEhIT3.js","_app/immutable/chunks/BvU8keI9.js","_app/immutable/chunks/oEOo3hgt.js","_app/immutable/chunks/DHHkUmq2.js","_app/immutable/chunks/0Eqm2C4h.js","_app/immutable/chunks/DI6-0i3U.js","_app/immutable/chunks/4g-qUO7l.js"];
export const stylesheets = ["_app/immutable/assets/0.hK485C9z.css","_app/immutable/assets/state.c6i8ireL.css"];
export const fonts = [];
