<script>
// @ts-nocheck
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    import { get_rulesets, compile_enabled_rulesets, get_ruleset_dir_path } from "$lib/ruleset"
    import { invoke } from '$lib/invoke-wrapper';
    import { yayState } from "$lib/state.svelte";
    import RulesetButton from '../../components/RulesetButton.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';
</script>
{#await get_ruleset_dir_path() then ruleset_path}
<div class="m-6">
    <h3 class="h3 ">Rulesets</h3>
    <blockquote class="blockquote mb-3">Compile and enable rulesets</blockquote>
    <blockquote class="blockquote mb-3" style="border-left-color: yellow;">Ensure your rulesets are installed at:<br>{ruleset_path}/{"ruleset_name"}</blockquote>
</div>
{/await}

{#await get_rulesets() then rulesets}
{#each rulesets as ruleset}
<Accordion>
	<AccordionItem class="variant-ghost-surface m-5 rounded-xl">
		<svelte:fragment slot="lead">
            {#if ruleset.compiled}
                {ruleset.name} : compiled
            {:else}
                {ruleset.name}
            {/if}
        </svelte:fragment>
		<svelte:fragment slot="summary">{null}</svelte:fragment>
		<svelte:fragment slot="content">
            {#each ruleset.rules as rule}
                <span class="chip variant-filled-primary m-1">{rule}</span>
            {/each}

        </svelte:fragment>
             
        <svelte:fragment slot="iconClosed"> 
            <RulesetButton {ruleset}/>
        </svelte:fragment>

	    <svelte:fragment slot="iconOpen"> 
            <RulesetButton {ruleset}/>
        </svelte:fragment>
	</AccordionItem>
</Accordion>
{/each}
<button type="button" class="btn btn-sm variant-filled-primary mx-5" onclick={compile_enabled_rulesets}>compile</button>
{/await}