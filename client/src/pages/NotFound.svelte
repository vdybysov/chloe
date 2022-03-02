<script>
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import { link } from "svelte-navigator";

    onMount(() => {
        document.title = $_("404.page_title");
    });
</script>

<div class="flex flex-col min-h-screen justify-center items-center">
    <h1 class="block text-6xl font-thin">
        {$_("404.title")}
    </h1>
    <a class="mt-6 px-4 py-2 bg-gray-200 rounded-xl" href="/" use:link
        >{$_("404.back")}</a
    >
</div>
