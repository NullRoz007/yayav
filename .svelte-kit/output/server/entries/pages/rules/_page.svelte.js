import { T as push, W as pop, ac as await_block, a8 as escape_html, ab as ensure_array_like } from "../../../chunks/index.js";
import "clsx";
import "../../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
import { A as Accordion, a as AccordionItem } from "../../../chunks/AccordionItem.js";
import { y as yayState } from "../../../chunks/state.svelte.js";
import { invoke as invoke$1 } from "@tauri-apps/api/core";
const invoke = async (cmd, args, options) => {
  yayState.is_loading = true;
  var result = await invoke$1(cmd, args, options);
  yayState.is_loading = false;
  return result;
};
const get_ruleset_dir_path = async () => {
  console.log("!");
  let path = await invoke("get_ruleset_dir_path", {});
  return path;
};
const get_rulesets = async () => {
  var rulesets = await invoke("yay_get_rulesets");
  return rulesets;
};
const ruleset_is_enabled = (ruleset) => {
  for (let r of yayState.enabled_rulesets) {
    if (r.name === ruleset.name) return true;
  }
  return false;
};
function RulesetButton($$payload, $$props) {
  push();
  let { ruleset } = $$props;
  if (ruleset_is_enabled(ruleset)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button type="button" class="btn btn-sm variant-filled-primary" style="transform: translateX(-70%);">disable</button>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button type="button" class="btn btn-sm variant-ghost" style="transform: translateX(-70%);">enable</button>`;
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function _page($$payload, $$props) {
  push();
  $$payload.out += `<!---->`;
  await_block(
    get_ruleset_dir_path(),
    () => {
    },
    (ruleset_path) => {
      $$payload.out += `<div class="m-6"><h3 class="h3">Rulesets</h3> <blockquote class="blockquote mb-3">Compile and enable rulesets</blockquote> <blockquote class="blockquote mb-3" style="border-left-color: yellow;">Ensure your rulesets are installed at:<br>${escape_html(ruleset_path)}/ruleset_name</blockquote></div>`;
    }
  );
  $$payload.out += `<!----> <!---->`;
  await_block(
    get_rulesets(),
    () => {
    },
    (rulesets) => {
      const each_array = ensure_array_like(rulesets);
      $$payload.out += `<!--[-->`;
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let ruleset = each_array[$$index_1];
        Accordion($$payload, {
          children: ($$payload2) => {
            AccordionItem($$payload2, {
              class: "variant-ghost-surface m-5 rounded-xl",
              $$slots: {
                lead: ($$payload3) => {
                  {
                    if (ruleset.compiled) {
                      $$payload3.out += "<!--[-->";
                      $$payload3.out += `${escape_html(ruleset.name)} : compiled`;
                    } else {
                      $$payload3.out += "<!--[!-->";
                      $$payload3.out += `${escape_html(ruleset.name)}`;
                    }
                    $$payload3.out += `<!--]-->`;
                  }
                },
                summary: ($$payload3) => {
                  {
                    $$payload3.out += ``;
                  }
                },
                content: ($$payload3) => {
                  {
                    const each_array_1 = ensure_array_like(ruleset.rules);
                    $$payload3.out += `<!--[-->`;
                    for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                      let rule = each_array_1[$$index];
                      $$payload3.out += `<span class="chip variant-filled-primary m-1">${escape_html(rule)}</span>`;
                    }
                    $$payload3.out += `<!--]-->`;
                  }
                },
                iconClosed: ($$payload3) => {
                  {
                    RulesetButton($$payload3, { ruleset });
                  }
                },
                iconOpen: ($$payload3) => {
                  {
                    RulesetButton($$payload3, { ruleset });
                  }
                }
              }
            });
          },
          $$slots: { default: true }
        });
      }
      $$payload.out += `<!--]--> <button type="button" class="btn btn-sm variant-filled-primary mx-5">compile</button>`;
    }
  );
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
