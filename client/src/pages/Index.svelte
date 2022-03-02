<script>
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import { link } from "svelte-navigator";
    import chloeSrc from "../assets/chloe.png";

    onMount(() => {
        document.title = $_("page_title");
    });
</script>

<main class="index">
    <img src={chloeSrc} alt="chloe" class="max-w-xs" />
    <h1>{$_("index.title")}</h1>
    <h2>{$_("index.subtitle")}</h2>
    <a class="log-in" href="/devices" use:link>
        {$_("index.log_in")}
    </a>
</main>

<style lang="postcss">
    .index {
        @apply flex flex-col items-center justify-center min-h-screen w-full;
    }
    h1 {
        @apply block text-8xl font-thin outline-none;
    }
    h2 {
        @apply block text-sm;
    }
    .log-in {
        @apply mt-9 text-lg text-black font-medium bg-yellow px-6 py-3 rounded-2xl visited:text-black hover:opacity-80 duration-75;
    }
</style>
