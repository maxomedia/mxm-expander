
/**
 * Get the height of the 
 * specified element by shortly
 * displaying it, read height,
 * and hide it again.
 * @param  {DOMElement} parent A single DOM element
 * @return {Number}        The height in pixels
 */
function getHeightCopy (parent) {

	// Set height to auto, get value
	// and reset to previous value
	parent.style.height = 'auto';
	var height = parent.offsetHeight;
	parent.style.height = '';

	// Force rendering
	parent.offsetHeight;

	return height;
}

module.exports = getHeightCopy;