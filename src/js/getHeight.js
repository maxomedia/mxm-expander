var isArray = require('is-array');

var isHTMLCollection = function (obj) {
	return Object.prototype.toString.call(obj) == '[object HTMLCollection]';
}

var computeHeight = function (element) {
	var styles = getComputedStyle(element);
	var margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
	return Math.ceil(element.offsetHeight + margin);
}

module.exports = function (elements) {
	console.log(elements);
	if (!isHTMLCollection(elements)) throw 'Expander: content.children is (not an array): ' + elements;
	
	var height = 0;

	for (var i = 0; i < elements.length; i++) {
		height += computeHeight(elements[i]);
	}

	return height;
}