// lightquery.js
// $ is alias for lightquery

var environment = {
  browser: typeof window !== "undefined"
};

var FUNCTION_STACK = [];

// #################################################################### lightquery constructor
function lightquery(selector) {
  if (!(this instanceof lightquery)) { return new lightquery(selector); }
  if (typeof selector === 'function') { return runFunction(selector); }

  this.selector = selector; // Save selector
  this.length = 0; // Number of elements in collection
  this.nodes = []; // Nodes collection array

  // HTMLElements and NodeLists are wrapped in nodes array
  if (selector instanceof HTMLElement || selector instanceof NodeList || selector instanceof HTMLDocument) {
    this.nodes = selector.length > 1 ? [].slice.call(selector) : [selector];
  }
  else if (typeof selector === 'string') {
    if (selector[0] === '<' && selector[selector.length - 1] === ">") {
      this.nodes = [createNode(selector)]; // Create DOM elements
    }
    else {
      this.nodes = [].slice.call(document.querySelectorAll(selector)); // Query DOM
    }
  }
  this.length = this.nodes.length;
}

function runFunction(fn) {
  document.addEventListener('DOMContentLoaded', function onDOMReady() {
    document.removeEventListener('DOMContentLoaded', onDOMReady);
    while (FUNCTION_STACK.length) {
      FUNCTION_STACK.shift().call(document);
    }
  });

  return document.readyState === 'complete' ? fn.call(document) : FUNCTION_STACK.push(fn);
}

function createNode(html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  return div.firstChild;
}

// #################################################################### lightquery methods
lightquery.fn = lightquery.prototype;

lightquery.fn.each = function (callback) {
  for (var i = 0; i < this.length; i++) {
    callback.call(this.nodes[i], this, i);
  }
  return this;
};

lightquery.fn.first = function () {
  if (this.length > 0) {
    return lightquery(this.nodes[0]);
  }
};

lightquery.fn.eq = function (position) {
  if (this.length > position) {
    return lightquery(this.nodes[position]);
  }
};

lightquery.fn.firstCallback = function (callback) {
  if (this.length > 0) {
    callback.call(this.nodes[0], this, 0);
  }
  return this;
};

lightquery.fn.firstCallbackResult = function (callback) {
  if (this.length > 0) {
    return callback.call(this.nodes[0], this, 0);
  }
};

lightquery.fn.addClass = function (classes) {
  return this.each(function () {
    this.className += ' ' + classes;
  });
};

lightquery.fn.removeClass = function (className) {
  return this.each(function () {
    this.className = this.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
  });
};

lightquery.fn.show = function () {
  return this.each(function () {
    this.style.display = 'block';
  });
};

lightquery.fn.hide = function () {
  return this.each(function () {
    this.style.display = 'none';
  });
};

lightquery.fn.append = function (element) {
  return this.each(function () {
    this.appendChild(element[0]);
  });
};

lightquery.fn.remove = function () {
  return this.each(function () {
    this.parentNode.removeChild(this);
  });
};

lightquery.fn.text = function (str) {
  if (str === undefined) {
    return this.length && this.nodes[0].innerText;
  }
  return this.each(function () {
    this.innerText = str;
  });
};

lightquery.fn.val = function (value) {
  if (value === undefined) {
    return this.length && this.nodes[0].value;
  }
  return this.each(function () {
    this.value = value;
  });
};

lightquery.fn.html = function (str) {
  return this.each(function () {
    this.innerHTML = str;
  });
};

lightquery.fn.data = function (property) {
  return this.firstCallbackResult(function () {
    return this.dataset[property];
  });
};

lightquery.fn.attr = function (property, newValue) {
  if (newValue) {
    return this.each(function () {
      this.setAttribute(property, newValue);
    });
  }
  return this.firstCallbackResult(function () {
    return this.getAttribute(property);
  });
};

lightquery.fn.on = function (eventName, targets, handler) {
  return this.each(function () {
    document.addEventListener(eventName, function (event) {
      var t = event.target;
      while (t && t !== this) {
        if (t.matches(targets)) {
          handler.call(t, event);
        }
        t = t.parentNode;
      }
    });
  });
};

lightquery.fn.trigger = function (eventName) {
  var event = document.createEvent('HTMLEvents');
  event.initEvent(eventName, true, false);
  return this.each(function () {
    this.dispatchEvent(event);
  });
};

// #################################################################### Export - Based on environment
if (environment.browser) {
  (function (window, undefined) {
    // ONLY FOR OLD BROWSERS
    // Shim for Matches
    HTMLElement.prototype.matches =
      HTMLElement.prototype.matches ||
      HTMLElement.prototype.matchesSelector ||
      HTMLElement.prototype.webkitMatchesSelector ||
      HTMLElement.prototype.mozMatchesSelector ||
      HTMLElement.prototype.msMatchesSelector ||
      HTMLElement.prototype.oMatchesSelector;

    window.$ = window.lightquery = lightquery;

  })(window);
}
else {
  module.exports = lightquery;
}
