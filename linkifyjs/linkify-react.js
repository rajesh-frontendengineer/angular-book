var Linkify = (function (React, linkifyjs) {
  'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var React__namespace = /*#__PURE__*/_interopNamespace(React);

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   * Given a string, converts to an array of valid React components
   * (which may include strings)
   * @param {string} str
   * @param {any} opts
   * @returns {React.ReactNodeArray}
   */

  function stringToElements(str, opts) {
    var tokens = linkifyjs.tokenize(str);
    var elements = [];
    var linkId = 0;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (token.t === 'nl' && opts.nl2br) {
        elements.push(React__namespace.createElement('br', {
          key: "linkified-".concat(++linkId)
        }));
        continue;
      } else if (!token.isLink || !opts.check(token)) {
        // Regular text
        elements.push(token.toString());
        continue;
      }

      var _opts$resolve = opts.resolve(token),
          formatted = _opts$resolve.formatted,
          formattedHref = _opts$resolve.formattedHref,
          tagName = _opts$resolve.tagName,
          className = _opts$resolve.className,
          target = _opts$resolve.target,
          rel = _opts$resolve.rel,
          attributes = _opts$resolve.attributes;

      var props = {
        key: "linkified-".concat(++linkId),
        href: formattedHref
      };

      if (className) {
        props.className = className;
      }

      if (target) {
        props.target = target;
      }

      if (rel) {
        props.rel = rel;
      } // Build up additional attributes
      // Support for events via attributes hash


      if (attributes) {
        for (var attr in attributes) {
          props[attr] = attributes[attr];
        }
      }

      elements.push(React__namespace.createElement(tagName, props, formatted));
    }

    return elements;
  } // Recursively linkify the contents of the given React Element instance

  /**
   * @template P
   * @template {string | React.JSXElementConstructor<P>} T
   * @param {React.ReactElement<P, T>} element
   * @param {Object} opts
   * @param {number} elementId
   * @returns {React.ReactElement<P, T>}
   */


  function linkifyReactElement(element, opts) {
    var elementId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    if (React__namespace.Children.count(element.props.children) === 0) {
      // No need to clone if the element had no children
      return element;
    }

    var children = [];
    React__namespace.Children.forEach(element.props.children, function (child) {
      if (typeof child === 'string') {
        // ensure that we always generate unique element IDs for keys
        elementId = elementId + 1;
        children.push.apply(children, _toConsumableArray(stringToElements(child, opts)));
      } else if (React__namespace.isValidElement(child)) {
        if (typeof child.type === 'string' && opts.ignoreTags.indexOf(child.type.toUpperCase()) >= 0) {
          // Don't linkify this element
          children.push(child);
        } else {
          children.push(linkifyReactElement(child, opts, ++elementId));
        }
      } else {
        // Unknown element type, just push
        children.push(child);
      }
    }); // Set a default unique key, copy over remaining props

    var newProps = {
      key: "linkified-element-".concat(elementId)
    };

    for (var prop in element.props) {
      newProps[prop] = element.props[prop];
    }

    return React__namespace.cloneElement(element, newProps, children);
  }
  /**
   * @template P
   * @template {string | React.JSXElementConstructor<P>} T
   * @param {P & { tagName?: T, options?: any, children?: React.ReactNode}} props
   * @returns {React.ReactElement<P, T>}
   */


  var Linkify = function Linkify(props) {
    // Copy over all non-linkify-specific props
    var newProps = {
      key: 'linkified-element-wrapper'
    };

    for (var prop in props) {
      if (prop !== 'options' && prop !== 'tagName' && prop !== 'children') {
        newProps[prop] = props[prop];
      }
    }

    var opts = new linkifyjs.Options(props.options);
    var tagName = props.tagName || React__namespace.Fragment || 'span';
    var children = props.children;
    var element = React__namespace.createElement(tagName, newProps, children);
    return linkifyReactElement(element, opts, 0);
  };

  return Linkify;

})(React, linkify);
