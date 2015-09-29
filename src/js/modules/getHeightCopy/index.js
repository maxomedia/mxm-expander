
/**
 * Decide which strategy to use depending
 * on the number of children.
 * @param  {Object} parent HTML Element
 * @return {Number}        Height in pixel
 */
function getHeight (parent) {
	if (parent.children.length > 1) {
		return getHeightMultipleChildren(parent);
	} else if (parent.children.length == 1) {
		return getHeightSingleChild(parent);
	} else {
		return 0;
	}
}


/**
 * Get height if there are multiple children.
 * In this case, the height needs to be taken
 * from the parent.
 * @param  {Object} parent HTML Element
 * @return {Number}        Height in pixel
 */
function getHeightMultipleChildren (parent) {

	// Set height to auto, get value
	// and reset to previous value
	parent.style.height = 'auto';
	var height = parent.offsetHeight;
	parent.style.height = '';

	// Force rendering
	parent.offsetHeight;

	return height;
}

/**
 * Get height if there is only one child
 * @param  {Object} parent HTML Element
 * @return {Number}        Height in pixel
 */
function getHeightSingleChild (parent) {

	// Return the height of just the single
	// element
	return parent.children[0].offsetHeight;
}

module.exports = getHeight;