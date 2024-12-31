class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, ...args) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(...args));
        }
    }

    off(event, callback){
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
        }
    }
}


async function* asyncLargeDataset() {
    const largeData = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    for (let i = 0; i < largeData.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        yield largeData[i];
    }
}

async function asyncFind(iterator, checkCondition, delay, signal, emitter) {
    for await (const element of iterator) {
        if (signal.aborted) {
            throw new Error("Operation aborted");
        }

        try {
            const result = await checkCondition(element, signal);

            if (result) {
                emitter.emit('found', element);
                return element;
            }
        } catch (err) {
            if (err.message === "Operation aborted") {
                console.log("Task was aborted.");
            } else {
                console.error("Error processing element:", element, err);
            }
        }
    }

    emitter.emit('notFound');
    return undefined;
}

function asyncFindCheck(num, condition, signal) {
    return new Promise((resolve, reject) => {
        if (signal.aborted) {
            return reject(new Error("Operation aborted"));
        }

        const timeout = setTimeout(() => {
            try {
                resolve(condition(num));
            } catch (err) {
                reject(err);
            }
        }, 1000);

        signal.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject(new Error("Operation aborted"));
        });
    });
}

async function demoCases() {
    const controller = new AbortController();
    const signal = controller.signal;
    const emitter = new EventEmitter();

    emitter.on('found', (element) => {
        console.log(`Found element: ${element}`);
    });
    
    emitter.on('notFound', () => {
        console.log(`No element found matching the criteria.`);
    });


    try {
        const result1 = await asyncFind(asyncLargeDataset(), (num) => asyncFindCheck(num, (num) => num % 5 === 0, signal), 500, signal, emitter);
        console.log(result1);

        //controller.abort();

        const result2 = await asyncFind(asyncLargeDataset(), (num) => asyncFindCheck(num, (num) => num > 10, signal), 1000, signal, emitter);
        console.log(result2);
    } catch (err) {
        if (err.message === "Operation aborted") {
            console.log("The operation was canceled.");
        } else {
            console.error("Error occurred:", err);
        }
    }
}

demoCases();