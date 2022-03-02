<script>
    import { link, useNavigate } from "svelte-navigator";
    import { fade } from "svelte/transition";
    import { useAuth } from "../hooks/auth";
    import Card from "./Card.svelte";
    import { _ } from "svelte-i18n";
    import { Menu, MenuButton, MenuItems } from "@rgossiaux/svelte-headlessui";

    const navigate = useNavigate();
    const { user, logout } = useAuth();

    export let title = "";

    let showUserMenu = false;
</script>

<div class="top-bar">
    <Card>
        <h1 class="title">{title || ""}</h1>
        <Menu>
            <div class="user relative">
                <MenuButton class="flex items-center">
                    <span
                        class="login"
                        on:click={() => (showUserMenu = !showUserMenu)}
                    >
                        {$user.login}
                    </span>
                    <img
                        class="avatar"
                        alt={$user.login}
                        src={`https://avatars.yandex.net/get-yapic/${$user.avatarId}/islands-50`}
                        on:click={() => (showUserMenu = !showUserMenu)}
                    />
                </MenuButton>
                <MenuItems>
                    <div
                        class="user-menu"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabindex="-1"
                        transition:fade|local={{ duration: 100 }}
                    >
                        <div class="py-1" role="none">
                            <a
                                class="text-gray-700 block px-4 py-2"
                                role="menuitem"
                                tabindex="-1"
                                use:link
                                href="/devices"
                            >
                                {$_("top_bar.menu.devices")}
                            </a>
                            <button
                                type="submit"
                                class="text-gray-700 block w-full text-left px-4 py-2"
                                role="menuitem"
                                tabindex="-1"
                                on:click={() => {
                                    navigate("/");
                                    logout();
                                }}
                            >
                                {$_("top_bar.menu.log_out")}
                            </button>
                        </div>
                    </div>
                </MenuItems>
            </div>
        </Menu>
    </Card>
</div>

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
    .user-menu {
        @apply origin-top-right absolute top-10 right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none;
    }
</style>
