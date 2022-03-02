<script>
    import { _ } from "svelte-i18n";
    import TopBar from "../../components/TopBar.svelte";
    import DeviceEdit from "../../views/DeviceEdit.svelte";

    const device = {
        name: $_("devices.new.name"),
        capabilities: [
            {
                type: "on_off",
            },
        ],
    };
</script>

<TopBar title={$_("devices.new.title")} />
<div class="device">
    <DeviceEdit {device} />
</div>

<style lang="postcss">
</style>
