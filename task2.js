function asyncFind(array, useCallback) {
    return new Promise((resolve, reject) => {
        let index = 0;

        function next() {
            if (index >= array.length) {
                return resolve(undefined);
            }

            const element = array[index];
            index++;

            useCallback(element, (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result) {
                    return resolve(element);
                } else {
                    next();
                }
            });
        }
        next();
    });
}