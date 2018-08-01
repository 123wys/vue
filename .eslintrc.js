module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    //数组和对象键值对最后一个逗号，多行模式必须带逗号，单行模式不能带逗号
    "comma-dangle": [1, "only-multiline"],
    //忽略函数圆括号之前是否有一个空格
    "space-before-function-paren": 0,
    //允许额外的；
    "no-extra-semi": 0,
    "semi": 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
