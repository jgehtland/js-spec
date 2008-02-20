var Matcher = {
	create: function(name, methods) {
		this[name] = Class.create(methods);
		this[name].name = name;
		return this[name];
	},
	addHelpers: function(methods) {
		$H(methods).each(function(pair) {
			if (!Object.isFunction(pair[1]))
				pair[1] = methods[pair[1]];
			Matcher.Helpers[pair[0]] = pair[1];
			Matcher.Helpers[pair[0].underscore()] = pair[1];
		});
	},
	Helpers: {}
};

<%= include 'matchers/be.js',
            'matchers/be_close.js',
            'matchers/change.js',
						'matchers/have.js',
						'matchers/include.js',
						'matchers/match.js',
						'matchers/respond_to.js',
						'matchers/satisfy.js'
%>

