#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const yargs = require("yargs");
const path = require("path");
const novel_downloader_1 = require("novel-downloader");
const log_1 = require("../lib/log");
const PACKAGE_JSON = require("../package.json");
const updateNotifier = require("update-notifier");
let cli = yargs
    .option('outputDir', {
    alias: ['o'],
    requiresArg: true,
    normalize: true,
    desc: `用來儲存下載的內容的主資料夾`,
    type: "string",
    default: process.cwd(),
})
    .option('siteID', {
    desc: `網站模組名稱`,
    alias: ['s'],
    requiresArg: true,
    type: "string",
})
    .option('disableTxtdownload', {
    desc: `此選項目前僅適用於 Syosetu 小說家網站`,
    type: "boolean",
    default: true,
})
    .option('disableDownload', {
    desc: `不下載小說內容僅生成檔案結構`,
    type: "boolean",
})
    .option('noFirePrefix', {
    type: "boolean",
})
    .option('noFilePadend', {
    type: "boolean",
})
    .option('filePrefixMode', {
    type: "number",
})
    .option('startIndex', {
    type: "number",
})
    .command('list', '顯示出目前的模組名稱', function (args) {
    log_1.default.log(Object.keys(novel_downloader_1.EnumNovelSiteList).filter(v => /^[a-z]/i.test(v)));
    process.exit();
    return args;
})
    .argv;
