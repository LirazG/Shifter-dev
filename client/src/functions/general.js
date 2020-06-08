//throttling function

export const throttling = (callback, limit, time) => {
    // monitor the count
    var calledCount = 0;

    // refresh the `calledCount` variable after the `time` has been passed
    setInterval(() => { calledCount = 0 }, time);

    // creating a closure that will be called
    return () => {
        // checking the limit (if limit is exceeded then do not call the passed function
        if (limit > calledCount) {
            /// increase the count
            calledCount++;
            callback();
        }
        else console.log('not calling because the limit has exceeded');
    }
}