import { EnumNovelStatus } from 'node-novel-info/lib/const';
import { retryRequest } from '../../fetch';

import fs = require('fs-extra');
import { trimFilename } from 'fs-iconv/util';
import * as path from 'path';
import novelInfo, { IMdconfMeta } from 'node-novel-info';
import { fromURL, IFromUrlOptions, IJSDOM } from 'jsdom-extra';
// @ts-ignore
import { LazyCookie, LazyCookieJar } from 'jsdom-extra';
import { URL } from 'jsdom-url';
import { getFilePath, getVolumePath } from '../fs';

import NovelSite, { staticImplements, defaultJSDOMOptions, SYMBOL_CACHE } from '../index';
import { PromiseBluebird, bluebirdDecorator } from '../index';
import { moment } from '../index';

import NovelSiteDemo = require('../demo/base');
import novelText from 'novel-text';

import { console } from '../../util/log';

export type INovel = NovelSiteDemo.INovel & {
	novel_syosetu_id: string,
};

export type IOptionsPlus = {
	/**
	 * 不使用小說家提供的 txt 下載連結
	 */
	disableTxtdownload?: boolean,
}

export type IDownloadOptions = NovelSiteDemo.IDownloadOptions & IOptionsPlus
export type IOptionsRuntime = NovelSiteDemo.IOptionsRuntime & IDownloadOptions & IOptionsPlus

@staticImplements<NovelSite.INovelSiteStatic<NovelSiteSyosetu>>()
export class NovelSiteSyosetu extends NovelSiteDemo.NovelSite
{
	public static readonly IDKEY = 'syosetu';

	constructor(options: IDownloadOptions, ...argv)
	{
		super(options, ...argv);

		this.optionsInit.retryDelay = this.optionsInit.retryDelay || 25000;
	}

	session<T = NovelSite.IOptionsRuntime>(optionsRuntime: Partial<T & IDownloadOptions>, url: URL)
	{
		// @ts-ignore
		optionsRuntime.sessionData = optionsRuntime.sessionData || {};
		optionsRuntime.sessionData.over18 = 'yes';

		/*
		optionsRuntime.sessionData.sasieno = 0;
		optionsRuntime.sessionData.lineheight = 0;
		optionsRuntime.sessionData.fontsize = 0;
		optionsRuntime.sessionData.novellayout = 0;
		optionsRuntime.sessionData.fix_menu_bar = 0;
		*/

		super.session(optionsRuntime, url);

		//let url = optionsRuntime[SYMBOL_CACHE].url;

		optionsRuntime.optionsJSDOM.cookieJar
			//.setCookieSync('over18=yes; Domain=.syosetu.com; Path=/; hostOnly=false', url.href)
		;

//		optionsRuntime.optionsJSDOM.runScripts = 'dangerously';
//		optionsRuntime.optionsJSDOM.virtualConsole = false;

		//optionsRuntime.optionsJSDOM.requestOptions = optionsRuntime.optionsJSDOM.requestOptions || {};

//		if (!optionsRuntime.optionsJSDOM.requestOptions.jar)
//		{
			//optionsRuntime.optionsJSDOM.requestOptions.jar = optionsRuntime.optionsJSDOM.cookieJar.wrapForRequest();
//		}

		//optionsRuntime.optionsJSDOM.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

		return this;
	}

	download(url: string | URL, downloadOptions: IDownloadOptions = {})
	{
		return super.download(url, downloadOptions);
	}

	protected _parseChapter<T>(ret, optionsRuntime: T & IOptionsRuntime, cache): string
	{
		if (!ret)
		{
			return '';
		}

		if (!optionsRuntime.disableTxtdownload)
		{
			return ret.body;
		}

		return [
			ret.dom.$('#novel_p').text(),
			ret.dom.$('#novel_honbun').text(),
			ret.dom.$('#novel_a').text(),
		].filter(function (v)
		{
			return v;
		}).join('\n\n==================\n\n');
	}

