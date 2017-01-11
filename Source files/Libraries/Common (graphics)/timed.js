function timed(f) {
	var self = this;
	var timerType = window.performance ? performance : Date;
	return function() {
		var start = timerType.now();
		var result = f.apply(self, arguments);
		var diff = (timerType.now() - start);
		display('Duration: ' + Math.round(diff) + 'ms');
		return result;
	};
}
