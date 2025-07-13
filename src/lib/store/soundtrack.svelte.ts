type SoundtrackStore = {
    muted: boolean;
};

export const store = $state<SoundtrackStore>({
    muted: false,
});
