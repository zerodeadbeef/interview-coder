"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require$$1$4 = require("electron");
const require$$1$1 = require("path");
const require$$0$2 = require("crypto");
const require$$1 = require("util");
const stream = require("stream");
const require$$3 = require("http");
const require$$4$1 = require("https");
const require$$0$1 = require("url");
const require$$1$2 = require("fs");
const require$$4$2 = require("assert");
const require$$0$3 = require("tty");
const require$$1$3 = require("os");
const zlib = require("zlib");
const require$$0$4 = require("events");
const fs$l = require("node:fs");
const path$k = require("node:path");
const require$$1$5 = require("child_process");
const require$$1$6 = require("string_decoder");
const require$$0$5 = require("constants");
function bind$1(fn, thisArg) {
  return function wrap2() {
    return fn.apply(thisArg, arguments);
  };
}
const { toString: toString$1 } = Object.prototype;
const { getPrototypeOf: getPrototypeOf$1 } = Object;
const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
  const str2 = toString$1.call(thing);
  return cache[str2] || (cache[str2] = str2.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
const kindOfTest = (type2) => {
  type2 = type2.toLowerCase();
  return (thing) => kindOf(thing) === type2;
};
const typeOfTest = (type2) => (thing) => typeof thing === type2;
const { isArray } = Array;
const isUndefined = typeOfTest("undefined");
function isBuffer$1(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
const isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
const isString$1 = typeOfTest("string");
const isFunction$1 = typeOfTest("function");
const isNumber = typeOfTest("number");
const isObject$1 = (thing) => thing !== null && typeof thing === "object";
const isBoolean$1 = (thing) => thing === true || thing === false;
const isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype2 = getPrototypeOf$1(val);
  return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
const isDate = kindOfTest("Date");
const isFile = kindOfTest("File");
const isBlob = kindOfTest("Blob");
const isFileList = kindOfTest("FileList");
const isStream = (val) => isObject$1(val) && isFunction$1(val.pipe);
const isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction$1(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]"));
};
const isURLSearchParams = kindOfTest("URLSearchParams");
const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
const trim = (str2) => str2.trim ? str2.trim() : str2.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
const _global = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
const isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge$1() {
  const { caseless } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge$1(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge$1({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
const extend$1 = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction$1(val)) {
      a[key] = bind$1(val, thisArg);
    } else {
      a[key] = val;
    }
  }, { allOwnKeys });
  return a;
};
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
const inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null) return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf$1(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
const endsWith = (str2, searchString, position) => {
  str2 = String(str2);
  if (position === void 0 || position > str2.length) {
    position = str2.length;
  }
  position -= searchString.length;
  const lastIndex = str2.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
const toArray$1 = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
const isTypedArray = /* @__PURE__ */ ((TypedArray2) => {
  return (thing) => {
    return TypedArray2 && thing instanceof TypedArray2;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf$1(Uint8Array));
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];
  const iterator = generator.call(obj);
  let result;
  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
const matchAll = (regExp, str2) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str2)) !== null) {
    arr.push(matches);
  }
  return arr;
};
const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str2) => {
  return str2.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction$1(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction$1(value)) return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
const noop$2 = () => {
};
const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction$1(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
const toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject$1(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
const isAsyncFn = kindOfTest("AsyncFunction");
const isThenable = (thing) => thing && (isObject$1(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }
  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({ source, data }) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);
    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    };
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === "function",
  isFunction$1(_global.postMessage)
);
const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
const utils$3 = {
  isArray,
  isArrayBuffer,
  isBuffer: isBuffer$1,
  isFormData,
  isArrayBufferView,
  isString: isString$1,
  isNumber,
  isBoolean: isBoolean$1,
  isObject: isObject$1,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction: isFunction$1,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge: merge$1,
  extend: extend$1,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray: toArray$1,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop: noop$2,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap
};
function AxiosError$1(message, code, config2, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config2 && (this.config = config2);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}
utils$3.inherits(AxiosError$1, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$3.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const prototype$1 = AxiosError$1.prototype;
const descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError$1, descriptors);
Object.defineProperty(prototype$1, "isAxiosError", { value: true });
AxiosError$1.from = (error2, code, config2, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);
  utils$3.toFlatObject(error2, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  AxiosError$1.call(axiosError, error2.message, code, config2, request, response);
  axiosError.cause = error2;
  axiosError.name = error2.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var Stream$3 = stream.Stream;
var util$5 = require$$1;
var delayed_stream = DelayedStream$1;
function DelayedStream$1() {
  this.source = null;
  this.dataSize = 0;
  this.maxDataSize = 1024 * 1024;
  this.pauseStream = true;
  this._maxDataSizeExceeded = false;
  this._released = false;
  this._bufferedEvents = [];
}
util$5.inherits(DelayedStream$1, Stream$3);
DelayedStream$1.create = function(source, options) {
  var delayedStream = new this();
  options = options || {};
  for (var option in options) {
    delayedStream[option] = options[option];
  }
  delayedStream.source = source;
  var realEmit = source.emit;
  source.emit = function() {
    delayedStream._handleEmit(arguments);
    return realEmit.apply(source, arguments);
  };
  source.on("error", function() {
  });
  if (delayedStream.pauseStream) {
    source.pause();
  }
  return delayedStream;
};
Object.defineProperty(DelayedStream$1.prototype, "readable", {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.source.readable;
  }
});
DelayedStream$1.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};
DelayedStream$1.prototype.resume = function() {
  if (!this._released) {
    this.release();
  }
  this.source.resume();
};
DelayedStream$1.prototype.pause = function() {
  this.source.pause();
};
DelayedStream$1.prototype.release = function() {
  this._released = true;
  this._bufferedEvents.forEach((function(args) {
    this.emit.apply(this, args);
  }).bind(this));
  this._bufferedEvents = [];
};
DelayedStream$1.prototype.pipe = function() {
  var r = Stream$3.prototype.pipe.apply(this, arguments);
  this.resume();
  return r;
};
DelayedStream$1.prototype._handleEmit = function(args) {
  if (this._released) {
    this.emit.apply(this, args);
    return;
  }
  if (args[0] === "data") {
    this.dataSize += args[1].length;
    this._checkIfMaxDataSizeExceeded();
  }
  this._bufferedEvents.push(args);
};
DelayedStream$1.prototype._checkIfMaxDataSizeExceeded = function() {
  if (this._maxDataSizeExceeded) {
    return;
  }
  if (this.dataSize <= this.maxDataSize) {
    return;
  }
  this._maxDataSizeExceeded = true;
  var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
  this.emit("error", new Error(message));
};
var util$4 = require$$1;
var Stream$2 = stream.Stream;
var DelayedStream = delayed_stream;
var combined_stream = CombinedStream$1;
function CombinedStream$1() {
  this.writable = false;
  this.readable = true;
  this.dataSize = 0;
  this.maxDataSize = 2 * 1024 * 1024;
  this.pauseStreams = true;
  this._released = false;
  this._streams = [];
  this._currentStream = null;
  this._insideLoop = false;
  this._pendingNext = false;
}
util$4.inherits(CombinedStream$1, Stream$2);
CombinedStream$1.create = function(options) {
  var combinedStream = new this();
  options = options || {};
  for (var option in options) {
    combinedStream[option] = options[option];
  }
  return combinedStream;
};
CombinedStream$1.isStreamLike = function(stream2) {
  return typeof stream2 !== "function" && typeof stream2 !== "string" && typeof stream2 !== "boolean" && typeof stream2 !== "number" && !Buffer.isBuffer(stream2);
};
CombinedStream$1.prototype.append = function(stream2) {
  var isStreamLike = CombinedStream$1.isStreamLike(stream2);
  if (isStreamLike) {
    if (!(stream2 instanceof DelayedStream)) {
      var newStream = DelayedStream.create(stream2, {
        maxDataSize: Infinity,
        pauseStream: this.pauseStreams
      });
      stream2.on("data", this._checkDataSize.bind(this));
      stream2 = newStream;
    }
    this._handleErrors(stream2);
    if (this.pauseStreams) {
      stream2.pause();
    }
  }
  this._streams.push(stream2);
  return this;
};
CombinedStream$1.prototype.pipe = function(dest, options) {
  Stream$2.prototype.pipe.call(this, dest, options);
  this.resume();
  return dest;
};
CombinedStream$1.prototype._getNext = function() {
  this._currentStream = null;
  if (this._insideLoop) {
    this._pendingNext = true;
    return;
  }
  this._insideLoop = true;
  try {
    do {
      this._pendingNext = false;
      this._realGetNext();
    } while (this._pendingNext);
  } finally {
    this._insideLoop = false;
  }
};
CombinedStream$1.prototype._realGetNext = function() {
  var stream2 = this._streams.shift();
  if (typeof stream2 == "undefined") {
    this.end();
    return;
  }
  if (typeof stream2 !== "function") {
    this._pipeNext(stream2);
    return;
  }
  var getStream = stream2;
  getStream((function(stream3) {
    var isStreamLike = CombinedStream$1.isStreamLike(stream3);
    if (isStreamLike) {
      stream3.on("data", this._checkDataSize.bind(this));
      this._handleErrors(stream3);
    }
    this._pipeNext(stream3);
  }).bind(this));
};
CombinedStream$1.prototype._pipeNext = function(stream2) {
  this._currentStream = stream2;
  var isStreamLike = CombinedStream$1.isStreamLike(stream2);
  if (isStreamLike) {
    stream2.on("end", this._getNext.bind(this));
    stream2.pipe(this, { end: false });
    return;
  }
  var value = stream2;
  this.write(value);
  this._getNext();
};
CombinedStream$1.prototype._handleErrors = function(stream2) {
  var self2 = this;
  stream2.on("error", function(err) {
    self2._emitError(err);
  });
};
CombinedStream$1.prototype.write = function(data) {
  this.emit("data", data);
};
CombinedStream$1.prototype.pause = function() {
  if (!this.pauseStreams) {
    return;
  }
  if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
  this.emit("pause");
};
CombinedStream$1.prototype.resume = function() {
  if (!this._released) {
    this._released = true;
    this.writable = true;
    this._getNext();
  }
  if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
  this.emit("resume");
};
CombinedStream$1.prototype.end = function() {
  this._reset();
  this.emit("end");
};
CombinedStream$1.prototype.destroy = function() {
  this._reset();
  this.emit("close");
};
CombinedStream$1.prototype._reset = function() {
  this.writable = false;
  this._streams = [];
  this._currentStream = null;
};
CombinedStream$1.prototype._checkDataSize = function() {
  this._updateDataSize();
  if (this.dataSize <= this.maxDataSize) {
    return;
  }
  var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
  this._emitError(new Error(message));
};
CombinedStream$1.prototype._updateDataSize = function() {
  this.dataSize = 0;
  var self2 = this;
  this._streams.forEach(function(stream2) {
    if (!stream2.dataSize) {
      return;
    }
    self2.dataSize += stream2.dataSize;
  });
  if (this._currentStream && this._currentStream.dataSize) {
    this.dataSize += this._currentStream.dataSize;
  }
};
CombinedStream$1.prototype._emitError = function(err) {
  this._reset();
  this.emit("error", err);
};
var mimeTypes = {};
const require$$0 = {
  "application/1d-interleaved-parityfec": {
    source: "iana"
  },
  "application/3gpdash-qoe-report+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/3gpp-ims+xml": {
    source: "iana",
    compressible: true
  },
  "application/3gpphal+json": {
    source: "iana",
    compressible: true
  },
  "application/3gpphalforms+json": {
    source: "iana",
    compressible: true
  },
  "application/a2l": {
    source: "iana"
  },
  "application/ace+cbor": {
    source: "iana"
  },
  "application/activemessage": {
    source: "iana"
  },
  "application/activity+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-costmap+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-costmapfilter+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-directory+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-endpointcost+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-endpointcostparams+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-endpointprop+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-endpointpropparams+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-error+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-networkmap+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-networkmapfilter+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-updatestreamcontrol+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-updatestreamparams+json": {
    source: "iana",
    compressible: true
  },
  "application/aml": {
    source: "iana"
  },
  "application/andrew-inset": {
    source: "iana",
    extensions: [
      "ez"
    ]
  },
  "application/applefile": {
    source: "iana"
  },
  "application/applixware": {
    source: "apache",
    extensions: [
      "aw"
    ]
  },
  "application/at+jwt": {
    source: "iana"
  },
  "application/atf": {
    source: "iana"
  },
  "application/atfx": {
    source: "iana"
  },
  "application/atom+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "atom"
    ]
  },
  "application/atomcat+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "atomcat"
    ]
  },
  "application/atomdeleted+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "atomdeleted"
    ]
  },
  "application/atomicmail": {
    source: "iana"
  },
  "application/atomsvc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "atomsvc"
    ]
  },
  "application/atsc-dwd+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "dwd"
    ]
  },
  "application/atsc-dynamic-event-message": {
    source: "iana"
  },
  "application/atsc-held+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "held"
    ]
  },
  "application/atsc-rdt+json": {
    source: "iana",
    compressible: true
  },
  "application/atsc-rsat+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rsat"
    ]
  },
  "application/atxml": {
    source: "iana"
  },
  "application/auth-policy+xml": {
    source: "iana",
    compressible: true
  },
  "application/bacnet-xdd+zip": {
    source: "iana",
    compressible: false
  },
  "application/batch-smtp": {
    source: "iana"
  },
  "application/bdoc": {
    compressible: false,
    extensions: [
      "bdoc"
    ]
  },
  "application/beep+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/calendar+json": {
    source: "iana",
    compressible: true
  },
  "application/calendar+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xcs"
    ]
  },
  "application/call-completion": {
    source: "iana"
  },
  "application/cals-1840": {
    source: "iana"
  },
  "application/captive+json": {
    source: "iana",
    compressible: true
  },
  "application/cbor": {
    source: "iana"
  },
  "application/cbor-seq": {
    source: "iana"
  },
  "application/cccex": {
    source: "iana"
  },
  "application/ccmp+xml": {
    source: "iana",
    compressible: true
  },
  "application/ccxml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "ccxml"
    ]
  },
  "application/cdfx+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "cdfx"
    ]
  },
  "application/cdmi-capability": {
    source: "iana",
    extensions: [
      "cdmia"
    ]
  },
  "application/cdmi-container": {
    source: "iana",
    extensions: [
      "cdmic"
    ]
  },
  "application/cdmi-domain": {
    source: "iana",
    extensions: [
      "cdmid"
    ]
  },
  "application/cdmi-object": {
    source: "iana",
    extensions: [
      "cdmio"
    ]
  },
  "application/cdmi-queue": {
    source: "iana",
    extensions: [
      "cdmiq"
    ]
  },
  "application/cdni": {
    source: "iana"
  },
  "application/cea": {
    source: "iana"
  },
  "application/cea-2018+xml": {
    source: "iana",
    compressible: true
  },
  "application/cellml+xml": {
    source: "iana",
    compressible: true
  },
  "application/cfw": {
    source: "iana"
  },
  "application/city+json": {
    source: "iana",
    compressible: true
  },
  "application/clr": {
    source: "iana"
  },
  "application/clue+xml": {
    source: "iana",
    compressible: true
  },
  "application/clue_info+xml": {
    source: "iana",
    compressible: true
  },
  "application/cms": {
    source: "iana"
  },
  "application/cnrp+xml": {
    source: "iana",
    compressible: true
  },
  "application/coap-group+json": {
    source: "iana",
    compressible: true
  },
  "application/coap-payload": {
    source: "iana"
  },
  "application/commonground": {
    source: "iana"
  },
  "application/conference-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/cose": {
    source: "iana"
  },
  "application/cose-key": {
    source: "iana"
  },
  "application/cose-key-set": {
    source: "iana"
  },
  "application/cpl+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "cpl"
    ]
  },
  "application/csrattrs": {
    source: "iana"
  },
  "application/csta+xml": {
    source: "iana",
    compressible: true
  },
  "application/cstadata+xml": {
    source: "iana",
    compressible: true
  },
  "application/csvm+json": {
    source: "iana",
    compressible: true
  },
  "application/cu-seeme": {
    source: "apache",
    extensions: [
      "cu"
    ]
  },
  "application/cwt": {
    source: "iana"
  },
  "application/cybercash": {
    source: "iana"
  },
  "application/dart": {
    compressible: true
  },
  "application/dash+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mpd"
    ]
  },
  "application/dash-patch+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mpp"
    ]
  },
  "application/dashdelta": {
    source: "iana"
  },
  "application/davmount+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "davmount"
    ]
  },
  "application/dca-rft": {
    source: "iana"
  },
  "application/dcd": {
    source: "iana"
  },
  "application/dec-dx": {
    source: "iana"
  },
  "application/dialog-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/dicom": {
    source: "iana"
  },
  "application/dicom+json": {
    source: "iana",
    compressible: true
  },
  "application/dicom+xml": {
    source: "iana",
    compressible: true
  },
  "application/dii": {
    source: "iana"
  },
  "application/dit": {
    source: "iana"
  },
  "application/dns": {
    source: "iana"
  },
  "application/dns+json": {
    source: "iana",
    compressible: true
  },
  "application/dns-message": {
    source: "iana"
  },
  "application/docbook+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "dbk"
    ]
  },
  "application/dots+cbor": {
    source: "iana"
  },
  "application/dskpp+xml": {
    source: "iana",
    compressible: true
  },
  "application/dssc+der": {
    source: "iana",
    extensions: [
      "dssc"
    ]
  },
  "application/dssc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xdssc"
    ]
  },
  "application/dvcs": {
    source: "iana"
  },
  "application/ecmascript": {
    source: "iana",
    compressible: true,
    extensions: [
      "es",
      "ecma"
    ]
  },
  "application/edi-consent": {
    source: "iana"
  },
  "application/edi-x12": {
    source: "iana",
    compressible: false
  },
  "application/edifact": {
    source: "iana",
    compressible: false
  },
  "application/efi": {
    source: "iana"
  },
  "application/elm+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/elm+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.cap+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/emergencycalldata.comment+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.control+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.deviceinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.ecall.msd": {
    source: "iana"
  },
  "application/emergencycalldata.providerinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.serviceinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.subscriberinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.veds+xml": {
    source: "iana",
    compressible: true
  },
  "application/emma+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "emma"
    ]
  },
  "application/emotionml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "emotionml"
    ]
  },
  "application/encaprtp": {
    source: "iana"
  },
  "application/epp+xml": {
    source: "iana",
    compressible: true
  },
  "application/epub+zip": {
    source: "iana",
    compressible: false,
    extensions: [
      "epub"
    ]
  },
  "application/eshop": {
    source: "iana"
  },
  "application/exi": {
    source: "iana",
    extensions: [
      "exi"
    ]
  },
  "application/expect-ct-report+json": {
    source: "iana",
    compressible: true
  },
  "application/express": {
    source: "iana",
    extensions: [
      "exp"
    ]
  },
  "application/fastinfoset": {
    source: "iana"
  },
  "application/fastsoap": {
    source: "iana"
  },
  "application/fdt+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "fdt"
    ]
  },
  "application/fhir+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/fhir+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/fido.trusted-apps+json": {
    compressible: true
  },
  "application/fits": {
    source: "iana"
  },
  "application/flexfec": {
    source: "iana"
  },
  "application/font-sfnt": {
    source: "iana"
  },
  "application/font-tdpfr": {
    source: "iana",
    extensions: [
      "pfr"
    ]
  },
  "application/font-woff": {
    source: "iana",
    compressible: false
  },
  "application/framework-attributes+xml": {
    source: "iana",
    compressible: true
  },
  "application/geo+json": {
    source: "iana",
    compressible: true,
    extensions: [
      "geojson"
    ]
  },
  "application/geo+json-seq": {
    source: "iana"
  },
  "application/geopackage+sqlite3": {
    source: "iana"
  },
  "application/geoxacml+xml": {
    source: "iana",
    compressible: true
  },
  "application/gltf-buffer": {
    source: "iana"
  },
  "application/gml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "gml"
    ]
  },
  "application/gpx+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "gpx"
    ]
  },
  "application/gxf": {
    source: "apache",
    extensions: [
      "gxf"
    ]
  },
  "application/gzip": {
    source: "iana",
    compressible: false,
    extensions: [
      "gz"
    ]
  },
  "application/h224": {
    source: "iana"
  },
  "application/held+xml": {
    source: "iana",
    compressible: true
  },
  "application/hjson": {
    extensions: [
      "hjson"
    ]
  },
  "application/http": {
    source: "iana"
  },
  "application/hyperstudio": {
    source: "iana",
    extensions: [
      "stk"
    ]
  },
  "application/ibe-key-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/ibe-pkg-reply+xml": {
    source: "iana",
    compressible: true
  },
  "application/ibe-pp-data": {
    source: "iana"
  },
  "application/iges": {
    source: "iana"
  },
  "application/im-iscomposing+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/index": {
    source: "iana"
  },
  "application/index.cmd": {
    source: "iana"
  },
  "application/index.obj": {
    source: "iana"
  },
  "application/index.response": {
    source: "iana"
  },
  "application/index.vnd": {
    source: "iana"
  },
  "application/inkml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "ink",
      "inkml"
    ]
  },
  "application/iotp": {
    source: "iana"
  },
  "application/ipfix": {
    source: "iana",
    extensions: [
      "ipfix"
    ]
  },
  "application/ipp": {
    source: "iana"
  },
  "application/isup": {
    source: "iana"
  },
  "application/its+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "its"
    ]
  },
  "application/java-archive": {
    source: "apache",
    compressible: false,
    extensions: [
      "jar",
      "war",
      "ear"
    ]
  },
  "application/java-serialized-object": {
    source: "apache",
    compressible: false,
    extensions: [
      "ser"
    ]
  },
  "application/java-vm": {
    source: "apache",
    compressible: false,
    extensions: [
      "class"
    ]
  },
  "application/javascript": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "js",
      "mjs"
    ]
  },
  "application/jf2feed+json": {
    source: "iana",
    compressible: true
  },
  "application/jose": {
    source: "iana"
  },
  "application/jose+json": {
    source: "iana",
    compressible: true
  },
  "application/jrd+json": {
    source: "iana",
    compressible: true
  },
  "application/jscalendar+json": {
    source: "iana",
    compressible: true
  },
  "application/json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "json",
      "map"
    ]
  },
  "application/json-patch+json": {
    source: "iana",
    compressible: true
  },
  "application/json-seq": {
    source: "iana"
  },
  "application/json5": {
    extensions: [
      "json5"
    ]
  },
  "application/jsonml+json": {
    source: "apache",
    compressible: true,
    extensions: [
      "jsonml"
    ]
  },
  "application/jwk+json": {
    source: "iana",
    compressible: true
  },
  "application/jwk-set+json": {
    source: "iana",
    compressible: true
  },
  "application/jwt": {
    source: "iana"
  },
  "application/kpml-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/kpml-response+xml": {
    source: "iana",
    compressible: true
  },
  "application/ld+json": {
    source: "iana",
    compressible: true,
    extensions: [
      "jsonld"
    ]
  },
  "application/lgr+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "lgr"
    ]
  },
  "application/link-format": {
    source: "iana"
  },
  "application/load-control+xml": {
    source: "iana",
    compressible: true
  },
  "application/lost+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "lostxml"
    ]
  },
  "application/lostsync+xml": {
    source: "iana",
    compressible: true
  },
  "application/lpf+zip": {
    source: "iana",
    compressible: false
  },
  "application/lxf": {
    source: "iana"
  },
  "application/mac-binhex40": {
    source: "iana",
    extensions: [
      "hqx"
    ]
  },
  "application/mac-compactpro": {
    source: "apache",
    extensions: [
      "cpt"
    ]
  },
  "application/macwriteii": {
    source: "iana"
  },
  "application/mads+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mads"
    ]
  },
  "application/manifest+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "webmanifest"
    ]
  },
  "application/marc": {
    source: "iana",
    extensions: [
      "mrc"
    ]
  },
  "application/marcxml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mrcx"
    ]
  },
  "application/mathematica": {
    source: "iana",
    extensions: [
      "ma",
      "nb",
      "mb"
    ]
  },
  "application/mathml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mathml"
    ]
  },
  "application/mathml-content+xml": {
    source: "iana",
    compressible: true
  },
  "application/mathml-presentation+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-associated-procedure-description+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-deregister+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-envelope+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-msk+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-msk-response+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-protection-description+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-reception-report+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-register+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-register-response+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-schedule+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-user-service-description+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbox": {
    source: "iana",
    extensions: [
      "mbox"
    ]
  },
  "application/media-policy-dataset+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mpf"
    ]
  },
  "application/media_control+xml": {
    source: "iana",
    compressible: true
  },
  "application/mediaservercontrol+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mscml"
    ]
  },
  "application/merge-patch+json": {
    source: "iana",
    compressible: true
  },
  "application/metalink+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "metalink"
    ]
  },
  "application/metalink4+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "meta4"
    ]
  },
  "application/mets+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mets"
    ]
  },
  "application/mf4": {
    source: "iana"
  },
  "application/mikey": {
    source: "iana"
  },
  "application/mipc": {
    source: "iana"
  },
  "application/missing-blocks+cbor-seq": {
    source: "iana"
  },
  "application/mmt-aei+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "maei"
    ]
  },
  "application/mmt-usd+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "musd"
    ]
  },
  "application/mods+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mods"
    ]
  },
  "application/moss-keys": {
    source: "iana"
  },
  "application/moss-signature": {
    source: "iana"
  },
  "application/mosskey-data": {
    source: "iana"
  },
  "application/mosskey-request": {
    source: "iana"
  },
  "application/mp21": {
    source: "iana",
    extensions: [
      "m21",
      "mp21"
    ]
  },
  "application/mp4": {
    source: "iana",
    extensions: [
      "mp4s",
      "m4p"
    ]
  },
  "application/mpeg4-generic": {
    source: "iana"
  },
  "application/mpeg4-iod": {
    source: "iana"
  },
  "application/mpeg4-iod-xmt": {
    source: "iana"
  },
  "application/mrb-consumer+xml": {
    source: "iana",
    compressible: true
  },
  "application/mrb-publish+xml": {
    source: "iana",
    compressible: true
  },
  "application/msc-ivr+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/msc-mixer+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/msword": {
    source: "iana",
    compressible: false,
    extensions: [
      "doc",
      "dot"
    ]
  },
  "application/mud+json": {
    source: "iana",
    compressible: true
  },
  "application/multipart-core": {
    source: "iana"
  },
  "application/mxf": {
    source: "iana",
    extensions: [
      "mxf"
    ]
  },
  "application/n-quads": {
    source: "iana",
    extensions: [
      "nq"
    ]
  },
  "application/n-triples": {
    source: "iana",
    extensions: [
      "nt"
    ]
  },
  "application/nasdata": {
    source: "iana"
  },
  "application/news-checkgroups": {
    source: "iana",
    charset: "US-ASCII"
  },
  "application/news-groupinfo": {
    source: "iana",
    charset: "US-ASCII"
  },
  "application/news-transmission": {
    source: "iana"
  },
  "application/nlsml+xml": {
    source: "iana",
    compressible: true
  },
  "application/node": {
    source: "iana",
    extensions: [
      "cjs"
    ]
  },
  "application/nss": {
    source: "iana"
  },
  "application/oauth-authz-req+jwt": {
    source: "iana"
  },
  "application/oblivious-dns-message": {
    source: "iana"
  },
  "application/ocsp-request": {
    source: "iana"
  },
  "application/ocsp-response": {
    source: "iana"
  },
  "application/octet-stream": {
    source: "iana",
    compressible: false,
    extensions: [
      "bin",
      "dms",
      "lrf",
      "mar",
      "so",
      "dist",
      "distz",
      "pkg",
      "bpk",
      "dump",
      "elc",
      "deploy",
      "exe",
      "dll",
      "deb",
      "dmg",
      "iso",
      "img",
      "msi",
      "msp",
      "msm",
      "buffer"
    ]
  },
  "application/oda": {
    source: "iana",
    extensions: [
      "oda"
    ]
  },
  "application/odm+xml": {
    source: "iana",
    compressible: true
  },
  "application/odx": {
    source: "iana"
  },
  "application/oebps-package+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "opf"
    ]
  },
  "application/ogg": {
    source: "iana",
    compressible: false,
    extensions: [
      "ogx"
    ]
  },
  "application/omdoc+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "omdoc"
    ]
  },
  "application/onenote": {
    source: "apache",
    extensions: [
      "onetoc",
      "onetoc2",
      "onetmp",
      "onepkg"
    ]
  },
  "application/opc-nodeset+xml": {
    source: "iana",
    compressible: true
  },
  "application/oscore": {
    source: "iana"
  },
  "application/oxps": {
    source: "iana",
    extensions: [
      "oxps"
    ]
  },
  "application/p21": {
    source: "iana"
  },
  "application/p21+zip": {
    source: "iana",
    compressible: false
  },
  "application/p2p-overlay+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "relo"
    ]
  },
  "application/parityfec": {
    source: "iana"
  },
  "application/passport": {
    source: "iana"
  },
  "application/patch-ops-error+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xer"
    ]
  },
  "application/pdf": {
    source: "iana",
    compressible: false,
    extensions: [
      "pdf"
    ]
  },
  "application/pdx": {
    source: "iana"
  },
  "application/pem-certificate-chain": {
    source: "iana"
  },
  "application/pgp-encrypted": {
    source: "iana",
    compressible: false,
    extensions: [
      "pgp"
    ]
  },
  "application/pgp-keys": {
    source: "iana",
    extensions: [
      "asc"
    ]
  },
  "application/pgp-signature": {
    source: "iana",
    extensions: [
      "asc",
      "sig"
    ]
  },
  "application/pics-rules": {
    source: "apache",
    extensions: [
      "prf"
    ]
  },
  "application/pidf+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/pidf-diff+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/pkcs10": {
    source: "iana",
    extensions: [
      "p10"
    ]
  },
  "application/pkcs12": {
    source: "iana"
  },
  "application/pkcs7-mime": {
    source: "iana",
    extensions: [
      "p7m",
      "p7c"
    ]
  },
  "application/pkcs7-signature": {
    source: "iana",
    extensions: [
      "p7s"
    ]
  },
  "application/pkcs8": {
    source: "iana",
    extensions: [
      "p8"
    ]
  },
  "application/pkcs8-encrypted": {
    source: "iana"
  },
  "application/pkix-attr-cert": {
    source: "iana",
    extensions: [
      "ac"
    ]
  },
  "application/pkix-cert": {
    source: "iana",
    extensions: [
      "cer"
    ]
  },
  "application/pkix-crl": {
    source: "iana",
    extensions: [
      "crl"
    ]
  },
  "application/pkix-pkipath": {
    source: "iana",
    extensions: [
      "pkipath"
    ]
  },
  "application/pkixcmp": {
    source: "iana",
    extensions: [
      "pki"
    ]
  },
  "application/pls+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "pls"
    ]
  },
  "application/poc-settings+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/postscript": {
    source: "iana",
    compressible: true,
    extensions: [
      "ai",
      "eps",
      "ps"
    ]
  },
  "application/ppsp-tracker+json": {
    source: "iana",
    compressible: true
  },
  "application/problem+json": {
    source: "iana",
    compressible: true
  },
  "application/problem+xml": {
    source: "iana",
    compressible: true
  },
  "application/provenance+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "provx"
    ]
  },
  "application/prs.alvestrand.titrax-sheet": {
    source: "iana"
  },
  "application/prs.cww": {
    source: "iana",
    extensions: [
      "cww"
    ]
  },
  "application/prs.cyn": {
    source: "iana",
    charset: "7-BIT"
  },
  "application/prs.hpub+zip": {
    source: "iana",
    compressible: false
  },
  "application/prs.nprend": {
    source: "iana"
  },
  "application/prs.plucker": {
    source: "iana"
  },
  "application/prs.rdf-xml-crypt": {
    source: "iana"
  },
  "application/prs.xsf+xml": {
    source: "iana",
    compressible: true
  },
  "application/pskc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "pskcxml"
    ]
  },
  "application/pvd+json": {
    source: "iana",
    compressible: true
  },
  "application/qsig": {
    source: "iana"
  },
  "application/raml+yaml": {
    compressible: true,
    extensions: [
      "raml"
    ]
  },
  "application/raptorfec": {
    source: "iana"
  },
  "application/rdap+json": {
    source: "iana",
    compressible: true
  },
  "application/rdf+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rdf",
      "owl"
    ]
  },
  "application/reginfo+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rif"
    ]
  },
  "application/relax-ng-compact-syntax": {
    source: "iana",
    extensions: [
      "rnc"
    ]
  },
  "application/remote-printing": {
    source: "iana"
  },
  "application/reputon+json": {
    source: "iana",
    compressible: true
  },
  "application/resource-lists+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rl"
    ]
  },
  "application/resource-lists-diff+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rld"
    ]
  },
  "application/rfc+xml": {
    source: "iana",
    compressible: true
  },
  "application/riscos": {
    source: "iana"
  },
  "application/rlmi+xml": {
    source: "iana",
    compressible: true
  },
  "application/rls-services+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rs"
    ]
  },
  "application/route-apd+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rapd"
    ]
  },
  "application/route-s-tsid+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sls"
    ]
  },
  "application/route-usd+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rusd"
    ]
  },
  "application/rpki-ghostbusters": {
    source: "iana",
    extensions: [
      "gbr"
    ]
  },
  "application/rpki-manifest": {
    source: "iana",
    extensions: [
      "mft"
    ]
  },
  "application/rpki-publication": {
    source: "iana"
  },
  "application/rpki-roa": {
    source: "iana",
    extensions: [
      "roa"
    ]
  },
  "application/rpki-updown": {
    source: "iana"
  },
  "application/rsd+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "rsd"
    ]
  },
  "application/rss+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "rss"
    ]
  },
  "application/rtf": {
    source: "iana",
    compressible: true,
    extensions: [
      "rtf"
    ]
  },
  "application/rtploopback": {
    source: "iana"
  },
  "application/rtx": {
    source: "iana"
  },
  "application/samlassertion+xml": {
    source: "iana",
    compressible: true
  },
  "application/samlmetadata+xml": {
    source: "iana",
    compressible: true
  },
  "application/sarif+json": {
    source: "iana",
    compressible: true
  },
  "application/sarif-external-properties+json": {
    source: "iana",
    compressible: true
  },
  "application/sbe": {
    source: "iana"
  },
  "application/sbml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sbml"
    ]
  },
  "application/scaip+xml": {
    source: "iana",
    compressible: true
  },
  "application/scim+json": {
    source: "iana",
    compressible: true
  },
  "application/scvp-cv-request": {
    source: "iana",
    extensions: [
      "scq"
    ]
  },
  "application/scvp-cv-response": {
    source: "iana",
    extensions: [
      "scs"
    ]
  },
  "application/scvp-vp-request": {
    source: "iana",
    extensions: [
      "spq"
    ]
  },
  "application/scvp-vp-response": {
    source: "iana",
    extensions: [
      "spp"
    ]
  },
  "application/sdp": {
    source: "iana",
    extensions: [
      "sdp"
    ]
  },
  "application/secevent+jwt": {
    source: "iana"
  },
  "application/senml+cbor": {
    source: "iana"
  },
  "application/senml+json": {
    source: "iana",
    compressible: true
  },
  "application/senml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "senmlx"
    ]
  },
  "application/senml-etch+cbor": {
    source: "iana"
  },
  "application/senml-etch+json": {
    source: "iana",
    compressible: true
  },
  "application/senml-exi": {
    source: "iana"
  },
  "application/sensml+cbor": {
    source: "iana"
  },
  "application/sensml+json": {
    source: "iana",
    compressible: true
  },
  "application/sensml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sensmlx"
    ]
  },
  "application/sensml-exi": {
    source: "iana"
  },
  "application/sep+xml": {
    source: "iana",
    compressible: true
  },
  "application/sep-exi": {
    source: "iana"
  },
  "application/session-info": {
    source: "iana"
  },
  "application/set-payment": {
    source: "iana"
  },
  "application/set-payment-initiation": {
    source: "iana",
    extensions: [
      "setpay"
    ]
  },
  "application/set-registration": {
    source: "iana"
  },
  "application/set-registration-initiation": {
    source: "iana",
    extensions: [
      "setreg"
    ]
  },
  "application/sgml": {
    source: "iana"
  },
  "application/sgml-open-catalog": {
    source: "iana"
  },
  "application/shf+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "shf"
    ]
  },
  "application/sieve": {
    source: "iana",
    extensions: [
      "siv",
      "sieve"
    ]
  },
  "application/simple-filter+xml": {
    source: "iana",
    compressible: true
  },
  "application/simple-message-summary": {
    source: "iana"
  },
  "application/simplesymbolcontainer": {
    source: "iana"
  },
  "application/sipc": {
    source: "iana"
  },
  "application/slate": {
    source: "iana"
  },
  "application/smil": {
    source: "iana"
  },
  "application/smil+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "smi",
      "smil"
    ]
  },
  "application/smpte336m": {
    source: "iana"
  },
  "application/soap+fastinfoset": {
    source: "iana"
  },
  "application/soap+xml": {
    source: "iana",
    compressible: true
  },
  "application/sparql-query": {
    source: "iana",
    extensions: [
      "rq"
    ]
  },
  "application/sparql-results+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "srx"
    ]
  },
  "application/spdx+json": {
    source: "iana",
    compressible: true
  },
  "application/spirits-event+xml": {
    source: "iana",
    compressible: true
  },
  "application/sql": {
    source: "iana"
  },
  "application/srgs": {
    source: "iana",
    extensions: [
      "gram"
    ]
  },
  "application/srgs+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "grxml"
    ]
  },
  "application/sru+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sru"
    ]
  },
  "application/ssdl+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "ssdl"
    ]
  },
  "application/ssml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "ssml"
    ]
  },
  "application/stix+json": {
    source: "iana",
    compressible: true
  },
  "application/swid+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "swidtag"
    ]
  },
  "application/tamp-apex-update": {
    source: "iana"
  },
  "application/tamp-apex-update-confirm": {
    source: "iana"
  },
  "application/tamp-community-update": {
    source: "iana"
  },
  "application/tamp-community-update-confirm": {
    source: "iana"
  },
  "application/tamp-error": {
    source: "iana"
  },
  "application/tamp-sequence-adjust": {
    source: "iana"
  },
  "application/tamp-sequence-adjust-confirm": {
    source: "iana"
  },
  "application/tamp-status-query": {
    source: "iana"
  },
  "application/tamp-status-response": {
    source: "iana"
  },
  "application/tamp-update": {
    source: "iana"
  },
  "application/tamp-update-confirm": {
    source: "iana"
  },
  "application/tar": {
    compressible: true
  },
  "application/taxii+json": {
    source: "iana",
    compressible: true
  },
  "application/td+json": {
    source: "iana",
    compressible: true
  },
  "application/tei+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "tei",
      "teicorpus"
    ]
  },
  "application/tetra_isi": {
    source: "iana"
  },
  "application/thraud+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "tfi"
    ]
  },
  "application/timestamp-query": {
    source: "iana"
  },
  "application/timestamp-reply": {
    source: "iana"
  },
  "application/timestamped-data": {
    source: "iana",
    extensions: [
      "tsd"
    ]
  },
  "application/tlsrpt+gzip": {
    source: "iana"
  },
  "application/tlsrpt+json": {
    source: "iana",
    compressible: true
  },
  "application/tnauthlist": {
    source: "iana"
  },
  "application/token-introspection+jwt": {
    source: "iana"
  },
  "application/toml": {
    compressible: true,
    extensions: [
      "toml"
    ]
  },
  "application/trickle-ice-sdpfrag": {
    source: "iana"
  },
  "application/trig": {
    source: "iana",
    extensions: [
      "trig"
    ]
  },
  "application/ttml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "ttml"
    ]
  },
  "application/tve-trigger": {
    source: "iana"
  },
  "application/tzif": {
    source: "iana"
  },
  "application/tzif-leap": {
    source: "iana"
  },
  "application/ubjson": {
    compressible: false,
    extensions: [
      "ubj"
    ]
  },
  "application/ulpfec": {
    source: "iana"
  },
  "application/urc-grpsheet+xml": {
    source: "iana",
    compressible: true
  },
  "application/urc-ressheet+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rsheet"
    ]
  },
  "application/urc-targetdesc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "td"
    ]
  },
  "application/urc-uisocketdesc+xml": {
    source: "iana",
    compressible: true
  },
  "application/vcard+json": {
    source: "iana",
    compressible: true
  },
  "application/vcard+xml": {
    source: "iana",
    compressible: true
  },
  "application/vemmi": {
    source: "iana"
  },
  "application/vividence.scriptfile": {
    source: "apache"
  },
  "application/vnd.1000minds.decision-model+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "1km"
    ]
  },
  "application/vnd.3gpp-prose+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp-prose-pc3ch+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp-v2x-local-service-information": {
    source: "iana"
  },
  "application/vnd.3gpp.5gnas": {
    source: "iana"
  },
  "application/vnd.3gpp.access-transfer-events+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.bsf+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.gmop+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.gtpc": {
    source: "iana"
  },
  "application/vnd.3gpp.interworking-data": {
    source: "iana"
  },
  "application/vnd.3gpp.lpp": {
    source: "iana"
  },
  "application/vnd.3gpp.mc-signalling-ear": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-affiliation-command+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcdata-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcdata-payload": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-service-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcdata-signalling": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-ue-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcdata-user-profile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-affiliation-command+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-floor-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-location-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-service-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-signed+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-ue-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-ue-init-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-user-profile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-location-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-service-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-transmission-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-ue-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-user-profile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mid-call+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.ngap": {
    source: "iana"
  },
  "application/vnd.3gpp.pfcp": {
    source: "iana"
  },
  "application/vnd.3gpp.pic-bw-large": {
    source: "iana",
    extensions: [
      "plb"
    ]
  },
  "application/vnd.3gpp.pic-bw-small": {
    source: "iana",
    extensions: [
      "psb"
    ]
  },
  "application/vnd.3gpp.pic-bw-var": {
    source: "iana",
    extensions: [
      "pvb"
    ]
  },
  "application/vnd.3gpp.s1ap": {
    source: "iana"
  },
  "application/vnd.3gpp.sms": {
    source: "iana"
  },
  "application/vnd.3gpp.sms+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.srvcc-ext+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.srvcc-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.state-and-event-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.ussd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp2.bcmcsinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp2.sms": {
    source: "iana"
  },
  "application/vnd.3gpp2.tcap": {
    source: "iana",
    extensions: [
      "tcap"
    ]
  },
  "application/vnd.3lightssoftware.imagescal": {
    source: "iana"
  },
  "application/vnd.3m.post-it-notes": {
    source: "iana",
    extensions: [
      "pwn"
    ]
  },
  "application/vnd.accpac.simply.aso": {
    source: "iana",
    extensions: [
      "aso"
    ]
  },
  "application/vnd.accpac.simply.imp": {
    source: "iana",
    extensions: [
      "imp"
    ]
  },
  "application/vnd.acucobol": {
    source: "iana",
    extensions: [
      "acu"
    ]
  },
  "application/vnd.acucorp": {
    source: "iana",
    extensions: [
      "atc",
      "acutc"
    ]
  },
  "application/vnd.adobe.air-application-installer-package+zip": {
    source: "apache",
    compressible: false,
    extensions: [
      "air"
    ]
  },
  "application/vnd.adobe.flash.movie": {
    source: "iana"
  },
  "application/vnd.adobe.formscentral.fcdt": {
    source: "iana",
    extensions: [
      "fcdt"
    ]
  },
  "application/vnd.adobe.fxp": {
    source: "iana",
    extensions: [
      "fxp",
      "fxpl"
    ]
  },
  "application/vnd.adobe.partial-upload": {
    source: "iana"
  },
  "application/vnd.adobe.xdp+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xdp"
    ]
  },
  "application/vnd.adobe.xfdf": {
    source: "iana",
    extensions: [
      "xfdf"
    ]
  },
  "application/vnd.aether.imp": {
    source: "iana"
  },
  "application/vnd.afpc.afplinedata": {
    source: "iana"
  },
  "application/vnd.afpc.afplinedata-pagedef": {
    source: "iana"
  },
  "application/vnd.afpc.cmoca-cmresource": {
    source: "iana"
  },
  "application/vnd.afpc.foca-charset": {
    source: "iana"
  },
  "application/vnd.afpc.foca-codedfont": {
    source: "iana"
  },
  "application/vnd.afpc.foca-codepage": {
    source: "iana"
  },
  "application/vnd.afpc.modca": {
    source: "iana"
  },
  "application/vnd.afpc.modca-cmtable": {
    source: "iana"
  },
  "application/vnd.afpc.modca-formdef": {
    source: "iana"
  },
  "application/vnd.afpc.modca-mediummap": {
    source: "iana"
  },
  "application/vnd.afpc.modca-objectcontainer": {
    source: "iana"
  },
  "application/vnd.afpc.modca-overlay": {
    source: "iana"
  },
  "application/vnd.afpc.modca-pagesegment": {
    source: "iana"
  },
  "application/vnd.age": {
    source: "iana",
    extensions: [
      "age"
    ]
  },
  "application/vnd.ah-barcode": {
    source: "iana"
  },
  "application/vnd.ahead.space": {
    source: "iana",
    extensions: [
      "ahead"
    ]
  },
  "application/vnd.airzip.filesecure.azf": {
    source: "iana",
    extensions: [
      "azf"
    ]
  },
  "application/vnd.airzip.filesecure.azs": {
    source: "iana",
    extensions: [
      "azs"
    ]
  },
  "application/vnd.amadeus+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.amazon.ebook": {
    source: "apache",
    extensions: [
      "azw"
    ]
  },
  "application/vnd.amazon.mobi8-ebook": {
    source: "iana"
  },
  "application/vnd.americandynamics.acc": {
    source: "iana",
    extensions: [
      "acc"
    ]
  },
  "application/vnd.amiga.ami": {
    source: "iana",
    extensions: [
      "ami"
    ]
  },
  "application/vnd.amundsen.maze+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.android.ota": {
    source: "iana"
  },
  "application/vnd.android.package-archive": {
    source: "apache",
    compressible: false,
    extensions: [
      "apk"
    ]
  },
  "application/vnd.anki": {
    source: "iana"
  },
  "application/vnd.anser-web-certificate-issue-initiation": {
    source: "iana",
    extensions: [
      "cii"
    ]
  },
  "application/vnd.anser-web-funds-transfer-initiation": {
    source: "apache",
    extensions: [
      "fti"
    ]
  },
  "application/vnd.antix.game-component": {
    source: "iana",
    extensions: [
      "atx"
    ]
  },
  "application/vnd.apache.arrow.file": {
    source: "iana"
  },
  "application/vnd.apache.arrow.stream": {
    source: "iana"
  },
  "application/vnd.apache.thrift.binary": {
    source: "iana"
  },
  "application/vnd.apache.thrift.compact": {
    source: "iana"
  },
  "application/vnd.apache.thrift.json": {
    source: "iana"
  },
  "application/vnd.api+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.aplextor.warrp+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.apothekende.reservation+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.apple.installer+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mpkg"
    ]
  },
  "application/vnd.apple.keynote": {
    source: "iana",
    extensions: [
      "key"
    ]
  },
  "application/vnd.apple.mpegurl": {
    source: "iana",
    extensions: [
      "m3u8"
    ]
  },
  "application/vnd.apple.numbers": {
    source: "iana",
    extensions: [
      "numbers"
    ]
  },
  "application/vnd.apple.pages": {
    source: "iana",
    extensions: [
      "pages"
    ]
  },
  "application/vnd.apple.pkpass": {
    compressible: false,
    extensions: [
      "pkpass"
    ]
  },
  "application/vnd.arastra.swi": {
    source: "iana"
  },
  "application/vnd.aristanetworks.swi": {
    source: "iana",
    extensions: [
      "swi"
    ]
  },
  "application/vnd.artisan+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.artsquare": {
    source: "iana"
  },
  "application/vnd.astraea-software.iota": {
    source: "iana",
    extensions: [
      "iota"
    ]
  },
  "application/vnd.audiograph": {
    source: "iana",
    extensions: [
      "aep"
    ]
  },
  "application/vnd.autopackage": {
    source: "iana"
  },
  "application/vnd.avalon+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.avistar+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.balsamiq.bmml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "bmml"
    ]
  },
  "application/vnd.balsamiq.bmpr": {
    source: "iana"
  },
  "application/vnd.banana-accounting": {
    source: "iana"
  },
  "application/vnd.bbf.usp.error": {
    source: "iana"
  },
  "application/vnd.bbf.usp.msg": {
    source: "iana"
  },
  "application/vnd.bbf.usp.msg+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.bekitzur-stech+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.bint.med-content": {
    source: "iana"
  },
  "application/vnd.biopax.rdf+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.blink-idb-value-wrapper": {
    source: "iana"
  },
  "application/vnd.blueice.multipass": {
    source: "iana",
    extensions: [
      "mpm"
    ]
  },
  "application/vnd.bluetooth.ep.oob": {
    source: "iana"
  },
  "application/vnd.bluetooth.le.oob": {
    source: "iana"
  },
  "application/vnd.bmi": {
    source: "iana",
    extensions: [
      "bmi"
    ]
  },
  "application/vnd.bpf": {
    source: "iana"
  },
  "application/vnd.bpf3": {
    source: "iana"
  },
  "application/vnd.businessobjects": {
    source: "iana",
    extensions: [
      "rep"
    ]
  },
  "application/vnd.byu.uapi+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cab-jscript": {
    source: "iana"
  },
  "application/vnd.canon-cpdl": {
    source: "iana"
  },
  "application/vnd.canon-lips": {
    source: "iana"
  },
  "application/vnd.capasystems-pg+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cendio.thinlinc.clientconf": {
    source: "iana"
  },
  "application/vnd.century-systems.tcp_stream": {
    source: "iana"
  },
  "application/vnd.chemdraw+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "cdxml"
    ]
  },
  "application/vnd.chess-pgn": {
    source: "iana"
  },
  "application/vnd.chipnuts.karaoke-mmd": {
    source: "iana",
    extensions: [
      "mmd"
    ]
  },
  "application/vnd.ciedi": {
    source: "iana"
  },
  "application/vnd.cinderella": {
    source: "iana",
    extensions: [
      "cdy"
    ]
  },
  "application/vnd.cirpack.isdn-ext": {
    source: "iana"
  },
  "application/vnd.citationstyles.style+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "csl"
    ]
  },
  "application/vnd.claymore": {
    source: "iana",
    extensions: [
      "cla"
    ]
  },
  "application/vnd.cloanto.rp9": {
    source: "iana",
    extensions: [
      "rp9"
    ]
  },
  "application/vnd.clonk.c4group": {
    source: "iana",
    extensions: [
      "c4g",
      "c4d",
      "c4f",
      "c4p",
      "c4u"
    ]
  },
  "application/vnd.cluetrust.cartomobile-config": {
    source: "iana",
    extensions: [
      "c11amc"
    ]
  },
  "application/vnd.cluetrust.cartomobile-config-pkg": {
    source: "iana",
    extensions: [
      "c11amz"
    ]
  },
  "application/vnd.coffeescript": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.document": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.document-template": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.presentation": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.presentation-template": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet-template": {
    source: "iana"
  },
  "application/vnd.collection+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.collection.doc+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.collection.next+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.comicbook+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.comicbook-rar": {
    source: "iana"
  },
  "application/vnd.commerce-battelle": {
    source: "iana"
  },
  "application/vnd.commonspace": {
    source: "iana",
    extensions: [
      "csp"
    ]
  },
  "application/vnd.contact.cmsg": {
    source: "iana",
    extensions: [
      "cdbcmsg"
    ]
  },
  "application/vnd.coreos.ignition+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cosmocaller": {
    source: "iana",
    extensions: [
      "cmc"
    ]
  },
  "application/vnd.crick.clicker": {
    source: "iana",
    extensions: [
      "clkx"
    ]
  },
  "application/vnd.crick.clicker.keyboard": {
    source: "iana",
    extensions: [
      "clkk"
    ]
  },
  "application/vnd.crick.clicker.palette": {
    source: "iana",
    extensions: [
      "clkp"
    ]
  },
  "application/vnd.crick.clicker.template": {
    source: "iana",
    extensions: [
      "clkt"
    ]
  },
  "application/vnd.crick.clicker.wordbank": {
    source: "iana",
    extensions: [
      "clkw"
    ]
  },
  "application/vnd.criticaltools.wbs+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "wbs"
    ]
  },
  "application/vnd.cryptii.pipe+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.crypto-shade-file": {
    source: "iana"
  },
  "application/vnd.cryptomator.encrypted": {
    source: "iana"
  },
  "application/vnd.cryptomator.vault": {
    source: "iana"
  },
  "application/vnd.ctc-posml": {
    source: "iana",
    extensions: [
      "pml"
    ]
  },
  "application/vnd.ctct.ws+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cups-pdf": {
    source: "iana"
  },
  "application/vnd.cups-postscript": {
    source: "iana"
  },
  "application/vnd.cups-ppd": {
    source: "iana",
    extensions: [
      "ppd"
    ]
  },
  "application/vnd.cups-raster": {
    source: "iana"
  },
  "application/vnd.cups-raw": {
    source: "iana"
  },
  "application/vnd.curl": {
    source: "iana"
  },
  "application/vnd.curl.car": {
    source: "apache",
    extensions: [
      "car"
    ]
  },
  "application/vnd.curl.pcurl": {
    source: "apache",
    extensions: [
      "pcurl"
    ]
  },
  "application/vnd.cyan.dean.root+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cybank": {
    source: "iana"
  },
  "application/vnd.cyclonedx+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cyclonedx+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.d2l.coursepackage1p0+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.d3m-dataset": {
    source: "iana"
  },
  "application/vnd.d3m-problem": {
    source: "iana"
  },
  "application/vnd.dart": {
    source: "iana",
    compressible: true,
    extensions: [
      "dart"
    ]
  },
  "application/vnd.data-vision.rdz": {
    source: "iana",
    extensions: [
      "rdz"
    ]
  },
  "application/vnd.datapackage+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dataresource+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dbf": {
    source: "iana",
    extensions: [
      "dbf"
    ]
  },
  "application/vnd.debian.binary-package": {
    source: "iana"
  },
  "application/vnd.dece.data": {
    source: "iana",
    extensions: [
      "uvf",
      "uvvf",
      "uvd",
      "uvvd"
    ]
  },
  "application/vnd.dece.ttml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "uvt",
      "uvvt"
    ]
  },
  "application/vnd.dece.unspecified": {
    source: "iana",
    extensions: [
      "uvx",
      "uvvx"
    ]
  },
  "application/vnd.dece.zip": {
    source: "iana",
    extensions: [
      "uvz",
      "uvvz"
    ]
  },
  "application/vnd.denovo.fcselayout-link": {
    source: "iana",
    extensions: [
      "fe_launch"
    ]
  },
  "application/vnd.desmume.movie": {
    source: "iana"
  },
  "application/vnd.dir-bi.plate-dl-nosuffix": {
    source: "iana"
  },
  "application/vnd.dm.delegation+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dna": {
    source: "iana",
    extensions: [
      "dna"
    ]
  },
  "application/vnd.document+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dolby.mlp": {
    source: "apache",
    extensions: [
      "mlp"
    ]
  },
  "application/vnd.dolby.mobile.1": {
    source: "iana"
  },
  "application/vnd.dolby.mobile.2": {
    source: "iana"
  },
  "application/vnd.doremir.scorecloud-binary-document": {
    source: "iana"
  },
  "application/vnd.dpgraph": {
    source: "iana",
    extensions: [
      "dpg"
    ]
  },
  "application/vnd.dreamfactory": {
    source: "iana",
    extensions: [
      "dfac"
    ]
  },
  "application/vnd.drive+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ds-keypoint": {
    source: "apache",
    extensions: [
      "kpxx"
    ]
  },
  "application/vnd.dtg.local": {
    source: "iana"
  },
  "application/vnd.dtg.local.flash": {
    source: "iana"
  },
  "application/vnd.dtg.local.html": {
    source: "iana"
  },
  "application/vnd.dvb.ait": {
    source: "iana",
    extensions: [
      "ait"
    ]
  },
  "application/vnd.dvb.dvbisl+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.dvbj": {
    source: "iana"
  },
  "application/vnd.dvb.esgcontainer": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcdftnotifaccess": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgaccess": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgaccess2": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgpdd": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcroaming": {
    source: "iana"
  },
  "application/vnd.dvb.iptv.alfec-base": {
    source: "iana"
  },
  "application/vnd.dvb.iptv.alfec-enhancement": {
    source: "iana"
  },
  "application/vnd.dvb.notif-aggregate-root+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-container+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-generic+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-ia-msglist+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-ia-registration-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-ia-registration-response+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-init+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.pfr": {
    source: "iana"
  },
  "application/vnd.dvb.service": {
    source: "iana",
    extensions: [
      "svc"
    ]
  },
  "application/vnd.dxr": {
    source: "iana"
  },
  "application/vnd.dynageo": {
    source: "iana",
    extensions: [
      "geo"
    ]
  },
  "application/vnd.dzr": {
    source: "iana"
  },
  "application/vnd.easykaraoke.cdgdownload": {
    source: "iana"
  },
  "application/vnd.ecdis-update": {
    source: "iana"
  },
  "application/vnd.ecip.rlp": {
    source: "iana"
  },
  "application/vnd.eclipse.ditto+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ecowin.chart": {
    source: "iana",
    extensions: [
      "mag"
    ]
  },
  "application/vnd.ecowin.filerequest": {
    source: "iana"
  },
  "application/vnd.ecowin.fileupdate": {
    source: "iana"
  },
  "application/vnd.ecowin.series": {
    source: "iana"
  },
  "application/vnd.ecowin.seriesrequest": {
    source: "iana"
  },
  "application/vnd.ecowin.seriesupdate": {
    source: "iana"
  },
  "application/vnd.efi.img": {
    source: "iana"
  },
  "application/vnd.efi.iso": {
    source: "iana"
  },
  "application/vnd.emclient.accessrequest+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.enliven": {
    source: "iana",
    extensions: [
      "nml"
    ]
  },
  "application/vnd.enphase.envoy": {
    source: "iana"
  },
  "application/vnd.eprints.data+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.epson.esf": {
    source: "iana",
    extensions: [
      "esf"
    ]
  },
  "application/vnd.epson.msf": {
    source: "iana",
    extensions: [
      "msf"
    ]
  },
  "application/vnd.epson.quickanime": {
    source: "iana",
    extensions: [
      "qam"
    ]
  },
  "application/vnd.epson.salt": {
    source: "iana",
    extensions: [
      "slt"
    ]
  },
  "application/vnd.epson.ssf": {
    source: "iana",
    extensions: [
      "ssf"
    ]
  },
  "application/vnd.ericsson.quickcall": {
    source: "iana"
  },
  "application/vnd.espass-espass+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.eszigno3+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "es3",
      "et3"
    ]
  },
  "application/vnd.etsi.aoc+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.asic-e+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.etsi.asic-s+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.etsi.cug+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvcommand+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvdiscovery+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvprofile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvsad-bc+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvsad-cod+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvsad-npvr+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvservice+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvsync+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvueprofile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.mcid+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.mheg5": {
    source: "iana"
  },
  "application/vnd.etsi.overload-control-policy-dataset+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.pstn+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.sci+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.simservs+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.timestamp-token": {
    source: "iana"
  },
  "application/vnd.etsi.tsl+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.tsl.der": {
    source: "iana"
  },
  "application/vnd.eu.kasparian.car+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.eudora.data": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.profile": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.settings": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.theme": {
    source: "iana"
  },
  "application/vnd.exstream-empower+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.exstream-package": {
    source: "iana"
  },
  "application/vnd.ezpix-album": {
    source: "iana",
    extensions: [
      "ez2"
    ]
  },
  "application/vnd.ezpix-package": {
    source: "iana",
    extensions: [
      "ez3"
    ]
  },
  "application/vnd.f-secure.mobile": {
    source: "iana"
  },
  "application/vnd.familysearch.gedcom+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.fastcopy-disk-image": {
    source: "iana"
  },
  "application/vnd.fdf": {
    source: "iana",
    extensions: [
      "fdf"
    ]
  },
  "application/vnd.fdsn.mseed": {
    source: "iana",
    extensions: [
      "mseed"
    ]
  },
  "application/vnd.fdsn.seed": {
    source: "iana",
    extensions: [
      "seed",
      "dataless"
    ]
  },
  "application/vnd.ffsns": {
    source: "iana"
  },
  "application/vnd.ficlab.flb+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.filmit.zfc": {
    source: "iana"
  },
  "application/vnd.fints": {
    source: "iana"
  },
  "application/vnd.firemonkeys.cloudcell": {
    source: "iana"
  },
  "application/vnd.flographit": {
    source: "iana",
    extensions: [
      "gph"
    ]
  },
  "application/vnd.fluxtime.clip": {
    source: "iana",
    extensions: [
      "ftc"
    ]
  },
  "application/vnd.font-fontforge-sfd": {
    source: "iana"
  },
  "application/vnd.framemaker": {
    source: "iana",
    extensions: [
      "fm",
      "frame",
      "maker",
      "book"
    ]
  },
  "application/vnd.frogans.fnc": {
    source: "iana",
    extensions: [
      "fnc"
    ]
  },
  "application/vnd.frogans.ltf": {
    source: "iana",
    extensions: [
      "ltf"
    ]
  },
  "application/vnd.fsc.weblaunch": {
    source: "iana",
    extensions: [
      "fsc"
    ]
  },
  "application/vnd.fujifilm.fb.docuworks": {
    source: "iana"
  },
  "application/vnd.fujifilm.fb.docuworks.binder": {
    source: "iana"
  },
  "application/vnd.fujifilm.fb.docuworks.container": {
    source: "iana"
  },
  "application/vnd.fujifilm.fb.jfi+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.fujitsu.oasys": {
    source: "iana",
    extensions: [
      "oas"
    ]
  },
  "application/vnd.fujitsu.oasys2": {
    source: "iana",
    extensions: [
      "oa2"
    ]
  },
  "application/vnd.fujitsu.oasys3": {
    source: "iana",
    extensions: [
      "oa3"
    ]
  },
  "application/vnd.fujitsu.oasysgp": {
    source: "iana",
    extensions: [
      "fg5"
    ]
  },
  "application/vnd.fujitsu.oasysprs": {
    source: "iana",
    extensions: [
      "bh2"
    ]
  },
  "application/vnd.fujixerox.art-ex": {
    source: "iana"
  },
  "application/vnd.fujixerox.art4": {
    source: "iana"
  },
  "application/vnd.fujixerox.ddd": {
    source: "iana",
    extensions: [
      "ddd"
    ]
  },
  "application/vnd.fujixerox.docuworks": {
    source: "iana",
    extensions: [
      "xdw"
    ]
  },
  "application/vnd.fujixerox.docuworks.binder": {
    source: "iana",
    extensions: [
      "xbd"
    ]
  },
  "application/vnd.fujixerox.docuworks.container": {
    source: "iana"
  },
  "application/vnd.fujixerox.hbpl": {
    source: "iana"
  },
  "application/vnd.fut-misnet": {
    source: "iana"
  },
  "application/vnd.futoin+cbor": {
    source: "iana"
  },
  "application/vnd.futoin+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.fuzzysheet": {
    source: "iana",
    extensions: [
      "fzs"
    ]
  },
  "application/vnd.genomatix.tuxedo": {
    source: "iana",
    extensions: [
      "txd"
    ]
  },
  "application/vnd.gentics.grd+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.geo+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.geocube+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.geogebra.file": {
    source: "iana",
    extensions: [
      "ggb"
    ]
  },
  "application/vnd.geogebra.slides": {
    source: "iana"
  },
  "application/vnd.geogebra.tool": {
    source: "iana",
    extensions: [
      "ggt"
    ]
  },
  "application/vnd.geometry-explorer": {
    source: "iana",
    extensions: [
      "gex",
      "gre"
    ]
  },
  "application/vnd.geonext": {
    source: "iana",
    extensions: [
      "gxt"
    ]
  },
  "application/vnd.geoplan": {
    source: "iana",
    extensions: [
      "g2w"
    ]
  },
  "application/vnd.geospace": {
    source: "iana",
    extensions: [
      "g3w"
    ]
  },
  "application/vnd.gerber": {
    source: "iana"
  },
  "application/vnd.globalplatform.card-content-mgt": {
    source: "iana"
  },
  "application/vnd.globalplatform.card-content-mgt-response": {
    source: "iana"
  },
  "application/vnd.gmx": {
    source: "iana",
    extensions: [
      "gmx"
    ]
  },
  "application/vnd.google-apps.document": {
    compressible: false,
    extensions: [
      "gdoc"
    ]
  },
  "application/vnd.google-apps.presentation": {
    compressible: false,
    extensions: [
      "gslides"
    ]
  },
  "application/vnd.google-apps.spreadsheet": {
    compressible: false,
    extensions: [
      "gsheet"
    ]
  },
  "application/vnd.google-earth.kml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "kml"
    ]
  },
  "application/vnd.google-earth.kmz": {
    source: "iana",
    compressible: false,
    extensions: [
      "kmz"
    ]
  },
  "application/vnd.gov.sk.e-form+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.gov.sk.e-form+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.gov.sk.xmldatacontainer+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.grafeq": {
    source: "iana",
    extensions: [
      "gqf",
      "gqs"
    ]
  },
  "application/vnd.gridmp": {
    source: "iana"
  },
  "application/vnd.groove-account": {
    source: "iana",
    extensions: [
      "gac"
    ]
  },
  "application/vnd.groove-help": {
    source: "iana",
    extensions: [
      "ghf"
    ]
  },
  "application/vnd.groove-identity-message": {
    source: "iana",
    extensions: [
      "gim"
    ]
  },
  "application/vnd.groove-injector": {
    source: "iana",
    extensions: [
      "grv"
    ]
  },
  "application/vnd.groove-tool-message": {
    source: "iana",
    extensions: [
      "gtm"
    ]
  },
  "application/vnd.groove-tool-template": {
    source: "iana",
    extensions: [
      "tpl"
    ]
  },
  "application/vnd.groove-vcard": {
    source: "iana",
    extensions: [
      "vcg"
    ]
  },
  "application/vnd.hal+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hal+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "hal"
    ]
  },
  "application/vnd.handheld-entertainment+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "zmm"
    ]
  },
  "application/vnd.hbci": {
    source: "iana",
    extensions: [
      "hbci"
    ]
  },
  "application/vnd.hc+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hcl-bireports": {
    source: "iana"
  },
  "application/vnd.hdt": {
    source: "iana"
  },
  "application/vnd.heroku+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hhe.lesson-player": {
    source: "iana",
    extensions: [
      "les"
    ]
  },
  "application/vnd.hl7cda+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/vnd.hl7v2+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/vnd.hp-hpgl": {
    source: "iana",
    extensions: [
      "hpgl"
    ]
  },
  "application/vnd.hp-hpid": {
    source: "iana",
    extensions: [
      "hpid"
    ]
  },
  "application/vnd.hp-hps": {
    source: "iana",
    extensions: [
      "hps"
    ]
  },
  "application/vnd.hp-jlyt": {
    source: "iana",
    extensions: [
      "jlt"
    ]
  },
  "application/vnd.hp-pcl": {
    source: "iana",
    extensions: [
      "pcl"
    ]
  },
  "application/vnd.hp-pclxl": {
    source: "iana",
    extensions: [
      "pclxl"
    ]
  },
  "application/vnd.httphone": {
    source: "iana"
  },
  "application/vnd.hydrostatix.sof-data": {
    source: "iana",
    extensions: [
      "sfd-hdstx"
    ]
  },
  "application/vnd.hyper+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hyper-item+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hyperdrive+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hzn-3d-crossword": {
    source: "iana"
  },
  "application/vnd.ibm.afplinedata": {
    source: "iana"
  },
  "application/vnd.ibm.electronic-media": {
    source: "iana"
  },
  "application/vnd.ibm.minipay": {
    source: "iana",
    extensions: [
      "mpy"
    ]
  },
  "application/vnd.ibm.modcap": {
    source: "iana",
    extensions: [
      "afp",
      "listafp",
      "list3820"
    ]
  },
  "application/vnd.ibm.rights-management": {
    source: "iana",
    extensions: [
      "irm"
    ]
  },
  "application/vnd.ibm.secure-container": {
    source: "iana",
    extensions: [
      "sc"
    ]
  },
  "application/vnd.iccprofile": {
    source: "iana",
    extensions: [
      "icc",
      "icm"
    ]
  },
  "application/vnd.ieee.1905": {
    source: "iana"
  },
  "application/vnd.igloader": {
    source: "iana",
    extensions: [
      "igl"
    ]
  },
  "application/vnd.imagemeter.folder+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.imagemeter.image+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.immervision-ivp": {
    source: "iana",
    extensions: [
      "ivp"
    ]
  },
  "application/vnd.immervision-ivu": {
    source: "iana",
    extensions: [
      "ivu"
    ]
  },
  "application/vnd.ims.imsccv1p1": {
    source: "iana"
  },
  "application/vnd.ims.imsccv1p2": {
    source: "iana"
  },
  "application/vnd.ims.imsccv1p3": {
    source: "iana"
  },
  "application/vnd.ims.lis.v2.result+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolproxy+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolproxy.id+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolsettings+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolsettings.simple+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.informedcontrol.rms+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.informix-visionary": {
    source: "iana"
  },
  "application/vnd.infotech.project": {
    source: "iana"
  },
  "application/vnd.infotech.project+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.innopath.wamp.notification": {
    source: "iana"
  },
  "application/vnd.insors.igm": {
    source: "iana",
    extensions: [
      "igm"
    ]
  },
  "application/vnd.intercon.formnet": {
    source: "iana",
    extensions: [
      "xpw",
      "xpx"
    ]
  },
  "application/vnd.intergeo": {
    source: "iana",
    extensions: [
      "i2g"
    ]
  },
  "application/vnd.intertrust.digibox": {
    source: "iana"
  },
  "application/vnd.intertrust.nncp": {
    source: "iana"
  },
  "application/vnd.intu.qbo": {
    source: "iana",
    extensions: [
      "qbo"
    ]
  },
  "application/vnd.intu.qfx": {
    source: "iana",
    extensions: [
      "qfx"
    ]
  },
  "application/vnd.iptc.g2.catalogitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.conceptitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.knowledgeitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.newsitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.newsmessage+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.packageitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.planningitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ipunplugged.rcprofile": {
    source: "iana",
    extensions: [
      "rcprofile"
    ]
  },
  "application/vnd.irepository.package+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "irp"
    ]
  },
  "application/vnd.is-xpr": {
    source: "iana",
    extensions: [
      "xpr"
    ]
  },
  "application/vnd.isac.fcs": {
    source: "iana",
    extensions: [
      "fcs"
    ]
  },
  "application/vnd.iso11783-10+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.jam": {
    source: "iana",
    extensions: [
      "jam"
    ]
  },
  "application/vnd.japannet-directory-service": {
    source: "iana"
  },
  "application/vnd.japannet-jpnstore-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-payment-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-registration": {
    source: "iana"
  },
  "application/vnd.japannet-registration-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-setstore-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-verification": {
    source: "iana"
  },
  "application/vnd.japannet-verification-wakeup": {
    source: "iana"
  },
  "application/vnd.jcp.javame.midlet-rms": {
    source: "iana",
    extensions: [
      "rms"
    ]
  },
  "application/vnd.jisp": {
    source: "iana",
    extensions: [
      "jisp"
    ]
  },
  "application/vnd.joost.joda-archive": {
    source: "iana",
    extensions: [
      "joda"
    ]
  },
  "application/vnd.jsk.isdn-ngn": {
    source: "iana"
  },
  "application/vnd.kahootz": {
    source: "iana",
    extensions: [
      "ktz",
      "ktr"
    ]
  },
  "application/vnd.kde.karbon": {
    source: "iana",
    extensions: [
      "karbon"
    ]
  },
  "application/vnd.kde.kchart": {
    source: "iana",
    extensions: [
      "chrt"
    ]
  },
  "application/vnd.kde.kformula": {
    source: "iana",
    extensions: [
      "kfo"
    ]
  },
  "application/vnd.kde.kivio": {
    source: "iana",
    extensions: [
      "flw"
    ]
  },
  "application/vnd.kde.kontour": {
    source: "iana",
    extensions: [
      "kon"
    ]
  },
  "application/vnd.kde.kpresenter": {
    source: "iana",
    extensions: [
      "kpr",
      "kpt"
    ]
  },
  "application/vnd.kde.kspread": {
    source: "iana",
    extensions: [
      "ksp"
    ]
  },
  "application/vnd.kde.kword": {
    source: "iana",
    extensions: [
      "kwd",
      "kwt"
    ]
  },
  "application/vnd.kenameaapp": {
    source: "iana",
    extensions: [
      "htke"
    ]
  },
  "application/vnd.kidspiration": {
    source: "iana",
    extensions: [
      "kia"
    ]
  },
  "application/vnd.kinar": {
    source: "iana",
    extensions: [
      "kne",
      "knp"
    ]
  },
  "application/vnd.koan": {
    source: "iana",
    extensions: [
      "skp",
      "skd",
      "skt",
      "skm"
    ]
  },
  "application/vnd.kodak-descriptor": {
    source: "iana",
    extensions: [
      "sse"
    ]
  },
  "application/vnd.las": {
    source: "iana"
  },
  "application/vnd.las.las+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.las.las+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "lasxml"
    ]
  },
  "application/vnd.laszip": {
    source: "iana"
  },
  "application/vnd.leap+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.liberty-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.llamagraphics.life-balance.desktop": {
    source: "iana",
    extensions: [
      "lbd"
    ]
  },
  "application/vnd.llamagraphics.life-balance.exchange+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "lbe"
    ]
  },
  "application/vnd.logipipe.circuit+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.loom": {
    source: "iana"
  },
  "application/vnd.lotus-1-2-3": {
    source: "iana",
    extensions: [
      "123"
    ]
  },
  "application/vnd.lotus-approach": {
    source: "iana",
    extensions: [
      "apr"
    ]
  },
  "application/vnd.lotus-freelance": {
    source: "iana",
    extensions: [
      "pre"
    ]
  },
  "application/vnd.lotus-notes": {
    source: "iana",
    extensions: [
      "nsf"
    ]
  },
  "application/vnd.lotus-organizer": {
    source: "iana",
    extensions: [
      "org"
    ]
  },
  "application/vnd.lotus-screencam": {
    source: "iana",
    extensions: [
      "scm"
    ]
  },
  "application/vnd.lotus-wordpro": {
    source: "iana",
    extensions: [
      "lwp"
    ]
  },
  "application/vnd.macports.portpkg": {
    source: "iana",
    extensions: [
      "portpkg"
    ]
  },
  "application/vnd.mapbox-vector-tile": {
    source: "iana",
    extensions: [
      "mvt"
    ]
  },
  "application/vnd.marlin.drm.actiontoken+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.marlin.drm.conftoken+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.marlin.drm.license+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.marlin.drm.mdcf": {
    source: "iana"
  },
  "application/vnd.mason+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.maxar.archive.3tz+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.maxmind.maxmind-db": {
    source: "iana"
  },
  "application/vnd.mcd": {
    source: "iana",
    extensions: [
      "mcd"
    ]
  },
  "application/vnd.medcalcdata": {
    source: "iana",
    extensions: [
      "mc1"
    ]
  },
  "application/vnd.mediastation.cdkey": {
    source: "iana",
    extensions: [
      "cdkey"
    ]
  },
  "application/vnd.meridian-slingshot": {
    source: "iana"
  },
  "application/vnd.mfer": {
    source: "iana",
    extensions: [
      "mwf"
    ]
  },
  "application/vnd.mfmp": {
    source: "iana",
    extensions: [
      "mfm"
    ]
  },
  "application/vnd.micro+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.micrografx.flo": {
    source: "iana",
    extensions: [
      "flo"
    ]
  },
  "application/vnd.micrografx.igx": {
    source: "iana",
    extensions: [
      "igx"
    ]
  },
  "application/vnd.microsoft.portable-executable": {
    source: "iana"
  },
  "application/vnd.microsoft.windows.thumbnail-cache": {
    source: "iana"
  },
  "application/vnd.miele+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.mif": {
    source: "iana",
    extensions: [
      "mif"
    ]
  },
  "application/vnd.minisoft-hp3000-save": {
    source: "iana"
  },
  "application/vnd.mitsubishi.misty-guard.trustweb": {
    source: "iana"
  },
  "application/vnd.mobius.daf": {
    source: "iana",
    extensions: [
      "daf"
    ]
  },
  "application/vnd.mobius.dis": {
    source: "iana",
    extensions: [
      "dis"
    ]
  },
  "application/vnd.mobius.mbk": {
    source: "iana",
    extensions: [
      "mbk"
    ]
  },
  "application/vnd.mobius.mqy": {
    source: "iana",
    extensions: [
      "mqy"
    ]
  },
  "application/vnd.mobius.msl": {
    source: "iana",
    extensions: [
      "msl"
    ]
  },
  "application/vnd.mobius.plc": {
    source: "iana",
    extensions: [
      "plc"
    ]
  },
  "application/vnd.mobius.txf": {
    source: "iana",
    extensions: [
      "txf"
    ]
  },
  "application/vnd.mophun.application": {
    source: "iana",
    extensions: [
      "mpn"
    ]
  },
  "application/vnd.mophun.certificate": {
    source: "iana",
    extensions: [
      "mpc"
    ]
  },
  "application/vnd.motorola.flexsuite": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.adsi": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.fis": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.gotap": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.kmr": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.ttc": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.wem": {
    source: "iana"
  },
  "application/vnd.motorola.iprm": {
    source: "iana"
  },
  "application/vnd.mozilla.xul+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xul"
    ]
  },
  "application/vnd.ms-3mfdocument": {
    source: "iana"
  },
  "application/vnd.ms-artgalry": {
    source: "iana",
    extensions: [
      "cil"
    ]
  },
  "application/vnd.ms-asf": {
    source: "iana"
  },
  "application/vnd.ms-cab-compressed": {
    source: "iana",
    extensions: [
      "cab"
    ]
  },
  "application/vnd.ms-color.iccprofile": {
    source: "apache"
  },
  "application/vnd.ms-excel": {
    source: "iana",
    compressible: false,
    extensions: [
      "xls",
      "xlm",
      "xla",
      "xlc",
      "xlt",
      "xlw"
    ]
  },
  "application/vnd.ms-excel.addin.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlam"
    ]
  },
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlsb"
    ]
  },
  "application/vnd.ms-excel.sheet.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlsm"
    ]
  },
  "application/vnd.ms-excel.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "xltm"
    ]
  },
  "application/vnd.ms-fontobject": {
    source: "iana",
    compressible: true,
    extensions: [
      "eot"
    ]
  },
  "application/vnd.ms-htmlhelp": {
    source: "iana",
    extensions: [
      "chm"
    ]
  },
  "application/vnd.ms-ims": {
    source: "iana",
    extensions: [
      "ims"
    ]
  },
  "application/vnd.ms-lrm": {
    source: "iana",
    extensions: [
      "lrm"
    ]
  },
  "application/vnd.ms-office.activex+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ms-officetheme": {
    source: "iana",
    extensions: [
      "thmx"
    ]
  },
  "application/vnd.ms-opentype": {
    source: "apache",
    compressible: true
  },
  "application/vnd.ms-outlook": {
    compressible: false,
    extensions: [
      "msg"
    ]
  },
  "application/vnd.ms-package.obfuscated-opentype": {
    source: "apache"
  },
  "application/vnd.ms-pki.seccat": {
    source: "apache",
    extensions: [
      "cat"
    ]
  },
  "application/vnd.ms-pki.stl": {
    source: "apache",
    extensions: [
      "stl"
    ]
  },
  "application/vnd.ms-playready.initiator+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ms-powerpoint": {
    source: "iana",
    compressible: false,
    extensions: [
      "ppt",
      "pps",
      "pot"
    ]
  },
  "application/vnd.ms-powerpoint.addin.macroenabled.12": {
    source: "iana",
    extensions: [
      "ppam"
    ]
  },
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
    source: "iana",
    extensions: [
      "pptm"
    ]
  },
  "application/vnd.ms-powerpoint.slide.macroenabled.12": {
    source: "iana",
    extensions: [
      "sldm"
    ]
  },
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
    source: "iana",
    extensions: [
      "ppsm"
    ]
  },
  "application/vnd.ms-powerpoint.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "potm"
    ]
  },
  "application/vnd.ms-printdevicecapabilities+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ms-printing.printticket+xml": {
    source: "apache",
    compressible: true
  },
  "application/vnd.ms-printschematicket+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ms-project": {
    source: "iana",
    extensions: [
      "mpp",
      "mpt"
    ]
  },
  "application/vnd.ms-tnef": {
    source: "iana"
  },
  "application/vnd.ms-windows.devicepairing": {
    source: "iana"
  },
  "application/vnd.ms-windows.nwprinting.oob": {
    source: "iana"
  },
  "application/vnd.ms-windows.printerpairing": {
    source: "iana"
  },
  "application/vnd.ms-windows.wsd.oob": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.lic-chlg-req": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.lic-resp": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.meter-chlg-req": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.meter-resp": {
    source: "iana"
  },
  "application/vnd.ms-word.document.macroenabled.12": {
    source: "iana",
    extensions: [
      "docm"
    ]
  },
  "application/vnd.ms-word.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "dotm"
    ]
  },
  "application/vnd.ms-works": {
    source: "iana",
    extensions: [
      "wps",
      "wks",
      "wcm",
      "wdb"
    ]
  },
  "application/vnd.ms-wpl": {
    source: "iana",
    extensions: [
      "wpl"
    ]
  },
  "application/vnd.ms-xpsdocument": {
    source: "iana",
    compressible: false,
    extensions: [
      "xps"
    ]
  },
  "application/vnd.msa-disk-image": {
    source: "iana"
  },
  "application/vnd.mseq": {
    source: "iana",
    extensions: [
      "mseq"
    ]
  },
  "application/vnd.msign": {
    source: "iana"
  },
  "application/vnd.multiad.creator": {
    source: "iana"
  },
  "application/vnd.multiad.creator.cif": {
    source: "iana"
  },
  "application/vnd.music-niff": {
    source: "iana"
  },
  "application/vnd.musician": {
    source: "iana",
    extensions: [
      "mus"
    ]
  },
  "application/vnd.muvee.style": {
    source: "iana",
    extensions: [
      "msty"
    ]
  },
  "application/vnd.mynfc": {
    source: "iana",
    extensions: [
      "taglet"
    ]
  },
  "application/vnd.nacamar.ybrid+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ncd.control": {
    source: "iana"
  },
  "application/vnd.ncd.reference": {
    source: "iana"
  },
  "application/vnd.nearst.inv+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nebumind.line": {
    source: "iana"
  },
  "application/vnd.nervana": {
    source: "iana"
  },
  "application/vnd.netfpx": {
    source: "iana"
  },
  "application/vnd.neurolanguage.nlu": {
    source: "iana",
    extensions: [
      "nlu"
    ]
  },
  "application/vnd.nimn": {
    source: "iana"
  },
  "application/vnd.nintendo.nitro.rom": {
    source: "iana"
  },
  "application/vnd.nintendo.snes.rom": {
    source: "iana"
  },
  "application/vnd.nitf": {
    source: "iana",
    extensions: [
      "ntf",
      "nitf"
    ]
  },
  "application/vnd.noblenet-directory": {
    source: "iana",
    extensions: [
      "nnd"
    ]
  },
  "application/vnd.noblenet-sealer": {
    source: "iana",
    extensions: [
      "nns"
    ]
  },
  "application/vnd.noblenet-web": {
    source: "iana",
    extensions: [
      "nnw"
    ]
  },
  "application/vnd.nokia.catalogs": {
    source: "iana"
  },
  "application/vnd.nokia.conml+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.conml+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.iptv.config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.isds-radio-presets": {
    source: "iana"
  },
  "application/vnd.nokia.landmark+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.landmark+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.landmarkcollection+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.n-gage.ac+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "ac"
    ]
  },
  "application/vnd.nokia.n-gage.data": {
    source: "iana",
    extensions: [
      "ngdat"
    ]
  },
  "application/vnd.nokia.n-gage.symbian.install": {
    source: "iana",
    extensions: [
      "n-gage"
    ]
  },
  "application/vnd.nokia.ncd": {
    source: "iana"
  },
  "application/vnd.nokia.pcd+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.pcd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.radio-preset": {
    source: "iana",
    extensions: [
      "rpst"
    ]
  },
  "application/vnd.nokia.radio-presets": {
    source: "iana",
    extensions: [
      "rpss"
    ]
  },
  "application/vnd.novadigm.edm": {
    source: "iana",
    extensions: [
      "edm"
    ]
  },
  "application/vnd.novadigm.edx": {
    source: "iana",
    extensions: [
      "edx"
    ]
  },
  "application/vnd.novadigm.ext": {
    source: "iana",
    extensions: [
      "ext"
    ]
  },
  "application/vnd.ntt-local.content-share": {
    source: "iana"
  },
  "application/vnd.ntt-local.file-transfer": {
    source: "iana"
  },
  "application/vnd.ntt-local.ogw_remote-access": {
    source: "iana"
  },
  "application/vnd.ntt-local.sip-ta_remote": {
    source: "iana"
  },
  "application/vnd.ntt-local.sip-ta_tcp_stream": {
    source: "iana"
  },
  "application/vnd.oasis.opendocument.chart": {
    source: "iana",
    extensions: [
      "odc"
    ]
  },
  "application/vnd.oasis.opendocument.chart-template": {
    source: "iana",
    extensions: [
      "otc"
    ]
  },
  "application/vnd.oasis.opendocument.database": {
    source: "iana",
    extensions: [
      "odb"
    ]
  },
  "application/vnd.oasis.opendocument.formula": {
    source: "iana",
    extensions: [
      "odf"
    ]
  },
  "application/vnd.oasis.opendocument.formula-template": {
    source: "iana",
    extensions: [
      "odft"
    ]
  },
  "application/vnd.oasis.opendocument.graphics": {
    source: "iana",
    compressible: false,
    extensions: [
      "odg"
    ]
  },
  "application/vnd.oasis.opendocument.graphics-template": {
    source: "iana",
    extensions: [
      "otg"
    ]
  },
  "application/vnd.oasis.opendocument.image": {
    source: "iana",
    extensions: [
      "odi"
    ]
  },
  "application/vnd.oasis.opendocument.image-template": {
    source: "iana",
    extensions: [
      "oti"
    ]
  },
  "application/vnd.oasis.opendocument.presentation": {
    source: "iana",
    compressible: false,
    extensions: [
      "odp"
    ]
  },
  "application/vnd.oasis.opendocument.presentation-template": {
    source: "iana",
    extensions: [
      "otp"
    ]
  },
  "application/vnd.oasis.opendocument.spreadsheet": {
    source: "iana",
    compressible: false,
    extensions: [
      "ods"
    ]
  },
  "application/vnd.oasis.opendocument.spreadsheet-template": {
    source: "iana",
    extensions: [
      "ots"
    ]
  },
  "application/vnd.oasis.opendocument.text": {
    source: "iana",
    compressible: false,
    extensions: [
      "odt"
    ]
  },
  "application/vnd.oasis.opendocument.text-master": {
    source: "iana",
    extensions: [
      "odm"
    ]
  },
  "application/vnd.oasis.opendocument.text-template": {
    source: "iana",
    extensions: [
      "ott"
    ]
  },
  "application/vnd.oasis.opendocument.text-web": {
    source: "iana",
    extensions: [
      "oth"
    ]
  },
  "application/vnd.obn": {
    source: "iana"
  },
  "application/vnd.ocf+cbor": {
    source: "iana"
  },
  "application/vnd.oci.image.manifest.v1+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oftn.l10n+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.contentaccessdownload+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.contentaccessstreaming+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.cspg-hexbinary": {
    source: "iana"
  },
  "application/vnd.oipf.dae.svg+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.dae.xhtml+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.mippvcontrolmessage+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.pae.gem": {
    source: "iana"
  },
  "application/vnd.oipf.spdiscovery+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.spdlist+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.ueprofile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.userprofile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.olpc-sugar": {
    source: "iana",
    extensions: [
      "xo"
    ]
  },
  "application/vnd.oma-scws-config": {
    source: "iana"
  },
  "application/vnd.oma-scws-http-request": {
    source: "iana"
  },
  "application/vnd.oma-scws-http-response": {
    source: "iana"
  },
  "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.drm-trigger+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.imd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.ltkm": {
    source: "iana"
  },
  "application/vnd.oma.bcast.notification+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.provisioningtrigger": {
    source: "iana"
  },
  "application/vnd.oma.bcast.sgboot": {
    source: "iana"
  },
  "application/vnd.oma.bcast.sgdd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.sgdu": {
    source: "iana"
  },
  "application/vnd.oma.bcast.simple-symbol-container": {
    source: "iana"
  },
  "application/vnd.oma.bcast.smartcard-trigger+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.sprov+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.stkm": {
    source: "iana"
  },
  "application/vnd.oma.cab-address-book+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.cab-feature-handler+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.cab-pcc+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.cab-subs-invite+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.cab-user-prefs+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.dcd": {
    source: "iana"
  },
  "application/vnd.oma.dcdc": {
    source: "iana"
  },
  "application/vnd.oma.dd2+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "dd2"
    ]
  },
  "application/vnd.oma.drm.risd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.group-usage-list+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.lwm2m+cbor": {
    source: "iana"
  },
  "application/vnd.oma.lwm2m+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.lwm2m+tlv": {
    source: "iana"
  },
  "application/vnd.oma.pal+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.detailed-progress-report+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.final-report+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.groups+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.invocation-descriptor+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.optimized-progress-report+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.push": {
    source: "iana"
  },
  "application/vnd.oma.scidm.messages+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.xcap-directory+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.omads-email+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/vnd.omads-file+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/vnd.omads-folder+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/vnd.omaloc-supl-init": {
    source: "iana"
  },
  "application/vnd.onepager": {
    source: "iana"
  },
  "application/vnd.onepagertamp": {
    source: "iana"
  },
  "application/vnd.onepagertamx": {
    source: "iana"
  },
  "application/vnd.onepagertat": {
    source: "iana"
  },
  "application/vnd.onepagertatp": {
    source: "iana"
  },
  "application/vnd.onepagertatx": {
    source: "iana"
  },
  "application/vnd.openblox.game+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "obgx"
    ]
  },
  "application/vnd.openblox.game-binary": {
    source: "iana"
  },
  "application/vnd.openeye.oeb": {
    source: "iana"
  },
  "application/vnd.openofficeorg.extension": {
    source: "apache",
    extensions: [
      "oxt"
    ]
  },
  "application/vnd.openstreetmap.data+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "osm"
    ]
  },
  "application/vnd.opentimestamps.ots": {
    source: "iana"
  },
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawing+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    source: "iana",
    compressible: false,
    extensions: [
      "pptx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide": {
    source: "iana",
    extensions: [
      "sldx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
    source: "iana",
    extensions: [
      "ppsx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template": {
    source: "iana",
    extensions: [
      "potx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    source: "iana",
    compressible: false,
    extensions: [
      "xlsx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
    source: "iana",
    extensions: [
      "xltx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.theme+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.vmldrawing": {
    source: "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    source: "iana",
    compressible: false,
    extensions: [
      "docx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
    source: "iana",
    extensions: [
      "dotx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-package.core-properties+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-package.relationships+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oracle.resource+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.orange.indata": {
    source: "iana"
  },
  "application/vnd.osa.netdeploy": {
    source: "iana"
  },
  "application/vnd.osgeo.mapguide.package": {
    source: "iana",
    extensions: [
      "mgp"
    ]
  },
  "application/vnd.osgi.bundle": {
    source: "iana"
  },
  "application/vnd.osgi.dp": {
    source: "iana",
    extensions: [
      "dp"
    ]
  },
  "application/vnd.osgi.subsystem": {
    source: "iana",
    extensions: [
      "esa"
    ]
  },
  "application/vnd.otps.ct-kip+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oxli.countgraph": {
    source: "iana"
  },
  "application/vnd.pagerduty+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.palm": {
    source: "iana",
    extensions: [
      "pdb",
      "pqa",
      "oprc"
    ]
  },
  "application/vnd.panoply": {
    source: "iana"
  },
  "application/vnd.paos.xml": {
    source: "iana"
  },
  "application/vnd.patentdive": {
    source: "iana"
  },
  "application/vnd.patientecommsdoc": {
    source: "iana"
  },
  "application/vnd.pawaafile": {
    source: "iana",
    extensions: [
      "paw"
    ]
  },
  "application/vnd.pcos": {
    source: "iana"
  },
  "application/vnd.pg.format": {
    source: "iana",
    extensions: [
      "str"
    ]
  },
  "application/vnd.pg.osasli": {
    source: "iana",
    extensions: [
      "ei6"
    ]
  },
  "application/vnd.piaccess.application-licence": {
    source: "iana"
  },
  "application/vnd.picsel": {
    source: "iana",
    extensions: [
      "efif"
    ]
  },
  "application/vnd.pmi.widget": {
    source: "iana",
    extensions: [
      "wg"
    ]
  },
  "application/vnd.poc.group-advertisement+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.pocketlearn": {
    source: "iana",
    extensions: [
      "plf"
    ]
  },
  "application/vnd.powerbuilder6": {
    source: "iana",
    extensions: [
      "pbd"
    ]
  },
  "application/vnd.powerbuilder6-s": {
    source: "iana"
  },
  "application/vnd.powerbuilder7": {
    source: "iana"
  },
  "application/vnd.powerbuilder7-s": {
    source: "iana"
  },
  "application/vnd.powerbuilder75": {
    source: "iana"
  },
  "application/vnd.powerbuilder75-s": {
    source: "iana"
  },
  "application/vnd.preminet": {
    source: "iana"
  },
  "application/vnd.previewsystems.box": {
    source: "iana",
    extensions: [
      "box"
    ]
  },
  "application/vnd.proteus.magazine": {
    source: "iana",
    extensions: [
      "mgz"
    ]
  },
  "application/vnd.psfs": {
    source: "iana"
  },
  "application/vnd.publishare-delta-tree": {
    source: "iana",
    extensions: [
      "qps"
    ]
  },
  "application/vnd.pvi.ptid1": {
    source: "iana",
    extensions: [
      "ptid"
    ]
  },
  "application/vnd.pwg-multiplexed": {
    source: "iana"
  },
  "application/vnd.pwg-xhtml-print+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.qualcomm.brew-app-res": {
    source: "iana"
  },
  "application/vnd.quarantainenet": {
    source: "iana"
  },
  "application/vnd.quark.quarkxpress": {
    source: "iana",
    extensions: [
      "qxd",
      "qxt",
      "qwd",
      "qwt",
      "qxl",
      "qxb"
    ]
  },
  "application/vnd.quobject-quoxdocument": {
    source: "iana"
  },
  "application/vnd.radisys.moml+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit-conf+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit-conn+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit-dialog+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit-stream+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-conf+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-base+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-fax-detect+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-group+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-speech+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-transform+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.rainstor.data": {
    source: "iana"
  },
  "application/vnd.rapid": {
    source: "iana"
  },
  "application/vnd.rar": {
    source: "iana",
    extensions: [
      "rar"
    ]
  },
  "application/vnd.realvnc.bed": {
    source: "iana",
    extensions: [
      "bed"
    ]
  },
  "application/vnd.recordare.musicxml": {
    source: "iana",
    extensions: [
      "mxl"
    ]
  },
  "application/vnd.recordare.musicxml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "musicxml"
    ]
  },
  "application/vnd.renlearn.rlprint": {
    source: "iana"
  },
  "application/vnd.resilient.logic": {
    source: "iana"
  },
  "application/vnd.restful+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.rig.cryptonote": {
    source: "iana",
    extensions: [
      "cryptonote"
    ]
  },
  "application/vnd.rim.cod": {
    source: "apache",
    extensions: [
      "cod"
    ]
  },
  "application/vnd.rn-realmedia": {
    source: "apache",
    extensions: [
      "rm"
    ]
  },
  "application/vnd.rn-realmedia-vbr": {
    source: "apache",
    extensions: [
      "rmvb"
    ]
  },
  "application/vnd.route66.link66+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "link66"
    ]
  },
  "application/vnd.rs-274x": {
    source: "iana"
  },
  "application/vnd.ruckus.download": {
    source: "iana"
  },
  "application/vnd.s3sms": {
    source: "iana"
  },
  "application/vnd.sailingtracker.track": {
    source: "iana",
    extensions: [
      "st"
    ]
  },
  "application/vnd.sar": {
    source: "iana"
  },
  "application/vnd.sbm.cid": {
    source: "iana"
  },
  "application/vnd.sbm.mid2": {
    source: "iana"
  },
  "application/vnd.scribus": {
    source: "iana"
  },
  "application/vnd.sealed.3df": {
    source: "iana"
  },
  "application/vnd.sealed.csf": {
    source: "iana"
  },
  "application/vnd.sealed.doc": {
    source: "iana"
  },
  "application/vnd.sealed.eml": {
    source: "iana"
  },
  "application/vnd.sealed.mht": {
    source: "iana"
  },
  "application/vnd.sealed.net": {
    source: "iana"
  },
  "application/vnd.sealed.ppt": {
    source: "iana"
  },
  "application/vnd.sealed.tiff": {
    source: "iana"
  },
  "application/vnd.sealed.xls": {
    source: "iana"
  },
  "application/vnd.sealedmedia.softseal.html": {
    source: "iana"
  },
  "application/vnd.sealedmedia.softseal.pdf": {
    source: "iana"
  },
  "application/vnd.seemail": {
    source: "iana",
    extensions: [
      "see"
    ]
  },
  "application/vnd.seis+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.sema": {
    source: "iana",
    extensions: [
      "sema"
    ]
  },
  "application/vnd.semd": {
    source: "iana",
    extensions: [
      "semd"
    ]
  },
  "application/vnd.semf": {
    source: "iana",
    extensions: [
      "semf"
    ]
  },
  "application/vnd.shade-save-file": {
    source: "iana"
  },
  "application/vnd.shana.informed.formdata": {
    source: "iana",
    extensions: [
      "ifm"
    ]
  },
  "application/vnd.shana.informed.formtemplate": {
    source: "iana",
    extensions: [
      "itp"
    ]
  },
  "application/vnd.shana.informed.interchange": {
    source: "iana",
    extensions: [
      "iif"
    ]
  },
  "application/vnd.shana.informed.package": {
    source: "iana",
    extensions: [
      "ipk"
    ]
  },
  "application/vnd.shootproof+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.shopkick+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.shp": {
    source: "iana"
  },
  "application/vnd.shx": {
    source: "iana"
  },
  "application/vnd.sigrok.session": {
    source: "iana"
  },
  "application/vnd.simtech-mindmapper": {
    source: "iana",
    extensions: [
      "twd",
      "twds"
    ]
  },
  "application/vnd.siren+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.smaf": {
    source: "iana",
    extensions: [
      "mmf"
    ]
  },
  "application/vnd.smart.notebook": {
    source: "iana"
  },
  "application/vnd.smart.teacher": {
    source: "iana",
    extensions: [
      "teacher"
    ]
  },
  "application/vnd.snesdev-page-table": {
    source: "iana"
  },
  "application/vnd.software602.filler.form+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "fo"
    ]
  },
  "application/vnd.software602.filler.form-xml-zip": {
    source: "iana"
  },
  "application/vnd.solent.sdkm+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sdkm",
      "sdkd"
    ]
  },
  "application/vnd.spotfire.dxp": {
    source: "iana",
    extensions: [
      "dxp"
    ]
  },
  "application/vnd.spotfire.sfs": {
    source: "iana",
    extensions: [
      "sfs"
    ]
  },
  "application/vnd.sqlite3": {
    source: "iana"
  },
  "application/vnd.sss-cod": {
    source: "iana"
  },
  "application/vnd.sss-dtf": {
    source: "iana"
  },
  "application/vnd.sss-ntf": {
    source: "iana"
  },
  "application/vnd.stardivision.calc": {
    source: "apache",
    extensions: [
      "sdc"
    ]
  },
  "application/vnd.stardivision.draw": {
    source: "apache",
    extensions: [
      "sda"
    ]
  },
  "application/vnd.stardivision.impress": {
    source: "apache",
    extensions: [
      "sdd"
    ]
  },
  "application/vnd.stardivision.math": {
    source: "apache",
    extensions: [
      "smf"
    ]
  },
  "application/vnd.stardivision.writer": {
    source: "apache",
    extensions: [
      "sdw",
      "vor"
    ]
  },
  "application/vnd.stardivision.writer-global": {
    source: "apache",
    extensions: [
      "sgl"
    ]
  },
  "application/vnd.stepmania.package": {
    source: "iana",
    extensions: [
      "smzip"
    ]
  },
  "application/vnd.stepmania.stepchart": {
    source: "iana",
    extensions: [
      "sm"
    ]
  },
  "application/vnd.street-stream": {
    source: "iana"
  },
  "application/vnd.sun.wadl+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "wadl"
    ]
  },
  "application/vnd.sun.xml.calc": {
    source: "apache",
    extensions: [
      "sxc"
    ]
  },
  "application/vnd.sun.xml.calc.template": {
    source: "apache",
    extensions: [
      "stc"
    ]
  },
  "application/vnd.sun.xml.draw": {
    source: "apache",
    extensions: [
      "sxd"
    ]
  },
  "application/vnd.sun.xml.draw.template": {
    source: "apache",
    extensions: [
      "std"
    ]
  },
  "application/vnd.sun.xml.impress": {
    source: "apache",
    extensions: [
      "sxi"
    ]
  },
  "application/vnd.sun.xml.impress.template": {
    source: "apache",
    extensions: [
      "sti"
    ]
  },
  "application/vnd.sun.xml.math": {
    source: "apache",
    extensions: [
      "sxm"
    ]
  },
  "application/vnd.sun.xml.writer": {
    source: "apache",
    extensions: [
      "sxw"
    ]
  },
  "application/vnd.sun.xml.writer.global": {
    source: "apache",
    extensions: [
      "sxg"
    ]
  },
  "application/vnd.sun.xml.writer.template": {
    source: "apache",
    extensions: [
      "stw"
    ]
  },
  "application/vnd.sus-calendar": {
    source: "iana",
    extensions: [
      "sus",
      "susp"
    ]
  },
  "application/vnd.svd": {
    source: "iana",
    extensions: [
      "svd"
    ]
  },
  "application/vnd.swiftview-ics": {
    source: "iana"
  },
  "application/vnd.sycle+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.syft+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.symbian.install": {
    source: "apache",
    extensions: [
      "sis",
      "sisx"
    ]
  },
  "application/vnd.syncml+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "xsm"
    ]
  },
  "application/vnd.syncml.dm+wbxml": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "bdm"
    ]
  },
  "application/vnd.syncml.dm+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "xdm"
    ]
  },
  "application/vnd.syncml.dm.notification": {
    source: "iana"
  },
  "application/vnd.syncml.dmddf+wbxml": {
    source: "iana"
  },
  "application/vnd.syncml.dmddf+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "ddf"
    ]
  },
  "application/vnd.syncml.dmtnds+wbxml": {
    source: "iana"
  },
  "application/vnd.syncml.dmtnds+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/vnd.syncml.ds.notification": {
    source: "iana"
  },
  "application/vnd.tableschema+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.tao.intent-module-archive": {
    source: "iana",
    extensions: [
      "tao"
    ]
  },
  "application/vnd.tcpdump.pcap": {
    source: "iana",
    extensions: [
      "pcap",
      "cap",
      "dmp"
    ]
  },
  "application/vnd.think-cell.ppttc+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.tmd.mediaflex.api+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.tml": {
    source: "iana"
  },
  "application/vnd.tmobile-livetv": {
    source: "iana",
    extensions: [
      "tmo"
    ]
  },
  "application/vnd.tri.onesource": {
    source: "iana"
  },
  "application/vnd.trid.tpt": {
    source: "iana",
    extensions: [
      "tpt"
    ]
  },
  "application/vnd.triscape.mxs": {
    source: "iana",
    extensions: [
      "mxs"
    ]
  },
  "application/vnd.trueapp": {
    source: "iana",
    extensions: [
      "tra"
    ]
  },
  "application/vnd.truedoc": {
    source: "iana"
  },
  "application/vnd.ubisoft.webplayer": {
    source: "iana"
  },
  "application/vnd.ufdl": {
    source: "iana",
    extensions: [
      "ufd",
      "ufdl"
    ]
  },
  "application/vnd.uiq.theme": {
    source: "iana",
    extensions: [
      "utz"
    ]
  },
  "application/vnd.umajin": {
    source: "iana",
    extensions: [
      "umj"
    ]
  },
  "application/vnd.unity": {
    source: "iana",
    extensions: [
      "unityweb"
    ]
  },
  "application/vnd.uoml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "uoml"
    ]
  },
  "application/vnd.uplanet.alert": {
    source: "iana"
  },
  "application/vnd.uplanet.alert-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.bearer-choice": {
    source: "iana"
  },
  "application/vnd.uplanet.bearer-choice-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.cacheop": {
    source: "iana"
  },
  "application/vnd.uplanet.cacheop-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.channel": {
    source: "iana"
  },
  "application/vnd.uplanet.channel-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.list": {
    source: "iana"
  },
  "application/vnd.uplanet.list-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.listcmd": {
    source: "iana"
  },
  "application/vnd.uplanet.listcmd-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.signal": {
    source: "iana"
  },
  "application/vnd.uri-map": {
    source: "iana"
  },
  "application/vnd.valve.source.material": {
    source: "iana"
  },
  "application/vnd.vcx": {
    source: "iana",
    extensions: [
      "vcx"
    ]
  },
  "application/vnd.vd-study": {
    source: "iana"
  },
  "application/vnd.vectorworks": {
    source: "iana"
  },
  "application/vnd.vel+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.verimatrix.vcas": {
    source: "iana"
  },
  "application/vnd.veritone.aion+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.veryant.thin": {
    source: "iana"
  },
  "application/vnd.ves.encrypted": {
    source: "iana"
  },
  "application/vnd.vidsoft.vidconference": {
    source: "iana"
  },
  "application/vnd.visio": {
    source: "iana",
    extensions: [
      "vsd",
      "vst",
      "vss",
      "vsw"
    ]
  },
  "application/vnd.visionary": {
    source: "iana",
    extensions: [
      "vis"
    ]
  },
  "application/vnd.vividence.scriptfile": {
    source: "iana"
  },
  "application/vnd.vsf": {
    source: "iana",
    extensions: [
      "vsf"
    ]
  },
  "application/vnd.wap.sic": {
    source: "iana"
  },
  "application/vnd.wap.slc": {
    source: "iana"
  },
  "application/vnd.wap.wbxml": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "wbxml"
    ]
  },
  "application/vnd.wap.wmlc": {
    source: "iana",
    extensions: [
      "wmlc"
    ]
  },
  "application/vnd.wap.wmlscriptc": {
    source: "iana",
    extensions: [
      "wmlsc"
    ]
  },
  "application/vnd.webturbo": {
    source: "iana",
    extensions: [
      "wtb"
    ]
  },
  "application/vnd.wfa.dpp": {
    source: "iana"
  },
  "application/vnd.wfa.p2p": {
    source: "iana"
  },
  "application/vnd.wfa.wsc": {
    source: "iana"
  },
  "application/vnd.windows.devicepairing": {
    source: "iana"
  },
  "application/vnd.wmc": {
    source: "iana"
  },
  "application/vnd.wmf.bootstrap": {
    source: "iana"
  },
  "application/vnd.wolfram.mathematica": {
    source: "iana"
  },
  "application/vnd.wolfram.mathematica.package": {
    source: "iana"
  },
  "application/vnd.wolfram.player": {
    source: "iana",
    extensions: [
      "nbp"
    ]
  },
  "application/vnd.wordperfect": {
    source: "iana",
    extensions: [
      "wpd"
    ]
  },
  "application/vnd.wqd": {
    source: "iana",
    extensions: [
      "wqd"
    ]
  },
  "application/vnd.wrq-hp3000-labelled": {
    source: "iana"
  },
  "application/vnd.wt.stf": {
    source: "iana",
    extensions: [
      "stf"
    ]
  },
  "application/vnd.wv.csp+wbxml": {
    source: "iana"
  },
  "application/vnd.wv.csp+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.wv.ssp+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.xacml+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.xara": {
    source: "iana",
    extensions: [
      "xar"
    ]
  },
  "application/vnd.xfdl": {
    source: "iana",
    extensions: [
      "xfdl"
    ]
  },
  "application/vnd.xfdl.webform": {
    source: "iana"
  },
  "application/vnd.xmi+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.xmpie.cpkg": {
    source: "iana"
  },
  "application/vnd.xmpie.dpkg": {
    source: "iana"
  },
  "application/vnd.xmpie.plan": {
    source: "iana"
  },
  "application/vnd.xmpie.ppkg": {
    source: "iana"
  },
  "application/vnd.xmpie.xlim": {
    source: "iana"
  },
  "application/vnd.yamaha.hv-dic": {
    source: "iana",
    extensions: [
      "hvd"
    ]
  },
  "application/vnd.yamaha.hv-script": {
    source: "iana",
    extensions: [
      "hvs"
    ]
  },
  "application/vnd.yamaha.hv-voice": {
    source: "iana",
    extensions: [
      "hvp"
    ]
  },
  "application/vnd.yamaha.openscoreformat": {
    source: "iana",
    extensions: [
      "osf"
    ]
  },
  "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "osfpvg"
    ]
  },
  "application/vnd.yamaha.remote-setup": {
    source: "iana"
  },
  "application/vnd.yamaha.smaf-audio": {
    source: "iana",
    extensions: [
      "saf"
    ]
  },
  "application/vnd.yamaha.smaf-phrase": {
    source: "iana",
    extensions: [
      "spf"
    ]
  },
  "application/vnd.yamaha.through-ngn": {
    source: "iana"
  },
  "application/vnd.yamaha.tunnel-udpencap": {
    source: "iana"
  },
  "application/vnd.yaoweme": {
    source: "iana"
  },
  "application/vnd.yellowriver-custom-menu": {
    source: "iana",
    extensions: [
      "cmp"
    ]
  },
  "application/vnd.youtube.yt": {
    source: "iana"
  },
  "application/vnd.zul": {
    source: "iana",
    extensions: [
      "zir",
      "zirz"
    ]
  },
  "application/vnd.zzazz.deck+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "zaz"
    ]
  },
  "application/voicexml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "vxml"
    ]
  },
  "application/voucher-cms+json": {
    source: "iana",
    compressible: true
  },
  "application/vq-rtcpxr": {
    source: "iana"
  },
  "application/wasm": {
    source: "iana",
    compressible: true,
    extensions: [
      "wasm"
    ]
  },
  "application/watcherinfo+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "wif"
    ]
  },
  "application/webpush-options+json": {
    source: "iana",
    compressible: true
  },
  "application/whoispp-query": {
    source: "iana"
  },
  "application/whoispp-response": {
    source: "iana"
  },
  "application/widget": {
    source: "iana",
    extensions: [
      "wgt"
    ]
  },
  "application/winhlp": {
    source: "apache",
    extensions: [
      "hlp"
    ]
  },
  "application/wita": {
    source: "iana"
  },
  "application/wordperfect5.1": {
    source: "iana"
  },
  "application/wsdl+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "wsdl"
    ]
  },
  "application/wspolicy+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "wspolicy"
    ]
  },
  "application/x-7z-compressed": {
    source: "apache",
    compressible: false,
    extensions: [
      "7z"
    ]
  },
  "application/x-abiword": {
    source: "apache",
    extensions: [
      "abw"
    ]
  },
  "application/x-ace-compressed": {
    source: "apache",
    extensions: [
      "ace"
    ]
  },
  "application/x-amf": {
    source: "apache"
  },
  "application/x-apple-diskimage": {
    source: "apache",
    extensions: [
      "dmg"
    ]
  },
  "application/x-arj": {
    compressible: false,
    extensions: [
      "arj"
    ]
  },
  "application/x-authorware-bin": {
    source: "apache",
    extensions: [
      "aab",
      "x32",
      "u32",
      "vox"
    ]
  },
  "application/x-authorware-map": {
    source: "apache",
    extensions: [
      "aam"
    ]
  },
  "application/x-authorware-seg": {
    source: "apache",
    extensions: [
      "aas"
    ]
  },
  "application/x-bcpio": {
    source: "apache",
    extensions: [
      "bcpio"
    ]
  },
  "application/x-bdoc": {
    compressible: false,
    extensions: [
      "bdoc"
    ]
  },
  "application/x-bittorrent": {
    source: "apache",
    extensions: [
      "torrent"
    ]
  },
  "application/x-blorb": {
    source: "apache",
    extensions: [
      "blb",
      "blorb"
    ]
  },
  "application/x-bzip": {
    source: "apache",
    compressible: false,
    extensions: [
      "bz"
    ]
  },
  "application/x-bzip2": {
    source: "apache",
    compressible: false,
    extensions: [
      "bz2",
      "boz"
    ]
  },
  "application/x-cbr": {
    source: "apache",
    extensions: [
      "cbr",
      "cba",
      "cbt",
      "cbz",
      "cb7"
    ]
  },
  "application/x-cdlink": {
    source: "apache",
    extensions: [
      "vcd"
    ]
  },
  "application/x-cfs-compressed": {
    source: "apache",
    extensions: [
      "cfs"
    ]
  },
  "application/x-chat": {
    source: "apache",
    extensions: [
      "chat"
    ]
  },
  "application/x-chess-pgn": {
    source: "apache",
    extensions: [
      "pgn"
    ]
  },
  "application/x-chrome-extension": {
    extensions: [
      "crx"
    ]
  },
  "application/x-cocoa": {
    source: "nginx",
    extensions: [
      "cco"
    ]
  },
  "application/x-compress": {
    source: "apache"
  },
  "application/x-conference": {
    source: "apache",
    extensions: [
      "nsc"
    ]
  },
  "application/x-cpio": {
    source: "apache",
    extensions: [
      "cpio"
    ]
  },
  "application/x-csh": {
    source: "apache",
    extensions: [
      "csh"
    ]
  },
  "application/x-deb": {
    compressible: false
  },
  "application/x-debian-package": {
    source: "apache",
    extensions: [
      "deb",
      "udeb"
    ]
  },
  "application/x-dgc-compressed": {
    source: "apache",
    extensions: [
      "dgc"
    ]
  },
  "application/x-director": {
    source: "apache",
    extensions: [
      "dir",
      "dcr",
      "dxr",
      "cst",
      "cct",
      "cxt",
      "w3d",
      "fgd",
      "swa"
    ]
  },
  "application/x-doom": {
    source: "apache",
    extensions: [
      "wad"
    ]
  },
  "application/x-dtbncx+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "ncx"
    ]
  },
  "application/x-dtbook+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "dtb"
    ]
  },
  "application/x-dtbresource+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "res"
    ]
  },
  "application/x-dvi": {
    source: "apache",
    compressible: false,
    extensions: [
      "dvi"
    ]
  },
  "application/x-envoy": {
    source: "apache",
    extensions: [
      "evy"
    ]
  },
  "application/x-eva": {
    source: "apache",
    extensions: [
      "eva"
    ]
  },
  "application/x-font-bdf": {
    source: "apache",
    extensions: [
      "bdf"
    ]
  },
  "application/x-font-dos": {
    source: "apache"
  },
  "application/x-font-framemaker": {
    source: "apache"
  },
  "application/x-font-ghostscript": {
    source: "apache",
    extensions: [
      "gsf"
    ]
  },
  "application/x-font-libgrx": {
    source: "apache"
  },
  "application/x-font-linux-psf": {
    source: "apache",
    extensions: [
      "psf"
    ]
  },
  "application/x-font-pcf": {
    source: "apache",
    extensions: [
      "pcf"
    ]
  },
  "application/x-font-snf": {
    source: "apache",
    extensions: [
      "snf"
    ]
  },
  "application/x-font-speedo": {
    source: "apache"
  },
  "application/x-font-sunos-news": {
    source: "apache"
  },
  "application/x-font-type1": {
    source: "apache",
    extensions: [
      "pfa",
      "pfb",
      "pfm",
      "afm"
    ]
  },
  "application/x-font-vfont": {
    source: "apache"
  },
  "application/x-freearc": {
    source: "apache",
    extensions: [
      "arc"
    ]
  },
  "application/x-futuresplash": {
    source: "apache",
    extensions: [
      "spl"
    ]
  },
  "application/x-gca-compressed": {
    source: "apache",
    extensions: [
      "gca"
    ]
  },
  "application/x-glulx": {
    source: "apache",
    extensions: [
      "ulx"
    ]
  },
  "application/x-gnumeric": {
    source: "apache",
    extensions: [
      "gnumeric"
    ]
  },
  "application/x-gramps-xml": {
    source: "apache",
    extensions: [
      "gramps"
    ]
  },
  "application/x-gtar": {
    source: "apache",
    extensions: [
      "gtar"
    ]
  },
  "application/x-gzip": {
    source: "apache"
  },
  "application/x-hdf": {
    source: "apache",
    extensions: [
      "hdf"
    ]
  },
  "application/x-httpd-php": {
    compressible: true,
    extensions: [
      "php"
    ]
  },
  "application/x-install-instructions": {
    source: "apache",
    extensions: [
      "install"
    ]
  },
  "application/x-iso9660-image": {
    source: "apache",
    extensions: [
      "iso"
    ]
  },
  "application/x-iwork-keynote-sffkey": {
    extensions: [
      "key"
    ]
  },
  "application/x-iwork-numbers-sffnumbers": {
    extensions: [
      "numbers"
    ]
  },
  "application/x-iwork-pages-sffpages": {
    extensions: [
      "pages"
    ]
  },
  "application/x-java-archive-diff": {
    source: "nginx",
    extensions: [
      "jardiff"
    ]
  },
  "application/x-java-jnlp-file": {
    source: "apache",
    compressible: false,
    extensions: [
      "jnlp"
    ]
  },
  "application/x-javascript": {
    compressible: true
  },
  "application/x-keepass2": {
    extensions: [
      "kdbx"
    ]
  },
  "application/x-latex": {
    source: "apache",
    compressible: false,
    extensions: [
      "latex"
    ]
  },
  "application/x-lua-bytecode": {
    extensions: [
      "luac"
    ]
  },
  "application/x-lzh-compressed": {
    source: "apache",
    extensions: [
      "lzh",
      "lha"
    ]
  },
  "application/x-makeself": {
    source: "nginx",
    extensions: [
      "run"
    ]
  },
  "application/x-mie": {
    source: "apache",
    extensions: [
      "mie"
    ]
  },
  "application/x-mobipocket-ebook": {
    source: "apache",
    extensions: [
      "prc",
      "mobi"
    ]
  },
  "application/x-mpegurl": {
    compressible: false
  },
  "application/x-ms-application": {
    source: "apache",
    extensions: [
      "application"
    ]
  },
  "application/x-ms-shortcut": {
    source: "apache",
    extensions: [
      "lnk"
    ]
  },
  "application/x-ms-wmd": {
    source: "apache",
    extensions: [
      "wmd"
    ]
  },
  "application/x-ms-wmz": {
    source: "apache",
    extensions: [
      "wmz"
    ]
  },
  "application/x-ms-xbap": {
    source: "apache",
    extensions: [
      "xbap"
    ]
  },
  "application/x-msaccess": {
    source: "apache",
    extensions: [
      "mdb"
    ]
  },
  "application/x-msbinder": {
    source: "apache",
    extensions: [
      "obd"
    ]
  },
  "application/x-mscardfile": {
    source: "apache",
    extensions: [
      "crd"
    ]
  },
  "application/x-msclip": {
    source: "apache",
    extensions: [
      "clp"
    ]
  },
  "application/x-msdos-program": {
    extensions: [
      "exe"
    ]
  },
  "application/x-msdownload": {
    source: "apache",
    extensions: [
      "exe",
      "dll",
      "com",
      "bat",
      "msi"
    ]
  },
  "application/x-msmediaview": {
    source: "apache",
    extensions: [
      "mvb",
      "m13",
      "m14"
    ]
  },
  "application/x-msmetafile": {
    source: "apache",
    extensions: [
      "wmf",
      "wmz",
      "emf",
      "emz"
    ]
  },
  "application/x-msmoney": {
    source: "apache",
    extensions: [
      "mny"
    ]
  },
  "application/x-mspublisher": {
    source: "apache",
    extensions: [
      "pub"
    ]
  },
  "application/x-msschedule": {
    source: "apache",
    extensions: [
      "scd"
    ]
  },
  "application/x-msterminal": {
    source: "apache",
    extensions: [
      "trm"
    ]
  },
  "application/x-mswrite": {
    source: "apache",
    extensions: [
      "wri"
    ]
  },
  "application/x-netcdf": {
    source: "apache",
    extensions: [
      "nc",
      "cdf"
    ]
  },
  "application/x-ns-proxy-autoconfig": {
    compressible: true,
    extensions: [
      "pac"
    ]
  },
  "application/x-nzb": {
    source: "apache",
    extensions: [
      "nzb"
    ]
  },
  "application/x-perl": {
    source: "nginx",
    extensions: [
      "pl",
      "pm"
    ]
  },
  "application/x-pilot": {
    source: "nginx",
    extensions: [
      "prc",
      "pdb"
    ]
  },
  "application/x-pkcs12": {
    source: "apache",
    compressible: false,
    extensions: [
      "p12",
      "pfx"
    ]
  },
  "application/x-pkcs7-certificates": {
    source: "apache",
    extensions: [
      "p7b",
      "spc"
    ]
  },
  "application/x-pkcs7-certreqresp": {
    source: "apache",
    extensions: [
      "p7r"
    ]
  },
  "application/x-pki-message": {
    source: "iana"
  },
  "application/x-rar-compressed": {
    source: "apache",
    compressible: false,
    extensions: [
      "rar"
    ]
  },
  "application/x-redhat-package-manager": {
    source: "nginx",
    extensions: [
      "rpm"
    ]
  },
  "application/x-research-info-systems": {
    source: "apache",
    extensions: [
      "ris"
    ]
  },
  "application/x-sea": {
    source: "nginx",
    extensions: [
      "sea"
    ]
  },
  "application/x-sh": {
    source: "apache",
    compressible: true,
    extensions: [
      "sh"
    ]
  },
  "application/x-shar": {
    source: "apache",
    extensions: [
      "shar"
    ]
  },
  "application/x-shockwave-flash": {
    source: "apache",
    compressible: false,
    extensions: [
      "swf"
    ]
  },
  "application/x-silverlight-app": {
    source: "apache",
    extensions: [
      "xap"
    ]
  },
  "application/x-sql": {
    source: "apache",
    extensions: [
      "sql"
    ]
  },
  "application/x-stuffit": {
    source: "apache",
    compressible: false,
    extensions: [
      "sit"
    ]
  },
  "application/x-stuffitx": {
    source: "apache",
    extensions: [
      "sitx"
    ]
  },
  "application/x-subrip": {
    source: "apache",
    extensions: [
      "srt"
    ]
  },
  "application/x-sv4cpio": {
    source: "apache",
    extensions: [
      "sv4cpio"
    ]
  },
  "application/x-sv4crc": {
    source: "apache",
    extensions: [
      "sv4crc"
    ]
  },
  "application/x-t3vm-image": {
    source: "apache",
    extensions: [
      "t3"
    ]
  },
  "application/x-tads": {
    source: "apache",
    extensions: [
      "gam"
    ]
  },
  "application/x-tar": {
    source: "apache",
    compressible: true,
    extensions: [
      "tar"
    ]
  },
  "application/x-tcl": {
    source: "apache",
    extensions: [
      "tcl",
      "tk"
    ]
  },
  "application/x-tex": {
    source: "apache",
    extensions: [
      "tex"
    ]
  },
  "application/x-tex-tfm": {
    source: "apache",
    extensions: [
      "tfm"
    ]
  },
  "application/x-texinfo": {
    source: "apache",
    extensions: [
      "texinfo",
      "texi"
    ]
  },
  "application/x-tgif": {
    source: "apache",
    extensions: [
      "obj"
    ]
  },
  "application/x-ustar": {
    source: "apache",
    extensions: [
      "ustar"
    ]
  },
  "application/x-virtualbox-hdd": {
    compressible: true,
    extensions: [
      "hdd"
    ]
  },
  "application/x-virtualbox-ova": {
    compressible: true,
    extensions: [
      "ova"
    ]
  },
  "application/x-virtualbox-ovf": {
    compressible: true,
    extensions: [
      "ovf"
    ]
  },
  "application/x-virtualbox-vbox": {
    compressible: true,
    extensions: [
      "vbox"
    ]
  },
  "application/x-virtualbox-vbox-extpack": {
    compressible: false,
    extensions: [
      "vbox-extpack"
    ]
  },
  "application/x-virtualbox-vdi": {
    compressible: true,
    extensions: [
      "vdi"
    ]
  },
  "application/x-virtualbox-vhd": {
    compressible: true,
    extensions: [
      "vhd"
    ]
  },
  "application/x-virtualbox-vmdk": {
    compressible: true,
    extensions: [
      "vmdk"
    ]
  },
  "application/x-wais-source": {
    source: "apache",
    extensions: [
      "src"
    ]
  },
  "application/x-web-app-manifest+json": {
    compressible: true,
    extensions: [
      "webapp"
    ]
  },
  "application/x-www-form-urlencoded": {
    source: "iana",
    compressible: true
  },
  "application/x-x509-ca-cert": {
    source: "iana",
    extensions: [
      "der",
      "crt",
      "pem"
    ]
  },
  "application/x-x509-ca-ra-cert": {
    source: "iana"
  },
  "application/x-x509-next-ca-cert": {
    source: "iana"
  },
  "application/x-xfig": {
    source: "apache",
    extensions: [
      "fig"
    ]
  },
  "application/x-xliff+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "xlf"
    ]
  },
  "application/x-xpinstall": {
    source: "apache",
    compressible: false,
    extensions: [
      "xpi"
    ]
  },
  "application/x-xz": {
    source: "apache",
    extensions: [
      "xz"
    ]
  },
  "application/x-zmachine": {
    source: "apache",
    extensions: [
      "z1",
      "z2",
      "z3",
      "z4",
      "z5",
      "z6",
      "z7",
      "z8"
    ]
  },
  "application/x400-bp": {
    source: "iana"
  },
  "application/xacml+xml": {
    source: "iana",
    compressible: true
  },
  "application/xaml+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "xaml"
    ]
  },
  "application/xcap-att+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xav"
    ]
  },
  "application/xcap-caps+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xca"
    ]
  },
  "application/xcap-diff+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xdf"
    ]
  },
  "application/xcap-el+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xel"
    ]
  },
  "application/xcap-error+xml": {
    source: "iana",
    compressible: true
  },
  "application/xcap-ns+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xns"
    ]
  },
  "application/xcon-conference-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/xcon-conference-info-diff+xml": {
    source: "iana",
    compressible: true
  },
  "application/xenc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xenc"
    ]
  },
  "application/xhtml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xhtml",
      "xht"
    ]
  },
  "application/xhtml-voice+xml": {
    source: "apache",
    compressible: true
  },
  "application/xliff+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xlf"
    ]
  },
  "application/xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xml",
      "xsl",
      "xsd",
      "rng"
    ]
  },
  "application/xml-dtd": {
    source: "iana",
    compressible: true,
    extensions: [
      "dtd"
    ]
  },
  "application/xml-external-parsed-entity": {
    source: "iana"
  },
  "application/xml-patch+xml": {
    source: "iana",
    compressible: true
  },
  "application/xmpp+xml": {
    source: "iana",
    compressible: true
  },
  "application/xop+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xop"
    ]
  },
  "application/xproc+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "xpl"
    ]
  },
  "application/xslt+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xsl",
      "xslt"
    ]
  },
  "application/xspf+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "xspf"
    ]
  },
  "application/xv+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mxml",
      "xhvml",
      "xvml",
      "xvm"
    ]
  },
  "application/yang": {
    source: "iana",
    extensions: [
      "yang"
    ]
  },
  "application/yang-data+json": {
    source: "iana",
    compressible: true
  },
  "application/yang-data+xml": {
    source: "iana",
    compressible: true
  },
  "application/yang-patch+json": {
    source: "iana",
    compressible: true
  },
  "application/yang-patch+xml": {
    source: "iana",
    compressible: true
  },
  "application/yin+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "yin"
    ]
  },
  "application/zip": {
    source: "iana",
    compressible: false,
    extensions: [
      "zip"
    ]
  },
  "application/zlib": {
    source: "iana"
  },
  "application/zstd": {
    source: "iana"
  },
  "audio/1d-interleaved-parityfec": {
    source: "iana"
  },
  "audio/32kadpcm": {
    source: "iana"
  },
  "audio/3gpp": {
    source: "iana",
    compressible: false,
    extensions: [
      "3gpp"
    ]
  },
  "audio/3gpp2": {
    source: "iana"
  },
  "audio/aac": {
    source: "iana"
  },
  "audio/ac3": {
    source: "iana"
  },
  "audio/adpcm": {
    source: "apache",
    extensions: [
      "adp"
    ]
  },
  "audio/amr": {
    source: "iana",
    extensions: [
      "amr"
    ]
  },
  "audio/amr-wb": {
    source: "iana"
  },
  "audio/amr-wb+": {
    source: "iana"
  },
  "audio/aptx": {
    source: "iana"
  },
  "audio/asc": {
    source: "iana"
  },
  "audio/atrac-advanced-lossless": {
    source: "iana"
  },
  "audio/atrac-x": {
    source: "iana"
  },
  "audio/atrac3": {
    source: "iana"
  },
  "audio/basic": {
    source: "iana",
    compressible: false,
    extensions: [
      "au",
      "snd"
    ]
  },
  "audio/bv16": {
    source: "iana"
  },
  "audio/bv32": {
    source: "iana"
  },
  "audio/clearmode": {
    source: "iana"
  },
  "audio/cn": {
    source: "iana"
  },
  "audio/dat12": {
    source: "iana"
  },
  "audio/dls": {
    source: "iana"
  },
  "audio/dsr-es201108": {
    source: "iana"
  },
  "audio/dsr-es202050": {
    source: "iana"
  },
  "audio/dsr-es202211": {
    source: "iana"
  },
  "audio/dsr-es202212": {
    source: "iana"
  },
  "audio/dv": {
    source: "iana"
  },
  "audio/dvi4": {
    source: "iana"
  },
  "audio/eac3": {
    source: "iana"
  },
  "audio/encaprtp": {
    source: "iana"
  },
  "audio/evrc": {
    source: "iana"
  },
  "audio/evrc-qcp": {
    source: "iana"
  },
  "audio/evrc0": {
    source: "iana"
  },
  "audio/evrc1": {
    source: "iana"
  },
  "audio/evrcb": {
    source: "iana"
  },
  "audio/evrcb0": {
    source: "iana"
  },
  "audio/evrcb1": {
    source: "iana"
  },
  "audio/evrcnw": {
    source: "iana"
  },
  "audio/evrcnw0": {
    source: "iana"
  },
  "audio/evrcnw1": {
    source: "iana"
  },
  "audio/evrcwb": {
    source: "iana"
  },
  "audio/evrcwb0": {
    source: "iana"
  },
  "audio/evrcwb1": {
    source: "iana"
  },
  "audio/evs": {
    source: "iana"
  },
  "audio/flexfec": {
    source: "iana"
  },
  "audio/fwdred": {
    source: "iana"
  },
  "audio/g711-0": {
    source: "iana"
  },
  "audio/g719": {
    source: "iana"
  },
  "audio/g722": {
    source: "iana"
  },
  "audio/g7221": {
    source: "iana"
  },
  "audio/g723": {
    source: "iana"
  },
  "audio/g726-16": {
    source: "iana"
  },
  "audio/g726-24": {
    source: "iana"
  },
  "audio/g726-32": {
    source: "iana"
  },
  "audio/g726-40": {
    source: "iana"
  },
  "audio/g728": {
    source: "iana"
  },
  "audio/g729": {
    source: "iana"
  },
  "audio/g7291": {
    source: "iana"
  },
  "audio/g729d": {
    source: "iana"
  },
  "audio/g729e": {
    source: "iana"
  },
  "audio/gsm": {
    source: "iana"
  },
  "audio/gsm-efr": {
    source: "iana"
  },
  "audio/gsm-hr-08": {
    source: "iana"
  },
  "audio/ilbc": {
    source: "iana"
  },
  "audio/ip-mr_v2.5": {
    source: "iana"
  },
  "audio/isac": {
    source: "apache"
  },
  "audio/l16": {
    source: "iana"
  },
  "audio/l20": {
    source: "iana"
  },
  "audio/l24": {
    source: "iana",
    compressible: false
  },
  "audio/l8": {
    source: "iana"
  },
  "audio/lpc": {
    source: "iana"
  },
  "audio/melp": {
    source: "iana"
  },
  "audio/melp1200": {
    source: "iana"
  },
  "audio/melp2400": {
    source: "iana"
  },
  "audio/melp600": {
    source: "iana"
  },
  "audio/mhas": {
    source: "iana"
  },
  "audio/midi": {
    source: "apache",
    extensions: [
      "mid",
      "midi",
      "kar",
      "rmi"
    ]
  },
  "audio/mobile-xmf": {
    source: "iana",
    extensions: [
      "mxmf"
    ]
  },
  "audio/mp3": {
    compressible: false,
    extensions: [
      "mp3"
    ]
  },
  "audio/mp4": {
    source: "iana",
    compressible: false,
    extensions: [
      "m4a",
      "mp4a"
    ]
  },
  "audio/mp4a-latm": {
    source: "iana"
  },
  "audio/mpa": {
    source: "iana"
  },
  "audio/mpa-robust": {
    source: "iana"
  },
  "audio/mpeg": {
    source: "iana",
    compressible: false,
    extensions: [
      "mpga",
      "mp2",
      "mp2a",
      "mp3",
      "m2a",
      "m3a"
    ]
  },
  "audio/mpeg4-generic": {
    source: "iana"
  },
  "audio/musepack": {
    source: "apache"
  },
  "audio/ogg": {
    source: "iana",
    compressible: false,
    extensions: [
      "oga",
      "ogg",
      "spx",
      "opus"
    ]
  },
  "audio/opus": {
    source: "iana"
  },
  "audio/parityfec": {
    source: "iana"
  },
  "audio/pcma": {
    source: "iana"
  },
  "audio/pcma-wb": {
    source: "iana"
  },
  "audio/pcmu": {
    source: "iana"
  },
  "audio/pcmu-wb": {
    source: "iana"
  },
  "audio/prs.sid": {
    source: "iana"
  },
  "audio/qcelp": {
    source: "iana"
  },
  "audio/raptorfec": {
    source: "iana"
  },
  "audio/red": {
    source: "iana"
  },
  "audio/rtp-enc-aescm128": {
    source: "iana"
  },
  "audio/rtp-midi": {
    source: "iana"
  },
  "audio/rtploopback": {
    source: "iana"
  },
  "audio/rtx": {
    source: "iana"
  },
  "audio/s3m": {
    source: "apache",
    extensions: [
      "s3m"
    ]
  },
  "audio/scip": {
    source: "iana"
  },
  "audio/silk": {
    source: "apache",
    extensions: [
      "sil"
    ]
  },
  "audio/smv": {
    source: "iana"
  },
  "audio/smv-qcp": {
    source: "iana"
  },
  "audio/smv0": {
    source: "iana"
  },
  "audio/sofa": {
    source: "iana"
  },
  "audio/sp-midi": {
    source: "iana"
  },
  "audio/speex": {
    source: "iana"
  },
  "audio/t140c": {
    source: "iana"
  },
  "audio/t38": {
    source: "iana"
  },
  "audio/telephone-event": {
    source: "iana"
  },
  "audio/tetra_acelp": {
    source: "iana"
  },
  "audio/tetra_acelp_bb": {
    source: "iana"
  },
  "audio/tone": {
    source: "iana"
  },
  "audio/tsvcis": {
    source: "iana"
  },
  "audio/uemclip": {
    source: "iana"
  },
  "audio/ulpfec": {
    source: "iana"
  },
  "audio/usac": {
    source: "iana"
  },
  "audio/vdvi": {
    source: "iana"
  },
  "audio/vmr-wb": {
    source: "iana"
  },
  "audio/vnd.3gpp.iufp": {
    source: "iana"
  },
  "audio/vnd.4sb": {
    source: "iana"
  },
  "audio/vnd.audiokoz": {
    source: "iana"
  },
  "audio/vnd.celp": {
    source: "iana"
  },
  "audio/vnd.cisco.nse": {
    source: "iana"
  },
  "audio/vnd.cmles.radio-events": {
    source: "iana"
  },
  "audio/vnd.cns.anp1": {
    source: "iana"
  },
  "audio/vnd.cns.inf1": {
    source: "iana"
  },
  "audio/vnd.dece.audio": {
    source: "iana",
    extensions: [
      "uva",
      "uvva"
    ]
  },
  "audio/vnd.digital-winds": {
    source: "iana",
    extensions: [
      "eol"
    ]
  },
  "audio/vnd.dlna.adts": {
    source: "iana"
  },
  "audio/vnd.dolby.heaac.1": {
    source: "iana"
  },
  "audio/vnd.dolby.heaac.2": {
    source: "iana"
  },
  "audio/vnd.dolby.mlp": {
    source: "iana"
  },
  "audio/vnd.dolby.mps": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2x": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2z": {
    source: "iana"
  },
  "audio/vnd.dolby.pulse.1": {
    source: "iana"
  },
  "audio/vnd.dra": {
    source: "iana",
    extensions: [
      "dra"
    ]
  },
  "audio/vnd.dts": {
    source: "iana",
    extensions: [
      "dts"
    ]
  },
  "audio/vnd.dts.hd": {
    source: "iana",
    extensions: [
      "dtshd"
    ]
  },
  "audio/vnd.dts.uhd": {
    source: "iana"
  },
  "audio/vnd.dvb.file": {
    source: "iana"
  },
  "audio/vnd.everad.plj": {
    source: "iana"
  },
  "audio/vnd.hns.audio": {
    source: "iana"
  },
  "audio/vnd.lucent.voice": {
    source: "iana",
    extensions: [
      "lvp"
    ]
  },
  "audio/vnd.ms-playready.media.pya": {
    source: "iana",
    extensions: [
      "pya"
    ]
  },
  "audio/vnd.nokia.mobile-xmf": {
    source: "iana"
  },
  "audio/vnd.nortel.vbk": {
    source: "iana"
  },
  "audio/vnd.nuera.ecelp4800": {
    source: "iana",
    extensions: [
      "ecelp4800"
    ]
  },
  "audio/vnd.nuera.ecelp7470": {
    source: "iana",
    extensions: [
      "ecelp7470"
    ]
  },
  "audio/vnd.nuera.ecelp9600": {
    source: "iana",
    extensions: [
      "ecelp9600"
    ]
  },
  "audio/vnd.octel.sbc": {
    source: "iana"
  },
  "audio/vnd.presonus.multitrack": {
    source: "iana"
  },
  "audio/vnd.qcelp": {
    source: "iana"
  },
  "audio/vnd.rhetorex.32kadpcm": {
    source: "iana"
  },
  "audio/vnd.rip": {
    source: "iana",
    extensions: [
      "rip"
    ]
  },
  "audio/vnd.rn-realaudio": {
    compressible: false
  },
  "audio/vnd.sealedmedia.softseal.mpeg": {
    source: "iana"
  },
  "audio/vnd.vmx.cvsd": {
    source: "iana"
  },
  "audio/vnd.wave": {
    compressible: false
  },
  "audio/vorbis": {
    source: "iana",
    compressible: false
  },
  "audio/vorbis-config": {
    source: "iana"
  },
  "audio/wav": {
    compressible: false,
    extensions: [
      "wav"
    ]
  },
  "audio/wave": {
    compressible: false,
    extensions: [
      "wav"
    ]
  },
  "audio/webm": {
    source: "apache",
    compressible: false,
    extensions: [
      "weba"
    ]
  },
  "audio/x-aac": {
    source: "apache",
    compressible: false,
    extensions: [
      "aac"
    ]
  },
  "audio/x-aiff": {
    source: "apache",
    extensions: [
      "aif",
      "aiff",
      "aifc"
    ]
  },
  "audio/x-caf": {
    source: "apache",
    compressible: false,
    extensions: [
      "caf"
    ]
  },
  "audio/x-flac": {
    source: "apache",
    extensions: [
      "flac"
    ]
  },
  "audio/x-m4a": {
    source: "nginx",
    extensions: [
      "m4a"
    ]
  },
  "audio/x-matroska": {
    source: "apache",
    extensions: [
      "mka"
    ]
  },
  "audio/x-mpegurl": {
    source: "apache",
    extensions: [
      "m3u"
    ]
  },
  "audio/x-ms-wax": {
    source: "apache",
    extensions: [
      "wax"
    ]
  },
  "audio/x-ms-wma": {
    source: "apache",
    extensions: [
      "wma"
    ]
  },
  "audio/x-pn-realaudio": {
    source: "apache",
    extensions: [
      "ram",
      "ra"
    ]
  },
  "audio/x-pn-realaudio-plugin": {
    source: "apache",
    extensions: [
      "rmp"
    ]
  },
  "audio/x-realaudio": {
    source: "nginx",
    extensions: [
      "ra"
    ]
  },
  "audio/x-tta": {
    source: "apache"
  },
  "audio/x-wav": {
    source: "apache",
    extensions: [
      "wav"
    ]
  },
  "audio/xm": {
    source: "apache",
    extensions: [
      "xm"
    ]
  },
  "chemical/x-cdx": {
    source: "apache",
    extensions: [
      "cdx"
    ]
  },
  "chemical/x-cif": {
    source: "apache",
    extensions: [
      "cif"
    ]
  },
  "chemical/x-cmdf": {
    source: "apache",
    extensions: [
      "cmdf"
    ]
  },
  "chemical/x-cml": {
    source: "apache",
    extensions: [
      "cml"
    ]
  },
  "chemical/x-csml": {
    source: "apache",
    extensions: [
      "csml"
    ]
  },
  "chemical/x-pdb": {
    source: "apache"
  },
  "chemical/x-xyz": {
    source: "apache",
    extensions: [
      "xyz"
    ]
  },
  "font/collection": {
    source: "iana",
    extensions: [
      "ttc"
    ]
  },
  "font/otf": {
    source: "iana",
    compressible: true,
    extensions: [
      "otf"
    ]
  },
  "font/sfnt": {
    source: "iana"
  },
  "font/ttf": {
    source: "iana",
    compressible: true,
    extensions: [
      "ttf"
    ]
  },
  "font/woff": {
    source: "iana",
    extensions: [
      "woff"
    ]
  },
  "font/woff2": {
    source: "iana",
    extensions: [
      "woff2"
    ]
  },
  "image/aces": {
    source: "iana",
    extensions: [
      "exr"
    ]
  },
  "image/apng": {
    compressible: false,
    extensions: [
      "apng"
    ]
  },
  "image/avci": {
    source: "iana",
    extensions: [
      "avci"
    ]
  },
  "image/avcs": {
    source: "iana",
    extensions: [
      "avcs"
    ]
  },
  "image/avif": {
    source: "iana",
    compressible: false,
    extensions: [
      "avif"
    ]
  },
  "image/bmp": {
    source: "iana",
    compressible: true,
    extensions: [
      "bmp"
    ]
  },
  "image/cgm": {
    source: "iana",
    extensions: [
      "cgm"
    ]
  },
  "image/dicom-rle": {
    source: "iana",
    extensions: [
      "drle"
    ]
  },
  "image/emf": {
    source: "iana",
    extensions: [
      "emf"
    ]
  },
  "image/fits": {
    source: "iana",
    extensions: [
      "fits"
    ]
  },
  "image/g3fax": {
    source: "iana",
    extensions: [
      "g3"
    ]
  },
  "image/gif": {
    source: "iana",
    compressible: false,
    extensions: [
      "gif"
    ]
  },
  "image/heic": {
    source: "iana",
    extensions: [
      "heic"
    ]
  },
  "image/heic-sequence": {
    source: "iana",
    extensions: [
      "heics"
    ]
  },
  "image/heif": {
    source: "iana",
    extensions: [
      "heif"
    ]
  },
  "image/heif-sequence": {
    source: "iana",
    extensions: [
      "heifs"
    ]
  },
  "image/hej2k": {
    source: "iana",
    extensions: [
      "hej2"
    ]
  },
  "image/hsj2": {
    source: "iana",
    extensions: [
      "hsj2"
    ]
  },
  "image/ief": {
    source: "iana",
    extensions: [
      "ief"
    ]
  },
  "image/jls": {
    source: "iana",
    extensions: [
      "jls"
    ]
  },
  "image/jp2": {
    source: "iana",
    compressible: false,
    extensions: [
      "jp2",
      "jpg2"
    ]
  },
  "image/jpeg": {
    source: "iana",
    compressible: false,
    extensions: [
      "jpeg",
      "jpg",
      "jpe"
    ]
  },
  "image/jph": {
    source: "iana",
    extensions: [
      "jph"
    ]
  },
  "image/jphc": {
    source: "iana",
    extensions: [
      "jhc"
    ]
  },
  "image/jpm": {
    source: "iana",
    compressible: false,
    extensions: [
      "jpm"
    ]
  },
  "image/jpx": {
    source: "iana",
    compressible: false,
    extensions: [
      "jpx",
      "jpf"
    ]
  },
  "image/jxr": {
    source: "iana",
    extensions: [
      "jxr"
    ]
  },
  "image/jxra": {
    source: "iana",
    extensions: [
      "jxra"
    ]
  },
  "image/jxrs": {
    source: "iana",
    extensions: [
      "jxrs"
    ]
  },
  "image/jxs": {
    source: "iana",
    extensions: [
      "jxs"
    ]
  },
  "image/jxsc": {
    source: "iana",
    extensions: [
      "jxsc"
    ]
  },
  "image/jxsi": {
    source: "iana",
    extensions: [
      "jxsi"
    ]
  },
  "image/jxss": {
    source: "iana",
    extensions: [
      "jxss"
    ]
  },
  "image/ktx": {
    source: "iana",
    extensions: [
      "ktx"
    ]
  },
  "image/ktx2": {
    source: "iana",
    extensions: [
      "ktx2"
    ]
  },
  "image/naplps": {
    source: "iana"
  },
  "image/pjpeg": {
    compressible: false
  },
  "image/png": {
    source: "iana",
    compressible: false,
    extensions: [
      "png"
    ]
  },
  "image/prs.btif": {
    source: "iana",
    extensions: [
      "btif"
    ]
  },
  "image/prs.pti": {
    source: "iana",
    extensions: [
      "pti"
    ]
  },
  "image/pwg-raster": {
    source: "iana"
  },
  "image/sgi": {
    source: "apache",
    extensions: [
      "sgi"
    ]
  },
  "image/svg+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "svg",
      "svgz"
    ]
  },
  "image/t38": {
    source: "iana",
    extensions: [
      "t38"
    ]
  },
  "image/tiff": {
    source: "iana",
    compressible: false,
    extensions: [
      "tif",
      "tiff"
    ]
  },
  "image/tiff-fx": {
    source: "iana",
    extensions: [
      "tfx"
    ]
  },
  "image/vnd.adobe.photoshop": {
    source: "iana",
    compressible: true,
    extensions: [
      "psd"
    ]
  },
  "image/vnd.airzip.accelerator.azv": {
    source: "iana",
    extensions: [
      "azv"
    ]
  },
  "image/vnd.cns.inf2": {
    source: "iana"
  },
  "image/vnd.dece.graphic": {
    source: "iana",
    extensions: [
      "uvi",
      "uvvi",
      "uvg",
      "uvvg"
    ]
  },
  "image/vnd.djvu": {
    source: "iana",
    extensions: [
      "djvu",
      "djv"
    ]
  },
  "image/vnd.dvb.subtitle": {
    source: "iana",
    extensions: [
      "sub"
    ]
  },
  "image/vnd.dwg": {
    source: "iana",
    extensions: [
      "dwg"
    ]
  },
  "image/vnd.dxf": {
    source: "iana",
    extensions: [
      "dxf"
    ]
  },
  "image/vnd.fastbidsheet": {
    source: "iana",
    extensions: [
      "fbs"
    ]
  },
  "image/vnd.fpx": {
    source: "iana",
    extensions: [
      "fpx"
    ]
  },
  "image/vnd.fst": {
    source: "iana",
    extensions: [
      "fst"
    ]
  },
  "image/vnd.fujixerox.edmics-mmr": {
    source: "iana",
    extensions: [
      "mmr"
    ]
  },
  "image/vnd.fujixerox.edmics-rlc": {
    source: "iana",
    extensions: [
      "rlc"
    ]
  },
  "image/vnd.globalgraphics.pgb": {
    source: "iana"
  },
  "image/vnd.microsoft.icon": {
    source: "iana",
    compressible: true,
    extensions: [
      "ico"
    ]
  },
  "image/vnd.mix": {
    source: "iana"
  },
  "image/vnd.mozilla.apng": {
    source: "iana"
  },
  "image/vnd.ms-dds": {
    compressible: true,
    extensions: [
      "dds"
    ]
  },
  "image/vnd.ms-modi": {
    source: "iana",
    extensions: [
      "mdi"
    ]
  },
  "image/vnd.ms-photo": {
    source: "apache",
    extensions: [
      "wdp"
    ]
  },
  "image/vnd.net-fpx": {
    source: "iana",
    extensions: [
      "npx"
    ]
  },
  "image/vnd.pco.b16": {
    source: "iana",
    extensions: [
      "b16"
    ]
  },
  "image/vnd.radiance": {
    source: "iana"
  },
  "image/vnd.sealed.png": {
    source: "iana"
  },
  "image/vnd.sealedmedia.softseal.gif": {
    source: "iana"
  },
  "image/vnd.sealedmedia.softseal.jpg": {
    source: "iana"
  },
  "image/vnd.svf": {
    source: "iana"
  },
  "image/vnd.tencent.tap": {
    source: "iana",
    extensions: [
      "tap"
    ]
  },
  "image/vnd.valve.source.texture": {
    source: "iana",
    extensions: [
      "vtf"
    ]
  },
  "image/vnd.wap.wbmp": {
    source: "iana",
    extensions: [
      "wbmp"
    ]
  },
  "image/vnd.xiff": {
    source: "iana",
    extensions: [
      "xif"
    ]
  },
  "image/vnd.zbrush.pcx": {
    source: "iana",
    extensions: [
      "pcx"
    ]
  },
  "image/webp": {
    source: "apache",
    extensions: [
      "webp"
    ]
  },
  "image/wmf": {
    source: "iana",
    extensions: [
      "wmf"
    ]
  },
  "image/x-3ds": {
    source: "apache",
    extensions: [
      "3ds"
    ]
  },
  "image/x-cmu-raster": {
    source: "apache",
    extensions: [
      "ras"
    ]
  },
  "image/x-cmx": {
    source: "apache",
    extensions: [
      "cmx"
    ]
  },
  "image/x-freehand": {
    source: "apache",
    extensions: [
      "fh",
      "fhc",
      "fh4",
      "fh5",
      "fh7"
    ]
  },
  "image/x-icon": {
    source: "apache",
    compressible: true,
    extensions: [
      "ico"
    ]
  },
  "image/x-jng": {
    source: "nginx",
    extensions: [
      "jng"
    ]
  },
  "image/x-mrsid-image": {
    source: "apache",
    extensions: [
      "sid"
    ]
  },
  "image/x-ms-bmp": {
    source: "nginx",
    compressible: true,
    extensions: [
      "bmp"
    ]
  },
  "image/x-pcx": {
    source: "apache",
    extensions: [
      "pcx"
    ]
  },
  "image/x-pict": {
    source: "apache",
    extensions: [
      "pic",
      "pct"
    ]
  },
  "image/x-portable-anymap": {
    source: "apache",
    extensions: [
      "pnm"
    ]
  },
  "image/x-portable-bitmap": {
    source: "apache",
    extensions: [
      "pbm"
    ]
  },
  "image/x-portable-graymap": {
    source: "apache",
    extensions: [
      "pgm"
    ]
  },
  "image/x-portable-pixmap": {
    source: "apache",
    extensions: [
      "ppm"
    ]
  },
  "image/x-rgb": {
    source: "apache",
    extensions: [
      "rgb"
    ]
  },
  "image/x-tga": {
    source: "apache",
    extensions: [
      "tga"
    ]
  },
  "image/x-xbitmap": {
    source: "apache",
    extensions: [
      "xbm"
    ]
  },
  "image/x-xcf": {
    compressible: false
  },
  "image/x-xpixmap": {
    source: "apache",
    extensions: [
      "xpm"
    ]
  },
  "image/x-xwindowdump": {
    source: "apache",
    extensions: [
      "xwd"
    ]
  },
  "message/cpim": {
    source: "iana"
  },
  "message/delivery-status": {
    source: "iana"
  },
  "message/disposition-notification": {
    source: "iana",
    extensions: [
      "disposition-notification"
    ]
  },
  "message/external-body": {
    source: "iana"
  },
  "message/feedback-report": {
    source: "iana"
  },
  "message/global": {
    source: "iana",
    extensions: [
      "u8msg"
    ]
  },
  "message/global-delivery-status": {
    source: "iana",
    extensions: [
      "u8dsn"
    ]
  },
  "message/global-disposition-notification": {
    source: "iana",
    extensions: [
      "u8mdn"
    ]
  },
  "message/global-headers": {
    source: "iana",
    extensions: [
      "u8hdr"
    ]
  },
  "message/http": {
    source: "iana",
    compressible: false
  },
  "message/imdn+xml": {
    source: "iana",
    compressible: true
  },
  "message/news": {
    source: "iana"
  },
  "message/partial": {
    source: "iana",
    compressible: false
  },
  "message/rfc822": {
    source: "iana",
    compressible: true,
    extensions: [
      "eml",
      "mime"
    ]
  },
  "message/s-http": {
    source: "iana"
  },
  "message/sip": {
    source: "iana"
  },
  "message/sipfrag": {
    source: "iana"
  },
  "message/tracking-status": {
    source: "iana"
  },
  "message/vnd.si.simp": {
    source: "iana"
  },
  "message/vnd.wfa.wsc": {
    source: "iana",
    extensions: [
      "wsc"
    ]
  },
  "model/3mf": {
    source: "iana",
    extensions: [
      "3mf"
    ]
  },
  "model/e57": {
    source: "iana"
  },
  "model/gltf+json": {
    source: "iana",
    compressible: true,
    extensions: [
      "gltf"
    ]
  },
  "model/gltf-binary": {
    source: "iana",
    compressible: true,
    extensions: [
      "glb"
    ]
  },
  "model/iges": {
    source: "iana",
    compressible: false,
    extensions: [
      "igs",
      "iges"
    ]
  },
  "model/mesh": {
    source: "iana",
    compressible: false,
    extensions: [
      "msh",
      "mesh",
      "silo"
    ]
  },
  "model/mtl": {
    source: "iana",
    extensions: [
      "mtl"
    ]
  },
  "model/obj": {
    source: "iana",
    extensions: [
      "obj"
    ]
  },
  "model/step": {
    source: "iana"
  },
  "model/step+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "stpx"
    ]
  },
  "model/step+zip": {
    source: "iana",
    compressible: false,
    extensions: [
      "stpz"
    ]
  },
  "model/step-xml+zip": {
    source: "iana",
    compressible: false,
    extensions: [
      "stpxz"
    ]
  },
  "model/stl": {
    source: "iana",
    extensions: [
      "stl"
    ]
  },
  "model/vnd.collada+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "dae"
    ]
  },
  "model/vnd.dwf": {
    source: "iana",
    extensions: [
      "dwf"
    ]
  },
  "model/vnd.flatland.3dml": {
    source: "iana"
  },
  "model/vnd.gdl": {
    source: "iana",
    extensions: [
      "gdl"
    ]
  },
  "model/vnd.gs-gdl": {
    source: "apache"
  },
  "model/vnd.gs.gdl": {
    source: "iana"
  },
  "model/vnd.gtw": {
    source: "iana",
    extensions: [
      "gtw"
    ]
  },
  "model/vnd.moml+xml": {
    source: "iana",
    compressible: true
  },
  "model/vnd.mts": {
    source: "iana",
    extensions: [
      "mts"
    ]
  },
  "model/vnd.opengex": {
    source: "iana",
    extensions: [
      "ogex"
    ]
  },
  "model/vnd.parasolid.transmit.binary": {
    source: "iana",
    extensions: [
      "x_b"
    ]
  },
  "model/vnd.parasolid.transmit.text": {
    source: "iana",
    extensions: [
      "x_t"
    ]
  },
  "model/vnd.pytha.pyox": {
    source: "iana"
  },
  "model/vnd.rosette.annotated-data-model": {
    source: "iana"
  },
  "model/vnd.sap.vds": {
    source: "iana",
    extensions: [
      "vds"
    ]
  },
  "model/vnd.usdz+zip": {
    source: "iana",
    compressible: false,
    extensions: [
      "usdz"
    ]
  },
  "model/vnd.valve.source.compiled-map": {
    source: "iana",
    extensions: [
      "bsp"
    ]
  },
  "model/vnd.vtu": {
    source: "iana",
    extensions: [
      "vtu"
    ]
  },
  "model/vrml": {
    source: "iana",
    compressible: false,
    extensions: [
      "wrl",
      "vrml"
    ]
  },
  "model/x3d+binary": {
    source: "apache",
    compressible: false,
    extensions: [
      "x3db",
      "x3dbz"
    ]
  },
  "model/x3d+fastinfoset": {
    source: "iana",
    extensions: [
      "x3db"
    ]
  },
  "model/x3d+vrml": {
    source: "apache",
    compressible: false,
    extensions: [
      "x3dv",
      "x3dvz"
    ]
  },
  "model/x3d+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "x3d",
      "x3dz"
    ]
  },
  "model/x3d-vrml": {
    source: "iana",
    extensions: [
      "x3dv"
    ]
  },
  "multipart/alternative": {
    source: "iana",
    compressible: false
  },
  "multipart/appledouble": {
    source: "iana"
  },
  "multipart/byteranges": {
    source: "iana"
  },
  "multipart/digest": {
    source: "iana"
  },
  "multipart/encrypted": {
    source: "iana",
    compressible: false
  },
  "multipart/form-data": {
    source: "iana",
    compressible: false
  },
  "multipart/header-set": {
    source: "iana"
  },
  "multipart/mixed": {
    source: "iana"
  },
  "multipart/multilingual": {
    source: "iana"
  },
  "multipart/parallel": {
    source: "iana"
  },
  "multipart/related": {
    source: "iana",
    compressible: false
  },
  "multipart/report": {
    source: "iana"
  },
  "multipart/signed": {
    source: "iana",
    compressible: false
  },
  "multipart/vnd.bint.med-plus": {
    source: "iana"
  },
  "multipart/voice-message": {
    source: "iana"
  },
  "multipart/x-mixed-replace": {
    source: "iana"
  },
  "text/1d-interleaved-parityfec": {
    source: "iana"
  },
  "text/cache-manifest": {
    source: "iana",
    compressible: true,
    extensions: [
      "appcache",
      "manifest"
    ]
  },
  "text/calendar": {
    source: "iana",
    extensions: [
      "ics",
      "ifb"
    ]
  },
  "text/calender": {
    compressible: true
  },
  "text/cmd": {
    compressible: true
  },
  "text/coffeescript": {
    extensions: [
      "coffee",
      "litcoffee"
    ]
  },
  "text/cql": {
    source: "iana"
  },
  "text/cql-expression": {
    source: "iana"
  },
  "text/cql-identifier": {
    source: "iana"
  },
  "text/css": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "css"
    ]
  },
  "text/csv": {
    source: "iana",
    compressible: true,
    extensions: [
      "csv"
    ]
  },
  "text/csv-schema": {
    source: "iana"
  },
  "text/directory": {
    source: "iana"
  },
  "text/dns": {
    source: "iana"
  },
  "text/ecmascript": {
    source: "iana"
  },
  "text/encaprtp": {
    source: "iana"
  },
  "text/enriched": {
    source: "iana"
  },
  "text/fhirpath": {
    source: "iana"
  },
  "text/flexfec": {
    source: "iana"
  },
  "text/fwdred": {
    source: "iana"
  },
  "text/gff3": {
    source: "iana"
  },
  "text/grammar-ref-list": {
    source: "iana"
  },
  "text/html": {
    source: "iana",
    compressible: true,
    extensions: [
      "html",
      "htm",
      "shtml"
    ]
  },
  "text/jade": {
    extensions: [
      "jade"
    ]
  },
  "text/javascript": {
    source: "iana",
    compressible: true
  },
  "text/jcr-cnd": {
    source: "iana"
  },
  "text/jsx": {
    compressible: true,
    extensions: [
      "jsx"
    ]
  },
  "text/less": {
    compressible: true,
    extensions: [
      "less"
    ]
  },
  "text/markdown": {
    source: "iana",
    compressible: true,
    extensions: [
      "markdown",
      "md"
    ]
  },
  "text/mathml": {
    source: "nginx",
    extensions: [
      "mml"
    ]
  },
  "text/mdx": {
    compressible: true,
    extensions: [
      "mdx"
    ]
  },
  "text/mizar": {
    source: "iana"
  },
  "text/n3": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "n3"
    ]
  },
  "text/parameters": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/parityfec": {
    source: "iana"
  },
  "text/plain": {
    source: "iana",
    compressible: true,
    extensions: [
      "txt",
      "text",
      "conf",
      "def",
      "list",
      "log",
      "in",
      "ini"
    ]
  },
  "text/provenance-notation": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/prs.fallenstein.rst": {
    source: "iana"
  },
  "text/prs.lines.tag": {
    source: "iana",
    extensions: [
      "dsc"
    ]
  },
  "text/prs.prop.logic": {
    source: "iana"
  },
  "text/raptorfec": {
    source: "iana"
  },
  "text/red": {
    source: "iana"
  },
  "text/rfc822-headers": {
    source: "iana"
  },
  "text/richtext": {
    source: "iana",
    compressible: true,
    extensions: [
      "rtx"
    ]
  },
  "text/rtf": {
    source: "iana",
    compressible: true,
    extensions: [
      "rtf"
    ]
  },
  "text/rtp-enc-aescm128": {
    source: "iana"
  },
  "text/rtploopback": {
    source: "iana"
  },
  "text/rtx": {
    source: "iana"
  },
  "text/sgml": {
    source: "iana",
    extensions: [
      "sgml",
      "sgm"
    ]
  },
  "text/shaclc": {
    source: "iana"
  },
  "text/shex": {
    source: "iana",
    extensions: [
      "shex"
    ]
  },
  "text/slim": {
    extensions: [
      "slim",
      "slm"
    ]
  },
  "text/spdx": {
    source: "iana",
    extensions: [
      "spdx"
    ]
  },
  "text/strings": {
    source: "iana"
  },
  "text/stylus": {
    extensions: [
      "stylus",
      "styl"
    ]
  },
  "text/t140": {
    source: "iana"
  },
  "text/tab-separated-values": {
    source: "iana",
    compressible: true,
    extensions: [
      "tsv"
    ]
  },
  "text/troff": {
    source: "iana",
    extensions: [
      "t",
      "tr",
      "roff",
      "man",
      "me",
      "ms"
    ]
  },
  "text/turtle": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "ttl"
    ]
  },
  "text/ulpfec": {
    source: "iana"
  },
  "text/uri-list": {
    source: "iana",
    compressible: true,
    extensions: [
      "uri",
      "uris",
      "urls"
    ]
  },
  "text/vcard": {
    source: "iana",
    compressible: true,
    extensions: [
      "vcard"
    ]
  },
  "text/vnd.a": {
    source: "iana"
  },
  "text/vnd.abc": {
    source: "iana"
  },
  "text/vnd.ascii-art": {
    source: "iana"
  },
  "text/vnd.curl": {
    source: "iana",
    extensions: [
      "curl"
    ]
  },
  "text/vnd.curl.dcurl": {
    source: "apache",
    extensions: [
      "dcurl"
    ]
  },
  "text/vnd.curl.mcurl": {
    source: "apache",
    extensions: [
      "mcurl"
    ]
  },
  "text/vnd.curl.scurl": {
    source: "apache",
    extensions: [
      "scurl"
    ]
  },
  "text/vnd.debian.copyright": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.dmclientscript": {
    source: "iana"
  },
  "text/vnd.dvb.subtitle": {
    source: "iana",
    extensions: [
      "sub"
    ]
  },
  "text/vnd.esmertec.theme-descriptor": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.familysearch.gedcom": {
    source: "iana",
    extensions: [
      "ged"
    ]
  },
  "text/vnd.ficlab.flt": {
    source: "iana"
  },
  "text/vnd.fly": {
    source: "iana",
    extensions: [
      "fly"
    ]
  },
  "text/vnd.fmi.flexstor": {
    source: "iana",
    extensions: [
      "flx"
    ]
  },
  "text/vnd.gml": {
    source: "iana"
  },
  "text/vnd.graphviz": {
    source: "iana",
    extensions: [
      "gv"
    ]
  },
  "text/vnd.hans": {
    source: "iana"
  },
  "text/vnd.hgl": {
    source: "iana"
  },
  "text/vnd.in3d.3dml": {
    source: "iana",
    extensions: [
      "3dml"
    ]
  },
  "text/vnd.in3d.spot": {
    source: "iana",
    extensions: [
      "spot"
    ]
  },
  "text/vnd.iptc.newsml": {
    source: "iana"
  },
  "text/vnd.iptc.nitf": {
    source: "iana"
  },
  "text/vnd.latex-z": {
    source: "iana"
  },
  "text/vnd.motorola.reflex": {
    source: "iana"
  },
  "text/vnd.ms-mediapackage": {
    source: "iana"
  },
  "text/vnd.net2phone.commcenter.command": {
    source: "iana"
  },
  "text/vnd.radisys.msml-basic-layout": {
    source: "iana"
  },
  "text/vnd.senx.warpscript": {
    source: "iana"
  },
  "text/vnd.si.uricatalogue": {
    source: "iana"
  },
  "text/vnd.sosi": {
    source: "iana"
  },
  "text/vnd.sun.j2me.app-descriptor": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "jad"
    ]
  },
  "text/vnd.trolltech.linguist": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.wap.si": {
    source: "iana"
  },
  "text/vnd.wap.sl": {
    source: "iana"
  },
  "text/vnd.wap.wml": {
    source: "iana",
    extensions: [
      "wml"
    ]
  },
  "text/vnd.wap.wmlscript": {
    source: "iana",
    extensions: [
      "wmls"
    ]
  },
  "text/vtt": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "vtt"
    ]
  },
  "text/x-asm": {
    source: "apache",
    extensions: [
      "s",
      "asm"
    ]
  },
  "text/x-c": {
    source: "apache",
    extensions: [
      "c",
      "cc",
      "cxx",
      "cpp",
      "h",
      "hh",
      "dic"
    ]
  },
  "text/x-component": {
    source: "nginx",
    extensions: [
      "htc"
    ]
  },
  "text/x-fortran": {
    source: "apache",
    extensions: [
      "f",
      "for",
      "f77",
      "f90"
    ]
  },
  "text/x-gwt-rpc": {
    compressible: true
  },
  "text/x-handlebars-template": {
    extensions: [
      "hbs"
    ]
  },
  "text/x-java-source": {
    source: "apache",
    extensions: [
      "java"
    ]
  },
  "text/x-jquery-tmpl": {
    compressible: true
  },
  "text/x-lua": {
    extensions: [
      "lua"
    ]
  },
  "text/x-markdown": {
    compressible: true,
    extensions: [
      "mkd"
    ]
  },
  "text/x-nfo": {
    source: "apache",
    extensions: [
      "nfo"
    ]
  },
  "text/x-opml": {
    source: "apache",
    extensions: [
      "opml"
    ]
  },
  "text/x-org": {
    compressible: true,
    extensions: [
      "org"
    ]
  },
  "text/x-pascal": {
    source: "apache",
    extensions: [
      "p",
      "pas"
    ]
  },
  "text/x-processing": {
    compressible: true,
    extensions: [
      "pde"
    ]
  },
  "text/x-sass": {
    extensions: [
      "sass"
    ]
  },
  "text/x-scss": {
    extensions: [
      "scss"
    ]
  },
  "text/x-setext": {
    source: "apache",
    extensions: [
      "etx"
    ]
  },
  "text/x-sfv": {
    source: "apache",
    extensions: [
      "sfv"
    ]
  },
  "text/x-suse-ymp": {
    compressible: true,
    extensions: [
      "ymp"
    ]
  },
  "text/x-uuencode": {
    source: "apache",
    extensions: [
      "uu"
    ]
  },
  "text/x-vcalendar": {
    source: "apache",
    extensions: [
      "vcs"
    ]
  },
  "text/x-vcard": {
    source: "apache",
    extensions: [
      "vcf"
    ]
  },
  "text/xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xml"
    ]
  },
  "text/xml-external-parsed-entity": {
    source: "iana"
  },
  "text/yaml": {
    compressible: true,
    extensions: [
      "yaml",
      "yml"
    ]
  },
  "video/1d-interleaved-parityfec": {
    source: "iana"
  },
  "video/3gpp": {
    source: "iana",
    extensions: [
      "3gp",
      "3gpp"
    ]
  },
  "video/3gpp-tt": {
    source: "iana"
  },
  "video/3gpp2": {
    source: "iana",
    extensions: [
      "3g2"
    ]
  },
  "video/av1": {
    source: "iana"
  },
  "video/bmpeg": {
    source: "iana"
  },
  "video/bt656": {
    source: "iana"
  },
  "video/celb": {
    source: "iana"
  },
  "video/dv": {
    source: "iana"
  },
  "video/encaprtp": {
    source: "iana"
  },
  "video/ffv1": {
    source: "iana"
  },
  "video/flexfec": {
    source: "iana"
  },
  "video/h261": {
    source: "iana",
    extensions: [
      "h261"
    ]
  },
  "video/h263": {
    source: "iana",
    extensions: [
      "h263"
    ]
  },
  "video/h263-1998": {
    source: "iana"
  },
  "video/h263-2000": {
    source: "iana"
  },
  "video/h264": {
    source: "iana",
    extensions: [
      "h264"
    ]
  },
  "video/h264-rcdo": {
    source: "iana"
  },
  "video/h264-svc": {
    source: "iana"
  },
  "video/h265": {
    source: "iana"
  },
  "video/iso.segment": {
    source: "iana",
    extensions: [
      "m4s"
    ]
  },
  "video/jpeg": {
    source: "iana",
    extensions: [
      "jpgv"
    ]
  },
  "video/jpeg2000": {
    source: "iana"
  },
  "video/jpm": {
    source: "apache",
    extensions: [
      "jpm",
      "jpgm"
    ]
  },
  "video/jxsv": {
    source: "iana"
  },
  "video/mj2": {
    source: "iana",
    extensions: [
      "mj2",
      "mjp2"
    ]
  },
  "video/mp1s": {
    source: "iana"
  },
  "video/mp2p": {
    source: "iana"
  },
  "video/mp2t": {
    source: "iana",
    extensions: [
      "ts"
    ]
  },
  "video/mp4": {
    source: "iana",
    compressible: false,
    extensions: [
      "mp4",
      "mp4v",
      "mpg4"
    ]
  },
  "video/mp4v-es": {
    source: "iana"
  },
  "video/mpeg": {
    source: "iana",
    compressible: false,
    extensions: [
      "mpeg",
      "mpg",
      "mpe",
      "m1v",
      "m2v"
    ]
  },
  "video/mpeg4-generic": {
    source: "iana"
  },
  "video/mpv": {
    source: "iana"
  },
  "video/nv": {
    source: "iana"
  },
  "video/ogg": {
    source: "iana",
    compressible: false,
    extensions: [
      "ogv"
    ]
  },
  "video/parityfec": {
    source: "iana"
  },
  "video/pointer": {
    source: "iana"
  },
  "video/quicktime": {
    source: "iana",
    compressible: false,
    extensions: [
      "qt",
      "mov"
    ]
  },
  "video/raptorfec": {
    source: "iana"
  },
  "video/raw": {
    source: "iana"
  },
  "video/rtp-enc-aescm128": {
    source: "iana"
  },
  "video/rtploopback": {
    source: "iana"
  },
  "video/rtx": {
    source: "iana"
  },
  "video/scip": {
    source: "iana"
  },
  "video/smpte291": {
    source: "iana"
  },
  "video/smpte292m": {
    source: "iana"
  },
  "video/ulpfec": {
    source: "iana"
  },
  "video/vc1": {
    source: "iana"
  },
  "video/vc2": {
    source: "iana"
  },
  "video/vnd.cctv": {
    source: "iana"
  },
  "video/vnd.dece.hd": {
    source: "iana",
    extensions: [
      "uvh",
      "uvvh"
    ]
  },
  "video/vnd.dece.mobile": {
    source: "iana",
    extensions: [
      "uvm",
      "uvvm"
    ]
  },
  "video/vnd.dece.mp4": {
    source: "iana"
  },
  "video/vnd.dece.pd": {
    source: "iana",
    extensions: [
      "uvp",
      "uvvp"
    ]
  },
  "video/vnd.dece.sd": {
    source: "iana",
    extensions: [
      "uvs",
      "uvvs"
    ]
  },
  "video/vnd.dece.video": {
    source: "iana",
    extensions: [
      "uvv",
      "uvvv"
    ]
  },
  "video/vnd.directv.mpeg": {
    source: "iana"
  },
  "video/vnd.directv.mpeg-tts": {
    source: "iana"
  },
  "video/vnd.dlna.mpeg-tts": {
    source: "iana"
  },
  "video/vnd.dvb.file": {
    source: "iana",
    extensions: [
      "dvb"
    ]
  },
  "video/vnd.fvt": {
    source: "iana",
    extensions: [
      "fvt"
    ]
  },
  "video/vnd.hns.video": {
    source: "iana"
  },
  "video/vnd.iptvforum.1dparityfec-1010": {
    source: "iana"
  },
  "video/vnd.iptvforum.1dparityfec-2005": {
    source: "iana"
  },
  "video/vnd.iptvforum.2dparityfec-1010": {
    source: "iana"
  },
  "video/vnd.iptvforum.2dparityfec-2005": {
    source: "iana"
  },
  "video/vnd.iptvforum.ttsavc": {
    source: "iana"
  },
  "video/vnd.iptvforum.ttsmpeg2": {
    source: "iana"
  },
  "video/vnd.motorola.video": {
    source: "iana"
  },
  "video/vnd.motorola.videop": {
    source: "iana"
  },
  "video/vnd.mpegurl": {
    source: "iana",
    extensions: [
      "mxu",
      "m4u"
    ]
  },
  "video/vnd.ms-playready.media.pyv": {
    source: "iana",
    extensions: [
      "pyv"
    ]
  },
  "video/vnd.nokia.interleaved-multimedia": {
    source: "iana"
  },
  "video/vnd.nokia.mp4vr": {
    source: "iana"
  },
  "video/vnd.nokia.videovoip": {
    source: "iana"
  },
  "video/vnd.objectvideo": {
    source: "iana"
  },
  "video/vnd.radgamettools.bink": {
    source: "iana"
  },
  "video/vnd.radgamettools.smacker": {
    source: "iana"
  },
  "video/vnd.sealed.mpeg1": {
    source: "iana"
  },
  "video/vnd.sealed.mpeg4": {
    source: "iana"
  },
  "video/vnd.sealed.swf": {
    source: "iana"
  },
  "video/vnd.sealedmedia.softseal.mov": {
    source: "iana"
  },
  "video/vnd.uvvu.mp4": {
    source: "iana",
    extensions: [
      "uvu",
      "uvvu"
    ]
  },
  "video/vnd.vivo": {
    source: "iana",
    extensions: [
      "viv"
    ]
  },
  "video/vnd.youtube.yt": {
    source: "iana"
  },
  "video/vp8": {
    source: "iana"
  },
  "video/vp9": {
    source: "iana"
  },
  "video/webm": {
    source: "apache",
    compressible: false,
    extensions: [
      "webm"
    ]
  },
  "video/x-f4v": {
    source: "apache",
    extensions: [
      "f4v"
    ]
  },
  "video/x-fli": {
    source: "apache",
    extensions: [
      "fli"
    ]
  },
  "video/x-flv": {
    source: "apache",
    compressible: false,
    extensions: [
      "flv"
    ]
  },
  "video/x-m4v": {
    source: "apache",
    extensions: [
      "m4v"
    ]
  },
  "video/x-matroska": {
    source: "apache",
    compressible: false,
    extensions: [
      "mkv",
      "mk3d",
      "mks"
    ]
  },
  "video/x-mng": {
    source: "apache",
    extensions: [
      "mng"
    ]
  },
  "video/x-ms-asf": {
    source: "apache",
    extensions: [
      "asf",
      "asx"
    ]
  },
  "video/x-ms-vob": {
    source: "apache",
    extensions: [
      "vob"
    ]
  },
  "video/x-ms-wm": {
    source: "apache",
    extensions: [
      "wm"
    ]
  },
  "video/x-ms-wmv": {
    source: "apache",
    compressible: false,
    extensions: [
      "wmv"
    ]
  },
  "video/x-ms-wmx": {
    source: "apache",
    extensions: [
      "wmx"
    ]
  },
  "video/x-ms-wvx": {
    source: "apache",
    extensions: [
      "wvx"
    ]
  },
  "video/x-msvideo": {
    source: "apache",
    extensions: [
      "avi"
    ]
  },
  "video/x-sgi-movie": {
    source: "apache",
    extensions: [
      "movie"
    ]
  },
  "video/x-smv": {
    source: "apache",
    extensions: [
      "smv"
    ]
  },
  "x-conference/x-cooltalk": {
    source: "apache",
    extensions: [
      "ice"
    ]
  },
  "x-shader/x-fragment": {
    compressible: true
  },
  "x-shader/x-vertex": {
    compressible: true
  }
};
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */
var mimeDb = require$$0;
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
(function(exports2) {
  var db = mimeDb;
  var extname = require$$1$1.extname;
  var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
  var TEXT_TYPE_REGEXP = /^text\//i;
  exports2.charset = charset;
  exports2.charsets = { lookup: charset };
  exports2.contentType = contentType;
  exports2.extension = extension;
  exports2.extensions = /* @__PURE__ */ Object.create(null);
  exports2.lookup = lookup;
  exports2.types = /* @__PURE__ */ Object.create(null);
  populateMaps(exports2.extensions, exports2.types);
  function charset(type2) {
    if (!type2 || typeof type2 !== "string") {
      return false;
    }
    var match = EXTRACT_TYPE_REGEXP.exec(type2);
    var mime2 = match && db[match[1].toLowerCase()];
    if (mime2 && mime2.charset) {
      return mime2.charset;
    }
    if (match && TEXT_TYPE_REGEXP.test(match[1])) {
      return "UTF-8";
    }
    return false;
  }
  function contentType(str2) {
    if (!str2 || typeof str2 !== "string") {
      return false;
    }
    var mime2 = str2.indexOf("/") === -1 ? exports2.lookup(str2) : str2;
    if (!mime2) {
      return false;
    }
    if (mime2.indexOf("charset") === -1) {
      var charset2 = exports2.charset(mime2);
      if (charset2) mime2 += "; charset=" + charset2.toLowerCase();
    }
    return mime2;
  }
  function extension(type2) {
    if (!type2 || typeof type2 !== "string") {
      return false;
    }
    var match = EXTRACT_TYPE_REGEXP.exec(type2);
    var exts = match && exports2.extensions[match[1].toLowerCase()];
    if (!exts || !exts.length) {
      return false;
    }
    return exts[0];
  }
  function lookup(path2) {
    if (!path2 || typeof path2 !== "string") {
      return false;
    }
    var extension2 = extname("x." + path2).toLowerCase().substr(1);
    if (!extension2) {
      return false;
    }
    return exports2.types[extension2] || false;
  }
  function populateMaps(extensions, types) {
    var preference = ["nginx", "apache", void 0, "iana"];
    Object.keys(db).forEach(function forEachMimeType(type2) {
      var mime2 = db[type2];
      var exts = mime2.extensions;
      if (!exts || !exts.length) {
        return;
      }
      extensions[type2] = exts;
      for (var i = 0; i < exts.length; i++) {
        var extension2 = exts[i];
        if (types[extension2]) {
          var from = preference.indexOf(db[types[extension2]].source);
          var to = preference.indexOf(mime2.source);
          if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/")) {
            continue;
          }
        }
        types[extension2] = type2;
      }
    });
  }
})(mimeTypes);
var defer_1 = defer$1;
function defer$1(fn) {
  var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
  if (nextTick) {
    nextTick(fn);
  } else {
    setTimeout(fn, 0);
  }
}
var defer = defer_1;
var async_1 = async$2;
function async$2(callback) {
  var isAsync = false;
  defer(function() {
    isAsync = true;
  });
  return function async_callback(err, result) {
    if (isAsync) {
      callback(err, result);
    } else {
      defer(function nextTick_callback() {
        callback(err, result);
      });
    }
  };
}
var abort_1 = abort$2;
function abort$2(state2) {
  Object.keys(state2.jobs).forEach(clean$2.bind(state2));
  state2.jobs = {};
}
function clean$2(key) {
  if (typeof this.jobs[key] == "function") {
    this.jobs[key]();
  }
}
var async$1 = async_1, abort$1 = abort_1;
var iterate_1 = iterate$2;
function iterate$2(list, iterator, state2, callback) {
  var key = state2["keyedList"] ? state2["keyedList"][state2.index] : state2.index;
  state2.jobs[key] = runJob(iterator, key, list[key], function(error2, output) {
    if (!(key in state2.jobs)) {
      return;
    }
    delete state2.jobs[key];
    if (error2) {
      abort$1(state2);
    } else {
      state2.results[key] = output;
    }
    callback(error2, state2.results);
  });
}
function runJob(iterator, key, item, callback) {
  var aborter;
  if (iterator.length == 2) {
    aborter = iterator(item, async$1(callback));
  } else {
    aborter = iterator(item, key, async$1(callback));
  }
  return aborter;
}
var state_1 = state$1;
function state$1(list, sortMethod) {
  var isNamedList = !Array.isArray(list), initState2 = {
    index: 0,
    keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
    jobs: {},
    results: isNamedList ? {} : [],
    size: isNamedList ? Object.keys(list).length : list.length
  };
  if (sortMethod) {
    initState2.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
      return sortMethod(list[a], list[b]);
    });
  }
  return initState2;
}
var abort = abort_1, async = async_1;
var terminator_1 = terminator$2;
function terminator$2(callback) {
  if (!Object.keys(this.jobs).length) {
    return;
  }
  this.index = this.size;
  abort(this);
  async(callback)(null, this.results);
}
var iterate$1 = iterate_1, initState$1 = state_1, terminator$1 = terminator_1;
var parallel_1 = parallel;
function parallel(list, iterator, callback) {
  var state2 = initState$1(list);
  while (state2.index < (state2["keyedList"] || list).length) {
    iterate$1(list, iterator, state2, function(error2, result) {
      if (error2) {
        callback(error2, result);
        return;
      }
      if (Object.keys(state2.jobs).length === 0) {
        callback(null, state2.results);
        return;
      }
    });
    state2.index++;
  }
  return terminator$1.bind(state2, callback);
}
var serialOrdered$2 = { exports: {} };
var iterate = iterate_1, initState = state_1, terminator = terminator_1;
serialOrdered$2.exports = serialOrdered$1;
serialOrdered$2.exports.ascending = ascending;
serialOrdered$2.exports.descending = descending;
function serialOrdered$1(list, iterator, sortMethod, callback) {
  var state2 = initState(list, sortMethod);
  iterate(list, iterator, state2, function iteratorHandler(error2, result) {
    if (error2) {
      callback(error2, result);
      return;
    }
    state2.index++;
    if (state2.index < (state2["keyedList"] || list).length) {
      iterate(list, iterator, state2, iteratorHandler);
      return;
    }
    callback(null, state2.results);
  });
  return terminator.bind(state2, callback);
}
function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
function descending(a, b) {
  return -1 * ascending(a, b);
}
var serialOrderedExports = serialOrdered$2.exports;
var serialOrdered = serialOrderedExports;
var serial_1 = serial;
function serial(list, iterator, callback) {
  return serialOrdered(list, iterator, null, callback);
}
var asynckit$1 = {
  parallel: parallel_1,
  serial: serial_1,
  serialOrdered: serialOrderedExports
};
var esObjectAtoms = Object;
var esErrors = Error;
var _eval = EvalError;
var range$1 = RangeError;
var ref = ReferenceError;
var syntax = SyntaxError;
var type$1 = TypeError;
var uri = URIError;
var abs$1 = Math.abs;
var floor$1 = Math.floor;
var max$1 = Math.max;
var min$1 = Math.min;
var pow$1 = Math.pow;
var round$1 = Math.round;
var _isNaN = Number.isNaN || function isNaN2(a) {
  return a !== a;
};
var $isNaN = _isNaN;
var sign$1 = function sign(number) {
  if ($isNaN(number) || number === 0) {
    return number;
  }
  return number < 0 ? -1 : 1;
};
var gOPD = Object.getOwnPropertyDescriptor;
var $gOPD$1 = gOPD;
if ($gOPD$1) {
  try {
    $gOPD$1([], "length");
  } catch (e) {
    $gOPD$1 = null;
  }
}
var gopd = $gOPD$1;
var $defineProperty$2 = Object.defineProperty || false;
if ($defineProperty$2) {
  try {
    $defineProperty$2({}, "a", { value: 1 });
  } catch (e) {
    $defineProperty$2 = false;
  }
}
var esDefineProperty = $defineProperty$2;
var shams$1;
var hasRequiredShams$1;
function requireShams$1() {
  if (hasRequiredShams$1) return shams$1;
  hasRequiredShams$1 = 1;
  shams$1 = function hasSymbols2() {
    if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
      return false;
    }
    if (typeof Symbol.iterator === "symbol") {
      return true;
    }
    var obj = {};
    var sym = Symbol("test");
    var symObj = Object(sym);
    if (typeof sym === "string") {
      return false;
    }
    if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
      return false;
    }
    if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
      return false;
    }
    var symVal = 42;
    obj[sym] = symVal;
    for (var _ in obj) {
      return false;
    }
    if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
      return false;
    }
    if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
      return false;
    }
    var syms = Object.getOwnPropertySymbols(obj);
    if (syms.length !== 1 || syms[0] !== sym) {
      return false;
    }
    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
      return false;
    }
    if (typeof Object.getOwnPropertyDescriptor === "function") {
      var descriptor = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(obj, sym)
      );
      if (descriptor.value !== symVal || descriptor.enumerable !== true) {
        return false;
      }
    }
    return true;
  };
  return shams$1;
}
var hasSymbols$1;
var hasRequiredHasSymbols;
function requireHasSymbols() {
  if (hasRequiredHasSymbols) return hasSymbols$1;
  hasRequiredHasSymbols = 1;
  var origSymbol = typeof Symbol !== "undefined" && Symbol;
  var hasSymbolSham = requireShams$1();
  hasSymbols$1 = function hasNativeSymbols() {
    if (typeof origSymbol !== "function") {
      return false;
    }
    if (typeof Symbol !== "function") {
      return false;
    }
    if (typeof origSymbol("foo") !== "symbol") {
      return false;
    }
    if (typeof Symbol("bar") !== "symbol") {
      return false;
    }
    return hasSymbolSham();
  };
  return hasSymbols$1;
}
var Reflect_getPrototypeOf;
var hasRequiredReflect_getPrototypeOf;
function requireReflect_getPrototypeOf() {
  if (hasRequiredReflect_getPrototypeOf) return Reflect_getPrototypeOf;
  hasRequiredReflect_getPrototypeOf = 1;
  Reflect_getPrototypeOf = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  return Reflect_getPrototypeOf;
}
var Object_getPrototypeOf;
var hasRequiredObject_getPrototypeOf;
function requireObject_getPrototypeOf() {
  if (hasRequiredObject_getPrototypeOf) return Object_getPrototypeOf;
  hasRequiredObject_getPrototypeOf = 1;
  var $Object2 = esObjectAtoms;
  Object_getPrototypeOf = $Object2.getPrototypeOf || null;
  return Object_getPrototypeOf;
}
var implementation;
var hasRequiredImplementation;
function requireImplementation() {
  if (hasRequiredImplementation) return implementation;
  hasRequiredImplementation = 1;
  var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
  var toStr = Object.prototype.toString;
  var max2 = Math.max;
  var funcType = "[object Function]";
  var concatty = function concatty2(a, b) {
    var arr = [];
    for (var i = 0; i < a.length; i += 1) {
      arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
      arr[j + a.length] = b[j];
    }
    return arr;
  };
  var slicy = function slicy2(arrLike, offset) {
    var arr = [];
    for (var i = offset, j = 0; i < arrLike.length; i += 1, j += 1) {
      arr[j] = arrLike[i];
    }
    return arr;
  };
  var joiny = function(arr, joiner) {
    var str2 = "";
    for (var i = 0; i < arr.length; i += 1) {
      str2 += arr[i];
      if (i + 1 < arr.length) {
        str2 += joiner;
      }
    }
    return str2;
  };
  implementation = function bind2(that) {
    var target = this;
    if (typeof target !== "function" || toStr.apply(target) !== funcType) {
      throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);
    var bound;
    var binder = function() {
      if (this instanceof bound) {
        var result = target.apply(
          this,
          concatty(args, arguments)
        );
        if (Object(result) === result) {
          return result;
        }
        return this;
      }
      return target.apply(
        that,
        concatty(args, arguments)
      );
    };
    var boundLength = max2(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
      boundArgs[i] = "$" + i;
    }
    bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
    if (target.prototype) {
      var Empty = function Empty2() {
      };
      Empty.prototype = target.prototype;
      bound.prototype = new Empty();
      Empty.prototype = null;
    }
    return bound;
  };
  return implementation;
}
var functionBind;
var hasRequiredFunctionBind;
function requireFunctionBind() {
  if (hasRequiredFunctionBind) return functionBind;
  hasRequiredFunctionBind = 1;
  var implementation2 = requireImplementation();
  functionBind = Function.prototype.bind || implementation2;
  return functionBind;
}
var functionCall;
var hasRequiredFunctionCall;
function requireFunctionCall() {
  if (hasRequiredFunctionCall) return functionCall;
  hasRequiredFunctionCall = 1;
  functionCall = Function.prototype.call;
  return functionCall;
}
var functionApply;
var hasRequiredFunctionApply;
function requireFunctionApply() {
  if (hasRequiredFunctionApply) return functionApply;
  hasRequiredFunctionApply = 1;
  functionApply = Function.prototype.apply;
  return functionApply;
}
var reflectApply;
var hasRequiredReflectApply;
function requireReflectApply() {
  if (hasRequiredReflectApply) return reflectApply;
  hasRequiredReflectApply = 1;
  reflectApply = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  return reflectApply;
}
var actualApply;
var hasRequiredActualApply;
function requireActualApply() {
  if (hasRequiredActualApply) return actualApply;
  hasRequiredActualApply = 1;
  var bind2 = requireFunctionBind();
  var $apply2 = requireFunctionApply();
  var $call2 = requireFunctionCall();
  var $reflectApply = requireReflectApply();
  actualApply = $reflectApply || bind2.call($call2, $apply2);
  return actualApply;
}
var callBindApplyHelpers;
var hasRequiredCallBindApplyHelpers;
function requireCallBindApplyHelpers() {
  if (hasRequiredCallBindApplyHelpers) return callBindApplyHelpers;
  hasRequiredCallBindApplyHelpers = 1;
  var bind2 = requireFunctionBind();
  var $TypeError2 = type$1;
  var $call2 = requireFunctionCall();
  var $actualApply = requireActualApply();
  callBindApplyHelpers = function callBindBasic(args) {
    if (args.length < 1 || typeof args[0] !== "function") {
      throw new $TypeError2("a function is required");
    }
    return $actualApply(bind2, $call2, args);
  };
  return callBindApplyHelpers;
}
var get;
var hasRequiredGet;
function requireGet() {
  if (hasRequiredGet) return get;
  hasRequiredGet = 1;
  var callBind = requireCallBindApplyHelpers();
  var gOPD2 = gopd;
  var hasProtoAccessor;
  try {
    hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (e) {
    if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
      throw e;
    }
  }
  var desc = !!hasProtoAccessor && gOPD2 && gOPD2(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  );
  var $Object2 = Object;
  var $getPrototypeOf = $Object2.getPrototypeOf;
  get = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
    /** @type {import('./get')} */
    function getDunder(value) {
      return $getPrototypeOf(value == null ? value : $Object2(value));
    }
  ) : false;
  return get;
}
var getProto$1;
var hasRequiredGetProto;
function requireGetProto() {
  if (hasRequiredGetProto) return getProto$1;
  hasRequiredGetProto = 1;
  var reflectGetProto = requireReflect_getPrototypeOf();
  var originalGetProto = requireObject_getPrototypeOf();
  var getDunderProto = requireGet();
  getProto$1 = reflectGetProto ? function getProto2(O) {
    return reflectGetProto(O);
  } : originalGetProto ? function getProto2(O) {
    if (!O || typeof O !== "object" && typeof O !== "function") {
      throw new TypeError("getProto: not an object");
    }
    return originalGetProto(O);
  } : getDunderProto ? function getProto2(O) {
    return getDunderProto(O);
  } : null;
  return getProto$1;
}
var hasown;
var hasRequiredHasown;
function requireHasown() {
  if (hasRequiredHasown) return hasown;
  hasRequiredHasown = 1;
  var call = Function.prototype.call;
  var $hasOwn = Object.prototype.hasOwnProperty;
  var bind2 = requireFunctionBind();
  hasown = bind2.call(call, $hasOwn);
  return hasown;
}
var undefined$1;
var $Object = esObjectAtoms;
var $Error = esErrors;
var $EvalError = _eval;
var $RangeError = range$1;
var $ReferenceError = ref;
var $SyntaxError = syntax;
var $TypeError$1 = type$1;
var $URIError = uri;
var abs = abs$1;
var floor = floor$1;
var max = max$1;
var min = min$1;
var pow = pow$1;
var round = round$1;
var sign2 = sign$1;
var $Function = Function;
var getEvalledConstructor = function(expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
  } catch (e) {
  }
};
var $gOPD = gopd;
var $defineProperty$1 = esDefineProperty;
var throwTypeError = function() {
  throw new $TypeError$1();
};
var ThrowTypeError = $gOPD ? function() {
  try {
    arguments.callee;
    return throwTypeError;
  } catch (calleeThrows) {
    try {
      return $gOPD(arguments, "callee").get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;
var hasSymbols = requireHasSymbols()();
var getProto = requireGetProto();
var $ObjectGPO = requireObject_getPrototypeOf();
var $ReflectGPO = requireReflect_getPrototypeOf();
var $apply = requireFunctionApply();
var $call = requireFunctionCall();
var needsEval = {};
var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined$1 : getProto(Uint8Array);
var INTRINSICS = {
  __proto__: null,
  "%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
  "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined$1,
  "%AsyncFromSyncIteratorPrototype%": undefined$1,
  "%AsyncFunction%": needsEval,
  "%AsyncGenerator%": needsEval,
  "%AsyncGeneratorFunction%": needsEval,
  "%AsyncIteratorPrototype%": needsEval,
  "%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
  "%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
  "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined$1 : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined$1 : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": $Error,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": $EvalError,
  "%Float16Array%": typeof Float16Array === "undefined" ? undefined$1 : Float16Array,
  "%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
  "%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
  "%Function%": $Function,
  "%GeneratorFunction%": needsEval,
  "%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
  "%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
  "%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
  "%JSON%": typeof JSON === "object" ? JSON : undefined$1,
  "%Map%": typeof Map === "undefined" ? undefined$1 : Map,
  "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined$1 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": $Object,
  "%Object.getOwnPropertyDescriptor%": $gOPD,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
  "%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
  "%RangeError%": $RangeError,
  "%ReferenceError%": $ReferenceError,
  "%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set === "undefined" ? undefined$1 : Set,
  "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined$1 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined$1,
  "%Symbol%": hasSymbols ? Symbol : undefined$1,
  "%SyntaxError%": $SyntaxError,
  "%ThrowTypeError%": ThrowTypeError,
  "%TypedArray%": TypedArray,
  "%TypeError%": $TypeError$1,
  "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
  "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
  "%URIError%": $URIError,
  "%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
  "%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
  "%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet,
  "%Function.prototype.call%": $call,
  "%Function.prototype.apply%": $apply,
  "%Object.defineProperty%": $defineProperty$1,
  "%Object.getPrototypeOf%": $ObjectGPO,
  "%Math.abs%": abs,
  "%Math.floor%": floor,
  "%Math.max%": max,
  "%Math.min%": min,
  "%Math.pow%": pow,
  "%Math.round%": round,
  "%Math.sign%": sign2,
  "%Reflect.getPrototypeOf%": $ReflectGPO
};
if (getProto) {
  try {
    null.error;
  } catch (e) {
    var errorProto = getProto(getProto(e));
    INTRINSICS["%Error.prototype%"] = errorProto;
  }
}
var doEval = function doEval2(name) {
  var value;
  if (name === "%AsyncFunction%") {
    value = getEvalledConstructor("async function () {}");
  } else if (name === "%GeneratorFunction%") {
    value = getEvalledConstructor("function* () {}");
  } else if (name === "%AsyncGeneratorFunction%") {
    value = getEvalledConstructor("async function* () {}");
  } else if (name === "%AsyncGenerator%") {
    var fn = doEval2("%AsyncGeneratorFunction%");
    if (fn) {
      value = fn.prototype;
    }
  } else if (name === "%AsyncIteratorPrototype%") {
    var gen = doEval2("%AsyncGenerator%");
    if (gen && getProto) {
      value = getProto(gen.prototype);
    }
  }
  INTRINSICS[name] = value;
  return value;
};
var LEGACY_ALIASES = {
  __proto__: null,
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
};
var bind = requireFunctionBind();
var hasOwn$1 = requireHasown();
var $concat = bind.call($call, Array.prototype.concat);
var $spliceApply = bind.call($apply, Array.prototype.splice);
var $replace = bind.call($call, String.prototype.replace);
var $strSlice = bind.call($call, String.prototype.slice);
var $exec = bind.call($call, RegExp.prototype.exec);
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = function stringToPath2(string) {
  var first = $strSlice(string, 0, 1);
  var last = $strSlice(string, -1);
  if (first === "%" && last !== "%") {
    throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
  } else if (last === "%" && first !== "%") {
    throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
  }
  var result = [];
  $replace(string, rePropName, function(match, number, quote, subString) {
    result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
  });
  return result;
};
var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
  var intrinsicName = name;
  var alias;
  if (hasOwn$1(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = "%" + alias[0] + "%";
  }
  if (hasOwn$1(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];
    if (value === needsEval) {
      value = doEval(intrinsicName);
    }
    if (typeof value === "undefined" && !allowMissing) {
      throw new $TypeError$1("intrinsic " + name + " exists, but is not available. Please file an issue!");
    }
    return {
      alias,
      name: intrinsicName,
      value
    };
  }
  throw new $SyntaxError("intrinsic " + name + " does not exist!");
};
var getIntrinsic = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== "string" || name.length === 0) {
    throw new $TypeError$1("intrinsic name must be a non-empty string");
  }
  if (arguments.length > 1 && typeof allowMissing !== "boolean") {
    throw new $TypeError$1('"allowMissing" argument must be a boolean');
  }
  if ($exec(/^%?[^%]*%?$/, name) === null) {
    throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  }
  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
  var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;
  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat([0, 1], alias));
  }
  for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    var part = parts[i];
    var first = $strSlice(part, 0, 1);
    var last = $strSlice(part, -1);
    if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
      throw new $SyntaxError("property names with quotes must have matching quotes");
    }
    if (part === "constructor" || !isOwn) {
      skipFurtherCaching = true;
    }
    intrinsicBaseName += "." + part;
    intrinsicRealName = "%" + intrinsicBaseName + "%";
    if (hasOwn$1(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part in value)) {
        if (!allowMissing) {
          throw new $TypeError$1("base intrinsic for " + name + " exists, but the property is not available.");
        }
        return void 0;
      }
      if ($gOPD && i + 1 >= parts.length) {
        var desc = $gOPD(value, part);
        isOwn = !!desc;
        if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
          value = desc.get;
        } else {
          value = value[part];
        }
      } else {
        isOwn = hasOwn$1(value, part);
        value = value[part];
      }
      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }
  return value;
};
var shams;
var hasRequiredShams;
function requireShams() {
  if (hasRequiredShams) return shams;
  hasRequiredShams = 1;
  var hasSymbols2 = requireShams$1();
  shams = function hasToStringTagShams() {
    return hasSymbols2() && !!Symbol.toStringTag;
  };
  return shams;
}
var GetIntrinsic2 = getIntrinsic;
var $defineProperty = GetIntrinsic2("%Object.defineProperty%", true);
var hasToStringTag = requireShams()();
var hasOwn = requireHasown();
var $TypeError = type$1;
var toStringTag = hasToStringTag ? Symbol.toStringTag : null;
var esSetTostringtag = function setToStringTag(object2, value) {
  var overrideIfSet = arguments.length > 2 && !!arguments[2] && arguments[2].force;
  var nonConfigurable = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
  if (typeof overrideIfSet !== "undefined" && typeof overrideIfSet !== "boolean" || typeof nonConfigurable !== "undefined" && typeof nonConfigurable !== "boolean") {
    throw new $TypeError("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
  }
  if (toStringTag && (overrideIfSet || !hasOwn(object2, toStringTag))) {
    if ($defineProperty) {
      $defineProperty(object2, toStringTag, {
        configurable: !nonConfigurable,
        enumerable: false,
        value,
        writable: false
      });
    } else {
      object2[toStringTag] = value;
    }
  }
};
var populate$2 = function(dst, src2) {
  Object.keys(src2).forEach(function(prop) {
    dst[prop] = dst[prop] || src2[prop];
  });
  return dst;
};
var CombinedStream = combined_stream;
var util$3 = require$$1;
var path$j = require$$1$1;
var http$1 = require$$3;
var https$1 = require$$4$1;
var parseUrl$2 = require$$0$1.parse;
var fs$k = require$$1$2;
var Stream$1 = stream.Stream;
var mime = mimeTypes;
var asynckit = asynckit$1;
var setToStringTag2 = esSetTostringtag;
var populate$1 = populate$2;
var form_data = FormData$1;
util$3.inherits(FormData$1, CombinedStream);
function FormData$1(options) {
  if (!(this instanceof FormData$1)) {
    return new FormData$1(options);
  }
  this._overheadLength = 0;
  this._valueLength = 0;
  this._valuesToMeasure = [];
  CombinedStream.call(this);
  options = options || {};
  for (var option in options) {
    this[option] = options[option];
  }
}
FormData$1.LINE_BREAK = "\r\n";
FormData$1.DEFAULT_CONTENT_TYPE = "application/octet-stream";
FormData$1.prototype.append = function(field, value, options) {
  options = options || {};
  if (typeof options == "string") {
    options = { filename: options };
  }
  var append2 = CombinedStream.prototype.append.bind(this);
  if (typeof value == "number") {
    value = "" + value;
  }
  if (Array.isArray(value)) {
    this._error(new Error("Arrays are not supported."));
    return;
  }
  var header = this._multiPartHeader(field, value, options);
  var footer = this._multiPartFooter();
  append2(header);
  append2(value);
  append2(footer);
  this._trackLength(header, value, options);
};
FormData$1.prototype._trackLength = function(header, value, options) {
  var valueLength = 0;
  if (options.knownLength != null) {
    valueLength += +options.knownLength;
  } else if (Buffer.isBuffer(value)) {
    valueLength = value.length;
  } else if (typeof value === "string") {
    valueLength = Buffer.byteLength(value);
  }
  this._valueLength += valueLength;
  this._overheadLength += Buffer.byteLength(header) + FormData$1.LINE_BREAK.length;
  if (!value || !value.path && !(value.readable && Object.prototype.hasOwnProperty.call(value, "httpVersion")) && !(value instanceof Stream$1)) {
    return;
  }
  if (!options.knownLength) {
    this._valuesToMeasure.push(value);
  }
};
FormData$1.prototype._lengthRetriever = function(value, callback) {
  if (Object.prototype.hasOwnProperty.call(value, "fd")) {
    if (value.end != void 0 && value.end != Infinity && value.start != void 0) {
      callback(null, value.end + 1 - (value.start ? value.start : 0));
    } else {
      fs$k.stat(value.path, function(err, stat2) {
        var fileSize;
        if (err) {
          callback(err);
          return;
        }
        fileSize = stat2.size - (value.start ? value.start : 0);
        callback(null, fileSize);
      });
    }
  } else if (Object.prototype.hasOwnProperty.call(value, "httpVersion")) {
    callback(null, +value.headers["content-length"]);
  } else if (Object.prototype.hasOwnProperty.call(value, "httpModule")) {
    value.on("response", function(response) {
      value.pause();
      callback(null, +response.headers["content-length"]);
    });
    value.resume();
  } else {
    callback("Unknown stream");
  }
};
FormData$1.prototype._multiPartHeader = function(field, value, options) {
  if (typeof options.header == "string") {
    return options.header;
  }
  var contentDisposition = this._getContentDisposition(value, options);
  var contentType = this._getContentType(value, options);
  var contents = "";
  var headers = {
    // add custom disposition as third element or keep it two elements if not
    "Content-Disposition": ["form-data", 'name="' + field + '"'].concat(contentDisposition || []),
    // if no content type. allow it to be empty array
    "Content-Type": [].concat(contentType || [])
  };
  if (typeof options.header == "object") {
    populate$1(headers, options.header);
  }
  var header;
  for (var prop in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, prop)) {
      header = headers[prop];
      if (header == null) {
        continue;
      }
      if (!Array.isArray(header)) {
        header = [header];
      }
      if (header.length) {
        contents += prop + ": " + header.join("; ") + FormData$1.LINE_BREAK;
      }
    }
  }
  return "--" + this.getBoundary() + FormData$1.LINE_BREAK + contents + FormData$1.LINE_BREAK;
};
FormData$1.prototype._getContentDisposition = function(value, options) {
  var filename, contentDisposition;
  if (typeof options.filepath === "string") {
    filename = path$j.normalize(options.filepath).replace(/\\/g, "/");
  } else if (options.filename || value.name || value.path) {
    filename = path$j.basename(options.filename || value.name || value.path);
  } else if (value.readable && Object.prototype.hasOwnProperty.call(value, "httpVersion")) {
    filename = path$j.basename(value.client._httpMessage.path || "");
  }
  if (filename) {
    contentDisposition = 'filename="' + filename + '"';
  }
  return contentDisposition;
};
FormData$1.prototype._getContentType = function(value, options) {
  var contentType = options.contentType;
  if (!contentType && value.name) {
    contentType = mime.lookup(value.name);
  }
  if (!contentType && value.path) {
    contentType = mime.lookup(value.path);
  }
  if (!contentType && value.readable && Object.prototype.hasOwnProperty.call(value, "httpVersion")) {
    contentType = value.headers["content-type"];
  }
  if (!contentType && (options.filepath || options.filename)) {
    contentType = mime.lookup(options.filepath || options.filename);
  }
  if (!contentType && typeof value == "object") {
    contentType = FormData$1.DEFAULT_CONTENT_TYPE;
  }
  return contentType;
};
FormData$1.prototype._multiPartFooter = function() {
  return (function(next) {
    var footer = FormData$1.LINE_BREAK;
    var lastPart = this._streams.length === 0;
    if (lastPart) {
      footer += this._lastBoundary();
    }
    next(footer);
  }).bind(this);
};
FormData$1.prototype._lastBoundary = function() {
  return "--" + this.getBoundary() + "--" + FormData$1.LINE_BREAK;
};
FormData$1.prototype.getHeaders = function(userHeaders) {
  var header;
  var formHeaders = {
    "content-type": "multipart/form-data; boundary=" + this.getBoundary()
  };
  for (header in userHeaders) {
    if (Object.prototype.hasOwnProperty.call(userHeaders, header)) {
      formHeaders[header.toLowerCase()] = userHeaders[header];
    }
  }
  return formHeaders;
};
FormData$1.prototype.setBoundary = function(boundary) {
  this._boundary = boundary;
};
FormData$1.prototype.getBoundary = function() {
  if (!this._boundary) {
    this._generateBoundary();
  }
  return this._boundary;
};
FormData$1.prototype.getBuffer = function() {
  var dataBuffer = new Buffer.alloc(0);
  var boundary = this.getBoundary();
  for (var i = 0, len = this._streams.length; i < len; i++) {
    if (typeof this._streams[i] !== "function") {
      if (Buffer.isBuffer(this._streams[i])) {
        dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
      } else {
        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i])]);
      }
      if (typeof this._streams[i] !== "string" || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData$1.LINE_BREAK)]);
      }
    }
  }
  return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
};
FormData$1.prototype._generateBoundary = function() {
  var boundary = "--------------------------";
  for (var i = 0; i < 24; i++) {
    boundary += Math.floor(Math.random() * 10).toString(16);
  }
  this._boundary = boundary;
};
FormData$1.prototype.getLengthSync = function() {
  var knownLength = this._overheadLength + this._valueLength;
  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }
  if (!this.hasKnownLength()) {
    this._error(new Error("Cannot calculate proper length in synchronous way."));
  }
  return knownLength;
};
FormData$1.prototype.hasKnownLength = function() {
  var hasKnownLength = true;
  if (this._valuesToMeasure.length) {
    hasKnownLength = false;
  }
  return hasKnownLength;
};
FormData$1.prototype.getLength = function(cb) {
  var knownLength = this._overheadLength + this._valueLength;
  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }
  if (!this._valuesToMeasure.length) {
    process.nextTick(cb.bind(this, null, knownLength));
    return;
  }
  asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
    if (err) {
      cb(err);
      return;
    }
    values.forEach(function(length) {
      knownLength += length;
    });
    cb(null, knownLength);
  });
};
FormData$1.prototype.submit = function(params, cb) {
  var request, options, defaults2 = { method: "post" };
  if (typeof params == "string") {
    params = parseUrl$2(params);
    options = populate$1({
      port: params.port,
      path: params.pathname,
      host: params.hostname,
      protocol: params.protocol
    }, defaults2);
  } else {
    options = populate$1(params, defaults2);
    if (!options.port) {
      options.port = options.protocol == "https:" ? 443 : 80;
    }
  }
  options.headers = this.getHeaders(params.headers);
  if (options.protocol == "https:") {
    request = https$1.request(options);
  } else {
    request = http$1.request(options);
  }
  this.getLength((function(err, length) {
    if (err && err !== "Unknown stream") {
      this._error(err);
      return;
    }
    if (length) {
      request.setHeader("Content-Length", length);
    }
    this.pipe(request);
    if (cb) {
      var onResponse;
      var callback = function(error2, responce) {
        request.removeListener("error", callback);
        request.removeListener("response", onResponse);
        return cb.call(this, error2, responce);
      };
      onResponse = callback.bind(this, null);
      request.on("error", callback);
      request.on("response", onResponse);
    }
  }).bind(this));
  return request;
};
FormData$1.prototype._error = function(err) {
  if (!this.error) {
    this.error = err;
    this.pause();
    this.emit("error", err);
  }
};
FormData$1.prototype.toString = function() {
  return "[object FormData]";
};
setToStringTag2(FormData$1, "FormData");
const FormData$2 = /* @__PURE__ */ getDefaultExportFromCjs(form_data);
function isVisitable(thing) {
  return utils$3.isPlainObject(thing) || utils$3.isArray(thing);
}
function removeBrackets(key) {
  return utils$3.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path2, key, dots) {
  if (!path2) return key;
  return path2.concat(key).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils$3.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils$3.toFlatObject(utils$3, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData$1(obj, formData, options) {
  if (!utils$3.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new (FormData$2 || FormData)();
  options = utils$3.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils$3.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils$3.isSpecCompliantForm(formData);
  if (!utils$3.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null) return "";
    if (utils$3.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils$3.isBlob(value)) {
      throw new AxiosError$1("Blob is not supported. Use a Buffer instead.");
    }
    if (utils$3.isArrayBuffer(value) || utils$3.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path2) {
    let arr = value;
    if (value && !path2 && typeof value === "object") {
      if (utils$3.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils$3.isArray(value) && isFlatArray(value) || (utils$3.isFileList(value) || utils$3.endsWith(key, "[]")) && (arr = utils$3.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils$3.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path2, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path2) {
    if (utils$3.isUndefined(value)) return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path2.join("."));
    }
    stack.push(value);
    utils$3.forEach(value, function each(el, key) {
      const result = !(utils$3.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils$3.isString(key) ? key.trim() : key,
        path2,
        exposedHelpers
      );
      if (result === true) {
        build(el, path2 ? path2.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils$3.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
function encode$1(str2) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str2).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData$1(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url2, params, options) {
  if (!params) {
    return url2;
  }
  const _encode = options && options.encode || encode;
  if (utils$3.isFunction(options)) {
    options = {
      serialize: options
    };
  }
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$3.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url2.indexOf("#");
    if (hashmarkIndex !== -1) {
      url2 = url2.slice(0, hashmarkIndex);
    }
    url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url2;
}
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$3.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}
const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
const URLSearchParams$1 = require$$0$1.URLSearchParams;
const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "0123456789";
const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str2 = "";
  const { length } = alphabet;
  const randomValues = new Uint32Array(size);
  require$$0$2.randomFillSync(randomValues);
  for (let i = 0; i < size; i++) {
    str2 += alphabet[randomValues[i] % length];
  }
  return str2;
};
const platform$2 = {
  isNode: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$2,
    Blob: typeof Blob !== "undefined" && Blob || null
  },
  ALPHABET,
  generateString,
  protocols: ["http", "https", "file", "data"]
};
const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
const _navigator = typeof navigator === "object" && navigator || void 0;
const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
const hasStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
const origin = hasBrowserEnv && window.location.href || "http://localhost";
const utils$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv,
  hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv,
  navigator: _navigator,
  origin
}, Symbol.toStringTag, { value: "Module" }));
const platform$1 = {
  ...utils$2,
  ...platform$2
};
function toURLEncodedForm(data, options) {
  return toFormData$1(data, new platform$1.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path2, helpers) {
      if (platform$1.isNode && utils$3.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}
function parsePropPath(name) {
  return utils$3.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path2, value, target, index) {
    let name = path2[index++];
    if (name === "__proto__") return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path2.length;
    name = !name && utils$3.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils$3.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils$3.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path2, value, target[name], index);
    if (result && utils$3.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils$3.isFormData(formData) && utils$3.isFunction(formData.entries)) {
    const obj = {};
    utils$3.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
function stringifySafely(rawValue, parser, encoder) {
  if (utils$3.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$3.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
const defaults$1 = {
  transitional: transitionalDefaults,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils$3.isObject(data);
    if (isObjectPayload && utils$3.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils$3.isFormData(data);
    if (isFormData2) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }
    if (utils$3.isArrayBuffer(data) || utils$3.isBuffer(data) || utils$3.isStream(data) || utils$3.isFile(data) || utils$3.isBlob(data) || utils$3.isReadableStream(data)) {
      return data;
    }
    if (utils$3.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$3.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils$3.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData$1(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults$1.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (utils$3.isResponse(data) || utils$3.isReadableStream(data)) {
      return data;
    }
    if (data && utils$3.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform$1.classes.FormData,
    Blob: platform$1.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils$3.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
  defaults$1.headers[method] = {};
});
const ignoreDuplicateOf = utils$3.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
const parseHeaders = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};
const $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils$3.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str2) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str2)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
const isValidHeaderName = (str2) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str2.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils$3.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils$3.isString(value)) return;
  if (utils$3.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils$3.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str2) => {
    return char.toUpperCase() + str2;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils$3.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
let AxiosHeaders$1 = class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils$3.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils$3.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils$3.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils$3.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$3.isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils$3.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils$3.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils$3.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils$3.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils$3.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils$3.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format2) {
    const self2 = this;
    const headers = {};
    utils$3.forEach(this, (value, header) => {
      const key = utils$3.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format2 ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils$3.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$3.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype2 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype2, _header);
        accessors[lHeader] = true;
      }
    }
    utils$3.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
};
AxiosHeaders$1.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils$3.reduceDescriptors(AxiosHeaders$1.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils$3.freezeMethods(AxiosHeaders$1);
function transformData(fns, response) {
  const config2 = this || defaults$1;
  const context = response || config2;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;
  utils$3.forEach(fns, function transform(fn) {
    data = fn.call(config2, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}
function isCancel$1(value) {
  return !!(value && value.__CANCEL__);
}
function CanceledError$1(message, config2, request) {
  AxiosError$1.call(this, message == null ? "canceled" : message, AxiosError$1.ERR_CANCELED, config2, request);
  this.name = "CanceledError";
}
utils$3.inherits(CanceledError$1, AxiosError$1, {
  __CANCEL__: true
});
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError$1(
      "Request failed with status code " + response.status,
      [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}
function isAbsoluteURL(url2) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url2);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && isRelativeUrl || allowAbsoluteUrls == false) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
var proxyFromEnv = {};
var parseUrl$1 = require$$0$1.parse;
var DEFAULT_PORTS = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};
var stringEndsWith = String.prototype.endsWith || function(s) {
  return s.length <= this.length && this.indexOf(s, this.length - s.length) !== -1;
};
function getProxyForUrl(url2) {
  var parsedUrl = typeof url2 === "string" ? parseUrl$1(url2) : url2 || {};
  var proto = parsedUrl.protocol;
  var hostname = parsedUrl.host;
  var port = parsedUrl.port;
  if (typeof hostname !== "string" || !hostname || typeof proto !== "string") {
    return "";
  }
  proto = proto.split(":", 1)[0];
  hostname = hostname.replace(/:\d*$/, "");
  port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
  if (!shouldProxy(hostname, port)) {
    return "";
  }
  var proxy = getEnv("npm_config_" + proto + "_proxy") || getEnv(proto + "_proxy") || getEnv("npm_config_proxy") || getEnv("all_proxy");
  if (proxy && proxy.indexOf("://") === -1) {
    proxy = proto + "://" + proxy;
  }
  return proxy;
}
function shouldProxy(hostname, port) {
  var NO_PROXY = (getEnv("npm_config_no_proxy") || getEnv("no_proxy")).toLowerCase();
  if (!NO_PROXY) {
    return true;
  }
  if (NO_PROXY === "*") {
    return false;
  }
  return NO_PROXY.split(/[,\s]/).every(function(proxy) {
    if (!proxy) {
      return true;
    }
    var parsedProxy = proxy.match(/^(.+):(\d+)$/);
    var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
    var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
    if (parsedProxyPort && parsedProxyPort !== port) {
      return true;
    }
    if (!/^[.*]/.test(parsedProxyHostname)) {
      return hostname !== parsedProxyHostname;
    }
    if (parsedProxyHostname.charAt(0) === "*") {
      parsedProxyHostname = parsedProxyHostname.slice(1);
    }
    return !stringEndsWith.call(hostname, parsedProxyHostname);
  });
}
function getEnv(key) {
  return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || "";
}
proxyFromEnv.getProxyForUrl = getProxyForUrl;
var followRedirects$1 = { exports: {} };
var src$2 = { exports: {} };
var browser = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type2 = typeof val;
    if (type2 === "string" && val.length > 0) {
      return parse2(val);
    } else if (type2 === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse2(str2) {
    str2 = String(str2);
    if (str2.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str2
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type2 = (match[2] || "ms").toLowerCase();
    switch (type2) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms;
}
var common$6;
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common$6;
  hasRequiredCommon = 1;
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce2;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = requireMs();
    createDebug.destroy = destroy2;
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      let namespacesCache;
      let enabledCache;
      function debug2(...args) {
        if (!debug2.enabled) {
          return;
        }
        const self2 = debug2;
        const curr = Number(/* @__PURE__ */ new Date());
        const ms2 = curr - (prevTime || curr);
        self2.diff = ms2;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format2) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter = createDebug.formatters[format2];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self2, args);
        const logFn = self2.log || createDebug.log;
        logFn.apply(self2, args);
      }
      debug2.namespace = namespace;
      debug2.useColors = createDebug.useColors();
      debug2.color = createDebug.selectColor(namespace);
      debug2.extend = extend3;
      debug2.destroy = createDebug.destroy;
      Object.defineProperty(debug2, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => {
          if (enableOverride !== null) {
            return enableOverride;
          }
          if (namespacesCache !== createDebug.namespaces) {
            namespacesCache = createDebug.namespaces;
            enabledCache = createDebug.enabled(namespace);
          }
          return enabledCache;
        },
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug2);
      }
      return debug2;
    }
    function extend3(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.namespaces = namespaces;
      createDebug.names = [];
      createDebug.skips = [];
      const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(" ", ",").split(",").filter(Boolean);
      for (const ns of split) {
        if (ns[0] === "-") {
          createDebug.skips.push(ns.slice(1));
        } else {
          createDebug.names.push(ns);
        }
      }
    }
    function matchesTemplate(search, template) {
      let searchIndex = 0;
      let templateIndex = 0;
      let starIndex = -1;
      let matchIndex = 0;
      while (searchIndex < search.length) {
        if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
          if (template[templateIndex] === "*") {
            starIndex = templateIndex;
            matchIndex = searchIndex;
            templateIndex++;
          } else {
            searchIndex++;
            templateIndex++;
          }
        } else if (starIndex !== -1) {
          templateIndex = starIndex + 1;
          matchIndex++;
          searchIndex = matchIndex;
        } else {
          return false;
        }
      }
      while (templateIndex < template.length && template[templateIndex] === "*") {
        templateIndex++;
      }
      return templateIndex === template.length;
    }
    function disable() {
      const namespaces = [
        ...createDebug.names,
        ...createDebug.skips.map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      for (const skip of createDebug.skips) {
        if (matchesTemplate(name, skip)) {
          return false;
        }
      }
      for (const ns of createDebug.names) {
        if (matchesTemplate(name, ns)) {
          return true;
        }
      }
      return false;
    }
    function coerce2(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy2() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  common$6 = setup;
  return common$6;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser.exports;
  hasRequiredBrowser = 1;
  (function(module2, exports2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load2;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error2) {
      }
    }
    function load2() {
      let r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error2) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error2) {
      }
    }
    module2.exports = requireCommon()(exports2);
    const { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error2) {
        return "[UnexpectedJSONParseError]: " + error2.message;
      }
    };
  })(browser, browser.exports);
  return browser.exports;
}
var node$1 = { exports: {} };
var hasFlag;
var hasRequiredHasFlag;
function requireHasFlag() {
  if (hasRequiredHasFlag) return hasFlag;
  hasRequiredHasFlag = 1;
  hasFlag = (flag, argv) => {
    argv = argv || process.argv;
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const pos = argv.indexOf(prefix + flag);
    const terminatorPos = argv.indexOf("--");
    return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
  };
  return hasFlag;
}
var supportsColor_1;
var hasRequiredSupportsColor;
function requireSupportsColor() {
  if (hasRequiredSupportsColor) return supportsColor_1;
  hasRequiredSupportsColor = 1;
  const os2 = require$$1$3;
  const hasFlag2 = requireHasFlag();
  const env = process.env;
  let forceColor;
  if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false")) {
    forceColor = false;
  } else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always")) {
    forceColor = true;
  }
  if ("FORCE_COLOR" in env) {
    forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
  }
  function translateLevel(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor(stream2) {
    if (forceColor === false) {
      return 0;
    }
    if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor")) {
      return 3;
    }
    if (hasFlag2("color=256")) {
      return 2;
    }
    if (stream2 && !stream2.isTTY && forceColor !== true) {
      return 0;
    }
    const min2 = forceColor ? 1 : 0;
    if (process.platform === "win32") {
      const osRelease = os2.release().split(".");
      if (Number(process.versions.node.split(".")[0]) >= 8 && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some((sign3) => sign3 in env) || env.CI_NAME === "codeship") {
        return 1;
      }
      return min2;
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in env) {
      const version2 = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version2 >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env) {
      return 1;
    }
    if (env.TERM === "dumb") {
      return min2;
    }
    return min2;
  }
  function getSupportLevel(stream2) {
    const level = supportsColor(stream2);
    return translateLevel(level);
  }
  supportsColor_1 = {
    supportsColor: getSupportLevel,
    stdout: getSupportLevel(process.stdout),
    stderr: getSupportLevel(process.stderr)
  };
  return supportsColor_1;
}
var hasRequiredNode$1;
function requireNode$1() {
  if (hasRequiredNode$1) return node$1.exports;
  hasRequiredNode$1 = 1;
  (function(module2, exports2) {
    const tty = require$$0$3;
    const util2 = require$$1;
    exports2.init = init;
    exports2.log = log2;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load2;
    exports2.useColors = useColors;
    exports2.destroy = util2.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = requireSupportsColor();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error2) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log2(...args) {
      return process.stderr.write(util2.formatWithOptions(exports2.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load2() {
      return process.env.DEBUG;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = requireCommon()(exports2);
    const { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map((str2) => str2.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  })(node$1, node$1.exports);
  return node$1.exports;
}
if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
  src$2.exports = requireBrowser();
} else {
  src$2.exports = requireNode$1();
}
var srcExports$1 = src$2.exports;
var debug$5;
var debug_1$2 = function() {
  if (!debug$5) {
    try {
      debug$5 = srcExports$1("follow-redirects");
    } catch (error2) {
    }
    if (typeof debug$5 !== "function") {
      debug$5 = function() {
      };
    }
  }
  debug$5.apply(null, arguments);
};
var url = require$$0$1;
var URL$1 = url.URL;
var http = require$$3;
var https = require$$4$1;
var Writable = stream.Writable;
var assert$1 = require$$4$2;
var debug$4 = debug_1$2;
(function detectUnsupportedEnvironment() {
  var looksLikeNode = typeof process !== "undefined";
  var looksLikeBrowser = typeof window !== "undefined" && typeof document !== "undefined";
  var looksLikeV8 = isFunction(Error.captureStackTrace);
  if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8)) {
    console.warn("The follow-redirects package should be excluded from browser builds.");
  }
})();
var useNativeURL = false;
try {
  assert$1(new URL$1(""));
} catch (error2) {
  useNativeURL = error2.code === "ERR_INVALID_URL";
}
var preservedUrlFields = [
  "auth",
  "host",
  "hostname",
  "href",
  "path",
  "pathname",
  "port",
  "protocol",
  "query",
  "search",
  "hash"
];
var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = /* @__PURE__ */ Object.create(null);
events.forEach(function(event) {
  eventHandlers[event] = function(arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});
var InvalidUrlError = createErrorType(
  "ERR_INVALID_URL",
  "Invalid URL",
  TypeError
);
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded",
  RedirectionError
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);
var destroy = Writable.prototype.destroy || noop$1;
function RedirectableRequest(options, responseCallback) {
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];
  if (responseCallback) {
    this.on("response", responseCallback);
  }
  var self2 = this;
  this._onNativeResponse = function(response) {
    try {
      self2._processResponse(response);
    } catch (cause) {
      self2.emit("error", cause instanceof RedirectionError ? cause : new RedirectionError({ cause }));
    }
  };
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);
RedirectableRequest.prototype.abort = function() {
  destroyRequest(this._currentRequest);
  this._currentRequest.abort();
  this.emit("abort");
};
RedirectableRequest.prototype.destroy = function(error2) {
  destroyRequest(this._currentRequest, error2);
  destroy.call(this, error2);
  return this;
};
RedirectableRequest.prototype.write = function(data, encoding, callback) {
  if (this._ending) {
    throw new WriteAfterEndError();
  }
  if (!isString(data) && !isBuffer(data)) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (isFunction(encoding)) {
    callback = encoding;
    encoding = null;
  }
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data, encoding });
    this._currentRequest.write(data, encoding, callback);
  } else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};
RedirectableRequest.prototype.end = function(data, encoding, callback) {
  if (isFunction(data)) {
    callback = data;
    data = encoding = null;
  } else if (isFunction(encoding)) {
    callback = encoding;
    encoding = null;
  }
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  } else {
    var self2 = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function() {
      self2._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};
RedirectableRequest.prototype.setHeader = function(name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};
RedirectableRequest.prototype.removeHeader = function(name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};
RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
  var self2 = this;
  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  }
  function startTimer(socket) {
    if (self2._timeout) {
      clearTimeout(self2._timeout);
    }
    self2._timeout = setTimeout(function() {
      self2.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  }
  function clearTimer() {
    if (self2._timeout) {
      clearTimeout(self2._timeout);
      self2._timeout = null;
    }
    self2.removeListener("abort", clearTimer);
    self2.removeListener("error", clearTimer);
    self2.removeListener("response", clearTimer);
    self2.removeListener("close", clearTimer);
    if (callback) {
      self2.removeListener("timeout", callback);
    }
    if (!self2.socket) {
      self2._currentRequest.removeListener("socket", startTimer);
    }
  }
  if (callback) {
    this.on("timeout", callback);
  }
  if (this.socket) {
    startTimer(this.socket);
  } else {
    this._currentRequest.once("socket", startTimer);
  }
  this.on("socket", destroyOnTimeout);
  this.on("abort", clearTimer);
  this.on("error", clearTimer);
  this.on("response", clearTimer);
  this.on("close", clearTimer);
  return this;
};
[
  "flushHeaders",
  "getHeader",
  "setNoDelay",
  "setSocketKeepAlive"
].forEach(function(method) {
  RedirectableRequest.prototype[method] = function(a, b) {
    return this._currentRequest[method](a, b);
  };
});
["aborted", "connection", "socket"].forEach(function(property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function() {
      return this._currentRequest[property];
    }
  });
});
RedirectableRequest.prototype._sanitizeOptions = function(options) {
  if (!options.headers) {
    options.headers = {};
  }
  if (options.host) {
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    } else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};
RedirectableRequest.prototype._performRequest = function() {
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    throw new TypeError("Unsupported protocol " + protocol);
  }
  if (this._options.agents) {
    var scheme = protocol.slice(0, -1);
    this._options.agent = this._options.agents[scheme];
  }
  var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
  request._redirectable = this;
  for (var event of events) {
    request.on(event, eventHandlers[event]);
  }
  this._currentUrl = /^\//.test(this._options.path) ? url.format(this._options) : (
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path
  );
  if (this._isRedirect) {
    var i = 0;
    var self2 = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error2) {
      if (request === self2._currentRequest) {
        if (error2) {
          self2.emit("error", error2);
        } else if (i < buffers.length) {
          var buffer = buffers[i++];
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        } else if (self2._ended) {
          request.end();
        }
      }
    })();
  }
};
RedirectableRequest.prototype._processResponse = function(response) {
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode
    });
  }
  var location = response.headers.location;
  if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);
    this._requestBodyBuffers = [];
    return;
  }
  destroyRequest(this._currentRequest);
  response.destroy();
  if (++this._redirectCount > this._options.maxRedirects) {
    throw new TooManyRedirectsError();
  }
  var requestHeaders;
  var beforeRedirect = this._options.beforeRedirect;
  if (beforeRedirect) {
    requestHeaders = Object.assign({
      // The Host header was set by nativeProtocol.request
      Host: response.req.getHeader("host")
    }, this._options.headers);
  }
  var method = this._options.method;
  if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
  // the server is redirecting the user agent to a different resource […]
  // A user agent can perform a retrieval request targeting that URI
  // (a GET or HEAD request if using HTTP) […]
  statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
    this._options.method = "GET";
    this._requestBodyBuffers = [];
    removeMatchingHeaders(/^content-/i, this._options.headers);
  }
  var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
  var currentUrlParts = parseUrl(this._currentUrl);
  var currentHost = currentHostHeader || currentUrlParts.host;
  var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url.format(Object.assign(currentUrlParts, { host: currentHost }));
  var redirectUrl = resolveUrl(location, currentUrl);
  debug$4("redirecting to", redirectUrl.href);
  this._isRedirect = true;
  spreadUrlObject(redirectUrl, this._options);
  if (redirectUrl.protocol !== currentUrlParts.protocol && redirectUrl.protocol !== "https:" || redirectUrl.host !== currentHost && !isSubdomain(redirectUrl.host, currentHost)) {
    removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers);
  }
  if (isFunction(beforeRedirect)) {
    var responseDetails = {
      headers: response.headers,
      statusCode
    };
    var requestDetails = {
      url: currentUrl,
      method,
      headers: requestHeaders
    };
    beforeRedirect(this._options, responseDetails, requestDetails);
    this._sanitizeOptions(this._options);
  }
  this._performRequest();
};
function wrap(protocols) {
  var exports2 = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024
  };
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function(scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports2[scheme] = Object.create(nativeProtocol);
    function request(input, options, callback) {
      if (isURL(input)) {
        input = spreadUrlObject(input);
      } else if (isString(input)) {
        input = spreadUrlObject(parseUrl(input));
      } else {
        callback = options;
        options = validateUrl(input);
        input = { protocol };
      }
      if (isFunction(options)) {
        callback = options;
        options = null;
      }
      options = Object.assign({
        maxRedirects: exports2.maxRedirects,
        maxBodyLength: exports2.maxBodyLength
      }, input, options);
      options.nativeProtocols = nativeProtocols;
      if (!isString(options.host) && !isString(options.hostname)) {
        options.hostname = "::1";
      }
      assert$1.equal(options.protocol, protocol, "protocol mismatch");
      debug$4("options", options);
      return new RedirectableRequest(options, callback);
    }
    function get2(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get2, configurable: true, enumerable: true, writable: true }
    });
  });
  return exports2;
}
function noop$1() {
}
function parseUrl(input) {
  var parsed;
  if (useNativeURL) {
    parsed = new URL$1(input);
  } else {
    parsed = validateUrl(url.parse(input));
    if (!isString(parsed.protocol)) {
      throw new InvalidUrlError({ input });
    }
  }
  return parsed;
}
function resolveUrl(relative, base) {
  return useNativeURL ? new URL$1(relative, base) : parseUrl(url.resolve(base, relative));
}
function validateUrl(input) {
  if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
    throw new InvalidUrlError({ input: input.href || input });
  }
  if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
    throw new InvalidUrlError({ input: input.href || input });
  }
  return input;
}
function spreadUrlObject(urlObject, target) {
  var spread2 = target || {};
  for (var key of preservedUrlFields) {
    spread2[key] = urlObject[key];
  }
  if (spread2.hostname.startsWith("[")) {
    spread2.hostname = spread2.hostname.slice(1, -1);
  }
  if (spread2.port !== "") {
    spread2.port = Number(spread2.port);
  }
  spread2.path = spread2.search ? spread2.pathname + spread2.search : spread2.pathname;
  return spread2;
}
function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return lastValue === null || typeof lastValue === "undefined" ? void 0 : String(lastValue).trim();
}
function createErrorType(code, message, baseClass) {
  function CustomError(properties) {
    if (isFunction(Error.captureStackTrace)) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.assign(this, properties || {});
    this.code = code;
    this.message = this.cause ? message + ": " + this.cause.message : message;
  }
  CustomError.prototype = new (baseClass || Error)();
  Object.defineProperties(CustomError.prototype, {
    constructor: {
      value: CustomError,
      enumerable: false
    },
    name: {
      value: "Error [" + code + "]",
      enumerable: false
    }
  });
  return CustomError;
}
function destroyRequest(request, error2) {
  for (var event of events) {
    request.removeListener(event, eventHandlers[event]);
  }
  request.on("error", noop$1);
  request.destroy(error2);
}
function isSubdomain(subdomain, domain) {
  assert$1(isString(subdomain) && isString(domain));
  var dot = subdomain.length - domain.length - 1;
  return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}
function isString(value) {
  return typeof value === "string" || value instanceof String;
}
function isFunction(value) {
  return typeof value === "function";
}
function isBuffer(value) {
  return typeof value === "object" && "length" in value;
}
function isURL(value) {
  return URL$1 && value instanceof URL$1;
}
followRedirects$1.exports = wrap({ http, https });
followRedirects$1.exports.wrap = wrap;
var followRedirectsExports = followRedirects$1.exports;
const followRedirects = /* @__PURE__ */ getDefaultExportFromCjs(followRedirectsExports);
const VERSION$1 = "1.8.2";
function parseProtocol(url2) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url2);
  return match && match[1] || "";
}
const DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
function fromDataURI(uri2, asBlob, options) {
  const _Blob = options && options.Blob || platform$1.classes.Blob;
  const protocol = parseProtocol(uri2);
  if (asBlob === void 0 && _Blob) {
    asBlob = true;
  }
  if (protocol === "data") {
    uri2 = protocol.length ? uri2.slice(protocol.length + 1) : uri2;
    const match = DATA_URL_PATTERN.exec(uri2);
    if (!match) {
      throw new AxiosError$1("Invalid URL", AxiosError$1.ERR_INVALID_URL);
    }
    const mime2 = match[1];
    const isBase64 = match[2];
    const body = match[3];
    const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? "base64" : "utf8");
    if (asBlob) {
      if (!_Blob) {
        throw new AxiosError$1("Blob is not supported", AxiosError$1.ERR_NOT_SUPPORT);
      }
      return new _Blob([buffer], { type: mime2 });
    }
    return buffer;
  }
  throw new AxiosError$1("Unsupported protocol " + protocol, AxiosError$1.ERR_NOT_SUPPORT);
}
const kInternals = Symbol("internals");
class AxiosTransformStream extends stream.Transform {
  constructor(options) {
    options = utils$3.toFlatObject(options, {
      maxRate: 0,
      chunkSize: 64 * 1024,
      minChunkSize: 100,
      timeWindow: 500,
      ticksRate: 2,
      samplesCount: 15
    }, null, (prop, source) => {
      return !utils$3.isUndefined(source[prop]);
    });
    super({
      readableHighWaterMark: options.chunkSize
    });
    const internals = this[kInternals] = {
      timeWindow: options.timeWindow,
      chunkSize: options.chunkSize,
      maxRate: options.maxRate,
      minChunkSize: options.minChunkSize,
      bytesSeen: 0,
      isCaptured: false,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };
    this.on("newListener", (event) => {
      if (event === "progress") {
        if (!internals.isCaptured) {
          internals.isCaptured = true;
        }
      }
    });
  }
  _read(size) {
    const internals = this[kInternals];
    if (internals.onReadCallback) {
      internals.onReadCallback();
    }
    return super._read(size);
  }
  _transform(chunk, encoding, callback) {
    const internals = this[kInternals];
    const maxRate = internals.maxRate;
    const readableHighWaterMark = this.readableHighWaterMark;
    const timeWindow = internals.timeWindow;
    const divider = 1e3 / timeWindow;
    const bytesThreshold = maxRate / divider;
    const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;
    const pushChunk = (_chunk, _callback) => {
      const bytes = Buffer.byteLength(_chunk);
      internals.bytesSeen += bytes;
      internals.bytes += bytes;
      internals.isCaptured && this.emit("progress", internals.bytesSeen);
      if (this.push(_chunk)) {
        process.nextTick(_callback);
      } else {
        internals.onReadCallback = () => {
          internals.onReadCallback = null;
          process.nextTick(_callback);
        };
      }
    };
    const transformChunk = (_chunk, _callback) => {
      const chunkSize = Buffer.byteLength(_chunk);
      let chunkRemainder = null;
      let maxChunkSize = readableHighWaterMark;
      let bytesLeft;
      let passed = 0;
      if (maxRate) {
        const now = Date.now();
        if (!internals.ts || (passed = now - internals.ts) >= timeWindow) {
          internals.ts = now;
          bytesLeft = bytesThreshold - internals.bytes;
          internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
          passed = 0;
        }
        bytesLeft = bytesThreshold - internals.bytes;
      }
      if (maxRate) {
        if (bytesLeft <= 0) {
          return setTimeout(() => {
            _callback(null, _chunk);
          }, timeWindow - passed);
        }
        if (bytesLeft < maxChunkSize) {
          maxChunkSize = bytesLeft;
        }
      }
      if (maxChunkSize && chunkSize > maxChunkSize && chunkSize - maxChunkSize > minChunkSize) {
        chunkRemainder = _chunk.subarray(maxChunkSize);
        _chunk = _chunk.subarray(0, maxChunkSize);
      }
      pushChunk(_chunk, chunkRemainder ? () => {
        process.nextTick(_callback, null, chunkRemainder);
      } : _callback);
    };
    transformChunk(chunk, function transformNextChunk(err, _chunk) {
      if (err) {
        return callback(err);
      }
      if (_chunk) {
        transformChunk(_chunk, transformNextChunk);
      } else {
        callback(null);
      }
    });
  }
}
const { asyncIterator } = Symbol;
const readBlob = async function* (blob) {
  if (blob.stream) {
    yield* blob.stream();
  } else if (blob.arrayBuffer) {
    yield await blob.arrayBuffer();
  } else if (blob[asyncIterator]) {
    yield* blob[asyncIterator]();
  } else {
    yield blob;
  }
};
const BOUNDARY_ALPHABET = platform$1.ALPHABET.ALPHA_DIGIT + "-_";
const textEncoder = typeof TextEncoder === "function" ? new TextEncoder() : new require$$1.TextEncoder();
const CRLF = "\r\n";
const CRLF_BYTES = textEncoder.encode(CRLF);
const CRLF_BYTES_COUNT = 2;
class FormDataPart {
  constructor(name, value) {
    const { escapeName } = this.constructor;
    const isStringValue = utils$3.isString(value);
    let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${!isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ""}${CRLF}`;
    if (isStringValue) {
      value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
    } else {
      headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
    }
    this.headers = textEncoder.encode(headers + CRLF);
    this.contentLength = isStringValue ? value.byteLength : value.size;
    this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;
    this.name = name;
    this.value = value;
  }
  async *encode() {
    yield this.headers;
    const { value } = this;
    if (utils$3.isTypedArray(value)) {
      yield value;
    } else {
      yield* readBlob(value);
    }
    yield CRLF_BYTES;
  }
  static escapeName(name) {
    return String(name).replace(/[\r\n"]/g, (match) => ({
      "\r": "%0D",
      "\n": "%0A",
      '"': "%22"
    })[match]);
  }
}
const formDataToStream = (form, headersHandler, options) => {
  const {
    tag = "form-data-boundary",
    size = 25,
    boundary = tag + "-" + platform$1.generateString(size, BOUNDARY_ALPHABET)
  } = options || {};
  if (!utils$3.isFormData(form)) {
    throw TypeError("FormData instance required");
  }
  if (boundary.length < 1 || boundary.length > 70) {
    throw Error("boundary must be 10-70 characters long");
  }
  const boundaryBytes = textEncoder.encode("--" + boundary + CRLF);
  const footerBytes = textEncoder.encode("--" + boundary + "--" + CRLF + CRLF);
  let contentLength = footerBytes.byteLength;
  const parts = Array.from(form.entries()).map(([name, value]) => {
    const part = new FormDataPart(name, value);
    contentLength += part.size;
    return part;
  });
  contentLength += boundaryBytes.byteLength * parts.length;
  contentLength = utils$3.toFiniteNumber(contentLength);
  const computedHeaders = {
    "Content-Type": `multipart/form-data; boundary=${boundary}`
  };
  if (Number.isFinite(contentLength)) {
    computedHeaders["Content-Length"] = contentLength;
  }
  headersHandler && headersHandler(computedHeaders);
  return stream.Readable.from(async function* () {
    for (const part of parts) {
      yield boundaryBytes;
      yield* part.encode();
    }
    yield footerBytes;
  }());
};
class ZlibHeaderTransformStream extends stream.Transform {
  __transform(chunk, encoding, callback) {
    this.push(chunk);
    callback();
  }
  _transform(chunk, encoding, callback) {
    if (chunk.length !== 0) {
      this._transform = this.__transform;
      if (chunk[0] !== 120) {
        const header = Buffer.alloc(2);
        header[0] = 120;
        header[1] = 156;
        this.push(header, encoding);
      }
    }
    this.__transform(chunk, encoding, callback);
  }
}
const callbackify = (fn, reducer) => {
  return utils$3.isAsyncFn(fn) ? function(...args) {
    const cb = args.pop();
    fn.apply(this, args).then((value) => {
      try {
        reducer ? cb(null, ...reducer(value)) : cb(null, value);
      } catch (err) {
        cb(err);
      }
    }, cb);
  } : fn;
};
function speedometer(samplesCount, min2) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min2 = min2 !== void 0 ? min2 : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min2) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
function throttle(fn, freq) {
  let timestamp2 = 0;
  let threshold = 1e3 / freq;
  let lastArgs;
  let timer;
  const invoke = (args, now = Date.now()) => {
    timestamp2 = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  };
  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp2;
    if (passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };
  const flush = () => lastArgs && invoke(lastArgs);
  return [throttled, flush];
}
const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);
  return throttle((e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? "download" : "upload"]: true
    };
    listener(data);
  }, freq);
};
const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;
  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};
const asyncDecorator = (fn) => (...args) => utils$3.asap(() => fn(...args));
const zlibOptions = {
  flush: zlib.constants.Z_SYNC_FLUSH,
  finishFlush: zlib.constants.Z_SYNC_FLUSH
};
const brotliOptions = {
  flush: zlib.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH
};
const isBrotliSupported = utils$3.isFunction(zlib.createBrotliDecompress);
const { http: httpFollow, https: httpsFollow } = followRedirects;
const isHttps = /https:?/;
const supportedProtocols = platform$1.protocols.map((protocol) => {
  return protocol + ":";
});
const flushOnFinish = (stream2, [throttled, flush]) => {
  stream2.on("end", flush).on("error", flush);
  return throttled;
};
function dispatchBeforeRedirect(options, responseDetails) {
  if (options.beforeRedirects.proxy) {
    options.beforeRedirects.proxy(options);
  }
  if (options.beforeRedirects.config) {
    options.beforeRedirects.config(options, responseDetails);
  }
}
function setProxy(options, configProxy, location) {
  let proxy = configProxy;
  if (!proxy && proxy !== false) {
    const proxyUrl = proxyFromEnv.getProxyForUrl(location);
    if (proxyUrl) {
      proxy = new URL(proxyUrl);
    }
  }
  if (proxy) {
    if (proxy.username) {
      proxy.auth = (proxy.username || "") + ":" + (proxy.password || "");
    }
    if (proxy.auth) {
      if (proxy.auth.username || proxy.auth.password) {
        proxy.auth = (proxy.auth.username || "") + ":" + (proxy.auth.password || "");
      }
      const base64 = Buffer.from(proxy.auth, "utf8").toString("base64");
      options.headers["Proxy-Authorization"] = "Basic " + base64;
    }
    options.headers.host = options.hostname + (options.port ? ":" + options.port : "");
    const proxyHost = proxy.hostname || proxy.host;
    options.hostname = proxyHost;
    options.host = proxyHost;
    options.port = proxy.port;
    options.path = location;
    if (proxy.protocol) {
      options.protocol = proxy.protocol.includes(":") ? proxy.protocol : `${proxy.protocol}:`;
    }
  }
  options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
    setProxy(redirectOptions, configProxy, redirectOptions.href);
  };
}
const isHttpAdapterSupported = typeof process !== "undefined" && utils$3.kindOf(process) === "process";
const wrapAsync = (asyncExecutor) => {
  return new Promise((resolve, reject) => {
    let onDone;
    let isDone;
    const done = (value, isRejected) => {
      if (isDone) return;
      isDone = true;
      onDone && onDone(value, isRejected);
    };
    const _resolve = (value) => {
      done(value);
      resolve(value);
    };
    const _reject = (reason) => {
      done(reason, true);
      reject(reason);
    };
    asyncExecutor(_resolve, _reject, (onDoneHandler) => onDone = onDoneHandler).catch(_reject);
  });
};
const resolveFamily = ({ address, family }) => {
  if (!utils$3.isString(address)) {
    throw TypeError("address must be a string");
  }
  return {
    address,
    family: family || (address.indexOf(".") < 0 ? 6 : 4)
  };
};
const buildAddressEntry = (address, family) => resolveFamily(utils$3.isObject(address) ? address : { address, family });
const httpAdapter = isHttpAdapterSupported && function httpAdapter2(config2) {
  return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
    let { data, lookup, family } = config2;
    const { responseType, responseEncoding } = config2;
    const method = config2.method.toUpperCase();
    let isDone;
    let rejected = false;
    let req;
    if (lookup) {
      const _lookup = callbackify(lookup, (value) => utils$3.isArray(value) ? value : [value]);
      lookup = (hostname, opt, cb) => {
        _lookup(hostname, opt, (err, arg0, arg1) => {
          if (err) {
            return cb(err);
          }
          const addresses = utils$3.isArray(arg0) ? arg0.map((addr) => buildAddressEntry(addr)) : [buildAddressEntry(arg0, arg1)];
          opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
        });
      };
    }
    const emitter = new require$$0$4.EventEmitter();
    const onFinished = () => {
      if (config2.cancelToken) {
        config2.cancelToken.unsubscribe(abort2);
      }
      if (config2.signal) {
        config2.signal.removeEventListener("abort", abort2);
      }
      emitter.removeAllListeners();
    };
    onDone((value, isRejected) => {
      isDone = true;
      if (isRejected) {
        rejected = true;
        onFinished();
      }
    });
    function abort2(reason) {
      emitter.emit("abort", !reason || reason.type ? new CanceledError$1(null, config2, req) : reason);
    }
    emitter.once("abort", reject);
    if (config2.cancelToken || config2.signal) {
      config2.cancelToken && config2.cancelToken.subscribe(abort2);
      if (config2.signal) {
        config2.signal.aborted ? abort2() : config2.signal.addEventListener("abort", abort2);
      }
    }
    const fullPath = buildFullPath(config2.baseURL, config2.url, config2.allowAbsoluteUrls);
    const parsed = new URL(fullPath, platform$1.hasBrowserEnv ? platform$1.origin : void 0);
    const protocol = parsed.protocol || supportedProtocols[0];
    if (protocol === "data:") {
      let convertedData;
      if (method !== "GET") {
        return settle(resolve, reject, {
          status: 405,
          statusText: "method not allowed",
          headers: {},
          config: config2
        });
      }
      try {
        convertedData = fromDataURI(config2.url, responseType === "blob", {
          Blob: config2.env && config2.env.Blob
        });
      } catch (err) {
        throw AxiosError$1.from(err, AxiosError$1.ERR_BAD_REQUEST, config2);
      }
      if (responseType === "text") {
        convertedData = convertedData.toString(responseEncoding);
        if (!responseEncoding || responseEncoding === "utf8") {
          convertedData = utils$3.stripBOM(convertedData);
        }
      } else if (responseType === "stream") {
        convertedData = stream.Readable.from(convertedData);
      }
      return settle(resolve, reject, {
        data: convertedData,
        status: 200,
        statusText: "OK",
        headers: new AxiosHeaders$1(),
        config: config2
      });
    }
    if (supportedProtocols.indexOf(protocol) === -1) {
      return reject(new AxiosError$1(
        "Unsupported protocol " + protocol,
        AxiosError$1.ERR_BAD_REQUEST,
        config2
      ));
    }
    const headers = AxiosHeaders$1.from(config2.headers).normalize();
    headers.set("User-Agent", "axios/" + VERSION$1, false);
    const { onUploadProgress, onDownloadProgress } = config2;
    const maxRate = config2.maxRate;
    let maxUploadRate = void 0;
    let maxDownloadRate = void 0;
    if (utils$3.isSpecCompliantForm(data)) {
      const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);
      data = formDataToStream(data, (formHeaders) => {
        headers.set(formHeaders);
      }, {
        tag: `axios-${VERSION$1}-boundary`,
        boundary: userBoundary && userBoundary[1] || void 0
      });
    } else if (utils$3.isFormData(data) && utils$3.isFunction(data.getHeaders)) {
      headers.set(data.getHeaders());
      if (!headers.hasContentLength()) {
        try {
          const knownLength = await require$$1.promisify(data.getLength).call(data);
          Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
        } catch (e) {
        }
      }
    } else if (utils$3.isBlob(data) || utils$3.isFile(data)) {
      data.size && headers.setContentType(data.type || "application/octet-stream");
      headers.setContentLength(data.size || 0);
      data = stream.Readable.from(readBlob(data));
    } else if (data && !utils$3.isStream(data)) {
      if (Buffer.isBuffer(data)) ;
      else if (utils$3.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils$3.isString(data)) {
        data = Buffer.from(data, "utf-8");
      } else {
        return reject(new AxiosError$1(
          "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
          AxiosError$1.ERR_BAD_REQUEST,
          config2
        ));
      }
      headers.setContentLength(data.length, false);
      if (config2.maxBodyLength > -1 && data.length > config2.maxBodyLength) {
        return reject(new AxiosError$1(
          "Request body larger than maxBodyLength limit",
          AxiosError$1.ERR_BAD_REQUEST,
          config2
        ));
      }
    }
    const contentLength = utils$3.toFiniteNumber(headers.getContentLength());
    if (utils$3.isArray(maxRate)) {
      maxUploadRate = maxRate[0];
      maxDownloadRate = maxRate[1];
    } else {
      maxUploadRate = maxDownloadRate = maxRate;
    }
    if (data && (onUploadProgress || maxUploadRate)) {
      if (!utils$3.isStream(data)) {
        data = stream.Readable.from(data, { objectMode: false });
      }
      data = stream.pipeline([data, new AxiosTransformStream({
        maxRate: utils$3.toFiniteNumber(maxUploadRate)
      })], utils$3.noop);
      onUploadProgress && data.on("progress", flushOnFinish(
        data,
        progressEventDecorator(
          contentLength,
          progressEventReducer(asyncDecorator(onUploadProgress), false, 3)
        )
      ));
    }
    let auth = void 0;
    if (config2.auth) {
      const username = config2.auth.username || "";
      const password = config2.auth.password || "";
      auth = username + ":" + password;
    }
    if (!auth && parsed.username) {
      const urlUsername = parsed.username;
      const urlPassword = parsed.password;
      auth = urlUsername + ":" + urlPassword;
    }
    auth && headers.delete("authorization");
    let path2;
    try {
      path2 = buildURL(
        parsed.pathname + parsed.search,
        config2.params,
        config2.paramsSerializer
      ).replace(/^\?/, "");
    } catch (err) {
      const customErr = new Error(err.message);
      customErr.config = config2;
      customErr.url = config2.url;
      customErr.exists = true;
      return reject(customErr);
    }
    headers.set(
      "Accept-Encoding",
      "gzip, compress, deflate" + (isBrotliSupported ? ", br" : ""),
      false
    );
    const options = {
      path: path2,
      method,
      headers: headers.toJSON(),
      agents: { http: config2.httpAgent, https: config2.httpsAgent },
      auth,
      protocol,
      family,
      beforeRedirect: dispatchBeforeRedirect,
      beforeRedirects: {}
    };
    !utils$3.isUndefined(lookup) && (options.lookup = lookup);
    if (config2.socketPath) {
      options.socketPath = config2.socketPath;
    } else {
      options.hostname = parsed.hostname.startsWith("[") ? parsed.hostname.slice(1, -1) : parsed.hostname;
      options.port = parsed.port;
      setProxy(options, config2.proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path);
    }
    let transport;
    const isHttpsRequest = isHttps.test(options.protocol);
    options.agent = isHttpsRequest ? config2.httpsAgent : config2.httpAgent;
    if (config2.transport) {
      transport = config2.transport;
    } else if (config2.maxRedirects === 0) {
      transport = isHttpsRequest ? require$$4$1 : require$$3;
    } else {
      if (config2.maxRedirects) {
        options.maxRedirects = config2.maxRedirects;
      }
      if (config2.beforeRedirect) {
        options.beforeRedirects.config = config2.beforeRedirect;
      }
      transport = isHttpsRequest ? httpsFollow : httpFollow;
    }
    if (config2.maxBodyLength > -1) {
      options.maxBodyLength = config2.maxBodyLength;
    } else {
      options.maxBodyLength = Infinity;
    }
    if (config2.insecureHTTPParser) {
      options.insecureHTTPParser = config2.insecureHTTPParser;
    }
    req = transport.request(options, function handleResponse(res) {
      if (req.destroyed) return;
      const streams = [res];
      const responseLength = +res.headers["content-length"];
      if (onDownloadProgress || maxDownloadRate) {
        const transformStream = new AxiosTransformStream({
          maxRate: utils$3.toFiniteNumber(maxDownloadRate)
        });
        onDownloadProgress && transformStream.on("progress", flushOnFinish(
          transformStream,
          progressEventDecorator(
            responseLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true, 3)
          )
        ));
        streams.push(transformStream);
      }
      let responseStream = res;
      const lastRequest = res.req || req;
      if (config2.decompress !== false && res.headers["content-encoding"]) {
        if (method === "HEAD" || res.statusCode === 204) {
          delete res.headers["content-encoding"];
        }
        switch ((res.headers["content-encoding"] || "").toLowerCase()) {
          case "gzip":
          case "x-gzip":
          case "compress":
          case "x-compress":
            streams.push(zlib.createUnzip(zlibOptions));
            delete res.headers["content-encoding"];
            break;
          case "deflate":
            streams.push(new ZlibHeaderTransformStream());
            streams.push(zlib.createUnzip(zlibOptions));
            delete res.headers["content-encoding"];
            break;
          case "br":
            if (isBrotliSupported) {
              streams.push(zlib.createBrotliDecompress(brotliOptions));
              delete res.headers["content-encoding"];
            }
        }
      }
      responseStream = streams.length > 1 ? stream.pipeline(streams, utils$3.noop) : streams[0];
      const offListeners = stream.finished(responseStream, () => {
        offListeners();
        onFinished();
      });
      const response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: new AxiosHeaders$1(res.headers),
        config: config2,
        request: lastRequest
      };
      if (responseType === "stream") {
        response.data = responseStream;
        settle(resolve, reject, response);
      } else {
        const responseBuffer = [];
        let totalResponseBytes = 0;
        responseStream.on("data", function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;
          if (config2.maxContentLength > -1 && totalResponseBytes > config2.maxContentLength) {
            rejected = true;
            responseStream.destroy();
            reject(new AxiosError$1(
              "maxContentLength size of " + config2.maxContentLength + " exceeded",
              AxiosError$1.ERR_BAD_RESPONSE,
              config2,
              lastRequest
            ));
          }
        });
        responseStream.on("aborted", function handlerStreamAborted() {
          if (rejected) {
            return;
          }
          const err = new AxiosError$1(
            "stream has been aborted",
            AxiosError$1.ERR_BAD_RESPONSE,
            config2,
            lastRequest
          );
          responseStream.destroy(err);
          reject(err);
        });
        responseStream.on("error", function handleStreamError(err) {
          if (req.destroyed) return;
          reject(AxiosError$1.from(err, null, config2, lastRequest));
        });
        responseStream.on("end", function handleStreamEnd() {
          try {
            let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
            if (responseType !== "arraybuffer") {
              responseData = responseData.toString(responseEncoding);
              if (!responseEncoding || responseEncoding === "utf8") {
                responseData = utils$3.stripBOM(responseData);
              }
            }
            response.data = responseData;
          } catch (err) {
            return reject(AxiosError$1.from(err, null, config2, response.request, response));
          }
          settle(resolve, reject, response);
        });
      }
      emitter.once("abort", (err) => {
        if (!responseStream.destroyed) {
          responseStream.emit("error", err);
          responseStream.destroy();
        }
      });
    });
    emitter.once("abort", (err) => {
      reject(err);
      req.destroy(err);
    });
    req.on("error", function handleRequestError(err) {
      reject(AxiosError$1.from(err, null, config2, req));
    });
    req.on("socket", function handleRequestSocket(socket) {
      socket.setKeepAlive(true, 1e3 * 60);
    });
    if (config2.timeout) {
      const timeout = parseInt(config2.timeout, 10);
      if (Number.isNaN(timeout)) {
        reject(new AxiosError$1(
          "error trying to parse `config.timeout` to int",
          AxiosError$1.ERR_BAD_OPTION_VALUE,
          config2,
          req
        ));
        return;
      }
      req.setTimeout(timeout, function handleRequestTimeout() {
        if (isDone) return;
        let timeoutErrorMessage = config2.timeout ? "timeout of " + config2.timeout + "ms exceeded" : "timeout exceeded";
        const transitional2 = config2.transitional || transitionalDefaults;
        if (config2.timeoutErrorMessage) {
          timeoutErrorMessage = config2.timeoutErrorMessage;
        }
        reject(new AxiosError$1(
          timeoutErrorMessage,
          transitional2.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
          config2,
          req
        ));
        abort2();
      });
    }
    if (utils$3.isStream(data)) {
      let ended = false;
      let errored = false;
      data.on("end", () => {
        ended = true;
      });
      data.once("error", (err) => {
        errored = true;
        req.destroy(err);
      });
      data.on("close", () => {
        if (!ended && !errored) {
          abort2(new CanceledError$1("Request stream has been aborted", config2, req));
        }
      });
      data.pipe(req);
    } else {
      req.end(data);
    }
  });
};
const isURLSameOrigin = platform$1.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url2) => {
  url2 = new URL(url2, platform$1.origin);
  return origin2.protocol === url2.protocol && origin2.host === url2.host && (isMSIE || origin2.port === url2.port);
})(
  new URL(platform$1.origin),
  platform$1.navigator && /(msie|trident)/i.test(platform$1.navigator.userAgent)
) : () => true;
const cookies = platform$1.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path2, domain, secure) {
      const cookie = [name + "=" + encodeURIComponent(value)];
      utils$3.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
      utils$3.isString(path2) && cookie.push("path=" + path2);
      utils$3.isString(domain) && cookie.push("domain=" + domain);
      secure === true && cookie.push("secure");
      document.cookie = cookie.join("; ");
    },
    read(name) {
      const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove(name) {
      this.write(name, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;
function mergeConfig$1(config1, config2) {
  config2 = config2 || {};
  const config3 = {};
  function getMergedValue(target, source, prop, caseless) {
    if (utils$3.isPlainObject(target) && utils$3.isPlainObject(source)) {
      return utils$3.merge.call({ caseless }, target, source);
    } else if (utils$3.isPlainObject(source)) {
      return utils$3.merge({}, source);
    } else if (utils$3.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, prop, caseless) {
    if (!utils$3.isUndefined(b)) {
      return getMergedValue(a, b, prop, caseless);
    } else if (!utils$3.isUndefined(a)) {
      return getMergedValue(void 0, a, prop, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils$3.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils$3.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils$3.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
  };
  utils$3.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils$3.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config3[prop] = configValue);
  });
  return config3;
}
const resolveConfig = (config2) => {
  const newConfig = mergeConfig$1({}, config2);
  let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
  newConfig.headers = headers = AxiosHeaders$1.from(headers);
  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url), config2.params, config2.paramsSerializer);
  if (auth) {
    headers.set(
      "Authorization",
      "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
    );
  }
  let contentType;
  if (utils$3.isFormData(data)) {
    if (platform$1.hasStandardBrowserEnv || platform$1.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(void 0);
    } else if ((contentType = headers.getContentType()) !== false) {
      const [type2, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
      headers.setContentType([type2 || "multipart/form-data", ...tokens].join("; "));
    }
  }
  if (platform$1.hasStandardBrowserEnv) {
    withXSRFToken && utils$3.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
    if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
const xhrAdapter = isXHRAdapterSupported && function(config2) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config2);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let { responseType, onUploadProgress, onDownloadProgress } = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;
    function done() {
      flushUpload && flushUpload();
      flushDownload && flushDownload();
      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
      _config.signal && _config.signal.removeEventListener("abort", onCanceled);
    }
    let request = new XMLHttpRequest();
    request.open(_config.method.toUpperCase(), _config.url, true);
    request.timeout = _config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders$1.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config2,
        request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError$1("Request aborted", AxiosError$1.ECONNABORTED, config2, request));
      request = null;
    };
    request.onerror = function handleError2() {
      reject(new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config2, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError$1(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
        config2,
        request
      ));
      request = null;
    };
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils$3.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils$3.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = _config.responseType;
    }
    if (onDownloadProgress) {
      [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
      request.addEventListener("progress", downloadThrottled);
    }
    if (onUploadProgress && request.upload) {
      [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
      request.upload.addEventListener("progress", uploadThrottled);
      request.upload.addEventListener("loadend", flushUpload);
    }
    if (_config.cancelToken || _config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError$1(null, config2, request) : cancel);
        request.abort();
        request = null;
      };
      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(_config.url);
    if (protocol && platform$1.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError$1("Unsupported protocol " + protocol + ":", AxiosError$1.ERR_BAD_REQUEST, config2));
      return;
    }
    request.send(requestData || null);
  });
};
const composeSignals = (signals, timeout) => {
  const { length } = signals = signals ? signals.filter(Boolean) : [];
  if (timeout || length) {
    let controller = new AbortController();
    let aborted;
    const onabort = function(reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
      }
    };
    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError$1(`timeout ${timeout} of ms exceeded`, AxiosError$1.ETIMEDOUT));
    }, timeout);
    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach((signal2) => {
          signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
        });
        signals = null;
      }
    };
    signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
    const { signal } = controller;
    signal.unsubscribe = () => utils$3.asap(unsubscribe);
    return signal;
  }
};
const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end;
  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};
const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};
const readStream = async function* (stream2) {
  if (stream2[Symbol.asyncIterator]) {
    yield* stream2;
    return;
  }
  const reader = stream2.getReader();
  try {
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};
const trackStream = (stream2, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream2, chunkSize);
  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done: done2, value } = await iterator.next();
        if (done2) {
          _onFinish();
          controller.close();
          return;
        }
        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  });
};
const isFetchSupported = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === "function";
const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str2) => encoder.encode(str2))(new TextEncoder()) : async (str2) => new Uint8Array(await new Response(str2).arrayBuffer()));
const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false;
  }
};
const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;
  const hasContentType = new Request(platform$1.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      duplexAccessed = true;
      return "half";
    }
  }).headers.has("Content-Type");
  return duplexAccessed && !hasContentType;
});
const DEFAULT_CHUNK_SIZE = 64 * 1024;
const supportsResponseStream = isReadableStreamSupported && test(() => utils$3.isReadableStream(new Response("").body));
const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};
isFetchSupported && ((res) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type2) => {
    !resolvers[type2] && (resolvers[type2] = utils$3.isFunction(res[type2]) ? (res2) => res2[type2]() : (_, config2) => {
      throw new AxiosError$1(`Response type '${type2}' is not supported`, AxiosError$1.ERR_NOT_SUPPORT, config2);
    });
  });
})(new Response());
const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }
  if (utils$3.isBlob(body)) {
    return body.size;
  }
  if (utils$3.isSpecCompliantForm(body)) {
    const _request = new Request(platform$1.origin, {
      method: "POST",
      body
    });
    return (await _request.arrayBuffer()).byteLength;
  }
  if (utils$3.isArrayBufferView(body) || utils$3.isArrayBuffer(body)) {
    return body.byteLength;
  }
  if (utils$3.isURLSearchParams(body)) {
    body = body + "";
  }
  if (utils$3.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};
const resolveBodyLength = async (headers, body) => {
  const length = utils$3.toFiniteNumber(headers.getContentLength());
  return length == null ? getBodyLength(body) : length;
};
const fetchAdapter = isFetchSupported && (async (config2) => {
  let {
    url: url2,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = "same-origin",
    fetchOptions
  } = resolveConfig(config2);
  responseType = responseType ? (responseType + "").toLowerCase() : "text";
  let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
  let request;
  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
    composedSignal.unsubscribe();
  });
  let requestContentLength;
  try {
    if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
      let _request = new Request(url2, {
        method: "POST",
        body: data,
        duplex: "half"
      });
      let contentTypeHeader;
      if (utils$3.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
        headers.setContentType(contentTypeHeader);
      }
      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );
        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }
    if (!utils$3.isString(withCredentials)) {
      withCredentials = withCredentials ? "include" : "omit";
    }
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url2, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : void 0
    });
    let response = await fetch(request);
    const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
    if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
      const options = {};
      ["status", "statusText", "headers"].forEach((prop) => {
        options[prop] = response[prop];
      });
      const responseContentLength = utils$3.toFiniteNumber(response.headers.get("content-length"));
      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];
      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }
    responseType = responseType || "text";
    let responseData = await resolvers[utils$3.findKey(resolvers, responseType) || "text"](response, config2);
    !isStreamResponse && unsubscribe && unsubscribe();
    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: AxiosHeaders$1.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config: config2,
        request
      });
    });
  } catch (err) {
    unsubscribe && unsubscribe();
    if (err && err.name === "TypeError" && /fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config2, request),
        {
          cause: err.cause || err
        }
      );
    }
    throw AxiosError$1.from(err, err && err.code, config2, request);
  }
});
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: fetchAdapter
};
utils$3.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
const renderReason = (reason) => `- ${reason}`;
const isResolvedHandle = (adapter) => utils$3.isFunction(adapter) || adapter === null || adapter === false;
const adapters = {
  getAdapter: (adapters2) => {
    adapters2 = utils$3.isArray(adapters2) ? adapters2 : [adapters2];
    const { length } = adapters2;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters2[i];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError$1(`Unknown adapter '${id}'`);
        }
      }
      if (adapter) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state2]) => `adapter ${id} ` + (state2 === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError$1(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter;
  },
  adapters: knownAdapters
};
function throwIfCancellationRequested(config2) {
  if (config2.cancelToken) {
    config2.cancelToken.throwIfRequested();
  }
  if (config2.signal && config2.signal.aborted) {
    throw new CanceledError$1(null, config2);
  }
}
function dispatchRequest(config2) {
  throwIfCancellationRequested(config2);
  config2.headers = AxiosHeaders$1.from(config2.headers);
  config2.data = transformData.call(
    config2,
    config2.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config2.method) !== -1) {
    config2.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters.getAdapter(config2.adapter || defaults$1.adapter);
  return adapter(config2).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config2);
    response.data = transformData.call(
      config2,
      config2.transformResponse,
      response
    );
    response.headers = AxiosHeaders$1.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel$1(reason)) {
      throwIfCancellationRequested(config2);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config2,
          config2.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}
const validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type2, i) => {
  validators$1[type2] = function validator2(thing) {
    return typeof thing === type2 || "a" + (i < 1 ? "n " : " ") + type2;
  };
});
const deprecatedWarnings = {};
validators$1.transitional = function transitional(validator2, version2, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator2 === false) {
      throw new AxiosError$1(
        formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
        AxiosError$1.ERR_DEPRECATED
      );
    }
    if (version2 && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version2 + " and will be removed in the near future"
        )
      );
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
validators$1.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  };
};
function assertOptions(options, schema2, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError$1("options must be an object", AxiosError$1.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator2 = schema2[opt];
    if (validator2) {
      const value = options[opt];
      const result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new AxiosError$1("option " + opt + " must be " + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError$1("Unknown option " + opt, AxiosError$1.ERR_BAD_OPTION);
    }
  }
}
const validator = {
  assertOptions,
  validators: validators$1
};
const validators = validator.validators;
let Axios$1 = class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config2) {
    try {
      return await this._request(configOrUrl, config2);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};
        Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        try {
          if (!err.stack) {
            err.stack = stack;
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
            err.stack += "\n" + stack;
          }
        } catch (e) {
        }
      }
      throw err;
    }
  }
  _request(configOrUrl, config2) {
    if (typeof configOrUrl === "string") {
      config2 = config2 || {};
      config2.url = configOrUrl;
    } else {
      config2 = configOrUrl || {};
    }
    config2 = mergeConfig$1(this.defaults, config2);
    const { transitional: transitional2, paramsSerializer, headers } = config2;
    if (transitional2 !== void 0) {
      validator.assertOptions(transitional2, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils$3.isFunction(paramsSerializer)) {
        config2.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }
    if (config2.allowAbsoluteUrls !== void 0) ;
    else if (this.defaults.allowAbsoluteUrls !== void 0) {
      config2.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config2.allowAbsoluteUrls = true;
    }
    validator.assertOptions(config2, {
      baseUrl: validators.spelling("baseURL"),
      withXsrfToken: validators.spelling("withXSRFToken")
    }, true);
    config2.method = (config2.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils$3.merge(
      headers.common,
      headers[config2.method]
    );
    headers && utils$3.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config2.headers = AxiosHeaders$1.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config2) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config2);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config2;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error2) {
        onRejected.call(this, error2);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error2) {
      return Promise.reject(error2);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config2) {
    config2 = mergeConfig$1(this.defaults, config2);
    const fullPath = buildFullPath(config2.baseURL, config2.url, config2.allowAbsoluteUrls);
    return buildURL(fullPath, config2.params, config2.paramsSerializer);
  }
};
utils$3.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios$1.prototype[method] = function(url2, config2) {
    return this.request(mergeConfig$1(config2 || {}, {
      method,
      url: url2,
      data: (config2 || {}).data
    }));
  };
});
utils$3.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url2, data, config2) {
      return this.request(mergeConfig$1(config2 || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: url2,
        data
      }));
    };
  }
  Axios$1.prototype[method] = generateHTTPMethod();
  Axios$1.prototype[method + "Form"] = generateHTTPMethod(true);
});
let CancelToken$1 = class CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners) return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config2, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError$1(message, config2, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  toAbortSignal() {
    const controller = new AbortController();
    const abort2 = (err) => {
      controller.abort(err);
    };
    this.subscribe(abort2);
    controller.signal.unsubscribe = () => this.unsubscribe(abort2);
    return controller.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
};
function spread$1(callback) {
  return function wrap2(arr) {
    return callback.apply(null, arr);
  };
}
function isAxiosError$1(payload) {
  return utils$3.isObject(payload) && payload.isAxiosError === true;
}
const HttpStatusCode$1 = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
  HttpStatusCode$1[value] = key;
});
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind$1(Axios$1.prototype.request, context);
  utils$3.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
  utils$3.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
  };
  return instance;
}
const axios = createInstance(defaults$1);
axios.Axios = Axios$1;
axios.CanceledError = CanceledError$1;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel$1;
axios.VERSION = VERSION$1;
axios.toFormData = toFormData$1;
axios.AxiosError = AxiosError$1;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread$1;
axios.isAxiosError = isAxiosError$1;
axios.mergeConfig = mergeConfig$1;
axios.AxiosHeaders = AxiosHeaders$1;
axios.formToJSON = (thing) => formDataToJSON(utils$3.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters.getAdapter;
axios.HttpStatusCode = HttpStatusCode$1;
axios.default = axios;
const {
  Axios: Axios2,
  AxiosError,
  CanceledError,
  isCancel,
  CancelToken: CancelToken2,
  VERSION,
  all: all2,
  Cancel,
  isAxiosError,
  spread,
  toFormData,
  AxiosHeaders: AxiosHeaders2,
  HttpStatusCode,
  formToJSON,
  getAdapter,
  mergeConfig
} = axios;
function initializeIpcHandlers(deps) {
  console.log("Initializing IPC handlers");
  require$$1$4.ipcMain.handle("update-content-dimensions", (_event, dimensions) => {
    deps.setWindowDimensions(dimensions.width, dimensions.height);
  });
  require$$1$4.ipcMain.handle("test-local-ai", async (_event, config2) => {
    try {
      const testPrompt = "Say 'Hello, I am working correctly!' if you can read this message.";
      let response;
      if (config2.provider === "ollama") {
        response = await axios.post(config2.endpoint, {
          model: config2.model,
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: testPrompt }
          ],
          stream: false
        });
        if (response.data && response.data.message && response.data.message.content) {
          return { success: true, message: response.data.message.content };
        } else {
          return { success: false, error: "Unexpected response format from Ollama" };
        }
      } else if (config2.provider === "lmstudio") {
        const headers = {
          "Content-Type": "application/json"
        };
        if (config2.apiKey) {
          headers["Authorization"] = `Bearer ${config2.apiKey}`;
        }
        response = await axios.post(config2.endpoint, {
          model: config2.model,
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: testPrompt }
          ],
          temperature: 0.7,
          max_tokens: 100
        }, { headers });
        if (response.data && response.data.choices && response.data.choices.length > 0) {
          return { success: true, message: response.data.choices[0].message.content };
        } else {
          return { success: false, error: "Unexpected response format from LMStudio" };
        }
      } else if (config2.provider === "custom") {
        const headers = {
          "Content-Type": "application/json"
        };
        if (config2.apiKey) {
          headers["Authorization"] = `Bearer ${config2.apiKey}`;
        }
        response = await axios.post(config2.endpoint, {
          model: config2.model,
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: testPrompt }
          ],
          temperature: 0.7,
          max_tokens: 100
        }, { headers });
        if (response.data) {
          if (response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
            return { success: true, message: response.data.choices[0].message.content };
          } else if (response.data.message && response.data.message.content) {
            return { success: true, message: response.data.message.content };
          } else if (response.data.content) {
            return { success: true, message: response.data.content };
          } else if (typeof response.data === "string") {
            return { success: true, message: response.data };
          }
        }
        return { success: false, error: "Could not parse response from custom endpoint" };
      } else {
        return { success: false, error: `Unsupported provider: ${config2.provider}` };
      }
    } catch (error2) {
      console.error("Error testing local AI:", error2);
      return {
        success: false,
        error: error2 instanceof Error ? error2.message : "Unknown error occurred"
      };
    }
  });
  require$$1$4.ipcMain.handle("get-screenshot-queue", () => {
    return deps.getScreenshotQueue();
  });
  require$$1$4.ipcMain.handle("get-extra-screenshot-queue", () => {
    return deps.getExtraScreenshotQueue();
  });
  require$$1$4.ipcMain.handle("delete-screenshot", async (event, path2) => {
    return deps.deleteScreenshot(path2);
  });
  require$$1$4.ipcMain.handle("get-image-preview", async (event, path2) => {
    return deps.getImagePreview(path2);
  });
  require$$1$4.ipcMain.handle("process-screenshots", async () => {
    var _a;
    await ((_a = deps.processingHelper) == null ? void 0 : _a.processScreenshots());
  });
  require$$1$4.ipcMain.handle("get-screenshots", async () => {
    try {
      let previews = [];
      const currentView = deps.getView();
      if (currentView === "queue") {
        const queue = deps.getScreenshotQueue();
        previews = await Promise.all(
          queue.map(async (path2) => ({
            path: path2,
            preview: await deps.getImagePreview(path2)
          }))
        );
      } else {
        const extraQueue = deps.getExtraScreenshotQueue();
        previews = await Promise.all(
          extraQueue.map(async (path2) => ({
            path: path2,
            preview: await deps.getImagePreview(path2)
          }))
        );
      }
      return previews;
    } catch (error2) {
      console.error("Error getting screenshots:", error2);
      throw error2;
    }
  });
  require$$1$4.ipcMain.handle("trigger-screenshot", async () => {
    const mainWindow = deps.getMainWindow();
    if (mainWindow) {
      try {
        const screenshotPath = await deps.takeScreenshot();
        const preview = await deps.getImagePreview(screenshotPath);
        mainWindow.webContents.send("screenshot-taken", {
          path: screenshotPath,
          preview
        });
        return { success: true };
      } catch (error2) {
        console.error("Error triggering screenshot:", error2);
        return { error: "Failed to trigger screenshot" };
      }
    }
    return { error: "No main window available" };
  });
  require$$1$4.ipcMain.handle("take-screenshot", async () => {
    try {
      const screenshotPath = await deps.takeScreenshot();
      const preview = await deps.getImagePreview(screenshotPath);
      return { path: screenshotPath, preview };
    } catch (error2) {
      console.error("Error taking screenshot:", error2);
      return { error: "Failed to take screenshot" };
    }
  });
  require$$1$4.ipcMain.handle("get-pkce-verifier", () => {
    return require$$0$2.randomBytes(32).toString("base64url");
  });
  require$$1$4.ipcMain.handle("open-external-url", (event, url2) => {
    require$$1$4.shell.openExternal(url2);
  });
  require$$1$4.ipcMain.handle("open-settings-portal", () => {
    require$$1$4.shell.openExternal("https://www.interviewcoder.co/settings");
  });
  require$$1$4.ipcMain.handle("toggle-window", () => {
    try {
      deps.toggleMainWindow();
      return { success: true };
    } catch (error2) {
      console.error("Error toggling window:", error2);
      return { error: "Failed to toggle window" };
    }
  });
  require$$1$4.ipcMain.handle("reset-queues", async () => {
    try {
      deps.clearQueues();
      return { success: true };
    } catch (error2) {
      console.error("Error resetting queues:", error2);
      return { error: "Failed to reset queues" };
    }
  });
  require$$1$4.ipcMain.handle("trigger-process-screenshots", async () => {
    var _a;
    try {
      await ((_a = deps.processingHelper) == null ? void 0 : _a.processScreenshots());
      return { success: true };
    } catch (error2) {
      console.error("Error processing screenshots:", error2);
      return { error: "Failed to process screenshots" };
    }
  });
  require$$1$4.ipcMain.handle("trigger-reset", () => {
    var _a;
    try {
      (_a = deps.processingHelper) == null ? void 0 : _a.cancelOngoingRequests();
      deps.clearQueues();
      deps.setView("queue");
      const mainWindow = deps.getMainWindow();
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("reset-view");
        mainWindow.webContents.send("reset");
      }
      return { success: true };
    } catch (error2) {
      console.error("Error triggering reset:", error2);
      return { error: "Failed to trigger reset" };
    }
  });
  require$$1$4.ipcMain.handle("trigger-move-left", () => {
    try {
      deps.moveWindowLeft();
      return { success: true };
    } catch (error2) {
      console.error("Error moving window left:", error2);
      return { error: "Failed to move window left" };
    }
  });
  require$$1$4.ipcMain.handle("trigger-move-right", () => {
    try {
      deps.moveWindowRight();
      return { success: true };
    } catch (error2) {
      console.error("Error moving window right:", error2);
      return { error: "Failed to move window right" };
    }
  });
  require$$1$4.ipcMain.handle("trigger-move-up", () => {
    try {
      deps.moveWindowUp();
      return { success: true };
    } catch (error2) {
      console.error("Error moving window up:", error2);
      return { error: "Failed to move window up" };
    }
  });
  require$$1$4.ipcMain.handle("trigger-move-down", () => {
    try {
      deps.moveWindowDown();
      return { success: true };
    } catch (error2) {
      console.error("Error moving window down:", error2);
      return { error: "Failed to move window down" };
    }
  });
  require$$1$4.ipcMain.handle("test-local-ai-connection", async (_event, config2) => {
    console.log("Testing local AI connection with config:", config2);
    try {
      if (config2.provider === "lmstudio") {
        try {
          const baseUrl = config2.endpoint.split("/v1")[0];
          const modelsUrl = `${baseUrl}/v1/models`;
          console.log(`Testing LM Studio models endpoint: ${modelsUrl}`);
          const modelsResponse = await axios.get(modelsUrl, {
            timeout: 5e3,
            headers: { "Content-Type": "application/json" }
          });
          console.log("LM Studio models response:", modelsResponse.data);
          const chatResponse = await axios.post(
            config2.endpoint,
            {
              model: config2.model || "llama-3.2-3b-instruct",
              messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Say hello" }
              ],
              temperature: 0.7,
              max_tokens: 100
            },
            {
              timeout: 3e4,
              headers: { "Content-Type": "application/json" }
            }
          );
          console.log("LM Studio chat response:", chatResponse.data);
          return {
            success: true,
            message: "Successfully connected to LM Studio",
            models: modelsResponse.data,
            response: chatResponse.data
          };
        } catch (error2) {
          console.error("Error testing LM Studio connection:", error2);
          if (config2.endpoint.includes("/v1/chat/completions")) {
            try {
              const alternativeEndpoint = config2.endpoint.replace("/v1/chat/completions", "/v1/completions");
              console.log(`Trying alternative endpoint: ${alternativeEndpoint}`);
              const altResponse = await axios.post(
                alternativeEndpoint,
                {
                  model: config2.model || "llama-3.2-3b-instruct",
                  prompt: "You are a helpful assistant.\n\nUser: Say hello\n\nAssistant:",
                  temperature: 0.7,
                  max_tokens: 100
                },
                {
                  timeout: 1e4,
                  headers: { "Content-Type": "application/json" }
                }
              );
              console.log("Alternative endpoint response:", altResponse.data);
              return {
                success: true,
                message: "Successfully connected to LM Studio using alternative endpoint",
                response: altResponse.data
              };
            } catch (altError) {
              console.error("Error with alternative endpoint:", altError);
              throw error2;
            }
          } else {
            throw error2;
          }
        }
      } else if (config2.provider === "ollama") {
        const response = await axios.post(
          config2.endpoint,
          {
            model: config2.model || "llama3",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: "Say hello" }
            ],
            stream: false
          },
          {
            timeout: 1e4,
            headers: { "Content-Type": "application/json" }
          }
        );
        console.log("Ollama response:", response.data);
        return {
          success: true,
          message: "Successfully connected to Ollama",
          response: response.data
        };
      } else {
        const response = await axios.post(
          config2.endpoint,
          {
            model: config2.model || "model",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: "Say hello" }
            ],
            temperature: 0.7,
            max_tokens: 100
          },
          {
            timeout: 1e4,
            headers: {
              "Content-Type": "application/json",
              ...config2.apiKey ? { "Authorization": `Bearer ${config2.apiKey}` } : {}
            }
          }
        );
        console.log("Custom endpoint response:", response.data);
        return {
          success: true,
          message: "Successfully connected to custom endpoint",
          response: response.data
        };
      }
    } catch (error2) {
      console.error("Error testing local AI connection:", error2);
      let errorMessage = "Failed to connect to local AI service";
      if (axios.isAxiosError(error2)) {
        if (error2.code === "ECONNREFUSED") {
          errorMessage = `Connection refused. Is the ${config2.provider} server running?`;
        } else if (error2.code === "ETIMEDOUT") {
          errorMessage = `Connection timed out. Check your network or server status.`;
        } else if (error2.response) {
          errorMessage = `Server error: ${error2.response.status} ${error2.response.statusText}`;
          if (error2.response.data) {
            errorMessage += `
Response: ${JSON.stringify(error2.response.data)}`;
          }
        } else if (error2.request) {
          errorMessage = `No response received from server`;
        }
      }
      return {
        success: false,
        error: errorMessage
      };
    }
  });
}
const isDev$1 = !require$$1$4.app.isPackaged;
const API_BASE_URL = isDev$1 ? "http://127.0.0.1:1234" : "http://127.0.0.1:1234";
const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 3e4;
const MAX_TIMEOUT = 12e4;
class ProcessingHelper {
  constructor(deps) {
    this.localMode = true;
    this.abortController = null;
    this.currentTimeout = INITIAL_TIMEOUT;
    this.currentProcessingAbortController = null;
    this.currentExtraProcessingAbortController = null;
    this.deps = deps;
    this.screenshotHelper = deps.getScreenshotHelper();
  }
  // Set local mode
  setLocalMode(isLocal) {
    this.localMode = isLocal;
  }
  // Get local mode
  getLocalMode() {
    return this.localMode;
  }
  async waitForInitialization(mainWindow) {
    let attempts = 0;
    const maxAttempts = 50;
    while (attempts < maxAttempts) {
      const isInitialized = await mainWindow.webContents.executeJavaScript(
        "window.__IS_INITIALIZED__"
      );
      if (isInitialized) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }
    throw new Error("App failed to initialize after 5 seconds");
  }
  async getLanguage() {
    const mainWindow = this.deps.getMainWindow();
    if (!mainWindow) return "python";
    try {
      await this.waitForInitialization(mainWindow);
      const language = await mainWindow.webContents.executeJavaScript(
        "window.__LANGUAGE__"
      );
      if (typeof language !== "string" || language === void 0 || language === null) {
        console.warn("Language not properly initialized");
        return "python";
      }
      return language;
    } catch (error2) {
      console.error("Error getting language:", error2);
      return "python";
    }
  }
  async fetchWithRetry(url2, options, retryCount = 0) {
    var _a;
    try {
      const response = await fetch(url2, {
        ...options,
        signal: (_a = this.abortController) == null ? void 0 : _a.signal
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error2) {
      if (error2 instanceof Error && error2.name === "AbortError") {
        throw error2;
      }
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES})...`);
        this.currentTimeout = Math.min(this.currentTimeout * 2, MAX_TIMEOUT);
        return this.fetchWithRetry(url2, options, retryCount + 1);
      }
      throw error2;
    }
  }
  async processScreenshots() {
    try {
      this.cancelOngoingRequests();
      this.abortController = new AbortController();
      this.currentTimeout = INITIAL_TIMEOUT;
      const mainWindow = this.deps.getMainWindow();
      if (!mainWindow || mainWindow.isDestroyed()) {
        throw new Error("Main window not available");
      }
      const screenshots = await this.deps.getScreenshots();
      if (!screenshots || screenshots.length === 0) {
        mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.NO_SCREENSHOTS);
        return;
      }
      await this.processScreenshotsHelper(
        screenshots.map((path2) => ({
          path: path2,
          data: fs$l.readFileSync(path2).toString("base64")
        })),
        this.abortController.signal
      );
    } catch (error2) {
      console.error("Error processing screenshots:", error2);
      const mainWindow = this.deps.getMainWindow();
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(
          this.deps.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR,
          error2 instanceof Error ? error2.message : "Unknown error occurred"
        );
      }
    } finally {
      this.abortController = null;
    }
  }
  async processScreenshotsHelper(screenshots, signal) {
    var _a, _b;
    const mainWindow = this.deps.getMainWindow();
    if (!mainWindow) return;
    try {
      mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.INITIAL_START);
      const configStr = await mainWindow.webContents.executeJavaScript(
        "localStorage.getItem('localAIConfig')"
      );
      const savedModelsStr = await mainWindow.webContents.executeJavaScript(
        "localStorage.getItem('savedAIModels')"
      );
      if (!configStr || !savedModelsStr) {
        throw new Error("No AI configuration found. Please configure your AI settings first.");
      }
      const config2 = JSON.parse(configStr);
      const savedModels = JSON.parse(savedModelsStr);
      const activeModel = savedModels.find((m) => m.isActive);
      if (!activeModel) {
        throw new Error("No active AI model found. Please select a model in settings.");
      }
      const extractPrompt = `I'm going to show you a screenshot of a coding interview problem. Please extract the problem statement, requirements, and any examples provided. Format your response as JSON with the following structure:
      {
        "title": "Problem title if available",
        "description": "Full problem description",
        "examples": [
          {"input": "example input", "output": "example output", "explanation": "explanation if available"}
        ],
        "constraints": ["constraint 1", "constraint 2", ...],
        "difficulty": "easy/medium/hard if mentioned"
      }`;
      const headers = {
        "Content-Type": "application/json"
      };
      if (config2.apiKey) {
        headers["Authorization"] = `Bearer ${config2.apiKey}`;
      }
      const messages = [
        { role: "system", content: config2.systemPrompt || "You are a helpful assistant." }
      ];
      for (const screenshot of screenshots) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: extractPrompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${screenshot.data}`,
                detail: "high"
              }
            }
          ]
        });
      }
      console.log("Making request to endpoint:", activeModel.endpoint);
      const response = await this.fetchWithRetry(
        activeModel.endpoint,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: activeModel.id,
            messages,
            temperature: 0.7,
            max_tokens: 4e3,
            stream: false
          }),
          signal
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received response:", data);
      let content = "";
      if (data.choices && data.choices.length > 0) {
        content = ((_a = data.choices[0].message) == null ? void 0 : _a.content) || data.choices[0].text || "";
      } else if ((_b = data.message) == null ? void 0 : _b.content) {
        content = data.message.content;
      }
      if (!content) {
        if (data.error) {
          throw new Error(`AI service error: ${data.error}`);
        }
        content = JSON.stringify({
          title: "Problem Analysis",
          description: "The AI model is still processing the image. Please try again in a moment.",
          examples: [],
          constraints: [],
          difficulty: "unknown"
        });
      }
      try {
        const parsedContent = JSON.parse(content);
        mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.PROBLEM_EXTRACTED, parsedContent);
        this.deps.setProblemInfo(parsedContent);
        this.deps.setView("problem");
      } catch (error2) {
        console.error("Error parsing AI response:", error2);
        throw new Error("Failed to parse AI response");
      }
    } catch (error2) {
      console.error("Error processing screenshots:", error2);
      throw error2;
    }
  }
  // Modified to use local AI
  async generateSolutionsHelper(signal) {
    const mainWindow = this.deps.getMainWindow();
    if (!mainWindow) return;
    try {
      const problemInfo = this.deps.getProblemInfo();
      if (!problemInfo) {
        throw new Error("No problem info available");
      }
      const language = await this.getLanguage();
      if (this.localMode) {
        const solutionPrompt = `I need a solution to the following coding problem in ${language}:
        
        ${JSON.stringify(problemInfo, null, 2)}
        
        Please provide a detailed solution with the following:
        1. A clear explanation of your approach
        2. The time and space complexity analysis
        3. Well-commented code implementation in ${language}
        4. Step-by-step walkthrough of how the solution works with an example
        
        Format your response as JSON with the following structure:
        {
          "approach": "Detailed explanation of the approach",
          "complexity": {
            "time": "O(n) explanation",
            "space": "O(n) explanation"
          },
          "code": "Your full code implementation with comments",
          "walkthrough": "Step-by-step explanation with an example"
        }`;
        console.log("Calling local AI service for solution generation...");
        const response = await mainWindow.webContents.executeJavaScript(
          `window.localAIService.queryLocalAI(${JSON.stringify(solutionPrompt)})`
        );
        console.log("Solution generation response:", response);
        if (response.error) {
          throw new Error(`Local AI error: ${response.error}`);
        }
        try {
          let solution;
          try {
            solution = JSON.parse(response.content);
          } catch (parseError) {
            console.log("Could not parse solution as JSON, using as plain text");
            solution = {
              approach: "Generated solution",
              complexity: {
                time: "Analysis not available",
                space: "Analysis not available"
              },
              code: response.content,
              walkthrough: "Walkthrough not available"
            };
          }
          console.log("Generated solution:", solution);
          mainWindow.webContents.send(
            this.deps.PROCESSING_EVENTS.SOLUTION_SUCCESS,
            solution
          );
          this.deps.setView("solutions");
        } catch (parseError) {
          console.error("Error parsing AI solution response:", parseError);
          const solution = {
            approach: "Generated solution",
            complexity: {
              time: "Analysis not available",
              space: "Analysis not available"
            },
            code: response.content,
            walkthrough: "Walkthrough not available"
          };
          mainWindow.webContents.send(
            this.deps.PROCESSING_EVENTS.SOLUTION_SUCCESS,
            solution
          );
          this.deps.setView("solutions");
        }
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/api/generate-solution`,
          {
            problem: problemInfo,
            language
          },
          { signal }
        );
        if (response.status !== 200) {
          throw new Error(`API returned status code ${response.status}`);
        }
        const solution = response.data;
        mainWindow.webContents.send(
          this.deps.PROCESSING_EVENTS.SOLUTION_SUCCESS,
          solution
        );
        this.deps.setView("solutions");
      }
    } catch (error2) {
      console.error("Error in generateSolutionsHelper:", error2);
      if (signal.aborted) {
        console.log("Solution generation was cancelled");
        return;
      }
      mainWindow.webContents.send(
        this.deps.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR,
        error2 instanceof Error ? error2.message : "Unknown error"
      );
    }
  }
  // Modified to use local AI
  async processExtraScreenshotsHelper(screenshots, signal) {
    const mainWindow = this.deps.getMainWindow();
    if (!mainWindow) return;
    try {
      mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.DEBUG_START);
      const problemInfo = this.deps.getProblemInfo();
      if (!problemInfo) {
        throw new Error("No problem info available");
      }
      const language = await this.getLanguage();
      if (this.localMode) {
        const debugPrompt = `I need help debugging my solution to this coding problem:
        
        Problem: ${JSON.stringify(problemInfo, null, 2)}
        
        I'm getting errors or incorrect results. Here's a screenshot of the error or test case that's failing.
        
        Please analyze what might be wrong and provide:
        1. Identification of the issue
        2. A corrected solution in ${language}
        3. Explanation of what was wrong and how the fix addresses it
        
        Format your response as JSON with the following structure:
        {
          "issue": "Description of the identified issue",
          "fix": "Your corrected code implementation",
          "explanation": "Detailed explanation of the problem and how the fix resolves it"
        }`;
        const response = await mainWindow.webContents.executeJavaScript(
          `window.localAIService.queryLocalAI(${JSON.stringify(debugPrompt)}, ${JSON.stringify(screenshots[0].data)})`
        );
        if (response.error) {
          throw new Error(`Local AI error: ${response.error}`);
        }
        try {
          const debugResult = JSON.parse(response.content);
          this.deps.setHasDebugged(true);
          mainWindow.webContents.send(
            this.deps.PROCESSING_EVENTS.DEBUG_SUCCESS,
            debugResult
          );
        } catch (parseError) {
          console.error("Error parsing AI debug response:", parseError);
          const debugResult = {
            issue: "Analysis of the issue",
            fix: response.content,
            explanation: "Detailed explanation not available"
          };
          this.deps.setHasDebugged(true);
          mainWindow.webContents.send(
            this.deps.PROCESSING_EVENTS.DEBUG_SUCCESS,
            debugResult
          );
        }
      } else {
        const formData = new FormData();
        formData.append("language", language);
        formData.append("problem", JSON.stringify(problemInfo));
        screenshots.forEach((screenshot, index) => {
          formData.append(`image${index + 1}`, screenshot.data);
        });
        const response = await axios.post(
          `${API_BASE_URL}/api/debug-solution`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            },
            signal
          }
        );
        if (response.status !== 200) {
          throw new Error(`API returned status code ${response.status}`);
        }
        const debugResult = response.data;
        this.deps.setHasDebugged(true);
        mainWindow.webContents.send(
          this.deps.PROCESSING_EVENTS.DEBUG_SUCCESS,
          debugResult
        );
      }
    } catch (error2) {
      console.error("Error in processExtraScreenshotsHelper:", error2);
      if (signal.aborted) {
        console.log("Debug was cancelled");
        return;
      }
      mainWindow.webContents.send(
        this.deps.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR,
        error2 instanceof Error ? error2.message : "Unknown error"
      );
    }
  }
  cancelOngoingRequests() {
    if (this.currentProcessingAbortController) {
      this.currentProcessingAbortController.abort();
      this.currentProcessingAbortController = null;
    }
    if (this.currentExtraProcessingAbortController) {
      this.currentExtraProcessingAbortController.abort();
      this.currentExtraProcessingAbortController = null;
    }
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
const rnds8Pool = new Uint8Array(256);
let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    require$$0$2.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
const native = { randomUUID: require$$0$2.randomUUID };
function v4(options, buf, offset) {
  var _a;
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? ((_a = options.rng) == null ? void 0 : _a.call(options)) ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
const execFileAsync = require$$1.promisify(require$$1$5.execFile);
class ScreenshotHelper {
  constructor(view = "queue") {
    this.screenshotQueue = [];
    this.extraScreenshotQueue = [];
    this.MAX_SCREENSHOTS = 2;
    this.view = "queue";
    this.view = view;
    this.screenshotDir = path$k.join(require$$1$4.app.getPath("userData"), "screenshots");
    this.extraScreenshotDir = path$k.join(
      require$$1$4.app.getPath("userData"),
      "extra_screenshots"
    );
    if (!fs$l.existsSync(this.screenshotDir)) {
      fs$l.mkdirSync(this.screenshotDir);
    }
    if (!fs$l.existsSync(this.extraScreenshotDir)) {
      fs$l.mkdirSync(this.extraScreenshotDir);
    }
  }
  getView() {
    return this.view;
  }
  setView(view) {
    console.log("Setting view in ScreenshotHelper:", view);
    console.log(
      "Current queues - Main:",
      this.screenshotQueue,
      "Extra:",
      this.extraScreenshotQueue
    );
    this.view = view;
  }
  getScreenshotQueue() {
    return this.screenshotQueue;
  }
  getExtraScreenshotQueue() {
    console.log("Getting extra screenshot queue:", this.extraScreenshotQueue);
    return this.extraScreenshotQueue;
  }
  clearQueues() {
    this.screenshotQueue.forEach((screenshotPath) => {
      fs$l.unlink(screenshotPath, (err) => {
        if (err)
          console.error(`Error deleting screenshot at ${screenshotPath}:`, err);
      });
    });
    this.screenshotQueue = [];
    this.extraScreenshotQueue.forEach((screenshotPath) => {
      fs$l.unlink(screenshotPath, (err) => {
        if (err)
          console.error(
            `Error deleting extra screenshot at ${screenshotPath}:`,
            err
          );
      });
    });
    this.extraScreenshotQueue = [];
  }
  async captureScreenshotMac() {
    const tmpPath = path$k.join(require$$1$4.app.getPath("temp"), `${v4()}.png`);
    await execFileAsync("screencapture", ["-x", tmpPath]);
    const buffer = await fs$l.promises.readFile(tmpPath);
    await fs$l.promises.unlink(tmpPath);
    return buffer;
  }
  async captureScreenshotWindows() {
    const tmpPath = path$k.join(require$$1$4.app.getPath("temp"), `${v4()}.png`);
    const script = `
      Add-Type -AssemblyName System.Windows.Forms
      Add-Type -AssemblyName System.Drawing
      $screen = [System.Windows.Forms.Screen]::PrimaryScreen
      $bitmap = New-Object System.Drawing.Bitmap $screen.Bounds.Width, $screen.Bounds.Height
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      $graphics.CopyFromScreen($screen.Bounds.X, $screen.Bounds.Y, 0, 0, $bitmap.Size)
      $bitmap.Save('${tmpPath.replace(/\\/g, "\\\\")}')
      $graphics.Dispose()
      $bitmap.Dispose()
    `;
    await execFileAsync("powershell", ["-command", script]);
    const buffer = await fs$l.promises.readFile(tmpPath);
    await fs$l.promises.unlink(tmpPath);
    return buffer;
  }
  async takeScreenshot(hideMainWindow2, showMainWindow2) {
    console.log("Taking screenshot in view:", this.view);
    hideMainWindow2();
    await new Promise((resolve) => setTimeout(resolve, 100));
    let screenshotPath = "";
    try {
      const screenshotBuffer = process.platform === "darwin" ? await this.captureScreenshotMac() : await this.captureScreenshotWindows();
      if (this.view === "queue") {
        screenshotPath = path$k.join(this.screenshotDir, `${v4()}.png`);
        await fs$l.promises.writeFile(screenshotPath, screenshotBuffer);
        console.log("Adding screenshot to main queue:", screenshotPath);
        this.screenshotQueue.push(screenshotPath);
        if (this.screenshotQueue.length > this.MAX_SCREENSHOTS) {
          const removedPath = this.screenshotQueue.shift();
          if (removedPath) {
            try {
              await fs$l.promises.unlink(removedPath);
              console.log(
                "Removed old screenshot from main queue:",
                removedPath
              );
            } catch (error2) {
              console.error("Error removing old screenshot:", error2);
            }
          }
        }
      } else {
        screenshotPath = path$k.join(this.extraScreenshotDir, `${v4()}.png`);
        await fs$l.promises.writeFile(screenshotPath, screenshotBuffer);
        console.log("Adding screenshot to extra queue:", screenshotPath);
        this.extraScreenshotQueue.push(screenshotPath);
        if (this.extraScreenshotQueue.length > this.MAX_SCREENSHOTS) {
          const removedPath = this.extraScreenshotQueue.shift();
          if (removedPath) {
            try {
              await fs$l.promises.unlink(removedPath);
              console.log(
                "Removed old screenshot from extra queue:",
                removedPath
              );
            } catch (error2) {
              console.error("Error removing old screenshot:", error2);
            }
          }
        }
      }
    } catch (error2) {
      console.error("Screenshot error:", error2);
      throw error2;
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 50));
      showMainWindow2();
    }
    return screenshotPath;
  }
  async getImagePreview(filepath) {
    try {
      const data = await fs$l.promises.readFile(filepath);
      return `data:image/png;base64,${data.toString("base64")}`;
    } catch (error2) {
      console.error("Error reading image:", error2);
      throw error2;
    }
  }
  async deleteScreenshot(path2) {
    try {
      await fs$l.promises.unlink(path2);
      if (this.view === "queue") {
        this.screenshotQueue = this.screenshotQueue.filter(
          (filePath) => filePath !== path2
        );
      } else {
        this.extraScreenshotQueue = this.extraScreenshotQueue.filter(
          (filePath) => filePath !== path2
        );
      }
      return { success: true };
    } catch (error2) {
      console.error("Error deleting file:", error2);
      return { success: false, error: error2.message };
    }
  }
  clearExtraScreenshotQueue() {
    this.extraScreenshotQueue.forEach((screenshotPath) => {
      fs$l.unlink(screenshotPath, (err) => {
        if (err)
          console.error(
            `Error deleting extra screenshot at ${screenshotPath}:`,
            err
          );
      });
    });
    this.extraScreenshotQueue = [];
  }
}
class ShortcutsHelper {
  constructor(deps) {
    this.deps = deps;
  }
  registerGlobalShortcuts() {
    require$$1$4.globalShortcut.register("CommandOrControl+H", async () => {
      const mainWindow = this.deps.getMainWindow();
      if (mainWindow) {
        console.log("Taking screenshot...");
        try {
          const screenshotPath = await this.deps.takeScreenshot();
          const preview = await this.deps.getImagePreview(screenshotPath);
          mainWindow.webContents.send("screenshot-taken", {
            path: screenshotPath,
            preview
          });
        } catch (error2) {
          console.error("Error capturing screenshot:", error2);
        }
      }
    });
    require$$1$4.globalShortcut.register("CommandOrControl+Enter", async () => {
      var _a;
      await ((_a = this.deps.processingHelper) == null ? void 0 : _a.processScreenshots());
    });
    require$$1$4.globalShortcut.register("CommandOrControl+R", () => {
      var _a;
      console.log(
        "Command + R pressed. Canceling requests and resetting queues..."
      );
      (_a = this.deps.processingHelper) == null ? void 0 : _a.cancelOngoingRequests();
      this.deps.clearQueues();
      console.log("Cleared queues.");
      this.deps.setView("queue");
      const mainWindow = this.deps.getMainWindow();
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("reset-view");
        mainWindow.webContents.send("reset");
      }
    });
    require$$1$4.globalShortcut.register("CommandOrControl+Left", () => {
      console.log("Command/Ctrl + Left pressed. Moving window left.");
      this.deps.moveWindowLeft();
    });
    require$$1$4.globalShortcut.register("CommandOrControl+Right", () => {
      console.log("Command/Ctrl + Right pressed. Moving window right.");
      this.deps.moveWindowRight();
    });
    require$$1$4.globalShortcut.register("CommandOrControl+Down", () => {
      console.log("Command/Ctrl + down pressed. Moving window down.");
      this.deps.moveWindowDown();
    });
    require$$1$4.globalShortcut.register("CommandOrControl+Up", () => {
      console.log("Command/Ctrl + Up pressed. Moving window Up.");
      this.deps.moveWindowUp();
    });
    require$$1$4.globalShortcut.register("CommandOrControl+B", () => {
      this.deps.toggleMainWindow();
    });
    require$$1$4.app.on("will-quit", () => {
      require$$1$4.globalShortcut.unregisterAll();
    });
  }
}
var main$3 = {};
var out = {};
var CancellationToken$1 = {};
Object.defineProperty(CancellationToken$1, "__esModule", { value: true });
CancellationToken$1.CancellationError = CancellationToken$1.CancellationToken = void 0;
const events_1 = require$$0$4;
class CancellationToken extends events_1.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(value) {
    this.removeParentCancelHandler();
    this._parent = value;
    this.parentCancelHandler = () => this.cancel();
    this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(parent) {
    super();
    this.parentCancelHandler = null;
    this._parent = null;
    this._cancelled = false;
    if (parent != null) {
      this.parent = parent;
    }
  }
  cancel() {
    this._cancelled = true;
    this.emit("cancel");
  }
  onCancel(handler) {
    if (this.cancelled) {
      handler();
    } else {
      this.once("cancel", handler);
    }
  }
  createPromise(callback) {
    if (this.cancelled) {
      return Promise.reject(new CancellationError());
    }
    const finallyHandler = () => {
      if (cancelHandler != null) {
        try {
          this.removeListener("cancel", cancelHandler);
          cancelHandler = null;
        } catch (_ignore) {
        }
      }
    };
    let cancelHandler = null;
    return new Promise((resolve, reject) => {
      let addedCancelHandler = null;
      cancelHandler = () => {
        try {
          if (addedCancelHandler != null) {
            addedCancelHandler();
            addedCancelHandler = null;
          }
        } finally {
          reject(new CancellationError());
        }
      };
      if (this.cancelled) {
        cancelHandler();
        return;
      }
      this.onCancel(cancelHandler);
      callback(resolve, reject, (callback2) => {
        addedCancelHandler = callback2;
      });
    }).then((it) => {
      finallyHandler();
      return it;
    }).catch((e) => {
      finallyHandler();
      throw e;
    });
  }
  removeParentCancelHandler() {
    const parent = this._parent;
    if (parent != null && this.parentCancelHandler != null) {
      parent.removeListener("cancel", this.parentCancelHandler);
      this.parentCancelHandler = null;
    }
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners();
      this._parent = null;
    }
  }
}
CancellationToken$1.CancellationToken = CancellationToken;
class CancellationError extends Error {
  constructor() {
    super("cancelled");
  }
}
CancellationToken$1.CancellationError = CancellationError;
var httpExecutor = {};
var error = {};
Object.defineProperty(error, "__esModule", { value: true });
error.newError = newError;
function newError(message, code) {
  const error2 = new Error(message);
  error2.code = code;
  return error2;
}
var ProgressCallbackTransform$1 = {};
Object.defineProperty(ProgressCallbackTransform$1, "__esModule", { value: true });
ProgressCallbackTransform$1.ProgressCallbackTransform = void 0;
const stream_1$3 = stream;
class ProgressCallbackTransform extends stream_1$3.Transform {
  constructor(total, cancellationToken, onProgress) {
    super();
    this.total = total;
    this.cancellationToken = cancellationToken;
    this.onProgress = onProgress;
    this.start = Date.now();
    this.transferred = 0;
    this.delta = 0;
    this.nextUpdate = this.start + 1e3;
  }
  _transform(chunk, encoding, callback) {
    if (this.cancellationToken.cancelled) {
      callback(new Error("cancelled"), null);
      return;
    }
    this.transferred += chunk.length;
    this.delta += chunk.length;
    const now = Date.now();
    if (now >= this.nextUpdate && this.transferred !== this.total) {
      this.nextUpdate = now + 1e3;
      this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.total * 100,
        bytesPerSecond: Math.round(this.transferred / ((now - this.start) / 1e3))
      });
      this.delta = 0;
    }
    callback(null, chunk);
  }
  _flush(callback) {
    if (this.cancellationToken.cancelled) {
      callback(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
    this.delta = 0;
    callback(null);
  }
}
ProgressCallbackTransform$1.ProgressCallbackTransform = ProgressCallbackTransform;
Object.defineProperty(httpExecutor, "__esModule", { value: true });
httpExecutor.DigestTransform = httpExecutor.HttpExecutor = httpExecutor.HttpError = void 0;
httpExecutor.createHttpError = createHttpError;
httpExecutor.parseJson = parseJson;
httpExecutor.configureRequestOptionsFromUrl = configureRequestOptionsFromUrl;
httpExecutor.configureRequestUrl = configureRequestUrl;
httpExecutor.safeGetHeader = safeGetHeader;
httpExecutor.configureRequestOptions = configureRequestOptions;
httpExecutor.safeStringifyJson = safeStringifyJson;
const crypto_1$2 = require$$0$2;
const debug_1$1 = srcExports$1;
const fs_1$3 = require$$1$2;
const stream_1$2 = stream;
const url_1$4 = require$$0$1;
const CancellationToken_1$1 = CancellationToken$1;
const error_1$2 = error;
const ProgressCallbackTransform_1 = ProgressCallbackTransform$1;
const debug$3 = (0, debug_1$1.default)("electron-builder");
function createHttpError(response, description = null) {
  return new HttpError(response.statusCode || -1, `${response.statusCode} ${response.statusMessage}` + (description == null ? "" : "\n" + JSON.stringify(description, null, "  ")) + "\nHeaders: " + safeStringifyJson(response.headers), description);
}
const HTTP_STATUS_CODES = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class HttpError extends Error {
  constructor(statusCode, message = `HTTP error: ${HTTP_STATUS_CODES.get(statusCode) || statusCode}`, description = null) {
    super(message);
    this.statusCode = statusCode;
    this.description = description;
    this.name = "HttpError";
    this.code = `HTTP_ERROR_${statusCode}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
httpExecutor.HttpError = HttpError;
function parseJson(result) {
  return result.then((it) => it == null || it.length === 0 ? null : JSON.parse(it));
}
class HttpExecutor {
  constructor() {
    this.maxRedirects = 10;
  }
  request(options, cancellationToken = new CancellationToken_1$1.CancellationToken(), data) {
    configureRequestOptions(options);
    const json2 = data == null ? void 0 : JSON.stringify(data);
    const encodedData = json2 ? Buffer.from(json2) : void 0;
    if (encodedData != null) {
      debug$3(json2);
      const { headers, ...opts } = options;
      options = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": encodedData.length,
          ...headers
        },
        ...opts
      };
    }
    return this.doApiRequest(options, cancellationToken, (it) => it.end(encodedData));
  }
  doApiRequest(options, cancellationToken, requestProcessor, redirectCount = 0) {
    if (debug$3.enabled) {
      debug$3(`Request: ${safeStringifyJson(options)}`);
    }
    return cancellationToken.createPromise((resolve, reject, onCancel) => {
      const request = this.createRequest(options, (response) => {
        try {
          this.handleResponse(response, options, cancellationToken, resolve, reject, redirectCount, requestProcessor);
        } catch (e) {
          reject(e);
        }
      });
      this.addErrorAndTimeoutHandlers(request, reject, options.timeout);
      this.addRedirectHandlers(request, options, reject, redirectCount, (options2) => {
        this.doApiRequest(options2, cancellationToken, requestProcessor, redirectCount).then(resolve).catch(reject);
      });
      requestProcessor(request, reject);
      onCancel(() => request.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(request, options, reject, redirectCount, handler) {
  }
  addErrorAndTimeoutHandlers(request, reject, timeout = 60 * 1e3) {
    this.addTimeOutHandler(request, reject, timeout);
    request.on("error", reject);
    request.on("aborted", () => {
      reject(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(response, options, cancellationToken, resolve, reject, redirectCount, requestProcessor) {
    var _a;
    if (debug$3.enabled) {
      debug$3(`Response: ${response.statusCode} ${response.statusMessage}, request options: ${safeStringifyJson(options)}`);
    }
    if (response.statusCode === 404) {
      reject(createHttpError(response, `method: ${options.method || "GET"} url: ${options.protocol || "https:"}//${options.hostname}${options.port ? `:${options.port}` : ""}${options.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (response.statusCode === 204) {
      resolve();
      return;
    }
    const code = (_a = response.statusCode) !== null && _a !== void 0 ? _a : 0;
    const shouldRedirect = code >= 300 && code < 400;
    const redirectUrl = safeGetHeader(response, "location");
    if (shouldRedirect && redirectUrl != null) {
      if (redirectCount > this.maxRedirects) {
        reject(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(HttpExecutor.prepareRedirectUrlOptions(redirectUrl, options), cancellationToken, requestProcessor, redirectCount).then(resolve).catch(reject);
      return;
    }
    response.setEncoding("utf8");
    let data = "";
    response.on("error", reject);
    response.on("data", (chunk) => data += chunk);
    response.on("end", () => {
      try {
        if (response.statusCode != null && response.statusCode >= 400) {
          const contentType = safeGetHeader(response, "content-type");
          const isJson = contentType != null && (Array.isArray(contentType) ? contentType.find((it) => it.includes("json")) != null : contentType.includes("json"));
          reject(createHttpError(response, `method: ${options.method || "GET"} url: ${options.protocol || "https:"}//${options.hostname}${options.port ? `:${options.port}` : ""}${options.path}

          Data:
          ${isJson ? JSON.stringify(JSON.parse(data)) : data}
          `));
        } else {
          resolve(data.length === 0 ? null : data);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
  async downloadToBuffer(url2, options) {
    return await options.cancellationToken.createPromise((resolve, reject, onCancel) => {
      const responseChunks = [];
      const requestOptions = {
        headers: options.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      configureRequestUrl(url2, requestOptions);
      configureRequestOptions(requestOptions);
      this.doDownload(requestOptions, {
        destination: null,
        options,
        onCancel,
        callback: (error2) => {
          if (error2 == null) {
            resolve(Buffer.concat(responseChunks));
          } else {
            reject(error2);
          }
        },
        responseHandler: (response, callback) => {
          let receivedLength = 0;
          response.on("data", (chunk) => {
            receivedLength += chunk.length;
            if (receivedLength > 524288e3) {
              callback(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            responseChunks.push(chunk);
          });
          response.on("end", () => {
            callback(null);
          });
        }
      }, 0);
    });
  }
  doDownload(requestOptions, options, redirectCount) {
    const request = this.createRequest(requestOptions, (response) => {
      if (response.statusCode >= 400) {
        options.callback(new Error(`Cannot download "${requestOptions.protocol || "https:"}//${requestOptions.hostname}${requestOptions.path}", status ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      response.on("error", options.callback);
      const redirectUrl = safeGetHeader(response, "location");
      if (redirectUrl != null) {
        if (redirectCount < this.maxRedirects) {
          this.doDownload(HttpExecutor.prepareRedirectUrlOptions(redirectUrl, requestOptions), options, redirectCount++);
        } else {
          options.callback(this.createMaxRedirectError());
        }
        return;
      }
      if (options.responseHandler == null) {
        configurePipes(options, response);
      } else {
        options.responseHandler(response, options.callback);
      }
    });
    this.addErrorAndTimeoutHandlers(request, options.callback, requestOptions.timeout);
    this.addRedirectHandlers(request, requestOptions, options.callback, redirectCount, (requestOptions2) => {
      this.doDownload(requestOptions2, options, redirectCount++);
    });
    request.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(request, callback, timeout) {
    request.on("socket", (socket) => {
      socket.setTimeout(timeout, () => {
        request.abort();
        callback(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(redirectUrl, options) {
    const newOptions = configureRequestOptionsFromUrl(redirectUrl, { ...options });
    const headers = newOptions.headers;
    if (headers === null || headers === void 0 ? void 0 : headers.authorization) {
      const parsedNewUrl = new url_1$4.URL(redirectUrl);
      if (parsedNewUrl.hostname.endsWith(".amazonaws.com") || parsedNewUrl.searchParams.has("X-Amz-Credential")) {
        delete headers.authorization;
      }
    }
    return newOptions;
  }
  static retryOnServerError(task, maxRetries = 3) {
    for (let attemptNumber = 0; ; attemptNumber++) {
      try {
        return task();
      } catch (e) {
        if (attemptNumber < maxRetries && (e instanceof HttpError && e.isServerError() || e.code === "EPIPE")) {
          continue;
        }
        throw e;
      }
    }
  }
}
httpExecutor.HttpExecutor = HttpExecutor;
function configureRequestOptionsFromUrl(url2, options) {
  const result = configureRequestOptions(options);
  configureRequestUrl(new url_1$4.URL(url2), result);
  return result;
}
function configureRequestUrl(url2, options) {
  options.protocol = url2.protocol;
  options.hostname = url2.hostname;
  if (url2.port) {
    options.port = url2.port;
  } else if (options.port) {
    delete options.port;
  }
  options.path = url2.pathname + url2.search;
}
class DigestTransform extends stream_1$2.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(expected, algorithm = "sha512", encoding = "base64") {
    super();
    this.expected = expected;
    this.algorithm = algorithm;
    this.encoding = encoding;
    this._actual = null;
    this.isValidateOnEnd = true;
    this.digester = (0, crypto_1$2.createHash)(algorithm);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(chunk, encoding, callback) {
    this.digester.update(chunk);
    callback(null, chunk);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(callback) {
    this._actual = this.digester.digest(this.encoding);
    if (this.isValidateOnEnd) {
      try {
        this.validate();
      } catch (e) {
        callback(e);
        return;
      }
    }
    callback(null);
  }
  validate() {
    if (this._actual == null) {
      throw (0, error_1$2.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    }
    if (this._actual !== this.expected) {
      throw (0, error_1$2.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    }
    return null;
  }
}
httpExecutor.DigestTransform = DigestTransform;
function checkSha2(sha2Header, sha2, callback) {
  if (sha2Header != null && sha2 != null && sha2Header !== sha2) {
    callback(new Error(`checksum mismatch: expected ${sha2} but got ${sha2Header} (X-Checksum-Sha2 header)`));
    return false;
  }
  return true;
}
function safeGetHeader(response, headerKey) {
  const value = response.headers[headerKey];
  if (value == null) {
    return null;
  } else if (Array.isArray(value)) {
    return value.length === 0 ? null : value[value.length - 1];
  } else {
    return value;
  }
}
function configurePipes(options, response) {
  if (!checkSha2(safeGetHeader(response, "X-Checksum-Sha2"), options.options.sha2, options.callback)) {
    return;
  }
  const streams = [];
  if (options.options.onProgress != null) {
    const contentLength = safeGetHeader(response, "content-length");
    if (contentLength != null) {
      streams.push(new ProgressCallbackTransform_1.ProgressCallbackTransform(parseInt(contentLength, 10), options.options.cancellationToken, options.options.onProgress));
    }
  }
  const sha512 = options.options.sha512;
  if (sha512 != null) {
    streams.push(new DigestTransform(sha512, "sha512", sha512.length === 128 && !sha512.includes("+") && !sha512.includes("Z") && !sha512.includes("=") ? "hex" : "base64"));
  } else if (options.options.sha2 != null) {
    streams.push(new DigestTransform(options.options.sha2, "sha256", "hex"));
  }
  const fileOut = (0, fs_1$3.createWriteStream)(options.destination);
  streams.push(fileOut);
  let lastStream = response;
  for (const stream2 of streams) {
    stream2.on("error", (error2) => {
      fileOut.close();
      if (!options.options.cancellationToken.cancelled) {
        options.callback(error2);
      }
    });
    lastStream = lastStream.pipe(stream2);
  }
  fileOut.on("finish", () => {
    fileOut.close(options.callback);
  });
}
function configureRequestOptions(options, token, method) {
  if (method != null) {
    options.method = method;
  }
  options.headers = { ...options.headers };
  const headers = options.headers;
  if (token != null) {
    headers.authorization = token.startsWith("Basic") || token.startsWith("Bearer") ? token : `token ${token}`;
  }
  if (headers["User-Agent"] == null) {
    headers["User-Agent"] = "electron-builder";
  }
  if (method == null || method === "GET" || headers["Cache-Control"] == null) {
    headers["Cache-Control"] = "no-cache";
  }
  if (options.protocol == null && process.versions.electron != null) {
    options.protocol = "https:";
  }
  return options;
}
function safeStringifyJson(data, skippedNames) {
  return JSON.stringify(data, (name, value) => {
    if (name.endsWith("Authorization") || name.endsWith("authorization") || name.endsWith("Password") || name.endsWith("PASSWORD") || name.endsWith("Token") || name.includes("password") || name.includes("token") || skippedNames != null && skippedNames.has(name)) {
      return "<stripped sensitive data>";
    }
    return value;
  }, 2);
}
var publishOptions = {};
Object.defineProperty(publishOptions, "__esModule", { value: true });
publishOptions.githubUrl = githubUrl;
publishOptions.getS3LikeProviderBaseUrl = getS3LikeProviderBaseUrl;
function githubUrl(options, defaultHost = "github.com") {
  return `${options.protocol || "https"}://${options.host || defaultHost}`;
}
function getS3LikeProviderBaseUrl(configuration) {
  const provider = configuration.provider;
  if (provider === "s3") {
    return s3Url(configuration);
  }
  if (provider === "spaces") {
    return spacesUrl(configuration);
  }
  throw new Error(`Not supported provider: ${provider}`);
}
function s3Url(options) {
  let url2;
  if (options.accelerate == true) {
    url2 = `https://${options.bucket}.s3-accelerate.amazonaws.com`;
  } else if (options.endpoint != null) {
    url2 = `${options.endpoint}/${options.bucket}`;
  } else if (options.bucket.includes(".")) {
    if (options.region == null) {
      throw new Error(`Bucket name "${options.bucket}" includes a dot, but S3 region is missing`);
    }
    if (options.region === "us-east-1") {
      url2 = `https://s3.amazonaws.com/${options.bucket}`;
    } else {
      url2 = `https://s3-${options.region}.amazonaws.com/${options.bucket}`;
    }
  } else if (options.region === "cn-north-1") {
    url2 = `https://${options.bucket}.s3.${options.region}.amazonaws.com.cn`;
  } else {
    url2 = `https://${options.bucket}.s3.amazonaws.com`;
  }
  return appendPath(url2, options.path);
}
function appendPath(url2, p) {
  if (p != null && p.length > 0) {
    if (!p.startsWith("/")) {
      url2 += "/";
    }
    url2 += p;
  }
  return url2;
}
function spacesUrl(options) {
  if (options.name == null) {
    throw new Error(`name is missing`);
  }
  if (options.region == null) {
    throw new Error(`region is missing`);
  }
  return appendPath(`https://${options.name}.${options.region}.digitaloceanspaces.com`, options.path);
}
var rfc2253Parser = {};
Object.defineProperty(rfc2253Parser, "__esModule", { value: true });
rfc2253Parser.parseDn = parseDn;
function parseDn(seq2) {
  let quoted = false;
  let key = null;
  let token = "";
  let nextNonSpace = 0;
  seq2 = seq2.trim();
  const result = /* @__PURE__ */ new Map();
  for (let i = 0; i <= seq2.length; i++) {
    if (i === seq2.length) {
      if (key !== null) {
        result.set(key, token);
      }
      break;
    }
    const ch = seq2[i];
    if (quoted) {
      if (ch === '"') {
        quoted = false;
        continue;
      }
    } else {
      if (ch === '"') {
        quoted = true;
        continue;
      }
      if (ch === "\\") {
        i++;
        const ord = parseInt(seq2.slice(i, i + 2), 16);
        if (Number.isNaN(ord)) {
          token += seq2[i];
        } else {
          i++;
          token += String.fromCharCode(ord);
        }
        continue;
      }
      if (key === null && ch === "=") {
        key = token;
        token = "";
        continue;
      }
      if (ch === "," || ch === ";" || ch === "+") {
        if (key !== null) {
          result.set(key, token);
        }
        key = null;
        token = "";
        continue;
      }
    }
    if (ch === " " && !quoted) {
      if (token.length === 0) {
        continue;
      }
      if (i > nextNonSpace) {
        let j = i;
        while (seq2[j] === " ") {
          j++;
        }
        nextNonSpace = j;
      }
      if (nextNonSpace >= seq2.length || seq2[nextNonSpace] === "," || seq2[nextNonSpace] === ";" || key === null && seq2[nextNonSpace] === "=" || key !== null && seq2[nextNonSpace] === "+") {
        i = nextNonSpace - 1;
        continue;
      }
    }
    token += ch;
  }
  return result;
}
var uuid = {};
Object.defineProperty(uuid, "__esModule", { value: true });
uuid.nil = uuid.UUID = void 0;
const crypto_1$1 = require$$0$2;
const error_1$1 = error;
const invalidName = "options.name must be either a string or a Buffer";
const randomHost = (0, crypto_1$1.randomBytes)(16);
randomHost[0] = randomHost[0] | 1;
const hex2byte = {};
const byte2hex = [];
for (let i = 0; i < 256; i++) {
  const hex = (i + 256).toString(16).substr(1);
  hex2byte[hex] = i;
  byte2hex[i] = hex;
}
class UUID {
  constructor(uuid2) {
    this.ascii = null;
    this.binary = null;
    const check = UUID.check(uuid2);
    if (!check) {
      throw new Error("not a UUID");
    }
    this.version = check.version;
    if (check.format === "ascii") {
      this.ascii = uuid2;
    } else {
      this.binary = uuid2;
    }
  }
  static v5(name, namespace) {
    return uuidNamed(name, "sha1", 80, namespace);
  }
  toString() {
    if (this.ascii == null) {
      this.ascii = stringify$4(this.binary);
    }
    return this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(uuid2, offset = 0) {
    if (typeof uuid2 === "string") {
      uuid2 = uuid2.toLowerCase();
      if (!/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(uuid2)) {
        return false;
      }
      if (uuid2 === "00000000-0000-0000-0000-000000000000") {
        return { version: void 0, variant: "nil", format: "ascii" };
      }
      return {
        version: (hex2byte[uuid2[14] + uuid2[15]] & 240) >> 4,
        variant: getVariant((hex2byte[uuid2[19] + uuid2[20]] & 224) >> 5),
        format: "ascii"
      };
    }
    if (Buffer.isBuffer(uuid2)) {
      if (uuid2.length < offset + 16) {
        return false;
      }
      let i = 0;
      for (; i < 16; i++) {
        if (uuid2[offset + i] !== 0) {
          break;
        }
      }
      if (i === 16) {
        return { version: void 0, variant: "nil", format: "binary" };
      }
      return {
        version: (uuid2[offset + 6] & 240) >> 4,
        variant: getVariant((uuid2[offset + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, error_1$1.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(input) {
    const buffer = Buffer.allocUnsafe(16);
    let j = 0;
    for (let i = 0; i < 16; i++) {
      buffer[i] = hex2byte[input[j++] + input[j++]];
      if (i === 3 || i === 5 || i === 7 || i === 9) {
        j += 1;
      }
    }
    return buffer;
  }
}
uuid.UUID = UUID;
UUID.OID = UUID.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function getVariant(bits) {
  switch (bits) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var UuidEncoding;
(function(UuidEncoding2) {
  UuidEncoding2[UuidEncoding2["ASCII"] = 0] = "ASCII";
  UuidEncoding2[UuidEncoding2["BINARY"] = 1] = "BINARY";
  UuidEncoding2[UuidEncoding2["OBJECT"] = 2] = "OBJECT";
})(UuidEncoding || (UuidEncoding = {}));
function uuidNamed(name, hashMethod, version2, namespace, encoding = UuidEncoding.ASCII) {
  const hash = (0, crypto_1$1.createHash)(hashMethod);
  const nameIsNotAString = typeof name !== "string";
  if (nameIsNotAString && !Buffer.isBuffer(name)) {
    throw (0, error_1$1.newError)(invalidName, "ERR_INVALID_UUID_NAME");
  }
  hash.update(namespace);
  hash.update(name);
  const buffer = hash.digest();
  let result;
  switch (encoding) {
    case UuidEncoding.BINARY:
      buffer[6] = buffer[6] & 15 | version2;
      buffer[8] = buffer[8] & 63 | 128;
      result = buffer;
      break;
    case UuidEncoding.OBJECT:
      buffer[6] = buffer[6] & 15 | version2;
      buffer[8] = buffer[8] & 63 | 128;
      result = new UUID(buffer);
      break;
    default:
      result = byte2hex[buffer[0]] + byte2hex[buffer[1]] + byte2hex[buffer[2]] + byte2hex[buffer[3]] + "-" + byte2hex[buffer[4]] + byte2hex[buffer[5]] + "-" + byte2hex[buffer[6] & 15 | version2] + byte2hex[buffer[7]] + "-" + byte2hex[buffer[8] & 63 | 128] + byte2hex[buffer[9]] + "-" + byte2hex[buffer[10]] + byte2hex[buffer[11]] + byte2hex[buffer[12]] + byte2hex[buffer[13]] + byte2hex[buffer[14]] + byte2hex[buffer[15]];
      break;
  }
  return result;
}
function stringify$4(buffer) {
  return byte2hex[buffer[0]] + byte2hex[buffer[1]] + byte2hex[buffer[2]] + byte2hex[buffer[3]] + "-" + byte2hex[buffer[4]] + byte2hex[buffer[5]] + "-" + byte2hex[buffer[6]] + byte2hex[buffer[7]] + "-" + byte2hex[buffer[8]] + byte2hex[buffer[9]] + "-" + byte2hex[buffer[10]] + byte2hex[buffer[11]] + byte2hex[buffer[12]] + byte2hex[buffer[13]] + byte2hex[buffer[14]] + byte2hex[buffer[15]];
}
uuid.nil = new UUID("00000000-0000-0000-0000-000000000000");
var xml = {};
var sax$1 = {};
(function(exports2) {
  (function(sax2) {
    sax2.parser = function(strict, opt) {
      return new SAXParser(strict, opt);
    };
    sax2.SAXParser = SAXParser;
    sax2.SAXStream = SAXStream;
    sax2.createStream = createStream;
    sax2.MAX_BUFFER_LENGTH = 64 * 1024;
    var buffers = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    sax2.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function SAXParser(strict, opt) {
      if (!(this instanceof SAXParser)) {
        return new SAXParser(strict, opt);
      }
      var parser = this;
      clearBuffers(parser);
      parser.q = parser.c = "";
      parser.bufferCheckPosition = sax2.MAX_BUFFER_LENGTH;
      parser.opt = opt || {};
      parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
      parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
      parser.tags = [];
      parser.closed = parser.closedRoot = parser.sawRoot = false;
      parser.tag = parser.error = null;
      parser.strict = !!strict;
      parser.noscript = !!(strict || parser.opt.noscript);
      parser.state = S.BEGIN;
      parser.strictEntities = parser.opt.strictEntities;
      parser.ENTITIES = parser.strictEntities ? Object.create(sax2.XML_ENTITIES) : Object.create(sax2.ENTITIES);
      parser.attribList = [];
      if (parser.opt.xmlns) {
        parser.ns = Object.create(rootNS);
      }
      if (parser.opt.unquotedAttributeValues === void 0) {
        parser.opt.unquotedAttributeValues = !strict;
      }
      parser.trackPosition = parser.opt.position !== false;
      if (parser.trackPosition) {
        parser.position = parser.line = parser.column = 0;
      }
      emit(parser, "onready");
    }
    if (!Object.create) {
      Object.create = function(o) {
        function F() {
        }
        F.prototype = o;
        var newf = new F();
        return newf;
      };
    }
    if (!Object.keys) {
      Object.keys = function(o) {
        var a = [];
        for (var i in o) if (o.hasOwnProperty(i)) a.push(i);
        return a;
      };
    }
    function checkBufferLength(parser) {
      var maxAllowed = Math.max(sax2.MAX_BUFFER_LENGTH, 10);
      var maxActual = 0;
      for (var i = 0, l = buffers.length; i < l; i++) {
        var len = parser[buffers[i]].length;
        if (len > maxAllowed) {
          switch (buffers[i]) {
            case "textNode":
              closeText(parser);
              break;
            case "cdata":
              emitNode(parser, "oncdata", parser.cdata);
              parser.cdata = "";
              break;
            case "script":
              emitNode(parser, "onscript", parser.script);
              parser.script = "";
              break;
            default:
              error2(parser, "Max buffer length exceeded: " + buffers[i]);
          }
        }
        maxActual = Math.max(maxActual, len);
      }
      var m = sax2.MAX_BUFFER_LENGTH - maxActual;
      parser.bufferCheckPosition = m + parser.position;
    }
    function clearBuffers(parser) {
      for (var i = 0, l = buffers.length; i < l; i++) {
        parser[buffers[i]] = "";
      }
    }
    function flushBuffers(parser) {
      closeText(parser);
      if (parser.cdata !== "") {
        emitNode(parser, "oncdata", parser.cdata);
        parser.cdata = "";
      }
      if (parser.script !== "") {
        emitNode(parser, "onscript", parser.script);
        parser.script = "";
      }
    }
    SAXParser.prototype = {
      end: function() {
        end(this);
      },
      write,
      resume: function() {
        this.error = null;
        return this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        flushBuffers(this);
      }
    };
    var Stream2;
    try {
      Stream2 = require("stream").Stream;
    } catch (ex) {
      Stream2 = function() {
      };
    }
    if (!Stream2) Stream2 = function() {
    };
    var streamWraps = sax2.EVENTS.filter(function(ev) {
      return ev !== "error" && ev !== "end";
    });
    function createStream(strict, opt) {
      return new SAXStream(strict, opt);
    }
    function SAXStream(strict, opt) {
      if (!(this instanceof SAXStream)) {
        return new SAXStream(strict, opt);
      }
      Stream2.apply(this);
      this._parser = new SAXParser(strict, opt);
      this.writable = true;
      this.readable = true;
      var me = this;
      this._parser.onend = function() {
        me.emit("end");
      };
      this._parser.onerror = function(er) {
        me.emit("error", er);
        me._parser.error = null;
      };
      this._decoder = null;
      streamWraps.forEach(function(ev) {
        Object.defineProperty(me, "on" + ev, {
          get: function() {
            return me._parser["on" + ev];
          },
          set: function(h) {
            if (!h) {
              me.removeAllListeners(ev);
              me._parser["on" + ev] = h;
              return h;
            }
            me.on(ev, h);
          },
          enumerable: true,
          configurable: false
        });
      });
    }
    SAXStream.prototype = Object.create(Stream2.prototype, {
      constructor: {
        value: SAXStream
      }
    });
    SAXStream.prototype.write = function(data) {
      if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) {
        if (!this._decoder) {
          var SD = require$$1$6.StringDecoder;
          this._decoder = new SD("utf8");
        }
        data = this._decoder.write(data);
      }
      this._parser.write(data.toString());
      this.emit("data", data);
      return true;
    };
    SAXStream.prototype.end = function(chunk) {
      if (chunk && chunk.length) {
        this.write(chunk);
      }
      this._parser.end();
      return true;
    };
    SAXStream.prototype.on = function(ev, handler) {
      var me = this;
      if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
        me._parser["on" + ev] = function() {
          var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          args.splice(0, 0, ev);
          me.emit.apply(me, args);
        };
      }
      return Stream2.prototype.on.call(me, ev, handler);
    };
    var CDATA = "[CDATA[";
    var DOCTYPE = "DOCTYPE";
    var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
    var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
    var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE };
    var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
    var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
    var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function isWhitespace2(c) {
      return c === " " || c === "\n" || c === "\r" || c === "	";
    }
    function isQuote(c) {
      return c === '"' || c === "'";
    }
    function isAttribEnd(c) {
      return c === ">" || isWhitespace2(c);
    }
    function isMatch(regex, c) {
      return regex.test(c);
    }
    function notMatch(regex, c) {
      return !isMatch(regex, c);
    }
    var S = 0;
    sax2.STATE = {
      BEGIN: S++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: S++,
      // leading whitespace
      TEXT: S++,
      // general stuff
      TEXT_ENTITY: S++,
      // &amp and such.
      OPEN_WAKA: S++,
      // <
      SGML_DECL: S++,
      // <!BLARG
      SGML_DECL_QUOTED: S++,
      // <!BLARG foo "bar
      DOCTYPE: S++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: S++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: S++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: S++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: S++,
      // <!-
      COMMENT: S++,
      // <!--
      COMMENT_ENDING: S++,
      // <!-- blah -
      COMMENT_ENDED: S++,
      // <!-- blah --
      CDATA: S++,
      // <![CDATA[ something
      CDATA_ENDING: S++,
      // ]
      CDATA_ENDING_2: S++,
      // ]]
      PROC_INST: S++,
      // <?hi
      PROC_INST_BODY: S++,
      // <?hi there
      PROC_INST_ENDING: S++,
      // <?hi "there" ?
      OPEN_TAG: S++,
      // <strong
      OPEN_TAG_SLASH: S++,
      // <strong /
      ATTRIB: S++,
      // <a
      ATTRIB_NAME: S++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: S++,
      // <a foo _
      ATTRIB_VALUE: S++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: S++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: S++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: S++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: S++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: S++,
      // <foo bar=&quot
      CLOSE_TAG: S++,
      // </a
      CLOSE_TAG_SAW_WHITE: S++,
      // </a   >
      SCRIPT: S++,
      // <script> ...
      SCRIPT_ENDING: S++
      // <script> ... <
    };
    sax2.XML_ENTITIES = {
      "amp": "&",
      "gt": ">",
      "lt": "<",
      "quot": '"',
      "apos": "'"
    };
    sax2.ENTITIES = {
      "amp": "&",
      "gt": ">",
      "lt": "<",
      "quot": '"',
      "apos": "'",
      "AElig": 198,
      "Aacute": 193,
      "Acirc": 194,
      "Agrave": 192,
      "Aring": 197,
      "Atilde": 195,
      "Auml": 196,
      "Ccedil": 199,
      "ETH": 208,
      "Eacute": 201,
      "Ecirc": 202,
      "Egrave": 200,
      "Euml": 203,
      "Iacute": 205,
      "Icirc": 206,
      "Igrave": 204,
      "Iuml": 207,
      "Ntilde": 209,
      "Oacute": 211,
      "Ocirc": 212,
      "Ograve": 210,
      "Oslash": 216,
      "Otilde": 213,
      "Ouml": 214,
      "THORN": 222,
      "Uacute": 218,
      "Ucirc": 219,
      "Ugrave": 217,
      "Uuml": 220,
      "Yacute": 221,
      "aacute": 225,
      "acirc": 226,
      "aelig": 230,
      "agrave": 224,
      "aring": 229,
      "atilde": 227,
      "auml": 228,
      "ccedil": 231,
      "eacute": 233,
      "ecirc": 234,
      "egrave": 232,
      "eth": 240,
      "euml": 235,
      "iacute": 237,
      "icirc": 238,
      "igrave": 236,
      "iuml": 239,
      "ntilde": 241,
      "oacute": 243,
      "ocirc": 244,
      "ograve": 242,
      "oslash": 248,
      "otilde": 245,
      "ouml": 246,
      "szlig": 223,
      "thorn": 254,
      "uacute": 250,
      "ucirc": 251,
      "ugrave": 249,
      "uuml": 252,
      "yacute": 253,
      "yuml": 255,
      "copy": 169,
      "reg": 174,
      "nbsp": 160,
      "iexcl": 161,
      "cent": 162,
      "pound": 163,
      "curren": 164,
      "yen": 165,
      "brvbar": 166,
      "sect": 167,
      "uml": 168,
      "ordf": 170,
      "laquo": 171,
      "not": 172,
      "shy": 173,
      "macr": 175,
      "deg": 176,
      "plusmn": 177,
      "sup1": 185,
      "sup2": 178,
      "sup3": 179,
      "acute": 180,
      "micro": 181,
      "para": 182,
      "middot": 183,
      "cedil": 184,
      "ordm": 186,
      "raquo": 187,
      "frac14": 188,
      "frac12": 189,
      "frac34": 190,
      "iquest": 191,
      "times": 215,
      "divide": 247,
      "OElig": 338,
      "oelig": 339,
      "Scaron": 352,
      "scaron": 353,
      "Yuml": 376,
      "fnof": 402,
      "circ": 710,
      "tilde": 732,
      "Alpha": 913,
      "Beta": 914,
      "Gamma": 915,
      "Delta": 916,
      "Epsilon": 917,
      "Zeta": 918,
      "Eta": 919,
      "Theta": 920,
      "Iota": 921,
      "Kappa": 922,
      "Lambda": 923,
      "Mu": 924,
      "Nu": 925,
      "Xi": 926,
      "Omicron": 927,
      "Pi": 928,
      "Rho": 929,
      "Sigma": 931,
      "Tau": 932,
      "Upsilon": 933,
      "Phi": 934,
      "Chi": 935,
      "Psi": 936,
      "Omega": 937,
      "alpha": 945,
      "beta": 946,
      "gamma": 947,
      "delta": 948,
      "epsilon": 949,
      "zeta": 950,
      "eta": 951,
      "theta": 952,
      "iota": 953,
      "kappa": 954,
      "lambda": 955,
      "mu": 956,
      "nu": 957,
      "xi": 958,
      "omicron": 959,
      "pi": 960,
      "rho": 961,
      "sigmaf": 962,
      "sigma": 963,
      "tau": 964,
      "upsilon": 965,
      "phi": 966,
      "chi": 967,
      "psi": 968,
      "omega": 969,
      "thetasym": 977,
      "upsih": 978,
      "piv": 982,
      "ensp": 8194,
      "emsp": 8195,
      "thinsp": 8201,
      "zwnj": 8204,
      "zwj": 8205,
      "lrm": 8206,
      "rlm": 8207,
      "ndash": 8211,
      "mdash": 8212,
      "lsquo": 8216,
      "rsquo": 8217,
      "sbquo": 8218,
      "ldquo": 8220,
      "rdquo": 8221,
      "bdquo": 8222,
      "dagger": 8224,
      "Dagger": 8225,
      "bull": 8226,
      "hellip": 8230,
      "permil": 8240,
      "prime": 8242,
      "Prime": 8243,
      "lsaquo": 8249,
      "rsaquo": 8250,
      "oline": 8254,
      "frasl": 8260,
      "euro": 8364,
      "image": 8465,
      "weierp": 8472,
      "real": 8476,
      "trade": 8482,
      "alefsym": 8501,
      "larr": 8592,
      "uarr": 8593,
      "rarr": 8594,
      "darr": 8595,
      "harr": 8596,
      "crarr": 8629,
      "lArr": 8656,
      "uArr": 8657,
      "rArr": 8658,
      "dArr": 8659,
      "hArr": 8660,
      "forall": 8704,
      "part": 8706,
      "exist": 8707,
      "empty": 8709,
      "nabla": 8711,
      "isin": 8712,
      "notin": 8713,
      "ni": 8715,
      "prod": 8719,
      "sum": 8721,
      "minus": 8722,
      "lowast": 8727,
      "radic": 8730,
      "prop": 8733,
      "infin": 8734,
      "ang": 8736,
      "and": 8743,
      "or": 8744,
      "cap": 8745,
      "cup": 8746,
      "int": 8747,
      "there4": 8756,
      "sim": 8764,
      "cong": 8773,
      "asymp": 8776,
      "ne": 8800,
      "equiv": 8801,
      "le": 8804,
      "ge": 8805,
      "sub": 8834,
      "sup": 8835,
      "nsub": 8836,
      "sube": 8838,
      "supe": 8839,
      "oplus": 8853,
      "otimes": 8855,
      "perp": 8869,
      "sdot": 8901,
      "lceil": 8968,
      "rceil": 8969,
      "lfloor": 8970,
      "rfloor": 8971,
      "lang": 9001,
      "rang": 9002,
      "loz": 9674,
      "spades": 9824,
      "clubs": 9827,
      "hearts": 9829,
      "diams": 9830
    };
    Object.keys(sax2.ENTITIES).forEach(function(key) {
      var e = sax2.ENTITIES[key];
      var s2 = typeof e === "number" ? String.fromCharCode(e) : e;
      sax2.ENTITIES[key] = s2;
    });
    for (var s in sax2.STATE) {
      sax2.STATE[sax2.STATE[s]] = s;
    }
    S = sax2.STATE;
    function emit(parser, event, data) {
      parser[event] && parser[event](data);
    }
    function emitNode(parser, nodeType, data) {
      if (parser.textNode) closeText(parser);
      emit(parser, nodeType, data);
    }
    function closeText(parser) {
      parser.textNode = textopts(parser.opt, parser.textNode);
      if (parser.textNode) emit(parser, "ontext", parser.textNode);
      parser.textNode = "";
    }
    function textopts(opt, text) {
      if (opt.trim) text = text.trim();
      if (opt.normalize) text = text.replace(/\s+/g, " ");
      return text;
    }
    function error2(parser, er) {
      closeText(parser);
      if (parser.trackPosition) {
        er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
      }
      er = new Error(er);
      parser.error = er;
      emit(parser, "onerror", er);
      return parser;
    }
    function end(parser) {
      if (parser.sawRoot && !parser.closedRoot) strictFail(parser, "Unclosed root tag");
      if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) {
        error2(parser, "Unexpected end");
      }
      closeText(parser);
      parser.c = "";
      parser.closed = true;
      emit(parser, "onend");
      SAXParser.call(parser, parser.strict, parser.opt);
      return parser;
    }
    function strictFail(parser, message) {
      if (typeof parser !== "object" || !(parser instanceof SAXParser)) {
        throw new Error("bad call to strictFail");
      }
      if (parser.strict) {
        error2(parser, message);
      }
    }
    function newTag(parser) {
      if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]();
      var parent = parser.tags[parser.tags.length - 1] || parser;
      var tag = parser.tag = { name: parser.tagName, attributes: {} };
      if (parser.opt.xmlns) {
        tag.ns = parent.ns;
      }
      parser.attribList.length = 0;
      emitNode(parser, "onopentagstart", tag);
    }
    function qname(name, attribute) {
      var i = name.indexOf(":");
      var qualName = i < 0 ? ["", name] : name.split(":");
      var prefix = qualName[0];
      var local = qualName[1];
      if (attribute && name === "xmlns") {
        prefix = "xmlns";
        local = "";
      }
      return { prefix, local };
    }
    function attrib(parser) {
      if (!parser.strict) {
        parser.attribName = parser.attribName[parser.looseCase]();
      }
      if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
        parser.attribName = parser.attribValue = "";
        return;
      }
      if (parser.opt.xmlns) {
        var qn = qname(parser.attribName, true);
        var prefix = qn.prefix;
        var local = qn.local;
        if (prefix === "xmlns") {
          if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
            strictFail(
              parser,
              "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue
            );
          } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
            strictFail(
              parser,
              "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue
            );
          } else {
            var tag = parser.tag;
            var parent = parser.tags[parser.tags.length - 1] || parser;
            if (tag.ns === parent.ns) {
              tag.ns = Object.create(parent.ns);
            }
            tag.ns[local] = parser.attribValue;
          }
        }
        parser.attribList.push([parser.attribName, parser.attribValue]);
      } else {
        parser.tag.attributes[parser.attribName] = parser.attribValue;
        emitNode(parser, "onattribute", {
          name: parser.attribName,
          value: parser.attribValue
        });
      }
      parser.attribName = parser.attribValue = "";
    }
    function openTag(parser, selfClosing) {
      if (parser.opt.xmlns) {
        var tag = parser.tag;
        var qn = qname(parser.tagName);
        tag.prefix = qn.prefix;
        tag.local = qn.local;
        tag.uri = tag.ns[qn.prefix] || "";
        if (tag.prefix && !tag.uri) {
          strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName));
          tag.uri = qn.prefix;
        }
        var parent = parser.tags[parser.tags.length - 1] || parser;
        if (tag.ns && parent.ns !== tag.ns) {
          Object.keys(tag.ns).forEach(function(p) {
            emitNode(parser, "onopennamespace", {
              prefix: p,
              uri: tag.ns[p]
            });
          });
        }
        for (var i = 0, l = parser.attribList.length; i < l; i++) {
          var nv = parser.attribList[i];
          var name = nv[0];
          var value = nv[1];
          var qualName = qname(name, true);
          var prefix = qualName.prefix;
          var local = qualName.local;
          var uri2 = prefix === "" ? "" : tag.ns[prefix] || "";
          var a = {
            name,
            value,
            prefix,
            local,
            uri: uri2
          };
          if (prefix && prefix !== "xmlns" && !uri2) {
            strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix));
            a.uri = prefix;
          }
          parser.tag.attributes[name] = a;
          emitNode(parser, "onattribute", a);
        }
        parser.attribList.length = 0;
      }
      parser.tag.isSelfClosing = !!selfClosing;
      parser.sawRoot = true;
      parser.tags.push(parser.tag);
      emitNode(parser, "onopentag", parser.tag);
      if (!selfClosing) {
        if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
          parser.state = S.SCRIPT;
        } else {
          parser.state = S.TEXT;
        }
        parser.tag = null;
        parser.tagName = "";
      }
      parser.attribName = parser.attribValue = "";
      parser.attribList.length = 0;
    }
    function closeTag(parser) {
      if (!parser.tagName) {
        strictFail(parser, "Weird empty close tag.");
        parser.textNode += "</>";
        parser.state = S.TEXT;
        return;
      }
      if (parser.script) {
        if (parser.tagName !== "script") {
          parser.script += "</" + parser.tagName + ">";
          parser.tagName = "";
          parser.state = S.SCRIPT;
          return;
        }
        emitNode(parser, "onscript", parser.script);
        parser.script = "";
      }
      var t2 = parser.tags.length;
      var tagName = parser.tagName;
      if (!parser.strict) {
        tagName = tagName[parser.looseCase]();
      }
      var closeTo = tagName;
      while (t2--) {
        var close = parser.tags[t2];
        if (close.name !== closeTo) {
          strictFail(parser, "Unexpected close tag");
        } else {
          break;
        }
      }
      if (t2 < 0) {
        strictFail(parser, "Unmatched closing tag: " + parser.tagName);
        parser.textNode += "</" + parser.tagName + ">";
        parser.state = S.TEXT;
        return;
      }
      parser.tagName = tagName;
      var s2 = parser.tags.length;
      while (s2-- > t2) {
        var tag = parser.tag = parser.tags.pop();
        parser.tagName = parser.tag.name;
        emitNode(parser, "onclosetag", parser.tagName);
        var x = {};
        for (var i in tag.ns) {
          x[i] = tag.ns[i];
        }
        var parent = parser.tags[parser.tags.length - 1] || parser;
        if (parser.opt.xmlns && tag.ns !== parent.ns) {
          Object.keys(tag.ns).forEach(function(p) {
            var n = tag.ns[p];
            emitNode(parser, "onclosenamespace", { prefix: p, uri: n });
          });
        }
      }
      if (t2 === 0) parser.closedRoot = true;
      parser.tagName = parser.attribValue = parser.attribName = "";
      parser.attribList.length = 0;
      parser.state = S.TEXT;
    }
    function parseEntity(parser) {
      var entity = parser.entity;
      var entityLC = entity.toLowerCase();
      var num;
      var numStr = "";
      if (parser.ENTITIES[entity]) {
        return parser.ENTITIES[entity];
      }
      if (parser.ENTITIES[entityLC]) {
        return parser.ENTITIES[entityLC];
      }
      entity = entityLC;
      if (entity.charAt(0) === "#") {
        if (entity.charAt(1) === "x") {
          entity = entity.slice(2);
          num = parseInt(entity, 16);
          numStr = num.toString(16);
        } else {
          entity = entity.slice(1);
          num = parseInt(entity, 10);
          numStr = num.toString(10);
        }
      }
      entity = entity.replace(/^0+/, "");
      if (isNaN(num) || numStr.toLowerCase() !== entity) {
        strictFail(parser, "Invalid character entity");
        return "&" + parser.entity + ";";
      }
      return String.fromCodePoint(num);
    }
    function beginWhiteSpace(parser, c) {
      if (c === "<") {
        parser.state = S.OPEN_WAKA;
        parser.startTagPosition = parser.position;
      } else if (!isWhitespace2(c)) {
        strictFail(parser, "Non-whitespace before first tag.");
        parser.textNode = c;
        parser.state = S.TEXT;
      }
    }
    function charAt(chunk, i) {
      var result = "";
      if (i < chunk.length) {
        result = chunk.charAt(i);
      }
      return result;
    }
    function write(chunk) {
      var parser = this;
      if (this.error) {
        throw this.error;
      }
      if (parser.closed) {
        return error2(
          parser,
          "Cannot write after close. Assign an onready handler."
        );
      }
      if (chunk === null) {
        return end(parser);
      }
      if (typeof chunk === "object") {
        chunk = chunk.toString();
      }
      var i = 0;
      var c = "";
      while (true) {
        c = charAt(chunk, i++);
        parser.c = c;
        if (!c) {
          break;
        }
        if (parser.trackPosition) {
          parser.position++;
          if (c === "\n") {
            parser.line++;
            parser.column = 0;
          } else {
            parser.column++;
          }
        }
        switch (parser.state) {
          case S.BEGIN:
            parser.state = S.BEGIN_WHITESPACE;
            if (c === "\uFEFF") {
              continue;
            }
            beginWhiteSpace(parser, c);
            continue;
          case S.BEGIN_WHITESPACE:
            beginWhiteSpace(parser, c);
            continue;
          case S.TEXT:
            if (parser.sawRoot && !parser.closedRoot) {
              var starti = i - 1;
              while (c && c !== "<" && c !== "&") {
                c = charAt(chunk, i++);
                if (c && parser.trackPosition) {
                  parser.position++;
                  if (c === "\n") {
                    parser.line++;
                    parser.column = 0;
                  } else {
                    parser.column++;
                  }
                }
              }
              parser.textNode += chunk.substring(starti, i - 1);
            }
            if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
              parser.state = S.OPEN_WAKA;
              parser.startTagPosition = parser.position;
            } else {
              if (!isWhitespace2(c) && (!parser.sawRoot || parser.closedRoot)) {
                strictFail(parser, "Text data outside of root node.");
              }
              if (c === "&") {
                parser.state = S.TEXT_ENTITY;
              } else {
                parser.textNode += c;
              }
            }
            continue;
          case S.SCRIPT:
            if (c === "<") {
              parser.state = S.SCRIPT_ENDING;
            } else {
              parser.script += c;
            }
            continue;
          case S.SCRIPT_ENDING:
            if (c === "/") {
              parser.state = S.CLOSE_TAG;
            } else {
              parser.script += "<" + c;
              parser.state = S.SCRIPT;
            }
            continue;
          case S.OPEN_WAKA:
            if (c === "!") {
              parser.state = S.SGML_DECL;
              parser.sgmlDecl = "";
            } else if (isWhitespace2(c)) ;
            else if (isMatch(nameStart, c)) {
              parser.state = S.OPEN_TAG;
              parser.tagName = c;
            } else if (c === "/") {
              parser.state = S.CLOSE_TAG;
              parser.tagName = "";
            } else if (c === "?") {
              parser.state = S.PROC_INST;
              parser.procInstName = parser.procInstBody = "";
            } else {
              strictFail(parser, "Unencoded <");
              if (parser.startTagPosition + 1 < parser.position) {
                var pad = parser.position - parser.startTagPosition;
                c = new Array(pad).join(" ") + c;
              }
              parser.textNode += "<" + c;
              parser.state = S.TEXT;
            }
            continue;
          case S.SGML_DECL:
            if (parser.sgmlDecl + c === "--") {
              parser.state = S.COMMENT;
              parser.comment = "";
              parser.sgmlDecl = "";
              continue;
            }
            if (parser.doctype && parser.doctype !== true && parser.sgmlDecl) {
              parser.state = S.DOCTYPE_DTD;
              parser.doctype += "<!" + parser.sgmlDecl + c;
              parser.sgmlDecl = "";
            } else if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
              emitNode(parser, "onopencdata");
              parser.state = S.CDATA;
              parser.sgmlDecl = "";
              parser.cdata = "";
            } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
              parser.state = S.DOCTYPE;
              if (parser.doctype || parser.sawRoot) {
                strictFail(
                  parser,
                  "Inappropriately located doctype declaration"
                );
              }
              parser.doctype = "";
              parser.sgmlDecl = "";
            } else if (c === ">") {
              emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
              parser.sgmlDecl = "";
              parser.state = S.TEXT;
            } else if (isQuote(c)) {
              parser.state = S.SGML_DECL_QUOTED;
              parser.sgmlDecl += c;
            } else {
              parser.sgmlDecl += c;
            }
            continue;
          case S.SGML_DECL_QUOTED:
            if (c === parser.q) {
              parser.state = S.SGML_DECL;
              parser.q = "";
            }
            parser.sgmlDecl += c;
            continue;
          case S.DOCTYPE:
            if (c === ">") {
              parser.state = S.TEXT;
              emitNode(parser, "ondoctype", parser.doctype);
              parser.doctype = true;
            } else {
              parser.doctype += c;
              if (c === "[") {
                parser.state = S.DOCTYPE_DTD;
              } else if (isQuote(c)) {
                parser.state = S.DOCTYPE_QUOTED;
                parser.q = c;
              }
            }
            continue;
          case S.DOCTYPE_QUOTED:
            parser.doctype += c;
            if (c === parser.q) {
              parser.q = "";
              parser.state = S.DOCTYPE;
            }
            continue;
          case S.DOCTYPE_DTD:
            if (c === "]") {
              parser.doctype += c;
              parser.state = S.DOCTYPE;
            } else if (c === "<") {
              parser.state = S.OPEN_WAKA;
              parser.startTagPosition = parser.position;
            } else if (isQuote(c)) {
              parser.doctype += c;
              parser.state = S.DOCTYPE_DTD_QUOTED;
              parser.q = c;
            } else {
              parser.doctype += c;
            }
            continue;
          case S.DOCTYPE_DTD_QUOTED:
            parser.doctype += c;
            if (c === parser.q) {
              parser.state = S.DOCTYPE_DTD;
              parser.q = "";
            }
            continue;
          case S.COMMENT:
            if (c === "-") {
              parser.state = S.COMMENT_ENDING;
            } else {
              parser.comment += c;
            }
            continue;
          case S.COMMENT_ENDING:
            if (c === "-") {
              parser.state = S.COMMENT_ENDED;
              parser.comment = textopts(parser.opt, parser.comment);
              if (parser.comment) {
                emitNode(parser, "oncomment", parser.comment);
              }
              parser.comment = "";
            } else {
              parser.comment += "-" + c;
              parser.state = S.COMMENT;
            }
            continue;
          case S.COMMENT_ENDED:
            if (c !== ">") {
              strictFail(parser, "Malformed comment");
              parser.comment += "--" + c;
              parser.state = S.COMMENT;
            } else if (parser.doctype && parser.doctype !== true) {
              parser.state = S.DOCTYPE_DTD;
            } else {
              parser.state = S.TEXT;
            }
            continue;
          case S.CDATA:
            if (c === "]") {
              parser.state = S.CDATA_ENDING;
            } else {
              parser.cdata += c;
            }
            continue;
          case S.CDATA_ENDING:
            if (c === "]") {
              parser.state = S.CDATA_ENDING_2;
            } else {
              parser.cdata += "]" + c;
              parser.state = S.CDATA;
            }
            continue;
          case S.CDATA_ENDING_2:
            if (c === ">") {
              if (parser.cdata) {
                emitNode(parser, "oncdata", parser.cdata);
              }
              emitNode(parser, "onclosecdata");
              parser.cdata = "";
              parser.state = S.TEXT;
            } else if (c === "]") {
              parser.cdata += "]";
            } else {
              parser.cdata += "]]" + c;
              parser.state = S.CDATA;
            }
            continue;
          case S.PROC_INST:
            if (c === "?") {
              parser.state = S.PROC_INST_ENDING;
            } else if (isWhitespace2(c)) {
              parser.state = S.PROC_INST_BODY;
            } else {
              parser.procInstName += c;
            }
            continue;
          case S.PROC_INST_BODY:
            if (!parser.procInstBody && isWhitespace2(c)) {
              continue;
            } else if (c === "?") {
              parser.state = S.PROC_INST_ENDING;
            } else {
              parser.procInstBody += c;
            }
            continue;
          case S.PROC_INST_ENDING:
            if (c === ">") {
              emitNode(parser, "onprocessinginstruction", {
                name: parser.procInstName,
                body: parser.procInstBody
              });
              parser.procInstName = parser.procInstBody = "";
              parser.state = S.TEXT;
            } else {
              parser.procInstBody += "?" + c;
              parser.state = S.PROC_INST_BODY;
            }
            continue;
          case S.OPEN_TAG:
            if (isMatch(nameBody, c)) {
              parser.tagName += c;
            } else {
              newTag(parser);
              if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else {
                if (!isWhitespace2(c)) {
                  strictFail(parser, "Invalid character in tag name");
                }
                parser.state = S.ATTRIB;
              }
            }
            continue;
          case S.OPEN_TAG_SLASH:
            if (c === ">") {
              openTag(parser, true);
              closeTag(parser);
            } else {
              strictFail(parser, "Forward-slash in opening tag not followed by >");
              parser.state = S.ATTRIB;
            }
            continue;
          case S.ATTRIB:
            if (isWhitespace2(c)) {
              continue;
            } else if (c === ">") {
              openTag(parser);
            } else if (c === "/") {
              parser.state = S.OPEN_TAG_SLASH;
            } else if (isMatch(nameStart, c)) {
              parser.attribName = c;
              parser.attribValue = "";
              parser.state = S.ATTRIB_NAME;
            } else {
              strictFail(parser, "Invalid attribute name");
            }
            continue;
          case S.ATTRIB_NAME:
            if (c === "=") {
              parser.state = S.ATTRIB_VALUE;
            } else if (c === ">") {
              strictFail(parser, "Attribute without value");
              parser.attribValue = parser.attribName;
              attrib(parser);
              openTag(parser);
            } else if (isWhitespace2(c)) {
              parser.state = S.ATTRIB_NAME_SAW_WHITE;
            } else if (isMatch(nameBody, c)) {
              parser.attribName += c;
            } else {
              strictFail(parser, "Invalid attribute name");
            }
            continue;
          case S.ATTRIB_NAME_SAW_WHITE:
            if (c === "=") {
              parser.state = S.ATTRIB_VALUE;
            } else if (isWhitespace2(c)) {
              continue;
            } else {
              strictFail(parser, "Attribute without value");
              parser.tag.attributes[parser.attribName] = "";
              parser.attribValue = "";
              emitNode(parser, "onattribute", {
                name: parser.attribName,
                value: ""
              });
              parser.attribName = "";
              if (c === ">") {
                openTag(parser);
              } else if (isMatch(nameStart, c)) {
                parser.attribName = c;
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
                parser.state = S.ATTRIB;
              }
            }
            continue;
          case S.ATTRIB_VALUE:
            if (isWhitespace2(c)) {
              continue;
            } else if (isQuote(c)) {
              parser.q = c;
              parser.state = S.ATTRIB_VALUE_QUOTED;
            } else {
              if (!parser.opt.unquotedAttributeValues) {
                error2(parser, "Unquoted attribute value");
              }
              parser.state = S.ATTRIB_VALUE_UNQUOTED;
              parser.attribValue = c;
            }
            continue;
          case S.ATTRIB_VALUE_QUOTED:
            if (c !== parser.q) {
              if (c === "&") {
                parser.state = S.ATTRIB_VALUE_ENTITY_Q;
              } else {
                parser.attribValue += c;
              }
              continue;
            }
            attrib(parser);
            parser.q = "";
            parser.state = S.ATTRIB_VALUE_CLOSED;
            continue;
          case S.ATTRIB_VALUE_CLOSED:
            if (isWhitespace2(c)) {
              parser.state = S.ATTRIB;
            } else if (c === ">") {
              openTag(parser);
            } else if (c === "/") {
              parser.state = S.OPEN_TAG_SLASH;
            } else if (isMatch(nameStart, c)) {
              strictFail(parser, "No whitespace between attributes");
              parser.attribName = c;
              parser.attribValue = "";
              parser.state = S.ATTRIB_NAME;
            } else {
              strictFail(parser, "Invalid attribute name");
            }
            continue;
          case S.ATTRIB_VALUE_UNQUOTED:
            if (!isAttribEnd(c)) {
              if (c === "&") {
                parser.state = S.ATTRIB_VALUE_ENTITY_U;
              } else {
                parser.attribValue += c;
              }
              continue;
            }
            attrib(parser);
            if (c === ">") {
              openTag(parser);
            } else {
              parser.state = S.ATTRIB;
            }
            continue;
          case S.CLOSE_TAG:
            if (!parser.tagName) {
              if (isWhitespace2(c)) {
                continue;
              } else if (notMatch(nameStart, c)) {
                if (parser.script) {
                  parser.script += "</" + c;
                  parser.state = S.SCRIPT;
                } else {
                  strictFail(parser, "Invalid tagname in closing tag.");
                }
              } else {
                parser.tagName = c;
              }
            } else if (c === ">") {
              closeTag(parser);
            } else if (isMatch(nameBody, c)) {
              parser.tagName += c;
            } else if (parser.script) {
              parser.script += "</" + parser.tagName;
              parser.tagName = "";
              parser.state = S.SCRIPT;
            } else {
              if (!isWhitespace2(c)) {
                strictFail(parser, "Invalid tagname in closing tag");
              }
              parser.state = S.CLOSE_TAG_SAW_WHITE;
            }
            continue;
          case S.CLOSE_TAG_SAW_WHITE:
            if (isWhitespace2(c)) {
              continue;
            }
            if (c === ">") {
              closeTag(parser);
            } else {
              strictFail(parser, "Invalid characters in closing tag");
            }
            continue;
          case S.TEXT_ENTITY:
          case S.ATTRIB_VALUE_ENTITY_Q:
          case S.ATTRIB_VALUE_ENTITY_U:
            var returnState;
            var buffer;
            switch (parser.state) {
              case S.TEXT_ENTITY:
                returnState = S.TEXT;
                buffer = "textNode";
                break;
              case S.ATTRIB_VALUE_ENTITY_Q:
                returnState = S.ATTRIB_VALUE_QUOTED;
                buffer = "attribValue";
                break;
              case S.ATTRIB_VALUE_ENTITY_U:
                returnState = S.ATTRIB_VALUE_UNQUOTED;
                buffer = "attribValue";
                break;
            }
            if (c === ";") {
              var parsedEntity = parseEntity(parser);
              if (parser.opt.unparsedEntities && !Object.values(sax2.XML_ENTITIES).includes(parsedEntity)) {
                parser.entity = "";
                parser.state = returnState;
                parser.write(parsedEntity);
              } else {
                parser[buffer] += parsedEntity;
                parser.entity = "";
                parser.state = returnState;
              }
            } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
              parser.entity += c;
            } else {
              strictFail(parser, "Invalid character in entity name");
              parser[buffer] += "&" + parser.entity + c;
              parser.entity = "";
              parser.state = returnState;
            }
            continue;
          default: {
            throw new Error(parser, "Unknown state: " + parser.state);
          }
        }
      }
      if (parser.position >= parser.bufferCheckPosition) {
        checkBufferLength(parser);
      }
      return parser;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    if (!String.fromCodePoint) {
      (function() {
        var stringFromCharCode = String.fromCharCode;
        var floor2 = Math.floor;
        var fromCodePoint = function() {
          var MAX_SIZE = 16384;
          var codeUnits = [];
          var highSurrogate;
          var lowSurrogate;
          var index = -1;
          var length = arguments.length;
          if (!length) {
            return "";
          }
          var result = "";
          while (++index < length) {
            var codePoint = Number(arguments[index]);
            if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
            codePoint < 0 || // not a valid Unicode code point
            codePoint > 1114111 || // not a valid Unicode code point
            floor2(codePoint) !== codePoint) {
              throw RangeError("Invalid code point: " + codePoint);
            }
            if (codePoint <= 65535) {
              codeUnits.push(codePoint);
            } else {
              codePoint -= 65536;
              highSurrogate = (codePoint >> 10) + 55296;
              lowSurrogate = codePoint % 1024 + 56320;
              codeUnits.push(highSurrogate, lowSurrogate);
            }
            if (index + 1 === length || codeUnits.length > MAX_SIZE) {
              result += stringFromCharCode.apply(null, codeUnits);
              codeUnits.length = 0;
            }
          }
          return result;
        };
        if (Object.defineProperty) {
          Object.defineProperty(String, "fromCodePoint", {
            value: fromCodePoint,
            configurable: true,
            writable: true
          });
        } else {
          String.fromCodePoint = fromCodePoint;
        }
      })();
    }
  })(exports2);
})(sax$1);
Object.defineProperty(xml, "__esModule", { value: true });
xml.XElement = void 0;
xml.parseXml = parseXml;
const sax = sax$1;
const error_1 = error;
class XElement {
  constructor(name) {
    this.name = name;
    this.value = "";
    this.attributes = null;
    this.isCData = false;
    this.elements = null;
    if (!name) {
      throw (0, error_1.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    }
    if (!isValidName(name)) {
      throw (0, error_1.newError)(`Invalid element name: ${name}`, "ERR_XML_ELEMENT_INVALID_NAME");
    }
  }
  attribute(name) {
    const result = this.attributes === null ? null : this.attributes[name];
    if (result == null) {
      throw (0, error_1.newError)(`No attribute "${name}"`, "ERR_XML_MISSED_ATTRIBUTE");
    }
    return result;
  }
  removeAttribute(name) {
    if (this.attributes !== null) {
      delete this.attributes[name];
    }
  }
  element(name, ignoreCase = false, errorIfMissed = null) {
    const result = this.elementOrNull(name, ignoreCase);
    if (result === null) {
      throw (0, error_1.newError)(errorIfMissed || `No element "${name}"`, "ERR_XML_MISSED_ELEMENT");
    }
    return result;
  }
  elementOrNull(name, ignoreCase = false) {
    if (this.elements === null) {
      return null;
    }
    for (const element of this.elements) {
      if (isNameEquals(element, name, ignoreCase)) {
        return element;
      }
    }
    return null;
  }
  getElements(name, ignoreCase = false) {
    if (this.elements === null) {
      return [];
    }
    return this.elements.filter((it) => isNameEquals(it, name, ignoreCase));
  }
  elementValueOrEmpty(name, ignoreCase = false) {
    const element = this.elementOrNull(name, ignoreCase);
    return element === null ? "" : element.value;
  }
}
xml.XElement = XElement;
const NAME_REG_EXP = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function isValidName(name) {
  return NAME_REG_EXP.test(name);
}
function isNameEquals(element, name, ignoreCase) {
  const elementName = element.name;
  return elementName === name || ignoreCase === true && elementName.length === name.length && elementName.toLowerCase() === name.toLowerCase();
}
function parseXml(data) {
  let rootElement = null;
  const parser = sax.parser(true, {});
  const elements = [];
  parser.onopentag = (saxElement) => {
    const element = new XElement(saxElement.name);
    element.attributes = saxElement.attributes;
    if (rootElement === null) {
      rootElement = element;
    } else {
      const parent = elements[elements.length - 1];
      if (parent.elements == null) {
        parent.elements = [];
      }
      parent.elements.push(element);
    }
    elements.push(element);
  };
  parser.onclosetag = () => {
    elements.pop();
  };
  parser.ontext = (text) => {
    if (elements.length > 0) {
      elements[elements.length - 1].value = text;
    }
  };
  parser.oncdata = (cdata) => {
    const element = elements[elements.length - 1];
    element.value = cdata;
    element.isCData = true;
  };
  parser.onerror = (err) => {
    throw err;
  };
  parser.write(data);
  return rootElement;
}
var MemoLazy$1 = {};
Object.defineProperty(MemoLazy$1, "__esModule", { value: true });
MemoLazy$1.MemoLazy = void 0;
class MemoLazy {
  constructor(selector, creator) {
    this.selector = selector;
    this.creator = creator;
    this.selected = void 0;
    this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const selected = this.selector();
    if (this._value !== void 0 && equals(this.selected, selected)) {
      return this._value;
    }
    this.selected = selected;
    const result = this.creator(selected);
    this.value = result;
    return result;
  }
  set value(value) {
    this._value = value;
  }
}
MemoLazy$1.MemoLazy = MemoLazy;
function equals(firstValue, secondValue) {
  const isFirstObject = typeof firstValue === "object" && firstValue !== null;
  const isSecondObject = typeof secondValue === "object" && secondValue !== null;
  if (isFirstObject && isSecondObject) {
    const keys1 = Object.keys(firstValue);
    const keys2 = Object.keys(secondValue);
    return keys1.length === keys2.length && keys1.every((key) => equals(firstValue[key], secondValue[key]));
  }
  return firstValue === secondValue;
}
var retry$2 = {};
Object.defineProperty(retry$2, "__esModule", { value: true });
retry$2.retry = retry$1;
const CancellationToken_1 = CancellationToken$1;
async function retry$1(task, retryCount, interval, backoff = 0, attempt = 0, shouldRetry) {
  var _a;
  const cancellationToken = new CancellationToken_1.CancellationToken();
  try {
    return await task();
  } catch (error2) {
    if (((_a = shouldRetry === null || shouldRetry === void 0 ? void 0 : shouldRetry(error2)) !== null && _a !== void 0 ? _a : true) && retryCount > 0 && !cancellationToken.cancelled) {
      await new Promise((resolve) => setTimeout(resolve, interval + backoff * attempt));
      return await retry$1(task, retryCount - 1, interval, backoff, attempt + 1, shouldRetry);
    } else {
      throw error2;
    }
  }
}
(function(exports2) {
  Object.defineProperty(exports2, "__esModule", { value: true });
  exports2.CURRENT_APP_PACKAGE_FILE_NAME = exports2.CURRENT_APP_INSTALLER_FILE_NAME = exports2.retry = exports2.MemoLazy = exports2.newError = exports2.XElement = exports2.parseXml = exports2.ProgressCallbackTransform = exports2.UUID = exports2.parseDn = exports2.githubUrl = exports2.getS3LikeProviderBaseUrl = exports2.configureRequestUrl = exports2.parseJson = exports2.safeStringifyJson = exports2.configureRequestOptionsFromUrl = exports2.configureRequestOptions = exports2.safeGetHeader = exports2.DigestTransform = exports2.HttpExecutor = exports2.createHttpError = exports2.HttpError = exports2.CancellationError = exports2.CancellationToken = void 0;
  exports2.asArray = asArray;
  var CancellationToken_12 = CancellationToken$1;
  Object.defineProperty(exports2, "CancellationToken", { enumerable: true, get: function() {
    return CancellationToken_12.CancellationToken;
  } });
  Object.defineProperty(exports2, "CancellationError", { enumerable: true, get: function() {
    return CancellationToken_12.CancellationError;
  } });
  var httpExecutor_1 = httpExecutor;
  Object.defineProperty(exports2, "HttpError", { enumerable: true, get: function() {
    return httpExecutor_1.HttpError;
  } });
  Object.defineProperty(exports2, "createHttpError", { enumerable: true, get: function() {
    return httpExecutor_1.createHttpError;
  } });
  Object.defineProperty(exports2, "HttpExecutor", { enumerable: true, get: function() {
    return httpExecutor_1.HttpExecutor;
  } });
  Object.defineProperty(exports2, "DigestTransform", { enumerable: true, get: function() {
    return httpExecutor_1.DigestTransform;
  } });
  Object.defineProperty(exports2, "safeGetHeader", { enumerable: true, get: function() {
    return httpExecutor_1.safeGetHeader;
  } });
  Object.defineProperty(exports2, "configureRequestOptions", { enumerable: true, get: function() {
    return httpExecutor_1.configureRequestOptions;
  } });
  Object.defineProperty(exports2, "configureRequestOptionsFromUrl", { enumerable: true, get: function() {
    return httpExecutor_1.configureRequestOptionsFromUrl;
  } });
  Object.defineProperty(exports2, "safeStringifyJson", { enumerable: true, get: function() {
    return httpExecutor_1.safeStringifyJson;
  } });
  Object.defineProperty(exports2, "parseJson", { enumerable: true, get: function() {
    return httpExecutor_1.parseJson;
  } });
  Object.defineProperty(exports2, "configureRequestUrl", { enumerable: true, get: function() {
    return httpExecutor_1.configureRequestUrl;
  } });
  var publishOptions_1 = publishOptions;
  Object.defineProperty(exports2, "getS3LikeProviderBaseUrl", { enumerable: true, get: function() {
    return publishOptions_1.getS3LikeProviderBaseUrl;
  } });
  Object.defineProperty(exports2, "githubUrl", { enumerable: true, get: function() {
    return publishOptions_1.githubUrl;
  } });
  var rfc2253Parser_1 = rfc2253Parser;
  Object.defineProperty(exports2, "parseDn", { enumerable: true, get: function() {
    return rfc2253Parser_1.parseDn;
  } });
  var uuid_1 = uuid;
  Object.defineProperty(exports2, "UUID", { enumerable: true, get: function() {
    return uuid_1.UUID;
  } });
  var ProgressCallbackTransform_12 = ProgressCallbackTransform$1;
  Object.defineProperty(exports2, "ProgressCallbackTransform", { enumerable: true, get: function() {
    return ProgressCallbackTransform_12.ProgressCallbackTransform;
  } });
  var xml_1 = xml;
  Object.defineProperty(exports2, "parseXml", { enumerable: true, get: function() {
    return xml_1.parseXml;
  } });
  Object.defineProperty(exports2, "XElement", { enumerable: true, get: function() {
    return xml_1.XElement;
  } });
  var error_12 = error;
  Object.defineProperty(exports2, "newError", { enumerable: true, get: function() {
    return error_12.newError;
  } });
  var MemoLazy_1 = MemoLazy$1;
  Object.defineProperty(exports2, "MemoLazy", { enumerable: true, get: function() {
    return MemoLazy_1.MemoLazy;
  } });
  var retry_1 = retry$2;
  Object.defineProperty(exports2, "retry", { enumerable: true, get: function() {
    return retry_1.retry;
  } });
  exports2.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe";
  exports2.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function asArray(v) {
    if (v == null) {
      return [];
    } else if (Array.isArray(v)) {
      return v;
    } else {
      return [v];
    }
  }
})(out);
var fs$j = {};
var universalify$1 = {};
universalify$1.fromCallback = function(fn) {
  return Object.defineProperty(function(...args) {
    if (typeof args[args.length - 1] === "function") fn.apply(this, args);
    else {
      return new Promise((resolve, reject) => {
        args.push((err, res) => err != null ? reject(err) : resolve(res));
        fn.apply(this, args);
      });
    }
  }, "name", { value: fn.name });
};
universalify$1.fromPromise = function(fn) {
  return Object.defineProperty(function(...args) {
    const cb = args[args.length - 1];
    if (typeof cb !== "function") return fn.apply(this, args);
    else {
      args.pop();
      fn.apply(this, args).then((r) => cb(null, r), cb);
    }
  }, "name", { value: fn.name });
};
var constants$2 = require$$0$5;
var origCwd = process.cwd;
var cwd = null;
var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process);
  return cwd;
};
try {
  process.cwd();
} catch (er) {
}
if (typeof process.chdir === "function") {
  var chdir = process.chdir;
  process.chdir = function(d) {
    cwd = null;
    chdir.call(process, d);
  };
  if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
}
var polyfills$1 = patch$3;
function patch$3(fs2) {
  if (constants$2.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs2);
  }
  if (!fs2.lutimes) {
    patchLutimes(fs2);
  }
  fs2.chown = chownFix(fs2.chown);
  fs2.fchown = chownFix(fs2.fchown);
  fs2.lchown = chownFix(fs2.lchown);
  fs2.chmod = chmodFix(fs2.chmod);
  fs2.fchmod = chmodFix(fs2.fchmod);
  fs2.lchmod = chmodFix(fs2.lchmod);
  fs2.chownSync = chownFixSync(fs2.chownSync);
  fs2.fchownSync = chownFixSync(fs2.fchownSync);
  fs2.lchownSync = chownFixSync(fs2.lchownSync);
  fs2.chmodSync = chmodFixSync(fs2.chmodSync);
  fs2.fchmodSync = chmodFixSync(fs2.fchmodSync);
  fs2.lchmodSync = chmodFixSync(fs2.lchmodSync);
  fs2.stat = statFix(fs2.stat);
  fs2.fstat = statFix(fs2.fstat);
  fs2.lstat = statFix(fs2.lstat);
  fs2.statSync = statFixSync(fs2.statSync);
  fs2.fstatSync = statFixSync(fs2.fstatSync);
  fs2.lstatSync = statFixSync(fs2.lstatSync);
  if (fs2.chmod && !fs2.lchmod) {
    fs2.lchmod = function(path2, mode, cb) {
      if (cb) process.nextTick(cb);
    };
    fs2.lchmodSync = function() {
    };
  }
  if (fs2.chown && !fs2.lchown) {
    fs2.lchown = function(path2, uid, gid, cb) {
      if (cb) process.nextTick(cb);
    };
    fs2.lchownSync = function() {
    };
  }
  if (platform === "win32") {
    fs2.rename = typeof fs2.rename !== "function" ? fs2.rename : function(fs$rename) {
      function rename2(from, to, cb) {
        var start = Date.now();
        var backoff = 0;
        fs$rename(from, to, function CB(er) {
          if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
            setTimeout(function() {
              fs2.stat(to, function(stater, st) {
                if (stater && stater.code === "ENOENT")
                  fs$rename(from, to, CB);
                else
                  cb(er);
              });
            }, backoff);
            if (backoff < 100)
              backoff += 10;
            return;
          }
          if (cb) cb(er);
        });
      }
      if (Object.setPrototypeOf) Object.setPrototypeOf(rename2, fs$rename);
      return rename2;
    }(fs2.rename);
  }
  fs2.read = typeof fs2.read !== "function" ? fs2.read : function(fs$read) {
    function read(fd, buffer, offset, length, position, callback_) {
      var callback;
      if (callback_ && typeof callback_ === "function") {
        var eagCounter = 0;
        callback = function(er, _, __) {
          if (er && er.code === "EAGAIN" && eagCounter < 10) {
            eagCounter++;
            return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
          }
          callback_.apply(this, arguments);
        };
      }
      return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
    }
    if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
    return read;
  }(fs2.read);
  fs2.readSync = typeof fs2.readSync !== "function" ? fs2.readSync : /* @__PURE__ */ function(fs$readSync) {
    return function(fd, buffer, offset, length, position) {
      var eagCounter = 0;
      while (true) {
        try {
          return fs$readSync.call(fs2, fd, buffer, offset, length, position);
        } catch (er) {
          if (er.code === "EAGAIN" && eagCounter < 10) {
            eagCounter++;
            continue;
          }
          throw er;
        }
      }
    };
  }(fs2.readSync);
  function patchLchmod(fs22) {
    fs22.lchmod = function(path2, mode, callback) {
      fs22.open(
        path2,
        constants$2.O_WRONLY | constants$2.O_SYMLINK,
        mode,
        function(err, fd) {
          if (err) {
            if (callback) callback(err);
            return;
          }
          fs22.fchmod(fd, mode, function(err2) {
            fs22.close(fd, function(err22) {
              if (callback) callback(err2 || err22);
            });
          });
        }
      );
    };
    fs22.lchmodSync = function(path2, mode) {
      var fd = fs22.openSync(path2, constants$2.O_WRONLY | constants$2.O_SYMLINK, mode);
      var threw = true;
      var ret;
      try {
        ret = fs22.fchmodSync(fd, mode);
        threw = false;
      } finally {
        if (threw) {
          try {
            fs22.closeSync(fd);
          } catch (er) {
          }
        } else {
          fs22.closeSync(fd);
        }
      }
      return ret;
    };
  }
  function patchLutimes(fs22) {
    if (constants$2.hasOwnProperty("O_SYMLINK") && fs22.futimes) {
      fs22.lutimes = function(path2, at, mt, cb) {
        fs22.open(path2, constants$2.O_SYMLINK, function(er, fd) {
          if (er) {
            if (cb) cb(er);
            return;
          }
          fs22.futimes(fd, at, mt, function(er2) {
            fs22.close(fd, function(er22) {
              if (cb) cb(er2 || er22);
            });
          });
        });
      };
      fs22.lutimesSync = function(path2, at, mt) {
        var fd = fs22.openSync(path2, constants$2.O_SYMLINK);
        var ret;
        var threw = true;
        try {
          ret = fs22.futimesSync(fd, at, mt);
          threw = false;
        } finally {
          if (threw) {
            try {
              fs22.closeSync(fd);
            } catch (er) {
            }
          } else {
            fs22.closeSync(fd);
          }
        }
        return ret;
      };
    } else if (fs22.futimes) {
      fs22.lutimes = function(_a, _b, _c, cb) {
        if (cb) process.nextTick(cb);
      };
      fs22.lutimesSync = function() {
      };
    }
  }
  function chmodFix(orig) {
    if (!orig) return orig;
    return function(target, mode, cb) {
      return orig.call(fs2, target, mode, function(er) {
        if (chownErOk(er)) er = null;
        if (cb) cb.apply(this, arguments);
      });
    };
  }
  function chmodFixSync(orig) {
    if (!orig) return orig;
    return function(target, mode) {
      try {
        return orig.call(fs2, target, mode);
      } catch (er) {
        if (!chownErOk(er)) throw er;
      }
    };
  }
  function chownFix(orig) {
    if (!orig) return orig;
    return function(target, uid, gid, cb) {
      return orig.call(fs2, target, uid, gid, function(er) {
        if (chownErOk(er)) er = null;
        if (cb) cb.apply(this, arguments);
      });
    };
  }
  function chownFixSync(orig) {
    if (!orig) return orig;
    return function(target, uid, gid) {
      try {
        return orig.call(fs2, target, uid, gid);
      } catch (er) {
        if (!chownErOk(er)) throw er;
      }
    };
  }
  function statFix(orig) {
    if (!orig) return orig;
    return function(target, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      function callback(er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 4294967296;
          if (stats.gid < 0) stats.gid += 4294967296;
        }
        if (cb) cb.apply(this, arguments);
      }
      return options ? orig.call(fs2, target, options, callback) : orig.call(fs2, target, callback);
    };
  }
  function statFixSync(orig) {
    if (!orig) return orig;
    return function(target, options) {
      var stats = options ? orig.call(fs2, target, options) : orig.call(fs2, target);
      if (stats) {
        if (stats.uid < 0) stats.uid += 4294967296;
        if (stats.gid < 0) stats.gid += 4294967296;
      }
      return stats;
    };
  }
  function chownErOk(er) {
    if (!er)
      return true;
    if (er.code === "ENOSYS")
      return true;
    var nonroot = !process.getuid || process.getuid() !== 0;
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true;
    }
    return false;
  }
}
var Stream = stream.Stream;
var legacyStreams = legacy$1;
function legacy$1(fs2) {
  return {
    ReadStream,
    WriteStream
  };
  function ReadStream(path2, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path2, options);
    Stream.call(this);
    var self2 = this;
    this.path = path2;
    this.fd = null;
    this.readable = true;
    this.paused = false;
    this.flags = "r";
    this.mode = 438;
    this.bufferSize = 64 * 1024;
    options = options || {};
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }
    if (this.encoding) this.setEncoding(this.encoding);
    if (this.start !== void 0) {
      if ("number" !== typeof this.start) {
        throw TypeError("start must be a Number");
      }
      if (this.end === void 0) {
        this.end = Infinity;
      } else if ("number" !== typeof this.end) {
        throw TypeError("end must be a Number");
      }
      if (this.start > this.end) {
        throw new Error("start must be <= end");
      }
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        self2._read();
      });
      return;
    }
    fs2.open(this.path, this.flags, this.mode, function(err, fd) {
      if (err) {
        self2.emit("error", err);
        self2.readable = false;
        return;
      }
      self2.fd = fd;
      self2.emit("open", fd);
      self2._read();
    });
  }
  function WriteStream(path2, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path2, options);
    Stream.call(this);
    this.path = path2;
    this.fd = null;
    this.writable = true;
    this.flags = "w";
    this.encoding = "binary";
    this.mode = 438;
    this.bytesWritten = 0;
    options = options || {};
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }
    if (this.start !== void 0) {
      if ("number" !== typeof this.start) {
        throw TypeError("start must be a Number");
      }
      if (this.start < 0) {
        throw new Error("start must be >= zero");
      }
      this.pos = this.start;
    }
    this.busy = false;
    this._queue = [];
    if (this.fd === null) {
      this._open = fs2.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
      this.flush();
    }
  }
}
var clone_1 = clone$1;
var getPrototypeOf = Object.getPrototypeOf || function(obj) {
  return obj.__proto__;
};
function clone$1(obj) {
  if (obj === null || typeof obj !== "object")
    return obj;
  if (obj instanceof Object)
    var copy2 = { __proto__: getPrototypeOf(obj) };
  else
    var copy2 = /* @__PURE__ */ Object.create(null);
  Object.getOwnPropertyNames(obj).forEach(function(key) {
    Object.defineProperty(copy2, key, Object.getOwnPropertyDescriptor(obj, key));
  });
  return copy2;
}
var fs$i = require$$1$2;
var polyfills = polyfills$1;
var legacy = legacyStreams;
var clone = clone_1;
var util$2 = require$$1;
var gracefulQueue;
var previousSymbol;
if (typeof Symbol === "function" && typeof Symbol.for === "function") {
  gracefulQueue = Symbol.for("graceful-fs.queue");
  previousSymbol = Symbol.for("graceful-fs.previous");
} else {
  gracefulQueue = "___graceful-fs.queue";
  previousSymbol = "___graceful-fs.previous";
}
function noop() {
}
function publishQueue(context, queue2) {
  Object.defineProperty(context, gracefulQueue, {
    get: function() {
      return queue2;
    }
  });
}
var debug$2 = noop;
if (util$2.debuglog)
  debug$2 = util$2.debuglog("gfs4");
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
  debug$2 = function() {
    var m = util$2.format.apply(util$2, arguments);
    m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
    console.error(m);
  };
if (!fs$i[gracefulQueue]) {
  var queue = commonjsGlobal[gracefulQueue] || [];
  publishQueue(fs$i, queue);
  fs$i.close = function(fs$close) {
    function close(fd, cb) {
      return fs$close.call(fs$i, fd, function(err) {
        if (!err) {
          resetQueue();
        }
        if (typeof cb === "function")
          cb.apply(this, arguments);
      });
    }
    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    });
    return close;
  }(fs$i.close);
  fs$i.closeSync = function(fs$closeSync) {
    function closeSync(fd) {
      fs$closeSync.apply(fs$i, arguments);
      resetQueue();
    }
    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    });
    return closeSync;
  }(fs$i.closeSync);
  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
    process.on("exit", function() {
      debug$2(fs$i[gracefulQueue]);
      require$$4$2.equal(fs$i[gracefulQueue].length, 0);
    });
  }
}
if (!commonjsGlobal[gracefulQueue]) {
  publishQueue(commonjsGlobal, fs$i[gracefulQueue]);
}
var gracefulFs = patch$2(clone(fs$i));
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs$i.__patched) {
  gracefulFs = patch$2(fs$i);
  fs$i.__patched = true;
}
function patch$2(fs2) {
  polyfills(fs2);
  fs2.gracefulify = patch$2;
  fs2.createReadStream = createReadStream;
  fs2.createWriteStream = createWriteStream;
  var fs$readFile = fs2.readFile;
  fs2.readFile = readFile2;
  function readFile2(path2, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$readFile(path2, options, cb);
    function go$readFile(path22, options2, cb2, startTime) {
      return fs$readFile(path22, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$readFile, [path22, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$writeFile = fs2.writeFile;
  fs2.writeFile = writeFile2;
  function writeFile2(path2, data, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$writeFile(path2, data, options, cb);
    function go$writeFile(path22, data2, options2, cb2, startTime) {
      return fs$writeFile(path22, data2, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$writeFile, [path22, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$appendFile = fs2.appendFile;
  if (fs$appendFile)
    fs2.appendFile = appendFile;
  function appendFile(path2, data, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$appendFile(path2, data, options, cb);
    function go$appendFile(path22, data2, options2, cb2, startTime) {
      return fs$appendFile(path22, data2, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$appendFile, [path22, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$copyFile = fs2.copyFile;
  if (fs$copyFile)
    fs2.copyFile = copyFile2;
  function copyFile2(src2, dest, flags, cb) {
    if (typeof flags === "function") {
      cb = flags;
      flags = 0;
    }
    return go$copyFile(src2, dest, flags, cb);
    function go$copyFile(src22, dest2, flags2, cb2, startTime) {
      return fs$copyFile(src22, dest2, flags2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$copyFile, [src22, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$readdir = fs2.readdir;
  fs2.readdir = readdir;
  var noReaddirOptionVersions = /^v[0-5]\./;
  function readdir(path2, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path22, options2, cb2, startTime) {
      return fs$readdir(path22, fs$readdirCallback(
        path22,
        options2,
        cb2,
        startTime
      ));
    } : function go$readdir2(path22, options2, cb2, startTime) {
      return fs$readdir(path22, options2, fs$readdirCallback(
        path22,
        options2,
        cb2,
        startTime
      ));
    };
    return go$readdir(path2, options, cb);
    function fs$readdirCallback(path22, options2, cb2, startTime) {
      return function(err, files) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([
            go$readdir,
            [path22, options2, cb2],
            err,
            startTime || Date.now(),
            Date.now()
          ]);
        else {
          if (files && files.sort)
            files.sort();
          if (typeof cb2 === "function")
            cb2.call(this, err, files);
        }
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var legStreams = legacy(fs2);
    ReadStream = legStreams.ReadStream;
    WriteStream = legStreams.WriteStream;
  }
  var fs$ReadStream = fs2.ReadStream;
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype);
    ReadStream.prototype.open = ReadStream$open;
  }
  var fs$WriteStream = fs2.WriteStream;
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype);
    WriteStream.prototype.open = WriteStream$open;
  }
  Object.defineProperty(fs2, "ReadStream", {
    get: function() {
      return ReadStream;
    },
    set: function(val) {
      ReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(fs2, "WriteStream", {
    get: function() {
      return WriteStream;
    },
    set: function(val) {
      WriteStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileReadStream = ReadStream;
  Object.defineProperty(fs2, "FileReadStream", {
    get: function() {
      return FileReadStream;
    },
    set: function(val) {
      FileReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileWriteStream = WriteStream;
  Object.defineProperty(fs2, "FileWriteStream", {
    get: function() {
      return FileWriteStream;
    },
    set: function(val) {
      FileWriteStream = val;
    },
    enumerable: true,
    configurable: true
  });
  function ReadStream(path2, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this;
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
  }
  function ReadStream$open() {
    var that = this;
    open(that.path, that.flags, that.mode, function(err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy();
        that.emit("error", err);
      } else {
        that.fd = fd;
        that.emit("open", fd);
        that.read();
      }
    });
  }
  function WriteStream(path2, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this;
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
  }
  function WriteStream$open() {
    var that = this;
    open(that.path, that.flags, that.mode, function(err, fd) {
      if (err) {
        that.destroy();
        that.emit("error", err);
      } else {
        that.fd = fd;
        that.emit("open", fd);
      }
    });
  }
  function createReadStream(path2, options) {
    return new fs2.ReadStream(path2, options);
  }
  function createWriteStream(path2, options) {
    return new fs2.WriteStream(path2, options);
  }
  var fs$open = fs2.open;
  fs2.open = open;
  function open(path2, flags, mode, cb) {
    if (typeof mode === "function")
      cb = mode, mode = null;
    return go$open(path2, flags, mode, cb);
    function go$open(path22, flags2, mode2, cb2, startTime) {
      return fs$open(path22, flags2, mode2, function(err, fd) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$open, [path22, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  return fs2;
}
function enqueue(elem) {
  debug$2("ENQUEUE", elem[0].name, elem[1]);
  fs$i[gracefulQueue].push(elem);
  retry();
}
var retryTimer;
function resetQueue() {
  var now = Date.now();
  for (var i = 0; i < fs$i[gracefulQueue].length; ++i) {
    if (fs$i[gracefulQueue][i].length > 2) {
      fs$i[gracefulQueue][i][3] = now;
      fs$i[gracefulQueue][i][4] = now;
    }
  }
  retry();
}
function retry() {
  clearTimeout(retryTimer);
  retryTimer = void 0;
  if (fs$i[gracefulQueue].length === 0)
    return;
  var elem = fs$i[gracefulQueue].shift();
  var fn = elem[0];
  var args = elem[1];
  var err = elem[2];
  var startTime = elem[3];
  var lastTime = elem[4];
  if (startTime === void 0) {
    debug$2("RETRY", fn.name, args);
    fn.apply(null, args);
  } else if (Date.now() - startTime >= 6e4) {
    debug$2("TIMEOUT", fn.name, args);
    var cb = args.pop();
    if (typeof cb === "function")
      cb.call(null, err);
  } else {
    var sinceAttempt = Date.now() - lastTime;
    var sinceStart = Math.max(lastTime - startTime, 1);
    var desiredDelay = Math.min(sinceStart * 1.2, 100);
    if (sinceAttempt >= desiredDelay) {
      debug$2("RETRY", fn.name, args);
      fn.apply(null, args.concat([startTime]));
    } else {
      fs$i[gracefulQueue].push(elem);
    }
  }
  if (retryTimer === void 0) {
    retryTimer = setTimeout(retry, 0);
  }
}
(function(exports2) {
  const u2 = universalify$1.fromCallback;
  const fs2 = gracefulFs;
  const api = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((key) => {
    return typeof fs2[key] === "function";
  });
  Object.assign(exports2, fs2);
  api.forEach((method) => {
    exports2[method] = u2(fs2[method]);
  });
  exports2.exists = function(filename, callback) {
    if (typeof callback === "function") {
      return fs2.exists(filename, callback);
    }
    return new Promise((resolve) => {
      return fs2.exists(filename, resolve);
    });
  };
  exports2.read = function(fd, buffer, offset, length, position, callback) {
    if (typeof callback === "function") {
      return fs2.read(fd, buffer, offset, length, position, callback);
    }
    return new Promise((resolve, reject) => {
      fs2.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
        if (err) return reject(err);
        resolve({ bytesRead, buffer: buffer2 });
      });
    });
  };
  exports2.write = function(fd, buffer, ...args) {
    if (typeof args[args.length - 1] === "function") {
      return fs2.write(fd, buffer, ...args);
    }
    return new Promise((resolve, reject) => {
      fs2.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
        if (err) return reject(err);
        resolve({ bytesWritten, buffer: buffer2 });
      });
    });
  };
  if (typeof fs2.writev === "function") {
    exports2.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs2.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs2.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
  }
  if (typeof fs2.realpath.native === "function") {
    exports2.realpath.native = u2(fs2.realpath.native);
  } else {
    process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  }
})(fs$j);
var makeDir$1 = {};
var utils$1 = {};
const path$i = require$$1$1;
utils$1.checkPath = function checkPath(pth) {
  if (process.platform === "win32") {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path$i.parse(pth).root, ""));
    if (pathHasInvalidWinCharacters) {
      const error2 = new Error(`Path contains invalid characters: ${pth}`);
      error2.code = "EINVAL";
      throw error2;
    }
  }
};
const fs$h = fs$j;
const { checkPath: checkPath2 } = utils$1;
const getMode = (options) => {
  const defaults2 = { mode: 511 };
  if (typeof options === "number") return options;
  return { ...defaults2, ...options }.mode;
};
makeDir$1.makeDir = async (dir, options) => {
  checkPath2(dir);
  return fs$h.mkdir(dir, {
    mode: getMode(options),
    recursive: true
  });
};
makeDir$1.makeDirSync = (dir, options) => {
  checkPath2(dir);
  return fs$h.mkdirSync(dir, {
    mode: getMode(options),
    recursive: true
  });
};
const u$a = universalify$1.fromPromise;
const { makeDir: _makeDir, makeDirSync } = makeDir$1;
const makeDir = u$a(_makeDir);
var mkdirs$2 = {
  mkdirs: makeDir,
  mkdirsSync: makeDirSync,
  // alias
  mkdirp: makeDir,
  mkdirpSync: makeDirSync,
  ensureDir: makeDir,
  ensureDirSync: makeDirSync
};
const u$9 = universalify$1.fromPromise;
const fs$g = fs$j;
function pathExists$6(path2) {
  return fs$g.access(path2).then(() => true).catch(() => false);
}
var pathExists_1 = {
  pathExists: u$9(pathExists$6),
  pathExistsSync: fs$g.existsSync
};
const fs$f = gracefulFs;
function utimesMillis$1(path2, atime, mtime, callback) {
  fs$f.open(path2, "r+", (err, fd) => {
    if (err) return callback(err);
    fs$f.futimes(fd, atime, mtime, (futimesErr) => {
      fs$f.close(fd, (closeErr) => {
        if (callback) callback(futimesErr || closeErr);
      });
    });
  });
}
function utimesMillisSync$1(path2, atime, mtime) {
  const fd = fs$f.openSync(path2, "r+");
  fs$f.futimesSync(fd, atime, mtime);
  return fs$f.closeSync(fd);
}
var utimes = {
  utimesMillis: utimesMillis$1,
  utimesMillisSync: utimesMillisSync$1
};
const fs$e = fs$j;
const path$h = require$$1$1;
const util$1 = require$$1;
function getStats$2(src2, dest, opts) {
  const statFunc = opts.dereference ? (file2) => fs$e.stat(file2, { bigint: true }) : (file2) => fs$e.lstat(file2, { bigint: true });
  return Promise.all([
    statFunc(src2),
    statFunc(dest).catch((err) => {
      if (err.code === "ENOENT") return null;
      throw err;
    })
  ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
}
function getStatsSync(src2, dest, opts) {
  let destStat;
  const statFunc = opts.dereference ? (file2) => fs$e.statSync(file2, { bigint: true }) : (file2) => fs$e.lstatSync(file2, { bigint: true });
  const srcStat = statFunc(src2);
  try {
    destStat = statFunc(dest);
  } catch (err) {
    if (err.code === "ENOENT") return { srcStat, destStat: null };
    throw err;
  }
  return { srcStat, destStat };
}
function checkPaths(src2, dest, funcName, opts, cb) {
  util$1.callbackify(getStats$2)(src2, dest, opts, (err, stats) => {
    if (err) return cb(err);
    const { srcStat, destStat } = stats;
    if (destStat) {
      if (areIdentical$2(srcStat, destStat)) {
        const srcBaseName = path$h.basename(src2);
        const destBaseName = path$h.basename(dest);
        if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
          return cb(null, { srcStat, destStat, isChangingCase: true });
        }
        return cb(new Error("Source and destination must not be the same."));
      }
      if (srcStat.isDirectory() && !destStat.isDirectory()) {
        return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src2}'.`));
      }
      if (!srcStat.isDirectory() && destStat.isDirectory()) {
        return cb(new Error(`Cannot overwrite directory '${dest}' with non-directory '${src2}'.`));
      }
    }
    if (srcStat.isDirectory() && isSrcSubdir(src2, dest)) {
      return cb(new Error(errMsg(src2, dest, funcName)));
    }
    return cb(null, { srcStat, destStat });
  });
}
function checkPathsSync(src2, dest, funcName, opts) {
  const { srcStat, destStat } = getStatsSync(src2, dest, opts);
  if (destStat) {
    if (areIdentical$2(srcStat, destStat)) {
      const srcBaseName = path$h.basename(src2);
      const destBaseName = path$h.basename(dest);
      if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
        return { srcStat, destStat, isChangingCase: true };
      }
      throw new Error("Source and destination must not be the same.");
    }
    if (srcStat.isDirectory() && !destStat.isDirectory()) {
      throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src2}'.`);
    }
    if (!srcStat.isDirectory() && destStat.isDirectory()) {
      throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src2}'.`);
    }
  }
  if (srcStat.isDirectory() && isSrcSubdir(src2, dest)) {
    throw new Error(errMsg(src2, dest, funcName));
  }
  return { srcStat, destStat };
}
function checkParentPaths(src2, srcStat, dest, funcName, cb) {
  const srcParent = path$h.resolve(path$h.dirname(src2));
  const destParent = path$h.resolve(path$h.dirname(dest));
  if (destParent === srcParent || destParent === path$h.parse(destParent).root) return cb();
  fs$e.stat(destParent, { bigint: true }, (err, destStat) => {
    if (err) {
      if (err.code === "ENOENT") return cb();
      return cb(err);
    }
    if (areIdentical$2(srcStat, destStat)) {
      return cb(new Error(errMsg(src2, dest, funcName)));
    }
    return checkParentPaths(src2, srcStat, destParent, funcName, cb);
  });
}
function checkParentPathsSync(src2, srcStat, dest, funcName) {
  const srcParent = path$h.resolve(path$h.dirname(src2));
  const destParent = path$h.resolve(path$h.dirname(dest));
  if (destParent === srcParent || destParent === path$h.parse(destParent).root) return;
  let destStat;
  try {
    destStat = fs$e.statSync(destParent, { bigint: true });
  } catch (err) {
    if (err.code === "ENOENT") return;
    throw err;
  }
  if (areIdentical$2(srcStat, destStat)) {
    throw new Error(errMsg(src2, dest, funcName));
  }
  return checkParentPathsSync(src2, srcStat, destParent, funcName);
}
function areIdentical$2(srcStat, destStat) {
  return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
}
function isSrcSubdir(src2, dest) {
  const srcArr = path$h.resolve(src2).split(path$h.sep).filter((i) => i);
  const destArr = path$h.resolve(dest).split(path$h.sep).filter((i) => i);
  return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
}
function errMsg(src2, dest, funcName) {
  return `Cannot ${funcName} '${src2}' to a subdirectory of itself, '${dest}'.`;
}
var stat$4 = {
  checkPaths,
  checkPathsSync,
  checkParentPaths,
  checkParentPathsSync,
  isSrcSubdir,
  areIdentical: areIdentical$2
};
const fs$d = gracefulFs;
const path$g = require$$1$1;
const mkdirs$1 = mkdirs$2.mkdirs;
const pathExists$5 = pathExists_1.pathExists;
const utimesMillis = utimes.utimesMillis;
const stat$3 = stat$4;
function copy$2(src2, dest, opts, cb) {
  if (typeof opts === "function" && !cb) {
    cb = opts;
    opts = {};
  } else if (typeof opts === "function") {
    opts = { filter: opts };
  }
  cb = cb || function() {
  };
  opts = opts || {};
  opts.clobber = "clobber" in opts ? !!opts.clobber : true;
  opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
  if (opts.preserveTimestamps && process.arch === "ia32") {
    process.emitWarning(
      "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
      "Warning",
      "fs-extra-WARN0001"
    );
  }
  stat$3.checkPaths(src2, dest, "copy", opts, (err, stats) => {
    if (err) return cb(err);
    const { srcStat, destStat } = stats;
    stat$3.checkParentPaths(src2, srcStat, dest, "copy", (err2) => {
      if (err2) return cb(err2);
      if (opts.filter) return handleFilter(checkParentDir, destStat, src2, dest, opts, cb);
      return checkParentDir(destStat, src2, dest, opts, cb);
    });
  });
}
function checkParentDir(destStat, src2, dest, opts, cb) {
  const destParent = path$g.dirname(dest);
  pathExists$5(destParent, (err, dirExists) => {
    if (err) return cb(err);
    if (dirExists) return getStats$1(destStat, src2, dest, opts, cb);
    mkdirs$1(destParent, (err2) => {
      if (err2) return cb(err2);
      return getStats$1(destStat, src2, dest, opts, cb);
    });
  });
}
function handleFilter(onInclude, destStat, src2, dest, opts, cb) {
  Promise.resolve(opts.filter(src2, dest)).then((include) => {
    if (include) return onInclude(destStat, src2, dest, opts, cb);
    return cb();
  }, (error2) => cb(error2));
}
function startCopy$1(destStat, src2, dest, opts, cb) {
  if (opts.filter) return handleFilter(getStats$1, destStat, src2, dest, opts, cb);
  return getStats$1(destStat, src2, dest, opts, cb);
}
function getStats$1(destStat, src2, dest, opts, cb) {
  const stat2 = opts.dereference ? fs$d.stat : fs$d.lstat;
  stat2(src2, (err, srcStat) => {
    if (err) return cb(err);
    if (srcStat.isDirectory()) return onDir$1(srcStat, destStat, src2, dest, opts, cb);
    else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile$1(srcStat, destStat, src2, dest, opts, cb);
    else if (srcStat.isSymbolicLink()) return onLink$1(destStat, src2, dest, opts, cb);
    else if (srcStat.isSocket()) return cb(new Error(`Cannot copy a socket file: ${src2}`));
    else if (srcStat.isFIFO()) return cb(new Error(`Cannot copy a FIFO pipe: ${src2}`));
    return cb(new Error(`Unknown file: ${src2}`));
  });
}
function onFile$1(srcStat, destStat, src2, dest, opts, cb) {
  if (!destStat) return copyFile$1(srcStat, src2, dest, opts, cb);
  return mayCopyFile$1(srcStat, src2, dest, opts, cb);
}
function mayCopyFile$1(srcStat, src2, dest, opts, cb) {
  if (opts.overwrite) {
    fs$d.unlink(dest, (err) => {
      if (err) return cb(err);
      return copyFile$1(srcStat, src2, dest, opts, cb);
    });
  } else if (opts.errorOnExist) {
    return cb(new Error(`'${dest}' already exists`));
  } else return cb();
}
function copyFile$1(srcStat, src2, dest, opts, cb) {
  fs$d.copyFile(src2, dest, (err) => {
    if (err) return cb(err);
    if (opts.preserveTimestamps) return handleTimestampsAndMode(srcStat.mode, src2, dest, cb);
    return setDestMode$1(dest, srcStat.mode, cb);
  });
}
function handleTimestampsAndMode(srcMode, src2, dest, cb) {
  if (fileIsNotWritable$1(srcMode)) {
    return makeFileWritable$1(dest, srcMode, (err) => {
      if (err) return cb(err);
      return setDestTimestampsAndMode(srcMode, src2, dest, cb);
    });
  }
  return setDestTimestampsAndMode(srcMode, src2, dest, cb);
}
function fileIsNotWritable$1(srcMode) {
  return (srcMode & 128) === 0;
}
function makeFileWritable$1(dest, srcMode, cb) {
  return setDestMode$1(dest, srcMode | 128, cb);
}
function setDestTimestampsAndMode(srcMode, src2, dest, cb) {
  setDestTimestamps$1(src2, dest, (err) => {
    if (err) return cb(err);
    return setDestMode$1(dest, srcMode, cb);
  });
}
function setDestMode$1(dest, srcMode, cb) {
  return fs$d.chmod(dest, srcMode, cb);
}
function setDestTimestamps$1(src2, dest, cb) {
  fs$d.stat(src2, (err, updatedSrcStat) => {
    if (err) return cb(err);
    return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
  });
}
function onDir$1(srcStat, destStat, src2, dest, opts, cb) {
  if (!destStat) return mkDirAndCopy$1(srcStat.mode, src2, dest, opts, cb);
  return copyDir$1(src2, dest, opts, cb);
}
function mkDirAndCopy$1(srcMode, src2, dest, opts, cb) {
  fs$d.mkdir(dest, (err) => {
    if (err) return cb(err);
    copyDir$1(src2, dest, opts, (err2) => {
      if (err2) return cb(err2);
      return setDestMode$1(dest, srcMode, cb);
    });
  });
}
function copyDir$1(src2, dest, opts, cb) {
  fs$d.readdir(src2, (err, items) => {
    if (err) return cb(err);
    return copyDirItems(items, src2, dest, opts, cb);
  });
}
function copyDirItems(items, src2, dest, opts, cb) {
  const item = items.pop();
  if (!item) return cb();
  return copyDirItem$1(items, item, src2, dest, opts, cb);
}
function copyDirItem$1(items, item, src2, dest, opts, cb) {
  const srcItem = path$g.join(src2, item);
  const destItem = path$g.join(dest, item);
  stat$3.checkPaths(srcItem, destItem, "copy", opts, (err, stats) => {
    if (err) return cb(err);
    const { destStat } = stats;
    startCopy$1(destStat, srcItem, destItem, opts, (err2) => {
      if (err2) return cb(err2);
      return copyDirItems(items, src2, dest, opts, cb);
    });
  });
}
function onLink$1(destStat, src2, dest, opts, cb) {
  fs$d.readlink(src2, (err, resolvedSrc) => {
    if (err) return cb(err);
    if (opts.dereference) {
      resolvedSrc = path$g.resolve(process.cwd(), resolvedSrc);
    }
    if (!destStat) {
      return fs$d.symlink(resolvedSrc, dest, cb);
    } else {
      fs$d.readlink(dest, (err2, resolvedDest) => {
        if (err2) {
          if (err2.code === "EINVAL" || err2.code === "UNKNOWN") return fs$d.symlink(resolvedSrc, dest, cb);
          return cb(err2);
        }
        if (opts.dereference) {
          resolvedDest = path$g.resolve(process.cwd(), resolvedDest);
        }
        if (stat$3.isSrcSubdir(resolvedSrc, resolvedDest)) {
          return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
        }
        if (destStat.isDirectory() && stat$3.isSrcSubdir(resolvedDest, resolvedSrc)) {
          return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
        }
        return copyLink$1(resolvedSrc, dest, cb);
      });
    }
  });
}
function copyLink$1(resolvedSrc, dest, cb) {
  fs$d.unlink(dest, (err) => {
    if (err) return cb(err);
    return fs$d.symlink(resolvedSrc, dest, cb);
  });
}
var copy_1 = copy$2;
const fs$c = gracefulFs;
const path$f = require$$1$1;
const mkdirsSync$1 = mkdirs$2.mkdirsSync;
const utimesMillisSync = utimes.utimesMillisSync;
const stat$2 = stat$4;
function copySync$1(src2, dest, opts) {
  if (typeof opts === "function") {
    opts = { filter: opts };
  }
  opts = opts || {};
  opts.clobber = "clobber" in opts ? !!opts.clobber : true;
  opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
  if (opts.preserveTimestamps && process.arch === "ia32") {
    process.emitWarning(
      "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
      "Warning",
      "fs-extra-WARN0002"
    );
  }
  const { srcStat, destStat } = stat$2.checkPathsSync(src2, dest, "copy", opts);
  stat$2.checkParentPathsSync(src2, srcStat, dest, "copy");
  return handleFilterAndCopy(destStat, src2, dest, opts);
}
function handleFilterAndCopy(destStat, src2, dest, opts) {
  if (opts.filter && !opts.filter(src2, dest)) return;
  const destParent = path$f.dirname(dest);
  if (!fs$c.existsSync(destParent)) mkdirsSync$1(destParent);
  return getStats(destStat, src2, dest, opts);
}
function startCopy(destStat, src2, dest, opts) {
  if (opts.filter && !opts.filter(src2, dest)) return;
  return getStats(destStat, src2, dest, opts);
}
function getStats(destStat, src2, dest, opts) {
  const statSync = opts.dereference ? fs$c.statSync : fs$c.lstatSync;
  const srcStat = statSync(src2);
  if (srcStat.isDirectory()) return onDir(srcStat, destStat, src2, dest, opts);
  else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src2, dest, opts);
  else if (srcStat.isSymbolicLink()) return onLink(destStat, src2, dest, opts);
  else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src2}`);
  else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src2}`);
  throw new Error(`Unknown file: ${src2}`);
}
function onFile(srcStat, destStat, src2, dest, opts) {
  if (!destStat) return copyFile(srcStat, src2, dest, opts);
  return mayCopyFile(srcStat, src2, dest, opts);
}
function mayCopyFile(srcStat, src2, dest, opts) {
  if (opts.overwrite) {
    fs$c.unlinkSync(dest);
    return copyFile(srcStat, src2, dest, opts);
  } else if (opts.errorOnExist) {
    throw new Error(`'${dest}' already exists`);
  }
}
function copyFile(srcStat, src2, dest, opts) {
  fs$c.copyFileSync(src2, dest);
  if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src2, dest);
  return setDestMode(dest, srcStat.mode);
}
function handleTimestamps(srcMode, src2, dest) {
  if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
  return setDestTimestamps(src2, dest);
}
function fileIsNotWritable(srcMode) {
  return (srcMode & 128) === 0;
}
function makeFileWritable(dest, srcMode) {
  return setDestMode(dest, srcMode | 128);
}
function setDestMode(dest, srcMode) {
  return fs$c.chmodSync(dest, srcMode);
}
function setDestTimestamps(src2, dest) {
  const updatedSrcStat = fs$c.statSync(src2);
  return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
}
function onDir(srcStat, destStat, src2, dest, opts) {
  if (!destStat) return mkDirAndCopy(srcStat.mode, src2, dest, opts);
  return copyDir(src2, dest, opts);
}
function mkDirAndCopy(srcMode, src2, dest, opts) {
  fs$c.mkdirSync(dest);
  copyDir(src2, dest, opts);
  return setDestMode(dest, srcMode);
}
function copyDir(src2, dest, opts) {
  fs$c.readdirSync(src2).forEach((item) => copyDirItem(item, src2, dest, opts));
}
function copyDirItem(item, src2, dest, opts) {
  const srcItem = path$f.join(src2, item);
  const destItem = path$f.join(dest, item);
  const { destStat } = stat$2.checkPathsSync(srcItem, destItem, "copy", opts);
  return startCopy(destStat, srcItem, destItem, opts);
}
function onLink(destStat, src2, dest, opts) {
  let resolvedSrc = fs$c.readlinkSync(src2);
  if (opts.dereference) {
    resolvedSrc = path$f.resolve(process.cwd(), resolvedSrc);
  }
  if (!destStat) {
    return fs$c.symlinkSync(resolvedSrc, dest);
  } else {
    let resolvedDest;
    try {
      resolvedDest = fs$c.readlinkSync(dest);
    } catch (err) {
      if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs$c.symlinkSync(resolvedSrc, dest);
      throw err;
    }
    if (opts.dereference) {
      resolvedDest = path$f.resolve(process.cwd(), resolvedDest);
    }
    if (stat$2.isSrcSubdir(resolvedSrc, resolvedDest)) {
      throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
    }
    if (fs$c.statSync(dest).isDirectory() && stat$2.isSrcSubdir(resolvedDest, resolvedSrc)) {
      throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
    }
    return copyLink(resolvedSrc, dest);
  }
}
function copyLink(resolvedSrc, dest) {
  fs$c.unlinkSync(dest);
  return fs$c.symlinkSync(resolvedSrc, dest);
}
var copySync_1 = copySync$1;
const u$8 = universalify$1.fromCallback;
var copy$1 = {
  copy: u$8(copy_1),
  copySync: copySync_1
};
const fs$b = gracefulFs;
const path$e = require$$1$1;
const assert = require$$4$2;
const isWindows = process.platform === "win32";
function defaults(options) {
  const methods = [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ];
  methods.forEach((m) => {
    options[m] = options[m] || fs$b[m];
    m = m + "Sync";
    options[m] = options[m] || fs$b[m];
  });
  options.maxBusyTries = options.maxBusyTries || 3;
}
function rimraf$1(p, options, cb) {
  let busyTries = 0;
  if (typeof options === "function") {
    cb = options;
    options = {};
  }
  assert(p, "rimraf: missing path");
  assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
  assert.strictEqual(typeof cb, "function", "rimraf: callback function required");
  assert(options, "rimraf: invalid options argument provided");
  assert.strictEqual(typeof options, "object", "rimraf: options should be object");
  defaults(options);
  rimraf_(p, options, function CB(er) {
    if (er) {
      if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
        busyTries++;
        const time = busyTries * 100;
        return setTimeout(() => rimraf_(p, options, CB), time);
      }
      if (er.code === "ENOENT") er = null;
    }
    cb(er);
  });
}
function rimraf_(p, options, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.lstat(p, (er, st) => {
    if (er && er.code === "ENOENT") {
      return cb(null);
    }
    if (er && er.code === "EPERM" && isWindows) {
      return fixWinEPERM(p, options, er, cb);
    }
    if (st && st.isDirectory()) {
      return rmdir(p, options, er, cb);
    }
    options.unlink(p, (er2) => {
      if (er2) {
        if (er2.code === "ENOENT") {
          return cb(null);
        }
        if (er2.code === "EPERM") {
          return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
        }
        if (er2.code === "EISDIR") {
          return rmdir(p, options, er2, cb);
        }
      }
      return cb(er2);
    });
  });
}
function fixWinEPERM(p, options, er, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.chmod(p, 438, (er2) => {
    if (er2) {
      cb(er2.code === "ENOENT" ? null : er);
    } else {
      options.stat(p, (er3, stats) => {
        if (er3) {
          cb(er3.code === "ENOENT" ? null : er);
        } else if (stats.isDirectory()) {
          rmdir(p, options, er, cb);
        } else {
          options.unlink(p, cb);
        }
      });
    }
  });
}
function fixWinEPERMSync(p, options, er) {
  let stats;
  assert(p);
  assert(options);
  try {
    options.chmodSync(p, 438);
  } catch (er2) {
    if (er2.code === "ENOENT") {
      return;
    } else {
      throw er;
    }
  }
  try {
    stats = options.statSync(p);
  } catch (er3) {
    if (er3.code === "ENOENT") {
      return;
    } else {
      throw er;
    }
  }
  if (stats.isDirectory()) {
    rmdirSync(p, options, er);
  } else {
    options.unlinkSync(p);
  }
}
function rmdir(p, options, originalEr, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.rmdir(p, (er) => {
    if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")) {
      rmkids(p, options, cb);
    } else if (er && er.code === "ENOTDIR") {
      cb(originalEr);
    } else {
      cb(er);
    }
  });
}
function rmkids(p, options, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.readdir(p, (er, files) => {
    if (er) return cb(er);
    let n = files.length;
    let errState;
    if (n === 0) return options.rmdir(p, cb);
    files.forEach((f) => {
      rimraf$1(path$e.join(p, f), options, (er2) => {
        if (errState) {
          return;
        }
        if (er2) return cb(errState = er2);
        if (--n === 0) {
          options.rmdir(p, cb);
        }
      });
    });
  });
}
function rimrafSync(p, options) {
  let st;
  options = options || {};
  defaults(options);
  assert(p, "rimraf: missing path");
  assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
  assert(options, "rimraf: missing options");
  assert.strictEqual(typeof options, "object", "rimraf: options should be object");
  try {
    st = options.lstatSync(p);
  } catch (er) {
    if (er.code === "ENOENT") {
      return;
    }
    if (er.code === "EPERM" && isWindows) {
      fixWinEPERMSync(p, options, er);
    }
  }
  try {
    if (st && st.isDirectory()) {
      rmdirSync(p, options, null);
    } else {
      options.unlinkSync(p);
    }
  } catch (er) {
    if (er.code === "ENOENT") {
      return;
    } else if (er.code === "EPERM") {
      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
    } else if (er.code !== "EISDIR") {
      throw er;
    }
    rmdirSync(p, options, er);
  }
}
function rmdirSync(p, options, originalEr) {
  assert(p);
  assert(options);
  try {
    options.rmdirSync(p);
  } catch (er) {
    if (er.code === "ENOTDIR") {
      throw originalEr;
    } else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM") {
      rmkidsSync(p, options);
    } else if (er.code !== "ENOENT") {
      throw er;
    }
  }
}
function rmkidsSync(p, options) {
  assert(p);
  assert(options);
  options.readdirSync(p).forEach((f) => rimrafSync(path$e.join(p, f), options));
  if (isWindows) {
    const startTime = Date.now();
    do {
      try {
        const ret = options.rmdirSync(p, options);
        return ret;
      } catch {
      }
    } while (Date.now() - startTime < 500);
  } else {
    const ret = options.rmdirSync(p, options);
    return ret;
  }
}
var rimraf_1 = rimraf$1;
rimraf$1.sync = rimrafSync;
const fs$a = gracefulFs;
const u$7 = universalify$1.fromCallback;
const rimraf = rimraf_1;
function remove$2(path2, callback) {
  if (fs$a.rm) return fs$a.rm(path2, { recursive: true, force: true }, callback);
  rimraf(path2, callback);
}
function removeSync$1(path2) {
  if (fs$a.rmSync) return fs$a.rmSync(path2, { recursive: true, force: true });
  rimraf.sync(path2);
}
var remove_1 = {
  remove: u$7(remove$2),
  removeSync: removeSync$1
};
const u$6 = universalify$1.fromPromise;
const fs$9 = fs$j;
const path$d = require$$1$1;
const mkdir$3 = mkdirs$2;
const remove$1 = remove_1;
const emptyDir = u$6(async function emptyDir2(dir) {
  let items;
  try {
    items = await fs$9.readdir(dir);
  } catch {
    return mkdir$3.mkdirs(dir);
  }
  return Promise.all(items.map((item) => remove$1.remove(path$d.join(dir, item))));
});
function emptyDirSync(dir) {
  let items;
  try {
    items = fs$9.readdirSync(dir);
  } catch {
    return mkdir$3.mkdirsSync(dir);
  }
  items.forEach((item) => {
    item = path$d.join(dir, item);
    remove$1.removeSync(item);
  });
}
var empty = {
  emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir,
  emptydir: emptyDir
};
const u$5 = universalify$1.fromCallback;
const path$c = require$$1$1;
const fs$8 = gracefulFs;
const mkdir$2 = mkdirs$2;
function createFile$1(file2, callback) {
  function makeFile() {
    fs$8.writeFile(file2, "", (err) => {
      if (err) return callback(err);
      callback();
    });
  }
  fs$8.stat(file2, (err, stats) => {
    if (!err && stats.isFile()) return callback();
    const dir = path$c.dirname(file2);
    fs$8.stat(dir, (err2, stats2) => {
      if (err2) {
        if (err2.code === "ENOENT") {
          return mkdir$2.mkdirs(dir, (err3) => {
            if (err3) return callback(err3);
            makeFile();
          });
        }
        return callback(err2);
      }
      if (stats2.isDirectory()) makeFile();
      else {
        fs$8.readdir(dir, (err3) => {
          if (err3) return callback(err3);
        });
      }
    });
  });
}
function createFileSync$1(file2) {
  let stats;
  try {
    stats = fs$8.statSync(file2);
  } catch {
  }
  if (stats && stats.isFile()) return;
  const dir = path$c.dirname(file2);
  try {
    if (!fs$8.statSync(dir).isDirectory()) {
      fs$8.readdirSync(dir);
    }
  } catch (err) {
    if (err && err.code === "ENOENT") mkdir$2.mkdirsSync(dir);
    else throw err;
  }
  fs$8.writeFileSync(file2, "");
}
var file$1 = {
  createFile: u$5(createFile$1),
  createFileSync: createFileSync$1
};
const u$4 = universalify$1.fromCallback;
const path$b = require$$1$1;
const fs$7 = gracefulFs;
const mkdir$1 = mkdirs$2;
const pathExists$4 = pathExists_1.pathExists;
const { areIdentical: areIdentical$1 } = stat$4;
function createLink$1(srcpath, dstpath, callback) {
  function makeLink(srcpath2, dstpath2) {
    fs$7.link(srcpath2, dstpath2, (err) => {
      if (err) return callback(err);
      callback(null);
    });
  }
  fs$7.lstat(dstpath, (_, dstStat) => {
    fs$7.lstat(srcpath, (err, srcStat) => {
      if (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        return callback(err);
      }
      if (dstStat && areIdentical$1(srcStat, dstStat)) return callback(null);
      const dir = path$b.dirname(dstpath);
      pathExists$4(dir, (err2, dirExists) => {
        if (err2) return callback(err2);
        if (dirExists) return makeLink(srcpath, dstpath);
        mkdir$1.mkdirs(dir, (err3) => {
          if (err3) return callback(err3);
          makeLink(srcpath, dstpath);
        });
      });
    });
  });
}
function createLinkSync$1(srcpath, dstpath) {
  let dstStat;
  try {
    dstStat = fs$7.lstatSync(dstpath);
  } catch {
  }
  try {
    const srcStat = fs$7.lstatSync(srcpath);
    if (dstStat && areIdentical$1(srcStat, dstStat)) return;
  } catch (err) {
    err.message = err.message.replace("lstat", "ensureLink");
    throw err;
  }
  const dir = path$b.dirname(dstpath);
  const dirExists = fs$7.existsSync(dir);
  if (dirExists) return fs$7.linkSync(srcpath, dstpath);
  mkdir$1.mkdirsSync(dir);
  return fs$7.linkSync(srcpath, dstpath);
}
var link = {
  createLink: u$4(createLink$1),
  createLinkSync: createLinkSync$1
};
const path$a = require$$1$1;
const fs$6 = gracefulFs;
const pathExists$3 = pathExists_1.pathExists;
function symlinkPaths$1(srcpath, dstpath, callback) {
  if (path$a.isAbsolute(srcpath)) {
    return fs$6.lstat(srcpath, (err) => {
      if (err) {
        err.message = err.message.replace("lstat", "ensureSymlink");
        return callback(err);
      }
      return callback(null, {
        toCwd: srcpath,
        toDst: srcpath
      });
    });
  } else {
    const dstdir = path$a.dirname(dstpath);
    const relativeToDst = path$a.join(dstdir, srcpath);
    return pathExists$3(relativeToDst, (err, exists) => {
      if (err) return callback(err);
      if (exists) {
        return callback(null, {
          toCwd: relativeToDst,
          toDst: srcpath
        });
      } else {
        return fs$6.lstat(srcpath, (err2) => {
          if (err2) {
            err2.message = err2.message.replace("lstat", "ensureSymlink");
            return callback(err2);
          }
          return callback(null, {
            toCwd: srcpath,
            toDst: path$a.relative(dstdir, srcpath)
          });
        });
      }
    });
  }
}
function symlinkPathsSync$1(srcpath, dstpath) {
  let exists;
  if (path$a.isAbsolute(srcpath)) {
    exists = fs$6.existsSync(srcpath);
    if (!exists) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: srcpath,
      toDst: srcpath
    };
  } else {
    const dstdir = path$a.dirname(dstpath);
    const relativeToDst = path$a.join(dstdir, srcpath);
    exists = fs$6.existsSync(relativeToDst);
    if (exists) {
      return {
        toCwd: relativeToDst,
        toDst: srcpath
      };
    } else {
      exists = fs$6.existsSync(srcpath);
      if (!exists) throw new Error("relative srcpath does not exist");
      return {
        toCwd: srcpath,
        toDst: path$a.relative(dstdir, srcpath)
      };
    }
  }
}
var symlinkPaths_1 = {
  symlinkPaths: symlinkPaths$1,
  symlinkPathsSync: symlinkPathsSync$1
};
const fs$5 = gracefulFs;
function symlinkType$1(srcpath, type2, callback) {
  callback = typeof type2 === "function" ? type2 : callback;
  type2 = typeof type2 === "function" ? false : type2;
  if (type2) return callback(null, type2);
  fs$5.lstat(srcpath, (err, stats) => {
    if (err) return callback(null, "file");
    type2 = stats && stats.isDirectory() ? "dir" : "file";
    callback(null, type2);
  });
}
function symlinkTypeSync$1(srcpath, type2) {
  let stats;
  if (type2) return type2;
  try {
    stats = fs$5.lstatSync(srcpath);
  } catch {
    return "file";
  }
  return stats && stats.isDirectory() ? "dir" : "file";
}
var symlinkType_1 = {
  symlinkType: symlinkType$1,
  symlinkTypeSync: symlinkTypeSync$1
};
const u$3 = universalify$1.fromCallback;
const path$9 = require$$1$1;
const fs$4 = fs$j;
const _mkdirs = mkdirs$2;
const mkdirs = _mkdirs.mkdirs;
const mkdirsSync = _mkdirs.mkdirsSync;
const _symlinkPaths = symlinkPaths_1;
const symlinkPaths = _symlinkPaths.symlinkPaths;
const symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
const _symlinkType = symlinkType_1;
const symlinkType = _symlinkType.symlinkType;
const symlinkTypeSync = _symlinkType.symlinkTypeSync;
const pathExists$2 = pathExists_1.pathExists;
const { areIdentical } = stat$4;
function createSymlink$1(srcpath, dstpath, type2, callback) {
  callback = typeof type2 === "function" ? type2 : callback;
  type2 = typeof type2 === "function" ? false : type2;
  fs$4.lstat(dstpath, (err, stats) => {
    if (!err && stats.isSymbolicLink()) {
      Promise.all([
        fs$4.stat(srcpath),
        fs$4.stat(dstpath)
      ]).then(([srcStat, dstStat]) => {
        if (areIdentical(srcStat, dstStat)) return callback(null);
        _createSymlink(srcpath, dstpath, type2, callback);
      });
    } else _createSymlink(srcpath, dstpath, type2, callback);
  });
}
function _createSymlink(srcpath, dstpath, type2, callback) {
  symlinkPaths(srcpath, dstpath, (err, relative) => {
    if (err) return callback(err);
    srcpath = relative.toDst;
    symlinkType(relative.toCwd, type2, (err2, type3) => {
      if (err2) return callback(err2);
      const dir = path$9.dirname(dstpath);
      pathExists$2(dir, (err3, dirExists) => {
        if (err3) return callback(err3);
        if (dirExists) return fs$4.symlink(srcpath, dstpath, type3, callback);
        mkdirs(dir, (err4) => {
          if (err4) return callback(err4);
          fs$4.symlink(srcpath, dstpath, type3, callback);
        });
      });
    });
  });
}
function createSymlinkSync$1(srcpath, dstpath, type2) {
  let stats;
  try {
    stats = fs$4.lstatSync(dstpath);
  } catch {
  }
  if (stats && stats.isSymbolicLink()) {
    const srcStat = fs$4.statSync(srcpath);
    const dstStat = fs$4.statSync(dstpath);
    if (areIdentical(srcStat, dstStat)) return;
  }
  const relative = symlinkPathsSync(srcpath, dstpath);
  srcpath = relative.toDst;
  type2 = symlinkTypeSync(relative.toCwd, type2);
  const dir = path$9.dirname(dstpath);
  const exists = fs$4.existsSync(dir);
  if (exists) return fs$4.symlinkSync(srcpath, dstpath, type2);
  mkdirsSync(dir);
  return fs$4.symlinkSync(srcpath, dstpath, type2);
}
var symlink = {
  createSymlink: u$3(createSymlink$1),
  createSymlinkSync: createSymlinkSync$1
};
const { createFile, createFileSync } = file$1;
const { createLink, createLinkSync } = link;
const { createSymlink, createSymlinkSync } = symlink;
var ensure = {
  // file
  createFile,
  createFileSync,
  ensureFile: createFile,
  ensureFileSync: createFileSync,
  // link
  createLink,
  createLinkSync,
  ensureLink: createLink,
  ensureLinkSync: createLinkSync,
  // symlink
  createSymlink,
  createSymlinkSync,
  ensureSymlink: createSymlink,
  ensureSymlinkSync: createSymlinkSync
};
function stringify$3(obj, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
  const EOF = finalEOL ? EOL : "";
  const str2 = JSON.stringify(obj, replacer, spaces);
  return str2.replace(/\n/g, EOL) + EOF;
}
function stripBom$1(content) {
  if (Buffer.isBuffer(content)) content = content.toString("utf8");
  return content.replace(/^\uFEFF/, "");
}
var utils = { stringify: stringify$3, stripBom: stripBom$1 };
let _fs;
try {
  _fs = gracefulFs;
} catch (_) {
  _fs = require$$1$2;
}
const universalify = universalify$1;
const { stringify: stringify$2, stripBom } = utils;
async function _readFile(file2, options = {}) {
  if (typeof options === "string") {
    options = { encoding: options };
  }
  const fs2 = options.fs || _fs;
  const shouldThrow = "throws" in options ? options.throws : true;
  let data = await universalify.fromCallback(fs2.readFile)(file2, options);
  data = stripBom(data);
  let obj;
  try {
    obj = JSON.parse(data, options ? options.reviver : null);
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file2}: ${err.message}`;
      throw err;
    } else {
      return null;
    }
  }
  return obj;
}
const readFile = universalify.fromPromise(_readFile);
function readFileSync(file2, options = {}) {
  if (typeof options === "string") {
    options = { encoding: options };
  }
  const fs2 = options.fs || _fs;
  const shouldThrow = "throws" in options ? options.throws : true;
  try {
    let content = fs2.readFileSync(file2, options);
    content = stripBom(content);
    return JSON.parse(content, options.reviver);
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file2}: ${err.message}`;
      throw err;
    } else {
      return null;
    }
  }
}
async function _writeFile(file2, obj, options = {}) {
  const fs2 = options.fs || _fs;
  const str2 = stringify$2(obj, options);
  await universalify.fromCallback(fs2.writeFile)(file2, str2, options);
}
const writeFile = universalify.fromPromise(_writeFile);
function writeFileSync(file2, obj, options = {}) {
  const fs2 = options.fs || _fs;
  const str2 = stringify$2(obj, options);
  return fs2.writeFileSync(file2, str2, options);
}
const jsonfile$1 = {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync
};
var jsonfile_1 = jsonfile$1;
const jsonFile$1 = jsonfile_1;
var jsonfile = {
  // jsonfile exports
  readJson: jsonFile$1.readFile,
  readJsonSync: jsonFile$1.readFileSync,
  writeJson: jsonFile$1.writeFile,
  writeJsonSync: jsonFile$1.writeFileSync
};
const u$2 = universalify$1.fromCallback;
const fs$3 = gracefulFs;
const path$8 = require$$1$1;
const mkdir = mkdirs$2;
const pathExists$1 = pathExists_1.pathExists;
function outputFile$1(file2, data, encoding, callback) {
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = "utf8";
  }
  const dir = path$8.dirname(file2);
  pathExists$1(dir, (err, itDoes) => {
    if (err) return callback(err);
    if (itDoes) return fs$3.writeFile(file2, data, encoding, callback);
    mkdir.mkdirs(dir, (err2) => {
      if (err2) return callback(err2);
      fs$3.writeFile(file2, data, encoding, callback);
    });
  });
}
function outputFileSync$1(file2, ...args) {
  const dir = path$8.dirname(file2);
  if (fs$3.existsSync(dir)) {
    return fs$3.writeFileSync(file2, ...args);
  }
  mkdir.mkdirsSync(dir);
  fs$3.writeFileSync(file2, ...args);
}
var outputFile_1 = {
  outputFile: u$2(outputFile$1),
  outputFileSync: outputFileSync$1
};
const { stringify: stringify$1 } = utils;
const { outputFile } = outputFile_1;
async function outputJson(file2, data, options = {}) {
  const str2 = stringify$1(data, options);
  await outputFile(file2, str2, options);
}
var outputJson_1 = outputJson;
const { stringify } = utils;
const { outputFileSync } = outputFile_1;
function outputJsonSync(file2, data, options) {
  const str2 = stringify(data, options);
  outputFileSync(file2, str2, options);
}
var outputJsonSync_1 = outputJsonSync;
const u$1 = universalify$1.fromPromise;
const jsonFile = jsonfile;
jsonFile.outputJson = u$1(outputJson_1);
jsonFile.outputJsonSync = outputJsonSync_1;
jsonFile.outputJSON = jsonFile.outputJson;
jsonFile.outputJSONSync = jsonFile.outputJsonSync;
jsonFile.writeJSON = jsonFile.writeJson;
jsonFile.writeJSONSync = jsonFile.writeJsonSync;
jsonFile.readJSON = jsonFile.readJson;
jsonFile.readJSONSync = jsonFile.readJsonSync;
var json$1 = jsonFile;
const fs$2 = gracefulFs;
const path$7 = require$$1$1;
const copy = copy$1.copy;
const remove = remove_1.remove;
const mkdirp = mkdirs$2.mkdirp;
const pathExists = pathExists_1.pathExists;
const stat$1 = stat$4;
function move$1(src2, dest, opts, cb) {
  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }
  opts = opts || {};
  const overwrite = opts.overwrite || opts.clobber || false;
  stat$1.checkPaths(src2, dest, "move", opts, (err, stats) => {
    if (err) return cb(err);
    const { srcStat, isChangingCase = false } = stats;
    stat$1.checkParentPaths(src2, srcStat, dest, "move", (err2) => {
      if (err2) return cb(err2);
      if (isParentRoot$1(dest)) return doRename$1(src2, dest, overwrite, isChangingCase, cb);
      mkdirp(path$7.dirname(dest), (err3) => {
        if (err3) return cb(err3);
        return doRename$1(src2, dest, overwrite, isChangingCase, cb);
      });
    });
  });
}
function isParentRoot$1(dest) {
  const parent = path$7.dirname(dest);
  const parsedPath = path$7.parse(parent);
  return parsedPath.root === parent;
}
function doRename$1(src2, dest, overwrite, isChangingCase, cb) {
  if (isChangingCase) return rename$1(src2, dest, overwrite, cb);
  if (overwrite) {
    return remove(dest, (err) => {
      if (err) return cb(err);
      return rename$1(src2, dest, overwrite, cb);
    });
  }
  pathExists(dest, (err, destExists) => {
    if (err) return cb(err);
    if (destExists) return cb(new Error("dest already exists."));
    return rename$1(src2, dest, overwrite, cb);
  });
}
function rename$1(src2, dest, overwrite, cb) {
  fs$2.rename(src2, dest, (err) => {
    if (!err) return cb();
    if (err.code !== "EXDEV") return cb(err);
    return moveAcrossDevice$1(src2, dest, overwrite, cb);
  });
}
function moveAcrossDevice$1(src2, dest, overwrite, cb) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copy(src2, dest, opts, (err) => {
    if (err) return cb(err);
    return remove(src2, cb);
  });
}
var move_1 = move$1;
const fs$1 = gracefulFs;
const path$6 = require$$1$1;
const copySync = copy$1.copySync;
const removeSync = remove_1.removeSync;
const mkdirpSync = mkdirs$2.mkdirpSync;
const stat = stat$4;
function moveSync(src2, dest, opts) {
  opts = opts || {};
  const overwrite = opts.overwrite || opts.clobber || false;
  const { srcStat, isChangingCase = false } = stat.checkPathsSync(src2, dest, "move", opts);
  stat.checkParentPathsSync(src2, srcStat, dest, "move");
  if (!isParentRoot(dest)) mkdirpSync(path$6.dirname(dest));
  return doRename(src2, dest, overwrite, isChangingCase);
}
function isParentRoot(dest) {
  const parent = path$6.dirname(dest);
  const parsedPath = path$6.parse(parent);
  return parsedPath.root === parent;
}
function doRename(src2, dest, overwrite, isChangingCase) {
  if (isChangingCase) return rename(src2, dest, overwrite);
  if (overwrite) {
    removeSync(dest);
    return rename(src2, dest, overwrite);
  }
  if (fs$1.existsSync(dest)) throw new Error("dest already exists.");
  return rename(src2, dest, overwrite);
}
function rename(src2, dest, overwrite) {
  try {
    fs$1.renameSync(src2, dest);
  } catch (err) {
    if (err.code !== "EXDEV") throw err;
    return moveAcrossDevice(src2, dest, overwrite);
  }
}
function moveAcrossDevice(src2, dest, overwrite) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copySync(src2, dest, opts);
  return removeSync(src2);
}
var moveSync_1 = moveSync;
const u = universalify$1.fromCallback;
var move = {
  move: u(move_1),
  moveSync: moveSync_1
};
var lib = {
  // Export promiseified graceful-fs:
  ...fs$j,
  // Export extra methods:
  ...copy$1,
  ...empty,
  ...ensure,
  ...json$1,
  ...mkdirs$2,
  ...move,
  ...outputFile_1,
  ...pathExists_1,
  ...remove_1
};
var BaseUpdater = {};
var AppUpdater = {};
var jsYaml = {};
var loader$1 = {};
var common$5 = {};
function isNothing(subject) {
  return typeof subject === "undefined" || subject === null;
}
function isObject(subject) {
  return typeof subject === "object" && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = "", cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
common$5.isNothing = isNothing;
common$5.isObject = isObject;
common$5.toArray = toArray;
common$5.repeat = repeat;
common$5.isNegativeZero = isNegativeZero;
common$5.extend = extend;
function formatError(exception2, compact) {
  var where = "", message = exception2.reason || "(unknown reason)";
  if (!exception2.mark) return message;
  if (exception2.mark.name) {
    where += 'in "' + exception2.mark.name + '" ';
  }
  where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
  if (!compact && exception2.mark.snippet) {
    where += "\n\n" + exception2.mark.snippet;
  }
  return message + " " + where;
}
function YAMLException$4(reason, mark) {
  Error.call(this);
  this.name = "YAMLException";
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack || "";
  }
}
YAMLException$4.prototype = Object.create(Error.prototype);
YAMLException$4.prototype.constructor = YAMLException$4;
YAMLException$4.prototype.toString = function toString2(compact) {
  return this.name + ": " + formatError(this, compact);
};
var exception = YAMLException$4;
var common$4 = common$5;
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = "";
  var tail = "";
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = " ...";
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "→") + tail,
    pos: position - lineStart + head.length
    // relative position
  };
}
function padStart(string, max2) {
  return common$4.repeat(" ", max2 - string.length) + string;
}
function makeSnippet$1(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer) return null;
  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent !== "number") options.indent = 1;
  if (typeof options.linesBefore !== "number") options.linesBefore = 3;
  if (typeof options.linesAfter !== "number") options.linesAfter = 2;
  var re2 = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re2.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  var result = "", i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common$4.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common$4.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  result += common$4.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common$4.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  }
  return result.replace(/\n$/, "");
}
var snippet = makeSnippet$1;
var YAMLException$3 = exception;
var TYPE_CONSTRUCTOR_OPTIONS = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
];
var YAML_NODE_KINDS = [
  "scalar",
  "sequence",
  "mapping"
];
function compileStyleAliases(map2) {
  var result = {};
  if (map2 !== null) {
    Object.keys(map2).forEach(function(style2) {
      map2[style2].forEach(function(alias) {
        result[String(alias)] = style2;
      });
    });
  }
  return result;
}
function Type$e(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function(name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new YAMLException$3('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });
  this.options = options;
  this.tag = tag;
  this.kind = options["kind"] || null;
  this.resolve = options["resolve"] || function() {
    return true;
  };
  this.construct = options["construct"] || function(data) {
    return data;
  };
  this.instanceOf = options["instanceOf"] || null;
  this.predicate = options["predicate"] || null;
  this.represent = options["represent"] || null;
  this.representName = options["representName"] || null;
  this.defaultStyle = options["defaultStyle"] || null;
  this.multi = options["multi"] || false;
  this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new YAMLException$3('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$e;
var YAMLException$2 = exception;
var Type$d = type;
function compileList(schema2, name) {
  var result = [];
  schema2[name].forEach(function(currentType) {
    var newIndex = result.length;
    result.forEach(function(previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap() {
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, index, length;
  function collectType(type2) {
    if (type2.multi) {
      result.multi[type2.kind].push(type2);
      result.multi["fallback"].push(type2);
    } else {
      result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend2(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof Type$d) {
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);
  } else {
    throw new YAMLException$2("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  }
  implicit.forEach(function(type2) {
    if (!(type2 instanceof Type$d)) {
      throw new YAMLException$2("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
    if (type2.loadKind && type2.loadKind !== "scalar") {
      throw new YAMLException$2("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    }
    if (type2.multi) {
      throw new YAMLException$2("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }
  });
  explicit.forEach(function(type2) {
    if (!(type2 instanceof Type$d)) {
      throw new YAMLException$2("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, "implicit");
  result.compiledExplicit = compileList(result, "explicit");
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;
var Type$c = type;
var str = new Type$c("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(data) {
    return data !== null ? data : "";
  }
});
var Type$b = type;
var seq = new Type$b("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(data) {
    return data !== null ? data : [];
  }
});
var Type$a = type;
var map = new Type$a("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(data) {
    return data !== null ? data : {};
  }
});
var Schema = schema;
var failsafe = new Schema({
  explicit: [
    str,
    seq,
    map
  ]
});
var Type$9 = type;
function resolveYamlNull(data) {
  if (data === null) return true;
  var max2 = data.length;
  return max2 === 1 && data === "~" || max2 === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object2) {
  return object2 === null;
}
var _null = new Type$9("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
var Type$8 = type;
function resolveYamlBoolean(data) {
  if (data === null) return false;
  var max2 = data.length;
  return max2 === 4 && (data === "true" || data === "True" || data === "TRUE") || max2 === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
function isBoolean(object2) {
  return Object.prototype.toString.call(object2) === "[object Boolean]";
}
var bool = new Type$8("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function(object2) {
      return object2 ? "true" : "false";
    },
    uppercase: function(object2) {
      return object2 ? "TRUE" : "FALSE";
    },
    camelcase: function(object2) {
      return object2 ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
var common$3 = common$5;
var Type$7 = type;
function isHexCode(c) {
  return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
  return 48 <= c && c <= 55;
}
function isDecCode(c) {
  return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
  if (data === null) return false;
  var max2 = data.length, index = 0, hasDigits = false, ch;
  if (!max2) return false;
  ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max2) return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (; index < max2; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch !== "0" && ch !== "1") return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (; index < max2; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "o") {
      index++;
      for (; index < max2; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
  }
  if (ch === "_") return false;
  for (; index < max2; index++) {
    ch = data[index];
    if (ch === "_") continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_") return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data, sign3 = 1, ch;
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-") sign3 = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0") return 0;
  if (ch === "0") {
    if (value[1] === "b") return sign3 * parseInt(value.slice(2), 2);
    if (value[1] === "x") return sign3 * parseInt(value.slice(2), 16);
    if (value[1] === "o") return sign3 * parseInt(value.slice(2), 8);
  }
  return sign3 * parseInt(value, 10);
}
function isInteger(object2) {
  return Object.prototype.toString.call(object2) === "[object Number]" && (object2 % 1 === 0 && !common$3.isNegativeZero(object2));
}
var int = new Type$7("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function(obj) {
      return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
    },
    octal: function(obj) {
      return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
    },
    decimal: function(obj) {
      return obj.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(obj) {
      return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
var common$2 = common$5;
var Type$6 = type;
var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function resolveYamlFloat(data) {
  if (data === null) return false;
  if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign3;
  value = data.replace(/_/g, "").toLowerCase();
  sign3 = value[0] === "-" ? -1 : 1;
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign3 === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === ".nan") {
    return NaN;
  }
  return sign3 * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object2, style2) {
  var res;
  if (isNaN(object2)) {
    switch (style2) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object2) {
    switch (style2) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object2) {
    switch (style2) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (common$2.isNegativeZero(object2)) {
    return "-0.0";
  }
  res = object2.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object2) {
  return Object.prototype.toString.call(object2) === "[object Number]" && (object2 % 1 !== 0 || common$2.isNegativeZero(object2));
}
var float = new Type$6("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: "lowercase"
});
var json = failsafe.extend({
  implicit: [
    _null,
    bool,
    int,
    float
  ]
});
var core = json;
var Type$5 = type;
var YAML_DATE_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
);
var YAML_TIMESTAMP_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null) throw new Error("Date resolve error");
  year = +match[1];
  month = +match[2] - 1;
  day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      fraction += "0";
    }
    fraction = +fraction;
  }
  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 6e4;
    if (match[9] === "-") delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object2) {
  return object2.toISOString();
}
var timestamp = new Type$5("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
var Type$4 = type;
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
var merge = new Type$4("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: resolveYamlMerge
});
var Type$3 = type;
var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
  if (data === null) return false;
  var code, idx, bitlen = 0, max2 = data.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max2; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64) continue;
    if (code < 0) return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max2 = input.length, map2 = BASE64_MAP, bits = 0, result = [];
  for (idx = 0; idx < max2; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  tailbits = max2 % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object2) {
  var result = "", bits = 0, idx, tail, max2 = object2.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max2; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object2[idx];
  }
  tail = max2 % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === "[object Uint8Array]";
}
var binary = new Type$3("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});
var Type$2 = type;
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null) return true;
  var objectKeys = [], index, length, pair, pairKey, pairHasKey, object2 = data;
  for (index = 0, length = object2.length; index < length; index += 1) {
    pair = object2[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== "[object Object]") return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }
    if (!pairHasKey) return false;
    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new Type$2("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
var Type$1 = type;
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null) return true;
  var index, length, pair, keys, result, object2 = data;
  result = new Array(object2.length);
  for (index = 0, length = object2.length; index < length; index += 1) {
    pair = object2[index];
    if (_toString$1.call(pair) !== "[object Object]") return false;
    keys = Object.keys(pair);
    if (keys.length !== 1) return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null) return [];
  var index, length, pair, keys, result, object2 = data;
  result = new Array(object2.length);
  for (index = 0, length = object2.length; index < length; index += 1) {
    pair = object2[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new Type$1("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
var Type = type;
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null) return true;
  var key, object2 = data;
  for (key in object2) {
    if (_hasOwnProperty$2.call(object2, key)) {
      if (object2[key] !== null) return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new Type("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
var _default = core.extend({
  implicit: [
    timestamp,
    merge
  ],
  explicit: [
    binary,
    omap,
    pairs,
    set
  ]
});
var common$1 = common$5;
var YAMLException$1 = exception;
var makeSnippet = snippet;
var DEFAULT_SCHEMA$1 = _default;
var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 10 || c === 13;
}
function is_WHITE_SPACE(c) {
  return c === 9 || c === 32;
}
function is_WS_OR_EOL(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function is_FLOW_INDICATOR(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  var lc;
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  lc = c | 32;
  if (97 <= lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "" : c === 95 ? " " : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode(
    (c - 65536 >> 10) + 55296,
    (c - 65536 & 1023) + 56320
  );
}
var simpleEscapeCheck = new Array(256);
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
function State$1(input, options) {
  this.input = input;
  this.filename = options["filename"] || null;
  this.schema = options["schema"] || DEFAULT_SCHEMA$1;
  this.onWarning = options["onWarning"] || null;
  this.legacy = options["legacy"] || false;
  this.json = options["json"] || false;
  this.listener = options["listener"] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;
  this.firstTabInLine = -1;
  this.documents = [];
}
function generateError(state2, message) {
  var mark = {
    name: state2.filename,
    buffer: state2.input.slice(0, -1),
    // omit trailing \0
    position: state2.position,
    line: state2.line,
    column: state2.position - state2.lineStart
  };
  mark.snippet = makeSnippet(mark);
  return new YAMLException$1(message, mark);
}
function throwError(state2, message) {
  throw generateError(state2, message);
}
function throwWarning(state2, message) {
  if (state2.onWarning) {
    state2.onWarning.call(null, generateError(state2, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state2, name, args) {
    var match, major2, minor2;
    if (state2.version !== null) {
      throwError(state2, "duplication of %YAML directive");
    }
    if (args.length !== 1) {
      throwError(state2, "YAML directive accepts exactly one argument");
    }
    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throwError(state2, "ill-formed argument of the YAML directive");
    }
    major2 = parseInt(match[1], 10);
    minor2 = parseInt(match[2], 10);
    if (major2 !== 1) {
      throwError(state2, "unacceptable YAML version of the document");
    }
    state2.version = args[0];
    state2.checkLineBreaks = minor2 < 2;
    if (minor2 !== 1 && minor2 !== 2) {
      throwWarning(state2, "unsupported YAML version of the document");
    }
  },
  TAG: function handleTagDirective(state2, name, args) {
    var handle, prefix;
    if (args.length !== 2) {
      throwError(state2, "TAG directive accepts exactly two arguments");
    }
    handle = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state2, "ill-formed tag handle (first argument) of the TAG directive");
    }
    if (_hasOwnProperty$1.call(state2.tagMap, handle)) {
      throwError(state2, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state2, "ill-formed tag prefix (second argument) of the TAG directive");
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state2, "tag prefix is malformed: " + prefix);
    }
    state2.tagMap[handle] = prefix;
  }
};
function captureSegment(state2, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state2.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
          throwError(state2, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state2, "the stream contains non-printable characters");
    }
    state2.result += _result;
  }
}
function mergeMappings(state2, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common$1.isObject(source)) {
    throwError(state2, "cannot merge mappings; the provided source object is unacceptable");
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state2, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state2, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
        keyNode[index] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state2, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state2, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state2.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state2.line = startLine || state2.line;
      state2.lineStart = startLineStart || state2.lineStart;
      state2.position = startPos || state2.position;
      throwError(state2, "duplicated mapping key");
    }
    if (keyNode === "__proto__") {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state2) {
  var ch;
  ch = state2.input.charCodeAt(state2.position);
  if (ch === 10) {
    state2.position++;
  } else if (ch === 13) {
    state2.position++;
    if (state2.input.charCodeAt(state2.position) === 10) {
      state2.position++;
    }
  } else {
    throwError(state2, "a line break is expected");
  }
  state2.line += 1;
  state2.lineStart = state2.position;
  state2.firstTabInLine = -1;
}
function skipSeparationSpace(state2, allowComments, checkIndent) {
  var lineBreaks = 0, ch = state2.input.charCodeAt(state2.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 9 && state2.firstTabInLine === -1) {
        state2.firstTabInLine = state2.position;
      }
      ch = state2.input.charCodeAt(++state2.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state2.input.charCodeAt(++state2.position);
      } while (ch !== 10 && ch !== 13 && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state2);
      ch = state2.input.charCodeAt(state2.position);
      lineBreaks++;
      state2.lineIndent = 0;
      while (ch === 32) {
        state2.lineIndent++;
        ch = state2.input.charCodeAt(++state2.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state2.lineIndent < checkIndent) {
    throwWarning(state2, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state2) {
  var _position = state2.position, ch;
  ch = state2.input.charCodeAt(_position);
  if ((ch === 45 || ch === 46) && ch === state2.input.charCodeAt(_position + 1) && ch === state2.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state2.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state2, count) {
  if (count === 1) {
    state2.result += " ";
  } else if (count > 1) {
    state2.result += common$1.repeat("\n", count - 1);
  }
}
function readPlainScalar(state2, nodeIndent, withinFlowCollection) {
  var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state2.kind, _result = state2.result, ch;
  ch = state2.input.charCodeAt(state2.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  if (ch === 63 || ch === 45) {
    following = state2.input.charCodeAt(state2.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state2.kind = "scalar";
  state2.result = "";
  captureStart = captureEnd = state2.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 58) {
      following = state2.input.charCodeAt(state2.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 35) {
      preceding = state2.input.charCodeAt(state2.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state2.position === state2.lineStart && testDocumentSeparator(state2) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state2.line;
      _lineStart = state2.lineStart;
      _lineIndent = state2.lineIndent;
      skipSeparationSpace(state2, false, -1);
      if (state2.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state2.input.charCodeAt(state2.position);
        continue;
      } else {
        state2.position = captureEnd;
        state2.line = _line;
        state2.lineStart = _lineStart;
        state2.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state2, captureStart, captureEnd, false);
      writeFoldedLines(state2, state2.line - _line);
      captureStart = captureEnd = state2.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state2.position + 1;
    }
    ch = state2.input.charCodeAt(++state2.position);
  }
  captureSegment(state2, captureStart, captureEnd, false);
  if (state2.result) {
    return true;
  }
  state2.kind = _kind;
  state2.result = _result;
  return false;
}
function readSingleQuotedScalar(state2, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state2.input.charCodeAt(state2.position);
  if (ch !== 39) {
    return false;
  }
  state2.kind = "scalar";
  state2.result = "";
  state2.position++;
  captureStart = captureEnd = state2.position;
  while ((ch = state2.input.charCodeAt(state2.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state2, captureStart, state2.position, true);
      ch = state2.input.charCodeAt(++state2.position);
      if (ch === 39) {
        captureStart = state2.position;
        state2.position++;
        captureEnd = state2.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state2, captureStart, captureEnd, true);
      writeFoldedLines(state2, skipSeparationSpace(state2, false, nodeIndent));
      captureStart = captureEnd = state2.position;
    } else if (state2.position === state2.lineStart && testDocumentSeparator(state2)) {
      throwError(state2, "unexpected end of the document within a single quoted scalar");
    } else {
      state2.position++;
      captureEnd = state2.position;
    }
  }
  throwError(state2, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state2, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state2.input.charCodeAt(state2.position);
  if (ch !== 34) {
    return false;
  }
  state2.kind = "scalar";
  state2.result = "";
  state2.position++;
  captureStart = captureEnd = state2.position;
  while ((ch = state2.input.charCodeAt(state2.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state2, captureStart, state2.position, true);
      state2.position++;
      return true;
    } else if (ch === 92) {
      captureSegment(state2, captureStart, state2.position, true);
      ch = state2.input.charCodeAt(++state2.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state2, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state2.result += simpleEscapeMap[ch];
        state2.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state2.input.charCodeAt(++state2.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state2, "expected hexadecimal character");
          }
        }
        state2.result += charFromCodepoint(hexResult);
        state2.position++;
      } else {
        throwError(state2, "unknown escape sequence");
      }
      captureStart = captureEnd = state2.position;
    } else if (is_EOL(ch)) {
      captureSegment(state2, captureStart, captureEnd, true);
      writeFoldedLines(state2, skipSeparationSpace(state2, false, nodeIndent));
      captureStart = captureEnd = state2.position;
    } else if (state2.position === state2.lineStart && testDocumentSeparator(state2)) {
      throwError(state2, "unexpected end of the document within a double quoted scalar");
    } else {
      state2.position++;
      captureEnd = state2.position;
    }
  }
  throwError(state2, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state2, nodeIndent) {
  var readNext = true, _line, _lineStart, _pos, _tag = state2.tag, _result, _anchor = state2.anchor, following, terminator2, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
  ch = state2.input.charCodeAt(state2.position);
  if (ch === 91) {
    terminator2 = 93;
    isMapping = false;
    _result = [];
  } else if (ch === 123) {
    terminator2 = 125;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state2.anchor !== null) {
    state2.anchorMap[state2.anchor] = _result;
  }
  ch = state2.input.charCodeAt(++state2.position);
  while (ch !== 0) {
    skipSeparationSpace(state2, true, nodeIndent);
    ch = state2.input.charCodeAt(state2.position);
    if (ch === terminator2) {
      state2.position++;
      state2.tag = _tag;
      state2.anchor = _anchor;
      state2.kind = isMapping ? "mapping" : "sequence";
      state2.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state2, "missed comma between flow collection entries");
    } else if (ch === 44) {
      throwError(state2, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state2.input.charCodeAt(state2.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state2.position++;
        skipSeparationSpace(state2, true, nodeIndent);
      }
    }
    _line = state2.line;
    _lineStart = state2.lineStart;
    _pos = state2.position;
    composeNode(state2, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state2.tag;
    keyNode = state2.result;
    skipSeparationSpace(state2, true, nodeIndent);
    ch = state2.input.charCodeAt(state2.position);
    if ((isExplicitPair || state2.line === _line) && ch === 58) {
      isPair = true;
      ch = state2.input.charCodeAt(++state2.position);
      skipSeparationSpace(state2, true, nodeIndent);
      composeNode(state2, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state2.result;
    }
    if (isMapping) {
      storeMappingPair(state2, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state2, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state2, true, nodeIndent);
    ch = state2.input.charCodeAt(state2.position);
    if (ch === 44) {
      readNext = true;
      ch = state2.input.charCodeAt(++state2.position);
    } else {
      readNext = false;
    }
  }
  throwError(state2, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state2, nodeIndent) {
  var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
  ch = state2.input.charCodeAt(state2.position);
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state2.kind = "scalar";
  state2.result = "";
  while (ch !== 0) {
    ch = state2.input.charCodeAt(++state2.position);
    if (ch === 43 || ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state2, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state2, "bad explicit indentation width of a block scalar; it cannot be less than one");
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state2, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state2.input.charCodeAt(++state2.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 35) {
      do {
        ch = state2.input.charCodeAt(++state2.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state2);
    state2.lineIndent = 0;
    ch = state2.input.charCodeAt(state2.position);
    while ((!detectedIndent || state2.lineIndent < textIndent) && ch === 32) {
      state2.lineIndent++;
      ch = state2.input.charCodeAt(++state2.position);
    }
    if (!detectedIndent && state2.lineIndent > textIndent) {
      textIndent = state2.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state2.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state2.result += common$1.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state2.result += "\n";
        }
      }
      break;
    }
    if (folding) {
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state2.result += common$1.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state2.result += common$1.repeat("\n", emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state2.result += " ";
        }
      } else {
        state2.result += common$1.repeat("\n", emptyLines);
      }
    } else {
      state2.result += common$1.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state2.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state2.input.charCodeAt(++state2.position);
    }
    captureSegment(state2, captureStart, state2.position, false);
  }
  return true;
}
function readBlockSequence(state2, nodeIndent) {
  var _line, _tag = state2.tag, _anchor = state2.anchor, _result = [], following, detected = false, ch;
  if (state2.firstTabInLine !== -1) return false;
  if (state2.anchor !== null) {
    state2.anchorMap[state2.anchor] = _result;
  }
  ch = state2.input.charCodeAt(state2.position);
  while (ch !== 0) {
    if (state2.firstTabInLine !== -1) {
      state2.position = state2.firstTabInLine;
      throwError(state2, "tab characters must not be used in indentation");
    }
    if (ch !== 45) {
      break;
    }
    following = state2.input.charCodeAt(state2.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state2.position++;
    if (skipSeparationSpace(state2, true, -1)) {
      if (state2.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state2.input.charCodeAt(state2.position);
        continue;
      }
    }
    _line = state2.line;
    composeNode(state2, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state2.result);
    skipSeparationSpace(state2, true, -1);
    ch = state2.input.charCodeAt(state2.position);
    if ((state2.line === _line || state2.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state2, "bad indentation of a sequence entry");
    } else if (state2.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state2.tag = _tag;
    state2.anchor = _anchor;
    state2.kind = "sequence";
    state2.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state2, nodeIndent, flowIndent) {
  var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state2.tag, _anchor = state2.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state2.firstTabInLine !== -1) return false;
  if (state2.anchor !== null) {
    state2.anchorMap[state2.anchor] = _result;
  }
  ch = state2.input.charCodeAt(state2.position);
  while (ch !== 0) {
    if (!atExplicitKey && state2.firstTabInLine !== -1) {
      state2.position = state2.firstTabInLine;
      throwError(state2, "tab characters must not be used in indentation");
    }
    following = state2.input.charCodeAt(state2.position + 1);
    _line = state2.line;
    if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(state2, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state2, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
      }
      state2.position += 1;
      ch = following;
    } else {
      _keyLine = state2.line;
      _keyLineStart = state2.lineStart;
      _keyPos = state2.position;
      if (!composeNode(state2, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        break;
      }
      if (state2.line === _line) {
        ch = state2.input.charCodeAt(state2.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state2.input.charCodeAt(++state2.position);
        }
        if (ch === 58) {
          ch = state2.input.charCodeAt(++state2.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state2, "a whitespace character is expected after the key-value separator within a block mapping");
          }
          if (atExplicitKey) {
            storeMappingPair(state2, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state2.tag;
          keyNode = state2.result;
        } else if (detected) {
          throwError(state2, "can not read an implicit mapping pair; a colon is missed");
        } else {
          state2.tag = _tag;
          state2.anchor = _anchor;
          return true;
        }
      } else if (detected) {
        throwError(state2, "can not read a block mapping entry; a multiline key may not be an implicit key");
      } else {
        state2.tag = _tag;
        state2.anchor = _anchor;
        return true;
      }
    }
    if (state2.line === _line || state2.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state2.line;
        _keyLineStart = state2.lineStart;
        _keyPos = state2.position;
      }
      if (composeNode(state2, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state2.result;
        } else {
          valueNode = state2.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state2, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state2, true, -1);
      ch = state2.input.charCodeAt(state2.position);
    }
    if ((state2.line === _line || state2.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state2, "bad indentation of a mapping entry");
    } else if (state2.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(state2, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }
  if (detected) {
    state2.tag = _tag;
    state2.anchor = _anchor;
    state2.kind = "mapping";
    state2.result = _result;
  }
  return detected;
}
function readTagProperty(state2) {
  var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
  ch = state2.input.charCodeAt(state2.position);
  if (ch !== 33) return false;
  if (state2.tag !== null) {
    throwError(state2, "duplication of a tag property");
  }
  ch = state2.input.charCodeAt(++state2.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state2.input.charCodeAt(++state2.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state2.input.charCodeAt(++state2.position);
  } else {
    tagHandle = "!";
  }
  _position = state2.position;
  if (isVerbatim) {
    do {
      ch = state2.input.charCodeAt(++state2.position);
    } while (ch !== 0 && ch !== 62);
    if (state2.position < state2.length) {
      tagName = state2.input.slice(_position, state2.position);
      ch = state2.input.charCodeAt(++state2.position);
    } else {
      throwError(state2, "unexpected end of the stream within a verbatim tag");
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state2.input.slice(_position - 1, state2.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state2, "named tag handle cannot contain such characters");
          }
          isNamed = true;
          _position = state2.position + 1;
        } else {
          throwError(state2, "tag suffix cannot contain exclamation marks");
        }
      }
      ch = state2.input.charCodeAt(++state2.position);
    }
    tagName = state2.input.slice(_position, state2.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state2, "tag suffix cannot contain flow indicator characters");
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state2, "tag name cannot contain such characters: " + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state2, "tag name is malformed: " + tagName);
  }
  if (isVerbatim) {
    state2.tag = tagName;
  } else if (_hasOwnProperty$1.call(state2.tagMap, tagHandle)) {
    state2.tag = state2.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state2.tag = "!" + tagName;
  } else if (tagHandle === "!!") {
    state2.tag = "tag:yaml.org,2002:" + tagName;
  } else {
    throwError(state2, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state2) {
  var _position, ch;
  ch = state2.input.charCodeAt(state2.position);
  if (ch !== 38) return false;
  if (state2.anchor !== null) {
    throwError(state2, "duplication of an anchor property");
  }
  ch = state2.input.charCodeAt(++state2.position);
  _position = state2.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state2.input.charCodeAt(++state2.position);
  }
  if (state2.position === _position) {
    throwError(state2, "name of an anchor node must contain at least one character");
  }
  state2.anchor = state2.input.slice(_position, state2.position);
  return true;
}
function readAlias(state2) {
  var _position, alias, ch;
  ch = state2.input.charCodeAt(state2.position);
  if (ch !== 42) return false;
  ch = state2.input.charCodeAt(++state2.position);
  _position = state2.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state2.input.charCodeAt(++state2.position);
  }
  if (state2.position === _position) {
    throwError(state2, "name of an alias node must contain at least one character");
  }
  alias = state2.input.slice(_position, state2.position);
  if (!_hasOwnProperty$1.call(state2.anchorMap, alias)) {
    throwError(state2, 'unidentified alias "' + alias + '"');
  }
  state2.result = state2.anchorMap[alias];
  skipSeparationSpace(state2, true, -1);
  return true;
}
function composeNode(state2, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
  if (state2.listener !== null) {
    state2.listener("open", state2);
  }
  state2.tag = null;
  state2.anchor = null;
  state2.kind = null;
  state2.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state2, true, -1)) {
      atNewLine = true;
      if (state2.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state2.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state2.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state2) || readAnchorProperty(state2)) {
      if (skipSeparationSpace(state2, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state2.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state2.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state2.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state2.position - state2.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state2, blockIndent) || readBlockMapping(state2, blockIndent, flowIndent)) || readFlowCollection(state2, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state2, flowIndent) || readSingleQuotedScalar(state2, flowIndent) || readDoubleQuotedScalar(state2, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state2)) {
          hasContent = true;
          if (state2.tag !== null || state2.anchor !== null) {
            throwError(state2, "alias node should not have any properties");
          }
        } else if (readPlainScalar(state2, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state2.tag === null) {
            state2.tag = "?";
          }
        }
        if (state2.anchor !== null) {
          state2.anchorMap[state2.anchor] = state2.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state2, blockIndent);
    }
  }
  if (state2.tag === null) {
    if (state2.anchor !== null) {
      state2.anchorMap[state2.anchor] = state2.result;
    }
  } else if (state2.tag === "?") {
    if (state2.result !== null && state2.kind !== "scalar") {
      throwError(state2, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state2.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state2.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type2 = state2.implicitTypes[typeIndex];
      if (type2.resolve(state2.result)) {
        state2.result = type2.construct(state2.result);
        state2.tag = type2.tag;
        if (state2.anchor !== null) {
          state2.anchorMap[state2.anchor] = state2.result;
        }
        break;
      }
    }
  } else if (state2.tag !== "!") {
    if (_hasOwnProperty$1.call(state2.typeMap[state2.kind || "fallback"], state2.tag)) {
      type2 = state2.typeMap[state2.kind || "fallback"][state2.tag];
    } else {
      type2 = null;
      typeList = state2.typeMap.multi[state2.kind || "fallback"];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state2.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type2 = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type2) {
      throwError(state2, "unknown tag !<" + state2.tag + ">");
    }
    if (state2.result !== null && type2.kind !== state2.kind) {
      throwError(state2, "unacceptable node kind for !<" + state2.tag + '> tag; it should be "' + type2.kind + '", not "' + state2.kind + '"');
    }
    if (!type2.resolve(state2.result, state2.tag)) {
      throwError(state2, "cannot resolve a node with !<" + state2.tag + "> explicit tag");
    } else {
      state2.result = type2.construct(state2.result, state2.tag);
      if (state2.anchor !== null) {
        state2.anchorMap[state2.anchor] = state2.result;
      }
    }
  }
  if (state2.listener !== null) {
    state2.listener("close", state2);
  }
  return state2.tag !== null || state2.anchor !== null || hasContent;
}
function readDocument(state2) {
  var documentStart = state2.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
  state2.version = null;
  state2.checkLineBreaks = state2.legacy;
  state2.tagMap = /* @__PURE__ */ Object.create(null);
  state2.anchorMap = /* @__PURE__ */ Object.create(null);
  while ((ch = state2.input.charCodeAt(state2.position)) !== 0) {
    skipSeparationSpace(state2, true, -1);
    ch = state2.input.charCodeAt(state2.position);
    if (state2.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state2.input.charCodeAt(++state2.position);
    _position = state2.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state2.input.charCodeAt(++state2.position);
    }
    directiveName = state2.input.slice(_position, state2.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state2, "directive name must not be less than one character in length");
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state2.input.charCodeAt(++state2.position);
      }
      if (ch === 35) {
        do {
          ch = state2.input.charCodeAt(++state2.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch)) break;
      _position = state2.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state2.input.charCodeAt(++state2.position);
      }
      directiveArgs.push(state2.input.slice(_position, state2.position));
    }
    if (ch !== 0) readLineBreak(state2);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state2, directiveName, directiveArgs);
    } else {
      throwWarning(state2, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state2, true, -1);
  if (state2.lineIndent === 0 && state2.input.charCodeAt(state2.position) === 45 && state2.input.charCodeAt(state2.position + 1) === 45 && state2.input.charCodeAt(state2.position + 2) === 45) {
    state2.position += 3;
    skipSeparationSpace(state2, true, -1);
  } else if (hasDirectives) {
    throwError(state2, "directives end mark is expected");
  }
  composeNode(state2, state2.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state2, true, -1);
  if (state2.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state2.input.slice(documentStart, state2.position))) {
    throwWarning(state2, "non-ASCII line breaks are interpreted as content");
  }
  state2.documents.push(state2.result);
  if (state2.position === state2.lineStart && testDocumentSeparator(state2)) {
    if (state2.input.charCodeAt(state2.position) === 46) {
      state2.position += 3;
      skipSeparationSpace(state2, true, -1);
    }
    return;
  }
  if (state2.position < state2.length - 1) {
    throwError(state2, "end of the stream or a document separator is expected");
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += "\n";
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  var state2 = new State$1(input, options);
  var nullpos = input.indexOf("\0");
  if (nullpos !== -1) {
    state2.position = nullpos;
    throwError(state2, "null byte is not allowed in input");
  }
  state2.input += "\0";
  while (state2.input.charCodeAt(state2.position) === 32) {
    state2.lineIndent += 1;
    state2.position += 1;
  }
  while (state2.position < state2.length - 1) {
    readDocument(state2);
  }
  return state2.documents;
}
function loadAll(input, iterator, options) {
  if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== "function") {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return void 0;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new YAMLException$1("expected a single document in the stream, but found more");
}
loader$1.loadAll = loadAll;
loader$1.load = load;
var dumper$1 = {};
var common = common$5;
var YAMLException = exception;
var DEFAULT_SCHEMA = _default;
var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 65279;
var CHAR_TAB = 9;
var CHAR_LINE_FEED = 10;
var CHAR_CARRIAGE_RETURN = 13;
var CHAR_SPACE = 32;
var CHAR_EXCLAMATION = 33;
var CHAR_DOUBLE_QUOTE = 34;
var CHAR_SHARP = 35;
var CHAR_PERCENT = 37;
var CHAR_AMPERSAND = 38;
var CHAR_SINGLE_QUOTE = 39;
var CHAR_ASTERISK = 42;
var CHAR_COMMA = 44;
var CHAR_MINUS = 45;
var CHAR_COLON = 58;
var CHAR_EQUALS = 61;
var CHAR_GREATER_THAN = 62;
var CHAR_QUESTION = 63;
var CHAR_COMMERCIAL_AT = 64;
var CHAR_LEFT_SQUARE_BRACKET = 91;
var CHAR_RIGHT_SQUARE_BRACKET = 93;
var CHAR_GRAVE_ACCENT = 96;
var CHAR_LEFT_CURLY_BRACKET = 123;
var CHAR_VERTICAL_LINE = 124;
var CHAR_RIGHT_CURLY_BRACKET = 125;
var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0] = "\\0";
ESCAPE_SEQUENCES[7] = "\\a";
ESCAPE_SEQUENCES[8] = "\\b";
ESCAPE_SEQUENCES[9] = "\\t";
ESCAPE_SEQUENCES[10] = "\\n";
ESCAPE_SEQUENCES[11] = "\\v";
ESCAPE_SEQUENCES[12] = "\\f";
ESCAPE_SEQUENCES[13] = "\\r";
ESCAPE_SEQUENCES[27] = "\\e";
ESCAPE_SEQUENCES[34] = '\\"';
ESCAPE_SEQUENCES[92] = "\\\\";
ESCAPE_SEQUENCES[133] = "\\N";
ESCAPE_SEQUENCES[160] = "\\_";
ESCAPE_SEQUENCES[8232] = "\\L";
ESCAPE_SEQUENCES[8233] = "\\P";
var DEPRECATED_BOOLEANS_SYNTAX = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema2, map2) {
  var result, keys, index, length, tag, style2, type2;
  if (map2 === null) return {};
  result = {};
  keys = Object.keys(map2);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style2 = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = "tag:yaml.org,2002:" + tag.slice(2);
    }
    type2 = schema2.compiledTypeMap["fallback"][tag];
    if (type2 && _hasOwnProperty.call(type2.styleAliases, style2)) {
      style2 = type2.styleAliases[style2];
    }
    result[tag] = style2;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 255) {
    handle = "x";
    length = 2;
  } else if (character <= 65535) {
    handle = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle = "U";
    length = 8;
  } else {
    throw new YAMLException("code point within a string may not be greater than 0xFFFFFFFF");
  }
  return "\\" + handle + common.repeat("0", length - string.length) + string;
}
var QUOTING_TYPE_SINGLE = 1, QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options["schema"] || DEFAULT_SCHEMA;
  this.indent = Math.max(1, options["indent"] || 2);
  this.noArrayIndent = options["noArrayIndent"] || false;
  this.skipInvalid = options["skipInvalid"] || false;
  this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
  this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
  this.sortKeys = options["sortKeys"] || false;
  this.lineWidth = options["lineWidth"] || 80;
  this.noRefs = options["noRefs"] || false;
  this.noCompatMode = options["noCompatMode"] || false;
  this.condenseFlow = options["condenseFlow"] || false;
  this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options["forceQuotes"] || false;
  this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = "";
  this.duplicates = [];
  this.usedDuplicates = null;
}
function indentString(string, spaces) {
  var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
  while (position < length) {
    next = string.indexOf("\n", position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== "\n") result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state2, level) {
  return "\n" + common.repeat(" ", state2.indent * level);
}
function testImplicitResolving(state2, str2) {
  var index, length, type2;
  for (index = 0, length = state2.implicitTypes.length; index < length; index += 1) {
    type2 = state2.implicitTypes[index];
    if (type2.resolve(str2)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
}
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    (inblock ? (
      // c = flow-in
      cIsNsCharOrWhitespace
    ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
  );
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function isPlainSafeLast(c) {
  return !isWhitespace(c) && c !== CHAR_COLON;
}
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1, STYLE_SINGLE = 2, STYLE_LITERAL = 3, STYLE_FOLDED = 4, STYLE_DOUBLE = 5;
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false;
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1;
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
  }
  if (!hasLineBreak && !hasFoldableLine) {
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}
function writeScalar(state2, string, level, iskey, inblock) {
  state2.dump = function() {
    if (string.length === 0) {
      return state2.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state2.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state2.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state2.indent * Math.max(1, level);
    var lineWidth = state2.lineWidth === -1 ? -1 : Math.max(Math.min(state2.lineWidth, 40), state2.lineWidth - indent);
    var singleLineOnly = iskey || state2.flowLevel > -1 && level >= state2.flowLevel;
    function testAmbiguity(string2) {
      return testImplicitResolving(state2, string2);
    }
    switch (chooseScalarStyle(
      string,
      singleLineOnly,
      state2.indent,
      lineWidth,
      testAmbiguity,
      state2.quotingType,
      state2.forceQuotes && !iskey,
      inblock
    )) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return "|" + blockHeader(string, state2.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return ">" + blockHeader(string, state2.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new YAMLException("impossible error: invalid scalar style");
    }
  }();
}
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
  var clip = string[string.length - 1] === "\n";
  var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
  var chomp = keep ? "+" : clip ? "" : "-";
  return indentIndicator + chomp + "\n";
}
function dropEndingNewline(string) {
  return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function foldString(string, width) {
  var lineRe = /(\n+)([^\n]*)/g;
  var result = function() {
    var nextLF = string.indexOf("\n");
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }();
  var prevMoreIndented = string[0] === "\n" || string[0] === " ";
  var moreIndented;
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1], line = match[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ") return line;
  var breakRe = / [^ ]/g;
  var match;
  var start = 0, end, curr = 0, next = 0;
  var result = "";
  while (match = breakRe.exec(line)) {
    next = match.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += "\n" + line.slice(start, end);
      start = end + 1;
    }
    curr = next;
  }
  result += "\n";
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function escapeString(string) {
  var result = "";
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 65536) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state2, level, object2) {
  var _result = "", _tag = state2.tag, index, length, value;
  for (index = 0, length = object2.length; index < length; index += 1) {
    value = object2[index];
    if (state2.replacer) {
      value = state2.replacer.call(object2, String(index), value);
    }
    if (writeNode(state2, level, value, false, false) || typeof value === "undefined" && writeNode(state2, level, null, false, false)) {
      if (_result !== "") _result += "," + (!state2.condenseFlow ? " " : "");
      _result += state2.dump;
    }
  }
  state2.tag = _tag;
  state2.dump = "[" + _result + "]";
}
function writeBlockSequence(state2, level, object2, compact) {
  var _result = "", _tag = state2.tag, index, length, value;
  for (index = 0, length = object2.length; index < length; index += 1) {
    value = object2[index];
    if (state2.replacer) {
      value = state2.replacer.call(object2, String(index), value);
    }
    if (writeNode(state2, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state2, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== "") {
        _result += generateNextLine(state2, level);
      }
      if (state2.dump && CHAR_LINE_FEED === state2.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state2.dump;
    }
  }
  state2.tag = _tag;
  state2.dump = _result || "[]";
}
function writeFlowMapping(state2, level, object2) {
  var _result = "", _tag = state2.tag, objectKeyList = Object.keys(object2), index, length, objectKey, objectValue, pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (_result !== "") pairBuffer += ", ";
    if (state2.condenseFlow) pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object2[objectKey];
    if (state2.replacer) {
      objectValue = state2.replacer.call(object2, objectKey, objectValue);
    }
    if (!writeNode(state2, level, objectKey, false, false)) {
      continue;
    }
    if (state2.dump.length > 1024) pairBuffer += "? ";
    pairBuffer += state2.dump + (state2.condenseFlow ? '"' : "") + ":" + (state2.condenseFlow ? "" : " ");
    if (!writeNode(state2, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state2.dump;
    _result += pairBuffer;
  }
  state2.tag = _tag;
  state2.dump = "{" + _result + "}";
}
function writeBlockMapping(state2, level, object2, compact) {
  var _result = "", _tag = state2.tag, objectKeyList = Object.keys(object2), index, length, objectKey, objectValue, explicitPair, pairBuffer;
  if (state2.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state2.sortKeys === "function") {
    objectKeyList.sort(state2.sortKeys);
  } else if (state2.sortKeys) {
    throw new YAMLException("sortKeys must be a boolean or a function");
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (!compact || _result !== "") {
      pairBuffer += generateNextLine(state2, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object2[objectKey];
    if (state2.replacer) {
      objectValue = state2.replacer.call(object2, objectKey, objectValue);
    }
    if (!writeNode(state2, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state2.tag !== null && state2.tag !== "?" || state2.dump && state2.dump.length > 1024;
    if (explicitPair) {
      if (state2.dump && CHAR_LINE_FEED === state2.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state2.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state2, level);
    }
    if (!writeNode(state2, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state2.dump && CHAR_LINE_FEED === state2.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state2.dump;
    _result += pairBuffer;
  }
  state2.tag = _tag;
  state2.dump = _result || "{}";
}
function detectType(state2, object2, explicit) {
  var _result, typeList, index, length, type2, style2;
  typeList = explicit ? state2.explicitTypes : state2.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type2 = typeList[index];
    if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object2 === "object" && object2 instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object2))) {
      if (explicit) {
        if (type2.multi && type2.representName) {
          state2.tag = type2.representName(object2);
        } else {
          state2.tag = type2.tag;
        }
      } else {
        state2.tag = "?";
      }
      if (type2.represent) {
        style2 = state2.styleMap[type2.tag] || type2.defaultStyle;
        if (_toString.call(type2.represent) === "[object Function]") {
          _result = type2.represent(object2, style2);
        } else if (_hasOwnProperty.call(type2.represent, style2)) {
          _result = type2.represent[style2](object2, style2);
        } else {
          throw new YAMLException("!<" + type2.tag + '> tag resolver accepts not "' + style2 + '" style');
        }
        state2.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state2, level, object2, block, compact, iskey, isblockseq) {
  state2.tag = null;
  state2.dump = object2;
  if (!detectType(state2, object2, false)) {
    detectType(state2, object2, true);
  }
  var type2 = _toString.call(state2.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state2.flowLevel < 0 || state2.flowLevel > level;
  }
  var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
  if (objectOrArray) {
    duplicateIndex = state2.duplicates.indexOf(object2);
    duplicate = duplicateIndex !== -1;
  }
  if (state2.tag !== null && state2.tag !== "?" || duplicate || state2.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state2.usedDuplicates[duplicateIndex]) {
    state2.dump = "*ref_" + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state2.usedDuplicates[duplicateIndex]) {
      state2.usedDuplicates[duplicateIndex] = true;
    }
    if (type2 === "[object Object]") {
      if (block && Object.keys(state2.dump).length !== 0) {
        writeBlockMapping(state2, level, state2.dump, compact);
        if (duplicate) {
          state2.dump = "&ref_" + duplicateIndex + state2.dump;
        }
      } else {
        writeFlowMapping(state2, level, state2.dump);
        if (duplicate) {
          state2.dump = "&ref_" + duplicateIndex + " " + state2.dump;
        }
      }
    } else if (type2 === "[object Array]") {
      if (block && state2.dump.length !== 0) {
        if (state2.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state2, level - 1, state2.dump, compact);
        } else {
          writeBlockSequence(state2, level, state2.dump, compact);
        }
        if (duplicate) {
          state2.dump = "&ref_" + duplicateIndex + state2.dump;
        }
      } else {
        writeFlowSequence(state2, level, state2.dump);
        if (duplicate) {
          state2.dump = "&ref_" + duplicateIndex + " " + state2.dump;
        }
      }
    } else if (type2 === "[object String]") {
      if (state2.tag !== "?") {
        writeScalar(state2, state2.dump, level, iskey, inblock);
      }
    } else if (type2 === "[object Undefined]") {
      return false;
    } else {
      if (state2.skipInvalid) return false;
      throw new YAMLException("unacceptable kind of an object to dump " + type2);
    }
    if (state2.tag !== null && state2.tag !== "?") {
      tagStr = encodeURI(
        state2.tag[0] === "!" ? state2.tag.slice(1) : state2.tag
      ).replace(/!/g, "%21");
      if (state2.tag[0] === "!") {
        tagStr = "!" + tagStr;
      } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
        tagStr = "!!" + tagStr.slice(18);
      } else {
        tagStr = "!<" + tagStr + ">";
      }
      state2.dump = tagStr + " " + state2.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object2, state2) {
  var objects = [], duplicatesIndexes = [], index, length;
  inspectNode(object2, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state2.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state2.usedDuplicates = new Array(length);
}
function inspectNode(object2, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object2 !== null && typeof object2 === "object") {
    index = objects.indexOf(object2);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object2);
      if (Array.isArray(object2)) {
        for (index = 0, length = object2.length; index < length; index += 1) {
          inspectNode(object2[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object2);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object2[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump(input, options) {
  options = options || {};
  var state2 = new State(options);
  if (!state2.noRefs) getDuplicateReferences(input, state2);
  var value = input;
  if (state2.replacer) {
    value = state2.replacer.call({ "": value }, "", value);
  }
  if (writeNode(state2, 0, value, true, true)) return state2.dump + "\n";
  return "";
}
dumper$1.dump = dump;
var loader = loader$1;
var dumper = dumper$1;
function renamed(from, to) {
  return function() {
    throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
  };
}
jsYaml.Type = type;
jsYaml.Schema = schema;
jsYaml.FAILSAFE_SCHEMA = failsafe;
jsYaml.JSON_SCHEMA = json;
jsYaml.CORE_SCHEMA = core;
jsYaml.DEFAULT_SCHEMA = _default;
jsYaml.load = loader.load;
jsYaml.loadAll = loader.loadAll;
jsYaml.dump = dumper.dump;
jsYaml.YAMLException = exception;
jsYaml.types = {
  binary,
  float,
  map,
  null: _null,
  pairs,
  set,
  timestamp,
  bool,
  int,
  merge,
  omap,
  seq,
  str
};
jsYaml.safeLoad = renamed("safeLoad", "load");
jsYaml.safeLoadAll = renamed("safeLoadAll", "loadAll");
jsYaml.safeDump = renamed("safeDump", "dump");
var main$2 = {};
Object.defineProperty(main$2, "__esModule", { value: true });
main$2.Lazy = void 0;
class Lazy {
  constructor(creator) {
    this._value = null;
    this.creator = creator;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null) {
      return this._value;
    }
    const result = this.creator();
    this.value = result;
    return result;
  }
  set value(value) {
    this._value = value;
    this.creator = null;
  }
}
main$2.Lazy = Lazy;
var re$2 = { exports: {} };
const SEMVER_SPEC_VERSION = "2.0.0";
const MAX_LENGTH$1 = 256;
const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991;
const MAX_SAFE_COMPONENT_LENGTH = 16;
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH$1 - 6;
const RELEASE_TYPES = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var constants$1 = {
  MAX_LENGTH: MAX_LENGTH$1,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const debug$1 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
};
var debug_1 = debug$1;
(function(module2, exports2) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: MAX_SAFE_COMPONENT_LENGTH2,
    MAX_SAFE_BUILD_LENGTH: MAX_SAFE_BUILD_LENGTH2,
    MAX_LENGTH: MAX_LENGTH2
  } = constants$1;
  const debug2 = debug_1;
  exports2 = module2.exports = {};
  const re2 = exports2.re = [];
  const safeRe = exports2.safeRe = [];
  const src2 = exports2.src = [];
  const safeSrc = exports2.safeSrc = [];
  const t2 = exports2.t = {};
  let R = 0;
  const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
  const safeRegexReplacements = [
    ["\\s", 1],
    ["\\d", MAX_LENGTH2],
    [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH2]
  ];
  const makeSafeRegex = (value) => {
    for (const [token, max2] of safeRegexReplacements) {
      value = value.split(`${token}*`).join(`${token}{0,${max2}}`).split(`${token}+`).join(`${token}{1,${max2}}`);
    }
    return value;
  };
  const createToken = (name, value, isGlobal) => {
    const safe = makeSafeRegex(value);
    const index = R++;
    debug2(name, index, value);
    t2[name] = index;
    src2[index] = value;
    safeSrc[index] = safe;
    re2[index] = new RegExp(value, isGlobal ? "g" : void 0);
    safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
  };
  createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
  createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
  createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
  createToken("MAINVERSION", `(${src2[t2.NUMERICIDENTIFIER]})\\.(${src2[t2.NUMERICIDENTIFIER]})\\.(${src2[t2.NUMERICIDENTIFIER]})`);
  createToken("MAINVERSIONLOOSE", `(${src2[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src2[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src2[t2.NUMERICIDENTIFIERLOOSE]})`);
  createToken("PRERELEASEIDENTIFIER", `(?:${src2[t2.NUMERICIDENTIFIER]}|${src2[t2.NONNUMERICIDENTIFIER]})`);
  createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src2[t2.NUMERICIDENTIFIERLOOSE]}|${src2[t2.NONNUMERICIDENTIFIER]})`);
  createToken("PRERELEASE", `(?:-(${src2[t2.PRERELEASEIDENTIFIER]}(?:\\.${src2[t2.PRERELEASEIDENTIFIER]})*))`);
  createToken("PRERELEASELOOSE", `(?:-?(${src2[t2.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src2[t2.PRERELEASEIDENTIFIERLOOSE]})*))`);
  createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
  createToken("BUILD", `(?:\\+(${src2[t2.BUILDIDENTIFIER]}(?:\\.${src2[t2.BUILDIDENTIFIER]})*))`);
  createToken("FULLPLAIN", `v?${src2[t2.MAINVERSION]}${src2[t2.PRERELEASE]}?${src2[t2.BUILD]}?`);
  createToken("FULL", `^${src2[t2.FULLPLAIN]}$`);
  createToken("LOOSEPLAIN", `[v=\\s]*${src2[t2.MAINVERSIONLOOSE]}${src2[t2.PRERELEASELOOSE]}?${src2[t2.BUILD]}?`);
  createToken("LOOSE", `^${src2[t2.LOOSEPLAIN]}$`);
  createToken("GTLT", "((?:<|>)?=?)");
  createToken("XRANGEIDENTIFIERLOOSE", `${src2[t2.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
  createToken("XRANGEIDENTIFIER", `${src2[t2.NUMERICIDENTIFIER]}|x|X|\\*`);
  createToken("XRANGEPLAIN", `[v=\\s]*(${src2[t2.XRANGEIDENTIFIER]})(?:\\.(${src2[t2.XRANGEIDENTIFIER]})(?:\\.(${src2[t2.XRANGEIDENTIFIER]})(?:${src2[t2.PRERELEASE]})?${src2[t2.BUILD]}?)?)?`);
  createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src2[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src2[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src2[t2.XRANGEIDENTIFIERLOOSE]})(?:${src2[t2.PRERELEASELOOSE]})?${src2[t2.BUILD]}?)?)?`);
  createToken("XRANGE", `^${src2[t2.GTLT]}\\s*${src2[t2.XRANGEPLAIN]}$`);
  createToken("XRANGELOOSE", `^${src2[t2.GTLT]}\\s*${src2[t2.XRANGEPLAINLOOSE]}$`);
  createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH2}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH2}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH2}}))?`);
  createToken("COERCE", `${src2[t2.COERCEPLAIN]}(?:$|[^\\d])`);
  createToken("COERCEFULL", src2[t2.COERCEPLAIN] + `(?:${src2[t2.PRERELEASE]})?(?:${src2[t2.BUILD]})?(?:$|[^\\d])`);
  createToken("COERCERTL", src2[t2.COERCE], true);
  createToken("COERCERTLFULL", src2[t2.COERCEFULL], true);
  createToken("LONETILDE", "(?:~>?)");
  createToken("TILDETRIM", `(\\s*)${src2[t2.LONETILDE]}\\s+`, true);
  exports2.tildeTrimReplace = "$1~";
  createToken("TILDE", `^${src2[t2.LONETILDE]}${src2[t2.XRANGEPLAIN]}$`);
  createToken("TILDELOOSE", `^${src2[t2.LONETILDE]}${src2[t2.XRANGEPLAINLOOSE]}$`);
  createToken("LONECARET", "(?:\\^)");
  createToken("CARETTRIM", `(\\s*)${src2[t2.LONECARET]}\\s+`, true);
  exports2.caretTrimReplace = "$1^";
  createToken("CARET", `^${src2[t2.LONECARET]}${src2[t2.XRANGEPLAIN]}$`);
  createToken("CARETLOOSE", `^${src2[t2.LONECARET]}${src2[t2.XRANGEPLAINLOOSE]}$`);
  createToken("COMPARATORLOOSE", `^${src2[t2.GTLT]}\\s*(${src2[t2.LOOSEPLAIN]})$|^$`);
  createToken("COMPARATOR", `^${src2[t2.GTLT]}\\s*(${src2[t2.FULLPLAIN]})$|^$`);
  createToken("COMPARATORTRIM", `(\\s*)${src2[t2.GTLT]}\\s*(${src2[t2.LOOSEPLAIN]}|${src2[t2.XRANGEPLAIN]})`, true);
  exports2.comparatorTrimReplace = "$1$2$3";
  createToken("HYPHENRANGE", `^\\s*(${src2[t2.XRANGEPLAIN]})\\s+-\\s+(${src2[t2.XRANGEPLAIN]})\\s*$`);
  createToken("HYPHENRANGELOOSE", `^\\s*(${src2[t2.XRANGEPLAINLOOSE]})\\s+-\\s+(${src2[t2.XRANGEPLAINLOOSE]})\\s*$`);
  createToken("STAR", "(<|>)?=?\\s*\\*");
  createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
  createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(re$2, re$2.exports);
var reExports = re$2.exports;
const looseOption = Object.freeze({ loose: true });
const emptyOpts = Object.freeze({});
const parseOptions$1 = (options) => {
  if (!options) {
    return emptyOpts;
  }
  if (typeof options !== "object") {
    return looseOption;
  }
  return options;
};
var parseOptions_1 = parseOptions$1;
const numeric = /^[0-9]+$/;
const compareIdentifiers$1 = (a, b) => {
  const anum = numeric.test(a);
  const bnum = numeric.test(b);
  if (anum && bnum) {
    a = +a;
    b = +b;
  }
  return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};
const rcompareIdentifiers = (a, b) => compareIdentifiers$1(b, a);
var identifiers$1 = {
  compareIdentifiers: compareIdentifiers$1,
  rcompareIdentifiers
};
const debug = debug_1;
const { MAX_LENGTH, MAX_SAFE_INTEGER } = constants$1;
const { safeRe: re$1, safeSrc: src$1, t: t$1 } = reExports;
const parseOptions = parseOptions_1;
const { compareIdentifiers } = identifiers$1;
let SemVer$d = class SemVer {
  constructor(version2, options) {
    options = parseOptions(options);
    if (version2 instanceof SemVer) {
      if (version2.loose === !!options.loose && version2.includePrerelease === !!options.includePrerelease) {
        return version2;
      } else {
        version2 = version2.version;
      }
    } else if (typeof version2 !== "string") {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version2}".`);
    }
    if (version2.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      );
    }
    debug("SemVer", version2, options);
    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease;
    const m = version2.trim().match(options.loose ? re$1[t$1.LOOSE] : re$1[t$1.FULL]);
    if (!m) {
      throw new TypeError(`Invalid Version: ${version2}`);
    }
    this.raw = version2;
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];
    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError("Invalid major version");
    }
    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError("Invalid minor version");
    }
    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError("Invalid patch version");
    }
    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4].split(".").map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id;
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num;
          }
        }
        return id;
      });
    }
    this.build = m[5] ? m[5].split(".") : [];
    this.format();
  }
  format() {
    this.version = `${this.major}.${this.minor}.${this.patch}`;
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join(".")}`;
    }
    return this.version;
  }
  toString() {
    return this.version;
  }
  compare(other) {
    debug("SemVer.compare", this.version, this.options, other);
    if (!(other instanceof SemVer)) {
      if (typeof other === "string" && other === this.version) {
        return 0;
      }
      other = new SemVer(other, this.options);
    }
    if (other.version === this.version) {
      return 0;
    }
    return this.compareMain(other) || this.comparePre(other);
  }
  compareMain(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
  }
  comparePre(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    if (this.prerelease.length && !other.prerelease.length) {
      return -1;
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1;
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0;
    }
    let i = 0;
    do {
      const a = this.prerelease[i];
      const b = other.prerelease[i];
      debug("prerelease compare", i, a, b);
      if (a === void 0 && b === void 0) {
        return 0;
      } else if (b === void 0) {
        return 1;
      } else if (a === void 0) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i);
  }
  compareBuild(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    let i = 0;
    do {
      const a = this.build[i];
      const b = other.build[i];
      debug("build compare", i, a, b);
      if (a === void 0 && b === void 0) {
        return 0;
      } else if (b === void 0) {
        return 1;
      } else if (a === void 0) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(release, identifier, identifierBase) {
    if (release.startsWith("pre")) {
      if (!identifier && identifierBase === false) {
        throw new Error("invalid increment argument: identifier is empty");
      }
      if (identifier) {
        const r = new RegExp(`^${this.options.loose ? src$1[t$1.PRERELEASELOOSE] : src$1[t$1.PRERELEASE]}$`);
        const match = `-${identifier}`.match(r);
        if (!match || match[1] !== identifier) {
          throw new Error(`invalid identifier: ${identifier}`);
        }
      }
    }
    switch (release) {
      case "premajor":
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor = 0;
        this.major++;
        this.inc("pre", identifier, identifierBase);
        break;
      case "preminor":
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor++;
        this.inc("pre", identifier, identifierBase);
        break;
      case "prepatch":
        this.prerelease.length = 0;
        this.inc("patch", identifier, identifierBase);
        this.inc("pre", identifier, identifierBase);
        break;
      case "prerelease":
        if (this.prerelease.length === 0) {
          this.inc("patch", identifier, identifierBase);
        }
        this.inc("pre", identifier, identifierBase);
        break;
      case "release":
        if (this.prerelease.length === 0) {
          throw new Error(`version ${this.raw} is not a prerelease`);
        }
        this.prerelease.length = 0;
        break;
      case "major":
        if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
          this.major++;
        }
        this.minor = 0;
        this.patch = 0;
        this.prerelease = [];
        break;
      case "minor":
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++;
        }
        this.patch = 0;
        this.prerelease = [];
        break;
      case "patch":
        if (this.prerelease.length === 0) {
          this.patch++;
        }
        this.prerelease = [];
        break;
      case "pre": {
        const base = Number(identifierBase) ? 1 : 0;
        if (this.prerelease.length === 0) {
          this.prerelease = [base];
        } else {
          let i = this.prerelease.length;
          while (--i >= 0) {
            if (typeof this.prerelease[i] === "number") {
              this.prerelease[i]++;
              i = -2;
            }
          }
          if (i === -1) {
            if (identifier === this.prerelease.join(".") && identifierBase === false) {
              throw new Error("invalid increment argument: identifier already exists");
            }
            this.prerelease.push(base);
          }
        }
        if (identifier) {
          let prerelease2 = [identifier, base];
          if (identifierBase === false) {
            prerelease2 = [identifier];
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease2;
            }
          } else {
            this.prerelease = prerelease2;
          }
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${release}`);
    }
    this.raw = this.format();
    if (this.build.length) {
      this.raw += `+${this.build.join(".")}`;
    }
    return this;
  }
};
var semver$2 = SemVer$d;
const SemVer$c = semver$2;
const parse$7 = (version2, options, throwErrors = false) => {
  if (version2 instanceof SemVer$c) {
    return version2;
  }
  try {
    return new SemVer$c(version2, options);
  } catch (er) {
    if (!throwErrors) {
      return null;
    }
    throw er;
  }
};
var parse_1 = parse$7;
const parse$6 = parse_1;
const valid$2 = (version2, options) => {
  const v = parse$6(version2, options);
  return v ? v.version : null;
};
var valid_1 = valid$2;
const parse$5 = parse_1;
const clean$1 = (version2, options) => {
  const s = parse$5(version2.trim().replace(/^[=v]+/, ""), options);
  return s ? s.version : null;
};
var clean_1 = clean$1;
const SemVer$b = semver$2;
const inc$1 = (version2, release, options, identifier, identifierBase) => {
  if (typeof options === "string") {
    identifierBase = identifier;
    identifier = options;
    options = void 0;
  }
  try {
    return new SemVer$b(
      version2 instanceof SemVer$b ? version2.version : version2,
      options
    ).inc(release, identifier, identifierBase).version;
  } catch (er) {
    return null;
  }
};
var inc_1 = inc$1;
const parse$4 = parse_1;
const diff$1 = (version1, version2) => {
  const v1 = parse$4(version1, null, true);
  const v2 = parse$4(version2, null, true);
  const comparison = v1.compare(v2);
  if (comparison === 0) {
    return null;
  }
  const v1Higher = comparison > 0;
  const highVersion = v1Higher ? v1 : v2;
  const lowVersion = v1Higher ? v2 : v1;
  const highHasPre = !!highVersion.prerelease.length;
  const lowHasPre = !!lowVersion.prerelease.length;
  if (lowHasPre && !highHasPre) {
    if (!lowVersion.patch && !lowVersion.minor) {
      return "major";
    }
    if (lowVersion.compareMain(highVersion) === 0) {
      if (lowVersion.minor && !lowVersion.patch) {
        return "minor";
      }
      return "patch";
    }
  }
  const prefix = highHasPre ? "pre" : "";
  if (v1.major !== v2.major) {
    return prefix + "major";
  }
  if (v1.minor !== v2.minor) {
    return prefix + "minor";
  }
  if (v1.patch !== v2.patch) {
    return prefix + "patch";
  }
  return "prerelease";
};
var diff_1 = diff$1;
const SemVer$a = semver$2;
const major$1 = (a, loose) => new SemVer$a(a, loose).major;
var major_1 = major$1;
const SemVer$9 = semver$2;
const minor$1 = (a, loose) => new SemVer$9(a, loose).minor;
var minor_1 = minor$1;
const SemVer$8 = semver$2;
const patch$1 = (a, loose) => new SemVer$8(a, loose).patch;
var patch_1 = patch$1;
const parse$3 = parse_1;
const prerelease$1 = (version2, options) => {
  const parsed = parse$3(version2, options);
  return parsed && parsed.prerelease.length ? parsed.prerelease : null;
};
var prerelease_1 = prerelease$1;
const SemVer$7 = semver$2;
const compare$b = (a, b, loose) => new SemVer$7(a, loose).compare(new SemVer$7(b, loose));
var compare_1 = compare$b;
const compare$a = compare_1;
const rcompare$1 = (a, b, loose) => compare$a(b, a, loose);
var rcompare_1 = rcompare$1;
const compare$9 = compare_1;
const compareLoose$1 = (a, b) => compare$9(a, b, true);
var compareLoose_1 = compareLoose$1;
const SemVer$6 = semver$2;
const compareBuild$3 = (a, b, loose) => {
  const versionA = new SemVer$6(a, loose);
  const versionB = new SemVer$6(b, loose);
  return versionA.compare(versionB) || versionA.compareBuild(versionB);
};
var compareBuild_1 = compareBuild$3;
const compareBuild$2 = compareBuild_1;
const sort$1 = (list, loose) => list.sort((a, b) => compareBuild$2(a, b, loose));
var sort_1 = sort$1;
const compareBuild$1 = compareBuild_1;
const rsort$1 = (list, loose) => list.sort((a, b) => compareBuild$1(b, a, loose));
var rsort_1 = rsort$1;
const compare$8 = compare_1;
const gt$4 = (a, b, loose) => compare$8(a, b, loose) > 0;
var gt_1 = gt$4;
const compare$7 = compare_1;
const lt$3 = (a, b, loose) => compare$7(a, b, loose) < 0;
var lt_1 = lt$3;
const compare$6 = compare_1;
const eq$2 = (a, b, loose) => compare$6(a, b, loose) === 0;
var eq_1 = eq$2;
const compare$5 = compare_1;
const neq$2 = (a, b, loose) => compare$5(a, b, loose) !== 0;
var neq_1 = neq$2;
const compare$4 = compare_1;
const gte$3 = (a, b, loose) => compare$4(a, b, loose) >= 0;
var gte_1 = gte$3;
const compare$3 = compare_1;
const lte$3 = (a, b, loose) => compare$3(a, b, loose) <= 0;
var lte_1 = lte$3;
const eq$1 = eq_1;
const neq$1 = neq_1;
const gt$3 = gt_1;
const gte$2 = gte_1;
const lt$2 = lt_1;
const lte$2 = lte_1;
const cmp$1 = (a, op, b, loose) => {
  switch (op) {
    case "===":
      if (typeof a === "object") {
        a = a.version;
      }
      if (typeof b === "object") {
        b = b.version;
      }
      return a === b;
    case "!==":
      if (typeof a === "object") {
        a = a.version;
      }
      if (typeof b === "object") {
        b = b.version;
      }
      return a !== b;
    case "":
    case "=":
    case "==":
      return eq$1(a, b, loose);
    case "!=":
      return neq$1(a, b, loose);
    case ">":
      return gt$3(a, b, loose);
    case ">=":
      return gte$2(a, b, loose);
    case "<":
      return lt$2(a, b, loose);
    case "<=":
      return lte$2(a, b, loose);
    default:
      throw new TypeError(`Invalid operator: ${op}`);
  }
};
var cmp_1 = cmp$1;
const SemVer$5 = semver$2;
const parse$2 = parse_1;
const { safeRe: re, t } = reExports;
const coerce$1 = (version2, options) => {
  if (version2 instanceof SemVer$5) {
    return version2;
  }
  if (typeof version2 === "number") {
    version2 = String(version2);
  }
  if (typeof version2 !== "string") {
    return null;
  }
  options = options || {};
  let match = null;
  if (!options.rtl) {
    match = version2.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
  } else {
    const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
    let next;
    while ((next = coerceRtlRegex.exec(version2)) && (!match || match.index + match[0].length !== version2.length)) {
      if (!match || next.index + next[0].length !== match.index + match[0].length) {
        match = next;
      }
      coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
    }
    coerceRtlRegex.lastIndex = -1;
  }
  if (match === null) {
    return null;
  }
  const major2 = match[2];
  const minor2 = match[3] || "0";
  const patch2 = match[4] || "0";
  const prerelease2 = options.includePrerelease && match[5] ? `-${match[5]}` : "";
  const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
  return parse$2(`${major2}.${minor2}.${patch2}${prerelease2}${build}`, options);
};
var coerce_1 = coerce$1;
class LRUCache {
  constructor() {
    this.max = 1e3;
    this.map = /* @__PURE__ */ new Map();
  }
  get(key) {
    const value = this.map.get(key);
    if (value === void 0) {
      return void 0;
    } else {
      this.map.delete(key);
      this.map.set(key, value);
      return value;
    }
  }
  delete(key) {
    return this.map.delete(key);
  }
  set(key, value) {
    const deleted = this.delete(key);
    if (!deleted && value !== void 0) {
      if (this.map.size >= this.max) {
        const firstKey = this.map.keys().next().value;
        this.delete(firstKey);
      }
      this.map.set(key, value);
    }
    return this;
  }
}
var lrucache = LRUCache;
var range;
var hasRequiredRange;
function requireRange() {
  if (hasRequiredRange) return range;
  hasRequiredRange = 1;
  const SPACE_CHARACTERS = /\s+/g;
  class Range2 {
    constructor(range2, options) {
      options = parseOptions2(options);
      if (range2 instanceof Range2) {
        if (range2.loose === !!options.loose && range2.includePrerelease === !!options.includePrerelease) {
          return range2;
        } else {
          return new Range2(range2.raw, options);
        }
      }
      if (range2 instanceof Comparator2) {
        this.raw = range2.value;
        this.set = [[range2]];
        this.formatted = void 0;
        return this;
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range2.trim().replace(SPACE_CHARACTERS, " ");
      this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
      if (!this.set.length) {
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      }
      if (this.set.length > 1) {
        const first = this.set[0];
        this.set = this.set.filter((c) => !isNullSet(c[0]));
        if (this.set.length === 0) {
          this.set = [first];
        } else if (this.set.length > 1) {
          for (const c of this.set) {
            if (c.length === 1 && isAny(c[0])) {
              this.set = [c];
              break;
            }
          }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let i = 0; i < this.set.length; i++) {
          if (i > 0) {
            this.formatted += "||";
          }
          const comps = this.set[i];
          for (let k = 0; k < comps.length; k++) {
            if (k > 0) {
              this.formatted += " ";
            }
            this.formatted += comps[k].toString().trim();
          }
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(range2) {
      const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
      const memoKey = memoOpts + ":" + range2;
      const cached = cache.get(memoKey);
      if (cached) {
        return cached;
      }
      const loose = this.options.loose;
      const hr = loose ? re2[t2.HYPHENRANGELOOSE] : re2[t2.HYPHENRANGE];
      range2 = range2.replace(hr, hyphenReplace(this.options.includePrerelease));
      debug2("hyphen replace", range2);
      range2 = range2.replace(re2[t2.COMPARATORTRIM], comparatorTrimReplace);
      debug2("comparator trim", range2);
      range2 = range2.replace(re2[t2.TILDETRIM], tildeTrimReplace);
      debug2("tilde trim", range2);
      range2 = range2.replace(re2[t2.CARETTRIM], caretTrimReplace);
      debug2("caret trim", range2);
      let rangeList = range2.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
      if (loose) {
        rangeList = rangeList.filter((comp) => {
          debug2("loose invalid filter", comp, this.options);
          return !!comp.match(re2[t2.COMPARATORLOOSE]);
        });
      }
      debug2("range list", rangeList);
      const rangeMap = /* @__PURE__ */ new Map();
      const comparators = rangeList.map((comp) => new Comparator2(comp, this.options));
      for (const comp of comparators) {
        if (isNullSet(comp)) {
          return [comp];
        }
        rangeMap.set(comp.value, comp);
      }
      if (rangeMap.size > 1 && rangeMap.has("")) {
        rangeMap.delete("");
      }
      const result = [...rangeMap.values()];
      cache.set(memoKey, result);
      return result;
    }
    intersects(range2, options) {
      if (!(range2 instanceof Range2)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some((thisComparators) => {
        return isSatisfiable(thisComparators, options) && range2.set.some((rangeComparators) => {
          return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
            return rangeComparators.every((rangeComparator) => {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version2) {
      if (!version2) {
        return false;
      }
      if (typeof version2 === "string") {
        try {
          version2 = new SemVer3(version2, this.options);
        } catch (er) {
          return false;
        }
      }
      for (let i = 0; i < this.set.length; i++) {
        if (testSet(this.set[i], version2, this.options)) {
          return true;
        }
      }
      return false;
    }
  }
  range = Range2;
  const LRU = lrucache;
  const cache = new LRU();
  const parseOptions2 = parseOptions_1;
  const Comparator2 = requireComparator();
  const debug2 = debug_1;
  const SemVer3 = semver$2;
  const {
    safeRe: re2,
    t: t2,
    comparatorTrimReplace,
    tildeTrimReplace,
    caretTrimReplace
  } = reExports;
  const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = constants$1;
  const isNullSet = (c) => c.value === "<0.0.0-0";
  const isAny = (c) => c.value === "";
  const isSatisfiable = (comparators, options) => {
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while (result && remainingComparators.length) {
      result = remainingComparators.every((otherComparator) => {
        return testComparator.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }
    return result;
  };
  const parseComparator = (comp, options) => {
    debug2("comp", comp, options);
    comp = replaceCarets(comp, options);
    debug2("caret", comp);
    comp = replaceTildes(comp, options);
    debug2("tildes", comp);
    comp = replaceXRanges(comp, options);
    debug2("xrange", comp);
    comp = replaceStars(comp, options);
    debug2("stars", comp);
    return comp;
  };
  const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
  const replaceTildes = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
  };
  const replaceTilde = (comp, options) => {
    const r = options.loose ? re2[t2.TILDELOOSE] : re2[t2.TILDE];
    return comp.replace(r, (_, M, m, p, pr) => {
      debug2("tilde", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
      } else if (pr) {
        debug2("replaceTilde pr", pr);
        ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
      }
      debug2("tilde return", ret);
      return ret;
    });
  };
  const replaceCarets = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
  };
  const replaceCaret = (comp, options) => {
    debug2("caret", comp, options);
    const r = options.loose ? re2[t2.CARETLOOSE] : re2[t2.CARET];
    const z = options.includePrerelease ? "-0" : "";
    return comp.replace(r, (_, M, m, p, pr) => {
      debug2("caret", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        if (M === "0") {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
        }
      } else if (pr) {
        debug2("replaceCaret pr", pr);
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
        }
      } else {
        debug2("no pr");
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
        }
      }
      debug2("caret return", ret);
      return ret;
    });
  };
  const replaceXRanges = (comp, options) => {
    debug2("replaceXRanges", comp, options);
    return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
  };
  const replaceXRange = (comp, options) => {
    comp = comp.trim();
    const r = options.loose ? re2[t2.XRANGELOOSE] : re2[t2.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
      debug2("xRange", comp, ret, gtlt, M, m, p, pr);
      const xM = isX(M);
      const xm = xM || isX(m);
      const xp = xm || isX(p);
      const anyX = xp;
      if (gtlt === "=" && anyX) {
        gtlt = "";
      }
      pr = options.includePrerelease ? "-0" : "";
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          ret = "<0.0.0-0";
        } else {
          ret = "*";
        }
      } else if (gtlt && anyX) {
        if (xm) {
          m = 0;
        }
        p = 0;
        if (gtlt === ">") {
          gtlt = ">=";
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === "<=") {
          gtlt = "<";
          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }
        if (gtlt === "<") {
          pr = "-0";
        }
        ret = `${gtlt + M}.${m}.${p}${pr}`;
      } else if (xm) {
        ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
      } else if (xp) {
        ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
      }
      debug2("xRange return", ret);
      return ret;
    });
  };
  const replaceStars = (comp, options) => {
    debug2("replaceStars", comp, options);
    return comp.trim().replace(re2[t2.STAR], "");
  };
  const replaceGTE0 = (comp, options) => {
    debug2("replaceGTE0", comp, options);
    return comp.trim().replace(re2[options.includePrerelease ? t2.GTE0PRE : t2.GTE0], "");
  };
  const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
    if (isX(fM)) {
      from = "";
    } else if (isX(fm)) {
      from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
    } else if (isX(fp)) {
      from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
    } else if (fpr) {
      from = `>=${from}`;
    } else {
      from = `>=${from}${incPr ? "-0" : ""}`;
    }
    if (isX(tM)) {
      to = "";
    } else if (isX(tm)) {
      to = `<${+tM + 1}.0.0-0`;
    } else if (isX(tp)) {
      to = `<${tM}.${+tm + 1}.0-0`;
    } else if (tpr) {
      to = `<=${tM}.${tm}.${tp}-${tpr}`;
    } else if (incPr) {
      to = `<${tM}.${tm}.${+tp + 1}-0`;
    } else {
      to = `<=${to}`;
    }
    return `${from} ${to}`.trim();
  };
  const testSet = (set2, version2, options) => {
    for (let i = 0; i < set2.length; i++) {
      if (!set2[i].test(version2)) {
        return false;
      }
    }
    if (version2.prerelease.length && !options.includePrerelease) {
      for (let i = 0; i < set2.length; i++) {
        debug2(set2[i].semver);
        if (set2[i].semver === Comparator2.ANY) {
          continue;
        }
        if (set2[i].semver.prerelease.length > 0) {
          const allowed = set2[i].semver;
          if (allowed.major === version2.major && allowed.minor === version2.minor && allowed.patch === version2.patch) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  };
  return range;
}
var comparator;
var hasRequiredComparator;
function requireComparator() {
  if (hasRequiredComparator) return comparator;
  hasRequiredComparator = 1;
  const ANY2 = Symbol("SemVer ANY");
  class Comparator2 {
    static get ANY() {
      return ANY2;
    }
    constructor(comp, options) {
      options = parseOptions2(options);
      if (comp instanceof Comparator2) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      comp = comp.trim().split(/\s+/).join(" ");
      debug2("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY2) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug2("comp", this);
    }
    parse(comp) {
      const r = this.options.loose ? re2[t2.COMPARATORLOOSE] : re2[t2.COMPARATOR];
      const m = comp.match(r);
      if (!m) {
        throw new TypeError(`Invalid comparator: ${comp}`);
      }
      this.operator = m[1] !== void 0 ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY2;
      } else {
        this.semver = new SemVer3(m[2], this.options.loose);
      }
    }
    toString() {
      return this.value;
    }
    test(version2) {
      debug2("Comparator.test", version2, this.options.loose);
      if (this.semver === ANY2 || version2 === ANY2) {
        return true;
      }
      if (typeof version2 === "string") {
        try {
          version2 = new SemVer3(version2, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp2(version2, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
      if (!(comp instanceof Comparator2)) {
        throw new TypeError("a Comparator is required");
      }
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        return new Range2(comp.value, options).test(this.value);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        return new Range2(this.value, options).test(comp.semver);
      }
      options = parseOptions2(options);
      if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
        return false;
      }
      if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
        return false;
      }
      if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
        return true;
      }
      if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
        return true;
      }
      if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
        return true;
      }
      if (cmp2(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
        return true;
      }
      if (cmp2(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
        return true;
      }
      return false;
    }
  }
  comparator = Comparator2;
  const parseOptions2 = parseOptions_1;
  const { safeRe: re2, t: t2 } = reExports;
  const cmp2 = cmp_1;
  const debug2 = debug_1;
  const SemVer3 = semver$2;
  const Range2 = requireRange();
  return comparator;
}
const Range$9 = requireRange();
const satisfies$4 = (version2, range2, options) => {
  try {
    range2 = new Range$9(range2, options);
  } catch (er) {
    return false;
  }
  return range2.test(version2);
};
var satisfies_1 = satisfies$4;
const Range$8 = requireRange();
const toComparators$1 = (range2, options) => new Range$8(range2, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
var toComparators_1 = toComparators$1;
const SemVer$4 = semver$2;
const Range$7 = requireRange();
const maxSatisfying$1 = (versions, range2, options) => {
  let max2 = null;
  let maxSV = null;
  let rangeObj = null;
  try {
    rangeObj = new Range$7(range2, options);
  } catch (er) {
    return null;
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      if (!max2 || maxSV.compare(v) === -1) {
        max2 = v;
        maxSV = new SemVer$4(max2, options);
      }
    }
  });
  return max2;
};
var maxSatisfying_1 = maxSatisfying$1;
const SemVer$3 = semver$2;
const Range$6 = requireRange();
const minSatisfying$1 = (versions, range2, options) => {
  let min2 = null;
  let minSV = null;
  let rangeObj = null;
  try {
    rangeObj = new Range$6(range2, options);
  } catch (er) {
    return null;
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      if (!min2 || minSV.compare(v) === 1) {
        min2 = v;
        minSV = new SemVer$3(min2, options);
      }
    }
  });
  return min2;
};
var minSatisfying_1 = minSatisfying$1;
const SemVer$2 = semver$2;
const Range$5 = requireRange();
const gt$2 = gt_1;
const minVersion$1 = (range2, loose) => {
  range2 = new Range$5(range2, loose);
  let minver = new SemVer$2("0.0.0");
  if (range2.test(minver)) {
    return minver;
  }
  minver = new SemVer$2("0.0.0-0");
  if (range2.test(minver)) {
    return minver;
  }
  minver = null;
  for (let i = 0; i < range2.set.length; ++i) {
    const comparators = range2.set[i];
    let setMin = null;
    comparators.forEach((comparator2) => {
      const compver = new SemVer$2(comparator2.semver.version);
      switch (comparator2.operator) {
        case ">":
          if (compver.prerelease.length === 0) {
            compver.patch++;
          } else {
            compver.prerelease.push(0);
          }
          compver.raw = compver.format();
        case "":
        case ">=":
          if (!setMin || gt$2(compver, setMin)) {
            setMin = compver;
          }
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${comparator2.operator}`);
      }
    });
    if (setMin && (!minver || gt$2(minver, setMin))) {
      minver = setMin;
    }
  }
  if (minver && range2.test(minver)) {
    return minver;
  }
  return null;
};
var minVersion_1 = minVersion$1;
const Range$4 = requireRange();
const validRange$1 = (range2, options) => {
  try {
    return new Range$4(range2, options).range || "*";
  } catch (er) {
    return null;
  }
};
var valid$1 = validRange$1;
const SemVer$1 = semver$2;
const Comparator$2 = requireComparator();
const { ANY: ANY$1 } = Comparator$2;
const Range$3 = requireRange();
const satisfies$3 = satisfies_1;
const gt$1 = gt_1;
const lt$1 = lt_1;
const lte$1 = lte_1;
const gte$1 = gte_1;
const outside$3 = (version2, range2, hilo, options) => {
  version2 = new SemVer$1(version2, options);
  range2 = new Range$3(range2, options);
  let gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case ">":
      gtfn = gt$1;
      ltefn = lte$1;
      ltfn = lt$1;
      comp = ">";
      ecomp = ">=";
      break;
    case "<":
      gtfn = lt$1;
      ltefn = gte$1;
      ltfn = gt$1;
      comp = "<";
      ecomp = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (satisfies$3(version2, range2, options)) {
    return false;
  }
  for (let i = 0; i < range2.set.length; ++i) {
    const comparators = range2.set[i];
    let high = null;
    let low = null;
    comparators.forEach((comparator2) => {
      if (comparator2.semver === ANY$1) {
        comparator2 = new Comparator$2(">=0.0.0");
      }
      high = high || comparator2;
      low = low || comparator2;
      if (gtfn(comparator2.semver, high.semver, options)) {
        high = comparator2;
      } else if (ltfn(comparator2.semver, low.semver, options)) {
        low = comparator2;
      }
    });
    if (high.operator === comp || high.operator === ecomp) {
      return false;
    }
    if ((!low.operator || low.operator === comp) && ltefn(version2, low.semver)) {
      return false;
    } else if (low.operator === ecomp && ltfn(version2, low.semver)) {
      return false;
    }
  }
  return true;
};
var outside_1 = outside$3;
const outside$2 = outside_1;
const gtr$1 = (version2, range2, options) => outside$2(version2, range2, ">", options);
var gtr_1 = gtr$1;
const outside$1 = outside_1;
const ltr$1 = (version2, range2, options) => outside$1(version2, range2, "<", options);
var ltr_1 = ltr$1;
const Range$2 = requireRange();
const intersects$1 = (r1, r2, options) => {
  r1 = new Range$2(r1, options);
  r2 = new Range$2(r2, options);
  return r1.intersects(r2, options);
};
var intersects_1 = intersects$1;
const satisfies$2 = satisfies_1;
const compare$2 = compare_1;
var simplify = (versions, range2, options) => {
  const set2 = [];
  let first = null;
  let prev = null;
  const v = versions.sort((a, b) => compare$2(a, b, options));
  for (const version2 of v) {
    const included = satisfies$2(version2, range2, options);
    if (included) {
      prev = version2;
      if (!first) {
        first = version2;
      }
    } else {
      if (prev) {
        set2.push([first, prev]);
      }
      prev = null;
      first = null;
    }
  }
  if (first) {
    set2.push([first, null]);
  }
  const ranges = [];
  for (const [min2, max2] of set2) {
    if (min2 === max2) {
      ranges.push(min2);
    } else if (!max2 && min2 === v[0]) {
      ranges.push("*");
    } else if (!max2) {
      ranges.push(`>=${min2}`);
    } else if (min2 === v[0]) {
      ranges.push(`<=${max2}`);
    } else {
      ranges.push(`${min2} - ${max2}`);
    }
  }
  const simplified = ranges.join(" || ");
  const original = typeof range2.raw === "string" ? range2.raw : String(range2);
  return simplified.length < original.length ? simplified : range2;
};
const Range$1 = requireRange();
const Comparator$1 = requireComparator();
const { ANY } = Comparator$1;
const satisfies$1 = satisfies_1;
const compare$1 = compare_1;
const subset$1 = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true;
  }
  sub = new Range$1(sub, options);
  dom = new Range$1(dom, options);
  let sawNonNull = false;
  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options);
      sawNonNull = sawNonNull || isSub !== null;
      if (isSub) {
        continue OUTER;
      }
    }
    if (sawNonNull) {
      return false;
    }
  }
  return true;
};
const minimumVersionWithPreRelease = [new Comparator$1(">=0.0.0-0")];
const minimumVersion = [new Comparator$1(">=0.0.0")];
const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true;
  }
  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true;
    } else if (options.includePrerelease) {
      sub = minimumVersionWithPreRelease;
    } else {
      sub = minimumVersion;
    }
  }
  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true;
    } else {
      dom = minimumVersion;
    }
  }
  const eqSet = /* @__PURE__ */ new Set();
  let gt2, lt2;
  for (const c of sub) {
    if (c.operator === ">" || c.operator === ">=") {
      gt2 = higherGT(gt2, c, options);
    } else if (c.operator === "<" || c.operator === "<=") {
      lt2 = lowerLT(lt2, c, options);
    } else {
      eqSet.add(c.semver);
    }
  }
  if (eqSet.size > 1) {
    return null;
  }
  let gtltComp;
  if (gt2 && lt2) {
    gtltComp = compare$1(gt2.semver, lt2.semver, options);
    if (gtltComp > 0) {
      return null;
    } else if (gtltComp === 0 && (gt2.operator !== ">=" || lt2.operator !== "<=")) {
      return null;
    }
  }
  for (const eq2 of eqSet) {
    if (gt2 && !satisfies$1(eq2, String(gt2), options)) {
      return null;
    }
    if (lt2 && !satisfies$1(eq2, String(lt2), options)) {
      return null;
    }
    for (const c of dom) {
      if (!satisfies$1(eq2, String(c), options)) {
        return false;
      }
    }
    return true;
  }
  let higher, lower;
  let hasDomLT, hasDomGT;
  let needDomLTPre = lt2 && !options.includePrerelease && lt2.semver.prerelease.length ? lt2.semver : false;
  let needDomGTPre = gt2 && !options.includePrerelease && gt2.semver.prerelease.length ? gt2.semver : false;
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt2.operator === "<" && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false;
  }
  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
    hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
    if (gt2) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false;
        }
      }
      if (c.operator === ">" || c.operator === ">=") {
        higher = higherGT(gt2, c, options);
        if (higher === c && higher !== gt2) {
          return false;
        }
      } else if (gt2.operator === ">=" && !satisfies$1(gt2.semver, String(c), options)) {
        return false;
      }
    }
    if (lt2) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false;
        }
      }
      if (c.operator === "<" || c.operator === "<=") {
        lower = lowerLT(lt2, c, options);
        if (lower === c && lower !== lt2) {
          return false;
        }
      } else if (lt2.operator === "<=" && !satisfies$1(lt2.semver, String(c), options)) {
        return false;
      }
    }
    if (!c.operator && (lt2 || gt2) && gtltComp !== 0) {
      return false;
    }
  }
  if (gt2 && hasDomLT && !lt2 && gtltComp !== 0) {
    return false;
  }
  if (lt2 && hasDomGT && !gt2 && gtltComp !== 0) {
    return false;
  }
  if (needDomGTPre || needDomLTPre) {
    return false;
  }
  return true;
};
const higherGT = (a, b, options) => {
  if (!a) {
    return b;
  }
  const comp = compare$1(a.semver, b.semver, options);
  return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
};
const lowerLT = (a, b, options) => {
  if (!a) {
    return b;
  }
  const comp = compare$1(a.semver, b.semver, options);
  return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
};
var subset_1 = subset$1;
const internalRe = reExports;
const constants = constants$1;
const SemVer2 = semver$2;
const identifiers = identifiers$1;
const parse$1 = parse_1;
const valid = valid_1;
const clean = clean_1;
const inc = inc_1;
const diff = diff_1;
const major = major_1;
const minor = minor_1;
const patch = patch_1;
const prerelease = prerelease_1;
const compare = compare_1;
const rcompare = rcompare_1;
const compareLoose = compareLoose_1;
const compareBuild = compareBuild_1;
const sort = sort_1;
const rsort = rsort_1;
const gt = gt_1;
const lt = lt_1;
const eq = eq_1;
const neq = neq_1;
const gte = gte_1;
const lte = lte_1;
const cmp = cmp_1;
const coerce = coerce_1;
const Comparator = requireComparator();
const Range = requireRange();
const satisfies = satisfies_1;
const toComparators = toComparators_1;
const maxSatisfying = maxSatisfying_1;
const minSatisfying = minSatisfying_1;
const minVersion = minVersion_1;
const validRange = valid$1;
const outside = outside_1;
const gtr = gtr_1;
const ltr = ltr_1;
const intersects = intersects_1;
const simplifyRange = simplify;
const subset = subset_1;
var semver$1 = {
  parse: parse$1,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer: SemVer2,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: constants.RELEASE_TYPES,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers
};
var DownloadedUpdateHelper$1 = {};
var lodash_isequal = { exports: {} };
lodash_isequal.exports;
(function(module2, exports2) {
  var LARGE_ARRAY_SIZE = 200;
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  var MAX_SAFE_INTEGER2 = 9007199254740991;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag2 = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var reRegExpChar2 = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  var freeGlobal2 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf2 = typeof self == "object" && self && self.Object === Object && self;
  var root2 = freeGlobal2 || freeSelf2 || Function("return this")();
  var freeExports = exports2 && !exports2.nodeType && exports2;
  var freeModule = freeExports && true && module2 && !module2.nodeType && module2;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal2.process;
  var nodeUtil = function() {
    try {
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  function cacheHas(cache, key) {
    return cache.has(key);
  }
  function getValue(object2, key) {
    return object2 == null ? void 0 : object2[key];
  }
  function mapToArray(map2) {
    var index = -1, result = Array(map2.size);
    map2.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  function setToArray(set2) {
    var index = -1, result = Array(set2.size);
    set2.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto2 = Object.prototype;
  var coreJsData = root2["__core-js_shared__"];
  var funcToString = funcProto.toString;
  var hasOwnProperty2 = objectProto2.hasOwnProperty;
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var nativeObjectToString = objectProto2.toString;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty2).replace(reRegExpChar2, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  var Buffer2 = moduleExports ? root2.Buffer : void 0, Symbol2 = root2.Symbol, Uint8Array2 = root2.Uint8Array, propertyIsEnumerable = objectProto2.propertyIsEnumerable, splice = arrayProto.splice, symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
  var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0, nativeKeys = overArg(Object.keys, Object);
  var DataView2 = getNative(root2, "DataView"), Map2 = getNative(root2, "Map"), Promise2 = getNative(root2, "Promise"), Set2 = getNative(root2, "Set"), WeakMap2 = getNative(root2, "WeakMap"), nativeCreate = getNative(Object, "create");
  var dataViewCtorString = toSource(DataView2), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap2);
  var symbolProto2 = Symbol2 ? Symbol2.prototype : void 0, symbolValueOf = symbolProto2 ? symbolProto2.valueOf : void 0;
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty2.call(data, key) ? data[key] : void 0;
  }
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty2.call(data, key);
  }
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map2 || ListCache)(),
      "string": new Hash()
    };
  }
  function mapCacheDelete(key) {
    var result = getMapData(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }
  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  function stackGet(key) {
    return this.__data__.get(key);
  }
  function stackHas(key) {
    return this.__data__.has(key);
  }
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs2 = data.__data__;
      if (!Map2 || pairs2.length < LARGE_ARRAY_SIZE - 1) {
        pairs2.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs2);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray2(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer2(value), isType = !isArr && !isArg && !isBuff && isTypedArray2(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key in value) {
      if (hasOwnProperty2.call(value, key) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
      isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq2(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  function baseGetAllKeys(object2, keysFunc, symbolsFunc) {
    var result = keysFunc(object2);
    return isArray2(object2) ? result : arrayPush(result, symbolsFunc(object2));
  }
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString2(value);
  }
  function baseIsArguments(value) {
    return isObjectLike2(value) && baseGetTag(value) == argsTag;
  }
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike2(value) && !isObjectLike2(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  function baseIsEqualDeep(object2, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray2(object2), othIsArr = isArray2(other), objTag = objIsArr ? arrayTag : getTag(object2), othTag = othIsArr ? arrayTag : getTag(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer2(object2)) {
      if (!isBuffer2(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray2(object2) ? equalArrays(object2, other, bitmask, customizer, equalFunc, stack) : equalByTag(object2, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty2.call(object2, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty2.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object2.value() : object2, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object2, other, bitmask, customizer, equalFunc, stack);
  }
  function baseIsNative(value) {
    if (!isObject2(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction2(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function baseIsTypedArray(value) {
    return isObjectLike2(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  function baseKeys(object2) {
    if (!isPrototype(object2)) {
      return nativeKeys(object2);
    }
    var result = [];
    for (var key in Object(object2)) {
      if (hasOwnProperty2.call(object2, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  function equalByTag(object2, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object2.byteLength != other.byteLength || object2.byteOffset != other.byteOffset) {
          return false;
        }
        object2 = object2.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object2.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object2), new Uint8Array2(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq2(+object2, +other);
      case errorTag:
        return object2.name == other.name && object2.message == other.message;
      case regexpTag:
      case stringTag:
        return object2 == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
        convert || (convert = setToArray);
        if (object2.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object2);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG;
        stack.set(object2, other);
        var result = equalArrays(convert(object2), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object2);
        return result;
      case symbolTag2:
        if (symbolValueOf) {
          return symbolValueOf.call(object2) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  function equalObjects(object2, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object2), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty2.call(other, key))) {
        return false;
      }
    }
    var stacked = stack.get(object2);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object2, other);
    stack.set(other, object2);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object2[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object2, stack) : customizer(objValue, othValue, key, object2, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object2.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object2 && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object2);
    stack["delete"](other);
    return result;
  }
  function getAllKeys(object2) {
    return baseGetAllKeys(object2, keys, getSymbols);
  }
  function getMapData(map2, key) {
    var data = map2.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function getNative(object2, key) {
    var value = getValue(object2, key);
    return baseIsNative(value) ? value : void 0;
  }
  function getRawTag(value) {
    var isOwn = hasOwnProperty2.call(value, symToStringTag), tag = value[symToStringTag];
    try {
      value[symToStringTag] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  var getSymbols = !nativeGetSymbols ? stubArray : function(object2) {
    if (object2 == null) {
      return [];
    }
    object2 = Object(object2);
    return arrayFilter(nativeGetSymbols(object2), function(symbol) {
      return propertyIsEnumerable.call(object2, symbol);
    });
  };
  var getTag = baseGetTag;
  if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
    getTag = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER2 : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function isKeyable(value) {
    var type2 = typeof value;
    return type2 == "string" || type2 == "number" || type2 == "symbol" || type2 == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto2;
    return value === proto;
  }
  function objectToString2(value) {
    return nativeObjectToString.call(value);
  }
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  function eq2(value, other) {
    return value === other || value !== value && other !== other;
  }
  var isArguments = baseIsArguments(/* @__PURE__ */ function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike2(value) && hasOwnProperty2.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
  };
  var isArray2 = Array.isArray;
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction2(value);
  }
  var isBuffer2 = nativeIsBuffer || stubFalse;
  function isEqual2(value, other) {
    return baseIsEqual(value, other);
  }
  function isFunction2(value) {
    if (!isObject2(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
  }
  function isObject2(value) {
    var type2 = typeof value;
    return value != null && (type2 == "object" || type2 == "function");
  }
  function isObjectLike2(value) {
    return value != null && typeof value == "object";
  }
  var isTypedArray2 = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  function keys(object2) {
    return isArrayLike(object2) ? arrayLikeKeys(object2) : baseKeys(object2);
  }
  function stubArray() {
    return [];
  }
  function stubFalse() {
    return false;
  }
  module2.exports = isEqual2;
})(lodash_isequal, lodash_isequal.exports);
var lodash_isequalExports = lodash_isequal.exports;
Object.defineProperty(DownloadedUpdateHelper$1, "__esModule", { value: true });
DownloadedUpdateHelper$1.DownloadedUpdateHelper = void 0;
DownloadedUpdateHelper$1.createTempUpdateFile = createTempUpdateFile;
const crypto_1 = require$$0$2;
const fs_1$2 = require$$1$2;
const isEqual = lodash_isequalExports;
const fs_extra_1$2 = lib;
const path$5 = require$$1$1;
class DownloadedUpdateHelper {
  constructor(cacheDir) {
    this.cacheDir = cacheDir;
    this._file = null;
    this._packageFile = null;
    this.versionInfo = null;
    this.fileInfo = null;
    this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return path$5.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(updateFile, updateInfo, fileInfo, logger) {
    if (this.versionInfo != null && this.file === updateFile && this.fileInfo != null) {
      if (isEqual(this.versionInfo, updateInfo) && isEqual(this.fileInfo.info, fileInfo.info) && await (0, fs_extra_1$2.pathExists)(updateFile)) {
        return updateFile;
      } else {
        return null;
      }
    }
    const cachedUpdateFile = await this.getValidCachedUpdateFile(fileInfo, logger);
    if (cachedUpdateFile === null) {
      return null;
    }
    logger.info(`Update has already been downloaded to ${updateFile}).`);
    this._file = cachedUpdateFile;
    return cachedUpdateFile;
  }
  async setDownloadedFile(downloadedFile, packageFile, versionInfo, fileInfo, updateFileName, isSaveCache) {
    this._file = downloadedFile;
    this._packageFile = packageFile;
    this.versionInfo = versionInfo;
    this.fileInfo = fileInfo;
    this._downloadedFileInfo = {
      fileName: updateFileName,
      sha512: fileInfo.info.sha512,
      isAdminRightsRequired: fileInfo.info.isAdminRightsRequired === true
    };
    if (isSaveCache) {
      await (0, fs_extra_1$2.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
    }
  }
  async clear() {
    this._file = null;
    this._packageFile = null;
    this.versionInfo = null;
    this.fileInfo = null;
    await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, fs_extra_1$2.emptyDir)(this.cacheDirForPendingUpdate);
    } catch (_ignore) {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(fileInfo, logger) {
    const updateInfoFilePath = this.getUpdateInfoFile();
    const doesUpdateInfoFileExist = await (0, fs_extra_1$2.pathExists)(updateInfoFilePath);
    if (!doesUpdateInfoFileExist) {
      return null;
    }
    let cachedInfo;
    try {
      cachedInfo = await (0, fs_extra_1$2.readJson)(updateInfoFilePath);
    } catch (error2) {
      let message = `No cached update info available`;
      if (error2.code !== "ENOENT") {
        await this.cleanCacheDirForPendingUpdate();
        message += ` (error on read: ${error2.message})`;
      }
      logger.info(message);
      return null;
    }
    const isCachedInfoFileNameValid = (cachedInfo === null || cachedInfo === void 0 ? void 0 : cachedInfo.fileName) !== null;
    if (!isCachedInfoFileNameValid) {
      logger.warn(`Cached update info is corrupted: no fileName, directory for cached update will be cleaned`);
      await this.cleanCacheDirForPendingUpdate();
      return null;
    }
    if (fileInfo.info.sha512 !== cachedInfo.sha512) {
      logger.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${cachedInfo.sha512}, expected: ${fileInfo.info.sha512}. Directory for cached update will be cleaned`);
      await this.cleanCacheDirForPendingUpdate();
      return null;
    }
    const updateFile = path$5.join(this.cacheDirForPendingUpdate, cachedInfo.fileName);
    if (!await (0, fs_extra_1$2.pathExists)(updateFile)) {
      logger.info("Cached update file doesn't exist");
      return null;
    }
    const sha512 = await hashFile(updateFile);
    if (fileInfo.info.sha512 !== sha512) {
      logger.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${sha512}, expected: ${fileInfo.info.sha512}`);
      await this.cleanCacheDirForPendingUpdate();
      return null;
    }
    this._downloadedFileInfo = cachedInfo;
    return updateFile;
  }
  getUpdateInfoFile() {
    return path$5.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
DownloadedUpdateHelper$1.DownloadedUpdateHelper = DownloadedUpdateHelper;
function hashFile(file2, algorithm = "sha512", encoding = "base64", options) {
  return new Promise((resolve, reject) => {
    const hash = (0, crypto_1.createHash)(algorithm);
    hash.on("error", reject).setEncoding(encoding);
    (0, fs_1$2.createReadStream)(file2, {
      ...options,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", reject).on("end", () => {
      hash.end();
      resolve(hash.read());
    }).pipe(hash, { end: false });
  });
}
async function createTempUpdateFile(name, cacheDir, log2) {
  let nameCounter = 0;
  let result = path$5.join(cacheDir, name);
  for (let i = 0; i < 3; i++) {
    try {
      await (0, fs_extra_1$2.unlink)(result);
      return result;
    } catch (e) {
      if (e.code === "ENOENT") {
        return result;
      }
      log2.warn(`Error on remove temp update file: ${e}`);
      result = path$5.join(cacheDir, `${nameCounter++}-${name}`);
    }
  }
  return result;
}
var ElectronAppAdapter$1 = {};
var AppAdapter = {};
Object.defineProperty(AppAdapter, "__esModule", { value: true });
AppAdapter.getAppCacheDir = getAppCacheDir;
const path$4 = require$$1$1;
const os_1 = require$$1$3;
function getAppCacheDir() {
  const homedir = (0, os_1.homedir)();
  let result;
  if (process.platform === "win32") {
    result = process.env["LOCALAPPDATA"] || path$4.join(homedir, "AppData", "Local");
  } else if (process.platform === "darwin") {
    result = path$4.join(homedir, "Library", "Caches");
  } else {
    result = process.env["XDG_CACHE_HOME"] || path$4.join(homedir, ".cache");
  }
  return result;
}
Object.defineProperty(ElectronAppAdapter$1, "__esModule", { value: true });
ElectronAppAdapter$1.ElectronAppAdapter = void 0;
const path$3 = require$$1$1;
const AppAdapter_1 = AppAdapter;
class ElectronAppAdapter {
  constructor(app = require$$1$4.app) {
    this.app = app;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === true;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? path$3.join(process.resourcesPath, "app-update.yml") : path$3.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, AppAdapter_1.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(handler) {
    this.app.once("quit", (_, exitCode) => handler(exitCode));
  }
}
ElectronAppAdapter$1.ElectronAppAdapter = ElectronAppAdapter;
var electronHttpExecutor = {};
(function(exports2) {
  Object.defineProperty(exports2, "__esModule", { value: true });
  exports2.ElectronHttpExecutor = exports2.NET_SESSION_NAME = void 0;
  exports2.getNetSession = getNetSession;
  const builder_util_runtime_12 = out;
  exports2.NET_SESSION_NAME = "electron-updater";
  function getNetSession() {
    return require$$1$4.session.fromPartition(exports2.NET_SESSION_NAME, {
      cache: false
    });
  }
  class ElectronHttpExecutor extends builder_util_runtime_12.HttpExecutor {
    constructor(proxyLoginCallback) {
      super();
      this.proxyLoginCallback = proxyLoginCallback;
      this.cachedSession = null;
    }
    async download(url2, destination, options) {
      return await options.cancellationToken.createPromise((resolve, reject, onCancel) => {
        const requestOptions = {
          headers: options.headers || void 0,
          redirect: "manual"
        };
        (0, builder_util_runtime_12.configureRequestUrl)(url2, requestOptions);
        (0, builder_util_runtime_12.configureRequestOptions)(requestOptions);
        this.doDownload(requestOptions, {
          destination,
          options,
          onCancel,
          callback: (error2) => {
            if (error2 == null) {
              resolve(destination);
            } else {
              reject(error2);
            }
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(options, callback) {
      if (options.headers && options.headers.Host) {
        options.host = options.headers.Host;
        delete options.headers.Host;
      }
      if (this.cachedSession == null) {
        this.cachedSession = getNetSession();
      }
      const request = require$$1$4.net.request({
        ...options,
        session: this.cachedSession
      });
      request.on("response", callback);
      if (this.proxyLoginCallback != null) {
        request.on("login", this.proxyLoginCallback);
      }
      return request;
    }
    addRedirectHandlers(request, options, reject, redirectCount, handler) {
      request.on("redirect", (statusCode, method, redirectUrl) => {
        request.abort();
        if (redirectCount > this.maxRedirects) {
          reject(this.createMaxRedirectError());
        } else {
          handler(builder_util_runtime_12.HttpExecutor.prepareRedirectUrlOptions(redirectUrl, options));
        }
      });
    }
  }
  exports2.ElectronHttpExecutor = ElectronHttpExecutor;
})(electronHttpExecutor);
var GenericProvider$1 = {};
var util = {};
var symbolTag = "[object Symbol]";
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var objectProto = Object.prototype;
var objectToString = objectProto.toString;
var Symbol$1 = root.Symbol;
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -Infinity ? "-0" : result;
}
function isObjectLike(value) {
  return !!value && typeof value == "object";
}
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
function toString3(value) {
  return value == null ? "" : baseToString(value);
}
function escapeRegExp$1(string) {
  string = toString3(string);
  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
}
var lodash_escaperegexp = escapeRegExp$1;
Object.defineProperty(util, "__esModule", { value: true });
util.newBaseUrl = newBaseUrl;
util.newUrlFromBase = newUrlFromBase;
util.getChannelFilename = getChannelFilename;
util.blockmapFiles = blockmapFiles;
const url_1$3 = require$$0$1;
const escapeRegExp = lodash_escaperegexp;
function newBaseUrl(url2) {
  const result = new url_1$3.URL(url2);
  if (!result.pathname.endsWith("/")) {
    result.pathname += "/";
  }
  return result;
}
function newUrlFromBase(pathname, baseUrl, addRandomQueryToAvoidCaching = false) {
  const result = new url_1$3.URL(pathname, baseUrl);
  const search = baseUrl.search;
  if (search != null && search.length !== 0) {
    result.search = search;
  } else if (addRandomQueryToAvoidCaching) {
    result.search = `noCache=${Date.now().toString(32)}`;
  }
  return result;
}
function getChannelFilename(channel) {
  return `${channel}.yml`;
}
function blockmapFiles(baseUrl, oldVersion, newVersion) {
  const newBlockMapUrl = newUrlFromBase(`${baseUrl.pathname}.blockmap`, baseUrl);
  const oldBlockMapUrl = newUrlFromBase(`${baseUrl.pathname.replace(new RegExp(escapeRegExp(newVersion), "g"), oldVersion)}.blockmap`, baseUrl);
  return [oldBlockMapUrl, newBlockMapUrl];
}
var Provider$1 = {};
Object.defineProperty(Provider$1, "__esModule", { value: true });
Provider$1.Provider = void 0;
Provider$1.findFile = findFile;
Provider$1.parseUpdateInfo = parseUpdateInfo;
Provider$1.getFileList = getFileList;
Provider$1.resolveFiles = resolveFiles;
const builder_util_runtime_1$a = out;
const js_yaml_1$1 = jsYaml;
const util_1$5 = util;
class Provider {
  constructor(runtimeOptions) {
    this.runtimeOptions = runtimeOptions;
    this.requestHeaders = null;
    this.executor = runtimeOptions.executor;
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== false;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const arch = process.env["TEST_UPDATER_ARCH"] || process.arch;
      const archSuffix = arch === "x64" ? "" : `-${arch}`;
      return "-linux" + archSuffix;
    } else {
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
    }
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(channel) {
    return `${channel}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(value) {
    this.requestHeaders = value;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(url2, headers, cancellationToken) {
    return this.executor.request(this.createRequestOptions(url2, headers), cancellationToken);
  }
  createRequestOptions(url2, headers) {
    const result = {};
    if (this.requestHeaders == null) {
      if (headers != null) {
        result.headers = headers;
      }
    } else {
      result.headers = headers == null ? this.requestHeaders : { ...this.requestHeaders, ...headers };
    }
    (0, builder_util_runtime_1$a.configureRequestUrl)(url2, result);
    return result;
  }
}
Provider$1.Provider = Provider;
function findFile(files, extension, not) {
  if (files.length === 0) {
    throw (0, builder_util_runtime_1$a.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  }
  const result = files.find((it) => it.url.pathname.toLowerCase().endsWith(`.${extension}`));
  if (result != null) {
    return result;
  } else if (not == null) {
    return files[0];
  } else {
    return files.find((fileInfo) => !not.some((ext) => fileInfo.url.pathname.toLowerCase().endsWith(`.${ext}`)));
  }
}
function parseUpdateInfo(rawData, channelFile, channelFileUrl) {
  if (rawData == null) {
    throw (0, builder_util_runtime_1$a.newError)(`Cannot parse update info from ${channelFile} in the latest release artifacts (${channelFileUrl}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  let result;
  try {
    result = (0, js_yaml_1$1.load)(rawData);
  } catch (e) {
    throw (0, builder_util_runtime_1$a.newError)(`Cannot parse update info from ${channelFile} in the latest release artifacts (${channelFileUrl}): ${e.stack || e.message}, rawData: ${rawData}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return result;
}
function getFileList(updateInfo) {
  const files = updateInfo.files;
  if (files != null && files.length > 0) {
    return files;
  }
  if (updateInfo.path != null) {
    return [
      {
        url: updateInfo.path,
        sha2: updateInfo.sha2,
        sha512: updateInfo.sha512
      }
    ];
  } else {
    throw (0, builder_util_runtime_1$a.newError)(`No files provided: ${(0, builder_util_runtime_1$a.safeStringifyJson)(updateInfo)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
  }
}
function resolveFiles(updateInfo, baseUrl, pathTransformer = (p) => p) {
  const files = getFileList(updateInfo);
  const result = files.map((fileInfo) => {
    if (fileInfo.sha2 == null && fileInfo.sha512 == null) {
      throw (0, builder_util_runtime_1$a.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, builder_util_runtime_1$a.safeStringifyJson)(fileInfo)}`, "ERR_UPDATER_NO_CHECKSUM");
    }
    return {
      url: (0, util_1$5.newUrlFromBase)(pathTransformer(fileInfo.url), baseUrl),
      info: fileInfo
    };
  });
  const packages = updateInfo.packages;
  const packageInfo = packages == null ? null : packages[process.arch] || packages.ia32;
  if (packageInfo != null) {
    result[0].packageInfo = {
      ...packageInfo,
      path: (0, util_1$5.newUrlFromBase)(pathTransformer(packageInfo.path), baseUrl).href
    };
  }
  return result;
}
Object.defineProperty(GenericProvider$1, "__esModule", { value: true });
GenericProvider$1.GenericProvider = void 0;
const builder_util_runtime_1$9 = out;
const util_1$4 = util;
const Provider_1$4 = Provider$1;
class GenericProvider extends Provider_1$4.Provider {
  constructor(configuration, updater, runtimeOptions) {
    super(runtimeOptions);
    this.configuration = configuration;
    this.updater = updater;
    this.baseUrl = (0, util_1$4.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const result = this.updater.channel || this.configuration.channel;
    return result == null ? this.getDefaultChannelName() : this.getCustomChannelName(result);
  }
  async getLatestVersion() {
    const channelFile = (0, util_1$4.getChannelFilename)(this.channel);
    const channelUrl = (0, util_1$4.newUrlFromBase)(channelFile, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let attemptNumber = 0; ; attemptNumber++) {
      try {
        return (0, Provider_1$4.parseUpdateInfo)(await this.httpRequest(channelUrl), channelFile, channelUrl);
      } catch (e) {
        if (e instanceof builder_util_runtime_1$9.HttpError && e.statusCode === 404) {
          throw (0, builder_util_runtime_1$9.newError)(`Cannot find channel "${channelFile}" update info: ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        } else if (e.code === "ECONNREFUSED") {
          if (attemptNumber < 3) {
            await new Promise((resolve, reject) => {
              try {
                setTimeout(resolve, 1e3 * attemptNumber);
              } catch (e2) {
                reject(e2);
              }
            });
            continue;
          }
        }
        throw e;
      }
    }
  }
  resolveFiles(updateInfo) {
    return (0, Provider_1$4.resolveFiles)(updateInfo, this.baseUrl);
  }
}
GenericProvider$1.GenericProvider = GenericProvider;
var providerFactory = {};
var BitbucketProvider$1 = {};
Object.defineProperty(BitbucketProvider$1, "__esModule", { value: true });
BitbucketProvider$1.BitbucketProvider = void 0;
const builder_util_runtime_1$8 = out;
const util_1$3 = util;
const Provider_1$3 = Provider$1;
class BitbucketProvider extends Provider_1$3.Provider {
  constructor(configuration, updater, runtimeOptions) {
    super({
      ...runtimeOptions,
      isUseMultipleRangeRequest: false
    });
    this.configuration = configuration;
    this.updater = updater;
    const { owner, slug } = configuration;
    this.baseUrl = (0, util_1$3.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${owner}/${slug}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const cancellationToken = new builder_util_runtime_1$8.CancellationToken();
    const channelFile = (0, util_1$3.getChannelFilename)(this.getCustomChannelName(this.channel));
    const channelUrl = (0, util_1$3.newUrlFromBase)(channelFile, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const updateInfo = await this.httpRequest(channelUrl, void 0, cancellationToken);
      return (0, Provider_1$3.parseUpdateInfo)(updateInfo, channelFile, channelUrl);
    } catch (e) {
      throw (0, builder_util_runtime_1$8.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(updateInfo) {
    return (0, Provider_1$3.resolveFiles)(updateInfo, this.baseUrl);
  }
  toString() {
    const { owner, slug } = this.configuration;
    return `Bitbucket (owner: ${owner}, slug: ${slug}, channel: ${this.channel})`;
  }
}
BitbucketProvider$1.BitbucketProvider = BitbucketProvider;
var GitHubProvider$1 = {};
Object.defineProperty(GitHubProvider$1, "__esModule", { value: true });
GitHubProvider$1.GitHubProvider = GitHubProvider$1.BaseGitHubProvider = void 0;
GitHubProvider$1.computeReleaseNotes = computeReleaseNotes;
const builder_util_runtime_1$7 = out;
const semver = semver$1;
const url_1$2 = require$$0$1;
const util_1$2 = util;
const Provider_1$2 = Provider$1;
const hrefRegExp = /\/tag\/([^/]+)$/;
class BaseGitHubProvider extends Provider_1$2.Provider {
  constructor(options, defaultHost, runtimeOptions) {
    super({
      ...runtimeOptions,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: false
    });
    this.options = options;
    this.baseUrl = (0, util_1$2.newBaseUrl)((0, builder_util_runtime_1$7.githubUrl)(options, defaultHost));
    const apiHost = defaultHost === "github.com" ? "api.github.com" : defaultHost;
    this.baseApiUrl = (0, util_1$2.newBaseUrl)((0, builder_util_runtime_1$7.githubUrl)(options, apiHost));
  }
  computeGithubBasePath(result) {
    const host = this.options.host;
    return host && !["github.com", "api.github.com"].includes(host) ? `/api/v3${result}` : result;
  }
}
GitHubProvider$1.BaseGitHubProvider = BaseGitHubProvider;
class GitHubProvider extends BaseGitHubProvider {
  constructor(options, updater, runtimeOptions) {
    super(options, "github.com", runtimeOptions);
    this.options = options;
    this.updater = updater;
  }
  get channel() {
    const result = this.updater.channel || this.options.channel;
    return result == null ? this.getDefaultChannelName() : this.getCustomChannelName(result);
  }
  async getLatestVersion() {
    var _a, _b, _c, _d, _e;
    const cancellationToken = new builder_util_runtime_1$7.CancellationToken();
    const feedXml = await this.httpRequest((0, util_1$2.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, cancellationToken);
    const feed = (0, builder_util_runtime_1$7.parseXml)(feedXml);
    let latestRelease = feed.element("entry", false, `No published versions on GitHub`);
    let tag = null;
    try {
      if (this.updater.allowPrerelease) {
        const currentChannel = ((_a = this.updater) === null || _a === void 0 ? void 0 : _a.channel) || ((_b = semver.prerelease(this.updater.currentVersion)) === null || _b === void 0 ? void 0 : _b[0]) || null;
        if (currentChannel === null) {
          tag = hrefRegExp.exec(latestRelease.element("link").attribute("href"))[1];
        } else {
          for (const element of feed.getElements("entry")) {
            const hrefElement = hrefRegExp.exec(element.element("link").attribute("href"));
            if (hrefElement === null)
              continue;
            const hrefTag = hrefElement[1];
            const hrefChannel = ((_c = semver.prerelease(hrefTag)) === null || _c === void 0 ? void 0 : _c[0]) || null;
            const shouldFetchVersion = !currentChannel || ["alpha", "beta"].includes(currentChannel);
            const isCustomChannel = hrefChannel !== null && !["alpha", "beta"].includes(String(hrefChannel));
            const channelMismatch = currentChannel === "beta" && hrefChannel === "alpha";
            if (shouldFetchVersion && !isCustomChannel && !channelMismatch) {
              tag = hrefTag;
              break;
            }
            const isNextPreRelease = hrefChannel && hrefChannel === currentChannel;
            if (isNextPreRelease) {
              tag = hrefTag;
              break;
            }
          }
        }
      } else {
        tag = await this.getLatestTagName(cancellationToken);
        for (const element of feed.getElements("entry")) {
          if (hrefRegExp.exec(element.element("link").attribute("href"))[1] === tag) {
            latestRelease = element;
            break;
          }
        }
      }
    } catch (e) {
      throw (0, builder_util_runtime_1$7.newError)(`Cannot parse releases feed: ${e.stack || e.message},
XML:
${feedXml}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (tag == null) {
      throw (0, builder_util_runtime_1$7.newError)(`No published versions on GitHub`, "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    }
    let rawData;
    let channelFile = "";
    let channelFileUrl = "";
    const fetchData = async (channelName) => {
      channelFile = (0, util_1$2.getChannelFilename)(channelName);
      channelFileUrl = (0, util_1$2.newUrlFromBase)(this.getBaseDownloadPath(String(tag), channelFile), this.baseUrl);
      const requestOptions = this.createRequestOptions(channelFileUrl);
      try {
        return await this.executor.request(requestOptions, cancellationToken);
      } catch (e) {
        if (e instanceof builder_util_runtime_1$7.HttpError && e.statusCode === 404) {
          throw (0, builder_util_runtime_1$7.newError)(`Cannot find ${channelFile} in the latest release artifacts (${channelFileUrl}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        }
        throw e;
      }
    };
    try {
      let channel = this.channel;
      if (this.updater.allowPrerelease && ((_d = semver.prerelease(tag)) === null || _d === void 0 ? void 0 : _d[0])) {
        channel = this.getCustomChannelName(String((_e = semver.prerelease(tag)) === null || _e === void 0 ? void 0 : _e[0]));
      }
      rawData = await fetchData(channel);
    } catch (e) {
      if (this.updater.allowPrerelease) {
        rawData = await fetchData(this.getDefaultChannelName());
      } else {
        throw e;
      }
    }
    const result = (0, Provider_1$2.parseUpdateInfo)(rawData, channelFile, channelFileUrl);
    if (result.releaseName == null) {
      result.releaseName = latestRelease.elementValueOrEmpty("title");
    }
    if (result.releaseNotes == null) {
      result.releaseNotes = computeReleaseNotes(this.updater.currentVersion, this.updater.fullChangelog, feed, latestRelease);
    }
    return {
      tag,
      ...result
    };
  }
  async getLatestTagName(cancellationToken) {
    const options = this.options;
    const url2 = options.host == null || options.host === "github.com" ? (0, util_1$2.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new url_1$2.URL(`${this.computeGithubBasePath(`/repos/${options.owner}/${options.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const rawData = await this.httpRequest(url2, { Accept: "application/json" }, cancellationToken);
      if (rawData == null) {
        return null;
      }
      const releaseInfo = JSON.parse(rawData);
      return releaseInfo.tag_name;
    } catch (e) {
      throw (0, builder_util_runtime_1$7.newError)(`Unable to find latest version on GitHub (${url2}), please ensure a production release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(updateInfo) {
    return (0, Provider_1$2.resolveFiles)(updateInfo, this.baseUrl, (p) => this.getBaseDownloadPath(updateInfo.tag, p.replace(/ /g, "-")));
  }
  getBaseDownloadPath(tag, fileName) {
    return `${this.basePath}/download/${tag}/${fileName}`;
  }
}
GitHubProvider$1.GitHubProvider = GitHubProvider;
function getNoteValue(parent) {
  const result = parent.elementValueOrEmpty("content");
  return result === "No content." ? "" : result;
}
function computeReleaseNotes(currentVersion, isFullChangelog, feed, latestRelease) {
  if (!isFullChangelog) {
    return getNoteValue(latestRelease);
  }
  const releaseNotes = [];
  for (const release of feed.getElements("entry")) {
    const versionRelease = /\/tag\/v?([^/]+)$/.exec(release.element("link").attribute("href"))[1];
    if (semver.lt(currentVersion, versionRelease)) {
      releaseNotes.push({
        version: versionRelease,
        note: getNoteValue(release)
      });
    }
  }
  return releaseNotes.sort((a, b) => semver.rcompare(a.version, b.version));
}
var KeygenProvider$1 = {};
Object.defineProperty(KeygenProvider$1, "__esModule", { value: true });
KeygenProvider$1.KeygenProvider = void 0;
const builder_util_runtime_1$6 = out;
const util_1$1 = util;
const Provider_1$1 = Provider$1;
class KeygenProvider extends Provider_1$1.Provider {
  constructor(configuration, updater, runtimeOptions) {
    super({
      ...runtimeOptions,
      isUseMultipleRangeRequest: false
    });
    this.configuration = configuration;
    this.updater = updater;
    this.baseUrl = (0, util_1$1.newBaseUrl)(`https://api.keygen.sh/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const cancellationToken = new builder_util_runtime_1$6.CancellationToken();
    const channelFile = (0, util_1$1.getChannelFilename)(this.getCustomChannelName(this.channel));
    const channelUrl = (0, util_1$1.newUrlFromBase)(channelFile, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const updateInfo = await this.httpRequest(channelUrl, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, cancellationToken);
      return (0, Provider_1$1.parseUpdateInfo)(updateInfo, channelFile, channelUrl);
    } catch (e) {
      throw (0, builder_util_runtime_1$6.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(updateInfo) {
    return (0, Provider_1$1.resolveFiles)(updateInfo, this.baseUrl);
  }
  toString() {
    const { account, product, platform: platform2 } = this.configuration;
    return `Keygen (account: ${account}, product: ${product}, platform: ${platform2}, channel: ${this.channel})`;
  }
}
KeygenProvider$1.KeygenProvider = KeygenProvider;
var PrivateGitHubProvider$1 = {};
Object.defineProperty(PrivateGitHubProvider$1, "__esModule", { value: true });
PrivateGitHubProvider$1.PrivateGitHubProvider = void 0;
const builder_util_runtime_1$5 = out;
const js_yaml_1 = jsYaml;
const path$2 = require$$1$1;
const url_1$1 = require$$0$1;
const util_1 = util;
const GitHubProvider_1$1 = GitHubProvider$1;
const Provider_1 = Provider$1;
class PrivateGitHubProvider extends GitHubProvider_1$1.BaseGitHubProvider {
  constructor(options, updater, token, runtimeOptions) {
    super(options, "api.github.com", runtimeOptions);
    this.updater = updater;
    this.token = token;
  }
  createRequestOptions(url2, headers) {
    const result = super.createRequestOptions(url2, headers);
    result.redirect = "manual";
    return result;
  }
  async getLatestVersion() {
    const cancellationToken = new builder_util_runtime_1$5.CancellationToken();
    const channelFile = (0, util_1.getChannelFilename)(this.getDefaultChannelName());
    const releaseInfo = await this.getLatestVersionInfo(cancellationToken);
    const asset = releaseInfo.assets.find((it) => it.name === channelFile);
    if (asset == null) {
      throw (0, builder_util_runtime_1$5.newError)(`Cannot find ${channelFile} in the release ${releaseInfo.html_url || releaseInfo.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    }
    const url2 = new url_1$1.URL(asset.url);
    let result;
    try {
      result = (0, js_yaml_1.load)(await this.httpRequest(url2, this.configureHeaders("application/octet-stream"), cancellationToken));
    } catch (e) {
      if (e instanceof builder_util_runtime_1$5.HttpError && e.statusCode === 404) {
        throw (0, builder_util_runtime_1$5.newError)(`Cannot find ${channelFile} in the latest release artifacts (${url2}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      }
      throw e;
    }
    result.assets = releaseInfo.assets;
    return result;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(accept) {
    return {
      accept,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(cancellationToken) {
    const allowPrerelease = this.updater.allowPrerelease;
    let basePath = this.basePath;
    if (!allowPrerelease) {
      basePath = `${basePath}/latest`;
    }
    const url2 = (0, util_1.newUrlFromBase)(basePath, this.baseUrl);
    try {
      const version2 = JSON.parse(await this.httpRequest(url2, this.configureHeaders("application/vnd.github.v3+json"), cancellationToken));
      if (allowPrerelease) {
        return version2.find((it) => it.prerelease) || version2[0];
      } else {
        return version2;
      }
    } catch (e) {
      throw (0, builder_util_runtime_1$5.newError)(`Unable to find latest version on GitHub (${url2}), please ensure a production release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(updateInfo) {
    return (0, Provider_1.getFileList)(updateInfo).map((it) => {
      const name = path$2.posix.basename(it.url).replace(/ /g, "-");
      const asset = updateInfo.assets.find((it2) => it2 != null && it2.name === name);
      if (asset == null) {
        throw (0, builder_util_runtime_1$5.newError)(`Cannot find asset "${name}" in: ${JSON.stringify(updateInfo.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      }
      return {
        url: new url_1$1.URL(asset.url),
        info: it
      };
    });
  }
}
PrivateGitHubProvider$1.PrivateGitHubProvider = PrivateGitHubProvider;
Object.defineProperty(providerFactory, "__esModule", { value: true });
providerFactory.isUrlProbablySupportMultiRangeRequests = isUrlProbablySupportMultiRangeRequests;
providerFactory.createClient = createClient;
const builder_util_runtime_1$4 = out;
const BitbucketProvider_1 = BitbucketProvider$1;
const GenericProvider_1 = GenericProvider$1;
const GitHubProvider_1 = GitHubProvider$1;
const KeygenProvider_1 = KeygenProvider$1;
const PrivateGitHubProvider_1 = PrivateGitHubProvider$1;
function isUrlProbablySupportMultiRangeRequests(url2) {
  return !url2.includes("s3.amazonaws.com");
}
function createClient(data, updater, runtimeOptions) {
  if (typeof data === "string") {
    throw (0, builder_util_runtime_1$4.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  }
  const provider = data.provider;
  switch (provider) {
    case "github": {
      const githubOptions = data;
      const token = (githubOptions.private ? process.env["GH_TOKEN"] || process.env["GITHUB_TOKEN"] : null) || githubOptions.token;
      if (token == null) {
        return new GitHubProvider_1.GitHubProvider(githubOptions, updater, runtimeOptions);
      } else {
        return new PrivateGitHubProvider_1.PrivateGitHubProvider(githubOptions, updater, token, runtimeOptions);
      }
    }
    case "bitbucket":
      return new BitbucketProvider_1.BitbucketProvider(data, updater, runtimeOptions);
    case "keygen":
      return new KeygenProvider_1.KeygenProvider(data, updater, runtimeOptions);
    case "s3":
    case "spaces":
      return new GenericProvider_1.GenericProvider({
        provider: "generic",
        url: (0, builder_util_runtime_1$4.getS3LikeProviderBaseUrl)(data),
        channel: data.channel || null
      }, updater, {
        ...runtimeOptions,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: false
      });
    case "generic": {
      const options = data;
      return new GenericProvider_1.GenericProvider(options, updater, {
        ...runtimeOptions,
        isUseMultipleRangeRequest: options.useMultipleRangeRequest !== false && isUrlProbablySupportMultiRangeRequests(options.url)
      });
    }
    case "custom": {
      const options = data;
      const constructor = options.updateProvider;
      if (!constructor) {
        throw (0, builder_util_runtime_1$4.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      }
      return new constructor(options, updater, runtimeOptions);
    }
    default:
      throw (0, builder_util_runtime_1$4.newError)(`Unsupported provider: ${provider}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var GenericDifferentialDownloader$1 = {};
var DifferentialDownloader$1 = {};
var DataSplitter$1 = {};
var downloadPlanBuilder = {};
Object.defineProperty(downloadPlanBuilder, "__esModule", { value: true });
downloadPlanBuilder.OperationKind = void 0;
downloadPlanBuilder.computeOperations = computeOperations;
var OperationKind$1;
(function(OperationKind2) {
  OperationKind2[OperationKind2["COPY"] = 0] = "COPY";
  OperationKind2[OperationKind2["DOWNLOAD"] = 1] = "DOWNLOAD";
})(OperationKind$1 || (downloadPlanBuilder.OperationKind = OperationKind$1 = {}));
function computeOperations(oldBlockMap, newBlockMap, logger) {
  const nameToOldBlocks = buildBlockFileMap(oldBlockMap.files);
  const nameToNewBlocks = buildBlockFileMap(newBlockMap.files);
  let lastOperation = null;
  const blockMapFile = newBlockMap.files[0];
  const operations = [];
  const name = blockMapFile.name;
  const oldEntry = nameToOldBlocks.get(name);
  if (oldEntry == null) {
    throw new Error(`no file ${name} in old blockmap`);
  }
  const newFile = nameToNewBlocks.get(name);
  let changedBlockCount = 0;
  const { checksumToOffset: checksumToOldOffset, checksumToOldSize } = buildChecksumMap(nameToOldBlocks.get(name), oldEntry.offset, logger);
  let newOffset = blockMapFile.offset;
  for (let i = 0; i < newFile.checksums.length; newOffset += newFile.sizes[i], i++) {
    const blockSize = newFile.sizes[i];
    const checksum = newFile.checksums[i];
    let oldOffset = checksumToOldOffset.get(checksum);
    if (oldOffset != null && checksumToOldSize.get(checksum) !== blockSize) {
      logger.warn(`Checksum ("${checksum}") matches, but size differs (old: ${checksumToOldSize.get(checksum)}, new: ${blockSize})`);
      oldOffset = void 0;
    }
    if (oldOffset === void 0) {
      changedBlockCount++;
      if (lastOperation != null && lastOperation.kind === OperationKind$1.DOWNLOAD && lastOperation.end === newOffset) {
        lastOperation.end += blockSize;
      } else {
        lastOperation = {
          kind: OperationKind$1.DOWNLOAD,
          start: newOffset,
          end: newOffset + blockSize
          // oldBlocks: null,
        };
        validateAndAdd(lastOperation, operations, checksum, i);
      }
    } else {
      if (lastOperation != null && lastOperation.kind === OperationKind$1.COPY && lastOperation.end === oldOffset) {
        lastOperation.end += blockSize;
      } else {
        lastOperation = {
          kind: OperationKind$1.COPY,
          start: oldOffset,
          end: oldOffset + blockSize
          // oldBlocks: [checksum]
        };
        validateAndAdd(lastOperation, operations, checksum, i);
      }
    }
  }
  if (changedBlockCount > 0) {
    logger.info(`File${blockMapFile.name === "file" ? "" : " " + blockMapFile.name} has ${changedBlockCount} changed blocks`);
  }
  return operations;
}
const isValidateOperationRange = process.env["DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES"] === "true";
function validateAndAdd(operation, operations, checksum, index) {
  if (isValidateOperationRange && operations.length !== 0) {
    const lastOperation = operations[operations.length - 1];
    if (lastOperation.kind === operation.kind && operation.start < lastOperation.end && operation.start > lastOperation.start) {
      const min2 = [lastOperation.start, lastOperation.end, operation.start, operation.end].reduce((p, v) => p < v ? p : v);
      throw new Error(`operation (block index: ${index}, checksum: ${checksum}, kind: ${OperationKind$1[operation.kind]}) overlaps previous operation (checksum: ${checksum}):
abs: ${lastOperation.start} until ${lastOperation.end} and ${operation.start} until ${operation.end}
rel: ${lastOperation.start - min2} until ${lastOperation.end - min2} and ${operation.start - min2} until ${operation.end - min2}`);
    }
  }
  operations.push(operation);
}
function buildChecksumMap(file2, fileOffset, logger) {
  const checksumToOffset = /* @__PURE__ */ new Map();
  const checksumToSize = /* @__PURE__ */ new Map();
  let offset = fileOffset;
  for (let i = 0; i < file2.checksums.length; i++) {
    const checksum = file2.checksums[i];
    const size = file2.sizes[i];
    const existing = checksumToSize.get(checksum);
    if (existing === void 0) {
      checksumToOffset.set(checksum, offset);
      checksumToSize.set(checksum, size);
    } else if (logger.debug != null) {
      const sizeExplanation = existing === size ? "(same size)" : `(size: ${existing}, this size: ${size})`;
      logger.debug(`${checksum} duplicated in blockmap ${sizeExplanation}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    offset += size;
  }
  return { checksumToOffset, checksumToOldSize: checksumToSize };
}
function buildBlockFileMap(list) {
  const result = /* @__PURE__ */ new Map();
  for (const item of list) {
    result.set(item.name, item);
  }
  return result;
}
Object.defineProperty(DataSplitter$1, "__esModule", { value: true });
DataSplitter$1.DataSplitter = void 0;
DataSplitter$1.copyData = copyData;
const builder_util_runtime_1$3 = out;
const fs_1$1 = require$$1$2;
const stream_1$1 = stream;
const downloadPlanBuilder_1$2 = downloadPlanBuilder;
const DOUBLE_CRLF = Buffer.from("\r\n\r\n");
var ReadState;
(function(ReadState2) {
  ReadState2[ReadState2["INIT"] = 0] = "INIT";
  ReadState2[ReadState2["HEADER"] = 1] = "HEADER";
  ReadState2[ReadState2["BODY"] = 2] = "BODY";
})(ReadState || (ReadState = {}));
function copyData(task, out2, oldFileFd, reject, resolve) {
  const readStream2 = (0, fs_1$1.createReadStream)("", {
    fd: oldFileFd,
    autoClose: false,
    start: task.start,
    // end is inclusive
    end: task.end - 1
  });
  readStream2.on("error", reject);
  readStream2.once("end", resolve);
  readStream2.pipe(out2, {
    end: false
  });
}
class DataSplitter extends stream_1$1.Writable {
  constructor(out2, options, partIndexToTaskIndex, boundary, partIndexToLength, finishHandler) {
    super();
    this.out = out2;
    this.options = options;
    this.partIndexToTaskIndex = partIndexToTaskIndex;
    this.partIndexToLength = partIndexToLength;
    this.finishHandler = finishHandler;
    this.partIndex = -1;
    this.headerListBuffer = null;
    this.readState = ReadState.INIT;
    this.ignoreByteCount = 0;
    this.remainingPartDataCount = 0;
    this.actualPartLength = 0;
    this.boundaryLength = boundary.length + 4;
    this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(data, encoding, callback) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${data.length} bytes`);
      return;
    }
    this.handleData(data).then(callback).catch(callback);
  }
  async handleData(chunk) {
    let start = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0) {
      throw (0, builder_util_runtime_1$3.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    }
    if (this.ignoreByteCount > 0) {
      const toIgnore = Math.min(this.ignoreByteCount, chunk.length);
      this.ignoreByteCount -= toIgnore;
      start = toIgnore;
    } else if (this.remainingPartDataCount > 0) {
      const toRead = Math.min(this.remainingPartDataCount, chunk.length);
      this.remainingPartDataCount -= toRead;
      await this.processPartData(chunk, 0, toRead);
      start = toRead;
    }
    if (start === chunk.length) {
      return;
    }
    if (this.readState === ReadState.HEADER) {
      const headerListEnd = this.searchHeaderListEnd(chunk, start);
      if (headerListEnd === -1) {
        return;
      }
      start = headerListEnd;
      this.readState = ReadState.BODY;
      this.headerListBuffer = null;
    }
    while (true) {
      if (this.readState === ReadState.BODY) {
        this.readState = ReadState.INIT;
      } else {
        this.partIndex++;
        let taskIndex = this.partIndexToTaskIndex.get(this.partIndex);
        if (taskIndex == null) {
          if (this.isFinished) {
            taskIndex = this.options.end;
          } else {
            throw (0, builder_util_runtime_1$3.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          }
        }
        const prevTaskIndex = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
        if (prevTaskIndex < taskIndex) {
          await this.copyExistingData(prevTaskIndex, taskIndex);
        } else if (prevTaskIndex > taskIndex) {
          throw (0, builder_util_runtime_1$3.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
        }
        if (this.isFinished) {
          this.onPartEnd();
          this.finishHandler();
          return;
        }
        start = this.searchHeaderListEnd(chunk, start);
        if (start === -1) {
          this.readState = ReadState.HEADER;
          return;
        }
      }
      const partLength = this.partIndexToLength[this.partIndex];
      const end = start + partLength;
      const effectiveEnd = Math.min(end, chunk.length);
      await this.processPartStarted(chunk, start, effectiveEnd);
      this.remainingPartDataCount = partLength - (effectiveEnd - start);
      if (this.remainingPartDataCount > 0) {
        return;
      }
      start = end + this.boundaryLength;
      if (start >= chunk.length) {
        this.ignoreByteCount = this.boundaryLength - (chunk.length - end);
        return;
      }
    }
  }
  copyExistingData(index, end) {
    return new Promise((resolve, reject) => {
      const w = () => {
        if (index === end) {
          resolve();
          return;
        }
        const task = this.options.tasks[index];
        if (task.kind !== downloadPlanBuilder_1$2.OperationKind.COPY) {
          reject(new Error("Task kind must be COPY"));
          return;
        }
        copyData(task, this.out, this.options.oldFileFd, reject, () => {
          index++;
          w();
        });
      };
      w();
    });
  }
  searchHeaderListEnd(chunk, readOffset) {
    const headerListEnd = chunk.indexOf(DOUBLE_CRLF, readOffset);
    if (headerListEnd !== -1) {
      return headerListEnd + DOUBLE_CRLF.length;
    }
    const partialChunk = readOffset === 0 ? chunk : chunk.slice(readOffset);
    if (this.headerListBuffer == null) {
      this.headerListBuffer = partialChunk;
    } else {
      this.headerListBuffer = Buffer.concat([this.headerListBuffer, partialChunk]);
    }
    return -1;
  }
  onPartEnd() {
    const expectedLength = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== expectedLength) {
      throw (0, builder_util_runtime_1$3.newError)(`Expected length: ${expectedLength} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    }
    this.actualPartLength = 0;
  }
  processPartStarted(data, start, end) {
    if (this.partIndex !== 0) {
      this.onPartEnd();
    }
    return this.processPartData(data, start, end);
  }
  processPartData(data, start, end) {
    this.actualPartLength += end - start;
    const out2 = this.out;
    if (out2.write(start === 0 && data.length === end ? data : data.slice(start, end))) {
      return Promise.resolve();
    } else {
      return new Promise((resolve, reject) => {
        out2.on("error", reject);
        out2.once("drain", () => {
          out2.removeListener("error", reject);
          resolve();
        });
      });
    }
  }
}
DataSplitter$1.DataSplitter = DataSplitter;
var multipleRangeDownloader = {};
Object.defineProperty(multipleRangeDownloader, "__esModule", { value: true });
multipleRangeDownloader.executeTasksUsingMultipleRangeRequests = executeTasksUsingMultipleRangeRequests;
multipleRangeDownloader.checkIsRangesSupported = checkIsRangesSupported;
const builder_util_runtime_1$2 = out;
const DataSplitter_1$1 = DataSplitter$1;
const downloadPlanBuilder_1$1 = downloadPlanBuilder;
function executeTasksUsingMultipleRangeRequests(differentialDownloader, tasks, out2, oldFileFd, reject) {
  const w = (taskOffset) => {
    if (taskOffset >= tasks.length) {
      if (differentialDownloader.fileMetadataBuffer != null) {
        out2.write(differentialDownloader.fileMetadataBuffer);
      }
      out2.end();
      return;
    }
    const nextOffset = taskOffset + 1e3;
    doExecuteTasks(differentialDownloader, {
      tasks,
      start: taskOffset,
      end: Math.min(tasks.length, nextOffset),
      oldFileFd
    }, out2, () => w(nextOffset), reject);
  };
  return w;
}
function doExecuteTasks(differentialDownloader, options, out2, resolve, reject) {
  let ranges = "bytes=";
  let partCount = 0;
  const partIndexToTaskIndex = /* @__PURE__ */ new Map();
  const partIndexToLength = [];
  for (let i = options.start; i < options.end; i++) {
    const task = options.tasks[i];
    if (task.kind === downloadPlanBuilder_1$1.OperationKind.DOWNLOAD) {
      ranges += `${task.start}-${task.end - 1}, `;
      partIndexToTaskIndex.set(partCount, i);
      partCount++;
      partIndexToLength.push(task.end - task.start);
    }
  }
  if (partCount <= 1) {
    const w = (index) => {
      if (index >= options.end) {
        resolve();
        return;
      }
      const task = options.tasks[index++];
      if (task.kind === downloadPlanBuilder_1$1.OperationKind.COPY) {
        (0, DataSplitter_1$1.copyData)(task, out2, options.oldFileFd, reject, () => w(index));
      } else {
        const requestOptions2 = differentialDownloader.createRequestOptions();
        requestOptions2.headers.Range = `bytes=${task.start}-${task.end - 1}`;
        const request2 = differentialDownloader.httpExecutor.createRequest(requestOptions2, (response) => {
          if (!checkIsRangesSupported(response, reject)) {
            return;
          }
          response.pipe(out2, {
            end: false
          });
          response.once("end", () => w(index));
        });
        differentialDownloader.httpExecutor.addErrorAndTimeoutHandlers(request2, reject);
        request2.end();
      }
    };
    w(options.start);
    return;
  }
  const requestOptions = differentialDownloader.createRequestOptions();
  requestOptions.headers.Range = ranges.substring(0, ranges.length - 2);
  const request = differentialDownloader.httpExecutor.createRequest(requestOptions, (response) => {
    if (!checkIsRangesSupported(response, reject)) {
      return;
    }
    const contentType = (0, builder_util_runtime_1$2.safeGetHeader)(response, "content-type");
    const m = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(contentType);
    if (m == null) {
      reject(new Error(`Content-Type "multipart/byteranges" is expected, but got "${contentType}"`));
      return;
    }
    const dicer = new DataSplitter_1$1.DataSplitter(out2, options, partIndexToTaskIndex, m[1] || m[2], partIndexToLength, resolve);
    dicer.on("error", reject);
    response.pipe(dicer);
    response.on("end", () => {
      setTimeout(() => {
        request.abort();
        reject(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  differentialDownloader.httpExecutor.addErrorAndTimeoutHandlers(request, reject);
  request.end();
}
function checkIsRangesSupported(response, reject) {
  if (response.statusCode >= 400) {
    reject((0, builder_util_runtime_1$2.createHttpError)(response));
    return false;
  }
  if (response.statusCode !== 206) {
    const acceptRanges = (0, builder_util_runtime_1$2.safeGetHeader)(response, "accept-ranges");
    if (acceptRanges == null || acceptRanges === "none") {
      reject(new Error(`Server doesn't support Accept-Ranges (response code ${response.statusCode})`));
      return false;
    }
  }
  return true;
}
var ProgressDifferentialDownloadCallbackTransform$1 = {};
Object.defineProperty(ProgressDifferentialDownloadCallbackTransform$1, "__esModule", { value: true });
ProgressDifferentialDownloadCallbackTransform$1.ProgressDifferentialDownloadCallbackTransform = void 0;
const stream_1 = stream;
var OperationKind;
(function(OperationKind2) {
  OperationKind2[OperationKind2["COPY"] = 0] = "COPY";
  OperationKind2[OperationKind2["DOWNLOAD"] = 1] = "DOWNLOAD";
})(OperationKind || (OperationKind = {}));
class ProgressDifferentialDownloadCallbackTransform extends stream_1.Transform {
  constructor(progressDifferentialDownloadInfo, cancellationToken, onProgress) {
    super();
    this.progressDifferentialDownloadInfo = progressDifferentialDownloadInfo;
    this.cancellationToken = cancellationToken;
    this.onProgress = onProgress;
    this.start = Date.now();
    this.transferred = 0;
    this.delta = 0;
    this.expectedBytes = 0;
    this.index = 0;
    this.operationType = OperationKind.COPY;
    this.nextUpdate = this.start + 1e3;
  }
  _transform(chunk, encoding, callback) {
    if (this.cancellationToken.cancelled) {
      callback(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == OperationKind.COPY) {
      callback(null, chunk);
      return;
    }
    this.transferred += chunk.length;
    this.delta += chunk.length;
    const now = Date.now();
    if (now >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal) {
      this.nextUpdate = now + 1e3;
      this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((now - this.start) / 1e3))
      });
      this.delta = 0;
    }
    callback(null, chunk);
  }
  beginFileCopy() {
    this.operationType = OperationKind.COPY;
  }
  beginRangeDownload() {
    this.operationType = OperationKind.DOWNLOAD;
    this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    if (this.transferred !== this.progressDifferentialDownloadInfo.grandTotal) {
      this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      });
    }
  }
  // Called when we are 100% done with the connection/download
  _flush(callback) {
    if (this.cancellationToken.cancelled) {
      callback(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
    this.delta = 0;
    this.transferred = 0;
    callback(null);
  }
}
ProgressDifferentialDownloadCallbackTransform$1.ProgressDifferentialDownloadCallbackTransform = ProgressDifferentialDownloadCallbackTransform;
Object.defineProperty(DifferentialDownloader$1, "__esModule", { value: true });
DifferentialDownloader$1.DifferentialDownloader = void 0;
const builder_util_runtime_1$1 = out;
const fs_extra_1$1 = lib;
const fs_1 = require$$1$2;
const DataSplitter_1 = DataSplitter$1;
const url_1 = require$$0$1;
const downloadPlanBuilder_1 = downloadPlanBuilder;
const multipleRangeDownloader_1 = multipleRangeDownloader;
const ProgressDifferentialDownloadCallbackTransform_1 = ProgressDifferentialDownloadCallbackTransform$1;
class DifferentialDownloader {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(blockAwareFileInfo, httpExecutor2, options) {
    this.blockAwareFileInfo = blockAwareFileInfo;
    this.httpExecutor = httpExecutor2;
    this.options = options;
    this.fileMetadataBuffer = null;
    this.logger = options.logger;
  }
  createRequestOptions() {
    const result = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    (0, builder_util_runtime_1$1.configureRequestUrl)(this.options.newUrl, result);
    (0, builder_util_runtime_1$1.configureRequestOptions)(result);
    return result;
  }
  doDownload(oldBlockMap, newBlockMap) {
    if (oldBlockMap.version !== newBlockMap.version) {
      throw new Error(`version is different (${oldBlockMap.version} - ${newBlockMap.version}), full download is required`);
    }
    const logger = this.logger;
    const operations = (0, downloadPlanBuilder_1.computeOperations)(oldBlockMap, newBlockMap, logger);
    if (logger.debug != null) {
      logger.debug(JSON.stringify(operations, null, 2));
    }
    let downloadSize = 0;
    let copySize = 0;
    for (const operation of operations) {
      const length = operation.end - operation.start;
      if (operation.kind === downloadPlanBuilder_1.OperationKind.DOWNLOAD) {
        downloadSize += length;
      } else {
        copySize += length;
      }
    }
    const newSize = this.blockAwareFileInfo.size;
    if (downloadSize + copySize + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== newSize) {
      throw new Error(`Internal error, size mismatch: downloadSize: ${downloadSize}, copySize: ${copySize}, newSize: ${newSize}`);
    }
    logger.info(`Full: ${formatBytes(newSize)}, To download: ${formatBytes(downloadSize)} (${Math.round(downloadSize / (newSize / 100))}%)`);
    return this.downloadFile(operations);
  }
  downloadFile(tasks) {
    const fdList = [];
    const closeFiles = () => {
      return Promise.all(fdList.map((openedFile) => {
        return (0, fs_extra_1$1.close)(openedFile.descriptor).catch((e) => {
          this.logger.error(`cannot close file "${openedFile.path}": ${e}`);
        });
      }));
    };
    return this.doDownloadFile(tasks, fdList).then(closeFiles).catch((e) => {
      return closeFiles().catch((closeFilesError) => {
        try {
          this.logger.error(`cannot close files: ${closeFilesError}`);
        } catch (errorOnLog) {
          try {
            console.error(errorOnLog);
          } catch (_ignored) {
          }
        }
        throw e;
      }).then(() => {
        throw e;
      });
    });
  }
  async doDownloadFile(tasks, fdList) {
    const oldFileFd = await (0, fs_extra_1$1.open)(this.options.oldFile, "r");
    fdList.push({ descriptor: oldFileFd, path: this.options.oldFile });
    const newFileFd = await (0, fs_extra_1$1.open)(this.options.newFile, "w");
    fdList.push({ descriptor: newFileFd, path: this.options.newFile });
    const fileOut = (0, fs_1.createWriteStream)(this.options.newFile, { fd: newFileFd });
    await new Promise((resolve, reject) => {
      const streams = [];
      let downloadInfoTransform = void 0;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const expectedByteCounts = [];
        let grandTotalBytes = 0;
        for (const task of tasks) {
          if (task.kind === downloadPlanBuilder_1.OperationKind.DOWNLOAD) {
            expectedByteCounts.push(task.end - task.start);
            grandTotalBytes += task.end - task.start;
          }
        }
        const progressDifferentialDownloadInfo = {
          expectedByteCounts,
          grandTotal: grandTotalBytes
        };
        downloadInfoTransform = new ProgressDifferentialDownloadCallbackTransform_1.ProgressDifferentialDownloadCallbackTransform(progressDifferentialDownloadInfo, this.options.cancellationToken, this.options.onProgress);
        streams.push(downloadInfoTransform);
      }
      const digestTransform = new builder_util_runtime_1$1.DigestTransform(this.blockAwareFileInfo.sha512);
      digestTransform.isValidateOnEnd = false;
      streams.push(digestTransform);
      fileOut.on("finish", () => {
        fileOut.close(() => {
          fdList.splice(1, 1);
          try {
            digestTransform.validate();
          } catch (e) {
            reject(e);
            return;
          }
          resolve(void 0);
        });
      });
      streams.push(fileOut);
      let lastStream = null;
      for (const stream2 of streams) {
        stream2.on("error", reject);
        if (lastStream == null) {
          lastStream = stream2;
        } else {
          lastStream = lastStream.pipe(stream2);
        }
      }
      const firstStream = streams[0];
      let w;
      if (this.options.isUseMultipleRangeRequest) {
        w = (0, multipleRangeDownloader_1.executeTasksUsingMultipleRangeRequests)(this, tasks, firstStream, oldFileFd, reject);
        w(0);
        return;
      }
      let downloadOperationCount = 0;
      let actualUrl = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const requestOptions = this.createRequestOptions();
      requestOptions.redirect = "manual";
      w = (index) => {
        var _a, _b;
        if (index >= tasks.length) {
          if (this.fileMetadataBuffer != null) {
            firstStream.write(this.fileMetadataBuffer);
          }
          firstStream.end();
          return;
        }
        const operation = tasks[index++];
        if (operation.kind === downloadPlanBuilder_1.OperationKind.COPY) {
          if (downloadInfoTransform) {
            downloadInfoTransform.beginFileCopy();
          }
          (0, DataSplitter_1.copyData)(operation, firstStream, oldFileFd, reject, () => w(index));
          return;
        }
        const range2 = `bytes=${operation.start}-${operation.end - 1}`;
        requestOptions.headers.range = range2;
        (_b = (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug) === null || _b === void 0 ? void 0 : _b.call(_a, `download range: ${range2}`);
        if (downloadInfoTransform) {
          downloadInfoTransform.beginRangeDownload();
        }
        const request = this.httpExecutor.createRequest(requestOptions, (response) => {
          response.on("error", reject);
          response.on("aborted", () => {
            reject(new Error("response has been aborted by the server"));
          });
          if (response.statusCode >= 400) {
            reject((0, builder_util_runtime_1$1.createHttpError)(response));
          }
          response.pipe(firstStream, {
            end: false
          });
          response.once("end", () => {
            if (downloadInfoTransform) {
              downloadInfoTransform.endRangeDownload();
            }
            if (++downloadOperationCount === 100) {
              downloadOperationCount = 0;
              setTimeout(() => w(index), 1e3);
            } else {
              w(index);
            }
          });
        });
        request.on("redirect", (statusCode, method, redirectUrl) => {
          this.logger.info(`Redirect to ${removeQuery(redirectUrl)}`);
          actualUrl = redirectUrl;
          (0, builder_util_runtime_1$1.configureRequestUrl)(new url_1.URL(actualUrl), requestOptions);
          request.followRedirect();
        });
        this.httpExecutor.addErrorAndTimeoutHandlers(request, reject);
        request.end();
      };
      w(0);
    });
  }
  async readRemoteBytes(start, endInclusive) {
    const buffer = Buffer.allocUnsafe(endInclusive + 1 - start);
    const requestOptions = this.createRequestOptions();
    requestOptions.headers.range = `bytes=${start}-${endInclusive}`;
    let position = 0;
    await this.request(requestOptions, (chunk) => {
      chunk.copy(buffer, position);
      position += chunk.length;
    });
    if (position !== buffer.length) {
      throw new Error(`Received data length ${position} is not equal to expected ${buffer.length}`);
    }
    return buffer;
  }
  request(requestOptions, dataHandler) {
    return new Promise((resolve, reject) => {
      const request = this.httpExecutor.createRequest(requestOptions, (response) => {
        if (!(0, multipleRangeDownloader_1.checkIsRangesSupported)(response, reject)) {
          return;
        }
        response.on("error", reject);
        response.on("aborted", () => {
          reject(new Error("response has been aborted by the server"));
        });
        response.on("data", dataHandler);
        response.on("end", () => resolve());
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(request, reject);
      request.end();
    });
  }
}
DifferentialDownloader$1.DifferentialDownloader = DifferentialDownloader;
function formatBytes(value, symbol = " KB") {
  return new Intl.NumberFormat("en").format((value / 1024).toFixed(2)) + symbol;
}
function removeQuery(url2) {
  const index = url2.indexOf("?");
  return index < 0 ? url2 : url2.substring(0, index);
}
Object.defineProperty(GenericDifferentialDownloader$1, "__esModule", { value: true });
GenericDifferentialDownloader$1.GenericDifferentialDownloader = void 0;
const DifferentialDownloader_1$1 = DifferentialDownloader$1;
class GenericDifferentialDownloader extends DifferentialDownloader_1$1.DifferentialDownloader {
  download(oldBlockMap, newBlockMap) {
    return this.doDownload(oldBlockMap, newBlockMap);
  }
}
GenericDifferentialDownloader$1.GenericDifferentialDownloader = GenericDifferentialDownloader;
var hasRequiredAppUpdater;
function requireAppUpdater() {
  if (hasRequiredAppUpdater) return AppUpdater;
  hasRequiredAppUpdater = 1;
  Object.defineProperty(AppUpdater, "__esModule", { value: true });
  AppUpdater.NoOpLogger = AppUpdater.AppUpdater = void 0;
  const builder_util_runtime_12 = out;
  const crypto_12 = require$$0$2;
  const os_12 = require$$1$3;
  const events_12 = require$$0$4;
  const fs_extra_12 = lib;
  const js_yaml_12 = jsYaml;
  const lazy_val_1 = main$2;
  const path2 = require$$1$1;
  const semver_1 = semver$1;
  const DownloadedUpdateHelper_1 = DownloadedUpdateHelper$1;
  const ElectronAppAdapter_1 = ElectronAppAdapter$1;
  const electronHttpExecutor_1 = electronHttpExecutor;
  const GenericProvider_12 = GenericProvider$1;
  const main_1 = requireMain$1();
  const providerFactory_1 = providerFactory;
  const zlib_12 = zlib;
  const util_12 = util;
  const GenericDifferentialDownloader_1 = GenericDifferentialDownloader$1;
  let AppUpdater$1 = class AppUpdater2 extends events_12.EventEmitter {
    /**
     * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
     */
    get channel() {
      return this._channel;
    }
    /**
     * Set the update channel. Overrides `channel` in the update configuration.
     *
     * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
     */
    set channel(value) {
      if (this._channel != null) {
        if (typeof value !== "string") {
          throw (0, builder_util_runtime_12.newError)(`Channel must be a string, but got: ${value}`, "ERR_UPDATER_INVALID_CHANNEL");
        } else if (value.length === 0) {
          throw (0, builder_util_runtime_12.newError)(`Channel must be not an empty string`, "ERR_UPDATER_INVALID_CHANNEL");
        }
      }
      this._channel = value;
      this.allowDowngrade = true;
    }
    /**
     *  Shortcut for explicitly adding auth tokens to request headers
     */
    addAuthHeader(token) {
      this.requestHeaders = Object.assign({}, this.requestHeaders, {
        authorization: token
      });
    }
    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    get netSession() {
      return (0, electronHttpExecutor_1.getNetSession)();
    }
    /**
     * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
     * Set it to `null` if you would like to disable a logging feature.
     */
    get logger() {
      return this._logger;
    }
    set logger(value) {
      this._logger = value == null ? new NoOpLogger() : value;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * test only
     * @private
     */
    set updateConfigPath(value) {
      this.clientPromise = null;
      this._appUpdateConfigPath = value;
      this.configOnDisk = new lazy_val_1.Lazy(() => this.loadUpdateConfig());
    }
    constructor(options, app) {
      super();
      this.autoDownload = true;
      this.autoInstallOnAppQuit = true;
      this.autoRunAppAfterInstall = true;
      this.allowPrerelease = false;
      this.fullChangelog = false;
      this.allowDowngrade = false;
      this.disableWebInstaller = false;
      this.disableDifferentialDownload = false;
      this.forceDevUpdateConfig = false;
      this._channel = null;
      this.downloadedUpdateHelper = null;
      this.requestHeaders = null;
      this._logger = console;
      this.signals = new main_1.UpdaterSignal(this);
      this._appUpdateConfigPath = null;
      this.clientPromise = null;
      this.stagingUserIdPromise = new lazy_val_1.Lazy(() => this.getOrCreateStagingUserId());
      this.configOnDisk = new lazy_val_1.Lazy(() => this.loadUpdateConfig());
      this.checkForUpdatesPromise = null;
      this.downloadPromise = null;
      this.updateInfoAndProvider = null;
      this._testOnlyOptions = null;
      this.on("error", (error2) => {
        this._logger.error(`Error: ${error2.stack || error2.message}`);
      });
      if (app == null) {
        this.app = new ElectronAppAdapter_1.ElectronAppAdapter();
        this.httpExecutor = new electronHttpExecutor_1.ElectronHttpExecutor((authInfo, callback) => this.emit("login", authInfo, callback));
      } else {
        this.app = app;
        this.httpExecutor = null;
      }
      const currentVersionString = this.app.version;
      const currentVersion = (0, semver_1.parse)(currentVersionString);
      if (currentVersion == null) {
        throw (0, builder_util_runtime_12.newError)(`App version is not a valid semver version: "${currentVersionString}"`, "ERR_UPDATER_INVALID_VERSION");
      }
      this.currentVersion = currentVersion;
      this.allowPrerelease = hasPrereleaseComponents(currentVersion);
      if (options != null) {
        this.setFeedURL(options);
        if (typeof options !== "string" && options.requestHeaders) {
          this.requestHeaders = options.requestHeaders;
        }
      }
    }
    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    getFeedURL() {
      return "Deprecated. Do not use it.";
    }
    /**
     * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
     * @param options If you want to override configuration in the `app-update.yml`.
     */
    setFeedURL(options) {
      const runtimeOptions = this.createProviderRuntimeOptions();
      let provider;
      if (typeof options === "string") {
        provider = new GenericProvider_12.GenericProvider({ provider: "generic", url: options }, this, {
          ...runtimeOptions,
          isUseMultipleRangeRequest: (0, providerFactory_1.isUrlProbablySupportMultiRangeRequests)(options)
        });
      } else {
        provider = (0, providerFactory_1.createClient)(options, this, runtimeOptions);
      }
      this.clientPromise = Promise.resolve(provider);
    }
    /**
     * Asks the server whether there is an update.
     */
    checkForUpdates() {
      if (!this.isUpdaterActive()) {
        return Promise.resolve(null);
      }
      let checkForUpdatesPromise = this.checkForUpdatesPromise;
      if (checkForUpdatesPromise != null) {
        this._logger.info("Checking for update (already in progress)");
        return checkForUpdatesPromise;
      }
      const nullizePromise = () => this.checkForUpdatesPromise = null;
      this._logger.info("Checking for update");
      checkForUpdatesPromise = this.doCheckForUpdates().then((it) => {
        nullizePromise();
        return it;
      }).catch((e) => {
        nullizePromise();
        this.emit("error", e, `Cannot check for updates: ${(e.stack || e).toString()}`);
        throw e;
      });
      this.checkForUpdatesPromise = checkForUpdatesPromise;
      return checkForUpdatesPromise;
    }
    isUpdaterActive() {
      const isEnabled = this.app.isPackaged || this.forceDevUpdateConfig;
      if (!isEnabled) {
        this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced");
        return false;
      }
      return true;
    }
    // noinspection JSUnusedGlobalSymbols
    checkForUpdatesAndNotify(downloadNotification) {
      return this.checkForUpdates().then((it) => {
        if (!(it === null || it === void 0 ? void 0 : it.downloadPromise)) {
          if (this._logger.debug != null) {
            this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null");
          }
          return it;
        }
        void it.downloadPromise.then(() => {
          const notificationContent = AppUpdater2.formatDownloadNotification(it.updateInfo.version, this.app.name, downloadNotification);
          new require$$1$4.Notification(notificationContent).show();
        });
        return it;
      });
    }
    static formatDownloadNotification(version2, appName, downloadNotification) {
      if (downloadNotification == null) {
        downloadNotification = {
          title: "A new update is ready to install",
          body: `{appName} version {version} has been downloaded and will be automatically installed on exit`
        };
      }
      downloadNotification = {
        title: downloadNotification.title.replace("{appName}", appName).replace("{version}", version2),
        body: downloadNotification.body.replace("{appName}", appName).replace("{version}", version2)
      };
      return downloadNotification;
    }
    async isStagingMatch(updateInfo) {
      const rawStagingPercentage = updateInfo.stagingPercentage;
      let stagingPercentage = rawStagingPercentage;
      if (stagingPercentage == null) {
        return true;
      }
      stagingPercentage = parseInt(stagingPercentage, 10);
      if (isNaN(stagingPercentage)) {
        this._logger.warn(`Staging percentage is NaN: ${rawStagingPercentage}`);
        return true;
      }
      stagingPercentage = stagingPercentage / 100;
      const stagingUserId = await this.stagingUserIdPromise.value;
      const val = builder_util_runtime_12.UUID.parse(stagingUserId).readUInt32BE(12);
      const percentage = val / 4294967295;
      this._logger.info(`Staging percentage: ${stagingPercentage}, percentage: ${percentage}, user id: ${stagingUserId}`);
      return percentage < stagingPercentage;
    }
    computeFinalHeaders(headers) {
      if (this.requestHeaders != null) {
        Object.assign(headers, this.requestHeaders);
      }
      return headers;
    }
    async isUpdateAvailable(updateInfo) {
      const latestVersion = (0, semver_1.parse)(updateInfo.version);
      if (latestVersion == null) {
        throw (0, builder_util_runtime_12.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${updateInfo.version}"`, "ERR_UPDATER_INVALID_VERSION");
      }
      const currentVersion = this.currentVersion;
      if ((0, semver_1.eq)(latestVersion, currentVersion)) {
        return false;
      }
      const minimumSystemVersion = updateInfo === null || updateInfo === void 0 ? void 0 : updateInfo.minimumSystemVersion;
      const currentOSVersion = (0, os_12.release)();
      if (minimumSystemVersion) {
        try {
          if ((0, semver_1.lt)(currentOSVersion, minimumSystemVersion)) {
            this._logger.info(`Current OS version ${currentOSVersion} is less than the minimum OS version required ${minimumSystemVersion} for version ${currentOSVersion}`);
            return false;
          }
        } catch (e) {
          this._logger.warn(`Failed to compare current OS version(${currentOSVersion}) with minimum OS version(${minimumSystemVersion}): ${(e.message || e).toString()}`);
        }
      }
      const isStagingMatch = await this.isStagingMatch(updateInfo);
      if (!isStagingMatch) {
        return false;
      }
      const isLatestVersionNewer = (0, semver_1.gt)(latestVersion, currentVersion);
      const isLatestVersionOlder = (0, semver_1.lt)(latestVersion, currentVersion);
      if (isLatestVersionNewer) {
        return true;
      }
      return this.allowDowngrade && isLatestVersionOlder;
    }
    async getUpdateInfoAndProvider() {
      await this.app.whenReady();
      if (this.clientPromise == null) {
        this.clientPromise = this.configOnDisk.value.then((it) => (0, providerFactory_1.createClient)(it, this, this.createProviderRuntimeOptions()));
      }
      const client = await this.clientPromise;
      const stagingUserId = await this.stagingUserIdPromise.value;
      client.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": stagingUserId }));
      return {
        info: await client.getLatestVersion(),
        provider: client
      };
    }
    createProviderRuntimeOptions() {
      return {
        isUseMultipleRangeRequest: true,
        platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
        executor: this.httpExecutor
      };
    }
    async doCheckForUpdates() {
      this.emit("checking-for-update");
      const result = await this.getUpdateInfoAndProvider();
      const updateInfo = result.info;
      if (!await this.isUpdateAvailable(updateInfo)) {
        this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${updateInfo.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`);
        this.emit("update-not-available", updateInfo);
        return {
          versionInfo: updateInfo,
          updateInfo
        };
      }
      this.updateInfoAndProvider = result;
      this.onUpdateAvailable(updateInfo);
      const cancellationToken = new builder_util_runtime_12.CancellationToken();
      return {
        versionInfo: updateInfo,
        updateInfo,
        cancellationToken,
        downloadPromise: this.autoDownload ? this.downloadUpdate(cancellationToken) : null
      };
    }
    onUpdateAvailable(updateInfo) {
      this._logger.info(`Found version ${updateInfo.version} (url: ${(0, builder_util_runtime_12.asArray)(updateInfo.files).map((it) => it.url).join(", ")})`);
      this.emit("update-available", updateInfo);
    }
    /**
     * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
     * @returns {Promise<Array<string>>} Paths to downloaded files.
     */
    downloadUpdate(cancellationToken = new builder_util_runtime_12.CancellationToken()) {
      const updateInfoAndProvider = this.updateInfoAndProvider;
      if (updateInfoAndProvider == null) {
        const error2 = new Error("Please check update first");
        this.dispatchError(error2);
        return Promise.reject(error2);
      }
      if (this.downloadPromise != null) {
        this._logger.info("Downloading update (already in progress)");
        return this.downloadPromise;
      }
      this._logger.info(`Downloading update from ${(0, builder_util_runtime_12.asArray)(updateInfoAndProvider.info.files).map((it) => it.url).join(", ")}`);
      const errorHandler = (e) => {
        if (!(e instanceof builder_util_runtime_12.CancellationError)) {
          try {
            this.dispatchError(e);
          } catch (nestedError) {
            this._logger.warn(`Cannot dispatch error event: ${nestedError.stack || nestedError}`);
          }
        }
        return e;
      };
      this.downloadPromise = this.doDownloadUpdate({
        updateInfoAndProvider,
        requestHeaders: this.computeRequestHeaders(updateInfoAndProvider.provider),
        cancellationToken,
        disableWebInstaller: this.disableWebInstaller,
        disableDifferentialDownload: this.disableDifferentialDownload
      }).catch((e) => {
        throw errorHandler(e);
      }).finally(() => {
        this.downloadPromise = null;
      });
      return this.downloadPromise;
    }
    dispatchError(e) {
      this.emit("error", e, (e.stack || e).toString());
    }
    dispatchUpdateDownloaded(event) {
      this.emit(main_1.UPDATE_DOWNLOADED, event);
    }
    async loadUpdateConfig() {
      if (this._appUpdateConfigPath == null) {
        this._appUpdateConfigPath = this.app.appUpdateConfigPath;
      }
      return (0, js_yaml_12.load)(await (0, fs_extra_12.readFile)(this._appUpdateConfigPath, "utf-8"));
    }
    computeRequestHeaders(provider) {
      const fileExtraDownloadHeaders = provider.fileExtraDownloadHeaders;
      if (fileExtraDownloadHeaders != null) {
        const requestHeaders = this.requestHeaders;
        return requestHeaders == null ? fileExtraDownloadHeaders : {
          ...fileExtraDownloadHeaders,
          ...requestHeaders
        };
      }
      return this.computeFinalHeaders({ accept: "*/*" });
    }
    async getOrCreateStagingUserId() {
      const file2 = path2.join(this.app.userDataPath, ".updaterId");
      try {
        const id2 = await (0, fs_extra_12.readFile)(file2, "utf-8");
        if (builder_util_runtime_12.UUID.check(id2)) {
          return id2;
        } else {
          this._logger.warn(`Staging user id file exists, but content was invalid: ${id2}`);
        }
      } catch (e) {
        if (e.code !== "ENOENT") {
          this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${e}`);
        }
      }
      const id = builder_util_runtime_12.UUID.v5((0, crypto_12.randomBytes)(4096), builder_util_runtime_12.UUID.OID);
      this._logger.info(`Generated new staging user ID: ${id}`);
      try {
        await (0, fs_extra_12.outputFile)(file2, id);
      } catch (e) {
        this._logger.warn(`Couldn't write out staging user ID: ${e}`);
      }
      return id;
    }
    /** @internal */
    get isAddNoCacheQuery() {
      const headers = this.requestHeaders;
      if (headers == null) {
        return true;
      }
      for (const headerName of Object.keys(headers)) {
        const s = headerName.toLowerCase();
        if (s === "authorization" || s === "private-token") {
          return false;
        }
      }
      return true;
    }
    async getOrCreateDownloadHelper() {
      let result = this.downloadedUpdateHelper;
      if (result == null) {
        const dirName = (await this.configOnDisk.value).updaterCacheDirName;
        const logger = this._logger;
        if (dirName == null) {
          logger.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
        }
        const cacheDir = path2.join(this.app.baseCachePath, dirName || this.app.name);
        if (logger.debug != null) {
          logger.debug(`updater cache dir: ${cacheDir}`);
        }
        result = new DownloadedUpdateHelper_1.DownloadedUpdateHelper(cacheDir);
        this.downloadedUpdateHelper = result;
      }
      return result;
    }
    async executeDownload(taskOptions) {
      const fileInfo = taskOptions.fileInfo;
      const downloadOptions = {
        headers: taskOptions.downloadUpdateOptions.requestHeaders,
        cancellationToken: taskOptions.downloadUpdateOptions.cancellationToken,
        sha2: fileInfo.info.sha2,
        sha512: fileInfo.info.sha512
      };
      if (this.listenerCount(main_1.DOWNLOAD_PROGRESS) > 0) {
        downloadOptions.onProgress = (it) => this.emit(main_1.DOWNLOAD_PROGRESS, it);
      }
      const updateInfo = taskOptions.downloadUpdateOptions.updateInfoAndProvider.info;
      const version2 = updateInfo.version;
      const packageInfo = fileInfo.packageInfo;
      function getCacheUpdateFileName() {
        const urlPath = decodeURIComponent(taskOptions.fileInfo.url.pathname);
        if (urlPath.endsWith(`.${taskOptions.fileExtension}`)) {
          return path2.basename(urlPath);
        } else {
          return taskOptions.fileInfo.info.url;
        }
      }
      const downloadedUpdateHelper = await this.getOrCreateDownloadHelper();
      const cacheDir = downloadedUpdateHelper.cacheDirForPendingUpdate;
      await (0, fs_extra_12.mkdir)(cacheDir, { recursive: true });
      const updateFileName = getCacheUpdateFileName();
      let updateFile = path2.join(cacheDir, updateFileName);
      const packageFile = packageInfo == null ? null : path2.join(cacheDir, `package-${version2}${path2.extname(packageInfo.path) || ".7z"}`);
      const done = async (isSaveCache) => {
        await downloadedUpdateHelper.setDownloadedFile(updateFile, packageFile, updateInfo, fileInfo, updateFileName, isSaveCache);
        await taskOptions.done({
          ...updateInfo,
          downloadedFile: updateFile
        });
        return packageFile == null ? [updateFile] : [updateFile, packageFile];
      };
      const log2 = this._logger;
      const cachedUpdateFile = await downloadedUpdateHelper.validateDownloadedPath(updateFile, updateInfo, fileInfo, log2);
      if (cachedUpdateFile != null) {
        updateFile = cachedUpdateFile;
        return await done(false);
      }
      const removeFileIfAny = async () => {
        await downloadedUpdateHelper.clear().catch(() => {
        });
        return await (0, fs_extra_12.unlink)(updateFile).catch(() => {
        });
      };
      const tempUpdateFile = await (0, DownloadedUpdateHelper_1.createTempUpdateFile)(`temp-${updateFileName}`, cacheDir, log2);
      try {
        await taskOptions.task(tempUpdateFile, downloadOptions, packageFile, removeFileIfAny);
        await (0, builder_util_runtime_12.retry)(() => (0, fs_extra_12.rename)(tempUpdateFile, updateFile), 60, 500, 0, 0, (error2) => error2 instanceof Error && /^EBUSY:/.test(error2.message));
      } catch (e) {
        await removeFileIfAny();
        if (e instanceof builder_util_runtime_12.CancellationError) {
          log2.info("cancelled");
          this.emit("update-cancelled", updateInfo);
        }
        throw e;
      }
      log2.info(`New version ${version2} has been downloaded to ${updateFile}`);
      return await done(true);
    }
    async differentialDownloadInstaller(fileInfo, downloadUpdateOptions, installerPath, provider, oldInstallerFileName) {
      try {
        if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload) {
          return true;
        }
        const blockmapFileUrls = (0, util_12.blockmapFiles)(fileInfo.url, this.app.version, downloadUpdateOptions.updateInfoAndProvider.info.version);
        this._logger.info(`Download block maps (old: "${blockmapFileUrls[0]}", new: ${blockmapFileUrls[1]})`);
        const downloadBlockMap = async (url2) => {
          const data = await this.httpExecutor.downloadToBuffer(url2, {
            headers: downloadUpdateOptions.requestHeaders,
            cancellationToken: downloadUpdateOptions.cancellationToken
          });
          if (data == null || data.length === 0) {
            throw new Error(`Blockmap "${url2.href}" is empty`);
          }
          try {
            return JSON.parse((0, zlib_12.gunzipSync)(data).toString());
          } catch (e) {
            throw new Error(`Cannot parse blockmap "${url2.href}", error: ${e}`);
          }
        };
        const downloadOptions = {
          newUrl: fileInfo.url,
          oldFile: path2.join(this.downloadedUpdateHelper.cacheDir, oldInstallerFileName),
          logger: this._logger,
          newFile: installerPath,
          isUseMultipleRangeRequest: provider.isUseMultipleRangeRequest,
          requestHeaders: downloadUpdateOptions.requestHeaders,
          cancellationToken: downloadUpdateOptions.cancellationToken
        };
        if (this.listenerCount(main_1.DOWNLOAD_PROGRESS) > 0) {
          downloadOptions.onProgress = (it) => this.emit(main_1.DOWNLOAD_PROGRESS, it);
        }
        const blockMapDataList = await Promise.all(blockmapFileUrls.map((u2) => downloadBlockMap(u2)));
        await new GenericDifferentialDownloader_1.GenericDifferentialDownloader(fileInfo.info, this.httpExecutor, downloadOptions).download(blockMapDataList[0], blockMapDataList[1]);
        return false;
      } catch (e) {
        this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`);
        if (this._testOnlyOptions != null) {
          throw e;
        }
        return true;
      }
    }
  };
  AppUpdater.AppUpdater = AppUpdater$1;
  function hasPrereleaseComponents(version2) {
    const versionPrereleaseComponent = (0, semver_1.prerelease)(version2);
    return versionPrereleaseComponent != null && versionPrereleaseComponent.length > 0;
  }
  class NoOpLogger {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info(message) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    warn(message) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(message) {
    }
  }
  AppUpdater.NoOpLogger = NoOpLogger;
  return AppUpdater;
}
var hasRequiredBaseUpdater;
function requireBaseUpdater() {
  if (hasRequiredBaseUpdater) return BaseUpdater;
  hasRequiredBaseUpdater = 1;
  Object.defineProperty(BaseUpdater, "__esModule", { value: true });
  BaseUpdater.BaseUpdater = void 0;
  const child_process_12 = require$$1$5;
  const AppUpdater_1 = requireAppUpdater();
  let BaseUpdater$1 = class BaseUpdater extends AppUpdater_1.AppUpdater {
    constructor(options, app) {
      super(options, app);
      this.quitAndInstallCalled = false;
      this.quitHandlerAdded = false;
    }
    quitAndInstall(isSilent = false, isForceRunAfter = false) {
      this._logger.info(`Install on explicit quitAndInstall`);
      const isInstalled = this.install(isSilent, isSilent ? isForceRunAfter : this.autoRunAppAfterInstall);
      if (isInstalled) {
        setImmediate(() => {
          require$$1$4.autoUpdater.emit("before-quit-for-update");
          this.app.quit();
        });
      } else {
        this.quitAndInstallCalled = false;
      }
    }
    executeDownload(taskOptions) {
      return super.executeDownload({
        ...taskOptions,
        done: (event) => {
          this.dispatchUpdateDownloaded(event);
          this.addQuitHandler();
          return Promise.resolve();
        }
      });
    }
    // must be sync (because quit even handler is not async)
    install(isSilent = false, isForceRunAfter = false) {
      if (this.quitAndInstallCalled) {
        this._logger.warn("install call ignored: quitAndInstallCalled is set to true");
        return false;
      }
      const downloadedUpdateHelper = this.downloadedUpdateHelper;
      const installerPath = downloadedUpdateHelper && downloadedUpdateHelper.file ? process.platform === "linux" ? downloadedUpdateHelper.file.replace(/ /g, "\\ ") : downloadedUpdateHelper.file : null;
      const downloadedFileInfo = downloadedUpdateHelper == null ? null : downloadedUpdateHelper.downloadedFileInfo;
      if (installerPath == null || downloadedFileInfo == null) {
        this.dispatchError(new Error("No valid update available, can't quit and install"));
        return false;
      }
      this.quitAndInstallCalled = true;
      try {
        this._logger.info(`Install: isSilent: ${isSilent}, isForceRunAfter: ${isForceRunAfter}`);
        return this.doInstall({
          installerPath,
          isSilent,
          isForceRunAfter,
          isAdminRightsRequired: downloadedFileInfo.isAdminRightsRequired
        });
      } catch (e) {
        this.dispatchError(e);
        return false;
      }
    }
    addQuitHandler() {
      if (this.quitHandlerAdded || !this.autoInstallOnAppQuit) {
        return;
      }
      this.quitHandlerAdded = true;
      this.app.onQuit((exitCode) => {
        if (this.quitAndInstallCalled) {
          this._logger.info("Update installer has already been triggered. Quitting application.");
          return;
        }
        if (!this.autoInstallOnAppQuit) {
          this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
          return;
        }
        if (exitCode !== 0) {
          this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${exitCode}`);
          return;
        }
        this._logger.info("Auto install update on quit");
        this.install(true, false);
      });
    }
    wrapSudo() {
      const { name } = this.app;
      const installComment = `"${name} would like to update"`;
      const sudo = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu");
      const command = [sudo];
      if (/kdesudo/i.test(sudo)) {
        command.push("--comment", installComment);
        command.push("-c");
      } else if (/gksudo/i.test(sudo)) {
        command.push("--message", installComment);
      } else if (/pkexec/i.test(sudo)) {
        command.push("--disable-internal-agent");
      }
      return command.join(" ");
    }
    spawnSyncLog(cmd, args = [], env = {}) {
      this._logger.info(`Executing: ${cmd} with args: ${args}`);
      const response = (0, child_process_12.spawnSync)(cmd, args, {
        env: { ...process.env, ...env },
        encoding: "utf-8",
        shell: true
      });
      return response.stdout.trim();
    }
    /**
     * This handles both node 8 and node 10 way of emitting error when spawning a process
     *   - node 8: Throws the error
     *   - node 10: Emit the error(Need to listen with on)
     */
    // https://github.com/electron-userland/electron-builder/issues/1129
    // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
    async spawnLog(cmd, args = [], env = void 0, stdio = "ignore") {
      this._logger.info(`Executing: ${cmd} with args: ${args}`);
      return new Promise((resolve, reject) => {
        try {
          const params = { stdio, env, detached: true };
          const p = (0, child_process_12.spawn)(cmd, args, params);
          p.on("error", (error2) => {
            reject(error2);
          });
          p.unref();
          if (p.pid !== void 0) {
            resolve(true);
          }
        } catch (error2) {
          reject(error2);
        }
      });
    }
  };
  BaseUpdater.BaseUpdater = BaseUpdater$1;
  return BaseUpdater;
}
var AppImageUpdater = {};
var FileWithEmbeddedBlockMapDifferentialDownloader$1 = {};
Object.defineProperty(FileWithEmbeddedBlockMapDifferentialDownloader$1, "__esModule", { value: true });
FileWithEmbeddedBlockMapDifferentialDownloader$1.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const fs_extra_1 = lib;
const DifferentialDownloader_1 = DifferentialDownloader$1;
const zlib_1 = zlib;
class FileWithEmbeddedBlockMapDifferentialDownloader extends DifferentialDownloader_1.DifferentialDownloader {
  async download() {
    const packageInfo = this.blockAwareFileInfo;
    const fileSize = packageInfo.size;
    const offset = fileSize - (packageInfo.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(offset, fileSize - 1);
    const newBlockMap = readBlockMap(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await readEmbeddedBlockMapData(this.options.oldFile), newBlockMap);
  }
}
FileWithEmbeddedBlockMapDifferentialDownloader$1.FileWithEmbeddedBlockMapDifferentialDownloader = FileWithEmbeddedBlockMapDifferentialDownloader;
function readBlockMap(data) {
  return JSON.parse((0, zlib_1.inflateRawSync)(data).toString());
}
async function readEmbeddedBlockMapData(file2) {
  const fd = await (0, fs_extra_1.open)(file2, "r");
  try {
    const fileSize = (await (0, fs_extra_1.fstat)(fd)).size;
    const sizeBuffer = Buffer.allocUnsafe(4);
    await (0, fs_extra_1.read)(fd, sizeBuffer, 0, sizeBuffer.length, fileSize - sizeBuffer.length);
    const dataBuffer = Buffer.allocUnsafe(sizeBuffer.readUInt32BE(0));
    await (0, fs_extra_1.read)(fd, dataBuffer, 0, dataBuffer.length, fileSize - sizeBuffer.length - dataBuffer.length);
    await (0, fs_extra_1.close)(fd);
    return readBlockMap(dataBuffer);
  } catch (e) {
    await (0, fs_extra_1.close)(fd);
    throw e;
  }
}
var hasRequiredAppImageUpdater;
function requireAppImageUpdater() {
  if (hasRequiredAppImageUpdater) return AppImageUpdater;
  hasRequiredAppImageUpdater = 1;
  Object.defineProperty(AppImageUpdater, "__esModule", { value: true });
  AppImageUpdater.AppImageUpdater = void 0;
  const builder_util_runtime_12 = out;
  const child_process_12 = require$$1$5;
  const fs_extra_12 = lib;
  const fs_12 = require$$1$2;
  const path2 = require$$1$1;
  const BaseUpdater_1 = requireBaseUpdater();
  const FileWithEmbeddedBlockMapDifferentialDownloader_1 = FileWithEmbeddedBlockMapDifferentialDownloader$1;
  const main_1 = requireMain$1();
  const Provider_12 = Provider$1;
  let AppImageUpdater$1 = class AppImageUpdater extends BaseUpdater_1.BaseUpdater {
    constructor(options, app) {
      super(options, app);
    }
    isUpdaterActive() {
      if (process.env["APPIMAGE"] == null) {
        if (process.env["SNAP"] == null) {
          this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage");
        } else {
          this._logger.info("SNAP env is defined, updater is disabled");
        }
        return false;
      }
      return super.isUpdaterActive();
    }
    /*** @private */
    doDownloadUpdate(downloadUpdateOptions) {
      const provider = downloadUpdateOptions.updateInfoAndProvider.provider;
      const fileInfo = (0, Provider_12.findFile)(provider.resolveFiles(downloadUpdateOptions.updateInfoAndProvider.info), "AppImage", ["rpm", "deb"]);
      return this.executeDownload({
        fileExtension: "AppImage",
        fileInfo,
        downloadUpdateOptions,
        task: async (updateFile, downloadOptions) => {
          const oldFile = process.env["APPIMAGE"];
          if (oldFile == null) {
            throw (0, builder_util_runtime_12.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
          }
          let isDownloadFull = false;
          try {
            const downloadOptions2 = {
              newUrl: fileInfo.url,
              oldFile,
              logger: this._logger,
              newFile: updateFile,
              isUseMultipleRangeRequest: provider.isUseMultipleRangeRequest,
              requestHeaders: downloadUpdateOptions.requestHeaders,
              cancellationToken: downloadUpdateOptions.cancellationToken
            };
            if (this.listenerCount(main_1.DOWNLOAD_PROGRESS) > 0) {
              downloadOptions2.onProgress = (it) => this.emit(main_1.DOWNLOAD_PROGRESS, it);
            }
            await new FileWithEmbeddedBlockMapDifferentialDownloader_1.FileWithEmbeddedBlockMapDifferentialDownloader(fileInfo.info, this.httpExecutor, downloadOptions2).download();
          } catch (e) {
            this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`);
            isDownloadFull = process.platform === "linux";
          }
          if (isDownloadFull) {
            await this.httpExecutor.download(fileInfo.url, updateFile, downloadOptions);
          }
          await (0, fs_extra_12.chmod)(updateFile, 493);
        }
      });
    }
    doInstall(options) {
      const appImageFile = process.env["APPIMAGE"];
      if (appImageFile == null) {
        throw (0, builder_util_runtime_12.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      }
      (0, fs_12.unlinkSync)(appImageFile);
      let destination;
      const existingBaseName = path2.basename(appImageFile);
      if (path2.basename(options.installerPath) === existingBaseName || !/\d+\.\d+\.\d+/.test(existingBaseName)) {
        destination = appImageFile;
      } else {
        destination = path2.join(path2.dirname(appImageFile), path2.basename(options.installerPath));
      }
      (0, child_process_12.execFileSync)("mv", ["-f", options.installerPath, destination]);
      if (destination !== appImageFile) {
        this.emit("appimage-filename-updated", destination);
      }
      const env = {
        ...process.env,
        APPIMAGE_SILENT_INSTALL: "true"
      };
      if (options.isForceRunAfter) {
        this.spawnLog(destination, [], env);
      } else {
        env.APPIMAGE_EXIT_AFTER_INSTALL = "true";
        (0, child_process_12.execFileSync)(destination, [], { env });
      }
      return true;
    }
  };
  AppImageUpdater.AppImageUpdater = AppImageUpdater$1;
  return AppImageUpdater;
}
var DebUpdater = {};
var hasRequiredDebUpdater;
function requireDebUpdater() {
  if (hasRequiredDebUpdater) return DebUpdater;
  hasRequiredDebUpdater = 1;
  Object.defineProperty(DebUpdater, "__esModule", { value: true });
  DebUpdater.DebUpdater = void 0;
  const BaseUpdater_1 = requireBaseUpdater();
  const main_1 = requireMain$1();
  const Provider_12 = Provider$1;
  let DebUpdater$1 = class DebUpdater extends BaseUpdater_1.BaseUpdater {
    constructor(options, app) {
      super(options, app);
    }
    /*** @private */
    doDownloadUpdate(downloadUpdateOptions) {
      const provider = downloadUpdateOptions.updateInfoAndProvider.provider;
      const fileInfo = (0, Provider_12.findFile)(provider.resolveFiles(downloadUpdateOptions.updateInfoAndProvider.info), "deb", ["AppImage", "rpm"]);
      return this.executeDownload({
        fileExtension: "deb",
        fileInfo,
        downloadUpdateOptions,
        task: async (updateFile, downloadOptions) => {
          if (this.listenerCount(main_1.DOWNLOAD_PROGRESS) > 0) {
            downloadOptions.onProgress = (it) => this.emit(main_1.DOWNLOAD_PROGRESS, it);
          }
          await this.httpExecutor.download(fileInfo.url, updateFile, downloadOptions);
        }
      });
    }
    doInstall(options) {
      const sudo = this.wrapSudo();
      const wrapper = /pkexec/i.test(sudo) ? "" : `"`;
      const cmd = ["dpkg", "-i", options.installerPath, "||", "apt-get", "install", "-f", "-y"];
      this.spawnSyncLog(sudo, [`${wrapper}/bin/bash`, "-c", `'${cmd.join(" ")}'${wrapper}`]);
      if (options.isForceRunAfter) {
        this.app.relaunch();
      }
      return true;
    }
  };
  DebUpdater.DebUpdater = DebUpdater$1;
  return DebUpdater;
}
var RpmUpdater = {};
var hasRequiredRpmUpdater;
function requireRpmUpdater() {
  if (hasRequiredRpmUpdater) return RpmUpdater;
  hasRequiredRpmUpdater = 1;
  Object.defineProperty(RpmUpdater, "__esModule", { value: true });
  RpmUpdater.RpmUpdater = void 0;
  const BaseUpdater_1 = requireBaseUpdater();
  const main_1 = requireMain$1();
  const Provider_12 = Provider$1;
  let RpmUpdater$1 = class RpmUpdater extends BaseUpdater_1.BaseUpdater {
    constructor(options, app) {
      super(options, app);
    }
    /*** @private */
    doDownloadUpdate(downloadUpdateOptions) {
      const provider = downloadUpdateOptions.updateInfoAndProvider.provider;
      const fileInfo = (0, Provider_12.findFile)(provider.resolveFiles(downloadUpdateOptions.updateInfoAndProvider.info), "rpm", ["AppImage", "deb"]);
      return this.executeDownload({
        fileExtension: "rpm",
        fileInfo,
        downloadUpdateOptions,
        task: async (updateFile, downloadOptions) => {
          if (this.listenerCount(main_1.DOWNLOAD_PROGRESS) > 0) {
            downloadOptions.onProgress = (it) => this.emit(main_1.DOWNLOAD_PROGRESS, it);
          }
          await this.httpExecutor.download(fileInfo.url, updateFile, downloadOptions);
        }
      });
    }
    doInstall(options) {
      const upgradePath = options.installerPath;
      const sudo = this.wrapSudo();
      const wrapper = /pkexec/i.test(sudo) ? "" : `"`;
      const packageManager = this.spawnSyncLog("which zypper");
      let cmd;
      if (!packageManager) {
        const packageManager2 = this.spawnSyncLog("which dnf || which yum");
        cmd = [packageManager2, "-y", "install", upgradePath];
      } else {
        cmd = [packageManager, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", upgradePath];
      }
      this.spawnSyncLog(sudo, [`${wrapper}/bin/bash`, "-c", `'${cmd.join(" ")}'${wrapper}`]);
      if (options.isForceRunAfter) {
        this.app.relaunch();
      }
      return true;
    }
  };
  RpmUpdater.RpmUpdater = RpmUpdater$1;
  return RpmUpdater;
}
var MacUpdater = {};
var hasRequiredMacUpdater;
function requireMacUpdater() {
  if (hasRequiredMacUpdater) return MacUpdater;
  hasRequiredMacUpdater = 1;
  Object.defineProperty(MacUpdater, "__esModule", { value: true });
  MacUpdater.MacUpdater = void 0;
  const builder_util_runtime_12 = out;
  const fs_extra_12 = lib;
  const fs_12 = require$$1$2;
  const path2 = require$$1$1;
  const http_1 = require$$3;
  const AppUpdater_1 = requireAppUpdater();
  const Provider_12 = Provider$1;
  const child_process_12 = require$$1$5;
  const crypto_12 = require$$0$2;
  let MacUpdater$1 = class MacUpdater extends AppUpdater_1.AppUpdater {
    constructor(options, app) {
      super(options, app);
      this.nativeUpdater = require$$1$4.autoUpdater;
      this.squirrelDownloadedUpdate = false;
      this.nativeUpdater.on("error", (it) => {
        this._logger.warn(it);
        this.emit("error", it);
      });
      this.nativeUpdater.on("update-downloaded", () => {
        this.squirrelDownloadedUpdate = true;
        this.debug("nativeUpdater.update-downloaded");
      });
    }
    debug(message) {
      if (this._logger.debug != null) {
        this._logger.debug(message);
      }
    }
    closeServerIfExists() {
      if (this.server) {
        this.debug("Closing proxy server");
        this.server.close((err) => {
          if (err) {
            this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
          }
        });
      }
    }
    async doDownloadUpdate(downloadUpdateOptions) {
      let files = downloadUpdateOptions.updateInfoAndProvider.provider.resolveFiles(downloadUpdateOptions.updateInfoAndProvider.info);
      const log2 = this._logger;
      const sysctlRosettaInfoKey = "sysctl.proc_translated";
      let isRosetta = false;
      try {
        this.debug("Checking for macOS Rosetta environment");
        const result = (0, child_process_12.execFileSync)("sysctl", [sysctlRosettaInfoKey], { encoding: "utf8" });
        isRosetta = result.includes(`${sysctlRosettaInfoKey}: 1`);
        log2.info(`Checked for macOS Rosetta environment (isRosetta=${isRosetta})`);
      } catch (e) {
        log2.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${e}`);
      }
      let isArm64Mac = false;
      try {
        this.debug("Checking for arm64 in uname");
        const result = (0, child_process_12.execFileSync)("uname", ["-a"], { encoding: "utf8" });
        const isArm = result.includes("ARM");
        log2.info(`Checked 'uname -a': arm64=${isArm}`);
        isArm64Mac = isArm64Mac || isArm;
      } catch (e) {
        log2.warn(`uname shell command to check for arm64 failed: ${e}`);
      }
      isArm64Mac = isArm64Mac || process.arch === "arm64" || isRosetta;
      const isArm64 = (file2) => {
        var _a;
        return file2.url.pathname.includes("arm64") || ((_a = file2.info.url) === null || _a === void 0 ? void 0 : _a.includes("arm64"));
      };
      if (isArm64Mac && files.some(isArm64)) {
        files = files.filter((file2) => isArm64Mac === isArm64(file2));
      } else {
        files = files.filter((file2) => !isArm64(file2));
      }
      const zipFileInfo = (0, Provider_12.findFile)(files, "zip", ["pkg", "dmg"]);
      if (zipFileInfo == null) {
        throw (0, builder_util_runtime_12.newError)(`ZIP file not provided: ${(0, builder_util_runtime_12.safeStringifyJson)(files)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
      }
      const provider = downloadUpdateOptions.updateInfoAndProvider.provider;
      const CURRENT_MAC_APP_ZIP_FILE_NAME = "update.zip";
      return this.executeDownload({
        fileExtension: "zip",
        fileInfo: zipFileInfo,
        downloadUpdateOptions,
        task: async (destinationFile, downloadOptions) => {
          const cachedUpdateFilePath = path2.join(this.downloadedUpdateHelper.cacheDir, CURRENT_MAC_APP_ZIP_FILE_NAME);
          const canDifferentialDownload = () => {
            if (!(0, fs_extra_12.pathExistsSync)(cachedUpdateFilePath)) {
              log2.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download");
              return false;
            }
            return !downloadUpdateOptions.disableDifferentialDownload;
          };
          let differentialDownloadFailed = true;
          if (canDifferentialDownload()) {
            differentialDownloadFailed = await this.differentialDownloadInstaller(zipFileInfo, downloadUpdateOptions, destinationFile, provider, CURRENT_MAC_APP_ZIP_FILE_NAME);
          }
          if (differentialDownloadFailed) {
            await this.httpExecutor.download(zipFileInfo.url, destinationFile, downloadOptions);
          }
        },
        done: (event) => {
          if (!downloadUpdateOptions.disableDifferentialDownload) {
            try {
              const cachedUpdateFilePath = path2.join(this.downloadedUpdateHelper.cacheDir, CURRENT_MAC_APP_ZIP_FILE_NAME);
              (0, fs_12.copyFileSync)(event.downloadedFile, cachedUpdateFilePath);
            } catch (error2) {
              this._logger.warn(`Unable to copy file for caching for future differential downloads: ${error2.message}`);
            }
          }
          return this.updateDownloaded(zipFileInfo, event);
        }
      });
    }
    async updateDownloaded(zipFileInfo, event) {
      var _a;
      const downloadedFile = event.downloadedFile;
      const updateFileSize = (_a = zipFileInfo.info.size) !== null && _a !== void 0 ? _a : (await (0, fs_extra_12.stat)(downloadedFile)).size;
      const log2 = this._logger;
      const logContext = `fileToProxy=${zipFileInfo.url.href}`;
      this.closeServerIfExists();
      this.debug(`Creating proxy server for native Squirrel.Mac (${logContext})`);
      this.server = (0, http_1.createServer)();
      this.debug(`Proxy server for native Squirrel.Mac is created (${logContext})`);
      this.server.on("close", () => {
        log2.info(`Proxy server for native Squirrel.Mac is closed (${logContext})`);
      });
      const getServerUrl = (s) => {
        const address = s.address();
        if (typeof address === "string") {
          return address;
        }
        return `http://127.0.0.1:${address === null || address === void 0 ? void 0 : address.port}`;
      };
      return await new Promise((resolve, reject) => {
        const pass = (0, crypto_12.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-");
        const authInfo = Buffer.from(`autoupdater:${pass}`, "ascii");
        const fileUrl = `/${(0, crypto_12.randomBytes)(64).toString("hex")}.zip`;
        this.server.on("request", (request, response) => {
          const requestUrl = request.url;
          log2.info(`${requestUrl} requested`);
          if (requestUrl === "/") {
            if (!request.headers.authorization || request.headers.authorization.indexOf("Basic ") === -1) {
              response.statusCode = 401;
              response.statusMessage = "Invalid Authentication Credentials";
              response.end();
              log2.warn("No authenthication info");
              return;
            }
            const base64Credentials = request.headers.authorization.split(" ")[1];
            const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
            const [username, password] = credentials.split(":");
            if (username !== "autoupdater" || password !== pass) {
              response.statusCode = 401;
              response.statusMessage = "Invalid Authentication Credentials";
              response.end();
              log2.warn("Invalid authenthication credentials");
              return;
            }
            const data = Buffer.from(`{ "url": "${getServerUrl(this.server)}${fileUrl}" }`);
            response.writeHead(200, { "Content-Type": "application/json", "Content-Length": data.length });
            response.end(data);
            return;
          }
          if (!requestUrl.startsWith(fileUrl)) {
            log2.warn(`${requestUrl} requested, but not supported`);
            response.writeHead(404);
            response.end();
            return;
          }
          log2.info(`${fileUrl} requested by Squirrel.Mac, pipe ${downloadedFile}`);
          let errorOccurred = false;
          response.on("finish", () => {
            if (!errorOccurred) {
              this.nativeUpdater.removeListener("error", reject);
              resolve([]);
            }
          });
          const readStream2 = (0, fs_12.createReadStream)(downloadedFile);
          readStream2.on("error", (error2) => {
            try {
              response.end();
            } catch (e) {
              log2.warn(`cannot end response: ${e}`);
            }
            errorOccurred = true;
            this.nativeUpdater.removeListener("error", reject);
            reject(new Error(`Cannot pipe "${downloadedFile}": ${error2}`));
          });
          response.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Length": updateFileSize
          });
          readStream2.pipe(response);
        });
        this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${logContext})`);
        this.server.listen(0, "127.0.0.1", () => {
          this.debug(`Proxy server for native Squirrel.Mac is listening (address=${getServerUrl(this.server)}, ${logContext})`);
          this.nativeUpdater.setFeedURL({
            url: getServerUrl(this.server),
            headers: {
              "Cache-Control": "no-cache",
              Authorization: `Basic ${authInfo.toString("base64")}`
            }
          });
          this.dispatchUpdateDownloaded(event);
          if (this.autoInstallOnAppQuit) {
            this.nativeUpdater.once("error", reject);
            this.nativeUpdater.checkForUpdates();
          } else {
            resolve([]);
          }
        });
      });
    }
    quitAndInstall() {
      if (this.squirrelDownloadedUpdate) {
        this.nativeUpdater.quitAndInstall();
        this.closeServerIfExists();
      } else {
        this.nativeUpdater.on("update-downloaded", () => {
          this.nativeUpdater.quitAndInstall();
          this.closeServerIfExists();
        });
        if (!this.autoInstallOnAppQuit) {
          this.nativeUpdater.checkForUpdates();
        }
      }
    }
  };
  MacUpdater.MacUpdater = MacUpdater$1;
  return MacUpdater;
}
var NsisUpdater = {};
var windowsExecutableCodeSignatureVerifier = {};
Object.defineProperty(windowsExecutableCodeSignatureVerifier, "__esModule", { value: true });
windowsExecutableCodeSignatureVerifier.verifySignature = verifySignature;
const builder_util_runtime_1 = out;
const child_process_1 = require$$1$5;
const os$1 = require$$1$3;
const path$1 = require$$1$1;
function verifySignature(publisherNames, unescapedTempUpdateFile, logger) {
  return new Promise((resolve, reject) => {
    const tempUpdateFile = unescapedTempUpdateFile.replace(/'/g, "''");
    logger.info(`Verifying signature ${tempUpdateFile}`);
    (0, child_process_1.execFile)(`set "PSModulePath=" & chcp 65001 >NUL & powershell.exe`, ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${tempUpdateFile}' | ConvertTo-Json -Compress"`], {
      shell: true,
      timeout: 20 * 1e3
    }, (error2, stdout, stderr) => {
      var _a;
      try {
        if (error2 != null || stderr) {
          handleError(logger, error2, stderr, reject);
          resolve(null);
          return;
        }
        const data = parseOut(stdout);
        if (data.Status === 0) {
          try {
            const normlaizedUpdateFilePath = path$1.normalize(data.Path);
            const normalizedTempUpdateFile = path$1.normalize(unescapedTempUpdateFile);
            logger.info(`LiteralPath: ${normlaizedUpdateFilePath}. Update Path: ${normalizedTempUpdateFile}`);
            if (normlaizedUpdateFilePath !== normalizedTempUpdateFile) {
              handleError(logger, new Error(`LiteralPath of ${normlaizedUpdateFilePath} is different than ${normalizedTempUpdateFile}`), stderr, reject);
              resolve(null);
              return;
            }
          } catch (error3) {
            logger.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(_a = error3.message) !== null && _a !== void 0 ? _a : error3.stack}`);
          }
          const subject = (0, builder_util_runtime_1.parseDn)(data.SignerCertificate.Subject);
          let match = false;
          for (const name of publisherNames) {
            const dn = (0, builder_util_runtime_1.parseDn)(name);
            if (dn.size) {
              const allKeys = Array.from(dn.keys());
              match = allKeys.every((key) => {
                return dn.get(key) === subject.get(key);
              });
            } else if (name === subject.get("CN")) {
              logger.warn(`Signature validated using only CN ${name}. Please add your full Distinguished Name (DN) to publisherNames configuration`);
              match = true;
            }
            if (match) {
              resolve(null);
              return;
            }
          }
        }
        const result = `publisherNames: ${publisherNames.join(" | ")}, raw info: ` + JSON.stringify(data, (name, value) => name === "RawData" ? void 0 : value, 2);
        logger.warn(`Sign verification failed, installer signed with incorrect certificate: ${result}`);
        resolve(result);
      } catch (e) {
        handleError(logger, e, null, reject);
        resolve(null);
        return;
      }
    });
  });
}
function parseOut(out2) {
  const data = JSON.parse(out2);
  delete data.PrivateKey;
  delete data.IsOSBinary;
  delete data.SignatureType;
  const signerCertificate = data.SignerCertificate;
  if (signerCertificate != null) {
    delete signerCertificate.Archived;
    delete signerCertificate.Extensions;
    delete signerCertificate.Handle;
    delete signerCertificate.HasPrivateKey;
    delete signerCertificate.SubjectName;
  }
  return data;
}
function handleError(logger, error2, stderr, reject) {
  if (isOldWin6()) {
    logger.warn(`Cannot execute Get-AuthenticodeSignature: ${error2 || stderr}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, child_process_1.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (testError) {
    logger.warn(`Cannot execute ConvertTo-Json: ${testError.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  if (error2 != null) {
    reject(error2);
  }
  if (stderr) {
    reject(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${stderr}. Failing signature validation due to unknown stderr.`));
  }
}
function isOldWin6() {
  const winVersion = os$1.release();
  return winVersion.startsWith("6.") && !winVersion.startsWith("6.3");
}
var hasRequiredNsisUpdater;
function requireNsisUpdater() {
  if (hasRequiredNsisUpdater) return NsisUpdater;
  hasRequiredNsisUpdater = 1;
  Object.defineProperty(NsisUpdater, "__esModule", { value: true });
  NsisUpdater.NsisUpdater = void 0;
  const builder_util_runtime_12 = out;
  const path2 = require$$1$1;
  const BaseUpdater_1 = requireBaseUpdater();
  const FileWithEmbeddedBlockMapDifferentialDownloader_1 = FileWithEmbeddedBlockMapDifferentialDownloader$1;
  const main_1 = requireMain$1();
  const Provider_12 = Provider$1;
  const fs_extra_12 = lib;
  const windowsExecutableCodeSignatureVerifier_1 = windowsExecutableCodeSignatureVerifier;
  const url_12 = require$$0$1;
  let NsisUpdater$1 = class NsisUpdater extends BaseUpdater_1.BaseUpdater {
    constructor(options, app) {
      super(options, app);
      this._verifyUpdateCodeSignature = (publisherNames, unescapedTempUpdateFile) => (0, windowsExecutableCodeSignatureVerifier_1.verifySignature)(publisherNames, unescapedTempUpdateFile, this._logger);
    }
    /**
     * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
     * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
     */
    get verifyUpdateCodeSignature() {
      return this._verifyUpdateCodeSignature;
    }
    set verifyUpdateCodeSignature(value) {
      if (value) {
        this._verifyUpdateCodeSignature = value;
      }
    }
    /*** @private */
    doDownloadUpdate(downloadUpdateOptions) {
      const provider = downloadUpdateOptions.updateInfoAndProvider.provider;
      const fileInfo = (0, Provider_12.findFile)(provider.resolveFiles(downloadUpdateOptions.updateInfoAndProvider.info), "exe");
      return this.executeDownload({
        fileExtension: "exe",
        downloadUpdateOptions,
        fileInfo,
        task: async (destinationFile, downloadOptions, packageFile, removeTempDirIfAny) => {
          const packageInfo = fileInfo.packageInfo;
          const isWebInstaller = packageInfo != null && packageFile != null;
          if (isWebInstaller && downloadUpdateOptions.disableWebInstaller) {
            throw (0, builder_util_runtime_12.newError)(`Unable to download new version ${downloadUpdateOptions.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
          }
          if (!isWebInstaller && !downloadUpdateOptions.disableWebInstaller) {
            this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version.");
          }
          if (isWebInstaller || downloadUpdateOptions.disableDifferentialDownload || await this.differentialDownloadInstaller(fileInfo, downloadUpdateOptions, destinationFile, provider, builder_util_runtime_12.CURRENT_APP_INSTALLER_FILE_NAME)) {
            await this.httpExecutor.download(fileInfo.url, destinationFile, downloadOptions);
          }
          const signatureVerificationStatus = await this.verifySignature(destinationFile);
          if (signatureVerificationStatus != null) {
            await removeTempDirIfAny();
            throw (0, builder_util_runtime_12.newError)(`New version ${downloadUpdateOptions.updateInfoAndProvider.info.version} is not signed by the application owner: ${signatureVerificationStatus}`, "ERR_UPDATER_INVALID_SIGNATURE");
          }
          if (isWebInstaller) {
            if (await this.differentialDownloadWebPackage(downloadUpdateOptions, packageInfo, packageFile, provider)) {
              try {
                await this.httpExecutor.download(new url_12.URL(packageInfo.path), packageFile, {
                  headers: downloadUpdateOptions.requestHeaders,
                  cancellationToken: downloadUpdateOptions.cancellationToken,
                  sha512: packageInfo.sha512
                });
              } catch (e) {
                try {
                  await (0, fs_extra_12.unlink)(packageFile);
                } catch (_ignored) {
                }
                throw e;
              }
            }
          }
        }
      });
    }
    // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
    // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
    // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
    async verifySignature(tempUpdateFile) {
      let publisherName;
      try {
        publisherName = (await this.configOnDisk.value).publisherName;
        if (publisherName == null) {
          return null;
        }
      } catch (e) {
        if (e.code === "ENOENT") {
          return null;
        }
        throw e;
      }
      return await this._verifyUpdateCodeSignature(Array.isArray(publisherName) ? publisherName : [publisherName], tempUpdateFile);
    }
    doInstall(options) {
      const args = ["--updated"];
      if (options.isSilent) {
        args.push("/S");
      }
      if (options.isForceRunAfter) {
        args.push("--force-run");
      }
      if (this.installDirectory) {
        args.push(`/D=${this.installDirectory}`);
      }
      const packagePath = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
      if (packagePath != null) {
        args.push(`--package-file=${packagePath}`);
      }
      const callUsingElevation = () => {
        this.spawnLog(path2.join(process.resourcesPath, "elevate.exe"), [options.installerPath].concat(args)).catch((e) => this.dispatchError(e));
      };
      if (options.isAdminRightsRequired) {
        this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe");
        callUsingElevation();
        return true;
      }
      this.spawnLog(options.installerPath, args).catch((e) => {
        const errorCode = e.code;
        this._logger.info(`Cannot run installer: error code: ${errorCode}, error message: "${e.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`);
        if (errorCode === "UNKNOWN" || errorCode === "EACCES") {
          callUsingElevation();
        } else if (errorCode === "ENOENT") {
          require$$1$4.shell.openPath(options.installerPath).catch((err) => this.dispatchError(err));
        } else {
          this.dispatchError(e);
        }
      });
      return true;
    }
    async differentialDownloadWebPackage(downloadUpdateOptions, packageInfo, packagePath, provider) {
      if (packageInfo.blockMapSize == null) {
        return true;
      }
      try {
        const downloadOptions = {
          newUrl: new url_12.URL(packageInfo.path),
          oldFile: path2.join(this.downloadedUpdateHelper.cacheDir, builder_util_runtime_12.CURRENT_APP_PACKAGE_FILE_NAME),
          logger: this._logger,
          newFile: packagePath,
          requestHeaders: this.requestHeaders,
          isUseMultipleRangeRequest: provider.isUseMultipleRangeRequest,
          cancellationToken: downloadUpdateOptions.cancellationToken
        };
        if (this.listenerCount(main_1.DOWNLOAD_PROGRESS) > 0) {
          downloadOptions.onProgress = (it) => this.emit(main_1.DOWNLOAD_PROGRESS, it);
        }
        await new FileWithEmbeddedBlockMapDifferentialDownloader_1.FileWithEmbeddedBlockMapDifferentialDownloader(packageInfo, this.httpExecutor, downloadOptions).download();
      } catch (e) {
        this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`);
        return process.platform === "win32";
      }
      return false;
    }
  };
  NsisUpdater.NsisUpdater = NsisUpdater$1;
  return NsisUpdater;
}
var hasRequiredMain$1;
function requireMain$1() {
  if (hasRequiredMain$1) return main$3;
  hasRequiredMain$1 = 1;
  (function(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UpdaterSignal = exports2.UPDATE_DOWNLOADED = exports2.DOWNLOAD_PROGRESS = exports2.NsisUpdater = exports2.MacUpdater = exports2.RpmUpdater = exports2.DebUpdater = exports2.AppImageUpdater = exports2.Provider = exports2.CancellationToken = exports2.NoOpLogger = exports2.AppUpdater = exports2.BaseUpdater = void 0;
    const builder_util_runtime_12 = out;
    Object.defineProperty(exports2, "CancellationToken", { enumerable: true, get: function() {
      return builder_util_runtime_12.CancellationToken;
    } });
    const fs_extra_12 = lib;
    const path2 = require$$1$1;
    var BaseUpdater_1 = requireBaseUpdater();
    Object.defineProperty(exports2, "BaseUpdater", { enumerable: true, get: function() {
      return BaseUpdater_1.BaseUpdater;
    } });
    var AppUpdater_1 = requireAppUpdater();
    Object.defineProperty(exports2, "AppUpdater", { enumerable: true, get: function() {
      return AppUpdater_1.AppUpdater;
    } });
    Object.defineProperty(exports2, "NoOpLogger", { enumerable: true, get: function() {
      return AppUpdater_1.NoOpLogger;
    } });
    var Provider_12 = Provider$1;
    Object.defineProperty(exports2, "Provider", { enumerable: true, get: function() {
      return Provider_12.Provider;
    } });
    var AppImageUpdater_1 = requireAppImageUpdater();
    Object.defineProperty(exports2, "AppImageUpdater", { enumerable: true, get: function() {
      return AppImageUpdater_1.AppImageUpdater;
    } });
    var DebUpdater_1 = requireDebUpdater();
    Object.defineProperty(exports2, "DebUpdater", { enumerable: true, get: function() {
      return DebUpdater_1.DebUpdater;
    } });
    var RpmUpdater_1 = requireRpmUpdater();
    Object.defineProperty(exports2, "RpmUpdater", { enumerable: true, get: function() {
      return RpmUpdater_1.RpmUpdater;
    } });
    var MacUpdater_1 = requireMacUpdater();
    Object.defineProperty(exports2, "MacUpdater", { enumerable: true, get: function() {
      return MacUpdater_1.MacUpdater;
    } });
    var NsisUpdater_1 = requireNsisUpdater();
    Object.defineProperty(exports2, "NsisUpdater", { enumerable: true, get: function() {
      return NsisUpdater_1.NsisUpdater;
    } });
    let _autoUpdater;
    function doLoadAutoUpdater() {
      if (process.platform === "win32") {
        _autoUpdater = new (requireNsisUpdater()).NsisUpdater();
      } else if (process.platform === "darwin") {
        _autoUpdater = new (requireMacUpdater()).MacUpdater();
      } else {
        _autoUpdater = new (requireAppImageUpdater()).AppImageUpdater();
        try {
          const identity = path2.join(process.resourcesPath, "package-type");
          if (!(0, fs_extra_12.existsSync)(identity)) {
            return _autoUpdater;
          }
          console.info("Checking for beta autoupdate feature for deb/rpm distributions");
          const fileType = (0, fs_extra_12.readFileSync)(identity).toString().trim();
          console.info("Found package-type:", fileType);
          switch (fileType) {
            case "deb":
              _autoUpdater = new (requireDebUpdater()).DebUpdater();
              break;
            case "rpm":
              _autoUpdater = new (requireRpmUpdater()).RpmUpdater();
              break;
            default:
              break;
          }
        } catch (error2) {
          console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", error2.message);
        }
      }
      return _autoUpdater;
    }
    Object.defineProperty(exports2, "autoUpdater", {
      enumerable: true,
      get: () => {
        return _autoUpdater || doLoadAutoUpdater();
      }
    });
    exports2.DOWNLOAD_PROGRESS = "download-progress";
    exports2.UPDATE_DOWNLOADED = "update-downloaded";
    class UpdaterSignal {
      constructor(emitter) {
        this.emitter = emitter;
      }
      /**
       * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
       */
      login(handler) {
        addHandler(this.emitter, "login", handler);
      }
      progress(handler) {
        addHandler(this.emitter, exports2.DOWNLOAD_PROGRESS, handler);
      }
      updateDownloaded(handler) {
        addHandler(this.emitter, exports2.UPDATE_DOWNLOADED, handler);
      }
      updateCancelled(handler) {
        addHandler(this.emitter, "update-cancelled", handler);
      }
    }
    exports2.UpdaterSignal = UpdaterSignal;
    function addHandler(emitter, event, handler) {
      {
        emitter.on(event, handler);
      }
    }
  })(main$3);
  return main$3;
}
var mainExports = requireMain$1();
var src = { exports: {} };
var electronLogPreload = { exports: {} };
var hasRequiredElectronLogPreload;
function requireElectronLogPreload() {
  if (hasRequiredElectronLogPreload) return electronLogPreload.exports;
  hasRequiredElectronLogPreload = 1;
  (function(module2) {
    let electron = {};
    try {
      electron = require("electron");
    } catch (e) {
    }
    if (electron.ipcRenderer) {
      initialize2(electron);
    }
    {
      module2.exports = initialize2;
    }
    function initialize2({ contextBridge, ipcRenderer }) {
      if (!ipcRenderer) {
        return;
      }
      ipcRenderer.on("__ELECTRON_LOG_IPC__", (_, message) => {
        window.postMessage({ cmd: "message", ...message });
      });
      ipcRenderer.invoke("__ELECTRON_LOG__", { cmd: "getOptions" }).catch((e) => console.error(new Error(
        `electron-log isn't initialized in the main process. Please call log.initialize() before. ${e.message}`
      )));
      const electronLog = {
        sendToMain(message) {
          try {
            ipcRenderer.send("__ELECTRON_LOG__", message);
          } catch (e) {
            console.error("electronLog.sendToMain ", e, "data:", message);
            ipcRenderer.send("__ELECTRON_LOG__", {
              cmd: "errorHandler",
              error: { message: e == null ? void 0 : e.message, stack: e == null ? void 0 : e.stack },
              errorName: "sendToMain"
            });
          }
        },
        log(...data) {
          electronLog.sendToMain({ data, level: "info" });
        }
      };
      for (const level of ["error", "warn", "info", "verbose", "debug", "silly"]) {
        electronLog[level] = (...data) => electronLog.sendToMain({
          data,
          level
        });
      }
      if (contextBridge && process.contextIsolated) {
        try {
          contextBridge.exposeInMainWorld("__electronLog", electronLog);
        } catch {
        }
      }
      if (typeof window === "object") {
        window.__electronLog = electronLog;
      } else {
        __electronLog = electronLog;
      }
    }
  })(electronLogPreload);
  return electronLogPreload.exports;
}
var renderer = { exports: {} };
var scope;
var hasRequiredScope;
function requireScope() {
  if (hasRequiredScope) return scope;
  hasRequiredScope = 1;
  scope = scopeFactory;
  function scopeFactory(logger) {
    return Object.defineProperties(scope2, {
      defaultLabel: { value: "", writable: true },
      labelPadding: { value: true, writable: true },
      maxLabelLength: { value: 0, writable: true },
      labelLength: {
        get() {
          switch (typeof scope2.labelPadding) {
            case "boolean":
              return scope2.labelPadding ? scope2.maxLabelLength : 0;
            case "number":
              return scope2.labelPadding;
            default:
              return 0;
          }
        }
      }
    });
    function scope2(label) {
      scope2.maxLabelLength = Math.max(scope2.maxLabelLength, label.length);
      const newScope = {};
      for (const level of logger.levels) {
        newScope[level] = (...d) => logger.logData(d, { level, scope: label });
      }
      newScope.log = newScope.info;
      return newScope;
    }
  }
  return scope;
}
var Buffering_1;
var hasRequiredBuffering;
function requireBuffering() {
  if (hasRequiredBuffering) return Buffering_1;
  hasRequiredBuffering = 1;
  class Buffering {
    constructor({ processMessage }) {
      this.processMessage = processMessage;
      this.buffer = [];
      this.enabled = false;
      this.begin = this.begin.bind(this);
      this.commit = this.commit.bind(this);
      this.reject = this.reject.bind(this);
    }
    addMessage(message) {
      this.buffer.push(message);
    }
    begin() {
      this.enabled = [];
    }
    commit() {
      this.enabled = false;
      this.buffer.forEach((item) => this.processMessage(item));
      this.buffer = [];
    }
    reject() {
      this.enabled = false;
      this.buffer = [];
    }
  }
  Buffering_1 = Buffering;
  return Buffering_1;
}
var Logger_1;
var hasRequiredLogger;
function requireLogger() {
  if (hasRequiredLogger) return Logger_1;
  hasRequiredLogger = 1;
  const scopeFactory = requireScope();
  const Buffering = requireBuffering();
  const _Logger = class _Logger {
    constructor({
      allowUnknownLevel = false,
      dependencies = {},
      errorHandler,
      eventLogger,
      initializeFn,
      isDev: isDev2 = false,
      levels = ["error", "warn", "info", "verbose", "debug", "silly"],
      logId,
      transportFactories = {},
      variables
    } = {}) {
      __publicField(this, "dependencies", {});
      __publicField(this, "errorHandler", null);
      __publicField(this, "eventLogger", null);
      __publicField(this, "functions", {});
      __publicField(this, "hooks", []);
      __publicField(this, "isDev", false);
      __publicField(this, "levels", null);
      __publicField(this, "logId", null);
      __publicField(this, "scope", null);
      __publicField(this, "transports", {});
      __publicField(this, "variables", {});
      this.addLevel = this.addLevel.bind(this);
      this.create = this.create.bind(this);
      this.initialize = this.initialize.bind(this);
      this.logData = this.logData.bind(this);
      this.processMessage = this.processMessage.bind(this);
      this.allowUnknownLevel = allowUnknownLevel;
      this.buffering = new Buffering(this);
      this.dependencies = dependencies;
      this.initializeFn = initializeFn;
      this.isDev = isDev2;
      this.levels = levels;
      this.logId = logId;
      this.scope = scopeFactory(this);
      this.transportFactories = transportFactories;
      this.variables = variables || {};
      for (const name of this.levels) {
        this.addLevel(name, false);
      }
      this.log = this.info;
      this.functions.log = this.log;
      this.errorHandler = errorHandler;
      errorHandler == null ? void 0 : errorHandler.setOptions({ ...dependencies, logFn: this.error });
      this.eventLogger = eventLogger;
      eventLogger == null ? void 0 : eventLogger.setOptions({ ...dependencies, logger: this });
      for (const [name, factory] of Object.entries(transportFactories)) {
        this.transports[name] = factory(this, dependencies);
      }
      _Logger.instances[logId] = this;
    }
    static getInstance({ logId }) {
      return this.instances[logId] || this.instances.default;
    }
    addLevel(level, index = this.levels.length) {
      if (index !== false) {
        this.levels.splice(index, 0, level);
      }
      this[level] = (...args) => this.logData(args, { level });
      this.functions[level] = this[level];
    }
    catchErrors(options) {
      this.processMessage(
        {
          data: ["log.catchErrors is deprecated. Use log.errorHandler instead"],
          level: "warn"
        },
        { transports: ["console"] }
      );
      return this.errorHandler.startCatching(options);
    }
    create(options) {
      if (typeof options === "string") {
        options = { logId: options };
      }
      return new _Logger({
        dependencies: this.dependencies,
        errorHandler: this.errorHandler,
        initializeFn: this.initializeFn,
        isDev: this.isDev,
        transportFactories: this.transportFactories,
        variables: { ...this.variables },
        ...options
      });
    }
    compareLevels(passLevel, checkLevel, levels = this.levels) {
      const pass = levels.indexOf(passLevel);
      const check = levels.indexOf(checkLevel);
      if (check === -1 || pass === -1) {
        return true;
      }
      return check <= pass;
    }
    initialize(options = {}) {
      this.initializeFn({ logger: this, ...this.dependencies, ...options });
    }
    logData(data, options = {}) {
      if (this.buffering.enabled) {
        this.buffering.addMessage({ data, ...options });
      } else {
        this.processMessage({ data, ...options });
      }
    }
    processMessage(message, { transports = this.transports } = {}) {
      if (message.cmd === "errorHandler") {
        this.errorHandler.handle(message.error, {
          errorName: message.errorName,
          processType: "renderer",
          showDialog: Boolean(message.showDialog)
        });
        return;
      }
      let level = message.level;
      if (!this.allowUnknownLevel) {
        level = this.levels.includes(message.level) ? message.level : "info";
      }
      const normalizedMessage = {
        date: /* @__PURE__ */ new Date(),
        logId: this.logId,
        ...message,
        level,
        variables: {
          ...this.variables,
          ...message.variables
        }
      };
      for (const [transName, transFn] of this.transportEntries(transports)) {
        if (typeof transFn !== "function" || transFn.level === false) {
          continue;
        }
        if (!this.compareLevels(transFn.level, message.level)) {
          continue;
        }
        try {
          const transformedMsg = this.hooks.reduce((msg, hook) => {
            return msg ? hook(msg, transFn, transName) : msg;
          }, normalizedMessage);
          if (transformedMsg) {
            transFn({ ...transformedMsg, data: [...transformedMsg.data] });
          }
        } catch (e) {
          this.processInternalErrorFn(e);
        }
      }
    }
    processInternalErrorFn(_e) {
    }
    transportEntries(transports = this.transports) {
      const transportArray = Array.isArray(transports) ? transports : Object.entries(transports);
      return transportArray.map((item) => {
        switch (typeof item) {
          case "string":
            return this.transports[item] ? [item, this.transports[item]] : null;
          case "function":
            return [item.name, item];
          default:
            return Array.isArray(item) ? item : null;
        }
      }).filter(Boolean);
    }
  };
  __publicField(_Logger, "instances", {});
  let Logger = _Logger;
  Logger_1 = Logger;
  return Logger_1;
}
var RendererErrorHandler_1;
var hasRequiredRendererErrorHandler;
function requireRendererErrorHandler() {
  if (hasRequiredRendererErrorHandler) return RendererErrorHandler_1;
  hasRequiredRendererErrorHandler = 1;
  const consoleError = console.error;
  class RendererErrorHandler {
    constructor({ logFn = null } = {}) {
      __publicField(this, "logFn", null);
      __publicField(this, "onError", null);
      __publicField(this, "showDialog", false);
      __publicField(this, "preventDefault", true);
      this.handleError = this.handleError.bind(this);
      this.handleRejection = this.handleRejection.bind(this);
      this.startCatching = this.startCatching.bind(this);
      this.logFn = logFn;
    }
    handle(error2, {
      logFn = this.logFn,
      errorName = "",
      onError = this.onError,
      showDialog = this.showDialog
    } = {}) {
      try {
        if ((onError == null ? void 0 : onError({ error: error2, errorName, processType: "renderer" })) !== false) {
          logFn({ error: error2, errorName, showDialog });
        }
      } catch {
        consoleError(error2);
      }
    }
    setOptions({ logFn, onError, preventDefault, showDialog }) {
      if (typeof logFn === "function") {
        this.logFn = logFn;
      }
      if (typeof onError === "function") {
        this.onError = onError;
      }
      if (typeof preventDefault === "boolean") {
        this.preventDefault = preventDefault;
      }
      if (typeof showDialog === "boolean") {
        this.showDialog = showDialog;
      }
    }
    startCatching({ onError, showDialog } = {}) {
      if (this.isActive) {
        return;
      }
      this.isActive = true;
      this.setOptions({ onError, showDialog });
      window.addEventListener("error", (event) => {
        var _a;
        this.preventDefault && ((_a = event.preventDefault) == null ? void 0 : _a.call(event));
        this.handleError(event.error || event);
      });
      window.addEventListener("unhandledrejection", (event) => {
        var _a;
        this.preventDefault && ((_a = event.preventDefault) == null ? void 0 : _a.call(event));
        this.handleRejection(event.reason || event);
      });
    }
    handleError(error2) {
      this.handle(error2, { errorName: "Unhandled" });
    }
    handleRejection(reason) {
      const error2 = reason instanceof Error ? reason : new Error(JSON.stringify(reason));
      this.handle(error2, { errorName: "Unhandled rejection" });
    }
  }
  RendererErrorHandler_1 = RendererErrorHandler;
  return RendererErrorHandler_1;
}
var transform_1;
var hasRequiredTransform;
function requireTransform() {
  if (hasRequiredTransform) return transform_1;
  hasRequiredTransform = 1;
  transform_1 = { transform };
  function transform({
    logger,
    message,
    transport,
    initialData = (message == null ? void 0 : message.data) || [],
    transforms = transport == null ? void 0 : transport.transforms
  }) {
    return transforms.reduce((data, trans) => {
      if (typeof trans === "function") {
        return trans({ data, logger, message, transport });
      }
      return data;
    }, initialData);
  }
  return transform_1;
}
var console_1$1;
var hasRequiredConsole$1;
function requireConsole$1() {
  if (hasRequiredConsole$1) return console_1$1;
  hasRequiredConsole$1 = 1;
  const { transform } = requireTransform();
  console_1$1 = consoleTransportRendererFactory;
  const consoleMethods = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    verbose: console.info,
    debug: console.debug,
    silly: console.debug,
    log: console.log
  };
  function consoleTransportRendererFactory(logger) {
    return Object.assign(transport, {
      format: "{h}:{i}:{s}.{ms}{scope} › {text}",
      transforms: [formatDataFn],
      writeFn({ message: { level, data } }) {
        const consoleLogFn = consoleMethods[level] || consoleMethods.info;
        setTimeout(() => consoleLogFn(...data));
      }
    });
    function transport(message) {
      transport.writeFn({
        message: { ...message, data: transform({ logger, message, transport }) }
      });
    }
  }
  function formatDataFn({
    data = [],
    logger = {},
    message = {},
    transport = {}
  }) {
    if (typeof transport.format === "function") {
      return transport.format({
        data,
        level: (message == null ? void 0 : message.level) || "info",
        logger,
        message,
        transport
      });
    }
    if (typeof transport.format !== "string") {
      return data;
    }
    data.unshift(transport.format);
    if (typeof data[1] === "string" && data[1].match(/%[1cdfiOos]/)) {
      data = [`${data[0]} ${data[1]}`, ...data.slice(2)];
    }
    const date = message.date || /* @__PURE__ */ new Date();
    data[0] = data[0].replace(/\{(\w+)}/g, (substring, name) => {
      var _a, _b;
      switch (name) {
        case "level":
          return message.level;
        case "logId":
          return message.logId;
        case "scope": {
          const scope2 = message.scope || ((_a = logger.scope) == null ? void 0 : _a.defaultLabel);
          return scope2 ? ` (${scope2})` : "";
        }
        case "text":
          return "";
        case "y":
          return date.getFullYear().toString(10);
        case "m":
          return (date.getMonth() + 1).toString(10).padStart(2, "0");
        case "d":
          return date.getDate().toString(10).padStart(2, "0");
        case "h":
          return date.getHours().toString(10).padStart(2, "0");
        case "i":
          return date.getMinutes().toString(10).padStart(2, "0");
        case "s":
          return date.getSeconds().toString(10).padStart(2, "0");
        case "ms":
          return date.getMilliseconds().toString(10).padStart(3, "0");
        case "iso":
          return date.toISOString();
        default:
          return ((_b = message.variables) == null ? void 0 : _b[name]) || substring;
      }
    }).trim();
    return data;
  }
  return console_1$1;
}
var ipc$1;
var hasRequiredIpc$1;
function requireIpc$1() {
  if (hasRequiredIpc$1) return ipc$1;
  hasRequiredIpc$1 = 1;
  const { transform } = requireTransform();
  ipc$1 = ipcTransportRendererFactory;
  const RESTRICTED_TYPES = /* @__PURE__ */ new Set([Promise, WeakMap, WeakSet]);
  function ipcTransportRendererFactory(logger) {
    return Object.assign(transport, {
      depth: 5,
      transforms: [serializeFn]
    });
    function transport(message) {
      if (!window.__electronLog) {
        logger.processMessage(
          {
            data: ["electron-log: logger isn't initialized in the main process"],
            level: "error"
          },
          { transports: ["console"] }
        );
        return;
      }
      try {
        const serialized = transform({
          initialData: message,
          logger,
          message,
          transport
        });
        __electronLog.sendToMain(serialized);
      } catch (e) {
        logger.transports.console({
          data: ["electronLog.transports.ipc", e, "data:", message.data],
          level: "error"
        });
      }
    }
  }
  function isPrimitive(value) {
    return Object(value) !== value;
  }
  function serializeFn({
    data,
    depth,
    seen = /* @__PURE__ */ new WeakSet(),
    transport = {}
  } = {}) {
    const actualDepth = depth || transport.depth || 5;
    if (seen.has(data)) {
      return "[Circular]";
    }
    if (actualDepth < 1) {
      if (isPrimitive(data)) {
        return data;
      }
      if (Array.isArray(data)) {
        return "[Array]";
      }
      return `[${typeof data}]`;
    }
    if (["function", "symbol"].includes(typeof data)) {
      return data.toString();
    }
    if (isPrimitive(data)) {
      return data;
    }
    if (RESTRICTED_TYPES.has(data.constructor)) {
      return `[${data.constructor.name}]`;
    }
    if (Array.isArray(data)) {
      return data.map((item) => serializeFn({
        data: item,
        depth: actualDepth - 1,
        seen
      }));
    }
    if (data instanceof Date) {
      return data.toISOString();
    }
    if (data instanceof Error) {
      return data.stack;
    }
    if (data instanceof Map) {
      return new Map(
        Array.from(data).map(([key, value]) => [
          serializeFn({ data: key, depth: actualDepth - 1, seen }),
          serializeFn({ data: value, depth: actualDepth - 1, seen })
        ])
      );
    }
    if (data instanceof Set) {
      return new Set(
        Array.from(data).map(
          (val) => serializeFn({ data: val, depth: actualDepth - 1, seen })
        )
      );
    }
    seen.add(data);
    return Object.fromEntries(
      Object.entries(data).map(
        ([key, value]) => [
          key,
          serializeFn({ data: value, depth: actualDepth - 1, seen })
        ]
      )
    );
  }
  return ipc$1;
}
var hasRequiredRenderer;
function requireRenderer() {
  if (hasRequiredRenderer) return renderer.exports;
  hasRequiredRenderer = 1;
  (function(module2) {
    const Logger = requireLogger();
    const RendererErrorHandler = requireRendererErrorHandler();
    const transportConsole = requireConsole$1();
    const transportIpc = requireIpc$1();
    module2.exports = createLogger();
    module2.exports.Logger = Logger;
    module2.exports.default = module2.exports;
    function createLogger() {
      const logger = new Logger({
        allowUnknownLevel: true,
        errorHandler: new RendererErrorHandler(),
        initializeFn: () => {
        },
        logId: "default",
        transportFactories: {
          console: transportConsole,
          ipc: transportIpc
        },
        variables: {
          processType: "renderer"
        }
      });
      logger.errorHandler.setOptions({
        logFn({ error: error2, errorName, showDialog }) {
          logger.transports.console({
            data: [errorName, error2].filter(Boolean),
            level: "error"
          });
          logger.transports.ipc({
            cmd: "errorHandler",
            error: {
              cause: error2 == null ? void 0 : error2.cause,
              code: error2 == null ? void 0 : error2.code,
              name: error2 == null ? void 0 : error2.name,
              message: error2 == null ? void 0 : error2.message,
              stack: error2 == null ? void 0 : error2.stack
            },
            errorName,
            logId: logger.logId,
            showDialog
          });
        }
      });
      if (typeof window === "object") {
        window.addEventListener("message", (event) => {
          const { cmd, logId, ...message } = event.data || {};
          const instance = Logger.getInstance({ logId });
          if (cmd === "message") {
            instance.processMessage(message, { transports: ["console"] });
          }
        });
      }
      return new Proxy(logger, {
        get(target, prop) {
          if (typeof target[prop] !== "undefined") {
            return target[prop];
          }
          return (...data) => logger.logData(data, { level: prop });
        }
      });
    }
  })(renderer);
  return renderer.exports;
}
var packageJson$1;
var hasRequiredPackageJson;
function requirePackageJson() {
  if (hasRequiredPackageJson) return packageJson$1;
  hasRequiredPackageJson = 1;
  const fs2 = require$$1$2;
  const path2 = require$$1$1;
  packageJson$1 = {
    findAndReadPackageJson,
    tryReadJsonAt
  };
  function findAndReadPackageJson() {
    return tryReadJsonAt(getMainModulePath()) || tryReadJsonAt(extractPathFromArgs()) || tryReadJsonAt(process.resourcesPath, "app.asar") || tryReadJsonAt(process.resourcesPath, "app") || tryReadJsonAt(process.cwd()) || { name: void 0, version: void 0 };
  }
  function tryReadJsonAt(...searchPaths) {
    if (!searchPaths[0]) {
      return void 0;
    }
    try {
      const searchPath = path2.join(...searchPaths);
      const fileName = findUp("package.json", searchPath);
      if (!fileName) {
        return void 0;
      }
      const json2 = JSON.parse(fs2.readFileSync(fileName, "utf8"));
      const name = (json2 == null ? void 0 : json2.productName) || (json2 == null ? void 0 : json2.name);
      if (!name || name.toLowerCase() === "electron") {
        return void 0;
      }
      if (name) {
        return { name, version: json2 == null ? void 0 : json2.version };
      }
      return void 0;
    } catch (e) {
      return void 0;
    }
  }
  function findUp(fileName, cwd2) {
    let currentPath = cwd2;
    while (true) {
      const parsedPath = path2.parse(currentPath);
      const root2 = parsedPath.root;
      const dir = parsedPath.dir;
      if (fs2.existsSync(path2.join(currentPath, fileName))) {
        return path2.resolve(path2.join(currentPath, fileName));
      }
      if (currentPath === root2) {
        return null;
      }
      currentPath = dir;
    }
  }
  function extractPathFromArgs() {
    const matchedArgs = process.argv.filter((arg) => {
      return arg.indexOf("--user-data-dir=") === 0;
    });
    if (matchedArgs.length === 0 || typeof matchedArgs[0] !== "string") {
      return null;
    }
    const userDataDir = matchedArgs[0];
    return userDataDir.replace("--user-data-dir=", "");
  }
  function getMainModulePath() {
    var _a;
    try {
      return (_a = require.main) == null ? void 0 : _a.filename;
    } catch {
      return void 0;
    }
  }
  return packageJson$1;
}
var NodeExternalApi_1;
var hasRequiredNodeExternalApi;
function requireNodeExternalApi() {
  if (hasRequiredNodeExternalApi) return NodeExternalApi_1;
  hasRequiredNodeExternalApi = 1;
  const childProcess = require$$1$5;
  const os2 = require$$1$3;
  const path2 = require$$1$1;
  const packageJson2 = requirePackageJson();
  class NodeExternalApi {
    constructor() {
      __publicField(this, "appName");
      __publicField(this, "appPackageJson");
      __publicField(this, "platform", process.platform);
    }
    getAppLogPath(appName = this.getAppName()) {
      if (this.platform === "darwin") {
        return path2.join(this.getSystemPathHome(), "Library/Logs", appName);
      }
      return path2.join(this.getAppUserDataPath(appName), "logs");
    }
    getAppName() {
      var _a;
      const appName = this.appName || ((_a = this.getAppPackageJson()) == null ? void 0 : _a.name);
      if (!appName) {
        throw new Error(
          "electron-log can't determine the app name. It tried these methods:\n1. Use `electron.app.name`\n2. Use productName or name from the nearest package.json`\nYou can also set it through log.transports.file.setAppName()"
        );
      }
      return appName;
    }
    /**
     * @private
     * @returns {undefined}
     */
    getAppPackageJson() {
      if (typeof this.appPackageJson !== "object") {
        this.appPackageJson = packageJson2.findAndReadPackageJson();
      }
      return this.appPackageJson;
    }
    getAppUserDataPath(appName = this.getAppName()) {
      return appName ? path2.join(this.getSystemPathAppData(), appName) : void 0;
    }
    getAppVersion() {
      var _a;
      return (_a = this.getAppPackageJson()) == null ? void 0 : _a.version;
    }
    getElectronLogPath() {
      return this.getAppLogPath();
    }
    getMacOsVersion() {
      const release = Number(os2.release().split(".")[0]);
      if (release <= 19) {
        return `10.${release - 4}`;
      }
      return release - 9;
    }
    /**
     * @protected
     * @returns {string}
     */
    getOsVersion() {
      let osName = os2.type().replace("_", " ");
      let osVersion = os2.release();
      if (osName === "Darwin") {
        osName = "macOS";
        osVersion = this.getMacOsVersion();
      }
      return `${osName} ${osVersion}`;
    }
    /**
     * @return {PathVariables}
     */
    getPathVariables() {
      const appName = this.getAppName();
      const appVersion = this.getAppVersion();
      const self2 = this;
      return {
        appData: this.getSystemPathAppData(),
        appName,
        appVersion,
        get electronDefaultDir() {
          return self2.getElectronLogPath();
        },
        home: this.getSystemPathHome(),
        libraryDefaultDir: this.getAppLogPath(appName),
        libraryTemplate: this.getAppLogPath("{appName}"),
        temp: this.getSystemPathTemp(),
        userData: this.getAppUserDataPath(appName)
      };
    }
    getSystemPathAppData() {
      const home = this.getSystemPathHome();
      switch (this.platform) {
        case "darwin": {
          return path2.join(home, "Library/Application Support");
        }
        case "win32": {
          return process.env.APPDATA || path2.join(home, "AppData/Roaming");
        }
        default: {
          return process.env.XDG_CONFIG_HOME || path2.join(home, ".config");
        }
      }
    }
    getSystemPathHome() {
      var _a;
      return ((_a = os2.homedir) == null ? void 0 : _a.call(os2)) || process.env.HOME;
    }
    getSystemPathTemp() {
      return os2.tmpdir();
    }
    getVersions() {
      return {
        app: `${this.getAppName()} ${this.getAppVersion()}`,
        electron: void 0,
        os: this.getOsVersion()
      };
    }
    isDev() {
      return process.env.NODE_ENV === "development" || process.env.ELECTRON_IS_DEV === "1";
    }
    isElectron() {
      return Boolean(process.versions.electron);
    }
    onAppEvent(_eventName, _handler) {
    }
    onAppReady(handler) {
      handler();
    }
    onEveryWebContentsEvent(eventName, handler) {
    }
    /**
     * Listen to async messages sent from opposite process
     * @param {string} channel
     * @param {function} listener
     */
    onIpc(channel, listener) {
    }
    onIpcInvoke(channel, listener) {
    }
    /**
     * @param {string} url
     * @param {Function} [logFunction]
     */
    openUrl(url2, logFunction = console.error) {
      const startMap = { darwin: "open", win32: "start", linux: "xdg-open" };
      const start = startMap[process.platform] || "xdg-open";
      childProcess.exec(`${start} ${url2}`, {}, (err) => {
        if (err) {
          logFunction(err);
        }
      });
    }
    setAppName(appName) {
      this.appName = appName;
    }
    setPlatform(platform2) {
      this.platform = platform2;
    }
    setPreloadFileForSessions({
      filePath,
      // eslint-disable-line no-unused-vars
      includeFutureSession = true,
      // eslint-disable-line no-unused-vars
      getSessions = () => []
      // eslint-disable-line no-unused-vars
    }) {
    }
    /**
     * Sent a message to opposite process
     * @param {string} channel
     * @param {any} message
     */
    sendIpc(channel, message) {
    }
    showErrorBox(title, message) {
    }
  }
  NodeExternalApi_1 = NodeExternalApi;
  return NodeExternalApi_1;
}
var ElectronExternalApi_1;
var hasRequiredElectronExternalApi;
function requireElectronExternalApi() {
  if (hasRequiredElectronExternalApi) return ElectronExternalApi_1;
  hasRequiredElectronExternalApi = 1;
  const path2 = require$$1$1;
  const NodeExternalApi = requireNodeExternalApi();
  class ElectronExternalApi extends NodeExternalApi {
    /**
     * @param {object} options
     * @param {typeof Electron} [options.electron]
     */
    constructor({ electron } = {}) {
      super();
      /**
       * @type {typeof Electron}
       */
      __publicField(this, "electron");
      this.electron = electron;
    }
    getAppName() {
      var _a, _b;
      let appName;
      try {
        appName = this.appName || ((_a = this.electron.app) == null ? void 0 : _a.name) || ((_b = this.electron.app) == null ? void 0 : _b.getName());
      } catch {
      }
      return appName || super.getAppName();
    }
    getAppUserDataPath(appName) {
      return this.getPath("userData") || super.getAppUserDataPath(appName);
    }
    getAppVersion() {
      var _a;
      let appVersion;
      try {
        appVersion = (_a = this.electron.app) == null ? void 0 : _a.getVersion();
      } catch {
      }
      return appVersion || super.getAppVersion();
    }
    getElectronLogPath() {
      return this.getPath("logs") || super.getElectronLogPath();
    }
    /**
     * @private
     * @param {any} name
     * @returns {string|undefined}
     */
    getPath(name) {
      var _a;
      try {
        return (_a = this.electron.app) == null ? void 0 : _a.getPath(name);
      } catch {
        return void 0;
      }
    }
    getVersions() {
      return {
        app: `${this.getAppName()} ${this.getAppVersion()}`,
        electron: `Electron ${process.versions.electron}`,
        os: this.getOsVersion()
      };
    }
    getSystemPathAppData() {
      return this.getPath("appData") || super.getSystemPathAppData();
    }
    isDev() {
      var _a;
      if (((_a = this.electron.app) == null ? void 0 : _a.isPackaged) !== void 0) {
        return !this.electron.app.isPackaged;
      }
      if (typeof process.execPath === "string") {
        const execFileName = path2.basename(process.execPath).toLowerCase();
        return execFileName.startsWith("electron");
      }
      return super.isDev();
    }
    onAppEvent(eventName, handler) {
      var _a;
      (_a = this.electron.app) == null ? void 0 : _a.on(eventName, handler);
      return () => {
        var _a2;
        (_a2 = this.electron.app) == null ? void 0 : _a2.off(eventName, handler);
      };
    }
    onAppReady(handler) {
      var _a, _b, _c;
      if ((_a = this.electron.app) == null ? void 0 : _a.isReady()) {
        handler();
      } else if ((_b = this.electron.app) == null ? void 0 : _b.once) {
        (_c = this.electron.app) == null ? void 0 : _c.once("ready", handler);
      } else {
        handler();
      }
    }
    onEveryWebContentsEvent(eventName, handler) {
      var _a, _b, _c;
      (_b = (_a = this.electron.webContents) == null ? void 0 : _a.getAllWebContents()) == null ? void 0 : _b.forEach((webContents) => {
        webContents.on(eventName, handler);
      });
      (_c = this.electron.app) == null ? void 0 : _c.on("web-contents-created", onWebContentsCreated);
      return () => {
        var _a2, _b2;
        (_a2 = this.electron.webContents) == null ? void 0 : _a2.getAllWebContents().forEach((webContents) => {
          webContents.off(eventName, handler);
        });
        (_b2 = this.electron.app) == null ? void 0 : _b2.off("web-contents-created", onWebContentsCreated);
      };
      function onWebContentsCreated(_, webContents) {
        webContents.on(eventName, handler);
      }
    }
    /**
     * Listen to async messages sent from opposite process
     * @param {string} channel
     * @param {function} listener
     */
    onIpc(channel, listener) {
      var _a;
      (_a = this.electron.ipcMain) == null ? void 0 : _a.on(channel, listener);
    }
    onIpcInvoke(channel, listener) {
      var _a, _b;
      (_b = (_a = this.electron.ipcMain) == null ? void 0 : _a.handle) == null ? void 0 : _b.call(_a, channel, listener);
    }
    /**
     * @param {string} url
     * @param {Function} [logFunction]
     */
    openUrl(url2, logFunction = console.error) {
      var _a;
      (_a = this.electron.shell) == null ? void 0 : _a.openExternal(url2).catch(logFunction);
    }
    setPreloadFileForSessions({
      filePath,
      includeFutureSession = true,
      getSessions = () => {
        var _a;
        return [(_a = this.electron.session) == null ? void 0 : _a.defaultSession];
      }
    }) {
      for (const session of getSessions().filter(Boolean)) {
        setPreload(session);
      }
      if (includeFutureSession) {
        this.onAppEvent("session-created", (session) => {
          setPreload(session);
        });
      }
      function setPreload(session) {
        if (typeof session.registerPreloadScript === "function") {
          session.registerPreloadScript({
            filePath,
            id: "electron-log-preload",
            type: "frame"
          });
        } else {
          session.setPreloads([...session.getPreloads(), filePath]);
        }
      }
    }
    /**
     * Sent a message to opposite process
     * @param {string} channel
     * @param {any} message
     */
    sendIpc(channel, message) {
      var _a, _b;
      (_b = (_a = this.electron.BrowserWindow) == null ? void 0 : _a.getAllWindows()) == null ? void 0 : _b.forEach((wnd) => {
        var _a2, _b2;
        if (((_a2 = wnd.webContents) == null ? void 0 : _a2.isDestroyed()) === false && ((_b2 = wnd.webContents) == null ? void 0 : _b2.isCrashed()) === false) {
          wnd.webContents.send(channel, message);
        }
      });
    }
    showErrorBox(title, message) {
      var _a;
      (_a = this.electron.dialog) == null ? void 0 : _a.showErrorBox(title, message);
    }
  }
  ElectronExternalApi_1 = ElectronExternalApi;
  return ElectronExternalApi_1;
}
var initialize;
var hasRequiredInitialize;
function requireInitialize() {
  if (hasRequiredInitialize) return initialize;
  hasRequiredInitialize = 1;
  const fs2 = require$$1$2;
  const os2 = require$$1$3;
  const path2 = require$$1$1;
  const preloadInitializeFn = requireElectronLogPreload();
  initialize = {
    initialize({
      externalApi,
      getSessions,
      includeFutureSession,
      logger,
      preload = true,
      spyRendererConsole = false
    }) {
      externalApi.onAppReady(() => {
        try {
          if (preload) {
            initializePreload({
              externalApi,
              getSessions,
              includeFutureSession,
              preloadOption: preload
            });
          }
          if (spyRendererConsole) {
            initializeSpyRendererConsole({ externalApi, logger });
          }
        } catch (err) {
          logger.warn(err);
        }
      });
    }
  };
  function initializePreload({
    externalApi,
    getSessions,
    includeFutureSession,
    preloadOption
  }) {
    let preloadPath = typeof preloadOption === "string" ? preloadOption : void 0;
    try {
      preloadPath = path2.resolve(
        __dirname,
        "../renderer/electron-log-preload.js"
      );
    } catch {
    }
    if (!preloadPath || !fs2.existsSync(preloadPath)) {
      preloadPath = path2.join(
        externalApi.getAppUserDataPath() || os2.tmpdir(),
        "electron-log-preload.js"
      );
      const preloadCode = `
      try {
        (${preloadInitializeFn.toString()})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    `;
      fs2.writeFileSync(preloadPath, preloadCode, "utf8");
    }
    externalApi.setPreloadFileForSessions({
      filePath: preloadPath,
      includeFutureSession,
      getSessions
    });
  }
  function initializeSpyRendererConsole({ externalApi, logger }) {
    const levels = ["verbose", "info", "warning", "error"];
    externalApi.onEveryWebContentsEvent(
      "console-message",
      (event, level, message) => {
        logger.processMessage({
          data: [message],
          level: levels[level],
          variables: { processType: "renderer" }
        });
      }
    );
  }
  return initialize;
}
var ErrorHandler_1;
var hasRequiredErrorHandler;
function requireErrorHandler() {
  if (hasRequiredErrorHandler) return ErrorHandler_1;
  hasRequiredErrorHandler = 1;
  class ErrorHandler {
    constructor({
      externalApi,
      logFn = void 0,
      onError = void 0,
      showDialog = void 0
    } = {}) {
      __publicField(this, "externalApi");
      __publicField(this, "isActive", false);
      __publicField(this, "logFn");
      __publicField(this, "onError");
      __publicField(this, "showDialog", true);
      this.createIssue = this.createIssue.bind(this);
      this.handleError = this.handleError.bind(this);
      this.handleRejection = this.handleRejection.bind(this);
      this.setOptions({ externalApi, logFn, onError, showDialog });
      this.startCatching = this.startCatching.bind(this);
      this.stopCatching = this.stopCatching.bind(this);
    }
    handle(error2, {
      logFn = this.logFn,
      onError = this.onError,
      processType = "browser",
      showDialog = this.showDialog,
      errorName = ""
    } = {}) {
      var _a;
      error2 = normalizeError(error2);
      try {
        if (typeof onError === "function") {
          const versions = ((_a = this.externalApi) == null ? void 0 : _a.getVersions()) || {};
          const createIssue = this.createIssue;
          const result = onError({
            createIssue,
            error: error2,
            errorName,
            processType,
            versions
          });
          if (result === false) {
            return;
          }
        }
        errorName ? logFn(errorName, error2) : logFn(error2);
        if (showDialog && !errorName.includes("rejection") && this.externalApi) {
          this.externalApi.showErrorBox(
            `A JavaScript error occurred in the ${processType} process`,
            error2.stack
          );
        }
      } catch {
        console.error(error2);
      }
    }
    setOptions({ externalApi, logFn, onError, showDialog }) {
      if (typeof externalApi === "object") {
        this.externalApi = externalApi;
      }
      if (typeof logFn === "function") {
        this.logFn = logFn;
      }
      if (typeof onError === "function") {
        this.onError = onError;
      }
      if (typeof showDialog === "boolean") {
        this.showDialog = showDialog;
      }
    }
    startCatching({ onError, showDialog } = {}) {
      if (this.isActive) {
        return;
      }
      this.isActive = true;
      this.setOptions({ onError, showDialog });
      process.on("uncaughtException", this.handleError);
      process.on("unhandledRejection", this.handleRejection);
    }
    stopCatching() {
      this.isActive = false;
      process.removeListener("uncaughtException", this.handleError);
      process.removeListener("unhandledRejection", this.handleRejection);
    }
    createIssue(pageUrl, queryParams) {
      var _a;
      (_a = this.externalApi) == null ? void 0 : _a.openUrl(
        `${pageUrl}?${new URLSearchParams(queryParams).toString()}`
      );
    }
    handleError(error2) {
      this.handle(error2, { errorName: "Unhandled" });
    }
    handleRejection(reason) {
      const error2 = reason instanceof Error ? reason : new Error(JSON.stringify(reason));
      this.handle(error2, { errorName: "Unhandled rejection" });
    }
  }
  function normalizeError(e) {
    if (e instanceof Error) {
      return e;
    }
    if (e && typeof e === "object") {
      if (e.message) {
        return Object.assign(new Error(e.message), e);
      }
      try {
        return new Error(JSON.stringify(e));
      } catch (serErr) {
        return new Error(`Couldn't normalize error ${String(e)}: ${serErr}`);
      }
    }
    return new Error(`Can't normalize error ${String(e)}`);
  }
  ErrorHandler_1 = ErrorHandler;
  return ErrorHandler_1;
}
var EventLogger_1;
var hasRequiredEventLogger;
function requireEventLogger() {
  if (hasRequiredEventLogger) return EventLogger_1;
  hasRequiredEventLogger = 1;
  class EventLogger {
    constructor(options = {}) {
      __publicField(this, "disposers", []);
      __publicField(this, "format", "{eventSource}#{eventName}:");
      __publicField(this, "formatters", {
        app: {
          "certificate-error": ({ args }) => {
            return this.arrayToObject(args.slice(1, 4), [
              "url",
              "error",
              "certificate"
            ]);
          },
          "child-process-gone": ({ args }) => {
            return args.length === 1 ? args[0] : args;
          },
          "render-process-gone": ({ args: [webContents, details] }) => {
            return details && typeof details === "object" ? { ...details, ...this.getWebContentsDetails(webContents) } : [];
          }
        },
        webContents: {
          "console-message": ({ args: [level, message, line, sourceId] }) => {
            if (level < 3) {
              return void 0;
            }
            return { message, source: `${sourceId}:${line}` };
          },
          "did-fail-load": ({ args }) => {
            return this.arrayToObject(args, [
              "errorCode",
              "errorDescription",
              "validatedURL",
              "isMainFrame",
              "frameProcessId",
              "frameRoutingId"
            ]);
          },
          "did-fail-provisional-load": ({ args }) => {
            return this.arrayToObject(args, [
              "errorCode",
              "errorDescription",
              "validatedURL",
              "isMainFrame",
              "frameProcessId",
              "frameRoutingId"
            ]);
          },
          "plugin-crashed": ({ args }) => {
            return this.arrayToObject(args, ["name", "version"]);
          },
          "preload-error": ({ args }) => {
            return this.arrayToObject(args, ["preloadPath", "error"]);
          }
        }
      });
      __publicField(this, "events", {
        app: {
          "certificate-error": true,
          "child-process-gone": true,
          "render-process-gone": true
        },
        webContents: {
          // 'console-message': true,
          "did-fail-load": true,
          "did-fail-provisional-load": true,
          "plugin-crashed": true,
          "preload-error": true,
          "unresponsive": true
        }
      });
      __publicField(this, "externalApi");
      __publicField(this, "level", "error");
      __publicField(this, "scope", "");
      this.setOptions(options);
    }
    setOptions({
      events: events2,
      externalApi,
      level,
      logger,
      format: format2,
      formatters,
      scope: scope2
    }) {
      if (typeof events2 === "object") {
        this.events = events2;
      }
      if (typeof externalApi === "object") {
        this.externalApi = externalApi;
      }
      if (typeof level === "string") {
        this.level = level;
      }
      if (typeof logger === "object") {
        this.logger = logger;
      }
      if (typeof format2 === "string" || typeof format2 === "function") {
        this.format = format2;
      }
      if (typeof formatters === "object") {
        this.formatters = formatters;
      }
      if (typeof scope2 === "string") {
        this.scope = scope2;
      }
    }
    startLogging(options = {}) {
      this.setOptions(options);
      this.disposeListeners();
      for (const eventName of this.getEventNames(this.events.app)) {
        this.disposers.push(
          this.externalApi.onAppEvent(eventName, (...handlerArgs) => {
            this.handleEvent({ eventSource: "app", eventName, handlerArgs });
          })
        );
      }
      for (const eventName of this.getEventNames(this.events.webContents)) {
        this.disposers.push(
          this.externalApi.onEveryWebContentsEvent(
            eventName,
            (...handlerArgs) => {
              this.handleEvent(
                { eventSource: "webContents", eventName, handlerArgs }
              );
            }
          )
        );
      }
    }
    stopLogging() {
      this.disposeListeners();
    }
    arrayToObject(array, fieldNames) {
      const obj = {};
      fieldNames.forEach((fieldName, index) => {
        obj[fieldName] = array[index];
      });
      if (array.length > fieldNames.length) {
        obj.unknownArgs = array.slice(fieldNames.length);
      }
      return obj;
    }
    disposeListeners() {
      this.disposers.forEach((disposer) => disposer());
      this.disposers = [];
    }
    formatEventLog({ eventName, eventSource, handlerArgs }) {
      var _a;
      const [event, ...args] = handlerArgs;
      if (typeof this.format === "function") {
        return this.format({ args, event, eventName, eventSource });
      }
      const formatter = (_a = this.formatters[eventSource]) == null ? void 0 : _a[eventName];
      let formattedArgs = args;
      if (typeof formatter === "function") {
        formattedArgs = formatter({ args, event, eventName, eventSource });
      }
      if (!formattedArgs) {
        return void 0;
      }
      const eventData = {};
      if (Array.isArray(formattedArgs)) {
        eventData.args = formattedArgs;
      } else if (typeof formattedArgs === "object") {
        Object.assign(eventData, formattedArgs);
      }
      if (eventSource === "webContents") {
        Object.assign(eventData, this.getWebContentsDetails(event == null ? void 0 : event.sender));
      }
      const title = this.format.replace("{eventSource}", eventSource === "app" ? "App" : "WebContents").replace("{eventName}", eventName);
      return [title, eventData];
    }
    getEventNames(eventMap) {
      if (!eventMap || typeof eventMap !== "object") {
        return [];
      }
      return Object.entries(eventMap).filter(([_, listen]) => listen).map(([eventName]) => eventName);
    }
    getWebContentsDetails(webContents) {
      if (!(webContents == null ? void 0 : webContents.loadURL)) {
        return {};
      }
      try {
        return {
          webContents: {
            id: webContents.id,
            url: webContents.getURL()
          }
        };
      } catch {
        return {};
      }
    }
    handleEvent({ eventName, eventSource, handlerArgs }) {
      var _a;
      const log2 = this.formatEventLog({ eventName, eventSource, handlerArgs });
      if (log2) {
        const logFns = this.scope ? this.logger.scope(this.scope) : this.logger;
        (_a = logFns == null ? void 0 : logFns[this.level]) == null ? void 0 : _a.call(logFns, ...log2);
      }
    }
  }
  EventLogger_1 = EventLogger;
  return EventLogger_1;
}
var format;
var hasRequiredFormat;
function requireFormat() {
  if (hasRequiredFormat) return format;
  hasRequiredFormat = 1;
  const { transform } = requireTransform();
  format = {
    concatFirstStringElements,
    formatScope,
    formatText,
    formatVariables,
    timeZoneFromOffset,
    format({ message, logger, transport, data = message == null ? void 0 : message.data }) {
      switch (typeof transport.format) {
        case "string": {
          return transform({
            message,
            logger,
            transforms: [formatVariables, formatScope, formatText],
            transport,
            initialData: [transport.format, ...data]
          });
        }
        case "function": {
          return transport.format({
            data,
            level: (message == null ? void 0 : message.level) || "info",
            logger,
            message,
            transport
          });
        }
        default: {
          return data;
        }
      }
    }
  };
  function concatFirstStringElements({ data }) {
    if (typeof data[0] !== "string" || typeof data[1] !== "string") {
      return data;
    }
    if (data[0].match(/%[1cdfiOos]/)) {
      return data;
    }
    return [`${data[0]} ${data[1]}`, ...data.slice(2)];
  }
  function timeZoneFromOffset(minutesOffset) {
    const minutesPositive = Math.abs(minutesOffset);
    const sign3 = minutesOffset > 0 ? "-" : "+";
    const hours = Math.floor(minutesPositive / 60).toString().padStart(2, "0");
    const minutes = (minutesPositive % 60).toString().padStart(2, "0");
    return `${sign3}${hours}:${minutes}`;
  }
  function formatScope({ data, logger, message }) {
    const { defaultLabel, labelLength } = (logger == null ? void 0 : logger.scope) || {};
    const template = data[0];
    let label = message.scope;
    if (!label) {
      label = defaultLabel;
    }
    let scopeText;
    if (label === "") {
      scopeText = labelLength > 0 ? "".padEnd(labelLength + 3) : "";
    } else if (typeof label === "string") {
      scopeText = ` (${label})`.padEnd(labelLength + 3);
    } else {
      scopeText = "";
    }
    data[0] = template.replace("{scope}", scopeText);
    return data;
  }
  function formatVariables({ data, message }) {
    let template = data[0];
    if (typeof template !== "string") {
      return data;
    }
    template = template.replace("{level}]", `${message.level}]`.padEnd(6, " "));
    const date = message.date || /* @__PURE__ */ new Date();
    data[0] = template.replace(/\{(\w+)}/g, (substring, name) => {
      var _a;
      switch (name) {
        case "level":
          return message.level || "info";
        case "logId":
          return message.logId;
        case "y":
          return date.getFullYear().toString(10);
        case "m":
          return (date.getMonth() + 1).toString(10).padStart(2, "0");
        case "d":
          return date.getDate().toString(10).padStart(2, "0");
        case "h":
          return date.getHours().toString(10).padStart(2, "0");
        case "i":
          return date.getMinutes().toString(10).padStart(2, "0");
        case "s":
          return date.getSeconds().toString(10).padStart(2, "0");
        case "ms":
          return date.getMilliseconds().toString(10).padStart(3, "0");
        case "z":
          return timeZoneFromOffset(date.getTimezoneOffset());
        case "iso":
          return date.toISOString();
        default: {
          return ((_a = message.variables) == null ? void 0 : _a[name]) || substring;
        }
      }
    }).trim();
    return data;
  }
  function formatText({ data }) {
    const template = data[0];
    if (typeof template !== "string") {
      return data;
    }
    const textTplPosition = template.lastIndexOf("{text}");
    if (textTplPosition === template.length - 6) {
      data[0] = template.replace(/\s?{text}/, "");
      if (data[0] === "") {
        data.shift();
      }
      return data;
    }
    const templatePieces = template.split("{text}");
    let result = [];
    if (templatePieces[0] !== "") {
      result.push(templatePieces[0]);
    }
    result = result.concat(data.slice(1));
    if (templatePieces[1] !== "") {
      result.push(templatePieces[1]);
    }
    return result;
  }
  return format;
}
var object = { exports: {} };
var hasRequiredObject;
function requireObject() {
  if (hasRequiredObject) return object.exports;
  hasRequiredObject = 1;
  (function(module2) {
    const util2 = require$$1;
    module2.exports = {
      serialize,
      maxDepth({ data, transport, depth = (transport == null ? void 0 : transport.depth) ?? 6 }) {
        if (!data) {
          return data;
        }
        if (depth < 1) {
          if (Array.isArray(data)) return "[array]";
          if (typeof data === "object" && data) return "[object]";
          return data;
        }
        if (Array.isArray(data)) {
          return data.map((child) => module2.exports.maxDepth({
            data: child,
            depth: depth - 1
          }));
        }
        if (typeof data !== "object") {
          return data;
        }
        if (data && typeof data.toISOString === "function") {
          return data;
        }
        if (data === null) {
          return null;
        }
        if (data instanceof Error) {
          return data;
        }
        const newJson = {};
        for (const i in data) {
          if (!Object.prototype.hasOwnProperty.call(data, i)) continue;
          newJson[i] = module2.exports.maxDepth({
            data: data[i],
            depth: depth - 1
          });
        }
        return newJson;
      },
      toJSON({ data }) {
        return JSON.parse(JSON.stringify(data, createSerializer()));
      },
      toString({ data, transport }) {
        const inspectOptions = (transport == null ? void 0 : transport.inspectOptions) || {};
        const simplifiedData = data.map((item) => {
          if (item === void 0) {
            return void 0;
          }
          try {
            const str2 = JSON.stringify(item, createSerializer(), "  ");
            return str2 === void 0 ? void 0 : JSON.parse(str2);
          } catch (e) {
            return item;
          }
        });
        return util2.formatWithOptions(inspectOptions, ...simplifiedData);
      }
    };
    function createSerializer(options = {}) {
      const seen = /* @__PURE__ */ new WeakSet();
      return function(key, value) {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return void 0;
          }
          seen.add(value);
        }
        return serialize(key, value, options);
      };
    }
    function serialize(key, value, options = {}) {
      const serializeMapAndSet = (options == null ? void 0 : options.serializeMapAndSet) !== false;
      if (value instanceof Error) {
        return value.stack;
      }
      if (!value) {
        return value;
      }
      if (typeof value === "function") {
        return `[function] ${value.toString()}`;
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (serializeMapAndSet && value instanceof Map && Object.fromEntries) {
        return Object.fromEntries(value);
      }
      if (serializeMapAndSet && value instanceof Set && Array.from) {
        return Array.from(value);
      }
      return value;
    }
  })(object);
  return object.exports;
}
var style;
var hasRequiredStyle;
function requireStyle() {
  if (hasRequiredStyle) return style;
  hasRequiredStyle = 1;
  style = {
    transformStyles,
    applyAnsiStyles({ data }) {
      return transformStyles(data, styleToAnsi, resetAnsiStyle);
    },
    removeStyles({ data }) {
      return transformStyles(data, () => "");
    }
  };
  const ANSI_COLORS = {
    unset: "\x1B[0m",
    black: "\x1B[30m",
    red: "\x1B[31m",
    green: "\x1B[32m",
    yellow: "\x1B[33m",
    blue: "\x1B[34m",
    magenta: "\x1B[35m",
    cyan: "\x1B[36m",
    white: "\x1B[37m"
  };
  function styleToAnsi(style2) {
    const color = style2.replace(/color:\s*(\w+).*/, "$1").toLowerCase();
    return ANSI_COLORS[color] || "";
  }
  function resetAnsiStyle(string) {
    return string + ANSI_COLORS.unset;
  }
  function transformStyles(data, onStyleFound, onStyleApplied) {
    const foundStyles = {};
    return data.reduce((result, item, index, array) => {
      if (foundStyles[index]) {
        return result;
      }
      if (typeof item === "string") {
        let valueIndex = index;
        let styleApplied = false;
        item = item.replace(/%[1cdfiOos]/g, (match) => {
          valueIndex += 1;
          if (match !== "%c") {
            return match;
          }
          const style2 = array[valueIndex];
          if (typeof style2 === "string") {
            foundStyles[valueIndex] = true;
            styleApplied = true;
            return onStyleFound(style2, item);
          }
          return match;
        });
        if (styleApplied && onStyleApplied) {
          item = onStyleApplied(item);
        }
      }
      result.push(item);
      return result;
    }, []);
  }
  return style;
}
var console_1;
var hasRequiredConsole;
function requireConsole() {
  if (hasRequiredConsole) return console_1;
  hasRequiredConsole = 1;
  const {
    concatFirstStringElements,
    format: format2
  } = requireFormat();
  const { maxDepth, toJSON: toJSON2 } = requireObject();
  const {
    applyAnsiStyles,
    removeStyles
  } = requireStyle();
  const { transform } = requireTransform();
  const consoleMethods = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    verbose: console.info,
    debug: console.debug,
    silly: console.debug,
    log: console.log
  };
  console_1 = consoleTransportFactory;
  const separator = process.platform === "win32" ? ">" : "›";
  const DEFAULT_FORMAT = `%c{h}:{i}:{s}.{ms}{scope}%c ${separator} {text}`;
  Object.assign(consoleTransportFactory, {
    DEFAULT_FORMAT
  });
  function consoleTransportFactory(logger) {
    return Object.assign(transport, {
      format: DEFAULT_FORMAT,
      level: "silly",
      transforms: [
        addTemplateColors,
        format2,
        formatStyles,
        concatFirstStringElements,
        maxDepth,
        toJSON2
      ],
      useStyles: process.env.FORCE_STYLES,
      writeFn({ message }) {
        const consoleLogFn = consoleMethods[message.level] || consoleMethods.info;
        consoleLogFn(...message.data);
      }
    });
    function transport(message) {
      const data = transform({ logger, message, transport });
      transport.writeFn({
        message: { ...message, data }
      });
    }
  }
  function addTemplateColors({ data, message, transport }) {
    if (transport.format !== DEFAULT_FORMAT) {
      return data;
    }
    return [`color:${levelToStyle(message.level)}`, "color:unset", ...data];
  }
  function canUseStyles(useStyleValue, level) {
    if (typeof useStyleValue === "boolean") {
      return useStyleValue;
    }
    const useStderr = level === "error" || level === "warn";
    const stream2 = useStderr ? process.stderr : process.stdout;
    return stream2 && stream2.isTTY;
  }
  function formatStyles(args) {
    const { message, transport } = args;
    const useStyles = canUseStyles(transport.useStyles, message.level);
    const nextTransform = useStyles ? applyAnsiStyles : removeStyles;
    return nextTransform(args);
  }
  function levelToStyle(level) {
    const map2 = { error: "red", warn: "yellow", info: "cyan", default: "unset" };
    return map2[level] || map2.default;
  }
  return console_1;
}
var File_1;
var hasRequiredFile$1;
function requireFile$1() {
  if (hasRequiredFile$1) return File_1;
  hasRequiredFile$1 = 1;
  const EventEmitter = require$$0$4;
  const fs2 = require$$1$2;
  const os2 = require$$1$3;
  class File extends EventEmitter {
    constructor({
      path: path2,
      writeOptions = { encoding: "utf8", flag: "a", mode: 438 },
      writeAsync = false
    }) {
      super();
      __publicField(this, "asyncWriteQueue", []);
      __publicField(this, "bytesWritten", 0);
      __publicField(this, "hasActiveAsyncWriting", false);
      __publicField(this, "path", null);
      __publicField(this, "initialSize");
      __publicField(this, "writeOptions", null);
      __publicField(this, "writeAsync", false);
      this.path = path2;
      this.writeOptions = writeOptions;
      this.writeAsync = writeAsync;
    }
    get size() {
      return this.getSize();
    }
    clear() {
      try {
        fs2.writeFileSync(this.path, "", {
          mode: this.writeOptions.mode,
          flag: "w"
        });
        this.reset();
        return true;
      } catch (e) {
        if (e.code === "ENOENT") {
          return true;
        }
        this.emit("error", e, this);
        return false;
      }
    }
    crop(bytesAfter) {
      try {
        const content = readFileSyncFromEnd(this.path, bytesAfter || 4096);
        this.clear();
        this.writeLine(`[log cropped]${os2.EOL}${content}`);
      } catch (e) {
        this.emit(
          "error",
          new Error(`Couldn't crop file ${this.path}. ${e.message}`),
          this
        );
      }
    }
    getSize() {
      if (this.initialSize === void 0) {
        try {
          const stats = fs2.statSync(this.path);
          this.initialSize = stats.size;
        } catch (e) {
          this.initialSize = 0;
        }
      }
      return this.initialSize + this.bytesWritten;
    }
    increaseBytesWrittenCounter(text) {
      this.bytesWritten += Buffer.byteLength(text, this.writeOptions.encoding);
    }
    isNull() {
      return false;
    }
    nextAsyncWrite() {
      const file2 = this;
      if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0) {
        return;
      }
      const text = this.asyncWriteQueue.join("");
      this.asyncWriteQueue = [];
      this.hasActiveAsyncWriting = true;
      fs2.writeFile(this.path, text, this.writeOptions, (e) => {
        file2.hasActiveAsyncWriting = false;
        if (e) {
          file2.emit(
            "error",
            new Error(`Couldn't write to ${file2.path}. ${e.message}`),
            this
          );
        } else {
          file2.increaseBytesWrittenCounter(text);
        }
        file2.nextAsyncWrite();
      });
    }
    reset() {
      this.initialSize = void 0;
      this.bytesWritten = 0;
    }
    toString() {
      return this.path;
    }
    writeLine(text) {
      text += os2.EOL;
      if (this.writeAsync) {
        this.asyncWriteQueue.push(text);
        this.nextAsyncWrite();
        return;
      }
      try {
        fs2.writeFileSync(this.path, text, this.writeOptions);
        this.increaseBytesWrittenCounter(text);
      } catch (e) {
        this.emit(
          "error",
          new Error(`Couldn't write to ${this.path}. ${e.message}`),
          this
        );
      }
    }
  }
  File_1 = File;
  function readFileSyncFromEnd(filePath, bytesCount) {
    const buffer = Buffer.alloc(bytesCount);
    const stats = fs2.statSync(filePath);
    const readLength = Math.min(stats.size, bytesCount);
    const offset = Math.max(0, stats.size - bytesCount);
    const fd = fs2.openSync(filePath, "r");
    const totalBytes = fs2.readSync(fd, buffer, 0, readLength, offset);
    fs2.closeSync(fd);
    return buffer.toString("utf8", 0, totalBytes);
  }
  return File_1;
}
var NullFile_1;
var hasRequiredNullFile;
function requireNullFile() {
  if (hasRequiredNullFile) return NullFile_1;
  hasRequiredNullFile = 1;
  const File = requireFile$1();
  class NullFile extends File {
    clear() {
    }
    crop() {
    }
    getSize() {
      return 0;
    }
    isNull() {
      return true;
    }
    writeLine() {
    }
  }
  NullFile_1 = NullFile;
  return NullFile_1;
}
var FileRegistry_1;
var hasRequiredFileRegistry;
function requireFileRegistry() {
  if (hasRequiredFileRegistry) return FileRegistry_1;
  hasRequiredFileRegistry = 1;
  const EventEmitter = require$$0$4;
  const fs2 = require$$1$2;
  const path2 = require$$1$1;
  const File = requireFile$1();
  const NullFile = requireNullFile();
  class FileRegistry extends EventEmitter {
    constructor() {
      super();
      __publicField(this, "store", {});
      this.emitError = this.emitError.bind(this);
    }
    /**
     * Provide a File object corresponding to the filePath
     * @param {string} filePath
     * @param {WriteOptions} [writeOptions]
     * @param {boolean} [writeAsync]
     * @return {File}
     */
    provide({ filePath, writeOptions = {}, writeAsync = false }) {
      let file2;
      try {
        filePath = path2.resolve(filePath);
        if (this.store[filePath]) {
          return this.store[filePath];
        }
        file2 = this.createFile({ filePath, writeOptions, writeAsync });
      } catch (e) {
        file2 = new NullFile({ path: filePath });
        this.emitError(e, file2);
      }
      file2.on("error", this.emitError);
      this.store[filePath] = file2;
      return file2;
    }
    /**
     * @param {string} filePath
     * @param {WriteOptions} writeOptions
     * @param {boolean} async
     * @return {File}
     * @private
     */
    createFile({ filePath, writeOptions, writeAsync }) {
      this.testFileWriting({ filePath, writeOptions });
      return new File({ path: filePath, writeOptions, writeAsync });
    }
    /**
     * @param {Error} error
     * @param {File} file
     * @private
     */
    emitError(error2, file2) {
      this.emit("error", error2, file2);
    }
    /**
     * @param {string} filePath
     * @param {WriteOptions} writeOptions
     * @private
     */
    testFileWriting({ filePath, writeOptions }) {
      fs2.mkdirSync(path2.dirname(filePath), { recursive: true });
      fs2.writeFileSync(filePath, "", { flag: "a", mode: writeOptions.mode });
    }
  }
  FileRegistry_1 = FileRegistry;
  return FileRegistry_1;
}
var file;
var hasRequiredFile;
function requireFile() {
  if (hasRequiredFile) return file;
  hasRequiredFile = 1;
  const fs2 = require$$1$2;
  const os2 = require$$1$3;
  const path2 = require$$1$1;
  const FileRegistry = requireFileRegistry();
  const { transform } = requireTransform();
  const { removeStyles } = requireStyle();
  const {
    format: format2,
    concatFirstStringElements
  } = requireFormat();
  const { toString: toString4 } = requireObject();
  file = fileTransportFactory;
  const globalRegistry = new FileRegistry();
  function fileTransportFactory(logger, { registry = globalRegistry, externalApi } = {}) {
    let pathVariables;
    if (registry.listenerCount("error") < 1) {
      registry.on("error", (e, file2) => {
        logConsole(`Can't write to ${file2}`, e);
      });
    }
    return Object.assign(transport, {
      fileName: getDefaultFileName(logger.variables.processType),
      format: "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",
      getFile,
      inspectOptions: { depth: 5 },
      level: "silly",
      maxSize: 1024 ** 2,
      readAllLogs,
      sync: true,
      transforms: [removeStyles, format2, concatFirstStringElements, toString4],
      writeOptions: { flag: "a", mode: 438, encoding: "utf8" },
      archiveLogFn(file2) {
        const oldPath = file2.toString();
        const inf = path2.parse(oldPath);
        try {
          fs2.renameSync(oldPath, path2.join(inf.dir, `${inf.name}.old${inf.ext}`));
        } catch (e) {
          logConsole("Could not rotate log", e);
          const quarterOfMaxSize = Math.round(transport.maxSize / 4);
          file2.crop(Math.min(quarterOfMaxSize, 256 * 1024));
        }
      },
      resolvePathFn(vars) {
        return path2.join(vars.libraryDefaultDir, vars.fileName);
      },
      setAppName(name) {
        logger.dependencies.externalApi.setAppName(name);
      }
    });
    function transport(message) {
      const file2 = getFile(message);
      const needLogRotation = transport.maxSize > 0 && file2.size > transport.maxSize;
      if (needLogRotation) {
        transport.archiveLogFn(file2);
        file2.reset();
      }
      const content = transform({ logger, message, transport });
      file2.writeLine(content);
    }
    function initializeOnFirstAccess() {
      if (pathVariables) {
        return;
      }
      pathVariables = Object.create(
        Object.prototype,
        {
          ...Object.getOwnPropertyDescriptors(
            externalApi.getPathVariables()
          ),
          fileName: {
            get() {
              return transport.fileName;
            },
            enumerable: true
          }
        }
      );
      if (typeof transport.archiveLog === "function") {
        transport.archiveLogFn = transport.archiveLog;
        logConsole("archiveLog is deprecated. Use archiveLogFn instead");
      }
      if (typeof transport.resolvePath === "function") {
        transport.resolvePathFn = transport.resolvePath;
        logConsole("resolvePath is deprecated. Use resolvePathFn instead");
      }
    }
    function logConsole(message, error2 = null, level = "error") {
      const data = [`electron-log.transports.file: ${message}`];
      if (error2) {
        data.push(error2);
      }
      logger.transports.console({ data, date: /* @__PURE__ */ new Date(), level });
    }
    function getFile(msg) {
      initializeOnFirstAccess();
      const filePath = transport.resolvePathFn(pathVariables, msg);
      return registry.provide({
        filePath,
        writeAsync: !transport.sync,
        writeOptions: transport.writeOptions
      });
    }
    function readAllLogs({ fileFilter = (f) => f.endsWith(".log") } = {}) {
      initializeOnFirstAccess();
      const logsPath = path2.dirname(transport.resolvePathFn(pathVariables));
      if (!fs2.existsSync(logsPath)) {
        return [];
      }
      return fs2.readdirSync(logsPath).map((fileName) => path2.join(logsPath, fileName)).filter(fileFilter).map((logPath) => {
        try {
          return {
            path: logPath,
            lines: fs2.readFileSync(logPath, "utf8").split(os2.EOL)
          };
        } catch {
          return null;
        }
      }).filter(Boolean);
    }
  }
  function getDefaultFileName(processType = process.type) {
    switch (processType) {
      case "renderer":
        return "renderer.log";
      case "worker":
        return "worker.log";
      default:
        return "main.log";
    }
  }
  return file;
}
var ipc;
var hasRequiredIpc;
function requireIpc() {
  if (hasRequiredIpc) return ipc;
  hasRequiredIpc = 1;
  const { maxDepth, toJSON: toJSON2 } = requireObject();
  const { transform } = requireTransform();
  ipc = ipcTransportFactory;
  function ipcTransportFactory(logger, { externalApi }) {
    Object.assign(transport, {
      depth: 3,
      eventId: "__ELECTRON_LOG_IPC__",
      level: logger.isDev ? "silly" : false,
      transforms: [toJSON2, maxDepth]
    });
    return (externalApi == null ? void 0 : externalApi.isElectron()) ? transport : void 0;
    function transport(message) {
      var _a;
      if (((_a = message == null ? void 0 : message.variables) == null ? void 0 : _a.processType) === "renderer") {
        return;
      }
      externalApi == null ? void 0 : externalApi.sendIpc(transport.eventId, {
        ...message,
        data: transform({ logger, message, transport })
      });
    }
  }
  return ipc;
}
var remote;
var hasRequiredRemote;
function requireRemote() {
  if (hasRequiredRemote) return remote;
  hasRequiredRemote = 1;
  const http2 = require$$3;
  const https2 = require$$4$1;
  const { transform } = requireTransform();
  const { removeStyles } = requireStyle();
  const { toJSON: toJSON2, maxDepth } = requireObject();
  remote = remoteTransportFactory;
  function remoteTransportFactory(logger) {
    return Object.assign(transport, {
      client: { name: "electron-application" },
      depth: 6,
      level: false,
      requestOptions: {},
      transforms: [removeStyles, toJSON2, maxDepth],
      makeBodyFn({ message }) {
        return JSON.stringify({
          client: transport.client,
          data: message.data,
          date: message.date.getTime(),
          level: message.level,
          scope: message.scope,
          variables: message.variables
        });
      },
      processErrorFn({ error: error2 }) {
        logger.processMessage(
          {
            data: [`electron-log: can't POST ${transport.url}`, error2],
            level: "warn"
          },
          { transports: ["console", "file"] }
        );
      },
      sendRequestFn({ serverUrl, requestOptions, body }) {
        const httpTransport = serverUrl.startsWith("https:") ? https2 : http2;
        const request = httpTransport.request(serverUrl, {
          method: "POST",
          ...requestOptions,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": body.length,
            ...requestOptions.headers
          }
        });
        request.write(body);
        request.end();
        return request;
      }
    });
    function transport(message) {
      if (!transport.url) {
        return;
      }
      const body = transport.makeBodyFn({
        logger,
        message: { ...message, data: transform({ logger, message, transport }) },
        transport
      });
      const request = transport.sendRequestFn({
        serverUrl: transport.url,
        requestOptions: transport.requestOptions,
        body: Buffer.from(body, "utf8")
      });
      request.on("error", (error2) => transport.processErrorFn({
        error: error2,
        logger,
        message,
        request,
        transport
      }));
    }
  }
  return remote;
}
var createDefaultLogger_1;
var hasRequiredCreateDefaultLogger;
function requireCreateDefaultLogger() {
  if (hasRequiredCreateDefaultLogger) return createDefaultLogger_1;
  hasRequiredCreateDefaultLogger = 1;
  const Logger = requireLogger();
  const ErrorHandler = requireErrorHandler();
  const EventLogger = requireEventLogger();
  const transportConsole = requireConsole();
  const transportFile = requireFile();
  const transportIpc = requireIpc();
  const transportRemote = requireRemote();
  createDefaultLogger_1 = createDefaultLogger;
  function createDefaultLogger({ dependencies, initializeFn }) {
    var _a;
    const defaultLogger = new Logger({
      dependencies,
      errorHandler: new ErrorHandler(),
      eventLogger: new EventLogger(),
      initializeFn,
      isDev: (_a = dependencies.externalApi) == null ? void 0 : _a.isDev(),
      logId: "default",
      transportFactories: {
        console: transportConsole,
        file: transportFile,
        ipc: transportIpc,
        remote: transportRemote
      },
      variables: {
        processType: "main"
      }
    });
    defaultLogger.default = defaultLogger;
    defaultLogger.Logger = Logger;
    defaultLogger.processInternalErrorFn = (e) => {
      defaultLogger.transports.console.writeFn({
        message: {
          data: ["Unhandled electron-log error", e],
          level: "error"
        }
      });
    };
    return defaultLogger;
  }
  return createDefaultLogger_1;
}
var main$1;
var hasRequiredMain;
function requireMain() {
  if (hasRequiredMain) return main$1;
  hasRequiredMain = 1;
  const electron = require$$1$4;
  const ElectronExternalApi = requireElectronExternalApi();
  const { initialize: initialize2 } = requireInitialize();
  const createDefaultLogger = requireCreateDefaultLogger();
  const externalApi = new ElectronExternalApi({ electron });
  const defaultLogger = createDefaultLogger({
    dependencies: { externalApi },
    initializeFn: initialize2
  });
  main$1 = defaultLogger;
  externalApi.onIpc("__ELECTRON_LOG__", (_, message) => {
    if (message.scope) {
      defaultLogger.Logger.getInstance(message).scope(message.scope);
    }
    const date = new Date(message.date);
    processMessage({
      ...message,
      date: date.getTime() ? date : /* @__PURE__ */ new Date()
    });
  });
  externalApi.onIpcInvoke("__ELECTRON_LOG__", (_, { cmd = "", logId }) => {
    switch (cmd) {
      case "getOptions": {
        const logger = defaultLogger.Logger.getInstance({ logId });
        return {
          levels: logger.levels,
          logId
        };
      }
      default: {
        processMessage({ data: [`Unknown cmd '${cmd}'`], level: "error" });
        return {};
      }
    }
  });
  function processMessage(message) {
    var _a;
    (_a = defaultLogger.Logger.getInstance(message)) == null ? void 0 : _a.processMessage(message);
  }
  return main$1;
}
var node;
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node;
  hasRequiredNode = 1;
  const NodeExternalApi = requireNodeExternalApi();
  const createDefaultLogger = requireCreateDefaultLogger();
  const externalApi = new NodeExternalApi();
  const defaultLogger = createDefaultLogger({
    dependencies: { externalApi }
  });
  node = defaultLogger;
  return node;
}
const isRenderer = typeof process === "undefined" || (process.type === "renderer" || process.type === "worker");
const isMain = typeof process === "object" && process.type === "browser";
if (isRenderer) {
  requireElectronLogPreload();
  src.exports = requireRenderer();
} else if (isMain) {
  src.exports = requireMain();
} else {
  src.exports = requireNode();
}
var srcExports = src.exports;
const log = /* @__PURE__ */ getDefaultExportFromCjs(srcExports);
function initAutoUpdater() {
  console.log("Initializing auto-updater...");
  if (!require$$1$4.app.isPackaged) {
    console.log("Skipping auto-updater in development mode");
    return;
  }
  if (!process.env.GH_TOKEN) {
    console.error("GH_TOKEN environment variable is not set");
    return;
  }
  mainExports.autoUpdater.autoDownload = true;
  mainExports.autoUpdater.autoInstallOnAppQuit = true;
  mainExports.autoUpdater.allowDowngrade = true;
  mainExports.autoUpdater.allowPrerelease = true;
  mainExports.autoUpdater.logger = log;
  log.transports.file.level = "debug";
  console.log(
    "Auto-updater logger configured with level:",
    log.transports.file.level
  );
  mainExports.autoUpdater.on("checking-for-update", () => {
    console.log("Checking for updates...");
  });
  mainExports.autoUpdater.on("update-available", (info) => {
    console.log("Update available:", info);
    require$$1$4.BrowserWindow.getAllWindows().forEach((window2) => {
      console.log("Sending update-available to window");
      window2.webContents.send("update-available", info);
    });
  });
  mainExports.autoUpdater.on("update-not-available", (info) => {
    console.log("Update not available:", info);
  });
  mainExports.autoUpdater.on("download-progress", (progressObj) => {
    console.log("Download progress:", progressObj);
  });
  mainExports.autoUpdater.on("update-downloaded", (info) => {
    console.log("Update downloaded:", info);
    require$$1$4.BrowserWindow.getAllWindows().forEach((window2) => {
      console.log("Sending update-downloaded to window");
      window2.webContents.send("update-downloaded", info);
    });
  });
  mainExports.autoUpdater.on("error", (err) => {
    console.error("Auto updater error:", err);
  });
  console.log("Checking for updates...");
  mainExports.autoUpdater.checkForUpdates().then((result) => {
    console.log("Update check result:", result);
  }).catch((err) => {
    console.error("Error checking for updates:", err);
  });
  setInterval(() => {
    console.log("Checking for updates (interval)...");
    mainExports.autoUpdater.checkForUpdates().then((result) => {
      console.log("Update check result (interval):", result);
    }).catch((err) => {
      console.error("Error checking for updates (interval):", err);
    });
  }, 60 * 60 * 1e3);
  require$$1$4.ipcMain.handle("start-update", async () => {
    console.log("Start update requested");
    try {
      await mainExports.autoUpdater.downloadUpdate();
      console.log("Update download completed");
      return { success: true };
    } catch (error2) {
      console.error("Failed to start update:", error2);
      return { success: false, error: error2.message };
    }
  });
  require$$1$4.ipcMain.handle("install-update", () => {
    console.log("Install update requested");
    mainExports.autoUpdater.quitAndInstall();
  });
}
var main = { exports: {} };
const version$1 = "16.4.7";
const require$$4 = {
  version: version$1
};
const fs = require$$1$2;
const path = require$$1$1;
const os = require$$1$3;
const crypto = require$$0$2;
const packageJson = require$$4;
const version = packageJson.version;
const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
function parse(src2) {
  const obj = {};
  let lines = src2.toString();
  lines = lines.replace(/\r\n?/mg, "\n");
  let match;
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1];
    let value = match[2] || "";
    value = value.trim();
    const maybeQuote = value[0];
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, "\n");
      value = value.replace(/\\r/g, "\r");
    }
    obj[key] = value;
  }
  return obj;
}
function _parseVault(options) {
  const vaultPath = _vaultPath(options);
  const result = DotenvModule.configDotenv({ path: vaultPath });
  if (!result.parsed) {
    const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
    err.code = "MISSING_DATA";
    throw err;
  }
  const keys = _dotenvKey(options).split(",");
  const length = keys.length;
  let decrypted;
  for (let i = 0; i < length; i++) {
    try {
      const key = keys[i].trim();
      const attrs = _instructions(result, key);
      decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
      break;
    } catch (error2) {
      if (i + 1 >= length) {
        throw error2;
      }
    }
  }
  return DotenvModule.parse(decrypted);
}
function _log(message) {
  console.log(`[dotenv@${version}][INFO] ${message}`);
}
function _warn(message) {
  console.log(`[dotenv@${version}][WARN] ${message}`);
}
function _debug(message) {
  console.log(`[dotenv@${version}][DEBUG] ${message}`);
}
function _dotenvKey(options) {
  if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
    return options.DOTENV_KEY;
  }
  if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
    return process.env.DOTENV_KEY;
  }
  return "";
}
function _instructions(result, dotenvKey) {
  let uri2;
  try {
    uri2 = new URL(dotenvKey);
  } catch (error2) {
    if (error2.code === "ERR_INVALID_URL") {
      const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    throw error2;
  }
  const key = uri2.password;
  if (!key) {
    const err = new Error("INVALID_DOTENV_KEY: Missing key part");
    err.code = "INVALID_DOTENV_KEY";
    throw err;
  }
  const environment = uri2.searchParams.get("environment");
  if (!environment) {
    const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
    err.code = "INVALID_DOTENV_KEY";
    throw err;
  }
  const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
  const ciphertext = result.parsed[environmentKey];
  if (!ciphertext) {
    const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
    err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
    throw err;
  }
  return { ciphertext, key };
}
function _vaultPath(options) {
  let possibleVaultPath = null;
  if (options && options.path && options.path.length > 0) {
    if (Array.isArray(options.path)) {
      for (const filepath of options.path) {
        if (fs.existsSync(filepath)) {
          possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
        }
      }
    } else {
      possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
    }
  } else {
    possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
  }
  if (fs.existsSync(possibleVaultPath)) {
    return possibleVaultPath;
  }
  return null;
}
function _resolveHome(envPath) {
  return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
}
function _configVault(options) {
  _log("Loading env from encrypted .env.vault");
  const parsed = DotenvModule._parseVault(options);
  let processEnv = process.env;
  if (options && options.processEnv != null) {
    processEnv = options.processEnv;
  }
  DotenvModule.populate(processEnv, parsed, options);
  return { parsed };
}
function configDotenv(options) {
  const dotenvPath = path.resolve(process.cwd(), ".env");
  let encoding = "utf8";
  const debug2 = Boolean(options && options.debug);
  if (options && options.encoding) {
    encoding = options.encoding;
  } else {
    if (debug2) {
      _debug("No encoding is specified. UTF-8 is used by default");
    }
  }
  let optionPaths = [dotenvPath];
  if (options && options.path) {
    if (!Array.isArray(options.path)) {
      optionPaths = [_resolveHome(options.path)];
    } else {
      optionPaths = [];
      for (const filepath of options.path) {
        optionPaths.push(_resolveHome(filepath));
      }
    }
  }
  let lastError;
  const parsedAll = {};
  for (const path2 of optionPaths) {
    try {
      const parsed = DotenvModule.parse(fs.readFileSync(path2, { encoding }));
      DotenvModule.populate(parsedAll, parsed, options);
    } catch (e) {
      if (debug2) {
        _debug(`Failed to load ${path2} ${e.message}`);
      }
      lastError = e;
    }
  }
  let processEnv = process.env;
  if (options && options.processEnv != null) {
    processEnv = options.processEnv;
  }
  DotenvModule.populate(processEnv, parsedAll, options);
  if (lastError) {
    return { parsed: parsedAll, error: lastError };
  } else {
    return { parsed: parsedAll };
  }
}
function config(options) {
  if (_dotenvKey(options).length === 0) {
    return DotenvModule.configDotenv(options);
  }
  const vaultPath = _vaultPath(options);
  if (!vaultPath) {
    _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
    return DotenvModule.configDotenv(options);
  }
  return DotenvModule._configVault(options);
}
function decrypt(encrypted, keyStr) {
  const key = Buffer.from(keyStr.slice(-64), "hex");
  let ciphertext = Buffer.from(encrypted, "base64");
  const nonce = ciphertext.subarray(0, 12);
  const authTag = ciphertext.subarray(-16);
  ciphertext = ciphertext.subarray(12, -16);
  try {
    const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
    aesgcm.setAuthTag(authTag);
    return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
  } catch (error2) {
    const isRange = error2 instanceof RangeError;
    const invalidKeyLength = error2.message === "Invalid key length";
    const decryptionFailed = error2.message === "Unsupported state or unable to authenticate data";
    if (isRange || invalidKeyLength) {
      const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    } else if (decryptionFailed) {
      const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
      err.code = "DECRYPTION_FAILED";
      throw err;
    } else {
      throw error2;
    }
  }
}
function populate(processEnv, parsed, options = {}) {
  const debug2 = Boolean(options && options.debug);
  const override = Boolean(options && options.override);
  if (typeof parsed !== "object") {
    const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
    err.code = "OBJECT_REQUIRED";
    throw err;
  }
  for (const key of Object.keys(parsed)) {
    if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
      if (override === true) {
        processEnv[key] = parsed[key];
      }
      if (debug2) {
        if (override === true) {
          _debug(`"${key}" is already defined and WAS overwritten`);
        } else {
          _debug(`"${key}" is already defined and was NOT overwritten`);
        }
      }
    } else {
      processEnv[key] = parsed[key];
    }
  }
}
const DotenvModule = {
  configDotenv,
  _configVault,
  _parseVault,
  config,
  decrypt,
  parse,
  populate
};
main.exports.configDotenv = DotenvModule.configDotenv;
main.exports._configVault = DotenvModule._configVault;
main.exports._parseVault = DotenvModule._parseVault;
var config_1 = main.exports.config = DotenvModule.config;
main.exports.decrypt = DotenvModule.decrypt;
main.exports.parse = DotenvModule.parse;
main.exports.populate = DotenvModule.populate;
main.exports = DotenvModule;
require$$1$4.app.commandLine.appendSwitch("remote-debugging-port", "8315");
require$$1$4.app.commandLine.appendSwitch("remote-allow-origins", "*");
const isDev = !require$$1$4.app.isPackaged;
console.log("App starting in", isDev ? "development" : "production", "mode");
console.log("App path:", require$$1$4.app.getAppPath());
console.log("User data path:", require$$1$4.app.getPath("userData"));
async function testLMStudioConnection() {
  console.log("Testing LM Studio connection...");
  const endpoints = [
    "http://127.0.0.1:1234/v1/models",
    "http://localhost:1234/v1/models",
    "http://192.168.100.182:1234/v1/models"
  ];
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      const response = await axios.get(endpoint, {
        timeout: 5e3,
        headers: { "Content-Type": "application/json" }
      });
      console.log(`Response from ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
    } catch (error2) {
      console.error(`Error testing ${endpoint}:`, error2.message);
    }
  }
  const chatEndpoint = "http://192.168.100.182:1234/v1/chat/completions";
  try {
    console.log(`Testing chat endpoint: ${chatEndpoint}`);
    const response = await axios.post(
      chatEndpoint,
      {
        model: "llama-3.2-3b-instruct",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say hello" }
        ],
        temperature: 0.7,
        max_tokens: 100
      },
      {
        timeout: 1e4,
        headers: { "Content-Type": "application/json" }
      }
    );
    console.log(`Response from ${chatEndpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
  } catch (error2) {
    console.error(`Error testing ${chatEndpoint}:`, error2.message);
    if (error2.response) {
      console.error("Response data:", error2.response.data);
    }
  }
}
const state = {
  // Window management properties
  mainWindow: null,
  isWindowVisible: false,
  windowPosition: null,
  windowSize: null,
  screenWidth: 0,
  screenHeight: 0,
  step: 0,
  currentX: 0,
  currentY: 0,
  // Application helpers
  screenshotHelper: null,
  shortcutsHelper: null,
  processingHelper: null,
  // View and state management
  view: "queue",
  problemInfo: null,
  hasDebugged: false,
  // Processing events
  PROCESSING_EVENTS: {
    NO_SCREENSHOTS: "processing-no-screenshots",
    INITIAL_START: "initial-start",
    PROBLEM_EXTRACTED: "problem-extracted",
    SOLUTION_SUCCESS: "solution-success",
    INITIAL_SOLUTION_ERROR: "solution-error",
    DEBUG_START: "debug-start",
    DEBUG_SUCCESS: "debug-success",
    DEBUG_ERROR: "debug-error"
  }
};
function initializeHelpers() {
  state.screenshotHelper = new ScreenshotHelper(state.view);
  state.processingHelper = new ProcessingHelper({
    getScreenshotHelper,
    getMainWindow,
    getView,
    setView,
    getProblemInfo,
    setProblemInfo,
    getScreenshotQueue,
    clearQueues,
    PROCESSING_EVENTS: state.PROCESSING_EVENTS,
    getScreenshots,
    setHasDebugged
  });
  state.shortcutsHelper = new ShortcutsHelper({
    getMainWindow,
    takeScreenshot,
    getImagePreview,
    processingHelper: state.processingHelper,
    clearQueues,
    setView,
    isVisible: () => state.isWindowVisible,
    toggleMainWindow,
    moveWindowLeft: () => moveWindowHorizontal(
      (x) => {
        var _a;
        return Math.max(-(((_a = state.windowSize) == null ? void 0 : _a.width) || 0) / 2, x - state.step);
      }
    ),
    moveWindowRight: () => moveWindowHorizontal(
      (x) => {
        var _a;
        return Math.min(
          state.screenWidth - (((_a = state.windowSize) == null ? void 0 : _a.width) || 0) / 2,
          x + state.step
        );
      }
    ),
    moveWindowUp: () => moveWindowVertical((y) => y - state.step),
    moveWindowDown: () => moveWindowVertical((y) => y + state.step)
  });
}
if (process.platform === "darwin") {
  require$$1$4.app.setAsDefaultProtocolClient("interview-coder");
} else {
  require$$1$4.app.setAsDefaultProtocolClient("interview-coder", process.execPath, [
    require$$1$1.resolve(process.argv[1] || "")
  ]);
}
if (process.defaultApp && process.argv.length >= 2) {
  require$$1$4.app.setAsDefaultProtocolClient("interview-coder", process.execPath, [
    require$$1$1.resolve(process.argv[1])
  ]);
}
const gotTheLock = require$$1$4.app.requestSingleInstanceLock();
if (!gotTheLock) {
  require$$1$4.app.quit();
} else {
  require$$1$4.app.on("second-instance", (event, commandLine) => {
    if (state.mainWindow) {
      if (state.mainWindow.isMinimized()) state.mainWindow.restore();
      state.mainWindow.focus();
      if (process.platform === "win32") {
        const deeplinkingUrl = commandLine.pop();
        if (deeplinkingUrl) {
          handleAuthCallback(deeplinkingUrl, state.mainWindow);
        }
      }
    }
  });
}
async function handleAuthCallback(url2, win) {
  try {
    console.log("Auth callback received:", url2);
    const urlObj = new URL(url2);
    const code = urlObj.searchParams.get("code");
    if (!code) {
      console.error("Missing code in callback URL");
      return;
    }
    if (win) {
      win.webContents.send("auth-callback", { code });
    }
  } catch (error2) {
    console.error("Error handling auth callback:", error2);
  }
}
async function createWindow() {
  if (state.mainWindow) {
    if (state.mainWindow.isMinimized()) state.mainWindow.restore();
    state.mainWindow.focus();
    return;
  }
  const primaryDisplay = require$$1$4.screen.getPrimaryDisplay();
  const workArea = primaryDisplay.workAreaSize;
  state.screenWidth = workArea.width;
  state.screenHeight = workArea.height;
  state.step = 60;
  state.currentY = 50;
  const windowSettings = {
    height: 600,
    x: state.currentX,
    y: 50,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: isDev ? require$$1$1.join(__dirname, "../dist-electron/preload.js") : require$$1$1.join(__dirname, "preload.js"),
      scrollBounce: true
    },
    show: true,
    frame: false,
    transparent: true,
    fullscreenable: false,
    hasShadow: false,
    backgroundColor: "#00000000",
    focusable: true,
    skipTaskbar: true,
    type: "panel",
    paintWhenInitiallyHidden: true,
    titleBarStyle: "hidden",
    enableLargerThanScreen: true,
    movable: true
  };
  state.mainWindow = new require$$1$4.BrowserWindow(windowSettings);
  state.mainWindow.webContents.on("did-finish-load", () => {
    console.log("Window finished loading");
  });
  state.mainWindow.webContents.on(
    "did-fail-load",
    async (event, errorCode, errorDescription) => {
      console.error("Window failed to load:", errorCode, errorDescription);
      if (isDev) {
        console.log("Retrying to load development server...");
        setTimeout(() => {
          var _a;
          (_a = state.mainWindow) == null ? void 0 : _a.loadURL("http://localhost:54321").catch((error2) => {
            console.error("Failed to load dev server on retry:", error2);
          });
        }, 1e3);
      }
    }
  );
  if (isDev) {
    state.mainWindow.loadURL("http://localhost:54321").catch((error2) => {
      console.error("Failed to load dev server:", error2);
    });
  } else {
    console.log(
      "Loading production build:",
      require$$1$1.join(__dirname, "../dist/index.html")
    );
    state.mainWindow.loadFile(require$$1$1.join(__dirname, "../dist/index.html"));
  }
  state.mainWindow.webContents.setZoomFactor(1);
  if (isDev) {
    state.mainWindow.webContents.openDevTools();
  }
  state.mainWindow.webContents.setWindowOpenHandler(({ url: url2 }) => {
    console.log("Attempting to open URL:", url2);
    if (url2.includes("google.com") || url2.includes("supabase.co")) {
      require$$1$4.shell.openExternal(url2);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
  state.mainWindow.setContentProtection(true);
  state.mainWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true
  });
  state.mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
  if (process.platform === "darwin") {
    state.mainWindow.setHiddenInMissionControl(true);
    state.mainWindow.setWindowButtonVisibility(false);
    state.mainWindow.setBackgroundColor("#00000000");
    state.mainWindow.setSkipTaskbar(true);
    state.mainWindow.setHasShadow(false);
  }
  state.mainWindow.webContents.setBackgroundThrottling(false);
  state.mainWindow.webContents.setFrameRate(60);
  state.mainWindow.on("move", handleWindowMove);
  state.mainWindow.on("resize", handleWindowResize);
  state.mainWindow.on("closed", handleWindowClosed);
  const bounds = state.mainWindow.getBounds();
  state.windowPosition = { x: bounds.x, y: bounds.y };
  state.windowSize = { width: bounds.width, height: bounds.height };
  state.currentX = bounds.x;
  state.currentY = bounds.y;
  state.isWindowVisible = true;
}
function handleWindowMove() {
  if (!state.mainWindow) return;
  const bounds = state.mainWindow.getBounds();
  state.windowPosition = { x: bounds.x, y: bounds.y };
  state.currentX = bounds.x;
  state.currentY = bounds.y;
}
function handleWindowResize() {
  if (!state.mainWindow) return;
  const bounds = state.mainWindow.getBounds();
  state.windowSize = { width: bounds.width, height: bounds.height };
}
function handleWindowClosed() {
  state.mainWindow = null;
  state.isWindowVisible = false;
  state.windowPosition = null;
  state.windowSize = null;
}
function hideMainWindow() {
  var _a;
  if (!((_a = state.mainWindow) == null ? void 0 : _a.isDestroyed())) {
    const bounds = state.mainWindow.getBounds();
    state.windowPosition = { x: bounds.x, y: bounds.y };
    state.windowSize = { width: bounds.width, height: bounds.height };
    state.mainWindow.setIgnoreMouseEvents(true, { forward: true });
    state.mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
    state.mainWindow.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true
    });
    state.mainWindow.setOpacity(0);
    state.mainWindow.hide();
    state.isWindowVisible = false;
  }
}
function showMainWindow() {
  var _a;
  if (!((_a = state.mainWindow) == null ? void 0 : _a.isDestroyed())) {
    if (state.windowPosition && state.windowSize) {
      state.mainWindow.setBounds({
        ...state.windowPosition,
        ...state.windowSize
      });
    }
    state.mainWindow.setIgnoreMouseEvents(false);
    state.mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
    state.mainWindow.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true
    });
    state.mainWindow.setContentProtection(true);
    state.mainWindow.setOpacity(0);
    state.mainWindow.showInactive();
    state.mainWindow.setOpacity(1);
    state.isWindowVisible = true;
  }
}
function toggleMainWindow() {
  state.isWindowVisible ? hideMainWindow() : showMainWindow();
}
function moveWindowHorizontal(updateFn) {
  if (!state.mainWindow) return;
  state.currentX = updateFn(state.currentX);
  state.mainWindow.setPosition(
    Math.round(state.currentX),
    Math.round(state.currentY)
  );
}
function moveWindowVertical(updateFn) {
  var _a, _b, _c;
  if (!state.mainWindow) return;
  const newY = updateFn(state.currentY);
  const maxUpLimit = -(((_a = state.windowSize) == null ? void 0 : _a.height) || 0) * 2 / 3;
  const maxDownLimit = state.screenHeight + (((_b = state.windowSize) == null ? void 0 : _b.height) || 0) * 2 / 3;
  console.log({
    newY,
    maxUpLimit,
    maxDownLimit,
    screenHeight: state.screenHeight,
    windowHeight: (_c = state.windowSize) == null ? void 0 : _c.height,
    currentY: state.currentY
  });
  if (newY >= maxUpLimit && newY <= maxDownLimit) {
    state.currentY = newY;
    state.mainWindow.setPosition(
      Math.round(state.currentX),
      Math.round(state.currentY)
    );
  }
}
function setWindowDimensions(width, height) {
  var _a;
  if (!((_a = state.mainWindow) == null ? void 0 : _a.isDestroyed())) {
    const [currentX, currentY] = state.mainWindow.getPosition();
    const primaryDisplay = require$$1$4.screen.getPrimaryDisplay();
    const workArea = primaryDisplay.workAreaSize;
    const maxWidth = Math.floor(workArea.width * 0.5);
    state.mainWindow.setBounds({
      x: Math.min(currentX, workArea.width - maxWidth),
      y: currentY,
      width: Math.min(width + 32, maxWidth),
      height: Math.ceil(height)
    });
  }
}
function loadEnvVariables() {
  if (isDev) {
    console.log("Loading env variables from:", require$$1$1.join(process.cwd(), ".env"));
    config_1({ path: require$$1$1.join(process.cwd(), ".env") });
  } else {
    console.log(
      "Loading env variables from:",
      require$$1$1.join(process.resourcesPath, ".env")
    );
    config_1({ path: require$$1$1.join(process.resourcesPath, ".env") });
  }
  console.log("Loaded environment variables:", {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? "exists" : "missing",
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ? "exists" : "missing"
  });
}
async function initializeApp() {
  var _a;
  try {
    loadEnvVariables();
    initializeHelpers();
    initializeIpcHandlers({
      getMainWindow,
      setWindowDimensions,
      getScreenshotQueue,
      getExtraScreenshotQueue,
      deleteScreenshot,
      getImagePreview,
      processingHelper: state.processingHelper,
      PROCESSING_EVENTS: state.PROCESSING_EVENTS,
      takeScreenshot,
      getView,
      toggleMainWindow,
      clearQueues,
      setView,
      moveWindowLeft: () => moveWindowHorizontal(
        (x) => {
          var _a2;
          return Math.max(-(((_a2 = state.windowSize) == null ? void 0 : _a2.width) || 0) / 2, x - state.step);
        }
      ),
      moveWindowRight: () => moveWindowHorizontal(
        (x) => {
          var _a2;
          return Math.min(
            state.screenWidth - (((_a2 = state.windowSize) == null ? void 0 : _a2.width) || 0) / 2,
            x + state.step
          );
        }
      ),
      moveWindowUp: () => moveWindowVertical((y) => y - state.step),
      moveWindowDown: () => moveWindowVertical((y) => y + state.step)
    });
    await createWindow();
    (_a = state.shortcutsHelper) == null ? void 0 : _a.registerGlobalShortcuts();
    initAutoUpdater();
    console.log(
      "Auto-updater initialized in",
      isDev ? "development" : "production",
      "mode"
    );
  } catch (error2) {
    console.error("Failed to initialize application:", error2);
    require$$1$4.app.quit();
  }
}
require$$1$4.app.on("open-url", (event, url2) => {
  console.log("open-url event received:", url2);
  event.preventDefault();
  if (url2.startsWith("interview-coder://")) {
    handleAuthCallback(url2, state.mainWindow);
  }
});
require$$1$4.app.on("second-instance", (event, commandLine) => {
  console.log("second-instance event received:", commandLine);
  const url2 = commandLine.find((arg) => arg.startsWith("interview-coder://"));
  if (url2) {
    handleAuthCallback(url2, state.mainWindow);
  }
  if (!state.mainWindow) {
    createWindow();
  } else {
    if (state.mainWindow.isMinimized()) state.mainWindow.restore();
    state.mainWindow.focus();
  }
});
if (!require$$1$4.app.requestSingleInstanceLock()) {
  require$$1$4.app.quit();
} else {
  require$$1$4.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      require$$1$4.app.quit();
      state.mainWindow = null;
    }
  });
}
require$$1$4.app.on("activate", () => {
  if (require$$1$4.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
function getMainWindow() {
  return state.mainWindow;
}
function getView() {
  return state.view;
}
function setView(view) {
  var _a;
  state.view = view;
  (_a = state.screenshotHelper) == null ? void 0 : _a.setView(view);
}
function getScreenshotHelper() {
  return state.screenshotHelper;
}
function getProblemInfo() {
  return state.problemInfo;
}
function setProblemInfo(problemInfo) {
  state.problemInfo = problemInfo;
}
function getScreenshotQueue() {
  var _a;
  return ((_a = state.screenshotHelper) == null ? void 0 : _a.getScreenshotQueue()) || [];
}
function getExtraScreenshotQueue() {
  var _a;
  return ((_a = state.screenshotHelper) == null ? void 0 : _a.getExtraScreenshotQueue()) || [];
}
function clearQueues() {
  var _a;
  (_a = state.screenshotHelper) == null ? void 0 : _a.clearQueues();
  state.problemInfo = null;
  setView("queue");
}
async function takeScreenshot() {
  var _a;
  if (!state.mainWindow) throw new Error("No main window available");
  return ((_a = state.screenshotHelper) == null ? void 0 : _a.takeScreenshot(
    () => hideMainWindow(),
    () => showMainWindow()
  )) || "";
}
async function getImagePreview(filepath) {
  var _a;
  return ((_a = state.screenshotHelper) == null ? void 0 : _a.getImagePreview(filepath)) || "";
}
async function deleteScreenshot(path2) {
  var _a;
  return ((_a = state.screenshotHelper) == null ? void 0 : _a.deleteScreenshot(path2)) || {
    success: false,
    error: "Screenshot helper not initialized"
  };
}
function setHasDebugged(value) {
  state.hasDebugged = value;
}
function getHasDebugged() {
  return state.hasDebugged;
}
async function getScreenshots() {
  var _a;
  return ((_a = state.screenshotHelper) == null ? void 0 : _a.getScreenshotQueue()) || [];
}
require$$1$4.app.whenReady().then(async () => {
  await initializeApp();
  await testLMStudioConnection();
});
exports.clearQueues = clearQueues;
exports.createWindow = createWindow;
exports.deleteScreenshot = deleteScreenshot;
exports.getExtraScreenshotQueue = getExtraScreenshotQueue;
exports.getHasDebugged = getHasDebugged;
exports.getImagePreview = getImagePreview;
exports.getMainWindow = getMainWindow;
exports.getProblemInfo = getProblemInfo;
exports.getScreenshotHelper = getScreenshotHelper;
exports.getScreenshotQueue = getScreenshotQueue;
exports.getView = getView;
exports.handleAuthCallback = handleAuthCallback;
exports.hideMainWindow = hideMainWindow;
exports.moveWindowHorizontal = moveWindowHorizontal;
exports.moveWindowVertical = moveWindowVertical;
exports.setHasDebugged = setHasDebugged;
exports.setProblemInfo = setProblemInfo;
exports.setView = setView;
exports.setWindowDimensions = setWindowDimensions;
exports.showMainWindow = showMainWindow;
exports.state = state;
exports.takeScreenshot = takeScreenshot;
exports.toggleMainWindow = toggleMainWindow;
//# sourceMappingURL=main.js.map
