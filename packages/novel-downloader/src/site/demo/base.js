"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("../../fetch");
const fs = require("fs-extra");
const path = require("upath2");
const jsdom_extra_1 = require("jsdom-extra");
//import { URL } from 'jsdom-url';
const fs_1 = require("../fs");
const jsdom_1 = require("../../jsdom");
const helper_1 = require("node-novel-globby/lib/helper");
const g_1 = require("node-novel-globby/g");
const layout_reporter_1 = require("@node-novel/layout-reporter");
const md_1 = require("@node-novel/layout-reporter/lib/md");
const index_1 = require("../index");
const index_2 = require("../index");
const parseContentType = require("content-type-parser");
const novel_text_1 = require("novel-text");
const jsdom_extra_2 = require("jsdom-extra");
const jsdom_extra_3 = require("jsdom-extra");
const mdconf2_1 = require("mdconf2");
const log_1 = require("../../util/log");
const hash_1 = require("../../util/hash");
let NovelSiteDemo = class NovelSiteDemo extends index_1.default {
    constructor(options, ...argv) {
        super(options, ...argv);
    }
    /**
     * @todo 讓此方法有意義
     *
     * 用來說明目前站點的所需 session cookies
     *
     * @param {T} data
     * @returns {T}
     */
    checkSessionData(data, optionsRuntime = {}) {
        return data;
    }
    session(optionsRuntime, url, domain) {
        super.session(optionsRuntime, url);
        if (optionsRuntime.sessionData && Object.keys(optionsRuntime.sessionData).length) {
            Object.entries(optionsRuntime.sessionData)
                .forEach(function (data) {
                let c;
                let typec = typeof data[1];
                if (data[1] && typec == 'object') {
                    c = data[1];
                }
                else if (typec === null || typec != 'object') {
                    let [key, value] = data;
                    c = {
                        key,
                        value,
                    };
                }
                else {
                    c = data[1];
                }
                if (c) {
                    if (typeof c == 'object') {
                        if (!c.path) {
                            c.path = '/';
                        }
                        if (c.hostOnly == null) {
                            c.hostOnly = false;
                        }
                    }
                    if (!(typeof c === 'string' || c instanceof jsdom_extra_2.LazyCookie || c instanceof jsdom_extra_3.toughCookie.Cookie)) {
                        // @ts-ignore
                        c = new jsdom_extra_3.toughCookie.Cookie(c);
                    }
                    optionsRuntime.optionsJSDOM.cookieJar
                        .setCookieSync(c, url.href);
                    if (typeof c == 'object' && !c.domain) {
                        if (domain) {
                            c.domain = domain;
                        }
                        else if (url && url.host) {
                            c.domain = url.host;
                        }
                        try {
                            optionsRuntime.optionsJSDOM.cookieJar
                                .setCookieSync(c, url.href);
                        }
                        catch (e) {
                        }
                    }
                }
            });
            log_1.consoleDebug.debug(`session`, optionsRuntime.optionsJSDOM.cookieJar);
        }
        return this;
    }
    download(inputUrl, downloadOptions = {}) {
        const self = this;
        let url = inputUrl;
        const [PATH_NOVEL_MAIN, optionsRuntime] = this.getOutputDir(downloadOptions);
        log_1.consoleDebug.enabled = optionsRuntime.debugLog;
        return index_2.PromiseBluebird
            .bind(self)
            .then(async () => {
            url = await this.createMainUrl(url, optionsRuntime);
            self.session(optionsRuntime, url);
            log_1.consoleDebug.info('分析章節列表', url.toString());
            let novel = await self.get_volume_list(url, optionsRuntime);
            let path_novel = self.getPathNovel(PATH_NOVEL_MAIN, novel, optionsRuntime);
            self._loadExistsConf(url, optionsRuntime, novel, path_novel);
            let idx = optionsRuntime.startIndex || 0;
            optionsRuntime[index_1.SYMBOL_CACHE].novel = novel;
            optionsRuntime[index_1.SYMBOL_CACHE].path_novel = path_novel;
            await index_2.PromiseBluebird
                .resolve(self.processNovel(novel, optionsRuntime, {
                url,
                path_novel,
            }))
                .tap(ls => {
                return self._outputAttach(novel, optionsRuntime, {
                    url,
                    path_novel,
                });
            })
                .tap(ls => {
                let file = path.join(path_novel, `${self.trimFilenameNovel(novel.novel_title)}.${novel.url_data.novel_id}.json`);
                return fs.outputJSON(file, novel, {
                    spaces: "\t",
                });
            });
            await self._saveReadme(optionsRuntime);
            let _cache = layout_reporter_1.dummyCache();
            await g_1.globbyASync([
                '**/*.txt',
            ], {
                cwd: path_novel,
            })
                .mapSeries(async (file) => {
                let _p = path.parse(file);
                const _cache_key_ = path.join(_p.dir, _p.name);
                await fs
                    .readFile(path.join(path_novel, file))
                    .then(buf => {
                    layout_reporter_1.analyzeJa002({
                        input: buf.toString(),
                        _cache_key_,
                        _cache,
                    });
                });
            })
                .tap(async () => {
                let md = md_1.outputJa002({
                    inputData: _cache.ja2,
                });
                return fs.outputFile(path.join(path_novel, 'ja2.md'), md);
            });
            return novel;
        });
    }
    async _outputAttach(novel, optionsRuntime, _cache_, ...argv) {
        const self = this;
        const { url, path_novel } = _cache_;
        if (novel.volume_list) {
            const { keepImage = false } = optionsRuntime;
            log_1.consoleDebug.info(`檢查 ATTACH 資料`);
            return index_2.PromiseBluebird
                .resolve(novel.volume_list)
                .each((volume, vid) => {
                let dirname;
                {
                    let _vid = '';
                    if (!optionsRuntime.noDirPrefix) {
                        _vid = vid.toString().padStart(4, '0') + '0';
                        _vid += '_';
                    }
                    dirname = path.join(path_novel, `${_vid}${self.trimFilenameVolume(volume.volume_title)}`);
                }
                let imgs = [];
                return index_2.PromiseBluebird
                    .resolve(volume.chapter_list)
                    .each(async (chapter) => {
                    if (chapter.imgs) {
                        imgs.push(...chapter.imgs);
                    }
                })
                    .tap(async () => {
                    imgs = imgs.filter(v => v);
                    log_1.consoleDebug.debug(`[ATTACH]`, `${path.relative(path_novel, dirname)}`, imgs.length);
                    if (imgs.length) {
                        let file = path.join(dirname, 'ATTACH.md');
                        let md_data = {
                            attach: {
                                images: {},
                            },
                        };
                        if (keepImage || 1) {
                            await fs.readFile(file)
                                .then(v => mdconf2_1.parse(v))
                                // @ts-ignore
                                .then((data) => {
                                data.attach = data.attach || {};
                                data.attach.images = data.attach.images || {};
                                md_data = data;
                                log_1.consoleDebug.debug(`Load data from exists ATTACH.md`);
                            })
                                .catch(e => null);
                        }
                        md_data.attach.images = Object
                            .entries(imgs)
                            .reduce((a, [k, v]) => {
                            if (keepImage) {
                                a[hash_1.hashSum(v)] = v;
                            }
                            else {
                                a[k.toString().padStart(3, '0')] = v;
                            }
                            return a;
                        }, md_data.attach.images);
                        let md = mdconf2_1.stringify(md_data);
                        return fs.outputFile(file, md)
                            .then(r => {
                            log_1.consoleDebug.success(`[ATTACH]`, `[SAVE]`, `${path.relative(path_novel, file)}`);
                            return r;
                        });
                    }
                });
            });
        }
        return index_2.PromiseBluebird.resolve();
    }
    async _processNovel(novel, optionsRuntime, _cache_, ...argv) {
        const self = this;
        let idx = optionsRuntime.startIndex || 0;
        let { url, path_novel } = _cache_;
        return index_2.PromiseBluebird
            .mapSeries(novel.volume_list, (volume, vid) => {
            let dirname;
            {
                let _vid = '';
                if (!optionsRuntime.noDirPrefix) {
                    _vid = vid.toString().padStart(4, '0') + '0';
                    _vid += '_';
                }
                dirname = path.join(path_novel, `${_vid}${self.trimFilenameVolume(volume.volume_title)}`);
            }
            log_1.consoleDebug.debug(vid, volume.volume_title);
            if (!optionsRuntime.noFirePrefix && optionsRuntime.filePrefixMode >= 2) {
                let i;
                let bool = volume.chapter_list.every(function (chapter, j) {
                    let m = (optionsRuntime.filePrefixMode > 3 ?
                        chapter.chapter_title : helper_1.normalize_val(chapter.chapter_title))
                        .replace(/^\D+/, '')
                        //.replace(/^(\d+).+$/, '$1')
                        .replace(/^(\d+)\D.*$/, '$1');
                    //console.log(m, chapter.chapter_title);
                    if (/^\d+$/.test(m)) {
                        let m2 = parseInt(m);
                        if (j == 0) {
                            i = m2;
                            return true;
                        }
                        else if (m2 === ++i) {
                            return true;
                        }
                    }
                    return false;
                });
                //console.log(bool);
                if (bool) {
                    volume.chapter_list.forEach(function (chapter) {
                        chapter.chapter_index = '';
                    });
                }
            }
            if (optionsRuntime.event) {
                self.emit(optionsRuntime.event, 'volume', volume, {
                    optionsRuntime,
                    dirname,
                    vid,
                    novel,
                    url,
                });
            }
            return index_2.PromiseBluebird
                .mapSeries(volume.chapter_list, async (chapter, cid) => {
                //chapter.chapter_index = (idx++);
                const current_idx = idx++;
                let file = fs_1.getFilePath(self, {
                    chapter, cid,
                    ext: '.txt',
                    idx: current_idx,
                    dirname,
                    volume, vid,
                }, optionsRuntime);
                if (self._checkExists(optionsRuntime, file)) {
                    log_1.consoleDebug.debug(`[SKIP]`, vid, cid, chapter.chapter_title);
                    return file;
                }
                let url = self._createChapterUrl({
                    novel,
                    volume,
                    chapter,
                }, optionsRuntime);
                log_1.consoleDebug.debug(vid, cid, chapter.chapter_title);
                //consoleDebug.debug(url.toString());
                await self._fetchChapterMain({
                    url,
                    file,
                    volume,
                    chapter,
                }, optionsRuntime, {
                    novel,
                })
                    .then(async (text) => {
                    await this._saveFile({
                        file,
                        context: text,
                        optionsRuntime,
                    });
                    return text;
                });
                return file;
            });
        })
            .then(function (ret) {
            return ret;
        });
    }
    processNovel(novel, optionsRuntime, _cache_, ...argv) {
        // @ts-ignore
        let pr;
        log_1.consoleDebug.info('開始處理小說');
        pr = optionsRuntime.fetchMetaDataOnly ? [] : this._processNovel(novel, optionsRuntime, _cache_, ...argv);
        return index_2.PromiseBluebird
            .resolve(pr)
            .then(function (ret) {
            return {
                novel,
                optionsRuntime,
                _cache_,
                ret,
            };
        });
    }
    _stripContent(text) {
        return text;
    }
    _parseChapter(ret, optionsRuntime, cache) {
        if (!ret) {
            return '';
        }
        throw new SyntaxError(`Function not implemented`);
    }
    _fetchChapterRetryError(message, ret, optionsRuntime, cache) {
        let e = new Error(message);
        e.doRetry = (cache.doRetry | 0) + 1;
        return e;
    }
    _fetchChapterMain(argv, optionsRuntime, _cache_) {
        const self = this;
        let { url, file, volume, chapter } = argv;
        let { novel } = _cache_;
        return index_2.PromiseBluebird.resolve()
            .then(async () => {
            let _do = false;
            let doRetry = 0;
            let value;
            do {
                _do = false;
                value = await self._fetchChapter(url, optionsRuntime, {
                    novel,
                })
                    .then(async (ret) => {
                    return self._parseChapter(ret, optionsRuntime, {
                        file,
                        novel,
                        volume,
                        chapter,
                        doRetry,
                    });
                })
                    .catch(async (e) => {
                    if (e.doRetry > 0 && e.doRetry < 5) {
                        _do = true;
                        doRetry = e.doRetry | 0;
                        let delay = 5000 + doRetry * 1000;
                        log_1.console.warn(e.message, doRetry, delay);
                        await index_2.PromiseBluebird.delay(delay);
                        return;
                    }
                    return Promise.reject(e);
                });
            } while (_do);
            return value;
        })
            .then(function (text) {
            if (typeof text == 'string') {
                return novel_text_1.default.toStr(text);
            }
            return text;
        });
    }
    _fetchChapter(url, optionsRuntime, _cache_) {
        return index_2.PromiseBluebird.resolve().then(async function () {
            log_1.consoleDebug.debug(`fetchChapter`, url.toString());
            let ret = {};
            let opts = jsdom_1.getOptions(optionsRuntime);
            if (optionsRuntime.disableDownload) {
                return null;
            }
            else if (true) {
                if (optionsRuntime.retryDelay > 0) {
                    // @ts-ignore
                    opts.requestOptions.delay = optionsRuntime.retryDelay;
                }
                else {
                    // @ts-ignore
                    opts.requestOptions.retry = 1;
                }
                await fetch_1.retryRequest(url, opts.requestOptions)
                    .then(function (res) {
                    const contentTypeParsed = parseContentType(res.headers["content-type"]);
                    ret.contentTypeParsed = contentTypeParsed;
                    // @ts-ignore
                    ret.url = url;
                    if (contentTypeParsed.isHTML() || contentTypeParsed.isXML()) {
                        ret.dom = jsdom_extra_1.requestToJSDOM(res, url, optionsRuntime.optionsJSDOM);
                        ret.dom = jsdom_extra_1.packJSDOM(ret.dom);
                    }
                    else if (contentTypeParsed.subtype == 'json') {
                        ret.json = JSON.parse(res.body.toString());
                    }
                    ret.res = res;
                    ret.body = res.body;
                });
            }
            else {
                // @ts-ignore
                ret.dom = await jsdom_extra_1.fromURL(url, optionsRuntime.optionsJSDOM);
                ret.res = ret.dom._options.Response;
                ret.body = ret.dom._options.body;
            }
            return ret;
        });
    }
    _exportDownloadOptions(optionsRuntime) {
        let opts = {};
        if (optionsRuntime) {
            let bool;
            for (let k of [
                'noFirePrefix',
                'noFilePadend',
                'filePrefixMode',
                'startIndex',
                'keepRuby',
                'keepFormat',
                'keepImage',
                'allowEmptyVolumeTitle',
                'disableOutputDirPrefix',
            ]) {
                if ((k in optionsRuntime) && typeof optionsRuntime[k] !== 'undefined') {
                    bool = true;
                    // @ts-ignore
                    opts[k] = optionsRuntime[k];
                }
            }
        }
        return opts;
    }
    _saveReadme(optionsRuntime, options = {}, ...opts) {
        if (this.IDKEY) {
            options[this.IDKEY] = options[this.IDKEY] || {};
            try {
                options[this.IDKEY].novel_id = options[this.IDKEY].novel_id || optionsRuntime[index_1.SYMBOL_CACHE].novel.url_data.novel_id;
            }
            catch (e) {
            }
        }
        let downloadOptions = this._exportDownloadOptions(optionsRuntime);
        return super._saveReadme(optionsRuntime, options, {
            options: {
                textlayout: {
                    allow_lf2: true,
                },
                downloadOptions: downloadOptions || {},
            },
        }, ...opts);
    }
    _get_meta(inputUrl, optionsRuntime, cache) {
        throw new SyntaxError();
    }
};
NovelSiteDemo.IDKEY = null;
NovelSiteDemo = __decorate([
    index_1.staticImplements(),
    __metadata("design:paramtypes", [Object, Object])
], NovelSiteDemo);
exports.NovelSiteDemo = NovelSiteDemo;
exports.NovelSite = NovelSiteDemo;
exports.default = NovelSiteDemo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBMkM7QUFDM0MsK0JBQWdDO0FBQ2hDLCtCQUFnQztBQUVoQyw2Q0FBMEY7QUFDMUYsa0NBQWtDO0FBQ2xDLDhCQUFvQztBQUVwQyx1Q0FBeUM7QUFDekMseURBQTZEO0FBQzdELDJDQUFrRDtBQUNsRCxpRUFNcUM7QUFDckMsMkRBQWlGO0FBR2pGLG9DQUEyRjtBQUMzRixvQ0FBMkM7QUFFM0Msd0RBQXlEO0FBQ3pELDJDQUFtQztBQUVuQyw2Q0FBd0Q7QUFFeEQsNkNBQTBDO0FBRTFDLHFDQUErRTtBQVcvRSx3Q0FBdUU7QUFDdkUsMENBQTBDO0FBaUIxQyxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFjLFNBQVEsZUFBVTtJQUk1QyxZQUFZLE9BQXlCLEVBQUUsR0FBRyxJQUFJO1FBRTdDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILGdCQUFnQixDQUFtQixJQUFPLEVBQUUsaUJBQWtDLEVBQUU7UUFFL0UsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsT0FBTyxDQUFzQixjQUE2QyxFQUFFLEdBQVEsRUFBRSxNQUFlO1FBRXBHLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRW5DLElBQUksY0FBYyxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLEVBQ2hGO1lBQ0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDO2lCQUN4QyxPQUFPLENBQUMsVUFBVSxJQUFJO2dCQUV0QixJQUFJLENBQXdCLENBQUM7Z0JBQzdCLElBQUksS0FBSyxHQUFHLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FB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RUFBRTtZQUNqRCxPQUFPLEVBQUU7Z0JBQ1IsVUFBVSxFQUFFO29CQUNYLFNBQVMsRUFBRSxJQUFJO2lCQUNmO2dCQUNELGVBQWUsRUFBRSxlQUFlLElBQUksRUFBRTthQUN0QztTQUNELEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFUyxTQUFTLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxLQUU3QztRQUVBLE1BQU0sSUFBSSxXQUFXLEVBQUUsQ0FBQztJQUN6QixDQUFDO0NBRUQsQ0FBQTtBQTN1QnVCLG1CQUFLLEdBQVcsSUFBSSxDQUFDO0FBRmhDLGFBQWE7SUFEekIsd0JBQWdCLEVBQThDOztHQUNsRCxhQUFhLENBNnVCekI7QUE3dUJZLHNDQUFhO0FBK3VCYixRQUFBLFNBQVMsR0FBRyxhQUFxQyxDQUFDO0FBRS9ELGtCQUFlLGFBQWEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJldHJ5UmVxdWVzdCB9IGZyb20gJy4uLy4uL2ZldGNoJztcbmltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJyk7XG5pbXBvcnQgcGF0aCA9IHJlcXVpcmUoJ3VwYXRoMicpO1xuaW1wb3J0IG5vdmVsSW5mbywgeyBJTWRjb25mTWV0YSB9IGZyb20gJ25vZGUtbm92ZWwtaW5mbyc7XG5pbXBvcnQgeyBmcm9tVVJMLCBJRnJvbVVybE9wdGlvbnMsIElKU0RPTSwgcmVxdWVzdFRvSlNET00sIHBhY2tKU0RPTSB9IGZyb20gJ2pzZG9tLWV4dHJhJztcbi8vaW1wb3J0IHsgVVJMIH0gZnJvbSAnanNkb20tdXJsJztcbmltcG9ydCB7IGdldEZpbGVQYXRoIH0gZnJvbSAnLi4vZnMnO1xuXG5pbXBvcnQgeyBnZXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vanNkb20nO1xuaW1wb3J0IHsgbm9ybWFsaXplX3ZhbCB9IGZyb20gJ25vZGUtbm92ZWwtZ2xvYmJ5L2xpYi9oZWxwZXInO1xuaW1wb3J0IHsgZ2xvYmJ5QVN5bmMgfSBmcm9tICdub2RlLW5vdmVsLWdsb2JieS9nJztcbmltcG9ydCB7XG5cdGxhenlBbmFseXplUmVwb3J0QWxsLFxuXHRsYXp5QW5hbHl6ZUFsbCxcblx0ZHVtbXlDYWNoZSxcblx0YW5hbHl6ZUphMDAyLFxuXHRoYW5kbGVKYTAwMixcbn0gZnJvbSAnQG5vZGUtbm92ZWwvbGF5b3V0LXJlcG9ydGVyJztcbmltcG9ydCB7IG91dHB1dEJsb2NrMDAyLCBvdXRwdXRKYTAwMiB9IGZyb20gJ0Bub2RlLW5vdmVsL2xheW91dC1yZXBvcnRlci9saWIvbWQnO1xuaW1wb3J0IHsgSVRTUGFydGlhbFBpY2sgfSBmcm9tICd0cy10eXBlJztcblxuaW1wb3J0IF9Ob3ZlbFNpdGUsIHsgc3RhdGljSW1wbGVtZW50cywgZGVmYXVsdEpTRE9NT3B0aW9ucywgU1lNQk9MX0NBQ0hFIH0gZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHsgUHJvbWlzZUJsdWViaXJkIH0gZnJvbSAnLi4vaW5kZXgnO1xuXG5pbXBvcnQgcGFyc2VDb250ZW50VHlwZSA9IHJlcXVpcmUoJ2NvbnRlbnQtdHlwZS1wYXJzZXInKTtcbmltcG9ydCBub3ZlbFRleHQgZnJvbSAnbm92ZWwtdGV4dCc7XG5cbmltcG9ydCB7IExhenlDb29raWUsIExhenlDb29raWVKYXIgfSBmcm9tICdqc2RvbS1leHRyYSc7XG5cbmltcG9ydCB7IHRvdWdoQ29va2llIH0gZnJvbSAnanNkb20tZXh0cmEnO1xuXG5pbXBvcnQgeyBzdHJpbmdpZnkgYXMgbWRjb25mX3N0cmluZ2lmeSwgcGFyc2UgYXMgbWRjb25mX3BhcnNlIH0gZnJvbSAnbWRjb25mMic7XG5cbmV4cG9ydCB0eXBlIElPcHRpb25zUGx1cyA9IHt9XG5cbmV4cG9ydCB0eXBlIElEb3dubG9hZE9wdGlvbnMgPSBfTm92ZWxTaXRlLklEb3dubG9hZE9wdGlvbnMgJiBfTm92ZWxTaXRlLklPcHRpb25zICYgSU9wdGlvbnNQbHVzXG5leHBvcnQgdHlwZSBJT3B0aW9uc1J1bnRpbWUgPSBfTm92ZWxTaXRlLklPcHRpb25zUnVudGltZSAmIElPcHRpb25zUGx1c1xuXG5leHBvcnQgaW1wb3J0IElOb3ZlbCA9IF9Ob3ZlbFNpdGUuSU5vdmVsO1xuXG5pbXBvcnQgeyBSZXNwb25zZVJlcXVlc3QgfSBmcm9tICdyZXF1ZXN0JztcblxuaW1wb3J0IHsgY2hhbGtCeUNvbnNvbGUsIGNvbnNvbGUsIGNvbnNvbGVEZWJ1ZyB9IGZyb20gJy4uLy4uL3V0aWwvbG9nJztcbmltcG9ydCB7IGhhc2hTdW0gfSBmcm9tICcuLi8uLi91dGlsL2hhc2gnO1xuXG5leHBvcnQgdHlwZSBJRmV0Y2hDaGFwdGVyID0ge1xuXHRib2R5PzogYW55O1xuXHRkb20/OiBJSlNET007XG5cdHJlcz86IFJlc3BvbnNlUmVxdWVzdDtcblx0anNvbj8sXG5cblx0dXJsPzogVVJMLFxuXHRjb250ZW50VHlwZVBhcnNlZD86IFJldHVyblR5cGU8cGFyc2VDb250ZW50VHlwZT4sXG59O1xuXG5leHBvcnQgdHlwZSBJU2Vzc2lvbkRhdGEgPSB7XG5cdFtrZXk6IHN0cmluZ106IGFueSxcbn1cblxuQHN0YXRpY0ltcGxlbWVudHM8X05vdmVsU2l0ZS5JTm92ZWxTaXRlU3RhdGljPE5vdmVsU2l0ZURlbW8+PigpXG5leHBvcnQgY2xhc3MgTm92ZWxTaXRlRGVtbyBleHRlbmRzIF9Ob3ZlbFNpdGVcbntcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBJREtFWTogc3RyaW5nID0gbnVsbDtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOiBJRG93bmxvYWRPcHRpb25zLCAuLi5hcmd2KVxuXHR7XG5cdFx0c3VwZXIob3B0aW9ucywgLi4uYXJndik7XG5cdH1cblxuXHQvKipcblx0ICogQHRvZG8g6K6T5q2k5pa55rOV5pyJ5oSP576pXG5cdCAqXG5cdCAqIOeUqOS+huiqquaYjuebruWJjeermem7nueahOaJgOmcgCBzZXNzaW9uIGNvb2tpZXNcblx0ICpcblx0ICogQHBhcmFtIHtUfSBkYXRhXG5cdCAqIEByZXR1cm5zIHtUfVxuXHQgKi9cblx0Y2hlY2tTZXNzaW9uRGF0YTxUID0gSVNlc3Npb25EYXRhPihkYXRhOiBULCBvcHRpb25zUnVudGltZTogSU9wdGlvbnNSdW50aW1lID0ge30pXG5cdHtcblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXG5cdHNlc3Npb248VCA9IElPcHRpb25zUnVudGltZT4ob3B0aW9uc1J1bnRpbWU6IFBhcnRpYWw8VCAmIElEb3dubG9hZE9wdGlvbnM+LCB1cmw6IFVSTCwgZG9tYWluPzogc3RyaW5nKVxuXHR7XG5cdFx0c3VwZXIuc2Vzc2lvbihvcHRpb25zUnVudGltZSwgdXJsKTtcblxuXHRcdGlmIChvcHRpb25zUnVudGltZS5zZXNzaW9uRGF0YSAmJiBPYmplY3Qua2V5cyhvcHRpb25zUnVudGltZS5zZXNzaW9uRGF0YSkubGVuZ3RoKVxuXHRcdHtcblx0XHRcdE9iamVjdC5lbnRyaWVzKG9wdGlvbnNSdW50aW1lLnNlc3Npb25EYXRhKVxuXHRcdFx0XHQuZm9yRWFjaChmdW5jdGlvbiAoZGF0YSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCBjOiBMYXp5Q29va2llLlByb3BlcnRpZXM7XG5cdFx0XHRcdFx0bGV0IHR5cGVjID0gdHlwZW9mIGRhdGFbMV07XG5cblx0XHRcdFx0XHRpZiAoZGF0YVsxXSAmJiB0eXBlYyA9PSAnb2JqZWN0Jylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjID0gZGF0YVsxXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAodHlwZWMgPT09IG51bGwgfHwgdHlwZWMgIT0gJ29iamVjdCcpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bGV0IFtrZXksIHZhbHVlXSA9IGRhdGE7XG5cblx0XHRcdFx0XHRcdGMgPSB7XG5cdFx0XHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0YyA9IGRhdGFbMV07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGMpXG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGMgPT0gJ29iamVjdCcpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlmICghYy5wYXRoKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Yy5wYXRoID0gJy8nO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKGMuaG9zdE9ubHkgPT0gbnVsbClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGMuaG9zdE9ubHkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoISh0eXBlb2YgYyA9PT0gJ3N0cmluZycgfHwgYyBpbnN0YW5jZW9mIExhenlDb29raWUgfHwgYyBpbnN0YW5jZW9mIHRvdWdoQ29va2llLkNvb2tpZSkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0YyA9IG5ldyB0b3VnaENvb2tpZS5Db29raWUoYylcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0b3B0aW9uc1J1bnRpbWUub3B0aW9uc0pTRE9NLmNvb2tpZUphclxuXHRcdFx0XHRcdFx0XHQuc2V0Q29va2llU3luYyhjLCB1cmwuaHJlZilcblx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjID09ICdvYmplY3QnICYmICFjLmRvbWFpbilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0aWYgKGRvbWFpbilcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGMuZG9tYWluID0gZG9tYWluO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgKHVybCAmJiB1cmwuaG9zdClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGMuZG9tYWluID0gdXJsLmhvc3Q7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnNSdW50aW1lLm9wdGlvbnNKU0RPTS5jb29raWVKYXJcblx0XHRcdFx0XHRcdFx0XHRcdC5zZXRDb29raWVTeW5jKGMsIHVybC5ocmVmKVxuXHRcdFx0XHRcdFx0XHRcdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRjYXRjaCAoZSlcblx0XHRcdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cblx0XHRcdGNvbnNvbGVEZWJ1Zy5kZWJ1Zyhgc2Vzc2lvbmAsIG9wdGlvbnNSdW50aW1lLm9wdGlvbnNKU0RPTS5jb29raWVKYXIpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0ZG93bmxvYWQoaW5wdXRVcmw6IHN0cmluZyB8IFVSTCwgZG93bmxvYWRPcHRpb25zOiBJRG93bmxvYWRPcHRpb25zID0ge30pXG5cdHtcblx0XHRjb25zdCBzZWxmID0gdGhpcztcblx0XHRsZXQgdXJsID0gaW5wdXRVcmwgYXMgVVJMO1xuXG5cdFx0Y29uc3QgW1BBVEhfTk9WRUxfTUFJTiwgb3B0aW9uc1J1bnRpbWVdID0gdGhpcy5nZXRPdXRwdXREaXI8SU9wdGlvbnNSdW50aW1lICYgSURvd25sb2FkT3B0aW9ucz4oZG93bmxvYWRPcHRpb25zKTtcblxuXHRcdGNvbnNvbGVEZWJ1Zy5lbmFibGVkID0gb3B0aW9uc1J1bnRpbWUuZGVidWdMb2c7XG5cblx0XHRyZXR1cm4gUHJvbWlzZUJsdWViaXJkXG5cdFx0XHQuYmluZChzZWxmKVxuXHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdHtcblx0XHRcdFx0dXJsID0gYXdhaXQgdGhpcy5jcmVhdGVNYWluVXJsKHVybCwgb3B0aW9uc1J1bnRpbWUpO1xuXG5cdFx0XHRcdHNlbGYuc2Vzc2lvbihvcHRpb25zUnVudGltZSwgdXJsKTtcblxuXHRcdFx0XHRjb25zb2xlRGVidWcuaW5mbygn5YiG5p6Q56ug56+A5YiX6KGoJywgdXJsLnRvU3RyaW5nKCkpO1xuXG5cdFx0XHRcdGxldCBub3ZlbCA9IGF3YWl0IHNlbGYuZ2V0X3ZvbHVtZV9saXN0PElPcHRpb25zUnVudGltZSAmIElEb3dubG9hZE9wdGlvbnM+KHVybCwgb3B0aW9uc1J1bnRpbWUpO1xuXG5cdFx0XHRcdGxldCBwYXRoX25vdmVsID0gc2VsZi5nZXRQYXRoTm92ZWwoUEFUSF9OT1ZFTF9NQUlOLCBub3ZlbCwgb3B0aW9uc1J1bnRpbWUpO1xuXG5cdFx0XHRcdHNlbGYuX2xvYWRFeGlzdHNDb25mKHVybCwgb3B0aW9uc1J1bnRpbWUsIG5vdmVsLCBwYXRoX25vdmVsKTtcblxuXHRcdFx0XHRsZXQgaWR4ID0gb3B0aW9uc1J1bnRpbWUuc3RhcnRJbmRleCB8fCAwO1xuXG5cdFx0XHRcdG9wdGlvbnNSdW50aW1lW1NZTUJPTF9DQUNIRV0ubm92ZWwgPSBub3ZlbDtcblx0XHRcdFx0b3B0aW9uc1J1bnRpbWVbU1lNQk9MX0NBQ0hFXS5wYXRoX25vdmVsID0gcGF0aF9ub3ZlbDtcblxuXHRcdFx0XHRhd2FpdCBQcm9taXNlQmx1ZWJpcmRcblx0XHRcdFx0XHQucmVzb2x2ZShzZWxmLnByb2Nlc3NOb3ZlbChub3ZlbCwgb3B0aW9uc1J1bnRpbWUsIHtcblx0XHRcdFx0XHRcdHVybCxcblx0XHRcdFx0XHRcdHBhdGhfbm92ZWwsXG5cdFx0XHRcdFx0fSkpXG5cdFx0XHRcdFx0LnRhcChscyA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiBzZWxmLl9vdXRwdXRBdHRhY2gobm92ZWwsIG9wdGlvbnNSdW50aW1lLCB7XG5cdFx0XHRcdFx0XHRcdHVybCxcblx0XHRcdFx0XHRcdFx0cGF0aF9ub3ZlbCxcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQudGFwKGxzID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bGV0IGZpbGUgPSBwYXRoLmpvaW4ocGF0aF9ub3ZlbCxcblx0XHRcdFx0XHRcdFx0YCR7c2VsZi50cmltRmlsZW5hbWVOb3ZlbChub3ZlbC5ub3ZlbF90aXRsZSl9LiR7bm92ZWwudXJsX2RhdGEubm92ZWxfaWR9Lmpzb25gLFxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHRcdHJldHVybiBmcy5vdXRwdXRKU09OKGZpbGUsIG5vdmVsLCB7XG5cdFx0XHRcdFx0XHRcdHNwYWNlczogXCJcXHRcIixcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdDtcblxuXHRcdFx0XHRhd2FpdCBzZWxmLl9zYXZlUmVhZG1lKG9wdGlvbnNSdW50aW1lKTtcblxuXHRcdFx0XHRsZXQgX2NhY2hlID0gZHVtbXlDYWNoZSgpO1xuXG5cdFx0XHRcdGF3YWl0IGdsb2JieUFTeW5jKFtcblx0XHRcdFx0XHQnKiovKi50eHQnLFxuXHRcdFx0XHRdLCB7XG5cdFx0XHRcdFx0Y3dkOiBwYXRoX25vdmVsLFxuXHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5tYXBTZXJpZXMoYXN5bmMgKGZpbGUpID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bGV0IF9wID0gcGF0aC5wYXJzZShmaWxlKTtcblx0XHRcdFx0XHRcdGNvbnN0IF9jYWNoZV9rZXlfID0gcGF0aC5qb2luKF9wLmRpciwgX3AubmFtZSk7XG5cblx0XHRcdFx0XHRcdGF3YWl0IGZzXG5cdFx0XHRcdFx0XHRcdC5yZWFkRmlsZShwYXRoLmpvaW4ocGF0aF9ub3ZlbCwgZmlsZSkpXG5cdFx0XHRcdFx0XHRcdC50aGVuKGJ1ZiA9PlxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0YW5hbHl6ZUphMDAyKHtcblx0XHRcdFx0XHRcdFx0XHRcdGlucHV0OiBidWYudG9TdHJpbmcoKSxcblx0XHRcdFx0XHRcdFx0XHRcdF9jYWNoZV9rZXlfLFxuXHRcdFx0XHRcdFx0XHRcdFx0X2NhY2hlLFxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0O1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnRhcChhc3luYyAoKSA9PlxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0bGV0IG1kID0gb3V0cHV0SmEwMDIoe1xuXHRcdFx0XHRcdFx0XHRpbnB1dERhdGE6IF9jYWNoZS5qYTIsXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGZzLm91dHB1dEZpbGUocGF0aC5qb2luKHBhdGhfbm92ZWwsICdqYTIubWQnKSwgbWQpXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0O1xuXG5cdFx0XHRcdHJldHVybiBub3ZlbDtcblx0XHRcdH0pXG5cdFx0XHQ7XG5cdH1cblxuXHRwcm90ZWN0ZWQgYXN5bmMgX291dHB1dEF0dGFjaDxUID0gYW55Pihub3ZlbDogSU5vdmVsLCBvcHRpb25zUnVudGltZTogSU9wdGlvbnNSdW50aW1lLCBfY2FjaGVfOiB7XG5cdFx0dXJsOiBVUkwsXG5cdFx0cGF0aF9ub3ZlbDogc3RyaW5nLFxuXHR9LCAuLi5hcmd2KVxuXHR7XG5cdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cdFx0Y29uc3QgeyB1cmwsIHBhdGhfbm92ZWwgfSA9IF9jYWNoZV87XG5cblx0XHRpZiAobm92ZWwudm9sdW1lX2xpc3QpXG5cdFx0e1xuXHRcdFx0Y29uc3QgeyBrZWVwSW1hZ2UgPSBmYWxzZSB9ID0gb3B0aW9uc1J1bnRpbWU7XG5cblx0XHRcdGNvbnNvbGVEZWJ1Zy5pbmZvKGDmqqLmn6UgQVRUQUNIIOizh+aWmWApO1xuXG5cdFx0XHRyZXR1cm4gUHJvbWlzZUJsdWViaXJkXG5cdFx0XHRcdC5yZXNvbHZlKG5vdmVsLnZvbHVtZV9saXN0KVxuXHRcdFx0XHQuZWFjaCgodm9sdW1lLCB2aWQpID0+XG5cdFx0XHRcdHtcblxuXHRcdFx0XHRcdGxldCBkaXJuYW1lOiBzdHJpbmc7XG5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgX3ZpZCA9ICcnO1xuXG5cdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnNSdW50aW1lLm5vRGlyUHJlZml4KVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRfdmlkID0gdmlkLnRvU3RyaW5nKCkucGFkU3RhcnQoNCwgJzAnKSArICcwJztcblx0XHRcdFx0XHRcdFx0X3ZpZCArPSAnXyc7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGRpcm5hbWUgPSBwYXRoLmpvaW4ocGF0aF9ub3ZlbCxcblx0XHRcdFx0XHRcdFx0YCR7X3ZpZH0ke3NlbGYudHJpbUZpbGVuYW1lVm9sdW1lKHZvbHVtZS52b2x1bWVfdGl0bGUpfWAsXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxldCBpbWdzOiBzdHJpbmdbXSA9IFtdO1xuXG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2VCbHVlYmlyZFxuXHRcdFx0XHRcdFx0LnJlc29sdmUodm9sdW1lLmNoYXB0ZXJfbGlzdClcblx0XHRcdFx0XHRcdC5lYWNoKGFzeW5jIChjaGFwdGVyKSA9PlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRpZiAoY2hhcHRlci5pbWdzKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0aW1ncy5wdXNoKC4uLmNoYXB0ZXIuaW1ncyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudGFwKGFzeW5jICgpID0+XG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGltZ3MgPSBpbWdzLmZpbHRlcih2ID0+IHYpO1xuXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGVEZWJ1Zy5kZWJ1ZyhgW0FUVEFDSF1gLCBgJHtwYXRoLnJlbGF0aXZlKHBhdGhfbm92ZWwsIGRpcm5hbWUpfWAsIGltZ3MubGVuZ3RoKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoaW1ncy5sZW5ndGgpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRsZXQgZmlsZSA9IHBhdGguam9pbihkaXJuYW1lLCAnQVRUQUNILm1kJyk7XG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgbWRfZGF0YSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdGF0dGFjaDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpbWFnZXM6IHt9IGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoa2VlcEltYWdlIHx8IDEpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZnMucmVhZEZpbGUoZmlsZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0LnRoZW4odiA9PiBtZGNvbmZfcGFyc2UodikpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0XHRcdFx0LnRoZW4oKGRhdGE6IHR5cGVvZiBtZF9kYXRhKSA9PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5hdHRhY2ggPSBkYXRhLmF0dGFjaCB8fCB7fSBhcyBhbnk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5hdHRhY2guaW1hZ2VzID0gZGF0YS5hdHRhY2guaW1hZ2VzIHx8IHt9O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWRfZGF0YSA9IGRhdGE7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlRGVidWcuZGVidWcoYExvYWQgZGF0YSBmcm9tIGV4aXN0cyBBVFRBQ0gubWRgKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdG1kX2RhdGEuYXR0YWNoLmltYWdlcyA9IE9iamVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0LmVudHJpZXMoaW1ncyBhcyBzdHJpbmdbXSlcblx0XHRcdFx0XHRcdFx0XHRcdC5yZWR1Y2UoKGEsIFtrLCB2XSkgPT5cblx0XHRcdFx0XHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoa2VlcEltYWdlKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YVtoYXNoU3VtKHYpXSA9IHY7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YVtrLnRvU3RyaW5nKCkucGFkU3RhcnQoMywgJzAnKV0gPSB2O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFcblx0XHRcdFx0XHRcdFx0XHRcdH0sIG1kX2RhdGEuYXR0YWNoLmltYWdlcyk7XG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgbWQgPSBtZGNvbmZfc3RyaW5naWZ5KG1kX2RhdGEpO1xuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZzLm91dHB1dEZpbGUoZmlsZSwgbWQpXG5cdFx0XHRcdFx0XHRcdFx0XHQudGhlbihyID0+XG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZURlYnVnLnN1Y2Nlc3MoYFtBVFRBQ0hdYCwgYFtTQVZFXWAsIGAke3BhdGgucmVsYXRpdmUocGF0aF9ub3ZlbCwgZmlsZSl9YCk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHI7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdFx0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFByb21pc2VCbHVlYmlyZC5yZXNvbHZlKClcblx0fVxuXG5cdHByb3RlY3RlZCBhc3luYyBfcHJvY2Vzc05vdmVsPFQgPSBhbnk+KG5vdmVsOiBJTm92ZWwsIG9wdGlvbnNSdW50aW1lOiBJT3B0aW9uc1J1bnRpbWUsIF9jYWNoZV86IHtcblx0XHR1cmw6IFVSTCxcblx0XHRwYXRoX25vdmVsOiBzdHJpbmcsXG5cdH0sIC4uLmFyZ3YpXG5cdHtcblx0XHRjb25zdCBzZWxmID0gdGhpcztcblx0XHRsZXQgaWR4ID0gb3B0aW9uc1J1bnRpbWUuc3RhcnRJbmRleCB8fCAwO1xuXG5cdFx0bGV0IHsgdXJsLCBwYXRoX25vdmVsIH0gPSBfY2FjaGVfO1xuXG5cdFx0cmV0dXJuIFByb21pc2VCbHVlYmlyZFxuXHRcdFx0Lm1hcFNlcmllcyhub3ZlbC52b2x1bWVfbGlzdCwgKHZvbHVtZSwgdmlkKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgZGlybmFtZTogc3RyaW5nO1xuXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgX3ZpZCA9ICcnO1xuXG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zUnVudGltZS5ub0RpclByZWZpeClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRfdmlkID0gdmlkLnRvU3RyaW5nKCkucGFkU3RhcnQoNCwgJzAnKSArICcwJztcblx0XHRcdFx0XHRcdF92aWQgKz0gJ18nO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGRpcm5hbWUgPSBwYXRoLmpvaW4ocGF0aF9ub3ZlbCxcblx0XHRcdFx0XHRcdGAke192aWR9JHtzZWxmLnRyaW1GaWxlbmFtZVZvbHVtZSh2b2x1bWUudm9sdW1lX3RpdGxlKX1gLFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zb2xlRGVidWcuZGVidWcodmlkLCB2b2x1bWUudm9sdW1lX3RpdGxlKTtcblxuXHRcdFx0XHRpZiAoIW9wdGlvbnNSdW50aW1lLm5vRmlyZVByZWZpeCAmJiBvcHRpb25zUnVudGltZS5maWxlUHJlZml4TW9kZSA+PSAyKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IGk6IG51bWJlcjtcblxuXHRcdFx0XHRcdGxldCBib29sID0gdm9sdW1lLmNoYXB0ZXJfbGlzdC5ldmVyeShmdW5jdGlvbiAoY2hhcHRlciwgailcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgbSA9IChvcHRpb25zUnVudGltZS5maWxlUHJlZml4TW9kZSA+IDMgP1xuXHRcdFx0XHRcdFx0XHRcdGNoYXB0ZXIuY2hhcHRlcl90aXRsZSA6IG5vcm1hbGl6ZV92YWwoY2hhcHRlci5jaGFwdGVyX3RpdGxlKVxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdC5yZXBsYWNlKC9eXFxEKy8sICcnKVxuXHRcdFx0XHRcdFx0XHQvLy5yZXBsYWNlKC9eKFxcZCspLiskLywgJyQxJylcblx0XHRcdFx0XHRcdFx0LnJlcGxhY2UoL14oXFxkKylcXEQuKiQvLCAnJDEnKVxuXHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKG0sIGNoYXB0ZXIuY2hhcHRlcl90aXRsZSk7XG5cblx0XHRcdFx0XHRcdGlmICgvXlxcZCskLy50ZXN0KG0pKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsZXQgbTIgPSBwYXJzZUludChtKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoaiA9PSAwKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0aSA9IG0yO1xuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAobTIgPT09ICsraSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coYm9vbCk7XG5cblx0XHRcdFx0XHRpZiAoYm9vbClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR2b2x1bWUuY2hhcHRlcl9saXN0LmZvckVhY2goZnVuY3Rpb24gKGNoYXB0ZXIpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNoYXB0ZXIuY2hhcHRlcl9pbmRleCA9ICcnO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKG9wdGlvbnNSdW50aW1lLmV2ZW50KVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c2VsZi5lbWl0KG9wdGlvbnNSdW50aW1lLmV2ZW50LCAndm9sdW1lJywgdm9sdW1lLCB7XG5cdFx0XHRcdFx0XHRvcHRpb25zUnVudGltZSxcblx0XHRcdFx0XHRcdGRpcm5hbWUsXG5cdFx0XHRcdFx0XHR2aWQsXG5cdFx0XHRcdFx0XHRub3ZlbCxcblx0XHRcdFx0XHRcdHVybCxcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBQcm9taXNlQmx1ZWJpcmRcblx0XHRcdFx0XHQubWFwU2VyaWVzKHZvbHVtZS5jaGFwdGVyX2xpc3QsIGFzeW5jIChjaGFwdGVyLCBjaWQpID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Ly9jaGFwdGVyLmNoYXB0ZXJfaW5kZXggPSAoaWR4KyspO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBjdXJyZW50X2lkeCA9IGlkeCsrO1xuXG5cdFx0XHRcdFx0XHRsZXQgZmlsZSA9IGdldEZpbGVQYXRoKHNlbGYsIHtcblx0XHRcdFx0XHRcdFx0Y2hhcHRlciwgY2lkLFxuXHRcdFx0XHRcdFx0XHRleHQ6ICcudHh0JyxcblxuXHRcdFx0XHRcdFx0XHRpZHg6IGN1cnJlbnRfaWR4LFxuXG5cdFx0XHRcdFx0XHRcdGRpcm5hbWUsXG5cdFx0XHRcdFx0XHRcdHZvbHVtZSwgdmlkLFxuXHRcdFx0XHRcdFx0fSwgb3B0aW9uc1J1bnRpbWUpO1xuXG5cdFx0XHRcdFx0XHRpZiAoc2VsZi5fY2hlY2tFeGlzdHMob3B0aW9uc1J1bnRpbWUsIGZpbGUpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlRGVidWcuZGVidWcoYFtTS0lQXWAsIHZpZCwgY2lkLCBjaGFwdGVyLmNoYXB0ZXJfdGl0bGUpO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmaWxlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgdXJsID0gc2VsZi5fY3JlYXRlQ2hhcHRlclVybCh7XG5cdFx0XHRcdFx0XHRcdG5vdmVsLFxuXHRcdFx0XHRcdFx0XHR2b2x1bWUsXG5cdFx0XHRcdFx0XHRcdGNoYXB0ZXIsXG5cdFx0XHRcdFx0XHR9LCBvcHRpb25zUnVudGltZSk7XG5cblx0XHRcdFx0XHRcdGNvbnNvbGVEZWJ1Zy5kZWJ1Zyh2aWQsIGNpZCwgY2hhcHRlci5jaGFwdGVyX3RpdGxlKTtcblx0XHRcdFx0XHRcdC8vY29uc29sZURlYnVnLmRlYnVnKHVybC50b1N0cmluZygpKTtcblxuXHRcdFx0XHRcdFx0YXdhaXQgc2VsZi5fZmV0Y2hDaGFwdGVyTWFpbih7XG5cdFx0XHRcdFx0XHRcdFx0dXJsLFxuXHRcdFx0XHRcdFx0XHRcdGZpbGUsXG5cdFx0XHRcdFx0XHRcdFx0dm9sdW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNoYXB0ZXIsXG5cdFx0XHRcdFx0XHRcdH0sIG9wdGlvbnNSdW50aW1lLCB7XG5cdFx0XHRcdFx0XHRcdFx0bm92ZWwsXG5cdFx0XHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0XHRcdFx0LnRoZW4oYXN5bmMgKHRleHQ6IHN0cmluZykgPT5cblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuX3NhdmVGaWxlKHtcblx0XHRcdFx0XHRcdFx0XHRcdGZpbGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRjb250ZXh0OiB0ZXh0LFxuXHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9uc1J1bnRpbWUsXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGV4dDtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGZpbGU7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQ7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJldClcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHJldCBhcyBhbnkgYXMgVDtcblx0XHRcdH0pXG5cdFx0XHQ7XG5cdH1cblxuXHRwcm9jZXNzTm92ZWw8VD4obm92ZWw6IElOb3ZlbCwgb3B0aW9uc1J1bnRpbWU6IElPcHRpb25zUnVudGltZSwgX2NhY2hlXzoge1xuXHRcdHVybDogVVJMLFxuXHRcdHBhdGhfbm92ZWw6IHN0cmluZyxcblx0fSwgLi4uYXJndilcblx0e1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRsZXQgcHI6IGFueTtcblxuXHRcdGNvbnNvbGVEZWJ1Zy5pbmZvKCfplovlp4vomZXnkIblsI/oqqonKTtcblxuXHRcdHByID0gb3B0aW9uc1J1bnRpbWUuZmV0Y2hNZXRhRGF0YU9ubHkgPyBbXSA6IHRoaXMuX3Byb2Nlc3NOb3ZlbDxUPihub3ZlbCwgb3B0aW9uc1J1bnRpbWUsIF9jYWNoZV8sIC4uLmFyZ3YpO1xuXG5cdFx0cmV0dXJuIFByb21pc2VCbHVlYmlyZFxuXHRcdFx0LnJlc29sdmUocHIpXG5cdFx0XHQudGhlbihmdW5jdGlvbiAocmV0OiBUKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdG5vdmVsLFxuXHRcdFx0XHRcdG9wdGlvbnNSdW50aW1lLFxuXHRcdFx0XHRcdF9jYWNoZV8sXG5cdFx0XHRcdFx0cmV0LFxuXHRcdFx0XHR9O1xuXHRcdFx0fSlcblx0XHRcdDtcblx0fVxuXG5cdHByb3RlY3RlZCBfc3RyaXBDb250ZW50KHRleHQ6IHN0cmluZylcblx0e1xuXHRcdHJldHVybiB0ZXh0O1xuXHR9XG5cblx0cHJvdGVjdGVkIF9wYXJzZUNoYXB0ZXI8VD4ocmV0OiBJRmV0Y2hDaGFwdGVyLCBvcHRpb25zUnVudGltZTogVCAmIElPcHRpb25zUnVudGltZSwgY2FjaGU6IHtcblx0XHRmaWxlOiBzdHJpbmcsXG5cdFx0bm92ZWw6IF9Ob3ZlbFNpdGUuSU5vdmVsLFxuXHRcdHZvbHVtZTogX05vdmVsU2l0ZS5JVm9sdW1lLFxuXHRcdGNoYXB0ZXI6IF9Ob3ZlbFNpdGUuSUNoYXB0ZXIsXG5cdFx0ZG9SZXRyeTogbnVtYmVyLFxuXHR9KTogc3RyaW5nIHwgUHJvbWlzZTxzdHJpbmc+XG5cdHtcblx0XHRpZiAoIXJldClcblx0XHR7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKGBGdW5jdGlvbiBub3QgaW1wbGVtZW50ZWRgKTtcblx0fVxuXG5cdHByb3RlY3RlZCBfZmV0Y2hDaGFwdGVyUmV0cnlFcnJvcjxUPihtZXNzYWdlOiBzdHJpbmcsIHJldDogSUZldGNoQ2hhcHRlciwgb3B0aW9uc1J1bnRpbWU6IFQgJiBJT3B0aW9uc1J1bnRpbWUsIGNhY2hlOiB7XG5cdFx0ZmlsZTogc3RyaW5nLFxuXHRcdG5vdmVsOiBfTm92ZWxTaXRlLklOb3ZlbCxcblx0XHR2b2x1bWU6IF9Ob3ZlbFNpdGUuSVZvbHVtZSxcblx0XHRjaGFwdGVyOiBfTm92ZWxTaXRlLklDaGFwdGVyLFxuXHRcdGRvUmV0cnk6IG51bWJlcixcblx0fSk6IEVycm9yICYge1xuXHRcdGRvUmV0cnk6IG51bWJlclxuXHR9XG5cdHtcblx0XHRsZXQgZTogRXJyb3IgJiB7XG5cdFx0XHRkb1JldHJ5OiBudW1iZXJcblx0XHR9ID0gbmV3IEVycm9yKG1lc3NhZ2UpIGFzIGFueTtcblxuXHRcdGUuZG9SZXRyeSA9IChjYWNoZS5kb1JldHJ5IHwgMCkgKyAxO1xuXG5cdFx0cmV0dXJuIGVcblx0fVxuXG5cdHByb3RlY3RlZCBfZmV0Y2hDaGFwdGVyTWFpbjxUPihhcmd2OiB7XG5cdFx0dXJsOiBVUkwsXG5cdFx0ZmlsZTogc3RyaW5nLFxuXHRcdHZvbHVtZTogX05vdmVsU2l0ZS5JVm9sdW1lLFxuXHRcdGNoYXB0ZXI6IF9Ob3ZlbFNpdGUuSUNoYXB0ZXIsXG5cdH0sIG9wdGlvbnNSdW50aW1lOiBUICYgSU9wdGlvbnNSdW50aW1lLCBfY2FjaGVfOiB7XG5cdFx0bm92ZWw6IElOb3ZlbCxcblx0fSlcblx0e1xuXHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xuXG5cdFx0bGV0IHsgdXJsLCBmaWxlLCB2b2x1bWUsIGNoYXB0ZXIgfSA9IGFyZ3Y7XG5cdFx0bGV0IHsgbm92ZWwgfSA9IF9jYWNoZV87XG5cblx0XHRyZXR1cm4gUHJvbWlzZUJsdWViaXJkLnJlc29sdmUoKVxuXHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IF9kbyA9IGZhbHNlO1xuXHRcdFx0XHRsZXQgZG9SZXRyeSA9IDA7XG5cdFx0XHRcdGxldCB2YWx1ZTogc3RyaW5nO1xuXHRcdFx0XHRkb1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0X2RvID0gZmFsc2U7XG5cblx0XHRcdFx0XHR2YWx1ZSA9IGF3YWl0IHNlbGYuX2ZldGNoQ2hhcHRlcih1cmwsIG9wdGlvbnNSdW50aW1lLCB7XG5cdFx0XHRcdFx0XHRcdG5vdmVsLFxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50aGVuKGFzeW5jIChyZXQpID0+XG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBzZWxmLl9wYXJzZUNoYXB0ZXIocmV0LCBvcHRpb25zUnVudGltZSwge1xuXHRcdFx0XHRcdFx0XHRcdGZpbGUsXG5cdFx0XHRcdFx0XHRcdFx0bm92ZWwsXG5cdFx0XHRcdFx0XHRcdFx0dm9sdW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNoYXB0ZXIsXG5cdFx0XHRcdFx0XHRcdFx0ZG9SZXRyeSxcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmNhdGNoKGFzeW5jIChlOiBFcnJvciAmIHtcblx0XHRcdFx0XHRcdFx0ZG9SZXRyeTogbnVtYmVyXG5cdFx0XHRcdFx0XHR9KSA9PlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRpZiAoZS5kb1JldHJ5ID4gMCAmJiBlLmRvUmV0cnkgPCA1KVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0X2RvID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRkb1JldHJ5ID0gZS5kb1JldHJ5IHwgMDtcblx0XHRcdFx0XHRcdFx0XHRsZXQgZGVsYXkgPSA1MDAwICsgZG9SZXRyeSAqIDEwMDA7XG5cblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oZS5tZXNzYWdlLCBkb1JldHJ5LCBkZWxheSk7XG5cblx0XHRcdFx0XHRcdFx0XHRhd2FpdCBQcm9taXNlQmx1ZWJpcmQuZGVsYXkoZGVsYXkpO1xuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZSlcblx0XHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0fVxuXHRcdFx0XHR3aGlsZSAoX2RvKTtcblxuXHRcdFx0XHRyZXR1cm4gdmFsdWVcblx0XHRcdH0pXG5cdFx0XHQudGhlbihmdW5jdGlvbiAodGV4dClcblx0XHRcdHtcblx0XHRcdFx0aWYgKHR5cGVvZiB0ZXh0ID09ICdzdHJpbmcnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIG5vdmVsVGV4dC50b1N0cih0ZXh0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0ZXh0O1xuXHRcdFx0fSlcblx0XHRcdDtcblx0fVxuXG5cdHByb3RlY3RlZCBfZmV0Y2hDaGFwdGVyPFQ+KHVybDogVVJMLCBvcHRpb25zUnVudGltZTogVCAmIElPcHRpb25zUnVudGltZSwgX2NhY2hlXzoge1xuXHRcdG5vdmVsOiBJTm92ZWwsXG5cdH0pXG5cdHtcblx0XHRyZXR1cm4gUHJvbWlzZUJsdWViaXJkLnJlc29sdmUoKS50aGVuKGFzeW5jIGZ1bmN0aW9uICgpXG5cdFx0e1xuXHRcdFx0Y29uc29sZURlYnVnLmRlYnVnKGBmZXRjaENoYXB0ZXJgLCB1cmwudG9TdHJpbmcoKSk7XG5cblx0XHRcdGxldCByZXQgPSB7fSBhcyBJRmV0Y2hDaGFwdGVyO1xuXG5cdFx0XHRsZXQgb3B0cyA9IGdldE9wdGlvbnMob3B0aW9uc1J1bnRpbWUpO1xuXG5cdFx0XHRpZiAob3B0aW9uc1J1bnRpbWUuZGlzYWJsZURvd25sb2FkKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHRydWUpXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChvcHRpb25zUnVudGltZS5yZXRyeURlbGF5ID4gMClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRvcHRzLnJlcXVlc3RPcHRpb25zLmRlbGF5ID0gb3B0aW9uc1J1bnRpbWUucmV0cnlEZWxheTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0b3B0cy5yZXF1ZXN0T3B0aW9ucy5yZXRyeSA9IDE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhd2FpdCByZXRyeVJlcXVlc3QodXJsLCBvcHRzLnJlcXVlc3RPcHRpb25zKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgY29udGVudFR5cGVQYXJzZWQgPSBwYXJzZUNvbnRlbnRUeXBlKHJlcy5oZWFkZXJzW1wiY29udGVudC10eXBlXCJdKTtcblxuXHRcdFx0XHRcdFx0cmV0LmNvbnRlbnRUeXBlUGFyc2VkID0gY29udGVudFR5cGVQYXJzZWQ7XG5cblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdHJldC51cmwgPSB1cmw7XG5cblx0XHRcdFx0XHRcdGlmIChjb250ZW50VHlwZVBhcnNlZC5pc0hUTUwoKSB8fCBjb250ZW50VHlwZVBhcnNlZC5pc1hNTCgpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRyZXQuZG9tID0gcmVxdWVzdFRvSlNET00ocmVzLCB1cmwsIG9wdGlvbnNSdW50aW1lLm9wdGlvbnNKU0RPTSk7XG5cdFx0XHRcdFx0XHRcdHJldC5kb20gPSBwYWNrSlNET00ocmV0LmRvbSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChjb250ZW50VHlwZVBhcnNlZC5zdWJ0eXBlID09ICdqc29uJylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmV0Lmpzb24gPSBKU09OLnBhcnNlKHJlcy5ib2R5LnRvU3RyaW5nKCkpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXQucmVzID0gcmVzO1xuXHRcdFx0XHRcdFx0cmV0LmJvZHkgPSByZXMuYm9keTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQ7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0LmRvbSA9IGF3YWl0IGZyb21VUkwodXJsLCBvcHRpb25zUnVudGltZS5vcHRpb25zSlNET00pO1xuXG5cdFx0XHRcdHJldC5yZXMgPSByZXQuZG9tLl9vcHRpb25zLlJlc3BvbnNlO1xuXHRcdFx0XHRyZXQuYm9keSA9IHJldC5kb20uX29wdGlvbnMuYm9keTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9KTtcblx0fVxuXG5cdHByb3RlY3RlZCBfZXhwb3J0RG93bmxvYWRPcHRpb25zPFQgPSBJT3B0aW9uc1J1bnRpbWU+KG9wdGlvbnNSdW50aW1lPzogVCAmIElPcHRpb25zUnVudGltZSk6IFBhcnRpYWw8VCAmIElPcHRpb25zUnVudGltZT5cblx0e1xuXHRcdGxldCBvcHRzOiBQYXJ0aWFsPFQgJiBJT3B0aW9uc1J1bnRpbWU+ID0ge307XG5cblx0XHRpZiAob3B0aW9uc1J1bnRpbWUpXG5cdFx0e1xuXHRcdFx0bGV0IGJvb2w6IGJvb2xlYW47XG5cblx0XHRcdGZvciAobGV0IGsgb2YgW1xuXHRcdFx0XHQnbm9GaXJlUHJlZml4Jyxcblx0XHRcdFx0J25vRmlsZVBhZGVuZCcsXG5cdFx0XHRcdCdmaWxlUHJlZml4TW9kZScsXG5cdFx0XHRcdCdzdGFydEluZGV4Jyxcblx0XHRcdFx0J2tlZXBSdWJ5Jyxcblx0XHRcdFx0J2tlZXBGb3JtYXQnLFxuXHRcdFx0XHQna2VlcEltYWdlJyxcblx0XHRcdFx0J2FsbG93RW1wdHlWb2x1bWVUaXRsZScsXG5cdFx0XHRcdCdkaXNhYmxlT3V0cHV0RGlyUHJlZml4Jyxcblx0XHRcdF0gYXMgKGtleW9mIElPcHRpb25zUnVudGltZSlbXSlcblx0XHRcdHtcblx0XHRcdFx0aWYgKChrIGluIG9wdGlvbnNSdW50aW1lKSAmJiB0eXBlb2Ygb3B0aW9uc1J1bnRpbWVba10gIT09ICd1bmRlZmluZWQnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ym9vbCA9IHRydWU7XG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdG9wdHNba10gPSBvcHRpb25zUnVudGltZVtrXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvcHRzO1xuXHR9XG5cblx0cHJvdGVjdGVkIF9zYXZlUmVhZG1lKG9wdGlvbnNSdW50aW1lOiBJT3B0aW9uc1J1bnRpbWUsIG9wdGlvbnMgPSB7fSwgLi4ub3B0cylcblx0e1xuXHRcdGlmICh0aGlzLklES0VZKVxuXHRcdHtcblx0XHRcdG9wdGlvbnNbdGhpcy5JREtFWV0gPSBvcHRpb25zW3RoaXMuSURLRVldIHx8IHt9O1xuXG5cdFx0XHR0cnlcblx0XHRcdHtcblx0XHRcdFx0b3B0aW9uc1t0aGlzLklES0VZXS5ub3ZlbF9pZCA9IG9wdGlvbnNbdGhpcy5JREtFWV0ubm92ZWxfaWQgfHwgb3B0aW9uc1J1bnRpbWVbU1lNQk9MX0NBQ0hFXS5ub3ZlbC51cmxfZGF0YS5ub3ZlbF9pZDtcblx0XHRcdH1cblx0XHRcdGNhdGNoIChlKVxuXHRcdFx0e1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBkb3dubG9hZE9wdGlvbnMgPSB0aGlzLl9leHBvcnREb3dubG9hZE9wdGlvbnMob3B0aW9uc1J1bnRpbWUpO1xuXG5cdFx0cmV0dXJuIHN1cGVyLl9zYXZlUmVhZG1lKG9wdGlvbnNSdW50aW1lLCBvcHRpb25zLCB7XG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdHRleHRsYXlvdXQ6IHtcblx0XHRcdFx0XHRhbGxvd19sZjI6IHRydWUsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRvd25sb2FkT3B0aW9uczogZG93bmxvYWRPcHRpb25zIHx8IHt9LFxuXHRcdFx0fSxcblx0XHR9LCAuLi5vcHRzKTtcblx0fVxuXG5cdHByb3RlY3RlZCBfZ2V0X21ldGEoaW5wdXRVcmwsIG9wdGlvbnNSdW50aW1lLCBjYWNoZT86IHtcblx0XHRkb20/OiBJSlNET00sXG5cdH0pXG5cdHtcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoKTtcblx0fVxuXG59XG5cbmV4cG9ydCBjb25zdCBOb3ZlbFNpdGUgPSBOb3ZlbFNpdGVEZW1vIGFzIHR5cGVvZiBOb3ZlbFNpdGVEZW1vO1xuXG5leHBvcnQgZGVmYXVsdCBOb3ZlbFNpdGVEZW1vO1xuIl19