"use strict";
/**
 * Created by user on 2018/2/9/009.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
const Promise = require("bluebird");
function retryRequest(url, options = {}) {
    options = Object.assign({
        retry: 3,
        delay: 1000,
    }, options);
    let retry = options.retry || 3;
    let libRequest = options.libRequest || request;
    let tries = 0;
    if (url.href) {
        url = url.href;
    }
    function fn() {
        tries++;
        return libRequest(url.toString(), options)
            .catch(function (err) {
            if (retry-- > 0) {
                console.warn(`fetch fail(${tries}), will wait ${options.delay}ms, for try again\n${url}`);
                return Promise.delay(options.delay).then(fn);
            }
            err.tries = tries;
            return Promise.reject(err);
        });
    }
    return Promise.resolve().then(function () {
        return fn();
    }).tapCatch(function (err) {
        console.log(err);
    });
}
exports.retryRequest = retryRequest;
const self = require("./fetch");
exports.default = self;
//export default exports;
