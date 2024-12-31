async function asyncFind(array, checkCondition, delay) {
    let index = 0;
    while (index < array.length) {
        const element = array[index];
        index++;

        const startTime = Date.now();

        try {
            const result = await checkCondition(element);
            const timeToWait = Date.now() - startTime;

            if (result) {
                if (timeToWait < delay) {
                    await new Promise(resolve => setTimeout(resolve, delay - timeToWait));
                }
                return element;
            }
        } catch (err) {
            throw err;
        }
    }
    return undefined;
}

function asyncFindCheck(num, condition) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(condition(num));
            } catch (err) {
                reject(err);
            }
        }, 1000);
    });
}