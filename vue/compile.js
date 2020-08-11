// new Compile(el,vm)

class Compile {
  constructor(el, vm) {
    // 要遍历的宿主节点
    this.$el = document.querySelector(el);
    this.$vm = vm;

    // 编译
    if (this.$el) {

      // 将节点转化为片段
      this.$fragment = this.node2Fragment(this.$el);

      // 执行编译
      this.compile(this.$fragment);

      // 将编译完的html结果追加至$el;
      this.$el.appendChild(this.$fragment);
    }
  }

  node2Fragment(el) {
    // 创建一个片段
    let fragment = document.createDocumentFragment();

    // 对宿主元素的子节点遍历，放入片段中
    let child;
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment;
  }

  compile(el) {

    // 获得所有子节点
    let childNodes = el.childNodes;

    // 遍历子节点
    [...childNodes].forEach(node => {

      // 类型判断
      if (this.isELement(node)) {
        // 元素
        console.log('元素')
      } else if (this.isInterpolation(node)) {
        // 文本
        this.compileText(node)
      }

      node && node.childNodes.length > 0 && this.compile(node)
    })

  }

  // 是否是元素节点
  isELement(node) {
    return node.nodeType === 1;
  }

  // 是否是插值
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }

  // 在节点上更新插值
  compileText(node) {
    node.textContent = this.getInterpolationVal(RegExp.$1)
  }

  /*
    更新函数
    @node:节点
    @vm:Kvue实例
    @exp:表达式
    @dir:指令
  */
  update(node, vm, exp, dir) {
    const updaterFn = this[dir + "Updater"];
    updaterFn && updaterFn(node, vm.$data)
  }

  // 通过插值进行相应数据的查询
  getInterpolationVal(key) {
    let result = this.$vm.$data;
    let keysArr = key.split('.');
    keysArr.forEach(el => {
      result = result[el]
    })
    console.log(result)
    return result;
  }
}