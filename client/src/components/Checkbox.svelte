<script>
    import { Switch } from "@rgossiaux/svelte-headlessui";
    import { Check, Icon } from "svelte-hero-icons";
    export let checked;
    export let onChange;
</script>

<Switch
    {checked}
    on:change={onChange}
    class={`${
        checked ? "bg-yellow border-transparent" : "bg-transparent border-gray-300"
    } relative inline-flex justify-center items-center h-5 w-5 rounded-md border`}
>
    {#if checked}
        <Icon src={Check} class="w-3 h-3" />
    {/if}
</Switch>
