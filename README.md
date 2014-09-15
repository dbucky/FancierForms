Fancier Forms
============

Completely styleable, jQuery-driven form element replacements (select, radio, checkbox) that work cooperatively with their native counterparts to mimic the expected user experience for both mouse and keyboard interactions.

## Usage

To use Fancier Forms, simply call one of the following functions on a jQuery object containing the appropriate form element(s).

```
$(function() {
	$("select").fancifySelect();
	$("input:radio").fancifyRadio();
	$("input:checkbox").fancifyCheckbox();
});
```

## Markup

Fancier Forms works by adding minimal markup to the page after each matched element in the jQuery object. The markup for each of the three types of elements is shown below.

### Select

#### Simple example

```
<div class="fancy select">
    <span class="selected-value">Select</span>
    <ul class="options" style="display: none;">
        <li class="option selected">Select</li>
        <li class="option">Option 1</li>
        <li class="option">Option 2</li>
        <li class="option">Option 3</li>
    </ul>
</div>
```

#### Optgroup example

```
<div class="fancy select">
	<span class="selected-value">Select</span>
	<ul class="options" style="display: none;">
		<li class="option selected">Select</li>
		<li class="group">
			<span class="group-label">Group</span>
			<ul>
				<li class="option">Group Option 1</li>
				<li class="option">Group Option 2</li>
				<li class="option">Group Option 3</li>
			</ul>
		</li>
	</ul>
</div>
```

### Radio Button

```
<div class="fancy radio"></div>
```

### Checkbox

```
<div class="fancy checkbox"></div>
```

## Styling

No styling is done on your behalf by this plugin; the state of each fancy form element is tracked via classes. These classes allow you to style the fancy form elements in any way desired. Take a look at demo.css as a starting point.

### Select

Selects have a **focused** state and an **open** state.

```
<div class="fancy select focused open">
	...
</div>
```

Additionally, Options have a **selected** state.

```
...
	<li class="option selected">Option 3</li>
...
```

### Radio Button, Checkbox

Radio buttons and checkboxes have a **focused** state and a **selected** state.

```
<div class="fancy radio focused selected"></div>
<div class="fancy checkbox focused selected"></div>
```

### Disabled

Fancier Forms supports disabled form elements. Adding the disabled attribute to Selects (as well as Optgroups and Options), Radio Buttons, and Checkboxes will cause a **disabled** class to be added to the corresponding fancy version. This only occurs when the fancy element is created, so dynamically removing and re-adding this attribute to the native elements will not update the fancy ones. I may try to implement dynamic support in the future. In the meantime, simply keep the disabled class on the fancy element in sync with the disabled attribute on the native version.

```
<div class="fancy select disabled">
	...
	<ul class="options">
		<li class="option disabled">Option 1</li>
		<li class="group disabled">
			<ul>
				<li class="option">Option 2</li>
				<li class="option">Option 3</li>
			</ul>
		</li>
	</ul>
</div>
<div class="fancy radio disabled"></div>
<div class="fancy checkbox disabled"></div>
```

### Hidden

What makes Fancier Forms elegant is that it binds the state of the fancy form element to the state of the underlying native form element. Thus, any changes that occur to the native element are automatically reflected in the fancy version. The way this occurs is that a **hidden** class is applied to the native element; the styling applied to this class should simply move the element offscreen so it is no longer visible but can still be interacted with.

```
/* recommended styling */
.hidden {
	position: absolute;
	left: -999999px;
}
```

This allows the plugin to let the native element handle the keyboard interactions. Since the native element is offscreen and obviously cannot be interacted with via the mouse, Fancy Forms steps in for those events on the fancy element. It does this by updating the state of the native element when the user makes a change to the fancy element, which is then reflected in the state of the fancy element due to the aforementioned binding.

To see the native element and the fancy version working in tandem, just comment out the .hidden style rule in demo.css and view index.html.

## License

Fancier Forms is licensed under both the [MIT](http://opensource.org/licenses/mit-license.php) and [GPL](http://www.gnu.org/licenses/gpl.html) licenses.

## Credits

The inspiration for this jQuery plugin was taken largely from Lutrasoft's similarly named [Fancyform](https://github.com/Lutrasoft/Fancyform) plugin, which is actually fancier in terms of features and capabilities, but offers no keyboard support. This plugin's goal was to remedy that situation, while staying true to the native form elements' functionality without all the bells and whistles.

[Refresh-SF](http://gpbmike.github.io/refresh-sf/) used for JavaScript minification.

The version numbers for each release of this plugin adhere to [Semantic Versioning](http://semver.org/spec/v2.0.0.html). 
