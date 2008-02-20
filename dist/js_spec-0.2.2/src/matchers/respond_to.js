Matcher.addHelpers({
	respondTo: function() {
		return new Matcher.RespondTo($A(arguments));
	}
});

Matcher.create("RespondTo", {
	initialize: function(names) {
		this.names = names;
	},
	matches: function(actual) {
		this.actual = actual;
		this.nonResponsive = this.names.reject(Object.respondTo.curry(actual));
		return this.nonResponsive.size() == 0;
	},
	failureMessage: function() {
		return "expected target to respond to " + this.nonResponsive.join(", ");
	},
	negativeFailureMessage: function() {
		return "expected target not to respond to " + this.names.join(", ");
	}
});