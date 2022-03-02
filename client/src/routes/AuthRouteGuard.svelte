<script>
    import Spinner from "../components/Spinner.svelte";
    import { onMount } from "svelte";
    import { useFocus, useNavigate } from "svelte-navigator";
    import { get } from "svelte/store";
    import { useAuth } from "../hooks/auth";

    const navigate = useNavigate();
    const registerFocus = useFocus();
    const { user, getAccessToken } = useAuth();

    let isLoading = true;

    const navigateToAuth = () =>
        navigate("/auth", {
            state: {
                from: location.pathname,
            },
            replace: true,
        });

    onMount(async () => {
        if (!!get(user)) {
            isLoading = false;
            return;
        }
        try {
            await getAccessToken();
        } catch (error) {
            navigateToAuth();
        } finally {
            isLoading = false;
        }
    });

    $: if (!isLoading && !$user) {
        navigateToAuth();
    }
</script>

{#if isLoading}
    <Spinner />
{:else if $user}
    <slot {registerFocus} />
{/if}
