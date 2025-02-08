import { Y as fallback, V as setContext, Z as attr, _ as slot, $ as bind_props, W as pop, a0 as sanitize_props, T as push, a7 as store_get, a1 as stringify, a9 as unsubscribe_stores, X as sanitize_slots, a4 as getContext } from "./index.js";
import { w as writable } from "./index2.js";
import { p as prefersReducedMotionStore, h as html } from "./state.svelte.js";
function cubic_out(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function slide(node, { delay = 0, duration = 400, easing = cubic_out, axis = "y" } = {}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const primary_property = axis === "y" ? "height" : "width";
  const primary_property_value = parseFloat(style[primary_property]);
  const secondary_properties = axis === "y" ? ["top", "bottom"] : ["left", "right"];
  const capitalized_secondary_properties = secondary_properties.map(
    (e) => (
      /** @type {'Left' | 'Right' | 'Top' | 'Bottom'} */
      `${e[0].toUpperCase()}${e.slice(1)}`
    )
  );
  const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
  const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
  const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
  const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
  const border_width_start_value = parseFloat(
    style[`border${capitalized_secondary_properties[0]}Width`]
  );
  const border_width_end_value = parseFloat(
    style[`border${capitalized_secondary_properties[1]}Width`]
  );
  return {
    delay,
    duration,
    easing,
    css: (t) => `overflow: hidden;opacity: ${Math.min(t * 20, 1) * opacity};${primary_property}: ${t * primary_property_value}px;padding-${secondary_properties[0]}: ${t * padding_start_value}px;padding-${secondary_properties[1]}: ${t * padding_end_value}px;margin-${secondary_properties[0]}: ${t * margin_start_value}px;margin-${secondary_properties[1]}: ${t * margin_end_value}px;border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;min-${primary_property}: 0`
  };
}
function Accordion($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  var $$store_subs;
  let classesBase;
  let autocollapse = fallback($$props["autocollapse"], false);
  let width = fallback($$props["width"], "w-full");
  let spacing = fallback($$props["spacing"], "space-y-1");
  let disabled = fallback($$props["disabled"], false);
  let padding = fallback($$props["padding"], "py-2 px-4");
  let hover = fallback($$props["hover"], "hover:bg-primary-hover-token");
  let rounded = fallback($$props["rounded"], "rounded-container-token");
  let caretOpen = fallback($$props["caretOpen"], "rotate-180");
  let caretClosed = fallback($$props["caretClosed"], "");
  let regionControl = fallback($$props["regionControl"], "");
  let regionPanel = fallback($$props["regionPanel"], "space-y-4");
  let regionCaret = fallback($$props["regionCaret"], "");
  let transitions = fallback($$props["transitions"], () => !store_get($$store_subs ??= {}, "$prefersReducedMotionStore", prefersReducedMotionStore), true);
  let transitionIn = fallback($$props["transitionIn"], slide);
  let transitionInParams = fallback($$props["transitionInParams"], () => ({ duration: 200 }), true);
  let transitionOut = fallback($$props["transitionOut"], slide);
  let transitionOutParams = fallback($$props["transitionOutParams"], () => ({ duration: 200 }), true);
  const active = writable(null);
  setContext("active", active);
  setContext("autocollapse", autocollapse);
  setContext("disabled", disabled);
  setContext("padding", padding);
  setContext("hover", hover);
  setContext("rounded", rounded);
  setContext("caretOpen", caretOpen);
  setContext("caretClosed", caretClosed);
  setContext("regionControl", regionControl);
  setContext("regionPanel", regionPanel);
  setContext("regionCaret", regionCaret);
  setContext("transitions", transitions);
  setContext("transitionIn", transitionIn);
  setContext("transitionInParams", transitionInParams);
  setContext("transitionOut", transitionOut);
  setContext("transitionOutParams", transitionOutParams);
  classesBase = `${width} ${spacing} ${$$sanitized_props.class ?? ""}`;
  $$payload.out += `<div${attr("class", `accordion ${stringify(classesBase)}`)} data-testid="accordion"><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    autocollapse,
    width,
    spacing,
    disabled,
    padding,
    hover,
    rounded,
    caretOpen,
    caretClosed,
    regionControl,
    regionPanel,
    regionCaret,
    transitions,
    transitionIn,
    transitionInParams,
    transitionOut,
    transitionOutParams
  });
  pop();
}
function AccordionItem($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  push();
  var $$store_subs;
  let openState, classesBase, classesControl, classesCaretState, classesControlCaret, classesControlIcons, classesPanel;
  let open = fallback($$props["open"], false);
  let id = fallback($$props["id"], () => String(Math.random()), true);
  const cBase = "";
  const cControl = "text-start w-full flex items-center space-x-4";
  const cControlIcons = "fill-current w-3 transition-transform duration-[200ms]";
  const cPanel = "";
  let autocollapse = fallback($$props["autocollapse"], () => getContext("autocollapse"), true);
  let active = fallback($$props["active"], () => getContext("active"), true);
  let disabled = fallback($$props["disabled"], () => getContext("disabled"), true);
  let padding = fallback($$props["padding"], () => getContext("padding"), true);
  let hover = fallback($$props["hover"], () => getContext("hover"), true);
  let rounded = fallback($$props["rounded"], () => getContext("rounded"), true);
  let caretOpen = fallback($$props["caretOpen"], () => getContext("caretOpen"), true);
  let caretClosed = fallback($$props["caretClosed"], () => getContext("caretClosed"), true);
  let regionControl = fallback($$props["regionControl"], () => getContext("regionControl"), true);
  let regionPanel = fallback($$props["regionPanel"], () => getContext("regionPanel"), true);
  let regionCaret = fallback($$props["regionCaret"], () => getContext("regionCaret"), true);
  let transitions = fallback($$props["transitions"], () => getContext("transitions"), true);
  let transitionIn = fallback($$props["transitionIn"], () => getContext("transitionIn"), true);
  let transitionInParams = fallback($$props["transitionInParams"], () => getContext("transitionInParams"), true);
  let transitionOut = fallback($$props["transitionOut"], () => getContext("transitionOut"), true);
  let transitionOutParams = fallback($$props["transitionOutParams"], () => getContext("transitionOutParams"), true);
  const svgCaretIcon = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
			<path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
		</svg>`;
  function setActive(event) {
    if (autocollapse === true) {
      active.set(id);
    } else {
      open = !open;
    }
    onToggle();
  }
  function onToggle(event) {
    autocollapse ? store_get($$store_subs ??= {}, "$active", active) === id : open;
  }
  if (autocollapse && open) setActive();
  if (open && autocollapse) setActive();
  openState = autocollapse ? store_get($$store_subs ??= {}, "$active", active) === id : open;
  classesBase = `${cBase} ${$$sanitized_props.class ?? ""}`;
  classesControl = `${cControl} ${padding} ${hover} ${rounded} ${regionControl}`;
  classesCaretState = openState ? caretOpen : caretClosed;
  classesControlCaret = `${cControlIcons} ${regionCaret} ${classesCaretState}`;
  classesControlIcons = `${cControlIcons} ${regionCaret}`;
  classesPanel = `${cPanel} ${padding} ${rounded} ${regionPanel}`;
  $$payload.out += `<div${attr("class", `accordion-item ${stringify(classesBase)}`)} data-testid="accordion-item"><button type="button"${attr("class", `accordion-control ${stringify(classesControl)}`)}${attr("id", id)}${attr("aria-expanded", openState)}${attr("aria-controls", `accordion-panel-${stringify(id)}`)}${attr("disabled", disabled, true)}>`;
  if ($$slots.lead) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="accordion-lead"><!---->`;
    slot($$payload, $$props, "lead", {}, null);
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="accordion-summary flex-1"><!---->`;
  slot($$payload, $$props, "summary", {}, () => {
    $$payload.out += `(summary)`;
  });
  $$payload.out += `<!----></div> `;
  if ($$slots.iconClosed || $$slots.iconOpen) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `accordion-summary-icons ${stringify(classesControlIcons)}`)}>`;
    if (openState) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<!---->`;
      slot($$payload, $$props, "iconClosed", {}, () => {
        $$payload.out += `${html(svgCaretIcon)}`;
      });
      $$payload.out += `<!---->`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<!---->`;
      slot($$payload, $$props, "iconOpen", {}, () => {
        $$payload.out += `${html(svgCaretIcon)}`;
      });
      $$payload.out += `<!---->`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${attr("class", `accordion-summary-caret ${stringify(classesControlCaret)}`)}>${html(svgCaretIcon)}</div>`;
  }
  $$payload.out += `<!--]--></button> `;
  if (openState) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `accordion-panel ${stringify(classesPanel)}`)}${attr("id", `accordion-panel-${stringify(id)}`)} role="region"${attr("aria-hidden", !openState)}${attr("aria-labelledby", id)}><!---->`;
    slot($$payload, $$props, "content", {}, () => {
      $$payload.out += `(content)`;
    });
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    open,
    id,
    autocollapse,
    active,
    disabled,
    padding,
    hover,
    rounded,
    caretOpen,
    caretClosed,
    regionControl,
    regionPanel,
    regionCaret,
    transitions,
    transitionIn,
    transitionInParams,
    transitionOut,
    transitionOutParams
  });
  pop();
}
export {
  Accordion as A,
  AccordionItem as a
};
