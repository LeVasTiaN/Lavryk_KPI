async function* asyncLargeDataset() {
    const largeData = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    for (let i = 0; i < largeData.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        yield largeData[i];
    }
}

async function asyncFind(iterator, useCallback, delay, signal) {
    for await (const element of iterator) {
        if (signal.aborted) {
            throw new Error("Operation aborted");
        }

        try {
            const result = await useCallback(element, signal);

            if (result) {
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

    try {

        const result1 = await asyncFind(asyncLargeDataset(), (num) => asyncFindCheck(num, (num) => num % 5 === 0, signal), 500, signal);
        console.log(result1);

        //controller.abort();

        const result2 = await asyncFind(asyncLargeDataset(), (num) => asyncFindCheck(num, (num) => num > 10, signal), 1000, signal);
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
