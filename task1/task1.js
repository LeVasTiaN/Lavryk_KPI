const numbers = [1, 2, 3, 4, 5]

async function asyncFind(array, cond, callback) {
    for (const e of array) {
        const result = await callback(e);
        if (result) {
            return e;
        }
    }
    return undefined;
}

asyncFind(numbers, 6, async (e) => e >= 1).then((result) => console.log(result))
