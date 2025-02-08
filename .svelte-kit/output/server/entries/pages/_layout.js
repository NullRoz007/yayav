const prerender = true;
const ssr = false;
function load() {
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
