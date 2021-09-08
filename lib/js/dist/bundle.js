(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _shufflejsInit = _interopRequireDefault(require("./shufflejs-init"));

var filters = new _shufflejsInit["default"](); // Handle the submission of the newsletter sign up
// form by hiding the form after the submission and
// displaying the confirmation message.

var newsletterForm = document.getElementById("newslettersignup");

if (newsletterForm && newsletterForm.addEventListener) {
  newsletterForm.addEventListener('submit', function () {
    console.log("\uD83D\uDD14 form has been submitted");
    newsletterForm.style.display = 'none';
    var parent = newsletterForm.parentNode;
    parent.innerHTML = parent.innerHTML + "<p>".concat(wpvars.confirmationMessage, "</p>");
  }, false);
}

},{"./shufflejs-init":2,"@babel/runtime/helpers/interopRequireDefault":8}],2:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _shufflejs = _interopRequireDefault(require("shufflejs"));

var _utilities = require("./utilities");

var browserWidth = window.innerWidth;
console.log("\uD83D\uDD14 browserWidth = ".concat(browserWidth));
var mobileBreakPoint = wpvars.mobileBreakPoint;

var PostFilters = /*#__PURE__*/function () {
  function PostFilters() {
    (0, _classCallCheck2["default"])(this, PostFilters);
    var urlParams = new URLSearchParams(window.location.search);
    var subCategoryStr = urlParams.get('sub-category');
    this.subCategoryArray = [];

    if (null != subCategoryStr) {
      if (-1 < subCategoryStr.indexOf(',')) {
        this.subCategoryArray = (0, _utilities.explode)(',', subCategoryStr);
      } else {
        this.subCategoryArray = [subCategoryStr];
      }
    }

    var certificationStr = urlParams.get('certification');
    this.certificationArray = [];

    if (null != certificationStr) {
      if (-1 < certificationStr.indexOf(',')) {
        this.certificationArray = (0, _utilities.explode)(',', certificationStr);
      } else {
        this.certificationArray = [certificationStr];
      }
    }

    var newsCategoryStr = urlParams.get('news-category');
    this.newsCategoryArray = [];

    if (null != newsCategoryStr) {
      if (-1 < newsCategoryStr.indexOf(',')) {
        this.newsCategoryArray = (0, _utilities.explode)(',', newsCategoryStr);
      } else {
        this.newsCategoryArray = [newsCategoryStr];
      }
    }

    this.filters = [];
    this.postType = wpvars.post_type;
    this.category = wpvars.category;
    this.gridId = wpvars.gridId;
    var allPosts = wpvars.posts;

    if (mobileBreakPoint >= browserWidth && 'post' == wpvars.post_type) {
      console.log("\uD83D\uDD14 Removing Newsletter Sign Up form because browser width is <= ".concat(mobileBreakPoint));
      allPosts.splice(2, 1);
    }

    this.posts = allPosts;
    this.defaultThumbnail = wpvars.defaultThumbnail;
    this.filterClassName = wpvars.filter_class_name;
    this.page_number = 1;
    this.page_size = parseInt(wpvars.limit);

    if (-1 === this.page_size) {
      this.total_pages = 1;
    } else {
      if ((0, _typeof2["default"])(this.posts) != undefined) this.total_pages = Math.ceil(this.posts.length / this.page_size);
    }

    this.filterGroups = document.getElementsByClassName(wpvars.filter_class_name);
    this.loadMoreButton = document.getElementById('load-more');
    this.loadPosts();
    this.addLinkEventListener();
    this.addLoadMoreListener();
    this.initializeFilterGroups();
    if (0 < this.subCategoryArray.length || 0 < this.certificationArray.length || 0 < this.newsCategoryArray.length) this.deepLink();
  }
  /**
   * Enables the functionality of the LOAD MORE button
   */


  (0, _createClass2["default"])(PostFilters, [{
    key: "addLoadMoreListener",
    value: function addLoadMoreListener() {
      var _this = this;

      this.loadMoreButton.addEventListener('click', function (e) {
        e.preventDefault();

        _this.clearAllFilters(); // We need to clear all filters, otherwise the first position in the list of posts is empty.


        _this.initializeFilterGroups(); // Adds .select to the "All" filter


        _this.shuffle.filter();

        _this.loadPosts();
      });
    }
    /**
     * Adds event listener to each .filter-link-group ul > li > a
     */

  }, {
    key: "addLinkEventListener",
    value: function addLinkEventListener() {
      var _this2 = this;

      for (var _i = 0, _Object$entries = Object.entries(this.filterGroups); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        var filterLinks = value.getElementsByTagName('a');

        var _loop = function _loop() {
          var _Object$entries2$_i = (0, _slicedToArray2["default"])(_Object$entries2[_i2], 2),
              key = _Object$entries2$_i[0],
              link = _Object$entries2$_i[1];

          var filter = link.getAttribute('data-filter');
          link.addEventListener('click', function (event) {
            event.preventDefault();

            if ('groups' !== _shufflejs["default"].FILTER_ATTRIBUTE_KEY) {
              _this2.clearAllFilters();

              _shufflejs["default"].FILTER_ATTRIBUTE_KEY = 'groups';
            } // Clear the text search field
            //this.removeSearchText()
            // Remove all filtering for a taxonomy if '*' === filter


            if ('*' === filter) {
              _this2._clearAllFiltersForTaxonomy(link);

              link.classList.add('selected');
            } else {
              _this2._clearAllFiltersForTaxonomy(link);

              _this2.toggleFilter(filter);

              if (_this2.hasFilter(filter)) {
                link.classList.add('selected');
              } else {
                //this._clearAllFiltersForTaxonomy(link)
                link.classList.remove('selected');
              }
            }
            /**/

          });
        };

        for (var _i2 = 0, _Object$entries2 = Object.entries(filterLinks); _i2 < _Object$entries2.length; _i2++) {
          _loop();
        }
      }
    }
    /**
     * Adds a `filter` to this.filters
     *
     * @param      {string}  filter  The filter
     */

  }, {
    key: "addFilter",
    value: function addFilter(filter) {
      if (-1 === this.filters.indexOf(filter)) {
        this.filters.push(filter);
      }
    }
    /**
     * Calls ShuffleJS.shuffle with our filters
     */

  }, {
    key: "applyFilters",
    value: function applyFilters() {
      var filters = this.filters;
      console.log('🔔 Filtering with: ', filters);
      this.shuffle.filter(filters);
    }
  }, {
    key: "clearAllFilters",
    value: function clearAllFilters() {
      var _this3 = this;

      var filters = this.filters;
      filters.forEach(function (element) {
        _this3.removeFilter(element);
      });
    }
  }, {
    key: "_clearAllFiltersForTaxonomy",
    value: function _clearAllFiltersForTaxonomy(linkEl) {
      var closestParent = linkEl.closest('.filter-link-group');
      var taxonomy = closestParent.getAttribute('data-taxonomy');
      var listItems = closestParent.getElementsByTagName('li');
      console.log("\uD83D\uDD14 Clearing all filters for \"".concat(taxonomy, "\"..."));

      for (var _i3 = 0, _Object$entries3 = Object.entries(listItems); _i3 < _Object$entries3.length; _i3++) {
        var _Object$entries3$_i = (0, _slicedToArray2["default"])(_Object$entries3[_i3], 2),
            key = _Object$entries3$_i[0],
            listItem = _Object$entries3$_i[1];

        var filterLink = listItem.getElementsByTagName('a');

        if (filterLink[0].classList.contains('selected')) {
          filterLink[0].classList.remove('selected');
          var filterToRemove = filterLink[0].getAttribute('data-filter');
          this.removeFilter(filterToRemove);
        }
      }

      this.applyFilters();
    }
    /**
     * Permits linking to Sub Categories and Certifications via the URL query string.
     *
     * - sub-category   Comma separated list of Sub Category slugs.
     * - certification  Comma separated list of Certification slugs.
     */

  }, {
    key: "deepLink",
    value: function deepLink() {
      var _this4 = this;

      console.log('🔔 Deep Linking...');

      if (0 < this.subCategoryArray.length) {
        this.subCategoryArray.forEach(function (element) {
          _this4.addFilter(element); // Remove .selected from the filter anchor tag.


          var filterLink = document.querySelector("[data-filter=\"".concat(element, "\"]"));
          if (!filterLink.classList.contains('selected')) filterLink.classList.add('selected');
        });
        var subCategoryLinks = document.getElementsByClassName('sub_category');

        for (var _i4 = 0, _Object$entries4 = Object.entries(subCategoryLinks); _i4 < _Object$entries4.length; _i4++) {
          var _Object$entries4$_i = (0, _slicedToArray2["default"])(_Object$entries4[_i4], 2),
              key = _Object$entries4$_i[0],
              value = _Object$entries4$_i[1];

          var filterLinks = value.getElementsByTagName('a');
          filterLinks[0].classList.remove('selected');
        }
      }

      if (0 < this.certificationArray.length) {
        this.certificationArray.forEach(function (element) {
          _this4.addFilter(element); // Remove .selected from the filter anchor tag.


          var filterLink = document.querySelector("[data-filter=\"".concat(element, "\"]"));
          if (!filterLink.classList.contains('selected')) filterLink.classList.add('selected');
        });
        var certificationLinks = document.getElementsByClassName('certification');

        for (var _i5 = 0, _Object$entries5 = Object.entries(certificationLinks); _i5 < _Object$entries5.length; _i5++) {
          var _Object$entries5$_i = (0, _slicedToArray2["default"])(_Object$entries5[_i5], 2),
              _key = _Object$entries5$_i[0],
              _value = _Object$entries5$_i[1];

          var _filterLinks = _value.getElementsByTagName('a');

          _filterLinks[0].classList.remove('selected');
        }
      }

      if (0 < this.newsCategoryArray.length) {
        this.newsCategoryArray.forEach(function (element) {
          _this4.addFilter(element); // Remove .selected from the filter anchor tag.


          var filterLink = document.querySelector("[data-filter=\"".concat(element, "\"]"));
          if (!filterLink.classList.contains('selected')) filterLink.classList.add('selected');
        });
        var newsCategoryLinks = document.getElementsByClassName('news_category');

        for (var _i6 = 0, _Object$entries6 = Object.entries(newsCategoryLinks); _i6 < _Object$entries6.length; _i6++) {
          var _Object$entries6$_i = (0, _slicedToArray2["default"])(_Object$entries6[_i6], 2),
              _key2 = _Object$entries6$_i[0],
              _value2 = _Object$entries6$_i[1];

          var _filterLinks2 = _value2.getElementsByTagName('a');

          _filterLinks2[0].classList.remove('selected');
        }
      }

      this.applyFilters(); // Smooth Scoll to "Sub Categories"

      var el = document.getElementById('shuffleFilterTop');
      var viewportOffset = el.getBoundingClientRect();
      var top = viewportOffset.top;
      window.scroll({
        top: top - 90,
        left: 0,
        behavior: 'smooth'
      });
      console.log('top = ', top);
      console.log('🔔 did we scroll?');
    }
    /**
    * Checks for the existence of `filter` inside this.filters
    *
    * @param      {string}   filter  The filter
    * @return     {boolean}  True if has filter, False otherwise.
    */

  }, {
    key: "hasFilter",
    value: function hasFilter(filter) {
      return -1 < this.filters.indexOf(filter) ? true : false;
    }
    /**
     * Initializes the filter groups by adding `.selected` to the first filter.
     */

  }, {
    key: "initializeFilterGroups",
    value: function initializeFilterGroups() {
      for (var _i7 = 0, _Object$entries7 = Object.entries(this.filterGroups); _i7 < _Object$entries7.length; _i7++) {
        var _Object$entries7$_i = (0, _slicedToArray2["default"])(_Object$entries7[_i7], 2),
            key = _Object$entries7$_i[0],
            value = _Object$entries7$_i[1];

        var filterLinks = value.getElementsByTagName('a');
        filterLinks[0].classList.add('selected');
      }
    }
    /**
     * Removes a `filter` from this.filters
     *
     * @param      {string}  filter  The filter
     */

  }, {
    key: "removeFilter",
    value: function removeFilter(filter) {
      var index = this.filters.indexOf(filter);

      if (-1 < index) {
        console.log("\t \u2022 Removing '".concat(filter, "'"));
        this.filters.splice(index, 1); // Remove .selected from the filter anchor tag.

        var filterLink = document.querySelector("[data-filter=\"".concat(filter, "\"]"));
        if (filterLink.classList.contains('selected')) filterLink.classList.remove('selected');
      }
    }
    /**
     * Toggles (adds/removes) a `filter` from this.filters
     *
     * @param      {string}  filter  The filter
     */

  }, {
    key: "toggleFilter",
    value: function toggleFilter(filter) {
      var hasFilter = this.hasFilter(filter);

      if (hasFilter) {
        this.removeFilter(filter);
      } else {
        this.addFilter(filter);
      }

      this.applyFilters();
    }
    /**
     * Loads our posts and applies ShuffleJS
     *
     * @param      {number}  page_size    The page size
     * @param      {number}  page_number  The page number
     */

  }, {
    key: "loadPosts",
    value: function loadPosts() {
      var _this5 = this;

      var postGrid = document.getElementById(this.gridId);
      var posts = -1 === this.page_size ? this.posts : this._getPageOfPosts();
      var elProcessed = 0;
      posts.forEach(function (el, index, array) {
        postGrid.insertAdjacentHTML('beforeEnd', _this5._getPostElement(el));
        elProcessed++;

        if (elProcessed === array.length) {
          //console.log('Shuffling now! this.page_number = ', this.page_number)
          if (_this5.page_number === _this5.total_pages || -1 === _this5.page_size) _this5.loadMoreButton.style.display = 'none';
          _this5.page_number++;
          _this5.shuffle = new _shufflejs["default"](document.getElementById(_this5.gridId), {
            itemSelector: '.' + _this5.postType,
            filterMode: 'all'
          });
        }
      });
    }
  }, {
    key: "_getPageOfPosts",
    value: function _getPageOfPosts() {
      console.log("_getPageOfPosts() is retrieving page ".concat(this.page_number, " with ").concat(this.page_size, " posts."));
      var page_number = this.page_number;
      page_number--;
      var page_size = this.page_size;
      return this.posts.slice(page_number * page_size, (page_number + 1) * page_size);
    }
    /**
     * Returns the HTML for our post element.
     *
     * @param {object} el Our post element/object.
     */

  }, {
    key: "_getPostElement",
    value: function _getPostElement(el) {
      var thumbnailUrl = !el.thumbnail ? this.defaultThumbnail : el.thumbnail;
      var post = '';

      switch (this.postType) {
        case 'product':
          var newTag = el["new"] ? '<div class="new"></div>' : '';
          post = "\n        <li class=\"list-item ".concat(this.postType, "\" data-groups='").concat(JSON.stringify(el.groups), "'>\n          <a href=\"").concat(el.permalink, "\">\n            <div class=\"flip-card\">\n              <div class=\"flip-card-inner\">\n                <div class=\"flip-card-front\">\n                  <div class=\"course-title\">\n                    <h3>").concat(el.title, "</h3>\n                    ").concat(newTag, "\n                  </div>\n                  <div class=\"course-meta\">\n                    <div class=\"course-meta-row\">\n                      <div class=\"course-meta-col\">\n                        <div class=\"icon duration\"></div>\n                        <div class=\"text\">").concat(el.meta.course_duration, "</div>\n                      </div>\n                      <div class=\"course-meta-col\">\n                        <div class=\"text\">").concat(el.meta.course_reference, "</div>\n                      </div>\n                    </div>\n                    <div class=\"course-meta-row\">\n                      <div class=\"course-meta-col ").concat(el.meta.face_to_face, "\">\n                        <div class=\"icon face-to-face ").concat(el.meta.face_to_face, "\"></div>\n                        <div class=\"text\">").concat(wpvars.labels.faceToFace, "</div>\n                      </div>\n                      <div class=\"course-meta-col ").concat(el.meta.virtual, "\">\n                        <div class=\"icon virtual ").concat(el.meta.virtual, "\"></div>\n                        <div class=\"text\"><span>Virtual<br/>OpenClass&reg;</span></div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"flip-card-back\">\n                  <h3>").concat(el.title, "</h3>\n                  <p>").concat(el.excerpt, "</p>\n                </div>\n              </div>\n            </div>\n          </a>\n        </li>");
          break;

        default:
          //if( 'newsletter_form' == el.title && 375 = browserWidth )
          // CONTINUE WITH ABOVE STATEMENT
          // Build the elements of .overlay
          var ribbon = "<div class=\"ribbon ".concat(el.groups.join(' '), "\"></div>");
          var blueOverlay = "<div class=\"blue-overlay\"></div>";
          var categoryOverlay = "<div class=\"category-overlay\">".concat(el.resource_type, "</div>");

          if ('news' == wpvars.category) {
            categoryOverlay = "<div class=\"category-overlay\">".concat(el.news_category, "</div>");
          } // .overlay contains .ribbon, .blue-overlay, and .category-overlay


          var overlay = "<div class=\"overlay\" style=\"background-image: url('".concat(thumbnailUrl, "')\">").concat(ribbon).concat(blueOverlay).concat(categoryOverlay, "</div>"); // Build .list-item with the .meta and title.

          var meta = "<p class=\"meta\">".concat(el.meta, "</p>");
          if ('news' == wpvars.category) meta = '';
          var title = "<h3 class=\"\">".concat((0, _utilities.truncate)(el.title, 80, true), "</h3>");
          var listItem = "<li class=\"list-item ".concat(wpvars.category, " ").concat(this.postType, "\" data-groups='").concat(JSON.stringify(el.groups), "'><a href=\"").concat(el.permalink, "\"><div class=\"list-content ").concat(this.postType, "\">").concat(overlay).concat(meta).concat(title, "</div></a></li>");

          if ('newsletter_form' == el.title) {
            listItem = "<li class=\"list-item ".concat(this.postType, " newsletter-signup\" data-groups=\"[]\"><div class=\"list-content ").concat(this.postType, "\">").concat(wpvars.newsletterForm, "</div></li>");
          }

          post = listItem;
      }

      return post;
    }
  }]);
  return PostFilters;
}();

