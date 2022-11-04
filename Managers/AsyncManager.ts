export class AsyncManager {
    private static queue: (() => Promise<any>)[] = [];
    private static isRunning: boolean = false;

    private static async runPromises() {
        while (AsyncManager.queue.length > 0) {
            const funcs = AsyncManager.queue.shift();
            if (funcs) {
                await funcs();
            }
        }
    }

    public static async runPromiseQueue() {
        if (!AsyncManager.isRunning) {
            AsyncManager.isRunning = true;
            await AsyncManager.runPromises();
            AsyncManager.isRunning = false;

        }
    }

    public static add(func: Promise<any>): void {
        AsyncManager.queue.push(async () => await func)
    }

    public static async run(): Promise<void> {
        setTimeout(() => AsyncManager.runPromiseQueue(), 10);
    }

    public static addAndRun(func: Promise<any>): void {
        AsyncManager.add(func);
        AsyncManager.run();
    }

}