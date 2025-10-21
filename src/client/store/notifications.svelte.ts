import type {NotificationName} from "@shared/types/notification";

type WeatherStore = {
    notifications: NotificationName[];
};

export const store = $state<WeatherStore>({
    notifications: [],
});

export const clearNotifications = () => {
    store.notifications = [];
};
