# mxm-expander
Expand HTML elements with animations, or don't, I'm just a description.

## Compatibility/Dependencies
 - no `jQuery` needed
 - implements [`EventEmitter`](https://nodejs.org/api/events.html) from node
 - [`document.querySelector()`](http://caniuse.com/#feat=queryselector) needs to be supported (IE9+)

## Attention
Expanding things without `position: absolute/fixed;` is a massive performance issue, it causes a page reflow for every frame of the animation. Don't do it. I warned you. Something to read on this topic: http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/.

## Usage (globals)
Reference the CSS and the JS in your HTML (it is recommended that you bundle this files with your own assets).
```html
<html>
  <head>
    <link rel="stylesheet" href="some/node_modules/mxm-expander/dist/css/expander.css" />
  </head>
  <body>
    ...
    <script src="some/node_modules/mxm-expander/dist/js/expander.js"></script>
  </body>
</html>
```
The markup for your expander:
```html
<p>
  <a href="#" data-expander-toggler="demo1">Toggle demo 1</a>
</p>
<div id="demo-expander" data-expander-content="demo1">
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non, ex nulla! Esse architecto officia necessitatibus nihil voluptas harum magnam sint, sunt error! Cupiditate, et praesentium saepe ex culpa dolorum repudiandae.</p>
</div>
```
Initialize the expander with javascript:
```javascript
var htmlElement = document.getElementById('demo-expander');
var expander = new Expander(htmlElement);

expander.open();
```

To set animation duration or easing function, use CSS:
```CSS
 #demo-expander {
 
  transition-duration: 1s;
  transition-timing-function: ease-out;
  
  /* DO NOT DO THIS!! */
  /* Use the long-hand properties because there
   * is a bug on iOS when the transition property
   * is set constantly.
  */
  transition: height 1.5s ease-in-out; /* BAD */
 }
```

## Usage (CommonJS)
Use HTML markup as shown above. In your module:
```javascript
var Expander = require('mxm-expander');
var expander = new Expander();
var htmlElement = document.getElementById('demo-expander');

expander.initialize(htmlElement);
expander.open();
```

## Usage (AMD)
Use HTML markup as shown above. In your module:
```javascript
define('someModule', ['Expander'], function (Expander) {
  var htmlElement = document.getElementById('demo-expander');
  var expander = new Expander(htmlElement);
  
  expander.open();
});
```

## Properties
This is the expander object you get when you initialize an Expander:
```javascript
{
  "content":{}, // HTMLElement
  "id":"demo1",
  "groupID":false,
  "toggler":{
    "0":{} // HTMLElement
  },
  "state":"closed"
}
```
There are some internal properties that are not displayed here.

## Functions
| Name | Description | Return value |
|------|-------------|--------------|
| `expander.initialize(HTMLElement)` or `new Expander(HTMLElement)` | Initialize a new expander based on a HTMLElement | Expander instance |
| `expander.open()` | Opens the expander | |
| `expander.close()` | Closes the expander | |
| `expander.toggle()` | Toggles the expander | |
| `expander.on(event, handler)` | Registers an event listener (see below for a list of possible events | |
| `expander.once(event, handler)` | Registers an one time listener | |
| `expander.removeListener(handler)` | Remove an event listener | |
| `Expander.autoInitialize()` | Special function on the object constructor to automatically initialize every instance of [data-expander-content] found in the document | Associative array with every initialized expander `{'expanderID': {...}, 'otherExpanderID': {...}}` |

## Events
| Name | Description |
|------|-------------|
| opening | Triggers when the expanders opening animation starts |
| open | Triggers when the expanders opening animation has finished |
| closing | Triggers when the expanders closing animation starts |
| closed | Triggers when the expanders closing animation has finished |