let url = cli._[0];
checkUpdateSelf().notify();
if (!url) {
    yargs.showHelp();
}
else {
    let downloadOptions = {};
    let siteOptions = {};
    ({ downloadOptions, siteOptions } = fixOptions(cli, downloadOptions, siteOptions));
    log_1.default.dir({
        cli,
        downloadOptions,
        siteOptions,
    });
    __1.download(url, downloadOptions, cli.siteID, siteOptions)
        .tap(function (novel) {
        log_1.default.success(novel.novel_title);
    })
        .tapCatch(function () {
        yargs.showHelp();
    });
}
function fixOptions(cli, downloadOptions, siteOptions) {
    if (cli.outputDir) {
        let s1 = path.normalize(cli.outputDir);
        [
            __dirname,
            path.join(__dirname, '..'),
        ].some(function (v) {
            let s2 = path.normalize(v);
            if (s1 == s2) {
                cli.outputDir = path.join(__dirname, '..', 'test/temp');
                return true;
            }
        });
    }
    // @ts-ignore
    downloadOptions.disableTxtdownload = cli.disableTxtdownload;
    downloadOptions.disableDownload = cli.disableDownload;
    downloadOptions.noFilePadend = cli.noFilePadend;
    downloadOptions.noFirePrefix = cli.noFirePrefix;
    downloadOptions.filePrefixMode = cli.filePrefixMode;
    downloadOptions.startIndex = cli.startIndex;
    siteOptions.outputDir = cli.outputDir;
    return { cli, downloadOptions, siteOptions };
}
function checkUpdateSelf() {
    let data = updateNotifier({
        pkg: PACKAGE_JSON,
    });
    return data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92ZWwtZG93bmxvYWRlci1jbGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3ZlbC1kb3dubG9hZGVyLWNsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwwQkFBOEI7QUFDOUIsK0JBQWdDO0FBQ2hDLDZCQUE4QjtBQUU5Qix1REFBc0Y7QUFDdEYsb0NBQWlDO0FBQ2pDLGdEQUFpRDtBQUNqRCxrREFBbUQ7QUFFbkQsSUFBSSxHQUFHLEdBQUcsS0FBSztLQUNiLE1BQU0sQ0FBQyxXQUFXLEVBQUU7SUFDcEIsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ1osV0FBVyxFQUFFLElBQUk7SUFDakIsU0FBUyxFQUFFLElBQUk7SUFDZixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLElBQUksRUFBRSxRQUFRO0lBQ2QsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUU7Q0FDdEIsQ0FBQztLQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUU7SUFDakIsSUFBSSxFQUFFLFFBQVE7SUFDZCxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDWixXQUFXLEVBQUUsSUFBSTtJQUNqQixJQUFJLEVBQUUsUUFBUTtDQUNkLENBQUM7S0FDRCxNQUFNLENBQUMsb0JBQW9CLEVBQUU7SUFDN0IsSUFBSSxFQUFFLHlCQUF5QjtJQUMvQixJQUFJLEVBQUUsU0FBUztJQUNmLE9BQU8sRUFBRSxJQUFJO0NBQ2IsQ0FBQztLQUNELE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtJQUMxQixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLElBQUksRUFBRSxTQUFTO0NBQ2YsQ0FBQztLQUNELE1BQU0sQ0FBQyxjQUFjLEVBQUU7SUFDdkIsSUFBSSxFQUFFLFNBQVM7Q0FDZixDQUFDO0tBQ0QsTUFBTSxDQUFDLGNBQWMsRUFBRTtJQUN2QixJQUFJLEVBQUUsU0FBUztDQUNmLENBQUM7S0FDRCxNQUFNLENBQUMsZ0JBQWdCLEVBQUU7SUFDekIsSUFBSSxFQUFFLFFBQVE7Q0FD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RCxTQUFTLGVBQWU7SUFFdkIsSUFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDO1FBQ3pCLEdBQUcsRUFBRSxZQUFZO0tBQ2pCLENBQUMsQ0FBQztJQUVILE9BQU8sSUFBSSxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuaW1wb3J0IHsgZG93bmxvYWQgfSBmcm9tICcuLic7XG5pbXBvcnQgeWFyZ3MgPSByZXF1aXJlKFwieWFyZ3NcIik7XG5pbXBvcnQgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuaW1wb3J0IHsgQXJndW1lbnRzIH0gZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHJlcXVpcmVOb3ZlbFNpdGVDbGFzcywgeyBFbnVtTm92ZWxTaXRlTGlzdCwgTm92ZWxTaXRlIH0gZnJvbSBcIm5vdmVsLWRvd25sb2FkZXJcIlxuaW1wb3J0IGNvbnNvbGUgZnJvbSAnLi4vbGliL2xvZyc7XG5pbXBvcnQgUEFDS0FHRV9KU09OID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJyk7XG5pbXBvcnQgdXBkYXRlTm90aWZpZXIgPSByZXF1aXJlKCd1cGRhdGUtbm90aWZpZXInKTtcblxubGV0IGNsaSA9IHlhcmdzXG5cdC5vcHRpb24oJ291dHB1dERpcicsIHtcblx0XHRhbGlhczogWydvJ10sXG5cdFx0cmVxdWlyZXNBcmc6IHRydWUsXG5cdFx0bm9ybWFsaXplOiB0cnVlLFxuXHRcdGRlc2M6IGDnlKjkvoblhLLlrZjkuIvovInnmoTlhaflrrnnmoTkuLvos4fmlpnlpL5gLFxuXHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0ZGVmYXVsdDogcHJvY2Vzcy5jd2QoKSxcblx0fSlcblx0Lm9wdGlvbignc2l0ZUlEJywge1xuXHRcdGRlc2M6IGDntrLnq5nmqKHntYTlkI3nqLFgLFxuXHRcdGFsaWFzOiBbJ3MnXSxcblx0XHRyZXF1aXJlc0FyZzogdHJ1ZSxcblx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHR9KVxuXHQub3B0aW9uKCdkaXNhYmxlVHh0ZG93bmxvYWQnLCB7XG5cdFx0ZGVzYzogYOatpOmBuOmgheebruWJjeWDhemBqeeUqOaWvCBTeW9zZXR1IOWwj+iqquWutue2suermWAsXG5cdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0ZGVmYXVsdDogdHJ1ZSxcblx0fSlcblx0Lm9wdGlvbignZGlzYWJsZURvd25sb2FkJywge1xuXHRcdGRlc2M6IGDkuI3kuIvovInlsI/oqqrlhaflrrnlg4XnlJ/miJDmqpTmoYjntZDmp4tgLFxuXHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHR9KVxuXHQub3B0aW9uKCdub0ZpcmVQcmVmaXgnLCB7XG5cdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdH0pXG5cdC5vcHRpb24oJ25vRmlsZVBhZGVuZCcsIHtcblx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0fSlcblx0Lm9wdGlvbignZmlsZVByZWZpeE1vZGUnLCB7XG5cdFx0dHlwZTogXCJudW1iZXJcIixcblx0fSlcblx0Lm9wdGlvbignc3RhcnRJbmRleCcsIHtcblx0XHR0eXBlOiBcIm51bWJlclwiLFxuXHR9KVxuXHQuY29tbWFuZCgnbGlzdCcsICfpoa/npLrlh7rnm67liY3nmoTmqKHntYTlkI3nqLEnLCBmdW5jdGlvbiAoYXJncylcblx0e1xuXHRcdGNvbnNvbGUubG9nKE9iamVjdC5rZXlzKEVudW1Ob3ZlbFNpdGVMaXN0KS5maWx0ZXIodiA9PiAvXlthLXpdL2kudGVzdCh2KSkpO1xuXG5cdFx0cHJvY2Vzcy5leGl0KCk7XG5cblx0XHRyZXR1cm4gYXJnc1xuXHR9KVxuXHQuYXJndiBhcyBBcmd1bWVudHM8SUNsaUFyZ3Y+XG47XG5cbmludGVyZmFjZSBJQ2xpQXJndlxue1xuXHRzaXRlSUQ/OiBFbnVtTm92ZWxTaXRlTGlzdCxcblx0b3V0cHV0RGlyPzogc3RyaW5nLFxuXHRkaXNhYmxlVHh0ZG93bmxvYWQ/OiBib29sZWFuLFxuXHRkaXNhYmxlRG93bmxvYWQ/OiBib29sZWFuLFxuXG5cdG5vRmlyZVByZWZpeD86IGJvb2xlYW4sXG5cdG5vRmlsZVBhZGVuZD86IGJvb2xlYW4sXG5cdGZpbGVQcmVmaXhNb2RlPzogbnVtYmVyLFxuXHRzdGFydEluZGV4PzogbnVtYmVyLFxufVxuXG5sZXQgdXJsOiBzdHJpbmcgPSBjbGkuX1swXTtcblxuY2hlY2tVcGRhdGVTZWxmKCkubm90aWZ5KCk7XG5cbmlmICghdXJsKVxue1xuXHR5YXJncy5zaG93SGVscCgpO1xufVxuZWxzZVxue1xuXHRsZXQgZG93bmxvYWRPcHRpb25zOiBOb3ZlbFNpdGUuSURvd25sb2FkT3B0aW9ucyA9IHt9O1xuXHRsZXQgc2l0ZU9wdGlvbnM6IE5vdmVsU2l0ZS5JT3B0aW9ucyA9IHt9O1xuXG5cdCh7IGRvd25sb2FkT3B0aW9ucywgc2l0ZU9wdGlvbnMgfSA9IGZpeE9wdGlvbnMoY2xpLCBkb3dubG9hZE9wdGlvbnMsIHNpdGVPcHRpb25zKSk7XG5cblx0Y29uc29sZS5kaXIoe1xuXHRcdGNsaSxcblx0XHRkb3dubG9hZE9wdGlvbnMsXG5cdFx0c2l0ZU9wdGlvbnMsXG5cdH0pO1xuXG5cdGRvd25sb2FkKHVybCwgZG93bmxvYWRPcHRpb25zLCBjbGkuc2l0ZUlELCBzaXRlT3B0aW9ucylcblx0XHQudGFwKGZ1bmN0aW9uIChub3ZlbClcblx0XHR7XG5cdFx0XHRjb25zb2xlLnN1Y2Nlc3Mobm92ZWwubm92ZWxfdGl0bGUpO1xuXHRcdH0pXG5cdFx0LnRhcENhdGNoKGZ1bmN0aW9uICgpXG5cdFx0e1xuXHRcdFx0eWFyZ3Muc2hvd0hlbHAoKTtcblx0XHR9KVxuXHQ7XG59XG5cbmZ1bmN0aW9uIGZpeE9wdGlvbnMoY2xpOiBBcmd1bWVudHM8SUNsaUFyZ3Y+LCBkb3dubG9hZE9wdGlvbnM6IE5vdmVsU2l0ZS5JRG93bmxvYWRPcHRpb25zLCBzaXRlT3B0aW9uczogTm92ZWxTaXRlLklPcHRpb25zKVxue1xuXHRpZiAoY2xpLm91dHB1dERpcilcblx0e1xuXHRcdGxldCBzMSA9IHBhdGgubm9ybWFsaXplKGNsaS5vdXRwdXREaXIpO1xuXG5cdFx0W1xuXHRcdFx0X19kaXJuYW1lIGFzIHN0cmluZyxcblx0XHRcdHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicpLFxuXHRcdF0uc29tZShmdW5jdGlvbiAodilcblx0XHR7XG5cdFx0XHRsZXQgczIgPSBwYXRoLm5vcm1hbGl6ZSh2KTtcblx0XHRcdGlmIChzMSA9PSBzMilcblx0XHRcdHtcblx0XHRcdFx0Y2xpLm91dHB1dERpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICd0ZXN0L3RlbXAnKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXG5cdC8vIEB0cy1pZ25vcmVcblx0ZG93bmxvYWRPcHRpb25zLmRpc2FibGVUeHRkb3dubG9hZCA9IGNsaS5kaXNhYmxlVHh0ZG93bmxvYWQ7XG5cdGRvd25sb2FkT3B0aW9ucy5kaXNhYmxlRG93bmxvYWQgPSBjbGkuZGlzYWJsZURvd25sb2FkO1xuXHRkb3dubG9hZE9wdGlvbnMubm9GaWxlUGFkZW5kID0gY2xpLm5vRmlsZVBhZGVuZDtcblx0ZG93bmxvYWRPcHRpb25zLm5vRmlyZVByZWZpeCA9IGNsaS5ub0ZpcmVQcmVmaXg7XG5cdGRvd25sb2FkT3B0aW9ucy5maWxlUHJlZml4TW9kZSA9IGNsaS5maWxlUHJlZml4TW9kZTtcblx0ZG93bmxvYWRPcHRpb25zLnN0YXJ0SW5kZXggPSBjbGkuc3RhcnRJbmRleDtcblxuXHRzaXRlT3B0aW9ucy5vdXRwdXREaXIgPSBjbGkub3V0cHV0RGlyO1xuXG5cdHJldHVybiB7IGNsaSwgZG93bmxvYWRPcHRpb25zLCBzaXRlT3B0aW9ucyB9O1xufVxuXG5mdW5jdGlvbiBjaGVja1VwZGF0ZVNlbGYoKVxue1xuXHRsZXQgZGF0YSA9IHVwZGF0ZU5vdGlmaWVyKHtcblx0XHRwa2c6IFBBQ0tBR0VfSlNPTixcblx0fSk7XG5cblx0cmV0dXJuIGRhdGE7XG59XG4iXX0=