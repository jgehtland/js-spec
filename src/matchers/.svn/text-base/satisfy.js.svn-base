Matcher.addHelpers({
	satisfy: function(block) {
		return new Matcher.Satisfy(block);
	}
});

Matcher.create("Satisfy", {
	initialize: function(block) {
		this.block = block;
	},
	matches: function(actual) {
		this.actual = actual;
		return this.block(actual);
	},
	failureMessage: function() {
		return "expected " + Object.inspect(this.actual) + " to satisfy the block";
	},
	negativeFailureMessage: function() {
		return "expected " + Object.inspect(this.actual) + " not to satisfy the block";
	}
});

