import { s as start_model_sidecar } from "../../chunks/model.js";
const prerender = true;
const ssr = false;
async function load() {
  start_model_sidecar();
  return {
    enabled_rulesets: []
    // Initial empty array, can be populated dynamically
  };
}
export {
  load,
  prerender,
  ssr
};
