Context = Class.create({
	initialize: function(name, specs) {
		this.name = name;
		this.filters = { beforeAll: [], beforeEach: [], afterEach: [], afterAll: [] };
		this.specs = [];
		(specs || Prototype.K).apply(this);
		Specs.register(this);
		this.running = null;
	},
	addFilter: function(type, filter) {
		this.filters[type.camelize()].push(filter);
	},
	before: function(type, filter) {
		if (arguments.length == 1)
			var filter = type, type = "each";
		this.addFilter("before-" + type, filter);
	},
	after: function(type, filter) {
		if (arguments.length == 1)
			var filter = type, type = "each";
		this.addFilter("after-" + type, filter);
	},
	it: function(description, spec) {
		this.specs.push(new Context.Spec(description, spec));
	},
	describe: function() {
		return this.name + ":\n" + this.specs.map(function(spec) { return "- " + spec[0] }).join("\n");
	},
	each: function(iterator, binding) {
		var sandbox = {};
		this.filters.beforeAll.invoke("apply", sandbox);
		this.specs.map(function(spec) {
			spec.compile(this.filters);
			spec.run = spec.run.curry(sandbox);
			return spec;
		}, this).each(iterator, binding);
		this.filters.afterAll.invoke("apply", sandbox);
	},
	toElement: function() {
		var list, element = new Element("div");
		element.insert(new Element("h3").update(this.name));
		element.insert(list = new Element("ul"));
		this.specs.each(Element.insert.curry(list));
		list.select("li").each(function(spec, index) { this.specs[index].id = spec.identify() }, this);
		return element;
	}
});

Context.Spec = Class.create({
	initialize: function(name, spec) {
		this.name = name;
		this.id = null;
		this.spec = spec;
		this.pending = !spec;
		this.compiled = false;
	},
	compile: function(filters) {
		if (!this.compiled && !this.pending) {
			this.spec = filters.beforeEach.concat(this.spec).concat(filters.afterEach);
			this.compiled = true;
		}
		return this;
	},
	run: function(sandbox) {
		if (this.pending)
			throw new Context.PendingSpec(this);
		this.spec.invoke("apply", sandbox);
	},
	toElement: function() {
		return new Element("li").update(this.name);
	}
});

Context.PendingSpec = function(spec) {
	this.name   = "Pending";
	this.message = spec;
}

Runner = Class.create({
	initialize: function(element) {
		this.element = $(element) || $("spec_results") || this.createElement();
	},
	run: function(context) {
		this.element.insert(context);
		context.each(function(spec) {
			try {
				spec.run();
				this.pass(spec);
			} catch(e) {
				switch (e.name) {
					case "Pending":          return this.pending(spec);
					case "UnmetExpectation": return this.fail(spec, e.message);
					default:                 return this.error(spec, e.message);
				}
			}
		}, this);
	},
	pass: function(spec) {
		$(spec.id).addClassName("pass").insert({ top: this.label("passed") });
	},
	pending: function(spec) {
		$(spec.id).addClassName("pending").insert({ top: this.label("pending") });
	},
	fail: function(spec, message) {
		$(spec.id).addClassName("fail").insert({ top: this.label("failed") }).insert("<br/>with: " + message);
	},
	error: function(spec, message) {
		$(spec.id).addClassName("error").insert({ top: this.label("error") }).insert("<br/>with: " + message);
	},
	createElement: function() {
		var element = new Element("div");
		$(document.body).insert(element);
		return element;
	},
	label: function(text) {
		return new Element("span", { className: "label" }).update("[" + text + "]");
	}
});

Specs = Object.extend([], {
	register: Array.prototype.push,
	run: function(element) {
		var runner = new Runner(element);
		this.each(runner.run.bind(runner));
	},
	describe: function() {
		return this.invoke("describe").join("\n\n");
	}
});

