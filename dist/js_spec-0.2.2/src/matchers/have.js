Matcher.addHelpers({
	haveExactly: function(expected, collection) {
		var args = $A(arguments).slice(2);
		return new Matcher.Have(expected, collection, "exactly", args);
	},
	haveAtLeast: function(expected, collection) {
		var args = $A(arguments).slice(2);
		return new Matcher.Have(expected, collection, "at_least", args);
	},
	haveAtMost: function(expected, collection) {
		var args = $A(arguments).slice(2);
		return new Matcher.Have(expected, collection, "at_most", args);
	},
	have: 'haveExactly'
});

Matcher.create("Have", {
	initialize: function(expected, collection, relativity, args) {
		this.expected = expected == "no" ? 0 : expected;
		this.collection = collection;
		this.relativity = relativity || "exactly";
		this.args = args || [];
	},
	matches: function(actual) {
		var actuals = this.actualsFor(actual);
		this.actual = Object.isFunction(actuals.size) ? actuals.size() : actuals.length;
		switch (this.relativity) {
			case "exactly":  return this.expected == this.actual;
			case "at_least": return this.expected <= this.actual;
			case "at_most":  return this.expected >= this.actual;
		}
	},
	failureMessage: function(relation) {
		return "expected #{relativity} #{collection}, got #{actual}".interpolate({
			relativity: this.readableRelativity() + this.expected,
			collection: this.collection,
			actual:     this.actual
		});
	},
	negativeFailureMessage: function() {
		switch (this.relativity) {
			case 'exactly':  return "expected target not to have #{expected} #{collection}, got #{actual}".interpolate(this);
			case 'at_least': return "instead of 'should not have at least' use 'should have at most'";
			case 'at_most':  return "instead of 'should not have at most' use 'should have at least'"
		}
	},
	readableRelativity: function() {
		return (this.relativity.replace(/exactly/, "").replace(/_/, " ") + " ").replace(/^\s+/, '');
	},
	actualsFor: function(actual) {
		if (!Object.respondTo(actual, this.collection) && this.collection == "elements") {
			return actual;
		} else if (Object.respondTo(actual, this.collection)) {
			return actual[this.collection].apply(actual, this.args);
		} else {
			return actual[this.collection];
		}
	}
});
