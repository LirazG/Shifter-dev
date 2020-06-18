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


//smooth scroll - cross browser

export const smoothScroll = (element, targetParam) => {
    let start = null;

    let target;
    if (targetParam) {
        target = targetParam;
    } else {
        target = element && element ? element.getBoundingClientRect().top : 0;
    }

    const firstPos = window.pageYOffset || document.documentElement.scrollTop;
    let pos = 0;

    (function () {
        var browser = ['ms', 'moz', 'webkit', 'o'];

        for (let x = 0, length = browser.length; x < length && !window.requestAnimationFrame; x++) {
            window.requestAnimationFrame = window[browser[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[browser[x] + 'CancelAnimationFrame']
                || window[browser[x] + 'CancelRequestAnimationFrame'];
        }
    }());

    function showAnimation(timestamp) {

        if (!start) { start = timestamp || new Date().getTime(); } //get id of animation
        let elapsed = timestamp - start;
        let progress = elapsed / 600; // animation duration 600ms

        //ease in function
        const outQuad = function (t) {
            // return n * (2 - n);
            return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        };

        let easeInPercentage = +(outQuad(progress)).toFixed(2);
        // if target is 0 (back to top), the position is: current pos + (current pos * percentage of duration)
        // if target > 0 (not back to top), the positon is current pos + (target pos * percentage of duration)
        pos = (target === 0) ? (firstPos - (firstPos * easeInPercentage)) : (firstPos + (target * easeInPercentage));
        window.scrollTo(0, pos);
        // console.log(pos, target, firstPos, progress);

        if (target !== 0 && pos >= (firstPos + target) || target === 0 && pos <= 0) {
            cancelAnimationFrame(start);
            if (element) {
                element.setAttribute("tabindex", -1);
                element.focus();
            }
            pos = 0;
        } else {
            window.requestAnimationFrame(showAnimation);
        }

    }
    window.requestAnimationFrame(showAnimation);
}
