"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by user on 2020/2/3.
 */
const const_1 = require("./const");
function siteID2IDKEY(siteID) {
    if (isIDKEY(siteID)) {
        return const_1.EnumIDKEYList[siteID];
    }
}
exports.siteID2IDKEY = siteID2IDKEY;
function IDKEY2siteID(input) {
    if (!isIDKEY(input)) {
        input = siteID2IDKEY(input);
    }
    if (isIDKEY(input)) {
        return const_1.EnumIDKEYToSiteID[input];
    }
}
exports.IDKEY2siteID = IDKEY2siteID;
function isSiteID(siteID) {
    return (siteID in const_1.EnumNovelSiteList) && typeof const_1.EnumNovelSiteList[siteID] === 'string';
}
exports.isSiteID = isSiteID;
function isIDKEY(IDKEY) {
    return (IDKEY in const_1.EnumIDKEYList) && typeof const_1.EnumIDKEYList[IDKEY] === 'string';
}
exports.isIDKEY = isIDKEY;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNILG1DQUE4RTtBQUU5RSxTQUFnQixZQUFZLENBQUMsTUFBa0Q7SUFFOUUsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ25CO1FBQ0MsT0FBTyxxQkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQzVCO0FBQ0YsQ0FBQztBQU5ELG9DQU1DO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLEtBQWlEO0lBRTdFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQ25CO1FBQ0MsS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM1QjtJQUVELElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUNsQjtRQUNDLE9BQU8seUJBQWlCLENBQUMsS0FBWSxDQUFDLENBQUE7S0FDdEM7QUFDRixDQUFDO0FBWEQsb0NBV0M7QUFFRCxTQUFnQixRQUFRLENBQUMsTUFBa0M7SUFFMUQsT0FBTyxDQUFDLE1BQU0sSUFBSSx5QkFBaUIsQ0FBQyxJQUFJLE9BQU8seUJBQWlCLENBQUMsTUFBTSxDQUFDLEtBQUssUUFBUSxDQUFBO0FBQ3RGLENBQUM7QUFIRCw0QkFHQztBQUVELFNBQWdCLE9BQU8sQ0FBQyxLQUE2QjtJQUVwRCxPQUFPLENBQUMsS0FBSyxJQUFJLHFCQUFhLENBQUMsSUFBSSxPQUFPLHFCQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUSxDQUFBO0FBQzVFLENBQUM7QUFIRCwwQkFHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMi8zLlxuICovXG5pbXBvcnQgeyBFbnVtTm92ZWxTaXRlTGlzdCwgRW51bUlES0VZTGlzdCwgRW51bUlES0VZVG9TaXRlSUQgfSBmcm9tICcuL2NvbnN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHNpdGVJRDJJREtFWShzaXRlSUQ6IEVudW1Ob3ZlbFNpdGVMaXN0IHwgc3RyaW5nIHwgRW51bUlES0VZTGlzdCk6IEVudW1JREtFWUxpc3Rcbntcblx0aWYgKGlzSURLRVkoc2l0ZUlEKSlcblx0e1xuXHRcdHJldHVybiBFbnVtSURLRVlMaXN0W3NpdGVJRF1cblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gSURLRVkyc2l0ZUlEKGlucHV0OiBFbnVtTm92ZWxTaXRlTGlzdCB8IHN0cmluZyB8IEVudW1JREtFWUxpc3QpOiBFbnVtTm92ZWxTaXRlTGlzdFxue1xuXHRpZiAoIWlzSURLRVkoaW5wdXQpKVxuXHR7XG5cdFx0aW5wdXQgPSBzaXRlSUQySURLRVkoaW5wdXQpO1xuXHR9XG5cblx0aWYgKGlzSURLRVkoaW5wdXQpKVxuXHR7XG5cdFx0cmV0dXJuIEVudW1JREtFWVRvU2l0ZUlEW2lucHV0IGFzIGFueV1cblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTaXRlSUQoc2l0ZUlEOiBFbnVtTm92ZWxTaXRlTGlzdCB8IHN0cmluZyk6IHNpdGVJRCBpcyBFbnVtTm92ZWxTaXRlTGlzdFxue1xuXHRyZXR1cm4gKHNpdGVJRCBpbiBFbnVtTm92ZWxTaXRlTGlzdCkgJiYgdHlwZW9mIEVudW1Ob3ZlbFNpdGVMaXN0W3NpdGVJRF0gPT09ICdzdHJpbmcnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0lES0VZKElES0VZOiBFbnVtSURLRVlMaXN0IHwgc3RyaW5nKTogSURLRVkgaXMgRW51bUlES0VZTGlzdFxue1xuXHRyZXR1cm4gKElES0VZIGluIEVudW1JREtFWUxpc3QpICYmIHR5cGVvZiBFbnVtSURLRVlMaXN0W0lES0VZXSA9PT0gJ3N0cmluZydcbn1cbiJdfQ==