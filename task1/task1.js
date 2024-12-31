const numbers = [1, 2, 3, 4, 5];

function asyncFind(array, useCallback, callback) {
    let index = 0;

    function next() {
        if (index >= array.length) {
            return callback(null, undefined);
        }

        const element = array[index];
        index++;

        useCallback(element, (err, result) => {
            if (err) {
                return callback(err);
            }

            if (result) {
                return callback(null, element);
            } else {
                next();
            }
        });
    }

    next();
}

function asyncFindCheck(num, condition, callback) {
    setTimeout(() => {
        callback(null, condition(num));
    }, Math.random() * 1000);
}
const isEven = (num) => num < 4;


asyncFind(numbers, (num, callback) => asyncFindCheck(num, isEven, callback), (err, result) => {
    if (err) {
        console.error("Error occurred:", err);
    } else {
        console.log(result);
    }
});