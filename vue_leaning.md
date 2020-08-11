## 组件基础及应用
* 全局组件
  * Vue.component(组件名，optionsObject)
  * optionsObejct中的data因为是一个引用类型，所以需要data:function(){return {}}保证独立，不影响其他的数据
  * templete:组件模板
  * 组件名称是唯一的
* 局部组件：写在new Vue({components:[局部组件]})
* 组件上传参：冒号（：xxx）。xxx在组件内的props中声明，不用冒号时，例如data-id="aa" data-id="aa"将被挂载到templete的根元素上
## 事件
* 使用v-on:监听事件例如v-on:click=FunName，简写@click=FunName
* 子组件中this.$emit(EventName,option),父组件中@EventName监听事件
* @click=FunName(options,$event),$event访问原始dom事件
* 事件修饰符
  * .stop 阻止单击事件冒泡
  * .prevent 阻止默认行为
  * .capture 添加事件监听器时使用事件捕获模式
  * .self 只当在 event.target 是当前元素自身时触发处理函数
  * .once 点击事件将只会触发一次
  * .passive 滚动事件的默认行为 (即滚动行为) 将会立即触发
    > .passive 不能与.prevent一起使用，因为passive将忽略prevent行为
* 按键修饰符
  * @keyup.enter
  * @keyup.tab
  * @keyup.delete (捕获“删除”和“退格”键)
  * @keyup.esc
  * @keyup.space
  * @keyup.up
  * @keyup.down
  * @keyup.left
  * @keyup.right
* 系统修饰键:仅在按下相应按键时才触发鼠标或键盘事件的监听器
  * .ctrl
  * .alt
  * .shift
  * .meta
  * .exact __精确控制__
* 鼠标按键
  * .left
  * .right
  * .middle
## 插槽
> ____
* 默认插槽
  
  ```html
  <slot></slot>

  <!-- 独占默认插槽的缩写语法 -->
  <component-name v-slot = 'xxx'></component-name>
  ```
* 具名插槽
  ```html
  <slot name="slot_name"></slot>

  <!-- 在父组件中的使用 -->
  <template v-slot:slot_name>
    <span>slot content</span>
  </template>
  ```
* 作用域插槽：
  > 让插槽内容能够访问子组件中才有的数据

  > __本质上是一个返回组件的函数，template标签可以当做是一个函数，slot标签可以认为调用了函数，并且传递了key_value__
  ```html
  <slot name="slot_name" :key-name="key_value"></slot>

  <!-- 在父组件中的使用 -->
  <template v-slot:key-name = {key_value}>
    <span>{{key_value.value}}</span>
  </template>
  ```
## 双向绑定
> `v-model`是`v-bind:value`与`@input`相结合的结果，语法糖
```html
<input v-model="test"/>

<!-- 以下是以上的实现原理 -->
<input :value='test' @input="test=$event.target.value"/>
```
* 自定义组件的model
```javascript
// 1.组件中定义model,例如input
model:{
  prop:value, // 绑定的属性 :value="xxx"
  event:input // 绑定的事件 @input="$emit('input',$event.target.value)"
}

// 上边方式model只能定义一个

// 2.可以使用.sync修饰符原理是update:myPropName
// 子组件中需要this.$emit('update:title', newTitle)
// <text-document v-bind:title.sync="doc.title"></text-document>
```
> __带有.sync的不能跟表达式一起使用,一起使用的话表达式无效__

## 组件的更新
* 数据的来源：父组件属性、组件自身data状态、状态管理器（vuex、Vue.observable）
* 过程：
  * vue实例化，对data数据进行getter/setter代理
  * 如果模板中使用到了data中的数据，就将数据加入到watcher中进行更新，如果没有就不加入
  * watcher中的数据进行组件的更新

## 计算属性和侦听器
* computed:计算属性
  * 有缓存
  * 减少计算逻辑
  * 依赖响应式数据
* watch:侦听器
  * 更加灵活、通用
  * watch中可以执行任何逻辑，如函数节流、Ajax获取数据、甚至操作dom元素
  * 监听的数据是data中的数据
  * handler函数，deep:true(深度)
## vue生命周期
* 创建阶段
  1. 初始化事件和生命周期
  2. beforeCreate
  3. 数据观测、属性、侦听器配置等
  4. created
  5. 编译到render
  6. beforeMount
  7. render渲染
  8. mounted渲染完成，异步请求、dom操作、定时器等
  > __在mounted函数中，vue并不会承诺我们子组件dom会挂载到真实的DOM上，所以我们需要将操作dom放到this.$nextTick()的回调中__
* 更新阶段
  1. 依赖数据改变或者$forceUpdate强制刷新
  2. beforeUpdate-->移除添加的事件监听器，并且不可修改依赖数据（将导致死循环）
  3. render-->将模板渲染到真实的dom上
  4. Updated-->操作dom添加事件监听器，并且不可修改依赖数据（将导致死循环）
* 销毁阶段
  1. beforeDestroy-->销毁事件监听器，计时器等
  2. destroyed

