import type {PageLoad} from "./$types";
import {redirect} from "@sveltejs/kit";
import {SocketDataSchema} from "@shared/types/socket";

export const load: PageLoad = ({url}) => {
    try {
        const socketData = SocketDataSchema.parse({
            id: url.searchParams.get("id"),
            matchId: url.searchParams.get("matchId"),
        });

        return {socketData};
    } catch (_) {
        throw redirect(302, "/");
    }
};
