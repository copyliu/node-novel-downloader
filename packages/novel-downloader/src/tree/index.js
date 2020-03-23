"use strict";
/**
 * Created by user on 2018/4/2/002.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NovelTree = void 0;
const js_tree_list2_1 = require("js-tree-list2");
const util_1 = require("../util");
class NovelTree {
    constructor(initData = {}) {
        this.cache = {
            depth: 0,
        };
        initData.type = 'root';
        initData.level = 0;
        this.tree = new js_tree_list2_1.Tree(initData);
    }
    root() {
        return this.tree.root();
    }
    addVolume(value, root) {
        value.type = 'volume';
        let node;
        if (root) {
            node = this._getRoot(root).add(value);
        }
        else {
            node = this.tree.root().add(value);
        }
        this._fixRow(node);
        this.cache.lastVolume = node;
        return node;
    }
    addChapter(value, root) {
        value.type = 'chapter';
        let node;
        if (root) {
            node = this._getRoot(root).add(value);
        }
        else {
            node = this.tree.root().add(value);
        }
        this._fixRow(node);
        this.cache.lastChapter = node;
        return node;
    }
    static isVolume(node) {
        if (node instanceof js_tree_list2_1.Node) {
            return (node.get('type') == 'volume') ? node : null;
        }
        return (node.type == 'volume') ? node : null;
    }
    static isChapter(node) {
        if (node instanceof js_tree_list2_1.Node) {
            return (node.get('type') == 'chapter') ? node : null;
        }
        return (node.type == 'chapter') ? node : null;
    }
    _fixRow(node) {
        let level = node.parent.get('level') + 1;
        this.cache.depth = Math.max(this.cache.depth, level);
        node.set('level', level);
        let name;
        switch (node.get('type')) {
            case 'chapter':
                name = util_1.trim(node.get('chapter_title'), true);
                node.set('chapter_title', name);
                node.set('name', name);
                break;
            case 'volume':
                name = util_1.trim(node.get('volume_title'), true);
                node.set('volume_title', name);
                node.set('name', name);
                break;
        }
        return node;
    }
    _getRoot(root) {
        if (!(root instanceof js_tree_list2_1.Node)) {
            throw new TypeError();
        }
        if (root.get('type') == 'chapter') {
            throw new Error();
        }
        return root;
    }
    toJSON() {
        return this.tree.root().toJSON();
    }
    static treeToList(novelTree, linkNode) {
        let list = js_tree_list2_1.TreeToList(novelTree.tree, linkNode);
        return list;
    }
}
exports.NovelTree = NovelTree;
exports.default = NovelTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILGlEQUFnRjtBQUdoRixrQ0FBb0Q7QUFrRHBELE1BQWEsU0FBUztJQVlyQixZQUFZLFdBQThCLEVBQUU7UUFSNUMsVUFBSyxHQUlEO1lBQ0gsS0FBSyxFQUFFLENBQUM7U0FDUixDQUFDO1FBSUQsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFDdkIsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFFbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLG9CQUFJLENBQUMsUUFBb0IsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxJQUFJO1FBRUgsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxTQUFTLENBQXVCLEtBQVEsRUFBRSxJQUFXO1FBRXBELEtBQUssQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBRXRCLElBQUksSUFBYSxDQUFDO1FBRWxCLElBQUksSUFBSSxFQUNSO1lBQ0MsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3RDO2FBRUQ7WUFDQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbkM7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRW5CLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUU3QixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxVQUFVLENBQXdCLEtBQVEsRUFBRSxJQUFXO1FBRXRELEtBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBRXZCLElBQUksSUFBYSxD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LEtBQUssRUFBRSxDQUFBO1NBQ2pCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTTtRQUVMLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFvQixFQUFFLFFBQWtCO1FBRXpELElBQUksSUFBSSxHQUFHLDBCQUFVLENBQTBDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDekYsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0NBQ0Q7QUFuSkQsOEJBbUpDO0FBRUQsa0JBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOC80LzIvMDAyLlxuICovXG5cbmltcG9ydCB7IFRyZWUsIExpc3RUb1RyZWUsIE5vZGUsIFRyZWVUb0xpc3QsIElUcmVlVG9MaXN0IH0gZnJvbSAnanMtdHJlZS1saXN0Mic7XG4vL2ltcG9ydCB7IFVSTCB9IGZyb20gJ2pzZG9tLXVybCc7XG5pbXBvcnQgeyBJQ2hhcHRlciwgSVZvbHVtZSB9IGZyb20gJy4uL3NpdGUvaW5kZXgnO1xuaW1wb3J0IHsgaXNVbmRlZiwgbWluaWZ5SFRNTCwgdHJpbSB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0ICogYXMgc2hvcnRpZCBmcm9tICdzaG9ydGlkJztcblxuZXhwb3J0IHR5cGUgSVRyZWVJRCA9IHN0cmluZyB8IG51bWJlcjtcblxuZXhwb3J0IHsgSVRyZWVUb0xpc3QgfVxuXG5leHBvcnQgdHlwZSBUcmVlTm9kZTxUID0gSVJvd1Jvb3QgfCBJUm93Vm9sdW1lIHwgSVJvd0NoYXB0ZXI+ID0gTm9kZTxUPjtcblxuZXhwb3J0IGludGVyZmFjZSBJVHJlZVxue1xuXHRsZXZlbD86IG51bWJlcixcblx0dHlwZT86IHN0cmluZyxcblxuXHR0b3RhbF9pZHg/OiBudW1iZXIsXG5cdGlkeD86IG51bWJlcixcblxuXHRuYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBJUm93Vm9sdW1lPFQgPSB7fT4gPSBUICYgSVZvbHVtZSAmIElUcmVlICYge1xuXHR0eXBlPzogJ3ZvbHVtZScsXG5cblx0dm9sdW1lX2luZGV4Pzogc3RyaW5nIHwgbnVtYmVyLFxuXHR2b2x1bWVfdGl0bGU6IHN0cmluZyxcblxuXHRkaXJuYW1lPzogc3RyaW5nO1xuXHR2b2x1bWVfbGV2ZWw/OiBzdHJpbmcgfCBudW1iZXIsXG59O1xuXG5leHBvcnQgdHlwZSBJUm93Q2hhcHRlcjxUID0ge30+ID0gVCAmIElDaGFwdGVyICYgSVRyZWUgJiB7XG5cdHR5cGU/OiAnY2hhcHRlcicsXG5cblx0Y2hhcHRlcl9pbmRleD86IHN0cmluZyB8IG51bWJlcixcblx0Y2hhcHRlcl90aXRsZTogc3RyaW5nLFxuXG5cdGNoYXB0ZXJfaWQ/OiBzdHJpbmcgfCBudW1iZXIsXG5cdGNoYXB0ZXJfdXJsPzogVVJMLFxuXHRjaGFwdGVyX3VybF9kYXRhPyxcblx0Y2hhcHRlcl9kYXRlPyxcblxuXHRwYXRoPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgSVJvd1Jvb3Q8VCA9IHt9PiA9IElUcmVlICYge1xuXHR0eXBlPzogJ3Jvb3QnLFxufSAmIFQ7XG5cbmV4cG9ydCB0eXBlIElSb3dOb3ZlbCA9IElSb3dWb2x1bWUgfCBJUm93Q2hhcHRlcjtcblxuZXhwb3J0IGNsYXNzIE5vdmVsVHJlZVxue1xuXHR0cmVlOiBUcmVlPElSb3dSb290IHwgSVJvd1ZvbHVtZSB8IElSb3dDaGFwdGVyPjtcblxuXHRjYWNoZToge1xuXHRcdGxhc3RWb2x1bWU/OiBOb2RlPElSb3dWb2x1bWU+LFxuXHRcdGxhc3RDaGFwdGVyPzogTm9kZTxJUm93Q2hhcHRlcj4sXG5cdFx0ZGVwdGg/OiBudW1iZXIsXG5cdH0gPSB7XG5cdFx0ZGVwdGg6IDAsXG5cdH07XG5cblx0Y29uc3RydWN0b3IoaW5pdERhdGE6IFBhcnRpYWw8SVJvd1Jvb3Q+ID0ge30pXG5cdHtcblx0XHRpbml0RGF0YS50eXBlID0gJ3Jvb3QnO1xuXHRcdGluaXREYXRhLmxldmVsID0gMDtcblxuXHRcdHRoaXMudHJlZSA9IG5ldyBUcmVlKGluaXREYXRhIGFzIElSb3dSb290KTtcblx0fVxuXG5cdHJvb3QoKTogTm9kZTxJUm93Vm9sdW1lPHt9PiB8IElSb3dSb290PHt9PiB8IElSb3dDaGFwdGVyPHt9Pj5cblx0e1xuXHRcdHJldHVybiB0aGlzLnRyZWUucm9vdCgpO1xuXHR9XG5cblx0YWRkVm9sdW1lPFUgZXh0ZW5kcyBJUm93Vm9sdW1lPih2YWx1ZTogVSwgcm9vdD86IE5vZGUpXG5cdHtcblx0XHR2YWx1ZS50eXBlID0gJ3ZvbHVtZSc7XG5cblx0XHRsZXQgbm9kZTogTm9kZTxVPjtcblxuXHRcdGlmIChyb290KVxuXHRcdHtcblx0XHRcdG5vZGUgPSB0aGlzLl9nZXRSb290KHJvb3QpLmFkZCh2YWx1ZSk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRub2RlID0gdGhpcy50cmVlLnJvb3QoKS5hZGQodmFsdWUpO1xuXHRcdH1cblxuXHRcdHRoaXMuX2ZpeFJvdyhub2RlKTtcblxuXHRcdHRoaXMuY2FjaGUubGFzdFZvbHVtZSA9IG5vZGU7XG5cblx0XHRyZXR1cm4gbm9kZTtcblx0fVxuXG5cdGFkZENoYXB0ZXI8VSBleHRlbmRzIElSb3dDaGFwdGVyPih2YWx1ZTogVSwgcm9vdD86IE5vZGUpXG5cdHtcblx0XHR2YWx1ZS50eXBlID0gJ2NoYXB0ZXInO1xuXG5cdFx0bGV0IG5vZGU6IE5vZGU8VT47XG5cblx0XHRpZiAocm9vdClcblx0XHR7XG5cdFx0XHRub2RlID0gdGhpcy5fZ2V0Um9vdChyb290KS5hZGQodmFsdWUpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0bm9kZSA9IHRoaXMudHJlZS5yb290KCkuYWRkKHZhbHVlKTtcblx0XHR9XG5cblx0XHR0aGlzLl9maXhSb3cobm9kZSk7XG5cblx0XHR0aGlzLmNhY2hlLmxhc3RDaGFwdGVyID0gbm9kZTtcblxuXHRcdHJldHVybiBub2RlO1xuXHR9XG5cblxuXHRzdGF0aWMgaXNWb2x1bWUobm9kZTogTm9kZSk6IG5vZGUgaXMgTm9kZTxJUm93Vm9sdW1lPlxuXHRzdGF0aWMgaXNWb2x1bWUobm9kZTogSVJvd1ZvbHVtZSk6IG5vZGUgaXMgSVJvd1ZvbHVtZVxuXHRzdGF0aWMgaXNWb2x1bWUobm9kZSlcblx0e1xuXHRcdGlmIChub2RlIGluc3RhbmNlb2YgTm9kZSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gKG5vZGUuZ2V0KCd0eXBlJykgPT0gJ3ZvbHVtZScpID8gbm9kZSA6IG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChub2RlLnR5cGUgPT0gJ3ZvbHVtZScpID8gbm9kZSA6IG51bGw7XG5cdH1cblxuXHRzdGF0aWMgaXNDaGFwdGVyKG5vZGU6IE5vZGUpOiBub2RlIGlzIE5vZGU8SVJvd0NoYXB0ZXI+XG5cdHN0YXRpYyBpc0NoYXB0ZXIobm9kZTogSVJvd0NoYXB0ZXIpOiBub2RlIGlzIElSb3dDaGFwdGVyXG5cdHN0YXRpYyBpc0NoYXB0ZXIobm9kZSlcblx0e1xuXHRcdGlmIChub2RlIGluc3RhbmNlb2YgTm9kZSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gKG5vZGUuZ2V0KCd0eXBlJykgPT0gJ2NoYXB0ZXInKSA/IG5vZGUgOiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiAobm9kZS50eXBlID09ICdjaGFwdGVyJykgPyBub2RlIDogbnVsbDtcblx0fVxuXG5cdHByb3RlY3RlZCBfZml4Um93PFUgZXh0ZW5kcyBOb2RlPElSb3dWb2x1bWUgfCBJUm93Q2hhcHRlcj4+KG5vZGU6IFUpXG5cdHtcblx0XHRsZXQgbGV2ZWwgPSBub2RlLnBhcmVudC5nZXQ8bnVtYmVyPignbGV2ZWwnKSArIDE7XG5cblx0XHR0aGlzLmNhY2hlLmRlcHRoID0gTWF0aC5tYXgodGhpcy5jYWNoZS5kZXB0aCwgbGV2ZWwpO1xuXG5cdFx0bm9kZS5zZXQoJ2xldmVsJywgbGV2ZWwpO1xuXHRcdGxldCBuYW1lOiBzdHJpbmc7XG5cblx0XHRzd2l0Y2ggKG5vZGUuZ2V0KCd0eXBlJykpXG5cdFx0e1xuXHRcdFx0Y2FzZSAnY2hhcHRlcic6XG5cdFx0XHRcdG5hbWUgPSB0cmltKG5vZGUuZ2V0PHN0cmluZz4oJ2NoYXB0ZXJfdGl0bGUnKSwgdHJ1ZSk7XG5cblx0XHRcdFx0bm9kZS5zZXQoJ2NoYXB0ZXJfdGl0bGUnLCBuYW1lKTtcblx0XHRcdFx0bm9kZS5zZXQoJ25hbWUnLCBuYW1lKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICd2b2x1bWUnOlxuXHRcdFx0XHRuYW1lID0gdHJpbShub2RlLmdldDxzdHJpbmc+KCd2b2x1bWVfdGl0bGUnKSwgdHJ1ZSk7XG5cblx0XHRcdFx0bm9kZS5zZXQoJ3ZvbHVtZV90aXRsZScsIG5hbWUpO1xuXHRcdFx0XHRub2RlLnNldCgnbmFtZScsIG5hbWUpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gbm9kZTtcblx0fVxuXG5cdHByb3RlY3RlZCBfZ2V0Um9vdDxVIGV4dGVuZHMgTm9kZTxJUm93Um9vdCB8IElSb3dWb2x1bWUgfCBJUm93Q2hhcHRlcj4+KHJvb3Q6IFUpXG5cdHtcblx0XHRpZiAoIShyb290IGluc3RhbmNlb2YgTm9kZSkpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigpXG5cdFx0fVxuXG5cdFx0aWYgKHJvb3QuZ2V0KCd0eXBlJykgPT0gJ2NoYXB0ZXInKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcigpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJvb3Q7XG5cdH1cblxuXHR0b0pTT04oKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMudHJlZS5yb290KCkudG9KU09OKCk7XG5cdH1cblxuXHRzdGF0aWMgdHJlZVRvTGlzdChub3ZlbFRyZWU6IE5vdmVsVHJlZSwgbGlua05vZGU/OiBib29sZWFuKVxuXHR7XG5cdFx0bGV0IGxpc3QgPSBUcmVlVG9MaXN0PHt9LCBJUm93Um9vdCB8IElSb3dWb2x1bWUgfCBJUm93Q2hhcHRlcj4obm92ZWxUcmVlLnRyZWUsIGxpbmtOb2RlKTtcblx0XHRyZXR1cm4gbGlzdDtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBOb3ZlbFRyZWU7XG4iXX0=