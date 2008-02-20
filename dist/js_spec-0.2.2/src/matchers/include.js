Matcher.addHelpers({
	include: function() {
		return new Matcher.Include(arguments);
	}
});

Matcher.create("Include", {
	initialize: function(expecteds) {
		this.expecteds = $A(expecteds);
	},
	matches: function(actual) {
		this.actual = actual;
		return this.expecteds.all(function(expected) { return actual.include(expected) });
	},
	failureMessage: function() {
		return this.message();
	},
	negativeFailureMessage: function() {
		return this.message("not ");
	},
	message: function(maybe_not) {
		return "expected #{actual} #{maybe_not}to include #{expecteds}".interpolate({
			maybe_not: maybe_not || "",
			actual:    this.actual.inspect(),
			expecteds: this.expecteds.map(Object.inspect).join(", ")
		});
	}
});

