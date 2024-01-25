import type NovelSite from '../index';
import { createURL, _handleParseURL, IParseUrlRuntime } from '../../util/url';

export function check(url: string | URL | NovelSite.IParseUrl, options?): boolean
{
	return /uukanshu/i.test(createURL(url as any).hostname || '');
}

export function makeUrl(urlobj: NovelSite.IParseUrl, bool ?: boolean | number, ...argv)
{
	let url: string;

	let cid = (!bool && urlobj.chapter_id) ? `${urlobj.chapter_id}.html` : '';

	url = `https://www.uukanshu.com/b/${urlobj.novel_id}/${cid}`;

	return createURL(url);
}

export function parseUrl(_url: string | URL | number, ...argv)
{
	const { urlobj, url } = _handleParseURL(_url, ...argv);

	let r: RegExp;
	let m: RegExpExecArray;

	r = /www\.uukanshu\.com\/b\/(\d+)\/(\d+)\.html/;
	m = r.exec(url);
	if (m)
	{
		urlobj.novel_id = m[1];
		urlobj.chapter_id = m[2];

		return urlobj;
	}

	r = /www\.uukanshu\.com\/b\/(\d+)/;

	if (m = r.exec(url))
	{
		urlobj.novel_id = m[1];

		return urlobj;
	}

	return urlobj;
}
