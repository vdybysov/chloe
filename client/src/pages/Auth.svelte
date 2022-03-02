<script>
    import { onMount } from "svelte";
    import { useNavigate } from "svelte-navigator";
    import { useAuth } from "../hooks/auth";
    import { useAuthRest } from "../hooks/rest/auth";

    const navigate = useNavigate();
    const auth = useAuth();
    const authUrl = `${import.meta.env.VITE_API_URL}/oauth/authorize`;

    const authRest = useAuthRest();

    onMount(async () => {
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
            const { refresh_token, access_token, expires_in } =
                await authRest.token({ code });
            auth.setTokens({
                access_token,
                refresh_token,
                expires_at: new Date(Date.now() + expires_in * 1000),
            });
            navigate("/devices");
        } else {
            window.location.href = `${authUrl}?redirect_uri=${window.location.origin}/auth`;
        }
    });
</script>
