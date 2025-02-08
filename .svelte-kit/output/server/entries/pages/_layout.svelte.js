import { V as setContext, X as sanitize_slots, Y as fallback, Z as attr, _ as slot, $ as bind_props, W as pop, a0 as sanitize_props, T as push, a1 as stringify, a2 as rest_props, a3 as spread_attributes, a4 as getContext, a5 as clsx, a6 as add_styles, a7 as store_get, a8 as escape_html, a9 as unsubscribe_stores, aa as head, ab as ensure_array_like, ac as await_block, ad as store_mutate } from "../../chunks/index.js";
import { w as writable } from "../../chunks/index2.js";
import "clsx";
import { i as initializeDrawerStore, g as getDrawerStore } from "../../chunks/stores.js";
import { h as html, p as prefersReducedMotionStore, m as modeCurrent, s as setInitialClassState, y as yayState } from "../../chunks/state.svelte.js";
import "../../chunks/client.js";
import { listen } from "@tauri-apps/api/event";
import "@tauri-apps/plugin-dialog";
import "@tauri-apps/api/core";
import hljs from "highlight.js/lib/core";
import yara from "highlightjs-yara";
const storeHighlightJs = writable(void 0);
const MODAL_STORE_KEY = "modalStore";
function initializeModalStore() {
  const modalStore = modalService();
  return setContext(MODAL_STORE_KEY, modalStore);
}
function modalService() {
  const { subscribe, set, update } = writable([]);
  return {
    subscribe,
    set,
    update,
    /** Append to end of queue. */
    trigger: (modal) => update((mStore) => {
      mStore.push(modal);
      return mStore;
    }),
    /**  Remove first item in queue. */
    close: () => update((mStore) => {
      if (mStore.length > 0)
        mStore.shift();
      return mStore;
    }),
    /** Remove all items from queue. */
    clear: () => set([])
  };
}
const toastDefaults = { message: "Missing Toast Message", autohide: true, timeout: 5e3 };
const TOAST_STORE_KEY = "toastStore";
function initializeToastStore() {
  const toastStore = toastService();
  return setContext(TOAST_STORE_KEY, toastStore);
}
function randomUUID() {
  const random = Math.random();
  return Number(random).toString(32);
}
function toastService() {
  const { subscribe, set, update } = writable([]);
  const close = (id) => update((tStore) => {
    if (tStore.length > 0) {
      const index = tStore.findIndex((t) => t.id === id);
      const selectedToast = tStore[index];
      if (selectedToast) {
        if (selectedToast.callback)
          selectedToast.callback({ id, status: "closed" });
        if (selectedToast.timeoutId)
          clearTimeout(selectedToast.timeoutId);
        tStore.splice(index, 1);
      }
    }
    return tStore;
  });
  function handleAutoHide(toast) {
    if (toast.autohide === true) {
      return setTimeout(() => {
        close(toast.id);
      }, toast.timeout);
    }
  }
  return {
    subscribe,
    close,
    /** Add a new toast to the queue. */
    trigger: (toast) => {
      const id = randomUUID();
      update((tStore) => {
        if (toast && toast.callback)
          toast.callback({ id, status: "queued" });
        if (toast.hideDismiss)
          toast.autohide = true;
        const tMerged = { ...toastDefaults, ...toast, id };
        tMerged.timeoutId = handleAutoHide(tMerged);
        tStore.push(tMerged);
        return tStore;
      });
      return id;
    },
    /** Remain visible on hover */
    freeze: (index) => update((tStore) => {
      if (tStore.length > 0)
        clearTimeout(tStore[index].timeoutId);
      return tStore;
    }),
    /** Cancel remain visible on leave */
    unfreeze: (index) => update((tStore) => {
      if (tStore.length > 0)
        tStore[index].timeoutId = handleAutoHide(tStore[index]);
      return tStore;
    }),
    /** Remove all toasts from queue */
    clear: () => set([])
  };
}
function initializeStores() {
  initializeModalStore();
  initializeToastStore();
  initializeDrawerStore();
}
function AppBar($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  push();
  let classesBase, classesRowMain, classesRowHeadline, classesSlotLead, classesSlotDefault, classesSlotTrail;
  let background = fallback($$props["background"], "bg-surface-100-800-token");
  let border = fallback($$props["border"], "");
  let padding = fallback($$props["padding"], "p-4");
  let shadow = fallback($$props["shadow"], "");
  let spacing = fallback($$props["spacing"], "space-y-4");
  let gridColumns = fallback($$props["gridColumns"], "grid-cols-[auto_1fr_auto]");
  let gap = fallback($$props["gap"], "gap-4");
  let regionRowMain = fallback($$props["regionRowMain"], "");
  let regionRowHeadline = fallback($$props["regionRowHeadline"], "");
  let slotLead = fallback($$props["slotLead"], "");
  let slotDefault = fallback($$props["slotDefault"], "");
  let slotTrail = fallback($$props["slotTrail"], "");
  let label = fallback($$props["label"], "");
  let labelledby = fallback($$props["labelledby"], "");
  const cBase = "flex flex-col";
  const cRowMain = "grid items-center";
  const cRowHeadline = "";
  const cSlotLead = "flex-none flex justify-between items-center";
  const cSlotDefault = "flex-auto";
  const cSlotTrail = "flex-none flex items-center space-x-4";
  classesBase = `${cBase} ${background} ${border} ${spacing} ${padding} ${shadow} ${$$sanitized_props.class ?? ""}`;
  classesRowMain = `${cRowMain} ${gridColumns} ${gap} ${regionRowMain}`;
  classesRowHeadline = `${cRowHeadline} ${regionRowHeadline}`;
  classesSlotLead = `${cSlotLead} ${slotLead}`;
  classesSlotDefault = `${cSlotDefault} ${slotDefault}`;
  classesSlotTrail = `${cSlotTrail} ${slotTrail}`;
  $$payload.out += `<div${attr("class", `app-bar ${stringify(classesBase)}`)} data-testid="app-bar" role="toolbar"${attr("aria-label", label)}${attr("aria-labelledby", labelledby)}><div${attr("class", `app-bar-row-main ${stringify(classesRowMain)}`)}>`;
  if ($$slots.lead) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `app-bar-slot-lead ${stringify(classesSlotLead)}`)}><!---->`;
    slot($$payload, $$props, "lead", {}, null);
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div${attr("class", `app-bar-slot-default ${stringify(classesSlotDefault)}`)}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></div> `;
  if ($$slots.trail) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `app-bar-slot-trail ${stringify(classesSlotTrail)}`)}><!---->`;
    slot($$payload, $$props, "trail", {}, null);
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> `;
  if ($$slots.headline) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `app-bar-row-headline ${stringify(classesRowHeadline)}`)}><!---->`;
    slot($$payload, $$props, "headline", {}, null);
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, {
    background,
    border,
    padding,
    shadow,
    spacing,
    gridColumns,
    gap,
    regionRowMain,
    regionRowHeadline,
    slotLead,
    slotDefault,
    slotTrail,
    label,
    labelledby
  });
  pop();
}
function AppRail($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  let classesBase, classesRegionLead, classesRegionDefault, classesRegionTrail;
  let background = fallback($$props["background"], "bg-surface-100-800-token");
  let border = fallback($$props["border"], "");
  let width = fallback($$props["width"], "w-20");
  let height = fallback($$props["height"], "h-full");
  let gap = fallback($$props["gap"], "gap-0");
  let regionLead = fallback($$props["regionLead"], "");
  let regionDefault = fallback($$props["regionDefault"], "");
  let regionTrail = fallback($$props["regionTrail"], "");
  let hover = fallback($$props["hover"], "bg-primary-hover-token");
  let active = fallback($$props["active"], "bg-primary-active-token");
  let spacing = fallback($$props["spacing"], "space-y-1");
  let aspectRatio = fallback($$props["aspectRatio"], "aspect-square");
  setContext("active", active);
  setContext("hover", hover);
  setContext("spacing", spacing);
  setContext("aspectRatio", aspectRatio);
  const cBase = "grid grid-rows-[auto_1fr_auto] overflow-y-auto";
  const cRegionLead = "box-border";
  const cRegionDefault = "box-border";
  const cRegionTrail = "box-border";
  classesBase = `${cBase} ${background} ${border} ${width} ${height} ${gap} ${$$sanitized_props.class || ""}`;
  classesRegionLead = `${cRegionLead} ${regionLead}`;
  classesRegionDefault = `${cRegionDefault} ${regionDefault}`;
  classesRegionTrail = `${cRegionTrail} ${regionTrail}`;
  $$payload.out += `<div${attr("class", `app-rail ${stringify(classesBase)}`)} data-testid="app-rail"><div${attr("class", `app-bar-lead ${stringify(classesRegionLead)}`)}><!---->`;
  slot($$payload, $$props, "lead", {}, null);
  $$payload.out += `<!----></div> <div${attr("class", `app-bar-default ${stringify(classesRegionDefault)}`)}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></div> <div${attr("class", `app-bar-trail ${stringify(classesRegionTrail)}`)}><!---->`;
  slot($$payload, $$props, "trail", {}, null);
  $$payload.out += `<!----></div></div>`;
  bind_props($$props, {
    background,
    border,
    width,
    height,
    gap,
    regionLead,
    regionDefault,
    regionTrail,
    hover,
    active,
    spacing,
    aspectRatio
  });
  pop();
}
function AppRailAnchor($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "selected",
    "regionLead",
    "regionLabel",
    "hover",
    "active",
    "spacing",
    "aspectRatio"
  ]);
  push();
  let classActive, classesBase, classesWrapper, classesLead, classesLabel;
  let selected = fallback($$props["selected"], false);
  let regionLead = fallback($$props["regionLead"], "flex justify-center items-center");
  let regionLabel = fallback($$props["regionLabel"], "");
  let hover = fallback($$props["hover"], () => getContext("hover"), true);
  let active = fallback($$props["active"], () => getContext("active"), true);
  let spacing = fallback($$props["spacing"], () => getContext("spacing"), true);
  let aspectRatio = fallback($$props["aspectRatio"], () => getContext("aspectRatio"), true);
  const cBase = "unstyled";
  const cWrapper = "w-full flex flex-col justify-center items-stretch text-center space-y-1";
  const cLabel = "font-bold text-xs";
  function prunedRestProps() {
    delete $$restProps.class;
    return $$restProps;
  }
  classActive = selected ? active : "";
  classesBase = `${cBase} ${$$sanitized_props.class || ""}`;
  classesWrapper = `${cWrapper} ${aspectRatio} ${hover} ${spacing} ${classActive}`;
  classesLead = `${regionLead}`;
  classesLabel = `${cLabel} ${regionLabel}`;
  $$payload.out += `<a${spread_attributes({
    class: `app-rail-anchor ${stringify(classesBase)}`,
    href: $$sanitized_props.href,
    ...prunedRestProps(),
    "data-testid": "app-rail-anchor"
  })}><div${attr("class", `app-rail-wrapper ${stringify(classesWrapper)}`)}>`;
  if ($$slots.lead) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `app-rail-lead ${stringify(classesLead)}`)}><!---->`;
    slot($$payload, $$props, "lead", {}, null);
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div${attr("class", `app-rail-label ${stringify(classesLabel)}`)}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></div></div></a>`;
  bind_props($$props, {
    selected,
    regionLead,
    regionLabel,
    hover,
    active,
    spacing,
    aspectRatio
  });
  pop();
}
function AppShell($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  push();
  let classesBase, classesHeader, classesSidebarLeft, classesSidebarRight, classesPageHeader, classesPageContent, classesPageFooter, classesFooter;
  let scrollbarGutter = fallback($$props["scrollbarGutter"], "auto");
  let regionPage = fallback($$props["regionPage"], "");
  let slotHeader = fallback($$props["slotHeader"], "z-10");
  let slotSidebarLeft = fallback($$props["slotSidebarLeft"], "w-auto");
  let slotSidebarRight = fallback($$props["slotSidebarRight"], "w-auto");
  let slotPageHeader = fallback($$props["slotPageHeader"], "");
  let slotPageContent = fallback($$props["slotPageContent"], "");
  let slotPageFooter = fallback($$props["slotPageFooter"], "");
  let slotFooter = fallback($$props["slotFooter"], "");
  const cBaseAppShell = "w-full h-full flex flex-col overflow-hidden";
  const cContentArea = "w-full h-full flex overflow-hidden";
  const cPage = "flex-1 overflow-x-hidden flex flex-col";
  const cSidebarLeft = "flex-none overflow-x-hidden overflow-y-auto";
  const cSidebarRight = "flex-none overflow-x-hidden overflow-y-auto";
  classesBase = `${cBaseAppShell} ${$$sanitized_props.class ?? ""}`;
  classesHeader = `${slotHeader}`;
  classesSidebarLeft = `${cSidebarLeft} ${slotSidebarLeft}`;
  classesSidebarRight = `${cSidebarRight} ${slotSidebarRight}`;
  classesPageHeader = `${slotPageHeader}`;
  classesPageContent = `${slotPageContent}`;
  classesPageFooter = `${slotPageFooter}`;
  classesFooter = `${slotFooter}`;
  $$payload.out += `<div id="appShell"${attr("class", clsx(classesBase))} data-testid="app-shell">`;
  if ($$slots.header) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<header id="shell-header"${attr("class", `flex-none ${stringify(classesHeader)}`)}><!---->`;
    slot($$payload, $$props, "header", {}, null);
    $$payload.out += `<!----></header>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div${attr("class", `flex-auto ${stringify(cContentArea)}`)}>`;
  if ($$slots.sidebarLeft) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<aside id="sidebar-left"${attr("class", clsx(classesSidebarLeft))}><!---->`;
    slot($$payload, $$props, "sidebarLeft", {}, null);
    $$payload.out += `<!----></aside>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div${add_styles({ "scrollbar-gutter": scrollbarGutter })} id="page"${attr("class", `${stringify(regionPage)} ${stringify(cPage)}`)}>`;
  if ($$slots.pageHeader) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<header id="page-header"${attr("class", `flex-none ${stringify(classesPageHeader)}`)}><!---->`;
    slot($$payload, $$props, "pageHeader", {}, () => {
      $$payload.out += `(slot:header)`;
    });
    $$payload.out += `<!----></header>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <main id="page-content"${attr("class", `flex-auto ${stringify(classesPageContent)}`)}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></main> `;
  if ($$slots.pageFooter) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<footer id="page-footer"${attr("class", `flex-none ${stringify(classesPageFooter)}`)}><!---->`;
    slot($$payload, $$props, "pageFooter", {}, () => {
      $$payload.out += `(slot:footer)`;
    });
    $$payload.out += `<!----></footer>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> `;
  if ($$slots.sidebarRight) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<aside id="sidebar-right"${attr("class", clsx(classesSidebarRight))}><!---->`;
    slot($$payload, $$props, "sidebarRight", {}, null);
    $$payload.out += `<!----></aside>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> `;
  if ($$slots.footer) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<footer id="shell-footer"${attr("class", `flex-none ${stringify(classesFooter)}`)}><!---->`;
    slot($$payload, $$props, "footer", {}, null);
    $$payload.out += `<!----></footer>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, {
    scrollbarGutter,
    regionPage,
    slotHeader,
    slotSidebarLeft,
    slotSidebarRight,
    slotPageHeader,
    slotPageContent,
    slotPageFooter,
    slotFooter
  });
  pop();
}
function CodeBlock($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  var $$store_subs;
  let classesBase;
  let language = fallback($$props["language"], "plaintext");
  let code = fallback($$props["code"], "");
  let lineNumbers = fallback($$props["lineNumbers"], false);
  let background = fallback($$props["background"], "bg-neutral-900/90");
  let blur = fallback($$props["blur"], "");
  let text = fallback($$props["text"], "text-sm");
  let color = fallback($$props["color"], "text-white");
  let rounded = fallback($$props["rounded"], "rounded-container-token");
  let shadow = fallback($$props["shadow"], "shadow");
  let button = fallback($$props["button"], "btn btn-sm variant-soft !text-white");
  let buttonLabel = fallback($$props["buttonLabel"], "Copy");
  let buttonCopied = fallback($$props["buttonCopied"], "👍");
  const cBase = "overflow-hidden shadow";
  const cHeader = "text-xs text-white/50 uppercase flex justify-between items-center p-2 pl-4";
  const cPre = "whitespace-pre-wrap break-all p-4 pt-1";
  let formatted = false;
  let displayCode = code;
  function languageFormatter(lang) {
    if (lang === "js") return "javascript";
    if (lang === "ts") return "typescript";
    if (lang === "shell") return "terminal";
    return lang;
  }
  if (store_get($$store_subs ??= {}, "$storeHighlightJs", storeHighlightJs) !== void 0) {
    displayCode = store_get($$store_subs ??= {}, "$storeHighlightJs", storeHighlightJs).highlight(code, { language }).value.trim();
    formatted = true;
  }
  if (lineNumbers) {
    displayCode = displayCode.replace(/^/gm, () => {
      return '<span class="line"></span>	';
    });
    formatted = true;
  }
  classesBase = `${cBase} ${background} ${blur} ${text} ${color} ${rounded} ${shadow} ${$$sanitized_props.class ?? ""}`;
  if (language && code) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `codeblock ${stringify(classesBase)}`)} data-testid="codeblock"><header${attr("class", `codeblock-header ${stringify(cHeader)}`)}><span class="codeblock-language">${escape_html(languageFormatter(language))}</span> <button type="button"${attr("class", `codeblock-btn ${stringify(button)}`)}>${escape_html(buttonLabel)}</button></header> <pre${attr("class", `codeblock-pre ${stringify(cPre)}`)}><code${attr("class", `codeblock-code language-${stringify(language)} lineNumbers`)}>`;
    if (formatted) {
      $$payload.out += "<!--[-->";
      $$payload.out += `${html(displayCode)}`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `${escape_html(code.trim())}`;
    }
    $$payload.out += `<!--]--></code></pre></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    language,
    code,
    lineNumbers,
    background,
    blur,
    text,
    color,
    rounded,
    shadow,
    button,
    buttonLabel,
    buttonCopied
  });
  pop();
}
function Drawer($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  var $$store_subs;
  let classesPosition, classesWidth, classesHeight, classesRounded, classesBackdrop, classesDrawer;
  let position = fallback($$props["position"], "left");
  let bgDrawer = fallback($$props["bgDrawer"], "bg-surface-100-800-token");
  let border = fallback($$props["border"], "");
  let rounded = fallback($$props["rounded"], "");
  let shadow = fallback($$props["shadow"], "shadow-xl");
  let width = fallback($$props["width"], "");
  let height = fallback($$props["height"], "");
  let bgBackdrop = fallback($$props["bgBackdrop"], "bg-surface-backdrop-token");
  let blur = fallback($$props["blur"], "");
  let padding = fallback($$props["padding"], "");
  let zIndex = fallback($$props["zIndex"], "z-40");
  let regionBackdrop = fallback($$props["regionBackdrop"], "");
  let regionDrawer = fallback($$props["regionDrawer"], "");
  let labelledby = fallback($$props["labelledby"], "");
  let describedby = fallback($$props["describedby"], "");
  let duration = fallback($$props["duration"], 200);
  let transitions = fallback($$props["transitions"], () => !store_get($$store_subs ??= {}, "$prefersReducedMotionStore", prefersReducedMotionStore), true);
  let opacityTransition = fallback($$props["opacityTransition"], true);
  const presets = {
    top: {
      alignment: "items-start",
      width: "w-full",
      height: "h-[50%]",
      rounded: "rounded-bl-container-token rounded-br-container-token"
    },
    bottom: {
      alignment: "items-end",
      width: "w-full",
      height: " h-[50%]",
      rounded: "rounded-tl-container-token rounded-tr-container-token"
    },
    left: {
      alignment: "justify-start",
      width: "w-[90%]",
      height: "h-full",
      rounded: "rounded-tr-container-token rounded-br-container-token"
    },
    right: {
      alignment: "justify-end",
      width: "w-[90%]",
      height: "h-full",
      rounded: "rounded-tl-container-token rounded-bl-container-token"
    }
  };
  const drawerStore = getDrawerStore();
  const cBackdrop = "fixed top-0 left-0 right-0 bottom-0 flex";
  const cDrawer = "overflow-y-auto transition-transform";
  const propDefaults = {
    position,
    bgBackdrop,
    blur,
    padding,
    bgDrawer,
    border,
    rounded,
    shadow,
    width,
    height,
    opacityTransition,
    regionBackdrop,
    regionDrawer,
    labelledby,
    describedby,
    duration
  };
  function applyPropSettings(settings) {
    position = settings.position || propDefaults.position;
    bgBackdrop = settings.bgBackdrop || propDefaults.bgBackdrop;
    blur = settings.blur || propDefaults.blur;
    padding = settings.padding || propDefaults.padding;
    bgDrawer = settings.bgDrawer || propDefaults.bgDrawer;
    border = settings.border || propDefaults.border;
    rounded = settings.rounded || propDefaults.rounded;
    shadow = settings.shadow || propDefaults.shadow;
    width = settings.width || propDefaults.width;
    height = settings.height || propDefaults.height;
    regionBackdrop = settings.regionBackdrop || propDefaults.regionBackdrop;
    regionDrawer = settings.regionDrawer || propDefaults.regionDrawer;
    labelledby = settings.labelledby || propDefaults.labelledby;
    describedby = settings.describedby || propDefaults.describedby;
    opacityTransition = settings.opacityTransition || propDefaults.opacityTransition;
    duration = settings.duration || propDefaults.duration;
  }
  drawerStore.subscribe((settings) => {
    if (settings.open !== true) return;
    applyPropSettings(settings);
  });
  classesPosition = presets[position].alignment;
  classesWidth = width ? width : presets[position].width;
  classesHeight = height ? height : presets[position].height;
  classesRounded = rounded ? rounded : presets[position].rounded;
  classesBackdrop = `${cBackdrop} ${bgBackdrop} ${padding} ${blur} ${classesPosition} ${regionBackdrop} ${zIndex} ${$$sanitized_props.class ?? ""}`;
  classesDrawer = `${cDrawer} ${bgDrawer} ${border} ${rounded} ${shadow} ${classesWidth} ${classesHeight} ${classesRounded} ${regionDrawer}`;
  if (store_get($$store_subs ??= {}, "$drawerStore", drawerStore).open === true) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `drawer-backdrop ${stringify(classesBackdrop)}`)} data-testid="drawer-backdrop"><div${attr("class", `drawer ${stringify(classesDrawer)}`)} data-testid="drawer" role="dialog" aria-modal="true"${attr("aria-labelledby", labelledby)}${attr("aria-describedby", describedby)}><!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!----></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    position,
    bgDrawer,
    border,
    rounded,
    shadow,
    width,
    height,
    bgBackdrop,
    blur,
    padding,
    zIndex,
    regionBackdrop,
    regionDrawer,
    labelledby,
    describedby,
    duration,
    transitions,
    opacityTransition
  });
  pop();
}
function LightSwitch($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  var $$store_subs;
  let trackBg, thumbBg, thumbPosition, iconFill, classesTrack, classesThumb, classesIcon;
  let title = fallback($$props["title"], "Toggle light or dark mode.");
  let bgLight = fallback($$props["bgLight"], "bg-surface-50");
  let bgDark = fallback($$props["bgDark"], "bg-surface-900");
  let fillLight = fallback($$props["fillLight"], "fill-surface-50");
  let fillDark = fallback($$props["fillDark"], "fill-surface-900");
  let width = fallback($$props["width"], "w-12");
  let height = fallback($$props["height"], "h-6");
  let ring = fallback($$props["ring"], "ring-[1px] ring-surface-500/30");
  let rounded = fallback($$props["rounded"], "rounded-token");
  const cTransition = `transition-all duration-[200ms]`;
  const cTrack = "cursor-pointer";
  const cThumb = "aspect-square scale-[0.8] flex justify-center items-center";
  const cIcon = "w-[70%] aspect-square";
  const svgPath = {
    sun: "M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM352 256c0 53-43 96-96 96s-96-43-96-96s43-96 96-96s96 43 96 96zm32 0c0-70.7-57.3-128-128-128s-128 57.3-128 128s57.3 128 128 128s128-57.3 128-128z",
    moon: "M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"
  };
  trackBg = store_get($$store_subs ??= {}, "$modeCurrent", modeCurrent) === true ? bgLight : bgDark;
  thumbBg = store_get($$store_subs ??= {}, "$modeCurrent", modeCurrent) === true ? bgDark : bgLight;
  thumbPosition = store_get($$store_subs ??= {}, "$modeCurrent", modeCurrent) === true ? "translate-x-[100%]" : "";
  iconFill = store_get($$store_subs ??= {}, "$modeCurrent", modeCurrent) === true ? fillLight : fillDark;
  classesTrack = `${cTrack} ${cTransition} ${width} ${height} ${ring} ${rounded} ${trackBg} ${$$sanitized_props.class ?? ""}`;
  classesThumb = `${cThumb} ${cTransition} ${height} ${rounded} ${thumbBg} ${thumbPosition}`;
  classesIcon = `${cIcon} ${iconFill}`;
  head($$payload, ($$payload2) => {
    $$payload2.out += `${html(`<script nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();<\/script>`)}`;
  });
  $$payload.out += `<div${attr("class", `lightswitch-track ${stringify(classesTrack)}`)} role="switch" aria-label="Light Switch"${attr("aria-checked", store_get($$store_subs ??= {}, "$modeCurrent", modeCurrent))}${attr("title", title)} tabindex="0"><div${attr("class", `lightswitch-thumb ${stringify(classesThumb)}`)}><svg${attr("class", `lightswitch-icon ${stringify(classesIcon)}`)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path${attr("d", store_get($$store_subs ??= {}, "$modeCurrent", modeCurrent) ? svgPath.sun : svgPath.moon)}></path></svg></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    title,
    bgLight,
    bgDark,
    fillLight,
    fillDark,
    width,
    height,
    ring,
    rounded
  });
  pop();
}
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let { children } = $$props;
  const generate_raw_github_link = (url) => {
    const githubBlobPrefix = "https://raw.githubusercontent.com/";
    url = url.replace("//blob", "/blob");
    const regex = /github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/;
    const match = url.match(regex);
    if (!match) {
      console.log("Invalid url");
      return;
    }
    const owner = match[1];
    const repo = match[2];
    const commitHash = match[3];
    const filePath = match[4];
    const raw_url = `${githubBlobPrefix}${owner}/${repo}/${commitHash}/${filePath}`;
    return raw_url;
  };
  const get_rule_src = async (url) => {
    let raw_url = generate_raw_github_link(url);
    try {
      let response = await fetch(raw_url);
      if (!response.ok) {
        throw new Error("Failed to fetch rule source!");
      }
      const body = await response.text();
      return body;
    } catch (err) {
      console.error(err);
    }
    return "";
  };
  listen("log_message", (event) => {
    if (yayState.log_messages.length == 100) yayState.log_messages = [];
    yayState.log_messages.push(event.payload);
  });
  listen("log_match", (event) => {
    if (yayState.matches_map[event.payload.path]) {
      yayState.matches_map[event.payload.path].push(JSON.parse(event.payload.rule_json));
      return;
    }
    yayState.matches_map[event.payload.path] = [JSON.parse(event.payload.rule_json)];
  });
  initializeStores();
  hljs.registerLanguage("yara", yara);
  storeHighlightJs.set(hljs);
  const drawerStore = getDrawerStore();
  Drawer($$payload, {
    children: ($$payload2) => {
      if (store_get($$store_subs ??= {}, "$drawerStore", drawerStore).id === "rule-drawer") {
        $$payload2.out += "<!--[-->";
        const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$drawerStore", drawerStore).meta.metadata);
        $$payload2.out += `<div class="m-4"><h1 class="h1 text-lg">Rule: ${escape_html(store_get($$store_subs ??= {}, "$drawerStore", drawerStore).meta.identifier)}</h1> <h4 class="text-md">Metadata:</h4> <ul class="list-disc pl-5 text-sm"><!--[-->`;
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let meta = each_array[$$index];
          if (meta[0] == "source_url") {
            $$payload2.out += "<!--[-->";
            $$payload2.out += `<!---->`;
            await_block(
              get_rule_src(meta[1]),
              () => {
              },
              (source_code) => {
                $$payload2.out += `${escape_html(store_mutate($$store_subs ??= {}, "$drawerStore", drawerStore, store_get($$store_subs ??= {}, "$drawerStore", drawerStore).meta["source_code"] = source_code))}`;
              }
            );
            $$payload2.out += `<!---->`;
          } else {
            $$payload2.out += "<!--[!-->";
          }
          $$payload2.out += `<!--]--> <li><strong>${escape_html(meta[0])}:</strong> ${escape_html(meta[1])}</li>`;
        }
        $$payload2.out += `<!--]--></ul> `;
        CodeBlock($$payload2, {
          lineNumbers: "true",
          language: "yara",
          code: store_get($$store_subs ??= {}, "$drawerStore", drawerStore).meta["source_code"]
        });
        $$payload2.out += `<!----></div>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> `;
  AppShell($$payload, {
    children: ($$payload2) => {
      children($$payload2);
      $$payload2.out += `<!---->`;
    },
    $$slots: {
      default: true,
      header: ($$payload2) => {
        {
          AppBar($$payload2, {
            $$slots: {
              lead: ($$payload3) => {
                {
                  $$payload3.out += `yayAV`;
                }
              },
              trail: ($$payload3) => {
                {
                  LightSwitch($$payload3, {});
                }
              }
            }
          });
        }
      },
      sidebarLeft: ($$payload2) => {
        {
          AppRail($$payload2, {
            children: ($$payload3) => {
              AppRailAnchor($$payload3, {
                href: "/",
                selected: store_get($$store_subs ??= {}, "$page", page).url.pathname === "/",
                children: ($$payload4) => {
                  $$payload4.out += `<!---->Scan`;
                },
                $$slots: { default: true }
              });
              $$payload3.out += `<!----> `;
              AppRailAnchor($$payload3, {
                href: "/rules",
                selected: store_get($$store_subs ??= {}, "$page", page).url.pathname === "/rules",
                children: ($$payload4) => {
                  $$payload4.out += `<!---->Yara`;
                },
                $$slots: { default: true }
              });
              $$payload3.out += `<!---->`;
            },
            $$slots: { default: true }
          });
        }
      },
      footer: ($$payload2) => {
        {
          $$payload2.out += `<div class="bg-secondary h-16 w-full"><span class="m-5 chip variant-filled-primary">yayAV v0.1</span> <span class="chip variant-filled-primary">Enabled: ${escape_html(yayState.enabled_rulesets.length)}</span> <div class="mr-8 mb-1 absolute right-0 bottom-0 size-16"><button type="button" class="btn btn-sm variant-filled-primary m-5">Scan</button></div></div>`;
        }
      }
    }
  });
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