## 函数式组件
* functional:true
* render:function(creatElement,ctx)
* 特点：
  * 无状态、无实例、无this上下文、无生命周期
  * 渲染开销低，因为函数式组件只是函数
  * 使用场景：vue模板中临时变量
  * ctx包含如下字段的对象:
    1. props: 提供所有prop的对象
    2. children:VNode 子节点的数组
    3. slots: 一个函数，返回了包含所有插槽的对象
    4. scoptedSlots:(2.6.0) 一个暴露传入的作用域插槽的对象，也以函数形式暴露普通插槽
    5. data:传递个组件的整个数据对象，作为createElement的第二个参数传入组件
    6. parent:对父组件的引用
    7. listeners:(2.3.0+) 一个包含了：所有父组件为当前组件祖册的事件监听器对象，是data.on的一个别名
    8. injections:(2.3.0+) 如果使用了inject选项，则改对象包含了：应当被注入的属性；
* 例子：
  ```html
  <div id="root">
    <smart :items=items></smart>
  </div>
  ```
  ```javascript
  let EmptyList = 'p';
  let TableList = 'ul';
  let OrderedList = 'ul';
  let UnorderedList = 'ol';
  Vue.component('smart',{
    functional:true,
    props:{
      items:{
        type:Array,
        required: true
      },
      isOrdered:false
    },
    render:function(h,ctx){
      function appropriateListComponent(){
        let items = ctx.props.items;

        if (items.length === 0) return EmptyList;
        if (typeof items[0] === 'object') return TableList;
        if (ctx.props.isOrdered) return OrderedList;

        return UnorderedList
      }

      return h(
        appropriateListComponent(),
        Array.apply(null, {
          length: ctx.props.items.length
        }).map(function(value, index) {
          return h('li', ctx.props.items[index].name)
        })
      )
    }
  })
  var vm = new Vue({
    el: '#root',
    data: {
      items: [{
          name: '张三'
      }, {
          name: '李四'
      }]
    }
  })
  ```
## 自定义指令
> 设置`directives:{appendText:{}}`,使用`v-append-text=""`
> 自定义指令中的生命周期`bind、inserted、update、componentUpdated、unbind`
> 与provide/inject组合使用可以优雅地获取跨级组件实例

## template和JSX
* 区别：
  * template语法简单、学习成本低、内置指令简易开发、组件作用域css，但不灵活
  * JSX灵活，偏向逻辑
* JSX和template都将编译成createElement(el,options)
* JSX使用：
  ```javascript
  render:function(level){
    let Tag = `h${level}`
    return <Tag>Hello world</Tag>
  }
  ```

## Vuex
### 运行机制

  ![vuex](https://vuex.vuejs.org/vuex.png "vuex运行机制")

> Mustation是s为了在Devtools中跟踪数据的变化，它是同步的。如果需要进行异步操作需要放到Actions中在通过commit()进行操作
> 如果没有异步操作，可以从组件直接进行commit()到Mutations中
> 组件到Actions中是通过dispatch()进行操作的
### Vuex核心及原理
* State
  > 通过`this.$store.state.xxx`取值
  > 原理：提供一个响应式数据
* Mutation
  > 通过`this.$store.commit('xxxx')`赋值
  > 原理：更改state
* Action
  > 通过`this.$store.dispatch('xxx')`赋值
  > 原理：触发Mutation
* Getter
  > 通过`this.$store.getter.xxx`取值
  > 原理：借助Vue组件的computed属性来实现缓存
* Module
  > 模块化
  > 原理：通过Vue.set动态添加state数据到响应式中
* 简单实现vuex：
  ```javascript
  <!-- min-vuex.js -->
  import Vue from 'vue'
  const Store = function Store(options={}){
    const {state={},mutations={}} = options
    this._vm = new Vue({
      data:{
        $$state:state
      }
    })
    this._mutations = mutations
  }

  Store.prototype.commit = function(type,payload){
    if (this._mutations[type]) {
      this._mutations[type](this.state,payload)
    }
  }

  // 代理state
  Object.defineProperties(Store.prototype,{
    state:{
      get:function(){
        return this._vm.data.$$state
      }
    }
  })

  export default {Store}


  <!-- main.js中使用 -->
  import Vuex from './min-vuex.js'
  const store = new Vuex.Store({
    state:{
      count:1
    },
    mutations:{
      increment(state){
        state.count++
      }
    }
  })
  Vue.prototype.$store = store
  ```
## Nuxt
* SPA单页不利于SEO、首屏渲染时间长
* 服务器端渲染SSR解决SEO优化问题、更快的内容到达时间、配置繁琐
* 预渲染解决首屏渲染时间长的问题
* Nuxt:静态站点、动态渲染、简化配置

## 导航解析流程
* 触发导航
* 在即将离开的组件中调用 beforeRouteLeave()
* 调用全局前置守卫 beforeEach()
* 调用 beforeRouteUpdate() (路由变化且组件复用)
* 调用路由独享守卫 beforeEnter()
* 解析异步路由组件
* 在被激活的组件中调用 beforeRouteEnter()
* 调用全局的解析守卫 beforeResolve()
* 导航被确认
* 调用全局的后置守卫 afterEach()
* DOM更新
* 用创建好的实例调用传递给beforeRouteEnter中next的回调函数