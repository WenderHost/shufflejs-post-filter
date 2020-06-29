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
          // truncate( el.title, 50, true )
          //post = '<li class="list-item ' + this.postType + '" data-groups=\'' + JSON.stringify(el.groups) + '\'><div class="list-content ' + this.postType + '"><h3><a href="' + el.permalink + '">' + el.title + '</a></h3><div><a class="button" href="' + el.permalink + '">View the Course</a></div></div></li>'
          var dataGroups = JSON.stringify(el.groups);
          var newCourse = '';
          /*
            <div class="list-content ${this.postType}">
              <h3><a href="${el.permalink}">${el.title}</a></h3>
              <div><a class="button" href="${el.permalink}">View the Course</a></div>
              <div class="course-meta">Testing</div>
            </div>
           */
          // Delivery: ${el.meta._course_delivery_mode[0]}

          var virtualCourse = true;
          if (typeof el.meta._course_delivery_mode !== 'undefined') virtualCourse = -1 < el.meta._course_delivery_mode[0].indexOf('Virtual') ? true : false;
          var faceToFaceCourse = true;
          if (typeof el.meta._course_delivery_mode !== 'undefined') faceToFaceCourse = -1 < el.meta._course_delivery_mode[0].indexOf('Face-to-Face') ? true : false;
          var newTag = el["new"] ? '<div class="new"></div>' : '';
          /*
            <a href="${el.permalink}">
             </a>
           */

          post = "\n        <li class=\"list-item ".concat(this.postType, "\" data-groups=\"").concat(dataGroups, "\">\n          <a href=\"").concat(el.permalink, "\">\n            <div class=\"flip-card\">\n              <div class=\"flip-card-inner\">\n                <div class=\"flip-card-front\">\n                  <div class=\"course-title\">\n                    <h3>").concat(el.title, "</h3>\n                    ").concat(newTag, "\n                  </div>\n                  <div class=\"course-meta\">\n                    <div class=\"course-meta-row\">\n                      <div class=\"course-meta-col\">\n                        <div class=\"icon duration\"></div>\n                        <div class=\"text\">").concat(el.meta._course_duration[0], "</div>\n                      </div>\n                      <div class=\"course-meta-col\">\n                        <div class=\"text\">").concat(el.meta._course_reference[0], "</div>\n                      </div>\n                    </div>\n                    <div class=\"course-meta-row\">\n                      <div class=\"course-meta-col ").concat(faceToFaceCourse, "\">\n                        <div class=\"icon face-to-face ").concat(faceToFaceCourse, "\"></div>\n                        <div class=\"text\">Face-to-Face</div>\n                      </div>\n                      <div class=\"course-meta-col ").concat(virtualCourse, "\">\n                        <div class=\"icon virtual ").concat(virtualCourse, "\"></div>\n                        <div class=\"text\">OpenClass&reg;</div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"flip-card-back\">\n                  <h3>").concat(el.title, "</h3>\n                  <p>").concat(el.excerpt, "</p>\n                </div>\n              </div>\n            </div>\n          </a>\n        </li>");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvanMvc3JjL21haW4uanMiLCJsaWIvanMvc3JjL3NodWZmbGVqcy1pbml0LmpzIiwibGliL2pzL3NyYy91dGlsaXRpZXMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheUxpa2VUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXJyYXlXaXRoSG9sZXMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW50ZXJvcFJlcXVpcmVEZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaXRlcmFibGVUb0FycmF5TGltaXQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9ub25JdGVyYWJsZVJlc3QuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvc2h1ZmZsZWpzL2Rpc3Qvc2h1ZmZsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQTs7QUFFQSxJQUFNLE9BQU8sR0FBRyxJQUFJLHlCQUFKLEVBQWhCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGQTs7QUFDQTs7SUFFTSxXO0FBQ0oseUJBQWE7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgUG9zdEZpbHRlcnMgZnJvbSAnLi9zaHVmZmxlanMtaW5pdCdcblxuY29uc3QgZmlsdGVycyA9IG5ldyBQb3N0RmlsdGVycygpIiwiaW1wb3J0IFNodWZmbGUgZnJvbSAnc2h1ZmZsZWpzJ1xuaW1wb3J0IHsgdHJ1bmNhdGUgfSBmcm9tICcuL3V0aWxpdGllcydcblxuY2xhc3MgUG9zdEZpbHRlcnMge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIGNvbnNvbGUubG9nKCdQb3N0RmlsdGVycyBpcyBsb2FkZWQuJylcblxuICAgIHRoaXMuZmlsdGVycyA9IFtdXG5cbiAgICB0aGlzLnBvc3RUeXBlID0gd3B2YXJzLnBvc3RfdHlwZVxuICAgIHRoaXMuY2F0ZWdvcnkgPSB3cHZhcnMuY2F0ZWdvcnlcbiAgICB0aGlzLmdyaWRJZCA9IHdwdmFycy5ncmlkSWRcbiAgICB0aGlzLnBvc3RzID0gd3B2YXJzLnBvc3RzXG4gICAgdGhpcy5kZWZhdWx0VGh1bWJuYWlsID0gd3B2YXJzLmRlZmF1bHRUaHVtYm5haWxcbiAgICB0aGlzLmZpbHRlckNsYXNzTmFtZSA9IHdwdmFycy5maWx0ZXJfY2xhc3NfbmFtZVxuICAgIHRoaXMucGFnZV9udW1iZXIgPSAxXG4gICAgdGhpcy5wYWdlX3NpemUgPSBwYXJzZUludCh3cHZhcnMubGltaXQpXG4gICAgY29uc29sZS5sb2coJ3RoaXMucGFnZV9zaXplID0gJywgdGhpcy5wYWdlX3NpemUpXG4gICAgdGhpcy50b3RhbF9wYWdlcyA9ICggLTEgPT09IHRoaXMucGFnZV9zaXplICk/IDEgOiBNYXRoLmNlaWwoIHRoaXMucG9zdHMubGVuZ3RoL3RoaXMucGFnZV9zaXplIClcbiAgICB0aGlzLmZpbHRlckdyb3VwcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIHdwdmFycy5maWx0ZXJfY2xhc3NfbmFtZSApXG4gICAgdGhpcy5sb2FkTW9yZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkLW1vcmUnKVxuICAgIHRoaXMubG9hZFBvc3RzKClcbiAgICB0aGlzLmFkZExpbmtFdmVudExpc3RlbmVyKClcbiAgICAvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2FkLW1vcmUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25BcHBlbmRQb3N0cy5iaW5kKHRoaXMpIClcbiAgICB0aGlzLmFkZExvYWRNb3JlTGlzdGVuZXIoKVxuXG4gICAgY29uc29sZS5sb2coJ3RoaXMucG9zdFR5cGUgPSAnLCB0aGlzLnBvc3RUeXBlLFwiXFxuXCIgKyAndGhpcy5jYXRlZ29yeSA9ICcsIHRoaXMuY2F0ZWdvcnksIFwiXFxuXCIgKyAndGhpcy5ncmlkSWQgPSAnLCB0aGlzLmdyaWRJZCwgXCJcXG50aGlzLnBvc3RzID0gXCIsIHRoaXMucG9zdHMsIFwiXFxudGhpcy5kZWZhdWx0VGh1bWJuYWlsID0gXCIsIHRoaXMuZGVmYXVsdFRodW1ibmFpbCwgXCJcXG50aGlzLmZpbHRlckNsYXNzTmFtZSA9IFwiLCB0aGlzLmZpbHRlckNsYXNzTmFtZSwgXCJcXG50aGlzLnRvdGFsX3BhZ2VzID0gXCIsIHRoaXMudG90YWxfcGFnZXMgKVxuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgdGhlIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIExPQUQgTU9SRSBidXR0b25cbiAgICovXG4gIGFkZExvYWRNb3JlTGlzdGVuZXIoKXtcbiAgICB0aGlzLmxvYWRNb3JlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB0aGlzLmxvYWRQb3N0cygpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGV2ZW50IGxpc3RlbmVyIHRvIGVhY2ggLmZpbHRlci1saW5rLWdyb3VwIHVsID4gbGkgPiBhXG4gICAqL1xuICBhZGRMaW5rRXZlbnRMaXN0ZW5lcigpe1xuICAgIGZvciggbGV0IFtrZXksdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuZmlsdGVyR3JvdXBzKSl7XG4gICAgICBjb25zdCBmaWx0ZXJMaW5rcyA9IHZhbHVlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJylcbiAgICAgIGZvciggbGV0IFtrZXksbGlua10gb2YgT2JqZWN0LmVudHJpZXMoZmlsdGVyTGlua3MpKXtcbiAgICAgICAgY29uc3QgZmlsdGVyID0gbGluay5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyJylcbiAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgICAgaWYoICdncm91cHMnICE9PSBTaHVmZmxlLkZJTFRFUl9BVFRSSUJVVEVfS0VZICl7XG4gICAgICAgICAgICB0aGlzLmNsZWFyQWxsRmlsdGVycygpXG4gICAgICAgICAgICBTaHVmZmxlLkZJTFRFUl9BVFRSSUJVVEVfS0VZID0gJ2dyb3VwcydcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDbGVhciB0aGUgdGV4dCBzZWFyY2ggZmllbGRcbiAgICAgICAgICAvL3RoaXMucmVtb3ZlU2VhcmNoVGV4dCgpXG5cbiAgICAgICAgICAvLyBSZW1vdmUgYWxsIGZpbHRlcmluZyBmb3IgYSB0YXhvbm9teSBpZiAnKicgPT09IGZpbHRlclxuICAgICAgICAgIGlmKCAnKicgPT09IGZpbHRlciApe1xuICAgICAgICAgICAgdGhpcy5fY2xlYXJBbGxGaWx0ZXJzRm9yVGF4b25vbXkobGluaylcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fY2xlYXJBbGxGaWx0ZXJzRm9yVGF4b25vbXkobGluaylcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlRmlsdGVyKGZpbHRlcilcbiAgICAgICAgICAgIGlmKCB0aGlzLmhhc0ZpbHRlcihmaWx0ZXIpICl7XG4gICAgICAgICAgICAgIGxpbmsuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy90aGlzLl9jbGVhckFsbEZpbHRlcnNGb3JUYXhvbm9teShsaW5rKVxuICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLyoqL1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgYGZpbHRlcmAgdG8gdGhpcy5maWx0ZXJzXG4gICAqXG4gICAqIEBwYXJhbSAgICAgIHtzdHJpbmd9ICBmaWx0ZXIgIFRoZSBmaWx0ZXJcbiAgICovXG4gIGFkZEZpbHRlciggZmlsdGVyICl7XG4gICAgaWYoIC0xID09PSB0aGlzLmZpbHRlcnMuaW5kZXhPZihmaWx0ZXIpICl7XG4gICAgICB0aGlzLmZpbHRlcnMucHVzaChmaWx0ZXIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIFNodWZmbGVKUy5zaHVmZmxlIHdpdGggb3VyIGZpbHRlcnNcbiAgICovXG4gIGFwcGx5RmlsdGVycygpe1xuICAgIHZhciBmaWx0ZXJzID0gdGhpcy5maWx0ZXJzXG4gICAgY29uc29sZS5sb2coJ/CflJQgRmlsdGVyaW5nIHdpdGg6ICcsIGZpbHRlcnMgKVxuICAgIHRoaXMuc2h1ZmZsZS5maWx0ZXIoIGZpbHRlcnMgKVxuICB9XG5cbiAgY2xlYXJBbGxGaWx0ZXJzKCl7XG4gICAgY29uc3QgZmlsdGVycyA9IHRoaXMuZmlsdGVyc1xuICAgIGZpbHRlcnMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgdGhpcy5yZW1vdmVGaWx0ZXIoZWxlbWVudClcbiAgICB9KVxuICB9XG5cbiAgX2NsZWFyQWxsRmlsdGVyc0ZvclRheG9ub215KCBsaW5rRWwgKXtcbiAgICBjb25zdCBjbG9zZXN0UGFyZW50ID0gbGlua0VsLmNsb3Nlc3QoJy5maWx0ZXItbGluay1ncm91cCcpXG4gICAgY29uc3QgdGF4b25vbXkgPSBjbG9zZXN0UGFyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10YXhvbm9teScpXG4gICAgY29uc3QgbGlzdEl0ZW1zID0gY2xvc2VzdFBhcmVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKVxuICAgIGNvbnNvbGUubG9nKGDwn5SUIENsZWFyaW5nIGFsbCBmaWx0ZXJzIGZvciBcIiR7dGF4b25vbXl9XCIuLi5gKVxuICAgIGZvciggbGV0IFtrZXksbGlzdEl0ZW1dIG9mIE9iamVjdC5lbnRyaWVzKGxpc3RJdGVtcykpe1xuICAgICAgY29uc3QgZmlsdGVyTGluayA9IGxpc3RJdGVtLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJylcbiAgICAgIGlmKCBmaWx0ZXJMaW5rWzBdLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSApe1xuICAgICAgICBjb25zdCBmaWx0ZXJUb1JlbW92ZSA9IGZpbHRlckxpbmtbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlcicpXG4gICAgICAgIHRoaXMucmVtb3ZlRmlsdGVyKGZpbHRlclRvUmVtb3ZlKVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmFwcGx5RmlsdGVycygpXG4gIH1cblxuICAgLyoqXG4gICAqIENoZWNrcyBmb3IgdGhlIGV4aXN0ZW5jZSBvZiBgZmlsdGVyYCBpbnNpZGUgdGhpcy5maWx0ZXJzXG4gICAqXG4gICAqIEBwYXJhbSAgICAgIHtzdHJpbmd9ICAgZmlsdGVyICBUaGUgZmlsdGVyXG4gICAqIEByZXR1cm4gICAgIHtib29sZWFufSAgVHJ1ZSBpZiBoYXMgZmlsdGVyLCBGYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBoYXNGaWx0ZXIoIGZpbHRlciApe1xuICAgIHJldHVybiAoLTEgPCB0aGlzLmZpbHRlcnMuaW5kZXhPZihmaWx0ZXIpKT8gdHJ1ZSA6IGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGBmaWx0ZXJgIGZyb20gdGhpcy5maWx0ZXJzXG4gICAqXG4gICAqIEBwYXJhbSAgICAgIHtzdHJpbmd9ICBmaWx0ZXIgIFRoZSBmaWx0ZXJcbiAgICovXG4gIHJlbW92ZUZpbHRlciggZmlsdGVyICl7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5maWx0ZXJzLmluZGV4T2YoZmlsdGVyKVxuICAgIGlmKC0xIDwgaW5kZXgpe1xuICAgICAgY29uc29sZS5sb2coYFxcdCDigKIgUmVtb3ZpbmcgJyR7ZmlsdGVyfSdgKVxuICAgICAgdGhpcy5maWx0ZXJzLnNwbGljZShpbmRleCwxKVxuXG4gICAgICAvLyBSZW1vdmUgLnNlbGVjdGVkIGZyb20gdGhlIGZpbHRlciBhbmNob3IgdGFnLlxuICAgICAgdmFyIGZpbHRlckxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1maWx0ZXI9XCIke2ZpbHRlcn1cIl1gKVxuICAgICAgaWYoIGZpbHRlckxpbmsuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpIClcbiAgICAgICAgZmlsdGVyTGluay5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgKGFkZHMvcmVtb3ZlcykgYSBgZmlsdGVyYCBmcm9tIHRoaXMuZmlsdGVyc1xuICAgKlxuICAgKiBAcGFyYW0gICAgICB7c3RyaW5nfSAgZmlsdGVyICBUaGUgZmlsdGVyXG4gICAqL1xuICB0b2dnbGVGaWx0ZXIoIGZpbHRlciApe1xuICAgIGNvbnN0IGhhc0ZpbHRlciA9IHRoaXMuaGFzRmlsdGVyKCBmaWx0ZXIgKVxuICAgIGlmKCBoYXNGaWx0ZXIgKXtcbiAgICAgIHRoaXMucmVtb3ZlRmlsdGVyKGZpbHRlcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRGaWx0ZXIoZmlsdGVyKVxuICAgIH1cbiAgICB0aGlzLmFwcGx5RmlsdGVycygpXG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgb3VyIHBvc3RzIGFuZCBhcHBsaWVzIFNodWZmbGVKU1xuICAgKlxuICAgKiBAcGFyYW0gICAgICB7bnVtYmVyfSAgcGFnZV9zaXplICAgIFRoZSBwYWdlIHNpemVcbiAgICogQHBhcmFtICAgICAge251bWJlcn0gIHBhZ2VfbnVtYmVyICBUaGUgcGFnZSBudW1iZXJcbiAgICovXG4gIGxvYWRQb3N0cygpe1xuICAgIGNvbnN0IHBvc3RHcmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHRoaXMuZ3JpZElkIClcblxuICAgIGNvbnN0IHBvc3RzID0gKCAtMSA9PT0gdGhpcy5wYWdlX3NpemUgKT8gdGhpcy5wb3N0cyA6IHRoaXMuX2dldFBhZ2VPZlBvc3RzKClcblxuICAgIGxldCBlbFByb2Nlc3NlZCA9IDBcbiAgICBwb3N0cy5mb3JFYWNoKCAoZWwsIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgcG9zdEdyaWQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVFbmQnLCB0aGlzLl9nZXRQb3N0RWxlbWVudChlbCkgKVxuICAgICAgZWxQcm9jZXNzZWQrK1xuICAgICAgaWYoIGVsUHJvY2Vzc2VkID09PSBhcnJheS5sZW5ndGggKXtcblxuICAgICAgICBjb25zb2xlLmxvZygnU2h1ZmZsaW5nIG5vdyEgdGhpcy5wYWdlX251bWJlciA9ICcsIHRoaXMucGFnZV9udW1iZXIpXG5cbiAgICAgICAgaWYoIHRoaXMucGFnZV9udW1iZXIgPT09IHRoaXMudG90YWxfcGFnZXMgfHwgLTEgPT09IHRoaXMucGFnZV9zaXplIClcbiAgICAgICAgICB0aGlzLmxvYWRNb3JlQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcblxuICAgICAgICB0aGlzLnBhZ2VfbnVtYmVyKytcbiAgICAgICAgdGhpcy5zaHVmZmxlID0gbmV3IFNodWZmbGUoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCB0aGlzLmdyaWRJZCApLCB7XG4gICAgICAgICAgaXRlbVNlbGVjdG9yOiAnLicgKyB0aGlzLnBvc3RUeXBlLFxuICAgICAgICAgIGZpbHRlck1vZGU6ICdhbGwnXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIF9nZXRQYWdlT2ZQb3N0cygpe1xuICAgIGNvbnNvbGUubG9nKGBfZ2V0UGFnZU9mUG9zdHMoKSBpcyByZXRyaWV2aW5nIHBhZ2UgJHt0aGlzLnBhZ2VfbnVtYmVyfSB3aXRoICR7dGhpcy5wYWdlX3NpemV9IHBvc3RzLmApXG4gICAgbGV0IHBhZ2VfbnVtYmVyID0gdGhpcy5wYWdlX251bWJlclxuICAgIHBhZ2VfbnVtYmVyLS1cbiAgICBjb25zdCBwYWdlX3NpemUgPSB0aGlzLnBhZ2Vfc2l6ZVxuICAgIHJldHVybiB0aGlzLnBvc3RzLnNsaWNlKCBwYWdlX251bWJlciAqIHBhZ2Vfc2l6ZSwgKHBhZ2VfbnVtYmVyICsgMSkgKiBwYWdlX3NpemUgKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIEhUTUwgZm9yIG91ciBwb3N0IGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBlbCBPdXIgcG9zdCBlbGVtZW50L29iamVjdC5cbiAgICovXG4gIF9nZXRQb3N0RWxlbWVudCggZWwgKXtcbiAgICBjb25zdCB0aHVtYm5haWxVcmwgPSAoICEgZWwudGh1bWJuYWlsICk/IHRoaXMuZGVmYXVsdFRodW1ibmFpbCA6IGVsLnRodW1ibmFpbCA7XG4gICAgbGV0IHBvc3QgPSAnJ1xuICAgIHN3aXRjaCggdGhpcy5wb3N0VHlwZSApe1xuICAgICAgY2FzZSAncHJvZHVjdCc6XG4gICAgICAgIC8vIHRydW5jYXRlKCBlbC50aXRsZSwgNTAsIHRydWUgKVxuICAgICAgICAvL3Bvc3QgPSAnPGxpIGNsYXNzPVwibGlzdC1pdGVtICcgKyB0aGlzLnBvc3RUeXBlICsgJ1wiIGRhdGEtZ3JvdXBzPVxcJycgKyBKU09OLnN0cmluZ2lmeShlbC5ncm91cHMpICsgJ1xcJz48ZGl2IGNsYXNzPVwibGlzdC1jb250ZW50ICcgKyB0aGlzLnBvc3RUeXBlICsgJ1wiPjxoMz48YSBocmVmPVwiJyArIGVsLnBlcm1hbGluayArICdcIj4nICsgZWwudGl0bGUgKyAnPC9hPjwvaDM+PGRpdj48YSBjbGFzcz1cImJ1dHRvblwiIGhyZWY9XCInICsgZWwucGVybWFsaW5rICsgJ1wiPlZpZXcgdGhlIENvdXJzZTwvYT48L2Rpdj48L2Rpdj48L2xpPidcbiAgICAgICAgdmFyIGRhdGFHcm91cHMgPSBKU09OLnN0cmluZ2lmeShlbC5ncm91cHMpXG4gICAgICAgIHZhciBuZXdDb3Vyc2UgPSAnJ1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtY29udGVudCAke3RoaXMucG9zdFR5cGV9XCI+XG4gICAgICAgICAgICA8aDM+PGEgaHJlZj1cIiR7ZWwucGVybWFsaW5rfVwiPiR7ZWwudGl0bGV9PC9hPjwvaDM+XG4gICAgICAgICAgICA8ZGl2PjxhIGNsYXNzPVwiYnV0dG9uXCIgaHJlZj1cIiR7ZWwucGVybWFsaW5rfVwiPlZpZXcgdGhlIENvdXJzZTwvYT48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb3Vyc2UtbWV0YVwiPlRlc3Rpbmc8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICovXG4gICAgICAgIC8vIERlbGl2ZXJ5OiAke2VsLm1ldGEuX2NvdXJzZV9kZWxpdmVyeV9tb2RlWzBdfVxuICAgICAgICB2YXIgdmlydHVhbENvdXJzZSA9IHRydWVcbiAgICAgICAgaWYoIHR5cGVvZiBlbC5tZXRhLl9jb3Vyc2VfZGVsaXZlcnlfbW9kZSAhPT0gJ3VuZGVmaW5lZCcgKVxuICAgICAgICAgIHZpcnR1YWxDb3Vyc2UgPSAoIC0xIDwgZWwubWV0YS5fY291cnNlX2RlbGl2ZXJ5X21vZGVbMF0uaW5kZXhPZignVmlydHVhbCcpICk/IHRydWUgOiBmYWxzZVxuXG4gICAgICAgIHZhciBmYWNlVG9GYWNlQ291cnNlID0gdHJ1ZVxuICAgICAgICBpZiggdHlwZW9mIGVsLm1ldGEuX2NvdXJzZV9kZWxpdmVyeV9tb2RlICE9PSAndW5kZWZpbmVkJyApXG4gICAgICAgICAgZmFjZVRvRmFjZUNvdXJzZSA9ICggLTEgPCBlbC5tZXRhLl9jb3Vyc2VfZGVsaXZlcnlfbW9kZVswXS5pbmRleE9mKCdGYWNlLXRvLUZhY2UnKSApPyB0cnVlIDogZmFsc2VcblxuICAgICAgICB2YXIgbmV3VGFnID0gKCBlbC5uZXcgKT8gJzxkaXYgY2xhc3M9XCJuZXdcIj48L2Rpdj4nIDogJydcblxuICAgICAgICAvKlxuICAgICAgICAgIDxhIGhyZWY9XCIke2VsLnBlcm1hbGlua31cIj5cblxuICAgICAgICAgIDwvYT5cbiAgICAgICAgICovXG5cbiAgICAgICAgcG9zdCA9IGBcbiAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtICR7dGhpcy5wb3N0VHlwZX1cIiBkYXRhLWdyb3Vwcz1cIiR7ZGF0YUdyb3Vwc31cIj5cbiAgICAgICAgICA8YSBocmVmPVwiJHtlbC5wZXJtYWxpbmt9XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxpcC1jYXJkXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGlwLWNhcmQtaW5uZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxpcC1jYXJkLWZyb250XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY291cnNlLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMz4ke2VsLnRpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICR7bmV3VGFnfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY291cnNlLW1ldGFcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvdXJzZS1tZXRhLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb3Vyc2UtbWV0YS1jb2xcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpY29uIGR1cmF0aW9uXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dFwiPiR7ZWwubWV0YS5fY291cnNlX2R1cmF0aW9uWzBdfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb3Vyc2UtbWV0YS1jb2xcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0XCI+JHtlbC5tZXRhLl9jb3Vyc2VfcmVmZXJlbmNlWzBdfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvdXJzZS1tZXRhLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb3Vyc2UtbWV0YS1jb2wgJHtmYWNlVG9GYWNlQ291cnNlfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImljb24gZmFjZS10by1mYWNlICR7ZmFjZVRvRmFjZUNvdXJzZX1cIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0XCI+RmFjZS10by1GYWNlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvdXJzZS1tZXRhLWNvbCAke3ZpcnR1YWxDb3Vyc2V9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvbiB2aXJ0dWFsICR7dmlydHVhbENvdXJzZX1cIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0XCI+T3BlbkNsYXNzJnJlZzs8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxpcC1jYXJkLWJhY2tcIj5cbiAgICAgICAgICAgICAgICAgIDxoMz4ke2VsLnRpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICA8cD4ke2VsLmV4Y2VycHR9PC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT5gXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIEJ1aWxkIHRoZSBlbGVtZW50cyBvZiAub3ZlcmxheVxuICAgICAgICBsZXQgcmliYm9uID0gYDxkaXYgY2xhc3M9XCJyaWJib24gJHtlbC5ncm91cHMuam9pbignICcpfVwiPjwvZGl2PmBcbiAgICAgICAgbGV0IGJsdWVPdmVybGF5ID0gYDxkaXYgY2xhc3M9XCJibHVlLW92ZXJsYXlcIj48L2Rpdj5gXG4gICAgICAgIGxldCBjYXRlZ29yeU92ZXJsYXkgPSBgPGRpdiBjbGFzcz1cImNhdGVnb3J5LW92ZXJsYXlcIj4ke2VsLnJlc291cmNlX3R5cGV9PC9kaXY+YFxuXG4gICAgICAgIC8vIC5vdmVybGF5IGNvbnRhaW5zIC5yaWJib24sIC5ibHVlLW92ZXJsYXksIGFuZCAuY2F0ZWdvcnktb3ZlcmxheVxuICAgICAgICBsZXQgb3ZlcmxheSA9IGA8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIHN0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCcke3RodW1ibmFpbFVybH0nKVwiPiR7cmliYm9ufSR7Ymx1ZU92ZXJsYXl9JHtjYXRlZ29yeU92ZXJsYXl9PC9kaXY+YFxuXG4gICAgICAgIC8vIEJ1aWxkIC5saXN0LWl0ZW0gd2l0aCB0aGUgLm1ldGEgYW5kIHRpdGxlLlxuICAgICAgICBsZXQgbWV0YSA9IGA8cCBjbGFzcz1cIm1ldGFcIj4ke2VsLm1ldGF9PC9wPmBcbiAgICAgICAgbGV0IHRpdGxlID0gYDxoMz4ke3RydW5jYXRlKGVsLnRpdGxlLDgwLHRydWUpfTwvaDM+YFxuICAgICAgICBsZXQgbGlzdEl0ZW0gPSBgPGxpIGNsYXNzPVwibGlzdC1pdGVtICR7dGhpcy5wb3N0VHlwZX1cIiBkYXRhLWdyb3Vwcz0nJHtKU09OLnN0cmluZ2lmeShlbC5ncm91cHMpfSc+PGEgaHJlZj1cIiR7ZWwucGVybWFsaW5rfVwiPjxkaXYgY2xhc3M9XCJsaXN0LWNvbnRlbnQgJHt0aGlzLnBvc3RUeXBlfVwiPiR7b3ZlcmxheX0ke21ldGF9JHt0aXRsZX08L2Rpdj48L2E+PC9saT5gXG4gICAgICAgIHBvc3QgPSBsaXN0SXRlbVxuICAgIH1cbiAgICByZXR1cm4gcG9zdFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBvc3RGaWx0ZXJzIiwiLyogVXRpbGl0eSBGdW5jdGlvbnMgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHRydW5jYXRlKCBzdHJpbmcsIG4sIHVzZVdvcmRCb3VuZGFyeSApe1xuICAgIGlmIChzdHJpbmcubGVuZ3RoIDw9IG4pXG4gICAgICByZXR1cm4gc3RyaW5nXG4gICAgbGV0IHN1YlN0cmluZyA9IHN0cmluZy5zdWJzdHIoMCwgbi0xKVxuICAgIHJldHVybiAodXNlV29yZEJvdW5kYXJ5ID8gc3ViU3RyaW5nLnN1YnN0cigwLCBzdWJTdHJpbmcubGFzdEluZGV4T2YoJyAnKSApIDogc3ViU3RyaW5nKSArIFwiJmhlbGxpcDtcIlxufSIsImZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykge1xuICAgIGFycjJbaV0gPSBhcnJbaV07XG4gIH1cblxuICByZXR1cm4gYXJyMjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlMaWtlVG9BcnJheTsiLCJmdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FycmF5V2l0aEhvbGVzOyIsImZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2NsYXNzQ2FsbENoZWNrOyIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfY3JlYXRlQ2xhc3M7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuO1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2l0ZXJhYmxlVG9BcnJheUxpbWl0OyIsImZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX25vbkl0ZXJhYmxlUmVzdDsiLCJ2YXIgYXJyYXlXaXRoSG9sZXMgPSByZXF1aXJlKFwiLi9hcnJheVdpdGhIb2xlc1wiKTtcblxudmFyIGl0ZXJhYmxlVG9BcnJheUxpbWl0ID0gcmVxdWlyZShcIi4vaXRlcmFibGVUb0FycmF5TGltaXRcIik7XG5cbnZhciB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSA9IHJlcXVpcmUoXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5XCIpO1xuXG52YXIgbm9uSXRlcmFibGVSZXN0ID0gcmVxdWlyZShcIi4vbm9uSXRlcmFibGVSZXN0XCIpO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHtcbiAgcmV0dXJuIGFycmF5V2l0aEhvbGVzKGFycikgfHwgaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IG5vbkl0ZXJhYmxlUmVzdCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zbGljZWRUb0FycmF5OyIsInZhciBhcnJheUxpa2VUb0FycmF5ID0gcmVxdWlyZShcIi4vYXJyYXlMaWtlVG9BcnJheVwiKTtcblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXk7IiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsID0gZ2xvYmFsIHx8IHNlbGYsIGdsb2JhbC5TaHVmZmxlID0gZmFjdG9yeSgpKTtcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtcbiAgICB9XG5cbiAgICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgICBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICAgICAgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTtcbiAgICB9O1xuICAgIHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7XG4gIH1cblxuICBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgIF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgICAgby5fX3Byb3RvX18gPSBwO1xuICAgICAgcmV0dXJuIG87XG4gICAgfTtcblxuICAgIHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7XG4gIH1cblxuICBmdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHtcbiAgICBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7XG4gICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICBmdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gICAgaWYgKGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7XG4gICAgICByZXR1cm4gY2FsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEUgKCkge1xuICAgIC8vIEtlZXAgdGhpcyBlbXB0eSBzbyBpdCdzIGVhc2llciB0byBpbmhlcml0IGZyb21cbiAgICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG4gIH1cblxuICBFLnByb3RvdHlwZSA9IHtcbiAgICBvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG5cbiAgICAgIChlW25hbWVdIHx8IChlW25hbWVdID0gW10pKS5wdXNoKHtcbiAgICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgICBjdHg6IGN0eFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBvbmNlOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gbGlzdGVuZXIgKCkge1xuICAgICAgICBzZWxmLm9mZihuYW1lLCBsaXN0ZW5lcik7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGxpc3RlbmVyLl8gPSBjYWxsYmFjaztcbiAgICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIGxpc3RlbmVyLCBjdHgpO1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGRhdGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgICB2YXIgaSA9IDA7XG4gICAgICB2YXIgbGVuID0gZXZ0QXJyLmxlbmd0aDtcblxuICAgICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgZXZ0QXJyW2ldLmZuLmFwcGx5KGV2dEFycltpXS5jdHgsIGRhdGEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgb2ZmOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgICB2YXIgbGl2ZUV2ZW50cyA9IFtdO1xuXG4gICAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGlmIChldnRzW2ldLmZuICE9PSBjYWxsYmFjayAmJiBldnRzW2ldLmZuLl8gIT09IGNhbGxiYWNrKVxuICAgICAgICAgICAgbGl2ZUV2ZW50cy5wdXNoKGV2dHNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2NvbW1pdC9jNmViZmFhOWJjOTczYjMzZDExMGE4NGEzMDc3NDJiN2NmOTRjOTUzI2NvbW1pdGNvbW1lbnQtNTAyNDkxMFxuXG4gICAgICAobGl2ZUV2ZW50cy5sZW5ndGgpXG4gICAgICAgID8gZVtuYW1lXSA9IGxpdmVFdmVudHNcbiAgICAgICAgOiBkZWxldGUgZVtuYW1lXTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuXG4gIHZhciB0aW55RW1pdHRlciA9IEU7XG4gIHZhciBUaW55RW1pdHRlciA9IEU7XG4gIHRpbnlFbWl0dGVyLlRpbnlFbWl0dGVyID0gVGlueUVtaXR0ZXI7XG5cbiAgdmFyIHByb3RvID0gdHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnID8gRWxlbWVudC5wcm90b3R5cGUgOiB7fTtcbiAgdmFyIHZlbmRvciA9IHByb3RvLm1hdGNoZXNcbiAgICB8fCBwcm90by5tYXRjaGVzU2VsZWN0b3JcbiAgICB8fCBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3JcbiAgICB8fCBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3JcbiAgICB8fCBwcm90by5tc01hdGNoZXNTZWxlY3RvclxuICAgIHx8IHByb3RvLm9NYXRjaGVzU2VsZWN0b3I7XG5cbiAgdmFyIG1hdGNoZXNTZWxlY3RvciA9IG1hdGNoO1xuXG4gIC8qKlxuICAgKiBNYXRjaCBgZWxgIHRvIGBzZWxlY3RvcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG1hdGNoKGVsLCBzZWxlY3Rvcikge1xuICAgIGlmICghZWwgfHwgZWwubm9kZVR5cGUgIT09IDEpIHJldHVybiBmYWxzZTtcbiAgICBpZiAodmVuZG9yKSByZXR1cm4gdmVuZG9yLmNhbGwoZWwsIHNlbGVjdG9yKTtcbiAgICB2YXIgbm9kZXMgPSBlbC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChub2Rlc1tpXSA9PSBlbCkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciB0aHJvdHRsZWl0ID0gdGhyb3R0bGU7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBuZXcgZnVuY3Rpb24gdGhhdCwgd2hlbiBpbnZva2VkLCBpbnZva2VzIGBmdW5jYCBhdCBtb3N0IG9uY2UgcGVyIGB3YWl0YCBtaWxsaXNlY29uZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgRnVuY3Rpb24gdG8gd3JhcC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdhaXQgTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IG11c3QgZWxhcHNlIGJldHdlZW4gYGZ1bmNgIGludm9jYXRpb25zLlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gdGhhdCB3cmFwcyB0aGUgYGZ1bmNgIGZ1bmN0aW9uIHBhc3NlZCBpbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gdGhyb3R0bGUgKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgY3R4LCBhcmdzLCBydG4sIHRpbWVvdXRJRDsgLy8gY2FjaGluZ1xuICAgIHZhciBsYXN0ID0gMDtcblxuICAgIHJldHVybiBmdW5jdGlvbiB0aHJvdHRsZWQgKCkge1xuICAgICAgY3R4ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgZGVsdGEgPSBuZXcgRGF0ZSgpIC0gbGFzdDtcbiAgICAgIGlmICghdGltZW91dElEKVxuICAgICAgICBpZiAoZGVsdGEgPj0gd2FpdCkgY2FsbCgpO1xuICAgICAgICBlbHNlIHRpbWVvdXRJRCA9IHNldFRpbWVvdXQoY2FsbCwgd2FpdCAtIGRlbHRhKTtcbiAgICAgIHJldHVybiBydG47XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNhbGwgKCkge1xuICAgICAgdGltZW91dElEID0gMDtcbiAgICAgIGxhc3QgPSArbmV3IERhdGUoKTtcbiAgICAgIHJ0biA9IGZ1bmMuYXBwbHkoY3R4LCBhcmdzKTtcbiAgICAgIGN0eCA9IG51bGw7XG4gICAgICBhcmdzID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICB2YXIgYXJyYXlQYXJhbGxlbCA9IGZ1bmN0aW9uIHBhcmFsbGVsKGZucywgY29udGV4dCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnRleHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjb250ZXh0O1xuICAgICAgICBjb250ZXh0ID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrID0gbm9vcDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcGVuZGluZyA9IGZucyAmJiBmbnMubGVuZ3RoO1xuICAgIGlmICghcGVuZGluZykgcmV0dXJuIGNhbGxiYWNrKG51bGwsIFtdKTtcblxuICAgIHZhciBmaW5pc2hlZCA9IGZhbHNlO1xuICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KHBlbmRpbmcpO1xuXG4gICAgZm5zLmZvckVhY2goY29udGV4dCA/IGZ1bmN0aW9uIChmbiwgaSkge1xuICAgICAgZm4uY2FsbChjb250ZXh0LCBtYXliZURvbmUoaSkpO1xuICAgIH0gOiBmdW5jdGlvbiAoZm4sIGkpIHtcbiAgICAgIGZuKG1heWJlRG9uZShpKSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBtYXliZURvbmUoaSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICBpZiAoZmluaXNoZWQpIHJldHVybjtcblxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHRzKTtcbiAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRzW2ldID0gcmVzdWx0O1xuXG4gICAgICAgIGlmICghLS1wZW5kaW5nKSBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gbm9vcCgpIHt9XG5cbiAgLyoqXG4gICAqIEFsd2F5cyByZXR1cm5zIGEgbnVtZXJpYyB2YWx1ZSwgZ2l2ZW4gYSB2YWx1ZS4gTG9naWMgZnJvbSBqUXVlcnkncyBgaXNOdW1lcmljYC5cbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBQb3NzaWJseSBudW1lcmljIHZhbHVlLlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IGB2YWx1ZWAgb3IgemVybyBpZiBgdmFsdWVgIGlzbid0IG51bWVyaWMuXG4gICAqL1xuICBmdW5jdGlvbiBnZXROdW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgfHwgMDtcbiAgfVxuXG4gIHZhciBQb2ludCA9XG4gIC8qI19fUFVSRV9fKi9cbiAgZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIFJlcHJlc2VudHMgYSBjb29yZGluYXRlIHBhaXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdIFguXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdIFkuXG4gICAgICovXG4gICAgZnVuY3Rpb24gUG9pbnQoeCwgeSkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBvaW50KTtcblxuICAgICAgdGhpcy54ID0gZ2V0TnVtYmVyKHgpO1xuICAgICAgdGhpcy55ID0gZ2V0TnVtYmVyKHkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHR3byBwb2ludHMgYXJlIGVxdWFsLlxuICAgICAqIEBwYXJhbSB7UG9pbnR9IGEgUG9pbnQgQS5cbiAgICAgKiBAcGFyYW0ge1BvaW50fSBiIFBvaW50IEIuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgX2NyZWF0ZUNsYXNzKFBvaW50LCBudWxsLCBbe1xuICAgICAga2V5OiBcImVxdWFsc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLnggPT09IGIueCAmJiBhLnkgPT09IGIueTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUG9pbnQ7XG4gIH0oKTtcblxuICB2YXIgUmVjdCA9XG4gIC8qI19fUFVSRV9fKi9cbiAgZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciByZXByZXNlbnRpbmcgcmVjdGFuZ3VsYXIgcmVnaW9ucy5cbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtbGlicmFyeS9ibG9iL21hc3Rlci9jbG9zdXJlL2dvb2cvbWF0aC9yZWN0LmpzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggTGVmdC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSBUb3AuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHcgV2lkdGguXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGggSGVpZ2h0LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZCBJZGVudGlmaWVyXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gUmVjdCh4LCB5LCB3LCBoLCBpZCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFJlY3QpO1xuXG4gICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAvKiogQHR5cGUge251bWJlcn0gKi9cblxuICAgICAgdGhpcy5sZWZ0ID0geDtcbiAgICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuXG4gICAgICB0aGlzLnRvcCA9IHk7XG4gICAgICAvKiogQHR5cGUge251bWJlcn0gKi9cblxuICAgICAgdGhpcy53aWR0aCA9IHc7XG4gICAgICAvKiogQHR5cGUge251bWJlcn0gKi9cblxuICAgICAgdGhpcy5oZWlnaHQgPSBoO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdHdvIHJlY3RhbmdsZXMgaW50ZXJzZWN0LlxuICAgICAqIEBwYXJhbSB7UmVjdH0gYSBBIFJlY3RhbmdsZS5cbiAgICAgKiBAcGFyYW0ge1JlY3R9IGIgQSBSZWN0YW5nbGUuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciBhIGFuZCBiIGludGVyc2VjdC5cbiAgICAgKi9cblxuXG4gICAgX2NyZWF0ZUNsYXNzKFJlY3QsIG51bGwsIFt7XG4gICAgICBrZXk6IFwiaW50ZXJzZWN0c1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGludGVyc2VjdHMoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5sZWZ0IDwgYi5sZWZ0ICsgYi53aWR0aCAmJiBiLmxlZnQgPCBhLmxlZnQgKyBhLndpZHRoICYmIGEudG9wIDwgYi50b3AgKyBiLmhlaWdodCAmJiBiLnRvcCA8IGEudG9wICsgYS5oZWlnaHQ7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFJlY3Q7XG4gIH0oKTtcblxuICB2YXIgQ2xhc3NlcyA9IHtcbiAgICBCQVNFOiAnc2h1ZmZsZScsXG4gICAgU0hVRkZMRV9JVEVNOiAnc2h1ZmZsZS1pdGVtJyxcbiAgICBWSVNJQkxFOiAnc2h1ZmZsZS1pdGVtLS12aXNpYmxlJyxcbiAgICBISURERU46ICdzaHVmZmxlLWl0ZW0tLWhpZGRlbidcbiAgfTtcblxuICB2YXIgaWQgPSAwO1xuXG4gIHZhciBTaHVmZmxlSXRlbSA9XG4gIC8qI19fUFVSRV9fKi9cbiAgZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNodWZmbGVJdGVtKGVsZW1lbnQpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTaHVmZmxlSXRlbSk7XG5cbiAgICAgIGlkICs9IDE7XG4gICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgLyoqXG4gICAgICAgKiBVc2VkIHRvIHNlcGFyYXRlIGl0ZW1zIGZvciBsYXlvdXQgYW5kIHNocmluay5cbiAgICAgICAqL1xuXG4gICAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgICAvKipcbiAgICAgICAqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIGEgdHJhbnNpdGlvbiB3aWxsIGhhcHBlbi4gQnkgdGhlIHRpbWUgdGhlIF9sYXlvdXRcbiAgICAgICAqIGFuZCBfc2hyaW5rIG1ldGhvZHMgZ2V0IHRoZSBTaHVmZmxlSXRlbSBpbnN0YW5jZXMsIHRoZSBgaXNWaXNpYmxlYCB2YWx1ZVxuICAgICAgICogaGFzIGFscmVhZHkgYmVlbiBjaGFuZ2VkIGJ5IHRoZSBzZXBhcmF0aW9uIG1ldGhvZHMsIHNvIHRoaXMgcHJvcGVydHkgaXNcbiAgICAgICAqIG5lZWRlZCB0byBrbm93IGlmIHRoZSBpdGVtIHdhcyB2aXNpYmxlL2hpZGRlbiBiZWZvcmUgdGhlIHNocmluay9sYXlvdXQuXG4gICAgICAgKi9cblxuICAgICAgdGhpcy5pc0hpZGRlbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhTaHVmZmxlSXRlbSwgW3tcbiAgICAgIGtleTogXCJzaG93XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc2hvdygpIHtcbiAgICAgICAgdGhpcy5pc1Zpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDbGFzc2VzLkhJRERFTik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKENsYXNzZXMuVklTSUJMRSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImhpZGVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBoaWRlKCkge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDbGFzc2VzLlZJU0lCTEUpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChDbGFzc2VzLkhJRERFTik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImluaXRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICB0aGlzLmFkZENsYXNzZXMoW0NsYXNzZXMuU0hVRkZMRV9JVEVNLCBDbGFzc2VzLlZJU0lCTEVdKTtcbiAgICAgICAgdGhpcy5hcHBseUNzcyhTaHVmZmxlSXRlbS5Dc3MuSU5JVElBTCk7XG4gICAgICAgIHRoaXMuc2NhbGUgPSBTaHVmZmxlSXRlbS5TY2FsZS5WSVNJQkxFO1xuICAgICAgICB0aGlzLnBvaW50ID0gbmV3IFBvaW50KCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImFkZENsYXNzZXNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRDbGFzc2VzKGNsYXNzZXMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBjbGFzc2VzLmZvckVhY2goZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgICAgIF90aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwicmVtb3ZlQ2xhc3Nlc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUNsYXNzZXMoY2xhc3Nlcykge1xuICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICBjbGFzc2VzLmZvckVhY2goZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgICAgIF90aGlzMi5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImFwcGx5Q3NzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYXBwbHlDc3Mob2JqKSB7XG4gICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgX3RoaXMzLmVsZW1lbnQuc3R5bGVba2V5XSA9IG9ialtrZXldO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZGlzcG9zZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRpc3Bvc2UoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2xhc3NlcyhbQ2xhc3Nlcy5ISURERU4sIENsYXNzZXMuVklTSUJMRSwgQ2xhc3Nlcy5TSFVGRkxFX0lURU1dKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gU2h1ZmZsZUl0ZW07XG4gIH0oKTtcblxuICBTaHVmZmxlSXRlbS5Dc3MgPSB7XG4gICAgSU5JVElBTDoge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB0b3A6IDAsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgdmlzaWJpbGl0eTogJ3Zpc2libGUnLFxuICAgICAgd2lsbENoYW5nZTogJ3RyYW5zZm9ybSdcbiAgICB9LFxuICAgIFZJU0lCTEU6IHtcbiAgICAgIGJlZm9yZToge1xuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICB2aXNpYmlsaXR5OiAndmlzaWJsZSdcbiAgICAgIH0sXG4gICAgICBhZnRlcjoge1xuICAgICAgICB0cmFuc2l0aW9uRGVsYXk6ICcnXG4gICAgICB9XG4gICAgfSxcbiAgICBISURERU46IHtcbiAgICAgIGJlZm9yZToge1xuICAgICAgICBvcGFjaXR5OiAwXG4gICAgICB9LFxuICAgICAgYWZ0ZXI6IHtcbiAgICAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbicsXG4gICAgICAgIHRyYW5zaXRpb25EZWxheTogJydcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFNodWZmbGVJdGVtLlNjYWxlID0ge1xuICAgIFZJU0lCTEU6IDEsXG4gICAgSElEREVOOiAwLjAwMVxuICB9O1xuXG4gIHZhciB2YWx1ZSA9IG51bGw7XG4gIHZhciB0ZXN0Q29tcHV0ZWRTaXplID0gKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZS5zdHlsZS5jc3NUZXh0ID0gJ3dpZHRoOjEwcHg7cGFkZGluZzoycHg7Ym94LXNpemluZzpib3JkZXItYm94Oyc7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChlKTtcbiAgICB2YWx1ZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGUsIG51bGwpLndpZHRoID09PSAnMTBweCc7XG4gICAgZWxlbWVudC5yZW1vdmVDaGlsZChlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgY29tcHV0ZWQgc3R5bGUgZm9yIGFuIGVsZW1lbnQsIHBhcnNlZCBhcyBhIGZsb2F0LlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB0byBnZXQgc3R5bGUgZm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgU3R5bGUgcHJvcGVydHkuXG4gICAqIEBwYXJhbSB7Q1NTU3R5bGVEZWNsYXJhdGlvbn0gW3N0eWxlc10gT3B0aW9uYWxseSBpbmNsdWRlIGNsZWFuIHN0eWxlcyB0b1xuICAgKiAgICAgdXNlIGluc3RlYWQgb2YgYXNraW5nIGZvciB0aGVtIGFnYWluLlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBwYXJzZWQgY29tcHV0ZWQgdmFsdWUgb3IgemVybyBpZiB0aGF0IGZhaWxzIGJlY2F1c2UgSUVcbiAgICogICAgIHdpbGwgcmV0dXJuICdhdXRvJyB3aGVuIHRoZSBlbGVtZW50IGRvZXNuJ3QgaGF2ZSBtYXJnaW5zIGluc3RlYWQgb2ZcbiAgICogICAgIHRoZSBjb21wdXRlZCBzdHlsZS5cbiAgICovXG5cbiAgZnVuY3Rpb24gZ2V0TnVtYmVyU3R5bGUoZWxlbWVudCwgc3R5bGUpIHtcbiAgICB2YXIgc3R5bGVzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKTtcbiAgICB2YXIgdmFsdWUgPSBnZXROdW1iZXIoc3R5bGVzW3N0eWxlXSk7IC8vIFN1cHBvcnQgSUU8PTExIGFuZCBXM0Mgc3BlYy5cblxuICAgIGlmICghdGVzdENvbXB1dGVkU2l6ZSgpICYmIHN0eWxlID09PSAnd2lkdGgnKSB7XG4gICAgICB2YWx1ZSArPSBnZXROdW1iZXIoc3R5bGVzLnBhZGRpbmdMZWZ0KSArIGdldE51bWJlcihzdHlsZXMucGFkZGluZ1JpZ2h0KSArIGdldE51bWJlcihzdHlsZXMuYm9yZGVyTGVmdFdpZHRoKSArIGdldE51bWJlcihzdHlsZXMuYm9yZGVyUmlnaHRXaWR0aCk7XG4gICAgfSBlbHNlIGlmICghdGVzdENvbXB1dGVkU2l6ZSgpICYmIHN0eWxlID09PSAnaGVpZ2h0Jykge1xuICAgICAgdmFsdWUgKz0gZ2V0TnVtYmVyKHN0eWxlcy5wYWRkaW5nVG9wKSArIGdldE51bWJlcihzdHlsZXMucGFkZGluZ0JvdHRvbSkgKyBnZXROdW1iZXIoc3R5bGVzLmJvcmRlclRvcFdpZHRoKSArIGdldE51bWJlcihzdHlsZXMuYm9yZGVyQm90dG9tV2lkdGgpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXNoZXItWWF0ZXMgc2h1ZmZsZS5cbiAgICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTYyODkwLzM3MzQyMlxuICAgKiBodHRwczovL2Jvc3Qub2Nrcy5vcmcvbWlrZS9zaHVmZmxlL1xuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBBcnJheSB0byBzaHVmZmxlLlxuICAgKiBAcmV0dXJuIHtBcnJheX0gUmFuZG9tbHkgc29ydGVkIGFycmF5LlxuICAgKi9cbiAgZnVuY3Rpb24gcmFuZG9taXplKGFycmF5KSB7XG4gICAgdmFyIG4gPSBhcnJheS5sZW5ndGg7XG5cbiAgICB3aGlsZSAobikge1xuICAgICAgbiAtPSAxO1xuICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobiArIDEpKTtcbiAgICAgIHZhciB0ZW1wID0gYXJyYXlbaV07XG4gICAgICBhcnJheVtpXSA9IGFycmF5W25dO1xuICAgICAgYXJyYXlbbl0gPSB0ZW1wO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIHZhciBkZWZhdWx0cyA9IHtcbiAgICAvLyBVc2UgYXJyYXkucmV2ZXJzZSgpIHRvIHJldmVyc2UgdGhlIHJlc3VsdHNcbiAgICByZXZlcnNlOiBmYWxzZSxcbiAgICAvLyBTb3J0aW5nIGZ1bmN0aW9uXG4gICAgYnk6IG51bGwsXG4gICAgLy8gQ3VzdG9tIHNvcnQgZnVuY3Rpb25cbiAgICBjb21wYXJlOiBudWxsLFxuICAgIC8vIElmIHRydWUsIHRoaXMgd2lsbCBza2lwIHRoZSBzb3J0aW5nIGFuZCByZXR1cm4gYSByYW5kb21pemVkIG9yZGVyIGluIHRoZSBhcnJheVxuICAgIHJhbmRvbWl6ZTogZmFsc2UsXG4gICAgLy8gRGV0ZXJtaW5lcyB3aGljaCBwcm9wZXJ0eSBvZiBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5IGlzIHBhc3NlZCB0byB0aGVcbiAgICAvLyBzb3J0aW5nIG1ldGhvZC5cbiAgICBrZXk6ICdlbGVtZW50J1xuICB9O1xuICAvKipcbiAgICogWW91IGNhbiByZXR1cm4gYHVuZGVmaW5lZGAgZnJvbSB0aGUgYGJ5YCBmdW5jdGlvbiB0byByZXZlcnQgdG8gRE9NIG9yZGVyLlxuICAgKiBAcGFyYW0ge0FycmF5PFQ+fSBhcnIgQXJyYXkgdG8gc29ydC5cbiAgICogQHBhcmFtIHtTb3J0T3B0aW9uc30gb3B0aW9ucyBTb3J0aW5nIG9wdGlvbnMuXG4gICAqIEByZXR1cm4ge0FycmF5PFQ+fVxuICAgKi9cblxuICBmdW5jdGlvbiBzb3J0ZXIoYXJyLCBvcHRpb25zKSB7XG4gICAgdmFyIG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgdmFyIG9yaWdpbmFsID0gQXJyYXkuZnJvbShhcnIpO1xuICAgIHZhciByZXZlcnQgPSBmYWxzZTtcblxuICAgIGlmICghYXJyLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmIChvcHRzLnJhbmRvbWl6ZSkge1xuICAgICAgcmV0dXJuIHJhbmRvbWl6ZShhcnIpO1xuICAgIH0gLy8gU29ydCB0aGUgZWxlbWVudHMgYnkgdGhlIG9wdHMuYnkgZnVuY3Rpb24uXG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBvcHRzLmJ5LCBkZWZhdWx0IHRvIERPTSBvcmRlclxuXG5cbiAgICBpZiAodHlwZW9mIG9wdHMuYnkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFyci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIC8vIEV4aXQgZWFybHkgaWYgd2UgYWxyZWFkeSBrbm93IHdlIHdhbnQgdG8gcmV2ZXJ0XG4gICAgICAgIGlmIChyZXZlcnQpIHtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2YWxBID0gb3B0cy5ieShhW29wdHMua2V5XSk7XG4gICAgICAgIHZhciB2YWxCID0gb3B0cy5ieShiW29wdHMua2V5XSk7IC8vIElmIGJvdGggdmFsdWVzIGFyZSB1bmRlZmluZWQsIHVzZSB0aGUgRE9NIG9yZGVyXG5cbiAgICAgICAgaWYgKHZhbEEgPT09IHVuZGVmaW5lZCAmJiB2YWxCID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXZlcnQgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbEEgPCB2YWxCIHx8IHZhbEEgPT09ICdzb3J0Rmlyc3QnIHx8IHZhbEIgPT09ICdzb3J0TGFzdCcpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsQSA+IHZhbEIgfHwgdmFsQSA9PT0gJ3NvcnRMYXN0JyB8fCB2YWxCID09PSAnc29ydEZpcnN0Jykge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRzLmNvbXBhcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFyci5zb3J0KG9wdHMuY29tcGFyZSk7XG4gICAgfSAvLyBSZXZlcnQgdG8gdGhlIG9yaWdpbmFsIGFycmF5IGlmIG5lY2Vzc2FyeVxuXG5cbiAgICBpZiAocmV2ZXJ0KSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWw7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMucmV2ZXJzZSkge1xuICAgICAgYXJyLnJldmVyc2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgdmFyIHRyYW5zaXRpb25zID0ge307XG4gIHZhciBldmVudE5hbWUgPSAndHJhbnNpdGlvbmVuZCc7XG4gIHZhciBjb3VudCA9IDA7XG5cbiAgZnVuY3Rpb24gdW5pcXVlSWQoKSB7XG4gICAgY291bnQgKz0gMTtcbiAgICByZXR1cm4gZXZlbnROYW1lICsgY291bnQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWxUcmFuc2l0aW9uRW5kKGlkKSB7XG4gICAgaWYgKHRyYW5zaXRpb25zW2lkXSkge1xuICAgICAgdHJhbnNpdGlvbnNbaWRdLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRyYW5zaXRpb25zW2lkXS5saXN0ZW5lcik7XG4gICAgICB0cmFuc2l0aW9uc1tpZF0gPSBudWxsO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZ1bmN0aW9uIG9uVHJhbnNpdGlvbkVuZChlbGVtZW50LCBjYWxsYmFjaykge1xuICAgIHZhciBpZCA9IHVuaXF1ZUlkKCk7XG5cbiAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiBsaXN0ZW5lcihldnQpIHtcbiAgICAgIGlmIChldnQuY3VycmVudFRhcmdldCA9PT0gZXZ0LnRhcmdldCkge1xuICAgICAgICBjYW5jZWxUcmFuc2l0aW9uRW5kKGlkKTtcbiAgICAgICAgY2FsbGJhY2soZXZ0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgbGlzdGVuZXIpO1xuICAgIHRyYW5zaXRpb25zW2lkXSA9IHtcbiAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgICBsaXN0ZW5lcjogbGlzdGVuZXJcbiAgICB9O1xuICAgIHJldHVybiBpZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5TWF4KGFycmF5KSB7XG4gICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsIGFycmF5KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBwcmVmZXItc3ByZWFkXG4gIH1cblxuICBmdW5jdGlvbiBhcnJheU1pbihhcnJheSkge1xuICAgIHJldHVybiBNYXRoLm1pbi5hcHBseShNYXRoLCBhcnJheSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcHJlZmVyLXNwcmVhZFxuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0aGUgbnVtYmVyIG9mIGNvbHVtbnMgYW4gaXRlbXMgc3BhbnMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpdGVtV2lkdGggV2lkdGggb2YgdGhlIGl0ZW0uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb2x1bW5XaWR0aCBXaWR0aCBvZiB0aGUgY29sdW1uIChpbmNsdWRlcyBndXR0ZXIpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gY29sdW1ucyBUb3RhbCBudW1iZXIgb2YgY29sdW1uc1xuICAgKiBAcGFyYW0ge251bWJlcn0gdGhyZXNob2xkIEEgYnVmZmVyIHZhbHVlIGZvciB0aGUgc2l6ZSBvZiB0aGUgY29sdW1uIHRvIGZpdC5cbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRDb2x1bW5TcGFuKGl0ZW1XaWR0aCwgY29sdW1uV2lkdGgsIGNvbHVtbnMsIHRocmVzaG9sZCkge1xuICAgIHZhciBjb2x1bW5TcGFuID0gaXRlbVdpZHRoIC8gY29sdW1uV2lkdGg7IC8vIElmIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHJvdW5kZWQgY29sdW1uIHNwYW4gbnVtYmVyIGFuZCB0aGVcbiAgICAvLyBjYWxjdWxhdGVkIGNvbHVtbiBzcGFuIG51bWJlciBpcyByZWFsbHkgc21hbGwsIHJvdW5kIHRoZSBudW1iZXIgdG9cbiAgICAvLyBtYWtlIGl0IGZpdC5cblxuICAgIGlmIChNYXRoLmFicyhNYXRoLnJvdW5kKGNvbHVtblNwYW4pIC0gY29sdW1uU3BhbikgPCB0aHJlc2hvbGQpIHtcbiAgICAgIC8vIGUuZy4gY29sdW1uU3BhbiA9IDQuMDA4OTk0NTM5MDI5ODc0NVxuICAgICAgY29sdW1uU3BhbiA9IE1hdGgucm91bmQoY29sdW1uU3Bhbik7XG4gICAgfSAvLyBFbnN1cmUgdGhlIGNvbHVtbiBzcGFuIGlzIG5vdCBtb3JlIHRoYW4gdGhlIGFtb3VudCBvZiBjb2x1bW5zIGluIHRoZSB3aG9sZSBsYXlvdXQuXG5cblxuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLmNlaWwoY29sdW1uU3BhbiksIGNvbHVtbnMpO1xuICB9XG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIGNvbHVtbiBzZXQgdG8gdXNlIGZvciBwbGFjZW1lbnQuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb2x1bW5TcGFuIFRoZSBudW1iZXIgb2YgY29sdW1ucyB0aGlzIGN1cnJlbnQgaXRlbSBzcGFucy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvbHVtbnMgVGhlIHRvdGFsIGNvbHVtbnMgaW4gdGhlIGdyaWQuXG4gICAqIEByZXR1cm4ge0FycmF5LjxudW1iZXI+fSBBbiBhcnJheSBvZiBudW1iZXJzIHJlcHJlc2V0aW5nIHRoZSBjb2x1bW4gc2V0LlxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRBdmFpbGFibGVQb3NpdGlvbnMocG9zaXRpb25zLCBjb2x1bW5TcGFuLCBjb2x1bW5zKSB7XG4gICAgLy8gVGhlIGl0ZW0gc3BhbnMgb25seSBvbmUgY29sdW1uLlxuICAgIGlmIChjb2x1bW5TcGFuID09PSAxKSB7XG4gICAgICByZXR1cm4gcG9zaXRpb25zO1xuICAgIH0gLy8gVGhlIGl0ZW0gc3BhbnMgbW9yZSB0aGFuIG9uZSBjb2x1bW4sIGZpZ3VyZSBvdXQgaG93IG1hbnkgZGlmZmVyZW50XG4gICAgLy8gcGxhY2VzIGl0IGNvdWxkIGZpdCBob3Jpem9udGFsbHkuXG4gICAgLy8gVGhlIGdyb3VwIGNvdW50IGlzIHRoZSBudW1iZXIgb2YgcGxhY2VzIHdpdGhpbiB0aGUgcG9zaXRpb25zIHRoaXMgYmxvY2tcbiAgICAvLyBjb3VsZCBmaXQsIGlnbm9yaW5nIHRoZSBjdXJyZW50IHBvc2l0aW9ucyBvZiBpdGVtcy5cbiAgICAvLyBJbWFnaW5lIGEgMiBjb2x1bW4gYnJpY2sgYXMgdGhlIHNlY29uZCBpdGVtIGluIGEgNCBjb2x1bW4gZ3JpZCB3aXRoXG4gICAgLy8gMTBweCBoZWlnaHQgZWFjaC4gRmluZCB0aGUgcGxhY2VzIGl0IHdvdWxkIGZpdDpcbiAgICAvLyBbMjAsIDEwLCAxMCwgMF1cbiAgICAvLyAgfCAgIHwgICB8XG4gICAgLy8gICogICAqICAgKlxuICAgIC8vXG4gICAgLy8gVGhlbiB0YWtlIHRoZSBwbGFjZXMgd2hpY2ggZml0IGFuZCBnZXQgdGhlIGJpZ2dlciBvZiB0aGUgdHdvOlxuICAgIC8vIG1heChbMjAsIDEwXSksIG1heChbMTAsIDEwXSksIG1heChbMTAsIDBdKSA9IFsyMCwgMTAsIDEwXVxuICAgIC8vXG4gICAgLy8gTmV4dCwgZmluZCB0aGUgZmlyc3Qgc21hbGxlc3QgbnVtYmVyICh0aGUgc2hvcnQgY29sdW1uKS5cbiAgICAvLyBbMjAsIDEwLCAxMF1cbiAgICAvLyAgICAgIHxcbiAgICAvLyAgICAgICpcbiAgICAvL1xuICAgIC8vIEFuZCB0aGF0J3Mgd2hlcmUgaXQgc2hvdWxkIGJlIHBsYWNlZCFcbiAgICAvL1xuICAgIC8vIEFub3RoZXIgZXhhbXBsZSB3aGVyZSB0aGUgc2Vjb25kIGNvbHVtbidzIGl0ZW0gZXh0ZW5kcyBwYXN0IHRoZSBmaXJzdDpcbiAgICAvLyBbMTAsIDIwLCAxMCwgMF0gPT4gWzIwLCAyMCwgMTBdID0+IDEwXG5cblxuICAgIHZhciBhdmFpbGFibGUgPSBbXTsgLy8gRm9yIGhvdyBtYW55IHBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhpcyBpdGVtIHRoZXJlIGFyZS5cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGNvbHVtbnMgLSBjb2x1bW5TcGFuOyBpKyspIHtcbiAgICAgIC8vIEZpbmQgdGhlIGJpZ2dlciB2YWx1ZSBmb3IgZWFjaCBwbGFjZSBpdCBjb3VsZCBmaXQuXG4gICAgICBhdmFpbGFibGUucHVzaChhcnJheU1heChwb3NpdGlvbnMuc2xpY2UoaSwgaSArIGNvbHVtblNwYW4pKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF2YWlsYWJsZTtcbiAgfVxuICAvKipcbiAgICogRmluZCBpbmRleCBvZiBzaG9ydCBjb2x1bW4sIHRoZSBmaXJzdCBmcm9tIHRoZSBsZWZ0IHdoZXJlIHRoaXMgaXRlbSB3aWxsIGdvLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbnMgVGhlIGFycmF5IHRvIHNlYXJjaCBmb3IgdGhlIHNtYWxsZXN0IG51bWJlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJ1ZmZlciBPcHRpb25hbCBidWZmZXIgd2hpY2ggaXMgdmVyeSB1c2VmdWwgd2hlbiB0aGUgaGVpZ2h0XG4gICAqICAgICBpcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHdpZHRoLlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IEluZGV4IG9mIHRoZSBzaG9ydCBjb2x1bW4uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGdldFNob3J0Q29sdW1uKHBvc2l0aW9ucywgYnVmZmVyKSB7XG4gICAgdmFyIG1pblBvc2l0aW9uID0gYXJyYXlNaW4ocG9zaXRpb25zKTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwb3NpdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmIChwb3NpdGlvbnNbaV0gPj0gbWluUG9zaXRpb24gLSBidWZmZXIgJiYgcG9zaXRpb25zW2ldIDw9IG1pblBvc2l0aW9uICsgYnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIGxvY2F0aW9uIG9mIHRoZSBuZXh0IGl0ZW0sIGJhc2VkIG9uIGl0cyBzaXplLlxuICAgKiBAcGFyYW0ge09iamVjdH0gaXRlbVNpemUgT2JqZWN0IHdpdGggd2lkdGggYW5kIGhlaWdodC5cbiAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gcG9zaXRpb25zIFBvc2l0aW9ucyBvZiB0aGUgb3RoZXIgY3VycmVudCBpdGVtcy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGdyaWRTaXplIFRoZSBjb2x1bW4gd2lkdGggb3Igcm93IGhlaWdodC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsIFRoZSB0b3RhbCBudW1iZXIgb2YgY29sdW1ucyBvciByb3dzLlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGhyZXNob2xkIEJ1ZmZlciB2YWx1ZSBmb3IgdGhlIGNvbHVtbiB0byBmaXQuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBidWZmZXIgVmVydGljYWwgYnVmZmVyIGZvciB0aGUgaGVpZ2h0IG9mIGl0ZW1zLlxuICAgKiBAcmV0dXJuIHtQb2ludH1cbiAgICovXG5cbiAgZnVuY3Rpb24gZ2V0SXRlbVBvc2l0aW9uKF9yZWYpIHtcbiAgICB2YXIgaXRlbVNpemUgPSBfcmVmLml0ZW1TaXplLFxuICAgICAgICBwb3NpdGlvbnMgPSBfcmVmLnBvc2l0aW9ucyxcbiAgICAgICAgZ3JpZFNpemUgPSBfcmVmLmdyaWRTaXplLFxuICAgICAgICB0b3RhbCA9IF9yZWYudG90YWwsXG4gICAgICAgIHRocmVzaG9sZCA9IF9yZWYudGhyZXNob2xkLFxuICAgICAgICBidWZmZXIgPSBfcmVmLmJ1ZmZlcjtcbiAgICB2YXIgc3BhbiA9IGdldENvbHVtblNwYW4oaXRlbVNpemUud2lkdGgsIGdyaWRTaXplLCB0b3RhbCwgdGhyZXNob2xkKTtcbiAgICB2YXIgc2V0WSA9IGdldEF2YWlsYWJsZVBvc2l0aW9ucyhwb3NpdGlvbnMsIHNwYW4sIHRvdGFsKTtcbiAgICB2YXIgc2hvcnRDb2x1bW5JbmRleCA9IGdldFNob3J0Q29sdW1uKHNldFksIGJ1ZmZlcik7IC8vIFBvc2l0aW9uIHRoZSBpdGVtXG5cbiAgICB2YXIgcG9pbnQgPSBuZXcgUG9pbnQoZ3JpZFNpemUgKiBzaG9ydENvbHVtbkluZGV4LCBzZXRZW3Nob3J0Q29sdW1uSW5kZXhdKTsgLy8gVXBkYXRlIHRoZSBjb2x1bW5zIGFycmF5IHdpdGggdGhlIG5ldyB2YWx1ZXMgZm9yIGVhY2ggY29sdW1uLlxuICAgIC8vIGUuZy4gYmVmb3JlIHRoZSB1cGRhdGUgdGhlIGNvbHVtbnMgY291bGQgYmUgWzI1MCwgMCwgMCwgMF0gZm9yIGFuIGl0ZW1cbiAgICAvLyB3aGljaCBzcGFucyAyIGNvbHVtbnMuIEFmdGVyIGl0IHdvdWxkIGJlIFsyNTAsIGl0ZW1IZWlnaHQsIGl0ZW1IZWlnaHQsIDBdLlxuXG4gICAgdmFyIHNldEhlaWdodCA9IHNldFlbc2hvcnRDb2x1bW5JbmRleF0gKyBpdGVtU2l6ZS5oZWlnaHQ7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwYW47IGkrKykge1xuICAgICAgcG9zaXRpb25zW3Nob3J0Q29sdW1uSW5kZXggKyBpXSA9IHNldEhlaWdodDtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9pbnQ7XG4gIH1cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGF0dGVtcHRzIHRvIGNlbnRlciBpdGVtcy4gVGhpcyBtZXRob2QgY291bGQgcG90ZW50aWFsbHkgYmUgc2xvd1xuICAgKiB3aXRoIGEgbGFyZ2UgbnVtYmVyIG9mIGl0ZW1zIGJlY2F1c2UgaXQgbXVzdCBwbGFjZSBpdGVtcywgdGhlbiBjaGVjayBldmVyeVxuICAgKiBwcmV2aW91cyBpdGVtIHRvIGVuc3VyZSB0aGVyZSBpcyBubyBvdmVybGFwLlxuICAgKiBAcGFyYW0ge0FycmF5LjxSZWN0Pn0gaXRlbVJlY3RzIEl0ZW0gZGF0YSBvYmplY3RzLlxuICAgKiBAcGFyYW0ge251bWJlcn0gY29udGFpbmVyV2lkdGggV2lkdGggb2YgdGhlIGNvbnRhaW5pbmcgZWxlbWVudC5cbiAgICogQHJldHVybiB7QXJyYXkuPFBvaW50Pn1cbiAgICovXG5cbiAgZnVuY3Rpb24gZ2V0Q2VudGVyZWRQb3NpdGlvbnMoaXRlbVJlY3RzLCBjb250YWluZXJXaWR0aCkge1xuICAgIHZhciByb3dNYXAgPSB7fTsgLy8gUG9wdWxhdGUgcm93cyBieSB0aGVpciBvZmZzZXQgYmVjYXVzZSBpdGVtcyBjb3VsZCBqdW1wIGJldHdlZW4gcm93cyBsaWtlOlxuICAgIC8vIGEgICBjXG4gICAgLy8gIGJiYlxuXG4gICAgaXRlbVJlY3RzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW1SZWN0KSB7XG4gICAgICBpZiAocm93TWFwW2l0ZW1SZWN0LnRvcF0pIHtcbiAgICAgICAgLy8gUHVzaCB0aGUgcG9pbnQgdG8gdGhlIGxhc3Qgcm93IGFycmF5LlxuICAgICAgICByb3dNYXBbaXRlbVJlY3QudG9wXS5wdXNoKGl0ZW1SZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFN0YXJ0IG9mIGEgbmV3IHJvdy5cbiAgICAgICAgcm93TWFwW2l0ZW1SZWN0LnRvcF0gPSBbaXRlbVJlY3RdO1xuICAgICAgfVxuICAgIH0pOyAvLyBGb3IgZWFjaCByb3csIGZpbmQgdGhlIGVuZCBvZiB0aGUgbGFzdCBpdGVtLCB0aGVuIGNhbGN1bGF0ZVxuICAgIC8vIHRoZSByZW1haW5pbmcgc3BhY2UgYnkgZGl2aWRpbmcgaXQgYnkgMi4gVGhlbiBhZGQgdGhhdFxuICAgIC8vIG9mZnNldCB0byB0aGUgeCBwb3NpdGlvbiBvZiBlYWNoIHBvaW50LlxuXG4gICAgdmFyIHJlY3RzID0gW107XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICB2YXIgY2VudGVyZWRSb3dzID0gW107XG4gICAgT2JqZWN0LmtleXMocm93TWFwKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBpdGVtUmVjdHMgPSByb3dNYXBba2V5XTtcbiAgICAgIHJvd3MucHVzaChpdGVtUmVjdHMpO1xuICAgICAgdmFyIGxhc3RJdGVtID0gaXRlbVJlY3RzW2l0ZW1SZWN0cy5sZW5ndGggLSAxXTtcbiAgICAgIHZhciBlbmQgPSBsYXN0SXRlbS5sZWZ0ICsgbGFzdEl0ZW0ud2lkdGg7XG4gICAgICB2YXIgb2Zmc2V0ID0gTWF0aC5yb3VuZCgoY29udGFpbmVyV2lkdGggLSBlbmQpIC8gMik7XG4gICAgICB2YXIgZmluYWxSZWN0cyA9IGl0ZW1SZWN0cztcbiAgICAgIHZhciBjYW5Nb3ZlID0gZmFsc2U7XG5cbiAgICAgIGlmIChvZmZzZXQgPiAwKSB7XG4gICAgICAgIHZhciBuZXdSZWN0cyA9IFtdO1xuICAgICAgICBjYW5Nb3ZlID0gaXRlbVJlY3RzLmV2ZXJ5KGZ1bmN0aW9uIChyKSB7XG4gICAgICAgICAgdmFyIG5ld1JlY3QgPSBuZXcgUmVjdChyLmxlZnQgKyBvZmZzZXQsIHIudG9wLCByLndpZHRoLCByLmhlaWdodCwgci5pZCk7IC8vIENoZWNrIGFsbCBjdXJyZW50IHJlY3RzIHRvIG1ha2Ugc3VyZSBub25lIG92ZXJsYXAuXG5cbiAgICAgICAgICB2YXIgbm9PdmVybGFwID0gIXJlY3RzLnNvbWUoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWN0LmludGVyc2VjdHMobmV3UmVjdCwgcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbmV3UmVjdHMucHVzaChuZXdSZWN0KTtcbiAgICAgICAgICByZXR1cm4gbm9PdmVybGFwO1xuICAgICAgICB9KTsgLy8gSWYgbm9uZSBvZiB0aGUgcmVjdGFuZ2xlcyBvdmVybGFwcGVkLCB0aGUgd2hvbGUgZ3JvdXAgY2FuIGJlIGNlbnRlcmVkLlxuXG4gICAgICAgIGlmIChjYW5Nb3ZlKSB7XG4gICAgICAgICAgZmluYWxSZWN0cyA9IG5ld1JlY3RzO1xuICAgICAgICB9XG4gICAgICB9IC8vIElmIHRoZSBpdGVtcyBhcmUgbm90IGdvaW5nIHRvIGJlIG9mZnNldCwgZW5zdXJlIHRoYXQgdGhlIG9yaWdpbmFsXG4gICAgICAvLyBwbGFjZW1lbnQgZm9yIHRoaXMgcm93IHdpbGwgbm90IG92ZXJsYXAgcHJldmlvdXMgcm93cyAocm93LXNwYW5uaW5nXG4gICAgICAvLyBlbGVtZW50cyBjb3VsZCBiZSBpbiB0aGUgd2F5KS5cblxuXG4gICAgICBpZiAoIWNhbk1vdmUpIHtcbiAgICAgICAgdmFyIGludGVyc2VjdGluZ1JlY3Q7XG4gICAgICAgIHZhciBoYXNPdmVybGFwID0gaXRlbVJlY3RzLnNvbWUoZnVuY3Rpb24gKGl0ZW1SZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlY3RzLnNvbWUoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgICAgIHZhciBpbnRlcnNlY3RzID0gUmVjdC5pbnRlcnNlY3RzKGl0ZW1SZWN0LCByKTtcblxuICAgICAgICAgICAgaWYgKGludGVyc2VjdHMpIHtcbiAgICAgICAgICAgICAgaW50ZXJzZWN0aW5nUmVjdCA9IHI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBpbnRlcnNlY3RzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgLy8gSWYgdGhlcmUgaXMgYW55IG92ZXJsYXAsIHJlcGxhY2UgdGhlIG92ZXJsYXBwaW5nIHJvdyB3aXRoIHRoZSBvcmlnaW5hbC5cblxuICAgICAgICBpZiAoaGFzT3ZlcmxhcCkge1xuICAgICAgICAgIHZhciByb3dJbmRleCA9IGNlbnRlcmVkUm93cy5maW5kSW5kZXgoZnVuY3Rpb24gKGl0ZW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbXMuaW5jbHVkZXMoaW50ZXJzZWN0aW5nUmVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2VudGVyZWRSb3dzLnNwbGljZShyb3dJbmRleCwgMSwgcm93c1tyb3dJbmRleF0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlY3RzID0gcmVjdHMuY29uY2F0KGZpbmFsUmVjdHMpO1xuICAgICAgY2VudGVyZWRSb3dzLnB1c2goZmluYWxSZWN0cyk7XG4gICAgfSk7IC8vIFJlZHVjZSBhcnJheSBvZiBhcnJheXMgdG8gYSBzaW5nbGUgYXJyYXkgb2YgcG9pbnRzLlxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMDg2NTA0Mi8zNzM0MjJcbiAgICAvLyBUaGVuIHJlc2V0IHNvcnQgYmFjayB0byBob3cgdGhlIGl0ZW1zIHdlcmUgcGFzc2VkIHRvIHRoaXMgbWV0aG9kLlxuICAgIC8vIFJlbW92ZSB0aGUgd3JhcHBlciBvYmplY3Qgd2l0aCBpbmRleCwgbWFwIHRvIGEgUG9pbnQuXG5cbiAgICByZXR1cm4gW10uY29uY2F0LmFwcGx5KFtdLCBjZW50ZXJlZFJvd3MpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcHJlZmVyLXNwcmVhZFxuICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gYS5pZCAtIGIuaWQ7XG4gICAgfSkubWFwKGZ1bmN0aW9uIChpdGVtUmVjdCkge1xuICAgICAgcmV0dXJuIG5ldyBQb2ludChpdGVtUmVjdC5sZWZ0LCBpdGVtUmVjdC50b3ApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEh5cGhlbmF0ZXMgYSBqYXZhc2NyaXB0IHN0eWxlIHN0cmluZyB0byBhIGNzcyBvbmUuIEZvciBleGFtcGxlOlxuICAgKiBNb3pCb3hTaXppbmcgLT4gLW1vei1ib3gtc2l6aW5nLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gaHlwaGVuYXRlLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBoeXBoZW5hdGVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGh5cGhlbmF0ZShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24gKHN0ciwgbTEpIHtcbiAgICAgIHJldHVybiBcIi1cIi5jb25jYXQobTEudG9Mb3dlckNhc2UoKSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBhcnJheVVuaXF1ZSh4KSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldCh4KSk7XG4gIH0gLy8gVXNlZCBmb3IgdW5pcXVlIGluc3RhbmNlIHZhcmlhYmxlc1xuXG5cbiAgdmFyIGlkJDEgPSAwO1xuXG4gIHZhciBTaHVmZmxlID1cbiAgLyojX19QVVJFX18qL1xuICBmdW5jdGlvbiAoX1RpbnlFbWl0dGVyKSB7XG4gICAgX2luaGVyaXRzKFNodWZmbGUsIF9UaW55RW1pdHRlcik7XG5cbiAgICAvKipcbiAgICAgKiBDYXRlZ29yaXplLCBzb3J0LCBhbmQgZmlsdGVyIGEgcmVzcG9uc2l2ZSBncmlkIG9mIGl0ZW1zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEFuIGVsZW1lbnQgd2hpY2ggaXMgdGhlIHBhcmVudCBjb250YWluZXIgZm9yIHRoZSBncmlkIGl0ZW1zLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz1TaHVmZmxlLm9wdGlvbnNdIE9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFNodWZmbGUoZWxlbWVudCkge1xuICAgICAgdmFyIF90aGlzO1xuXG4gICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTaHVmZmxlKTtcblxuICAgICAgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoU2h1ZmZsZSkuY2FsbCh0aGlzKSk7XG4gICAgICBfdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgU2h1ZmZsZS5vcHRpb25zLCBvcHRpb25zKTsgLy8gQWxsb3cgbWlzc3BlbGxpbmcgb2YgZGVsaW1pdGVyIHNpbmNlIHRoYXQncyBob3cgaXQgdXNlZCB0byBiZS5cbiAgICAgIC8vIFJlbW92ZSBpbiB2Ni5cblxuICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVsaW1ldGVyKSB7XG4gICAgICAgIF90aGlzLm9wdGlvbnMuZGVsaW1pdGVyID0gX3RoaXMub3B0aW9ucy5kZWxpbWV0ZXI7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmxhc3RTb3J0ID0ge307XG4gICAgICBfdGhpcy5ncm91cCA9IFNodWZmbGUuQUxMX0lURU1TO1xuICAgICAgX3RoaXMubGFzdEZpbHRlciA9IFNodWZmbGUuQUxMX0lURU1TO1xuICAgICAgX3RoaXMuaXNFbmFibGVkID0gdHJ1ZTtcbiAgICAgIF90aGlzLmlzRGVzdHJveWVkID0gZmFsc2U7XG4gICAgICBfdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgICBfdGhpcy5fdHJhbnNpdGlvbnMgPSBbXTtcbiAgICAgIF90aGlzLmlzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xuICAgICAgX3RoaXMuX3F1ZXVlID0gW107XG5cbiAgICAgIHZhciBlbCA9IF90aGlzLl9nZXRFbGVtZW50T3B0aW9uKGVsZW1lbnQpO1xuXG4gICAgICBpZiAoIWVsKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1NodWZmbGUgbmVlZHMgdG8gYmUgaW5pdGlhbGl6ZWQgd2l0aCBhbiBlbGVtZW50LicpO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgICBfdGhpcy5pZCA9ICdzaHVmZmxlXycgKyBpZCQxO1xuICAgICAgaWQkMSArPSAxO1xuXG4gICAgICBfdGhpcy5faW5pdCgpO1xuXG4gICAgICBfdGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoU2h1ZmZsZSwgW3tcbiAgICAgIGtleTogXCJfaW5pdFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9pbml0KCkge1xuICAgICAgICB0aGlzLml0ZW1zID0gdGhpcy5fZ2V0SXRlbXMoKTtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNpemVyID0gdGhpcy5fZ2V0RWxlbWVudE9wdGlvbih0aGlzLm9wdGlvbnMuc2l6ZXIpOyAvLyBBZGQgY2xhc3MgYW5kIGludmFsaWRhdGUgc3R5bGVzXG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoU2h1ZmZsZS5DbGFzc2VzLkJBU0UpOyAvLyBTZXQgaW5pdGlhbCBjc3MgZm9yIGVhY2ggaXRlbVxuXG4gICAgICAgIHRoaXMuX2luaXRJdGVtcyh0aGlzLml0ZW1zKTsgLy8gQmluZCByZXNpemUgZXZlbnRzXG5cblxuICAgICAgICB0aGlzLl9vblJlc2l6ZSA9IHRoaXMuX2dldFJlc2l6ZUZ1bmN0aW9uKCk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vblJlc2l6ZSk7IC8vIElmIHRoZSBwYWdlIGhhcyBub3QgYWxyZWFkeSBlbWl0dGVkIHRoZSBgbG9hZGAgZXZlbnQsIGNhbGwgbGF5b3V0IG9uIGxvYWQuXG4gICAgICAgIC8vIFRoaXMgYXZvaWRzIGxheW91dCBpc3N1ZXMgY2F1c2VkIGJ5IGltYWdlcyBhbmQgZm9udHMgbG9hZGluZyBhZnRlciB0aGVcbiAgICAgICAgLy8gaW5zdGFuY2UgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXG5cbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICB2YXIgbGF5b3V0ID0gdGhpcy5sYXlvdXQuYmluZCh0aGlzKTtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkKTtcbiAgICAgICAgICAgIGxheW91dCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IC8vIEdldCBjb250YWluZXIgY3NzIGFsbCBpbiBvbmUgcmVxdWVzdC4gQ2F1c2VzIHJlZmxvd1xuXG5cbiAgICAgICAgdmFyIGNvbnRhaW5lckNzcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCwgbnVsbCk7XG4gICAgICAgIHZhciBjb250YWluZXJXaWR0aCA9IFNodWZmbGUuZ2V0U2l6ZSh0aGlzLmVsZW1lbnQpLndpZHRoOyAvLyBBZGQgc3R5bGVzIHRvIHRoZSBjb250YWluZXIgaWYgaXQgZG9lc24ndCBoYXZlIHRoZW0uXG5cbiAgICAgICAgdGhpcy5fdmFsaWRhdGVTdHlsZXMoY29udGFpbmVyQ3NzKTsgLy8gV2UgYWxyZWFkeSBnb3QgdGhlIGNvbnRhaW5lcidzIHdpZHRoIGFib3ZlLCBubyBuZWVkIHRvIGNhdXNlIGFub3RoZXJcbiAgICAgICAgLy8gcmVmbG93IGdldHRpbmcgaXQgYWdhaW4uLi4gQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2YgY29sdW1ucyB0aGVyZSB3aWxsIGJlXG5cblxuICAgICAgICB0aGlzLl9zZXRDb2x1bW5zKGNvbnRhaW5lcldpZHRoKTsgLy8gS2ljayBvZmYhXG5cblxuICAgICAgICB0aGlzLmZpbHRlcih0aGlzLm9wdGlvbnMuZ3JvdXAsIHRoaXMub3B0aW9ucy5pbml0aWFsU29ydCk7IC8vIFRoZSBzaHVmZmxlIGl0ZW1zIGhhdmVuJ3QgaGFkIHRyYW5zaXRpb25zIHNldCBvbiB0aGVtIHlldCBzbyB0aGUgdXNlclxuICAgICAgICAvLyBkb2Vzbid0IHNlZSB0aGUgZmlyc3QgbGF5b3V0LiBTZXQgdGhlbSBub3cgdGhhdCB0aGUgZmlyc3QgbGF5b3V0IGlzIGRvbmUuXG4gICAgICAgIC8vIEZpcnN0LCBob3dldmVyLCBhIHN5bmNocm9ub3VzIGxheW91dCBtdXN0IGJlIGNhdXNlZCBmb3IgdGhlIHByZXZpb3VzXG4gICAgICAgIC8vIHN0eWxlcyB0byBiZSBhcHBsaWVkIHdpdGhvdXQgdHJhbnNpdGlvbnMuXG5cbiAgICAgICAgdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuXG4gICAgICAgIHRoaXMuc2V0SXRlbVRyYW5zaXRpb25zKHRoaXMuaXRlbXMpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IFwiaGVpZ2h0IFwiLmNvbmNhdCh0aGlzLm9wdGlvbnMuc3BlZWQsIFwibXMgXCIpLmNvbmNhdCh0aGlzLm9wdGlvbnMuZWFzaW5nKTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyBhIHRocm90dGxlZCBhbmQgcHJveGllZCBmdW5jdGlvbiBmb3IgdGhlIHJlc2l6ZSBoYW5kbGVyLlxuICAgICAgICogQHJldHVybiB7ZnVuY3Rpb259XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldFJlc2l6ZUZ1bmN0aW9uXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFJlc2l6ZUZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVzaXplRnVuY3Rpb24gPSB0aGlzLl9oYW5kbGVSZXNpemUuYmluZCh0aGlzKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnRocm90dGxlID8gdGhpcy5vcHRpb25zLnRocm90dGxlKHJlc2l6ZUZ1bmN0aW9uLCB0aGlzLm9wdGlvbnMudGhyb3R0bGVUaW1lKSA6IHJlc2l6ZUZ1bmN0aW9uO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXRyaWV2ZSBhbiBlbGVtZW50IGZyb20gYW4gb3B0aW9uLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd8alF1ZXJ5fEVsZW1lbnR9IG9wdGlvbiBUaGUgb3B0aW9uIHRvIGNoZWNrLlxuICAgICAgICogQHJldHVybiB7P0VsZW1lbnR9IFRoZSBwbGFpbiBlbGVtZW50IG9yIG51bGwuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldEVsZW1lbnRPcHRpb25cIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0RWxlbWVudE9wdGlvbihvcHRpb24pIHtcbiAgICAgICAgLy8gSWYgY29sdW1uIHdpZHRoIGlzIGEgc3RyaW5nLCB0cmVhdCBpcyBhcyBhIHNlbGVjdG9yIGFuZCBzZWFyY2ggZm9yIHRoZVxuICAgICAgICAvLyBzaXplciBlbGVtZW50IHdpdGhpbiB0aGUgb3V0ZXJtb3N0IGNvbnRhaW5lclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9uKTtcbiAgICAgICAgfSAvLyBDaGVjayBmb3IgYW4gZWxlbWVudFxuXG5cbiAgICAgICAgaWYgKG9wdGlvbiAmJiBvcHRpb24ubm9kZVR5cGUgJiYgb3B0aW9uLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgcmV0dXJuIG9wdGlvbjtcbiAgICAgICAgfSAvLyBDaGVjayBmb3IgalF1ZXJ5IG9iamVjdFxuXG5cbiAgICAgICAgaWYgKG9wdGlvbiAmJiBvcHRpb24uanF1ZXJ5KSB7XG4gICAgICAgICAgcmV0dXJuIG9wdGlvblswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBFbnN1cmVzIHRoZSBzaHVmZmxlIGNvbnRhaW5lciBoYXMgdGhlIGNzcyBzdHlsZXMgaXQgbmVlZHMgYXBwbGllZCB0byBpdC5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZXMgS2V5IHZhbHVlIHBhaXJzIGZvciBwb3NpdGlvbiBhbmQgb3ZlcmZsb3cuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3ZhbGlkYXRlU3R5bGVzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3ZhbGlkYXRlU3R5bGVzKHN0eWxlcykge1xuICAgICAgICAvLyBQb3NpdGlvbiBjYW5ub3QgYmUgc3RhdGljLlxuICAgICAgICBpZiAoc3R5bGVzLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICAgIH0gLy8gT3ZlcmZsb3cgaGFzIHRvIGJlIGhpZGRlbi5cblxuXG4gICAgICAgIGlmIChzdHlsZXMub3ZlcmZsb3cgIT09ICdoaWRkZW4nKSB7XG4gICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogRmlsdGVyIHRoZSBlbGVtZW50cyBieSBhIGNhdGVnb3J5LlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW118ZnVuY3Rpb24oRWxlbWVudCk6Ym9vbGVhbn0gW2NhdGVnb3J5XSBDYXRlZ29yeSB0b1xuICAgICAgICogICAgIGZpbHRlciBieS4gSWYgaXQncyBnaXZlbiwgdGhlIGxhc3QgY2F0ZWdvcnkgd2lsbCBiZSB1c2VkIHRvIGZpbHRlciB0aGUgaXRlbXMuXG4gICAgICAgKiBAcGFyYW0ge0FycmF5fSBbY29sbGVjdGlvbl0gT3B0aW9uYWxseSBmaWx0ZXIgYSBjb2xsZWN0aW9uLiBEZWZhdWx0cyB0b1xuICAgICAgICogICAgIGFsbCB0aGUgaXRlbXMuXG4gICAgICAgKiBAcmV0dXJuIHt7dmlzaWJsZTogU2h1ZmZsZUl0ZW1bXSwgaGlkZGVuOiBTaHVmZmxlSXRlbVtdfX1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZmlsdGVyXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2ZpbHRlcigpIHtcbiAgICAgICAgdmFyIGNhdGVnb3J5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0aGlzLmxhc3RGaWx0ZXI7XG4gICAgICAgIHZhciBjb2xsZWN0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLml0ZW1zO1xuXG4gICAgICAgIHZhciBzZXQgPSB0aGlzLl9nZXRGaWx0ZXJlZFNldHMoY2F0ZWdvcnksIGNvbGxlY3Rpb24pOyAvLyBJbmRpdmlkdWFsbHkgYWRkL3JlbW92ZSBoaWRkZW4vdmlzaWJsZSBjbGFzc2VzXG5cblxuICAgICAgICB0aGlzLl90b2dnbGVGaWx0ZXJDbGFzc2VzKHNldCk7IC8vIFNhdmUgdGhlIGxhc3QgZmlsdGVyIGluIGNhc2UgZWxlbWVudHMgYXJlIGFwcGVuZGVkLlxuXG5cbiAgICAgICAgdGhpcy5sYXN0RmlsdGVyID0gY2F0ZWdvcnk7IC8vIFRoaXMgaXMgc2F2ZWQgbWFpbmx5IGJlY2F1c2UgcHJvdmlkaW5nIGEgZmlsdGVyIGZ1bmN0aW9uIChsaWtlIHNlYXJjaGluZylcbiAgICAgICAgLy8gd2lsbCBvdmVyd3JpdGUgdGhlIGBsYXN0RmlsdGVyYCBwcm9wZXJ0eSBldmVyeSB0aW1lIGl0cyBjYWxsZWQuXG5cbiAgICAgICAgaWYgKHR5cGVvZiBjYXRlZ29yeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLmdyb3VwID0gY2F0ZWdvcnk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2V0O1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSB2aXNpYmxlIGFuZCBoaWRkZW4gZWxlbWVudHMuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXXxmdW5jdGlvbihFbGVtZW50KTpib29sZWFufSBjYXRlZ29yeSBDYXRlZ29yeSBvciBmdW5jdGlvbiB0byBmaWx0ZXIgYnkuXG4gICAgICAgKiBAcGFyYW0ge1NodWZmbGVJdGVtW119IGl0ZW1zIEEgY29sbGVjdGlvbiBvZiBpdGVtcyB0byBmaWx0ZXIuXG4gICAgICAgKiBAcmV0dXJuIHt7dmlzaWJsZTogU2h1ZmZsZUl0ZW1bXSwgaGlkZGVuOiBTaHVmZmxlSXRlbVtdfX1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0RmlsdGVyZWRTZXRzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldEZpbHRlcmVkU2V0cyhjYXRlZ29yeSwgaXRlbXMpIHtcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHZpc2libGUgPSBbXTtcbiAgICAgICAgdmFyIGhpZGRlbiA9IFtdOyAvLyBjYXRlZ29yeSA9PT0gJ2FsbCcsIGFkZCB2aXNpYmxlIGNsYXNzIHRvIGV2ZXJ5dGhpbmdcblxuICAgICAgICBpZiAoY2F0ZWdvcnkgPT09IFNodWZmbGUuQUxMX0lURU1TKSB7XG4gICAgICAgICAgdmlzaWJsZSA9IGl0ZW1zOyAvLyBMb29wIHRocm91Z2ggZWFjaCBpdGVtIGFuZCB1c2UgcHJvdmlkZWQgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lXG4gICAgICAgICAgLy8gd2hldGhlciB0byBoaWRlIGl0IG9yIG5vdC5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMyLl9kb2VzUGFzc0ZpbHRlcihjYXRlZ29yeSwgaXRlbS5lbGVtZW50KSkge1xuICAgICAgICAgICAgICB2aXNpYmxlLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBoaWRkZW4ucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmlzaWJsZTogdmlzaWJsZSxcbiAgICAgICAgICBoaWRkZW46IGhpZGRlblxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBUZXN0IGFuIGl0ZW0gdG8gc2VlIGlmIGl0IHBhc3NlcyBhIGNhdGVnb3J5LlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW118ZnVuY3Rpb24oKTpib29sZWFufSBjYXRlZ29yeSBDYXRlZ29yeSBvciBmdW5jdGlvbiB0byBmaWx0ZXIgYnkuXG4gICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgQW4gZWxlbWVudCB0byB0ZXN0LlxuICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciBpdCBwYXNzZXMgdGhlIGNhdGVnb3J5L2ZpbHRlci5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZG9lc1Bhc3NGaWx0ZXJcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZG9lc1Bhc3NGaWx0ZXIoY2F0ZWdvcnksIGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYXRlZ29yeSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBjYXRlZ29yeS5jYWxsKGVsZW1lbnQsIGVsZW1lbnQsIHRoaXMpO1xuICAgICAgICB9IC8vIENoZWNrIGVhY2ggZWxlbWVudCdzIGRhdGEtZ3JvdXBzIGF0dHJpYnV0ZSBhZ2FpbnN0IHRoZSBnaXZlbiBjYXRlZ29yeS5cblxuXG4gICAgICAgIHZhciBhdHRyID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIFNodWZmbGUuRklMVEVSX0FUVFJJQlVURV9LRVkpO1xuICAgICAgICB2YXIga2V5cyA9IHRoaXMub3B0aW9ucy5kZWxpbWl0ZXIgPyBhdHRyLnNwbGl0KHRoaXMub3B0aW9ucy5kZWxpbWl0ZXIpIDogSlNPTi5wYXJzZShhdHRyKTtcblxuICAgICAgICBmdW5jdGlvbiB0ZXN0Q2F0ZWdvcnkoY2F0ZWdvcnkpIHtcbiAgICAgICAgICByZXR1cm4ga2V5cy5pbmNsdWRlcyhjYXRlZ29yeSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjYXRlZ29yeSkpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZpbHRlck1vZGUgPT09IFNodWZmbGUuRmlsdGVyTW9kZS5BTlkpIHtcbiAgICAgICAgICAgIHJldHVybiBjYXRlZ29yeS5zb21lKHRlc3RDYXRlZ29yeSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGNhdGVnb3J5LmV2ZXJ5KHRlc3RDYXRlZ29yeSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5cy5pbmNsdWRlcyhjYXRlZ29yeSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFRvZ2dsZXMgdGhlIHZpc2libGUgYW5kIGhpZGRlbiBjbGFzcyBuYW1lcy5cbiAgICAgICAqIEBwYXJhbSB7e3Zpc2libGUsIGhpZGRlbn19IE9iamVjdCB3aXRoIHZpc2libGUgYW5kIGhpZGRlbiBhcnJheXMuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3RvZ2dsZUZpbHRlckNsYXNzZXNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfdG9nZ2xlRmlsdGVyQ2xhc3NlcyhfcmVmKSB7XG4gICAgICAgIHZhciB2aXNpYmxlID0gX3JlZi52aXNpYmxlLFxuICAgICAgICAgICAgaGlkZGVuID0gX3JlZi5oaWRkZW47XG4gICAgICAgIHZpc2libGUuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIGl0ZW0uc2hvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaGlkZGVuLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICBpdGVtLmhpZGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFNldCB0aGUgaW5pdGlhbCBjc3MgZm9yIGVhY2ggaXRlbVxuICAgICAgICogQHBhcmFtIHtTaHVmZmxlSXRlbVtdfSBpdGVtcyBTZXQgdG8gaW5pdGlhbGl6ZS5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfaW5pdEl0ZW1zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2luaXRJdGVtcyhpdGVtcykge1xuICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgaXRlbS5pbml0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmUgZWxlbWVudCByZWZlcmVuY2UgYW5kIHN0eWxlcy5cbiAgICAgICAqIEBwYXJhbSB7U2h1ZmZsZUl0ZW1bXX0gaXRlbXMgU2V0IHRvIGRpc3Bvc2UuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2Rpc3Bvc2VJdGVtc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9kaXNwb3NlSXRlbXMoaXRlbXMpIHtcbiAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIGl0ZW0uZGlzcG9zZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogVXBkYXRlcyB0aGUgdmlzaWJsZSBpdGVtIGNvdW50LlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl91cGRhdGVJdGVtQ291bnRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfdXBkYXRlSXRlbUNvdW50KCkge1xuICAgICAgICB0aGlzLnZpc2libGVJdGVtcyA9IHRoaXMuX2dldEZpbHRlcmVkSXRlbXMoKS5sZW5ndGg7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFNldHMgY3NzIHRyYW5zZm9ybSB0cmFuc2l0aW9uIG9uIGEgZ3JvdXAgb2YgZWxlbWVudHMuIFRoaXMgaXMgbm90IGV4ZWN1dGVkXG4gICAgICAgKiBhdCB0aGUgc2FtZSB0aW1lIGFzIGBpdGVtLmluaXRgIHNvIHRoYXQgdHJhbnNpdGlvbnMgZG9uJ3Qgb2NjdXIgdXBvblxuICAgICAgICogaW5pdGlhbGl6YXRpb24gb2YgYSBuZXcgU2h1ZmZsZSBpbnN0YW5jZS5cbiAgICAgICAqIEBwYXJhbSB7U2h1ZmZsZUl0ZW1bXX0gaXRlbXMgU2h1ZmZsZSBpdGVtcyB0byBzZXQgdHJhbnNpdGlvbnMgb24uXG4gICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJzZXRJdGVtVHJhbnNpdGlvbnNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRJdGVtVHJhbnNpdGlvbnMoaXRlbXMpIHtcbiAgICAgICAgdmFyIF90aGlzJG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICBzcGVlZCA9IF90aGlzJG9wdGlvbnMuc3BlZWQsXG4gICAgICAgICAgICBlYXNpbmcgPSBfdGhpcyRvcHRpb25zLmVhc2luZztcbiAgICAgICAgdmFyIHBvc2l0aW9uUHJvcHMgPSB0aGlzLm9wdGlvbnMudXNlVHJhbnNmb3JtcyA/IFsndHJhbnNmb3JtJ10gOiBbJ3RvcCcsICdsZWZ0J107IC8vIEFsbG93IHVzZXJzIHRvIHRyYW5zdGlvbiBvdGhlciBwcm9wZXJ0aWVzIGlmIHRoZXkgZXhpc3QgaW4gdGhlIGBiZWZvcmVgXG4gICAgICAgIC8vIGNzcyBtYXBwaW5nIG9mIHRoZSBzaHVmZmxlIGl0ZW0uXG5cbiAgICAgICAgdmFyIGNzc1Byb3BzID0gT2JqZWN0LmtleXMoU2h1ZmZsZUl0ZW0uQ3NzLkhJRERFTi5iZWZvcmUpLm1hcChmdW5jdGlvbiAoaykge1xuICAgICAgICAgIHJldHVybiBoeXBoZW5hdGUoayk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHBvc2l0aW9uUHJvcHMuY29uY2F0KGNzc1Byb3BzKS5qb2luKCk7XG4gICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICBpdGVtLmVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gc3BlZWQgKyAnbXMnO1xuICAgICAgICAgIGl0ZW0uZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uVGltaW5nRnVuY3Rpb24gPSBlYXNpbmc7XG4gICAgICAgICAgaXRlbS5lbGVtZW50LnN0eWxlLnRyYW5zaXRpb25Qcm9wZXJ0eSA9IHByb3BlcnRpZXM7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0SXRlbXNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0SXRlbXMoKSB7XG4gICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5jaGlsZHJlbikuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIHJldHVybiBtYXRjaGVzU2VsZWN0b3IoZWwsIF90aGlzMy5vcHRpb25zLml0ZW1TZWxlY3Rvcik7XG4gICAgICAgIH0pLm1hcChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFNodWZmbGVJdGVtKGVsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIENvbWJpbmUgdGhlIGN1cnJlbnQgaXRlbXMgYXJyYXkgd2l0aCBhIG5ldyBvbmUgYW5kIHNvcnQgaXQgYnkgRE9NIG9yZGVyLlxuICAgICAgICogQHBhcmFtIHtTaHVmZmxlSXRlbVtdfSBpdGVtcyBJdGVtcyB0byB0cmFjay5cbiAgICAgICAqIEByZXR1cm4ge1NodWZmbGVJdGVtW119XG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfbWVyZ2VOZXdJdGVtc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9tZXJnZU5ld0l0ZW1zKGl0ZW1zKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50LmNoaWxkcmVuKTtcbiAgICAgICAgcmV0dXJuIHNvcnRlcih0aGlzLml0ZW1zLmNvbmNhdChpdGVtcyksIHtcbiAgICAgICAgICBieTogZnVuY3Rpb24gYnkoZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuLmluZGV4T2YoZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldEZpbHRlcmVkSXRlbXNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0RmlsdGVyZWRJdGVtcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uaXNWaXNpYmxlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldENvbmNlYWxlZEl0ZW1zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldENvbmNlYWxlZEl0ZW1zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gIWl0ZW0uaXNWaXNpYmxlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0aGUgY29sdW1uIHNpemUsIGJhc2VkIG9uIGNvbHVtbiB3aWR0aCBhbmQgc2l6ZXIgb3B0aW9ucy5cbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb250YWluZXJXaWR0aCBTaXplIG9mIHRoZSBwYXJlbnQgY29udGFpbmVyLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGd1dHRlclNpemUgU2l6ZSBvZiB0aGUgZ3V0dGVycy5cbiAgICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0Q29sdW1uU2l6ZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRDb2x1bW5TaXplKGNvbnRhaW5lcldpZHRoLCBndXR0ZXJTaXplKSB7XG4gICAgICAgIHZhciBzaXplOyAvLyBJZiB0aGUgY29sdW1uV2lkdGggcHJvcGVydHkgaXMgYSBmdW5jdGlvbiwgdGhlbiB0aGUgZ3JpZCBpcyBmbHVpZFxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmNvbHVtbldpZHRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgc2l6ZSA9IHRoaXMub3B0aW9ucy5jb2x1bW5XaWR0aChjb250YWluZXJXaWR0aCk7IC8vIGNvbHVtbldpZHRoIG9wdGlvbiBpc24ndCBhIGZ1bmN0aW9uLCBhcmUgdGhleSB1c2luZyBhIHNpemluZyBlbGVtZW50P1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zaXplcikge1xuICAgICAgICAgIHNpemUgPSBTaHVmZmxlLmdldFNpemUodGhpcy5vcHRpb25zLnNpemVyKS53aWR0aDsgLy8gaWYgbm90LCBob3cgYWJvdXQgdGhlIGV4cGxpY2l0bHkgc2V0IG9wdGlvbj9cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuY29sdW1uV2lkdGgpIHtcbiAgICAgICAgICBzaXplID0gdGhpcy5vcHRpb25zLmNvbHVtbldpZHRoOyAvLyBvciB1c2UgdGhlIHNpemUgb2YgdGhlIGZpcnN0IGl0ZW1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBzaXplID0gU2h1ZmZsZS5nZXRTaXplKHRoaXMuaXRlbXNbMF0uZWxlbWVudCwgdHJ1ZSkud2lkdGg7IC8vIGlmIHRoZXJlJ3Mgbm8gaXRlbXMsIHVzZSBzaXplIG9mIGNvbnRhaW5lclxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNpemUgPSBjb250YWluZXJXaWR0aDtcbiAgICAgICAgfSAvLyBEb24ndCBsZXQgdGhlbSBzZXQgYSBjb2x1bW4gd2lkdGggb2YgemVyby5cblxuXG4gICAgICAgIGlmIChzaXplID09PSAwKSB7XG4gICAgICAgICAgc2l6ZSA9IGNvbnRhaW5lcldpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNpemUgKyBndXR0ZXJTaXplO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRoZSBndXR0ZXIgc2l6ZSwgYmFzZWQgb24gZ3V0dGVyIHdpZHRoIGFuZCBzaXplciBvcHRpb25zLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbnRhaW5lcldpZHRoIFNpemUgb2YgdGhlIHBhcmVudCBjb250YWluZXIuXG4gICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldEd1dHRlclNpemVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0R3V0dGVyU2l6ZShjb250YWluZXJXaWR0aCkge1xuICAgICAgICB2YXIgc2l6ZTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5ndXR0ZXJXaWR0aCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHNpemUgPSB0aGlzLm9wdGlvbnMuZ3V0dGVyV2lkdGgoY29udGFpbmVyV2lkdGgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zaXplcikge1xuICAgICAgICAgIHNpemUgPSBnZXROdW1iZXJTdHlsZSh0aGlzLm9wdGlvbnMuc2l6ZXIsICdtYXJnaW5MZWZ0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2l6ZSA9IHRoaXMub3B0aW9ucy5ndXR0ZXJXaWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaXplO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBjb2x1bW5zIHRvIGJlIHVzZWQuIEdldHMgY3NzIGlmIHVzaW5nIHNpemVyIGVsZW1lbnQuXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gW2NvbnRhaW5lcldpZHRoXSBPcHRpb25hbGx5IHNwZWNpZnkgYSBjb250YWluZXIgd2lkdGggaWZcbiAgICAgICAqICAgIGl0J3MgYWxyZWFkeSBhdmFpbGFibGUuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfc2V0Q29sdW1uc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zZXRDb2x1bW5zKCkge1xuICAgICAgICB2YXIgY29udGFpbmVyV2lkdGggPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFNodWZmbGUuZ2V0U2l6ZSh0aGlzLmVsZW1lbnQpLndpZHRoO1xuXG4gICAgICAgIHZhciBndXR0ZXIgPSB0aGlzLl9nZXRHdXR0ZXJTaXplKGNvbnRhaW5lcldpZHRoKTtcblxuICAgICAgICB2YXIgY29sdW1uV2lkdGggPSB0aGlzLl9nZXRDb2x1bW5TaXplKGNvbnRhaW5lcldpZHRoLCBndXR0ZXIpO1xuXG4gICAgICAgIHZhciBjYWxjdWxhdGVkQ29sdW1ucyA9IChjb250YWluZXJXaWR0aCArIGd1dHRlcikgLyBjb2x1bW5XaWR0aDsgLy8gV2lkdGhzIGdpdmVuIGZyb20gZ2V0U3R5bGVzIGFyZSBub3QgcHJlY2lzZSBlbm91Z2guLi5cblxuICAgICAgICBpZiAoTWF0aC5hYnMoTWF0aC5yb3VuZChjYWxjdWxhdGVkQ29sdW1ucykgLSBjYWxjdWxhdGVkQ29sdW1ucykgPCB0aGlzLm9wdGlvbnMuY29sdW1uVGhyZXNob2xkKSB7XG4gICAgICAgICAgLy8gZS5nLiBjYWxjdWxhdGVkQ29sdW1ucyA9IDExLjk5ODg3NlxuICAgICAgICAgIGNhbGN1bGF0ZWRDb2x1bW5zID0gTWF0aC5yb3VuZChjYWxjdWxhdGVkQ29sdW1ucyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbHMgPSBNYXRoLm1heChNYXRoLmZsb29yKGNhbGN1bGF0ZWRDb2x1bW5zIHx8IDApLCAxKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJXaWR0aCA9IGNvbnRhaW5lcldpZHRoO1xuICAgICAgICB0aGlzLmNvbFdpZHRoID0gY29sdW1uV2lkdGg7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEFkanVzdCB0aGUgaGVpZ2h0IG9mIHRoZSBncmlkXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfc2V0Q29udGFpbmVyU2l6ZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zZXRDb250YWluZXJTaXplKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5fZ2V0Q29udGFpbmVyU2l6ZSgpICsgJ3B4JztcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogQmFzZWQgb24gdGhlIGNvbHVtbiBoZWlnaHRzLCBpdCByZXR1cm5zIHRoZSBiaWdnZXN0IG9uZS5cbiAgICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0Q29udGFpbmVyU2l6ZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRDb250YWluZXJTaXplKCkge1xuICAgICAgICByZXR1cm4gYXJyYXlNYXgodGhpcy5wb3NpdGlvbnMpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgdGhlIGNsYW1wZWQgc3RhZ2dlciBhbW91bnQuXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW5kZXggb2YgdGhlIGl0ZW0gdG8gYmUgc3RhZ2dlcmVkLlxuICAgICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldFN0YWdnZXJBbW91bnRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0U3RhZ2dlckFtb3VudChpbmRleCkge1xuICAgICAgICByZXR1cm4gTWF0aC5taW4oaW5kZXggKiB0aGlzLm9wdGlvbnMuc3RhZ2dlckFtb3VudCwgdGhpcy5vcHRpb25zLnN0YWdnZXJBbW91bnRNYXgpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBFbWl0IGFuIGV2ZW50IGZyb20gdGhpcyBpbnN0YW5jZS5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIEV2ZW50IG5hbWUuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gW2RhdGE9e31dIE9wdGlvbmFsIG9iamVjdCBkYXRhLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2Rpc3BhdGNoXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2Rpc3BhdGNoKG5hbWUpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgICAgIGlmICh0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YS5zaHVmZmxlID0gdGhpcztcbiAgICAgICAgdGhpcy5lbWl0KG5hbWUsIGRhdGEpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBaZXJvcyBvdXQgdGhlIHkgY29sdW1ucyBhcnJheSwgd2hpY2ggaXMgdXNlZCB0byBkZXRlcm1pbmUgaXRlbSBwbGFjZW1lbnQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3Jlc2V0Q29sc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9yZXNldENvbHMoKSB7XG4gICAgICAgIHZhciBpID0gdGhpcy5jb2xzO1xuICAgICAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xuXG4gICAgICAgIHdoaWxlIChpKSB7XG4gICAgICAgICAgaSAtPSAxO1xuICAgICAgICAgIHRoaXMucG9zaXRpb25zLnB1c2goMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogTG9vcHMgdGhyb3VnaCBlYWNoIGl0ZW0gdGhhdCBzaG91bGQgYmUgc2hvd24gYW5kIGNhbGN1bGF0ZXMgdGhlIHgsIHkgcG9zaXRpb24uXG4gICAgICAgKiBAcGFyYW0ge1NodWZmbGVJdGVtW119IGl0ZW1zIEFycmF5IG9mIGl0ZW1zIHRoYXQgd2lsbCBiZSBzaG93bi9sYXllZFxuICAgICAgICogICAgIG91dCBpbiBvcmRlciBpbiB0aGVpciBhcnJheS5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9sYXlvdXRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfbGF5b3V0KGl0ZW1zKSB7XG4gICAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICAgIHZhciBpdGVtUG9zaXRpb25zID0gdGhpcy5fZ2V0TmV4dFBvc2l0aW9ucyhpdGVtcyk7XG5cbiAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgIGZ1bmN0aW9uIGNhbGxiYWNrKCkge1xuICAgICAgICAgICAgaXRlbS5hcHBseUNzcyhTaHVmZmxlSXRlbS5Dc3MuVklTSUJMRS5hZnRlcik7XG4gICAgICAgICAgfSAvLyBJZiB0aGUgaXRlbSB3aWxsIG5vdCBjaGFuZ2UgaXRzIHBvc2l0aW9uLCBkbyBub3QgYWRkIGl0IHRvIHRoZSByZW5kZXJcbiAgICAgICAgICAvLyBxdWV1ZS4gVHJhbnNpdGlvbnMgZG9uJ3QgZmlyZSB3aGVuIHNldHRpbmcgYSBwcm9wZXJ0eSB0byB0aGUgc2FtZSB2YWx1ZS5cblxuXG4gICAgICAgICAgaWYgKFBvaW50LmVxdWFscyhpdGVtLnBvaW50LCBpdGVtUG9zaXRpb25zW2ldKSAmJiAhaXRlbS5pc0hpZGRlbikge1xuICAgICAgICAgICAgaXRlbS5hcHBseUNzcyhTaHVmZmxlSXRlbS5Dc3MuVklTSUJMRS5iZWZvcmUpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpdGVtLnBvaW50ID0gaXRlbVBvc2l0aW9uc1tpXTtcbiAgICAgICAgICBpdGVtLnNjYWxlID0gU2h1ZmZsZUl0ZW0uU2NhbGUuVklTSUJMRTtcbiAgICAgICAgICBpdGVtLmlzSGlkZGVuID0gZmFsc2U7IC8vIENsb25lIHRoZSBvYmplY3Qgc28gdGhhdCB0aGUgYGJlZm9yZWAgb2JqZWN0IGlzbid0IG1vZGlmaWVkIHdoZW4gdGhlXG4gICAgICAgICAgLy8gdHJhbnNpdGlvbiBkZWxheSBpcyBhZGRlZC5cblxuICAgICAgICAgIHZhciBzdHlsZXMgPSBfdGhpczQuZ2V0U3R5bGVzRm9yVHJhbnNpdGlvbihpdGVtLCBTaHVmZmxlSXRlbS5Dc3MuVklTSUJMRS5iZWZvcmUpO1xuXG4gICAgICAgICAgc3R5bGVzLnRyYW5zaXRpb25EZWxheSA9IF90aGlzNC5fZ2V0U3RhZ2dlckFtb3VudChjb3VudCkgKyAnbXMnO1xuXG4gICAgICAgICAgX3RoaXM0Ll9xdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgIGl0ZW06IGl0ZW0sXG4gICAgICAgICAgICBzdHlsZXM6IHN0eWxlcyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybiBhbiBhcnJheSBvZiBQb2ludCBpbnN0YW5jZXMgcmVwcmVzZW50aW5nIHRoZSBmdXR1cmUgcG9zaXRpb25zIG9mXG4gICAgICAgKiBlYWNoIGl0ZW0uXG4gICAgICAgKiBAcGFyYW0ge1NodWZmbGVJdGVtW119IGl0ZW1zIEFycmF5IG9mIHNvcnRlZCBzaHVmZmxlIGl0ZW1zLlxuICAgICAgICogQHJldHVybiB7UG9pbnRbXX1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfZ2V0TmV4dFBvc2l0aW9uc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXROZXh0UG9zaXRpb25zKGl0ZW1zKSB7XG4gICAgICAgIHZhciBfdGhpczUgPSB0aGlzO1xuXG4gICAgICAgIC8vIElmIHBvc2l0aW9uIGRhdGEgaXMgZ29pbmcgdG8gYmUgY2hhbmdlZCwgYWRkIHRoZSBpdGVtJ3Mgc2l6ZSB0byB0aGVcbiAgICAgICAgLy8gdHJhbnNmb3JtZXIgdG8gYWxsb3cgZm9yIGNhbGN1bGF0aW9ucy5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pc0NlbnRlcmVkKSB7XG4gICAgICAgICAgdmFyIGl0ZW1zRGF0YSA9IGl0ZW1zLm1hcChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgdmFyIGl0ZW1TaXplID0gU2h1ZmZsZS5nZXRTaXplKGl0ZW0uZWxlbWVudCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHZhciBwb2ludCA9IF90aGlzNS5fZ2V0SXRlbVBvc2l0aW9uKGl0ZW1TaXplKTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWN0KHBvaW50LngsIHBvaW50LnksIGl0ZW1TaXplLndpZHRoLCBpdGVtU2l6ZS5oZWlnaHQsIGkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldFRyYW5zZm9ybWVkUG9zaXRpb25zKGl0ZW1zRGF0YSwgdGhpcy5jb250YWluZXJXaWR0aCk7XG4gICAgICAgIH0gLy8gSWYgbm8gdHJhbnNmb3JtcyBhcmUgZ29pbmcgdG8gaGFwcGVuLCBzaW1wbHkgcmV0dXJuIGFuIGFycmF5IG9mIHRoZVxuICAgICAgICAvLyBmdXR1cmUgcG9pbnRzIG9mIGVhY2ggaXRlbS5cblxuXG4gICAgICAgIHJldHVybiBpdGVtcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXM1Ll9nZXRJdGVtUG9zaXRpb24oU2h1ZmZsZS5nZXRTaXplKGl0ZW0uZWxlbWVudCwgdHJ1ZSkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogRGV0ZXJtaW5lIHRoZSBsb2NhdGlvbiBvZiB0aGUgbmV4dCBpdGVtLCBiYXNlZCBvbiBpdHMgc2l6ZS5cbiAgICAgICAqIEBwYXJhbSB7e3dpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyfX0gaXRlbVNpemUgT2JqZWN0IHdpdGggd2lkdGggYW5kIGhlaWdodC5cbiAgICAgICAqIEByZXR1cm4ge1BvaW50fVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9nZXRJdGVtUG9zaXRpb25cIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0SXRlbVBvc2l0aW9uKGl0ZW1TaXplKSB7XG4gICAgICAgIHJldHVybiBnZXRJdGVtUG9zaXRpb24oe1xuICAgICAgICAgIGl0ZW1TaXplOiBpdGVtU2l6ZSxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMucG9zaXRpb25zLFxuICAgICAgICAgIGdyaWRTaXplOiB0aGlzLmNvbFdpZHRoLFxuICAgICAgICAgIHRvdGFsOiB0aGlzLmNvbHMsXG4gICAgICAgICAgdGhyZXNob2xkOiB0aGlzLm9wdGlvbnMuY29sdW1uVGhyZXNob2xkLFxuICAgICAgICAgIGJ1ZmZlcjogdGhpcy5vcHRpb25zLmJ1ZmZlclxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogTXV0YXRlIHBvc2l0aW9ucyBiZWZvcmUgdGhleSdyZSBhcHBsaWVkLlxuICAgICAgICogQHBhcmFtIHtSZWN0W119IGl0ZW1SZWN0cyBJdGVtIGRhdGEgb2JqZWN0cy5cbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb250YWluZXJXaWR0aCBXaWR0aCBvZiB0aGUgY29udGFpbmluZyBlbGVtZW50LlxuICAgICAgICogQHJldHVybiB7UG9pbnRbXX1cbiAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImdldFRyYW5zZm9ybWVkUG9zaXRpb25zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VHJhbnNmb3JtZWRQb3NpdGlvbnMoaXRlbVJlY3RzLCBjb250YWluZXJXaWR0aCkge1xuICAgICAgICByZXR1cm4gZ2V0Q2VudGVyZWRQb3NpdGlvbnMoaXRlbVJlY3RzLCBjb250YWluZXJXaWR0aCk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEhpZGVzIHRoZSBlbGVtZW50cyB0aGF0IGRvbid0IG1hdGNoIG91ciBmaWx0ZXIuXG4gICAgICAgKiBAcGFyYW0ge1NodWZmbGVJdGVtW119IGNvbGxlY3Rpb24gQ29sbGVjdGlvbiB0byBzaHJpbmsuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3Nocmlua1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zaHJpbmsoKSB7XG4gICAgICAgIHZhciBfdGhpczYgPSB0aGlzO1xuXG4gICAgICAgIHZhciBjb2xsZWN0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0aGlzLl9nZXRDb25jZWFsZWRJdGVtcygpO1xuICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICBjb2xsZWN0aW9uLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICBmdW5jdGlvbiBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgIGl0ZW0uYXBwbHlDc3MoU2h1ZmZsZUl0ZW0uQ3NzLkhJRERFTi5hZnRlcik7XG4gICAgICAgICAgfSAvLyBDb250aW51aW5nIHdvdWxkIGFkZCBhIHRyYW5zaXRpb25lbmQgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGVsZW1lbnQsIGJ1dFxuICAgICAgICAgIC8vIHRoYXQgbGlzdGVuZXIgd291bGQgbm90IGV4ZWN1dGUgYmVjYXVzZSB0aGUgdHJhbnNmb3JtIGFuZCBvcGFjaXR5IHdvdWxkXG4gICAgICAgICAgLy8gc3RheSB0aGUgc2FtZS5cbiAgICAgICAgICAvLyBUaGUgY2FsbGJhY2sgaXMgZXhlY3V0ZWQgaGVyZSBiZWNhdXNlIGl0IGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlIGNhbGxlZFxuICAgICAgICAgIC8vIGFmdGVyIHRoZSB0cmFuc2l0aW9uZW5kIGV2ZW50IGJlY2F1c2UgdGhlIHRyYW5zaXRpb25lbmQgY291bGQgYmVcbiAgICAgICAgICAvLyBjYW5jZWxlZCBpZiBhbm90aGVyIGFuaW1hdGlvbiBzdGFydHMuXG5cblxuICAgICAgICAgIGlmIChpdGVtLmlzSGlkZGVuKSB7XG4gICAgICAgICAgICBpdGVtLmFwcGx5Q3NzKFNodWZmbGVJdGVtLkNzcy5ISURERU4uYmVmb3JlKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaXRlbS5zY2FsZSA9IFNodWZmbGVJdGVtLlNjYWxlLkhJRERFTjtcbiAgICAgICAgICBpdGVtLmlzSGlkZGVuID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBzdHlsZXMgPSBfdGhpczYuZ2V0U3R5bGVzRm9yVHJhbnNpdGlvbihpdGVtLCBTaHVmZmxlSXRlbS5Dc3MuSElEREVOLmJlZm9yZSk7XG5cbiAgICAgICAgICBzdHlsZXMudHJhbnNpdGlvbkRlbGF5ID0gX3RoaXM2Ll9nZXRTdGFnZ2VyQW1vdW50KGNvdW50KSArICdtcyc7XG5cbiAgICAgICAgICBfdGhpczYuX3F1ZXVlLnB1c2goe1xuICAgICAgICAgICAgaXRlbTogaXRlbSxcbiAgICAgICAgICAgIHN0eWxlczogc3R5bGVzLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmVzaXplIGhhbmRsZXIuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2hhbmRsZVJlc2l6ZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9oYW5kbGVSZXNpemUoKSB7XG4gICAgICAgIC8vIElmIHNodWZmbGUgaXMgZGlzYWJsZWQsIGRlc3Ryb3llZCwgZG9uJ3QgZG8gYW55dGhpbmdcbiAgICAgICAgaWYgKCF0aGlzLmlzRW5hYmxlZCB8fCB0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyBzdHlsZXMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBhbiBpdGVtIGZvciBhIHRyYW5zaXRpb24uXG4gICAgICAgKiBAcGFyYW0ge1NodWZmbGVJdGVtfSBpdGVtIEl0ZW0gdG8gZ2V0IHN0eWxlcyBmb3IuIFNob3VsZCBoYXZlIHVwZGF0ZWRcbiAgICAgICAqICAgc2NhbGUgYW5kIHBvaW50IHByb3BlcnRpZXMuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGVPYmplY3QgRXh0cmEgc3R5bGVzIHRoYXQgd2lsbCBiZSB1c2VkIGluIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogQHJldHVybiB7IU9iamVjdH0gVHJhbnNmb3JtcyBmb3IgdHJhbnNpdGlvbnMsIGxlZnQvdG9wIGZvciBhbmltYXRlLlxuICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZ2V0U3R5bGVzRm9yVHJhbnNpdGlvblwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFN0eWxlc0ZvclRyYW5zaXRpb24oaXRlbSwgc3R5bGVPYmplY3QpIHtcbiAgICAgICAgLy8gQ2xvbmUgdGhlIG9iamVjdCB0byBhdm9pZCBtdXRhdGluZyB0aGUgb3JpZ2luYWwuXG4gICAgICAgIHZhciBzdHlsZXMgPSBPYmplY3QuYXNzaWduKHt9LCBzdHlsZU9iamVjdCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy51c2VUcmFuc2Zvcm1zKSB7XG4gICAgICAgICAgdmFyIHggPSB0aGlzLm9wdGlvbnMucm91bmRUcmFuc2Zvcm1zID8gTWF0aC5yb3VuZChpdGVtLnBvaW50LngpIDogaXRlbS5wb2ludC54O1xuICAgICAgICAgIHZhciB5ID0gdGhpcy5vcHRpb25zLnJvdW5kVHJhbnNmb3JtcyA/IE1hdGgucm91bmQoaXRlbS5wb2ludC55KSA6IGl0ZW0ucG9pbnQueTtcbiAgICAgICAgICBzdHlsZXMudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIuY29uY2F0KHgsIFwicHgsIFwiKS5jb25jYXQoeSwgXCJweCkgc2NhbGUoXCIpLmNvbmNhdChpdGVtLnNjYWxlLCBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3R5bGVzLmxlZnQgPSBpdGVtLnBvaW50LnggKyAncHgnO1xuICAgICAgICAgIHN0eWxlcy50b3AgPSBpdGVtLnBvaW50LnkgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0eWxlcztcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogTGlzdGVuIGZvciB0aGUgdHJhbnNpdGlvbiBlbmQgb24gYW4gZWxlbWVudCBhbmQgZXhlY3V0ZSB0aGUgaXRlbUNhbGxiYWNrXG4gICAgICAgKiB3aGVuIGl0IGZpbmlzaGVzLlxuICAgICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgdG8gbGlzdGVuIG9uLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaXRlbUNhbGxiYWNrIENhbGxiYWNrIGZvciB0aGUgaXRlbS5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRvbmUgQ2FsbGJhY2sgdG8gbm90aWZ5IGBwYXJhbGxlbGAgdGhhdCB0aGlzIG9uZSBpcyBkb25lLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3doZW5UcmFuc2l0aW9uRG9uZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF93aGVuVHJhbnNpdGlvbkRvbmUoZWxlbWVudCwgaXRlbUNhbGxiYWNrLCBkb25lKSB7XG4gICAgICAgIHZhciBpZCA9IG9uVHJhbnNpdGlvbkVuZChlbGVtZW50LCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgaXRlbUNhbGxiYWNrKCk7XG4gICAgICAgICAgZG9uZShudWxsLCBldnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl90cmFuc2l0aW9ucy5wdXNoKGlkKTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJuIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCBzZXQgQ1NTIHN0eWxlcyBhbmQgY2FsbCB0aGUgYGRvbmVgIGZ1bmN0aW9uXG4gICAgICAgKiB3aGVuIChpZikgdGhlIHRyYW5zaXRpb24gZmluaXNoZXMuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0cyBUcmFuc2l0aW9uIG9iamVjdC5cbiAgICAgICAqIEByZXR1cm4ge2Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aXRoIGEgYGRvbmVgIGZ1bmN0aW9uLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2dldFRyYW5zaXRpb25GdW5jdGlvblwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRUcmFuc2l0aW9uRnVuY3Rpb24ob3B0cykge1xuICAgICAgICB2YXIgX3RoaXM3ID0gdGhpcztcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICBvcHRzLml0ZW0uYXBwbHlDc3Mob3B0cy5zdHlsZXMpO1xuXG4gICAgICAgICAgX3RoaXM3Ll93aGVuVHJhbnNpdGlvbkRvbmUob3B0cy5pdGVtLmVsZW1lbnQsIG9wdHMuY2FsbGJhY2ssIGRvbmUpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBFeGVjdXRlIHRoZSBzdHlsZXMgZ2F0aGVyZWQgaW4gdGhlIHN0eWxlIHF1ZXVlLiBUaGlzIGFwcGxpZXMgc3R5bGVzIHRvIGVsZW1lbnRzLFxuICAgICAgICogdHJpZ2dlcmluZyB0cmFuc2l0aW9ucy5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfcHJvY2Vzc1F1ZXVlXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3Byb2Nlc3NRdWV1ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNUcmFuc2l0aW9uaW5nKSB7XG4gICAgICAgICAgdGhpcy5fY2FuY2VsTW92ZW1lbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoYXNTcGVlZCA9IHRoaXMub3B0aW9ucy5zcGVlZCA+IDA7XG4gICAgICAgIHZhciBoYXNRdWV1ZSA9IHRoaXMuX3F1ZXVlLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgaWYgKGhhc1F1ZXVlICYmIGhhc1NwZWVkICYmIHRoaXMuaXNJbml0aWFsaXplZCkge1xuICAgICAgICAgIHRoaXMuX3N0YXJ0VHJhbnNpdGlvbnModGhpcy5fcXVldWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGhhc1F1ZXVlKSB7XG4gICAgICAgICAgdGhpcy5fc3R5bGVJbW1lZGlhdGVseSh0aGlzLl9xdWV1ZSk7XG5cbiAgICAgICAgICB0aGlzLl9kaXNwYXRjaChTaHVmZmxlLkV2ZW50VHlwZS5MQVlPVVQpOyAvLyBBIGNhbGwgdG8gbGF5b3V0IGhhcHBlbmVkLCBidXQgbm9uZSBvZiB0aGUgbmV3bHkgdmlzaWJsZSBpdGVtcyB3aWxsXG4gICAgICAgICAgLy8gY2hhbmdlIHBvc2l0aW9uIG9yIHRoZSB0cmFuc2l0aW9uIGR1cmF0aW9uIGlzIHplcm8sIHdoaWNoIHdpbGwgbm90IHRyaWdnZXJcbiAgICAgICAgICAvLyB0aGUgdHJhbnNpdGlvbmVuZCBldmVudC5cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoKFNodWZmbGUuRXZlbnRUeXBlLkxBWU9VVCk7XG4gICAgICAgIH0gLy8gUmVtb3ZlIGV2ZXJ5dGhpbmcgaW4gdGhlIHN0eWxlIHF1ZXVlXG5cblxuICAgICAgICB0aGlzLl9xdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBXYWl0IGZvciBlYWNoIHRyYW5zaXRpb24gdG8gZmluaXNoLCB0aGUgZW1pdCB0aGUgbGF5b3V0IGV2ZW50LlxuICAgICAgICogQHBhcmFtIHtPYmplY3RbXX0gdHJhbnNpdGlvbnMgQXJyYXkgb2YgdHJhbnNpdGlvbiBvYmplY3RzLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3N0YXJ0VHJhbnNpdGlvbnNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfc3RhcnRUcmFuc2l0aW9ucyh0cmFuc2l0aW9ucykge1xuICAgICAgICB2YXIgX3RoaXM4ID0gdGhpcztcblxuICAgICAgICAvLyBTZXQgZmxhZyB0aGF0IHNodWZmbGUgaXMgY3VycmVudGx5IGluIG1vdGlvbi5cbiAgICAgICAgdGhpcy5pc1RyYW5zaXRpb25pbmcgPSB0cnVlOyAvLyBDcmVhdGUgYW4gYXJyYXkgb2YgZnVuY3Rpb25zIHRvIGJlIGNhbGxlZC5cblxuICAgICAgICB2YXIgY2FsbGJhY2tzID0gdHJhbnNpdGlvbnMubWFwKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXM4Ll9nZXRUcmFuc2l0aW9uRnVuY3Rpb24ob2JqKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFycmF5UGFyYWxsZWwoY2FsbGJhY2tzLCB0aGlzLl9tb3ZlbWVudEZpbmlzaGVkLmJpbmQodGhpcykpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfY2FuY2VsTW92ZW1lbnRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfY2FuY2VsTW92ZW1lbnQoKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgdHJhbnNpdGlvbiBlbmQgZXZlbnQgZm9yIGVhY2ggbGlzdGVuZXIuXG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25zLmZvckVhY2goY2FuY2VsVHJhbnNpdGlvbkVuZCk7IC8vIFJlc2V0IHRoZSBhcnJheS5cblxuXG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25zLmxlbmd0aCA9IDA7IC8vIFNob3cgaXQncyBubyBsb25nZXIgYWN0aXZlLlxuXG4gICAgICAgIHRoaXMuaXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEFwcGx5IHN0eWxlcyB3aXRob3V0IGEgdHJhbnNpdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0W119IG9iamVjdHMgQXJyYXkgb2YgdHJhbnNpdGlvbiBvYmplY3RzLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9zdHlsZUltbWVkaWF0ZWx5XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3N0eWxlSW1tZWRpYXRlbHkob2JqZWN0cykge1xuICAgICAgICBpZiAob2JqZWN0cy5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgZWxlbWVudHMgPSBvYmplY3RzLm1hcChmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqLml0ZW0uZWxlbWVudDtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFNodWZmbGUuX3NraXBUcmFuc2l0aW9ucyhlbGVtZW50cywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgb2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgb2JqLml0ZW0uYXBwbHlDc3Mob2JqLnN0eWxlcyk7XG4gICAgICAgICAgICAgIG9iai5jYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX21vdmVtZW50RmluaXNoZWRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfbW92ZW1lbnRGaW5pc2hlZCgpIHtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbnMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9kaXNwYXRjaChTaHVmZmxlLkV2ZW50VHlwZS5MQVlPVVQpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbWFnaWMuIFRoaXMgaXMgd2hhdCBtYWtlcyB0aGUgcGx1Z2luICdzaHVmZmxlJ1xuICAgICAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW118ZnVuY3Rpb24oRWxlbWVudCk6Ym9vbGVhbn0gW2NhdGVnb3J5XSBDYXRlZ29yeSB0byBmaWx0ZXIgYnkuXG4gICAgICAgKiAgICAgQ2FuIGJlIGEgZnVuY3Rpb24sIHN0cmluZywgb3IgYXJyYXkgb2Ygc3RyaW5ncy5cbiAgICAgICAqIEBwYXJhbSB7U29ydE9wdGlvbnN9IFtzb3J0T3B0aW9uc10gQSBzb3J0IG9iamVjdCB3aGljaCBjYW4gc29ydCB0aGUgdmlzaWJsZSBzZXRcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImZpbHRlclwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGZpbHRlcihjYXRlZ29yeSwgc29ydE9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRW5hYmxlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2F0ZWdvcnkgfHwgY2F0ZWdvcnkgJiYgY2F0ZWdvcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgY2F0ZWdvcnkgPSBTaHVmZmxlLkFMTF9JVEVNUzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZmlsdGVyKGNhdGVnb3J5KTsgLy8gU2hyaW5rIGVhY2ggaGlkZGVuIGl0ZW1cblxuXG4gICAgICAgIHRoaXMuX3NocmluaygpOyAvLyBIb3cgbWFueSB2aXNpYmxlIGVsZW1lbnRzP1xuXG5cbiAgICAgICAgdGhpcy5fdXBkYXRlSXRlbUNvdW50KCk7IC8vIFVwZGF0ZSB0cmFuc2Zvcm1zIG9uIHZpc2libGUgZWxlbWVudHMgc28gdGhleSB3aWxsIGFuaW1hdGUgdG8gdGhlaXIgbmV3IHBvc2l0aW9ucy5cblxuXG4gICAgICAgIHRoaXMuc29ydChzb3J0T3B0aW9ucyk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEdldHMgdGhlIHZpc2libGUgZWxlbWVudHMsIHNvcnRzIHRoZW0sIGFuZCBwYXNzZXMgdGhlbSB0byBsYXlvdXQuXG4gICAgICAgKiBAcGFyYW0ge1NvcnRPcHRpb25zfSBbc29ydE9wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdCB0byBwYXNzIHRvIGBzb3J0ZXJgLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwic29ydFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNvcnQoKSB7XG4gICAgICAgIHZhciBzb3J0T3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdGhpcy5sYXN0U29ydDtcblxuICAgICAgICBpZiAoIXRoaXMuaXNFbmFibGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcmVzZXRDb2xzKCk7XG5cbiAgICAgICAgdmFyIGl0ZW1zID0gc29ydGVyKHRoaXMuX2dldEZpbHRlcmVkSXRlbXMoKSwgc29ydE9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMuX2xheW91dChpdGVtcyk7IC8vIGBfbGF5b3V0YCBhbHdheXMgaGFwcGVucyBhZnRlciBgX3Nocmlua2AsIHNvIGl0J3Mgc2FmZSB0byBwcm9jZXNzIHRoZSBzdHlsZVxuICAgICAgICAvLyBxdWV1ZSBoZXJlIHdpdGggc3R5bGVzIGZyb20gdGhlIHNocmluayBtZXRob2QuXG5cblxuICAgICAgICB0aGlzLl9wcm9jZXNzUXVldWUoKTsgLy8gQWRqdXN0IHRoZSBoZWlnaHQgb2YgdGhlIGNvbnRhaW5lci5cblxuXG4gICAgICAgIHRoaXMuX3NldENvbnRhaW5lclNpemUoKTtcblxuICAgICAgICB0aGlzLmxhc3RTb3J0ID0gc29ydE9wdGlvbnM7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJlcG9zaXRpb24gZXZlcnl0aGluZy5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzT25seUxheW91dD1mYWxzZV0gSWYgdHJ1ZSwgY29sdW1uIGFuZCBndXR0ZXIgd2lkdGhzIHdvbid0IGJlIHJlY2FsY3VsYXRlZC5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcInVwZGF0ZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgdmFyIGlzT25seUxheW91dCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKSB7XG4gICAgICAgICAgaWYgKCFpc09ubHlMYXlvdXQpIHtcbiAgICAgICAgICAgIC8vIEdldCB1cGRhdGVkIGNvbENvdW50XG4gICAgICAgICAgICB0aGlzLl9zZXRDb2x1bW5zKCk7XG4gICAgICAgICAgfSAvLyBMYXlvdXQgaXRlbXNcblxuXG4gICAgICAgICAgdGhpcy5zb3J0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogVXNlIHRoaXMgaW5zdGVhZCBvZiBgdXBkYXRlKClgIGlmIHlvdSBkb24ndCBuZWVkIHRoZSBjb2x1bW5zIGFuZCBndXR0ZXJzIHVwZGF0ZWRcbiAgICAgICAqIE1heWJlIGFuIGltYWdlIGluc2lkZSBgc2h1ZmZsZWAgbG9hZGVkIChhbmQgbm93IGhhcyBhIGhlaWdodCksIHdoaWNoIG1lYW5zIGNhbGN1bGF0aW9uc1xuICAgICAgICogY291bGQgYmUgb2ZmLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwibGF5b3V0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gbGF5b3V0KCkge1xuICAgICAgICB0aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogTmV3IGl0ZW1zIGhhdmUgYmVlbiBhcHBlbmRlZCB0byBzaHVmZmxlLiBNaXggdGhlbSBpbiB3aXRoIHRoZSBjdXJyZW50XG4gICAgICAgKiBmaWx0ZXIgb3Igc29ydCBzdGF0dXMuXG4gICAgICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gbmV3SXRlbXMgQ29sbGVjdGlvbiBvZiBuZXcgaXRlbXMuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJhZGRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQobmV3SXRlbXMpIHtcbiAgICAgICAgdmFyIF90aGlzOSA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGl0ZW1zID0gYXJyYXlVbmlxdWUobmV3SXRlbXMpLm1hcChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFNodWZmbGVJdGVtKGVsKTtcbiAgICAgICAgfSk7IC8vIEFkZCBjbGFzc2VzIGFuZCBzZXQgaW5pdGlhbCBwb3NpdGlvbnMuXG5cbiAgICAgICAgdGhpcy5faW5pdEl0ZW1zKGl0ZW1zKTsgLy8gRGV0ZXJtaW5lIHdoaWNoIGl0ZW1zIHdpbGwgZ28gd2l0aCB0aGUgY3VycmVudCBmaWx0ZXIuXG5cblxuICAgICAgICB0aGlzLl9yZXNldENvbHMoKTtcblxuICAgICAgICB2YXIgYWxsSXRlbXMgPSB0aGlzLl9tZXJnZU5ld0l0ZW1zKGl0ZW1zKTtcblxuICAgICAgICB2YXIgc29ydGVkSXRlbXMgPSBzb3J0ZXIoYWxsSXRlbXMsIHRoaXMubGFzdFNvcnQpO1xuXG4gICAgICAgIHZhciBhbGxTb3J0ZWRJdGVtc1NldCA9IHRoaXMuX2ZpbHRlcih0aGlzLmxhc3RGaWx0ZXIsIHNvcnRlZEl0ZW1zKTtcblxuICAgICAgICB2YXIgaXNOZXdJdGVtID0gZnVuY3Rpb24gaXNOZXdJdGVtKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbXMuaW5jbHVkZXMoaXRlbSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGFwcGx5SGlkZGVuU3RhdGUgPSBmdW5jdGlvbiBhcHBseUhpZGRlblN0YXRlKGl0ZW0pIHtcbiAgICAgICAgICBpdGVtLnNjYWxlID0gU2h1ZmZsZUl0ZW0uU2NhbGUuSElEREVOO1xuICAgICAgICAgIGl0ZW0uaXNIaWRkZW4gPSB0cnVlO1xuICAgICAgICAgIGl0ZW0uYXBwbHlDc3MoU2h1ZmZsZUl0ZW0uQ3NzLkhJRERFTi5iZWZvcmUpO1xuICAgICAgICAgIGl0ZW0uYXBwbHlDc3MoU2h1ZmZsZUl0ZW0uQ3NzLkhJRERFTi5hZnRlcik7XG4gICAgICAgIH07IC8vIExheW91dCBhbGwgaXRlbXMgYWdhaW4gc28gdGhhdCBuZXcgaXRlbXMgZ2V0IHBvc2l0aW9ucy5cbiAgICAgICAgLy8gU3luY2hvbm91c2x5IGFwcGx5IHBvc2l0aW9ucy5cblxuXG4gICAgICAgIHZhciBpdGVtUG9zaXRpb25zID0gdGhpcy5fZ2V0TmV4dFBvc2l0aW9ucyhhbGxTb3J0ZWRJdGVtc1NldC52aXNpYmxlKTtcblxuICAgICAgICBhbGxTb3J0ZWRJdGVtc1NldC52aXNpYmxlLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgICBpZiAoaXNOZXdJdGVtKGl0ZW0pKSB7XG4gICAgICAgICAgICBpdGVtLnBvaW50ID0gaXRlbVBvc2l0aW9uc1tpXTtcbiAgICAgICAgICAgIGFwcGx5SGlkZGVuU3RhdGUoaXRlbSk7XG4gICAgICAgICAgICBpdGVtLmFwcGx5Q3NzKF90aGlzOS5nZXRTdHlsZXNGb3JUcmFuc2l0aW9uKGl0ZW0sIHt9KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYWxsU29ydGVkSXRlbXNTZXQuaGlkZGVuLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICBpZiAoaXNOZXdJdGVtKGl0ZW0pKSB7XG4gICAgICAgICAgICBhcHBseUhpZGRlblN0YXRlKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7IC8vIENhdXNlIGxheW91dCBzbyB0aGF0IHRoZSBzdHlsZXMgYWJvdmUgYXJlIGFwcGxpZWQuXG5cbiAgICAgICAgdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICAgICAgICAvLyBBZGQgdHJhbnNpdGlvbiB0byBlYWNoIGl0ZW0uXG5cbiAgICAgICAgdGhpcy5zZXRJdGVtVHJhbnNpdGlvbnMoaXRlbXMpOyAvLyBVcGRhdGUgdGhlIGxpc3Qgb2YgaXRlbXMuXG5cbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuX21lcmdlTmV3SXRlbXMoaXRlbXMpOyAvLyBVcGRhdGUgbGF5b3V0L3Zpc2liaWxpdHkgb2YgbmV3IGFuZCBvbGQgaXRlbXMuXG5cbiAgICAgICAgdGhpcy5maWx0ZXIodGhpcy5sYXN0RmlsdGVyKTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogRGlzYWJsZXMgc2h1ZmZsZSBmcm9tIHVwZGF0aW5nIGRpbWVuc2lvbnMgYW5kIGxheW91dCBvbiByZXNpemVcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImRpc2FibGVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlKCkge1xuICAgICAgICB0aGlzLmlzRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBFbmFibGVzIHNodWZmbGUgYWdhaW5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzVXBkYXRlTGF5b3V0PXRydWVdIGlmIHVuZGVmaW5lZCwgc2h1ZmZsZSB3aWxsIHVwZGF0ZSBjb2x1bW5zIGFuZCBndXR0ZXJzXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJlbmFibGVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBlbmFibGUoKSB7XG4gICAgICAgIHZhciBpc1VwZGF0ZUxheW91dCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChpc1VwZGF0ZUxheW91dCkge1xuICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIDEgb3IgbW9yZSBzaHVmZmxlIGl0ZW1zLlxuICAgICAgICogQHBhcmFtIHtFbGVtZW50W119IGVsZW1lbnRzIEFuIGFycmF5IGNvbnRhaW5pbmcgb25lIG9yIG1vcmVcbiAgICAgICAqICAgICBlbGVtZW50cyBpbiBzaHVmZmxlXG4gICAgICAgKiBAcmV0dXJuIHtTaHVmZmxlfSBUaGUgc2h1ZmZsZSBpbnN0YW5jZS5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcInJlbW92ZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShlbGVtZW50cykge1xuICAgICAgICB2YXIgX3RoaXMxMCA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFlbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29sbGVjdGlvbiA9IGFycmF5VW5pcXVlKGVsZW1lbnRzKTtcbiAgICAgICAgdmFyIG9sZEl0ZW1zID0gY29sbGVjdGlvbi5tYXAoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMxMC5nZXRJdGVtQnlFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gISFpdGVtO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgaGFuZGxlTGF5b3V0ID0gZnVuY3Rpb24gaGFuZGxlTGF5b3V0KCkge1xuICAgICAgICAgIF90aGlzMTAuX2Rpc3Bvc2VJdGVtcyhvbGRJdGVtcyk7IC8vIFJlbW92ZSB0aGUgY29sbGVjdGlvbiBpbiB0aGUgY2FsbGJhY2tcblxuXG4gICAgICAgICAgY29sbGVjdGlvbi5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBfdGhpczEwLl9kaXNwYXRjaChTaHVmZmxlLkV2ZW50VHlwZS5SRU1PVkVELCB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07IC8vIEhpZGUgY29sbGVjdGlvbiBmaXJzdC5cblxuXG4gICAgICAgIHRoaXMuX3RvZ2dsZUZpbHRlckNsYXNzZXMoe1xuICAgICAgICAgIHZpc2libGU6IFtdLFxuICAgICAgICAgIGhpZGRlbjogb2xkSXRlbXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fc2hyaW5rKG9sZEl0ZW1zKTtcblxuICAgICAgICB0aGlzLnNvcnQoKTsgLy8gVXBkYXRlIHRoZSBsaXN0IG9mIGl0ZW1zIGhlcmUgYmVjYXVzZSBgcmVtb3ZlYCBjb3VsZCBiZSBjYWxsZWQgYWdhaW5cbiAgICAgICAgLy8gd2l0aCBhbiBpdGVtIHRoYXQgaXMgaW4gdGhlIHByb2Nlc3Mgb2YgYmVpbmcgcmVtb3ZlZC5cblxuICAgICAgICB0aGlzLml0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gIW9sZEl0ZW1zLmluY2x1ZGVzKGl0ZW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl91cGRhdGVJdGVtQ291bnQoKTtcblxuICAgICAgICB0aGlzLm9uY2UoU2h1ZmZsZS5FdmVudFR5cGUuTEFZT1VULCBoYW5kbGVMYXlvdXQpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXRyaWV2ZSBhIHNodWZmbGUgaXRlbSBieSBpdHMgZWxlbWVudC5cbiAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHRvIGxvb2sgZm9yLlxuICAgICAgICogQHJldHVybiB7P1NodWZmbGVJdGVtfSBBIHNodWZmbGUgaXRlbSBvciB1bmRlZmluZWQgaWYgaXQncyBub3QgZm91bmQuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJnZXRJdGVtQnlFbGVtZW50XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SXRlbUJ5RWxlbWVudChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5lbGVtZW50ID09PSBlbGVtZW50O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogRHVtcCB0aGUgZWxlbWVudHMgY3VycmVudGx5IHN0b3JlZCBhbmQgcmVpbml0aWFsaXplIGFsbCBjaGlsZCBlbGVtZW50cyB3aGljaFxuICAgICAgICogbWF0Y2ggdGhlIGBpdGVtU2VsZWN0b3JgLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwicmVzZXRJdGVtc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0SXRlbXMoKSB7XG4gICAgICAgIHZhciBfdGhpczExID0gdGhpcztcblxuICAgICAgICAvLyBSZW1vdmUgcmVmcyB0byBjdXJyZW50IGl0ZW1zLlxuICAgICAgICB0aGlzLl9kaXNwb3NlSXRlbXModGhpcy5pdGVtcyk7XG5cbiAgICAgICAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7IC8vIEZpbmQgbmV3IGl0ZW1zIGluIHRoZSBET00uXG5cbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuX2dldEl0ZW1zKCk7IC8vIFNldCBpbml0aWFsIHN0eWxlcyBvbiB0aGUgbmV3IGl0ZW1zLlxuXG4gICAgICAgIHRoaXMuX2luaXRJdGVtcyh0aGlzLml0ZW1zKTtcblxuICAgICAgICB0aGlzLm9uY2UoU2h1ZmZsZS5FdmVudFR5cGUuTEFZT1VULCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gQWRkIHRyYW5zaXRpb24gdG8gZWFjaCBpdGVtLlxuICAgICAgICAgIF90aGlzMTEuc2V0SXRlbVRyYW5zaXRpb25zKF90aGlzMTEuaXRlbXMpO1xuXG4gICAgICAgICAgX3RoaXMxMS5pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgfSk7IC8vIExheSBvdXQgYWxsIGl0ZW1zLlxuXG4gICAgICAgIHRoaXMuZmlsdGVyKHRoaXMubGFzdEZpbHRlcik7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIERlc3Ryb3lzIHNodWZmbGUsIHJlbW92ZXMgZXZlbnRzLCBzdHlsZXMsIGFuZCBjbGFzc2VzXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJkZXN0cm95XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5fY2FuY2VsTW92ZW1lbnQoKTtcblxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25SZXNpemUpOyAvLyBSZXNldCBjb250YWluZXIgc3R5bGVzXG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3NodWZmbGUnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTsgLy8gUmVzZXQgaW5kaXZpZHVhbCBpdGVtIHN0eWxlc1xuXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2VJdGVtcyh0aGlzLml0ZW1zKTtcblxuICAgICAgICB0aGlzLml0ZW1zLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25zLmxlbmd0aCA9IDA7IC8vIE51bGwgRE9NIHJlZmVyZW5jZXNcblxuICAgICAgICB0aGlzLm9wdGlvbnMuc2l6ZXIgPSBudWxsO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsOyAvLyBTZXQgYSBmbGFnIHNvIGlmIGEgZGVib3VuY2VkIHJlc2l6ZSBoYXMgYmVlbiB0cmlnZ2VyZWQsXG4gICAgICAgIC8vIGl0IGNhbiBmaXJzdCBjaGVjayBpZiBpdCBpcyBhY3R1YWxseSBpc0Rlc3Ryb3llZCBhbmQgbm90IGRvaW5nIGFueXRoaW5nXG5cbiAgICAgICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgIHRoaXMuaXNFbmFibGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdGhlIG91dGVyIHdpZHRoIG9mIGFuIGVsZW1lbnQsIG9wdGlvbmFsbHkgaW5jbHVkaW5nIGl0cyBtYXJnaW5zLlxuICAgICAgICpcbiAgICAgICAqIFRoZXJlIGFyZSBhIGZldyBkaWZmZXJlbnQgbWV0aG9kcyBmb3IgZ2V0dGluZyB0aGUgd2lkdGggb2YgYW4gZWxlbWVudCwgbm9uZSBvZlxuICAgICAgICogd2hpY2ggd29yayBwZXJmZWN0bHkgZm9yIGFsbCBTaHVmZmxlJ3MgdXNlIGNhc2VzLlxuICAgICAgICpcbiAgICAgICAqIDEuIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIGBsZWZ0YCBhbmQgYHJpZ2h0YCBwcm9wZXJ0aWVzLlxuICAgICAgICogICAtIEFjY291bnRzIGZvciB0cmFuc2Zvcm0gc2NhbGVkIGVsZW1lbnRzLCBtYWtpbmcgaXQgdXNlbGVzcyBmb3IgU2h1ZmZsZVxuICAgICAgICogICBlbGVtZW50cyB3aGljaCBoYXZlIHNocnVuay5cbiAgICAgICAqIDIuIFRoZSBgb2Zmc2V0V2lkdGhgIHByb3BlcnR5LlxuICAgICAgICogICAtIFRoaXMgdmFsdWUgc3RheXMgdGhlIHNhbWUgcmVnYXJkbGVzcyBvZiB0aGUgZWxlbWVudHMgdHJhbnNmb3JtIHByb3BlcnR5LFxuICAgICAgICogICBob3dldmVyLCBpdCBkb2VzIG5vdCByZXR1cm4gc3VicGl4ZWwgdmFsdWVzLlxuICAgICAgICogMy4gZ2V0Q29tcHV0ZWRTdHlsZSgpXG4gICAgICAgKiAgIC0gVGhpcyB3b3JrcyBncmVhdCBDaHJvbWUsIEZpcmVmb3gsIFNhZmFyaSwgYnV0IElFPD0xMSBkb2VzIG5vdCBpbmNsdWRlXG4gICAgICAgKiAgIHBhZGRpbmcgYW5kIGJvcmRlciB3aGVuIGJveC1zaXppbmc6IGJvcmRlci1ib3ggaXMgc2V0LCByZXF1aXJpbmcgYSBmZWF0dXJlXG4gICAgICAgKiAgIHRlc3QgYW5kIGV4dHJhIHdvcmsgdG8gYWRkIHRoZSBwYWRkaW5nIGJhY2sgZm9yIElFIGFuZCBvdGhlciBicm93c2VycyB3aGljaFxuICAgICAgICogICBmb2xsb3cgdGhlIFczQyBzcGVjIGhlcmUuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50LlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbaW5jbHVkZU1hcmdpbnM9ZmFsc2VdIFdoZXRoZXIgdG8gaW5jbHVkZSBtYXJnaW5zLlxuICAgICAgICogQHJldHVybiB7e3dpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyfX0gVGhlIHdpZHRoIGFuZCBoZWlnaHQuXG4gICAgICAgKi9cblxuICAgIH1dLCBbe1xuICAgICAga2V5OiBcImdldFNpemVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTaXplKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGluY2x1ZGVNYXJnaW5zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcbiAgICAgICAgLy8gU3RvcmUgdGhlIHN0eWxlcyBzbyB0aGF0IHRoZXkgY2FuIGJlIHVzZWQgYnkgb3RoZXJzIHdpdGhvdXQgYXNraW5nIGZvciBpdCBhZ2Fpbi5cbiAgICAgICAgdmFyIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpO1xuICAgICAgICB2YXIgd2lkdGggPSBnZXROdW1iZXJTdHlsZShlbGVtZW50LCAnd2lkdGgnLCBzdHlsZXMpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gZ2V0TnVtYmVyU3R5bGUoZWxlbWVudCwgJ2hlaWdodCcsIHN0eWxlcyk7XG5cbiAgICAgICAgaWYgKGluY2x1ZGVNYXJnaW5zKSB7XG4gICAgICAgICAgdmFyIG1hcmdpbkxlZnQgPSBnZXROdW1iZXJTdHlsZShlbGVtZW50LCAnbWFyZ2luTGVmdCcsIHN0eWxlcyk7XG4gICAgICAgICAgdmFyIG1hcmdpblJpZ2h0ID0gZ2V0TnVtYmVyU3R5bGUoZWxlbWVudCwgJ21hcmdpblJpZ2h0Jywgc3R5bGVzKTtcbiAgICAgICAgICB2YXIgbWFyZ2luVG9wID0gZ2V0TnVtYmVyU3R5bGUoZWxlbWVudCwgJ21hcmdpblRvcCcsIHN0eWxlcyk7XG4gICAgICAgICAgdmFyIG1hcmdpbkJvdHRvbSA9IGdldE51bWJlclN0eWxlKGVsZW1lbnQsICdtYXJnaW5Cb3R0b20nLCBzdHlsZXMpO1xuICAgICAgICAgIHdpZHRoICs9IG1hcmdpbkxlZnQgKyBtYXJnaW5SaWdodDtcbiAgICAgICAgICBoZWlnaHQgKz0gbWFyZ2luVG9wICsgbWFyZ2luQm90dG9tO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogQ2hhbmdlIGEgcHJvcGVydHkgb3IgZXhlY3V0ZSBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgbm90IGhhdmUgYSB0cmFuc2l0aW9uXG4gICAgICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxlbWVudHMgRE9NIGVsZW1lbnRzIHRoYXQgd29uJ3QgYmUgdHJhbnNpdGlvbmVkLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgQSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIGNhbGxlZCB3aGlsZSB0cmFuc2l0aW9uXG4gICAgICAgKiAgICAgaXMgc2V0IHRvIDBtcy5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfc2tpcFRyYW5zaXRpb25zXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3NraXBUcmFuc2l0aW9ucyhlbGVtZW50cywgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHplcm8gPSAnMG1zJzsgLy8gU2F2ZSBjdXJyZW50IGR1cmF0aW9uIGFuZCBkZWxheS5cblxuICAgICAgICB2YXIgZGF0YSA9IGVsZW1lbnRzLm1hcChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgIHZhciBzdHlsZSA9IGVsZW1lbnQuc3R5bGU7XG4gICAgICAgICAgdmFyIGR1cmF0aW9uID0gc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uO1xuICAgICAgICAgIHZhciBkZWxheSA9IHN0eWxlLnRyYW5zaXRpb25EZWxheTsgLy8gU2V0IHRoZSBkdXJhdGlvbiB0byB6ZXJvIHNvIGl0IGhhcHBlbnMgaW1tZWRpYXRlbHlcblxuICAgICAgICAgIHN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHplcm87XG4gICAgICAgICAgc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gemVybztcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgZGVsYXk6IGRlbGF5XG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNhbGxiYWNrKCk7IC8vIENhdXNlIGZvcmNlZCBzeW5jaHJvbm91cyBsYXlvdXQuXG5cbiAgICAgICAgZWxlbWVudHNbMF0ub2Zmc2V0V2lkdGg7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG4gICAgICAgIC8vIFB1dCB0aGUgZHVyYXRpb24gYmFja1xuXG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQsIGkpIHtcbiAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGRhdGFbaV0uZHVyYXRpb247XG4gICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkYXRhW2ldLmRlbGF5O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gU2h1ZmZsZTtcbiAgfSh0aW55RW1pdHRlcik7XG5cbiAgU2h1ZmZsZS5TaHVmZmxlSXRlbSA9IFNodWZmbGVJdGVtO1xuICBTaHVmZmxlLkFMTF9JVEVNUyA9ICdhbGwnO1xuICBTaHVmZmxlLkZJTFRFUl9BVFRSSUJVVEVfS0VZID0gJ2dyb3Vwcyc7XG4gIC8qKiBAZW51bSB7c3RyaW5nfSAqL1xuXG4gIFNodWZmbGUuRXZlbnRUeXBlID0ge1xuICAgIExBWU9VVDogJ3NodWZmbGU6bGF5b3V0JyxcbiAgICBSRU1PVkVEOiAnc2h1ZmZsZTpyZW1vdmVkJ1xuICB9O1xuICAvKiogQGVudW0ge3N0cmluZ30gKi9cblxuICBTaHVmZmxlLkNsYXNzZXMgPSBDbGFzc2VzO1xuICAvKiogQGVudW0ge3N0cmluZ30gKi9cblxuICBTaHVmZmxlLkZpbHRlck1vZGUgPSB7XG4gICAgQU5ZOiAnYW55JyxcbiAgICBBTEw6ICdhbGwnXG4gIH07IC8vIE92ZXJyaWRlYWJsZSBvcHRpb25zXG5cbiAgU2h1ZmZsZS5vcHRpb25zID0ge1xuICAgIC8vIEluaXRpYWwgZmlsdGVyIGdyb3VwLlxuICAgIGdyb3VwOiBTaHVmZmxlLkFMTF9JVEVNUyxcbiAgICAvLyBUcmFuc2l0aW9uL2FuaW1hdGlvbiBzcGVlZCAobWlsbGlzZWNvbmRzKS5cbiAgICBzcGVlZDogMjUwLFxuICAgIC8vIENTUyBlYXNpbmcgZnVuY3Rpb24gdG8gdXNlLlxuICAgIGVhc2luZzogJ2N1YmljLWJlemllcigwLjQsIDAuMCwgMC4yLCAxKScsXG4gICAgLy8gZS5nLiAnLnBpY3R1cmUtaXRlbScuXG4gICAgaXRlbVNlbGVjdG9yOiAnKicsXG4gICAgLy8gRWxlbWVudCBvciBzZWxlY3RvciBzdHJpbmcuIFVzZSBhbiBlbGVtZW50IHRvIGRldGVybWluZSB0aGUgc2l6ZSBvZiBjb2x1bW5zXG4gICAgLy8gYW5kIGd1dHRlcnMuXG4gICAgc2l6ZXI6IG51bGwsXG4gICAgLy8gQSBzdGF0aWMgbnVtYmVyIG9yIGZ1bmN0aW9uIHRoYXQgdGVsbHMgdGhlIHBsdWdpbiBob3cgd2lkZSB0aGUgZ3V0dGVyc1xuICAgIC8vIGJldHdlZW4gY29sdW1ucyBhcmUgKGluIHBpeGVscykuXG4gICAgZ3V0dGVyV2lkdGg6IDAsXG4gICAgLy8gQSBzdGF0aWMgbnVtYmVyIG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIG51bWJlciB3aGljaCB0ZWxscyB0aGUgcGx1Z2luXG4gICAgLy8gaG93IHdpZGUgdGhlIGNvbHVtbnMgYXJlIChpbiBwaXhlbHMpLlxuICAgIGNvbHVtbldpZHRoOiAwLFxuICAgIC8vIElmIHlvdXIgZ3JvdXAgaXMgbm90IGpzb24sIGFuZCBpcyBjb21tYSBkZWxpbWV0ZWQsIHlvdSBjb3VsZCBzZXQgZGVsaW1pdGVyXG4gICAgLy8gdG8gJywnLlxuICAgIGRlbGltaXRlcjogbnVsbCxcbiAgICAvLyBVc2VmdWwgZm9yIHBlcmNlbnRhZ2UgYmFzZWQgaGVpZ2h0cyB3aGVuIHRoZXkgbWlnaHQgbm90IGFsd2F5cyBiZSBleGFjdGx5XG4gICAgLy8gdGhlIHNhbWUgKGluIHBpeGVscykuXG4gICAgYnVmZmVyOiAwLFxuICAgIC8vIFJlYWRpbmcgdGhlIHdpZHRoIG9mIGVsZW1lbnRzIGlzbid0IHByZWNpc2UgZW5vdWdoIGFuZCBjYW4gY2F1c2UgY29sdW1ucyB0b1xuICAgIC8vIGp1bXAgYmV0d2VlbiB2YWx1ZXMuXG4gICAgY29sdW1uVGhyZXNob2xkOiAwLjAxLFxuICAgIC8vIFNodWZmbGUgY2FuIGJlIGlzSW5pdGlhbGl6ZWQgd2l0aCBhIHNvcnQgb2JqZWN0LiBJdCBpcyB0aGUgc2FtZSBvYmplY3RcbiAgICAvLyBnaXZlbiB0byB0aGUgc29ydCBtZXRob2QuXG4gICAgaW5pdGlhbFNvcnQ6IG51bGwsXG4gICAgLy8gQnkgZGVmYXVsdCwgc2h1ZmZsZSB3aWxsIHRocm90dGxlIHJlc2l6ZSBldmVudHMuIFRoaXMgY2FuIGJlIGNoYW5nZWQgb3JcbiAgICAvLyByZW1vdmVkLlxuICAgIHRocm90dGxlOiB0aHJvdHRsZWl0LFxuICAgIC8vIEhvdyBvZnRlbiBzaHVmZmxlIGNhbiBiZSBjYWxsZWQgb24gcmVzaXplIChpbiBtaWxsaXNlY29uZHMpLlxuICAgIHRocm90dGxlVGltZTogMzAwLFxuICAgIC8vIFRyYW5zaXRpb24gZGVsYXkgb2Zmc2V0IGZvciBlYWNoIGl0ZW0gaW4gbWlsbGlzZWNvbmRzLlxuICAgIHN0YWdnZXJBbW91bnQ6IDE1LFxuICAgIC8vIE1heGltdW0gc3RhZ2dlciBkZWxheSBpbiBtaWxsaXNlY29uZHMuXG4gICAgc3RhZ2dlckFtb3VudE1heDogMTUwLFxuICAgIC8vIFdoZXRoZXIgdG8gdXNlIHRyYW5zZm9ybXMgb3IgYWJzb2x1dGUgcG9zaXRpb25pbmcuXG4gICAgdXNlVHJhbnNmb3JtczogdHJ1ZSxcbiAgICAvLyBBZmZlY3RzIHVzaW5nIGFuIGFycmF5IHdpdGggZmlsdGVyLiBlLmcuIGBmaWx0ZXIoWydvbmUnLCAndHdvJ10pYC4gV2l0aCBcImFueVwiLFxuICAgIC8vIHRoZSBlbGVtZW50IHBhc3NlcyB0aGUgdGVzdCBpZiBhbnkgb2YgaXRzIGdyb3VwcyBhcmUgaW4gdGhlIGFycmF5LiBXaXRoIFwiYWxsXCIsXG4gICAgLy8gdGhlIGVsZW1lbnQgb25seSBwYXNzZXMgaWYgYWxsIGdyb3VwcyBhcmUgaW4gdGhlIGFycmF5LlxuICAgIGZpbHRlck1vZGU6IFNodWZmbGUuRmlsdGVyTW9kZS5BTlksXG4gICAgLy8gQXR0ZW1wdCB0byBjZW50ZXIgZ3JpZCBpdGVtcyBpbiBlYWNoIHJvdy5cbiAgICBpc0NlbnRlcmVkOiBmYWxzZSxcbiAgICAvLyBXaGV0aGVyIHRvIHJvdW5kIHBpeGVsIHZhbHVlcyB1c2VkIGluIHRyYW5zbGF0ZSh4LCB5KS4gVGhpcyB1c3VhbGx5IGF2b2lkc1xuICAgIC8vIGJsdXJyaW5lc3MuXG4gICAgcm91bmRUcmFuc2Zvcm1zOiB0cnVlXG4gIH07XG4gIFNodWZmbGUuUG9pbnQgPSBQb2ludDtcbiAgU2h1ZmZsZS5SZWN0ID0gUmVjdDsgLy8gRXhwb3NlIGZvciB0ZXN0aW5nLiBIYWNrIGF0IHlvdXIgb3duIHJpc2suXG5cbiAgU2h1ZmZsZS5fX3NvcnRlciA9IHNvcnRlcjtcbiAgU2h1ZmZsZS5fX2dldENvbHVtblNwYW4gPSBnZXRDb2x1bW5TcGFuO1xuICBTaHVmZmxlLl9fZ2V0QXZhaWxhYmxlUG9zaXRpb25zID0gZ2V0QXZhaWxhYmxlUG9zaXRpb25zO1xuICBTaHVmZmxlLl9fZ2V0U2hvcnRDb2x1bW4gPSBnZXRTaG9ydENvbHVtbjtcbiAgU2h1ZmZsZS5fX2dldENlbnRlcmVkUG9zaXRpb25zID0gZ2V0Q2VudGVyZWRQb3NpdGlvbnM7XG5cbiAgcmV0dXJuIFNodWZmbGU7XG5cbn0pKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNodWZmbGUuanMubWFwXG4iXX0=
