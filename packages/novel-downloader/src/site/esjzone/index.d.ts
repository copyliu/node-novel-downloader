/**
 * Created by user on 2018/3/17/017.
 */
import NovelSiteDemo, { IDownloadOptions, INovel, IOptionsRuntime } from '../demo/tree';
import NovelSite from '../index';
export declare class NovelSiteESJZone extends NovelSiteDemo {
    static readonly IDKEY = "esjzone";
    static check(url: string | URL | NovelSite.IParseUrl, options?: any): boolean;
    makeUrl(urlobj: NovelSite.IParseUrl, bool?: boolean): URL;
    parseUrl(url: string | URL): NovelSite.IParseUrl;
    protected _parseChapter<T>(ret: any, optionsRuntime: any, cache: any): string;
    get_volume_list<T extends IOptionsRuntime>(url: string | URL, optionsRuntime?: Partial<T & IDownloadOptions>): Promise<INovel>;
}
export default NovelSiteESJZone;