<script>
// @ts-nocheck
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    import { get_rulesets, compile_enabled_rulesets } from "$lib/ruleset"
    import { invoke } from '$lib/invoke-wrapper';
    import { yayState } from "$lib/state.svelte";
    import RulesetButton from '../../components/RulesetButton.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';
</script>

{#await get_rulesets() then rulesets}
{#each rulesets as ruleset}
<Accordion>
	<AccordionItem class="variant-ghost-surface m-5">
		<svelte:fragment slot="lead">{ruleset.name}</svelte:fragment>
		<svelte:fragment slot="summary">{null}</svelte:fragment>
		<svelte:fragment slot="content">
            {#each ruleset.rules as rule}
                <span class="chip variant-filled-primary">{rule}</span>
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


<button type="button" class="btn btn-sm variant-filled-primary m-5" onclick={compile_enabled_rulesets}>compile</button>
{/await}


