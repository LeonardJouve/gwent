import type {NotificationName} from "$lib/types/notification";

type WeatherStore = {
    notifications: NotificationName[];
};

export const store = $state<WeatherStore>({
    notifications: [],
});
