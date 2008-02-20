Matcher.addHelpers({
	match: function(expected) {
		return new Matcher.Match(expected);
	}
});

Matcher.create("Match", {
	initialize: function(expected) {
		this.expected = expected;
	},
	matches: function(actual) {
		this.actual = actual;
		return this.actual.match(this.expected);
	},
	failureMessage: function() {
		return this.message("");
	},
	negativeFailureMessage: function() {
		return this.message("not ")
	},
	message: function(maybe_not) {
		return "expected " + Object.inspect(this.actual) + " " + maybe_not + "to match " + Object.inspect(this.expected);
	}
});

