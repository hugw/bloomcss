/**
 * Scripts
 *
 * @copyright Copyright (c) 2016, hugw.io
 * @author Hugo W - me@hugw.io
 * @license MIT
 */

(function ($) {
  'use strict';

  $('.dochighlight code').each(function () {
    // Escape HTML
    $(this).text(this.innerHTML.trim());

    // Apply highlight
    hljs.highlightBlock(this);
  });
}(jQuery));
