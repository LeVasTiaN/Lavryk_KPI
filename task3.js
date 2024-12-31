async function asyncFind(array, checkCondition, delay, signal) {
    const promises = array.map(async (element) => {

        if (signal.aborted) {
            throw new Error("Operation aborted");
        }

        try {
            const result = await checkCondition(element, signal);

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

        return undefined;
    });

    const results = await Promise.all(promises);

    return results.find(result => result !== undefined) || undefined;
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
        const result1 = await asyncFind([10, 15, 20, 25, 30], (num) => asyncFindCheck(num, (num) => num % 5 === 0, signal), 500, signal);
        console.log(result1);

        controller.abort();

        const result2 = await asyncFind([3, 7, 11, 19], (num) => asyncFindCheck(num, (num) => num > 10, signal), 1000, signal);
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
