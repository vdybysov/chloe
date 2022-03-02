import { addMessages, init, register } from "svelte-i18n";

import ru from "./ru.json"

addMessages('ru', ru)

init({
    fallbackLocale: 'en',
    initialLocale: 'ru',
});