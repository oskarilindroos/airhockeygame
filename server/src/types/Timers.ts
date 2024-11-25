export type Timers = {
    [roomId: string] : {
        gameInterval: NodeJS.Timeout | null
        timerInterval: NodeJS.Timeout | null
    }
}