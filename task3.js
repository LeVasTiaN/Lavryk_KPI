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
