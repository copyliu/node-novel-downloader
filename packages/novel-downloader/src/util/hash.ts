/**
 * Created by user on 2019/8/31.
 */

import _hashSum = require('hash-sum');


export function hashSum(value: any): string
{
	return _hashSum(value)
}
