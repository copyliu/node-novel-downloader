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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILGlEQUFnRjtBQUdoRixrQ0FBb0Q7QUFrRHBELE1BQWEsU0FBUztJQVlyQixZQUFZLFdBQThCLEVBQUU7UUFSNUMsVUFBSyxHQUlEO1lBQ0gsS0FBSyxFQUFFLENBQUM7U0FDUixDQUFDO1FBSUQsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFDdkIsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFFbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLG9CQUFJLENBQUMsUUFBb0IsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxJQUFJO1FBRUgsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxTQUFTLENBQXVCLEtBQVEsRUFBRSxJQUFXO1FBRXBELEtBQUssQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBRXRCLElBQUksSUFBYSxDQUFDO1FBRWxCLElBQUksSUFBSSxFQUNSO1lBQ0MsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3RDO2FBRUQ7WUFDQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbkM7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRW5CLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUU3QixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxVQUFVLENBQXdCLEtBQVEsRUFBRSxJQUFXO1FBRXRELEtBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBRXZCLElBQUksSUFBYSxD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LEtBQUssRUFBRSxDQUFBO1NBQ2pCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTTtRQUVMLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFvQixFQUFFLFFBQWtCO1FBRXpELElBQUksSUFBSSxHQUFHLDBCQUFVLENBQTBDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDekYsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0NBQ0Q7QUFuSkQsOEJBbUpDO0FBRUQsa0JBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOC80LzIvMDAyLlxuICovXG5cbmltcG9ydCB7IFRyZWUsIExpc3RUb1RyZWUsIE5vZGUsIFRyZWVUb0xpc3QsIElUcmVlVG9MaXN0IH0gZnJvbSAnanMtdHJlZS1saXN0Mic7XG4vL2ltcG9ydCB7IFVSTCB9IGZyb20gJ2pzZG9tLXVybCc7XG5pbXBvcnQgeyBJQ2hhcHRlciwgSVZvbHVtZSB9IGZyb20gJy4uL3NpdGUvaW5kZXgnO1xuaW1wb3J0IHsgaXNVbmRlZiwgbWluaWZ5SFRNTCwgdHJpbSB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0ICogYXMgc2hvcnRpZCBmcm9tICdzaG9ydGlkJztcblxuZXhwb3J0IHR5cGUgSVRyZWVJRCA9IHN0cmluZyB8IG51bWJlcjtcblxuZXhwb3J0IHsgSVRyZWVUb0xpc3QgfVxuXG5leHBvcnQgdHlwZSBUcmVlTm9kZTxUID0gSVJvd1Jvb3QgfCBJUm93Vm9sdW1lIHwgSVJvd0NoYXB0ZXI+ID0gTm9kZTxUPjtcblxuZXhwb3J0IGludGVyZmFjZSBJVHJlZVxue1xuXHRsZXZlbD86IG51bWJlcixcblx0dHlwZT86IHN0cmluZyxcblxuXHR0b3RhbF9pZHg/OiBudW1iZXIsXG5cdGlkeD86IG51bWJlcixcblxuXHRuYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBJUm93Vm9sdW1lPFQgPSB7fT4gPSBUICYgSVZvbHVtZSAmIElUcmVlICYge1xuXHR0eXBlPzogJ3ZvbHVtZScsXG5cblx0dm9sdW1lX2luZGV4Pzogc3RyaW5nIHwgbnVtYmVyLFxuXHR2b2x1bWVfdGl0bGU6IHN0cmluZyxcblxuXHRkaXJuYW1lPzogc3RyaW5nO1xuXHR2b2x1bWVfbGV2ZWw/OiBzdHJpbmcgfCBudW1iZXIsXG59O1xuXG5leHBvcnQgdHlwZSBJUm93Q2hhcHRlcjxUID0ge30+ID0gVCAmIElDaGFwdGVyICYgSVRyZWUgJiB7XG5cdHR5cGU/OiAnY2hhcHRlcicsXG5cblx0Y2hhcHRlcl9pbmRleD86IHN0cmluZyB8IG51bWJlcixcblx0Y2hhcHRlcl90aXRsZTogc3RyaW5nLFxuXG5cdGNoYXB0ZXJfaWQ/OiBzdHJpbmcgfCBudW1iZXIsXG5cdGNoYXB0ZXJfdXJsPzogVVJMLFxuXHRjaGFwdGVyX3VybF9kYXRhPyxcblx0Y2hhcHRlcl9kYXRlPyxcblxuXHRwYXRoPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgSVJvd1Jvb3Q8VCA9IHt9PiA9IElUcmVlICYge1xuXHR0eXBlPzogJ3Jvb3QnLFxufSAmIFQ7XG5cbmV4cG9ydCB0eXBlIElSb3dOb3ZlbCA9IElSb3dWb2x1bWUgfCBJUm93Q2hhcHRlcjtcblxuZXhwb3J0IGNsYXNzIE5vdmVsVHJlZVxue1xuXHR0cmVlOiBUcmVlPElSb3dSb290IHwgSVJvd1ZvbHVtZSB8IElSb3dDaGFwdGVyPjtcblxuXHRjYWNoZToge1xuXHRcdGxhc3RWb2x1bWU/OiBOb2RlPElSb3dWb2x1bWU+LFxuXHRcdGxhc3RDaGFwdGVyPzogTm9kZTxJUm93Q2hhcHRlcj4sXG5cdFx0ZGVwdGg/OiBudW1iZXIsXG5cdH0gPSB7XG5cdFx0ZGVwdGg6IDAsXG5cdH07XG5cblx0Y29uc3RydWN0b3IoaW5pdERhdGE6IFBhcnRpYWw8SVJvd1Jvb3Q+ID0ge30pXG5cdHtcblx0XHRpbml0RGF0YS50eXBlID0gJ3Jvb3QnO1xuXHRcdGluaXREYXRhLmxldmVsID0gMDtcblxuXHRcdHRoaXMudHJlZSA9IG5ldyBUcmVlKGluaXREYXRhIGFzIElSb3dSb290KTtcblx0fVxuXG5cdHJvb3QoKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMudHJlZS5yb290KCk7XG5cdH1cblxuXHRhZGRWb2x1bWU8VSBleHRlbmRzIElSb3dWb2x1bWU+KHZhbHVlOiBVLCByb290PzogTm9kZSlcblx0e1xuXHRcdHZhbHVlLnR5cGUgPSAndm9sdW1lJztcblxuXHRcdGxldCBub2RlOiBOb2RlPFU+O1xuXG5cdFx0aWYgKHJvb3QpXG5cdFx0e1xuXHRcdFx0bm9kZSA9IHRoaXMuX2dldFJvb3Qocm9vdCkuYWRkKHZhbHVlKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdG5vZGUgPSB0aGlzLnRyZWUucm9vdCgpLmFkZCh2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fZml4Um93KG5vZGUpO1xuXG5cdFx0dGhpcy5jYWNoZS5sYXN0Vm9sdW1lID0gbm9kZTtcblxuXHRcdHJldHVybiBub2RlO1xuXHR9XG5cblx0YWRkQ2hhcHRlcjxVIGV4dGVuZHMgSVJvd0NoYXB0ZXI+KHZhbHVlOiBVLCByb290PzogTm9kZSlcblx0e1xuXHRcdHZhbHVlLnR5cGUgPSAnY2hhcHRlcic7XG5cblx0XHRsZXQgbm9kZTogTm9kZTxVPjtcblxuXHRcdGlmIChyb290KVxuXHRcdHtcblx0XHRcdG5vZGUgPSB0aGlzLl9nZXRSb290KHJvb3QpLmFkZCh2YWx1ZSk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRub2RlID0gdGhpcy50cmVlLnJvb3QoKS5hZGQodmFsdWUpO1xuXHRcdH1cblxuXHRcdHRoaXMuX2ZpeFJvdyhub2RlKTtcblxuXHRcdHRoaXMuY2FjaGUubGFzdENoYXB0ZXIgPSBub2RlO1xuXG5cdFx0cmV0dXJuIG5vZGU7XG5cdH1cblxuXG5cdHN0YXRpYyBpc1ZvbHVtZShub2RlOiBOb2RlKTogbm9kZSBpcyBOb2RlPElSb3dWb2x1bWU+XG5cdHN0YXRpYyBpc1ZvbHVtZShub2RlOiBJUm93Vm9sdW1lKTogbm9kZSBpcyBJUm93Vm9sdW1lXG5cdHN0YXRpYyBpc1ZvbHVtZShub2RlKVxuXHR7XG5cdFx0aWYgKG5vZGUgaW5zdGFuY2VvZiBOb2RlKVxuXHRcdHtcblx0XHRcdHJldHVybiAobm9kZS5nZXQoJ3R5cGUnKSA9PSAndm9sdW1lJykgPyBub2RlIDogbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gKG5vZGUudHlwZSA9PSAndm9sdW1lJykgPyBub2RlIDogbnVsbDtcblx0fVxuXG5cdHN0YXRpYyBpc0NoYXB0ZXIobm9kZTogTm9kZSk6IG5vZGUgaXMgTm9kZTxJUm93Q2hhcHRlcj5cblx0c3RhdGljIGlzQ2hhcHRlcihub2RlOiBJUm93Q2hhcHRlcik6IG5vZGUgaXMgSVJvd0NoYXB0ZXJcblx0c3RhdGljIGlzQ2hhcHRlcihub2RlKVxuXHR7XG5cdFx0aWYgKG5vZGUgaW5zdGFuY2VvZiBOb2RlKVxuXHRcdHtcblx0XHRcdHJldHVybiAobm9kZS5nZXQoJ3R5cGUnKSA9PSAnY2hhcHRlcicpID8gbm9kZSA6IG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChub2RlLnR5cGUgPT0gJ2NoYXB0ZXInKSA/IG5vZGUgOiBudWxsO1xuXHR9XG5cblx0cHJvdGVjdGVkIF9maXhSb3c8VSBleHRlbmRzIE5vZGU8SVJvd1ZvbHVtZSB8IElSb3dDaGFwdGVyPj4obm9kZTogVSlcblx0e1xuXHRcdGxldCBsZXZlbCA9IG5vZGUucGFyZW50LmdldDxudW1iZXI+KCdsZXZlbCcpICsgMTtcblxuXHRcdHRoaXMuY2FjaGUuZGVwdGggPSBNYXRoLm1heCh0aGlzLmNhY2hlLmRlcHRoLCBsZXZlbCk7XG5cblx0XHRub2RlLnNldCgnbGV2ZWwnLCBsZXZlbCk7XG5cdFx0bGV0IG5hbWU6IHN0cmluZztcblxuXHRcdHN3aXRjaCAobm9kZS5nZXQoJ3R5cGUnKSlcblx0XHR7XG5cdFx0XHRjYXNlICdjaGFwdGVyJzpcblx0XHRcdFx0bmFtZSA9IHRyaW0obm9kZS5nZXQ8c3RyaW5nPignY2hhcHRlcl90aXRsZScpLCB0cnVlKTtcblxuXHRcdFx0XHRub2RlLnNldCgnY2hhcHRlcl90aXRsZScsIG5hbWUpO1xuXHRcdFx0XHRub2RlLnNldCgnbmFtZScsIG5hbWUpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ3ZvbHVtZSc6XG5cdFx0XHRcdG5hbWUgPSB0cmltKG5vZGUuZ2V0PHN0cmluZz4oJ3ZvbHVtZV90aXRsZScpLCB0cnVlKTtcblxuXHRcdFx0XHRub2RlLnNldCgndm9sdW1lX3RpdGxlJywgbmFtZSk7XG5cdFx0XHRcdG5vZGUuc2V0KCduYW1lJywgbmFtZSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiBub2RlO1xuXHR9XG5cblx0cHJvdGVjdGVkIF9nZXRSb290PFUgZXh0ZW5kcyBOb2RlPElSb3dSb290IHwgSVJvd1ZvbHVtZSB8IElSb3dDaGFwdGVyPj4ocm9vdDogVSlcblx0e1xuXHRcdGlmICghKHJvb3QgaW5zdGFuY2VvZiBOb2RlKSlcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKClcblx0XHR9XG5cblx0XHRpZiAocm9vdC5nZXQoJ3R5cGUnKSA9PSAnY2hhcHRlcicpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKClcblx0XHR9XG5cblx0XHRyZXR1cm4gcm9vdDtcblx0fVxuXG5cdHRvSlNPTigpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy50cmVlLnJvb3QoKS50b0pTT04oKTtcblx0fVxuXG5cdHN0YXRpYyB0cmVlVG9MaXN0KG5vdmVsVHJlZTogTm92ZWxUcmVlLCBsaW5rTm9kZT86IGJvb2xlYW4pXG5cdHtcblx0XHRsZXQgbGlzdCA9IFRyZWVUb0xpc3Q8e30sIElSb3dSb290IHwgSVJvd1ZvbHVtZSB8IElSb3dDaGFwdGVyPihub3ZlbFRyZWUudHJlZSwgbGlua05vZGUpO1xuXHRcdHJldHVybiBsaXN0O1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5vdmVsVHJlZTtcbiJdfQ==