export type Timers = {
    [roomId: string] : {
        gameInterval: NodeJS.Timeout
        timerInterval: NodeJS.Timeout
    }
}