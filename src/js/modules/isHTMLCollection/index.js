/**
 * See if the passed object is of
 * type HTMLCollection.
 * @param  {mixed} obj Object to test against
 *                     [object HTMLCollection]
 * @return {Boolean}     Wether object is HTMLCollection or not
 */
module.exports = function (obj) {
	return Object.prototype.toString.call(obj) == '[object HTMLCollection]';
}