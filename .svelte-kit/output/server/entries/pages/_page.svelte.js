import { W as pop, T as push, ab as ensure_array_like, a8 as escape_html, a1 as stringify, Z as attr } from "../../chunks/index.js";
import "@tauri-apps/plugin-dialog";
import "@tauri-apps/api/core";
import { y as yayState, a as get_matches_by_rule } from "../../chunks/state.svelte.js";
import { g as getDrawerStore } from "../../chunks/stores.js";
import "../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
import { A as Accordion, a as AccordionItem } from "../../chunks/AccordionItem.js";
import "clsx";
function ClearLogButton($$payload, $$props) {
  push();
  $$payload.out += `<button type="button" class="btn btn-sm variant-filled-primary" style="transform: translateX(-70%);">clear</button>`;
  pop();
}
function TargetList($$payload, $$props) {
  push();
  const each_array = ensure_array_like(yayState.targets);
  $$payload.out += `<div class="flex flex-wrap justify-center"><!--[-->`;
  for (let target_index = 0, $$length = each_array.length; target_index < $$length; target_index++) {
    let target = each_array[target_index];
    const each_array_1 = ensure_array_like(target.paths);
    $$payload.out += `<div class="card m-4 max-w-128"><header class="card-header"><div class="flex justify-between"><span>Type: ${escape_html(target.is_dirs ? "Directories" : target.is_memory ? "Memory" : "Files")}</span> <button type="button" class="btn btn-sm variant-filled-error">x</button></div></header> <section class="p-4"><span>Paths:</span> <ol class="list max-w-full break-words"><!--[-->`;
    for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
      let path = each_array_1[$$index];
      $$payload.out += `<li class="text-sm whitespace-normal break-words overflow-hidden">${escape_html(path)}</li>`;
    }
    $$payload.out += `<!--]--></ol></section> <footer class="card-footer"><span class="chip variant-filled-warning">Unscanned</span></footer></div>`;
  }
  $$payload.out += `<!--]--></div> <div class="flex justify-end"><div class="btn-group variant-filled-primary"><button>Add file</button> <button>Add directory</button> <button>Add memory</button></div></div>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  const levelStyles = {
    Info: "text-blue-500",
    Warning: "text-yellow-500",
    Error: "text-red-500 font-bold",
    Success: "text-green-500",
    Match: "text-red-500 font-bold"
  };
  getDrawerStore();
  const get_severity = (rule) => {
    let severity = rule.metadata.filter((m) => m[0] == "severity")[0];
    if (!severity) return -1;
    return severity[1];
  };
  const severity_to_style = (severity) => {
    var style = "variant-ghost-surface";
    console.log(severity);
    if (severity > 0 && severity < 25) style = "variant-ghost-secondary";
    else if (severity >= 25 && severity < 50) style = "variant-ghost-warning";
    else if (severity >= 50 && severity < 75) style = "variant-ghost-error";
    else if (severity >= 75) style = "variant-ghost-error";
    console.log(style);
    return style;
  };
  $$payload.out += `<div class="m-6"><h3 class="h3">Scan</h3> <blockquote class="blockquote">Select and scan targets.</blockquote></div> `;
  Accordion($$payload, {
    children: ($$payload2) => {
      AccordionItem($$payload2, {
        class: "variant-ghost-surface m-5 rounded-xl",
        $$slots: {
          lead: ($$payload3) => {
            {
              $$payload3.out += `Targets`;
            }
          },
          summary: ($$payload3) => {
            {
              $$payload3.out += ``;
            }
          },
          content: ($$payload3) => {
            {
              TargetList($$payload3);
            }
          }
        }
      });
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> `;
  Accordion($$payload, {
    children: ($$payload2) => {
      AccordionItem($$payload2, {
        class: "variant-ghost-surface m-5 rounded-xl",
        $$slots: {
          lead: ($$payload3) => {
            {
              $$payload3.out += `Matches`;
            }
          },
          summary: ($$payload3) => {
            {
              $$payload3.out += ``;
            }
          },
          content: ($$payload3) => {
            {
              Accordion($$payload3, {
                children: ($$payload4) => {
                  const each_array = ensure_array_like(get_matches_by_rule());
                  $$payload4.out += `<!--[-->`;
                  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
                    let rule_match = each_array[$$index_1];
                    AccordionItem($$payload4, {
                      class: `${stringify(severity_to_style(get_severity(rule_match.rule)))} rounded-xl`,
                      $$slots: {
                        lead: ($$payload5) => {
                          {
                            $$payload5.out += `<p class="overflow-hide">${escape_html(rule_match.rule.identifier)}</p>`;
                          }
                        },
                        summary: ($$payload5) => {
                          {
                            $$payload5.out += `<button class="btn btn-sm variant-ghost-surface m-1">meta</button>`;
                          }
                        },
                        content: ($$payload5) => {
                          {
                            const each_array_1 = ensure_array_like(rule_match.matches);
                            $$payload5.out += `<ul><!--[-->`;
                            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                              let match = each_array_1[$$index];
                              $$payload5.out += `<li><button class="btn btn-sm variant-filled-warning m-1">${escape_html(match)}</button></li>`;
                            }
                            $$payload5.out += `<!--]--></ul>`;
                          }
                        }
                      }
                    });
                  }
                  $$payload4.out += `<!--]-->`;
                },
                $$slots: { default: true }
              });
            }
          }
        }
      });
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> `;
  Accordion($$payload, {
    children: ($$payload2) => {
      AccordionItem($$payload2, {
        class: "variant-ghost-surface m-5 rounded-xl",
        $$slots: {
          lead: ($$payload3) => {
            {
              $$payload3.out += `Logs`;
            }
          },
          summary: ($$payload3) => {
            {
              $$payload3.out += ``;
            }
          },
          content: ($$payload3) => {
            {
              const each_array_2 = ensure_array_like(yayState.log_messages);
              $$payload3.out += `<section class="bg-gray-900 max-h-64 overflow-auto p-4 mb-2"><!--[-->`;
              for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                let log = each_array_2[$$index_2];
                $$payload3.out += `<pre${attr("class", `text-sm ${levelStyles[log.lvl] || "text-white"}`)}>${escape_html(log.msg)}</pre>`;
              }
              $$payload3.out += `<!--]--></section>`;
            }
          },
          iconClosed: ($$payload3) => {
            {
              ClearLogButton($$payload3);
            }
          },
          iconOpen: ($$payload3) => {
            {
              ClearLogButton($$payload3);
            }
          }
        }
      });
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
