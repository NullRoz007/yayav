<script>
// @ts-nocheck
import '../app.css';
import { AppShell } from '@skeletonlabs/skeleton';
import { AppBar } from '@skeletonlabs/skeleton'
import { LightSwitch } from '@skeletonlabs/skeleton';
import { AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';
import { CodeBlock } from '@skeletonlabs/skeleton';
import { initializeStores, getDrawerStore, Drawer } from '@skeletonlabs/skeleton';
import { storeHighlightJs } from '@skeletonlabs/skeleton';
import { page } from '$app/stores';

import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';

import { invoke } from "$lib/invoke-wrapper";
import { yayState } from "$lib/state.svelte";

import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark.css';
import yara from 'highlightjs-yara'; // for HTML

let { children } = $props();

const scan = async () => {
    const rule_paths = [];
    for(let rs of yayState.enabled_rulesets) {
        for(let r of rs.rules) {
            rule_paths.push(r);
        }
    }

    for(let target of yayState.targets) {
        await invoke("yara_scan_targets", {
            paths: target.paths,
            rulePaths: rule_paths,
            dirs: target.is_dirs,
            memory: target.is_memory
        });
    }
}

const generate_raw_github_link = (url) => {
    const githubBlobPrefix = "https://raw.githubusercontent.com/";
    const githubUrlPrefix = "https://github.com/";

    url = url.replace('//blob', '/blob');
    
    const regex = /github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/;
    
    const match = url.match(regex);
    if (!match) {
        console.log('Invalid url');
        return; // Invalid URL structure
    }
    const owner = match[1];
    const repo = match[2];
    const commitHash = match[3];
    const filePath = match[4];
    
    const raw_url = `${githubBlobPrefix}${owner}/${repo}/${commitHash}/${filePath}`;

    return raw_url;
};

const fetch_rule_src = async (url) => {
    let raw_url = generate_raw_github_link(url);
    try {
        let response = await fetch(raw_url);
        
        if(!response.ok) {
            throw new Error("Failed to fetch rule source!");
        }

        const body = await response.text();
        return body;
    } catch (err) {
        console.error(err);
    }

    return "";
}

const rule_src = (identifier) => {
    console.log("rule src, id = " + identifier);
    console.log("rules src, source map =  ");
    console.log(yayState.rule_source_map);
    console.log("rule src, source map lookup =");
    console.log(yayState.rule_source_map[identifier]);
    return yayState.rule_source_map[identifier];
}

listen('log_message', event => {
    if(yayState.log_messages.length == 100) yayState.log_messages = [];
    yayState.log_messages.push(event.payload);
});

listen('log_match', async (event) => {
    let json_rule = JSON.parse(event.payload.rule_json)
   
    var src_url = '';
    for(let meta of json_rule.metadata) {
        if(meta[0] == 'source_url') {
            src_url = meta[1];
            break;
        }
    }

    var src = await fetch_rule_src(src_url);
    yayState.rule_source_map[json_rule.identifier] = src;

    if(yayState.matches_map[event.payload.path]) {
        yayState.matches_map[event.payload.path].push(JSON.parse(event.payload.rule_json));
        return;
    }

    yayState.matches_map[event.payload.path] = [json_rule];
});

initializeStores();

hljs.registerLanguage('yara', yara);
storeHighlightJs.set(hljs);

const drawerStore = getDrawerStore();
let rule_text = "";
</script>
<Drawer>
    {#if $drawerStore.id === 'rule-drawer'}
        <div class="m-4">
            <h1 class="h1 text-lg">Rule: {$drawerStore.meta.identifier}</h1>
            <h4 class="text-md">Metadata:</h4>
            
            <ul class="list-disc pl-5 text-sm">
                {#each $drawerStore.meta.metadata as meta}
                    <li><strong>{meta[0]}:</strong> {meta[1]}</li>
                {/each}
            </ul>
            
            <CodeBlock lineNumbers=true language="yara" code={rule_src($drawerStore.meta.identifier)}></CodeBlock>
        </div>
    {/if}
</Drawer>
<AppShell>
	<!-- (sidebarLeft) -->
	<!-- (sidebarRight) -->
	<!-- (pageHeader) -->
    <svelte:fragment slot="header">
		<AppBar>
            <svelte:fragment slot="lead">yayAV</svelte:fragment>
            <svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
        </AppBar>
	</svelte:fragment>
    
    <svelte:fragment slot="sidebarLeft">
        <AppRail>
            <AppRailAnchor href="/" selected={$page.url.pathname === '/'}>Scan</AppRailAnchor>
            <AppRailAnchor href="/rules" selected={$page.url.pathname === '/rules'}>Yara</AppRailAnchor>
        </AppRail>
    </svelte:fragment>

	<!-- Router Slot -->
    {@render children()}
	<!-- ---- / ---- -->
	<!-- (pageFooter) -->
	<svelte:fragment slot="footer">
        <div class="bg-secondary h-16 w-full">
            <span class="m-5 chip variant-filled-primary">
                yayAV v0.1
            </span>
            <span class="chip variant-filled-primary"> Enabled: {yayState.enabled_rulesets.length}</span>

            <div class="mr-8 mb-1 absolute right-0 bottom-0 size-16">
                <button type="button" class="btn btn-sm variant-filled-primary m-5" onclick={scan}>Scan</button>
            </div>
        </div>
    </svelte:fragment>
</AppShell>
