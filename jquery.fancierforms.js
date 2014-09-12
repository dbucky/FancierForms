;(function($, window, document, undefined) {

	if (!String.format) {
	    String.format = function(format) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        return format.replace(/{(\d+)}/g, function(match, number) {
	            return typeof args[number] != 'undefined' ? args[number] : match;
	        });
	    };
	}

	var keys = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, TAB: 9, SPACE: 32, ENTER: 13, ESC: 27 },
		blurTimers = {};

    // global event handler and function for fancy selects
	$(document).on("click", function (e) {
		if ($(e.target).parents(".fancy.select").length === 0) {
			closeAll();
		}
	});

    function closeAll() {
    	$(".fancy.select").removeClass("open").children(".options").hide();
    }

	$.fn.extend({
		fancifySelect: function(options) {
	    	var defaults = {
	    			// options go here
		    		blurTimeout: 150
		    	},
		    	settings = $.extend(true, {}, defaults, options);

		    return this.filter("select").each(function () {
	    		var _select = $(this);
	    		_select.addClass("hidden").after(constructMarkup(_select));
	    		bindEvents(_select);
		    });

		    function constructMarkup(_select) {
	    		var markup = "<div class='fancy select'>",
	    			selectValue = _select.val(),
	    			_selectedOption = _select.children("[value='" + selectValue + "']");

	    		markup += String.format("<span class='selected-value' data-value='{0}'>{1}</span><ul class='options' style='display: none;'>", _selectedOption.val(), _selectedOption.text());

	    		_select.children().each(function () {
	    			var _option = $(this),
	    				optionValue = _option.val();

	    			markup += String.format("<li{2} data-value='{0}'>{1}</li>", _option.val(), _option.text(), optionValue === selectValue ? " class='selected'" : "");
	    		});

	    		markup += "</ul></div>";
	    		return markup;
		    }

		    function bindEvents(_select) {
		    	bindNativeEvents(_select);
		    	bindFancyEvents(_select.next(".fancy.select"));
		    }

		    function bindNativeEvents(_select) {
		    	_select.on("focus", function () {
		    		//console.log("select#" + $(this).attr("id") + " is focused");
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
		    		//console.log("select#" + $(this).attr("id") + " is blurred");
		    		var __select = $(this);
		    		
		    		blurTimers[__select.attr("id")] = setTimeout(function () {
		    			delete blurTimers[__select.attr("id")];
						blur(__select);
		    		}, settings.blurTimeout);
		    	});

		    	_select.on("change", function () {
		    		//console.log("select#" + $(this).attr("id") + " is changed");
		    		syncChange($(this));
		    	});

		    	_select.on("keydown", function (e) {
		    		if (e.which === keys.ESC) {
		    			closeAll();
		    		}
		    	});
		    }

		    function bindFancyEvents(_fancySelect) {
		    	_fancySelect.on("click", ".selected-value", function () {
		    		//console.log("fancy#" + $(this).parent().prev().attr("id") + " clicked");
		    		var __fancySelect = $(this).parent();

		    		if (__fancySelect.hasClass("open")) {
		    			close(__fancySelect);
		    		}
		    		else {
		    			open(__fancySelect);
		    		}
		    	});

		    	_fancySelect.on("click", "li", function () {
		    		_selectedOption = $(this);
		    		changeSelectedValue(_selectedOption);
		    		close(_selectedOption.parents(".fancy.select"));
		    	});
		    }

		    function focus(_select) {
		    	_select.next(".fancy.select").addClass("focused");
		    }

		    function blur(_select) {
		    	_select.next(".fancy.select").removeClass("focused");
		    }

		    function syncChange(_select) {
		    	var selectValue = _select.val(),
	    			_selectedOption = _select.children("[value='" + selectValue + "']");

	    		_select.next(".fancy.select").children(".selected-value").text(_selectedOption.text()).attr("data-value", selectValue).next(".options").children().removeClass("selected").filter("[data-value='" + selectValue + "']").addClass("selected");
		    }

		    function open(_fancySelect) {
		    	closeAll();
	    		_fancySelect.addClass("open").children(".options").show();
	    		_fancySelect.prev("select").trigger("focus");
		    }

		    function close(_fancySelect) {
		    	_fancySelect.removeClass("open").children(".options").hide();
		    	_fancySelect.prev("select").trigger("focus");
		    }

		    function changeSelectedValue(_selectedOption) {
		    	_selectedOption.parents(".fancy.select").prev("select").val(_selectedOption.attr("data-value")).trigger("change");
		    }
	    },

	    fancifyRadio: function(options) {
	    	var defaults = {
	    			// options go here
	    			blurTimeout: 150
	    		},
	    		settings = $.extend(true, {}, defaults, options);

		    return this.filter("input:radio").each(function () {
	    		var _radio = $(this);
	    		_radio.addClass("hidden").after(constructMarkup(_radio));
		    	bindEvents(_radio);
		    });

		    function constructMarkup(_radio) {
	    		return String.format("<div class='fancy radio' data-name='{0}' data-value='{1}'></div>", _radio.attr("name"), _radio.val());
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
		    		changeSelectedValue($(this));
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
	    			// options go here
	    			blurTimeout: 150
	    		},
	    		settings = $.extend(true, {}, defaults, options);

		    return this.filter("input:checkbox").each(function () {
	    		var _checkbox = $(this);
	    		_checkbox.addClass("hidden").after(constructMarkup(_checkbox));
		    	bindEvents(_checkbox);
		    });

		    function constructMarkup(_checkbox) {
	    		return String.format("<div class='fancy checkbox' data-name='{0}' data-value='{1}'></div>", _checkbox.attr("name"), _checkbox.val());
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
		    		changeSelectedValue($(this));
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