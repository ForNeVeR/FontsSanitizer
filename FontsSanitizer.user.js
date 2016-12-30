// ==UserScript==
// @name           FontsSanitizer
// @namespace      https://leechcraft.org
// @description    Reverts fonts on web pages to browser's settings of Serif, Sans-Serif and Monospace fonts.
// @author         Georg Rudoy
// ==/UserScript==

(function() {
	function handleRules(rules) {
		for (var j = 0; j < rules.length; ++j) {
			var style = rules[j].style;
			if (typeof style === "undefined" || style === null)
				continue;

			if (typeof style.fontFamily === "undefined" || style.fontFamily === null)
				continue;

			if (style.fontFamily.search(/monospace/i) != -1)
				style.fontFamily = 'monospace';
			else if (style.fontFamily.search(/sans-serif/i) != -1)
				style.fontFamily = 'sans-serif';
			else if (style.fontFamily.search(/serif/i) != -1)
				style.fontFamily = 'serif';
		}
	}

	function handleUnreachableCSS(cssAddress) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState != 4 || xhttp.status != 200)
				return;

			var text = xhttp.responseText;

			var match = text.match(/serif/i);
			if (match == null || match.length < 1)
				return;

			var styleElem = document.createElement("style");
			styleElem.innerHTML = text;
			document.getElementsByTagName("head")[0].appendChild(styleElem);

			handleRules(styleElem.sheet.cssRules);
		}
		xhttp.open("GET", cssAddress, true);
		xhttp.send(null);
	}

	function fixCSS() {
		for (var i = 0; i < document.styleSheets.length; ++i) {
			var cssObj = document.styleSheets[i];
			var rules = cssObj.cssRules;
			if (typeof rules === "undefined" || rules === null) {
				handleUnreachableCSS(cssObj.href);
				continue;
			}

			handleRules(rules);
		}
	}

	fixCSS();
	window.addEventListener("load", fixCSS, false);
})();
