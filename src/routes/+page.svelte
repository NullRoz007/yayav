<script>
// @ts-nocheck
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '$lib/invoke-wrapper';
import { yayState, get_matches, get_matches_by_rule } from "$lib/state.svelte";
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

const get_severity = (rule) => {
    let severity = rule.metadata.filter((m) =>  m[0] == 'severity')[0];
    if(!severity) return -1;

    return severity[1];
}

const severity_to_style = (severity) => {
    var style = "variant-ghost-surface";
    console.log(severity);
    if(severity > 0 && severity < 25) style = "variant-ghost-secondary";
    else if(severity >= 25 && severity < 50) style = "variant-ghost-warning";
    else if (severity >= 50 && severity < 75) style = "variant-ghost-error";
    else if (severity >= 75) style = "variant-ghost-error";
    
    console.log(style);
    return style;
}

</script>
<div class="m-6">
    <h3 class="h3 ">Scan</h3>
    <blockquote class="blockquote">Select and scan targets.</blockquote>
</div>

<Accordion>
    <AccordionItem class="variant-ghost-surface m-5 rounded-xl">
		<svelte:fragment slot="lead">Targets</svelte:fragment>
		<svelte:fragment slot="summary">{null}</svelte:fragment>
		<svelte:fragment slot="content">
            <TargetList />
        </svelte:fragment>
	</AccordionItem>
</Accordion>
<Accordion>
    <AccordionItem class="variant-ghost-surface m-5 rounded-xl">
		<svelte:fragment slot="lead">Matches</svelte:fragment>
		<svelte:fragment slot="summary">{null}</svelte:fragment>
		<svelte:fragment slot="content">
            <Accordion>
            {#each get_matches_by_rule() as rule_match}
                <AccordionItem class="{severity_to_style(get_severity(rule_match.rule))} rounded-xl">
                    <svelte:fragment slot="lead"><p class="overflow-hide">{rule_match.rule.identifier}</p></svelte:fragment>
                    <svelte:fragment slot="summary">
                        <button class="btn btn-sm variant-ghost-surface m-1" onclick={() => { open_rule_drawer(rule_match.rule)}}>meta</button>
                    </svelte:fragment>
                    <svelte:fragment slot="content">
                        <ul>
                            {#each rule_match.matches as match}
                                <li>
                                    <button class="btn btn-sm variant-filled-warning m-1" onclick={() => { /*open_rule_drawer(rule)*/}}>{match}</button>    
                                </li>
                            {/each}
                        </ul>
                    </svelte:fragment>
                </AccordionItem>
            {/each}
        </Accordion>  
        </svelte:fragment>
	</AccordionItem>
</Accordion>    
<Accordion>
	<AccordionItem class="variant-ghost-surface m-5 rounded-xl">
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
