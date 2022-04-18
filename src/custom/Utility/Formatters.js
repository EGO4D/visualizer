export function formatVideoSeconds(seconds) {
    return seconds > 3600 ?
        new Date(seconds * 1000).toISOString().substr(11, 8)
        : seconds > 60 ?
            new Date(seconds * 1000).toISOString().substr(14, 5)
            : new Date(seconds * 1000).toISOString().substr(15, 4)
}
