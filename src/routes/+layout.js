
import { start_model_sidecar } from '$lib/model'

export const prerender = true;
export const ssr = false;

export async function load() {
    start_model_sidecar();

    return {
        enabled_rulesets: [] // Initial empty array, can be populated dynamically
    };
}
