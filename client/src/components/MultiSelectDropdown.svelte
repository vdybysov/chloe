<script>
    import { Menu, MenuButton, MenuItems } from "@rgossiaux/svelte-headlessui";
    import { ChevronDown, Icon } from "svelte-hero-icons";
    import { fade } from "svelte/transition";
    import Checkbox from "./Checkbox.svelte";

    export let value;
    export let items;
    export let idProp = "";
    export let displayProp = "";

    $: value = value
        ?.map((v) =>
            items.find((i) => (idProp ? i[idProp] === v[idProp] : i === v))
        )
        .filter((v) => v);
</script>

<Menu class="relative">
    <MenuButton class="flex select items-centerpy-2 px-4 pr-1">
        {value?.length || 0} items
        <Icon src={ChevronDown} class="ml-2 mr-1 w-3 h-3"/>
    </MenuButton>
    <MenuItems>
        <div
            class="dropdown"
            role="menu"
            transition:fade|local={{ duration: 100 }}
        >
            {#each items as item}
                <label class="item">
                    <Checkbox
                        checked={value?.includes(item)}
                        onChange={() => {
                            if (value?.includes(item)) {
                                value = value.filter((i) => i !== item);
                            } else {
                                value = [...(value || []), item];
                            }
                        }}
                    />
                    <span class="ml-2">
                        {displayProp ? item[displayProp] : item}
                    </span>
                </label>
            {/each}
        </div>
    </MenuItems>
</Menu>

<style lang="postcss">
    .top-bar {
        @apply my-4;
    }
    .top-bar :global(.card) {
        @apply max-w-none w-full flex justify-between;
    }
    .title {
        @apply text-2xl font-medium;
    }
    .user {
        @apply flex items-center cursor-pointer select-none;
    }
    .login {
        @apply font-medium;
    }
    .avatar {
        @apply rounded-full w-10 h-10 ml-2;
    }
    .dropdown {
        @apply origin-top-right absolute top-10 right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 py-2 max-h-80 overflow-auto;
    }
    .item {
        @apply flex items-center px-2 cursor-pointer;
    }
</style>
