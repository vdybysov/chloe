<script>
    import { onMount } from "svelte";
    import { useParams } from "svelte-navigator";
    import { get } from "svelte/store";
    import Spinner from "../../components/Spinner.svelte";
    import TopBar from "../../components/TopBar.svelte";
    import { useWs } from "../../hooks/ws";
    import DeviceEdit from "../../views/DeviceEdit.svelte";

    const ws = useWs();
    const params = useParams();

    let device;
    let isLoading = true;
    let title = "";

    onMount(async () => {
        device = await ws.sendOp("device.get", {
            id: get(params).id,
        });
        title = device.name;
        isLoading = false;
    });
</script>

<TopBar {title} />
{#if isLoading}
    <Spinner />
{:else}
    <DeviceEdit {device} />
{/if}

<style lang="postcss">
</style>
