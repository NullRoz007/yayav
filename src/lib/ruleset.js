import { yayState } from "$lib/state.svelte";
import { invoke } from "$lib/invoke-wrapper";

export const get_ruleset_dir_path = async () => {
    console.log("!");
    let path = await invoke('get_ruleset_dir_path', {});
    return path;
}

export const compile_enabled_rulesets = async () => {
    var ruleset_paths = [];
    
    for(let rs of yayState.enabled_rulesets) {
        await invoke('yara_compile_rulesets', {
            paths: rs.rules
        });
    }
}

export const get_rulesets = async () => {
    var rulesets = await invoke("yay_get_rulesets");
    return rulesets;
}

export const ruleset_is_enabled = (ruleset) => {
    for(let r of yayState.enabled_rulesets) {
        if(r.name === ruleset.name) return true;
    } 

    return false;
}

export const get_ruleset_index = (ruleset) => {
    for(let i = 0; i < yayState.enabled_rulesets.length; i++) if(yayState.enabled_rulesets[i].name === ruleset.name) return i;
    return -1;
}

export const enable_ruleset = (ruleset) => {
    if(!ruleset_is_enabled(ruleset)) yayState.enabled_rulesets.push(ruleset);
}

export const disable_ruleset = (ruleset) => {
    if(ruleset_is_enabled(ruleset)) {
        const index = get_ruleset_index(ruleset);
        yayState.enabled_rulesets.splice(index, 1);
    }
}