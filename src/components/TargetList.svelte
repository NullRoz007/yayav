<script>
// @ts-nocheck
import { yayState } from "$lib/state.svelte";
import { open } from '@tauri-apps/plugin-dialog';
const add_target = (paths, is_dirs, is_memory) => {
    const target = {
        'paths': paths,
        'is_dirs': is_dirs,
        'is_memory': is_memory
    };

    yayState.targets.push(target);
};

const remove_target = (index) => {
    yayState.targets.splice(index, 1);
}

const show_file_dialog = async () => {
    const files = await open({
        multiple: true,
        directory: false
    });
    
    if(files.length == 0) return;
    add_target(files, false, false);
}

const show_dir_dialog = async () => {
    const dirs = await open({
        multiple: true,
        directory: true
    });
    
    if(dirs.length == 0) return;
    add_target(dirs, true, false);
}

</script>

<div class="flex flex-wrap justify-center">
    {#each yayState.targets as target, target_index}
    <div class="card m-4 max-w-128">
        <header class="card-header">
            <div class="flex justify-between">
                <span>Type: {target.is_dirs ? "Directories" : (target.is_memory ? "Memory" : "Files") }</span>
                <button type="button" class="btn btn-sm variant-filled-error " onclick={() => {remove_target(target_index)}}>x</button>
            </div>
        </header>
        <section class="p-4">
            <span>Paths:</span>
            <ol class="list max-w-full break-words">
                {#each target.paths as path}
                <li class="text-sm whitespace-normal break-words overflow-hidden">{path}</li>
                {/each}
            </ol>
        </section>
        <footer class="card-footer">
            <span class="chip variant-filled-warning">Unscanned</span>
        </footer>
    </div>
    {/each}
</div>

<div class="flex justify-end">
<div class="btn-group variant-filled-primary">
    <button onclick={show_file_dialog}>Add file</button>
    <button onclick={show_dir_dialog}>Add directory</button>
    <button onclick={() => { add_target([], false, true) }}>Add memory</button>
</div>
</div>