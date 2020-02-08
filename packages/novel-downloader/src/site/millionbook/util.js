"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("../../util/url");
function check(url, options) {
    return /millionbook/i.test(url_1.default(url).hostname || '');
}
exports.check = check;
function makeUrl(urlobj, bool, ...argv) {
    let url;
    let cid = (!bool && urlobj.chapter_id) ? `${urlobj.chapter_id}.htm` : 'index.html';
    url = `http://www.millionbook.net/${urlobj.novel_pid}/${urlobj.novel_id}/${cid}`;
    return url_1.default(url);
}
exports.makeUrl = makeUrl;
function parseUrl(_url, ...argv) {
    const { urlobj, url } = url_1._handleParseURL(_url, ...argv);
    let r;
    let m;
    r = /www\.millionbook\.net\/([\w\/]+)\/(\w+)\/(?:(\d+)|index)\.html?/;
    m = r.exec(url);
    if (m) {
        urlobj.novel_pid = m[1];
        urlobj.novel_id = m[2];
        urlobj.chapter_id = m[3];
        return urlobj;
    }
    return urlobj;
}
exports.parseUrl = parseUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx3Q0FBOEU7QUFFOUUsU0FBZ0IsS0FBSyxDQUFDLEdBQXVDLEVBQUUsT0FBUTtJQUV0RSxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBUyxDQUFDLEdBQVUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBSEQsc0JBR0M7QUFFRCxTQUFnQixPQUFPLENBQUMsTUFBMkIsRUFBRSxJQUF3QixFQUFFLEdBQUcsSUFBSTtJQUVyRixJQUFJLEdBQVcsQ0FBQztJQUVoQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztJQUVuRixHQUFHLEdBQUcsOEJBQThCLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFFBQVEsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUVqRixPQUFPLGFBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QixDQUFDO0FBVEQsMEJBU0M7QUFFRCxTQUFnQixRQUFRLENBQUMsSUFBMkIsRUFBRSxHQUFHLElBQUk7SUFFNUQsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxxQkFBZSxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBRXZELElBQUksQ0FBUyxDQUFDO0lBQ2QsSUFBSSxDQUFrQixDQUFDO0lBRXZCLENBQUMsR0FBRyxpRUFBaUUsQ0FBQztJQUN0RSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVoQixJQUFJLENBQUMsRUFDTDtRQUNDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpCLE9BQU8sTUFBTSxDQUFDO0tBQ2Q7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNmLENBQUM7QUFwQkQsNEJBb0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgTm92ZWxTaXRlIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCBjcmVhdGVVUkwsIHsgX2hhbmRsZVBhcnNlVVJMLCBJUGFyc2VVcmxSdW50aW1lIH0gZnJvbSAnLi4vLi4vdXRpbC91cmwnO1xuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2sodXJsOiBzdHJpbmcgfCBVUkwgfCBOb3ZlbFNpdGUuSVBhcnNlVXJsLCBvcHRpb25zPyk6IGJvb2xlYW5cbntcblx0cmV0dXJuIC9taWxsaW9uYm9vay9pLnRlc3QoY3JlYXRlVVJMKHVybCBhcyBhbnkpLmhvc3RuYW1lIHx8ICcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VVcmwodXJsb2JqOiBOb3ZlbFNpdGUuSVBhcnNlVXJsLCBib29sID86IGJvb2xlYW4gfCBudW1iZXIsIC4uLmFyZ3YpXG57XG5cdGxldCB1cmw6IHN0cmluZztcblxuXHRsZXQgY2lkID0gKCFib29sICYmIHVybG9iai5jaGFwdGVyX2lkKSA/IGAke3VybG9iai5jaGFwdGVyX2lkfS5odG1gIDogJ2luZGV4Lmh0bWwnO1xuXG5cdHVybCA9IGBodHRwOi8vd3d3Lm1pbGxpb25ib29rLm5ldC8ke3VybG9iai5ub3ZlbF9waWR9LyR7dXJsb2JqLm5vdmVsX2lkfS8ke2NpZH1gO1xuXG5cdHJldHVybiBjcmVhdGVVUkwodXJsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVXJsKF91cmw6IHN0cmluZyB8IFVSTCB8IG51bWJlciwgLi4uYXJndilcbntcblx0Y29uc3QgeyB1cmxvYmosIHVybCB9ID0gX2hhbmRsZVBhcnNlVVJMKF91cmwsIC4uLmFyZ3YpO1xuXG5cdGxldCByOiBSZWdFeHA7XG5cdGxldCBtOiBSZWdFeHBFeGVjQXJyYXk7XG5cblx0ciA9IC93d3dcXC5taWxsaW9uYm9va1xcLm5ldFxcLyhbXFx3XFwvXSspXFwvKFxcdyspXFwvKD86KFxcZCspfGluZGV4KVxcLmh0bWw/Lztcblx0bSA9IHIuZXhlYyh1cmwpO1xuXG5cdGlmIChtKVxuXHR7XG5cdFx0dXJsb2JqLm5vdmVsX3BpZCA9IG1bMV07XG5cdFx0dXJsb2JqLm5vdmVsX2lkID0gbVsyXTtcblx0XHR1cmxvYmouY2hhcHRlcl9pZCA9IG1bM107XG5cblx0XHRyZXR1cm4gdXJsb2JqO1xuXHR9XG5cblx0cmV0dXJuIHVybG9iajtcbn1cbiJdfQ==