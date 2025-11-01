<script lang="ts">
    import notifications from "@shared/notifications";
    import {store} from "../store/notifications.svelte";
    import {iconURL} from "../utils/utils";

    const notificationTime = 1200;
    let timer: number|null = null;

    const notification = $derived.by(() => {
        if (!store.notifications.length) {
            return null;
        }

        if (timer === null) {
            timer = window.setTimeout(() => {
                timer = null;
                store.notifications.splice(0, 1);
            }, notificationTime);
        }

        return notifications[store.notifications[0]];
    });
</script>

{#if notification}
    <div class="notification">
        {#if notification.imageSource}
            <img
                class="image"
                alt="notification"
                src={iconURL(notification.imageSource)}
            />
        {/if}
        <div class="message">
            <h1>
                {notification.message}
            </h1>
            {#if notification.description}
                <h3>
                    {notification.description}
                </h3>
            {/if}
        </div>
    </div>
{/if}

<style>
    .notification {
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        height: 13%;
        z-index: 10;

        color: goldenrod;
        font-size: 1.6vw;
        text-align:left;
        font-weight:bold;
        background-color: rgba(10,10,10,0.95);

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .image {
        height: 150%;
    }

    .message {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
</style>
