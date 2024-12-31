const numbers = [1, 2, 3, 4, 5];

function asyncFind(array, callback) {

    function processNext(index) {
        if (index >= array.length) {
            return callback(undefined);
        }

        const e = array[index];

        callback(e, function(result) {
            if (result) {
                return callback(e);
            }
            processNext(index + 1);
        });
    }
    processNext(0);
}

