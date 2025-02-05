<script>
import { enable_ruleset, disable_ruleset, ruleset_is_enabled } from "$lib/ruleset"
let { ruleset } = $props();
</script>

{#if ruleset_is_enabled(ruleset)} 
    <button type="button" class="btn btn-sm variant-filled-primary" style="transform: translateX(-70%);" onclick={() => {disable_ruleset(ruleset)}}>disable</button>
{:else}
    <button type="button" class="btn btn-sm variant-ghost" style="transform: translateX(-70%);" onclick={() => {enable_ruleset(ruleset)}}>enable</button>
{/if}