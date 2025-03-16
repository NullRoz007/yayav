<script>
    import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
    import { LightSwitch } from '@skeletonlabs/skeleton';

    import { goto } from '$app/navigation';

    let open = false;
    const handleClickOutside = (event) => {
        if (!event.target.closest('.dropdown')) {
            open = false;
        }
    };

    let selected = '';
    const navigate = (path) => {
        selected = path.replace('/', '');
        open = false;
        goto(path);
    }
    // Close on outside click
    window.addEventListener('click', handleClickOutside);
</script>

<div class="relative dropdown">
    <button type="button" class="btn variant-ghost px-4 py-2 w-32 max-w-32" on:click={() => open = !open}>
        <span>yayav/{selected == '' ? 'scan' : selected }</span>
        <span>↓</span>
    </button>

    {#if open}
        <div class="absolute card w-48 mt-2 p-2 shadow-xl">
            <ListBox class="m-2">
                <ListBoxItem 
                    bind:group={selected} name="medium" value=""
                    on:click={
                        () => { navigate('/')}
                    }
                >
                    Scan
                </ListBoxItem>
                <ListBoxItem 
                    bind:group={selected} name="medium" value="rules" 
                    on:click={() => { 
                        navigate('/rules')
                        }
                    }
                >
                    Yara
                </ListBoxItem>
            </ListBox>
            <hr>
            <LightSwitch class="m-2"/>
        </div>
    {/if}
</div>
