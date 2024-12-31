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
