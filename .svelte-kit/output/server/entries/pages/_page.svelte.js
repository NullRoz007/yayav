import { W as pop, T as push, ab as ensure_array_like, a8 as escape_html, Z as attr } from "../../chunks/index.js";
import "@tauri-apps/plugin-dialog";
import "@tauri-apps/api/core";
import { y as yayState, g as get_matches } from "../../chunks/state.svelte.js";
import { g as getDrawerStore } from "../../chunks/stores.js";
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
    $$payload.out += `<div class="card m-4 max-w-128"><header class="card-header"><div class="flex justify-between"><span>Type: ${escape_html(target.is_dirs ? "Directories" : "Files")}</span> <button type="button" class="btn btn-sm variant-filled-error">x</button></div></header> <section class="p-4"><span>Paths:</span> <ol class="list max-w-full break-words"><!--[-->`;
    for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
      let path = each_array_1[$$index];
      $$payload.out += `<li class="text-sm whitespace-normal break-words overflow-hidden">${escape_html(path)}</li>`;
    }
    $$payload.out += `<!--]--></ol></section> <footer class="card-footer"><span class="chip variant-filled-warning">Unscanned</span></footer></div>`;
  }
  $$payload.out += `<!--]--></div> <div class="flex justify-end"><div class="btn-group variant-filled-primary"><button>Add file</button> <button>Add directory</button></div></div>`;
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
  Accordion($$payload, {
    children: ($$payload2) => {
      AccordionItem($$payload2, {
        class: "variant-ghost-surface mt-5 mr-5 ml-5",
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
      $$payload2.out += `<!----> <br> `;
      AccordionItem($$payload2, {
        class: "variant-ghost-surface m-5",
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
                  const each_array = ensure_array_like(get_matches());
                  $$payload4.out += `<!--[-->`;
                  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
                    let match = each_array[$$index_1];
                    AccordionItem($$payload4, {
                      class: "variant-ghost-surface m-5 p-1",
                      $$slots: {
                        lead: ($$payload5) => {
                          {
                            $$payload5.out += `<p class="overflow-hide">${escape_html(match.path)}</p>`;
                          }
                        },
                        summary: ($$payload5) => {
                          {
                            $$payload5.out += ``;
                          }
                        },
                        content: ($$payload5) => {
                          {
                            const each_array_1 = ensure_array_like(match.rules);
                            $$payload5.out += `<!--[-->`;
                            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                              let rule = each_array_1[$$index];
                              $$payload5.out += `<button class="btn btn-sm variant-filled-secondary m-1">${escape_html(rule.identifier)}</button>`;
                            }
                            $$payload5.out += `<!--]-->`;
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
      $$payload2.out += `<!----> <br> `;
      AccordionItem($$payload2, {
        class: "variant-ghost-surface m-5",
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
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  pop();
}
export {
  _page as default
};