	protected _createChapterUrl<T = IOptionsRuntime & IDownloadOptions>({
		novel,
		volume,
		chapter,
	}: {
		novel: NovelSite.INovel,
		volume: NovelSite.IVolume,
		chapter: NovelSite.IChapter,
	}, optionsRuntime?: T & IOptionsRuntime): URL
	{
		if (optionsRuntime.disableTxtdownload)
		{
			let url = this.makeUrl({
				chapter_id: chapter.chapter_id,
				novel_id: novel.url_data.novel_id,
			});

			return url;
		}

		return super._createChapterUrl({
			novel,
			volume,
			chapter,
		}, optionsRuntime);
	}

	protected _saveReadme(optionsRuntime: IOptionsRuntime, options = {}, ...opts)
	{
		options[this.IDKEY] = {
			txtdownload_id: optionsRuntime[SYMBOL_CACHE].novel.novel_syosetu_id || '',
			series_id: optionsRuntime[SYMBOL_CACHE].novel.novel_syosetu_series_id || '',
		};

		return super._saveReadme(optionsRuntime, options, {
			options: {
				textlayout: {
					allow_lf2: true,
				},
			},
		}, ...opts);
	}

	makeUrl(urlobj: NovelSite.IParseUrl, bool ?: boolean): URL
	{
		let subdomain = urlobj.novel_r18 ? 'novel18' : 'ncode';

		if (urlobj.novel_pid && urlobj.chapter_id)
		{
			// @ts-ignore
			return new URL(`https://${subdomain}.syosetu.com/txtdownload/dlstart/ncode/${urlobj.novel_pid}/?no=${urlobj.chapter_id}&hankaku=0&code=utf-8&kaigyo=crlf`);
		}

		let pad = (!bool && urlobj.chapter_id) ? urlobj.chapter_id : '';

		// @ts-ignore
		return new URL(`http://${subdomain}.syosetu.com/${urlobj.novel_id}/${pad}`);
	}

	parseUrl(url: string | URL): NovelSite.IParseUrl
	{
		let urlobj = {
			url,

			novel_pid: null,
			novel_id: null,
			chapter_id: null,

			novel_r18: null,
		};

		//url = url.toString();

		try
		{
			// @ts-ignore
			urlobj.url = new URL(url);
			// @ts-ignore
			url = urlobj.url.href;
		}
		catch (e)
		{
			console.warn(e.toString() + ` "${url}"`);
		}

		if (typeof url != 'string')
		{
			// @ts-ignore
			throw new TypeError(url);
		}

		let r: RegExp;
		let m;

		r = /^(n[\w]{5,6})$/;
		if (m = r.exec(url))
		{
			urlobj.novel_id = m[1];
			return urlobj;
		}

		r = /(novel18)\.syosetu\.com/;
		if (m = r.exec(url))
		{
			urlobj.novel_r18 = m[1];
		}

		r = /txtdownload\/dlstart\/ncode\/(\d+)/;
		if (m = r.exec(url))
		{
			urlobj.novel_pid = m[1];

			return urlobj;
		}

		r = /\.syosetu\.com\/(n\w+)(?:\/?(\d+))?/;
		if (m = r.exec(url))
		{
			urlobj.novel_id = m[1];
			urlobj.chapter_id = m[2];

			return urlobj;
		}

		return urlobj;
	}

