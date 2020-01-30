"use strict";
/**
 * Created by user on 2018/10/6/006.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lazy_1 = require("novel-downloader/src/lazy");
const novel_downloader_1 = require("novel-downloader");
function createSite(siteID, options) {
    let o = novel_downloader_1.default(siteID);
    // @ts-ignore
    return new o(options);
}
exports.createSite = createSite;
function download(url, downloadOptions, siteID, options) {
    if (!siteID) {
        siteID = lazy_1.searchSiteID(url) || novel_downloader_1.EnumNovelSiteList.NovelSiteSyosetu;
    }
    ({ downloadOptions, options } = handleOptions(downloadOptions, siteID, options));
    const Site = createSite(siteID, options || {});
    return Site.download(url, downloadOptions);
}
exports.download = download;
function handleOptions(downloadOptions, siteID, options) {
    return {
        downloadOptions,
        options,
    };
}
exports.handleOptions = handleOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsb0RBQXlEO0FBR3pELHVEQUFzRjtBQUV0RixTQUFnQixVQUFVLENBQW9ELE1BQTBCLEVBQ3ZHLE9BRUM7SUFHRCxJQUFJLENBQUMsR0FBRywwQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV0QyxhQUFhO0lBQ2IsT0FBTyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2QixDQUFDO0FBVkQsZ0NBVUM7QUFFRCxTQUFnQixRQUFRLENBQXdILEdBQVcsRUFDMUosZUFFQyxFQUVELE1BQTBCLEVBQzFCLE9BRUM7SUFHRCxJQUFJLENBQUMsTUFBTSxFQUNYO1FBQ0MsTUFBTSxHQUFHLG1CQUFZLENBQUMsR0FBRyxDQUFDLElBQUksb0NBQWlCLENBQUMsZ0JBQWdCLENBQUM7S0FDakU7SUFFRCxDQUFDLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxHQUFHLGFBQWEsQ0FBQyxlQUFlLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFakYsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7SUFFL0MsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQTtBQUMzQyxDQUFDO0FBckJELDRCQXFCQztBQUVELFNBQWdCLGFBQWEsQ0FBc0UsZUFFakcsRUFDRCxNQUF5QixFQUN6QixPQUVDO0lBR0QsT0FBTztRQUNOLGVBQWU7UUFDZixPQUFPO0tBQ1AsQ0FBQTtBQUNGLENBQUM7QUFiRCxzQ0FhQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTgvMTAvNi8wMDYuXG4gKi9cblxuaW1wb3J0IHsgc2VhcmNoU2l0ZUlEIH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvbGF6eSc7XG5pbXBvcnQgeyBjb25zb2xlIH0gZnJvbSAnLi9saWIvbG9nJztcbmltcG9ydCBCbHVlYmlyZCA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcbmltcG9ydCByZXF1aXJlTm92ZWxTaXRlQ2xhc3MsIHsgRW51bU5vdmVsU2l0ZUxpc3QsIE5vdmVsU2l0ZSB9IGZyb20gXCJub3ZlbC1kb3dubG9hZGVyXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpdGU8VCBleHRlbmRzIE5vdmVsU2l0ZSwgTyBleHRlbmRzIE5vdmVsU2l0ZS5JT3B0aW9ucz4oc2l0ZUlEPzogRW51bU5vdmVsU2l0ZUxpc3QsXG5cdG9wdGlvbnM/OiBPICYge1xuXHRcdFtrOiBzdHJpbmddOiB1bmtub3duXG5cdH0sXG4pOiBUXG57XG5cdGxldCBvID0gcmVxdWlyZU5vdmVsU2l0ZUNsYXNzKHNpdGVJRCk7XG5cblx0Ly8gQHRzLWlnbm9yZVxuXHRyZXR1cm4gbmV3IG8ob3B0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZDxPIGV4dGVuZHMgTm92ZWxTaXRlLklEb3dubG9hZE9wdGlvbnMgPSBOb3ZlbFNpdGUuSURvd25sb2FkT3B0aW9ucywgTzIgZXh0ZW5kcyBOb3ZlbFNpdGUuSU9wdGlvbnMgPSBOb3ZlbFNpdGUuSU9wdGlvbnM+KHVybDogc3RyaW5nLFxuXHRkb3dubG9hZE9wdGlvbnM/OiBPICYge1xuXHRcdFtrOiBzdHJpbmddOiBhbnlcblx0fSxcblxuXHRzaXRlSUQ/OiBFbnVtTm92ZWxTaXRlTGlzdCxcblx0b3B0aW9ucz86IE8yICYge1xuXHRcdFtrOiBzdHJpbmddOiBhbnlcblx0fSxcbilcbntcblx0aWYgKCFzaXRlSUQpXG5cdHtcblx0XHRzaXRlSUQgPSBzZWFyY2hTaXRlSUQodXJsKSB8fCBFbnVtTm92ZWxTaXRlTGlzdC5Ob3ZlbFNpdGVTeW9zZXR1O1xuXHR9XG5cblx0KHsgZG93bmxvYWRPcHRpb25zLCBvcHRpb25zIH0gPSBoYW5kbGVPcHRpb25zKGRvd25sb2FkT3B0aW9ucywgc2l0ZUlELCBvcHRpb25zKSk7XG5cblx0Y29uc3QgU2l0ZSA9IGNyZWF0ZVNpdGUoc2l0ZUlELCBvcHRpb25zIHx8IHt9KTtcblxuXHRyZXR1cm4gU2l0ZS5kb3dubG9hZCh1cmwsIGRvd25sb2FkT3B0aW9ucylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZU9wdGlvbnM8TyBleHRlbmRzIE5vdmVsU2l0ZS5JRG93bmxvYWRPcHRpb25zLCBPMiBleHRlbmRzIE5vdmVsU2l0ZS5JT3B0aW9ucz4oZG93bmxvYWRPcHRpb25zOiBPICYge1xuXHRcdFtrOiBzdHJpbmddOiBhbnlcblx0fSxcblx0c2l0ZUlEOiBFbnVtTm92ZWxTaXRlTGlzdCxcblx0b3B0aW9uczogTzIgJiB7XG5cdFx0W2s6IHN0cmluZ106IGFueVxuXHR9LFxuKVxue1xuXHRyZXR1cm4ge1xuXHRcdGRvd25sb2FkT3B0aW9ucyxcblx0XHRvcHRpb25zLFxuXHR9XG59XG4iXX0=