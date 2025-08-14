import type {PageLoad} from "./$types";
import {store} from "$lib/store/socket.svelte";
import {redirect} from "@sveltejs/kit";

export const load: PageLoad = () => {
    if (store.data === null) {
        throw redirect(302, "/");
    }

    return {socketData: store.data};
};
