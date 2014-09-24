;(function($, Object, Array, undefined) {

	$.extend({
		// inspired by http://oli.me.uk/2013/06/01/prototypical-inheritance-done-right/
		inherit: function (derived, base, derivedExtrasAndOverrides) {
			derived.prototype = new base();
	    	derived.prototype.constructor = derived;
	    	$.extend(derived.prototype, derivedExtrasAndOverrides);
		},
		fancyOverrides: function (overrides) {
			for (var type in overrides) {
				switch (type) {
					case "FancyCheckbox":
						$.extend(FancyCheckbox.prototype, overrides[type]);
						break;
					case "FancyRadio":
						$.extend(FancyRadio.prototype, overrides[type]);
						break;
					case "FancySelect":
						$.extend(FancySelect.prototype, overrides[type]);
						break;
				}
			}
		}
	});

	var formatString = function (string) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        return string.replace(/{(\d+)}/g, function (match, number) {
	            return args[number] !== undefined ? args[number] : match;
	        });
		},
		FancyBase = function (element) {
			this.el = element;
		},
		FancyCheckbox = function (element) {
			FancyBase.call(this, element);
			this.type = "checkbox";
		},
		FancyRadio = function (element) {
			FancyBase.call(this, element);
			this.type = "radio";
		},
		FancySelect = function (element) {
			FancyBase.call(this, element);
			this.type = "select";
		};

	FancyBase.prototype = {
		init: function () {
			var _this = this;
			_this.fancify();
			_this.el.addClass("hidden").after(_this.fel);
			_this.bindEvents();
		},
		fancify: function () {
			var _this = this;
			_this.fel = $($.parseHTML(formatString("<div class='fancy {0}{1}{2}'></div>", _this.type, _this.isDisabled() ? " disabled" : "", _this.isSelected() ? " selected" : "")));
		},
		isSelected: function () {
			return this.el.is(":checked");
		},
		isDisabled: function () {
			return this.el.prop("disabled");
		},
		focus: function () {
			this.fel.addClass("focused");
		},
		blur: function () {
			this.fel.removeClass("focused");
		},
		syncChange: function () {
			var _this = this;
	    	_this.isSelected() ? _this.fel.addClass("selected") : _this.fel.removeClass("selected");
	    },
	    changeValue: function () {
	    	var _this = this;
	    	if (!_this.isDisabled()) {
		    	var domElement = _this.el.get(0);
		    	_this.el.trigger("focus");
		    	domElement.checked = !domElement.checked;
		    	_this.el.trigger("change");
		    }
	    },
	    bindEvents: function () {
	    	this.nativeEvents();
	    	this.fancyEvents();
	    },
	    nativeEvents: function () {
	    	var _this = this;

	    	_this.el.on("focus", function () {
	    		_this.blurTimer === undefined ? _this.focus() : clearTimeout(_this.blurTimer);
	    	});

	    	_this.el.on("blur", function () {
	    		_this.blurTimer = setTimeout(function () {
	    			delete _this.blurTimer;
					_this.blur();
	    		}, 150);
	    	});

	    	_this.el.on("change", function () {
	    		_this.syncChange();
	    	});
	    },
	    fancyEvents: function () {
	    	var _this = this;

	    	_this.fel.on("click", function () {
    			_this.changeValue();
	    	});
	    }
	};

	$.inherit(FancyCheckbox, FancyBase);
	$.inherit(FancyRadio, FancyBase, {
		getGroup: function () {
			return $(formatString("input:radio[name='{0}']", this.el.attr("name")));
		},
		syncChange: function () {
			this.getGroup().next().removeClass("selected");
			this.fel.addClass("selected");
		},
		changeValue: function () {
			var _this = this;
			if (!_this.isDisabled()) {
				_this.el.trigger("focus");
				_this.getGroup().attr("checked", false);
				_this.el.get(0).checked = true;
				_this.el.trigger("change");
			}
		}
	});
	$.inherit(FancySelect, FancyBase, {
		init: function () {
			var _this = this;
			_this.fancify();
			// size attribute added to make Firefox play nice with onchange event
    		// https://bugzilla.mozilla.org/show_bug.cgi?id=126379#c43
			_this.el.addClass("hidden").after(_this.fel).attr("size", _this.el.find("option").size());
			_this.bindEvents();
		},
		fancify: function () {
			var _this = this,
				markup = formatString("<div class='fancy {0}{1}'>", _this.type, _this.isDisabled() ? " disabled" : "");

			markup += formatString("<span class='selected-value'>{0}</span><ul class='options'>", _this.el.find(formatString("option[value='{0}']", _this.el.val())).text());

			_this.el.children().each(function () {
				switch (this.tagName.toLowerCase()) {
					case "option":
						markup += _this.getOption($(this));
						break;
					case "optgroup":
						var group = $(this),
							groupLabel = group.attr("label");

						markup += formatString("<li class='group{0}'><span class='group-label'>{1}</span><ul>", group.prop("disabled") ? " disabled" : "", !groupLabel ? "&nbsp;" : groupLabel);

						group.children().each(function () {
							markup += _this.getOption($(this));
						});

						markup += "</ul></li>"
						break;
				}
			});

			markup += "</ul></div>";

			_this.fel = $($.parseHTML(markup));
		},
		getOption: function (option) {
			return formatString("<li class='option{0}{1}'>{2}</li>", option.prop("disabled") ? " disabled": "", option.val() === this.el.val() ? " selected" : "", option.text());
		},
		isOpen: function () {
			return this.fel.hasClass("open");
		},
		blur: function () {
			this.close();
			this.fel.removeClass("focused");
		},
		syncChange: function () {
			var _this = this,
				text = _this.el.find(formatString("option[value='{0}']", _this.el.val())).text();
			
			_this.fel.children(".selected-value").text(text);
			_this.fel.find(".option").removeClass("selected").filter(formatString(":contains('{0}')", text)).addClass("selected");
		},
		changeValue: function (value) {
			this.el.val(value).trigger("change");
		},
		open: function () {
			this.fel.addClass("open");
		},
		close: function () {
			this.fel.removeClass("open");
		},
		fancyEvents: function () {
			var _this = this;

			_this.el.on("keydown", function (e) {
				// ENTER = 13, ESC = 27
				if (e.which === 13 || e.which === 27) {
					_this.close();
				}
			});

			_this.fel.on("click", function () {
				if (!_this.isDisabled()) {
		    		_this.el.trigger("focus");
		    	}
			});

			_this.fel.on("click", ".selected-value", function () {
				if (!_this.isDisabled()) {
		    		_this.isOpen() ? _this.close() : _this.open();
		    	}
			});

			_this.fel.on("click", ".option", function () {
				var selectedOption = $(this);

				if (!selectedOption.hasClass("disabled") && selectedOption.parents(".group.disabled").length === 0) {
					_this.changeValue(_this.el.find(formatString("option:contains('{0}')", selectedOption.text())).val());
					_this.close();
				}
			});
		}
	});

	$.fn.extend({
	    fancifyCheckbox: function () {
	    	return this.filter("input:checkbox").each(function () {
	    		(new FancyCheckbox($(this))).init();
		    });
	    },
	    fancifyRadio: function () {
	    	return this.filter("input:radio").each(function () {
	    		(new FancyRadio($(this))).init();
		    });
	    },
	    fancifySelect: function () {
	    	return this.filter("select").each(function () {
	    		(new FancySelect($(this))).init();
		    });
	    }
	});

	function closeAll() {
    	$(".fancy.select").removeClass("open");
    }

	$(document).on("click", function (e) {
		if ($(e.target).parents(".fancy.select").length === 0) {
			closeAll();
		}
	});

})(jQuery, Object, Array);