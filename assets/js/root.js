/* Root page: send the visitor to their language. Runs before paint.
   Order: a language picked by hand earlier, then the browser's languages,
   then Spanish. The chooser stays visible if anything fails. */
(function () {
  "use strict";
  var supported = ["es", "gl", "en", "fr", "it", "de", "pt", "ru", "ja", "zh", "ar"];
  var pick = null;
  try { pick = localStorage.getItem("tragaldabas-lang"); } catch (e) { /* private mode */ }
  if (supported.indexOf(pick) < 0) {
    pick = null;
    var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < prefs.length && !pick; i++) {
      var code = String(prefs[i]).toLowerCase().split("-")[0];
      if (supported.indexOf(code) >= 0) pick = code;
    }
  }
  if (!pick) pick = "en";
  if (/[?&]choose\b/.test(location.search)) return;
  location.replace(pick + "/");
})();
