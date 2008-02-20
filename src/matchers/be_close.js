Matcher.addHelpers({
	beClose: function(expected, delta) {
		return new Matcher.BeClose(expected, delta);
	}
});

Matcher.create("BeClose", {
	initialize: function(expected, delta) {
		this.expected = expected;
		this.delta = delta;
	},
	matches: function(target) {
		this.target = target;
		return (this.target - this.expected).abs() < this.delta;
	},
	failureMessage: function() {
		return "expected " + this.expected + " +/- (< " + this.delta + "), got " + this.target;
	},
	negativeFailureMessage: function() {
		return "expected " + this.expected + " not to be within " + this.delta + " of " + this.target;
	}
});

