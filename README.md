# iboss

> 基于vuejs2的电商后台支持系统

## 构建步骤

在文件夹根目录启动命令行工具
``` bash
# 安装依赖
npm install

之后

# 在本地localhost:8080 开发
npm run dev

# 打包
npm run build
```

## 目录结构
    iboss(root)                      # 根目录
    ├── bulid                        # 构建命令及webpack配置目录 
    ├── config                       # 配置目录
    ├── src                          # 主目录
    │   ├── components               # 组件目录
    │   │    ├── common              # 通用组件目录
    │   │    │   ├── xxx.vue         # 通用组件文件
    │   │    │   └── xxx.md          # 通用组件说明文档
    │   │    ├── Amodule             # A模块组件目录
    │   │    │   ├── Amodule.vue     # A模块组件
    │   │    │   └── aaa.vue         # A模块组件子组件    
    │   │    ├── Bmodule             # B模块组件目录
    │   │    │   ├── Bmodule.vue     # B模块组件
    │   │    │   └── bbb.vue         # B模块组件子组件
    │   │    └── Ccc.vue             # 外部非模块组件
    │   ├── App.vue                  # 主组件
    │   ├── enum.js         		 # 枚举文件
    │   ├── main.js                  # 入口文件
    │   └── main.less          		 # 主less文件，less变量等存放于此 
    ├── .babelrc                     # 转码配置
    ├── .editorconfig
    ├── .eslintignore                #
    ├── .eslintrc.js                 # 代码检查规则
    ├── .gitignore  
    ├── index.html                   # 模板页面
    ├── out.html                     # 过时提醒页面
    ├── package.json                 # npm项目配置文件
    └── README.md                    # 说明文件
    
## 其他说明
* 不支持IE等老旧浏览器