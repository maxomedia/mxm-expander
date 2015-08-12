function getHeightCopy(parent) {
	var copy = parent.cloneNode(true);

	copy.style.visibility = 'hidden';
	copy.style.position = 'absolute';
	copy.style.height = 'auto';

	document.body.appendChild(copy);
	var height = copy.offsetHeight;
	document.body.removeChild(copy);

	return height;
}

module.exports = getHeightCopy;