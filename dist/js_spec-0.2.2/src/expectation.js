Expectation = (function() {
	var should = function(matcher) {
		if (!matcher.matches(this)) 
			throw new Expectation.Unmet(matcher.failureMessage());
	};
	var shouldNot = function(matcher) {
		if (!Object.isFunction(matcher.negativeFailureMessage))
			throw Error("matcher " + Object.inspect(matcher) + " does not allow shouldNot");
		if (matcher.matches(this))
			throw new Expectation.Unmet(matcher.negativeFailureMessage());
	};
	
	var proxiedMethods = {
		should: function(object, matcher) {
			return should.call(object, matcher);
		},
		shouldNot: function(object, matcher) {
			return shouldNot.call(object, matcher);
		},
		should_not: function(object, matcher) {
			return shouldNot.call(object, matcher);
		}
	};
	Element.addMethods(proxiedMethods);
	//Event.extend(proxiedMethods); --> how do I extend Events? gotta pay more attention to the source
	
	var extend = function() {
		$A(arguments).each(function(object) {
			if (object.prototype) {
				object = object.prototype;
			}
			object.should = should;
			object.shouldNot = object.should_not = shouldNot;
		});
	};
	
	extend(Array, Date, Function, Number, RegExp, String);
	Class.create = Class.create.wrap(function() {
		var args = $A(arguments), proceed = args.shift(), klass = proceed.apply(Class, args);
		extend(klass);
		return klass;
	});
	
	return {
		extend: extend,
		Unmet: function(message) {
			this.name = "UnmetExpectation";
			this.message = message;
		}
	}
})();
