async function asyncFind(array, checkCondition, delay) {
    const promises = array.map(async (element) => {
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
        return undefined;
    });

    const results = await Promise.all(promises);

    return results.find(result => result !== undefined) || undefined;
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

async function demoCases() {
    try {
        const result1 = await asyncFind([10, 15, 20, 25, 30], (num) => asyncFindCheck(num, (num) => num % 5 === 0), 500);
        console.log(result1);

        const result2 = await asyncFind([3, 7, 11, 19], (num) => asyncFindCheck(num, (num) => num > 10), 1000);
        console.log(result2);

        const result3 = await asyncFind([1, 8, 16, 32, 64], (num) => asyncFindCheck(num, (num) => Math.log2(num) % 1 === 0), 2000);
        console.log(result3);
    } catch (err) {
        console.error("Error occurred:", err);
    }
}

demoCases();
