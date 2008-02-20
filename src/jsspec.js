<%= include 'HEADER' %>

var JsSpec = {
	Version: '<%= SPEC_VERSION %>'
};

Object.extend(Object, {
	respondTo: function(object, name) {
		return Object.isFunction(object[name]);
	},
	isNumber: function(object) {
		return typeof object == "number" || object instanceof Number;
	}
})

<%= include 'matcher.js',
						'context.js',
            'expectation.js' %>

Spec = Matcher.Helpers;
Spec.describe = function(contextName, map) {
	new Context(contextName, map);
};
