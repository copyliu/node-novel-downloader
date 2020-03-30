"use strict";
/**
 * Created by user on 2018/1/17/017.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download_image = void 0;
const fs_iconv_1 = __importDefault(require("fs-iconv"));
const util_1 = require("fs-iconv/util");
const request_promise_1 = __importDefault(require("@bluelovers/request-promise"));
const jsdom_extra_1 = require("jsdom-extra");
const bluebird_1 = __importDefault(require("bluebird"));
const upath2_1 = __importDefault(require("upath2"));
function download_image(img, options) {
    let dirname = options.dir || upath2_1.default.dirname(options.fromfile);
    if (!dirname) {
        throw new Error();
    }
    // @ts-ignore
    let url = new jsdom_extra_1.URL(img);
    let filename = options.name || upath2_1.default.basename(url.href);
    if (typeof options.prefix == 'string') {
        filename = options.prefix + filename;
    }
    filename = util_1.trimFilename(filename);
    let file = upath2_1.default.join(dirname, filename);
    let ret = request_promise_1.default(url.href, {
        encoding: null,
        resolveWithFullResponse: true,
    })
        .then(async function (res) {
        //console.log(res);
        await fs_iconv_1.default.saveFile(file, res.body);
        return {
            body: res.body,
            url,
            dirname,
            filename,
            outputFile: file,
        };
    });
    // @ts-ignore
    return bluebird_1.default.resolve(ret);
}
exports.download_image = download_image;
exports.default = download_image;
//export default exports;
//# sourceMappingURL=image.js.map