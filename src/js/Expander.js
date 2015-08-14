var merge            = require('merge');
var Emitter          = require('events').EventEmitter;
var transitionend    = require('transitionend-property');
var isHTMLCollection = require('./modules/isHTMLCollection');
var getHeightCopy    = require('./modules/getHeightCopy');

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