import type {SocketData} from "@shared/types/socket";

type SocketStore = {
    data: SocketData|null;
};

export const store = $state<SocketStore>({
    data: null,
});
