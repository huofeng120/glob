// new Kvue({})
class Kvue {
  constructor(options) {
    this.$options = options

    // 数据响应式
    this.$data = options.data;

    // 观察监听
    this.observe(this.$data)

    // 编译模板
    new Compile(options.el, this)

    // 判断是否存储created函数
    if (options.created) {
      options.created.call(this)
    }
  }

  // 监听
  observe(value) {
    // 如果传入的值不存在或者不为对象，阻止程序向下进行
    if (!value || typeof value !== 'object') {
      return;
    };

    // 遍历该对象
    Object.keys(value).forEach(key => {

      // 对数据进行劫持传入要劫持的对象，属性，值
      this.defineReactive(value, key, value[key])
    })

  }

  // 对数据进行劫持，响应化
  defineReactive(obj, key, val) {

    // 对深层级的对象需要进行递归操作
    this.observe(val);

    let dep = new Dep();

    Object.defineProperty(obj, key, {
      get() {
        Dep.target && dep.addDep(Dep.target)
        return val;
      },
      set(newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal

        console.log('更新了')
      }
    })
  }

}
/*
  依赖收集： 每个属性都有一个依赖，每个依赖都有若干个watecher(界面中出现了属性)
*/
//订阅者 管理watcher
class Dep {
  constructor() {
    // 存放若干依赖（watcher）
    this.deps = []
  }

  // 添加依赖
  addDep(dep) {
    this.deps.push(dep)
  }

  // 通知watcher
  notify() {
    this.deps.forEach(dep => dep.update())
  }
}

//观察者 watcher: 实现update(),
class Watcher {
  constructor() {
    // 将当前watcher实例指定到Dep静态方法target上
    Dep.target = this;
  }
}