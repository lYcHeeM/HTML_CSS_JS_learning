function $(arg) {
    if (typeof arg == 'function') {
        window.onload = arg;
    } else if(typeof arg === 'string') {
        return document.getElementById(arg);
    } else if (typeof arg === 'object') {
        return arg;
    }
}

function getStyle(element, styleName) {
    if(!element.currentStyle) {
        return getComputedStyle(element)[styleName];
    } else {
        return element.currentStyle[styleName];
    }
}

/// 只适用于改变宽高、position和opacity
function doTransform(obj, attrName, targetValue, interval, completion) {
    // 为了避免大量的重名, 须用一定的手段区分不同的定时器, 如果重名, 会导致无法同时执行两个动画(后来的会提前return);
    var mSec = (new Date()).getMilliseconds();
    var timerName = 'transform_timer' + attrName + Math.abs(targetValue) + mSec;
    if (obj[timerName]) return;
    var currentAttrValue = parseFloat(getStyle(obj, attrName));
    var segmentCounts = 300;
    var stepLength = parseFloat(Math.abs(targetValue - currentAttrValue)/(interval*segmentCounts));
    if (attrName == 'right') {
        attrName = 'left';
        stepLength = -stepLength;
    }
    if (attrName == 'bottom') {
        attrName = 'top';
        stepLength = -stepLength;
    }
    if (targetValue === currentAttrValue) return;
    var isDirectionPositive = targetValue > currentAttrValue ? true : false;
    stepLength = isDirectionPositive ? stepLength : -stepLength;
    var isCompleted = false;
    obj[timerName] = setInterval(function () {
        // 实践发现, 需放在下一次定时器触发时判断是否完成, 此时obj的样式变化才算全部完成;
        // 如果直接在改变obj.style的时候停止定时器并通知回调, 这样会有一种现象:
        // 回调函数先触发, UI才得到人类视觉上的更新.
        if (isCompleted) {
            clearInterval(obj[timerName]);
            obj[timerName] = null;
            if (typeof completion === 'function') {
                completion();
            }
            return;
        }
        var nextAttrValue = parseFloat(getStyle(obj, attrName)) + stepLength;
        if ((nextAttrValue > targetValue && isDirectionPositive) || (nextAttrValue < targetValue && !isDirectionPositive)) {
            nextAttrValue = targetValue;
            isCompleted = true;
        }
        if(attrName === 'opacity') {
            obj.style[attrName] = nextAttrValue;
        } else if (attrName === 'left' || attrName === 'top' || attrName === 'bottom' || attrName === 'right' || attrName === 'width' || attrName === 'height') {
            obj.style[attrName] = nextAttrValue + 'px';
        }
    }, parseFloat(interval/segmentCounts));
}

/// direction: horizontal\vertical
function doShake(obj, direction, initialLeft, initialTop) {
    obj.style.left = initialLeft + 'px';
    obj.style.top = initialTop + 'px';

    clearInterval(obj.shake_timer);

    var movingValues = [];
    for(var i = 30; i -= 5; i > 0) {
        movingValues.push(i);
        movingValues.push(-i);
    }
    movingValues.push(0);

    var index = 0;
    obj.shake_timer = setInterval(function () {
        if(direction === 'vertical') {
            var currentTop = parseFloat(getStyle(obj, 'top'));
            obj.style.top = currentTop + movingValues[index] + 'px';
        } else {
            var currentLeft = parseFloat(getStyle(obj, 'left'));
            obj.style.left = currentLeft + movingValues[index] + 'px';
        }
        index += 1;
        if (index >= movingValues.length) {
            clearInterval(obj.shake_timer);
            obj.shake_timer = null;
        }
    }, 50);
}