<script>
    import Spinner from "./Spinner.svelte";

    export let onClick;
    export let state;
    export let variant = "";
</script>

<button
    class={`button ${$$props.class ?? ""} ${state} variant-${variant || "filled"}`}
    on:click={() => {
        if (state !== "disabled" && onClick) {
            onClick();
        }
    }}
    disabled={state !== "idle"}
>
    {#if state === "busy"}
        <Spinner />
    {:else}
        <slot />
    {/if}
</button>

<style lang="postcss">
    .button {
        @apply inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-black bg-gray-200 hover:opacity-80 focus:outline-none;
    }

    .button.button-lg {
        @apply text-lg py-3 px-6 rounded-xl;
    }

    .button:disabled {
        @apply opacity-70 cursor-not-allowed;
    }

    .button :global(.loader) {
        width: 16px;
        height: 16px;
        border-top: 0.2em solid rgb(0 0 0 / 20%);
        border-right: 0.2em solid rgb(0 0 0 / 20%);
        border-bottom: 0.2em solid rgb(0 0 0 / 20%);
        border-left: 0.2em solid #000000;
        margin: auto;
    }

    .button.variant-outlined {
        @apply bg-transparent border-gray-400 hover:border-gray-800 outline-0 duration-75;
    }

    .button.variant-outlined:disabled {
        @apply bg-transparent border-gray-300 hover:border-gray-300 text-gray-500;
    }
</style>
