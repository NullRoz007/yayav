<script>
    import { yayState } from "$lib/state.svelte";
    const clear_logs = () => {
        yayState.log_messages = [];
    };
</script>
<button type="button" class="btn btn-sm variant-filled-primary" style="transform: translateX(-70%);" onclick={clear_logs}>clear</button>