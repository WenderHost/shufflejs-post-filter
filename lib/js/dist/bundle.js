(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _shufflejsInit = _interopRequireDefault(require("./shufflejs-init"));

var filters = new _shufflejsInit["default"]();

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
    console.log('PostFilters is loaded.');
    this.filters = [];
    this.postType = wpvars.post_type;
    this.category = wpvars.category;
    this.gridId = wpvars.gridId;
    this.posts = wpvars.posts;
    this.defaultThumbnail = wpvars.defaultThumbnail;
    this.filterClassName = wpvars.filter_class_name;
    this.page_number = 1;
    this.page_size = parseInt(wpvars.limit);
    console.log('this.page_size = ', this.page_size);
    this.total_pages = -1 === this.page_size ? 1 : Math.ceil(this.posts.length / this.page_size);
    this.filterGroups = document.getElementsByClassName(wpvars.filter_class_name);
    this.loadMoreButton = document.getElementById('load-more');
    this.loadPosts();
    this.addLinkEventListener(); //document.querySelector('#load-more').addEventListener('click', this.onAppendPosts.bind(this) )

    this.addLoadMoreListener();
    console.log('this.postType = ', this.postType, "\n" + 'this.category = ', this.category, "\n" + 'this.gridId = ', this.gridId, "\nthis.posts = ", this.posts, "\nthis.defaultThumbnail = ", this.defaultThumbnail, "\nthis.filterClassName = ", this.filterClassName, "\nthis.total_pages = ", this.total_pages);
  }
  /**
   * Enables the functionality of the LOAD MORE button
   */


  (0, _createClass2["default"])(PostFilters, [{
    key: "addLoadMoreListener",
    value: function addLoadMoreListener() {
      var _this = this;

      this.loadMoreButton.addEventListener('click', function (event) {
        event.preventDefault();

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
          var filterToRemove = filterLink[0].getAttribute('data-filter');
          this.removeFilter(filterToRemove);
        }
      }

      this.applyFilters();
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
      var _this4 = this;

      var postGrid = document.getElementById(this.gridId);
      var posts = -1 === this.page_size ? this.posts : this._getPageOfPosts();
      var elProcessed = 0;
      posts.forEach(function (el, index, array) {
        postGrid.insertAdjacentHTML('beforeEnd', _this4._getPostElement(el));
        elProcessed++;

        if (elProcessed === array.length) {
          console.log('Shuffling now! this.page_number = ', _this4.page_number);
          if (_this4.page_number === _this4.total_pages || -1 === _this4.page_size) _this4.loadMoreButton.style.display = 'none';
          _this4.page_number++;
          _this4.shuffle = new _shufflejs["default"](document.getElementById(_this4.gridId), {
            itemSelector: '.' + _this4.postType,
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
          var categoryOverlay = "<div class=\"category-overlay\">".concat(el.resource_type, "</div>"); // .overlay contains .ribbon, .blue-overlay, and .category-overlay

          var overlay = "<div class=\"overlay\" style=\"background-image: url('".concat(thumbnailUrl, "')\">").concat(ribbon).concat(blueOverlay).concat(categoryOverlay, "</div>"); // Build .list-item with the .meta and title.

          var meta = "<p class=\"meta\">".concat(el.meta, "</p>");
          var title = "<h3>".concat((0, _utilities.truncate)(el.title, 80, true), "</h3>");
          var listItem = "<li class=\"list-item ".concat(this.postType, "\" data-groups='").concat(JSON.stringify(el.groups), "'><a href=\"").concat(el.permalink, "\"><div class=\"list-content ").concat(this.postType, "\">").concat(overlay).concat(meta).concat(title, "</div></a></li>");
          post = listItem;
      }

      return post;
    }
  }]);
  return PostFilters;
}();

var _default = PostFilters;
exports["default"] = _default;

},{"./utilities":3,"@babel/runtime/helpers/classCallCheck":6,"@babel/runtime/helpers/createClass":7,"@babel/runtime/helpers/interopRequireDefault":8,"@babel/runtime/helpers/slicedToArray":11,"shufflejs":13}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncate = truncate;

/* Utility Functions */
function truncate(string, n, useWordBoundary) {
  if (string.length <= n) return string;
  var subString = string.substr(0, n - 1);
  return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + "&hellip;";
}

},{}],4:[function(require,module,exports){
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
},{"./arrayWithHoles":5,"./iterableToArrayLimit":9,"./nonIterableRest":10,"./unsupportedIterableToArray":12}],12:[function(require,module,exports){
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
},{"./arrayLikeToArray":4}],13:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvanMvc3JjL21haW4uanMiLCJsaWIvanMvc3JjL3NodWZmbGVqcy1pbml0LmpzIiwibGliL2pzL3NyYy91dGlsaXRpZXMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheUxpa2VUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXJyYXlXaXRoSG9sZXMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW50ZXJvcFJlcXVpcmVEZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaXRlcmFibGVUb0FycmF5TGltaXQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9ub25JdGVyYWJsZVJlc3QuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvc2h1ZmZsZWpzL2Rpc3Qvc2h1ZmZsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQTs7QUFFQSxJQUFNLE9BQU8sR0FBRyxJQUFJLHlCQUFKLEVBQWhCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGQTs7QUFDQTs7SUFFTSxXO0FBQ0oseUJBQWE7QUFBQTtBQUNYLElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSx3QkFBWjtBQUVBLFNBQUssT0FBTCxHQUFlLEVBQWY7QUFFQSxTQUFLLFFBQUwsR0FBZ0IsTUFBTSxDQUFDLFNBQXZCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLE1BQU0sQ0FBQyxRQUF2QjtBQUNBLFNBQUssTUFBTCxHQUFjLE1BQU0sQ0FBQyxNQUFyQjtBQUNBLFNBQUssS0FBTCxHQUFhLE1BQU0sQ0FBQyxLQUFwQjtBQUNBLFNBQUssZ0JBQUwsR0FBd0IsTUFBTSxDQUFDLGdCQUEvQjtBQUNBLFNBQUssZUFBTCxHQUF1QixNQUFNLENBQUMsaUJBQTlCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLENBQW5CO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBUixDQUF6QjtBQUNBLElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxLQUFLLFNBQXRDO0FBQ0EsU0FBSyxXQUFMLEdBQXFCLENBQUMsQ0FBRCxLQUFPLEtBQUssU0FBZCxHQUEyQixDQUEzQixHQUErQixJQUFJLENBQUMsSUFBTCxDQUFXLEtBQUssS0FBTCxDQUFXLE1BQVgsR0FBa0IsS0FBSyxTQUFsQyxDQUFsRDtBQUNBLFNBQUssWUFBTCxHQUFvQixRQUFRLENBQUMsc0JBQVQsQ0FBaUMsTUFBTSxDQUFDLGlCQUF4QyxDQUFwQjtBQUNBLFNBQUssY0FBTCxHQUFzQixRQUFRLENBQUMsY0FBVCxDQUF3QixXQUF4QixDQUF0QjtBQUNBLFNBQUssU0FBTDtBQUNBLFNBQUssb0JBQUwsR0FsQlcsQ0FtQlg7O0FBQ0EsU0FBSyxtQkFBTDtBQUVBLElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxLQUFLLFFBQXJDLEVBQThDLE9BQU8sa0JBQXJELEVBQXlFLEtBQUssUUFBOUUsRUFBd0YsT0FBTyxnQkFBL0YsRUFBaUgsS0FBSyxNQUF0SCxFQUE4SCxpQkFBOUgsRUFBaUosS0FBSyxLQUF0SixFQUE2Siw0QkFBN0osRUFBMkwsS0FBSyxnQkFBaE0sRUFBa04sMkJBQWxOLEVBQStPLEtBQUssZUFBcFAsRUFBcVEsdUJBQXJRLEVBQThSLEtBQUssV0FBblM7QUFDRDtBQUVEOzs7Ozs7OzBDQUdxQjtBQUFBOztBQUNuQixXQUFLLGNBQUwsQ0FBb0IsZ0JBQXBCLENBQXFDLE9BQXJDLEVBQThDLFVBQUMsS0FBRCxFQUFXO0FBQ3ZELFFBQUEsS0FBSyxDQUFDLGNBQU47O0FBQ0EsUUFBQSxLQUFJLENBQUMsU0FBTDtBQUNELE9BSEQ7QUFJRDtBQUVEOzs7Ozs7MkNBR3NCO0FBQUE7O0FBQ3BCLHlDQUF3QixNQUFNLENBQUMsT0FBUCxDQUFlLEtBQUssWUFBcEIsQ0FBeEIscUNBQTBEO0FBQUE7QUFBQSxZQUFoRCxHQUFnRDtBQUFBLFlBQTVDLEtBQTRDOztBQUN4RCxZQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsb0JBQU4sQ0FBMkIsR0FBM0IsQ0FBcEI7O0FBRHdEO0FBQUE7QUFBQSxjQUU5QyxHQUY4QztBQUFBLGNBRTFDLElBRjBDOztBQUd0RCxjQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBTCxDQUFrQixhQUFsQixDQUFmO0FBQ0EsVUFBQSxJQUFJLENBQUMsZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBOEIsVUFBQyxLQUFELEVBQVc7QUFDdkMsWUFBQSxLQUFLLENBQUMsY0FBTjs7QUFFQSxnQkFBSSxhQUFhLHNCQUFRLG9CQUF6QixFQUErQztBQUM3QyxjQUFBLE1BQUksQ0FBQyxlQUFMOztBQUNBLG9DQUFRLG9CQUFSLEdBQStCLFFBQS9CO0FBQ0QsYUFOc0MsQ0FRdkM7QUFDQTtBQUVBOzs7QUFDQSxnQkFBSSxRQUFRLE1BQVosRUFBb0I7QUFDbEIsY0FBQSxNQUFJLENBQUMsMkJBQUwsQ0FBaUMsSUFBakM7QUFDRCxhQUZELE1BRU87QUFDTCxjQUFBLE1BQUksQ0FBQywyQkFBTCxDQUFpQyxJQUFqQzs7QUFDQSxjQUFBLE1BQUksQ0FBQyxZQUFMLENBQWtCLE1BQWxCOztBQUNBLGtCQUFJLE1BQUksQ0FBQyxTQUFMLENBQWUsTUFBZixDQUFKLEVBQTRCO0FBQzFCLGdCQUFBLElBQUksQ0FBQyxTQUFMLENBQWUsR0FBZixDQUFtQixVQUFuQjtBQUNELGVBRkQsTUFFTztBQUNMO0FBQ0EsZ0JBQUEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxNQUFmLENBQXNCLFVBQXRCO0FBQ0Q7QUFDRjtBQUNEOztBQUNELFdBekJEO0FBSnNEOztBQUV4RCw2Q0FBdUIsTUFBTSxDQUFDLE9BQVAsQ0FBZSxXQUFmLENBQXZCLHdDQUFtRDtBQUFBO0FBNEJsRDtBQUNGO0FBQ0Y7QUFFRDs7Ozs7Ozs7OEJBS1csTSxFQUFRO0FBQ2pCLFVBQUksQ0FBQyxDQUFELEtBQU8sS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixNQUFyQixDQUFYLEVBQXlDO0FBQ3ZDLGFBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsTUFBbEI7QUFDRDtBQUNGO0FBRUQ7Ozs7OzttQ0FHYztBQUNaLFVBQUksT0FBTyxHQUFHLEtBQUssT0FBbkI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVkscUJBQVosRUFBbUMsT0FBbkM7QUFDQSxXQUFLLE9BQUwsQ0FBYSxNQUFiLENBQXFCLE9BQXJCO0FBQ0Q7OztzQ0FFZ0I7QUFBQTs7QUFDZixVQUFNLE9BQU8sR0FBRyxLQUFLLE9BQXJCO0FBQ0EsTUFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixVQUFDLE9BQUQsRUFBYTtBQUMzQixRQUFBLE1BQUksQ0FBQyxZQUFMLENBQWtCLE9BQWxCO0FBQ0QsT0FGRDtBQUdEOzs7Z0RBRTRCLE0sRUFBUTtBQUNuQyxVQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsT0FBUCxDQUFlLG9CQUFmLENBQXRCO0FBQ0EsVUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFlBQWQsQ0FBMkIsZUFBM0IsQ0FBakI7QUFDQSxVQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsb0JBQWQsQ0FBbUMsSUFBbkMsQ0FBbEI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLG1EQUE0QyxRQUE1Qzs7QUFDQSwyQ0FBMkIsTUFBTSxDQUFDLE9BQVAsQ0FBZSxTQUFmLENBQTNCLHdDQUFxRDtBQUFBO0FBQUEsWUFBM0MsR0FBMkM7QUFBQSxZQUF2QyxRQUF1Qzs7QUFDbkQsWUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLG9CQUFULENBQThCLEdBQTlCLENBQW5COztBQUNBLFlBQUksVUFBVSxDQUFDLENBQUQsQ0FBVixDQUFjLFNBQWQsQ0FBd0IsUUFBeEIsQ0FBaUMsVUFBakMsQ0FBSixFQUFrRDtBQUNoRCxjQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWMsWUFBZCxDQUEyQixhQUEzQixDQUF2QjtBQUNBLGVBQUssWUFBTCxDQUFrQixjQUFsQjtBQUNEO0FBQ0Y7O0FBQ0QsV0FBSyxZQUFMO0FBQ0Q7QUFFQTs7Ozs7Ozs7OzhCQU1VLE0sRUFBUTtBQUNqQixhQUFRLENBQUMsQ0FBRCxHQUFLLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsTUFBckIsQ0FBTixHQUFxQyxJQUFyQyxHQUE0QyxLQUFuRDtBQUNEO0FBRUQ7Ozs7Ozs7O2lDQUtjLE0sRUFBUTtBQUNwQixVQUFJLEtBQUssR0FBRyxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLE1BQXJCLENBQVo7O0FBQ0EsVUFBRyxDQUFDLENBQUQsR0FBSyxLQUFSLEVBQWM7QUFDWixRQUFBLE9BQU8sQ0FBQyxHQUFSLCtCQUE4QixNQUE5QjtBQUNBLGFBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsS0FBcEIsRUFBMEIsQ0FBMUIsRUFGWSxDQUlaOztBQUNBLFlBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFULDBCQUF3QyxNQUF4QyxTQUFqQjtBQUNBLFlBQUksVUFBVSxDQUFDLFNBQVgsQ0FBcUIsUUFBckIsQ0FBOEIsVUFBOUIsQ0FBSixFQUNFLFVBQVUsQ0FBQyxTQUFYLENBQXFCLE1BQXJCLENBQTRCLFVBQTVCO0FBQ0g7QUFDRjtBQUVEOzs7Ozs7OztpQ0FLYyxNLEVBQVE7QUFDcEIsVUFBTSxTQUFTLEdBQUcsS0FBSyxTQUFMLENBQWdCLE1BQWhCLENBQWxCOztBQUNBLFVBQUksU0FBSixFQUFlO0FBQ2IsYUFBSyxZQUFMLENBQWtCLE1BQWxCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBSyxTQUFMLENBQWUsTUFBZjtBQUNEOztBQUNELFdBQUssWUFBTDtBQUNEO0FBRUQ7Ozs7Ozs7OztnQ0FNVztBQUFBOztBQUNULFVBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXlCLEtBQUssTUFBOUIsQ0FBakI7QUFFQSxVQUFNLEtBQUssR0FBSyxDQUFDLENBQUQsS0FBTyxLQUFLLFNBQWQsR0FBMkIsS0FBSyxLQUFoQyxHQUF3QyxLQUFLLGVBQUwsRUFBdEQ7QUFFQSxVQUFJLFdBQVcsR0FBRyxDQUFsQjtBQUNBLE1BQUEsS0FBSyxDQUFDLE9BQU4sQ0FBZSxVQUFDLEVBQUQsRUFBSyxLQUFMLEVBQVksS0FBWixFQUFzQjtBQUNuQyxRQUFBLFFBQVEsQ0FBQyxrQkFBVCxDQUE0QixXQUE1QixFQUF5QyxNQUFJLENBQUMsZUFBTCxDQUFxQixFQUFyQixDQUF6QztBQUNBLFFBQUEsV0FBVzs7QUFDWCxZQUFJLFdBQVcsS0FBSyxLQUFLLENBQUMsTUFBMUIsRUFBa0M7QUFFaEMsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLG9DQUFaLEVBQWtELE1BQUksQ0FBQyxXQUF2RDtBQUVBLGNBQUksTUFBSSxDQUFDLFdBQUwsS0FBcUIsTUFBSSxDQUFDLFdBQTFCLElBQXlDLENBQUMsQ0FBRCxLQUFPLE1BQUksQ0FBQyxTQUF6RCxFQUNFLE1BQUksQ0FBQyxjQUFMLENBQW9CLEtBQXBCLENBQTBCLE9BQTFCLEdBQW9DLE1BQXBDO0FBRUYsVUFBQSxNQUFJLENBQUMsV0FBTDtBQUNBLFVBQUEsTUFBSSxDQUFDLE9BQUwsR0FBZSxJQUFJLHFCQUFKLENBQWEsUUFBUSxDQUFDLGNBQVQsQ0FBeUIsTUFBSSxDQUFDLE1BQTlCLENBQWIsRUFBcUQ7QUFDbEUsWUFBQSxZQUFZLEVBQUUsTUFBTSxNQUFJLENBQUMsUUFEeUM7QUFFbEUsWUFBQSxVQUFVLEVBQUU7QUFGc0QsV0FBckQsQ0FBZjtBQUlEO0FBQ0YsT0FoQkQ7QUFpQkQ7OztzQ0FFZ0I7QUFDZixNQUFBLE9BQU8sQ0FBQyxHQUFSLGdEQUFvRCxLQUFLLFdBQXpELG1CQUE2RSxLQUFLLFNBQWxGO0FBQ0EsVUFBSSxXQUFXLEdBQUcsS0FBSyxXQUF2QjtBQUNBLE1BQUEsV0FBVztBQUNYLFVBQU0sU0FBUyxHQUFHLEtBQUssU0FBdkI7QUFDQSxhQUFPLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBa0IsV0FBVyxHQUFHLFNBQWhDLEVBQTJDLENBQUMsV0FBVyxHQUFHLENBQWYsSUFBb0IsU0FBL0QsQ0FBUDtBQUNEO0FBRUQ7Ozs7Ozs7O29DQUtpQixFLEVBQUk7QUFDbkIsVUFBTSxZQUFZLEdBQUssQ0FBRSxFQUFFLENBQUMsU0FBUCxHQUFvQixLQUFLLGdCQUF6QixHQUE0QyxFQUFFLENBQUMsU0FBcEU7QUFDQSxVQUFJLElBQUksR0FBRyxFQUFYOztBQUNBLGNBQVEsS0FBSyxRQUFiO0FBQ0UsYUFBSyxTQUFMO0FBQ0UsY0FBSSxNQUFNLEdBQUssRUFBRSxPQUFKLEdBQVkseUJBQVosR0FBd0MsRUFBckQ7QUFFQSxVQUFBLElBQUksNkNBQ21CLEtBQUssUUFEeEIsNkJBQ2tELElBQUksQ0FBQyxTQUFMLENBQWUsRUFBRSxDQUFDLE1BQWxCLENBRGxELHFDQUVTLEVBQUUsQ0FBQyxTQUZaLGlPQU9jLEVBQUUsQ0FBQyxLQVBqQix3Q0FRVSxNQVJWLDZTQWNnQyxFQUFFLENBQUMsSUFBSCxDQUFRLGVBZHhDLHNKQWlCZ0MsRUFBRSxDQUFDLElBQUgsQ0FBUSxnQkFqQnhDLHVMQXFCd0MsRUFBRSxDQUFDLElBQUgsQ0FBUSxZQXJCaEQseUVBc0I0QyxFQUFFLENBQUMsSUFBSCxDQUFRLFlBdEJwRCx5S0F5QndDLEVBQUUsQ0FBQyxJQUFILENBQVEsT0F6QmhELG9FQTBCdUMsRUFBRSxDQUFDLElBQUgsQ0FBUSxPQTFCL0MscVNBaUNZLEVBQUUsQ0FBQyxLQWpDZix5Q0FrQ1csRUFBRSxDQUFDLE9BbENkLDBHQUFKO0FBd0NBOztBQUVGO0FBQ0U7QUFDQSxjQUFJLE1BQU0saUNBQXlCLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBVixDQUFlLEdBQWYsQ0FBekIsY0FBVjtBQUNBLGNBQUksV0FBVyx1Q0FBZjtBQUNBLGNBQUksZUFBZSw2Q0FBb0MsRUFBRSxDQUFDLGFBQXZDLFdBQW5CLENBSkYsQ0FNRTs7QUFDQSxjQUFJLE9BQU8sbUVBQXlELFlBQXpELGtCQUE0RSxNQUE1RSxTQUFxRixXQUFyRixTQUFtRyxlQUFuRyxXQUFYLENBUEYsQ0FTRTs7QUFDQSxjQUFJLElBQUksK0JBQXNCLEVBQUUsQ0FBQyxJQUF6QixTQUFSO0FBQ0EsY0FBSSxLQUFLLGlCQUFVLHlCQUFTLEVBQUUsQ0FBQyxLQUFaLEVBQWtCLEVBQWxCLEVBQXFCLElBQXJCLENBQVYsVUFBVDtBQUNBLGNBQUksUUFBUSxtQ0FBMkIsS0FBSyxRQUFoQyw2QkFBMEQsSUFBSSxDQUFDLFNBQUwsQ0FBZSxFQUFFLENBQUMsTUFBbEIsQ0FBMUQseUJBQWlHLEVBQUUsQ0FBQyxTQUFwRywwQ0FBMkksS0FBSyxRQUFoSixnQkFBNkosT0FBN0osU0FBdUssSUFBdkssU0FBOEssS0FBOUssb0JBQVo7QUFDQSxVQUFBLElBQUksR0FBRyxRQUFQO0FBM0RKOztBQTZEQSxhQUFPLElBQVA7QUFDRDs7Ozs7ZUFHWSxXOzs7Ozs7Ozs7OztBQ2xSZjtBQUVPLFNBQVMsUUFBVCxDQUFtQixNQUFuQixFQUEyQixDQUEzQixFQUE4QixlQUE5QixFQUErQztBQUNsRCxNQUFJLE1BQU0sQ0FBQyxNQUFQLElBQWlCLENBQXJCLEVBQ0UsT0FBTyxNQUFQO0FBQ0YsTUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLENBQUMsR0FBQyxDQUFuQixDQUFoQjtBQUNBLFNBQU8sQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsQ0FBakIsRUFBb0IsU0FBUyxDQUFDLFdBQVYsQ0FBc0IsR0FBdEIsQ0FBcEIsQ0FBSCxHQUFzRCxTQUF0RSxJQUFtRixVQUExRjtBQUNIOzs7QUNQRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IFBvc3RGaWx0ZXJzIGZyb20gJy4vc2h1ZmZsZWpzLWluaXQnXG5cbmNvbnN0IGZpbHRlcnMgPSBuZXcgUG9zdEZpbHRlcnMoKSIsImltcG9ydCBTaHVmZmxlIGZyb20gJ3NodWZmbGVqcydcbmltcG9ydCB7IHRydW5jYXRlIH0gZnJvbSAnLi91dGlsaXRpZXMnXG5cbmNsYXNzIFBvc3RGaWx0ZXJzIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICBjb25zb2xlLmxvZygnUG9zdEZpbHRlcnMgaXMgbG9hZGVkLicpXG5cbiAgICB0aGlzLmZpbHRlcnMgPSBbXVxuXG4gICAgdGhpcy5wb3N0VHlwZSA9IHdwdmFycy5wb3N0X3R5cGVcbiAgICB0aGlzLmNhdGVnb3J5ID0gd3B2YXJzLmNhdGVnb3J5XG4gICAgdGhpcy5ncmlkSWQgPSB3cHZhcnMuZ3JpZElkXG4gICAgdGhpcy5wb3N0cyA9IHdwdmFycy5wb3N0c1xuICAgIHRoaXMuZGVmYXVsdFRodW1ibmFpbCA9IHdwdmFycy5kZWZhdWx0VGh1bWJuYWlsXG4gICAgdGhpcy5maWx0ZXJDbGFzc05hbWUgPSB3cHZhcnMuZmlsdGVyX2NsYXNzX25hbWVcbiAgICB0aGlzLnBhZ2VfbnVtYmVyID0gMVxuICAgIHRoaXMucGFnZV9zaXplID0gcGFyc2VJbnQod3B2YXJzLmxpbWl0KVxuICAgIGNvbnNvbGUubG9nKCd0aGlzLnBhZ2Vfc2l6ZSA9ICcsIHRoaXMucGFnZV9zaXplKVxuICAgIHRoaXMudG90YWxfcGFnZXMgPSAoIC0xID09PSB0aGlzLnBhZ2Vfc2l6ZSApPyAxIDogTWF0aC5jZWlsKCB0aGlzLnBvc3RzLmxlbmd0aC90aGlzLnBhZ2Vfc2l6ZSApXG4gICAgdGhpcy5maWx0ZXJHcm91cHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCB3cHZhcnMuZmlsdGVyX2NsYXNzX25hbWUgKVxuICAgIHRoaXMubG9hZE1vcmVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZC1tb3JlJylcbiAgICB0aGlzLmxvYWRQb3N0cygpXG4gICAgdGhpcy5hZGRMaW5rRXZlbnRMaXN0ZW5lcigpXG4gICAgLy9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9hZC1tb3JlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQXBwZW5kUG9zdHMuYmluZCh0aGlzKSApXG4gICAgdGhpcy5hZGRMb2FkTW9yZUxpc3RlbmVyKClcblxuICAgIGNvbnNvbGUubG9nKCd0aGlzLnBvc3RUeXBlID0gJywgdGhpcy5wb3N0VHlwZSxcIlxcblwiICsgJ3RoaXMuY2F0ZWdvcnkgPSAnLCB0aGlzLmNhdGVnb3J5LCBcIlxcblwiICsgJ3RoaXMuZ3JpZElkID0gJywgdGhpcy5ncmlkSWQsIFwiXFxudGhpcy5wb3N0cyA9IFwiLCB0aGlzLnBvc3RzLCBcIlxcbnRoaXMuZGVmYXVsdFRodW1ibmFpbCA9IFwiLCB0aGlzLmRlZmF1bHRUaHVtYm5haWwsIFwiXFxudGhpcy5maWx0ZXJDbGFzc05hbWUgPSBcIiwgdGhpcy5maWx0ZXJDbGFzc05hbWUsIFwiXFxudGhpcy50b3RhbF9wYWdlcyA9IFwiLCB0aGlzLnRvdGFsX3BhZ2VzIClcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmFibGVzIHRoZSBmdW5jdGlvbmFsaXR5IG9mIHRoZSBMT0FEIE1PUkUgYnV0dG9uXG4gICAqL1xuICBhZGRMb2FkTW9yZUxpc3RlbmVyKCl7XG4gICAgdGhpcy5sb2FkTW9yZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgdGhpcy5sb2FkUG9zdHMoKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQWRkcyBldmVudCBsaXN0ZW5lciB0byBlYWNoIC5maWx0ZXItbGluay1ncm91cCB1bCA+IGxpID4gYVxuICAgKi9cbiAgYWRkTGlua0V2ZW50TGlzdGVuZXIoKXtcbiAgICBmb3IoIGxldCBba2V5LHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmZpbHRlckdyb3Vwcykpe1xuICAgICAgY29uc3QgZmlsdGVyTGlua3MgPSB2YWx1ZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpXG4gICAgICBmb3IoIGxldCBba2V5LGxpbmtdIG9mIE9iamVjdC5lbnRyaWVzKGZpbHRlckxpbmtzKSl7XG4gICAgICAgIGNvbnN0IGZpbHRlciA9IGxpbmsuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlcicpXG4gICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICAgIGlmKCAnZ3JvdXBzJyAhPT0gU2h1ZmZsZS5GSUxURVJfQVRUUklCVVRFX0tFWSApe1xuICAgICAgICAgICAgdGhpcy5jbGVhckFsbEZpbHRlcnMoKVxuICAgICAgICAgICAgU2h1ZmZsZS5GSUxURVJfQVRUUklCVVRFX0tFWSA9ICdncm91cHMnXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQ2xlYXIgdGhlIHRleHQgc2VhcmNoIGZpZWxkXG4gICAgICAgICAgLy90aGlzLnJlbW92ZVNlYXJjaFRleHQoKVxuXG4gICAgICAgICAgLy8gUmVtb3ZlIGFsbCBmaWx0ZXJpbmcgZm9yIGEgdGF4b25vbXkgaWYgJyonID09PSBmaWx0ZXJcbiAgICAgICAgICBpZiggJyonID09PSBmaWx0ZXIgKXtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFyQWxsRmlsdGVyc0ZvclRheG9ub215KGxpbmspXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFyQWxsRmlsdGVyc0ZvclRheG9ub215KGxpbmspXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUZpbHRlcihmaWx0ZXIpXG4gICAgICAgICAgICBpZiggdGhpcy5oYXNGaWx0ZXIoZmlsdGVyKSApe1xuICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vdGhpcy5fY2xlYXJBbGxGaWx0ZXJzRm9yVGF4b25vbXkobGluaylcbiAgICAgICAgICAgICAgbGluay5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8qKi9cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGBmaWx0ZXJgIHRvIHRoaXMuZmlsdGVyc1xuICAgKlxuICAgKiBAcGFyYW0gICAgICB7c3RyaW5nfSAgZmlsdGVyICBUaGUgZmlsdGVyXG4gICAqL1xuICBhZGRGaWx0ZXIoIGZpbHRlciApe1xuICAgIGlmKCAtMSA9PT0gdGhpcy5maWx0ZXJzLmluZGV4T2YoZmlsdGVyKSApe1xuICAgICAgdGhpcy5maWx0ZXJzLnB1c2goZmlsdGVyKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyBTaHVmZmxlSlMuc2h1ZmZsZSB3aXRoIG91ciBmaWx0ZXJzXG4gICAqL1xuICBhcHBseUZpbHRlcnMoKXtcbiAgICB2YXIgZmlsdGVycyA9IHRoaXMuZmlsdGVyc1xuICAgIGNvbnNvbGUubG9nKCfwn5SUIEZpbHRlcmluZyB3aXRoOiAnLCBmaWx0ZXJzIClcbiAgICB0aGlzLnNodWZmbGUuZmlsdGVyKCBmaWx0ZXJzIClcbiAgfVxuXG4gIGNsZWFyQWxsRmlsdGVycygpe1xuICAgIGNvbnN0IGZpbHRlcnMgPSB0aGlzLmZpbHRlcnNcbiAgICBmaWx0ZXJzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlRmlsdGVyKGVsZW1lbnQpXG4gICAgfSlcbiAgfVxuXG4gIF9jbGVhckFsbEZpbHRlcnNGb3JUYXhvbm9teSggbGlua0VsICl7XG4gICAgY29uc3QgY2xvc2VzdFBhcmVudCA9IGxpbmtFbC5jbG9zZXN0KCcuZmlsdGVyLWxpbmstZ3JvdXAnKVxuICAgIGNvbnN0IHRheG9ub215ID0gY2xvc2VzdFBhcmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGF4b25vbXknKVxuICAgIGNvbnN0IGxpc3RJdGVtcyA9IGNsb3Nlc3RQYXJlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJylcbiAgICBjb25zb2xlLmxvZyhg8J+UlCBDbGVhcmluZyBhbGwgZmlsdGVycyBmb3IgXCIke3RheG9ub215fVwiLi4uYClcbiAgICBmb3IoIGxldCBba2V5LGxpc3RJdGVtXSBvZiBPYmplY3QuZW50cmllcyhsaXN0SXRlbXMpKXtcbiAgICAgIGNvbnN0IGZpbHRlckxpbmsgPSBsaXN0SXRlbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpXG4gICAgICBpZiggZmlsdGVyTGlua1swXS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykgKXtcbiAgICAgICAgY29uc3QgZmlsdGVyVG9SZW1vdmUgPSBmaWx0ZXJMaW5rWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXInKVxuICAgICAgICB0aGlzLnJlbW92ZUZpbHRlcihmaWx0ZXJUb1JlbW92ZSlcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hcHBseUZpbHRlcnMoKVxuICB9XG5cbiAgIC8qKlxuICAgKiBDaGVja3MgZm9yIHRoZSBleGlzdGVuY2Ugb2YgYGZpbHRlcmAgaW5zaWRlIHRoaXMuZmlsdGVyc1xuICAgKlxuICAgKiBAcGFyYW0gICAgICB7c3RyaW5nfSAgIGZpbHRlciAgVGhlIGZpbHRlclxuICAgKiBAcmV0dXJuICAgICB7Ym9vbGVhbn0gIFRydWUgaWYgaGFzIGZpbHRlciwgRmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaGFzRmlsdGVyKCBmaWx0ZXIgKXtcbiAgICByZXR1cm4gKC0xIDwgdGhpcy5maWx0ZXJzLmluZGV4T2YoZmlsdGVyKSk/IHRydWUgOiBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBgZmlsdGVyYCBmcm9tIHRoaXMuZmlsdGVyc1xuICAgKlxuICAgKiBAcGFyYW0gICAgICB7c3RyaW5nfSAgZmlsdGVyICBUaGUgZmlsdGVyXG4gICAqL1xuICByZW1vdmVGaWx0ZXIoIGZpbHRlciApe1xuICAgIHZhciBpbmRleCA9IHRoaXMuZmlsdGVycy5pbmRleE9mKGZpbHRlcilcbiAgICBpZigtMSA8IGluZGV4KXtcbiAgICAgIGNvbnNvbGUubG9nKGBcXHQg4oCiIFJlbW92aW5nICcke2ZpbHRlcn0nYClcbiAgICAgIHRoaXMuZmlsdGVycy5zcGxpY2UoaW5kZXgsMSlcblxuICAgICAgLy8gUmVtb3ZlIC5zZWxlY3RlZCBmcm9tIHRoZSBmaWx0ZXIgYW5jaG9yIHRhZy5cbiAgICAgIHZhciBmaWx0ZXJMaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtZmlsdGVyPVwiJHtmaWx0ZXJ9XCJdYClcbiAgICAgIGlmKCBmaWx0ZXJMaW5rLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSApXG4gICAgICAgIGZpbHRlckxpbmsuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIChhZGRzL3JlbW92ZXMpIGEgYGZpbHRlcmAgZnJvbSB0aGlzLmZpbHRlcnNcbiAgICpcbiAgICogQHBhcmFtICAgICAge3N0cmluZ30gIGZpbHRlciAgVGhlIGZpbHRlclxuICAgKi9cbiAgdG9nZ2xlRmlsdGVyKCBmaWx0ZXIgKXtcbiAgICBjb25zdCBoYXNGaWx0ZXIgPSB0aGlzLmhhc0ZpbHRlciggZmlsdGVyIClcbiAgICBpZiggaGFzRmlsdGVyICl7XG4gICAgICB0aGlzLnJlbW92ZUZpbHRlcihmaWx0ZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkRmlsdGVyKGZpbHRlcilcbiAgICB9XG4gICAgdGhpcy5hcHBseUZpbHRlcnMoKVxuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIG91ciBwb3N0cyBhbmQgYXBwbGllcyBTaHVmZmxlSlNcbiAgICpcbiAgICogQHBhcmFtICAgICAge251bWJlcn0gIHBhZ2Vfc2l6ZSAgICBUaGUgcGFnZSBzaXplXG4gICAqIEBwYXJhbSAgICAgIHtudW1iZXJ9ICBwYWdlX251bWJlciAgVGhlIHBhZ2UgbnVtYmVyXG4gICAqL1xuICBsb2FkUG9zdHMoKXtcbiAgICBjb25zdCBwb3N0R3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCB0aGlzLmdyaWRJZCApXG5cbiAgICBjb25zdCBwb3N0cyA9ICggLTEgPT09IHRoaXMucGFnZV9zaXplICk/IHRoaXMucG9zdHMgOiB0aGlzLl9nZXRQYWdlT2ZQb3N0cygpXG5cbiAgICBsZXQgZWxQcm9jZXNzZWQgPSAwXG4gICAgcG9zdHMuZm9yRWFjaCggKGVsLCBpbmRleCwgYXJyYXkpID0+IHtcbiAgICAgIHBvc3RHcmlkLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlRW5kJywgdGhpcy5fZ2V0UG9zdEVsZW1lbnQoZWwpIClcbiAgICAgIGVsUHJvY2Vzc2VkKytcbiAgICAgIGlmKCBlbFByb2Nlc3NlZCA9PT0gYXJyYXkubGVuZ3RoICl7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ1NodWZmbGluZyBub3chIHRoaXMucGFnZV9udW1iZXIgPSAnLCB0aGlzLnBhZ2VfbnVtYmVyKVxuXG4gICAgICAgIGlmKCB0aGlzLnBhZ2VfbnVtYmVyID09PSB0aGlzLnRvdGFsX3BhZ2VzIHx8IC0xID09PSB0aGlzLnBhZ2Vfc2l6ZSApXG4gICAgICAgICAgdGhpcy5sb2FkTW9yZUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cbiAgICAgICAgdGhpcy5wYWdlX251bWJlcisrXG4gICAgICAgIHRoaXMuc2h1ZmZsZSA9IG5ldyBTaHVmZmxlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggdGhpcy5ncmlkSWQgKSwge1xuICAgICAgICAgIGl0ZW1TZWxlY3RvcjogJy4nICsgdGhpcy5wb3N0VHlwZSxcbiAgICAgICAgICBmaWx0ZXJNb2RlOiAnYWxsJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBfZ2V0UGFnZU9mUG9zdHMoKXtcbiAgICBjb25zb2xlLmxvZyhgX2dldFBhZ2VPZlBvc3RzKCkgaXMgcmV0cmlldmluZyBwYWdlICR7dGhpcy5wYWdlX251bWJlcn0gd2l0aCAke3RoaXMucGFnZV9zaXplfSBwb3N0cy5gKVxuICAgIGxldCBwYWdlX251bWJlciA9IHRoaXMucGFnZV9udW1iZXJcbiAgICBwYWdlX251bWJlci0tXG4gICAgY29uc3QgcGFnZV9zaXplID0gdGhpcy5wYWdlX3NpemVcbiAgICByZXR1cm4gdGhpcy5wb3N0cy5zbGljZSggcGFnZV9udW1iZXIgKiBwYWdlX3NpemUsIChwYWdlX251bWJlciArIDEpICogcGFnZV9zaXplIClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBIVE1MIGZvciBvdXIgcG9zdCBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZWwgT3VyIHBvc3QgZWxlbWVudC9vYmplY3QuXG4gICAqL1xuICBfZ2V0UG9zdEVsZW1lbnQoIGVsICl7XG4gICAgY29uc3QgdGh1bWJuYWlsVXJsID0gKCAhIGVsLnRodW1ibmFpbCApPyB0aGlzLmRlZmF1bHRUaHVtYm5haWwgOiBlbC50aHVtYm5haWwgO1xuICAgIGxldCBwb3N0ID0gJydcbiAgICBzd2l0Y2goIHRoaXMucG9zdFR5cGUgKXtcbiAgICAgIGNhc2UgJ3Byb2R1Y3QnOlxuICAgICAgICB2YXIgbmV3VGFnID0gKCBlbC5uZXcgKT8gJzxkaXYgY2xhc3M9XCJuZXdcIj48L2Rpdj4nIDogJydcblxuICAgICAgICBwb3N0ID0gYFxuICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW0gJHt0aGlzLnBvc3RUeXBlfVwiIGRhdGEtZ3JvdXBzPScke0pTT04uc3RyaW5naWZ5KGVsLmdyb3Vwcyl9Jz5cbiAgICAgICAgICA8YSBocmVmPVwiJHtlbC5wZXJtYWxpbmt9XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxpcC1jYXJkXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGlwLWNhcmQtaW5uZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxpcC1jYXJkLWZyb250XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY291cnNlLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMz4ke2VsLnRpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICR7bmV3VGFnfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY291cnNlLW1ldGFcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvdXJzZS1tZXRhLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb3Vyc2UtbWV0YS1jb2xcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpY29uIGR1cmF0aW9uXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dFwiPiR7ZWwubWV0YS5jb3Vyc2VfZHVyYXRpb259PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvdXJzZS1tZXRhLWNvbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHRcIj4ke2VsLm1ldGEuY291cnNlX3JlZmVyZW5jZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb3Vyc2UtbWV0YS1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY291cnNlLW1ldGEtY29sICR7ZWwubWV0YS5mYWNlX3RvX2ZhY2V9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvbiBmYWNlLXRvLWZhY2UgJHtlbC5tZXRhLmZhY2VfdG9fZmFjZX1cIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0XCI+RmFjZS10by1GYWNlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvdXJzZS1tZXRhLWNvbCAke2VsLm1ldGEudmlydHVhbH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpY29uIHZpcnR1YWwgJHtlbC5tZXRhLnZpcnR1YWx9XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dFwiPjxzcGFuPlZpcnR1YWw8YnIvPk9wZW5DbGFzcyZyZWc7PC9zcGFuPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGlwLWNhcmQtYmFja1wiPlxuICAgICAgICAgICAgICAgICAgPGgzPiR7ZWwudGl0bGV9PC9oMz5cbiAgICAgICAgICAgICAgICAgIDxwPiR7ZWwuZXhjZXJwdH08L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L2xpPmBcbiAgICAgICAgYnJlYWtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gQnVpbGQgdGhlIGVsZW1lbnRzIG9mIC5vdmVybGF5XG4gICAgICAgIGxldCByaWJib24gPSBgPGRpdiBjbGFzcz1cInJpYmJvbiAke2VsLmdyb3Vwcy5qb2luKCcgJyl9XCI+PC9kaXY+YFxuICAgICAgICBsZXQgYmx1ZU92ZXJsYXkgPSBgPGRpdiBjbGFzcz1cImJsdWUtb3ZlcmxheVwiPjwvZGl2PmBcbiAgICAgICAgbGV0IGNhdGVnb3J5T3ZlcmxheSA9IGA8ZGl2IGNsYXNzPVwiY2F0ZWdvcnktb3ZlcmxheVwiPiR7ZWwucmVzb3VyY2VfdHlwZX08L2Rpdj5gXG5cbiAgICAgICAgLy8gLm92ZXJsYXkgY29udGFpbnMgLnJpYmJvbiwgLmJsdWUtb3ZlcmxheSwgYW5kIC5jYXRlZ29yeS1vdmVybGF5XG4gICAgICAgIGxldCBvdmVybGF5ID0gYDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyR7dGh1bWJuYWlsVXJsfScpXCI+JHtyaWJib259JHtibHVlT3ZlcmxheX0ke2NhdGVnb3J5T3ZlcmxheX08L2Rpdj5gXG5cbiAgICAgICAgLy8gQnVpbGQgLmxpc3QtaXRlbSB3aXRoIHRoZSAubWV0YSBhbmQgdGl0bGUuXG4gICAgICAgIGxldCBtZXRhID0gYDxwIGNsYXNzPVwibWV0YVwiPiR7ZWwubWV0YX08L3A+YFxuICAgICAgICBsZXQgdGl0bGUgPSBgPGgzPiR7dHJ1bmNhdGUoZWwudGl0bGUsODAsdHJ1ZSl9PC9oMz5gXG4gICAgICAgIGxldCBsaXN0SXRlbSA9IGA8bGkgY2xhc3M9XCJsaXN0LWl0ZW0gJHt0aGlzLnBvc3RUeXBlfVwiIGRhdGEtZ3JvdXBzPScke0pTT04uc3RyaW5naWZ5KGVsLmdyb3Vwcyl9Jz48YSBocmVmPVwiJHtlbC5wZXJtYWxpbmt9XCI+PGRpdiBjbGFzcz1cImxpc3QtY29udGVudCAke3RoaXMucG9zdFR5cGV9XCI+JHtvdmVybGF5fSR7bWV0YX0ke3RpdGxlfTwvZGl2PjwvYT48L2xpPmBcbiAgICAgICAgcG9zdCA9IGxpc3RJdGVtXG4gICAgfVxuICAgIHJldHVybiBwb3N0XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9zdEZpbHRlcnMiLCIvKiBVdGlsaXR5IEZ1bmN0aW9ucyAqL1xuXG5leHBvcnQgZnVuY3Rpb24gdHJ1bmNhdGUoIHN0cmluZywgbiwgdXNlV29yZEJvdW5kYXJ5ICl7XG4gICAgaWYgKHN0cmluZy5sZW5ndGggPD0gbilcbiAgICAgIHJldHVybiBzdHJpbmdcbiAgICBsZXQgc3ViU3RyaW5nID0gc3RyaW5nLnN1YnN0cigwLCBuLTEpXG4gICAgcmV0dXJuICh1c2VXb3JkQm91bmRhcnkgPyBzdWJTdHJpbmcuc3Vic3RyKDAsIHN1YlN0cmluZy5sYXN0SW5kZXhPZignICcpICkgOiBzdWJTdHJpbmcpICsgXCImaGVsbGlwO1wiXG59IiwiZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgYXJyMltpXSA9IGFycltpXTtcbiAgfVxuXG4gIHJldHVybiBhcnIyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hcnJheUxpa2VUb0FycmF5OyIsImZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlXaXRoSG9sZXM7IiwiZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfY2xhc3NDYWxsQ2hlY2s7IiwiZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9jcmVhdGVDbGFzczsiLCJmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgIFwiZGVmYXVsdFwiOiBvYmpcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0OyIsImZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHtcbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwidW5kZWZpbmVkXCIgfHwgIShTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpKSByZXR1cm47XG4gIHZhciBfYXJyID0gW107XG4gIHZhciBfbiA9IHRydWU7XG4gIHZhciBfZCA9IGZhbHNlO1xuICB2YXIgX2UgPSB1bmRlZmluZWQ7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7XG4gICAgICBfYXJyLnB1c2goX3MudmFsdWUpO1xuXG4gICAgICBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBfZCA9IHRydWU7XG4gICAgX2UgPSBlcnI7XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKF9kKSB0aHJvdyBfZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gX2Fycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaXRlcmFibGVUb0FycmF5TGltaXQ7IiwiZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfbm9uSXRlcmFibGVSZXN0OyIsInZhciBhcnJheVdpdGhIb2xlcyA9IHJlcXVpcmUoXCIuL2FycmF5V2l0aEhvbGVzXCIpO1xuXG52YXIgaXRlcmFibGVUb0FycmF5TGltaXQgPSByZXF1aXJlKFwiLi9pdGVyYWJsZVRvQXJyYXlMaW1pdFwiKTtcblxudmFyIHVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5ID0gcmVxdWlyZShcIi4vdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXlcIik7XG5cbnZhciBub25JdGVyYWJsZVJlc3QgPSByZXF1aXJlKFwiLi9ub25JdGVyYWJsZVJlc3RcIik7XG5cbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkge1xuICByZXR1cm4gYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBpdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IHVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgbm9uSXRlcmFibGVSZXN0KCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3NsaWNlZFRvQXJyYXk7IiwidmFyIGFycmF5TGlrZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9hcnJheUxpa2VUb0FycmF5XCIpO1xuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gIGlmICghbykgcmV0dXJuO1xuICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG4gIHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcbiAgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTtcbiAgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7XG4gIGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheTsiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwgPSBnbG9iYWwgfHwgc2VsZiwgZ2xvYmFsLlNodWZmbGUgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCBmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9XG5cbiAgZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cblxuICAgIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7XG4gIH1cblxuICBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICAgIF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgICByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pO1xuICAgIH07XG4gICAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgICBvLl9fcHJvdG9fXyA9IHA7XG4gICAgICByZXR1cm4gbztcbiAgICB9O1xuXG4gICAgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikge1xuICAgIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHtcbiAgICBpZiAoY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHtcbiAgICAgIHJldHVybiBjYWxsO1xuICAgIH1cblxuICAgIHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpO1xuICB9XG5cbiAgZnVuY3Rpb24gRSAoKSB7XG4gICAgLy8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAgIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbiAgfVxuXG4gIEUucHJvdG90eXBlID0ge1xuICAgIG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcblxuICAgICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgICBmbjogY2FsbGJhY2ssXG4gICAgICAgIGN0eDogY3R4XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIG9uY2U6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBsaXN0ZW5lciAoKSB7XG4gICAgICAgIHNlbGYub2ZmKG5hbWUsIGxpc3RlbmVyKTtcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgbGlzdGVuZXIuXyA9IGNhbGxiYWNrO1xuICAgICAgcmV0dXJuIHRoaXMub24obmFtZSwgbGlzdGVuZXIsIGN0eCk7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuXG4gICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBldnRBcnJbaV0uZm4uYXBwbHkoZXZ0QXJyW2ldLmN0eCwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBvZmY6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICAgIHZhciBldnRzID0gZVtuYW1lXTtcbiAgICAgIHZhciBsaXZlRXZlbnRzID0gW107XG5cbiAgICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBldnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrICYmIGV2dHNbaV0uZm4uXyAhPT0gY2FsbGJhY2spXG4gICAgICAgICAgICBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgICAgLy8gU3VnZ2VzdGVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9sYXpkXG4gICAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAgIChsaXZlRXZlbnRzLmxlbmd0aClcbiAgICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xuICAgICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG5cbiAgdmFyIHRpbnlFbWl0dGVyID0gRTtcbiAgdmFyIFRpbnlFbWl0dGVyID0gRTtcbiAgdGlueUVtaXR0ZXIuVGlueUVtaXR0ZXIgPSBUaW55RW1pdHRlcjtcblxuICB2YXIgcHJvdG8gPSB0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBFbGVtZW50LnByb3RvdHlwZSA6IHt9O1xuICB2YXIgdmVuZG9yID0gcHJvdG8ubWF0Y2hlc1xuICAgIHx8IHByb3RvLm1hdGNoZXNTZWxlY3RvclxuICAgIHx8IHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvclxuICAgIHx8IHByb3RvLm1vek1hdGNoZXNTZWxlY3RvclxuICAgIHx8IHByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yXG4gICAgfHwgcHJvdG8ub01hdGNoZXNTZWxlY3RvcjtcblxuICB2YXIgbWF0Y2hlc1NlbGVjdG9yID0gbWF0Y2g7XG5cbiAgLyoqXG4gICAqIE1hdGNoIGBlbGAgdG8gYHNlbGVjdG9yYC5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gbWF0Y2goZWwsIHNlbGVjdG9yKSB7XG4gICAgaWYgKCFlbCB8fCBlbC5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh2ZW5kb3IpIHJldHVybiB2ZW5kb3IuY2FsbChlbCwgc2VsZWN0b3IpO1xuICAgIHZhciBub2RlcyA9IGVsLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG5vZGVzW2ldID09IGVsKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHRocm90dGxlaXQgPSB0aHJvdHRsZTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIG5ldyBmdW5jdGlvbiB0aGF0LCB3aGVuIGludm9rZWQsIGludm9rZXMgYGZ1bmNgIGF0IG1vc3Qgb25jZSBwZXIgYHdhaXRgIG1pbGxpc2Vjb25kcy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBGdW5jdGlvbiB0byB3cmFwLlxuICAgKiBAcGFyYW0ge051bWJlcn0gd2FpdCBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgbXVzdCBlbGFwc2UgYmV0d2VlbiBgZnVuY2AgaW52b2NhdGlvbnMuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldyBmdW5jdGlvbiB0aGF0IHdyYXBzIHRoZSBgZnVuY2AgZnVuY3Rpb24gcGFzc2VkIGluLlxuICAgKi9cblxuICBmdW5jdGlvbiB0aHJvdHRsZSAoZnVuYywgd2FpdCkge1xuICAgIHZhciBjdHgsIGFyZ3MsIHJ0biwgdGltZW91dElEOyAvLyBjYWNoaW5nXG4gICAgdmFyIGxhc3QgPSAwO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIHRocm90dGxlZCAoKSB7XG4gICAgICBjdHggPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHZhciBkZWx0YSA9IG5ldyBEYXRlKCkgLSBsYXN0O1xuICAgICAgaWYgKCF0aW1lb3V0SUQpXG4gICAgICAgIGlmIChkZWx0YSA+PSB3YWl0KSBjYWxsKCk7XG4gICAgICAgIGVsc2UgdGltZW91dElEID0gc2V0VGltZW91dChjYWxsLCB3YWl0IC0gZGVsdGEpO1xuICAgICAgcmV0dXJuIHJ0bjtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY2FsbCAoKSB7XG4gICAgICB0aW1lb3V0SUQgPSAwO1xuICAgICAgbGFzdCA9ICtuZXcgRGF0ZSgpO1xuICAgICAgcnRuID0gZnVuYy5hcHBseShjdHgsIGFyZ3MpO1xuICAgICAgY3R4ID0gbnVsbDtcbiAgICAgIGFyZ3MgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHZhciBhcnJheVBhcmFsbGVsID0gZnVuY3Rpb24gcGFyYWxsZWwoZm5zLCBjb250ZXh0LCBjYWxsYmFjaykge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIGlmICh0eXBlb2YgY29udGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IGNvbnRleHQ7XG4gICAgICAgIGNvbnRleHQgPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sgPSBub29wO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwZW5kaW5nID0gZm5zICYmIGZucy5sZW5ndGg7XG4gICAgaWYgKCFwZW5kaW5nKSByZXR1cm4gY2FsbGJhY2sobnVsbCwgW10pO1xuXG4gICAgdmFyIGZpbmlzaGVkID0gZmFsc2U7XG4gICAgdmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkocGVuZGluZyk7XG5cbiAgICBmbnMuZm9yRWFjaChjb250ZXh0ID8gZnVuY3Rpb24gKGZuLCBpKSB7XG4gICAgICBmbi5jYWxsKGNvbnRleHQsIG1heWJlRG9uZShpKSk7XG4gICAgfSA6IGZ1bmN0aW9uIChmbiwgaSkge1xuICAgICAgZm4obWF5YmVEb25lKGkpKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIG1heWJlRG9uZShpKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChmaW5pc2hlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdHMpO1xuICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdHNbaV0gPSByZXN1bHQ7XG5cbiAgICAgICAgaWYgKCEtLXBlbmRpbmcpIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBub29wKCkge31cblxuICAvKipcbiAgICogQWx3YXlzIHJldHVybnMgYSBudW1lcmljIHZhbHVlLCBnaXZlbiBhIHZhbHVlLiBMb2dpYyBmcm9tIGpRdWVyeSdzIGBpc051bWVyaWNgLlxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFBvc3NpYmx5IG51bWVyaWMgdmFsdWUuXG4gICAqIEByZXR1cm4ge251bWJlcn0gYHZhbHVlYCBvciB6ZXJvIGlmIGB2YWx1ZWAgaXNuJ3QgbnVtZXJpYy5cbiAgICovXG4gIGZ1bmN0aW9uIGdldE51bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSB8fCAwO1xuICB9XG5cbiAgdmFyIFBvaW50ID1cbiAgLyojX19QVVJFX18qL1xuICBmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyBhIGNvb3JkaW5hdGUgcGFpci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3g9MF0gWC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3k9MF0gWS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBQb2ludCh4LCB5KSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUG9pbnQpO1xuXG4gICAgICB0aGlzLnggPSBnZXROdW1iZXIoeCk7XG4gICAgICB0aGlzLnkgPSBnZXROdW1iZXIoeSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdHdvIHBvaW50cyBhcmUgZXF1YWwuXG4gICAgICogQHBhcmFtIHtQb2ludH0gYSBQb2ludCBBLlxuICAgICAqIEBwYXJhbSB7UG9pbnR9IGIgUG9pbnQgQi5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBfY3JlYXRlQ2xhc3MoUG9pbnQsIG51bGwsIFt7XG4gICAgICBrZXk6IFwiZXF1YWxzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZXF1YWxzKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEueCA9PT0gYi54ICYmIGEueSA9PT0gYi55O1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBQb2ludDtcbiAgfSgpO1xuXG4gIHZhciBSZWN0ID1cbiAgLyojX19QVVJFX18qL1xuICBmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ2xhc3MgZm9yIHJlcHJlc2VudGluZyByZWN0YW5ndWxhciByZWdpb25zLlxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvY2xvc3VyZS1saWJyYXJ5L2Jsb2IvbWFzdGVyL2Nsb3N1cmUvZ29vZy9tYXRoL3JlY3QuanNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCBMZWZ0LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IFRvcC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdyBXaWR0aC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaCBIZWlnaHQuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIElkZW50aWZpZXJcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBSZWN0KHgsIHksIHcsIGgsIGlkKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUmVjdCk7XG5cbiAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuXG4gICAgICB0aGlzLmxlZnQgPSB4O1xuICAgICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG5cbiAgICAgIHRoaXMudG9wID0geTtcbiAgICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuXG4gICAgICB0aGlzLndpZHRoID0gdztcbiAgICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuXG4gICAgICB0aGlzLmhlaWdodCA9IGg7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0d28gcmVjdGFuZ2xlcyBpbnRlcnNlY3QuXG4gICAgICogQHBhcmFtIHtSZWN0fSBhIEEgUmVjdGFuZ2xlLlxuICAgICAqIEBwYXJhbSB7UmVjdH0gYiBBIFJlY3RhbmdsZS5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIGEgYW5kIGIgaW50ZXJzZWN0LlxuICAgICAqL1xuXG5cbiAgICBfY3JlYXRlQ2xhc3MoUmVjdCwgbnVsbCwgW3tcbiAgICAgIGtleTogXCJpbnRlcnNlY3RzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gaW50ZXJzZWN0cyhhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLmxlZnQgPCBiLmxlZnQgKyBiLndpZHRoICYmIGIubGVmdCA8IGEubGVmdCArIGEud2lkdGggJiYgYS50b3AgPCBiLnRvcCArIGIuaGVpZ2h0ICYmIGIudG9wIDwgYS50b3AgKyBhLmhlaWdodDtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUmVjdDtcbiAgfSgpO1xuXG4gIHZhciBDbGFzc2VzID0ge1xuICAgIEJBU0U6ICdzaHVmZmxlJyxcbiAgICBTSFVGRkxFX0lURU06ICdzaHVmZmxlLWl0ZW0nLFxuICAgIFZJU0lCTEU6ICdzaHVmZmxlLWl0ZW0tLXZpc2libGUnLFxuICAgIEhJRERFTjogJ3NodWZmbGUtaXRlbS0taGlkZGVuJ1xuICB9O1xuXG4gIHZhciBpZCA9IDA7XG5cbiAgdmFyIFNodWZmbGVJdGVtID1cbiAgLyojX19QVVJFX18qL1xuICBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2h1ZmZsZUl0ZW0oZWxlbWVudCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNodWZmbGVJdGVtKTtcblxuICAgICAgaWQgKz0gMTtcbiAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAvKipcbiAgICAgICAqIFVzZWQgdG8gc2VwYXJhdGUgaXRlbXMgZm9yIGxheW91dCBhbmQgc2hyaW5rLlxuICAgICAgICovXG5cbiAgICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgIC8qKlxuICAgICAgICogVXNlZCB0byBkZXRlcm1pbmUgaWYgYSB0cmFuc2l0aW9uIHdpbGwgaGFwcGVuLiBCeSB0aGUgdGltZSB0aGUgX2xheW91dFxuICAgICAgICogYW5kIF9zaHJpbmsgbWV0aG9kcyBnZXQgdGhlIFNodWZmbGVJdGVtIGluc3RhbmNlcywgdGhlIGBpc1Zpc2libGVgIHZhbHVlXG4gICAgICAgKiBoYXMgYWxyZWFkeSBiZWVuIGNoYW5nZWQgYnkgdGhlIHNlcGFyYXRpb24gbWV0aG9kcywgc28gdGhpcyBwcm9wZXJ0eSBpc1xuICAgICAgICogbmVlZGVkIHRvIGtub3cgaWYgdGhlIGl0ZW0gd2FzIHZpc2libGUvaGlkZGVuIGJlZm9yZSB0aGUgc2hyaW5rL2xheW91dC5cbiAgICAgICAqL1xuXG4gICAgICB0aGlzLmlzSGlkZGVuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFNodWZmbGVJdGVtLCBbe1xuICAgICAga2V5OiBcInNob3dcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzaG93KCkge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENsYXNzZXMuSElEREVOKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ2xhc3Nlcy5WSVNJQkxFKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiaGlkZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGhpZGUoKSB7XG4gICAgICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENsYXNzZXMuVklTSUJMRSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKENsYXNzZXMuSElEREVOKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiaW5pdFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIHRoaXMuYWRkQ2xhc3NlcyhbQ2xhc3Nlcy5TSFVGRkxFX0lURU0sIENsYXNzZXMuVklTSUJMRV0pO1xuICAgICAgICB0aGlzLmFwcGx5Q3NzKFNodWZmbGVJdGVtLkNzcy5JTklUSUFMKTtcbiAgICAgICAgdGhpcy5zY2FsZSA9IFNodWZmbGVJdGVtLlNjYWxlLlZJU0lCTEU7XG4gICAgICAgIHRoaXMucG9pbnQgPSBuZXcgUG9pbnQoKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiYWRkQ2xhc3Nlc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZENsYXNzZXMoY2xhc3Nlcykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGNsYXNzZXMuZm9yRWFjaChmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICAgICAgX3RoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJyZW1vdmVDbGFzc2VzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlQ2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgIGNsYXNzZXMuZm9yRWFjaChmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICAgICAgX3RoaXMyLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiYXBwbHlDc3NcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhcHBseUNzcyhvYmopIHtcbiAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICBfdGhpczMuZWxlbWVudC5zdHlsZVtrZXldID0gb2JqW2tleV07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJkaXNwb3NlXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGlzcG9zZSgpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDbGFzc2VzKFtDbGFzc2VzLkhJRERFTiwgQ2xhc3Nlcy5WSVNJQkxFLCBDbGFzc2VzLlNIVUZGTEVfSVRFTV0pO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBTaHVmZmxlSXRlbTtcbiAgfSgpO1xuXG4gIFNodWZmbGVJdGVtLkNzcyA9IHtcbiAgICBJTklUSUFMOiB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHRvcDogMCxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICB2aXNpYmlsaXR5OiAndmlzaWJsZScsXG4gICAgICB3aWxsQ2hhbmdlOiAndHJhbnNmb3JtJ1xuICAgIH0sXG4gICAgVklTSUJMRToge1xuICAgICAgYmVmb3JlOiB7XG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgIHZpc2liaWxpdHk6ICd2aXNpYmxlJ1xuICAgICAgfSxcbiAgICAgIGFmdGVyOiB7XG4gICAgICAgIHRyYW5zaXRpb25EZWxheTogJydcbiAgICAgIH1cbiAgICB9LFxuICAgIEhJRERFTjoge1xuICAgICAgYmVmb3JlOiB7XG4gICAgICAgIG9wYWNpdHk6IDBcbiAgICAgIH0sXG4gICAgICBhZnRlcjoge1xuICAgICAgICB2aXNpYmlsaXR5OiAnaGlkZGVuJyxcbiAgICAgICAgdHJhbnNpdGlvbkRlbGF5OiAnJ1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU2h1ZmZsZUl0ZW0uU2NhbGUgPSB7XG4gICAgVklTSUJMRTogMSxcbiAgICBISURERU46IDAuMDAxXG4gIH07XG5cbiAgdmFyIHZhbHVlID0gbnVsbDtcbiAgdmFyIHRlc3RDb21wdXRlZFNpemUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlLnN0eWxlLmNzc1RleHQgPSAnd2lkdGg6MTBweDtwYWRkaW5nOjJweDtib3gtc2l6aW5nOmJvcmRlci1ib3g7JztcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGUpO1xuICAgIHZhbHVlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZSwgbnVsbCkud2lkdGggPT09ICcxMHB4JztcbiAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBjb21wdXRlZCBzdHlsZSBmb3IgYW4gZWxlbWVudCwgcGFyc2VkIGFzIGEgZmxvYXQuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHRvIGdldCBzdHlsZSBmb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSBTdHlsZSBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHtDU1NTdHlsZURlY2xhcmF0aW9ufSBbc3R5bGVzXSBPcHRpb25hbGx5IGluY2x1ZGUgY2xlYW4gc3R5bGVzIHRvXG4gICAqICAgICB1c2UgaW5zdGVhZCBvZiBhc2tpbmcgZm9yIHRoZW0gYWdhaW4uXG4gICAqIEByZXR1cm4ge251bWJlcn0gVGhlIHBhcnNlZCBjb21wdXRlZCB2YWx1ZSBvciB6ZXJvIGlmIHRoYXQgZmFpbHMgYmVjYXVzZSBJRVxuICAgKiAgICAgd2lsbCByZXR1cm4gJ2F1dG8nIHdoZW4gdGhlIGVsZW1lbnQgZG9lc24ndCBoYXZlIG1hcmdpbnMgaW5zdGVhZCBvZlxuICAgKiAgICAgdGhlIGNvbXB1dGVkIHN0eWxlLlxuICAgKi9cblxuICBmdW5jdGlvbiBnZXROdW1iZXJTdHlsZShlbGVtZW50LCBzdHlsZSkge1xuICAgIHZhciBzdHlsZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpO1xuICAgIHZhciB2YWx1ZSA9IGdldE51bWJlcihzdHlsZXNbc3R5bGVdKTsgLy8gU3VwcG9ydCBJRTw9MTEgYW5kIFczQyBzcGVjLlxuXG4gICAgaWYgKCF0ZXN0Q29tcHV0ZWRTaXplKCkgJiYgc3R5bGUgPT09ICd3aWR0aCcpIHtcbiAgICAgIHZhbHVlICs9IGdldE51bWJlcihzdHlsZXMucGFkZGluZ0xlZnQpICsgZ2V0TnVtYmVyKHN0eWxlcy5wYWRkaW5nUmlnaHQpICsgZ2V0TnVtYmVyKHN0eWxlcy5ib3JkZXJMZWZ0V2lkdGgpICsgZ2V0TnVtYmVyKHN0eWxlcy5ib3JkZXJSaWdodFdpZHRoKTtcbiAgICB9IGVsc2UgaWYgKCF0ZXN0Q29tcHV0ZWRTaXplKCkgJiYgc3R5bGUgPT09ICdoZWlnaHQnKSB7XG4gICAgICB2YWx1ZSArPSBnZXROdW1iZXIoc3R5bGVzLnBhZGRpbmdUb3ApICsgZ2V0TnVtYmVyKHN0eWxlcy5wYWRkaW5nQm90dG9tKSArIGdldE51bWJlcihzdHlsZXMuYm9yZGVyVG9wV2lkdGgpICsgZ2V0TnVtYmVyKHN0eWxlcy5ib3JkZXJCb3R0b21XaWR0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpc2hlci1ZYXRlcyBzaHVmZmxlLlxuICAgKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85NjI4OTAvMzczNDIyXG4gICAqIGh0dHBzOi8vYm9zdC5vY2tzLm9yZy9taWtlL3NodWZmbGUvXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IEFycmF5IHRvIHNodWZmbGUuXG4gICAqIEByZXR1cm4ge0FycmF5fSBSYW5kb21seSBzb3J0ZWQgYXJyYXkuXG4gICAqL1xuICBmdW5jdGlvbiByYW5kb21pemUoYXJyYXkpIHtcbiAgICB2YXIgbiA9IGFycmF5Lmxlbmd0aDtcblxuICAgIHdoaWxlIChuKSB7XG4gICAgICBuIC09IDE7XG4gICAgICB2YXIgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChuICsgMSkpO1xuICAgICAgdmFyIHRlbXAgPSBhcnJheVtpXTtcbiAgICAgIGFycmF5W2ldID0gYXJyYXlbbl07XG4gICAgICBhcnJheVtuXSA9IHRlbXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgdmFyIGRlZmF1bHRzID0ge1xuICAgIC8vIFVzZSBhcnJheS5yZXZlcnNlKCkgdG8gcmV2ZXJzZSB0aGUgcmVzdWx0c1xuICAgIHJldmVyc2U6IGZhbHNlLFxuICAgIC8vIFNvcnRpbmcgZnVuY3Rpb25cbiAgICBieTogbnVsbCxcbiAgICAvLyBDdXN0b20gc29ydCBmdW5jdGlvblxuICAgIGNvbXBhcmU6IG51bGwsXG4gICAgLy8gSWYgdHJ1ZSwgdGhpcyB3aWxsIHNraXAgdGhlIHNvcnRpbmcgYW5kIHJldHVybiBhIHJhbmRvbWl6ZWQgb3JkZXIgaW4gdGhlIGFycmF5XG4gICAgcmFuZG9taXplOiBmYWxzZSxcbiAgICAvLyBEZXRlcm1pbmVzIHdoaWNoIHByb3BlcnR5IG9mIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXkgaXMgcGFzc2VkIHRvIHRoZVxuICAgIC8vIHNvcnRpbmcgbWV0aG9kLlxuICAgIGtleTogJ2VsZW1lbnQnXG4gIH07XG4gIC8qKlxuICAgKiBZb3UgY2FuIHJldHVybiBgdW5kZWZpbmVkYCBmcm9tIHRoZSBgYnlgIGZ1bmN0aW9uIHRvIHJldmVydCB0byBET00gb3JkZXIuXG4gICAqIEBwYXJhbSB7QXJyYXk8VD59IGFyciBBcnJheSB0byBzb3J0LlxuICAgKiBAcGFyYW0ge1NvcnRPcHRpb25zfSBvcHRpb25zIFNvcnRpbmcgb3B0aW9ucy5cbiAgICogQHJldHVybiB7QXJyYXk8VD59XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNvcnRlcihhcnIsIG9wdGlvbnMpIHtcbiAgICB2YXIgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICB2YXIgb3JpZ2luYWwgPSBBcnJheS5mcm9tKGFycik7XG4gICAgdmFyIHJldmVydCA9IGZhbHNlO1xuXG4gICAgaWYgKCFhcnIubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgaWYgKG9wdHMucmFuZG9taXplKSB7XG4gICAgICByZXR1cm4gcmFuZG9taXplKGFycik7XG4gICAgfSAvLyBTb3J0IHRoZSBlbGVtZW50cyBieSB0aGUgb3B0cy5ieSBmdW5jdGlvbi5cbiAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIG9wdHMuYnksIGRlZmF1bHQgdG8gRE9NIG9yZGVyXG5cblxuICAgIGlmICh0eXBlb2Ygb3B0cy5ieSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYXJyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgLy8gRXhpdCBlYXJseSBpZiB3ZSBhbHJlYWR5IGtub3cgd2Ugd2FudCB0byByZXZlcnRcbiAgICAgICAgaWYgKHJldmVydCkge1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZhbEEgPSBvcHRzLmJ5KGFbb3B0cy5rZXldKTtcbiAgICAgICAgdmFyIHZhbEIgPSBvcHRzLmJ5KGJbb3B0cy5rZXldKTsgLy8gSWYgYm90aCB2YWx1ZXMgYXJlIHVuZGVmaW5lZCwgdXNlIHRoZSBET00gb3JkZXJcblxuICAgICAgICBpZiAodmFsQSA9PT0gdW5kZWZpbmVkICYmIHZhbEIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldmVydCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsQSA8IHZhbEIgfHwgdmFsQSA9PT0gJ3NvcnRGaXJzdCcgfHwgdmFsQiA9PT0gJ3NvcnRMYXN0Jykge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWxBID4gdmFsQiB8fCB2YWxBID09PSAnc29ydExhc3QnIHx8IHZhbEIgPT09ICdzb3J0Rmlyc3QnKSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdHMuY29tcGFyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYXJyLnNvcnQob3B0cy5jb21wYXJlKTtcbiAgICB9IC8vIFJldmVydCB0byB0aGUgb3JpZ2luYWwgYXJyYXkgaWYgbmVjZXNzYXJ5XG5cblxuICAgIGlmIChyZXZlcnQpIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbDtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5yZXZlcnNlKSB7XG4gICAgICBhcnIucmV2ZXJzZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICB2YXIgdHJhbnNpdGlvbnMgPSB7fTtcbiAgdmFyIGV2ZW50TmFtZSA9ICd0cmFuc2l0aW9uZW5kJztcbiAgdmFyIGNvdW50ID0gMDtcblxuICBmdW5jdGlvbiB1bmlxdWVJZCgpIHtcbiAgICBjb3VudCArPSAxO1xuICAgIHJldHVybiBldmVudE5hbWUgKyBjb3VudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbFRyYW5zaXRpb25FbmQoaWQpIHtcbiAgICBpZiAodHJhbnNpdGlvbnNbaWRdKSB7XG4gICAgICB0cmFuc2l0aW9uc1tpZF0uZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdHJhbnNpdGlvbnNbaWRdLmxpc3RlbmVyKTtcbiAgICAgIHRyYW5zaXRpb25zW2lkXSA9IG51bGw7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gb25UcmFuc2l0aW9uRW5kKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGlkID0gdW5pcXVlSWQoKTtcblxuICAgIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uIGxpc3RlbmVyKGV2dCkge1xuICAgICAgaWYgKGV2dC5jdXJyZW50VGFyZ2V0ID09PSBldnQudGFyZ2V0KSB7XG4gICAgICAgIGNhbmNlbFRyYW5zaXRpb25FbmQoaWQpO1xuICAgICAgICBjYWxsYmFjayhldnQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lcik7XG4gICAgdHJhbnNpdGlvbnNbaWRdID0ge1xuICAgICAgZWxlbWVudDogZWxlbWVudCxcbiAgICAgIGxpc3RlbmVyOiBsaXN0ZW5lclxuICAgIH07XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlNYXgoYXJyYXkpIHtcbiAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCwgYXJyYXkpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHByZWZlci1zcHJlYWRcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5TWluKGFycmF5KSB7XG4gICAgcmV0dXJuIE1hdGgubWluLmFwcGx5KE1hdGgsIGFycmF5KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBwcmVmZXItc3ByZWFkXG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBudW1iZXIgb2YgY29sdW1ucyBhbiBpdGVtcyBzcGFucy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGl0ZW1XaWR0aCBXaWR0aCBvZiB0aGUgaXRlbS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvbHVtbldpZHRoIFdpZHRoIG9mIHRoZSBjb2x1bW4gKGluY2x1ZGVzIGd1dHRlcikuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb2x1bW5zIFRvdGFsIG51bWJlciBvZiBjb2x1bW5zXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aHJlc2hvbGQgQSBidWZmZXIgdmFsdWUgZm9yIHRoZSBzaXplIG9mIHRoZSBjb2x1bW4gdG8gZml0LlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGdldENvbHVtblNwYW4oaXRlbVdpZHRoLCBjb2x1bW5XaWR0aCwgY29sdW1ucywgdGhyZXNob2xkKSB7XG4gICAgdmFyIGNvbHVtblNwYW4gPSBpdGVtV2lkdGggLyBjb2x1bW5XaWR0aDsgLy8gSWYgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgcm91bmRlZCBjb2x1bW4gc3BhbiBudW1iZXIgYW5kIHRoZVxuICAgIC8vIGNhbGN1bGF0ZWQgY29sdW1uIHNwYW4gbnVtYmVyIGlzIHJlYWxseSBzbWFsbCwgcm91bmQgdGhlIG51bWJlciB0b1xuICAgIC8vIG1ha2UgaXQgZml0LlxuXG4gICAgaWYgKE1hdGguYWJzKE1hdGgucm91bmQoY29sdW1uU3BhbikgLSBjb2x1bW5TcGFuKSA8IHRocmVzaG9sZCkge1xuICAgICAgLy8gZS5nLiBjb2x1bW5TcGFuID0gNC4wMDg5OTQ1MzkwMjk4NzQ1XG4gICAgICBjb2x1bW5TcGFuID0gTWF0aC5yb3VuZChjb2x1bW5TcGFuKTtcbiAgICB9IC8vIEVuc3VyZSB0aGUgY29sdW1uIHNwYW4gaXMgbm90IG1vcmUgdGhhbiB0aGUgYW1vdW50IG9mIGNvbHVtbnMgaW4gdGhlIHdob2xlIGxheW91dC5cblxuXG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGguY2VpbChjb2x1bW5TcGFuKSwgY29sdW1ucyk7XG4gIH1cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgY29sdW1uIHNldCB0byB1c2UgZm9yIHBsYWNlbWVudC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvbHVtblNwYW4gVGhlIG51bWJlciBvZiBjb2x1bW5zIHRoaXMgY3VycmVudCBpdGVtIHNwYW5zLlxuICAgKiBAcGFyYW0ge251bWJlcn0gY29sdW1ucyBUaGUgdG90YWwgY29sdW1ucyBpbiB0aGUgZ3JpZC5cbiAgICogQHJldHVybiB7QXJyYXkuPG51bWJlcj59IEFuIGFycmF5IG9mIG51bWJlcnMgcmVwcmVzZXRpbmcgdGhlIGNvbHVtbiBzZXQuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGdldEF2YWlsYWJsZVBvc2l0aW9ucyhwb3NpdGlvbnMsIGNvbHVtblNwYW4sIGNvbHVtbnMpIHtcbiAgICAvLyBUaGUgaXRlbSBzcGFucyBvbmx5IG9uZSBjb2x1bW4uXG4gICAgaWYgKGNvbHVtblNwYW4gPT09IDEpIHtcbiAgICAgIHJldHVybiBwb3NpdGlvbnM7XG4gICAgfSAvLyBUaGUgaXRlbSBzcGFucyBtb3JlIHRoYW4gb25lIGNvbHVtbiwgZmlndXJlIG91dCBob3cgbWFueSBkaWZmZXJlbnRcbiAgICAvLyBwbGFjZXMgaXQgY291bGQgZml0IGhvcml6b250YWxseS5cbiAgICAvLyBUaGUgZ3JvdXAgY291bnQgaXMgdGhlIG51bWJlciBvZiBwbGFjZXMgd2l0aGluIHRoZSBwb3NpdGlvbnMgdGhpcyBibG9ja1xuICAgIC8vIGNvdWxkIGZpdCwgaWdub3JpbmcgdGhlIGN1cnJlbnQgcG9zaXRpb25zIG9mIGl0ZW1zLlxuICAgIC8vIEltYWdpbmUgYSAyIGNvbHVtbiBicmljayBhcyB0aGUgc2Vjb25kIGl0ZW0gaW4gYSA0IGNvbHVtbiBncmlkIHdpdGhcbiAgICAvLyAxMHB4IGhlaWdodCBlYWNoLiBGaW5kIHRoZSBwbGFjZXMgaXQgd291bGQgZml0OlxuICAgIC8vIFsyMCwgMTAsIDEwLCAwXVxuICAgIC8vICB8ICAgfCAgIHxcbiAgICAvLyAgKiAgICogICAqXG4gICAgLy9cbiAgICAvLyBUaGVuIHRha2UgdGhlIHBsYWNlcyB3aGljaCBmaXQgYW5kIGdldCB0aGUgYmlnZ2VyIG9mIHRoZSB0d286XG4gICAgLy8gbWF4KFsyMCwgMTBdKSwgbWF4KFsxMCwgMTBdKSwgbWF4KFsxMCwgMF0pID0gWzIwLCAxMCwgMTBdXG4gICAgLy9cbiAgICAvLyBOZXh0LCBmaW5kIHRoZSBmaXJzdCBzbWFsbGVzdCBudW1iZXIgKHRoZSBzaG9ydCBjb2x1bW4pLlxuICAgIC8vIFsyMCwgMTAsIDEwXVxuICAgIC8vICAgICAgfFxuICAgIC8vICAgICAgKlxuICAgIC8vXG4gICAgLy8gQW5kIHRoYXQncyB3aGVyZSBpdCBzaG91bGQgYmUgcGxhY2VkIVxuICAgIC8vXG4gICAgLy8gQW5vdGhlciBleGFtcGxlIHdoZXJlIHRoZSBzZWNvbmQgY29sdW1uJ3MgaXRlbSBleHRlbmRzIHBhc3QgdGhlIGZpcnN0OlxuICAgIC8vIFsxMCwgMjAsIDEwLCAwXSA9PiBbMjAsIDIwLCAxMF0gPT4gMTBcblxuXG4gICAgdmFyIGF2YWlsYWJsZSA9IFtdOyAvLyBGb3IgaG93IG1hbnkgcG9zc2libGUgcG9zaXRpb25zIGZvciB0aGlzIGl0ZW0gdGhlcmUgYXJlLlxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gY29sdW1ucyAtIGNvbHVtblNwYW47IGkrKykge1xuICAgICAgLy8gRmluZCB0aGUgYmlnZ2VyIHZhbHVlIGZvciBlYWNoIHBsYWNlIGl0IGNvdWxkIGZpdC5cbiAgICAgIGF2YWlsYWJsZS5wdXNoKGFycmF5TWF4KHBvc2l0aW9ucy5zbGljZShpLCBpICsgY29sdW1uU3BhbikpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXZhaWxhYmxlO1xuICB9XG4gIC8qKlxuICAgKiBGaW5kIGluZGV4IG9mIHNob3J0IGNvbHVtbiwgdGhlIGZpcnN0IGZyb20gdGhlIGxlZnQgd2hlcmUgdGhpcyBpdGVtIHdpbGwgZ28uXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IHBvc2l0aW9ucyBUaGUgYXJyYXkgdG8gc2VhcmNoIGZvciB0aGUgc21hbGxlc3QgbnVtYmVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYnVmZmVyIE9wdGlvbmFsIGJ1ZmZlciB3aGljaCBpcyB2ZXJ5IHVzZWZ1bCB3aGVuIHRoZSBoZWlnaHRcbiAgICogICAgIGlzIGEgcGVyY2VudGFnZSBvZiB0aGUgd2lkdGguXG4gICAqIEByZXR1cm4ge251bWJlcn0gSW5kZXggb2YgdGhlIHNob3J0IGNvbHVtbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gZ2V0U2hvcnRDb2x1bW4ocG9zaXRpb25zLCBidWZmZXIpIHtcbiAgICB2YXIgbWluUG9zaXRpb24gPSBhcnJheU1pbihwb3NpdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBvc2l0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHBvc2l0aW9uc1tpXSA+PSBtaW5Qb3NpdGlvbiAtIGJ1ZmZlciAmJiBwb3NpdGlvbnNbaV0gPD0gbWluUG9zaXRpb24gKyBidWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgLyoqXG4gICAqIERldGVybWluZSB0aGUgbG9jYXRpb24gb2YgdGhlIG5leHQgaXRlbSwgYmFzZWQgb24gaXRzIHNpemUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtU2l6ZSBPYmplY3Qgd2l0aCB3aWR0aCBhbmQgaGVpZ2h0LlxuICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbnMgUG9zaXRpb25zIG9mIHRoZSBvdGhlciBjdXJyZW50IGl0ZW1zLlxuICAgKiBAcGFyYW0ge251bWJlcn0gZ3JpZFNpemUgVGhlIGNvbHVtbiB3aWR0aCBvciByb3cgaGVpZ2h0LlxuICAgKiBAcGFyYW0ge251bWJlcn0gdG90YWwgVGhlIHRvdGFsIG51bWJlciBvZiBjb2x1bW5zIG9yIHJvd3MuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aHJlc2hvbGQgQnVmZmVyIHZhbHVlIGZvciB0aGUgY29sdW1uIHRvIGZpdC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJ1ZmZlciBWZXJ0aWNhbCBidWZmZXIgZm9yIHRoZSBoZWlnaHQgb2YgaXRlbXMuXG4gICAqIEByZXR1cm4ge1BvaW50fVxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRJdGVtUG9zaXRpb24oX3JlZikge1xuICAgIHZhciBpdGVtU2l6ZSA9IF9yZWYuaXRlbVNpemUsXG4gICAgICAgIHBvc2l0aW9ucyA9IF9yZWYucG9zaXRpb25zLFxuICAgICAgICBncmlkU2l6ZSA9IF9yZWYuZ3JpZFNpemUsXG4gICAgICAgIHRvdGFsID0gX3JlZi50b3RhbCxcbiAgICAgICAgdGhyZXNob2xkID0gX3JlZi50aHJlc2hvbGQsXG4gICAgICAgIGJ1ZmZlciA9IF9yZWYuYnVmZmVyO1xuICAgIHZhciBzcGFuID0gZ2V0Q29sdW1uU3BhbihpdGVtU2l6ZS53aWR0aCwgZ3JpZFNpemUsIHRvdGFsLCB0aHJlc2hvbGQpO1xuICAgIHZhciBzZXRZID0gZ2V0QXZhaWxhYmxlUG9zaXRpb25zKHBvc2l0aW9ucywgc3BhbiwgdG90YWwpO1xuICAgIHZhciBzaG9ydENvbHVtbkluZGV4ID0gZ2V0U2hvcnRDb2x1bW4oc2V0WSwgYnVmZmVyKTsgLy8gUG9zaXRpb24gdGhlIGl0ZW1cblxuICAgIHZhciBwb2ludCA9IG5ldyBQb2ludChncmlkU2l6ZSAqIHNob3J0Q29sdW1uSW5kZXgsIHNldFlbc2hvcnRDb2x1bW5JbmRleF0pOyAvLyBVcGRhdGUgdGhlIGNvbHVtbnMgYXJyYXkgd2l0aCB0aGUgbmV3IHZhbHVlcyBmb3IgZWFjaCBjb2x1bW4uXG4gICAgLy8gZS5nLiBiZWZvcmUgdGhlIHVwZGF0ZSB0aGUgY29sdW1ucyBjb3VsZCBiZSBbMjUwLCAwLCAwLCAwXSBmb3IgYW4gaXRlbVxuICAgIC8vIHdoaWNoIHNwYW5zIDIgY29sdW1ucy4gQWZ0ZXIgaXQgd291bGQgYmUgWzI1MCwgaXRlbUhlaWdodCwgaXRlbUhlaWdodCwgMF0uXG5cbiAgICB2YXIgc2V0SGVpZ2h0ID0gc2V0WVtzaG9ydENvbHVtbkluZGV4XSArIGl0ZW1TaXplLmhlaWdodDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BhbjsgaSsrKSB7XG4gICAgICBwb3NpdGlvbnNbc2hvcnRDb2x1bW5JbmRleCArIGldID0gc2V0SGVpZ2h0O1xuICAgIH1cblxuICAgIHJldHVybiBwb2ludDtcbiAgfVxuICAvKipcbiAgICogVGhpcyBtZXRob2QgYXR0ZW1wdHMgdG8gY2VudGVyIGl0ZW1zLiBUaGlzIG1ldGhvZCBjb3VsZCBwb3RlbnRpYWxseSBiZSBzbG93XG4gICAqIHdpdGggYSBsYXJnZSBudW1iZXIgb2YgaXRlbXMgYmVjYXVzZSBpdCBtdXN0IHBsYWNlIGl0ZW1zLCB0aGVuIGNoZWNrIGV2ZXJ5XG4gICAqIHByZXZpb3VzIGl0ZW0gdG8gZW5zdXJlIHRoZXJlIGlzIG5vIG92ZXJsYXAuXG4gICAqIEBwYXJhbSB7QXJyYXkuPFJlY3Q+fSBpdGVtUmVjdHMgSXRlbSBkYXRhIG9iamVjdHMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb250YWluZXJXaWR0aCBXaWR0aCBvZiB0aGUgY29udGFpbmluZyBlbGVtZW50LlxuICAgKiBAcmV0dXJuIHtBcnJheS48UG9pbnQ+fVxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRDZW50ZXJlZFBvc2l0aW9ucyhpdGVtUmVjdHMsIGNvbnRhaW5lcldpZHRoKSB7XG4gICAgdmFyIHJvd01hcCA9IHt9OyAvLyBQb3B1bGF0ZSByb3dzIGJ5IHRoZWlyIG9mZnNldCBiZWNhdXNlIGl0ZW1zIGNvdWxkIGp1bXAgYmV0d2VlbiByb3dzIGxpa2U6XG4gICAgLy8gYSAgIGNcbiAgICAvLyAgYmJiXG5cbiAgICBpdGVtUmVjdHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbVJlY3QpIHtcbiAgICAgIGlmIChyb3dNYXBbaXRlbVJlY3QudG9wXSkge1xuICAgICAgICAvLyBQdXNoIHRoZSBwb2ludCB0byB0aGUgbGFzdCByb3cgYXJyYXkuXG4gICAgICAgIHJvd01hcFtpdGVtUmVjdC50b3BdLnB1c2goaXRlbVJlY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU3RhcnQgb2YgYSBuZXcgcm93LlxuICAgICAgICByb3dNYXBbaXRlbVJlY3QudG9wXSA9IFtpdGVtUmVjdF07XG4gICAgICB9XG4gICAgfSk7IC8vIEZvciBlYWNoIHJvdywgZmluZCB0aGUgZW5kIG9mIHRoZSBsYXN0IGl0ZW0sIHRoZW4gY2FsY3VsYXRlXG4gICAgLy8gdGhlIHJlbWFpbmluZyBzcGFjZSBieSBkaXZpZGluZyBpdCBieSAyLiBUaGVuIGFkZCB0aGF0XG4gICAgLy8gb2Zmc2V0IHRvIHRoZSB4IHBvc2l0aW9uIG9mIGVhY2ggcG9pbnQuXG5cbiAgICB2YXIgcmVjdHMgPSBbXTtcbiAgICB2YXIgcm93cyA9IFtdO1xuICAgIHZhciBjZW50ZXJlZFJvd3MgPSBbXTtcbiAgICBPYmplY3Qua2V5cyhyb3dNYXApLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIGl0ZW1SZWN0cyA9IHJvd01hcFtrZXldO1xuICAgICAgcm93cy5wdXNoKGl0ZW1SZWN0cyk7XG4gICAgICB2YXIgbGFzdEl0ZW0gPSBpdGVtUmVjdHNbaXRlbVJlY3RzLmxlbmd0aCAtIDFdO1xuICAgICAgdmFyIGVuZCA9IGxhc3RJdGVtLmxlZnQgKyBsYXN0SXRlbS53aWR0aDtcbiAgICAgIHZhciBvZmZzZXQgPSBNYXRoLnJvdW5kKChjb250YWluZXJXaWR0aCAtIGVuZCkgLyAyKTtcbiAgICAgIHZhciBmaW5hbFJlY3RzID0gaXRlbVJlY3RzO1xuICAgICAgdmFyIGNhbk1vdmUgPSBmYWxzZTtcblxuICAgICAgaWYgKG9mZnNldCA+IDApIHtcbiAgICAgICAgdmFyIG5ld1JlY3RzID0gW107XG4gICAgICAgIGNhbk1vdmUgPSBpdGVtUmVjdHMuZXZlcnkoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgICB2YXIgbmV3UmVjdCA9IG5ldyBSZWN0KHIubGVmdCArIG9mZnNldCwgci50b3AsIHIud2lkdGgsIHIuaGVpZ2h0LCByLmlkKTsgLy8gQ2hlY2sgYWxsIGN1cnJlbnQgcmVjdHMgdG8gbWFrZSBzdXJlIG5vbmUgb3ZlcmxhcC5cblxuICAgICAgICAgIHZhciBub092ZXJsYXAgPSAhcmVjdHMuc29tZShmdW5jdGlvbiAocikge1xuICAgICAgICAgICAgcmV0dXJuIFJlY3QuaW50ZXJzZWN0cyhuZXdSZWN0LCByKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBuZXdSZWN0cy5wdXNoKG5ld1JlY3QpO1xuICAgICAgICAgIHJldHVybiBub092ZXJsYXA7XG4gICAgICAgIH0pOyAvLyBJZiBub25lIG9mIHRoZSByZWN0YW5nbGVzIG92ZXJsYXBwZWQsIHRoZSB3aG9sZSBncm91cCBjYW4gYmUgY2VudGVyZWQuXG5cbiAgICAgICAgaWYgKGNhbk1vdmUpIHtcbiAgICAgICAgICBmaW5hbFJlY3RzID0gbmV3UmVjdHM7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gSWYgdGhlIGl0ZW1zIGFyZSBub3QgZ29pbmcgdG8gYmUgb2Zmc2V0LCBlbnN1cmUgdGhhdCB0aGUgb3JpZ2luYWxcbiAgICAgIC8vIHBsYWNlbWVudCBmb3IgdGhpcyByb3cgd2lsbCBub3Qgb3ZlcmxhcCBwcmV2aW91cyByb3dzIChyb3ctc3Bhbm5pbmdcbiAgICAgIC8vIGVsZW1lbnRzIGNvdWxkIGJlIGluIHRoZSB3YXkpLlxuXG5cbiAgICAgIGlmICghY2FuTW92ZSkge1xuICAgICAgICB2YXIgaW50ZXJzZWN0aW5nUmVjdDtcbiAgICAgICAgdmFyIGhhc092ZXJsYXAgPSBpdGVtUmVjdHMuc29tZShmdW5jdGlvbiAoaXRlbVJlY3QpIHtcbiAgICAgICAgICByZXR1cm4gcmVjdHMuc29tZShmdW5jdGlvbiAocikge1xuICAgICAgICAgICAgdmFyIGludGVyc2VjdHMgPSBSZWN0LmludGVyc2VjdHMoaXRlbVJlY3QsIHIpO1xuXG4gICAgICAgICAgICBpZiAoaW50ZXJzZWN0cykge1xuICAgICAgICAgICAgICBpbnRlcnNlY3RpbmdSZWN0ID0gcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGludGVyc2VjdHM7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pOyAvLyBJZiB0aGVyZSBpcyBhbnkgb3ZlcmxhcCwgcmVwbGFjZSB0aGUgb3ZlcmxhcHBpbmcgcm93IHdpdGggdGhlIG9yaWdpbmFsLlxuXG4gICAgICAgIGlmIChoYXNPdmVybGFwKSB7XG4gICAgICAgICAgdmFyIHJvd0luZGV4ID0gY2VudGVyZWRSb3dzLmZpbmRJbmRleChmdW5jdGlvbiAoaXRlbXMpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtcy5pbmNsdWRlcyhpbnRlcnNlY3RpbmdSZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjZW50ZXJlZFJvd3Muc3BsaWNlKHJvd0luZGV4LCAxLCByb3dzW3Jvd0luZGV4XSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVjdHMgPSByZWN0cy5jb25jYXQoZmluYWxSZWN0cyk7XG4gICAgICBjZW50ZXJlZFJvd3MucHVzaChmaW5hbFJlY3RzKTtcbiAgICB9KTsgLy8gUmVkdWNlIGFycmF5IG9mIGFycmF5cyB0byBhIHNpbmdsZSBhcnJheSBvZiBwb2ludHMuXG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEwODY1MDQyLzM3MzQyMlxuICAgIC8vIFRoZW4gcmVzZXQgc29ydCBiYWNrIHRvIGhvdyB0aGUgaXRlbXMgd2VyZSBwYXNzZWQgdG8gdGhpcyBtZXRob2QuXG4gICAgLy8gUmVtb3ZlIHRoZSB3cmFwcGVyIG9iamVjdCB3aXRoIGluZGV4LCBtYXAgdG8gYSBQb2ludC5cblxuICAgIHJldHVybiBbXS5jb25jYXQuYXBwbHkoW10sIGNlbnRlcmVkUm93cykgLy8gZXNsaW50LWRpc2FibGUtbGluZSBwcmVmZXItc3ByZWFkXG4gICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLmlkIC0gYi5pZDtcbiAgICB9KS5tYXAoZnVuY3Rpb24gKGl0ZW1SZWN0KSB7XG4gICAgICByZXR1cm4gbmV3IFBvaW50KGl0ZW1SZWN0LmxlZnQsIGl0ZW1SZWN0LnRvcCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSHlwaGVuYXRlcyBhIGphdmFzY3JpcHQgc3R5bGUgc3RyaW5nIHRvIGEgY3NzIG9uZS4gRm9yIGV4YW1wbGU6XG4gICAqIE1vekJveFNpemluZyAtPiAtbW96LWJveC1zaXppbmcuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byBoeXBoZW5hdGUuXG4gICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGh5cGhlbmF0ZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gaHlwaGVuYXRlKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAoc3RyLCBtMSkge1xuICAgICAgcmV0dXJuIFwiLVwiLmNvbmNhdChtMS50b0xvd2VyQ2FzZSgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5VW5pcXVlKHgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KHgpKTtcbiAgfSAvLyBVc2VkIGZvciB1bmlxdWUgaW5zdGFuY2UgdmFyaWFibGVzXG5cblxuICB2YXIgaWQkMSA9IDA7XG5cbiAgdmFyIFNodWZmbGUgPVxuICAvKiNfX1BVUkVfXyovXG4gIGZ1bmN0aW9uIChfVGlueUVtaXR0ZXIpIHtcbiAgICBfaW5oZXJpdHMoU2h1ZmZsZSwgX1RpbnlFbWl0dGVyKTtcblxuICAgIC8qKlxuICAgICAqIENhdGVnb3JpemUsIHNvcnQsIGFuZCBmaWx0ZXIgYSByZXNwb25zaXZlIGdyaWQgb2YgaXRlbXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgQW4gZWxlbWVudCB3aGljaCBpcyB0aGUgcGFyZW50IGNvbnRhaW5lciBmb3IgdGhlIGdyaWQgaXRlbXMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPVNodWZmbGUub3B0aW9uc10gT3B0aW9ucyBvYmplY3QuXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gU2h1ZmZsZShlbGVtZW50KSB7XG4gICAgICB2YXIgX3RoaXM7XG5cbiAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNodWZmbGUpO1xuXG4gICAgICBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihTaHVmZmxlKS5jYWxsKHRoaXMpKTtcbiAgICAgIF90aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBTaHVmZmxlLm9wdGlvbnMsIG9wdGlvbnMpOyAvLyBBbGxvdyBtaXNzcGVsbGluZyBvZiBkZWxpbWl0ZXIgc2luY2UgdGhhdCdzIGhvdyBpdCB1c2VkIHRvIGJlLlxuICAgICAgLy8gUmVtb3ZlIGluIHY2LlxuXG4gICAgICBpZiAoX3RoaXMub3B0aW9ucy5kZWxpbWV0ZXIpIHtcbiAgICAgICAgX3RoaXMub3B0aW9ucy5kZWxpbWl0ZXIgPSBfdGhpcy5vcHRpb25zLmRlbGltZXRlcjtcbiAgICAgIH1cblxuICAgICAgX3RoaXMubGFzdFNvcnQgPSB7fTtcbiAgICAgIF90aGlzLmdyb3VwID0gU2h1ZmZsZS5BTExfSVRFTVM7XG4gICAgICBfdGhpcy5sYXN0RmlsdGVyID0gU2h1ZmZsZS5BTExfSVRFTVM7XG4gICAgICBfdGhpcy5pc0VuYWJsZWQgPSB0cnVlO1xuICAgICAgX3RoaXMuaXNEZXN0cm95ZWQgPSBmYWxzZTtcbiAgICAgIF90aGlzLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICAgIF90aGlzLl90cmFuc2l0aW9ucyA9IFtdO1xuICAgICAgX3RoaXMuaXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XG4gICAgICBfdGhpcy5fcXVldWUgPSBbXTtcblxuICAgICAgdmFyIGVsID0gX3RoaXMuX2dldEVsZW1lbnRPcHRpb24oZWxlbWVudCk7XG5cbiAgICAgIGlmICghZWwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignU2h1ZmZsZSBuZWVkcyB0byBiZSBpbml0aWFsaXplZCB3aXRoIGFuIGVsZW1lbnQuJyk7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmVsZW1lbnQgPSBlbDtcbiAgICAgIF90aGlzLmlkID0gJ3NodWZmbGVfJyArIGlkJDE7XG4gICAgICBpZCQxICs9IDE7XG5cbiAgICAgIF90aGlzLl9pbml0KCk7XG5cbiAgICAgIF90aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhTaHVmZmxlLCBbe1xuICAgICAga2V5OiBcIl9pbml0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2luaXQoKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLl9nZXRJdGVtcygpO1xuICAgICAgICB0aGlzLm9wdGlvbnMuc2l6ZXIgPSB0aGlzLl9nZXRFbGVtZW50T3B0aW9uKHRoaXMub3B0aW9ucy5zaXplcik7IC8vIEFkZCBjbGFzcyBhbmQgaW52YWxpZGF0ZSBzdHlsZXNcblxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChTaHVmZmxlLkNsYXNzZXMuQkFTRSk7IC8vIFNldCBpbml0aWFsIGNzcyBmb3IgZWFjaCBpdGVtXG5cbiAgICAgICAgdGhpcy5faW5pdEl0ZW1zKHRoaXMuaXRlbXMpOyAvLyBCaW5kIHJlc2l6ZSBldmVudHNcblxuXG4gICAgICAgIHRoaXMuX29uUmVzaXplID0gdGhpcy5fZ2V0UmVzaXplRnVuY3Rpb24oKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uUmVzaXplKTsgLy8gSWYgdGhlIHBhZ2UgaGFzIG5vdCBhbHJlYWR5IGVtaXR0ZWQgdGhlIGBsb2FkYCBldmVudCwgY2FsbCBsYXlvdXQgb24gbG9hZC5cbiAgICAgICAgLy8gVGhpcyBhdm9pZHMgbGF5b3V0IGlzc3VlcyBjYXVzZWQgYnkgaW1hZ2VzIGFuZCBmb250cyBsb2FkaW5nIGFmdGVyIHRoZVxuICAgICAgICAvLyBpbnN0YW5jZSBoYXMgYmVlbiBpbml0aWFsaXplZC5cblxuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgIHZhciBsYXlvdXQgPSB0aGlzLmxheW91dC5iaW5kKHRoaXMpO1xuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkxvYWQpO1xuICAgICAgICAgICAgbGF5b3V0KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gLy8gR2V0IGNvbnRhaW5lciBjc3MgYWxsIGluIG9uZSByZXF1ZXN0LiBDYXVzZXMgcmVmbG93XG5cblxuICAgICAgICB2YXIgY29udGFpbmVyQ3NzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50LCBudWxsKTtcbiAgICAgICAgdmFyIGNvbnRhaW5lcldpZHRoID0gU2h1ZmZsZS5nZXRTaXplKHRoaXMuZWxlbWVudCkud2lkdGg7IC8vIEFkZCBzdHlsZXMgdG8gdGhlIGNvbnRhaW5lciBpZiBpdCBkb2Vzbid0IGhhdmUgdGhlbS5cblxuICAgICAgICB0aGlzLl92YWxpZGF0ZVN0eWxlcyhjb250YWluZXJDc3MpOyAvLyBXZSBhbHJlYWR5IGdvdCB0aGUgY29udGFpbmVyJ3Mgd2lkdGggYWJvdmUsIG5vIG5lZWQgdG8gY2F1c2UgYW5vdGhlclxuICAgICAgICAvLyByZWZsb3cgZ2V0dGluZyBpdCBhZ2Fpbi4uLiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBjb2x1bW5zIHRoZXJlIHdpbGwgYmVcblxuXG4gICAgICAgIHRoaXMuX3NldENvbHVtbnMoY29udGFpbmVyV2lkdGgpOyAvLyBLaWNrIG9mZiFcblxuXG4gICAgICAgIHRoaXMuZmlsdGVyKHRoaXMub3B0aW9ucy5ncm91cCwgdGhpcy5vcHRpb25zLmluaXRpYWxTb3J0KTsgLy8gVGhlIHNodWZmbGUgaXRlbXMgaGF2ZW4ndCBoYWQgdHJhbnNpdGlvbnMgc2V0IG9uIHRoZW0geWV0IHNvIHRoZSB1c2VyXG4gICAgICAgIC8vIGRvZXNuJ3Qgc2VlIHRoZSBmaXJzdCBsYXlvdXQuIFNldCB0aGVtIG5vdyB0aGF0IHRoZSBmaXJzdCBsYXlvdXQgaXMgZG9uZS5cbiAgICAgICAgLy8gRmlyc3QsIGhvd2V2ZXIsIGEgc3luY2hyb25vdXMgbGF5b3V0IG11c3QgYmUgY2F1c2VkIGZvciB0aGUgcHJldmlvdXNcbiAgICAgICAgLy8gc3R5bGVzIHRvIGJlIGFwcGxpZWQgd2l0aG91dCB0cmFuc2l0aW9ucy5cblxuICAgICAgICB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGg7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG5cbiAgICAgICAgdGhpcy5zZXRJdGVtVHJhbnNpdGlvbnModGhpcy5pdGVtcyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gXCJoZWlnaHQgXCIuY29uY2F0KHRoaXMub3B0aW9ucy5zcGVlZCwgXCJtcyBcIikuY29uY2F0KHRoaXMub3B0aW9ucy5lYXNpbmcpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIGEgdGhyb3R0bGVkIGFuZCBwcm94aWVkIGZ1bmN0aW9uIGZvciB0aGUgcmVzaXplIGhhbmRsZXIuXG4gICAgICAgKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0UmVzaXplRnVuY3Rpb25cIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0UmVzaXplRnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZXNpemVGdW5jdGlvbiA9IHRoaXMuX2hhbmRsZVJlc2l6ZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMudGhyb3R0bGUgPyB0aGlzLm9wdGlvbnMudGhyb3R0bGUocmVzaXplRnVuY3Rpb24sIHRoaXMub3B0aW9ucy50aHJvdHRsZVRpbWUpIDogcmVzaXplRnVuY3Rpb247XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHJpZXZlIGFuIGVsZW1lbnQgZnJvbSBhbiBvcHRpb24uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xqUXVlcnl8RWxlbWVudH0gb3B0aW9uIFRoZSBvcHRpb24gdG8gY2hlY2suXG4gICAgICAgKiBAcmV0dXJuIHs/RWxlbWVudH0gVGhlIHBsYWluIGVsZW1lbnQgb3IgbnVsbC5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0RWxlbWVudE9wdGlvblwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRFbGVtZW50T3B0aW9uKG9wdGlvbikge1xuICAgICAgICAvLyBJZiBjb2x1bW4gd2lkdGggaXMgYSBzdHJpbmcsIHRyZWF0IGlzIGFzIGEgc2VsZWN0b3IgYW5kIHNlYXJjaCBmb3IgdGhlXG4gICAgICAgIC8vIHNpemVyIGVsZW1lbnQgd2l0aGluIHRoZSBvdXRlcm1vc3QgY29udGFpbmVyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb24pO1xuICAgICAgICB9IC8vIENoZWNrIGZvciBhbiBlbGVtZW50XG5cblxuICAgICAgICBpZiAob3B0aW9uICYmIG9wdGlvbi5ub2RlVHlwZSAmJiBvcHRpb24ubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9uO1xuICAgICAgICB9IC8vIENoZWNrIGZvciBqUXVlcnkgb2JqZWN0XG5cblxuICAgICAgICBpZiAob3B0aW9uICYmIG9wdGlvbi5qcXVlcnkpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9uWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEVuc3VyZXMgdGhlIHNodWZmbGUgY29udGFpbmVyIGhhcyB0aGUgY3NzIHN0eWxlcyBpdCBuZWVkcyBhcHBsaWVkIHRvIGl0LlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IHN0eWxlcyBLZXkgdmFsdWUgcGFpcnMgZm9yIHBvc2l0aW9uIGFuZCBvdmVyZmxvdy5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfdmFsaWRhdGVTdHlsZXNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfdmFsaWRhdGVTdHlsZXMoc3R5bGVzKSB7XG4gICAgICAgIC8vIFBvc2l0aW9uIGNhbm5vdCBiZSBzdGF0aWMuXG4gICAgICAgIGlmIChzdHlsZXMucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgfSAvLyBPdmVyZmxvdyBoYXMgdG8gYmUgaGlkZGVuLlxuXG5cbiAgICAgICAgaWYgKHN0eWxlcy5vdmVyZmxvdyAhPT0gJ2hpZGRlbicpIHtcbiAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBGaWx0ZXIgdGhlIGVsZW1lbnRzIGJ5IGEgY2F0ZWdvcnkuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXXxmdW5jdGlvbihFbGVtZW50KTpib29sZWFufSBbY2F0ZWdvcnldIENhdGVnb3J5IHRvXG4gICAgICAgKiAgICAgZmlsdGVyIGJ5LiBJZiBpdCdzIGdpdmVuLCB0aGUgbGFzdCBjYXRlZ29yeSB3aWxsIGJlIHVzZWQgdG8gZmlsdGVyIHRoZSBpdGVtcy5cbiAgICAgICAqIEBwYXJhbSB7QXJyYXl9IFtjb2xsZWN0aW9uXSBPcHRpb25hbGx5IGZpbHRlciBhIGNvbGxlY3Rpb24uIERlZmF1bHRzIHRvXG4gICAgICAgKiAgICAgYWxsIHRoZSBpdGVtcy5cbiAgICAgICAqIEByZXR1cm4ge3t2aXNpYmxlOiBTaHVmZmxlSXRlbVtdLCBoaWRkZW46IFNodWZmbGVJdGVtW119fVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9maWx0ZXJcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZmlsdGVyKCkge1xuICAgICAgICB2YXIgY2F0ZWdvcnkgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRoaXMubGFzdEZpbHRlcjtcbiAgICAgICAgdmFyIGNvbGxlY3Rpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMuaXRlbXM7XG5cbiAgICAgICAgdmFyIHNldCA9IHRoaXMuX2dldEZpbHRlcmVkU2V0cyhjYXRlZ29yeSwgY29sbGVjdGlvbik7IC8vIEluZGl2aWR1YWxseSBhZGQvcmVtb3ZlIGhpZGRlbi92aXNpYmxlIGNsYXNzZXNcblxuXG4gICAgICAgIHRoaXMuX3RvZ2dsZUZpbHRlckNsYXNzZXMoc2V0KTsgLy8gU2F2ZSB0aGUgbGFzdCBmaWx0ZXIgaW4gY2FzZSBlbGVtZW50cyBhcmUgYXBwZW5kZWQuXG5cblxuICAgICAgICB0aGlzLmxhc3RGaWx0ZXIgPSBjYXRlZ29yeTsgLy8gVGhpcyBpcyBzYXZlZCBtYWlubHkgYmVjYXVzZSBwcm92aWRpbmcgYSBmaWx0ZXIgZnVuY3Rpb24gKGxpa2Ugc2VhcmNoaW5nKVxuICAgICAgICAvLyB3aWxsIG92ZXJ3cml0ZSB0aGUgYGxhc3RGaWx0ZXJgIHByb3BlcnR5IGV2ZXJ5IHRpbWUgaXRzIGNhbGxlZC5cblxuICAgICAgICBpZiAodHlwZW9mIGNhdGVnb3J5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuZ3JvdXAgPSBjYXRlZ29yeTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZXQ7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHZpc2libGUgYW5kIGhpZGRlbiBlbGVtZW50cy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfGZ1bmN0aW9uKEVsZW1lbnQpOmJvb2xlYW59IGNhdGVnb3J5IENhdGVnb3J5IG9yIGZ1bmN0aW9uIHRvIGZpbHRlciBieS5cbiAgICAgICAqIEBwYXJhbSB7U2h1ZmZsZUl0ZW1bXX0gaXRlbXMgQSBjb2xsZWN0aW9uIG9mIGl0ZW1zIHRvIGZpbHRlci5cbiAgICAgICAqIEByZXR1cm4ge3t2aXNpYmxlOiBTaHVmZmxlSXRlbVtdLCBoaWRkZW46IFNodWZmbGVJdGVtW119fVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXRGaWx0ZXJlZFNldHNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0RmlsdGVyZWRTZXRzKGNhdGVnb3J5LCBpdGVtcykge1xuICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICB2YXIgdmlzaWJsZSA9IFtdO1xuICAgICAgICB2YXIgaGlkZGVuID0gW107IC8vIGNhdGVnb3J5ID09PSAnYWxsJywgYWRkIHZpc2libGUgY2xhc3MgdG8gZXZlcnl0aGluZ1xuXG4gICAgICAgIGlmIChjYXRlZ29yeSA9PT0gU2h1ZmZsZS5BTExfSVRFTVMpIHtcbiAgICAgICAgICB2aXNpYmxlID0gaXRlbXM7IC8vIExvb3AgdGhyb3VnaCBlYWNoIGl0ZW0gYW5kIHVzZSBwcm92aWRlZCBmdW5jdGlvbiB0byBkZXRlcm1pbmVcbiAgICAgICAgICAvLyB3aGV0aGVyIHRvIGhpZGUgaXQgb3Igbm90LlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChfdGhpczIuX2RvZXNQYXNzRmlsdGVyKGNhdGVnb3J5LCBpdGVtLmVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgIHZpc2libGUucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGhpZGRlbi5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2aXNpYmxlOiB2aXNpYmxlLFxuICAgICAgICAgIGhpZGRlbjogaGlkZGVuXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFRlc3QgYW4gaXRlbSB0byBzZWUgaWYgaXQgcGFzc2VzIGEgY2F0ZWdvcnkuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXXxmdW5jdGlvbigpOmJvb2xlYW59IGNhdGVnb3J5IENhdGVnb3J5IG9yIGZ1bmN0aW9uIHRvIGZpbHRlciBieS5cbiAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBBbiBlbGVtZW50IHRvIHRlc3QuXG4gICAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIGl0IHBhc3NlcyB0aGUgY2F0ZWdvcnkvZmlsdGVyLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9kb2VzUGFzc0ZpbHRlclwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9kb2VzUGFzc0ZpbHRlcihjYXRlZ29yeSwgZWxlbWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIGNhdGVnb3J5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGNhdGVnb3J5LmNhbGwoZWxlbWVudCwgZWxlbWVudCwgdGhpcyk7XG4gICAgICAgIH0gLy8gQ2hlY2sgZWFjaCBlbGVtZW50J3MgZGF0YS1ncm91cHMgYXR0cmlidXRlIGFnYWluc3QgdGhlIGdpdmVuIGNhdGVnb3J5LlxuXG5cbiAgICAgICAgdmFyIGF0dHIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS0nICsgU2h1ZmZsZS5GSUxURVJfQVRUUklCVVRFX0tFWSk7XG4gICAgICAgIHZhciBrZXlzID0gdGhpcy5vcHRpb25zLmRlbGltaXRlciA/IGF0dHIuc3BsaXQodGhpcy5vcHRpb25zLmRlbGltaXRlcikgOiBKU09OLnBhcnNlKGF0dHIpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHRlc3RDYXRlZ29yeShjYXRlZ29yeSkge1xuICAgICAgICAgIHJldHVybiBrZXlzLmluY2x1ZGVzKGNhdGVnb3J5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNhdGVnb3J5KSkge1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZmlsdGVyTW9kZSA9PT0gU2h1ZmZsZS5GaWx0ZXJNb2RlLkFOWSkge1xuICAgICAgICAgICAgcmV0dXJuIGNhdGVnb3J5LnNvbWUodGVzdENhdGVnb3J5KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gY2F0ZWdvcnkuZXZlcnkodGVzdENhdGVnb3J5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzLmluY2x1ZGVzKGNhdGVnb3J5KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogVG9nZ2xlcyB0aGUgdmlzaWJsZSBhbmQgaGlkZGVuIGNsYXNzIG5hbWVzLlxuICAgICAgICogQHBhcmFtIHt7dmlzaWJsZSwgaGlkZGVufX0gT2JqZWN0IHdpdGggdmlzaWJsZSBhbmQgaGlkZGVuIGFycmF5cy5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfdG9nZ2xlRmlsdGVyQ2xhc3Nlc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF90b2dnbGVGaWx0ZXJDbGFzc2VzKF9yZWYpIHtcbiAgICAgICAgdmFyIHZpc2libGUgPSBfcmVmLnZpc2libGUsXG4gICAgICAgICAgICBoaWRkZW4gPSBfcmVmLmhpZGRlbjtcbiAgICAgICAgdmlzaWJsZS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgaXRlbS5zaG93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBoaWRkZW4uZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIGl0ZW0uaGlkZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogU2V0IHRoZSBpbml0aWFsIGNzcyBmb3IgZWFjaCBpdGVtXG4gICAgICAgKiBAcGFyYW0ge1NodWZmbGVJdGVtW119IGl0ZW1zIFNldCB0byBpbml0aWFsaXplLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9pbml0SXRlbXNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaW5pdEl0ZW1zKGl0ZW1zKSB7XG4gICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICBpdGVtLmluaXQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZSBlbGVtZW50IHJlZmVyZW5jZSBhbmQgc3R5bGVzLlxuICAgICAgICogQHBhcmFtIHtTaHVmZmxlSXRlbVtdfSBpdGVtcyBTZXQgdG8gZGlzcG9zZS5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZGlzcG9zZUl0ZW1zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2Rpc3Bvc2VJdGVtcyhpdGVtcykge1xuICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgaXRlbS5kaXNwb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBVcGRhdGVzIHRoZSB2aXNpYmxlIGl0ZW0gY291bnQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3VwZGF0ZUl0ZW1Db3VudFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF91cGRhdGVJdGVtQ291bnQoKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZUl0ZW1zID0gdGhpcy5fZ2V0RmlsdGVyZWRJdGVtcygpLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogU2V0cyBjc3MgdHJhbnNmb3JtIHRyYW5zaXRpb24gb24gYSBncm91cCBvZiBlbGVtZW50cy4gVGhpcyBpcyBub3QgZXhlY3V0ZWRcbiAgICAgICAqIGF0IHRoZSBzYW1lIHRpbWUgYXMgYGl0ZW0uaW5pdGAgc28gdGhhdCB0cmFuc2l0aW9ucyBkb24ndCBvY2N1ciB1cG9uXG4gICAgICAgKiBpbml0aWFsaXphdGlvbiBvZiBhIG5ldyBTaHVmZmxlIGluc3RhbmNlLlxuICAgICAgICogQHBhcmFtIHtTaHVmZmxlSXRlbVtdfSBpdGVtcyBTaHVmZmxlIGl0ZW1zIHRvIHNldCB0cmFuc2l0aW9ucyBvbi5cbiAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcInNldEl0ZW1UcmFuc2l0aW9uc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldEl0ZW1UcmFuc2l0aW9ucyhpdGVtcykge1xuICAgICAgICB2YXIgX3RoaXMkb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgIHNwZWVkID0gX3RoaXMkb3B0aW9ucy5zcGVlZCxcbiAgICAgICAgICAgIGVhc2luZyA9IF90aGlzJG9wdGlvbnMuZWFzaW5nO1xuICAgICAgICB2YXIgcG9zaXRpb25Qcm9wcyA9IHRoaXMub3B0aW9ucy51c2VUcmFuc2Zvcm1zID8gWyd0cmFuc2Zvcm0nXSA6IFsndG9wJywgJ2xlZnQnXTsgLy8gQWxsb3cgdXNlcnMgdG8gdHJhbnN0aW9uIG90aGVyIHByb3BlcnRpZXMgaWYgdGhleSBleGlzdCBpbiB0aGUgYGJlZm9yZWBcbiAgICAgICAgLy8gY3NzIG1hcHBpbmcgb2YgdGhlIHNodWZmbGUgaXRlbS5cblxuICAgICAgICB2YXIgY3NzUHJvcHMgPSBPYmplY3Qua2V5cyhTaHVmZmxlSXRlbS5Dc3MuSElEREVOLmJlZm9yZSkubWFwKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgcmV0dXJuIGh5cGhlbmF0ZShrKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gcG9zaXRpb25Qcm9wcy5jb25jYXQoY3NzUHJvcHMpLmpvaW4oKTtcbiAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIGl0ZW0uZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBzcGVlZCArICdtcyc7XG4gICAgICAgICAgaXRlbS5lbGVtZW50LnN0eWxlLnRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbiA9IGVhc2luZztcbiAgICAgICAgICBpdGVtLmVsZW1lbnQuc3R5bGUudHJhbnNpdGlvblByb3BlcnR5ID0gcHJvcGVydGllcztcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXRJdGVtc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRJdGVtcygpIHtcbiAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5lbGVtZW50LmNoaWxkcmVuKS5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgcmV0dXJuIG1hdGNoZXNTZWxlY3RvcihlbCwgX3RoaXMzLm9wdGlvbnMuaXRlbVNlbGVjdG9yKTtcbiAgICAgICAgfSkubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIHJldHVybiBuZXcgU2h1ZmZsZUl0ZW0oZWwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogQ29tYmluZSB0aGUgY3VycmVudCBpdGVtcyBhcnJheSB3aXRoIGEgbmV3IG9uZSBhbmQgc29ydCBpdCBieSBET00gb3JkZXIuXG4gICAgICAgKiBAcGFyYW0ge1NodWZmbGVJdGVtW119IGl0ZW1zIEl0ZW1zIHRvIHRyYWNrLlxuICAgICAgICogQHJldHVybiB7U2h1ZmZsZUl0ZW1bXX1cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9tZXJnZU5ld0l0ZW1zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX21lcmdlTmV3SXRlbXMoaXRlbXMpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQuY2hpbGRyZW4pO1xuICAgICAgICByZXR1cm4gc29ydGVyKHRoaXMuaXRlbXMuY29uY2F0KGl0ZW1zKSwge1xuICAgICAgICAgIGJ5OiBmdW5jdGlvbiBieShlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGRyZW4uaW5kZXhPZihlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0RmlsdGVyZWRJdGVtc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRGaWx0ZXJlZEl0ZW1zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5pc1Zpc2libGU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0Q29uY2VhbGVkSXRlbXNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0Q29uY2VhbGVkSXRlbXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiAhaXRlbS5pc1Zpc2libGU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRoZSBjb2x1bW4gc2l6ZSwgYmFzZWQgb24gY29sdW1uIHdpZHRoIGFuZCBzaXplciBvcHRpb25zLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbnRhaW5lcldpZHRoIFNpemUgb2YgdGhlIHBhcmVudCBjb250YWluZXIuXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3V0dGVyU2l6ZSBTaXplIG9mIHRoZSBndXR0ZXJzLlxuICAgICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXRDb2x1bW5TaXplXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldENvbHVtblNpemUoY29udGFpbmVyV2lkdGgsIGd1dHRlclNpemUpIHtcbiAgICAgICAgdmFyIHNpemU7IC8vIElmIHRoZSBjb2x1bW5XaWR0aCBwcm9wZXJ0eSBpcyBhIGZ1bmN0aW9uLCB0aGVuIHRoZSBncmlkIGlzIGZsdWlkXG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuY29sdW1uV2lkdGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBzaXplID0gdGhpcy5vcHRpb25zLmNvbHVtbldpZHRoKGNvbnRhaW5lcldpZHRoKTsgLy8gY29sdW1uV2lkdGggb3B0aW9uIGlzbid0IGEgZnVuY3Rpb24sIGFyZSB0aGV5IHVzaW5nIGEgc2l6aW5nIGVsZW1lbnQ/XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNpemVyKSB7XG4gICAgICAgICAgc2l6ZSA9IFNodWZmbGUuZ2V0U2l6ZSh0aGlzLm9wdGlvbnMuc2l6ZXIpLndpZHRoOyAvLyBpZiBub3QsIGhvdyBhYm91dCB0aGUgZXhwbGljaXRseSBzZXQgb3B0aW9uP1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5jb2x1bW5XaWR0aCkge1xuICAgICAgICAgIHNpemUgPSB0aGlzLm9wdGlvbnMuY29sdW1uV2lkdGg7IC8vIG9yIHVzZSB0aGUgc2l6ZSBvZiB0aGUgZmlyc3QgaXRlbVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNpemUgPSBTaHVmZmxlLmdldFNpemUodGhpcy5pdGVtc1swXS5lbGVtZW50LCB0cnVlKS53aWR0aDsgLy8gaWYgdGhlcmUncyBubyBpdGVtcywgdXNlIHNpemUgb2YgY29udGFpbmVyXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2l6ZSA9IGNvbnRhaW5lcldpZHRoO1xuICAgICAgICB9IC8vIERvbid0IGxldCB0aGVtIHNldCBhIGNvbHVtbiB3aWR0aCBvZiB6ZXJvLlxuXG5cbiAgICAgICAgaWYgKHNpemUgPT09IDApIHtcbiAgICAgICAgICBzaXplID0gY29udGFpbmVyV2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2l6ZSArIGd1dHRlclNpemU7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdGhlIGd1dHRlciBzaXplLCBiYXNlZCBvbiBndXR0ZXIgd2lkdGggYW5kIHNpemVyIG9wdGlvbnMuXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gY29udGFpbmVyV2lkdGggU2l6ZSBvZiB0aGUgcGFyZW50IGNvbnRhaW5lci5cbiAgICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0R3V0dGVyU2l6ZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRHdXR0ZXJTaXplKGNvbnRhaW5lcldpZHRoKSB7XG4gICAgICAgIHZhciBzaXplO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmd1dHRlcldpZHRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgc2l6ZSA9IHRoaXMub3B0aW9ucy5ndXR0ZXJXaWR0aChjb250YWluZXJXaWR0aCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNpemVyKSB7XG4gICAgICAgICAgc2l6ZSA9IGdldE51bWJlclN0eWxlKHRoaXMub3B0aW9ucy5zaXplciwgJ21hcmdpbkxlZnQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzaXplID0gdGhpcy5vcHRpb25zLmd1dHRlcldpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIGNvbHVtbnMgdG8gYmUgdXNlZC4gR2V0cyBjc3MgaWYgdXNpbmcgc2l6ZXIgZWxlbWVudC5cbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbY29udGFpbmVyV2lkdGhdIE9wdGlvbmFsbHkgc3BlY2lmeSBhIGNvbnRhaW5lciB3aWR0aCBpZlxuICAgICAgICogICAgaXQncyBhbHJlYWR5IGF2YWlsYWJsZS5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9zZXRDb2x1bW5zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3NldENvbHVtbnMoKSB7XG4gICAgICAgIHZhciBjb250YWluZXJXaWR0aCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogU2h1ZmZsZS5nZXRTaXplKHRoaXMuZWxlbWVudCkud2lkdGg7XG5cbiAgICAgICAgdmFyIGd1dHRlciA9IHRoaXMuX2dldEd1dHRlclNpemUoY29udGFpbmVyV2lkdGgpO1xuXG4gICAgICAgIHZhciBjb2x1bW5XaWR0aCA9IHRoaXMuX2dldENvbHVtblNpemUoY29udGFpbmVyV2lkdGgsIGd1dHRlcik7XG5cbiAgICAgICAgdmFyIGNhbGN1bGF0ZWRDb2x1bW5zID0gKGNvbnRhaW5lcldpZHRoICsgZ3V0dGVyKSAvIGNvbHVtbldpZHRoOyAvLyBXaWR0aHMgZ2l2ZW4gZnJvbSBnZXRTdHlsZXMgYXJlIG5vdCBwcmVjaXNlIGVub3VnaC4uLlxuXG4gICAgICAgIGlmIChNYXRoLmFicyhNYXRoLnJvdW5kKGNhbGN1bGF0ZWRDb2x1bW5zKSAtIGNhbGN1bGF0ZWRDb2x1bW5zKSA8IHRoaXMub3B0aW9ucy5jb2x1bW5UaHJlc2hvbGQpIHtcbiAgICAgICAgICAvLyBlLmcuIGNhbGN1bGF0ZWRDb2x1bW5zID0gMTEuOTk4ODc2XG4gICAgICAgICAgY2FsY3VsYXRlZENvbHVtbnMgPSBNYXRoLnJvdW5kKGNhbGN1bGF0ZWRDb2x1bW5zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29scyA9IE1hdGgubWF4KE1hdGguZmxvb3IoY2FsY3VsYXRlZENvbHVtbnMgfHwgMCksIDEpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyV2lkdGg7XG4gICAgICAgIHRoaXMuY29sV2lkdGggPSBjb2x1bW5XaWR0aDtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogQWRqdXN0IHRoZSBoZWlnaHQgb2YgdGhlIGdyaWRcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9zZXRDb250YWluZXJTaXplXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3NldENvbnRhaW5lclNpemUoKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLl9nZXRDb250YWluZXJTaXplKCkgKyAncHgnO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBCYXNlZCBvbiB0aGUgY29sdW1uIGhlaWdodHMsIGl0IHJldHVybnMgdGhlIGJpZ2dlc3Qgb25lLlxuICAgICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXRDb250YWluZXJTaXplXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldENvbnRhaW5lclNpemUoKSB7XG4gICAgICAgIHJldHVybiBhcnJheU1heCh0aGlzLnBvc2l0aW9ucyk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEdldCB0aGUgY2xhbXBlZCBzdGFnZ2VyIGFtb3VudC5cbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBJbmRleCBvZiB0aGUgaXRlbSB0byBiZSBzdGFnZ2VyZWQuXG4gICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0U3RhZ2dlckFtb3VudFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRTdGFnZ2VyQW1vdW50KGluZGV4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbihpbmRleCAqIHRoaXMub3B0aW9ucy5zdGFnZ2VyQW1vdW50LCB0aGlzLm9wdGlvbnMuc3RhZ2dlckFtb3VudE1heCk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEVtaXQgYW4gZXZlbnQgZnJvbSB0aGlzIGluc3RhbmNlLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgRXZlbnQgbmFtZS5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbZGF0YT17fV0gT3B0aW9uYWwgb2JqZWN0IGRhdGEuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZGlzcGF0Y2hcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZGlzcGF0Y2gobmFtZSkge1xuICAgICAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICAgICAgaWYgKHRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhLnNodWZmbGUgPSB0aGlzO1xuICAgICAgICB0aGlzLmVtaXQobmFtZSwgZGF0YSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFplcm9zIG91dCB0aGUgeSBjb2x1bW5zIGFycmF5LCB3aGljaCBpcyB1c2VkIHRvIGRldGVybWluZSBpdGVtIHBsYWNlbWVudC5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfcmVzZXRDb2xzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3Jlc2V0Q29scygpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmNvbHM7XG4gICAgICAgIHRoaXMucG9zaXRpb25zID0gW107XG5cbiAgICAgICAgd2hpbGUgKGkpIHtcbiAgICAgICAgICBpIC09IDE7XG4gICAgICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaCgwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBMb29wcyB0aHJvdWdoIGVhY2ggaXRlbSB0aGF0IHNob3VsZCBiZSBzaG93biBhbmQgY2FsY3VsYXRlcyB0aGUgeCwgeSBwb3NpdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7U2h1ZmZsZUl0ZW1bXX0gaXRlbXMgQXJyYXkgb2YgaXRlbXMgdGhhdCB3aWxsIGJlIHNob3duL2xheWVkXG4gICAgICAgKiAgICAgb3V0IGluIG9yZGVyIGluIHRoZWlyIGFycmF5LlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2xheW91dFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9sYXlvdXQoaXRlbXMpIHtcbiAgICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGl0ZW1Qb3NpdGlvbnMgPSB0aGlzLl9nZXROZXh0UG9zaXRpb25zKGl0ZW1zKTtcblxuICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpKSB7XG4gICAgICAgICAgZnVuY3Rpb24gY2FsbGJhY2soKSB7XG4gICAgICAgICAgICBpdGVtLmFwcGx5Q3NzKFNodWZmbGVJdGVtLkNzcy5WSVNJQkxFLmFmdGVyKTtcbiAgICAgICAgICB9IC8vIElmIHRoZSBpdGVtIHdpbGwgbm90IGNoYW5nZSBpdHMgcG9zaXRpb24sIGRvIG5vdCBhZGQgaXQgdG8gdGhlIHJlbmRlclxuICAgICAgICAgIC8vIHF1ZXVlLiBUcmFuc2l0aW9ucyBkb24ndCBmaXJlIHdoZW4gc2V0dGluZyBhIHByb3BlcnR5IHRvIHRoZSBzYW1lIHZhbHVlLlxuXG5cbiAgICAgICAgICBpZiAoUG9pbnQuZXF1YWxzKGl0ZW0ucG9pbnQsIGl0ZW1Qb3NpdGlvbnNbaV0pICYmICFpdGVtLmlzSGlkZGVuKSB7XG4gICAgICAgICAgICBpdGVtLmFwcGx5Q3NzKFNodWZmbGVJdGVtLkNzcy5WSVNJQkxFLmJlZm9yZSk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGl0ZW0ucG9pbnQgPSBpdGVtUG9zaXRpb25zW2ldO1xuICAgICAgICAgIGl0ZW0uc2NhbGUgPSBTaHVmZmxlSXRlbS5TY2FsZS5WSVNJQkxFO1xuICAgICAgICAgIGl0ZW0uaXNIaWRkZW4gPSBmYWxzZTsgLy8gQ2xvbmUgdGhlIG9iamVjdCBzbyB0aGF0IHRoZSBgYmVmb3JlYCBvYmplY3QgaXNuJ3QgbW9kaWZpZWQgd2hlbiB0aGVcbiAgICAgICAgICAvLyB0cmFuc2l0aW9uIGRlbGF5IGlzIGFkZGVkLlxuXG4gICAgICAgICAgdmFyIHN0eWxlcyA9IF90aGlzNC5nZXRTdHlsZXNGb3JUcmFuc2l0aW9uKGl0ZW0sIFNodWZmbGVJdGVtLkNzcy5WSVNJQkxFLmJlZm9yZSk7XG5cbiAgICAgICAgICBzdHlsZXMudHJhbnNpdGlvbkRlbGF5ID0gX3RoaXM0Ll9nZXRTdGFnZ2VyQW1vdW50KGNvdW50KSArICdtcyc7XG5cbiAgICAgICAgICBfdGhpczQuX3F1ZXVlLnB1c2goe1xuICAgICAgICAgICAgaXRlbTogaXRlbSxcbiAgICAgICAgICAgIHN0eWxlczogc3R5bGVzLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJuIGFuIGFycmF5IG9mIFBvaW50IGluc3RhbmNlcyByZXByZXNlbnRpbmcgdGhlIGZ1dHVyZSBwb3NpdGlvbnMgb2ZcbiAgICAgICAqIGVhY2ggaXRlbS5cbiAgICAgICAqIEBwYXJhbSB7U2h1ZmZsZUl0ZW1bXX0gaXRlbXMgQXJyYXkgb2Ygc29ydGVkIHNodWZmbGUgaXRlbXMuXG4gICAgICAgKiBAcmV0dXJuIHtQb2ludFtdfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXROZXh0UG9zaXRpb25zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldE5leHRQb3NpdGlvbnMoaXRlbXMpIHtcbiAgICAgICAgdmFyIF90aGlzNSA9IHRoaXM7XG5cbiAgICAgICAgLy8gSWYgcG9zaXRpb24gZGF0YSBpcyBnb2luZyB0byBiZSBjaGFuZ2VkLCBhZGQgdGhlIGl0ZW0ncyBzaXplIHRvIHRoZVxuICAgICAgICAvLyB0cmFuc2Zvcm1lciB0byBhbGxvdyBmb3IgY2FsY3VsYXRpb25zLlxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlzQ2VudGVyZWQpIHtcbiAgICAgICAgICB2YXIgaXRlbXNEYXRhID0gaXRlbXMubWFwKGZ1bmN0aW9uIChpdGVtLCBpKSB7XG4gICAgICAgICAgICB2YXIgaXRlbVNpemUgPSBTaHVmZmxlLmdldFNpemUoaXRlbS5lbGVtZW50LCB0cnVlKTtcblxuICAgICAgICAgICAgdmFyIHBvaW50ID0gX3RoaXM1Ll9nZXRJdGVtUG9zaXRpb24oaXRlbVNpemUpO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlY3QocG9pbnQueCwgcG9pbnQueSwgaXRlbVNpemUud2lkdGgsIGl0ZW1TaXplLmhlaWdodCwgaSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VHJhbnNmb3JtZWRQb3NpdGlvbnMoaXRlbXNEYXRhLCB0aGlzLmNvbnRhaW5lcldpZHRoKTtcbiAgICAgICAgfSAvLyBJZiBubyB0cmFuc2Zvcm1zIGFyZSBnb2luZyB0byBoYXBwZW4sIHNpbXBseSByZXR1cm4gYW4gYXJyYXkgb2YgdGhlXG4gICAgICAgIC8vIGZ1dHVyZSBwb2ludHMgb2YgZWFjaCBpdGVtLlxuXG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiBfdGhpczUuX2dldEl0ZW1Qb3NpdGlvbihTaHVmZmxlLmdldFNpemUoaXRlbS5lbGVtZW50LCB0cnVlKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBEZXRlcm1pbmUgdGhlIGxvY2F0aW9uIG9mIHRoZSBuZXh0IGl0ZW0sIGJhc2VkIG9uIGl0cyBzaXplLlxuICAgICAgICogQHBhcmFtIHt7d2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXJ9fSBpdGVtU2l6ZSBPYmplY3Qgd2l0aCB3aWR0aCBhbmQgaGVpZ2h0LlxuICAgICAgICogQHJldHVybiB7UG9pbnR9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldEl0ZW1Qb3NpdGlvblwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRJdGVtUG9zaXRpb24oaXRlbVNpemUpIHtcbiAgICAgICAgcmV0dXJuIGdldEl0ZW1Qb3NpdGlvbih7XG4gICAgICAgICAgaXRlbVNpemU6IGl0ZW1TaXplLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5wb3NpdGlvbnMsXG4gICAgICAgICAgZ3JpZFNpemU6IHRoaXMuY29sV2lkdGgsXG4gICAgICAgICAgdG90YWw6IHRoaXMuY29scyxcbiAgICAgICAgICB0aHJlc2hvbGQ6IHRoaXMub3B0aW9ucy5jb2x1bW5UaHJlc2hvbGQsXG4gICAgICAgICAgYnVmZmVyOiB0aGlzLm9wdGlvbnMuYnVmZmVyXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBNdXRhdGUgcG9zaXRpb25zIGJlZm9yZSB0aGV5J3JlIGFwcGxpZWQuXG4gICAgICAgKiBAcGFyYW0ge1JlY3RbXX0gaXRlbVJlY3RzIEl0ZW0gZGF0YSBvYmplY3RzLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbnRhaW5lcldpZHRoIFdpZHRoIG9mIHRoZSBjb250YWluaW5nIGVsZW1lbnQuXG4gICAgICAgKiBAcmV0dXJuIHtQb2ludFtdfVxuICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZ2V0VHJhbnNmb3JtZWRQb3NpdGlvbnNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRUcmFuc2Zvcm1lZFBvc2l0aW9ucyhpdGVtUmVjdHMsIGNvbnRhaW5lcldpZHRoKSB7XG4gICAgICAgIHJldHVybiBnZXRDZW50ZXJlZFBvc2l0aW9ucyhpdGVtUmVjdHMsIGNvbnRhaW5lcldpZHRoKTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogSGlkZXMgdGhlIGVsZW1lbnRzIHRoYXQgZG9uJ3QgbWF0Y2ggb3VyIGZpbHRlci5cbiAgICAgICAqIEBwYXJhbSB7U2h1ZmZsZUl0ZW1bXX0gY29sbGVjdGlvbiBDb2xsZWN0aW9uIHRvIHNocmluay5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfc2hyaW5rXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3NocmluaygpIHtcbiAgICAgICAgdmFyIF90aGlzNiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGNvbGxlY3Rpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRoaXMuX2dldENvbmNlYWxlZEl0ZW1zKCk7XG4gICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgIGNvbGxlY3Rpb24uZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIGZ1bmN0aW9uIGNhbGxiYWNrKCkge1xuICAgICAgICAgICAgaXRlbS5hcHBseUNzcyhTaHVmZmxlSXRlbS5Dc3MuSElEREVOLmFmdGVyKTtcbiAgICAgICAgICB9IC8vIENvbnRpbnVpbmcgd291bGQgYWRkIGEgdHJhbnNpdGlvbmVuZCBldmVudCBsaXN0ZW5lciB0byB0aGUgZWxlbWVudCwgYnV0XG4gICAgICAgICAgLy8gdGhhdCBsaXN0ZW5lciB3b3VsZCBub3QgZXhlY3V0ZSBiZWNhdXNlIHRoZSB0cmFuc2Zvcm0gYW5kIG9wYWNpdHkgd291bGRcbiAgICAgICAgICAvLyBzdGF5IHRoZSBzYW1lLlxuICAgICAgICAgIC8vIFRoZSBjYWxsYmFjayBpcyBleGVjdXRlZCBoZXJlIGJlY2F1c2UgaXQgaXMgbm90IGd1YXJhbnRlZWQgdG8gYmUgY2FsbGVkXG4gICAgICAgICAgLy8gYWZ0ZXIgdGhlIHRyYW5zaXRpb25lbmQgZXZlbnQgYmVjYXVzZSB0aGUgdHJhbnNpdGlvbmVuZCBjb3VsZCBiZVxuICAgICAgICAgIC8vIGNhbmNlbGVkIGlmIGFub3RoZXIgYW5pbWF0aW9uIHN0YXJ0cy5cblxuXG4gICAgICAgICAgaWYgKGl0ZW0uaXNIaWRkZW4pIHtcbiAgICAgICAgICAgIGl0ZW0uYXBwbHlDc3MoU2h1ZmZsZUl0ZW0uQ3NzLkhJRERFTi5iZWZvcmUpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpdGVtLnNjYWxlID0gU2h1ZmZsZUl0ZW0uU2NhbGUuSElEREVOO1xuICAgICAgICAgIGl0ZW0uaXNIaWRkZW4gPSB0cnVlO1xuXG4gICAgICAgICAgdmFyIHN0eWxlcyA9IF90aGlzNi5nZXRTdHlsZXNGb3JUcmFuc2l0aW9uKGl0ZW0sIFNodWZmbGVJdGVtLkNzcy5ISURERU4uYmVmb3JlKTtcblxuICAgICAgICAgIHN0eWxlcy50cmFuc2l0aW9uRGVsYXkgPSBfdGhpczYuX2dldFN0YWdnZXJBbW91bnQoY291bnQpICsgJ21zJztcblxuICAgICAgICAgIF90aGlzNi5fcXVldWUucHVzaCh7XG4gICAgICAgICAgICBpdGVtOiBpdGVtLFxuICAgICAgICAgICAgc3R5bGVzOiBzdHlsZXMsXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXNpemUgaGFuZGxlci5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfaGFuZGxlUmVzaXplXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2hhbmRsZVJlc2l6ZSgpIHtcbiAgICAgICAgLy8gSWYgc2h1ZmZsZSBpcyBkaXNhYmxlZCwgZGVzdHJveWVkLCBkb24ndCBkbyBhbnl0aGluZ1xuICAgICAgICBpZiAoIXRoaXMuaXNFbmFibGVkIHx8IHRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHN0eWxlcyB3aGljaCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGFuIGl0ZW0gZm9yIGEgdHJhbnNpdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7U2h1ZmZsZUl0ZW19IGl0ZW0gSXRlbSB0byBnZXQgc3R5bGVzIGZvci4gU2hvdWxkIGhhdmUgdXBkYXRlZFxuICAgICAgICogICBzY2FsZSBhbmQgcG9pbnQgcHJvcGVydGllcy5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZU9iamVjdCBFeHRyYSBzdHlsZXMgdGhhdCB3aWxsIGJlIHVzZWQgaW4gdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiBAcmV0dXJuIHshT2JqZWN0fSBUcmFuc2Zvcm1zIGZvciB0cmFuc2l0aW9ucywgbGVmdC90b3AgZm9yIGFuaW1hdGUuXG4gICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJnZXRTdHlsZXNGb3JUcmFuc2l0aW9uXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U3R5bGVzRm9yVHJhbnNpdGlvbihpdGVtLCBzdHlsZU9iamVjdCkge1xuICAgICAgICAvLyBDbG9uZSB0aGUgb2JqZWN0IHRvIGF2b2lkIG11dGF0aW5nIHRoZSBvcmlnaW5hbC5cbiAgICAgICAgdmFyIHN0eWxlcyA9IE9iamVjdC5hc3NpZ24oe30sIHN0eWxlT2JqZWN0KTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnVzZVRyYW5zZm9ybXMpIHtcbiAgICAgICAgICB2YXIgeCA9IHRoaXMub3B0aW9ucy5yb3VuZFRyYW5zZm9ybXMgPyBNYXRoLnJvdW5kKGl0ZW0ucG9pbnQueCkgOiBpdGVtLnBvaW50Lng7XG4gICAgICAgICAgdmFyIHkgPSB0aGlzLm9wdGlvbnMucm91bmRUcmFuc2Zvcm1zID8gTWF0aC5yb3VuZChpdGVtLnBvaW50LnkpIDogaXRlbS5wb2ludC55O1xuICAgICAgICAgIHN0eWxlcy50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIi5jb25jYXQoeCwgXCJweCwgXCIpLmNvbmNhdCh5LCBcInB4KSBzY2FsZShcIikuY29uY2F0KGl0ZW0uc2NhbGUsIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHlsZXMubGVmdCA9IGl0ZW0ucG9pbnQueCArICdweCc7XG4gICAgICAgICAgc3R5bGVzLnRvcCA9IGl0ZW0ucG9pbnQueSArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3R5bGVzO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBMaXN0ZW4gZm9yIHRoZSB0cmFuc2l0aW9uIGVuZCBvbiBhbiBlbGVtZW50IGFuZCBleGVjdXRlIHRoZSBpdGVtQ2FsbGJhY2tcbiAgICAgICAqIHdoZW4gaXQgZmluaXNoZXMuXG4gICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB0byBsaXN0ZW4gb24uXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVtQ2FsbGJhY2sgQ2FsbGJhY2sgZm9yIHRoZSBpdGVtLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZG9uZSBDYWxsYmFjayB0byBub3RpZnkgYHBhcmFsbGVsYCB0aGF0IHRoaXMgb25lIGlzIGRvbmUuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfd2hlblRyYW5zaXRpb25Eb25lXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3doZW5UcmFuc2l0aW9uRG9uZShlbGVtZW50LCBpdGVtQ2FsbGJhY2ssIGRvbmUpIHtcbiAgICAgICAgdmFyIGlkID0gb25UcmFuc2l0aW9uRW5kKGVsZW1lbnQsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICBpdGVtQ2FsbGJhY2soKTtcbiAgICAgICAgICBkb25lKG51bGwsIGV2dCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25zLnB1c2goaWQpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm4gYSBmdW5jdGlvbiB3aGljaCB3aWxsIHNldCBDU1Mgc3R5bGVzIGFuZCBjYWxsIHRoZSBgZG9uZWAgZnVuY3Rpb25cbiAgICAgICAqIHdoZW4gKGlmKSB0aGUgdHJhbnNpdGlvbiBmaW5pc2hlcy5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIFRyYW5zaXRpb24gb2JqZWN0LlxuICAgICAgICogQHJldHVybiB7ZnVuY3Rpb259IEEgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdpdGggYSBgZG9uZWAgZnVuY3Rpb24uXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0VHJhbnNpdGlvbkZ1bmN0aW9uXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFRyYW5zaXRpb25GdW5jdGlvbihvcHRzKSB7XG4gICAgICAgIHZhciBfdGhpczcgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgIG9wdHMuaXRlbS5hcHBseUNzcyhvcHRzLnN0eWxlcyk7XG5cbiAgICAgICAgICBfdGhpczcuX3doZW5UcmFuc2l0aW9uRG9uZShvcHRzLml0ZW0uZWxlbWVudCwgb3B0cy5jYWxsYmFjaywgZG9uZSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEV4ZWN1dGUgdGhlIHN0eWxlcyBnYXRoZXJlZCBpbiB0aGUgc3R5bGUgcXVldWUuIFRoaXMgYXBwbGllcyBzdHlsZXMgdG8gZWxlbWVudHMsXG4gICAgICAgKiB0cmlnZ2VyaW5nIHRyYW5zaXRpb25zLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9wcm9jZXNzUXVldWVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfcHJvY2Vzc1F1ZXVlKCkge1xuICAgICAgICBpZiAodGhpcy5pc1RyYW5zaXRpb25pbmcpIHtcbiAgICAgICAgICB0aGlzLl9jYW5jZWxNb3ZlbWVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhhc1NwZWVkID0gdGhpcy5vcHRpb25zLnNwZWVkID4gMDtcbiAgICAgICAgdmFyIGhhc1F1ZXVlID0gdGhpcy5fcXVldWUubGVuZ3RoID4gMDtcblxuICAgICAgICBpZiAoaGFzUXVldWUgJiYgaGFzU3BlZWQgJiYgdGhpcy5pc0luaXRpYWxpemVkKSB7XG4gICAgICAgICAgdGhpcy5fc3RhcnRUcmFuc2l0aW9ucyh0aGlzLl9xdWV1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaGFzUXVldWUpIHtcbiAgICAgICAgICB0aGlzLl9zdHlsZUltbWVkaWF0ZWx5KHRoaXMuX3F1ZXVlKTtcblxuICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoKFNodWZmbGUuRXZlbnRUeXBlLkxBWU9VVCk7IC8vIEEgY2FsbCB0byBsYXlvdXQgaGFwcGVuZWQsIGJ1dCBub25lIG9mIHRoZSBuZXdseSB2aXNpYmxlIGl0ZW1zIHdpbGxcbiAgICAgICAgICAvLyBjaGFuZ2UgcG9zaXRpb24gb3IgdGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaXMgemVybywgd2hpY2ggd2lsbCBub3QgdHJpZ2dlclxuICAgICAgICAgIC8vIHRoZSB0cmFuc2l0aW9uZW5kIGV2ZW50LlxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZGlzcGF0Y2goU2h1ZmZsZS5FdmVudFR5cGUuTEFZT1VUKTtcbiAgICAgICAgfSAvLyBSZW1vdmUgZXZlcnl0aGluZyBpbiB0aGUgc3R5bGUgcXVldWVcblxuXG4gICAgICAgIHRoaXMuX3F1ZXVlLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFdhaXQgZm9yIGVhY2ggdHJhbnNpdGlvbiB0byBmaW5pc2gsIHRoZSBlbWl0IHRoZSBsYXlvdXQgZXZlbnQuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdFtdfSB0cmFuc2l0aW9ucyBBcnJheSBvZiB0cmFuc2l0aW9uIG9iamVjdHMuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfc3RhcnRUcmFuc2l0aW9uc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zdGFydFRyYW5zaXRpb25zKHRyYW5zaXRpb25zKSB7XG4gICAgICAgIHZhciBfdGhpczggPSB0aGlzO1xuXG4gICAgICAgIC8vIFNldCBmbGFnIHRoYXQgc2h1ZmZsZSBpcyBjdXJyZW50bHkgaW4gbW90aW9uLlxuICAgICAgICB0aGlzLmlzVHJhbnNpdGlvbmluZyA9IHRydWU7IC8vIENyZWF0ZSBhbiBhcnJheSBvZiBmdW5jdGlvbnMgdG8gYmUgY2FsbGVkLlxuXG4gICAgICAgIHZhciBjYWxsYmFja3MgPSB0cmFuc2l0aW9ucy5tYXAoZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgIHJldHVybiBfdGhpczguX2dldFRyYW5zaXRpb25GdW5jdGlvbihvYmopO1xuICAgICAgICB9KTtcbiAgICAgICAgYXJyYXlQYXJhbGxlbChjYWxsYmFja3MsIHRoaXMuX21vdmVtZW50RmluaXNoZWQuYmluZCh0aGlzKSk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcIl9jYW5jZWxNb3ZlbWVudFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9jYW5jZWxNb3ZlbWVudCgpIHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSB0cmFuc2l0aW9uIGVuZCBldmVudCBmb3IgZWFjaCBsaXN0ZW5lci5cbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbnMuZm9yRWFjaChjYW5jZWxUcmFuc2l0aW9uRW5kKTsgLy8gUmVzZXQgdGhlIGFycmF5LlxuXG5cbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbnMubGVuZ3RoID0gMDsgLy8gU2hvdyBpdCdzIG5vIGxvbmdlciBhY3RpdmUuXG5cbiAgICAgICAgdGhpcy5pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogQXBwbHkgc3R5bGVzIHdpdGhvdXQgYSB0cmFuc2l0aW9uLlxuICAgICAgICogQHBhcmFtIHtPYmplY3RbXX0gb2JqZWN0cyBBcnJheSBvZiB0cmFuc2l0aW9uIG9iamVjdHMuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3N0eWxlSW1tZWRpYXRlbHlcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfc3R5bGVJbW1lZGlhdGVseShvYmplY3RzKSB7XG4gICAgICAgIGlmIChvYmplY3RzLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBlbGVtZW50cyA9IG9iamVjdHMubWFwKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBvYmouaXRlbS5lbGVtZW50O1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgU2h1ZmZsZS5fc2tpcFRyYW5zaXRpb25zKGVsZW1lbnRzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBvYmplY3RzLmZvckVhY2goZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICBvYmouaXRlbS5hcHBseUNzcyhvYmouc3R5bGVzKTtcbiAgICAgICAgICAgICAgb2JqLmNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfbW92ZW1lbnRGaW5pc2hlZFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9tb3ZlbWVudEZpbmlzaGVkKCkge1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9ucy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLmlzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoKFNodWZmbGUuRXZlbnRUeXBlLkxBWU9VVCk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBtYWdpYy4gVGhpcyBpcyB3aGF0IG1ha2VzIHRoZSBwbHVnaW4gJ3NodWZmbGUnXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXXxmdW5jdGlvbihFbGVtZW50KTpib29sZWFufSBbY2F0ZWdvcnldIENhdGVnb3J5IHRvIGZpbHRlciBieS5cbiAgICAgICAqICAgICBDYW4gYmUgYSBmdW5jdGlvbiwgc3RyaW5nLCBvciBhcnJheSBvZiBzdHJpbmdzLlxuICAgICAgICogQHBhcmFtIHtTb3J0T3B0aW9uc30gW3NvcnRPcHRpb25zXSBBIHNvcnQgb2JqZWN0IHdoaWNoIGNhbiBzb3J0IHRoZSB2aXNpYmxlIHNldFxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZmlsdGVyXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZmlsdGVyKGNhdGVnb3J5LCBzb3J0T3B0aW9ucykge1xuICAgICAgICBpZiAoIXRoaXMuaXNFbmFibGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjYXRlZ29yeSB8fCBjYXRlZ29yeSAmJiBjYXRlZ29yeS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBjYXRlZ29yeSA9IFNodWZmbGUuQUxMX0lURU1TOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9maWx0ZXIoY2F0ZWdvcnkpOyAvLyBTaHJpbmsgZWFjaCBoaWRkZW4gaXRlbVxuXG5cbiAgICAgICAgdGhpcy5fc2hyaW5rKCk7IC8vIEhvdyBtYW55IHZpc2libGUgZWxlbWVudHM/XG5cblxuICAgICAgICB0aGlzLl91cGRhdGVJdGVtQ291bnQoKTsgLy8gVXBkYXRlIHRyYW5zZm9ybXMgb24gdmlzaWJsZSBlbGVtZW50cyBzbyB0aGV5IHdpbGwgYW5pbWF0ZSB0byB0aGVpciBuZXcgcG9zaXRpb25zLlxuXG5cbiAgICAgICAgdGhpcy5zb3J0KHNvcnRPcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogR2V0cyB0aGUgdmlzaWJsZSBlbGVtZW50cywgc29ydHMgdGhlbSwgYW5kIHBhc3NlcyB0aGVtIHRvIGxheW91dC5cbiAgICAgICAqIEBwYXJhbSB7U29ydE9wdGlvbnN9IFtzb3J0T3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0IHRvIHBhc3MgdG8gYHNvcnRlcmAuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJzb3J0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc29ydCgpIHtcbiAgICAgICAgdmFyIHNvcnRPcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0aGlzLmxhc3RTb3J0O1xuXG4gICAgICAgIGlmICghdGhpcy5pc0VuYWJsZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yZXNldENvbHMoKTtcblxuICAgICAgICB2YXIgaXRlbXMgPSBzb3J0ZXIodGhpcy5fZ2V0RmlsdGVyZWRJdGVtcygpLCBzb3J0T3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5fbGF5b3V0KGl0ZW1zKTsgLy8gYF9sYXlvdXRgIGFsd2F5cyBoYXBwZW5zIGFmdGVyIGBfc2hyaW5rYCwgc28gaXQncyBzYWZlIHRvIHByb2Nlc3MgdGhlIHN0eWxlXG4gICAgICAgIC8vIHF1ZXVlIGhlcmUgd2l0aCBzdHlsZXMgZnJvbSB0aGUgc2hyaW5rIG1ldGhvZC5cblxuXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NRdWV1ZSgpOyAvLyBBZGp1c3QgdGhlIGhlaWdodCBvZiB0aGUgY29udGFpbmVyLlxuXG5cbiAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyU2l6ZSgpO1xuXG4gICAgICAgIHRoaXMubGFzdFNvcnQgPSBzb3J0T3B0aW9ucztcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmVwb3NpdGlvbiBldmVyeXRoaW5nLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbaXNPbmx5TGF5b3V0PWZhbHNlXSBJZiB0cnVlLCBjb2x1bW4gYW5kIGd1dHRlciB3aWR0aHMgd29uJ3QgYmUgcmVjYWxjdWxhdGVkLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwidXBkYXRlXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICB2YXIgaXNPbmx5TGF5b3V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQpIHtcbiAgICAgICAgICBpZiAoIWlzT25seUxheW91dCkge1xuICAgICAgICAgICAgLy8gR2V0IHVwZGF0ZWQgY29sQ291bnRcbiAgICAgICAgICAgIHRoaXMuX3NldENvbHVtbnMoKTtcbiAgICAgICAgICB9IC8vIExheW91dCBpdGVtc1xuXG5cbiAgICAgICAgICB0aGlzLnNvcnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBVc2UgdGhpcyBpbnN0ZWFkIG9mIGB1cGRhdGUoKWAgaWYgeW91IGRvbid0IG5lZWQgdGhlIGNvbHVtbnMgYW5kIGd1dHRlcnMgdXBkYXRlZFxuICAgICAgICogTWF5YmUgYW4gaW1hZ2UgaW5zaWRlIGBzaHVmZmxlYCBsb2FkZWQgKGFuZCBub3cgaGFzIGEgaGVpZ2h0KSwgd2hpY2ggbWVhbnMgY2FsY3VsYXRpb25zXG4gICAgICAgKiBjb3VsZCBiZSBvZmYuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJsYXlvdXRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBsYXlvdXQoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKHRydWUpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBOZXcgaXRlbXMgaGF2ZSBiZWVuIGFwcGVuZGVkIHRvIHNodWZmbGUuIE1peCB0aGVtIGluIHdpdGggdGhlIGN1cnJlbnRcbiAgICAgICAqIGZpbHRlciBvciBzb3J0IHN0YXR1cy5cbiAgICAgICAqIEBwYXJhbSB7RWxlbWVudFtdfSBuZXdJdGVtcyBDb2xsZWN0aW9uIG9mIG5ldyBpdGVtcy5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImFkZFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChuZXdJdGVtcykge1xuICAgICAgICB2YXIgX3RoaXM5ID0gdGhpcztcblxuICAgICAgICB2YXIgaXRlbXMgPSBhcnJheVVuaXF1ZShuZXdJdGVtcykubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIHJldHVybiBuZXcgU2h1ZmZsZUl0ZW0oZWwpO1xuICAgICAgICB9KTsgLy8gQWRkIGNsYXNzZXMgYW5kIHNldCBpbml0aWFsIHBvc2l0aW9ucy5cblxuICAgICAgICB0aGlzLl9pbml0SXRlbXMoaXRlbXMpOyAvLyBEZXRlcm1pbmUgd2hpY2ggaXRlbXMgd2lsbCBnbyB3aXRoIHRoZSBjdXJyZW50IGZpbHRlci5cblxuXG4gICAgICAgIHRoaXMuX3Jlc2V0Q29scygpO1xuXG4gICAgICAgIHZhciBhbGxJdGVtcyA9IHRoaXMuX21lcmdlTmV3SXRlbXMoaXRlbXMpO1xuXG4gICAgICAgIHZhciBzb3J0ZWRJdGVtcyA9IHNvcnRlcihhbGxJdGVtcywgdGhpcy5sYXN0U29ydCk7XG5cbiAgICAgICAgdmFyIGFsbFNvcnRlZEl0ZW1zU2V0ID0gdGhpcy5fZmlsdGVyKHRoaXMubGFzdEZpbHRlciwgc29ydGVkSXRlbXMpO1xuXG4gICAgICAgIHZhciBpc05ld0l0ZW0gPSBmdW5jdGlvbiBpc05ld0l0ZW0oaXRlbSkge1xuICAgICAgICAgIHJldHVybiBpdGVtcy5pbmNsdWRlcyhpdGVtKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgYXBwbHlIaWRkZW5TdGF0ZSA9IGZ1bmN0aW9uIGFwcGx5SGlkZGVuU3RhdGUoaXRlbSkge1xuICAgICAgICAgIGl0ZW0uc2NhbGUgPSBTaHVmZmxlSXRlbS5TY2FsZS5ISURERU47XG4gICAgICAgICAgaXRlbS5pc0hpZGRlbiA9IHRydWU7XG4gICAgICAgICAgaXRlbS5hcHBseUNzcyhTaHVmZmxlSXRlbS5Dc3MuSElEREVOLmJlZm9yZSk7XG4gICAgICAgICAgaXRlbS5hcHBseUNzcyhTaHVmZmxlSXRlbS5Dc3MuSElEREVOLmFmdGVyKTtcbiAgICAgICAgfTsgLy8gTGF5b3V0IGFsbCBpdGVtcyBhZ2FpbiBzbyB0aGF0IG5ldyBpdGVtcyBnZXQgcG9zaXRpb25zLlxuICAgICAgICAvLyBTeW5jaG9ub3VzbHkgYXBwbHkgcG9zaXRpb25zLlxuXG5cbiAgICAgICAgdmFyIGl0ZW1Qb3NpdGlvbnMgPSB0aGlzLl9nZXROZXh0UG9zaXRpb25zKGFsbFNvcnRlZEl0ZW1zU2V0LnZpc2libGUpO1xuXG4gICAgICAgIGFsbFNvcnRlZEl0ZW1zU2V0LnZpc2libGUuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgIGlmIChpc05ld0l0ZW0oaXRlbSkpIHtcbiAgICAgICAgICAgIGl0ZW0ucG9pbnQgPSBpdGVtUG9zaXRpb25zW2ldO1xuICAgICAgICAgICAgYXBwbHlIaWRkZW5TdGF0ZShpdGVtKTtcbiAgICAgICAgICAgIGl0ZW0uYXBwbHlDc3MoX3RoaXM5LmdldFN0eWxlc0ZvclRyYW5zaXRpb24oaXRlbSwge30pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhbGxTb3J0ZWRJdGVtc1NldC5oaWRkZW4uZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIGlmIChpc05ld0l0ZW0oaXRlbSkpIHtcbiAgICAgICAgICAgIGFwcGx5SGlkZGVuU3RhdGUoaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTsgLy8gQ2F1c2UgbGF5b3V0IHNvIHRoYXQgdGhlIHN0eWxlcyBhYm92ZSBhcmUgYXBwbGllZC5cblxuICAgICAgICB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGg7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG4gICAgICAgIC8vIEFkZCB0cmFuc2l0aW9uIHRvIGVhY2ggaXRlbS5cblxuICAgICAgICB0aGlzLnNldEl0ZW1UcmFuc2l0aW9ucyhpdGVtcyk7IC8vIFVwZGF0ZSB0aGUgbGlzdCBvZiBpdGVtcy5cblxuICAgICAgICB0aGlzLml0ZW1zID0gdGhpcy5fbWVyZ2VOZXdJdGVtcyhpdGVtcyk7IC8vIFVwZGF0ZSBsYXlvdXQvdmlzaWJpbGl0eSBvZiBuZXcgYW5kIG9sZCBpdGVtcy5cblxuICAgICAgICB0aGlzLmZpbHRlcih0aGlzLmxhc3RGaWx0ZXIpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBEaXNhYmxlcyBzaHVmZmxlIGZyb20gdXBkYXRpbmcgZGltZW5zaW9ucyBhbmQgbGF5b3V0IG9uIHJlc2l6ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZGlzYWJsZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gICAgICAgIHRoaXMuaXNFbmFibGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEVuYWJsZXMgc2h1ZmZsZSBhZ2FpblxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbaXNVcGRhdGVMYXlvdXQ9dHJ1ZV0gaWYgdW5kZWZpbmVkLCBzaHVmZmxlIHdpbGwgdXBkYXRlIGNvbHVtbnMgYW5kIGd1dHRlcnNcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImVuYWJsZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGVuYWJsZSgpIHtcbiAgICAgICAgdmFyIGlzVXBkYXRlTGF5b3V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuICAgICAgICB0aGlzLmlzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGlzVXBkYXRlTGF5b3V0KSB7XG4gICAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmUgMSBvciBtb3JlIHNodWZmbGUgaXRlbXMuXG4gICAgICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxlbWVudHMgQW4gYXJyYXkgY29udGFpbmluZyBvbmUgb3IgbW9yZVxuICAgICAgICogICAgIGVsZW1lbnRzIGluIHNodWZmbGVcbiAgICAgICAqIEByZXR1cm4ge1NodWZmbGV9IFRoZSBzaHVmZmxlIGluc3RhbmNlLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwicmVtb3ZlXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKGVsZW1lbnRzKSB7XG4gICAgICAgIHZhciBfdGhpczEwID0gdGhpcztcblxuICAgICAgICBpZiAoIWVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjb2xsZWN0aW9uID0gYXJyYXlVbmlxdWUoZWxlbWVudHMpO1xuICAgICAgICB2YXIgb2xkSXRlbXMgPSBjb2xsZWN0aW9uLm1hcChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgIHJldHVybiBfdGhpczEwLmdldEl0ZW1CeUVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiAhIWl0ZW07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBoYW5kbGVMYXlvdXQgPSBmdW5jdGlvbiBoYW5kbGVMYXlvdXQoKSB7XG4gICAgICAgICAgX3RoaXMxMC5fZGlzcG9zZUl0ZW1zKG9sZEl0ZW1zKTsgLy8gUmVtb3ZlIHRoZSBjb2xsZWN0aW9uIGluIHRoZSBjYWxsYmFja1xuXG5cbiAgICAgICAgICBjb2xsZWN0aW9uLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIF90aGlzMTAuX2Rpc3BhdGNoKFNodWZmbGUuRXZlbnRUeXBlLlJFTU9WRUQsIHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IGNvbGxlY3Rpb25cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTsgLy8gSGlkZSBjb2xsZWN0aW9uIGZpcnN0LlxuXG5cbiAgICAgICAgdGhpcy5fdG9nZ2xlRmlsdGVyQ2xhc3Nlcyh7XG4gICAgICAgICAgdmlzaWJsZTogW10sXG4gICAgICAgICAgaGlkZGVuOiBvbGRJdGVtc1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9zaHJpbmsob2xkSXRlbXMpO1xuXG4gICAgICAgIHRoaXMuc29ydCgpOyAvLyBVcGRhdGUgdGhlIGxpc3Qgb2YgaXRlbXMgaGVyZSBiZWNhdXNlIGByZW1vdmVgIGNvdWxkIGJlIGNhbGxlZCBhZ2FpblxuICAgICAgICAvLyB3aXRoIGFuIGl0ZW0gdGhhdCBpcyBpbiB0aGUgcHJvY2VzcyBvZiBiZWluZyByZW1vdmVkLlxuXG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiAhb2xkSXRlbXMuaW5jbHVkZXMoaXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZUl0ZW1Db3VudCgpO1xuXG4gICAgICAgIHRoaXMub25jZShTaHVmZmxlLkV2ZW50VHlwZS5MQVlPVVQsIGhhbmRsZUxheW91dCk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHJpZXZlIGEgc2h1ZmZsZSBpdGVtIGJ5IGl0cyBlbGVtZW50LlxuICAgICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgdG8gbG9vayBmb3IuXG4gICAgICAgKiBAcmV0dXJuIHs/U2h1ZmZsZUl0ZW19IEEgc2h1ZmZsZSBpdGVtIG9yIHVuZGVmaW5lZCBpZiBpdCdzIG5vdCBmb3VuZC5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImdldEl0ZW1CeUVsZW1lbnRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRJdGVtQnlFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXMuZmluZChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLmVsZW1lbnQgPT09IGVsZW1lbnQ7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBEdW1wIHRoZSBlbGVtZW50cyBjdXJyZW50bHkgc3RvcmVkIGFuZCByZWluaXRpYWxpemUgYWxsIGNoaWxkIGVsZW1lbnRzIHdoaWNoXG4gICAgICAgKiBtYXRjaCB0aGUgYGl0ZW1TZWxlY3RvcmAuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJyZXNldEl0ZW1zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXRJdGVtcygpIHtcbiAgICAgICAgdmFyIF90aGlzMTEgPSB0aGlzO1xuXG4gICAgICAgIC8vIFJlbW92ZSByZWZzIHRvIGN1cnJlbnQgaXRlbXMuXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2VJdGVtcyh0aGlzLml0ZW1zKTtcblxuICAgICAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZTsgLy8gRmluZCBuZXcgaXRlbXMgaW4gdGhlIERPTS5cblxuICAgICAgICB0aGlzLml0ZW1zID0gdGhpcy5fZ2V0SXRlbXMoKTsgLy8gU2V0IGluaXRpYWwgc3R5bGVzIG9uIHRoZSBuZXcgaXRlbXMuXG5cbiAgICAgICAgdGhpcy5faW5pdEl0ZW1zKHRoaXMuaXRlbXMpO1xuXG4gICAgICAgIHRoaXMub25jZShTaHVmZmxlLkV2ZW50VHlwZS5MQVlPVVQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBBZGQgdHJhbnNpdGlvbiB0byBlYWNoIGl0ZW0uXG4gICAgICAgICAgX3RoaXMxMS5zZXRJdGVtVHJhbnNpdGlvbnMoX3RoaXMxMS5pdGVtcyk7XG5cbiAgICAgICAgICBfdGhpczExLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICB9KTsgLy8gTGF5IG91dCBhbGwgaXRlbXMuXG5cbiAgICAgICAgdGhpcy5maWx0ZXIodGhpcy5sYXN0RmlsdGVyKTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogRGVzdHJveXMgc2h1ZmZsZSwgcmVtb3ZlcyBldmVudHMsIHN0eWxlcywgYW5kIGNsYXNzZXNcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImRlc3Ryb3lcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLl9jYW5jZWxNb3ZlbWVudCgpO1xuXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vblJlc2l6ZSk7IC8vIFJlc2V0IGNvbnRhaW5lciBzdHlsZXNcblxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2h1ZmZsZScpO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpOyAvLyBSZXNldCBpbmRpdmlkdWFsIGl0ZW0gc3R5bGVzXG5cbiAgICAgICAgdGhpcy5fZGlzcG9zZUl0ZW1zKHRoaXMuaXRlbXMpO1xuXG4gICAgICAgIHRoaXMuaXRlbXMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbnMubGVuZ3RoID0gMDsgLy8gTnVsbCBET00gcmVmZXJlbmNlc1xuXG4gICAgICAgIHRoaXMub3B0aW9ucy5zaXplciA9IG51bGw7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7IC8vIFNldCBhIGZsYWcgc28gaWYgYSBkZWJvdW5jZWQgcmVzaXplIGhhcyBiZWVuIHRyaWdnZXJlZCxcbiAgICAgICAgLy8gaXQgY2FuIGZpcnN0IGNoZWNrIGlmIGl0IGlzIGFjdHVhbGx5IGlzRGVzdHJveWVkIGFuZCBub3QgZG9pbmcgYW55dGhpbmdcblxuICAgICAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0aGUgb3V0ZXIgd2lkdGggb2YgYW4gZWxlbWVudCwgb3B0aW9uYWxseSBpbmNsdWRpbmcgaXRzIG1hcmdpbnMuXG4gICAgICAgKlxuICAgICAgICogVGhlcmUgYXJlIGEgZmV3IGRpZmZlcmVudCBtZXRob2RzIGZvciBnZXR0aW5nIHRoZSB3aWR0aCBvZiBhbiBlbGVtZW50LCBub25lIG9mXG4gICAgICAgKiB3aGljaCB3b3JrIHBlcmZlY3RseSBmb3IgYWxsIFNodWZmbGUncyB1c2UgY2FzZXMuXG4gICAgICAgKlxuICAgICAgICogMS4gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgYGxlZnRgIGFuZCBgcmlnaHRgIHByb3BlcnRpZXMuXG4gICAgICAgKiAgIC0gQWNjb3VudHMgZm9yIHRyYW5zZm9ybSBzY2FsZWQgZWxlbWVudHMsIG1ha2luZyBpdCB1c2VsZXNzIGZvciBTaHVmZmxlXG4gICAgICAgKiAgIGVsZW1lbnRzIHdoaWNoIGhhdmUgc2hydW5rLlxuICAgICAgICogMi4gVGhlIGBvZmZzZXRXaWR0aGAgcHJvcGVydHkuXG4gICAgICAgKiAgIC0gVGhpcyB2YWx1ZSBzdGF5cyB0aGUgc2FtZSByZWdhcmRsZXNzIG9mIHRoZSBlbGVtZW50cyB0cmFuc2Zvcm0gcHJvcGVydHksXG4gICAgICAgKiAgIGhvd2V2ZXIsIGl0IGRvZXMgbm90IHJldHVybiBzdWJwaXhlbCB2YWx1ZXMuXG4gICAgICAgKiAzLiBnZXRDb21wdXRlZFN0eWxlKClcbiAgICAgICAqICAgLSBUaGlzIHdvcmtzIGdyZWF0IENocm9tZSwgRmlyZWZveCwgU2FmYXJpLCBidXQgSUU8PTExIGRvZXMgbm90IGluY2x1ZGVcbiAgICAgICAqICAgcGFkZGluZyBhbmQgYm9yZGVyIHdoZW4gYm94LXNpemluZzogYm9yZGVyLWJveCBpcyBzZXQsIHJlcXVpcmluZyBhIGZlYXR1cmVcbiAgICAgICAqICAgdGVzdCBhbmQgZXh0cmEgd29yayB0byBhZGQgdGhlIHBhZGRpbmcgYmFjayBmb3IgSUUgYW5kIG90aGVyIGJyb3dzZXJzIHdoaWNoXG4gICAgICAgKiAgIGZvbGxvdyB0aGUgVzNDIHNwZWMgaGVyZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQuXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpbmNsdWRlTWFyZ2lucz1mYWxzZV0gV2hldGhlciB0byBpbmNsdWRlIG1hcmdpbnMuXG4gICAgICAgKiBAcmV0dXJuIHt7d2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXJ9fSBUaGUgd2lkdGggYW5kIGhlaWdodC5cbiAgICAgICAqL1xuXG4gICAgfV0sIFt7XG4gICAgICBrZXk6IFwiZ2V0U2l6ZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFNpemUoZWxlbWVudCkge1xuICAgICAgICB2YXIgaW5jbHVkZU1hcmdpbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuICAgICAgICAvLyBTdG9yZSB0aGUgc3R5bGVzIHNvIHRoYXQgdGhleSBjYW4gYmUgdXNlZCBieSBvdGhlcnMgd2l0aG91dCBhc2tpbmcgZm9yIGl0IGFnYWluLlxuICAgICAgICB2YXIgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7XG4gICAgICAgIHZhciB3aWR0aCA9IGdldE51bWJlclN0eWxlKGVsZW1lbnQsICd3aWR0aCcsIHN0eWxlcyk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBnZXROdW1iZXJTdHlsZShlbGVtZW50LCAnaGVpZ2h0Jywgc3R5bGVzKTtcblxuICAgICAgICBpZiAoaW5jbHVkZU1hcmdpbnMpIHtcbiAgICAgICAgICB2YXIgbWFyZ2luTGVmdCA9IGdldE51bWJlclN0eWxlKGVsZW1lbnQsICdtYXJnaW5MZWZ0Jywgc3R5bGVzKTtcbiAgICAgICAgICB2YXIgbWFyZ2luUmlnaHQgPSBnZXROdW1iZXJTdHlsZShlbGVtZW50LCAnbWFyZ2luUmlnaHQnLCBzdHlsZXMpO1xuICAgICAgICAgIHZhciBtYXJnaW5Ub3AgPSBnZXROdW1iZXJTdHlsZShlbGVtZW50LCAnbWFyZ2luVG9wJywgc3R5bGVzKTtcbiAgICAgICAgICB2YXIgbWFyZ2luQm90dG9tID0gZ2V0TnVtYmVyU3R5bGUoZWxlbWVudCwgJ21hcmdpbkJvdHRvbScsIHN0eWxlcyk7XG4gICAgICAgICAgd2lkdGggKz0gbWFyZ2luTGVmdCArIG1hcmdpblJpZ2h0O1xuICAgICAgICAgIGhlaWdodCArPSBtYXJnaW5Ub3AgKyBtYXJnaW5Cb3R0b207XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IGhlaWdodFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBDaGFuZ2UgYSBwcm9wZXJ0eSBvciBleGVjdXRlIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCBub3QgaGF2ZSBhIHRyYW5zaXRpb25cbiAgICAgICAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbGVtZW50cyBET00gZWxlbWVudHMgdGhhdCB3b24ndCBiZSB0cmFuc2l0aW9uZWQuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBBIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIHdoaWxlIHRyYW5zaXRpb25cbiAgICAgICAqICAgICBpcyBzZXQgdG8gMG1zLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9za2lwVHJhbnNpdGlvbnNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfc2tpcFRyYW5zaXRpb25zKGVsZW1lbnRzLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgemVybyA9ICcwbXMnOyAvLyBTYXZlIGN1cnJlbnQgZHVyYXRpb24gYW5kIGRlbGF5LlxuXG4gICAgICAgIHZhciBkYXRhID0gZWxlbWVudHMubWFwKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgdmFyIHN0eWxlID0gZWxlbWVudC5zdHlsZTtcbiAgICAgICAgICB2YXIgZHVyYXRpb24gPSBzdHlsZS50cmFuc2l0aW9uRHVyYXRpb247XG4gICAgICAgICAgdmFyIGRlbGF5ID0gc3R5bGUudHJhbnNpdGlvbkRlbGF5OyAvLyBTZXQgdGhlIGR1cmF0aW9uIHRvIHplcm8gc28gaXQgaGFwcGVucyBpbW1lZGlhdGVseVxuXG4gICAgICAgICAgc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gemVybztcbiAgICAgICAgICBzdHlsZS50cmFuc2l0aW9uRGVsYXkgPSB6ZXJvO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICBkZWxheTogZGVsYXlcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgY2FsbGJhY2soKTsgLy8gQ2F1c2UgZm9yY2VkIHN5bmNocm9ub3VzIGxheW91dC5cblxuICAgICAgICBlbGVtZW50c1swXS5vZmZzZXRXaWR0aDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbiAgICAgICAgLy8gUHV0IHRoZSBkdXJhdGlvbiBiYWNrXG5cbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaSkge1xuICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gZGF0YVtpXS5kdXJhdGlvbjtcbiAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IGRhdGFbaV0uZGVsYXk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBTaHVmZmxlO1xuICB9KHRpbnlFbWl0dGVyKTtcblxuICBTaHVmZmxlLlNodWZmbGVJdGVtID0gU2h1ZmZsZUl0ZW07XG4gIFNodWZmbGUuQUxMX0lURU1TID0gJ2FsbCc7XG4gIFNodWZmbGUuRklMVEVSX0FUVFJJQlVURV9LRVkgPSAnZ3JvdXBzJztcbiAgLyoqIEBlbnVtIHtzdHJpbmd9ICovXG5cbiAgU2h1ZmZsZS5FdmVudFR5cGUgPSB7XG4gICAgTEFZT1VUOiAnc2h1ZmZsZTpsYXlvdXQnLFxuICAgIFJFTU9WRUQ6ICdzaHVmZmxlOnJlbW92ZWQnXG4gIH07XG4gIC8qKiBAZW51bSB7c3RyaW5nfSAqL1xuXG4gIFNodWZmbGUuQ2xhc3NlcyA9IENsYXNzZXM7XG4gIC8qKiBAZW51bSB7c3RyaW5nfSAqL1xuXG4gIFNodWZmbGUuRmlsdGVyTW9kZSA9IHtcbiAgICBBTlk6ICdhbnknLFxuICAgIEFMTDogJ2FsbCdcbiAgfTsgLy8gT3ZlcnJpZGVhYmxlIG9wdGlvbnNcblxuICBTaHVmZmxlLm9wdGlvbnMgPSB7XG4gICAgLy8gSW5pdGlhbCBmaWx0ZXIgZ3JvdXAuXG4gICAgZ3JvdXA6IFNodWZmbGUuQUxMX0lURU1TLFxuICAgIC8vIFRyYW5zaXRpb24vYW5pbWF0aW9uIHNwZWVkIChtaWxsaXNlY29uZHMpLlxuICAgIHNwZWVkOiAyNTAsXG4gICAgLy8gQ1NTIGVhc2luZyBmdW5jdGlvbiB0byB1c2UuXG4gICAgZWFzaW5nOiAnY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjIsIDEpJyxcbiAgICAvLyBlLmcuICcucGljdHVyZS1pdGVtJy5cbiAgICBpdGVtU2VsZWN0b3I6ICcqJyxcbiAgICAvLyBFbGVtZW50IG9yIHNlbGVjdG9yIHN0cmluZy4gVXNlIGFuIGVsZW1lbnQgdG8gZGV0ZXJtaW5lIHRoZSBzaXplIG9mIGNvbHVtbnNcbiAgICAvLyBhbmQgZ3V0dGVycy5cbiAgICBzaXplcjogbnVsbCxcbiAgICAvLyBBIHN0YXRpYyBudW1iZXIgb3IgZnVuY3Rpb24gdGhhdCB0ZWxscyB0aGUgcGx1Z2luIGhvdyB3aWRlIHRoZSBndXR0ZXJzXG4gICAgLy8gYmV0d2VlbiBjb2x1bW5zIGFyZSAoaW4gcGl4ZWxzKS5cbiAgICBndXR0ZXJXaWR0aDogMCxcbiAgICAvLyBBIHN0YXRpYyBudW1iZXIgb3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgbnVtYmVyIHdoaWNoIHRlbGxzIHRoZSBwbHVnaW5cbiAgICAvLyBob3cgd2lkZSB0aGUgY29sdW1ucyBhcmUgKGluIHBpeGVscykuXG4gICAgY29sdW1uV2lkdGg6IDAsXG4gICAgLy8gSWYgeW91ciBncm91cCBpcyBub3QganNvbiwgYW5kIGlzIGNvbW1hIGRlbGltZXRlZCwgeW91IGNvdWxkIHNldCBkZWxpbWl0ZXJcbiAgICAvLyB0byAnLCcuXG4gICAgZGVsaW1pdGVyOiBudWxsLFxuICAgIC8vIFVzZWZ1bCBmb3IgcGVyY2VudGFnZSBiYXNlZCBoZWlnaHRzIHdoZW4gdGhleSBtaWdodCBub3QgYWx3YXlzIGJlIGV4YWN0bHlcbiAgICAvLyB0aGUgc2FtZSAoaW4gcGl4ZWxzKS5cbiAgICBidWZmZXI6IDAsXG4gICAgLy8gUmVhZGluZyB0aGUgd2lkdGggb2YgZWxlbWVudHMgaXNuJ3QgcHJlY2lzZSBlbm91Z2ggYW5kIGNhbiBjYXVzZSBjb2x1bW5zIHRvXG4gICAgLy8ganVtcCBiZXR3ZWVuIHZhbHVlcy5cbiAgICBjb2x1bW5UaHJlc2hvbGQ6IDAuMDEsXG4gICAgLy8gU2h1ZmZsZSBjYW4gYmUgaXNJbml0aWFsaXplZCB3aXRoIGEgc29ydCBvYmplY3QuIEl0IGlzIHRoZSBzYW1lIG9iamVjdFxuICAgIC8vIGdpdmVuIHRvIHRoZSBzb3J0IG1ldGhvZC5cbiAgICBpbml0aWFsU29ydDogbnVsbCxcbiAgICAvLyBCeSBkZWZhdWx0LCBzaHVmZmxlIHdpbGwgdGhyb3R0bGUgcmVzaXplIGV2ZW50cy4gVGhpcyBjYW4gYmUgY2hhbmdlZCBvclxuICAgIC8vIHJlbW92ZWQuXG4gICAgdGhyb3R0bGU6IHRocm90dGxlaXQsXG4gICAgLy8gSG93IG9mdGVuIHNodWZmbGUgY2FuIGJlIGNhbGxlZCBvbiByZXNpemUgKGluIG1pbGxpc2Vjb25kcykuXG4gICAgdGhyb3R0bGVUaW1lOiAzMDAsXG4gICAgLy8gVHJhbnNpdGlvbiBkZWxheSBvZmZzZXQgZm9yIGVhY2ggaXRlbSBpbiBtaWxsaXNlY29uZHMuXG4gICAgc3RhZ2dlckFtb3VudDogMTUsXG4gICAgLy8gTWF4aW11bSBzdGFnZ2VyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy5cbiAgICBzdGFnZ2VyQW1vdW50TWF4OiAxNTAsXG4gICAgLy8gV2hldGhlciB0byB1c2UgdHJhbnNmb3JtcyBvciBhYnNvbHV0ZSBwb3NpdGlvbmluZy5cbiAgICB1c2VUcmFuc2Zvcm1zOiB0cnVlLFxuICAgIC8vIEFmZmVjdHMgdXNpbmcgYW4gYXJyYXkgd2l0aCBmaWx0ZXIuIGUuZy4gYGZpbHRlcihbJ29uZScsICd0d28nXSlgLiBXaXRoIFwiYW55XCIsXG4gICAgLy8gdGhlIGVsZW1lbnQgcGFzc2VzIHRoZSB0ZXN0IGlmIGFueSBvZiBpdHMgZ3JvdXBzIGFyZSBpbiB0aGUgYXJyYXkuIFdpdGggXCJhbGxcIixcbiAgICAvLyB0aGUgZWxlbWVudCBvbmx5IHBhc3NlcyBpZiBhbGwgZ3JvdXBzIGFyZSBpbiB0aGUgYXJyYXkuXG4gICAgZmlsdGVyTW9kZTogU2h1ZmZsZS5GaWx0ZXJNb2RlLkFOWSxcbiAgICAvLyBBdHRlbXB0IHRvIGNlbnRlciBncmlkIGl0ZW1zIGluIGVhY2ggcm93LlxuICAgIGlzQ2VudGVyZWQ6IGZhbHNlLFxuICAgIC8vIFdoZXRoZXIgdG8gcm91bmQgcGl4ZWwgdmFsdWVzIHVzZWQgaW4gdHJhbnNsYXRlKHgsIHkpLiBUaGlzIHVzdWFsbHkgYXZvaWRzXG4gICAgLy8gYmx1cnJpbmVzcy5cbiAgICByb3VuZFRyYW5zZm9ybXM6IHRydWVcbiAgfTtcbiAgU2h1ZmZsZS5Qb2ludCA9IFBvaW50O1xuICBTaHVmZmxlLlJlY3QgPSBSZWN0OyAvLyBFeHBvc2UgZm9yIHRlc3RpbmcuIEhhY2sgYXQgeW91ciBvd24gcmlzay5cblxuICBTaHVmZmxlLl9fc29ydGVyID0gc29ydGVyO1xuICBTaHVmZmxlLl9fZ2V0Q29sdW1uU3BhbiA9IGdldENvbHVtblNwYW47XG4gIFNodWZmbGUuX19nZXRBdmFpbGFibGVQb3NpdGlvbnMgPSBnZXRBdmFpbGFibGVQb3NpdGlvbnM7XG4gIFNodWZmbGUuX19nZXRTaG9ydENvbHVtbiA9IGdldFNob3J0Q29sdW1uO1xuICBTaHVmZmxlLl9fZ2V0Q2VudGVyZWRQb3NpdGlvbnMgPSBnZXRDZW50ZXJlZFBvc2l0aW9ucztcblxuICByZXR1cm4gU2h1ZmZsZTtcblxufSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2h1ZmZsZS5qcy5tYXBcbiJdfQ==
