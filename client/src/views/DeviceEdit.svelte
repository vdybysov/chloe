<script>
    import { Check, Icon, Plus, Trash } from "svelte-hero-icons";
    import { _ } from "svelte-i18n";
    import { useNavigate } from "svelte-navigator";
    import Button from "../components/Button.svelte";
    import Card from "../components/Card.svelte";
    import { useWs } from "../hooks/ws";
    import { CAPABILITY_TYPES, DEVICE_TYPES } from "../strings/devices";
    import CapabilityEdit from "./CapabilityEdit.svelte";

    const navigate = useNavigate();
    const ws = useWs();

    export let device;

    const save = async () => {
        const saved = await ws.sendOp("device.save", {
            device,
        });
        navigate("/devices");
    };

    const remove = async () => {
        await ws.sendOp("device.remove", {
            id: device._id,
        });
        navigate("/devices");
    };

    const addCapability = () => {
        device.capabilities = [...device.capabilities, {}];
    };

    const removeCapability = (capability) => {
        device.capabilities = device.capabilities.filter(
            (cap) => cap !== capability
        );
    };

    let availableCapabilityTypes = [];

    $: canSave = device.type && device.name && device.capabilities?.length;
    $: sortedCapabilities = (device.capabilities || []).sort(
        (a, b) =>
            CAPABILITY_TYPES.indexOf(a.type) - CAPABILITY_TYPES.indexOf(b.type)
    );
    $: {
        availableCapabilityTypes = CAPABILITY_TYPES;
        // .filter((type) =>
        //     !device.capabilities?.find((cap) => cap.type === type)
        // );
    }
</script>

<div class="device-edit">
    <Card>
        <div class="form device-common">
            {#if device.uid}
                <div class="uid">
                    <label>
                        UID
                        <input bind:value={device.uid} readonly />
                    </label>
                </div>
            {/if}
            <div>
                <label>
                    {$_("devices.edit.type")}
                    <select bind:value={device.type} disabled={!!device.uid}>
                        {#each DEVICE_TYPES as type}
                            <option value={type}>{type}</option>
                        {/each}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    {$_("devices.edit.name")}
                    <input bind:value={device.name} />
                </label>
            </div>
        </div>
    </Card>

    <h3 class="text-xl font-md mt-4">
        {$_("devices.edit.capabilities.title")}
    </h3>
    {#each sortedCapabilities as capability}
        <CapabilityEdit
            {capability}
            onRemove={() => removeCapability(capability)}
            availableTypes={availableCapabilityTypes}
        />
    {/each}

    <Button
        class="mt-4"
        variant="outlined"
        state={"idle"}
        onClick={() => addCapability()}
    >
        <Icon src={Plus} class="w-3 h-3 my-1 mr-1" />{$_(
            "devices.edit.capabilities.add"
        )}
    </Button>

    <div class="device-bottom">
        <Button
            class="button-lg"
            variant="outlined"
            state={canSave ? "idle" : "disabled"}
            onClick={() => save()}
        >
            <Icon src={Check} class="w-5 h-5 my-1 mr-1" />{$_(
                "devices.edit.save"
            )}
        </Button>
        {#if device._id}
            <Button
                class="button-lg"
                variant="outlined"
                state="idle"
                onClick={() => remove()}
            >
                <Icon src={Trash} class="w-5 h-5 my-1 mr-1" />{$_(
                    "devices.edit.delete"
                )}
            </Button>
        {/if}
    </div>
</div>

<style lang="postcss">
    .device-edit :global(.card) {
        @apply max-w-none;
    }
    .uid {
        @apply w-80;
    }
    .device-bottom {
        @apply w-full py-6;
    }
    .device-bottom :global(.button) {
        @apply w-40;
    }
</style>
