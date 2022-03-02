<script>
    import { Icon, Trash } from "svelte-hero-icons";
    import Card from "../components/Card.svelte";
    import MultiSelectDropdown from "../components/MultiSelectDropdown.svelte";
    import Switch from "../components/Switch.svelte";
    import {
        COLOR_SCENES,
        MODE_INSTANCES,
        MODE_VALUES,
        RANGE_INSTANCES,
        TOGGLE_INSTANCES,
    } from "../strings/devices";

    export let capability;
    export let availableTypes = [];
    export let onRemove;

    const colorScenes = COLOR_SCENES.map((id) => ({ id }));
    const modes = MODE_VALUES.map((value) => ({ value }));

    $: types =
        capability.type && !availableTypes.includes(capability.type)
            ? [capability.type, ...availableTypes]
            : [...availableTypes];
    $: if (!capability.parameters) {
        capability.parameters = capability.parameters || {};
    }
    $: if (capability.parameters) {
        if (capability.type === "range") {
            capability.parameters.range = capability.parameters.range || {
                min: 0,
                max: 100,
            };
            capability.parameters.precision =
                capability.parameters.precision || 1;
        } else {
            capability.parameters.range = undefined;
        }
    }
</script>

<div class="capability-edit">
    <Card>
        <span class="capability-remove" on:click={() => onRemove && onRemove()}>
            <Icon src={Trash} class="w-5 h-5" />
        </span>
        <div class="form">
            <div>
                <label>
                    type
                    <select bind:value={capability.type}>
                        {#each types as type}
                            <option value={type}>{type}</option>
                        {/each}
                    </select>
                </label>
            </div>
            {#if capability.type === "color_setting"}
                <div>
                    <label>
                        <Switch
                            checked={!!capability.parameters?.temperature_k}
                            onChange={() => {
                                if (capability.parameters?.temperature_k) {
                                    const { temperature_k, ...parameters } =
                                        capability.parameters;
                                    capability.parameters = parameters;
                                } else {
                                    capability.parameters =
                                        capability.parameters || {};
                                    capability.parameters.temperature_k = {
                                        min: 2000,
                                        max: 9000,
                                    };
                                }
                            }}
                        />
                        temperature_k
                    </label>
                    {#if !!capability.parameters?.temperature_k}
                        <div class="flex">
                            <div class="mr-1">
                                <input
                                    type="number"
                                    class="max-w-20"
                                    placeholder="min"
                                    bind:value={capability.parameters
                                        .temperature_k.min}
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    class="max-w-20"
                                    placeholder="max"
                                    bind:value={capability.parameters
                                        .temperature_k.max}
                                />
                            </div>
                        </div>
                    {/if}
                </div>
                <div>
                    <label>
                        <Switch
                            checked={!!capability.parameters?.color_model}
                            onChange={() => {
                                if (capability.parameters?.color_model) {
                                    const { color_model, ...parameters } =
                                        capability.parameters;
                                    capability.parameters = parameters;
                                } else {
                                    capability.parameters =
                                        capability.parameters || {};
                                    capability.parameters.color_model = "rgb";
                                }
                            }}
                        />
                        color_model
                    </label>
                    {#if !!capability.parameters?.color_model}
                        <div>
                            <select
                                type="text"
                                bind:value={capability.parameters.color_model}
                            >
                                <option value="rgb">rgb</option>
                                <option value="hsv">hsv</option>
                            </select>
                        </div>
                    {/if}
                </div>
                <div>
                    <label>
                        <Switch
                            checked={!!capability.parameters?.color_scene}
                            onChange={() => {
                                if (capability.parameters?.color_scene) {
                                    const { color_scene, ...parameters } =
                                        capability.parameters;
                                    capability.parameters = parameters;
                                } else {
                                    capability.parameters =
                                        capability.parameters || {};
                                    capability.parameters.color_scene = {
                                        scenes: [...colorScenes],
                                    };
                                }
                            }}
                        />
                        color_scene
                    </label>
                    {#if !!capability.parameters?.color_scene}
                        <div>
                            <MultiSelectDropdown
                                idProp="id"
                                displayProp="id"
                                items={colorScenes}
                                bind:value={capability.parameters.color_scene
                                    .scenes}
                            />
                        </div>
                    {/if}
                </div>
            {/if}
            {#if capability.type === "mode"}
                <div>
                    <label for="mode_instance">
                        instance
                        <select
                            type="text"
                            bind:value={capability.parameters.instance}
                        >
                            {#each MODE_INSTANCES as i}
                                <option value={i}>{i}</option>
                            {/each}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        modes
                        <MultiSelectDropdown
                            idProp="value"
                            displayProp="value"
                            items={modes}
                            bind:value={capability.parameters.modes}
                        />
                    </label>
                </div>
            {/if}
            {#if capability.type === "toggle"}
                <div>
                    <label>
                        instance
                        <select
                            type="text"
                            bind:value={capability.parameters.instance}
                        >
                            {#each TOGGLE_INSTANCES as i}
                                <option value={i}>{i}</option>
                            {/each}
                        </select>
                    </label>
                </div>
            {/if}
            {#if capability.type === "range"}
                <div>
                    <label>
                        instance
                        <select
                            type="text"
                            bind:value={capability.parameters.instance}
                        >
                            {#each RANGE_INSTANCES as i}
                                <option value={i}>{i}</option>
                            {/each}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        unit
                        <select
                            type="text"
                            bind:value={capability.parameters.unit}
                        >
                            <option value="unit.percent">unit.percent</option>
                        </select>
                    </label>
                </div>
                {#if capability.parameters.range}
                    <div class="flex gap-2">
                        <div>
                            <label>
                                min
                                <input
                                    type="number"
                                    class="max-w-20"
                                    bind:value={capability.parameters.range.min}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                max
                                <input
                                    type="number"
                                    class="max-w-20"
                                    bind:value={capability.parameters.range.max}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                precision
                                <input
                                    type="number"
                                    class="max-w-20"
                                    bind:value={capability.parameters.precision}
                                />
                            </label>
                        </div>
                    </div>
                {/if}
            {/if}
        </div>
    </Card>
</div>

<style lang="postcss">
    .capability-edit {
        @apply relative my-2 select-none;
    }
    .capability-remove {
        @apply absolute right-4 cursor-pointer text-gray-600 hover:text-gray-900;
    }
    .form {
        @apply flex;
    }
    label {
        @apply cursor-pointer max-w-xs;
    }
</style>
