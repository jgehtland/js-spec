Matcher.addHelpers({
	be: function(expected) {
		return new Matcher.Be("===", expected);
	},
	equal: function(expected) {
		return new Matcher.Be("==", expected);
	},
	beLessThan: function(expected) {
		return new Matcher.Be("<", expected);
	},
	beLessOrEqualThan: function(expected) {
		return new Matcher.Be("<=", expected);
	},
	beGreaterThan: function(expected) {
		return new Matcher.Be(">", expected);
	},
	beGreaterOrEqualThan: function(expected) {
		return new Matcher.Be(">=", expected);
	}
});

Matcher.create("Be", {
	initialize: function(comparison, expected) {
		this.expected = expected;
		this.comparison = comparison;
	},
	matches: function(actual) {
		this.actual = actual;
		return this[this.comparison]();
	},
	"===": function() {
		return Object.isNumber(this.actual) && Object.isNumber(this.expected)
			? this.actual == this.expected
			: this.actual === this.expected;
	},
	"==": function() {
		return Object.isArray(this.expected) && Object.isArray(this.actual)
			? this.expected.size() == this.actual.size() && 
					this.expected.all(function(element, index) { return element == this.actual[index] }.bind(this))
			: this.actual == this.expected;
	},
	"<": function() {
		return this.actual < this.expected;
	},
	"<=": function() {
		return this.actual <= this.expected;
	},
	">": function() {
		return this.actual > this.expected;
	},
	">=": function() {
		return this.actual >= this.expected;
	},
	failureMessage: function(maybe_not) {
		return "expected " + Object.inspect(this.expected) + (maybe_not || " ") + "to be " + this.comparison.replace(/_/, " ") + 
			" " + Object.inspect(this.actual);
	},
	negativeFailureMessage: function() {
		return this.failureMessage(" not ");
	}
});