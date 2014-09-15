;(function($, window, document, undefined) {

	var keys = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, TAB: 9, SPACE: 32, ENTER: 13, ESC: 27 },
		blurTimers = {};

	if (!String.format) {
	    String.format = function(format) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        return format.replace(/{(\d+)}/g, function(match, number) {
	            return typeof args[number] != 'undefined' ? args[number] : match;
	        });
	    };
	}

    function closeAll() {
    	$(".fancy.select").removeClass("open").children(".options").hide();
    }

	$(document).on("click", function (e) {
		if ($(e.target).parents(".fancy.select").length === 0) {
			closeAll();
		}
	});

	$.fn.extend({
		fancifySelect: function(options) {
	    	var defaults = {
		    		blurTimeout: 150
		    	},
		    	settings = $.extend(true, {}, defaults, options);

		    return this.filter("select").each(function () {
	    		var _select = $(this);
	    		// size attribute added to make Firefox play nice with onchange event
	    		// https://bugzilla.mozilla.org/show_bug.cgi?id=126379#c43
	    		_select.addClass("hidden").after(constructMarkup(_select)).attr("size", _select.find("option").size());
	    		bindEvents(_select);
		    });

		    function constructMarkup(_select) {
	    		var markup = String.format("<div class='fancy select{0}'>", _select.prop("disabled") ? " disabled" : ""),
	    			selectValue = _select.val(),
	    			_selectedOption = _select.find("[value='" + selectValue + "']");

	    		markup += String.format("<span class='selected-value' data-value='{0}'>{1}</span><ul class='options' style='display: none;'>", _selectedOption.val(), _selectedOption.text());

	    		_select.children().each(function () {
	    			switch (this.tagName.toLowerCase()) {
	    				case "option":
	    					markup += constructOptionMarkup($(this), selectValue);
	    					break;
	    				case "optgroup":
	    					var _group = $(this),
	    						groupLabel = _group.attr("label");

	    					markup += String.format("<li class='group{1}'><span class='group-label'>{0}</span><ul>", !groupLabel ? "&nbsp;" : groupLabel, _group.prop("disabled") ? " disabled" : "");

    						_group.children().each(function () {
	    						markup += constructOptionMarkup($(this), selectValue);
    						});

	    					markup += "</ul></li>"
	    					break;
	    			}
	    		});

	    		markup += "</ul></div>";
	    		return markup;
		    }

		    function constructOptionMarkup(_option, selectValue) {
		    	var optionValue = _option.val();
				return String.format("<li class='option{2}{3}' data-value='{0}'>{1}</li>", optionValue, _option.text(), optionValue === selectValue ? " selected" : "", _option.prop("disabled") ? " disabled": "");
		    }

		    function bindEvents(_select) {
		    	bindNativeEvents(_select);
		    	bindFancyEvents(_select.next(".fancy.select"));
		    }

		    function bindNativeEvents(_select) {
		    	_select.on("focus", function () {
		    		var __select = $(this),
		    			blurTimer = blurTimers[__select.attr("id")];

		    		if (typeof blurTimer === "undefined") {
		    			focus(__select);
		    		}
		    		else {
		    			clearTimeout(blurTimer);
		    		}
		    	});

		    	_select.on("blur", function () {
		    		var __select = $(this);
		    		
		    		blurTimers[__select.attr("id")] = setTimeout(function () {
		    			delete blurTimers[__select.attr("id")];
						blur(__select);
		    		}, settings.blurTimeout);
		    	});

		    	_select.on("change", function () {
		    		syncChange($(this));
		    	});

		    	_select.on("keydown", function (e) {
		    		if (e.which === keys.ESC || e.which === keys.ENTER) {
		    			close($(this).next(".fancy.select"));
		    		}
		    	});
		    }

		    function bindFancyEvents(_fancySelect) {
		    	_fancySelect.on("click", function () {
		    		var __fancySelect = $(this);
		    		if (!__fancySelect.hasClass("disabled")) {
			    		__fancySelect.prev("select").trigger("focus");
			    	}
		    	});

		    	_fancySelect.on("click", ".selected-value", function () {
		    		var __fancySelect = $(this).parent();

		    		if (!__fancySelect.hasClass("disabled")) {
			    		if (__fancySelect.hasClass("open")) {
			    			close(__fancySelect);
			    		}
			    		else {
			    			open(__fancySelect);
			    		}
			    	}
		    	});

		    	_fancySelect.on("click", ".option", function () {
		    		_selectedOption = $(this);

		    		if (!_selectedOption.hasClass("disabled") && _selectedOption.parents(".group.disabled").length === 0) {
		    			changeSelectedValue(_selectedOption);
		    			close(_selectedOption.parents(".fancy.select"));	
		    		}
		    	});
		    }

		    function focus(_select) {
		    	_select.next(".fancy.select").addClass("focused");
		    }

		    function blur(_select) {
		    	var _fancySelect = _select.next(".fancy.select");
		    	close(_fancySelect);
		    	_fancySelect.removeClass("focused");
		    }

		    function syncChange(_select) {
		    	var selectValue = _select.val(),
	    			_selectedOption = _select.find("option[value='" + selectValue + "']");

	    		_select.next(".fancy.select").children(".selected-value").text(_selectedOption.text()).attr("data-value", selectValue).next(".options").find(".option").removeClass("selected").filter("[data-value='" + selectValue + "']").addClass("selected");
		    }

		    function open(_fancySelect) {
	    		_fancySelect.addClass("open").children(".options").show();
		    }

		    function close(_fancySelect) {
		    	_fancySelect.removeClass("open").children(".options").hide();
		    }

		    function changeSelectedValue(_selectedOption) {
		    	_selectedOption.parents(".fancy.select").prev("select").val(_selectedOption.attr("data-value")).trigger("change");
		    }
	    },

	    fancifyRadio: function(options) {
	    	var defaults = {
	    			blurTimeout: 150
	    		},
	    		settings = $.extend(true, {}, defaults, options);

		    return this.filter("input:radio").each(function () {
	    		var _radio = $(this);
	    		_radio.addClass("hidden").after(constructMarkup(_radio));
		    	bindEvents(_radio);
		    });

		    function constructMarkup(_radio) {
	    		return String.format("<div class='fancy radio{2}' data-name='{0}' data-value='{1}'></div>", _radio.attr("name"), _radio.val(), _radio.prop("disabled") ? " disabled" : "");
		    }

		    function bindEvents(_radio) {
		    	bindNativeEvents(_radio);
		    	bindFancyEvents(_radio.next(".fancy.radio"));
		    }

		    function bindNativeEvents(_radio) {
		    	_radio.on("focus", function () {
		    		var __radio = $(this),
		    			blurTimer = blurTimers[__radio.attr("id")];

		    		if (typeof blurTimer === "undefined") {
		    			focus(__radio);
		    		}
		    		else {
		    			clearTimeout(blurTimer);
		    		}
		    	});

		    	_radio.on("blur", function () {
		    		var __radio = $(this);
		    		
		    		blurTimers[__radio.attr("id")] = setTimeout(function () {
		    			delete blurTimers[__radio.attr("id")];
						blur(__radio);
		    		}, settings.blurTimeout);
		    	});

		    	_radio.on("change", function () {
		    		syncChange($(this));
		    	});
		    }

		    function bindFancyEvents(_fancyRadio) {
		    	_fancyRadio.on("click", function () {
		    		var __fancyRadio = $(this);
		    		if (!__fancyRadio.hasClass("disabled")) {
			    		changeSelectedValue(__fancyRadio);
			    	}
		    	});
		    }

		    function focus(_radio) {
		    	_radio.next(".fancy.radio").addClass("focused");
		    }

		    function blur(_radio) {
		    	_radio.next(".fancy.radio").removeClass("focused");
		    }

		    function syncChange(_radio) {
		    	var group = _radio.attr("name");
		    	$(".fancy.radio[data-name='" + group + "']").removeClass("selected");
		    	_radio.next(".fancy.radio").addClass("selected").attr("data-name", group).attr("data-value", _radio.val());
		    }

		    function changeSelectedValue(_fancyRadio) {
		    	var group = _fancyRadio.attr("data-name"),
		    		_radio = _fancyRadio.prev("input:radio");
		    	_radio.trigger("focus");
		    	$("input:radio[name='" + group + "']").attr("checked", false);
		    	_radio.get(0).checked = true;
		    	_radio.trigger("change");
		    }
	    },

	    fancifyCheckbox: function(options) {
	    	var defaults = {
	    			blurTimeout: 150
	    		},
	    		settings = $.extend(true, {}, defaults, options);

		    return this.filter("input:checkbox").each(function () {
	    		var _checkbox = $(this);
	    		_checkbox.addClass("hidden").after(constructMarkup(_checkbox));
		    	bindEvents(_checkbox);
		    });

		    function constructMarkup(_checkbox) {
	    		return String.format("<div class='fancy checkbox{2}' data-name='{0}' data-value='{1}'></div>", _checkbox.attr("name"), _checkbox.val(), _checkbox.prop("disabled") ? " disabled" : "");
		    }

		    function bindEvents(_checkbox) {
		    	bindNativeEvents(_checkbox);
		    	bindFancyEvents(_checkbox.next(".fancy.checkbox"));
		    }

		    function bindNativeEvents(_checkbox) {
		    	_checkbox.on("focus", function () {
		    		var __checkbox = $(this),
		    			blurTimer = blurTimers[__checkbox.attr("id")];

		    		if (typeof blurTimer === "undefined") {
		    			focus(__checkbox);
		    		}
		    		else {
		    			clearTimeout(blurTimer);
		    		}
		    	});

		    	_checkbox.on("blur", function () {
		    		var __checkbox = $(this);
		    		
		    		blurTimers[__checkbox.attr("id")] = setTimeout(function () {
		    			delete blurTimers[__checkbox.attr("id")];
						blur(__checkbox);
		    		}, settings.blurTimeout);
		    	});

		    	_checkbox.on("change", function () {
		    		syncChange($(this));
		    	});
		    }

		    function bindFancyEvents(_fancyCheckbox) {
		    	_fancyCheckbox.on("click", function () {
		    		var __fancyCheckbox = $(this);
		    		if (!__fancyCheckbox.hasClass("disabled")) {
		    			changeSelectedValue(__fancyCheckbox);
		    		}
		    	});
		    }

		    function focus(_checkbox) {
		    	_checkbox.next(".fancy.checkbox").addClass("focused");
		    }

		    function blur(_checkbox) {
		    	_checkbox.next(".fancy.checkbox").removeClass("focused");
		    }

		    function syncChange(_checkbox) {
		    	var _fancyCheckbox = _checkbox.next(".fancy.checkbox");
		    	if (_checkbox.get(0).checked) {
		    		_fancyCheckbox.addClass("selected");
		    	}
		    	else {
		    		_fancyCheckbox.removeClass("selected");
		    	}
		    }

		    function changeSelectedValue(_fancyCheckbox) {
		    	var _checkbox = _fancyCheckbox.prev("input:checkbox"),
		    		domElement = _checkbox.get(0);
		    	_checkbox.trigger("focus");
		    	domElement.checked = !domElement.checked;
		    	_checkbox.trigger("change");
		    }
	    }
	});

})(jQuery, window, document);