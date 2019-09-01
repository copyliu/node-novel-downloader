/**
 * Created by user on 2017/12/29/029.
 */

import * as Promise from 'bluebird';
import NovelSiteSyosetu from '../src/site/syosetu/index';
import ProjectConfig from '../_root';
import * as path from 'path';

//download('http://www.wenku8.com/modules/article/articleinfo.php?id=1596');

(async () =>
{

	const Site = new NovelSiteSyosetu({
		outputDir: ProjectConfig.tempPath,
	});

	console.log(Site);

	Promise.mapSeries([

//		'https://ncode.syosetu.com/n3711cs/',

		'https://ncode.syosetu.com/n5191ey/',

		//'http://novel18.syosetu.com/n3640eg/',

	],async function (value, index, array)
	{
		await Site.download(value, {
			disableTxtdownload: true,
//			disableDownload: true,

//			noFirePrefix: true,
			noFilePadend: true,

//			filePrefixMode: 3,
//			filePrefixMode: 4,
			filePrefixMode: 1,

//			startIndex: 0,
			startIndex: 1,

			//disableCheckExists: true,

			//fetchMetaDataOnly: true,

			outputDir: path.join(__dirname, 'temp2'),

			keepFormat: true,
			keepRuby: true,
			keepImage: true,

			debugLog: true,

		}).then(function (novel)
		{
			//console.log(novel);

			console.log(novel.novel_title);
		})
		;
	});

})();

