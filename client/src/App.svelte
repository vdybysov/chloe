<script>
  import { Route, Router } from "svelte-navigator";
  import "virtual:windi.css";
  import { setAuth } from "./hooks/auth";
  import { setRest } from "./hooks/rest";
  import { setWs } from "./hooks/ws";
  import Auth from "./pages/Auth.svelte";
  import Devices from "./pages/devices/Devices.svelte";
  import Index from "./pages/Index.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import AuthRoute from "./routes/AuthRoute.svelte";

  setRest();
  setAuth();
  setWs();
</script>

<main>
  <Router>
    <AuthRoute path="/devices/*">
      <Devices />
    </AuthRoute>
    <Route path="/auth">
      <Auth />
    </Route>
    <Route path="/">
      <Index />
    </Route>
    <Route>
      <NotFound />
    </Route>
  </Router>
</main>

<style lang="postcss">
  :global(body) {
    @apply bg-gray-100;
  }
  :global(#app) {
    @apply flex flex-wrap justify-center;
  }
  :global(.form) {
    @apply flex flex-wrap gap-4;
  }
  :global(.form label) {
    @apply inline-block w-full font-medium;
  }
  :global(.form select),
  :global(.form .select),
  :global(.form input) {
    @apply block mt-1 border-1 border-gray-300 rounded-xl outline-0 px-3 py-2 w-full;
    height: 42px;
  }
  :global(.form select:focus),
  :global(.form input:focus) {
    @apply border-gray-500;
  }
  :global(.form select:disabled),
  :global(.form input:read-only) {
    @apply border-gray-300 bg-gray-100 text-gray-500;
  }
  main {
    @apply max-w-7xl flex-grow;
  }
</style>
