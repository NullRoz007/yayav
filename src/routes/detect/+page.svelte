<script>
import { invalidateAll } from '$app/navigation';

//@ts-nocheck
import { start_model_sidecar, get_model_status, start_training } from '$lib/model'
import { ProgressBar } from '@skeletonlabs/skeleton';

</script>

<div class="m-6">
    <h3 class="h3">Machine Learning</h3>
    <blockquote class="blockquote">Configure and train models for AI driven malware detection.</blockquote>
</div>

{#await get_model_status() then status}
    {#if status.status == "not_started"}
        <button class="btn btn-sm variant-filled-primary m-5" on:click={() => { start_training() }}>Start training</button>
    {:else if status.status == "training" }
        <ProgressBar value={status.progress.currentEpoch} max={status.progress.totalEpochs} />
    {:else}
        {status}
        <button class="btn btn-sm variant-filled-primary m-5" on:click={() => { start_training() }}>Retrain</button>
    {/if}
{/await}
