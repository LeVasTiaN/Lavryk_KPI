async function asyncFind(array, callback) {
    for (const e of array) {
        const result = await callback(e);
        if (result) {
            return e;
        }
    }
}
asyncFind(numbers, async (e) => e > 2)
    .then((result) => console.log(result))
