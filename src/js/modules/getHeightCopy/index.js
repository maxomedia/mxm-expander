
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
	copy.style.width = parent.offsetWidth + 'px';

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