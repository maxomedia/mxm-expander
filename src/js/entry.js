
/**
 * Accordion/expander functionality supporting CSS transitions,
 * jQuery fallback or no animation at all.
 * @author Philipp Gfeller, Maxomedia AG
 * @param  {Object} root    Application root, like window in browser environments
 * @param  {Object} factory jQuery instance, imported with available
 *                          module loader (CommonJS, AMD, globals).
 * @return {undefined}
 */
(function (root, factory) {

    // Universal Module Definition
    // https://github.com/umdjs/umd
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Expander = factory();
    }
}(this, function () {
    return require('./Expander');
}));