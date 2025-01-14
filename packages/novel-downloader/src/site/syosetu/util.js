"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrl = exports.makeUrl = exports.check = void 0;
const tslib_1 = require("tslib");
const url_1 = tslib_1.__importStar(require("../../util/url"));
function check(url, options) {
    return /syosetu/i.test((0, url_1.default)(url).hostname || '');
}
exports.check = check;
function makeUrl(urlobj, bool, ...argv) {
    let subdomain = urlobj.novel_r18 ? 'novel18' : 'ncode';
    if (urlobj.novel_pid && urlobj.chapter_id) {
        // @ts-ignore
        return new URL(`https://${subdomain}.syosetu.com/txtdownload/dlstart/ncode/${urlobj.novel_pid}/?no=${urlobj.chapter_id}&hankaku=0&code=utf-8&kaigyo=crlf`);
    }
    let pad = (!bool && urlobj.chapter_id) ? urlobj.chapter_id : '';
    let url = `http://${subdomain}.syosetu.com/${urlobj.novel_id}/${pad}`;
    return (0, url_1.default)(url);
}
exports.makeUrl = makeUrl;
function parseUrl(_url, ...argv) {
    const { urlobj, url } = (0, url_1._handleParseURL)(_url, ...argv);
    let r;
    let m;
    r = /^(n[\w]{5,6})$/;
    if (m = r.exec(url)) {
        urlobj.novel_id = m[1];
        return urlobj;
    }
    r = /(novel18)\.syosetu\.com/;
    if (m = r.exec(url)) {
        urlobj.novel_r18 = m[1];
    }
    r = /txtdownload\/dlstart\/ncode\/(\d+)/;
    if (m = r.exec(url)) {
        urlobj.novel_pid = m[1];
        return urlobj;
    }
    r = /\.syosetu\.com\/(n\w+)(?:\/?(\d+))?/;
    if (m = r.exec(url)) {
        urlobj.novel_id = m[1];
        urlobj.chapter_id = m[2];
        return urlobj;
    }
    return urlobj;
}
exports.parseUrl = parseUrl;
//# sourceMappingURL=util.js.map