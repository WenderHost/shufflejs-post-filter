(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _shufflejsInit = _interopRequireDefault(require("./shufflejs-init"));

var filters = new _shufflejsInit["default"](); // Handle the submission of the newsletter sign up
// form by hiding the form after the submission and
// displaying the confirmation message.

var newsletterForm = document.getElementById("newslettersignup");

if (newsletterForm.addEventListener) {
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

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _shufflejs = _interopRequireDefault(require("shufflejs"));

var _utilities = require("./utilities");

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

    this.filters = [];
    this.postType = wpvars.post_type;
    this.category = wpvars.category;
    this.gridId = wpvars.gridId;
    this.posts = wpvars.posts;
    this.defaultThumbnail = wpvars.defaultThumbnail;
    this.filterClassName = wpvars.filter_class_name;
    this.page_number = 1;
    this.page_size = parseInt(wpvars.limit);
    this.total_pages = -1 === this.page_size ? 1 : Math.ceil(this.posts.length / this.page_size);
    this.filterGroups = document.getElementsByClassName(wpvars.filter_class_name);
    this.loadMoreButton = document.getElementById('load-more');
    this.loadPosts();
    this.addLinkEventListener();
    this.addLoadMoreListener();
    this.initializeFilterGroups();
    if (0 < this.subCategoryArray.length || 0 < this.certificationArray.length) this.deepLink();
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
        } //this.applyFilters()

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
      for (var _i6 = 0, _Object$entries6 = Object.entries(this.filterGroups); _i6 < _Object$entries6.length; _i6++) {
        var _Object$entries6$_i = (0, _slicedToArray2["default"])(_Object$entries6[_i6], 2),
            key = _Object$entries6$_i[0],
            value = _Object$entries6$_i[1];

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
          post = "\n        <li class=\"list-item ".concat(this.postType, "\" data-groups='").concat(JSON.stringify(el.groups), "'>\n          <a href=\"").concat(el.permalink, "\">\n            <div class=\"flip-card\">\n              <div class=\"flip-card-inner\">\n                <div class=\"flip-card-front\">\n                  <div class=\"course-title\">\n                    <h3>").concat(el.title, "</h3>\n                    ").concat(newTag, "\n                  </div>\n                  <div class=\"course-meta\">\n                    <div class=\"course-meta-row\">\n                      <div class=\"course-meta-col\">\n                        <div class=\"icon duration\"></div>\n                        <div class=\"text\">").concat(el.meta.course_duration, "</div>\n                      </div>\n                      <div class=\"course-meta-col\">\n                        <div class=\"text\">").concat(el.meta.course_reference, "</div>\n                      </div>\n                    </div>\n                    <div class=\"course-meta-row\">\n                      <div class=\"course-meta-col ").concat(el.meta.face_to_face, "\">\n                        <div class=\"icon face-to-face ").concat(el.meta.face_to_face, "\"></div>\n                        <div class=\"text\">Face-to-Face</div>\n                      </div>\n                      <div class=\"course-meta-col ").concat(el.meta.virtual, "\">\n                        <div class=\"icon virtual ").concat(el.meta.virtual, "\"></div>\n                        <div class=\"text\"><span>Virtual<br/>OpenClass&reg;</span></div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"flip-card-back\">\n                  <h3>").concat(el.title, "</h3>\n                  <p>").concat(el.excerpt, "</p>\n                </div>\n              </div>\n            </div>\n          </a>\n        </li>");
          break;

        default:
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

},{"./utilities":3,"@babel/runtime/helpers/classCallCheck":6,"@babel/runtime/helpers/createClass":7,"@babel/runtime/helpers/interopRequireDefault":8,"@babel/runtime/helpers/slicedToArray":11,"shufflejs":14}],3:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],6:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
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
},{}],8:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
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
},{}],10:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
},{}],11:[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var unsupportedIterableToArray = require("./unsupportedIterableToArray");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":5,"./iterableToArrayLimit":9,"./nonIterableRest":10,"./unsupportedIterableToArray":13}],12:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],13:[function(require,module,exports){
var arrayLikeToArray = require("./arrayLikeToArray");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
},{"./arrayLikeToArray":4}],14:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Shuffle = factory());
}(this, function () { 'use strict';

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

  var Point =
  /*#__PURE__*/
  function () {
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

  var Rect =
  /*#__PURE__*/
  function () {
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

  var id = 0;

  var ShuffleItem =
  /*#__PURE__*/
  function () {
    function ShuffleItem(element) {
      _classCallCheck(this, ShuffleItem);

      id += 1;
      this.id = id;
      this.element = element;
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
      left: 0,
      visibility: 'visible',
      willChange: 'transform'
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


  var id$1 = 0;

  var Shuffle =
  /*#__PURE__*/
  function (_TinyEmitter) {
    _inherits(Shuffle, _TinyEmitter);

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

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Shuffle).call(this));
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
      _this.id = 'shuffle_' + id$1;
      id$1 += 1;

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
          return new ShuffleItem(el);
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
        var styles = Object.assign({}, styleObject);

        if (this.options.useTransforms) {
          var x = this.options.roundTransforms ? Math.round(item.point.x) : item.point.x;
          var y = this.options.roundTransforms ? Math.round(item.point.y) : item.point.y;
          styles.transform = "translate(".concat(x, "px, ").concat(y, "px) scale(").concat(item.scale, ")");
        } else {
          styles.left = item.point.x + 'px';
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
          return new ShuffleItem(el);
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

}));


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvanMvc3JjL21haW4uanMiLCJsaWIvanMvc3JjL3NodWZmbGVqcy1pbml0LmpzIiwibGliL2pzL3NyYy91dGlsaXRpZXMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheUxpa2VUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXJyYXlXaXRoSG9sZXMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW50ZXJvcFJlcXVpcmVEZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaXRlcmFibGVUb0FycmF5TGltaXQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9ub25JdGVyYWJsZVJlc3QuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdHlwZW9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvc2h1ZmZsZWpzL2Rpc3Qvc2h1ZmZsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQTs7QUFFQSxJQUFNLE9BQU8sR0FBRyxJQUFJLHlCQUFKLEVBQWhC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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBQb3N0RmlsdGVycyBmcm9tICcuL3NodWZmbGVqcy1pbml0J1xuXG5jb25zdCBmaWx0ZXJzID0gbmV3IFBvc3RGaWx0ZXJzKClcblxuLy8gSGFuZGxlIHRoZSBzdWJtaXNzaW9uIG9mIHRoZSBuZXdzbGV0dGVyIHNpZ24gdXBcbi8vIGZvcm0gYnkgaGlkaW5nIHRoZSBmb3JtIGFmdGVyIHRoZSBzdWJtaXNzaW9uIGFuZFxuLy8gZGlzcGxheWluZyB0aGUgY29uZmlybWF0aW9uIG1lc3NhZ2UuXG52YXIgbmV3c2xldHRlckZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgbmV3c2xldHRlcnNpZ251cGApO1xuaWYoIG5ld3NsZXR0ZXJGb3JtLmFkZEV2ZW50TGlzdGVuZXIgKXtcbiAgbmV3c2xldHRlckZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZyhg8J+UlCBmb3JtIGhhcyBiZWVuIHN1Ym1pdHRlZGApO1xuICAgIG5ld3NsZXR0ZXJGb3JtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgdmFyIHBhcmVudCA9IG5ld3NsZXR0ZXJGb3JtLnBhcmVudE5vZGU7XG4gICAgcGFyZW50LmlubmVySFRNTCA9IHBhcmVudC5pbm5lckhUTUwgKyBgPHA+JHt3cHZhcnMuY29uZmlybWF0aW9uTWVzc2FnZX08L3A+YDtcbiAgfSwgZmFsc2UgKTtcbn0iLCJpbXBvcnQgU2h1ZmZsZSBmcm9tICdzaHVmZmxlanMnXG5pbXBvcnQgeyB0cnVuY2F0ZSwgZXhwbG9kZSB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuXG5jbGFzcyBQb3N0RmlsdGVycyB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgbGV0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaClcblxuICAgIGxldCBzdWJDYXRlZ29yeVN0ciA9IHVybFBhcmFtcy5nZXQoJ3N1Yi1jYXRlZ29yeScpXG4gICAgdGhpcy5zdWJDYXRlZ29yeUFycmF5ID0gW11cbiAgICBpZiggbnVsbCAhPSBzdWJDYXRlZ29yeVN0ciApe1xuICAgICAgaWYoIC0xIDwgc3ViQ2F0ZWdvcnlTdHIuaW5kZXhPZignLCcpICl7XG4gICAgICAgIHRoaXMuc3ViQ2F0ZWdvcnlBcnJheSA9IGV4cGxvZGUoJywnLCBzdWJDYXRlZ29yeVN0cilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3ViQ2F0ZWdvcnlBcnJheSA9IFsgc3ViQ2F0ZWdvcnlTdHIgXVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBjZXJ0aWZpY2F0aW9uU3RyID0gdXJsUGFyYW1zLmdldCgnY2VydGlmaWNhdGlvbicpXG4gICAgdGhpcy5jZXJ0aWZpY2F0aW9uQXJyYXkgPSBbXVxuICAgIGlmKCBudWxsICE9IGNlcnRpZmljYXRpb25TdHIgKXtcbiAgICAgIGlmKCAtMSA8IGNlcnRpZmljYXRpb25TdHIuaW5kZXhPZignLCcpICl7XG4gICAgICAgIHRoaXMuY2VydGlmaWNhdGlvbkFycmF5ID0gZXhwbG9kZSgnLCcsIGNlcnRpZmljYXRpb25TdHIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNlcnRpZmljYXRpb25BcnJheSA9IFsgY2VydGlmaWNhdGlvblN0ciBdXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5maWx0ZXJzID0gW11cbiAgICB0aGlzLnBvc3RUeXBlID0gd3B2YXJzLnBvc3RfdHlwZVxuICAgIHRoaXMuY2F0ZWdvcnkgPSB3cHZhcnMuY2F0ZWdvcnlcbiAgICB0aGlzLmdyaWRJZCA9IHdwdmFycy5ncmlkSWRcbiAgICB0aGlzLnBvc3RzID0gd3B2YXJzLnBvc3RzXG4gICAgdGhpcy5kZWZhdWx0VGh1bWJuYWlsID0gd3B2YXJzLmRlZmF1bHRUaHVtYm5haWxcbiAgICB0aGlzLmZpbHRlckNsYXNzTmFtZSA9IHdwdmFycy5maWx0ZXJfY2xhc3NfbmFtZVxuICAgIHRoaXMucGFnZV9udW1iZXIgPSAxXG4gICAgdGhpcy5wYWdlX3NpemUgPSBwYXJzZUludCh3cHZhcnMubGltaXQpXG4gICAgdGhpcy50b3RhbF9wYWdlcyA9ICggLTEgPT09IHRoaXMucGFnZV9zaXplICk/IDEgOiBNYXRoLmNlaWwoIHRoaXMucG9zdHMubGVuZ3RoL3RoaXMucGFnZV9zaXplIClcbiAgICB0aGlzLmZpbHRlckdyb3VwcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIHdwdmFycy5maWx0ZXJfY2xhc3NfbmFtZSApXG4gICAgdGhpcy5sb2FkTW9yZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkLW1vcmUnKVxuICAgIHRoaXMubG9hZFBvc3RzKClcbiAgICB0aGlzLmFkZExpbmtFdmVudExpc3RlbmVyKClcbiAgICB0aGlzLmFkZExvYWRNb3JlTGlzdGVuZXIoKVxuICAgIHRoaXMuaW5pdGlhbGl6ZUZpbHRlckdyb3VwcygpXG4gICAgaWYoIDAgPCB0aGlzLnN1YkNhdGVnb3J5QXJyYXkubGVuZ3RoIHx8IDAgPCB0aGlzLmNlcnRpZmljYXRpb25BcnJheS5sZW5ndGggKVxuICAgICAgdGhpcy5kZWVwTGluaygpXG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlcyB0aGUgZnVuY3Rpb25hbGl0eSBvZiB0aGUgTE9BRCBNT1JFIGJ1dHRvblxuICAgKi9cbiAgYWRkTG9hZE1vcmVMaXN0ZW5lcigpe1xuICAgIHRoaXMubG9hZE1vcmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB0aGlzLmNsZWFyQWxsRmlsdGVycygpIC8vIFdlIG5lZWQgdG8gY2xlYXIgYWxsIGZpbHRlcnMsIG90aGVyd2lzZSB0aGUgZmlyc3QgcG9zaXRpb24gaW4gdGhlIGxpc3Qgb2YgcG9zdHMgaXMgZW1wdHkuXG4gICAgICB0aGlzLmluaXRpYWxpemVGaWx0ZXJHcm91cHMoKSAvLyBBZGRzIC5zZWxlY3QgdG8gdGhlIFwiQWxsXCIgZmlsdGVyXG4gICAgICB0aGlzLnNodWZmbGUuZmlsdGVyKClcbiAgICAgIHRoaXMubG9hZFBvc3RzKClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgZXZlbnQgbGlzdGVuZXIgdG8gZWFjaCAuZmlsdGVyLWxpbmstZ3JvdXAgdWwgPiBsaSA+IGFcbiAgICovXG4gIGFkZExpbmtFdmVudExpc3RlbmVyKCl7XG4gICAgZm9yKCBsZXQgW2tleSx2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5maWx0ZXJHcm91cHMpKXtcbiAgICAgIGNvbnN0IGZpbHRlckxpbmtzID0gdmFsdWUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2EnKVxuICAgICAgZm9yKCBsZXQgW2tleSxsaW5rXSBvZiBPYmplY3QuZW50cmllcyhmaWx0ZXJMaW5rcykpe1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSBsaW5rLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXInKVxuICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZXZlbnQpID0+IHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgICBpZiggJ2dyb3VwcycgIT09IFNodWZmbGUuRklMVEVSX0FUVFJJQlVURV9LRVkgKXtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJBbGxGaWx0ZXJzKClcbiAgICAgICAgICAgIFNodWZmbGUuRklMVEVSX0FUVFJJQlVURV9LRVkgPSAnZ3JvdXBzJ1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIENsZWFyIHRoZSB0ZXh0IHNlYXJjaCBmaWVsZFxuICAgICAgICAgIC8vdGhpcy5yZW1vdmVTZWFyY2hUZXh0KClcblxuICAgICAgICAgIC8vIFJlbW92ZSBhbGwgZmlsdGVyaW5nIGZvciBhIHRheG9ub215IGlmICcqJyA9PT0gZmlsdGVyXG4gICAgICAgICAgaWYoICcqJyA9PT0gZmlsdGVyICl7XG4gICAgICAgICAgICB0aGlzLl9jbGVhckFsbEZpbHRlcnNGb3JUYXhvbm9teShsaW5rKVxuICAgICAgICAgICAgbGluay5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFyQWxsRmlsdGVyc0ZvclRheG9ub215KGxpbmspXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUZpbHRlcihmaWx0ZXIpXG4gICAgICAgICAgICBpZiggdGhpcy5oYXNGaWx0ZXIoZmlsdGVyKSApe1xuICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vdGhpcy5fY2xlYXJBbGxGaWx0ZXJzRm9yVGF4b25vbXkobGluaylcbiAgICAgICAgICAgICAgbGluay5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8qKi9cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGBmaWx0ZXJgIHRvIHRoaXMuZmlsdGVyc1xuICAgKlxuICAgKiBAcGFyYW0gICAgICB7c3RyaW5nfSAgZmlsdGVyICBUaGUgZmlsdGVyXG4gICAqL1xuICBhZGRGaWx0ZXIoIGZpbHRlciApe1xuICAgIGlmKCAtMSA9PT0gdGhpcy5maWx0ZXJzLmluZGV4T2YoZmlsdGVyKSApe1xuICAgICAgdGhpcy5maWx0ZXJzLnB1c2goZmlsdGVyKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyBTaHVmZmxlSlMuc2h1ZmZsZSB3aXRoIG91ciBmaWx0ZXJzXG4gICAqL1xuICBhcHBseUZpbHRlcnMoKXtcbiAgICB2YXIgZmlsdGVycyA9IHRoaXMuZmlsdGVyc1xuICAgIGNvbnNvbGUubG9nKCfwn5SUIEZpbHRlcmluZyB3aXRoOiAnLCBmaWx0ZXJzIClcbiAgICB0aGlzLnNodWZmbGUuZmlsdGVyKCBmaWx0ZXJzIClcbiAgfVxuXG4gIGNsZWFyQWxsRmlsdGVycygpe1xuICAgIGNvbnN0IGZpbHRlcnMgPSB0aGlzLmZpbHRlcnNcbiAgICBmaWx0ZXJzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlRmlsdGVyKGVsZW1lbnQpXG4gICAgfSlcbiAgfVxuXG4gIF9jbGVhckFsbEZpbHRlcnNGb3JUYXhvbm9teSggbGlua0VsICl7XG4gICAgY29uc3QgY2xvc2VzdFBhcmVudCA9IGxpbmtFbC5jbG9zZXN0KCcuZmlsdGVyLWxpbmstZ3JvdXAnKVxuICAgIGNvbnN0IHRheG9ub215ID0gY2xvc2VzdFBhcmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGF4b25vbXknKVxuICAgIGNvbnN0IGxpc3RJdGVtcyA9IGNsb3Nlc3RQYXJlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJylcbiAgICBjb25zb2xlLmxvZyhg8J+UlCBDbGVhcmluZyBhbGwgZmlsdGVycyBmb3IgXCIke3RheG9ub215fVwiLi4uYClcbiAgICBmb3IoIGxldCBba2V5LGxpc3RJdGVtXSBvZiBPYmplY3QuZW50cmllcyhsaXN0SXRlbXMpKXtcbiAgICAgIGNvbnN0IGZpbHRlckxpbmsgPSBsaXN0SXRlbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpXG4gICAgICBpZiggZmlsdGVyTGlua1swXS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykgKXtcbiAgICAgICAgZmlsdGVyTGlua1swXS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gICAgICAgIGNvbnN0IGZpbHRlclRvUmVtb3ZlID0gZmlsdGVyTGlua1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyJylcbiAgICAgICAgdGhpcy5yZW1vdmVGaWx0ZXIoZmlsdGVyVG9SZW1vdmUpXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYXBwbHlGaWx0ZXJzKClcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJtaXRzIGxpbmtpbmcgdG8gU3ViIENhdGVnb3JpZXMgYW5kIENlcnRpZmljYXRpb25zIHZpYSB0aGUgVVJMIHF1ZXJ5IHN0cmluZy5cbiAgICpcbiAgICogLSBzdWItY2F0ZWdvcnkgICBDb21tYSBzZXBhcmF0ZWQgbGlzdCBvZiBTdWIgQ2F0ZWdvcnkgc2x1Z3MuXG4gICAqIC0gY2VydGlmaWNhdGlvbiAgQ29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgQ2VydGlmaWNhdGlvbiBzbHVncy5cbiAgICovXG4gIGRlZXBMaW5rKCl7XG4gICAgY29uc29sZS5sb2coJ/CflJQgRGVlcCBMaW5raW5nLi4uJylcbiAgICBpZiggMCA8IHRoaXMuc3ViQ2F0ZWdvcnlBcnJheS5sZW5ndGggKXtcbiAgICAgIHRoaXMuc3ViQ2F0ZWdvcnlBcnJheS5mb3JFYWNoKCBlbGVtZW50ID0+IHtcbiAgICAgICAgdGhpcy5hZGRGaWx0ZXIoZWxlbWVudClcbiAgICAgICAgLy8gUmVtb3ZlIC5zZWxlY3RlZCBmcm9tIHRoZSBmaWx0ZXIgYW5jaG9yIHRhZy5cbiAgICAgICAgdmFyIGZpbHRlckxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1maWx0ZXI9XCIke2VsZW1lbnR9XCJdYClcbiAgICAgICAgaWYoICEgZmlsdGVyTGluay5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykgKVxuICAgICAgICAgIGZpbHRlckxpbmsuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgICAgfSlcbiAgICAgIGxldCBzdWJDYXRlZ29yeUxpbmtzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggJ3N1Yl9jYXRlZ29yeScgKVxuICAgICAgZm9yKCBsZXQgW2tleSx2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoc3ViQ2F0ZWdvcnlMaW5rcykgKXtcbiAgICAgICAgY29uc3QgZmlsdGVyTGlua3MgPSB2YWx1ZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpXG4gICAgICAgIGZpbHRlckxpbmtzWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgICAgIH1cblxuICAgIH1cbiAgICBpZiggMCA8IHRoaXMuY2VydGlmaWNhdGlvbkFycmF5Lmxlbmd0aCApe1xuICAgICAgdGhpcy5jZXJ0aWZpY2F0aW9uQXJyYXkuZm9yRWFjaCggZWxlbWVudCA9PiB7XG4gICAgICAgIHRoaXMuYWRkRmlsdGVyKGVsZW1lbnQpXG4gICAgICAgIC8vIFJlbW92ZSAuc2VsZWN0ZWQgZnJvbSB0aGUgZmlsdGVyIGFuY2hvciB0YWcuXG4gICAgICAgIHZhciBmaWx0ZXJMaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtZmlsdGVyPVwiJHtlbGVtZW50fVwiXWApXG4gICAgICAgIGlmKCAhIGZpbHRlckxpbmsuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpIClcbiAgICAgICAgICBmaWx0ZXJMaW5rLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcbiAgICAgIH0pXG4gICAgICBsZXQgY2VydGlmaWNhdGlvbkxpbmtzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggJ2NlcnRpZmljYXRpb24nIClcbiAgICAgIGZvciggbGV0IFtrZXksdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGNlcnRpZmljYXRpb25MaW5rcykgKXtcbiAgICAgICAgY29uc3QgZmlsdGVyTGlua3MgPSB2YWx1ZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpXG4gICAgICAgIGZpbHRlckxpbmtzWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgICAgIH1cbiAgICAgIC8vdGhpcy5hcHBseUZpbHRlcnMoKVxuICAgIH1cblxuICAgIHRoaXMuYXBwbHlGaWx0ZXJzKClcblxuICAgIC8vIFNtb290aCBTY29sbCB0byBcIlN1YiBDYXRlZ29yaWVzXCJcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2h1ZmZsZUZpbHRlclRvcCcpXG4gICAgdmFyIHZpZXdwb3J0T2Zmc2V0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB2YXIgdG9wID0gdmlld3BvcnRPZmZzZXQudG9wXG4gICAgd2luZG93LnNjcm9sbCh7dG9wOiAodG9wIC0gOTApLGxlZnQ6IDAsIGJlaGF2aW9yOiAnc21vb3RoJ30pXG4gICAgY29uc29sZS5sb2coJ3RvcCA9ICcsIHRvcClcbiAgICBjb25zb2xlLmxvZygn8J+UlCBkaWQgd2Ugc2Nyb2xsPycpXG4gIH1cblxuICAgLyoqXG4gICAqIENoZWNrcyBmb3IgdGhlIGV4aXN0ZW5jZSBvZiBgZmlsdGVyYCBpbnNpZGUgdGhpcy5maWx0ZXJzXG4gICAqXG4gICAqIEBwYXJhbSAgICAgIHtzdHJpbmd9ICAgZmlsdGVyICBUaGUgZmlsdGVyXG4gICAqIEByZXR1cm4gICAgIHtib29sZWFufSAgVHJ1ZSBpZiBoYXMgZmlsdGVyLCBGYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBoYXNGaWx0ZXIoIGZpbHRlciApe1xuICAgIHJldHVybiAoLTEgPCB0aGlzLmZpbHRlcnMuaW5kZXhPZihmaWx0ZXIpKT8gdHJ1ZSA6IGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIGZpbHRlciBncm91cHMgYnkgYWRkaW5nIGAuc2VsZWN0ZWRgIHRvIHRoZSBmaXJzdCBmaWx0ZXIuXG4gICAqL1xuICBpbml0aWFsaXplRmlsdGVyR3JvdXBzKCl7XG4gICAgZm9yKCBsZXQgW2tleSx2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5maWx0ZXJHcm91cHMpICl7XG4gICAgICBjb25zdCBmaWx0ZXJMaW5rcyA9IHZhbHVlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJylcbiAgICAgIGZpbHRlckxpbmtzWzBdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGBmaWx0ZXJgIGZyb20gdGhpcy5maWx0ZXJzXG4gICAqXG4gICAqIEBwYXJhbSAgICAgIHtzdHJpbmd9ICBmaWx0ZXIgIFRoZSBmaWx0ZXJcbiAgICovXG4gIHJlbW92ZUZpbHRlciggZmlsdGVyICl7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5maWx0ZXJzLmluZGV4T2YoZmlsdGVyKVxuICAgIGlmKC0xIDwgaW5kZXgpe1xuICAgICAgY29uc29sZS5sb2coYFxcdCDigKIgUmVtb3ZpbmcgJyR7ZmlsdGVyfSdgKVxuICAgICAgdGhpcy5maWx0ZXJzLnNwbGljZShpbmRleCwxKVxuXG4gICAgICAvLyBSZW1vdmUgLnNlbGVjdGVkIGZyb20gdGhlIGZpbHRlciBhbmNob3IgdGFnLlxuICAgICAgdmFyIGZpbHRlckxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1maWx0ZXI9XCIke2ZpbHRlcn1cIl1gKVxuICAgICAgaWYoIGZpbHRlckxpbmsuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpIClcbiAgICAgICAgZmlsdGVyTGluay5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgKGFkZHMvcmVtb3ZlcykgYSBgZmlsdGVyYCBmcm9tIHRoaXMuZmlsdGVyc1xuICAgKlxuICAgKiBAcGFyYW0gICAgICB7c3RyaW5nfSAgZmlsdGVyICBUaGUgZmlsdGVyXG4gICAqL1xuICB0b2dnbGVGaWx0ZXIoIGZpbHRlciApe1xuICAgIGNvbnN0IGhhc0ZpbHRlciA9IHRoaXMuaGFzRmlsdGVyKCBmaWx0ZXIgKVxuICAgIGlmKCBoYXNGaWx0ZXIgKXtcbiAgICAgIHRoaXMucmVtb3ZlRmlsdGVyKGZpbHRlcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRGaWx0ZXIoZmlsdGVyKVxuICAgIH1cbiAgICB0aGlzLmFwcGx5RmlsdGVycygpXG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgb3VyIHBvc3RzIGFuZCBhcHBsaWVzIFNodWZmbGVKU1xuICAgKlxuICAgKiBAcGFyYW0gICAgICB7bnVtYmVyfSAgcGFnZV9zaXplICAgIFRoZSBwYWdlIHNpemVcbiAgICogQHBhcmFtICAgICAge251bWJlcn0gIHBhZ2VfbnVtYmVyICBUaGUgcGFnZSBudW1iZXJcbiAgICovXG4gIGxvYWRQb3N0cygpe1xuICAgIGNvbnN0IHBvc3RHcmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHRoaXMuZ3JpZElkIClcblxuICAgIGNvbnN0IHBvc3RzID0gKCAtMSA9PT0gdGhpcy5wYWdlX3NpemUgKT8gdGhpcy5wb3N0cyA6IHRoaXMuX2dldFBhZ2VPZlBvc3RzKClcblxuICAgIGxldCBlbFByb2Nlc3NlZCA9IDBcbiAgICBwb3N0cy5mb3JFYWNoKCAoZWwsIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgcG9zdEdyaWQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVFbmQnLCB0aGlzLl9nZXRQb3N0RWxlbWVudChlbCkgKVxuICAgICAgZWxQcm9jZXNzZWQrK1xuICAgICAgaWYoIGVsUHJvY2Vzc2VkID09PSBhcnJheS5sZW5ndGggKXtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKCdTaHVmZmxpbmcgbm93ISB0aGlzLnBhZ2VfbnVtYmVyID0gJywgdGhpcy5wYWdlX251bWJlcilcblxuICAgICAgICBpZiggdGhpcy5wYWdlX251bWJlciA9PT0gdGhpcy50b3RhbF9wYWdlcyB8fCAtMSA9PT0gdGhpcy5wYWdlX3NpemUgKVxuICAgICAgICAgIHRoaXMubG9hZE1vcmVCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuXG4gICAgICAgIHRoaXMucGFnZV9udW1iZXIrK1xuICAgICAgICB0aGlzLnNodWZmbGUgPSBuZXcgU2h1ZmZsZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHRoaXMuZ3JpZElkICksIHtcbiAgICAgICAgICBpdGVtU2VsZWN0b3I6ICcuJyArIHRoaXMucG9zdFR5cGUsXG4gICAgICAgICAgZmlsdGVyTW9kZTogJ2FsbCdcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgX2dldFBhZ2VPZlBvc3RzKCl7XG4gICAgY29uc29sZS5sb2coYF9nZXRQYWdlT2ZQb3N0cygpIGlzIHJldHJpZXZpbmcgcGFnZSAke3RoaXMucGFnZV9udW1iZXJ9IHdpdGggJHt0aGlzLnBhZ2Vfc2l6ZX0gcG9zdHMuYClcbiAgICBsZXQgcGFnZV9udW1iZXIgPSB0aGlzLnBhZ2VfbnVtYmVyXG4gICAgcGFnZV9udW1iZXItLVxuICAgIGNvbnN0IHBhZ2Vfc2l6ZSA9IHRoaXMucGFnZV9zaXplXG4gICAgcmV0dXJuIHRoaXMucG9zdHMuc2xpY2UoIHBhZ2VfbnVtYmVyICogcGFnZV9zaXplLCAocGFnZV9udW1iZXIgKyAxKSAqIHBhZ2Vfc2l6ZSApXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgSFRNTCBmb3Igb3VyIHBvc3QgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGVsIE91ciBwb3N0IGVsZW1lbnQvb2JqZWN0LlxuICAgKi9cbiAgX2dldFBvc3RFbGVtZW50KCBlbCApe1xuICAgIGNvbnN0IHRodW1ibmFpbFVybCA9ICggISBlbC50aHVtYm5haWwgKT8gdGhpcy5kZWZhdWx0VGh1bWJuYWlsIDogZWwudGh1bWJuYWlsIDtcbiAgICBsZXQgcG9zdCA9ICcnXG4gICAgc3dpdGNoKCB0aGlzLnBvc3RUeXBlICl7XG4gICAgICBjYXNlICdwcm9kdWN0JzpcbiAgICAgICAgdmFyIG5ld1RhZyA9ICggZWwubmV3ICk/ICc8ZGl2IGNsYXNzPVwibmV3XCI+PC9kaXY+JyA6ICcnXG5cbiAgICAgICAgcG9zdCA9IGBcbiAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtICR7dGhpcy5wb3N0VHlwZX1cIiBkYXRhLWdyb3Vwcz0nJHtKU09OLnN0cmluZ2lmeShlbC5ncm91cHMpfSc+XG4gICAgICAgICAgPGEgaHJlZj1cIiR7ZWwucGVybWFsaW5rfVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsaXAtY2FyZFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxpcC1jYXJkLWlubmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsaXAtY2FyZC1mcm9udFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvdXJzZS10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aDM+JHtlbC50aXRsZX08L2gzPlxuICAgICAgICAgICAgICAgICAgICAke25ld1RhZ31cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvdXJzZS1tZXRhXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb3Vyc2UtbWV0YS1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY291cnNlLW1ldGEtY29sXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvbiBkdXJhdGlvblwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHRcIj4ke2VsLm1ldGEuY291cnNlX2R1cmF0aW9ufTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb3Vyc2UtbWV0YS1jb2xcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0XCI+JHtlbC5tZXRhLmNvdXJzZV9yZWZlcmVuY2V9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY291cnNlLW1ldGEtcm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvdXJzZS1tZXRhLWNvbCAke2VsLm1ldGEuZmFjZV90b19mYWNlfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImljb24gZmFjZS10by1mYWNlICR7ZWwubWV0YS5mYWNlX3RvX2ZhY2V9XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dFwiPkZhY2UtdG8tRmFjZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb3Vyc2UtbWV0YS1jb2wgJHtlbC5tZXRhLnZpcnR1YWx9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvbiB2aXJ0dWFsICR7ZWwubWV0YS52aXJ0dWFsfVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHRcIj48c3Bhbj5WaXJ0dWFsPGJyLz5PcGVuQ2xhc3MmcmVnOzwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxpcC1jYXJkLWJhY2tcIj5cbiAgICAgICAgICAgICAgICAgIDxoMz4ke2VsLnRpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICA8cD4ke2VsLmV4Y2VycHR9PC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT5gXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIEJ1aWxkIHRoZSBlbGVtZW50cyBvZiAub3ZlcmxheVxuICAgICAgICBsZXQgcmliYm9uID0gYDxkaXYgY2xhc3M9XCJyaWJib24gJHtlbC5ncm91cHMuam9pbignICcpfVwiPjwvZGl2PmBcbiAgICAgICAgbGV0IGJsdWVPdmVybGF5ID0gYDxkaXYgY2xhc3M9XCJibHVlLW92ZXJsYXlcIj48L2Rpdj5gXG5cbiAgICAgICAgbGV0IGNhdGVnb3J5T3ZlcmxheSA9IGA8ZGl2IGNsYXNzPVwiY2F0ZWdvcnktb3ZlcmxheVwiPiR7ZWwucmVzb3VyY2VfdHlwZX08L2Rpdj5gXG4gICAgICAgIGlmKCAnbmV3cycgPT0gd3B2YXJzLmNhdGVnb3J5ICl7XG4gICAgICAgICAgY2F0ZWdvcnlPdmVybGF5ID0gYDxkaXYgY2xhc3M9XCJjYXRlZ29yeS1vdmVybGF5XCI+JHtlbC5uZXdzX2NhdGVnb3J5fTwvZGl2PmBcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC5vdmVybGF5IGNvbnRhaW5zIC5yaWJib24sIC5ibHVlLW92ZXJsYXksIGFuZCAuY2F0ZWdvcnktb3ZlcmxheVxuICAgICAgICBsZXQgb3ZlcmxheSA9IGA8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIHN0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCcke3RodW1ibmFpbFVybH0nKVwiPiR7cmliYm9ufSR7Ymx1ZU92ZXJsYXl9JHtjYXRlZ29yeU92ZXJsYXl9PC9kaXY+YFxuXG4gICAgICAgIC8vIEJ1aWxkIC5saXN0LWl0ZW0gd2l0aCB0aGUgLm1ldGEgYW5kIHRpdGxlLlxuICAgICAgICBsZXQgbWV0YSA9IGA8cCBjbGFzcz1cIm1ldGFcIj4ke2VsLm1ldGF9PC9wPmBcbiAgICAgICAgaWYoICduZXdzJyA9PSB3cHZhcnMuY2F0ZWdvcnkgKVxuICAgICAgICAgIG1ldGEgPSAnJ1xuICAgICAgICBsZXQgdGl0bGUgPSBgPGgzIGNsYXNzPVwiXCI+JHt0cnVuY2F0ZShlbC50aXRsZSw4MCx0cnVlKX08L2gzPmBcbiAgICAgICAgbGV0IGxpc3RJdGVtID0gYDxsaSBjbGFzcz1cImxpc3QtaXRlbSAke3dwdmFycy5jYXRlZ29yeX0gJHt0aGlzLnBvc3RUeXBlfVwiIGRhdGEtZ3JvdXBzPScke0pTT04uc3RyaW5naWZ5KGVsLmdyb3Vwcyl9Jz48YSBocmVmPVwiJHtlbC5wZXJtYWxpbmt9XCI+PGRpdiBjbGFzcz1cImxpc3QtY29udGVudCAke3RoaXMucG9zdFR5cGV9XCI+JHtvdmVybGF5fSR7bWV0YX0ke3RpdGxlfTwvZGl2PjwvYT48L2xpPmBcbiAgICAgICAgaWYoICduZXdzbGV0dGVyX2Zvcm0nID09IGVsLnRpdGxlICl7XG4gICAgICAgICAgbGlzdEl0ZW0gPSBgPGxpIGNsYXNzPVwibGlzdC1pdGVtICR7dGhpcy5wb3N0VHlwZX0gbmV3c2xldHRlci1zaWdudXBcIiBkYXRhLWdyb3Vwcz1cIltdXCI+PGRpdiBjbGFzcz1cImxpc3QtY29udGVudCAke3RoaXMucG9zdFR5cGV9XCI+JHt3cHZhcnMubmV3c2xldHRlckZvcm19PC9kaXY+PC9saT5gXG4gICAgICAgIH1cbiAgICAgICAgcG9zdCA9IGxpc3RJdGVtXG4gICAgfVxuICAgIHJldHVybiBwb3N0XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9zdEZpbHRlcnMiLCIvKiBVdGlsaXR5IEZ1bmN0aW9ucyAqL1xuXG5leHBvcnQgZnVuY3Rpb24gdHJ1bmNhdGUoIHN0cmluZywgbiwgdXNlV29yZEJvdW5kYXJ5ICl7XG4gICAgaWYgKHN0cmluZy5sZW5ndGggPD0gbilcbiAgICAgIHJldHVybiBzdHJpbmdcbiAgICBsZXQgc3ViU3RyaW5nID0gc3RyaW5nLnN1YnN0cigwLCBuLTEpXG4gICAgcmV0dXJuICh1c2VXb3JkQm91bmRhcnkgPyBzdWJTdHJpbmcuc3Vic3RyKDAsIHN1YlN0cmluZy5sYXN0SW5kZXhPZignICcpICkgOiBzdWJTdHJpbmcpICsgXCImaGVsbGlwO1wiXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHBsb2RlKGRlbGltaXRlciwgc3RyaW5nLCBsaW1pdCl7XG4gIC8vICBkaXNjdXNzIGF0OiBodHRwczovL2xvY3V0dXMuaW8vcGhwL2V4cGxvZGUvXG4gIC8vIG9yaWdpbmFsIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwczovL2t2ei5pbylcbiAgLy8gICBleGFtcGxlIDE6IGV4cGxvZGUoJyAnLCAnS2V2aW4gdmFuIFpvbm5ldmVsZCcpXG4gIC8vICAgcmV0dXJucyAxOiBbICdLZXZpbicsICd2YW4nLCAnWm9ubmV2ZWxkJyBdXG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyIHx8XG4gICAgdHlwZW9mIGRlbGltaXRlciA9PT0gJ3VuZGVmaW5lZCcgfHxcbiAgICB0eXBlb2Ygc3RyaW5nID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgaWYgKGRlbGltaXRlciA9PT0gJycgfHxcbiAgICBkZWxpbWl0ZXIgPT09IGZhbHNlIHx8XG4gICAgZGVsaW1pdGVyID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgaWYgKHR5cGVvZiBkZWxpbWl0ZXIgPT09ICdmdW5jdGlvbicgfHxcbiAgICB0eXBlb2YgZGVsaW1pdGVyID09PSAnb2JqZWN0JyB8fFxuICAgIHR5cGVvZiBzdHJpbmcgPT09ICdmdW5jdGlvbicgfHxcbiAgICB0eXBlb2Ygc3RyaW5nID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiB7XG4gICAgICAwOiAnJ1xuICAgIH1cbiAgfVxuICBpZiAoZGVsaW1pdGVyID09PSB0cnVlKSB7XG4gICAgZGVsaW1pdGVyID0gJzEnXG4gIH1cblxuICAvLyBIZXJlIHdlIGdvLi4uXG4gIGRlbGltaXRlciArPSAnJ1xuICBzdHJpbmcgKz0gJydcblxuICBjb25zdCBzID0gc3RyaW5nLnNwbGl0KGRlbGltaXRlcilcblxuICBpZiAodHlwZW9mIGxpbWl0ID09PSAndW5kZWZpbmVkJykgcmV0dXJuIHNcblxuICAvLyBTdXBwb3J0IGZvciBsaW1pdFxuICBpZiAobGltaXQgPT09IDApIGxpbWl0ID0gMVxuXG4gIC8vIFBvc2l0aXZlIGxpbWl0XG4gIGlmIChsaW1pdCA+IDApIHtcbiAgICBpZiAobGltaXQgPj0gcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBzXG4gICAgfVxuICAgIHJldHVybiBzXG4gICAgICAuc2xpY2UoMCwgbGltaXQgLSAxKVxuICAgICAgLmNvbmNhdChbcy5zbGljZShsaW1pdCAtIDEpXG4gICAgICAgIC5qb2luKGRlbGltaXRlcilcbiAgICAgIF0pXG4gIH1cblxuICAvLyBOZWdhdGl2ZSBsaW1pdFxuICBpZiAoLWxpbWl0ID49IHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdXG4gIH1cblxuICBzLnNwbGljZShzLmxlbmd0aCArIGxpbWl0KVxuICByZXR1cm4gc1xufSIsImZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykge1xuICAgIGFycjJbaV0gPSBhcnJbaV07XG4gIH1cblxuICByZXR1cm4gYXJyMjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlMaWtlVG9BcnJheTsiLCJmdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FycmF5V2l0aEhvbGVzOyIsImZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2NsYXNzQ2FsbENoZWNrOyIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfY3JlYXRlQ2xhc3M7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuO1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2l0ZXJhYmxlVG9BcnJheUxpbWl0OyIsImZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX25vbkl0ZXJhYmxlUmVzdDsiLCJ2YXIgYXJyYXlXaXRoSG9sZXMgPSByZXF1aXJlKFwiLi9hcnJheVdpdGhIb2xlc1wiKTtcblxudmFyIGl0ZXJhYmxlVG9BcnJheUxpbWl0ID0gcmVxdWlyZShcIi4vaXRlcmFibGVUb0FycmF5TGltaXRcIik7XG5cbnZhciB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSA9IHJlcXVpcmUoXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5XCIpO1xuXG52YXIgbm9uSXRlcmFibGVSZXN0ID0gcmVxdWlyZShcIi4vbm9uSXRlcmFibGVSZXN0XCIpO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHtcbiAgcmV0dXJuIGFycmF5V2l0aEhvbGVzKGFycikgfHwgaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IG5vbkl0ZXJhYmxlUmVzdCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zbGljZWRUb0FycmF5OyIsImZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gIFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjtcblxuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3R5cGVvZjsiLCJ2YXIgYXJyYXlMaWtlVG9BcnJheSA9IHJlcXVpcmUoXCIuL2FycmF5TGlrZVRvQXJyYXlcIik7XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHtcbiAgaWYgKCFvKSByZXR1cm47XG4gIGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpO1xuICBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lO1xuICBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTtcbiAgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5OyIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IGdsb2JhbCB8fCBzZWxmLCBnbG9iYWwuU2h1ZmZsZSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH1cblxuICBmdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7XG4gICAgfVxuXG4gICAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgICAgIHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG4gICAgfTtcbiAgICByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pO1xuICB9XG5cbiAgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgICBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgICAgIG8uX19wcm90b19fID0gcDtcbiAgICAgIHJldHVybiBvO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApO1xuICB9XG5cbiAgZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7XG4gICAgaWYgKHNlbGYgPT09IHZvaWQgMCkge1xuICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWxmO1xuICB9XG5cbiAgZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkge1xuICAgIGlmIChjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgICAgcmV0dXJuIGNhbGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7XG4gIH1cblxuICBmdW5jdGlvbiBFICgpIHtcbiAgICAvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gICAgLy8gKHZpYSBodHRwczovL2dpdGh1Yi5jb20vbGlwc21hY2sgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2lzc3Vlcy8zKVxuICB9XG5cbiAgRS5wcm90b3R5cGUgPSB7XG4gICAgb246IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuXG4gICAgICAoZVtuYW1lXSB8fCAoZVtuYW1lXSA9IFtdKSkucHVzaCh7XG4gICAgICAgIGZuOiBjYWxsYmFjayxcbiAgICAgICAgY3R4OiBjdHhcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGxpc3RlbmVyICgpIHtcbiAgICAgICAgc2VsZi5vZmYobmFtZSwgbGlzdGVuZXIpO1xuICAgICAgICBjYWxsYmFjay5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICBsaXN0ZW5lci5fID0gY2FsbGJhY2s7XG4gICAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBsaXN0ZW5lciwgY3R4KTtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgdmFyIGV2dEFyciA9ICgodGhpcy5lIHx8ICh0aGlzLmUgPSB7fSkpW25hbWVdIHx8IFtdKS5zbGljZSgpO1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG5cbiAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgICAgdmFyIGV2dHMgPSBlW25hbWVdO1xuICAgICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcblxuICAgICAgaWYgKGV2dHMgJiYgY2FsbGJhY2spIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2sgJiYgZXZ0c1tpXS5mbi5fICE9PSBjYWxsYmFjaylcbiAgICAgICAgICAgIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBSZW1vdmUgZXZlbnQgZnJvbSBxdWV1ZSB0byBwcmV2ZW50IG1lbW9yeSBsZWFrXG4gICAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgICAgKGxpdmVFdmVudHMubGVuZ3RoKVxuICAgICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICAgIDogZGVsZXRlIGVbbmFtZV07XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcblxuICB2YXIgdGlueUVtaXR0ZXIgPSBFO1xuICB2YXIgVGlueUVtaXR0ZXIgPSBFO1xuICB0aW55RW1pdHRlci5UaW55RW1pdHRlciA9IFRpbnlFbWl0dGVyO1xuXG4gIHZhciBwcm90byA9IHR5cGVvZiBFbGVtZW50ICE9PSAndW5kZWZpbmVkJyA/IEVsZW1lbnQucHJvdG90eXBlIDoge307XG4gIHZhciB2ZW5kb3IgPSBwcm90by5tYXRjaGVzXG4gICAgfHwgcHJvdG8ubWF0Y2hlc1NlbGVjdG9yXG4gICAgfHwgcHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yXG4gICAgfHwgcHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yXG4gICAgfHwgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3JcbiAgICB8fCBwcm90by5vTWF0Y2hlc1NlbGVjdG9yO1xuXG4gIHZhciBtYXRjaGVzU2VsZWN0b3IgPSBtYXRjaDtcblxuICAvKipcbiAgICogTWF0Y2ggYGVsYCB0byBgc2VsZWN0b3JgLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBtYXRjaChlbCwgc2VsZWN0b3IpIHtcbiAgICBpZiAoIWVsIHx8IGVsLm5vZGVUeXBlICE9PSAxKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHZlbmRvcikgcmV0dXJuIHZlbmRvci5jYWxsKGVsLCBzZWxlY3Rvcik7XG4gICAgdmFyIG5vZGVzID0gZWwucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobm9kZXNbaV0gPT0gZWwpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgdGhyb3R0bGVpdCA9IHRocm90dGxlO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IGZ1bmN0aW9uIHRoYXQsIHdoZW4gaW52b2tlZCwgaW52b2tlcyBgZnVuY2AgYXQgbW9zdCBvbmNlIHBlciBgd2FpdGAgbWlsbGlzZWNvbmRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIEZ1bmN0aW9uIHRvIHdyYXAuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3YWl0IE51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBtdXN0IGVsYXBzZSBiZXR3ZWVuIGBmdW5jYCBpbnZvY2F0aW9ucy5cbiAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uIHRoYXQgd3JhcHMgdGhlIGBmdW5jYCBmdW5jdGlvbiBwYXNzZWQgaW4uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHRocm90dGxlIChmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGN0eCwgYXJncywgcnRuLCB0aW1lb3V0SUQ7IC8vIGNhY2hpbmdcbiAgICB2YXIgbGFzdCA9IDA7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gdGhyb3R0bGVkICgpIHtcbiAgICAgIGN0eCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdmFyIGRlbHRhID0gbmV3IERhdGUoKSAtIGxhc3Q7XG4gICAgICBpZiAoIXRpbWVvdXRJRClcbiAgICAgICAgaWYgKGRlbHRhID49IHdhaXQpIGNhbGwoKTtcbiAgICAgICAgZWxzZSB0aW1lb3V0SUQgPSBzZXRUaW1lb3V0KGNhbGwsIHdhaXQgLSBkZWx0YSk7XG4gICAgICByZXR1cm4gcnRuO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjYWxsICgpIHtcbiAgICAgIHRpbWVvdXRJRCA9IDA7XG4gICAgICBsYXN0ID0gK25ldyBEYXRlKCk7XG4gICAgICBydG4gPSBmdW5jLmFwcGx5KGN0eCwgYXJncyk7XG4gICAgICBjdHggPSBudWxsO1xuICAgICAgYXJncyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgdmFyIGFycmF5UGFyYWxsZWwgPSBmdW5jdGlvbiBwYXJhbGxlbChmbnMsIGNvbnRleHQsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgaWYgKHR5cGVvZiBjb250ZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrID0gY29udGV4dDtcbiAgICAgICAgY29udGV4dCA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayA9IG5vb3A7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHBlbmRpbmcgPSBmbnMgJiYgZm5zLmxlbmd0aDtcbiAgICBpZiAoIXBlbmRpbmcpIHJldHVybiBjYWxsYmFjayhudWxsLCBbXSk7XG5cbiAgICB2YXIgZmluaXNoZWQgPSBmYWxzZTtcbiAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShwZW5kaW5nKTtcblxuICAgIGZucy5mb3JFYWNoKGNvbnRleHQgPyBmdW5jdGlvbiAoZm4sIGkpIHtcbiAgICAgIGZuLmNhbGwoY29udGV4dCwgbWF5YmVEb25lKGkpKTtcbiAgICB9IDogZnVuY3Rpb24gKGZuLCBpKSB7XG4gICAgICBmbihtYXliZURvbmUoaSkpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gbWF5YmVEb25lKGkpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKGZpbmlzaGVkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0cyk7XG4gICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0c1tpXSA9IHJlc3VsdDtcblxuICAgICAgICBpZiAoIS0tcGVuZGluZykgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4gIC8qKlxuICAgKiBBbHdheXMgcmV0dXJucyBhIG51bWVyaWMgdmFsdWUsIGdpdmVuIGEgdmFsdWUuIExvZ2ljIGZyb20galF1ZXJ5J3MgYGlzTnVtZXJpY2AuXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgUG9zc2libHkgbnVtZXJpYyB2YWx1ZS5cbiAgICogQHJldHVybiB7bnVtYmVyfSBgdmFsdWVgIG9yIHplcm8gaWYgYHZhbHVlYCBpc24ndCBudW1lcmljLlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0TnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpIHx8IDA7XG4gIH1cblxuICB2YXIgUG9pbnQgPVxuICAvKiNfX1BVUkVfXyovXG4gIGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBSZXByZXNlbnRzIGEgY29vcmRpbmF0ZSBwYWlyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeD0wXSBYLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXSBZLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFBvaW50KHgsIHkpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQb2ludCk7XG5cbiAgICAgIHRoaXMueCA9IGdldE51bWJlcih4KTtcbiAgICAgIHRoaXMueSA9IGdldE51bWJlcih5KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0d28gcG9pbnRzIGFyZSBlcXVhbC5cbiAgICAgKiBAcGFyYW0ge1BvaW50fSBhIFBvaW50IEEuXG4gICAgICogQHBhcmFtIHtQb2ludH0gYiBQb2ludCBCLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG5cblxuICAgIF9jcmVhdGVDbGFzcyhQb2ludCwgbnVsbCwgW3tcbiAgICAgIGtleTogXCJlcXVhbHNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBlcXVhbHMoYSwgYikge1xuICAgICAgICByZXR1cm4gYS54ID09PSBiLnggJiYgYS55ID09PSBiLnk7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFBvaW50O1xuICB9KCk7XG5cbiAgdmFyIFJlY3QgPVxuICAvKiNfX1BVUkVfXyovXG4gIGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDbGFzcyBmb3IgcmVwcmVzZW50aW5nIHJlY3Rhbmd1bGFyIHJlZ2lvbnMuXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWxpYnJhcnkvYmxvYi9tYXN0ZXIvY2xvc3VyZS9nb29nL21hdGgvcmVjdC5qc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IExlZnQuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgVG9wLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3IFdpZHRoLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoIEhlaWdodC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaWQgSWRlbnRpZmllclxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFJlY3QoeCwgeSwgdywgaCwgaWQpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSZWN0KTtcblxuICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG5cbiAgICAgIHRoaXMubGVmdCA9IHg7XG4gICAgICAvKiogQHR5cGUge251bWJlcn0gKi9cblxuICAgICAgdGhpcy50b3AgPSB5O1xuICAgICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG5cbiAgICAgIHRoaXMud2lkdGggPSB3O1xuICAgICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG5cbiAgICAgIHRoaXMuaGVpZ2h0ID0gaDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHR3byByZWN0YW5nbGVzIGludGVyc2VjdC5cbiAgICAgKiBAcGFyYW0ge1JlY3R9IGEgQSBSZWN0YW5nbGUuXG4gICAgICogQHBhcmFtIHtSZWN0fSBiIEEgUmVjdGFuZ2xlLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgYSBhbmQgYiBpbnRlcnNlY3QuXG4gICAgICovXG5cblxuICAgIF9jcmVhdGVDbGFzcyhSZWN0LCBudWxsLCBbe1xuICAgICAga2V5OiBcImludGVyc2VjdHNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbnRlcnNlY3RzKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEubGVmdCA8IGIubGVmdCArIGIud2lkdGggJiYgYi5sZWZ0IDwgYS5sZWZ0ICsgYS53aWR0aCAmJiBhLnRvcCA8IGIudG9wICsgYi5oZWlnaHQgJiYgYi50b3AgPCBhLnRvcCArIGEuaGVpZ2h0O1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBSZWN0O1xuICB9KCk7XG5cbiAgdmFyIENsYXNzZXMgPSB7XG4gICAgQkFTRTogJ3NodWZmbGUnLFxuICAgIFNIVUZGTEVfSVRFTTogJ3NodWZmbGUtaXRlbScsXG4gICAgVklTSUJMRTogJ3NodWZmbGUtaXRlbS0tdmlzaWJsZScsXG4gICAgSElEREVOOiAnc2h1ZmZsZS1pdGVtLS1oaWRkZW4nXG4gIH07XG5cbiAgdmFyIGlkID0gMDtcblxuICB2YXIgU2h1ZmZsZUl0ZW0gPVxuICAvKiNfX1BVUkVfXyovXG4gIGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTaHVmZmxlSXRlbShlbGVtZW50KSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2h1ZmZsZUl0ZW0pO1xuXG4gICAgICBpZCArPSAxO1xuICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgIC8qKlxuICAgICAgICogVXNlZCB0byBzZXBhcmF0ZSBpdGVtcyBmb3IgbGF5b3V0IGFuZCBzaHJpbmsuXG4gICAgICAgKi9cblxuICAgICAgdGhpcy5pc1Zpc2libGUgPSB0cnVlO1xuICAgICAgLyoqXG4gICAgICAgKiBVc2VkIHRvIGRldGVybWluZSBpZiBhIHRyYW5zaXRpb24gd2lsbCBoYXBwZW4uIEJ5IHRoZSB0aW1lIHRoZSBfbGF5b3V0XG4gICAgICAgKiBhbmQgX3NocmluayBtZXRob2RzIGdldCB0aGUgU2h1ZmZsZUl0ZW0gaW5zdGFuY2VzLCB0aGUgYGlzVmlzaWJsZWAgdmFsdWVcbiAgICAgICAqIGhhcyBhbHJlYWR5IGJlZW4gY2hhbmdlZCBieSB0aGUgc2VwYXJhdGlvbiBtZXRob2RzLCBzbyB0aGlzIHByb3BlcnR5IGlzXG4gICAgICAgKiBuZWVkZWQgdG8ga25vdyBpZiB0aGUgaXRlbSB3YXMgdmlzaWJsZS9oaWRkZW4gYmVmb3JlIHRoZSBzaHJpbmsvbGF5b3V0LlxuICAgICAgICovXG5cbiAgICAgIHRoaXMuaXNIaWRkZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoU2h1ZmZsZUl0ZW0sIFt7XG4gICAgICBrZXk6IFwic2hvd1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNob3coKSB7XG4gICAgICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ2xhc3Nlcy5ISURERU4pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChDbGFzc2VzLlZJU0lCTEUpO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJoaWRlXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gaGlkZSgpIHtcbiAgICAgICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ2xhc3Nlcy5WSVNJQkxFKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ2xhc3Nlcy5ISURERU4pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJpbml0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgdGhpcy5hZGRDbGFzc2VzKFtDbGFzc2VzLlNIVUZGTEVfSVRFTSwgQ2xhc3Nlcy5WSVNJQkxFXSk7XG4gICAgICAgIHRoaXMuYXBwbHlDc3MoU2h1ZmZsZUl0ZW0uQ3NzLklOSVRJQUwpO1xuICAgICAgICB0aGlzLnNjYWxlID0gU2h1ZmZsZUl0ZW0uU2NhbGUuVklTSUJMRTtcbiAgICAgICAgdGhpcy5wb2ludCA9IG5ldyBQb2ludCgpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJhZGRDbGFzc2VzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkQ2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgY2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgICAgICBfdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcInJlbW92ZUNsYXNzZXNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVDbGFzc2VzKGNsYXNzZXMpIHtcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgY2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgICAgICBfdGhpczIuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJhcHBseUNzc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFwcGx5Q3NzKG9iaikge1xuICAgICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIF90aGlzMy5lbGVtZW50LnN0eWxlW2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImRpc3Bvc2VcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNwb3NlKCkge1xuICAgICAgICB0aGlzLnJlbW92ZUNsYXNzZXMoW0NsYXNzZXMuSElEREVOLCBDbGFzc2VzLlZJU0lCTEUsIENsYXNzZXMuU0hVRkZMRV9JVEVNXSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFNodWZmbGVJdGVtO1xuICB9KCk7XG5cbiAgU2h1ZmZsZUl0ZW0uQ3NzID0ge1xuICAgIElOSVRJQUw6IHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdG9wOiAwLFxuICAgICAgbGVmdDogMCxcbiAgICAgIHZpc2liaWxpdHk6ICd2aXNpYmxlJyxcbiAgICAgIHdpbGxDaGFuZ2U6ICd0cmFuc2Zvcm0nXG4gICAgfSxcbiAgICBWSVNJQkxFOiB7XG4gICAgICBiZWZvcmU6IHtcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgdmlzaWJpbGl0eTogJ3Zpc2libGUnXG4gICAgICB9LFxuICAgICAgYWZ0ZXI6IHtcbiAgICAgICAgdHJhbnNpdGlvbkRlbGF5OiAnJ1xuICAgICAgfVxuICAgIH0sXG4gICAgSElEREVOOiB7XG4gICAgICBiZWZvcmU6IHtcbiAgICAgICAgb3BhY2l0eTogMFxuICAgICAgfSxcbiAgICAgIGFmdGVyOiB7XG4gICAgICAgIHZpc2liaWxpdHk6ICdoaWRkZW4nLFxuICAgICAgICB0cmFuc2l0aW9uRGVsYXk6ICcnXG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTaHVmZmxlSXRlbS5TY2FsZSA9IHtcbiAgICBWSVNJQkxFOiAxLFxuICAgIEhJRERFTjogMC4wMDFcbiAgfTtcblxuICB2YXIgdmFsdWUgPSBudWxsO1xuICB2YXIgdGVzdENvbXB1dGVkU2l6ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGUuc3R5bGUuY3NzVGV4dCA9ICd3aWR0aDoxMHB4O3BhZGRpbmc6MnB4O2JveC1zaXppbmc6Ym9yZGVyLWJveDsnO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZSk7XG4gICAgdmFsdWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlLCBudWxsKS53aWR0aCA9PT0gJzEwcHgnO1xuICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9KTtcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGNvbXB1dGVkIHN0eWxlIGZvciBhbiBlbGVtZW50LCBwYXJzZWQgYXMgYSBmbG9hdC5cbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgdG8gZ2V0IHN0eWxlIGZvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIFN0eWxlIHByb3BlcnR5LlxuICAgKiBAcGFyYW0ge0NTU1N0eWxlRGVjbGFyYXRpb259IFtzdHlsZXNdIE9wdGlvbmFsbHkgaW5jbHVkZSBjbGVhbiBzdHlsZXMgdG9cbiAgICogICAgIHVzZSBpbnN0ZWFkIG9mIGFza2luZyBmb3IgdGhlbSBhZ2Fpbi5cbiAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgcGFyc2VkIGNvbXB1dGVkIHZhbHVlIG9yIHplcm8gaWYgdGhhdCBmYWlscyBiZWNhdXNlIElFXG4gICAqICAgICB3aWxsIHJldHVybiAnYXV0bycgd2hlbiB0aGUgZWxlbWVudCBkb2Vzbid0IGhhdmUgbWFyZ2lucyBpbnN0ZWFkIG9mXG4gICAqICAgICB0aGUgY29tcHV0ZWQgc3R5bGUuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGdldE51bWJlclN0eWxlKGVsZW1lbnQsIHN0eWxlKSB7XG4gICAgdmFyIHN0eWxlcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7XG4gICAgdmFyIHZhbHVlID0gZ2V0TnVtYmVyKHN0eWxlc1tzdHlsZV0pOyAvLyBTdXBwb3J0IElFPD0xMSBhbmQgVzNDIHNwZWMuXG5cbiAgICBpZiAoIXRlc3RDb21wdXRlZFNpemUoKSAmJiBzdHlsZSA9PT0gJ3dpZHRoJykge1xuICAgICAgdmFsdWUgKz0gZ2V0TnVtYmVyKHN0eWxlcy5wYWRkaW5nTGVmdCkgKyBnZXROdW1iZXIoc3R5bGVzLnBhZGRpbmdSaWdodCkgKyBnZXROdW1iZXIoc3R5bGVzLmJvcmRlckxlZnRXaWR0aCkgKyBnZXROdW1iZXIoc3R5bGVzLmJvcmRlclJpZ2h0V2lkdGgpO1xuICAgIH0gZWxzZSBpZiAoIXRlc3RDb21wdXRlZFNpemUoKSAmJiBzdHlsZSA9PT0gJ2hlaWdodCcpIHtcbiAgICAgIHZhbHVlICs9IGdldE51bWJlcihzdHlsZXMucGFkZGluZ1RvcCkgKyBnZXROdW1iZXIoc3R5bGVzLnBhZGRpbmdCb3R0b20pICsgZ2V0TnVtYmVyKHN0eWxlcy5ib3JkZXJUb3BXaWR0aCkgKyBnZXROdW1iZXIoc3R5bGVzLmJvcmRlckJvdHRvbVdpZHRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogRmlzaGVyLVlhdGVzIHNodWZmbGUuXG4gICAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzk2Mjg5MC8zNzM0MjJcbiAgICogaHR0cHM6Ly9ib3N0Lm9ja3Mub3JnL21pa2Uvc2h1ZmZsZS9cbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgQXJyYXkgdG8gc2h1ZmZsZS5cbiAgICogQHJldHVybiB7QXJyYXl9IFJhbmRvbWx5IHNvcnRlZCBhcnJheS5cbiAgICovXG4gIGZ1bmN0aW9uIHJhbmRvbWl6ZShhcnJheSkge1xuICAgIHZhciBuID0gYXJyYXkubGVuZ3RoO1xuXG4gICAgd2hpbGUgKG4pIHtcbiAgICAgIG4gLT0gMTtcbiAgICAgIHZhciBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG4gKyAxKSk7XG4gICAgICB2YXIgdGVtcCA9IGFycmF5W2ldO1xuICAgICAgYXJyYXlbaV0gPSBhcnJheVtuXTtcbiAgICAgIGFycmF5W25dID0gdGVtcDtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgLy8gVXNlIGFycmF5LnJldmVyc2UoKSB0byByZXZlcnNlIHRoZSByZXN1bHRzXG4gICAgcmV2ZXJzZTogZmFsc2UsXG4gICAgLy8gU29ydGluZyBmdW5jdGlvblxuICAgIGJ5OiBudWxsLFxuICAgIC8vIEN1c3RvbSBzb3J0IGZ1bmN0aW9uXG4gICAgY29tcGFyZTogbnVsbCxcbiAgICAvLyBJZiB0cnVlLCB0aGlzIHdpbGwgc2tpcCB0aGUgc29ydGluZyBhbmQgcmV0dXJuIGEgcmFuZG9taXplZCBvcmRlciBpbiB0aGUgYXJyYXlcbiAgICByYW5kb21pemU6IGZhbHNlLFxuICAgIC8vIERldGVybWluZXMgd2hpY2ggcHJvcGVydHkgb2YgZWFjaCBpdGVtIGluIHRoZSBhcnJheSBpcyBwYXNzZWQgdG8gdGhlXG4gICAgLy8gc29ydGluZyBtZXRob2QuXG4gICAga2V5OiAnZWxlbWVudCdcbiAgfTtcbiAgLyoqXG4gICAqIFlvdSBjYW4gcmV0dXJuIGB1bmRlZmluZWRgIGZyb20gdGhlIGBieWAgZnVuY3Rpb24gdG8gcmV2ZXJ0IHRvIERPTSBvcmRlci5cbiAgICogQHBhcmFtIHtBcnJheTxUPn0gYXJyIEFycmF5IHRvIHNvcnQuXG4gICAqIEBwYXJhbSB7U29ydE9wdGlvbnN9IG9wdGlvbnMgU29ydGluZyBvcHRpb25zLlxuICAgKiBAcmV0dXJuIHtBcnJheTxUPn1cbiAgICovXG5cbiAgZnVuY3Rpb24gc29ydGVyKGFyciwgb3B0aW9ucykge1xuICAgIHZhciBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHZhciBvcmlnaW5hbCA9IEFycmF5LmZyb20oYXJyKTtcbiAgICB2YXIgcmV2ZXJ0ID0gZmFsc2U7XG5cbiAgICBpZiAoIWFyci5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5yYW5kb21pemUpIHtcbiAgICAgIHJldHVybiByYW5kb21pemUoYXJyKTtcbiAgICB9IC8vIFNvcnQgdGhlIGVsZW1lbnRzIGJ5IHRoZSBvcHRzLmJ5IGZ1bmN0aW9uLlxuICAgIC8vIElmIHdlIGRvbid0IGhhdmUgb3B0cy5ieSwgZGVmYXVsdCB0byBET00gb3JkZXJcblxuXG4gICAgaWYgKHR5cGVvZiBvcHRzLmJ5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhcnIuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAvLyBFeGl0IGVhcmx5IGlmIHdlIGFscmVhZHkga25vdyB3ZSB3YW50IHRvIHJldmVydFxuICAgICAgICBpZiAocmV2ZXJ0KSB7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdmFsQSA9IG9wdHMuYnkoYVtvcHRzLmtleV0pO1xuICAgICAgICB2YXIgdmFsQiA9IG9wdHMuYnkoYltvcHRzLmtleV0pOyAvLyBJZiBib3RoIHZhbHVlcyBhcmUgdW5kZWZpbmVkLCB1c2UgdGhlIERPTSBvcmRlclxuXG4gICAgICAgIGlmICh2YWxBID09PSB1bmRlZmluZWQgJiYgdmFsQiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV2ZXJ0ID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWxBIDwgdmFsQiB8fCB2YWxBID09PSAnc29ydEZpcnN0JyB8fCB2YWxCID09PSAnc29ydExhc3QnKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbEEgPiB2YWxCIHx8IHZhbEEgPT09ICdzb3J0TGFzdCcgfHwgdmFsQiA9PT0gJ3NvcnRGaXJzdCcpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0cy5jb21wYXJlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhcnIuc29ydChvcHRzLmNvbXBhcmUpO1xuICAgIH0gLy8gUmV2ZXJ0IHRvIHRoZSBvcmlnaW5hbCBhcnJheSBpZiBuZWNlc3NhcnlcblxuXG4gICAgaWYgKHJldmVydCkge1xuICAgICAgcmV0dXJuIG9yaWdpbmFsO1xuICAgIH1cblxuICAgIGlmIChvcHRzLnJldmVyc2UpIHtcbiAgICAgIGFyci5yZXZlcnNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIHZhciB0cmFuc2l0aW9ucyA9IHt9O1xuICB2YXIgZXZlbnROYW1lID0gJ3RyYW5zaXRpb25lbmQnO1xuICB2YXIgY291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIHVuaXF1ZUlkKCkge1xuICAgIGNvdW50ICs9IDE7XG4gICAgcmV0dXJuIGV2ZW50TmFtZSArIGNvdW50O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsVHJhbnNpdGlvbkVuZChpZCkge1xuICAgIGlmICh0cmFuc2l0aW9uc1tpZF0pIHtcbiAgICAgIHRyYW5zaXRpb25zW2lkXS5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0cmFuc2l0aW9uc1tpZF0ubGlzdGVuZXIpO1xuICAgICAgdHJhbnNpdGlvbnNbaWRdID0gbnVsbDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBvblRyYW5zaXRpb25FbmQoZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICB2YXIgaWQgPSB1bmlxdWVJZCgpO1xuXG4gICAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24gbGlzdGVuZXIoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmN1cnJlbnRUYXJnZXQgPT09IGV2dC50YXJnZXQpIHtcbiAgICAgICAgY2FuY2VsVHJhbnNpdGlvbkVuZChpZCk7XG4gICAgICAgIGNhbGxiYWNrKGV2dCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyKTtcbiAgICB0cmFuc2l0aW9uc1tpZF0gPSB7XG4gICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyXG4gICAgfTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cblxuICBmdW5jdGlvbiBhcnJheU1heChhcnJheSkge1xuICAgIHJldHVybiBNYXRoLm1heC5hcHBseShNYXRoLCBhcnJheSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcHJlZmVyLXNwcmVhZFxuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlNaW4oYXJyYXkpIHtcbiAgICByZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCwgYXJyYXkpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHByZWZlci1zcHJlYWRcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIG51bWJlciBvZiBjb2x1bW5zIGFuIGl0ZW1zIHNwYW5zLlxuICAgKiBAcGFyYW0ge251bWJlcn0gaXRlbVdpZHRoIFdpZHRoIG9mIHRoZSBpdGVtLlxuICAgKiBAcGFyYW0ge251bWJlcn0gY29sdW1uV2lkdGggV2lkdGggb2YgdGhlIGNvbHVtbiAoaW5jbHVkZXMgZ3V0dGVyKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvbHVtbnMgVG90YWwgbnVtYmVyIG9mIGNvbHVtbnNcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRocmVzaG9sZCBBIGJ1ZmZlciB2YWx1ZSBmb3IgdGhlIHNpemUgb2YgdGhlIGNvbHVtbiB0byBmaXQuXG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG5cbiAgZnVuY3Rpb24gZ2V0Q29sdW1uU3BhbihpdGVtV2lkdGgsIGNvbHVtbldpZHRoLCBjb2x1bW5zLCB0aHJlc2hvbGQpIHtcbiAgICB2YXIgY29sdW1uU3BhbiA9IGl0ZW1XaWR0aCAvIGNvbHVtbldpZHRoOyAvLyBJZiB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSByb3VuZGVkIGNvbHVtbiBzcGFuIG51bWJlciBhbmQgdGhlXG4gICAgLy8gY2FsY3VsYXRlZCBjb2x1bW4gc3BhbiBudW1iZXIgaXMgcmVhbGx5IHNtYWxsLCByb3VuZCB0aGUgbnVtYmVyIHRvXG4gICAgLy8gbWFrZSBpdCBmaXQuXG5cbiAgICBpZiAoTWF0aC5hYnMoTWF0aC5yb3VuZChjb2x1bW5TcGFuKSAtIGNvbHVtblNwYW4pIDwgdGhyZXNob2xkKSB7XG4gICAgICAvLyBlLmcuIGNvbHVtblNwYW4gPSA0LjAwODk5NDUzOTAyOTg3NDVcbiAgICAgIGNvbHVtblNwYW4gPSBNYXRoLnJvdW5kKGNvbHVtblNwYW4pO1xuICAgIH0gLy8gRW5zdXJlIHRoZSBjb2x1bW4gc3BhbiBpcyBub3QgbW9yZSB0aGFuIHRoZSBhbW91bnQgb2YgY29sdW1ucyBpbiB0aGUgd2hvbGUgbGF5b3V0LlxuXG5cbiAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5jZWlsKGNvbHVtblNwYW4pLCBjb2x1bW5zKTtcbiAgfVxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBjb2x1bW4gc2V0IHRvIHVzZSBmb3IgcGxhY2VtZW50LlxuICAgKiBAcGFyYW0ge251bWJlcn0gY29sdW1uU3BhbiBUaGUgbnVtYmVyIG9mIGNvbHVtbnMgdGhpcyBjdXJyZW50IGl0ZW0gc3BhbnMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb2x1bW5zIFRoZSB0b3RhbCBjb2x1bW5zIGluIHRoZSBncmlkLlxuICAgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn0gQW4gYXJyYXkgb2YgbnVtYmVycyByZXByZXNldGluZyB0aGUgY29sdW1uIHNldC5cbiAgICovXG5cbiAgZnVuY3Rpb24gZ2V0QXZhaWxhYmxlUG9zaXRpb25zKHBvc2l0aW9ucywgY29sdW1uU3BhbiwgY29sdW1ucykge1xuICAgIC8vIFRoZSBpdGVtIHNwYW5zIG9ubHkgb25lIGNvbHVtbi5cbiAgICBpZiAoY29sdW1uU3BhbiA9PT0gMSkge1xuICAgICAgcmV0dXJuIHBvc2l0aW9ucztcbiAgICB9IC8vIFRoZSBpdGVtIHNwYW5zIG1vcmUgdGhhbiBvbmUgY29sdW1uLCBmaWd1cmUgb3V0IGhvdyBtYW55IGRpZmZlcmVudFxuICAgIC8vIHBsYWNlcyBpdCBjb3VsZCBmaXQgaG9yaXpvbnRhbGx5LlxuICAgIC8vIFRoZSBncm91cCBjb3VudCBpcyB0aGUgbnVtYmVyIG9mIHBsYWNlcyB3aXRoaW4gdGhlIHBvc2l0aW9ucyB0aGlzIGJsb2NrXG4gICAgLy8gY291bGQgZml0LCBpZ25vcmluZyB0aGUgY3VycmVudCBwb3NpdGlvbnMgb2YgaXRlbXMuXG4gICAgLy8gSW1hZ2luZSBhIDIgY29sdW1uIGJyaWNrIGFzIHRoZSBzZWNvbmQgaXRlbSBpbiBhIDQgY29sdW1uIGdyaWQgd2l0aFxuICAgIC8vIDEwcHggaGVpZ2h0IGVhY2guIEZpbmQgdGhlIHBsYWNlcyBpdCB3b3VsZCBmaXQ6XG4gICAgLy8gWzIwLCAxMCwgMTAsIDBdXG4gICAgLy8gIHwgICB8ICAgfFxuICAgIC8vICAqICAgKiAgICpcbiAgICAvL1xuICAgIC8vIFRoZW4gdGFrZSB0aGUgcGxhY2VzIHdoaWNoIGZpdCBhbmQgZ2V0IHRoZSBiaWdnZXIgb2YgdGhlIHR3bzpcbiAgICAvLyBtYXgoWzIwLCAxMF0pLCBtYXgoWzEwLCAxMF0pLCBtYXgoWzEwLCAwXSkgPSBbMjAsIDEwLCAxMF1cbiAgICAvL1xuICAgIC8vIE5leHQsIGZpbmQgdGhlIGZpcnN0IHNtYWxsZXN0IG51bWJlciAodGhlIHNob3J0IGNvbHVtbikuXG4gICAgLy8gWzIwLCAxMCwgMTBdXG4gICAgLy8gICAgICB8XG4gICAgLy8gICAgICAqXG4gICAgLy9cbiAgICAvLyBBbmQgdGhhdCdzIHdoZXJlIGl0IHNob3VsZCBiZSBwbGFjZWQhXG4gICAgLy9cbiAgICAvLyBBbm90aGVyIGV4YW1wbGUgd2hlcmUgdGhlIHNlY29uZCBjb2x1bW4ncyBpdGVtIGV4dGVuZHMgcGFzdCB0aGUgZmlyc3Q6XG4gICAgLy8gWzEwLCAyMCwgMTAsIDBdID0+IFsyMCwgMjAsIDEwXSA9PiAxMFxuXG5cbiAgICB2YXIgYXZhaWxhYmxlID0gW107IC8vIEZvciBob3cgbWFueSBwb3NzaWJsZSBwb3NpdGlvbnMgZm9yIHRoaXMgaXRlbSB0aGVyZSBhcmUuXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBjb2x1bW5zIC0gY29sdW1uU3BhbjsgaSsrKSB7XG4gICAgICAvLyBGaW5kIHRoZSBiaWdnZXIgdmFsdWUgZm9yIGVhY2ggcGxhY2UgaXQgY291bGQgZml0LlxuICAgICAgYXZhaWxhYmxlLnB1c2goYXJyYXlNYXgocG9zaXRpb25zLnNsaWNlKGksIGkgKyBjb2x1bW5TcGFuKSkpO1xuICAgIH1cblxuICAgIHJldHVybiBhdmFpbGFibGU7XG4gIH1cbiAgLyoqXG4gICAqIEZpbmQgaW5kZXggb2Ygc2hvcnQgY29sdW1uLCB0aGUgZmlyc3QgZnJvbSB0aGUgbGVmdCB3aGVyZSB0aGlzIGl0ZW0gd2lsbCBnby5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gcG9zaXRpb25zIFRoZSBhcnJheSB0byBzZWFyY2ggZm9yIHRoZSBzbWFsbGVzdCBudW1iZXIuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBidWZmZXIgT3B0aW9uYWwgYnVmZmVyIHdoaWNoIGlzIHZlcnkgdXNlZnVsIHdoZW4gdGhlIGhlaWdodFxuICAgKiAgICAgaXMgYSBwZXJjZW50YWdlIG9mIHRoZSB3aWR0aC5cbiAgICogQHJldHVybiB7bnVtYmVyfSBJbmRleCBvZiB0aGUgc2hvcnQgY29sdW1uLlxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRTaG9ydENvbHVtbihwb3NpdGlvbnMsIGJ1ZmZlcikge1xuICAgIHZhciBtaW5Qb3NpdGlvbiA9IGFycmF5TWluKHBvc2l0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcG9zaXRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAocG9zaXRpb25zW2ldID49IG1pblBvc2l0aW9uIC0gYnVmZmVyICYmIHBvc2l0aW9uc1tpXSA8PSBtaW5Qb3NpdGlvbiArIGJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBsb2NhdGlvbiBvZiB0aGUgbmV4dCBpdGVtLCBiYXNlZCBvbiBpdHMgc2l6ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW1TaXplIE9iamVjdCB3aXRoIHdpZHRoIGFuZCBoZWlnaHQuXG4gICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IHBvc2l0aW9ucyBQb3NpdGlvbnMgb2YgdGhlIG90aGVyIGN1cnJlbnQgaXRlbXMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBncmlkU2l6ZSBUaGUgY29sdW1uIHdpZHRoIG9yIHJvdyBoZWlnaHQuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbCBUaGUgdG90YWwgbnVtYmVyIG9mIGNvbHVtbnMgb3Igcm93cy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHRocmVzaG9sZCBCdWZmZXIgdmFsdWUgZm9yIHRoZSBjb2x1bW4gdG8gZml0LlxuICAgKiBAcGFyYW0ge251bWJlcn0gYnVmZmVyIFZlcnRpY2FsIGJ1ZmZlciBmb3IgdGhlIGhlaWdodCBvZiBpdGVtcy5cbiAgICogQHJldHVybiB7UG9pbnR9XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGdldEl0ZW1Qb3NpdGlvbihfcmVmKSB7XG4gICAgdmFyIGl0ZW1TaXplID0gX3JlZi5pdGVtU2l6ZSxcbiAgICAgICAgcG9zaXRpb25zID0gX3JlZi5wb3NpdGlvbnMsXG4gICAgICAgIGdyaWRTaXplID0gX3JlZi5ncmlkU2l6ZSxcbiAgICAgICAgdG90YWwgPSBfcmVmLnRvdGFsLFxuICAgICAgICB0aHJlc2hvbGQgPSBfcmVmLnRocmVzaG9sZCxcbiAgICAgICAgYnVmZmVyID0gX3JlZi5idWZmZXI7XG4gICAgdmFyIHNwYW4gPSBnZXRDb2x1bW5TcGFuKGl0ZW1TaXplLndpZHRoLCBncmlkU2l6ZSwgdG90YWwsIHRocmVzaG9sZCk7XG4gICAgdmFyIHNldFkgPSBnZXRBdmFpbGFibGVQb3NpdGlvbnMocG9zaXRpb25zLCBzcGFuLCB0b3RhbCk7XG4gICAgdmFyIHNob3J0Q29sdW1uSW5kZXggPSBnZXRTaG9ydENvbHVtbihzZXRZLCBidWZmZXIpOyAvLyBQb3NpdGlvbiB0aGUgaXRlbVxuXG4gICAgdmFyIHBvaW50ID0gbmV3IFBvaW50KGdyaWRTaXplICogc2hvcnRDb2x1bW5JbmRleCwgc2V0WVtzaG9ydENvbHVtbkluZGV4XSk7IC8vIFVwZGF0ZSB0aGUgY29sdW1ucyBhcnJheSB3aXRoIHRoZSBuZXcgdmFsdWVzIGZvciBlYWNoIGNvbHVtbi5cbiAgICAvLyBlLmcuIGJlZm9yZSB0aGUgdXBkYXRlIHRoZSBjb2x1bW5zIGNvdWxkIGJlIFsyNTAsIDAsIDAsIDBdIGZvciBhbiBpdGVtXG4gICAgLy8gd2hpY2ggc3BhbnMgMiBjb2x1bW5zLiBBZnRlciBpdCB3b3VsZCBiZSBbMjUwLCBpdGVtSGVpZ2h0LCBpdGVtSGVpZ2h0LCAwXS5cblxuICAgIHZhciBzZXRIZWlnaHQgPSBzZXRZW3Nob3J0Q29sdW1uSW5kZXhdICsgaXRlbVNpemUuaGVpZ2h0O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGFuOyBpKyspIHtcbiAgICAgIHBvc2l0aW9uc1tzaG9ydENvbHVtbkluZGV4ICsgaV0gPSBzZXRIZWlnaHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvaW50O1xuICB9XG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBhdHRlbXB0cyB0byBjZW50ZXIgaXRlbXMuIFRoaXMgbWV0aG9kIGNvdWxkIHBvdGVudGlhbGx5IGJlIHNsb3dcbiAgICogd2l0aCBhIGxhcmdlIG51bWJlciBvZiBpdGVtcyBiZWNhdXNlIGl0IG11c3QgcGxhY2UgaXRlbXMsIHRoZW4gY2hlY2sgZXZlcnlcbiAgICogcHJldmlvdXMgaXRlbSB0byBlbnN1cmUgdGhlcmUgaXMgbm8gb3ZlcmxhcC5cbiAgICogQHBhcmFtIHtBcnJheS48UmVjdD59IGl0ZW1SZWN0cyBJdGVtIGRhdGEgb2JqZWN0cy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvbnRhaW5lcldpZHRoIFdpZHRoIG9mIHRoZSBjb250YWluaW5nIGVsZW1lbnQuXG4gICAqIEByZXR1cm4ge0FycmF5LjxQb2ludD59XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGdldENlbnRlcmVkUG9zaXRpb25zKGl0ZW1SZWN0cywgY29udGFpbmVyV2lkdGgpIHtcbiAgICB2YXIgcm93TWFwID0ge307IC8vIFBvcHVsYXRlIHJvd3MgYnkgdGhlaXIgb2Zmc2V0IGJlY2F1c2UgaXRlbXMgY291bGQganVtcCBiZXR3ZWVuIHJvd3MgbGlrZTpcbiAgICAvLyBhICAgY1xuICAgIC8vICBiYmJcblxuICAgIGl0ZW1SZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtUmVjdCkge1xuICAgICAgaWYgKHJvd01hcFtpdGVtUmVjdC50b3BdKSB7XG4gICAgICAgIC8vIFB1c2ggdGhlIHBvaW50IHRvIHRoZSBsYXN0IHJvdyBhcnJheS5cbiAgICAgICAgcm93TWFwW2l0ZW1SZWN0LnRvcF0ucHVzaChpdGVtUmVjdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTdGFydCBvZiBhIG5ldyByb3cuXG4gICAgICAgIHJvd01hcFtpdGVtUmVjdC50b3BdID0gW2l0ZW1SZWN0XTtcbiAgICAgIH1cbiAgICB9KTsgLy8gRm9yIGVhY2ggcm93LCBmaW5kIHRoZSBlbmQgb2YgdGhlIGxhc3QgaXRlbSwgdGhlbiBjYWxjdWxhdGVcbiAgICAvLyB0aGUgcmVtYWluaW5nIHNwYWNlIGJ5IGRpdmlkaW5nIGl0IGJ5IDIuIFRoZW4gYWRkIHRoYXRcbiAgICAvLyBvZmZzZXQgdG8gdGhlIHggcG9zaXRpb24gb2YgZWFjaCBwb2ludC5cblxuICAgIHZhciByZWN0cyA9IFtdO1xuICAgIHZhciByb3dzID0gW107XG4gICAgdmFyIGNlbnRlcmVkUm93cyA9IFtdO1xuICAgIE9iamVjdC5rZXlzKHJvd01hcCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgaXRlbVJlY3RzID0gcm93TWFwW2tleV07XG4gICAgICByb3dzLnB1c2goaXRlbVJlY3RzKTtcbiAgICAgIHZhciBsYXN0SXRlbSA9IGl0ZW1SZWN0c1tpdGVtUmVjdHMubGVuZ3RoIC0gMV07XG4gICAgICB2YXIgZW5kID0gbGFzdEl0ZW0ubGVmdCArIGxhc3RJdGVtLndpZHRoO1xuICAgICAgdmFyIG9mZnNldCA9IE1hdGgucm91bmQoKGNvbnRhaW5lcldpZHRoIC0gZW5kKSAvIDIpO1xuICAgICAgdmFyIGZpbmFsUmVjdHMgPSBpdGVtUmVjdHM7XG4gICAgICB2YXIgY2FuTW92ZSA9IGZhbHNlO1xuXG4gICAgICBpZiAob2Zmc2V0ID4gMCkge1xuICAgICAgICB2YXIgbmV3UmVjdHMgPSBbXTtcbiAgICAgICAgY2FuTW92ZSA9IGl0ZW1SZWN0cy5ldmVyeShmdW5jdGlvbiAocikge1xuICAgICAgICAgIHZhciBuZXdSZWN0ID0gbmV3IFJlY3Qoci5sZWZ0ICsgb2Zmc2V0LCByLnRvcCwgci53aWR0aCwgci5oZWlnaHQsIHIuaWQpOyAvLyBDaGVjayBhbGwgY3VycmVudCByZWN0cyB0byBtYWtlIHN1cmUgbm9uZSBvdmVybGFwLlxuXG4gICAgICAgICAgdmFyIG5vT3ZlcmxhcCA9ICFyZWN0cy5zb21lKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVjdC5pbnRlcnNlY3RzKG5ld1JlY3QsIHIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5ld1JlY3RzLnB1c2gobmV3UmVjdCk7XG4gICAgICAgICAgcmV0dXJuIG5vT3ZlcmxhcDtcbiAgICAgICAgfSk7IC8vIElmIG5vbmUgb2YgdGhlIHJlY3RhbmdsZXMgb3ZlcmxhcHBlZCwgdGhlIHdob2xlIGdyb3VwIGNhbiBiZSBjZW50ZXJlZC5cblxuICAgICAgICBpZiAoY2FuTW92ZSkge1xuICAgICAgICAgIGZpbmFsUmVjdHMgPSBuZXdSZWN0cztcbiAgICAgICAgfVxuICAgICAgfSAvLyBJZiB0aGUgaXRlbXMgYXJlIG5vdCBnb2luZyB0byBiZSBvZmZzZXQsIGVuc3VyZSB0aGF0IHRoZSBvcmlnaW5hbFxuICAgICAgLy8gcGxhY2VtZW50IGZvciB0aGlzIHJvdyB3aWxsIG5vdCBvdmVybGFwIHByZXZpb3VzIHJvd3MgKHJvdy1zcGFubmluZ1xuICAgICAgLy8gZWxlbWVudHMgY291bGQgYmUgaW4gdGhlIHdheSkuXG5cblxuICAgICAgaWYgKCFjYW5Nb3ZlKSB7XG4gICAgICAgIHZhciBpbnRlcnNlY3RpbmdSZWN0O1xuICAgICAgICB2YXIgaGFzT3ZlcmxhcCA9IGl0ZW1SZWN0cy5zb21lKGZ1bmN0aW9uIChpdGVtUmVjdCkge1xuICAgICAgICAgIHJldHVybiByZWN0cy5zb21lKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgICAgICB2YXIgaW50ZXJzZWN0cyA9IFJlY3QuaW50ZXJzZWN0cyhpdGVtUmVjdCwgcik7XG5cbiAgICAgICAgICAgIGlmIChpbnRlcnNlY3RzKSB7XG4gICAgICAgICAgICAgIGludGVyc2VjdGluZ1JlY3QgPSByO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaW50ZXJzZWN0cztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7IC8vIElmIHRoZXJlIGlzIGFueSBvdmVybGFwLCByZXBsYWNlIHRoZSBvdmVybGFwcGluZyByb3cgd2l0aCB0aGUgb3JpZ2luYWwuXG5cbiAgICAgICAgaWYgKGhhc092ZXJsYXApIHtcbiAgICAgICAgICB2YXIgcm93SW5kZXggPSBjZW50ZXJlZFJvd3MuZmluZEluZGV4KGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1zLmluY2x1ZGVzKGludGVyc2VjdGluZ1JlY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNlbnRlcmVkUm93cy5zcGxpY2Uocm93SW5kZXgsIDEsIHJvd3Nbcm93SW5kZXhdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZWN0cyA9IHJlY3RzLmNvbmNhdChmaW5hbFJlY3RzKTtcbiAgICAgIGNlbnRlcmVkUm93cy5wdXNoKGZpbmFsUmVjdHMpO1xuICAgIH0pOyAvLyBSZWR1Y2UgYXJyYXkgb2YgYXJyYXlzIHRvIGEgc2luZ2xlIGFycmF5IG9mIHBvaW50cy5cbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTA4NjUwNDIvMzczNDIyXG4gICAgLy8gVGhlbiByZXNldCBzb3J0IGJhY2sgdG8gaG93IHRoZSBpdGVtcyB3ZXJlIHBhc3NlZCB0byB0aGlzIG1ldGhvZC5cbiAgICAvLyBSZW1vdmUgdGhlIHdyYXBwZXIgb2JqZWN0IHdpdGggaW5kZXgsIG1hcCB0byBhIFBvaW50LlxuXG4gICAgcmV0dXJuIFtdLmNvbmNhdC5hcHBseShbXSwgY2VudGVyZWRSb3dzKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHByZWZlci1zcHJlYWRcbiAgICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGEuaWQgLSBiLmlkO1xuICAgIH0pLm1hcChmdW5jdGlvbiAoaXRlbVJlY3QpIHtcbiAgICAgIHJldHVybiBuZXcgUG9pbnQoaXRlbVJlY3QubGVmdCwgaXRlbVJlY3QudG9wKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIeXBoZW5hdGVzIGEgamF2YXNjcmlwdCBzdHlsZSBzdHJpbmcgdG8gYSBjc3Mgb25lLiBGb3IgZXhhbXBsZTpcbiAgICogTW96Qm94U2l6aW5nIC0+IC1tb3otYm94LXNpemluZy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRvIGh5cGhlbmF0ZS5cbiAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgaHlwaGVuYXRlZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiBoeXBoZW5hdGUoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uIChzdHIsIG0xKSB7XG4gICAgICByZXR1cm4gXCItXCIuY29uY2F0KG0xLnRvTG93ZXJDYXNlKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlVbmlxdWUoeCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoeCkpO1xuICB9IC8vIFVzZWQgZm9yIHVuaXF1ZSBpbnN0YW5jZSB2YXJpYWJsZXNcblxuXG4gIHZhciBpZCQxID0gMDtcblxuICB2YXIgU2h1ZmZsZSA9XG4gIC8qI19fUFVSRV9fKi9cbiAgZnVuY3Rpb24gKF9UaW55RW1pdHRlcikge1xuICAgIF9pbmhlcml0cyhTaHVmZmxlLCBfVGlueUVtaXR0ZXIpO1xuXG4gICAgLyoqXG4gICAgICogQ2F0ZWdvcml6ZSwgc29ydCwgYW5kIGZpbHRlciBhIHJlc3BvbnNpdmUgZ3JpZCBvZiBpdGVtcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBBbiBlbGVtZW50IHdoaWNoIGlzIHRoZSBwYXJlbnQgY29udGFpbmVyIGZvciB0aGUgZ3JpZCBpdGVtcy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9U2h1ZmZsZS5vcHRpb25zXSBPcHRpb25zIG9iamVjdC5cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBTaHVmZmxlKGVsZW1lbnQpIHtcbiAgICAgIHZhciBfdGhpcztcblxuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2h1ZmZsZSk7XG5cbiAgICAgIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFNodWZmbGUpLmNhbGwodGhpcykpO1xuICAgICAgX3RoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIFNodWZmbGUub3B0aW9ucywgb3B0aW9ucyk7IC8vIEFsbG93IG1pc3NwZWxsaW5nIG9mIGRlbGltaXRlciBzaW5jZSB0aGF0J3MgaG93IGl0IHVzZWQgdG8gYmUuXG4gICAgICAvLyBSZW1vdmUgaW4gdjYuXG5cbiAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlbGltZXRlcikge1xuICAgICAgICBfdGhpcy5vcHRpb25zLmRlbGltaXRlciA9IF90aGlzLm9wdGlvbnMuZGVsaW1ldGVyO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5sYXN0U29ydCA9IHt9O1xuICAgICAgX3RoaXMuZ3JvdXAgPSBTaHVmZmxlLkFMTF9JVEVNUztcbiAgICAgIF90aGlzLmxhc3RGaWx0ZXIgPSBTaHVmZmxlLkFMTF9JVEVNUztcbiAgICAgIF90aGlzLmlzRW5hYmxlZCA9IHRydWU7XG4gICAgICBfdGhpcy5pc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgICAgX3RoaXMuaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgICAgX3RoaXMuX3RyYW5zaXRpb25zID0gW107XG4gICAgICBfdGhpcy5pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcbiAgICAgIF90aGlzLl9xdWV1ZSA9IFtdO1xuXG4gICAgICB2YXIgZWwgPSBfdGhpcy5fZ2V0RWxlbWVudE9wdGlvbihlbGVtZW50KTtcblxuICAgICAgaWYgKCFlbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdTaHVmZmxlIG5lZWRzIHRvIGJlIGluaXRpYWxpemVkIHdpdGggYW4gZWxlbWVudC4nKTtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuZWxlbWVudCA9IGVsO1xuICAgICAgX3RoaXMuaWQgPSAnc2h1ZmZsZV8nICsgaWQkMTtcbiAgICAgIGlkJDEgKz0gMTtcblxuICAgICAgX3RoaXMuX2luaXQoKTtcblxuICAgICAgX3RoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFNodWZmbGUsIFt7XG4gICAgICBrZXk6IFwiX2luaXRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaW5pdCgpIHtcbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuX2dldEl0ZW1zKCk7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zaXplciA9IHRoaXMuX2dldEVsZW1lbnRPcHRpb24odGhpcy5vcHRpb25zLnNpemVyKTsgLy8gQWRkIGNsYXNzIGFuZCBpbnZhbGlkYXRlIHN0eWxlc1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFNodWZmbGUuQ2xhc3Nlcy5CQVNFKTsgLy8gU2V0IGluaXRpYWwgY3NzIGZvciBlYWNoIGl0ZW1cblxuICAgICAgICB0aGlzLl9pbml0SXRlbXModGhpcy5pdGVtcyk7IC8vIEJpbmQgcmVzaXplIGV2ZW50c1xuXG5cbiAgICAgICAgdGhpcy5fb25SZXNpemUgPSB0aGlzLl9nZXRSZXNpemVGdW5jdGlvbigpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25SZXNpemUpOyAvLyBJZiB0aGUgcGFnZSBoYXMgbm90IGFscmVhZHkgZW1pdHRlZCB0aGUgYGxvYWRgIGV2ZW50LCBjYWxsIGxheW91dCBvbiBsb2FkLlxuICAgICAgICAvLyBUaGlzIGF2b2lkcyBsYXlvdXQgaXNzdWVzIGNhdXNlZCBieSBpbWFnZXMgYW5kIGZvbnRzIGxvYWRpbmcgYWZ0ZXIgdGhlXG4gICAgICAgIC8vIGluc3RhbmNlIGhhcyBiZWVuIGluaXRpYWxpemVkLlxuXG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnY29tcGxldGUnKSB7XG4gICAgICAgICAgdmFyIGxheW91dCA9IHRoaXMubGF5b3V0LmJpbmQodGhpcyk7XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uTG9hZCk7XG4gICAgICAgICAgICBsYXlvdXQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSAvLyBHZXQgY29udGFpbmVyIGNzcyBhbGwgaW4gb25lIHJlcXVlc3QuIENhdXNlcyByZWZsb3dcblxuXG4gICAgICAgIHZhciBjb250YWluZXJDc3MgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQsIG51bGwpO1xuICAgICAgICB2YXIgY29udGFpbmVyV2lkdGggPSBTaHVmZmxlLmdldFNpemUodGhpcy5lbGVtZW50KS53aWR0aDsgLy8gQWRkIHN0eWxlcyB0byB0aGUgY29udGFpbmVyIGlmIGl0IGRvZXNuJ3QgaGF2ZSB0aGVtLlxuXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlU3R5bGVzKGNvbnRhaW5lckNzcyk7IC8vIFdlIGFscmVhZHkgZ290IHRoZSBjb250YWluZXIncyB3aWR0aCBhYm92ZSwgbm8gbmVlZCB0byBjYXVzZSBhbm90aGVyXG4gICAgICAgIC8vIHJlZmxvdyBnZXR0aW5nIGl0IGFnYWluLi4uIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIGNvbHVtbnMgdGhlcmUgd2lsbCBiZVxuXG5cbiAgICAgICAgdGhpcy5fc2V0Q29sdW1ucyhjb250YWluZXJXaWR0aCk7IC8vIEtpY2sgb2ZmIVxuXG5cbiAgICAgICAgdGhpcy5maWx0ZXIodGhpcy5vcHRpb25zLmdyb3VwLCB0aGlzLm9wdGlvbnMuaW5pdGlhbFNvcnQpOyAvLyBUaGUgc2h1ZmZsZSBpdGVtcyBoYXZlbid0IGhhZCB0cmFuc2l0aW9ucyBzZXQgb24gdGhlbSB5ZXQgc28gdGhlIHVzZXJcbiAgICAgICAgLy8gZG9lc24ndCBzZWUgdGhlIGZpcnN0IGxheW91dC4gU2V0IHRoZW0gbm93IHRoYXQgdGhlIGZpcnN0IGxheW91dCBpcyBkb25lLlxuICAgICAgICAvLyBGaXJzdCwgaG93ZXZlciwgYSBzeW5jaHJvbm91cyBsYXlvdXQgbXVzdCBiZSBjYXVzZWQgZm9yIHRoZSBwcmV2aW91c1xuICAgICAgICAvLyBzdHlsZXMgdG8gYmUgYXBwbGllZCB3aXRob3V0IHRyYW5zaXRpb25zLlxuXG4gICAgICAgIHRoaXMuZWxlbWVudC5vZmZzZXRXaWR0aDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcblxuICAgICAgICB0aGlzLnNldEl0ZW1UcmFuc2l0aW9ucyh0aGlzLml0ZW1zKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBcImhlaWdodCBcIi5jb25jYXQodGhpcy5vcHRpb25zLnNwZWVkLCBcIm1zIFwiKS5jb25jYXQodGhpcy5vcHRpb25zLmVhc2luZyk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgYSB0aHJvdHRsZWQgYW5kIHByb3hpZWQgZnVuY3Rpb24gZm9yIHRoZSByZXNpemUgaGFuZGxlci5cbiAgICAgICAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXRSZXNpemVGdW5jdGlvblwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRSZXNpemVGdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlc2l6ZUZ1bmN0aW9uID0gdGhpcy5faGFuZGxlUmVzaXplLmJpbmQodGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy50aHJvdHRsZSA/IHRoaXMub3B0aW9ucy50aHJvdHRsZShyZXNpemVGdW5jdGlvbiwgdGhpcy5vcHRpb25zLnRocm90dGxlVGltZSkgOiByZXNpemVGdW5jdGlvbjtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmV0cmlldmUgYW4gZWxlbWVudCBmcm9tIGFuIG9wdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfGpRdWVyeXxFbGVtZW50fSBvcHRpb24gVGhlIG9wdGlvbiB0byBjaGVjay5cbiAgICAgICAqIEByZXR1cm4gez9FbGVtZW50fSBUaGUgcGxhaW4gZWxlbWVudCBvciBudWxsLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXRFbGVtZW50T3B0aW9uXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldEVsZW1lbnRPcHRpb24ob3B0aW9uKSB7XG4gICAgICAgIC8vIElmIGNvbHVtbiB3aWR0aCBpcyBhIHN0cmluZywgdHJlYXQgaXMgYXMgYSBzZWxlY3RvciBhbmQgc2VhcmNoIGZvciB0aGVcbiAgICAgICAgLy8gc2l6ZXIgZWxlbWVudCB3aXRoaW4gdGhlIG91dGVybW9zdCBjb250YWluZXJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbik7XG4gICAgICAgIH0gLy8gQ2hlY2sgZm9yIGFuIGVsZW1lbnRcblxuXG4gICAgICAgIGlmIChvcHRpb24gJiYgb3B0aW9uLm5vZGVUeXBlICYmIG9wdGlvbi5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgIHJldHVybiBvcHRpb247XG4gICAgICAgIH0gLy8gQ2hlY2sgZm9yIGpRdWVyeSBvYmplY3RcblxuXG4gICAgICAgIGlmIChvcHRpb24gJiYgb3B0aW9uLmpxdWVyeSkge1xuICAgICAgICAgIHJldHVybiBvcHRpb25bMF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogRW5zdXJlcyB0aGUgc2h1ZmZsZSBjb250YWluZXIgaGFzIHRoZSBjc3Mgc3R5bGVzIGl0IG5lZWRzIGFwcGxpZWQgdG8gaXQuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGVzIEtleSB2YWx1ZSBwYWlycyBmb3IgcG9zaXRpb24gYW5kIG92ZXJmbG93LlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl92YWxpZGF0ZVN0eWxlc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF92YWxpZGF0ZVN0eWxlcyhzdHlsZXMpIHtcbiAgICAgICAgLy8gUG9zaXRpb24gY2Fubm90IGJlIHN0YXRpYy5cbiAgICAgICAgaWYgKHN0eWxlcy5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgICB9IC8vIE92ZXJmbG93IGhhcyB0byBiZSBoaWRkZW4uXG5cblxuICAgICAgICBpZiAoc3R5bGVzLm92ZXJmbG93ICE9PSAnaGlkZGVuJykge1xuICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEZpbHRlciB0aGUgZWxlbWVudHMgYnkgYSBjYXRlZ29yeS5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfGZ1bmN0aW9uKEVsZW1lbnQpOmJvb2xlYW59IFtjYXRlZ29yeV0gQ2F0ZWdvcnkgdG9cbiAgICAgICAqICAgICBmaWx0ZXIgYnkuIElmIGl0J3MgZ2l2ZW4sIHRoZSBsYXN0IGNhdGVnb3J5IHdpbGwgYmUgdXNlZCB0byBmaWx0ZXIgdGhlIGl0ZW1zLlxuICAgICAgICogQHBhcmFtIHtBcnJheX0gW2NvbGxlY3Rpb25dIE9wdGlvbmFsbHkgZmlsdGVyIGEgY29sbGVjdGlvbi4gRGVmYXVsdHMgdG9cbiAgICAgICAqICAgICBhbGwgdGhlIGl0ZW1zLlxuICAgICAgICogQHJldHVybiB7e3Zpc2libGU6IFNodWZmbGVJdGVtW10sIGhpZGRlbjogU2h1ZmZsZUl0ZW1bXX19XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2ZpbHRlclwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9maWx0ZXIoKSB7XG4gICAgICAgIHZhciBjYXRlZ29yeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdGhpcy5sYXN0RmlsdGVyO1xuICAgICAgICB2YXIgY29sbGVjdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy5pdGVtcztcblxuICAgICAgICB2YXIgc2V0ID0gdGhpcy5fZ2V0RmlsdGVyZWRTZXRzKGNhdGVnb3J5LCBjb2xsZWN0aW9uKTsgLy8gSW5kaXZpZHVhbGx5IGFkZC9yZW1vdmUgaGlkZGVuL3Zpc2libGUgY2xhc3Nlc1xuXG5cbiAgICAgICAgdGhpcy5fdG9nZ2xlRmlsdGVyQ2xhc3NlcyhzZXQpOyAvLyBTYXZlIHRoZSBsYXN0IGZpbHRlciBpbiBjYXNlIGVsZW1lbnRzIGFyZSBhcHBlbmRlZC5cblxuXG4gICAgICAgIHRoaXMubGFzdEZpbHRlciA9IGNhdGVnb3J5OyAvLyBUaGlzIGlzIHNhdmVkIG1haW5seSBiZWNhdXNlIHByb3ZpZGluZyBhIGZpbHRlciBmdW5jdGlvbiAobGlrZSBzZWFyY2hpbmcpXG4gICAgICAgIC8vIHdpbGwgb3ZlcndyaXRlIHRoZSBgbGFzdEZpbHRlcmAgcHJvcGVydHkgZXZlcnkgdGltZSBpdHMgY2FsbGVkLlxuXG4gICAgICAgIGlmICh0eXBlb2YgY2F0ZWdvcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhpcy5ncm91cCA9IGNhdGVnb3J5O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNldDtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgdmlzaWJsZSBhbmQgaGlkZGVuIGVsZW1lbnRzLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW118ZnVuY3Rpb24oRWxlbWVudCk6Ym9vbGVhbn0gY2F0ZWdvcnkgQ2F0ZWdvcnkgb3IgZnVuY3Rpb24gdG8gZmlsdGVyIGJ5LlxuICAgICAgICogQHBhcmFtIHtTaHVmZmxlSXRlbVtdfSBpdGVtcyBBIGNvbGxlY3Rpb24gb2YgaXRlbXMgdG8gZmlsdGVyLlxuICAgICAgICogQHJldHVybiB7e3Zpc2libGU6IFNodWZmbGVJdGVtW10sIGhpZGRlbjogU2h1ZmZsZUl0ZW1bXX19XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldEZpbHRlcmVkU2V0c1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRGaWx0ZXJlZFNldHMoY2F0ZWdvcnksIGl0ZW1zKSB7XG4gICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgIHZhciB2aXNpYmxlID0gW107XG4gICAgICAgIHZhciBoaWRkZW4gPSBbXTsgLy8gY2F0ZWdvcnkgPT09ICdhbGwnLCBhZGQgdmlzaWJsZSBjbGFzcyB0byBldmVyeXRoaW5nXG5cbiAgICAgICAgaWYgKGNhdGVnb3J5ID09PSBTaHVmZmxlLkFMTF9JVEVNUykge1xuICAgICAgICAgIHZpc2libGUgPSBpdGVtczsgLy8gTG9vcCB0aHJvdWdoIGVhY2ggaXRlbSBhbmQgdXNlIHByb3ZpZGVkIGZ1bmN0aW9uIHRvIGRldGVybWluZVxuICAgICAgICAgIC8vIHdoZXRoZXIgdG8gaGlkZSBpdCBvciBub3QuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaWYgKF90aGlzMi5fZG9lc1Bhc3NGaWx0ZXIoY2F0ZWdvcnksIGl0ZW0uZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgdmlzaWJsZS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaGlkZGVuLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZpc2libGU6IHZpc2libGUsXG4gICAgICAgICAgaGlkZGVuOiBoaWRkZW5cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogVGVzdCBhbiBpdGVtIHRvIHNlZSBpZiBpdCBwYXNzZXMgYSBjYXRlZ29yeS5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfGZ1bmN0aW9uKCk6Ym9vbGVhbn0gY2F0ZWdvcnkgQ2F0ZWdvcnkgb3IgZnVuY3Rpb24gdG8gZmlsdGVyIGJ5LlxuICAgICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEFuIGVsZW1lbnQgdG8gdGVzdC5cbiAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgaXQgcGFzc2VzIHRoZSBjYXRlZ29yeS9maWx0ZXIuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2RvZXNQYXNzRmlsdGVyXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2RvZXNQYXNzRmlsdGVyKGNhdGVnb3J5LCBlbGVtZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2F0ZWdvcnkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gY2F0ZWdvcnkuY2FsbChlbGVtZW50LCBlbGVtZW50LCB0aGlzKTtcbiAgICAgICAgfSAvLyBDaGVjayBlYWNoIGVsZW1lbnQncyBkYXRhLWdyb3VwcyBhdHRyaWJ1dGUgYWdhaW5zdCB0aGUgZ2l2ZW4gY2F0ZWdvcnkuXG5cblxuICAgICAgICB2YXIgYXR0ciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLScgKyBTaHVmZmxlLkZJTFRFUl9BVFRSSUJVVEVfS0VZKTtcbiAgICAgICAgdmFyIGtleXMgPSB0aGlzLm9wdGlvbnMuZGVsaW1pdGVyID8gYXR0ci5zcGxpdCh0aGlzLm9wdGlvbnMuZGVsaW1pdGVyKSA6IEpTT04ucGFyc2UoYXR0cik7XG5cbiAgICAgICAgZnVuY3Rpb24gdGVzdENhdGVnb3J5KGNhdGVnb3J5KSB7XG4gICAgICAgICAgcmV0dXJuIGtleXMuaW5jbHVkZXMoY2F0ZWdvcnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2F0ZWdvcnkpKSB7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5maWx0ZXJNb2RlID09PSBTaHVmZmxlLkZpbHRlck1vZGUuQU5ZKSB7XG4gICAgICAgICAgICByZXR1cm4gY2F0ZWdvcnkuc29tZSh0ZXN0Q2F0ZWdvcnkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBjYXRlZ29yeS5ldmVyeSh0ZXN0Q2F0ZWdvcnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXMuaW5jbHVkZXMoY2F0ZWdvcnkpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGVzIHRoZSB2aXNpYmxlIGFuZCBoaWRkZW4gY2xhc3MgbmFtZXMuXG4gICAgICAgKiBAcGFyYW0ge3t2aXNpYmxlLCBoaWRkZW59fSBPYmplY3Qgd2l0aCB2aXNpYmxlIGFuZCBoaWRkZW4gYXJyYXlzLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl90b2dnbGVGaWx0ZXJDbGFzc2VzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3RvZ2dsZUZpbHRlckNsYXNzZXMoX3JlZikge1xuICAgICAgICB2YXIgdmlzaWJsZSA9IF9yZWYudmlzaWJsZSxcbiAgICAgICAgICAgIGhpZGRlbiA9IF9yZWYuaGlkZGVuO1xuICAgICAgICB2aXNpYmxlLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICBpdGVtLnNob3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGhpZGRlbi5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgaXRlbS5oaWRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgdGhlIGluaXRpYWwgY3NzIGZvciBlYWNoIGl0ZW1cbiAgICAgICAqIEBwYXJhbSB7U2h1ZmZsZUl0ZW1bXX0gaXRlbXMgU2V0IHRvIGluaXRpYWxpemUuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2luaXRJdGVtc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9pbml0SXRlbXMoaXRlbXMpIHtcbiAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIGl0ZW0uaW5pdCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIGVsZW1lbnQgcmVmZXJlbmNlIGFuZCBzdHlsZXMuXG4gICAgICAgKiBAcGFyYW0ge1NodWZmbGVJdGVtW119IGl0ZW1zIFNldCB0byBkaXNwb3NlLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9kaXNwb3NlSXRlbXNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZGlzcG9zZUl0ZW1zKGl0ZW1zKSB7XG4gICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICBpdGVtLmRpc3Bvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFVwZGF0ZXMgdGhlIHZpc2libGUgaXRlbSBjb3VudC5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfdXBkYXRlSXRlbUNvdW50XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3VwZGF0ZUl0ZW1Db3VudCgpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlSXRlbXMgPSB0aGlzLl9nZXRGaWx0ZXJlZEl0ZW1zKCkubGVuZ3RoO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBTZXRzIGNzcyB0cmFuc2Zvcm0gdHJhbnNpdGlvbiBvbiBhIGdyb3VwIG9mIGVsZW1lbnRzLiBUaGlzIGlzIG5vdCBleGVjdXRlZFxuICAgICAgICogYXQgdGhlIHNhbWUgdGltZSBhcyBgaXRlbS5pbml0YCBzbyB0aGF0IHRyYW5zaXRpb25zIGRvbid0IG9jY3VyIHVwb25cbiAgICAgICAqIGluaXRpYWxpemF0aW9uIG9mIGEgbmV3IFNodWZmbGUgaW5zdGFuY2UuXG4gICAgICAgKiBAcGFyYW0ge1NodWZmbGVJdGVtW119IGl0ZW1zIFNodWZmbGUgaXRlbXMgdG8gc2V0IHRyYW5zaXRpb25zIG9uLlxuICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwic2V0SXRlbVRyYW5zaXRpb25zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0SXRlbVRyYW5zaXRpb25zKGl0ZW1zKSB7XG4gICAgICAgIHZhciBfdGhpcyRvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgc3BlZWQgPSBfdGhpcyRvcHRpb25zLnNwZWVkLFxuICAgICAgICAgICAgZWFzaW5nID0gX3RoaXMkb3B0aW9ucy5lYXNpbmc7XG4gICAgICAgIHZhciBwb3NpdGlvblByb3BzID0gdGhpcy5vcHRpb25zLnVzZVRyYW5zZm9ybXMgPyBbJ3RyYW5zZm9ybSddIDogWyd0b3AnLCAnbGVmdCddOyAvLyBBbGxvdyB1c2VycyB0byB0cmFuc3Rpb24gb3RoZXIgcHJvcGVydGllcyBpZiB0aGV5IGV4aXN0IGluIHRoZSBgYmVmb3JlYFxuICAgICAgICAvLyBjc3MgbWFwcGluZyBvZiB0aGUgc2h1ZmZsZSBpdGVtLlxuXG4gICAgICAgIHZhciBjc3NQcm9wcyA9IE9iamVjdC5rZXlzKFNodWZmbGVJdGVtLkNzcy5ISURERU4uYmVmb3JlKS5tYXAoZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICByZXR1cm4gaHlwaGVuYXRlKGspO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBwb3NpdGlvblByb3BzLmNvbmNhdChjc3NQcm9wcykuam9pbigpO1xuICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgaXRlbS5lbGVtZW50LnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHNwZWVkICsgJ21zJztcbiAgICAgICAgICBpdGVtLmVsZW1lbnQuc3R5bGUudHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uID0gZWFzaW5nO1xuICAgICAgICAgIGl0ZW0uZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uUHJvcGVydHkgPSBwcm9wZXJ0aWVzO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldEl0ZW1zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldEl0ZW1zKCkge1xuICAgICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQuY2hpbGRyZW4pLmZpbHRlcihmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICByZXR1cm4gbWF0Y2hlc1NlbGVjdG9yKGVsLCBfdGhpczMub3B0aW9ucy5pdGVtU2VsZWN0b3IpO1xuICAgICAgICB9KS5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBTaHVmZmxlSXRlbShlbCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBDb21iaW5lIHRoZSBjdXJyZW50IGl0ZW1zIGFycmF5IHdpdGggYSBuZXcgb25lIGFuZCBzb3J0IGl0IGJ5IERPTSBvcmRlci5cbiAgICAgICAqIEBwYXJhbSB7U2h1ZmZsZUl0ZW1bXX0gaXRlbXMgSXRlbXMgdG8gdHJhY2suXG4gICAgICAgKiBAcmV0dXJuIHtTaHVmZmxlSXRlbVtdfVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX21lcmdlTmV3SXRlbXNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfbWVyZ2VOZXdJdGVtcyhpdGVtcykge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5jaGlsZHJlbik7XG4gICAgICAgIHJldHVybiBzb3J0ZXIodGhpcy5pdGVtcy5jb25jYXQoaXRlbXMpLCB7XG4gICAgICAgICAgYnk6IGZ1bmN0aW9uIGJ5KGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZHJlbi5pbmRleE9mKGVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXRGaWx0ZXJlZEl0ZW1zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldEZpbHRlcmVkSXRlbXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLmlzVmlzaWJsZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXRDb25jZWFsZWRJdGVtc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRDb25jZWFsZWRJdGVtcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuICFpdGVtLmlzVmlzaWJsZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdGhlIGNvbHVtbiBzaXplLCBiYXNlZCBvbiBjb2x1bW4gd2lkdGggYW5kIHNpemVyIG9wdGlvbnMuXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gY29udGFpbmVyV2lkdGggU2l6ZSBvZiB0aGUgcGFyZW50IGNvbnRhaW5lci5cbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBndXR0ZXJTaXplIFNpemUgb2YgdGhlIGd1dHRlcnMuXG4gICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldENvbHVtblNpemVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0Q29sdW1uU2l6ZShjb250YWluZXJXaWR0aCwgZ3V0dGVyU2l6ZSkge1xuICAgICAgICB2YXIgc2l6ZTsgLy8gSWYgdGhlIGNvbHVtbldpZHRoIHByb3BlcnR5IGlzIGEgZnVuY3Rpb24sIHRoZW4gdGhlIGdyaWQgaXMgZmx1aWRcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5jb2x1bW5XaWR0aCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHNpemUgPSB0aGlzLm9wdGlvbnMuY29sdW1uV2lkdGgoY29udGFpbmVyV2lkdGgpOyAvLyBjb2x1bW5XaWR0aCBvcHRpb24gaXNuJ3QgYSBmdW5jdGlvbiwgYXJlIHRoZXkgdXNpbmcgYSBzaXppbmcgZWxlbWVudD9cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc2l6ZXIpIHtcbiAgICAgICAgICBzaXplID0gU2h1ZmZsZS5nZXRTaXplKHRoaXMub3B0aW9ucy5zaXplcikud2lkdGg7IC8vIGlmIG5vdCwgaG93IGFib3V0IHRoZSBleHBsaWNpdGx5IHNldCBvcHRpb24/XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmNvbHVtbldpZHRoKSB7XG4gICAgICAgICAgc2l6ZSA9IHRoaXMub3B0aW9ucy5jb2x1bW5XaWR0aDsgLy8gb3IgdXNlIHRoZSBzaXplIG9mIHRoZSBmaXJzdCBpdGVtXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc2l6ZSA9IFNodWZmbGUuZ2V0U2l6ZSh0aGlzLml0ZW1zWzBdLmVsZW1lbnQsIHRydWUpLndpZHRoOyAvLyBpZiB0aGVyZSdzIG5vIGl0ZW1zLCB1c2Ugc2l6ZSBvZiBjb250YWluZXJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzaXplID0gY29udGFpbmVyV2lkdGg7XG4gICAgICAgIH0gLy8gRG9uJ3QgbGV0IHRoZW0gc2V0IGEgY29sdW1uIHdpZHRoIG9mIHplcm8uXG5cblxuICAgICAgICBpZiAoc2l6ZSA9PT0gMCkge1xuICAgICAgICAgIHNpemUgPSBjb250YWluZXJXaWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaXplICsgZ3V0dGVyU2l6ZTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0aGUgZ3V0dGVyIHNpemUsIGJhc2VkIG9uIGd1dHRlciB3aWR0aCBhbmQgc2l6ZXIgb3B0aW9ucy5cbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb250YWluZXJXaWR0aCBTaXplIG9mIHRoZSBwYXJlbnQgY29udGFpbmVyLlxuICAgICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXRHdXR0ZXJTaXplXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldEd1dHRlclNpemUoY29udGFpbmVyV2lkdGgpIHtcbiAgICAgICAgdmFyIHNpemU7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZ3V0dGVyV2lkdGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBzaXplID0gdGhpcy5vcHRpb25zLmd1dHRlcldpZHRoKGNvbnRhaW5lcldpZHRoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc2l6ZXIpIHtcbiAgICAgICAgICBzaXplID0gZ2V0TnVtYmVyU3R5bGUodGhpcy5vcHRpb25zLnNpemVyLCAnbWFyZ2luTGVmdCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNpemUgPSB0aGlzLm9wdGlvbnMuZ3V0dGVyV2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2l6ZTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2YgY29sdW1ucyB0byBiZSB1c2VkLiBHZXRzIGNzcyBpZiB1c2luZyBzaXplciBlbGVtZW50LlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtjb250YWluZXJXaWR0aF0gT3B0aW9uYWxseSBzcGVjaWZ5IGEgY29udGFpbmVyIHdpZHRoIGlmXG4gICAgICAgKiAgICBpdCdzIGFscmVhZHkgYXZhaWxhYmxlLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3NldENvbHVtbnNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfc2V0Q29sdW1ucygpIHtcbiAgICAgICAgdmFyIGNvbnRhaW5lcldpZHRoID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBTaHVmZmxlLmdldFNpemUodGhpcy5lbGVtZW50KS53aWR0aDtcblxuICAgICAgICB2YXIgZ3V0dGVyID0gdGhpcy5fZ2V0R3V0dGVyU2l6ZShjb250YWluZXJXaWR0aCk7XG5cbiAgICAgICAgdmFyIGNvbHVtbldpZHRoID0gdGhpcy5fZ2V0Q29sdW1uU2l6ZShjb250YWluZXJXaWR0aCwgZ3V0dGVyKTtcblxuICAgICAgICB2YXIgY2FsY3VsYXRlZENvbHVtbnMgPSAoY29udGFpbmVyV2lkdGggKyBndXR0ZXIpIC8gY29sdW1uV2lkdGg7IC8vIFdpZHRocyBnaXZlbiBmcm9tIGdldFN0eWxlcyBhcmUgbm90IHByZWNpc2UgZW5vdWdoLi4uXG5cbiAgICAgICAgaWYgKE1hdGguYWJzKE1hdGgucm91bmQoY2FsY3VsYXRlZENvbHVtbnMpIC0gY2FsY3VsYXRlZENvbHVtbnMpIDwgdGhpcy5vcHRpb25zLmNvbHVtblRocmVzaG9sZCkge1xuICAgICAgICAgIC8vIGUuZy4gY2FsY3VsYXRlZENvbHVtbnMgPSAxMS45OTg4NzZcbiAgICAgICAgICBjYWxjdWxhdGVkQ29sdW1ucyA9IE1hdGgucm91bmQoY2FsY3VsYXRlZENvbHVtbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb2xzID0gTWF0aC5tYXgoTWF0aC5mbG9vcihjYWxjdWxhdGVkQ29sdW1ucyB8fCAwKSwgMSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyV2lkdGggPSBjb250YWluZXJXaWR0aDtcbiAgICAgICAgdGhpcy5jb2xXaWR0aCA9IGNvbHVtbldpZHRoO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBBZGp1c3QgdGhlIGhlaWdodCBvZiB0aGUgZ3JpZFxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3NldENvbnRhaW5lclNpemVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfc2V0Q29udGFpbmVyU2l6ZSgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuX2dldENvbnRhaW5lclNpemUoKSArICdweCc7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEJhc2VkIG9uIHRoZSBjb2x1bW4gaGVpZ2h0cywgaXQgcmV0dXJucyB0aGUgYmlnZ2VzdCBvbmUuXG4gICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldENvbnRhaW5lclNpemVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0Q29udGFpbmVyU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIGFycmF5TWF4KHRoaXMucG9zaXRpb25zKTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogR2V0IHRoZSBjbGFtcGVkIHN0YWdnZXIgYW1vdW50LlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IEluZGV4IG9mIHRoZSBpdGVtIHRvIGJlIHN0YWdnZXJlZC5cbiAgICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXRTdGFnZ2VyQW1vdW50XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFN0YWdnZXJBbW91bnQoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKGluZGV4ICogdGhpcy5vcHRpb25zLnN0YWdnZXJBbW91bnQsIHRoaXMub3B0aW9ucy5zdGFnZ2VyQW1vdW50TWF4KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogRW1pdCBhbiBldmVudCBmcm9tIHRoaXMgaW5zdGFuY2UuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBFdmVudCBuYW1lLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtkYXRhPXt9XSBPcHRpb25hbCBvYmplY3QgZGF0YS5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9kaXNwYXRjaFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9kaXNwYXRjaChuYW1lKSB7XG4gICAgICAgIHZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgICAgICBpZiAodGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEuc2h1ZmZsZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuZW1pdChuYW1lLCBkYXRhKTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogWmVyb3Mgb3V0IHRoZSB5IGNvbHVtbnMgYXJyYXksIHdoaWNoIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGl0ZW0gcGxhY2VtZW50LlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9yZXNldENvbHNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfcmVzZXRDb2xzKCkge1xuICAgICAgICB2YXIgaSA9IHRoaXMuY29scztcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSBbXTtcblxuICAgICAgICB3aGlsZSAoaSkge1xuICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIExvb3BzIHRocm91Z2ggZWFjaCBpdGVtIHRoYXQgc2hvdWxkIGJlIHNob3duIGFuZCBjYWxjdWxhdGVzIHRoZSB4LCB5IHBvc2l0aW9uLlxuICAgICAgICogQHBhcmFtIHtTaHVmZmxlSXRlbVtdfSBpdGVtcyBBcnJheSBvZiBpdGVtcyB0aGF0IHdpbGwgYmUgc2hvd24vbGF5ZWRcbiAgICAgICAqICAgICBvdXQgaW4gb3JkZXIgaW4gdGhlaXIgYXJyYXkuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfbGF5b3V0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2xheW91dChpdGVtcykge1xuICAgICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgICB2YXIgaXRlbVBvc2l0aW9ucyA9IHRoaXMuX2dldE5leHRQb3NpdGlvbnMoaXRlbXMpO1xuXG4gICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgICBmdW5jdGlvbiBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgIGl0ZW0uYXBwbHlDc3MoU2h1ZmZsZUl0ZW0uQ3NzLlZJU0lCTEUuYWZ0ZXIpO1xuICAgICAgICAgIH0gLy8gSWYgdGhlIGl0ZW0gd2lsbCBub3QgY2hhbmdlIGl0cyBwb3NpdGlvbiwgZG8gbm90IGFkZCBpdCB0byB0aGUgcmVuZGVyXG4gICAgICAgICAgLy8gcXVldWUuIFRyYW5zaXRpb25zIGRvbid0IGZpcmUgd2hlbiBzZXR0aW5nIGEgcHJvcGVydHkgdG8gdGhlIHNhbWUgdmFsdWUuXG5cblxuICAgICAgICAgIGlmIChQb2ludC5lcXVhbHMoaXRlbS5wb2ludCwgaXRlbVBvc2l0aW9uc1tpXSkgJiYgIWl0ZW0uaXNIaWRkZW4pIHtcbiAgICAgICAgICAgIGl0ZW0uYXBwbHlDc3MoU2h1ZmZsZUl0ZW0uQ3NzLlZJU0lCTEUuYmVmb3JlKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaXRlbS5wb2ludCA9IGl0ZW1Qb3NpdGlvbnNbaV07XG4gICAgICAgICAgaXRlbS5zY2FsZSA9IFNodWZmbGVJdGVtLlNjYWxlLlZJU0lCTEU7XG4gICAgICAgICAgaXRlbS5pc0hpZGRlbiA9IGZhbHNlOyAvLyBDbG9uZSB0aGUgb2JqZWN0IHNvIHRoYXQgdGhlIGBiZWZvcmVgIG9iamVjdCBpc24ndCBtb2RpZmllZCB3aGVuIHRoZVxuICAgICAgICAgIC8vIHRyYW5zaXRpb24gZGVsYXkgaXMgYWRkZWQuXG5cbiAgICAgICAgICB2YXIgc3R5bGVzID0gX3RoaXM0LmdldFN0eWxlc0ZvclRyYW5zaXRpb24oaXRlbSwgU2h1ZmZsZUl0ZW0uQ3NzLlZJU0lCTEUuYmVmb3JlKTtcblxuICAgICAgICAgIHN0eWxlcy50cmFuc2l0aW9uRGVsYXkgPSBfdGhpczQuX2dldFN0YWdnZXJBbW91bnQoY291bnQpICsgJ21zJztcblxuICAgICAgICAgIF90aGlzNC5fcXVldWUucHVzaCh7XG4gICAgICAgICAgICBpdGVtOiBpdGVtLFxuICAgICAgICAgICAgc3R5bGVzOiBzdHlsZXMsXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm4gYW4gYXJyYXkgb2YgUG9pbnQgaW5zdGFuY2VzIHJlcHJlc2VudGluZyB0aGUgZnV0dXJlIHBvc2l0aW9ucyBvZlxuICAgICAgICogZWFjaCBpdGVtLlxuICAgICAgICogQHBhcmFtIHtTaHVmZmxlSXRlbVtdfSBpdGVtcyBBcnJheSBvZiBzb3J0ZWQgc2h1ZmZsZSBpdGVtcy5cbiAgICAgICAqIEByZXR1cm4ge1BvaW50W119XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldE5leHRQb3NpdGlvbnNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0TmV4dFBvc2l0aW9ucyhpdGVtcykge1xuICAgICAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgICAgICAvLyBJZiBwb3NpdGlvbiBkYXRhIGlzIGdvaW5nIHRvIGJlIGNoYW5nZWQsIGFkZCB0aGUgaXRlbSdzIHNpemUgdG8gdGhlXG4gICAgICAgIC8vIHRyYW5zZm9ybWVyIHRvIGFsbG93IGZvciBjYWxjdWxhdGlvbnMuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaXNDZW50ZXJlZCkge1xuICAgICAgICAgIHZhciBpdGVtc0RhdGEgPSBpdGVtcy5tYXAoZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgIHZhciBpdGVtU2l6ZSA9IFNodWZmbGUuZ2V0U2l6ZShpdGVtLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgICAgICB2YXIgcG9pbnQgPSBfdGhpczUuX2dldEl0ZW1Qb3NpdGlvbihpdGVtU2l6ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdChwb2ludC54LCBwb2ludC55LCBpdGVtU2l6ZS53aWR0aCwgaXRlbVNpemUuaGVpZ2h0LCBpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRUcmFuc2Zvcm1lZFBvc2l0aW9ucyhpdGVtc0RhdGEsIHRoaXMuY29udGFpbmVyV2lkdGgpO1xuICAgICAgICB9IC8vIElmIG5vIHRyYW5zZm9ybXMgYXJlIGdvaW5nIHRvIGhhcHBlbiwgc2ltcGx5IHJldHVybiBhbiBhcnJheSBvZiB0aGVcbiAgICAgICAgLy8gZnV0dXJlIHBvaW50cyBvZiBlYWNoIGl0ZW0uXG5cblxuICAgICAgICByZXR1cm4gaXRlbXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzNS5fZ2V0SXRlbVBvc2l0aW9uKFNodWZmbGUuZ2V0U2l6ZShpdGVtLmVsZW1lbnQsIHRydWUpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIERldGVybWluZSB0aGUgbG9jYXRpb24gb2YgdGhlIG5leHQgaXRlbSwgYmFzZWQgb24gaXRzIHNpemUuXG4gICAgICAgKiBAcGFyYW0ge3t3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcn19IGl0ZW1TaXplIE9iamVjdCB3aXRoIHdpZHRoIGFuZCBoZWlnaHQuXG4gICAgICAgKiBAcmV0dXJuIHtQb2ludH1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0SXRlbVBvc2l0aW9uXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldEl0ZW1Qb3NpdGlvbihpdGVtU2l6ZSkge1xuICAgICAgICByZXR1cm4gZ2V0SXRlbVBvc2l0aW9uKHtcbiAgICAgICAgICBpdGVtU2l6ZTogaXRlbVNpemUsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLnBvc2l0aW9ucyxcbiAgICAgICAgICBncmlkU2l6ZTogdGhpcy5jb2xXaWR0aCxcbiAgICAgICAgICB0b3RhbDogdGhpcy5jb2xzLFxuICAgICAgICAgIHRocmVzaG9sZDogdGhpcy5vcHRpb25zLmNvbHVtblRocmVzaG9sZCxcbiAgICAgICAgICBidWZmZXI6IHRoaXMub3B0aW9ucy5idWZmZXJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIE11dGF0ZSBwb3NpdGlvbnMgYmVmb3JlIHRoZXkncmUgYXBwbGllZC5cbiAgICAgICAqIEBwYXJhbSB7UmVjdFtdfSBpdGVtUmVjdHMgSXRlbSBkYXRhIG9iamVjdHMuXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gY29udGFpbmVyV2lkdGggV2lkdGggb2YgdGhlIGNvbnRhaW5pbmcgZWxlbWVudC5cbiAgICAgICAqIEByZXR1cm4ge1BvaW50W119XG4gICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJnZXRUcmFuc2Zvcm1lZFBvc2l0aW9uc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFRyYW5zZm9ybWVkUG9zaXRpb25zKGl0ZW1SZWN0cywgY29udGFpbmVyV2lkdGgpIHtcbiAgICAgICAgcmV0dXJuIGdldENlbnRlcmVkUG9zaXRpb25zKGl0ZW1SZWN0cywgY29udGFpbmVyV2lkdGgpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBIaWRlcyB0aGUgZWxlbWVudHMgdGhhdCBkb24ndCBtYXRjaCBvdXIgZmlsdGVyLlxuICAgICAgICogQHBhcmFtIHtTaHVmZmxlSXRlbVtdfSBjb2xsZWN0aW9uIENvbGxlY3Rpb24gdG8gc2hyaW5rLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9zaHJpbmtcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfc2hyaW5rKCkge1xuICAgICAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgICAgICB2YXIgY29sbGVjdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdGhpcy5fZ2V0Q29uY2VhbGVkSXRlbXMoKTtcbiAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgY29sbGVjdGlvbi5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgZnVuY3Rpb24gY2FsbGJhY2soKSB7XG4gICAgICAgICAgICBpdGVtLmFwcGx5Q3NzKFNodWZmbGVJdGVtLkNzcy5ISURERU4uYWZ0ZXIpO1xuICAgICAgICAgIH0gLy8gQ29udGludWluZyB3b3VsZCBhZGQgYSB0cmFuc2l0aW9uZW5kIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBlbGVtZW50LCBidXRcbiAgICAgICAgICAvLyB0aGF0IGxpc3RlbmVyIHdvdWxkIG5vdCBleGVjdXRlIGJlY2F1c2UgdGhlIHRyYW5zZm9ybSBhbmQgb3BhY2l0eSB3b3VsZFxuICAgICAgICAgIC8vIHN0YXkgdGhlIHNhbWUuXG4gICAgICAgICAgLy8gVGhlIGNhbGxiYWNrIGlzIGV4ZWN1dGVkIGhlcmUgYmVjYXVzZSBpdCBpcyBub3QgZ3VhcmFudGVlZCB0byBiZSBjYWxsZWRcbiAgICAgICAgICAvLyBhZnRlciB0aGUgdHJhbnNpdGlvbmVuZCBldmVudCBiZWNhdXNlIHRoZSB0cmFuc2l0aW9uZW5kIGNvdWxkIGJlXG4gICAgICAgICAgLy8gY2FuY2VsZWQgaWYgYW5vdGhlciBhbmltYXRpb24gc3RhcnRzLlxuXG5cbiAgICAgICAgICBpZiAoaXRlbS5pc0hpZGRlbikge1xuICAgICAgICAgICAgaXRlbS5hcHBseUNzcyhTaHVmZmxlSXRlbS5Dc3MuSElEREVOLmJlZm9yZSk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGl0ZW0uc2NhbGUgPSBTaHVmZmxlSXRlbS5TY2FsZS5ISURERU47XG4gICAgICAgICAgaXRlbS5pc0hpZGRlbiA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3R5bGVzID0gX3RoaXM2LmdldFN0eWxlc0ZvclRyYW5zaXRpb24oaXRlbSwgU2h1ZmZsZUl0ZW0uQ3NzLkhJRERFTi5iZWZvcmUpO1xuXG4gICAgICAgICAgc3R5bGVzLnRyYW5zaXRpb25EZWxheSA9IF90aGlzNi5fZ2V0U3RhZ2dlckFtb3VudChjb3VudCkgKyAnbXMnO1xuXG4gICAgICAgICAgX3RoaXM2Ll9xdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgIGl0ZW06IGl0ZW0sXG4gICAgICAgICAgICBzdHlsZXM6IHN0eWxlcyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJlc2l6ZSBoYW5kbGVyLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9oYW5kbGVSZXNpemVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaGFuZGxlUmVzaXplKCkge1xuICAgICAgICAvLyBJZiBzaHVmZmxlIGlzIGRpc2FibGVkLCBkZXN0cm95ZWQsIGRvbid0IGRvIGFueXRoaW5nXG4gICAgICAgIGlmICghdGhpcy5pc0VuYWJsZWQgfHwgdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgc3R5bGVzIHdoaWNoIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgYW4gaXRlbSBmb3IgYSB0cmFuc2l0aW9uLlxuICAgICAgICogQHBhcmFtIHtTaHVmZmxlSXRlbX0gaXRlbSBJdGVtIHRvIGdldCBzdHlsZXMgZm9yLiBTaG91bGQgaGF2ZSB1cGRhdGVkXG4gICAgICAgKiAgIHNjYWxlIGFuZCBwb2ludCBwcm9wZXJ0aWVzLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IHN0eWxlT2JqZWN0IEV4dHJhIHN0eWxlcyB0aGF0IHdpbGwgYmUgdXNlZCBpbiB0aGUgdHJhbnNpdGlvbi5cbiAgICAgICAqIEByZXR1cm4geyFPYmplY3R9IFRyYW5zZm9ybXMgZm9yIHRyYW5zaXRpb25zLCBsZWZ0L3RvcCBmb3IgYW5pbWF0ZS5cbiAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImdldFN0eWxlc0ZvclRyYW5zaXRpb25cIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTdHlsZXNGb3JUcmFuc2l0aW9uKGl0ZW0sIHN0eWxlT2JqZWN0KSB7XG4gICAgICAgIC8vIENsb25lIHRoZSBvYmplY3QgdG8gYXZvaWQgbXV0YXRpbmcgdGhlIG9yaWdpbmFsLlxuICAgICAgICB2YXIgc3R5bGVzID0gT2JqZWN0LmFzc2lnbih7fSwgc3R5bGVPYmplY3QpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMudXNlVHJhbnNmb3Jtcykge1xuICAgICAgICAgIHZhciB4ID0gdGhpcy5vcHRpb25zLnJvdW5kVHJhbnNmb3JtcyA/IE1hdGgucm91bmQoaXRlbS5wb2ludC54KSA6IGl0ZW0ucG9pbnQueDtcbiAgICAgICAgICB2YXIgeSA9IHRoaXMub3B0aW9ucy5yb3VuZFRyYW5zZm9ybXMgPyBNYXRoLnJvdW5kKGl0ZW0ucG9pbnQueSkgOiBpdGVtLnBvaW50Lnk7XG4gICAgICAgICAgc3R5bGVzLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlKFwiLmNvbmNhdCh4LCBcInB4LCBcIikuY29uY2F0KHksIFwicHgpIHNjYWxlKFwiKS5jb25jYXQoaXRlbS5zY2FsZSwgXCIpXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0eWxlcy5sZWZ0ID0gaXRlbS5wb2ludC54ICsgJ3B4JztcbiAgICAgICAgICBzdHlsZXMudG9wID0gaXRlbS5wb2ludC55ICsgJ3B4JztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdHlsZXM7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIExpc3RlbiBmb3IgdGhlIHRyYW5zaXRpb24gZW5kIG9uIGFuIGVsZW1lbnQgYW5kIGV4ZWN1dGUgdGhlIGl0ZW1DYWxsYmFja1xuICAgICAgICogd2hlbiBpdCBmaW5pc2hlcy5cbiAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHRvIGxpc3RlbiBvbi5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZW1DYWxsYmFjayBDYWxsYmFjayBmb3IgdGhlIGl0ZW0uXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkb25lIENhbGxiYWNrIHRvIG5vdGlmeSBgcGFyYWxsZWxgIHRoYXQgdGhpcyBvbmUgaXMgZG9uZS5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl93aGVuVHJhbnNpdGlvbkRvbmVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfd2hlblRyYW5zaXRpb25Eb25lKGVsZW1lbnQsIGl0ZW1DYWxsYmFjaywgZG9uZSkge1xuICAgICAgICB2YXIgaWQgPSBvblRyYW5zaXRpb25FbmQoZWxlbWVudCwgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgIGl0ZW1DYWxsYmFjaygpO1xuICAgICAgICAgIGRvbmUobnVsbCwgZXZ0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbnMucHVzaChpZCk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybiBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgc2V0IENTUyBzdHlsZXMgYW5kIGNhbGwgdGhlIGBkb25lYCBmdW5jdGlvblxuICAgICAgICogd2hlbiAoaWYpIHRoZSB0cmFuc2l0aW9uIGZpbmlzaGVzLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHMgVHJhbnNpdGlvbiBvYmplY3QuXG4gICAgICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gQSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2l0aCBhIGBkb25lYCBmdW5jdGlvbi5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXRUcmFuc2l0aW9uRnVuY3Rpb25cIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0VHJhbnNpdGlvbkZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgICAgdmFyIF90aGlzNyA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgb3B0cy5pdGVtLmFwcGx5Q3NzKG9wdHMuc3R5bGVzKTtcblxuICAgICAgICAgIF90aGlzNy5fd2hlblRyYW5zaXRpb25Eb25lKG9wdHMuaXRlbS5lbGVtZW50LCBvcHRzLmNhbGxiYWNrLCBkb25lKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogRXhlY3V0ZSB0aGUgc3R5bGVzIGdhdGhlcmVkIGluIHRoZSBzdHlsZSBxdWV1ZS4gVGhpcyBhcHBsaWVzIHN0eWxlcyB0byBlbGVtZW50cyxcbiAgICAgICAqIHRyaWdnZXJpbmcgdHJhbnNpdGlvbnMuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3Byb2Nlc3NRdWV1ZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9wcm9jZXNzUXVldWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVHJhbnNpdGlvbmluZykge1xuICAgICAgICAgIHRoaXMuX2NhbmNlbE1vdmVtZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGFzU3BlZWQgPSB0aGlzLm9wdGlvbnMuc3BlZWQgPiAwO1xuICAgICAgICB2YXIgaGFzUXVldWUgPSB0aGlzLl9xdWV1ZS5sZW5ndGggPiAwO1xuXG4gICAgICAgIGlmIChoYXNRdWV1ZSAmJiBoYXNTcGVlZCAmJiB0aGlzLmlzSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICB0aGlzLl9zdGFydFRyYW5zaXRpb25zKHRoaXMuX3F1ZXVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChoYXNRdWV1ZSkge1xuICAgICAgICAgIHRoaXMuX3N0eWxlSW1tZWRpYXRlbHkodGhpcy5fcXVldWUpO1xuXG4gICAgICAgICAgdGhpcy5fZGlzcGF0Y2goU2h1ZmZsZS5FdmVudFR5cGUuTEFZT1VUKTsgLy8gQSBjYWxsIHRvIGxheW91dCBoYXBwZW5lZCwgYnV0IG5vbmUgb2YgdGhlIG5ld2x5IHZpc2libGUgaXRlbXMgd2lsbFxuICAgICAgICAgIC8vIGNoYW5nZSBwb3NpdGlvbiBvciB0aGUgdHJhbnNpdGlvbiBkdXJhdGlvbiBpcyB6ZXJvLCB3aGljaCB3aWxsIG5vdCB0cmlnZ2VyXG4gICAgICAgICAgLy8gdGhlIHRyYW5zaXRpb25lbmQgZXZlbnQuXG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9kaXNwYXRjaChTaHVmZmxlLkV2ZW50VHlwZS5MQVlPVVQpO1xuICAgICAgICB9IC8vIFJlbW92ZSBldmVyeXRoaW5nIGluIHRoZSBzdHlsZSBxdWV1ZVxuXG5cbiAgICAgICAgdGhpcy5fcXVldWUubGVuZ3RoID0gMDtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogV2FpdCBmb3IgZWFjaCB0cmFuc2l0aW9uIHRvIGZpbmlzaCwgdGhlIGVtaXQgdGhlIGxheW91dCBldmVudC5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0W119IHRyYW5zaXRpb25zIEFycmF5IG9mIHRyYW5zaXRpb24gb2JqZWN0cy5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9zdGFydFRyYW5zaXRpb25zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3N0YXJ0VHJhbnNpdGlvbnModHJhbnNpdGlvbnMpIHtcbiAgICAgICAgdmFyIF90aGlzOCA9IHRoaXM7XG5cbiAgICAgICAgLy8gU2V0IGZsYWcgdGhhdCBzaHVmZmxlIGlzIGN1cnJlbnRseSBpbiBtb3Rpb24uXG4gICAgICAgIHRoaXMuaXNUcmFuc2l0aW9uaW5nID0gdHJ1ZTsgLy8gQ3JlYXRlIGFuIGFycmF5IG9mIGZ1bmN0aW9ucyB0byBiZSBjYWxsZWQuXG5cbiAgICAgICAgdmFyIGNhbGxiYWNrcyA9IHRyYW5zaXRpb25zLm1hcChmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzOC5fZ2V0VHJhbnNpdGlvbkZ1bmN0aW9uKG9iaik7XG4gICAgICAgIH0pO1xuICAgICAgICBhcnJheVBhcmFsbGVsKGNhbGxiYWNrcywgdGhpcy5fbW92ZW1lbnRGaW5pc2hlZC5iaW5kKHRoaXMpKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2NhbmNlbE1vdmVtZW50XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2NhbmNlbE1vdmVtZW50KCkge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIHRyYW5zaXRpb24gZW5kIGV2ZW50IGZvciBlYWNoIGxpc3RlbmVyLlxuICAgICAgICB0aGlzLl90cmFuc2l0aW9ucy5mb3JFYWNoKGNhbmNlbFRyYW5zaXRpb25FbmQpOyAvLyBSZXNldCB0aGUgYXJyYXkuXG5cblxuICAgICAgICB0aGlzLl90cmFuc2l0aW9ucy5sZW5ndGggPSAwOyAvLyBTaG93IGl0J3Mgbm8gbG9uZ2VyIGFjdGl2ZS5cblxuICAgICAgICB0aGlzLmlzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBBcHBseSBzdHlsZXMgd2l0aG91dCBhIHRyYW5zaXRpb24uXG4gICAgICAgKiBAcGFyYW0ge09iamVjdFtdfSBvYmplY3RzIEFycmF5IG9mIHRyYW5zaXRpb24gb2JqZWN0cy5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfc3R5bGVJbW1lZGlhdGVseVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zdHlsZUltbWVkaWF0ZWx5KG9iamVjdHMpIHtcbiAgICAgICAgaWYgKG9iamVjdHMubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnRzID0gb2JqZWN0cy5tYXAoZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5pdGVtLmVsZW1lbnQ7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBTaHVmZmxlLl9za2lwVHJhbnNpdGlvbnMoZWxlbWVudHMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG9iamVjdHMuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgIG9iai5pdGVtLmFwcGx5Q3NzKG9iai5zdHlsZXMpO1xuICAgICAgICAgICAgICBvYmouY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcIl9tb3ZlbWVudEZpbmlzaGVkXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX21vdmVtZW50RmluaXNoZWQoKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25zLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuaXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fZGlzcGF0Y2goU2h1ZmZsZS5FdmVudFR5cGUuTEFZT1VUKTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogVGhlIG1hZ2ljLiBUaGlzIGlzIHdoYXQgbWFrZXMgdGhlIHBsdWdpbiAnc2h1ZmZsZSdcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfGZ1bmN0aW9uKEVsZW1lbnQpOmJvb2xlYW59IFtjYXRlZ29yeV0gQ2F0ZWdvcnkgdG8gZmlsdGVyIGJ5LlxuICAgICAgICogICAgIENhbiBiZSBhIGZ1bmN0aW9uLCBzdHJpbmcsIG9yIGFycmF5IG9mIHN0cmluZ3MuXG4gICAgICAgKiBAcGFyYW0ge1NvcnRPcHRpb25zfSBbc29ydE9wdGlvbnNdIEEgc29ydCBvYmplY3Qgd2hpY2ggY2FuIHNvcnQgdGhlIHZpc2libGUgc2V0XG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJmaWx0ZXJcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBmaWx0ZXIoY2F0ZWdvcnksIHNvcnRPcHRpb25zKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0VuYWJsZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNhdGVnb3J5IHx8IGNhdGVnb3J5ICYmIGNhdGVnb3J5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGNhdGVnb3J5ID0gU2h1ZmZsZS5BTExfSVRFTVM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ZpbHRlcihjYXRlZ29yeSk7IC8vIFNocmluayBlYWNoIGhpZGRlbiBpdGVtXG5cblxuICAgICAgICB0aGlzLl9zaHJpbmsoKTsgLy8gSG93IG1hbnkgdmlzaWJsZSBlbGVtZW50cz9cblxuXG4gICAgICAgIHRoaXMuX3VwZGF0ZUl0ZW1Db3VudCgpOyAvLyBVcGRhdGUgdHJhbnNmb3JtcyBvbiB2aXNpYmxlIGVsZW1lbnRzIHNvIHRoZXkgd2lsbCBhbmltYXRlIHRvIHRoZWlyIG5ldyBwb3NpdGlvbnMuXG5cblxuICAgICAgICB0aGlzLnNvcnQoc29ydE9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBHZXRzIHRoZSB2aXNpYmxlIGVsZW1lbnRzLCBzb3J0cyB0aGVtLCBhbmQgcGFzc2VzIHRoZW0gdG8gbGF5b3V0LlxuICAgICAgICogQHBhcmFtIHtTb3J0T3B0aW9uc30gW3NvcnRPcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3QgdG8gcGFzcyB0byBgc29ydGVyYC5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcInNvcnRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzb3J0KCkge1xuICAgICAgICB2YXIgc29ydE9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRoaXMubGFzdFNvcnQ7XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzRW5hYmxlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Jlc2V0Q29scygpO1xuXG4gICAgICAgIHZhciBpdGVtcyA9IHNvcnRlcih0aGlzLl9nZXRGaWx0ZXJlZEl0ZW1zKCksIHNvcnRPcHRpb25zKTtcblxuICAgICAgICB0aGlzLl9sYXlvdXQoaXRlbXMpOyAvLyBgX2xheW91dGAgYWx3YXlzIGhhcHBlbnMgYWZ0ZXIgYF9zaHJpbmtgLCBzbyBpdCdzIHNhZmUgdG8gcHJvY2VzcyB0aGUgc3R5bGVcbiAgICAgICAgLy8gcXVldWUgaGVyZSB3aXRoIHN0eWxlcyBmcm9tIHRoZSBzaHJpbmsgbWV0aG9kLlxuXG5cbiAgICAgICAgdGhpcy5fcHJvY2Vzc1F1ZXVlKCk7IC8vIEFkanVzdCB0aGUgaGVpZ2h0IG9mIHRoZSBjb250YWluZXIuXG5cblxuICAgICAgICB0aGlzLl9zZXRDb250YWluZXJTaXplKCk7XG5cbiAgICAgICAgdGhpcy5sYXN0U29ydCA9IHNvcnRPcHRpb25zO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXBvc2l0aW9uIGV2ZXJ5dGhpbmcuXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc09ubHlMYXlvdXQ9ZmFsc2VdIElmIHRydWUsIGNvbHVtbiBhbmQgZ3V0dGVyIHdpZHRocyB3b24ndCBiZSByZWNhbGN1bGF0ZWQuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJ1cGRhdGVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgIHZhciBpc09ubHlMYXlvdXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCkge1xuICAgICAgICAgIGlmICghaXNPbmx5TGF5b3V0KSB7XG4gICAgICAgICAgICAvLyBHZXQgdXBkYXRlZCBjb2xDb3VudFxuICAgICAgICAgICAgdGhpcy5fc2V0Q29sdW1ucygpO1xuICAgICAgICAgIH0gLy8gTGF5b3V0IGl0ZW1zXG5cblxuICAgICAgICAgIHRoaXMuc29ydCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFVzZSB0aGlzIGluc3RlYWQgb2YgYHVwZGF0ZSgpYCBpZiB5b3UgZG9uJ3QgbmVlZCB0aGUgY29sdW1ucyBhbmQgZ3V0dGVycyB1cGRhdGVkXG4gICAgICAgKiBNYXliZSBhbiBpbWFnZSBpbnNpZGUgYHNodWZmbGVgIGxvYWRlZCAoYW5kIG5vdyBoYXMgYSBoZWlnaHQpLCB3aGljaCBtZWFucyBjYWxjdWxhdGlvbnNcbiAgICAgICAqIGNvdWxkIGJlIG9mZi5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImxheW91dFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGxheW91dCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIE5ldyBpdGVtcyBoYXZlIGJlZW4gYXBwZW5kZWQgdG8gc2h1ZmZsZS4gTWl4IHRoZW0gaW4gd2l0aCB0aGUgY3VycmVudFxuICAgICAgICogZmlsdGVyIG9yIHNvcnQgc3RhdHVzLlxuICAgICAgICogQHBhcmFtIHtFbGVtZW50W119IG5ld0l0ZW1zIENvbGxlY3Rpb24gb2YgbmV3IGl0ZW1zLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiYWRkXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKG5ld0l0ZW1zKSB7XG4gICAgICAgIHZhciBfdGhpczkgPSB0aGlzO1xuXG4gICAgICAgIHZhciBpdGVtcyA9IGFycmF5VW5pcXVlKG5ld0l0ZW1zKS5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBTaHVmZmxlSXRlbShlbCk7XG4gICAgICAgIH0pOyAvLyBBZGQgY2xhc3NlcyBhbmQgc2V0IGluaXRpYWwgcG9zaXRpb25zLlxuXG4gICAgICAgIHRoaXMuX2luaXRJdGVtcyhpdGVtcyk7IC8vIERldGVybWluZSB3aGljaCBpdGVtcyB3aWxsIGdvIHdpdGggdGhlIGN1cnJlbnQgZmlsdGVyLlxuXG5cbiAgICAgICAgdGhpcy5fcmVzZXRDb2xzKCk7XG5cbiAgICAgICAgdmFyIGFsbEl0ZW1zID0gdGhpcy5fbWVyZ2VOZXdJdGVtcyhpdGVtcyk7XG5cbiAgICAgICAgdmFyIHNvcnRlZEl0ZW1zID0gc29ydGVyKGFsbEl0ZW1zLCB0aGlzLmxhc3RTb3J0KTtcblxuICAgICAgICB2YXIgYWxsU29ydGVkSXRlbXNTZXQgPSB0aGlzLl9maWx0ZXIodGhpcy5sYXN0RmlsdGVyLCBzb3J0ZWRJdGVtcyk7XG5cbiAgICAgICAgdmFyIGlzTmV3SXRlbSA9IGZ1bmN0aW9uIGlzTmV3SXRlbShpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW1zLmluY2x1ZGVzKGl0ZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBhcHBseUhpZGRlblN0YXRlID0gZnVuY3Rpb24gYXBwbHlIaWRkZW5TdGF0ZShpdGVtKSB7XG4gICAgICAgICAgaXRlbS5zY2FsZSA9IFNodWZmbGVJdGVtLlNjYWxlLkhJRERFTjtcbiAgICAgICAgICBpdGVtLmlzSGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgICBpdGVtLmFwcGx5Q3NzKFNodWZmbGVJdGVtLkNzcy5ISURERU4uYmVmb3JlKTtcbiAgICAgICAgICBpdGVtLmFwcGx5Q3NzKFNodWZmbGVJdGVtLkNzcy5ISURERU4uYWZ0ZXIpO1xuICAgICAgICB9OyAvLyBMYXlvdXQgYWxsIGl0ZW1zIGFnYWluIHNvIHRoYXQgbmV3IGl0ZW1zIGdldCBwb3NpdGlvbnMuXG4gICAgICAgIC8vIFN5bmNob25vdXNseSBhcHBseSBwb3NpdGlvbnMuXG5cblxuICAgICAgICB2YXIgaXRlbVBvc2l0aW9ucyA9IHRoaXMuX2dldE5leHRQb3NpdGlvbnMoYWxsU29ydGVkSXRlbXNTZXQudmlzaWJsZSk7XG5cbiAgICAgICAgYWxsU29ydGVkSXRlbXNTZXQudmlzaWJsZS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpKSB7XG4gICAgICAgICAgaWYgKGlzTmV3SXRlbShpdGVtKSkge1xuICAgICAgICAgICAgaXRlbS5wb2ludCA9IGl0ZW1Qb3NpdGlvbnNbaV07XG4gICAgICAgICAgICBhcHBseUhpZGRlblN0YXRlKGl0ZW0pO1xuICAgICAgICAgICAgaXRlbS5hcHBseUNzcyhfdGhpczkuZ2V0U3R5bGVzRm9yVHJhbnNpdGlvbihpdGVtLCB7fSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFsbFNvcnRlZEl0ZW1zU2V0LmhpZGRlbi5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgaWYgKGlzTmV3SXRlbShpdGVtKSkge1xuICAgICAgICAgICAgYXBwbHlIaWRkZW5TdGF0ZShpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pOyAvLyBDYXVzZSBsYXlvdXQgc28gdGhhdCB0aGUgc3R5bGVzIGFib3ZlIGFyZSBhcHBsaWVkLlxuXG4gICAgICAgIHRoaXMuZWxlbWVudC5vZmZzZXRXaWR0aDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbiAgICAgICAgLy8gQWRkIHRyYW5zaXRpb24gdG8gZWFjaCBpdGVtLlxuXG4gICAgICAgIHRoaXMuc2V0SXRlbVRyYW5zaXRpb25zKGl0ZW1zKTsgLy8gVXBkYXRlIHRoZSBsaXN0IG9mIGl0ZW1zLlxuXG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLl9tZXJnZU5ld0l0ZW1zKGl0ZW1zKTsgLy8gVXBkYXRlIGxheW91dC92aXNpYmlsaXR5IG9mIG5ldyBhbmQgb2xkIGl0ZW1zLlxuXG4gICAgICAgIHRoaXMuZmlsdGVyKHRoaXMubGFzdEZpbHRlcik7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIERpc2FibGVzIHNodWZmbGUgZnJvbSB1cGRhdGluZyBkaW1lbnNpb25zIGFuZCBsYXlvdXQgb24gcmVzaXplXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJkaXNhYmxlXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogRW5hYmxlcyBzaHVmZmxlIGFnYWluXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1VwZGF0ZUxheW91dD10cnVlXSBpZiB1bmRlZmluZWQsIHNodWZmbGUgd2lsbCB1cGRhdGUgY29sdW1ucyBhbmQgZ3V0dGVyc1xuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZW5hYmxlXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZW5hYmxlKCkge1xuICAgICAgICB2YXIgaXNVcGRhdGVMYXlvdXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG4gICAgICAgIHRoaXMuaXNFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoaXNVcGRhdGVMYXlvdXQpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZSAxIG9yIG1vcmUgc2h1ZmZsZSBpdGVtcy5cbiAgICAgICAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbGVtZW50cyBBbiBhcnJheSBjb250YWluaW5nIG9uZSBvciBtb3JlXG4gICAgICAgKiAgICAgZWxlbWVudHMgaW4gc2h1ZmZsZVxuICAgICAgICogQHJldHVybiB7U2h1ZmZsZX0gVGhlIHNodWZmbGUgaW5zdGFuY2UuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJyZW1vdmVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUoZWxlbWVudHMpIHtcbiAgICAgICAgdmFyIF90aGlzMTAgPSB0aGlzO1xuXG4gICAgICAgIGlmICghZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbGxlY3Rpb24gPSBhcnJheVVuaXF1ZShlbGVtZW50cyk7XG4gICAgICAgIHZhciBvbGRJdGVtcyA9IGNvbGxlY3Rpb24ubWFwKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzMTAuZ2V0SXRlbUJ5RWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuICEhaXRlbTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGhhbmRsZUxheW91dCA9IGZ1bmN0aW9uIGhhbmRsZUxheW91dCgpIHtcbiAgICAgICAgICBfdGhpczEwLl9kaXNwb3NlSXRlbXMob2xkSXRlbXMpOyAvLyBSZW1vdmUgdGhlIGNvbGxlY3Rpb24gaW4gdGhlIGNhbGxiYWNrXG5cblxuICAgICAgICAgIGNvbGxlY3Rpb24uZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgX3RoaXMxMC5fZGlzcGF0Y2goU2h1ZmZsZS5FdmVudFR5cGUuUkVNT1ZFRCwge1xuICAgICAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9OyAvLyBIaWRlIGNvbGxlY3Rpb24gZmlyc3QuXG5cblxuICAgICAgICB0aGlzLl90b2dnbGVGaWx0ZXJDbGFzc2VzKHtcbiAgICAgICAgICB2aXNpYmxlOiBbXSxcbiAgICAgICAgICBoaWRkZW46IG9sZEl0ZW1zXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3NocmluayhvbGRJdGVtcyk7XG5cbiAgICAgICAgdGhpcy5zb3J0KCk7IC8vIFVwZGF0ZSB0aGUgbGlzdCBvZiBpdGVtcyBoZXJlIGJlY2F1c2UgYHJlbW92ZWAgY291bGQgYmUgY2FsbGVkIGFnYWluXG4gICAgICAgIC8vIHdpdGggYW4gaXRlbSB0aGF0IGlzIGluIHRoZSBwcm9jZXNzIG9mIGJlaW5nIHJlbW92ZWQuXG5cbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuICFvbGRJdGVtcy5pbmNsdWRlcyhpdGVtKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlSXRlbUNvdW50KCk7XG5cbiAgICAgICAgdGhpcy5vbmNlKFNodWZmbGUuRXZlbnRUeXBlLkxBWU9VVCwgaGFuZGxlTGF5b3V0KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmV0cmlldmUgYSBzaHVmZmxlIGl0ZW0gYnkgaXRzIGVsZW1lbnQuXG4gICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB0byBsb29rIGZvci5cbiAgICAgICAqIEByZXR1cm4gez9TaHVmZmxlSXRlbX0gQSBzaHVmZmxlIGl0ZW0gb3IgdW5kZWZpbmVkIGlmIGl0J3Mgbm90IGZvdW5kLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZ2V0SXRlbUJ5RWxlbWVudFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEl0ZW1CeUVsZW1lbnQoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5maW5kKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uZWxlbWVudCA9PT0gZWxlbWVudDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIER1bXAgdGhlIGVsZW1lbnRzIGN1cnJlbnRseSBzdG9yZWQgYW5kIHJlaW5pdGlhbGl6ZSBhbGwgY2hpbGQgZWxlbWVudHMgd2hpY2hcbiAgICAgICAqIG1hdGNoIHRoZSBgaXRlbVNlbGVjdG9yYC5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcInJlc2V0SXRlbXNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldEl0ZW1zKCkge1xuICAgICAgICB2YXIgX3RoaXMxMSA9IHRoaXM7XG5cbiAgICAgICAgLy8gUmVtb3ZlIHJlZnMgdG8gY3VycmVudCBpdGVtcy5cbiAgICAgICAgdGhpcy5fZGlzcG9zZUl0ZW1zKHRoaXMuaXRlbXMpO1xuXG4gICAgICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IGZhbHNlOyAvLyBGaW5kIG5ldyBpdGVtcyBpbiB0aGUgRE9NLlxuXG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLl9nZXRJdGVtcygpOyAvLyBTZXQgaW5pdGlhbCBzdHlsZXMgb24gdGhlIG5ldyBpdGVtcy5cblxuICAgICAgICB0aGlzLl9pbml0SXRlbXModGhpcy5pdGVtcyk7XG5cbiAgICAgICAgdGhpcy5vbmNlKFNodWZmbGUuRXZlbnRUeXBlLkxBWU9VVCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIEFkZCB0cmFuc2l0aW9uIHRvIGVhY2ggaXRlbS5cbiAgICAgICAgICBfdGhpczExLnNldEl0ZW1UcmFuc2l0aW9ucyhfdGhpczExLml0ZW1zKTtcblxuICAgICAgICAgIF90aGlzMTEuaXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIH0pOyAvLyBMYXkgb3V0IGFsbCBpdGVtcy5cblxuICAgICAgICB0aGlzLmZpbHRlcih0aGlzLmxhc3RGaWx0ZXIpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBEZXN0cm95cyBzaHVmZmxlLCByZW1vdmVzIGV2ZW50cywgc3R5bGVzLCBhbmQgY2xhc3Nlc1xuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZGVzdHJveVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuX2NhbmNlbE1vdmVtZW50KCk7XG5cbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uUmVzaXplKTsgLy8gUmVzZXQgY29udGFpbmVyIHN0eWxlc1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaHVmZmxlJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7IC8vIFJlc2V0IGluZGl2aWR1YWwgaXRlbSBzdHlsZXNcblxuICAgICAgICB0aGlzLl9kaXNwb3NlSXRlbXModGhpcy5pdGVtcyk7XG5cbiAgICAgICAgdGhpcy5pdGVtcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9ucy5sZW5ndGggPSAwOyAvLyBOdWxsIERPTSByZWZlcmVuY2VzXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLnNpemVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDsgLy8gU2V0IGEgZmxhZyBzbyBpZiBhIGRlYm91bmNlZCByZXNpemUgaGFzIGJlZW4gdHJpZ2dlcmVkLFxuICAgICAgICAvLyBpdCBjYW4gZmlyc3QgY2hlY2sgaWYgaXQgaXMgYWN0dWFsbHkgaXNEZXN0cm95ZWQgYW5kIG5vdCBkb2luZyBhbnl0aGluZ1xuXG4gICAgICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmlzRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRoZSBvdXRlciB3aWR0aCBvZiBhbiBlbGVtZW50LCBvcHRpb25hbGx5IGluY2x1ZGluZyBpdHMgbWFyZ2lucy5cbiAgICAgICAqXG4gICAgICAgKiBUaGVyZSBhcmUgYSBmZXcgZGlmZmVyZW50IG1ldGhvZHMgZm9yIGdldHRpbmcgdGhlIHdpZHRoIG9mIGFuIGVsZW1lbnQsIG5vbmUgb2ZcbiAgICAgICAqIHdoaWNoIHdvcmsgcGVyZmVjdGx5IGZvciBhbGwgU2h1ZmZsZSdzIHVzZSBjYXNlcy5cbiAgICAgICAqXG4gICAgICAgKiAxLiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKSBgbGVmdGAgYW5kIGByaWdodGAgcHJvcGVydGllcy5cbiAgICAgICAqICAgLSBBY2NvdW50cyBmb3IgdHJhbnNmb3JtIHNjYWxlZCBlbGVtZW50cywgbWFraW5nIGl0IHVzZWxlc3MgZm9yIFNodWZmbGVcbiAgICAgICAqICAgZWxlbWVudHMgd2hpY2ggaGF2ZSBzaHJ1bmsuXG4gICAgICAgKiAyLiBUaGUgYG9mZnNldFdpZHRoYCBwcm9wZXJ0eS5cbiAgICAgICAqICAgLSBUaGlzIHZhbHVlIHN0YXlzIHRoZSBzYW1lIHJlZ2FyZGxlc3Mgb2YgdGhlIGVsZW1lbnRzIHRyYW5zZm9ybSBwcm9wZXJ0eSxcbiAgICAgICAqICAgaG93ZXZlciwgaXQgZG9lcyBub3QgcmV0dXJuIHN1YnBpeGVsIHZhbHVlcy5cbiAgICAgICAqIDMuIGdldENvbXB1dGVkU3R5bGUoKVxuICAgICAgICogICAtIFRoaXMgd29ya3MgZ3JlYXQgQ2hyb21lLCBGaXJlZm94LCBTYWZhcmksIGJ1dCBJRTw9MTEgZG9lcyBub3QgaW5jbHVkZVxuICAgICAgICogICBwYWRkaW5nIGFuZCBib3JkZXIgd2hlbiBib3gtc2l6aW5nOiBib3JkZXItYm94IGlzIHNldCwgcmVxdWlyaW5nIGEgZmVhdHVyZVxuICAgICAgICogICB0ZXN0IGFuZCBleHRyYSB3b3JrIHRvIGFkZCB0aGUgcGFkZGluZyBiYWNrIGZvciBJRSBhbmQgb3RoZXIgYnJvd3NlcnMgd2hpY2hcbiAgICAgICAqICAgZm9sbG93IHRoZSBXM0Mgc3BlYyBoZXJlLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudC5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2luY2x1ZGVNYXJnaW5zPWZhbHNlXSBXaGV0aGVyIHRvIGluY2x1ZGUgbWFyZ2lucy5cbiAgICAgICAqIEByZXR1cm4ge3t3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcn19IFRoZSB3aWR0aCBhbmQgaGVpZ2h0LlxuICAgICAgICovXG5cbiAgICB9XSwgW3tcbiAgICAgIGtleTogXCJnZXRTaXplXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U2l6ZShlbGVtZW50KSB7XG4gICAgICAgIHZhciBpbmNsdWRlTWFyZ2lucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XG4gICAgICAgIC8vIFN0b3JlIHRoZSBzdHlsZXMgc28gdGhhdCB0aGV5IGNhbiBiZSB1c2VkIGJ5IG90aGVycyB3aXRob3V0IGFza2luZyBmb3IgaXQgYWdhaW4uXG4gICAgICAgIHZhciBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKTtcbiAgICAgICAgdmFyIHdpZHRoID0gZ2V0TnVtYmVyU3R5bGUoZWxlbWVudCwgJ3dpZHRoJywgc3R5bGVzKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IGdldE51bWJlclN0eWxlKGVsZW1lbnQsICdoZWlnaHQnLCBzdHlsZXMpO1xuXG4gICAgICAgIGlmIChpbmNsdWRlTWFyZ2lucykge1xuICAgICAgICAgIHZhciBtYXJnaW5MZWZ0ID0gZ2V0TnVtYmVyU3R5bGUoZWxlbWVudCwgJ21hcmdpbkxlZnQnLCBzdHlsZXMpO1xuICAgICAgICAgIHZhciBtYXJnaW5SaWdodCA9IGdldE51bWJlclN0eWxlKGVsZW1lbnQsICdtYXJnaW5SaWdodCcsIHN0eWxlcyk7XG4gICAgICAgICAgdmFyIG1hcmdpblRvcCA9IGdldE51bWJlclN0eWxlKGVsZW1lbnQsICdtYXJnaW5Ub3AnLCBzdHlsZXMpO1xuICAgICAgICAgIHZhciBtYXJnaW5Cb3R0b20gPSBnZXROdW1iZXJTdHlsZShlbGVtZW50LCAnbWFyZ2luQm90dG9tJywgc3R5bGVzKTtcbiAgICAgICAgICB3aWR0aCArPSBtYXJnaW5MZWZ0ICsgbWFyZ2luUmlnaHQ7XG4gICAgICAgICAgaGVpZ2h0ICs9IG1hcmdpblRvcCArIG1hcmdpbkJvdHRvbTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIENoYW5nZSBhIHByb3BlcnR5IG9yIGV4ZWN1dGUgYSBmdW5jdGlvbiB3aGljaCB3aWxsIG5vdCBoYXZlIGEgdHJhbnNpdGlvblxuICAgICAgICogQHBhcmFtIHtFbGVtZW50W119IGVsZW1lbnRzIERPTSBlbGVtZW50cyB0aGF0IHdvbid0IGJlIHRyYW5zaXRpb25lZC5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIEEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgd2hpbGUgdHJhbnNpdGlvblxuICAgICAgICogICAgIGlzIHNldCB0byAwbXMuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3NraXBUcmFuc2l0aW9uc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9za2lwVHJhbnNpdGlvbnMoZWxlbWVudHMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciB6ZXJvID0gJzBtcyc7IC8vIFNhdmUgY3VycmVudCBkdXJhdGlvbiBhbmQgZGVsYXkuXG5cbiAgICAgICAgdmFyIGRhdGEgPSBlbGVtZW50cy5tYXAoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICB2YXIgc3R5bGUgPSBlbGVtZW50LnN0eWxlO1xuICAgICAgICAgIHZhciBkdXJhdGlvbiA9IHN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbjtcbiAgICAgICAgICB2YXIgZGVsYXkgPSBzdHlsZS50cmFuc2l0aW9uRGVsYXk7IC8vIFNldCB0aGUgZHVyYXRpb24gdG8gemVybyBzbyBpdCBoYXBwZW5zIGltbWVkaWF0ZWx5XG5cbiAgICAgICAgICBzdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSB6ZXJvO1xuICAgICAgICAgIHN0eWxlLnRyYW5zaXRpb25EZWxheSA9IHplcm87XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgIGRlbGF5OiBkZWxheVxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICBjYWxsYmFjaygpOyAvLyBDYXVzZSBmb3JjZWQgc3luY2hyb25vdXMgbGF5b3V0LlxuXG4gICAgICAgIGVsZW1lbnRzWzBdLm9mZnNldFdpZHRoOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICAgICAgICAvLyBQdXQgdGhlIGR1cmF0aW9uIGJhY2tcblxuICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBkYXRhW2ldLmR1cmF0aW9uO1xuICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGF0YVtpXS5kZWxheTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFNodWZmbGU7XG4gIH0odGlueUVtaXR0ZXIpO1xuXG4gIFNodWZmbGUuU2h1ZmZsZUl0ZW0gPSBTaHVmZmxlSXRlbTtcbiAgU2h1ZmZsZS5BTExfSVRFTVMgPSAnYWxsJztcbiAgU2h1ZmZsZS5GSUxURVJfQVRUUklCVVRFX0tFWSA9ICdncm91cHMnO1xuICAvKiogQGVudW0ge3N0cmluZ30gKi9cblxuICBTaHVmZmxlLkV2ZW50VHlwZSA9IHtcbiAgICBMQVlPVVQ6ICdzaHVmZmxlOmxheW91dCcsXG4gICAgUkVNT1ZFRDogJ3NodWZmbGU6cmVtb3ZlZCdcbiAgfTtcbiAgLyoqIEBlbnVtIHtzdHJpbmd9ICovXG5cbiAgU2h1ZmZsZS5DbGFzc2VzID0gQ2xhc3NlcztcbiAgLyoqIEBlbnVtIHtzdHJpbmd9ICovXG5cbiAgU2h1ZmZsZS5GaWx0ZXJNb2RlID0ge1xuICAgIEFOWTogJ2FueScsXG4gICAgQUxMOiAnYWxsJ1xuICB9OyAvLyBPdmVycmlkZWFibGUgb3B0aW9uc1xuXG4gIFNodWZmbGUub3B0aW9ucyA9IHtcbiAgICAvLyBJbml0aWFsIGZpbHRlciBncm91cC5cbiAgICBncm91cDogU2h1ZmZsZS5BTExfSVRFTVMsXG4gICAgLy8gVHJhbnNpdGlvbi9hbmltYXRpb24gc3BlZWQgKG1pbGxpc2Vjb25kcykuXG4gICAgc3BlZWQ6IDI1MCxcbiAgICAvLyBDU1MgZWFzaW5nIGZ1bmN0aW9uIHRvIHVzZS5cbiAgICBlYXNpbmc6ICdjdWJpYy1iZXppZXIoMC40LCAwLjAsIDAuMiwgMSknLFxuICAgIC8vIGUuZy4gJy5waWN0dXJlLWl0ZW0nLlxuICAgIGl0ZW1TZWxlY3RvcjogJyonLFxuICAgIC8vIEVsZW1lbnQgb3Igc2VsZWN0b3Igc3RyaW5nLiBVc2UgYW4gZWxlbWVudCB0byBkZXRlcm1pbmUgdGhlIHNpemUgb2YgY29sdW1uc1xuICAgIC8vIGFuZCBndXR0ZXJzLlxuICAgIHNpemVyOiBudWxsLFxuICAgIC8vIEEgc3RhdGljIG51bWJlciBvciBmdW5jdGlvbiB0aGF0IHRlbGxzIHRoZSBwbHVnaW4gaG93IHdpZGUgdGhlIGd1dHRlcnNcbiAgICAvLyBiZXR3ZWVuIGNvbHVtbnMgYXJlIChpbiBwaXhlbHMpLlxuICAgIGd1dHRlcldpZHRoOiAwLFxuICAgIC8vIEEgc3RhdGljIG51bWJlciBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBudW1iZXIgd2hpY2ggdGVsbHMgdGhlIHBsdWdpblxuICAgIC8vIGhvdyB3aWRlIHRoZSBjb2x1bW5zIGFyZSAoaW4gcGl4ZWxzKS5cbiAgICBjb2x1bW5XaWR0aDogMCxcbiAgICAvLyBJZiB5b3VyIGdyb3VwIGlzIG5vdCBqc29uLCBhbmQgaXMgY29tbWEgZGVsaW1ldGVkLCB5b3UgY291bGQgc2V0IGRlbGltaXRlclxuICAgIC8vIHRvICcsJy5cbiAgICBkZWxpbWl0ZXI6IG51bGwsXG4gICAgLy8gVXNlZnVsIGZvciBwZXJjZW50YWdlIGJhc2VkIGhlaWdodHMgd2hlbiB0aGV5IG1pZ2h0IG5vdCBhbHdheXMgYmUgZXhhY3RseVxuICAgIC8vIHRoZSBzYW1lIChpbiBwaXhlbHMpLlxuICAgIGJ1ZmZlcjogMCxcbiAgICAvLyBSZWFkaW5nIHRoZSB3aWR0aCBvZiBlbGVtZW50cyBpc24ndCBwcmVjaXNlIGVub3VnaCBhbmQgY2FuIGNhdXNlIGNvbHVtbnMgdG9cbiAgICAvLyBqdW1wIGJldHdlZW4gdmFsdWVzLlxuICAgIGNvbHVtblRocmVzaG9sZDogMC4wMSxcbiAgICAvLyBTaHVmZmxlIGNhbiBiZSBpc0luaXRpYWxpemVkIHdpdGggYSBzb3J0IG9iamVjdC4gSXQgaXMgdGhlIHNhbWUgb2JqZWN0XG4gICAgLy8gZ2l2ZW4gdG8gdGhlIHNvcnQgbWV0aG9kLlxuICAgIGluaXRpYWxTb3J0OiBudWxsLFxuICAgIC8vIEJ5IGRlZmF1bHQsIHNodWZmbGUgd2lsbCB0aHJvdHRsZSByZXNpemUgZXZlbnRzLiBUaGlzIGNhbiBiZSBjaGFuZ2VkIG9yXG4gICAgLy8gcmVtb3ZlZC5cbiAgICB0aHJvdHRsZTogdGhyb3R0bGVpdCxcbiAgICAvLyBIb3cgb2Z0ZW4gc2h1ZmZsZSBjYW4gYmUgY2FsbGVkIG9uIHJlc2l6ZSAoaW4gbWlsbGlzZWNvbmRzKS5cbiAgICB0aHJvdHRsZVRpbWU6IDMwMCxcbiAgICAvLyBUcmFuc2l0aW9uIGRlbGF5IG9mZnNldCBmb3IgZWFjaCBpdGVtIGluIG1pbGxpc2Vjb25kcy5cbiAgICBzdGFnZ2VyQW1vdW50OiAxNSxcbiAgICAvLyBNYXhpbXVtIHN0YWdnZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLlxuICAgIHN0YWdnZXJBbW91bnRNYXg6IDE1MCxcbiAgICAvLyBXaGV0aGVyIHRvIHVzZSB0cmFuc2Zvcm1zIG9yIGFic29sdXRlIHBvc2l0aW9uaW5nLlxuICAgIHVzZVRyYW5zZm9ybXM6IHRydWUsXG4gICAgLy8gQWZmZWN0cyB1c2luZyBhbiBhcnJheSB3aXRoIGZpbHRlci4gZS5nLiBgZmlsdGVyKFsnb25lJywgJ3R3byddKWAuIFdpdGggXCJhbnlcIixcbiAgICAvLyB0aGUgZWxlbWVudCBwYXNzZXMgdGhlIHRlc3QgaWYgYW55IG9mIGl0cyBncm91cHMgYXJlIGluIHRoZSBhcnJheS4gV2l0aCBcImFsbFwiLFxuICAgIC8vIHRoZSBlbGVtZW50IG9ubHkgcGFzc2VzIGlmIGFsbCBncm91cHMgYXJlIGluIHRoZSBhcnJheS5cbiAgICBmaWx0ZXJNb2RlOiBTaHVmZmxlLkZpbHRlck1vZGUuQU5ZLFxuICAgIC8vIEF0dGVtcHQgdG8gY2VudGVyIGdyaWQgaXRlbXMgaW4gZWFjaCByb3cuXG4gICAgaXNDZW50ZXJlZDogZmFsc2UsXG4gICAgLy8gV2hldGhlciB0byByb3VuZCBwaXhlbCB2YWx1ZXMgdXNlZCBpbiB0cmFuc2xhdGUoeCwgeSkuIFRoaXMgdXN1YWxseSBhdm9pZHNcbiAgICAvLyBibHVycmluZXNzLlxuICAgIHJvdW5kVHJhbnNmb3JtczogdHJ1ZVxuICB9O1xuICBTaHVmZmxlLlBvaW50ID0gUG9pbnQ7XG4gIFNodWZmbGUuUmVjdCA9IFJlY3Q7IC8vIEV4cG9zZSBmb3IgdGVzdGluZy4gSGFjayBhdCB5b3VyIG93biByaXNrLlxuXG4gIFNodWZmbGUuX19zb3J0ZXIgPSBzb3J0ZXI7XG4gIFNodWZmbGUuX19nZXRDb2x1bW5TcGFuID0gZ2V0Q29sdW1uU3BhbjtcbiAgU2h1ZmZsZS5fX2dldEF2YWlsYWJsZVBvc2l0aW9ucyA9IGdldEF2YWlsYWJsZVBvc2l0aW9ucztcbiAgU2h1ZmZsZS5fX2dldFNob3J0Q29sdW1uID0gZ2V0U2hvcnRDb2x1bW47XG4gIFNodWZmbGUuX19nZXRDZW50ZXJlZFBvc2l0aW9ucyA9IGdldENlbnRlcmVkUG9zaXRpb25zO1xuXG4gIHJldHVybiBTaHVmZmxlO1xuXG59KSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaHVmZmxlLmpzLm1hcFxuIl19
