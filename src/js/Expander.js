var Emitter = require('events').EventEmitter;
var merge = require('merge');
var isArray = require('is-array');
var getHeight = require('./getHeight');

function Expander () {
	this.content;
	this.toggler;
	this.group;
	this.id;
	this.state;
}

Expander.prototype = merge(Expander.prototype, Emitter.prototype);

console.log(Expander.prototype);

/**
 * Set the state, update all elements and emit a status event.
 * Internal function.
 * @param {String} state The new state
 * @return {String} The current state
 */
Expander.prototype._setState = function (state) {
	if (!this.content) throw 'Expander: content is ' + this.content;
	if (!this.toggler) throw 'Expander: toggler is ' + this.toggler;

	this.state = state;
	this.content.setAttribute('data-expander-state', state);
	this.toggler.setAttribute('data-expander-state', state);
	this._emitStatus();

	return this.state;
}

/**
 * Broadcast the current state.
 * Internal function.
 */
Expander.prototype._emitStatus = function () {
	if (!this.state) throw 'Expander is stateless due to incorrect initialization.';

	this.emit(this.state);
}

Expander.prototype.open = function () {
	if (isArray(this.content)) throw 'Expander: content must be a single element.';

	var height = getHeight(this.content.children);
	
}

var test = document.querySelector('#test');
console.log(getHeight(test.children));
module.exports = Expander;