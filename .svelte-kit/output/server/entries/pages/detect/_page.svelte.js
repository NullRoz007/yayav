import { T as push, Y as fallback, Z as attr, a1 as stringify, a6 as add_styles, $ as bind_props, W as pop, a0 as sanitize_props, ac as await_block, a8 as escape_html } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { g as get_model_status } from "../../../chunks/model.js";
import "clsx";
import "../../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
function ProgressBar($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  let fillPercent, indeterminate, classesIndeterminate, classesTrack, classesMeter;
  let value = fallback($$props["value"], () => void 0, true);
  let min = fallback($$props["min"], 0);
  let max = fallback($$props["max"], 100);
  let height = fallback($$props["height"], "h-2");
  let rounded = fallback($$props["rounded"], "rounded-token");
  let transition = fallback($$props["transition"], "transition-[width]");
  let animIndeterminate = fallback($$props["animIndeterminate"], "anim-indeterminate");
  let meter = fallback($$props["meter"], "bg-surface-900-50-token");
  let track = fallback($$props["track"], "bg-surface-200-700-token");
  let labelledby = fallback($$props["labelledby"], "");
  const cTrack = "w-full overflow-hidden";
  const cMeter = "h-full";
  fillPercent = value ? 100 * (value - min) / (max - min) : 0;
  indeterminate = value === void 0 || value < 0;
  classesIndeterminate = indeterminate ? animIndeterminate : "";
  classesTrack = `${cTrack} ${track} ${height} ${rounded} ${$$sanitized_props.class ?? ""}`;
  classesMeter = `${cMeter} ${meter} ${rounded} ${classesIndeterminate} ${transition}`;
  $$payload.out += `<div${attr("class", `progress-bar ${stringify(classesTrack)} svelte-12wvf64`)} data-testid="progress-bar" role="progressbar"${attr("aria-labelledby", labelledby)}${attr("aria-valuenow", value)}${attr("aria-valuemin", min)}${attr("aria-valuemax", max - min)}><div${add_styles({
    width: `${stringify(indeterminate ? 100 : fillPercent)}%`
  })}${attr("class", `progress-bar-meter ${stringify(classesMeter)} svelte-12wvf64`)}></div></div>`;
  bind_props($$props, {
    value,
    min,
    max,
    height,
    rounded,
    transition,
    animIndeterminate,
    meter,
    track,
    labelledby
  });
  pop();
}
function _page($$payload, $$props) {
  push();
  $$payload.out += `<div class="m-6"><h3 class="h3">Machine Learning</h3> <blockquote class="blockquote">Configure and train models for AI driven malware detection.</blockquote></div> <!---->`;
  await_block(
    get_model_status(),
    () => {
    },
    (status) => {
      if (status.status == "not_started") {
        $$payload.out += "<!--[-->";
        $$payload.out += `<button class="btn btn-sm variant-filled-primary m-5">Start training</button>`;
      } else {
        $$payload.out += "<!--[!-->";
        if (status.status == "training") {
          $$payload.out += "<!--[-->";
          ProgressBar($$payload, {
            value: status.progress.currentEpoch,
            max: status.progress.totalEpochs
          });
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `${escape_html(status)} <button class="btn btn-sm variant-filled-primary m-5">Retrain</button>`;
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]-->`;
    }
  );
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
