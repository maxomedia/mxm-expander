(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Expander"] = factory();
	else
		root["Expander"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Expander = __webpack_require__(1);

	var demoExpander = document.querySelector('[data-expander-content]');
	var demo1 = new Expander();

	var expanders = Expander.autoInitialize();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define(factory);
		else if(typeof exports === 'object')
			exports["Expander"] = factory();
		else
			root["Expander"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		var merge            = __webpack_require__(2);
		var Emitter          = __webpack_require__(4).EventEmitter;
		var transitionend    = __webpack_require__(5);
		var getHeightCopy    = __webpack_require__(6);

		// Check if browser has transitionend event
		// In IE9, returnal is an empty object
		var hasTransitionEnd = Object.prototype.toString.call(transitionend) == '[object String]';
		var expanders = [];

		// The exportable object
		function Expander (element) {
			this.content;
			this.toggler;
			this.group;
			this.hasGroup;
			this.id;
			this.state;
			this.groupID;

			if (element) { return this.initialize(element); }
		}

		Expander.prototype = merge(Expander.prototype, Emitter.prototype);

		/**
		 * Set the state, update all elements and emit a status event.
		 * Internal function.
		 * @param {String} state The new state
		 * @return {String} The current state
		 */
		Expander.prototype._setState = function (state, emit) {
			if (!this.content) throw 'Expander: content is ' + this.content;
			if (!this.toggler) throw 'Expander: toggler is ' + this.toggler;
			if (!emit) emit = true;

			// Save state on instance
			this.state = state;

			// Set state reference for CSS rules
			this.content.setAttribute('data-expander-state', state);
			for (var i = 0; i < this.toggler.length; i++) {
				this.toggler[i].setAttribute('data-expander-state', state);
			}

			// Handle accessibility aria attribute
			if (state == 'open') {
				this._setAria('true');
			} else if (state == 'closed') {
				this._setAria('false');
			}

			// Emit status on instance
			if (emit) this._emitStatus(state);

			// Return the state
			return this.state;
		}

		/**
		 * Set the aria-expanded attribute for
		 * better accessibility of the expander
		 * @param {String} state State according to
		 *                       http://www.w3.org/TR/wai-aria/states_and_properties#aria-expanded
		 */
		Expander.prototype._setAria = function (state) {
			//if (state != true || state != false || state != undefined) throw 'Aria state of ' + state + ' not allowed.';
			
			this.content.setAttribute('aria-expanded', state);
		}

		/**
		 * Broadcast the current state.
		 * Internal function.
		 */
		Expander.prototype._emitStatus = function () {
			this.emit(this.state);
		}

		/**
		 * Reset inline style height and the state. Remove
		 * transitionend event listener
		 * Internal function
		 */
		Expander.prototype._openedEventHandler = function () {
			if (this._boundEvent) {
				this.content.removeEventListener(transitionend, this._boundEvent);
			}
			this.content.style.height = '';
			this._setState('open');
		}

		/**
		 * Set the correct state. Remove transitionend event
		 * listener
		 * Internal function
		 */
		Expander.prototype._closedEventHandler = function (e) {
			if (this._boundEvent) {
				this.content.removeEventListener(transitionend, this._boundEvent);
			}
			this.content.style.height = '';
			this._setState('closed');
		}

		/**
		 * Open the expander
		 * Public function
		 */
		Expander.prototype.open = function () {

			// Let animation finish before animating again
			if (this.state != 'closed') return;

			// Get the height of the contents children
			var height = getHeightCopy(this.content);

			// Close the open content if this is part of
			// a group
			if (this.groupID) {
				for (var i = 0; i < expanders.length; i++) {
					var expander = expanders[i];
					if (expander.groupID || expander != this && expander.groupID == this.groupID && "open" == expander.state) {
						expander.close();
					}
				}
			}

			// Set the state
			this._setState('opening');

			// Set the height
			this.content.style.height = height + 'px';

			// See if there is a transition duration, if not,
			// directly call open event handler
			var transitionDuration = parseFloat(getComputedStyle(this.content)['transitionDuration']);

			if (hasTransitionEnd && transitionDuration > 0) {

				// Register transitionend handler
				this._boundEvent = this._openedEventHandler.bind(this);
				this.content.addEventListener(transitionend, this._boundEvent);
			} else {

				// Fallback transitionend trigger
				this._openedEventHandler.apply(this);
			}
		}

		/**
		 * Close the expander.
		 * Public function
		 */
		Expander.prototype.close = function () {

			// Let animation finish before animating again
			if (this.state != 'open') return;


			// Get the height directly from content
			this.content.style.height = this.content.offsetHeight + 'px';

			// Trigger page rendering to prevent display bugs
			this.content.offsetHeight;

			// Set state
			this._setState('closing');

			// Set height
			this.content.style.height = 0;

			// See if there is a transition duration, if not,
			// directly call close event handler
			var transitionDuration = parseFloat(getComputedStyle(this.content)['transitionDuration']);

			if (hasTransitionEnd && transitionDuration > 0) {

				// Register transitionend event handler
				this._boundEvent = this._closedEventHandler.bind(this);
				this.content.addEventListener(transitionend, this._boundEvent);
			} else {

				// Fallback transitionend trigger
				this._closedEventHandler.apply(this);
			}
		}

		/**
		 * Toggle the expander, based on current state
		 * Public function
		 */
		Expander.prototype.toggle = function (e) {

			// Prevent following links or submitting
			// forms
			if (e && e.preventDefault) e.preventDefault();

			// Call close or open, depending on current state
			if (this.state == 'closed') {
				this.open.apply(this);
			} else if (this.state == 'open') {
				this.close.apply(this);
			} else {

				// State is invalid or the expander is 
				// currently animating -> do nothing.
				//console.log('Expander: Tried to toggle, but state was: ' + this.state);
			}
		}

		/**
		 * Initialize an expander instance based on 
		 * a content element
		 * Public function
		 * @param  {DOMElement} element The content of the expander
		 * @return {Object}         The expander instance
		 */
		Expander.prototype.initialize = function (element) {

			// Get all info about the element
			var states = ['open', 'closed'];
			var id = element.getAttribute('data-expander-content');
			var state = element.getAttribute('data-expander-state');
			var groupID = element.getAttribute('data-expander-group');

			if (!id) throw 'Expander content with invalid data-expander-content attribute';

			// Set properties
			this.content = element;
			this.id = id;
			this.groupID = (groupID) ? groupID : false;
			this.toggler = document.querySelectorAll('[data-expander-toggler~="' + id + '"]');

			// Set correct state and take already present state into account
			if (states.indexOf(state) >= 0) {
				this._setState(state, false);
			} else {
				this._setState('closed', false);
			}

			// Add event listeners on the togglers
			for (var i = 0; i < this.toggler.length; i++) {
				this.toggler[i].addEventListener('click', this.toggle.bind(this));
			}

			// Add instance to collection. This is required to handle grouping
			expanders.push(this);

			// Return expander instance
			return this;
		}

		/**
		 * Initialize all expanders based on the data-expander-content
		 * attribute
		 * @return {Array} All initialized instances
		 */
		Expander.autoInitialize = function () {

			var expanders = document.querySelectorAll('[data-expander-content]');
			var instances = [];

			for (var i = 0; i < expanders.length; i++) {
				instances.push(new Expander(expanders[i]));
			}

			return instances;
		}

		module.exports = Expander;

	/***/ },
	/* 1 */,
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {

		/* WEBPACK VAR INJECTION */(function(module) {/*!
		 * @name JavaScript/NodeJS Merge v1.2.0
		 * @author yeikos
		 * @repository https://github.com/yeikos/js.merge

		 * Copyright 2014 yeikos - MIT license
		 * https://raw.github.com/yeikos/js.merge/master/LICENSE
		 */

		;(function(isNode) {

			/**
			 * Merge one or more objects 
			 * @param bool? clone
			 * @param mixed,... arguments
			 * @return object
			 */

			var Public = function(clone) {

				return merge(clone === true, false, arguments);

			}, publicName = 'merge';

			/**
			 * Merge two or more objects recursively 
			 * @param bool? clone
			 * @param mixed,... arguments
			 * @return object
			 */

			Public.recursive = function(clone) {

				return merge(clone === true, true, arguments);

			};

			/**
			 * Clone the input removing any reference
			 * @param mixed input
			 * @return mixed
			 */

			Public.clone = function(input) {

				var output = input,
					type = typeOf(input),
					index, size;

				if (type === 'array') {

					output = [];
					size = input.length;

					for (index=0;index<size;++index)

						output[index] = Public.clone(input[index]);

				} else if (type === 'object') {

					output = {};

					for (index in input)

						output[index] = Public.clone(input[index]);

				}

				return output;

			};

			/**
			 * Merge two objects recursively
			 * @param mixed input
			 * @param mixed extend
			 * @return mixed
			 */

			function merge_recursive(base, extend) {

				if (typeOf(base) !== 'object')

					return extend;

				for (var key in extend) {

					if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

						base[key] = merge_recursive(base[key], extend[key]);

					} else {

						base[key] = extend[key];

					}

				}

				return base;

			}

			/**
			 * Merge two or more objects
			 * @param bool clone
			 * @param bool recursive
			 * @param array argv
			 * @return object
			 */

			function merge(clone, recursive, argv) {

				var result = argv[0],
					size = argv.length;

				if (clone || typeOf(result) !== 'object')

					result = {};

				for (var index=0;index<size;++index) {

					var item = argv[index],

						type = typeOf(item);

					if (type !== 'object') continue;

					for (var key in item) {

						var sitem = clone ? Public.clone(item[key]) : item[key];

						if (recursive) {

							result[key] = merge_recursive(result[key], sitem);

						} else {

							result[key] = sitem;

						}

					}

				}

				return result;

			}

			/**
			 * Get type of variable
			 * @param mixed input
			 * @return string
			 *
			 * @see http://jsperf.com/typeofvar
			 */

			function typeOf(input) {

				return ({}).toString.call(input).slice(8, -1).toLowerCase();

			}

			if (isNode) {

				module.exports = Public;

			} else {

				window[publicName] = Public;

			}

		})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
		/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

	/***/ },
	/* 3 */
	/***/ function(module, exports) {

		module.exports = function(module) {
			if(!module.webpackPolyfill) {
				module.deprecate = function() {};
				module.paths = [];
				// module.parent = undefined by default
				module.children = [];
				module.webpackPolyfill = 1;
			}
			return module;
		}


	/***/ },
	/* 4 */
	/***/ function(module, exports) {

		// Copyright Joyent, Inc. and other Node contributors.
		//
		// Permission is hereby granted, free of charge, to any person obtaining a
		// copy of this software and associated documentation files (the
		// "Software"), to deal in the Software without restriction, including
		// without limitation the rights to use, copy, modify, merge, publish,
		// distribute, sublicense, and/or sell copies of the Software, and to permit
		// persons to whom the Software is furnished to do so, subject to the
		// following conditions:
		//
		// The above copyright notice and this permission notice shall be included
		// in all copies or substantial portions of the Software.
		//
		// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
		// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
		// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
		// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
		// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
		// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
		// USE OR OTHER DEALINGS IN THE SOFTWARE.

		function EventEmitter() {
		  this._events = this._events || {};
		  this._maxListeners = this._maxListeners || undefined;
		}
		module.exports = EventEmitter;

		// Backwards-compat with node 0.10.x
		EventEmitter.EventEmitter = EventEmitter;

		EventEmitter.prototype._events = undefined;
		EventEmitter.prototype._maxListeners = undefined;

		// By default EventEmitters will print a warning if more than 10 listeners are
		// added to it. This is a useful default which helps finding memory leaks.
		EventEmitter.defaultMaxListeners = 10;

		// Obviously not all Emitters should be limited to 10. This function allows
		// that to be increased. Set to zero for unlimited.
		EventEmitter.prototype.setMaxListeners = function(n) {
		  if (!isNumber(n) || n < 0 || isNaN(n))
		    throw TypeError('n must be a positive number');
		  this._maxListeners = n;
		  return this;
		};

		EventEmitter.prototype.emit = function(type) {
		  var er, handler, len, args, i, listeners;

		  if (!this._events)
		    this._events = {};

		  // If there is no 'error' event listener then throw.
		  if (type === 'error') {
		    if (!this._events.error ||
		        (isObject(this._events.error) && !this._events.error.length)) {
		      er = arguments[1];
		      if (er instanceof Error) {
		        throw er; // Unhandled 'error' event
		      }
		      throw TypeError('Uncaught, unspecified "error" event.');
		    }
		  }

		  handler = this._events[type];

		  if (isUndefined(handler))
		    return false;

		  if (isFunction(handler)) {
		    switch (arguments.length) {
		      // fast cases
		      case 1:
		        handler.call(this);
		        break;
		      case 2:
		        handler.call(this, arguments[1]);
		        break;
		      case 3:
		        handler.call(this, arguments[1], arguments[2]);
		        break;
		      // slower
		      default:
		        len = arguments.length;
		        args = new Array(len - 1);
		        for (i = 1; i < len; i++)
		          args[i - 1] = arguments[i];
		        handler.apply(this, args);
		    }
		  } else if (isObject(handler)) {
		    len = arguments.length;
		    args = new Array(len - 1);
		    for (i = 1; i < len; i++)
		      args[i - 1] = arguments[i];

		    listeners = handler.slice();
		    len = listeners.length;
		    for (i = 0; i < len; i++)
		      listeners[i].apply(this, args);
		  }

		  return true;
		};

		EventEmitter.prototype.addListener = function(type, listener) {
		  var m;

		  if (!isFunction(listener))
		    throw TypeError('listener must be a function');

		  if (!this._events)
		    this._events = {};

		  // To avoid recursion in the case that type === "newListener"! Before
		  // adding it to the listeners, first emit "newListener".
		  if (this._events.newListener)
		    this.emit('newListener', type,
		              isFunction(listener.listener) ?
		              listener.listener : listener);

		  if (!this._events[type])
		    // Optimize the case of one listener. Don't need the extra array object.
		    this._events[type] = listener;
		  else if (isObject(this._events[type]))
		    // If we've already got an array, just append.
		    this._events[type].push(listener);
		  else
		    // Adding the second element, need to change to array.
		    this._events[type] = [this._events[type], listener];

		  // Check for listener leak
		  if (isObject(this._events[type]) && !this._events[type].warned) {
		    var m;
		    if (!isUndefined(this._maxListeners)) {
		      m = this._maxListeners;
		    } else {
		      m = EventEmitter.defaultMaxListeners;
		    }

		    if (m && m > 0 && this._events[type].length > m) {
		      this._events[type].warned = true;
		      console.error('(node) warning: possible EventEmitter memory ' +
		                    'leak detected. %d listeners added. ' +
		                    'Use emitter.setMaxListeners() to increase limit.',
		                    this._events[type].length);
		      if (typeof console.trace === 'function') {
		        // not supported in IE 10
		        console.trace();
		      }
		    }
		  }

		  return this;
		};

		EventEmitter.prototype.on = EventEmitter.prototype.addListener;

		EventEmitter.prototype.once = function(type, listener) {
		  if (!isFunction(listener))
		    throw TypeError('listener must be a function');

		  var fired = false;

		  function g() {
		    this.removeListener(type, g);

		    if (!fired) {
		      fired = true;
		      listener.apply(this, arguments);
		    }
		  }

		  g.listener = listener;
		  this.on(type, g);

		  return this;
		};

		// emits a 'removeListener' event iff the listener was removed
		EventEmitter.prototype.removeListener = function(type, listener) {
		  var list, position, length, i;

		  if (!isFunction(listener))
		    throw TypeError('listener must be a function');

		  if (!this._events || !this._events[type])
		    return this;

		  list = this._events[type];
		  length = list.length;
		  position = -1;

		  if (list === listener ||
		      (isFunction(list.listener) && list.listener === listener)) {
		    delete this._events[type];
		    if (this._events.removeListener)
		      this.emit('removeListener', type, listener);

		  } else if (isObject(list)) {
		    for (i = length; i-- > 0;) {
		      if (list[i] === listener ||
		          (list[i].listener && list[i].listener === listener)) {
		        position = i;
		        break;
		      }
		    }

		    if (position < 0)
		      return this;

		    if (list.length === 1) {
		      list.length = 0;
		      delete this._events[type];
		    } else {
		      list.splice(position, 1);
		    }

		    if (this._events.removeListener)
		      this.emit('removeListener', type, listener);
		  }

		  return this;
		};

		EventEmitter.prototype.removeAllListeners = function(type) {
		  var key, listeners;

		  if (!this._events)
		    return this;

		  // not listening for removeListener, no need to emit
		  if (!this._events.removeListener) {
		    if (arguments.length === 0)
		      this._events = {};
		    else if (this._events[type])
		      delete this._events[type];
		    return this;
		  }

		  // emit removeListener for all listeners on all events
		  if (arguments.length === 0) {
		    for (key in this._events) {
		      if (key === 'removeListener') continue;
		      this.removeAllListeners(key);
		    }
		    this.removeAllListeners('removeListener');
		    this._events = {};
		    return this;
		  }

		  listeners = this._events[type];

		  if (isFunction(listeners)) {
		    this.removeListener(type, listeners);
		  } else {
		    // LIFO order
		    while (listeners.length)
		      this.removeListener(type, listeners[listeners.length - 1]);
		  }
		  delete this._events[type];

		  return this;
		};

		EventEmitter.prototype.listeners = function(type) {
		  var ret;
		  if (!this._events || !this._events[type])
		    ret = [];
		  else if (isFunction(this._events[type]))
		    ret = [this._events[type]];
		  else
		    ret = this._events[type].slice();
		  return ret;
		};

		EventEmitter.listenerCount = function(emitter, type) {
		  var ret;
		  if (!emitter._events || !emitter._events[type])
		    ret = 0;
		  else if (isFunction(emitter._events[type]))
		    ret = 1;
		  else
		    ret = emitter._events[type].length;
		  return ret;
		};

		function isFunction(arg) {
		  return typeof arg === 'function';
		}

		function isNumber(arg) {
		  return typeof arg === 'number';
		}

		function isObject(arg) {
		  return typeof arg === 'object' && arg !== null;
		}

		function isUndefined(arg) {
		  return arg === void 0;
		}


	/***/ },
	/* 5 */
	/***/ function(module, exports) {

		/**
		 * Transition-end mapping
		 */

		var map = {
		  'WebkitTransition' : 'webkitTransitionEnd',
		  'MozTransition' : 'transitionend',
		  'OTransition' : 'oTransitionEnd',
		  'msTransition' : 'MSTransitionEnd',
		  'transition' : 'transitionend'
		};

		/**
		 * Expose `transitionend`
		 */

		var el = document.createElement('p');

		for (var transition in map) {
		  if (null != el.style[transition]) {
		    module.exports = map[transition];
		    break;
		  }
		}


	/***/ },
	/* 6 */
	/***/ function(module, exports) {

		
		/**
		 * Get the height of all children of 
		 * specified element by copying it,
		 * appending it to the page, read height,
		 * and remove it.
		 * @param  {DOMElement} parent A single DOM element
		 * @return {Number}        The height in pixels
		 */
		function getHeightCopy(parent) {
			var copy = parent.cloneNode(true);

			// Make sure the copied element does
			// not affect any other element on the
			// page.
			copy.style.visibility = 'hidden';
			copy.style.position = 'absolute';
			copy.style.height = 'auto';

			// Reset data-expander-state, so contents are
			// not hidden by the expander state closed
			// CSS rule
			copy.setAttribute('data-expander-state', '');

			// Append element to body, get height, remove it
			document.body.appendChild(copy);
			var height = copy.offsetHeight;
			document.body.removeChild(copy);

			// Return height as a number
			return height;
		}

		module.exports = getHeightCopy;

	/***/ }
	/******/ ])
	});
	;

/***/ }
/******/ ])
});
;