	protected _fetchChapter<T>(url: URL, optionsRuntime: T & IOptionsRuntime)
	{
		let tryed: boolean;
		const self = this;

		let _fetchChapter = super._fetchChapter;

		return super._fetchChapter(url, optionsRuntime)
			.then(async function (ret)
			{
				if (ret == null) return ret;

				const dom = ret.dom;

				if (!tryed && dom && dom.$('#modal .yes #yes18').length)
				{
					const $ = dom.$;

					//console.error(`無法成功讀取 R18 頁面`, url.href);

					tryed = true;

					try
					{
						$('#modal .yes #yes18').click();
						$('#modal .yes #yes18')[0].click();
					}
					catch (e)
					{

					}

					optionsRuntime.optionsJSDOM.cookieJar.setCookieSync('over18=yes; Domain=.syosetu.com; Path=/; hostOnly=false', url);
					optionsRuntime.optionsJSDOM.cookieJar.setCookieSync(`over18=yes; Domain=${dom.url.host}; Path=/; hostOnly=false`, dom.url);

					//console.debug(optionsRuntime.optionsJSDOM.cookieJar.getAllCookies());

					optionsRuntime.optionsJSDOM.referrer = dom.url;
					optionsRuntime.optionsJSDOM.requestOptions = optionsRuntime.optionsJSDOM.requestOptions || {};
					optionsRuntime.optionsJSDOM.requestOptions.form = dom.url;

					return _fetchChapter.call(self, url, optionsRuntime)
						.then(function (ret)
						{
							const dom = ret.dom;
							const $ = dom.$;

							if ($('#modal .yes #yes18').length)
							{
								console.error(`無法成功讀取 R18 頁面`, url.href);

								//process.exit();
							}

							return ret;
						})
				}

				return ret;
			})
	}

	async _novel18<T = NovelSite.IOptionsRuntime>(url, dom: IJSDOM, optionsRuntime: Partial<T & IDownloadOptions> = {}): Promise<IJSDOM>
	{
		const $ = dom.$;

		if (!$('#novel_contents').length || $('#modal .yes #yes18').length)
		{
			//console.log(dom.url, dom._options);

			$('#modal .yes #yes18').click();

			dom._options.requestOptions.jar.setCookie('over18=yes; Domain=.syosetu.com; Path=/; hostOnly=false', url);

			//console.log(dom.serialize());

			return fromURL(url, Object.assign(optionsRuntime.optionsJSDOM, {

				//cookieJar: dom._options.requestOptions.jar._jar,
				//requestOptions: dom._options.requestOptions,

			} as IFromUrlOptions));
		}

		//console.log(dom._options.requestOptions.jar);

		return dom;
	}

	protected _getExtraInfoURL<T>(search: string, url_data: NovelSite.IParseUrl, optionsRuntime: Partial<T & IDownloadOptions>)
	{
		let optionsJSDOM = {
			...optionsRuntime.optionsJSDOM,
			requestOptions: {
				...optionsRuntime.optionsJSDOM.requestOptions
			},
		};

		optionsJSDOM.requestOptions = optionsJSDOM.requestOptions || {};
		optionsJSDOM.requestOptions.followRedirect = true;

		let _domain = 1 ? 'nar.jp' : 'dip.jp';

		return fromURL(`https://${url_data.novel_r18
			? 'narou18'
			: 'narou'}.${_domain}/search.php?text=${search}&novel=all&genre=all&new_genre=all&length=0&down=0&up=100`, optionsJSDOM)
	}

