<script>
// @ts-nocheck
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '$lib/invoke-wrapper';
import { yayState, get_matches } from "$lib/state.svelte";
import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
import ClearLogButton from '../components/ClearLogButton.svelte';
import TargetList from '../components/TargetList.svelte';

import { getDrawerStore } from "@skeletonlabs/skeleton";

const levelStyles = {
    Info: 'text-blue-500',
    Warning: 'text-yellow-500',
    Error: 'text-red-500 font-bold',
    Success: 'text-green-500',
    Match: 'text-red-500 font-bold'
};

const drawerStore = getDrawerStore();
const open_rule_drawer = (rule) => {
    const settings = { id: 'rule-drawer', meta: rule };
    console.log(rule);
    drawerStore.open(settings);
}

</script>

<Accordion>
    <AccordionItem class="variant-ghost-surface mt-5 mr-5 ml-5">
		<svelte:fragment slot="lead">Targets</svelte:fragment>
		<svelte:fragment slot="summary">{null}</svelte:fragment>
		<svelte:fragment slot="content">
            <TargetList />
        </svelte:fragment>
	</AccordionItem>
<br>

    <AccordionItem class="variant-ghost-surface m-5">
		<svelte:fragment slot="lead">Matches</svelte:fragment>
		<svelte:fragment slot="summary">{null}</svelte:fragment>
		<svelte:fragment slot="content">
            <Accordion>
            {#each get_matches() as match}
                <AccordionItem class="variant-ghost-surface ">
                    <svelte:fragment slot="lead"><p class="overflow-hide">{match.path}</p></svelte:fragment>
                    <svelte:fragment slot="summary">{null}</svelte:fragment>
                    <svelte:fragment slot="content">
                        {#each match.rules as rule}
                        <button class="btn btn-sm variant-filled-secondary m-1" onclick={() => { open_rule_drawer(rule)}}>{rule.identifier}</button>
                        {/each}
                    </svelte:fragment>
                </AccordionItem>
            {/each}
        </Accordion>  
        </svelte:fragment>
	</AccordionItem>
    
    <br>
	<AccordionItem class="variant-ghost-surface m-5">
		<svelte:fragment slot="lead">Logs</svelte:fragment>
		<svelte:fragment slot="summary">{null}</svelte:fragment>
		<svelte:fragment slot="content">
            <section class="bg-gray-900 max-h-64 overflow-auto p-4 mb-2">
                {#each yayState.log_messages as log}
                    <pre class={`text-sm ${levelStyles[log.lvl] || 'text-white'}`}>{log.msg}</pre>
                {/each}
            </section>
        </svelte:fragment>

        <svelte:fragment slot="iconClosed"> 
            <ClearLogButton />
        </svelte:fragment>

	    <svelte:fragment slot="iconOpen"> 
            <ClearLogButton />
        </svelte:fragment>
	</AccordionItem>
</Accordion>
