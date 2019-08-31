"use strict";
/// <reference types="jquery" />
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("./hash");
function keepFormatTag(target, opts) {
    let { optionsRuntime, $ } = opts;
    let _target = $(target);
    if (optionsRuntime.keepRuby) {
        [
            'rp',
            'rt',
            'ruby',
        ].forEach(tag => {
            _tagToFormat(_target, tag, $);
        });
    }
    if (optionsRuntime.keepFormat) {
        [
            's',
            'i',
            'b',
            'sup',
            'sub',
        ].forEach(tag => {
            _tagToFormat(_target, tag, $);
        });
    }
    return _target;
}
exports.keepFormatTag = keepFormatTag;
function _keepImageInContext(_imgs, $) {
    _imgs.each((i, elem) => {
        let img = $(elem);
        let src = img.prop('src');
        img.after(`（插圖${hash_1.hashSum(src)}）`);
        img.remove();
    });
    return _imgs;
}
exports._keepImageInContext = _keepImageInContext;
function _tagToFormat(_target, tag, $) {
    _target.find(tag)
        .each((i, elem) => {
        let _this = $(elem);
        _this.after(`＜${tag}＞${_this.html()}＜/${tag}＞`);
        _this.remove();
    });
    return _target;
}
exports._tagToFormat = _tagToFormat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGdDQUFnQzs7QUFHaEMsaUNBQWlDO0FBRWpDLFNBQWdCLGFBQWEsQ0FBNEUsTUFBUyxFQUFFLElBR25IO0lBRUEsSUFBSSxFQUFFLGNBQWMsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFFakMsSUFBSSxPQUFPLEdBQVcsQ0FBQyxDQUFDLE1BQXFCLENBQUMsQ0FBQztJQUUvQyxJQUFJLGNBQWMsQ0FBQyxRQUFRLEVBQzNCO1FBQ0M7WUFDQyxJQUFJO1lBQ0osSUFBSTtZQUNKLE1BQU07U0FDTixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUVmLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzlCLENBQUMsQ0FBQyxDQUNEO0tBQ0Q7SUFFRCxJQUFJLGNBQWMsQ0FBQyxVQUFVLEVBQzdCO1FBQ0M7WUFDQyxHQUFHO1lBQ0gsR0FBRztZQUNILEdBQUc7WUFDSCxLQUFLO1lBQ0wsS0FBSztTQUNMLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBRWYsWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDOUIsQ0FBQyxDQUFDLENBQ0Q7S0FDRDtJQUVELE9BQU8sT0FBTyxDQUFBO0FBQ2YsQ0FBQztBQXRDRCxzQ0FzQ0M7QUFFRCxTQUFnQixtQkFBbUIsQ0FBQyxLQUFhLEVBQUUsQ0FBZTtJQUVqRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFO1FBRXRCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFCLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxjQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUVkLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxLQUFLLENBQUM7QUFDZCxDQUFDO0FBYkQsa0RBYUM7QUFFRCxTQUFnQixZQUFZLENBQUMsT0FBZSxFQUFFLEdBQVcsRUFBRSxDQUFlO0lBRXpFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQ2YsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFO1FBRWpCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQixLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUVoQixDQUFDLENBQUMsQ0FDRjtJQUVELE9BQU8sT0FBTyxDQUFDO0FBQ2hCLENBQUM7QUFkRCxvQ0FjQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwianF1ZXJ5XCIgLz5cblxuaW1wb3J0IE5vdmVsU2l0ZSBmcm9tICcuLi9zaXRlL2luZGV4JztcbmltcG9ydCB7IGhhc2hTdW0gfSBmcm9tICcuL2hhc2gnO1xuXG5leHBvcnQgZnVuY3Rpb24ga2VlcEZvcm1hdFRhZzxPID0gTm92ZWxTaXRlLklPcHRpb25zUnVudGltZSwgRSBleHRlbmRzIHVua25vd24gfCBKUXVlcnlTdGF0aWMgPSB1bmtub3duPih0YXJnZXQ6IEUsIG9wdHM6IHtcblx0JDogSlF1ZXJ5U3RhdGljLFxuXHRvcHRpb25zUnVudGltZTogTyAmIE5vdmVsU2l0ZS5JT3B0aW9uc1J1bnRpbWUsXG59KVxue1xuXHRsZXQgeyBvcHRpb25zUnVudGltZSwgJCB9ID0gb3B0cztcblxuXHRsZXQgX3RhcmdldDogSlF1ZXJ5ID0gJCh0YXJnZXQgYXMgSFRNTEVsZW1lbnQpO1xuXG5cdGlmIChvcHRpb25zUnVudGltZS5rZWVwUnVieSlcblx0e1xuXHRcdFtcblx0XHRcdCdycCcsXG5cdFx0XHQncnQnLFxuXHRcdFx0J3J1YnknLFxuXHRcdF0uZm9yRWFjaCh0YWcgPT5cblx0XHR7XG5cdFx0XHRfdGFnVG9Gb3JtYXQoX3RhcmdldCwgdGFnLCAkKVxuXHRcdH0pXG5cdFx0O1xuXHR9XG5cblx0aWYgKG9wdGlvbnNSdW50aW1lLmtlZXBGb3JtYXQpXG5cdHtcblx0XHRbXG5cdFx0XHQncycsXG5cdFx0XHQnaScsXG5cdFx0XHQnYicsXG5cdFx0XHQnc3VwJyxcblx0XHRcdCdzdWInLFxuXHRcdF0uZm9yRWFjaCh0YWcgPT5cblx0XHR7XG5cdFx0XHRfdGFnVG9Gb3JtYXQoX3RhcmdldCwgdGFnLCAkKVxuXHRcdH0pXG5cdFx0O1xuXHR9XG5cblx0cmV0dXJuIF90YXJnZXRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9rZWVwSW1hZ2VJbkNvbnRleHQoX2ltZ3M6IEpRdWVyeSwgJDogSlF1ZXJ5U3RhdGljKVxue1xuXHRfaW1ncy5lYWNoKChpLCBlbGVtKSA9PiB7XG5cblx0XHRsZXQgaW1nID0gJChlbGVtKTtcblx0XHRsZXQgc3JjID0gaW1nLnByb3AoJ3NyYycpO1xuXG5cdFx0aW1nLmFmdGVyKGDvvIjmj5LlnJYke2hhc2hTdW0oc3JjKX3vvIlgKTtcblx0XHRpbWcucmVtb3ZlKCk7XG5cblx0fSk7XG5cblx0cmV0dXJuIF9pbWdzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX3RhZ1RvRm9ybWF0KF90YXJnZXQ6IEpRdWVyeSwgdGFnOiBzdHJpbmcsICQ6IEpRdWVyeVN0YXRpYylcbntcblx0X3RhcmdldC5maW5kKHRhZylcblx0XHQuZWFjaCgoaSwgZWxlbSkgPT5cblx0XHR7XG5cdFx0XHRsZXQgX3RoaXMgPSAkKGVsZW0pO1xuXG5cdFx0XHRfdGhpcy5hZnRlcihg77ycJHt0YWd977yeJHtfdGhpcy5odG1sKCl977ycLyR7dGFnfe+8nmApO1xuXHRcdFx0X3RoaXMucmVtb3ZlKCk7XG5cblx0XHR9KVxuXHQ7XG5cblx0cmV0dXJuIF90YXJnZXQ7XG59Il19