function asyncFind(array, useCallback, delay, callback) {
    let index = 0;

    function next() {
        if (index >= array.length) {
            return callback(null, undefined);
        }

        const element = array[index];
        index++;

        const startTime = Date.now();

        useCallback(element, (err, result) => {
            if (err) {
                return callback(err);
            }

            const TimeToWait = Date.now() - startTime;

            if (result) {
                if (TimeToWait < delay) {
                    setTimeout(() => callback(null, element), delay - TimeToWait);
                } else {
                    callback(null, element);
                }
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
    }, 1000);
}

function DemoCases() {

    asyncFind([10, 15, 20, 25, 30], (num, cb) => asyncFindCheck(num, (num) => num % 5 === 0, cb), 500, (err, result) => {
        if (err) {
            console.error("Error occurred:", err);
        } else {
            console.log(result);
        }
    });

    asyncFind([3, 7, 11, 19], (num, cb) => asyncFindCheck(num, (num) => num > 10, cb), 1000, (err, result) => {
        if (err) {
            console.error("Error occurred:", err);
        } else {
            console.log(result);
        }
    });

    asyncFind([1, 8, 16, 32, 64], (num, cb) => asyncFindCheck(num, (num) => Math.log2(num) % 1 === 0, cb), 2000, (err, result) => {
        if (err) {
            console.error("Error occurred:", err);
        } else {
            console.log(result);
        }
    });
}

DemoCases();