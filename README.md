# lightquery
Lightweight dom manipulation library (IE9+) - **3kb only**
```
npm i --save lightquery
```

## Usage:
Include before the closing body tag:
```
<script src="lightquery.js"></script>
```
or require it from the npm module
```
var $ = require('lightquery');
```

## API:
#### $()

This is the main selector and constructor for lightquery.
```
$(function)
$(selector)
$(node)
$(nodeList)
$(htmlString)
```
#### $.fn
You can add new methods to lightquery.
```js
$.fn // => lightquery.prototype
$.fn.myMethod = function(){ }; // Create custom method
```

### Display
#### $.addClass()
Add a class name to the selected elements.
```js
$(selector).addClass(class)
```
#### $.removeClass()
Remove the class name from the selected elements.
```js
$(selector).removeClass(class)
```
#### $.show()
Show the selected elements.
```js
$(selector).show()
```
#### $.hide()
Hide the selected elements.
```js
$(selector).hide()
```
#### $.append()
Append a child to the selected elements.
```js
$(selector).append(node)
```
#### $.remove()
Remove a child from the selected elements.
```js
$(selector).remove(node)
```

### HTML
#### $.val()
Get back the value of the first selected element.
```js
$(selector).val()
```
If called with a parameter, set the value to this for all selected elements.
```js
$(selector).val(value)
```
#### $.text()
Get back the innerText of the first selected element.
```js
$(selector).text()
```
If called with a parameter, set the innerText to this for all selected elements.
```js
$(selector).text(string)
```
#### $.html()
Set the innerHTML for all selected elements.
```js
$(selector).html(string)
```

### Data
#### $.data()
Get the data-property value for the first selected element.
```js
$(selector).data(property)
```
#### $.attr()
Set the selected elements data with the provided value.
```js
$(selector).attr(property, value)
```

### Event
#### $.on()
Register an event listener on the selected target elements.
```js
$(selector).on(eventName, targets, handler)
```

#### $.trigger()
Trigger an event on the selected elements.
```js
$(selector).attr(eventName)
```

### Utilities
#### $.each()
Iterates through the selected elements and calls the callback on each.
```js
$(selector).each(callback)
```
#### $.first()
Calls the callback on the first selected element.
```js
$(selector).first(callback)
```
#### $.firstData()
Calls the callback on the first selected element and returns the callback's result.
```js
$(selector).firstData(callback)
```
#### $.eq()
Returns the element from the selected elements on the given position.
```js
$(selector).eq(position)
```

## Credit
Aliaksandr Astashenkau - http://dfsq.info/site/read/writing-your-own-jquery
