<script>
    import { Switch } from "@rgossiaux/svelte-headlessui";
    export let checked;
    export let onChange;
</script>

<Switch
    {checked}
    on:change={onChange}
    class={`${
        checked ? "bg-yellow" : "bg-gray-100"
    } relative inline-flex items-center h-3 rounded-full w-8`}
>
    <span
        class={`${
            checked ? "translate-x-4" : "translate-x-0"
        } inline-block w-4 h-4 transform transition ease-in-out duration-200 bg-white rounded-full shadow-md`}
    />
</Switch>
