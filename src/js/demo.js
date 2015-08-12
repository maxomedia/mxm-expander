var Expander = require('./Expander');

var demoExpander = document.querySelector('[data-expander-content]');
var demo1 = new Expander();

//console.log(demo1.initialize(demoExpander));
//
var expanders = Expander.autoInitialize();

for (var i = 0; i < expanders.length; i++) {
	expanders[i].on('open', function () {
		console.log('open ' + this.id);
	});
}

window.setInterval(function () {
	expanders[0].toggle();
	expanders[1].toggle();
}, 3000);