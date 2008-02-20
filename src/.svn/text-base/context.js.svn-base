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
		var element = new Element("div").insert(new Element("h3").update(this.name)), 
		    table = new Element("table", { cellspacing: 0, cellpadding: 0 });
		element.insert(table);
		this.specs.each(Element.insert.curry(table));
		return element;
	},
	expect: function(object) {
		Expectation.extend(object);
		return object;
	}
});

Context.Spec = Class.create((function() {
	var specId = 0;	
	return {
		initialize: function(name, spec) {
			this.name = name;
			this.id = 'spec_' + (++specId);
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
			return new Element("tr", { id: this.id }).insert(
				new Element("th", { scope: 'row' }).update(this.name)
			);
		}
	}
})());

Context.PendingSpec = function(spec) {
	this.name   = "Pending";
	this.message = spec;
}

Specs = Object.extend([], {
	report: "HTMLReport",
	register: Array.prototype.push,
	run: function(element) {
		var report = new Specs[Specs.report](element);
		this.each(function(context) {
			report.beforeEach && report.beforeEach(context);
			context.each(function(spec) {
				try {
					spec.run();
					report.pass(spec);
				} catch(e) {
					switch (e.name) {
						case "Pending":          
							return report.pending(spec);
						case "UnmetExpectation": 
							return report.fail(spec, e.message);
						default:
							return report.error(spec, e.message);
					}
				}
			});
			report.afterEach && report.afterEach(context);
		});
	},
	describe: function() {
		return this.invoke("describe").join("\n\n");
	}
});

Specs.HTMLReport = Class.create({
	initialize: function(element) {
		this.element = $(element) || $("spec_results") || this.createElement();
	},
	beforeEach: function(context) {
		this.element.insert(context);
	},
	pass: function(spec) {
		$(spec.id).addClassName("pass").insert({ top: this.label("passed") }).insert(new Element("td").update("&nbsp;"));
	},
	pending: function(spec) {
		$(spec.id).addClassName("pending").insert({ top: this.label("pending") }).insert(new Element("td").update("&nbsp;"));
	},
	fail: function(spec, message) {
		$(spec.id).addClassName("fail").insert({ top: this.label("failed") }).insert(new Element("td").update(message));
	},
	error: function(spec, message) {
		$(spec.id).addClassName("error").insert({ top: this.label("error") }).insert(new Element("td").update(message));
	},
	createElement: function() {
		var element = new Element("div");
		$(document.body).insert(element);
		return element;
	},
	label: function(text) {
		return new Element("td", { className: "label" }).update("[" + text + "]");
	}
});

Specs.ConsoleReport = Class.create({
	initialize: function() {
		this.passed = this.failed = this.pending = this.errors = 0;
		this.failureMessages = [];
		this.errorMessages = [];
	},
	beforeEach: function() {
		this.startTime = new Date().getTime();
	},
	afterEach: function() {
		var duration = new Date().getTime() - this.startTime;
		var total = this.passed + this.failed + this.pending + this.errors;
		if (this.failed) print("\n\nFailures:\n" + this.failureMessages.join("\n"));
		if (this.errors) print("\nErrors:\n" + this.errorMessages.join("\n"));
		
		var result = "\n";
		if (this.passed)  result += "#{passed} passed. ";
		if (this.pending) result += "#{pending} pending. ";
		if (this.failed)  result += "#{failed} failure" + (this.failed == 1 ? ". " : "s. ");
		if (this.errors)  result += "#{errors} error" + (this.errors == 1 ? ". " : "s. ");
		print(result.interpolate(this) + "\n");
		print("Run " + total + " examples in " + (duration / 1000) + "seconds.\n");
	},
	pass: function() {
		this.passed++;
		print(".");
	},
	pending: function(spec) {
		this.pending++;
		print("P");
	},
	fail: function(spec, message) {
		this.failed++;
		print("F");
		this.failureMessages.push("- '#{name}' with #{message}".interpolate({ name: spec.name, message: message }));
	},
	error: function(spec, message) {
		this.errors++;
		print("E");
		this.errorMessages.push("- '#{name}' with #{message}".interpolate({ name: spec.name, message: message }));
	}
});
