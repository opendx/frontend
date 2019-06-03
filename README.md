架子fork from https://github.com/PanJiaChen/vue-element-admin

## 安装依赖
npm install --registry=https://registry.npm.taobao.org

## 启动服务（配置：.env.development）
npm run dev

## 打包(配置：.env.production)
npm run build:prod

### WebStorm配置
* Languages & Frameworks -> Javascript -> Webpack -> {project}\node_modules\@vue\cli-service\webpack.config.js
* Languages & Frameworks -> Javascript -> Libraries -> 勾选node_modules
* Editor -> Inspections -> html -> Empty tag , Unknown html xxx
* 关闭拼写检查：Editor -> Inspections -> Spelling -> typo -> 取消勾选