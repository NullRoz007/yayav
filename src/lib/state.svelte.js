export const yayState = $state({
    enabled_rulesets: [],
    is_loading: false,
    log_messages: [],
    targets : [],
    matches: [],
    matches_map: {},
    rule_source_map: {},
    model_sidecar_ready: false
});

export const set_model_sidecar_ready = (ready) => {
    yayState.model_sidecar_ready = ready;
}

export const get_model_sidecar_ready = () => {
    return yayState.model_sidecar_ready;
}


export const get_matches = () => {
    const matches = [];
    
    for(let path in yayState.matches_map) {
        let match = {
            'path': path,
            'rules': yayState.matches_map[path]
        };

        matches.push(match);
    }

    return matches; 
};

export const get_matches_by_rule = () => {
    let rule_matches = {};

    for(let path in yayState.matches_map) {
        for(let rule of yayState.matches_map[path]) {
            if(rule_matches[rule.identifier]) {
                rule_matches[rule.identifier].push(path);
                continue;
            }
            
            rule_matches[rule.identifier] = [path];
        }
    }

    let rule_match_array = [];
    for(let r in rule_matches) {
        const rule_match = {
            "rule": yayState.matches_map[rule_matches[r][0]].filter(m => m.identifier == r)[0],
            "matches": rule_matches[r] 
        }

        rule_match_array.push(rule_match);
    }
    
    return rule_match_array;
}