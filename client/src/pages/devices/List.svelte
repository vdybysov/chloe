<script>
    import { onMount } from "svelte";
    import { Icon, Plus } from "svelte-hero-icons";
    import { _ } from "svelte-i18n";
    import { Link, useNavigate } from "svelte-navigator";
    import Button from "../../components/Button.svelte";
    import Card from "../../components/Card.svelte";
    import Spinner from "../../components/Spinner.svelte";
    import TopBar from "../../components/TopBar.svelte";
    import { useWs } from "../../hooks/ws";

    const navigate = useNavigate();
    const ws = useWs();

    let devices;
    let isLoading = true;
    let title = "";

    onMount(async () => {
        devices = await ws.sendOp("device.list");
        title = $_("devices.title", { values: { amount: devices.length } });
        isLoading = false;
    });
</script>

<TopBar {title} />
{#if isLoading}
    <Spinner />
{:else}
    <div class="devices">
        <div class="top-controls">
            <Button
                state="idle"
                onClick={() => navigate("/devices/add")}
                variant="outlined"
            >
                <Icon src={Plus} class="w-3 h-3 my-1 mr-1" /> {$_('devices.add')}
            </Button>
        </div>
        <div class="device-list">
            {#each devices as device}
                <Link to={`/devices/${device._id}`}>
                    <Card>
                        <div class="device">
                            <div class="device-top">
                                <span class="device-type">
                                    {device.type}
                                </span>
                                <div class="device-state">
                                    <span class="device-state-name">
                                        {device.state}
                                    </span>
                                    <span
                                        class={`device-state-display device-state-display--${device.state}`}
                                    />
                                </div>
                            </div>
                            <h2 class="device-name">
                                {device.name}
                            </h2>
                            <span class="device-uid">
                                {device.uid}
                            </span>
                        </div>
                    </Card>
                </Link>
            {/each}
        </div>
    </div>
{/if}

<style lang="postcss">
    .top-controls {
        @apply flex mb-4;
    }
    .device-list {
        @apply flex flex-wrap gap-3;
    }
    .device {
        @apply flex flex-col cursor-pointer;
    }
    .device-type {
        @apply text-xs text-gray-700;
    }
    .device-name {
        @apply text-lg font-medium;
    }
    .device-uid {
        @apply text-sm text-gray-500 font-thin;
    }
    .device-top {
        @apply flex justify-between items-start;
    }
    .device-state-name {
        @apply text-sm text-gray-500 font-thin;
    }
    .device-state-display {
        @apply inline-block w-2 h-2 rounded-full bg-gray-600;
    }
    .device-state-display--online {
        @apply bg-lime-500;
    }
</style>
