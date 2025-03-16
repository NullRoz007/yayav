import { invoke as _invoke } from "@tauri-apps/api/core";
import { yayState } from "$lib/state.svelte";

export const invoke = async (cmd, args, options) => {
    yayState.is_loading = true;
    
    var result = await _invoke(cmd, args, options);
    yayState.is_loading = false;
    
    return result;
};