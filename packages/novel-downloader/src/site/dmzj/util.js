"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrl = exports.makeUrl = exports.check = void 0;
const url_1 = require("../../util/url");
function check(url, options) {
    return /dmzj\.com/i.test(url_1.default(url).hostname || '');
}
exports.check = check;
function makeUrl(urlobj, bool, ...argv) {
    let url;
    if (bool === 2 && urlobj.novel_id) {
        url = `http://q.dmzj.com/${urlobj.novel_id}/index.shtml`;
    }
    else if (!bool && urlobj.volume_id && urlobj.chapter_id) {
        url = `http://v2.api.dmzj.com/novel/download/${urlobj.novel_id}_${urlobj.volume_id}_${urlobj.chapter_id}.txt`;
    }
    else if (bool === true && urlobj.novel_id) {
        url = `http://v2.api.dmzj.com/novel/chapter/${urlobj.novel_id}.json`;
    }
    else {
        url = `http://v2.api.dmzj.com/novel/${urlobj.novel_id}.json`;
    }
    return url_1.default(url);
}
exports.makeUrl = makeUrl;
function parseUrl(_url, ...argv) {
    const { urlobj, url } = url_1._handleParseURL(_url, ...argv);
    let r;
    let m;
    r = /api\.dmzj\.com\/novel\/(\d+).json/;
    if (m = r.exec(url)) {
        urlobj.novel_id = m[1];
        return urlobj;
    }
    r = /^(\d+)$/;
    if (m = r.exec(url)) {
        urlobj.novel_id = m[1];
        return urlobj;
    }
    r = /api\.dmzj\.com\/novel\/chapter\/(\d+).json/;
    if (m = r.exec(url)) {
        urlobj.novel_id = m[1];
        return urlobj;
    }
    r = /api\.dmzj\.com\/novel\/download\/(\d+)_(\d+)_(\d+).txt/;
    if (m = r.exec(url)) {
        urlobj.novel_id = m[1];
        urlobj.volume_id = m[2];
        urlobj.chapter_id = m[3];
        return urlobj;
    }
    // 手機版網址
    r = /(?:q\.dmzj\.com\/|^\/)(?:(\d+)\/(?:(\d+)\/(?:(\d+)[\._])?)?)/;
    if (m = r.exec(url)) {
        urlobj.novel_id = m[1];
        urlobj.volume_id = m[2];
        urlobj.chapter_id = m[3];
    }
    return urlobj;
}
exports.parseUrl = parseUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esd0NBQThFO0FBRTlFLFNBQWdCLEtBQUssQ0FBQyxHQUF1QyxFQUFFLE9BQVE7SUFFdEUsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQVMsQ0FBQyxHQUFVLENBQUMsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUM7QUFDaEUsQ0FBQztBQUhELHNCQUdDO0FBRUQsU0FBZ0IsT0FBTyxDQUFDLE1BQTJCLEVBQUUsSUFBd0IsRUFBRSxHQUFHLElBQUk7SUFFckYsSUFBSSxHQUFXLENBQUM7SUFFaEIsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQ2pDO1FBQ0MsR0FBRyxHQUFHLHFCQUFxQixNQUFNLENBQUMsUUFBUSxjQUFjLENBQUM7S0FDekQ7U0FDSSxJQUFJLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFVBQVUsRUFDdkQ7UUFDQyxHQUFHLEdBQUcseUNBQXlDLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsVUFBVSxNQUFNLENBQUM7S0FDOUc7U0FDSSxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksTUFBTSxDQUFDLFFBQVEsRUFDekM7UUFDQyxHQUFHLEdBQUcsd0NBQXdDLE1BQU0sQ0FBQyxRQUFRLE9BQU8sQ0FBQztLQUNyRTtTQUVEO1FBQ0MsR0FBRyxHQUFHLGdDQUFnQyxNQUFNLENBQUMsUUFBUSxPQUFPLENBQUM7S0FDN0Q7SUFFRCxPQUFPLGFBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QixDQUFDO0FBdEJELDBCQXNCQztBQUVELFNBQWdCLFFBQVEsQ0FBQyxJQUEyQixFQUFFLEdBQUcsSUFBSTtJQUU1RCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLHFCQUFlLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFFdkQsSUFBSSxDQUFTLENBQUM7SUFDZCxJQUFJLENBQWtCLENBQUM7SUFFdkIsQ0FBQyxHQUFHLG1DQUFtQyxDQUFDO0lBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQ25CO1FBQ0MsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkIsT0FBTyxNQUFNLENBQUM7S0FDZDtJQUVELENBQUMsR0FBRyxTQUFTLENBQUM7SUFDZCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQWEsQ0FBQyxFQUM3QjtRQUNDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXZCLE9BQU8sTUFBTSxDQUFDO0tBQ2Q7SUFFRCxDQUFDLEdBQUcsNENBQTRDLENBQUM7SUFDakQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFhLENBQUMsRUFDN0I7UUFDQyxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2QixPQUFPLE1BQU0sQ0FBQztLQUNkO0lBRUQsQ0FBQyxHQUFHLHdEQUF3RCxDQUFDO0lBQzdELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBYSxDQUFDLEVBQzdCO1FBQ0MsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekIsT0FBTyxNQUFNLENBQUM7S0FDZDtJQUVELFFBQVE7SUFDUixDQUFDLEdBQUcsOERBQThELENBQUM7SUFDbkUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFhLENBQUMsRUFDN0I7UUFDQyxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN6QjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2YsQ0FBQztBQW5ERCw0QkFtREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSBOb3ZlbFNpdGUgZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IGNyZWF0ZVVSTCwgeyBfaGFuZGxlUGFyc2VVUkwsIElQYXJzZVVybFJ1bnRpbWUgfSBmcm9tICcuLi8uLi91dGlsL3VybCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVjayh1cmw6IHN0cmluZyB8IFVSTCB8IE5vdmVsU2l0ZS5JUGFyc2VVcmwsIG9wdGlvbnM/KTogYm9vbGVhblxue1xuXHRyZXR1cm4gL2RtempcXC5jb20vaS50ZXN0KGNyZWF0ZVVSTCh1cmwgYXMgYW55KS5ob3N0bmFtZSB8fCAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlVXJsKHVybG9iajogTm92ZWxTaXRlLklQYXJzZVVybCwgYm9vbCA/OiBib29sZWFuIHwgbnVtYmVyLCAuLi5hcmd2KVxue1xuXHRsZXQgdXJsOiBzdHJpbmc7XG5cblx0aWYgKGJvb2wgPT09IDIgJiYgdXJsb2JqLm5vdmVsX2lkKVxuXHR7XG5cdFx0dXJsID0gYGh0dHA6Ly9xLmRtemouY29tLyR7dXJsb2JqLm5vdmVsX2lkfS9pbmRleC5zaHRtbGA7XG5cdH1cblx0ZWxzZSBpZiAoIWJvb2wgJiYgdXJsb2JqLnZvbHVtZV9pZCAmJiB1cmxvYmouY2hhcHRlcl9pZClcblx0e1xuXHRcdHVybCA9IGBodHRwOi8vdjIuYXBpLmRtemouY29tL25vdmVsL2Rvd25sb2FkLyR7dXJsb2JqLm5vdmVsX2lkfV8ke3VybG9iai52b2x1bWVfaWR9XyR7dXJsb2JqLmNoYXB0ZXJfaWR9LnR4dGA7XG5cdH1cblx0ZWxzZSBpZiAoYm9vbCA9PT0gdHJ1ZSAmJiB1cmxvYmoubm92ZWxfaWQpXG5cdHtcblx0XHR1cmwgPSBgaHR0cDovL3YyLmFwaS5kbXpqLmNvbS9ub3ZlbC9jaGFwdGVyLyR7dXJsb2JqLm5vdmVsX2lkfS5qc29uYDtcblx0fVxuXHRlbHNlXG5cdHtcblx0XHR1cmwgPSBgaHR0cDovL3YyLmFwaS5kbXpqLmNvbS9ub3ZlbC8ke3VybG9iai5ub3ZlbF9pZH0uanNvbmA7XG5cdH1cblxuXHRyZXR1cm4gY3JlYXRlVVJMKHVybCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVVybChfdXJsOiBzdHJpbmcgfCBVUkwgfCBudW1iZXIsIC4uLmFyZ3YpXG57XG5cdGNvbnN0IHsgdXJsb2JqLCB1cmwgfSA9IF9oYW5kbGVQYXJzZVVSTChfdXJsLCAuLi5hcmd2KTtcblxuXHRsZXQgcjogUmVnRXhwO1xuXHRsZXQgbTogUmVnRXhwRXhlY0FycmF5O1xuXG5cdHIgPSAvYXBpXFwuZG16alxcLmNvbVxcL25vdmVsXFwvKFxcZCspLmpzb24vO1xuXHRpZiAobSA9IHIuZXhlYyh1cmwpKVxuXHR7XG5cdFx0dXJsb2JqLm5vdmVsX2lkID0gbVsxXTtcblxuXHRcdHJldHVybiB1cmxvYmo7XG5cdH1cblxuXHRyID0gL14oXFxkKykkLztcblx0aWYgKG0gPSByLmV4ZWModXJsIGFzIHN0cmluZykpXG5cdHtcblx0XHR1cmxvYmoubm92ZWxfaWQgPSBtWzFdO1xuXG5cdFx0cmV0dXJuIHVybG9iajtcblx0fVxuXG5cdHIgPSAvYXBpXFwuZG16alxcLmNvbVxcL25vdmVsXFwvY2hhcHRlclxcLyhcXGQrKS5qc29uLztcblx0aWYgKG0gPSByLmV4ZWModXJsIGFzIHN0cmluZykpXG5cdHtcblx0XHR1cmxvYmoubm92ZWxfaWQgPSBtWzFdO1xuXG5cdFx0cmV0dXJuIHVybG9iajtcblx0fVxuXG5cdHIgPSAvYXBpXFwuZG16alxcLmNvbVxcL25vdmVsXFwvZG93bmxvYWRcXC8oXFxkKylfKFxcZCspXyhcXGQrKS50eHQvO1xuXHRpZiAobSA9IHIuZXhlYyh1cmwgYXMgc3RyaW5nKSlcblx0e1xuXHRcdHVybG9iai5ub3ZlbF9pZCA9IG1bMV07XG5cdFx0dXJsb2JqLnZvbHVtZV9pZCA9IG1bMl07XG5cdFx0dXJsb2JqLmNoYXB0ZXJfaWQgPSBtWzNdO1xuXG5cdFx0cmV0dXJuIHVybG9iajtcblx0fVxuXG5cdC8vIOaJi+apn+eJiOe2suWdgFxuXHRyID0gLyg/OnFcXC5kbXpqXFwuY29tXFwvfF5cXC8pKD86KFxcZCspXFwvKD86KFxcZCspXFwvKD86KFxcZCspW1xcLl9dKT8pPykvO1xuXHRpZiAobSA9IHIuZXhlYyh1cmwgYXMgc3RyaW5nKSlcblx0e1xuXHRcdHVybG9iai5ub3ZlbF9pZCA9IG1bMV07XG5cdFx0dXJsb2JqLnZvbHVtZV9pZCA9IG1bMl07XG5cdFx0dXJsb2JqLmNoYXB0ZXJfaWQgPSBtWzNdO1xuXHR9XG5cblx0cmV0dXJuIHVybG9iajtcbn1cbiJdfQ==