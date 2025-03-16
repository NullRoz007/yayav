import "clsx";
const yayState = {
  enabled_rulesets: [],
  is_loading: false,
  log_messages: [],
  targets: [],
  matches: [],
  matches_map: {},
  rule_source_map: {},
  model_sidecar_ready: false
};
const set_model_sidecar_ready = (ready) => {
  yayState.model_sidecar_ready = ready;
};
const get_model_sidecar_ready = () => {
  return yayState.model_sidecar_ready;
};
const get_matches_by_rule = () => {
  let rule_matches = {};
  for (let path in yayState.matches_map) {
    for (let rule of yayState.matches_map[path]) {
      if (rule_matches[rule.identifier]) {
        rule_matches[rule.identifier].push(path);
        continue;
      }
      rule_matches[rule.identifier] = [path];
    }
  }
  let rule_match_array = [];
  for (let r in rule_matches) {
    const rule_match = {
      "rule": yayState.matches_map[rule_matches[r][0]].filter((m) => m.identifier == r)[0],
      "matches": rule_matches[r]
    };
    rule_match_array.push(rule_match);
  }
  return rule_match_array;
};
export {
  get_matches_by_rule as a,
  get_model_sidecar_ready as g,
  set_model_sidecar_ready as s,
  yayState as y
};
