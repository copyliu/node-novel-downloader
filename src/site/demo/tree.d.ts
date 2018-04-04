/**
 * Created by user on 2018/4/4/004.
 */
export * from './base';
import _NovelSiteBase, { IDownloadOptions, IOptionsRuntime as _IOptionsRuntime, INovel as _INovel } from './base';
import { IRowChapter, IRowVolume, NovelTree, ITree } from '../../tree/index';
export { NovelTree };
export declare type IOptionsRuntime = _IOptionsRuntime & {
    novelTree?: NovelTree;
};
export declare type INovel = _INovel & {
    novelTree?: NovelTree;
};
export declare class NovelSiteDemo extends _NovelSiteBase {
    getOutputDir<T extends IOptionsRuntime & IDownloadOptions>(options: T, novelName?: string): [string, T];
    protected _processNovelListName(novel: INovel, optionsRuntime: IOptionsRuntime, ...argv: any[]): Promise<{
        id?: string | number;
        parent?: string | number;
        uuid?: string;
        content: (ITree & {
            type?: "root";
        }) | IRowVolume<{}> | IRowChapter<{}>;
    }[]>;
    _processNovel<T>(novel: INovel, optionsRuntime: IOptionsRuntime, _cache_: {
        url: URL;
        path_novel: string;
    }, ...argv: any[]): Promise<T>;
    protected _saveReadme(optionsRuntime: IOptionsRuntime, options?: {}, ...opts: any[]): Promise<{
        file: string;
        md: string;
    }>;
}
export declare const NovelSite: typeof NovelSiteDemo;
export default NovelSiteDemo;
