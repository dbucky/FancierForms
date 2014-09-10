;(function($, window, document, undefined) {
	if (!String.format) {
	    String.format = function(format) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        return format.replace(/{(\d+)}/g, function(match, number) {
	            return typeof args[number] != 'undefined' ? args[number] : match;
	        });
	    };
	}

	$.fn.extend({
		fancifySelect: function(options) {
	    	var plugin = {},
	    		fields = this,
	    		keys = {
	                LEFT: 37,
	                RIGHT: 39,
	                UP: 38,
	                DOWN: 40,
	                TAB: 9,
	                SPACE: 32,
	                ENTER: 13,
	                ESC: 27
	            },
	    		defaults = {
	    			// options go here
		    	},
		    	activeSelect;

		    function init() {
		    	plugin.settings = $.extend(true, {}, defaults, options);
		    }

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

		    function bindEvents() {
		    	// events affecting the native select
		    	$(document).on("focus", "select", function () {
		    		activeSelect = $(this);
		    		focus($(this));
		    	});

		    	$(document).on("blur", "select", function () {
		    		blur($(this));
		    	});

		    	$(document).on("change", "select", function (e) {
		    		syncChange($(this), e);
		    	});

		    	$(document).on("keydown", function (e) {
		    		if (e.which === keys.ESC) {
		    			closeAll();
		    		}
		    	});

		    	// events affecting the fancy select
		    	$(document).on("click", ".fancy.select .selected-value", function () {
		    		var _fancySelect = $(this).parent();

		    		if (_fancySelect.hasClass("open")) {
		    			close(_fancySelect);
		    		}
		    		else {
		    			open(_fancySelect);
		    		}
		    	});

		    	$(document).on("click", function (e) {
		    		if ($(e.target).parents(".fancy.select").length === 0) {
		    			closeAll();
		    		}
		    	});

		    	$(document).on("click", ".fancy.select li", function () {
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

		    function syncChange(_select, e) {
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

		    function closeAll() {
		    	$(".fancy.select").removeClass("open").children(".options").hide();
		    }

		    function changeSelectedValue(_selectedOption) {
		    	var _fancySelect = _selectedOption.parents(".fancy.select");
		    	_fancySelect.prev("select").val(_selectedOption.attr("data-value")).trigger("change");
		    }

		    init();

		    return fields.filter("select").each(function () {
	    		var _select = $(this);
	    		_select.addClass("hidden").after(constructMarkup(_select));
	    		bindEvents();
		    });
	    }
	});
})(jQuery, window, document);