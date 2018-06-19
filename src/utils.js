function sleep(millis) {
    var date = Date.now();
    var curDate = null;
    do {
        curDate = Date.now();
    } while (curDate-date < millis);
}

/**
 * @param {number} b Beginning position
 * @param {number} e Ending position
 * @param {number} i Step
 * @param {number} m Steps
 */
function getTween(b, e, i, m) {
    return b + ((i/m) * (e-b));
}

/**
 * @param {number[]} first 
 * @param {number[]} second 
 */
function angleBetween(first, second) {
    const dx = first[1] - second[1],
          dy = first[0] - second[0];

    return Math.atan2(dy, dx);
}

function range(first, second) {
    const dx = Math.pow((first[0] - second[0]), 2),
          dy = Math.pow((first[1] - second[1]), 2);

    return Math.sqrt(dx + dy);
}

function inRange(first, second, distance) {
    return range(first, second) <= distance;
}

Math._round = Math.round;
Math.round = function(number, precision)
{
	precision = Math.abs(parseInt(precision)) || 0;
	var coefficient = Math.pow(10, precision);
	return Math._round(number*coefficient)/coefficient;
}