var _default = PostFilters;
exports["default"] = _default;

},{"./utilities":3,"@babel/runtime/helpers/classCallCheck":6,"@babel/runtime/helpers/createClass":7,"@babel/runtime/helpers/interopRequireDefault":8,"@babel/runtime/helpers/slicedToArray":11,"@babel/runtime/helpers/typeof":12,"shufflejs":14}],3:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncate = truncate;
exports.explode = explode;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

/* Utility Functions */
function truncate(string, n, useWordBoundary) {
  if (string.length <= n) return string;
  var subString = string.substr(0, n - 1);
  return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + "&hellip;";
}

function explode(delimiter, string, limit) {
  //  discuss at: https://locutus.io/php/explode/
  // original by: Kevin van Zonneveld (https://kvz.io)
  //   example 1: explode(' ', 'Kevin van Zonneveld')
  //   returns 1: [ 'Kevin', 'van', 'Zonneveld' ]
  if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined') {
    return null;
  }

  if (delimiter === '' || delimiter === false || delimiter === null) {
    return false;
  }

  if (typeof delimiter === 'function' || (0, _typeof2["default"])(delimiter) === 'object' || typeof string === 'function' || (0, _typeof2["default"])(string) === 'object') {
    return {
      0: ''
    };
  }

  if (delimiter === true) {
    delimiter = '1';
  } // Here we go...


  delimiter += '';
  string += '';
  var s = string.split(delimiter);
  if (typeof limit === 'undefined') return s; // Support for limit

  if (limit === 0) limit = 1; // Positive limit

  if (limit > 0) {
    if (limit >= s.length) {
      return s;
    }

    return s.slice(0, limit - 1).concat([s.slice(limit - 1).join(delimiter)]);
  } // Negative limit


  if (-limit >= s.length) {
    return [];
  }

  s.splice(s.length + limit);
  return s;
}

},{"@babel/runtime/helpers/interopRequireDefault":8,"@babel/runtime/helpers/typeof":12}],4:[function(require,module,exports){
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],5:[function(require,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],6:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],7:[function(require,module,exports){
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],8:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],9:[function(require,module,exports){
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],10:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],11:[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles.js");

var iterableToArrayLimit = require("./iterableToArrayLimit.js");

var unsupportedIterableToArray = require("./unsupportedIterableToArray.js");

var nonIterableRest = require("./nonIterableRest.js");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./arrayWithHoles.js":5,"./iterableToArrayLimit.js":9,"./nonIterableRest.js":10,"./unsupportedIterableToArray.js":13}],12:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  }

  return _typeof(obj);
}

module.exports = _typeof;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],13:[function(require,module,exports){
var arrayLikeToArray = require("./arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./arrayLikeToArray.js":4}],14:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Shuffle = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function E () {
    // Keep this empty so it's easier to inherit from
    // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
  }

  E.prototype = {
    on: function (name, callback, ctx) {
      var e = this.e || (this.e = {});

      (e[name] || (e[name] = [])).push({
        fn: callback,
        ctx: ctx
      });

      return this;
    },

    once: function (name, callback, ctx) {
      var self = this;
      function listener () {
        self.off(name, listener);
        callback.apply(ctx, arguments);
      }
      listener._ = callback;
      return this.on(name, listener, ctx);
    },

    emit: function (name) {
      var data = [].slice.call(arguments, 1);
      var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
      var i = 0;
      var len = evtArr.length;

      for (i; i < len; i++) {
        evtArr[i].fn.apply(evtArr[i].ctx, data);
      }

      return this;
    },

    off: function (name, callback) {
      var e = this.e || (this.e = {});
      var evts = e[name];
      var liveEvents = [];

      if (evts && callback) {
        for (var i = 0, len = evts.length; i < len; i++) {
          if (evts[i].fn !== callback && evts[i].fn._ !== callback)
            liveEvents.push(evts[i]);
        }
      }

      // Remove event from queue to prevent memory leak
      // Suggested by https://github.com/lazd
      // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

      (liveEvents.length)
        ? e[name] = liveEvents
        : delete e[name];

      return this;
    }
  };

  var tinyEmitter = E;
  var TinyEmitter = E;
  tinyEmitter.TinyEmitter = TinyEmitter;

  var proto = typeof Element !== 'undefined' ? Element.prototype : {};
  var vendor = proto.matches
    || proto.matchesSelector
    || proto.webkitMatchesSelector
    || proto.mozMatchesSelector
    || proto.msMatchesSelector
    || proto.oMatchesSelector;

  var matchesSelector = match;

  /**
   * Match `el` to `selector`.
   *
   * @param {Element} el
   * @param {String} selector
   * @return {Boolean}
   * @api public
   */

  function match(el, selector) {
    if (!el || el.nodeType !== 1) return false;
    if (vendor) return vendor.call(el, selector);
    var nodes = el.parentNode.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i] == el) return true;
    }
    return false;
  }

  var throttleit = throttle;

  /**
   * Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
   *
   * @param {Function} func Function to wrap.
   * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
   * @return {Function} A new function that wraps the `func` function passed in.
   */

  function throttle (func, wait) {
    var ctx, args, rtn, timeoutID; // caching
    var last = 0;

    return function throttled () {
      ctx = this;
      args = arguments;
      var delta = new Date() - last;
      if (!timeoutID)
        if (delta >= wait) call();
        else timeoutID = setTimeout(call, wait - delta);
      return rtn;
    };

    function call () {
      timeoutID = 0;
      last = +new Date();
      rtn = func.apply(ctx, args);
      ctx = null;
      args = null;
    }
  }

  var arrayParallel = function parallel(fns, context, callback) {
    if (!callback) {
      if (typeof context === 'function') {
        callback = context;
        context = null;
      } else {
        callback = noop;
      }
    }

    var pending = fns && fns.length;
    if (!pending) return callback(null, []);

    var finished = false;
    var results = new Array(pending);

    fns.forEach(context ? function (fn, i) {
      fn.call(context, maybeDone(i));
    } : function (fn, i) {
      fn(maybeDone(i));
    });

    function maybeDone(i) {
      return function (err, result) {
        if (finished) return;

        if (err) {
          callback(err, results);
          finished = true;
          return
        }

        results[i] = result;

        if (!--pending) callback(null, results);
      }
    }
  };

  function noop() {}

  /**
   * Always returns a numeric value, given a value. Logic from jQuery's `isNumeric`.
   * @param {*} value Possibly numeric value.
   * @return {number} `value` or zero if `value` isn't numeric.
   */
  function getNumber(value) {
    return parseFloat(value) || 0;
  }

  var Point = /*#__PURE__*/function () {
    /**
     * Represents a coordinate pair.
     * @param {number} [x=0] X.
     * @param {number} [y=0] Y.
     */
    function Point(x, y) {
      _classCallCheck(this, Point);

      this.x = getNumber(x);
      this.y = getNumber(y);
    }
    /**
     * Whether two points are equal.
     * @param {Point} a Point A.
     * @param {Point} b Point B.
     * @return {boolean}
     */


    _createClass(Point, null, [{
      key: "equals",
      value: function equals(a, b) {
        return a.x === b.x && a.y === b.y;
      }
    }]);

    return Point;
  }();

  var Rect = /*#__PURE__*/function () {
    /**
     * Class for representing rectangular regions.
     * https://github.com/google/closure-library/blob/master/closure/goog/math/rect.js
     * @param {number} x Left.
     * @param {number} y Top.
     * @param {number} w Width.
     * @param {number} h Height.
     * @param {number} id Identifier
     * @constructor
     */
    function Rect(x, y, w, h, id) {
      _classCallCheck(this, Rect);

      this.id = id;
      /** @type {number} */

      this.left = x;
      /** @type {number} */

      this.top = y;
      /** @type {number} */

      this.width = w;
      /** @type {number} */

      this.height = h;
    }
    /**
     * Returns whether two rectangles intersect.
     * @param {Rect} a A Rectangle.
     * @param {Rect} b A Rectangle.
     * @return {boolean} Whether a and b intersect.
     */


    _createClass(Rect, null, [{
      key: "intersects",
      value: function intersects(a, b) {
        return a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;
      }
    }]);

    return Rect;
  }();

  var Classes = {
    BASE: 'shuffle',
    SHUFFLE_ITEM: 'shuffle-item',
    VISIBLE: 'shuffle-item--visible',
    HIDDEN: 'shuffle-item--hidden'
  };

  var id$1 = 0;

  var ShuffleItem = /*#__PURE__*/function () {
    function ShuffleItem(element, isRTL) {
      _classCallCheck(this, ShuffleItem);

      id$1 += 1;
      this.id = id$1;
      this.element = element;
      /**
       * Set correct direction of item
       */

      this.isRTL = isRTL;
      /**
       * Used to separate items for layout and shrink.
       */

      this.isVisible = true;
      /**
       * Used to determine if a transition will happen. By the time the _layout
       * and _shrink methods get the ShuffleItem instances, the `isVisible` value
       * has already been changed by the separation methods, so this property is
       * needed to know if the item was visible/hidden before the shrink/layout.
       */

      this.isHidden = false;
    }

    _createClass(ShuffleItem, [{
      key: "show",
      value: function show() {
        this.isVisible = true;
        this.element.classList.remove(Classes.HIDDEN);
        this.element.classList.add(Classes.VISIBLE);
        this.element.removeAttribute('aria-hidden');
      }
    }, {
      key: "hide",
      value: function hide() {
        this.isVisible = false;
        this.element.classList.remove(Classes.VISIBLE);
        this.element.classList.add(Classes.HIDDEN);
        this.element.setAttribute('aria-hidden', true);
      }
    }, {
      key: "init",
      value: function init() {
        this.addClasses([Classes.SHUFFLE_ITEM, Classes.VISIBLE]);
        this.applyCss(ShuffleItem.Css.INITIAL);
        this.applyCss(this.isRTL ? ShuffleItem.Css.DIRECTION.rtl : ShuffleItem.Css.DIRECTION.ltr);
        this.scale = ShuffleItem.Scale.VISIBLE;
        this.point = new Point();
      }
    }, {
      key: "addClasses",
      value: function addClasses(classes) {
        var _this = this;

        classes.forEach(function (className) {
          _this.element.classList.add(className);
        });
      }
    }, {
      key: "removeClasses",
      value: function removeClasses(classes) {
        var _this2 = this;

        classes.forEach(function (className) {
          _this2.element.classList.remove(className);
        });
      }
    }, {
      key: "applyCss",
      value: function applyCss(obj) {
        var _this3 = this;

        Object.keys(obj).forEach(function (key) {
          _this3.element.style[key] = obj[key];
        });
      }
    }, {
      key: "dispose",
      value: function dispose() {
        this.removeClasses([Classes.HIDDEN, Classes.VISIBLE, Classes.SHUFFLE_ITEM]);
        this.element.removeAttribute('style');
        this.element = null;
      }
    }]);

    return ShuffleItem;
  }();

  ShuffleItem.Css = {
    INITIAL: {
      position: 'absolute',
      top: 0,
      visibility: 'visible',
      willChange: 'transform'
    },
    DIRECTION: {
      ltr: {
        left: 0
      },
      rtl: {
        right: 0
      }
    },
    VISIBLE: {
      before: {
        opacity: 1,
        visibility: 'visible'
      },
      after: {
        transitionDelay: ''
      }
    },
    HIDDEN: {
      before: {
        opacity: 0
      },
      after: {
        visibility: 'hidden',
        transitionDelay: ''
      }
    }
  };
  ShuffleItem.Scale = {
    VISIBLE: 1,
    HIDDEN: 0.001
  };

  var value = null;
  var testComputedSize = (function () {
    if (value !== null) {
      return value;
    }

    var element = document.body || document.documentElement;
    var e = document.createElement('div');
    e.style.cssText = 'width:10px;padding:2px;box-sizing:border-box;';
    element.appendChild(e);
    value = window.getComputedStyle(e, null).width === '10px';
    element.removeChild(e);
    return value;
  });

  /**
   * Retrieve the computed style for an element, parsed as a float.
   * @param {Element} element Element to get style for.
   * @param {string} style Style property.
   * @param {CSSStyleDeclaration} [styles] Optionally include clean styles to
   *     use instead of asking for them again.
   * @return {number} The parsed computed value or zero if that fails because IE
   *     will return 'auto' when the element doesn't have margins instead of
   *     the computed style.
   */

  function getNumberStyle(element, style) {
    var styles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window.getComputedStyle(element, null);
    var value = getNumber(styles[style]); // Support IE<=11 and W3C spec.

    if (!testComputedSize() && style === 'width') {
      value += getNumber(styles.paddingLeft) + getNumber(styles.paddingRight) + getNumber(styles.borderLeftWidth) + getNumber(styles.borderRightWidth);
    } else if (!testComputedSize() && style === 'height') {
      value += getNumber(styles.paddingTop) + getNumber(styles.paddingBottom) + getNumber(styles.borderTopWidth) + getNumber(styles.borderBottomWidth);
    }

    return value;
  }

  /**
   * Fisher-Yates shuffle.
   * http://stackoverflow.com/a/962890/373422
   * https://bost.ocks.org/mike/shuffle/
   * @param {Array} array Array to shuffle.
   * @return {Array} Randomly sorted array.
   */
  function randomize(array) {
    var n = array.length;

    while (n) {
      n -= 1;
      var i = Math.floor(Math.random() * (n + 1));
      var temp = array[i];
      array[i] = array[n];
      array[n] = temp;
    }

    return array;
  }

  var defaults = {
    // Use array.reverse() to reverse the results
    reverse: false,
    // Sorting function
    by: null,
    // Custom sort function
    compare: null,
    // If true, this will skip the sorting and return a randomized order in the array
    randomize: false,
    // Determines which property of each item in the array is passed to the
    // sorting method.
    key: 'element'
  };
  /**
   * You can return `undefined` from the `by` function to revert to DOM order.
   * @param {Array<T>} arr Array to sort.
   * @param {SortOptions} options Sorting options.
   * @return {Array<T>}
   */

  function sorter(arr, options) {
    // eslint-disable-next-line prefer-object-spread
    var opts = Object.assign({}, defaults, options);
    var original = Array.from(arr);
    var revert = false;

    if (!arr.length) {
      return [];
    }

    if (opts.randomize) {
      return randomize(arr);
    } // Sort the elements by the opts.by function.
    // If we don't have opts.by, default to DOM order


    if (typeof opts.by === 'function') {
      arr.sort(function (a, b) {
        // Exit early if we already know we want to revert
        if (revert) {
          return 0;
        }

        var valA = opts.by(a[opts.key]);
        var valB = opts.by(b[opts.key]); // If both values are undefined, use the DOM order

        if (valA === undefined && valB === undefined) {
          revert = true;
          return 0;
        }

        if (valA < valB || valA === 'sortFirst' || valB === 'sortLast') {
          return -1;
        }

        if (valA > valB || valA === 'sortLast' || valB === 'sortFirst') {
          return 1;
        }

        return 0;
      });
    } else if (typeof opts.compare === 'function') {
      arr.sort(opts.compare);
    } // Revert to the original array if necessary


    if (revert) {
      return original;
    }

    if (opts.reverse) {
      arr.reverse();
    }

    return arr;
  }

  var transitions = {};
  var eventName = 'transitionend';
  var count = 0;

  function uniqueId() {
    count += 1;
    return eventName + count;
  }

  function cancelTransitionEnd(id) {
    if (transitions[id]) {
      transitions[id].element.removeEventListener(eventName, transitions[id].listener);
      transitions[id] = null;
      return true;
    }

    return false;
  }
  function onTransitionEnd(element, callback) {
    var id = uniqueId();

    var listener = function listener(evt) {
      if (evt.currentTarget === evt.target) {
        cancelTransitionEnd(id);
        callback(evt);
      }
    };

    element.addEventListener(eventName, listener);
    transitions[id] = {
      element: element,
      listener: listener
    };
    return id;
  }

  function arrayMax(array) {
    return Math.max.apply(Math, array); // eslint-disable-line prefer-spread
  }

  function arrayMin(array) {
    return Math.min.apply(Math, array); // eslint-disable-line prefer-spread
  }

  /**
   * Determine the number of columns an items spans.
   * @param {number} itemWidth Width of the item.
   * @param {number} columnWidth Width of the column (includes gutter).
   * @param {number} columns Total number of columns
   * @param {number} threshold A buffer value for the size of the column to fit.
   * @return {number}
   */

  function getColumnSpan(itemWidth, columnWidth, columns, threshold) {
    var columnSpan = itemWidth / columnWidth; // If the difference between the rounded column span number and the
    // calculated column span number is really small, round the number to
    // make it fit.

    if (Math.abs(Math.round(columnSpan) - columnSpan) < threshold) {
      // e.g. columnSpan = 4.0089945390298745
      columnSpan = Math.round(columnSpan);
    } // Ensure the column span is not more than the amount of columns in the whole layout.


    return Math.min(Math.ceil(columnSpan), columns);
  }
  /**
   * Retrieves the column set to use for placement.
   * @param {number} columnSpan The number of columns this current item spans.
   * @param {number} columns The total columns in the grid.
   * @return {Array.<number>} An array of numbers represeting the column set.
   */

  function getAvailablePositions(positions, columnSpan, columns) {
    // The item spans only one column.
    if (columnSpan === 1) {
      return positions;
    } // The item spans more than one column, figure out how many different
    // places it could fit horizontally.
    // The group count is the number of places within the positions this block
    // could fit, ignoring the current positions of items.
    // Imagine a 2 column brick as the second item in a 4 column grid with
    // 10px height each. Find the places it would fit:
    // [20, 10, 10, 0]
    //  |   |   |
    //  *   *   *
    //
    // Then take the places which fit and get the bigger of the two:
    // max([20, 10]), max([10, 10]), max([10, 0]) = [20, 10, 10]
    //
    // Next, find the first smallest number (the short column).
    // [20, 10, 10]
    //      |
    //      *
    //
    // And that's where it should be placed!
    //
    // Another example where the second column's item extends past the first:
    // [10, 20, 10, 0] => [20, 20, 10] => 10


    var available = []; // For how many possible positions for this item there are.

    for (var i = 0; i <= columns - columnSpan; i++) {
      // Find the bigger value for each place it could fit.
      available.push(arrayMax(positions.slice(i, i + columnSpan)));
    }

    return available;
  }
  /**
   * Find index of short column, the first from the left where this item will go.
   *
   * @param {Array.<number>} positions The array to search for the smallest number.
   * @param {number} buffer Optional buffer which is very useful when the height
   *     is a percentage of the width.
   * @return {number} Index of the short column.
   */

  function getShortColumn(positions, buffer) {
    var minPosition = arrayMin(positions);

    for (var i = 0, len = positions.length; i < len; i++) {
      if (positions[i] >= minPosition - buffer && positions[i] <= minPosition + buffer) {
        return i;
      }
    }

    return 0;
  }
  /**
   * Determine the location of the next item, based on its size.
   * @param {Object} itemSize Object with width and height.
   * @param {Array.<number>} positions Positions of the other current items.
   * @param {number} gridSize The column width or row height.
   * @param {number} total The total number of columns or rows.
   * @param {number} threshold Buffer value for the column to fit.
   * @param {number} buffer Vertical buffer for the height of items.
   * @return {Point}
   */

  function getItemPosition(_ref) {
    var itemSize = _ref.itemSize,
        positions = _ref.positions,
        gridSize = _ref.gridSize,
        total = _ref.total,
        threshold = _ref.threshold,
        buffer = _ref.buffer;
    var span = getColumnSpan(itemSize.width, gridSize, total, threshold);
    var setY = getAvailablePositions(positions, span, total);
    var shortColumnIndex = getShortColumn(setY, buffer); // Position the item

    var point = new Point(gridSize * shortColumnIndex, setY[shortColumnIndex]); // Update the columns array with the new values for each column.
    // e.g. before the update the columns could be [250, 0, 0, 0] for an item
    // which spans 2 columns. After it would be [250, itemHeight, itemHeight, 0].

    var setHeight = setY[shortColumnIndex] + itemSize.height;

    for (var i = 0; i < span; i++) {
      positions[shortColumnIndex + i] = setHeight;
    }

    return point;
  }
  /**
   * This method attempts to center items. This method could potentially be slow
   * with a large number of items because it must place items, then check every
   * previous item to ensure there is no overlap.
   * @param {Array.<Rect>} itemRects Item data objects.
   * @param {number} containerWidth Width of the containing element.
   * @return {Array.<Point>}
   */

  function getCenteredPositions(itemRects, containerWidth) {
    var rowMap = {}; // Populate rows by their offset because items could jump between rows like:
    // a   c
    //  bbb

    itemRects.forEach(function (itemRect) {
      if (rowMap[itemRect.top]) {
        // Push the point to the last row array.
        rowMap[itemRect.top].push(itemRect);
      } else {
        // Start of a new row.
        rowMap[itemRect.top] = [itemRect];
      }
    }); // For each row, find the end of the last item, then calculate
    // the remaining space by dividing it by 2. Then add that
    // offset to the x position of each point.

    var rects = [];
    var rows = [];
    var centeredRows = [];
    Object.keys(rowMap).forEach(function (key) {
      var itemRects = rowMap[key];
      rows.push(itemRects);
      var lastItem = itemRects[itemRects.length - 1];
      var end = lastItem.left + lastItem.width;
      var offset = Math.round((containerWidth - end) / 2);
      var finalRects = itemRects;
      var canMove = false;

      if (offset > 0) {
        var newRects = [];
        canMove = itemRects.every(function (r) {
          var newRect = new Rect(r.left + offset, r.top, r.width, r.height, r.id); // Check all current rects to make sure none overlap.

          var noOverlap = !rects.some(function (r) {
            return Rect.intersects(newRect, r);
          });
          newRects.push(newRect);
          return noOverlap;
        }); // If none of the rectangles overlapped, the whole group can be centered.

        if (canMove) {
          finalRects = newRects;
        }
      } // If the items are not going to be offset, ensure that the original
      // placement for this row will not overlap previous rows (row-spanning
      // elements could be in the way).


      if (!canMove) {
        var intersectingRect;
        var hasOverlap = itemRects.some(function (itemRect) {
          return rects.some(function (r) {
            var intersects = Rect.intersects(itemRect, r);

            if (intersects) {
              intersectingRect = r;
            }

            return intersects;
          });
        }); // If there is any overlap, replace the overlapping row with the original.

        if (hasOverlap) {
          var rowIndex = centeredRows.findIndex(function (items) {
            return items.includes(intersectingRect);
          });
          centeredRows.splice(rowIndex, 1, rows[rowIndex]);
        }
      }

      rects = rects.concat(finalRects);
      centeredRows.push(finalRects);
    }); // Reduce array of arrays to a single array of points.
    // https://stackoverflow.com/a/10865042/373422
    // Then reset sort back to how the items were passed to this method.
    // Remove the wrapper object with index, map to a Point.

    return [].concat.apply([], centeredRows) // eslint-disable-line prefer-spread
    .sort(function (a, b) {
      return a.id - b.id;
    }).map(function (itemRect) {
      return new Point(itemRect.left, itemRect.top);
    });
  }

  /**
   * Hyphenates a javascript style string to a css one. For example:
   * MozBoxSizing -> -moz-box-sizing.
   * @param {string} str The string to hyphenate.
   * @return {string} The hyphenated string.
   */
  function hyphenate(str) {
    return str.replace(/([A-Z])/g, function (str, m1) {
      return "-".concat(m1.toLowerCase());
    });
  }

  function arrayUnique(x) {
    return Array.from(new Set(x));
  } // Used for unique instance variables


  var id = 0;

  var Shuffle = /*#__PURE__*/function (_TinyEmitter) {
    _inherits(Shuffle, _TinyEmitter);

    var _super = _createSuper(Shuffle);

    /**
     * Categorize, sort, and filter a responsive grid of items.
     *
     * @param {Element} element An element which is the parent container for the grid items.
     * @param {Object} [options=Shuffle.options] Options object.
     * @constructor
     */
    function Shuffle(element) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Shuffle);

      _this = _super.call(this); // eslint-disable-next-line prefer-object-spread

      _this.options = Object.assign({}, Shuffle.options, options); // Allow misspelling of delimiter since that's how it used to be.
      // Remove in v6.

      if (_this.options.delimeter) {
        _this.options.delimiter = _this.options.delimeter;
      }

      _this.lastSort = {};
      _this.group = Shuffle.ALL_ITEMS;
      _this.lastFilter = Shuffle.ALL_ITEMS;
      _this.isEnabled = true;
      _this.isDestroyed = false;
      _this.isInitialized = false;
      _this._transitions = [];
      _this.isTransitioning = false;
      _this._queue = [];

      var el = _this._getElementOption(element);

      if (!el) {
        throw new TypeError('Shuffle needs to be initialized with an element.');
      }

      _this.element = el;
      _this.id = 'shuffle_' + id;
      id += 1;

      _this._init();

      _this.isInitialized = true;
      return _this;
    }

    _createClass(Shuffle, [{
      key: "_init",
      value: function _init() {
        this.items = this._getItems();
        this.options.sizer = this._getElementOption(this.options.sizer); // Add class and invalidate styles

        this.element.classList.add(Shuffle.Classes.BASE); // Set initial css for each item

        this._initItems(this.items); // Bind resize events


        this._onResize = this._getResizeFunction();
        window.addEventListener('resize', this._onResize); // If the page has not already emitted the `load` event, call layout on load.
        // This avoids layout issues caused by images and fonts loading after the
        // instance has been initialized.

        if (document.readyState !== 'complete') {
          var layout = this.layout.bind(this);
          window.addEventListener('load', function onLoad() {
            window.removeEventListener('load', onLoad);
            layout();
          });
        } // Get container css all in one request. Causes reflow


        var containerCss = window.getComputedStyle(this.element, null);
        var containerWidth = Shuffle.getSize(this.element).width; // Add styles to the container if it doesn't have them.

        this._validateStyles(containerCss); // We already got the container's width above, no need to cause another
        // reflow getting it again... Calculate the number of columns there will be


        this._setColumns(containerWidth); // Kick off!


        this.filter(this.options.group, this.options.initialSort); // The shuffle items haven't had transitions set on them yet so the user
        // doesn't see the first layout. Set them now that the first layout is done.
        // First, however, a synchronous layout must be caused for the previous
        // styles to be applied without transitions.

        this.element.offsetWidth; // eslint-disable-line no-unused-expressions

        this.setItemTransitions(this.items);
        this.element.style.transition = "height ".concat(this.options.speed, "ms ").concat(this.options.easing);
      }
      /**
       * Returns a throttled and proxied function for the resize handler.
       * @return {function}
       * @private
       */

    }, {
      key: "_getResizeFunction",
      value: function _getResizeFunction() {
        var resizeFunction = this._handleResize.bind(this);

        return this.options.throttle ? this.options.throttle(resizeFunction, this.options.throttleTime) : resizeFunction;
      }
      /**
       * Retrieve an element from an option.
       * @param {string|jQuery|Element} option The option to check.
       * @return {?Element} The plain element or null.
       * @private
       */

    }, {
      key: "_getElementOption",
      value: function _getElementOption(option) {
        // If column width is a string, treat is as a selector and search for the
        // sizer element within the outermost container
        if (typeof option === 'string') {
          return this.element.querySelector(option);
        } // Check for an element


        if (option && option.nodeType && option.nodeType === 1) {
          return option;
        } // Check for jQuery object


        if (option && option.jquery) {
          return option[0];
        }

        return null;
      }
      /**
       * Ensures the shuffle container has the css styles it needs applied to it.
       * @param {Object} styles Key value pairs for position and overflow.
       * @private
       */

    }, {
      key: "_validateStyles",
      value: function _validateStyles(styles) {
        // Position cannot be static.
        if (styles.position === 'static') {
          this.element.style.position = 'relative';
        } // Overflow has to be hidden.


        if (styles.overflow !== 'hidden') {
          this.element.style.overflow = 'hidden';
        }
      }
      /**
       * Filter the elements by a category.
       * @param {string|string[]|function(Element):boolean} [category] Category to
       *     filter by. If it's given, the last category will be used to filter the items.
       * @param {Array} [collection] Optionally filter a collection. Defaults to
       *     all the items.
       * @return {{visible: ShuffleItem[], hidden: ShuffleItem[]}}
       * @private
       */

    }, {
      key: "_filter",
      value: function _filter() {
        var category = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.lastFilter;
        var collection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.items;

        var set = this._getFilteredSets(category, collection); // Individually add/remove hidden/visible classes


        this._toggleFilterClasses(set); // Save the last filter in case elements are appended.


        this.lastFilter = category; // This is saved mainly because providing a filter function (like searching)
        // will overwrite the `lastFilter` property every time its called.

        if (typeof category === 'string') {
          this.group = category;
        }

        return set;
      }
      /**
       * Returns an object containing the visible and hidden elements.
       * @param {string|string[]|function(Element):boolean} category Category or function to filter by.
       * @param {ShuffleItem[]} items A collection of items to filter.
       * @return {{visible: ShuffleItem[], hidden: ShuffleItem[]}}
       * @private
       */

    }, {
      key: "_getFilteredSets",
      value: function _getFilteredSets(category, items) {
        var _this2 = this;

        var visible = [];
        var hidden = []; // category === 'all', add visible class to everything

        if (category === Shuffle.ALL_ITEMS) {
          visible = items; // Loop through each item and use provided function to determine
          // whether to hide it or not.
        } else {
          items.forEach(function (item) {
            if (_this2._doesPassFilter(category, item.element)) {
              visible.push(item);
            } else {
              hidden.push(item);
            }
          });
        }

        return {
          visible: visible,
          hidden: hidden
        };
      }
      /**
       * Test an item to see if it passes a category.
       * @param {string|string[]|function():boolean} category Category or function to filter by.
       * @param {Element} element An element to test.
       * @return {boolean} Whether it passes the category/filter.
       * @private
       */

    }, {
      key: "_doesPassFilter",
      value: function _doesPassFilter(category, element) {
        if (typeof category === 'function') {
          return category.call(element, element, this);
        } // Check each element's data-groups attribute against the given category.


        var attr = element.getAttribute('data-' + Shuffle.FILTER_ATTRIBUTE_KEY);
        var keys = this.options.delimiter ? attr.split(this.options.delimiter) : JSON.parse(attr);

        function testCategory(category) {
          return keys.includes(category);
        }

        if (Array.isArray(category)) {
          if (this.options.filterMode === Shuffle.FilterMode.ANY) {
            return category.some(testCategory);
          }

          return category.every(testCategory);
        }

        return keys.includes(category);
      }
      /**
       * Toggles the visible and hidden class names.
       * @param {{visible, hidden}} Object with visible and hidden arrays.
       * @private
       */

    }, {
      key: "_toggleFilterClasses",
      value: function _toggleFilterClasses(_ref) {
        var visible = _ref.visible,
            hidden = _ref.hidden;
        visible.forEach(function (item) {
          item.show();
        });
        hidden.forEach(function (item) {
          item.hide();
        });
      }
      /**
       * Set the initial css for each item
       * @param {ShuffleItem[]} items Set to initialize.
       * @private
       */

    }, {
      key: "_initItems",
      value: function _initItems(items) {
        items.forEach(function (item) {
          item.init();
        });
      }
      /**
       * Remove element reference and styles.
       * @param {ShuffleItem[]} items Set to dispose.
       * @private
       */

    }, {
      key: "_disposeItems",
      value: function _disposeItems(items) {
        items.forEach(function (item) {
          item.dispose();
        });
      }
      /**
       * Updates the visible item count.
       * @private
       */

    }, {
      key: "_updateItemCount",
      value: function _updateItemCount() {
        this.visibleItems = this._getFilteredItems().length;
      }
      /**
       * Sets css transform transition on a group of elements. This is not executed
       * at the same time as `item.init` so that transitions don't occur upon
       * initialization of a new Shuffle instance.
       * @param {ShuffleItem[]} items Shuffle items to set transitions on.
       * @protected
       */

    }, {
      key: "setItemTransitions",
      value: function setItemTransitions(items) {
        var _this$options = this.options,
            speed = _this$options.speed,
            easing = _this$options.easing;
        var positionProps = this.options.useTransforms ? ['transform'] : ['top', 'left']; // Allow users to transtion other properties if they exist in the `before`
        // css mapping of the shuffle item.

        var cssProps = Object.keys(ShuffleItem.Css.HIDDEN.before).map(function (k) {
          return hyphenate(k);
        });
        var properties = positionProps.concat(cssProps).join();
        items.forEach(function (item) {
          item.element.style.transitionDuration = speed + 'ms';
          item.element.style.transitionTimingFunction = easing;
          item.element.style.transitionProperty = properties;
        });
      }
    }, {
      key: "_getItems",
      value: function _getItems() {
        var _this3 = this;

        return Array.from(this.element.children).filter(function (el) {
          return matchesSelector(el, _this3.options.itemSelector);
        }).map(function (el) {
          return new ShuffleItem(el, _this3.options.isRTL);
        });
      }
      /**
       * Combine the current items array with a new one and sort it by DOM order.
       * @param {ShuffleItem[]} items Items to track.
       * @return {ShuffleItem[]}
       */

    }, {
      key: "_mergeNewItems",
      value: function _mergeNewItems(items) {
        var children = Array.from(this.element.children);
        return sorter(this.items.concat(items), {
          by: function by(element) {
            return children.indexOf(element);
          }
        });
      }
    }, {
      key: "_getFilteredItems",
      value: function _getFilteredItems() {
        return this.items.filter(function (item) {
          return item.isVisible;
        });
      }
    }, {
      key: "_getConcealedItems",
      value: function _getConcealedItems() {
        return this.items.filter(function (item) {
          return !item.isVisible;
        });
      }
      /**
       * Returns the column size, based on column width and sizer options.
       * @param {number} containerWidth Size of the parent container.
       * @param {number} gutterSize Size of the gutters.
       * @return {number}
       * @private
       */

    }, {
      key: "_getColumnSize",
      value: function _getColumnSize(containerWidth, gutterSize) {
        var size; // If the columnWidth property is a function, then the grid is fluid

        if (typeof this.options.columnWidth === 'function') {
          size = this.options.columnWidth(containerWidth); // columnWidth option isn't a function, are they using a sizing element?
        } else if (this.options.sizer) {
          size = Shuffle.getSize(this.options.sizer).width; // if not, how about the explicitly set option?
        } else if (this.options.columnWidth) {
          size = this.options.columnWidth; // or use the size of the first item
        } else if (this.items.length > 0) {
          size = Shuffle.getSize(this.items[0].element, true).width; // if there's no items, use size of container
        } else {
          size = containerWidth;
        } // Don't let them set a column width of zero.


        if (size === 0) {
          size = containerWidth;
        }

        return size + gutterSize;
      }
      /**
       * Returns the gutter size, based on gutter width and sizer options.
       * @param {number} containerWidth Size of the parent container.
       * @return {number}
       * @private
       */

    }, {
      key: "_getGutterSize",
      value: function _getGutterSize(containerWidth) {
        var size;

        if (typeof this.options.gutterWidth === 'function') {
          size = this.options.gutterWidth(containerWidth);
        } else if (this.options.sizer) {
          size = getNumberStyle(this.options.sizer, 'marginLeft');
        } else {
          size = this.options.gutterWidth;
        }

        return size;
      }
      /**
       * Calculate the number of columns to be used. Gets css if using sizer element.
       * @param {number} [containerWidth] Optionally specify a container width if
       *    it's already available.
       */

    }, {
      key: "_setColumns",
      value: function _setColumns() {
        var containerWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Shuffle.getSize(this.element).width;

        var gutter = this._getGutterSize(containerWidth);

        var columnWidth = this._getColumnSize(containerWidth, gutter);

        var calculatedColumns = (containerWidth + gutter) / columnWidth; // Widths given from getStyles are not precise enough...

        if (Math.abs(Math.round(calculatedColumns) - calculatedColumns) < this.options.columnThreshold) {
          // e.g. calculatedColumns = 11.998876
          calculatedColumns = Math.round(calculatedColumns);
        }

        this.cols = Math.max(Math.floor(calculatedColumns || 0), 1);
        this.containerWidth = containerWidth;
        this.colWidth = columnWidth;
      }
      /**
       * Adjust the height of the grid
       */

    }, {
      key: "_setContainerSize",
      value: function _setContainerSize() {
        this.element.style.height = this._getContainerSize() + 'px';
      }
      /**
       * Based on the column heights, it returns the biggest one.
       * @return {number}
       * @private
       */

    }, {
      key: "_getContainerSize",
      value: function _getContainerSize() {
        return arrayMax(this.positions);
      }
      /**
       * Get the clamped stagger amount.
       * @param {number} index Index of the item to be staggered.
       * @return {number}
       */

    }, {
      key: "_getStaggerAmount",
      value: function _getStaggerAmount(index) {
        return Math.min(index * this.options.staggerAmount, this.options.staggerAmountMax);
      }
      /**
       * Emit an event from this instance.
       * @param {string} name Event name.
       * @param {Object} [data={}] Optional object data.
       */

    }, {
      key: "_dispatch",
      value: function _dispatch(name) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (this.isDestroyed) {
          return;
        }

        data.shuffle = this;
        this.emit(name, data);
      }
      /**
       * Zeros out the y columns array, which is used to determine item placement.
       * @private
       */

    }, {
      key: "_resetCols",
      value: function _resetCols() {
        var i = this.cols;
        this.positions = [];

        while (i) {
          i -= 1;
          this.positions.push(0);
        }
      }
      /**
       * Loops through each item that should be shown and calculates the x, y position.
       * @param {ShuffleItem[]} items Array of items that will be shown/layed
       *     out in order in their array.
       */

    }, {
      key: "_layout",
      value: function _layout(items) {
        var _this4 = this;

        var itemPositions = this._getNextPositions(items);

        var count = 0;
        items.forEach(function (item, i) {
          function callback() {
            item.applyCss(ShuffleItem.Css.VISIBLE.after);
          } // If the item will not change its position, do not add it to the render
          // queue. Transitions don't fire when setting a property to the same value.


          if (Point.equals(item.point, itemPositions[i]) && !item.isHidden) {
            item.applyCss(ShuffleItem.Css.VISIBLE.before);
            callback();
            return;
          }

          item.point = itemPositions[i];
          item.scale = ShuffleItem.Scale.VISIBLE;
          item.isHidden = false; // Clone the object so that the `before` object isn't modified when the
          // transition delay is added.

          var styles = _this4.getStylesForTransition(item, ShuffleItem.Css.VISIBLE.before);

          styles.transitionDelay = _this4._getStaggerAmount(count) + 'ms';

          _this4._queue.push({
            item: item,
            styles: styles,
            callback: callback
          });

          count += 1;
        });
      }
      /**
       * Return an array of Point instances representing the future positions of
       * each item.
       * @param {ShuffleItem[]} items Array of sorted shuffle items.
       * @return {Point[]}
       * @private
       */

    }, {
      key: "_getNextPositions",
      value: function _getNextPositions(items) {
        var _this5 = this;

        // If position data is going to be changed, add the item's size to the
        // transformer to allow for calculations.
        if (this.options.isCentered) {
          var itemsData = items.map(function (item, i) {
            var itemSize = Shuffle.getSize(item.element, true);

            var point = _this5._getItemPosition(itemSize);

            return new Rect(point.x, point.y, itemSize.width, itemSize.height, i);
          });
          return this.getTransformedPositions(itemsData, this.containerWidth);
        } // If no transforms are going to happen, simply return an array of the
        // future points of each item.


        return items.map(function (item) {
          return _this5._getItemPosition(Shuffle.getSize(item.element, true));
        });
      }
      /**
       * Determine the location of the next item, based on its size.
       * @param {{width: number, height: number}} itemSize Object with width and height.
       * @return {Point}
       * @private
       */

    }, {
      key: "_getItemPosition",
      value: function _getItemPosition(itemSize) {
        return getItemPosition({
          itemSize: itemSize,
          positions: this.positions,
          gridSize: this.colWidth,
          total: this.cols,
          threshold: this.options.columnThreshold,
          buffer: this.options.buffer
        });
      }
      /**
       * Mutate positions before they're applied.
       * @param {Rect[]} itemRects Item data objects.
       * @param {number} containerWidth Width of the containing element.
       * @return {Point[]}
       * @protected
       */

    }, {
      key: "getTransformedPositions",
      value: function getTransformedPositions(itemRects, containerWidth) {
        return getCenteredPositions(itemRects, containerWidth);
      }
      /**
       * Hides the elements that don't match our filter.
       * @param {ShuffleItem[]} collection Collection to shrink.
       * @private
       */

    }, {
      key: "_shrink",
      value: function _shrink() {
        var _this6 = this;

        var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._getConcealedItems();
        var count = 0;
        collection.forEach(function (item) {
          function callback() {
            item.applyCss(ShuffleItem.Css.HIDDEN.after);
          } // Continuing would add a transitionend event listener to the element, but
          // that listener would not execute because the transform and opacity would
          // stay the same.
          // The callback is executed here because it is not guaranteed to be called
          // after the transitionend event because the transitionend could be
          // canceled if another animation starts.


          if (item.isHidden) {
            item.applyCss(ShuffleItem.Css.HIDDEN.before);
            callback();
            return;
          }

          item.scale = ShuffleItem.Scale.HIDDEN;
          item.isHidden = true;

          var styles = _this6.getStylesForTransition(item, ShuffleItem.Css.HIDDEN.before);

          styles.transitionDelay = _this6._getStaggerAmount(count) + 'ms';

          _this6._queue.push({
            item: item,
            styles: styles,
            callback: callback
          });

          count += 1;
        });
      }
      /**
       * Resize handler.
       * @private
       */

    }, {
      key: "_handleResize",
      value: function _handleResize() {
        // If shuffle is disabled, destroyed, don't do anything
        if (!this.isEnabled || this.isDestroyed) {
          return;
        }

        this.update();
      }
      /**
       * Returns styles which will be applied to the an item for a transition.
       * @param {ShuffleItem} item Item to get styles for. Should have updated
       *   scale and point properties.
       * @param {Object} styleObject Extra styles that will be used in the transition.
       * @return {!Object} Transforms for transitions, left/top for animate.
       * @protected
       */

    }, {
      key: "getStylesForTransition",
      value: function getStylesForTransition(item, styleObject) {
        // Clone the object to avoid mutating the original.
        // eslint-disable-next-line prefer-object-spread
        var styles = Object.assign({}, styleObject);

        if (this.options.useTransforms) {
          var sign = this.options.isRTL ? '-' : '';
          var x = this.options.roundTransforms ? Math.round(item.point.x) : item.point.x;
          var y = this.options.roundTransforms ? Math.round(item.point.y) : item.point.y;
          styles.transform = "translate(".concat(sign).concat(x, "px, ").concat(y, "px) scale(").concat(item.scale, ")");
        } else {
          if (this.options.isRTL) {
            styles.right = item.point.x + 'px';
          } else {
            styles.left = item.point.x + 'px';
          }

          styles.top = item.point.y + 'px';
        }

        return styles;
      }
      /**
       * Listen for the transition end on an element and execute the itemCallback
       * when it finishes.
       * @param {Element} element Element to listen on.
       * @param {function} itemCallback Callback for the item.
       * @param {function} done Callback to notify `parallel` that this one is done.
       */

    }, {
      key: "_whenTransitionDone",
      value: function _whenTransitionDone(element, itemCallback, done) {
        var id = onTransitionEnd(element, function (evt) {
          itemCallback();
          done(null, evt);
        });

        this._transitions.push(id);
      }
      /**
       * Return a function which will set CSS styles and call the `done` function
       * when (if) the transition finishes.
       * @param {Object} opts Transition object.
       * @return {function} A function to be called with a `done` function.
       */

    }, {
      key: "_getTransitionFunction",
      value: function _getTransitionFunction(opts) {
        var _this7 = this;

        return function (done) {
          opts.item.applyCss(opts.styles);

          _this7._whenTransitionDone(opts.item.element, opts.callback, done);
        };
      }
      /**
       * Execute the styles gathered in the style queue. This applies styles to elements,
       * triggering transitions.
       * @private
       */

    }, {
      key: "_processQueue",
      value: function _processQueue() {
        if (this.isTransitioning) {
          this._cancelMovement();
        }

        var hasSpeed = this.options.speed > 0;
        var hasQueue = this._queue.length > 0;

        if (hasQueue && hasSpeed && this.isInitialized) {
          this._startTransitions(this._queue);
        } else if (hasQueue) {
          this._styleImmediately(this._queue);

          this._dispatch(Shuffle.EventType.LAYOUT); // A call to layout happened, but none of the newly visible items will
          // change position or the transition duration is zero, which will not trigger
          // the transitionend event.

        } else {
          this._dispatch(Shuffle.EventType.LAYOUT);
        } // Remove everything in the style queue


        this._queue.length = 0;
      }
      /**
       * Wait for each transition to finish, the emit the layout event.
       * @param {Object[]} transitions Array of transition objects.
       */

    }, {
      key: "_startTransitions",
      value: function _startTransitions(transitions) {
        var _this8 = this;

        // Set flag that shuffle is currently in motion.
        this.isTransitioning = true; // Create an array of functions to be called.

        var callbacks = transitions.map(function (obj) {
          return _this8._getTransitionFunction(obj);
        });
        arrayParallel(callbacks, this._movementFinished.bind(this));
      }
    }, {
      key: "_cancelMovement",
      value: function _cancelMovement() {
        // Remove the transition end event for each listener.
        this._transitions.forEach(cancelTransitionEnd); // Reset the array.


        this._transitions.length = 0; // Show it's no longer active.

        this.isTransitioning = false;
      }
      /**
       * Apply styles without a transition.
       * @param {Object[]} objects Array of transition objects.
       * @private
       */

    }, {
      key: "_styleImmediately",
      value: function _styleImmediately(objects) {
        if (objects.length) {
          var elements = objects.map(function (obj) {
            return obj.item.element;
          });

          Shuffle._skipTransitions(elements, function () {
            objects.forEach(function (obj) {
              obj.item.applyCss(obj.styles);
              obj.callback();
            });
          });
        }
      }
    }, {
      key: "_movementFinished",
      value: function _movementFinished() {
        this._transitions.length = 0;
        this.isTransitioning = false;

        this._dispatch(Shuffle.EventType.LAYOUT);
      }
      /**
       * The magic. This is what makes the plugin 'shuffle'
       * @param {string|string[]|function(Element):boolean} [category] Category to filter by.
       *     Can be a function, string, or array of strings.
       * @param {SortOptions} [sortOptions] A sort object which can sort the visible set
       */

    }, {
      key: "filter",
      value: function filter(category, sortOptions) {
        if (!this.isEnabled) {
          return;
        }

        if (!category || category && category.length === 0) {
          category = Shuffle.ALL_ITEMS; // eslint-disable-line no-param-reassign
        }

        this._filter(category); // Shrink each hidden item


        this._shrink(); // How many visible elements?


        this._updateItemCount(); // Update transforms on visible elements so they will animate to their new positions.


        this.sort(sortOptions);
      }
      /**
       * Gets the visible elements, sorts them, and passes them to layout.
       * @param {SortOptions} [sortOptions] The options object to pass to `sorter`.
       */

    }, {
      key: "sort",
      value: function sort() {
        var sortOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.lastSort;

        if (!this.isEnabled) {
          return;
        }

        this._resetCols();

        var items = sorter(this._getFilteredItems(), sortOptions);

        this._layout(items); // `_layout` always happens after `_shrink`, so it's safe to process the style
        // queue here with styles from the shrink method.


        this._processQueue(); // Adjust the height of the container.


        this._setContainerSize();

        this.lastSort = sortOptions;
      }
      /**
       * Reposition everything.
       * @param {boolean} [isOnlyLayout=false] If true, column and gutter widths won't be recalculated.
       */

    }, {
      key: "update",
      value: function update() {
        var isOnlyLayout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (this.isEnabled) {
          if (!isOnlyLayout) {
            // Get updated colCount
            this._setColumns();
          } // Layout items


          this.sort();
        }
      }
      /**
       * Use this instead of `update()` if you don't need the columns and gutters updated
       * Maybe an image inside `shuffle` loaded (and now has a height), which means calculations
       * could be off.
       */

    }, {
      key: "layout",
      value: function layout() {
        this.update(true);
      }
      /**
       * New items have been appended to shuffle. Mix them in with the current
       * filter or sort status.
       * @param {Element[]} newItems Collection of new items.
       */

    }, {
      key: "add",
      value: function add(newItems) {
        var _this9 = this;

        var items = arrayUnique(newItems).map(function (el) {
          return new ShuffleItem(el, _this9.options.isRTL);
        }); // Add classes and set initial positions.

        this._initItems(items); // Determine which items will go with the current filter.


        this._resetCols();

        var allItems = this._mergeNewItems(items);

        var sortedItems = sorter(allItems, this.lastSort);

        var allSortedItemsSet = this._filter(this.lastFilter, sortedItems);

        var isNewItem = function isNewItem(item) {
          return items.includes(item);
        };

        var applyHiddenState = function applyHiddenState(item) {
          item.scale = ShuffleItem.Scale.HIDDEN;
          item.isHidden = true;
          item.applyCss(ShuffleItem.Css.HIDDEN.before);
          item.applyCss(ShuffleItem.Css.HIDDEN.after);
        }; // Layout all items again so that new items get positions.
        // Synchonously apply positions.


        var itemPositions = this._getNextPositions(allSortedItemsSet.visible);

        allSortedItemsSet.visible.forEach(function (item, i) {
          if (isNewItem(item)) {
            item.point = itemPositions[i];
            applyHiddenState(item);
            item.applyCss(_this9.getStylesForTransition(item, {}));
          }
        });
        allSortedItemsSet.hidden.forEach(function (item) {
          if (isNewItem(item)) {
            applyHiddenState(item);
          }
        }); // Cause layout so that the styles above are applied.

        this.element.offsetWidth; // eslint-disable-line no-unused-expressions
        // Add transition to each item.

        this.setItemTransitions(items); // Update the list of items.

        this.items = this._mergeNewItems(items); // Update layout/visibility of new and old items.

        this.filter(this.lastFilter);
      }
      /**
       * Disables shuffle from updating dimensions and layout on resize
       */

    }, {
      key: "disable",
      value: function disable() {
        this.isEnabled = false;
      }
      /**
       * Enables shuffle again
       * @param {boolean} [isUpdateLayout=true] if undefined, shuffle will update columns and gutters
       */

    }, {
      key: "enable",
      value: function enable() {
        var isUpdateLayout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        this.isEnabled = true;

        if (isUpdateLayout) {
          this.update();
        }
      }
      /**
       * Remove 1 or more shuffle items.
       * @param {Element[]} elements An array containing one or more
       *     elements in shuffle
       * @return {Shuffle} The shuffle instance.
       */

    }, {
      key: "remove",
      value: function remove(elements) {
        var _this10 = this;

        if (!elements.length) {
          return;
        }

        var collection = arrayUnique(elements);
        var oldItems = collection.map(function (element) {
          return _this10.getItemByElement(element);
        }).filter(function (item) {
          return !!item;
        });

        var handleLayout = function handleLayout() {
          _this10._disposeItems(oldItems); // Remove the collection in the callback


          collection.forEach(function (element) {
            element.parentNode.removeChild(element);
          });

          _this10._dispatch(Shuffle.EventType.REMOVED, {
            collection: collection
          });
        }; // Hide collection first.


        this._toggleFilterClasses({
          visible: [],
          hidden: oldItems
        });

        this._shrink(oldItems);

        this.sort(); // Update the list of items here because `remove` could be called again
        // with an item that is in the process of being removed.

        this.items = this.items.filter(function (item) {
          return !oldItems.includes(item);
        });

        this._updateItemCount();

        this.once(Shuffle.EventType.LAYOUT, handleLayout);
      }
      /**
       * Retrieve a shuffle item by its element.
       * @param {Element} element Element to look for.
       * @return {?ShuffleItem} A shuffle item or undefined if it's not found.
       */

    }, {
      key: "getItemByElement",
      value: function getItemByElement(element) {
        return this.items.find(function (item) {
          return item.element === element;
        });
      }
      /**
       * Dump the elements currently stored and reinitialize all child elements which
       * match the `itemSelector`.
       */

    }, {
      key: "resetItems",
      value: function resetItems() {
        var _this11 = this;

        // Remove refs to current items.
        this._disposeItems(this.items);

        this.isInitialized = false; // Find new items in the DOM.

        this.items = this._getItems(); // Set initial styles on the new items.

        this._initItems(this.items);

        this.once(Shuffle.EventType.LAYOUT, function () {
          // Add transition to each item.
          _this11.setItemTransitions(_this11.items);

          _this11.isInitialized = true;
        }); // Lay out all items.

        this.filter(this.lastFilter);
      }
      /**
       * Destroys shuffle, removes events, styles, and classes
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this._cancelMovement();

        window.removeEventListener('resize', this._onResize); // Reset container styles

        this.element.classList.remove('shuffle');
        this.element.removeAttribute('style'); // Reset individual item styles

        this._disposeItems(this.items);

        this.items.length = 0;
        this._transitions.length = 0; // Null DOM references

        this.options.sizer = null;
        this.element = null; // Set a flag so if a debounced resize has been triggered,
        // it can first check if it is actually isDestroyed and not doing anything

        this.isDestroyed = true;
        this.isEnabled = false;
      }
      /**
       * Returns the outer width of an element, optionally including its margins.
       *
       * There are a few different methods for getting the width of an element, none of
       * which work perfectly for all Shuffle's use cases.
       *
       * 1. getBoundingClientRect() `left` and `right` properties.
       *   - Accounts for transform scaled elements, making it useless for Shuffle
       *   elements which have shrunk.
       * 2. The `offsetWidth` property.
       *   - This value stays the same regardless of the elements transform property,
       *   however, it does not return subpixel values.
       * 3. getComputedStyle()
       *   - This works great Chrome, Firefox, Safari, but IE<=11 does not include
       *   padding and border when box-sizing: border-box is set, requiring a feature
       *   test and extra work to add the padding back for IE and other browsers which
       *   follow the W3C spec here.
       *
       * @param {Element} element The element.
       * @param {boolean} [includeMargins=false] Whether to include margins.
       * @return {{width: number, height: number}} The width and height.
       */

    }], [{
      key: "getSize",
      value: function getSize(element) {
        var includeMargins = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        // Store the styles so that they can be used by others without asking for it again.
        var styles = window.getComputedStyle(element, null);
        var width = getNumberStyle(element, 'width', styles);
        var height = getNumberStyle(element, 'height', styles);

        if (includeMargins) {
          var marginLeft = getNumberStyle(element, 'marginLeft', styles);
          var marginRight = getNumberStyle(element, 'marginRight', styles);
          var marginTop = getNumberStyle(element, 'marginTop', styles);
          var marginBottom = getNumberStyle(element, 'marginBottom', styles);
          width += marginLeft + marginRight;
          height += marginTop + marginBottom;
        }

        return {
          width: width,
          height: height
        };
      }
      /**
       * Change a property or execute a function which will not have a transition
       * @param {Element[]} elements DOM elements that won't be transitioned.
       * @param {function} callback A function which will be called while transition
       *     is set to 0ms.
       * @private
       */

    }, {
      key: "_skipTransitions",
      value: function _skipTransitions(elements, callback) {
        var zero = '0ms'; // Save current duration and delay.

        var data = elements.map(function (element) {
          var style = element.style;
          var duration = style.transitionDuration;
          var delay = style.transitionDelay; // Set the duration to zero so it happens immediately

          style.transitionDuration = zero;
          style.transitionDelay = zero;
          return {
            duration: duration,
            delay: delay
          };
        });
        callback(); // Cause forced synchronous layout.

        elements[0].offsetWidth; // eslint-disable-line no-unused-expressions
        // Put the duration back

        elements.forEach(function (element, i) {
          element.style.transitionDuration = data[i].duration;
          element.style.transitionDelay = data[i].delay;
        });
      }
    }]);

    return Shuffle;
  }(tinyEmitter);

  Shuffle.ShuffleItem = ShuffleItem;
  Shuffle.ALL_ITEMS = 'all';
  Shuffle.FILTER_ATTRIBUTE_KEY = 'groups';
  /** @enum {string} */

  Shuffle.EventType = {
    LAYOUT: 'shuffle:layout',
    REMOVED: 'shuffle:removed'
  };
  /** @enum {string} */

  Shuffle.Classes = Classes;
  /** @enum {string} */

  Shuffle.FilterMode = {
    ANY: 'any',
    ALL: 'all'
  }; // Overrideable options

  Shuffle.options = {
    // Initial filter group.
    group: Shuffle.ALL_ITEMS,
    // Transition/animation speed (milliseconds).
    speed: 250,
    // CSS easing function to use.
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    // e.g. '.picture-item'.
    itemSelector: '*',
    // Element or selector string. Use an element to determine the size of columns
    // and gutters.
    sizer: null,
    // A static number or function that tells the plugin how wide the gutters
    // between columns are (in pixels).
    gutterWidth: 0,
    // A static number or function that returns a number which tells the plugin
    // how wide the columns are (in pixels).
    columnWidth: 0,
    // If your group is not json, and is comma delimeted, you could set delimiter
    // to ','.
    delimiter: null,
    // Useful for percentage based heights when they might not always be exactly
    // the same (in pixels).
    buffer: 0,
    // Reading the width of elements isn't precise enough and can cause columns to
    // jump between values.
    columnThreshold: 0.01,
    // Shuffle can be isInitialized with a sort object. It is the same object
    // given to the sort method.
    initialSort: null,
    // By default, shuffle will throttle resize events. This can be changed or
    // removed.
    throttle: throttleit,
    // How often shuffle can be called on resize (in milliseconds).
    throttleTime: 300,
    // Transition delay offset for each item in milliseconds.
    staggerAmount: 15,
    // Maximum stagger delay in milliseconds.
    staggerAmountMax: 150,
    // Whether to use transforms or absolute positioning.
    useTransforms: true,
    // Affects using an array with filter. e.g. `filter(['one', 'two'])`. With "any",
    // the element passes the test if any of its groups are in the array. With "all",
    // the element only passes if all groups are in the array.
    filterMode: Shuffle.FilterMode.ANY,
    // Attempt to center grid items in each row.
    isCentered: false,
    // Attempt to align grid items to right.
    isRTL: false,
    // Whether to round pixel values used in translate(x, y). This usually avoids
    // blurriness.
    roundTransforms: true
  };
  Shuffle.Point = Point;
  Shuffle.Rect = Rect; // Expose for testing. Hack at your own risk.

  Shuffle.__sorter = sorter;
  Shuffle.__getColumnSpan = getColumnSpan;
  Shuffle.__getAvailablePositions = getAvailablePositions;
  Shuffle.__getShortColumn = getShortColumn;
  Shuffle.__getCenteredPositions = getCenteredPositions;

  return Shuffle;

})));


},{}]},{},[1]);
