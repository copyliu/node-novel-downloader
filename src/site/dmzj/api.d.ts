/**
 * Created by user on 2018/3/25/025.
 */
import _NovelSite from '../index';
import { IDownloadOptions, INovel } from '../demo/base';
import { IFetchChapter, IOptionsRuntime } from '../demo/base';
import NovelSiteBase from '../demo/base';
import { IJSDOM } from 'jsdom-extra';
export declare class NovelSiteTpl extends NovelSiteBase {
    static readonly IDKEY: string;
    makeUrl(urlobj: _NovelSite.IParseUrl, bool?: boolean | number): URL;
    parseUrl(url: URL | string, options?: any): _NovelSite.IParseUrl;
    session<T = IOptionsRuntime>(optionsRuntime: Partial<T & IDownloadOptions>, url: URL): this;
    createMainUrl(url: any): URL;
    _stripContent(text: string): string;
    protected _saveReadme(optionsRuntime: IOptionsRuntime, options?: {}, ...opts: any[]): Promise<{
        file: string;
        md: string;
    }>;
    protected _parseChapter<T>(ret: IFetchChapter, optionsRuntime: T & IOptionsRuntime, cache: any): string;
    _createChapterUrl<T = IOptionsRuntime>({ novel, volume, chapter, }: {
        novel: any;
        volume: any;
        chapter: any;
    }, optionsRuntime?: any): import("jsdom-url/lib/URL").URLCore;
    get_volume_list<T = IOptionsRuntime>(inputUrl: string | URL, optionsRuntime?: Partial<T & IDownloadOptions>): Promise<INovel>;
    protected _get_meta(inputUrl: any, optionsRuntime: any, cache: {
        dom: IJSDOM;
    }): Promise<{
        novel_url: URL;
        novel_id: any;
        novel_title: any;
        novel_cover: any;
        novel_author: any;
        novel_desc: any;
        novel_date: any;
        dmzj_api_json: any;
        novel?: {
            title?: string;
            title_short?: string;
            author?: string;
            cover?: string;
            preface?: string;
            tags?: string[];
            date?: string;
            status?: string;
            r18?: string;
            series?: {
                name?: string;
                name_short?: string;
                position?: number;
            };
            source?: string;
            publisher?: string;
        };
        contribute?: string[];
        options?: {
            [key: string]: any;
            textlayout?: {
                allow_lf2?: boolean;
            };
        };
        link?: string[];
        url: URL;
        url_data: _NovelSite.IParseUrl;
        url_api: URL;
        url_data_api: _NovelSite.IParseUrl;
    }>;
}
export default NovelSiteTpl;
