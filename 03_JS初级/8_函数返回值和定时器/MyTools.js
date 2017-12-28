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