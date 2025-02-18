export const yayState = $state({
    enabled_rulesets: [],
    is_loading: false,
    log_messages: [],
    targets : [],
    matches: [],
    matches_map: {},
    rule_source_map: {}
});

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