/**
 * Created by user on 2018/4/28/028.
 */

import { toFullWidth } from 'str-util';
import { zhRegExp } from 'regexp-cjk';
import { array_unique } from './util';
import zhRegExpWithPluginEnabled from 'regexp-cjk-with-plugin-enabled';

let inited: RegExp[];

export function stripInit()
{
	return [
		` *(?:uu看书.? *)*(?:https:\\\/*)*www.uukanshu.?c?om? *`,
		`(?:\\&?n?b?s?p?;?)*[ &~／\\/（;《＝＋+=(\\-\\[]*猪.{0,5}?猪.{0,5}?岛.{0,5}?小.{0,5}?说.{0,5}?www(?:.(?:huhu|huzu|zuhu|huuo|zhu(?:zud)?|zhzhuam|zhu.{0,5}zhu)?(.?c?om?)?)?[ &~／\\/;＝＋+={}]*(?:.?\\&?n?b?s?p?;?)*~?[ &~／\\/;＝＋+={}\\-()]*\\.?`,

		`^岛.小说www.zuzud;`,
		`小说 ww.zhu\.`,

		`&nbs.{0,5}?zhuzhu.{0,5}?..{0,5}?p;`,
		`&nb.{0,5}?zhu.{0,5}?zhu.{0,5}?.omsp;`,
		`@zzhdo.om;`,
		`\\$.{0,5}?zhu.{0,5}?zhu.{0,5}?..{0,5}?\\)`,

		`&@zzhdo.omnbsp;`,
		`｜.{0,5}?zhu.{0,5}?zhu.{0,5}?\\]`,

		`\\{zhuzhu.{0,5}?..{0,5}?\\}`,

		`&.{0,5}?zhudanbsp;`,

		`\\[zhu.{0,5}?..{0,5}?\\]`,
		`&nzhu＋;`,

		`\\[zhu\\]\\[\\].\\[\\]`,

		`(?:<a>)?UU看书欢迎广大书友光临阅读，最新、最快、最火的连载作品尽在UU看书！(?:<\\/a>)?;?(?:(?:<a>)?UU看书。(?:<\\/a>)?;?)?`,

		`(?:<a>)?UU看书。(?:<\\/a>)?;?`,

	].reduce(function (a, v)
	{
		let s = v;

		if (s.indexOf('^') !== 0)
		{
			s = ' *' + s;
		}

		if (s[s.length - 1] !== '$')
		{
			s = s + ' *';
		}

		let r = new zhRegExpWithPluginEnabled(s, 'igm');

		a.push(r);

		return a;
	}, [] as RegExp[]);
}

console.dir(stripInit())

export function stripContent(text: string)
{
	if (!inited?.length)
	{
		inited = stripInit();
	}

	inited.forEach(function (r)
	{
		text = text.replace(r, '');
	});

	return text;
}

function char_autoFH(text: string)
{
	return text
		.replace(/([a-z])(\1)*/ig, function (ss, s)
		{
			s = s[0];

			let a = [].concat([
				s,
				s.toLowerCase(),
				s.toUpperCase(),
				s.toLocaleLowerCase(),
				s.toLocaleUpperCase(),
			]);

			a.forEach(function (v)
			{
				a.push(toFullWidth(v));
			});

			return '[' + array_unique(a).join('') + ']+';
		})
		;
}
