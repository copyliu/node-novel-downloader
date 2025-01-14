"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAsync = exports.parse = void 0;
const tslib_1 = require("tslib");
/**
 * Created by user on 2020/1/6.
 */
const lazy_url_1 = tslib_1.__importDefault(require("lazy-url"));
function parse(input) {
    let u = new lazy_url_1.default(input);
    if (!/\.mitemin/.test(u.host)) {
        throw new Error(`not support host ${u.host}`);
    }
    let subdomain = u.host.split('.')[0];
    if (/^img/.test(subdomain)) {
        let basename = u.paths[u.paths.length - 1];
        let m = basename.match(/^(?<filename>.+?)(?:\.(?<size>\d+)\.(?:jpg|png|gif|bmp))?$/);
        let { filename, size } = m.groups;
        let u2 = new lazy_url_1.default(u);
        let paths = u2.paths.slice();
        paths[paths.length - 1] = filename;
        u2.pathname = paths.join('/');
        return {
            url: u.toString(),
            fullsize: u2.toString(),
            size,
            filename,
        };
    }
    else if (u.pathname.match(/\bviewimage(?<size>big)?\/icode\/(?<icode>\w+)/)) {
        let size = RegExp.$1;
        let icode = RegExp.$2;
        let u2 = new lazy_url_1.default(u);
        let paths = u2.paths.slice();
        paths = paths.map(v => {
            if (/^(viewimage)(?:big)?$/.test(v)) {
                return RegExp.$1;
            }
            return v;
        });
        u2.pathname = paths.join('/');
        let authorid = subdomain;
        return {
            url: u.toString(),
            fullsize: u2.toString(),
            size,
            icode,
            authorid,
        };
    }
    throw new Error(`unknown url ${u.toString()}`);
}
exports.parse = parse;
async function parseAsync(input) {
    return parse(input);
}
exports.parseAsync = parseAsync;
exports.default = parse;
//# sourceMappingURL=index.js.map