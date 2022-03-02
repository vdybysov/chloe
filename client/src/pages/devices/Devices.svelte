<script>
    import { Route } from "svelte-navigator";
    import Add from "./Add.svelte";
    import List from "./List.svelte";
    import One from "./One.svelte";
</script>

<Route exact path="/">
    <List />
</Route>
<Route path="/:id">
    <One />
</Route>
<Route path="/add">
    <Add />
</Route>
