var MyPlugin = {};
MyPlugin.install = function(Vue, options) {
  //  此处第二个入参对象自动调用Vue.extend
  Vue.component('myTranition', {
    render: function(createElement) {
      var data = {
        props: {
          name: 'list-complete',
          mode: 'out-in',
          tag: 'p'
        }
      };
      return createElement('transition-group', data, [this.$slots.default])
    }
  });
}
export default MyPlugin
