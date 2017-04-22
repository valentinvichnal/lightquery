// lightquery.js
// $ is alias for lightquery

var environment = {
  browser: typeof window !== "undefined"
};

// lightquery constructor
function lightquery(selector) {
  if (!(this instanceof lightquery)) {
    return new lightquery(selector);
  }

  if (typeof selector === 'function') {
    return handleDOMReady(selector);
  }

  // Save selector
  this.selector = selector;
  // Number of elements in collection
  this.length = 0;
  // Nodes collection array
  this.nodes = [];

  // HTMLElements and NodeLists are wrapped in nodes array
  if (selector instanceof HTMLElement || selector instanceof NodeList || selector instanceof HTMLDocument) {
    this.nodes = selector.length > 1 ? [].slice.call(selector) : [selector];
  }
  else if (typeof selector === 'string') {
    if (selector[0] === '<' && selector[selector.length - 1] === ">") {
      // Create DOM elements
      this.nodes = [createNode(selector)];
    }
    else {
      // Query DOM
      this.nodes = [].slice.call(document.querySelectorAll(selector));
    }
  }

  if (this.nodes.length) {
    this.length = this.nodes.length;
    for (var i = 0; i < this.nodes.length; i++) {
      this[i] = this.nodes[i];
    }
  }
}

function createNode(html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  return div.firstChild;
}

// Methods
lightquery.fn = lightquery.prototype;

lightquery.fn.each = function (callback) {
  for (var i = 0; i < this.length; i++) {
    callback.call(this[i], this, i);
  }
  return this;
};

lightquery.fn.first = function (callback) {
  if (this.length > 0) {
    callback.call(this[0], this, 0);
  }
  return this;
};

lightquery.fn.firstData = function (callback) {
  if (this.length > 0) {
    return callback.call(this[0], this, 0);
  }
};

lightquery.fn.eq = function (position) {
  if (this.length > position) {
    return lightquery(this[position]);
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
    return this.length && this[0].innerText;
  }
  return this.each(function () {
    this.innerText = str;
  });
};

lightquery.fn.val = function (value) {
  if (value === undefined) {
    return this.length && this[0].value;
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
  return this.firstData(function () {
    return this.dataset[property];
  });
};

lightquery.fn.attr = function (property, newValue) {
  if (newValue) {
    return this.each(function () {
      this.setAttribute(property, newValue);
    });
  }
  return this.firstData(function () {
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

if (environment.browser) {
  (function (window, undefined) {
    // Handle DOMContentLoaded event
    var domReadyStack = [];

    function handleDOMReady(fn) {
      return document.readyState === 'complete' ? fn.call(document) : domReadyStack.push(fn);
    }

    document.addEventListener('DOMContentLoaded', function onDOMReady() {
      document.removeEventListener('DOMContentLoaded', onDOMReady);
      while (domReadyStack.length) {
        domReadyStack.shift().call(document);
      }
    });

    // Shim for Matches
    HTMLElement.prototype.matches =
      HTMLElement.prototype.matches ||
      HTMLElement.prototype.matchesSelector ||
      HTMLElement.prototype.webkitMatchesSelector ||
      HTMLElement.prototype.mozMatchesSelector ||
      HTMLElement.prototype.msMatchesSelector ||
      HTMLElement.prototype.oMatchesSelector;

    window.lightquery = window.$ = lightquery;

  })(window);
}
else {
  module.exports = lightquery;
}
