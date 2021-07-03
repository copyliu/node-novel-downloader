"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupTypeNovelDetailResponse = exports.lookupTypeNovelChapterResponse = exports.lookupTypeRoot = exports._lookupType = exports.EnumResponseTypeKey = void 0;
const tslib_1 = require("tslib");
const protobufjs_1 = (0, tslib_1.__importDefault)(require("protobufjs"));
const dmzjproto_json_1 = (0, tslib_1.__importDefault)(require("./dmzjproto.json"));
var EnumResponseTypeKey;
(function (EnumResponseTypeKey) {
    EnumResponseTypeKey["Root"] = "Root";
    EnumResponseTypeKey["NovelChapterResponse"] = "NovelChapterResponse";
    EnumResponseTypeKey["NovelDetailResponse"] = "NovelDetailResponse";
})(EnumResponseTypeKey = exports.EnumResponseTypeKey || (exports.EnumResponseTypeKey = {}));
const _cache = new Map();
function _cacheGet(key, fn) {
    let value = _cache.get(key);
    value !== null && value !== void 0 ? value : (value = (() => {
        let _new;
        if (typeof fn === 'function') {
            // @ts-ignore
            _new = fn(key);
        }
        else {
            // @ts-ignore
            _new = fn;
        }
        if (_new !== value) {
            return _new;
        }
    })());
    return value;
}
function _lookupType(path) {
    return _cacheGet(path, (path) => {
        return lookupTypeRoot().lookupType(path);
    });
}
exports._lookupType = _lookupType;
function lookupTypeRoot() {
    return _cacheGet(EnumResponseTypeKey.Root, () => {
        return protobufjs_1.default.Root.fromJSON(dmzjproto_json_1.default);
    });
}
exports.lookupTypeRoot = lookupTypeRoot;
function lookupTypeNovelChapterResponse() {
    return _lookupType(EnumResponseTypeKey.NovelChapterResponse);
}
exports.lookupTypeNovelChapterResponse = lookupTypeNovelChapterResponse;
function lookupTypeNovelDetailResponse() {
    return _lookupType(EnumResponseTypeKey.NovelDetailResponse);
}
exports.lookupTypeNovelDetailResponse = lookupTypeNovelDetailResponse;
//# sourceMappingURL=protobuf.js.map