	async get_volume_list<T = NovelSite.IOptionsRuntime>(url: string | URL,
		optionsRuntime: Partial<T & IDownloadOptions> = {}
	): Promise<INovel>
	{
		const self = this;

		url = await this.createMainUrl(url as any);

		return await fromURL(url, optionsRuntime.optionsJSDOM)
			.then(async function (dom: IJSDOM)
			{
				return self._novel18<T>(url, dom, optionsRuntime);
			})
			.then(async function (dom: IJSDOM)
			{
				let novel_title = dom.$('.novel_title').text();
				let novel_author = novelText.trim(dom
					.$('.novel_writername a, .novel_writername')
					.eq(-1)
					.text())
					.replace(/^.*作者：/, '')
				;

				let novel_desc = dom.$('#novel_ex').text();

				let novel_publisher = self.IDKEY;

				let url_data = self.parseUrl(dom.url.href);

				let volume_list = [] as NovelSite.IVolume[];

				let currentVolume: NovelSite.IVolume;

				let table = dom.$('.index_box').find('> .chapter_title, .novel_sublist2');

				let _cache_dates = [];

				let novel_syosetu_id;

				{
					let $ = dom.$;

					//console.log(dom.serialize());

					//console.log($('#novel_footer'));

					//console.log($('#novel_footer').find('.undernavi a[href*="txtdownload"]'));

					let m;
					let dt = dom.$('#novel_footer .undernavi a[href*="txtdownload"]').prop('href');

					if (dt && (m = dt.match(/ncode\/(\d+)/)))
					{
						novel_syosetu_id = m[1];
					}
					else if (!optionsRuntime.disableTxtdownload)
					{
						throw new Error(`官方 txt 下載功能遭禁用，或請使用 cookies 登入，或將 disableTxtdownload 設為 true`)
					}
				}

				table
					.each(function (index)
					{
						let tr = dom.$(this);

						if (tr.is('.chapter_title'))
						{
							currentVolume = volume_list[volume_list.length] = {
								volume_index: volume_list.length,
								volume_title: tr.text().replace(/^\s+|\s+$/g, ''),
								chapter_list: [],
							};
						}
						else
						{
							if (!currentVolume)
							{
								currentVolume = volume_list[volume_list.length] = {
									volume_index: volume_list.length,
									volume_title: 'null',
									chapter_list: [],
								};
							}

							let a = tr.find('.subtitle a');

							let chapter_date;
							let dd;
							let da = tr.find('.long_update');

							if (da.find('span[title*="/"]').length)
							{
								dd = da.find('span[title*="/"]').attr('title').replace(/改稿|^\s+|\s+$/g, '');
							}

							if (!dd)
							{
								da.find('*').remove();
								dd = da.text().replace(/^\s+|\s+$/g, '');
							}

							if (dd)
							{
								chapter_date = moment(dd, 'YYYY/MM/DD HH:mm').local();
								_cache_dates.push(chapter_date.unix());
							}

							let href = a.prop('href');

							let data = self.parseUrl(href);

							if (!data.chapter_id)
							{

								if (tr.find('.bookmarker_now').length)
								{
									/**
									 * fix https://ncode.syosetu.com/n7637dj/
									 */
									return;
								}

								console.log(tr.prop("outerHTML"));
								console.log(a.prop("outerHTML"));
								console.log(a);
								console.log(data);
								console.log(href);
								console.log(a.attr('href'));
								console.log(new URL(href, dom.url));

								console.log(dom._options);

								throw new Error()
							}
							else
							{
								data = {
									url: null,
									novel_pid: novel_syosetu_id as string,
									chapter_id: data.chapter_id as string,
								} as any;

								href = self.makeUrl(data);

								data.url = href;
							}

							currentVolume
								.chapter_list
								.push({
									chapter_index: currentVolume.chapter_list.length,
									chapter_title: a.text().replace(/^\s+|\s+$/g, ''),
									chapter_id: data.chapter_id,
									chapter_url: href,
									chapter_url_data: data,
									chapter_date,
								})
							;
						}
					})
				;

				_cache_dates.sort();

				let novel_date = moment.unix(_cache_dates[_cache_dates.length - 1]).local();

				let a = await self._getExtraInfoURL(url_data.novel_id, url_data, optionsRuntime)
					.then(function (dom)
					{
						let h2 = dom.$(`div:has(> h2.search:has(> a[href*="${url_data.novel_id}"]))`).eq(0);

						if (!h2.length)
						{
							h2 = dom.$(`h2:has(> a[href*="${url_data.novel_id}"])`).eq(0);
						}

						if (!h2.length)
						{
							console.warn(`can not found keyword "${url_data.novel_id}", will try use title search`);

							/**
							 * https://narou18.nar.jp/search.php?text=%E3%83%A9%E3%83%B3%E3%82%AF%E5%86%92%E9%99%BA%E8%80%85%E3%81%AE%E3%82%B9%E3%83%AD%E3%83%BC%E3%83%A9%E3%82%A4%E3%83%95&novel=all&genre=all&new_genre=all&length=0&down=0&up=100
							 */
							let title = novel_title
								.replace(/[\wａ-ｚ]+/ig, ' ')
								.trim()
							;

							return self._getExtraInfoURL(title, url_data, optionsRuntime);
						}

						return dom;
					})
					.then(function (dom)
					{
						//console.log(dom.url);

						let data: IMdconfMeta = {};

						let h2 = dom.$(`div:has(> h2.search:has(> a[href*="${url_data.novel_id}"]))`).eq(0);

						if (!h2.length)
						{
							h2 = dom.$(`h2:has(> a[href*="${url_data.novel_id}"])`).eq(0);
						}

						let search_left = h2.nextAll('.search_left:eq(0)').eq(0);
						let search_right = h2.nextAll('.search_right:eq(0)').eq(0);

						if (!search_left.length)
						{
							search_left = h2.siblings('.search_left:eq(0)').eq(0);
						}

						if (!search_right.length)
						{
							search_right = h2.siblings('.search_right:eq(0)').eq(0);
						}

						if (!h2.length)
						{
							//console.log(111111111111111111111);
							console.warn(`can not found keyword for ${url_data.novel_id}`, dom.url);

							return data;
						}

						//console.log(search_left);
						//console.log(search_right);

						data.novel = {};

						data.novel.status = search_left.find('.novel_type').text().trim();
						data.novel.tags = [];

						if (data.novel.status === '完結済')
						{
							data.novel.novel_status |= EnumNovelStatus.AUTHOR_DONE;

							data.novel.tags.push(data.novel.status);
						}

						search_right.find('.keyword a')
							.each(function (index, elem)
							{
								let k = dom.$(elem)
									.text()
									.trim()
									.split(/[\/\s]/)
									.map(function (s)
									{
										return s.trim();
									})
									.filter((v) => v)
								;

								data.novel.tags = data.novel.tags.concat(k);
							})
						;

						search_left
							.find('[class*="new_genre"], .nocgenre')
							.each(function (index, elem)
							{
								let k = dom.$(elem)
									.text()
									.trim()
									.replace(/^\s+|\s+$/g, '')
								;

								if (k)
								{
									data.novel.tags.push(k);
								}
							})
						;

						data.link = data.link || [];

						data.link.push(`[${dom.url.hostname}](${dom.url}) - 小説家になろう　更新情報検索`);

						//console.log(data);

						return data;
					})
					.catch(function (e)
					{
						console.error(e);
						console.error(`can't download novel extra info`);

						return {};
					})
				;

				let novel_series_title: string;
				let novel_syosetu_series_id: string;

				{
					let _a = dom.$('#novel_contents .series_title');

					let t = _a.text()
						.replace(/[\r\n\t]+|^\s+|\s+$/g, '')
					;

					if (t)
					{
						novel_series_title = t;

						_a = _a.find('a');
						let _t = _a.attr('href') || '';

						if (/\/(\w{6,})\//i.exec(_t))
						{
							novel_syosetu_series_id = RegExp.$1;

							// @ts-ignore
							a.link = a.link || [];

							let title = novel_series_title
								.replace(/[\[\]\~\`]/g, '\\$0')
								.replace(/["']/g, '')
							;

							// @ts-ignore
							a.link.push(`[${title}](${_a.prop('href')})`);
						}
					}
				}

				return {

					...a,

					url: dom.url,
					url_data,

					novel_title,
					novel_author,

					novel_desc,
					novel_date,
					novel_publisher,

					novel_series_title,
					novel_syosetu_series_id,

					novel_syosetu_id,

					volume_list,

					checkdate: moment().local(),

					imgs: [] as string[],
				} as INovel;
			})
			;
	}

}

export default NovelSiteSyosetu;

