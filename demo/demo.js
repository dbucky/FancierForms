$(function() {
	// $.fancyOverrides({
	// 	FancyCheckbox: {
	// 		init: function () {
	// 			console.log("FancyCheckbox init function overriden");
	// 		}
	// 	},
	// 	FancyRadio: {
	// 		init: function () {
	// 			this.newFunction();
	// 		},
	// 		newFunction: function () {
	// 			console.log("FancyRadio newFunction function introduced");
	// 		}
	// 	},
	// 	FancySelect: {
	// 		open: function () {
	// 			this.fel.addClass("dd-open");
	// 		},
	// 		close: function () {
	// 			this.fel.removeClass("dd-open");
	// 		}
	// 	}
	// });
	$("input:checkbox").fancifyCheckbox();
	$("input:radio").fancifyRadio();
	$("select").fancifySelect();
});