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
function doTransform(obj, attrName, targetValue, velocity, stepLength, completion) {
    if (obj.move_timer) return;
    if (attrName == 'right') {
        attrName = 'left';
        stepLength = -stepLength;
    }
    if (attrName == 'bottom') {
        attrName = 'top';
        stepLength = -stepLength;
    }
    var currentAttrValue = parseFloat(getStyle(oDiv, attrName));
    if (targetValue === currentAttrValue) return;
    var isDirectionPositive = targetValue > currentAttrValue ? true : false;
    stepLength = isDirectionPositive ? stepLength : -stepLength;
    var isCompleted = false;
    obj.move_timer = setInterval(function () {
        // 实践发现, 需放在下一次定时器触发时判断是否完成, 此时obj的样式变化才算全部完成;
        // 如果直接在改变oDiv.style的时候停止定时器并通知回调, 这样会有一种现象:
        // 回调函数先触发, UI才得到人类视觉上的更新.
        if (isCompleted) {
            clearInterval(obj.move_timer);
            obj.move_timer = null;
            if (typeof completion === 'function') {
                completion();
            }
            return;
        }
        var nextAttrValue = parseFloat(getStyle(oDiv, attrName)) + stepLength;
        if ((nextAttrValue > targetValue && isDirectionPositive) || (nextAttrValue < targetValue && !isDirectionPositive)) {
            nextAttrValue = targetValue;
            isCompleted = true;
        }
        if(attrName === 'opacity') {
            oDiv.style[attrName] = nextAttrValue;
        } else if (attrName === 'left' || attrName === 'top' || attrName === 'bottom' || attrName === 'right' || attrName === 'width' || attrName === 'height') {
            oDiv.style[attrName] = nextAttrValue + 'px';
        }
    }, velocity ? velocity : 30);
}