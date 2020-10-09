1、关闭vetur内置的validate:template（最后一项）解决 .eslintrc.js配置的 x-invalid-end-tag
2、js-cookie 数量和长度上的限制

输入vue-cli webpack配置
vue inspect > output.js




组件 Switch <!-- Method 1 未配置iview-loader 需要使用i-switch-->
npm install iview-loader --save-dev / yarn add iview-loader -d

webpack loader加载是一个链式操作，最后位置的loader最先加载
官方配置
module: {
    rules: [
        {
            test: /\.vue$/,
            use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            
                        }
                    },
                    {
                        loader: 'iview-loader',
                        options: {
                            prefix: false
                        }
                    }
                ]
            }
    ]
}

iview-loader 在vue-loader之后，说明，iview-loader需要在vue-loader之前加载才行



// this.$set(data,key,value) 1. 要设置的数据源 2.key 3.要设置key的值  设置对象
// this.$set(data,下标,value) 1. 要设置的数据源 2.下标 3.要设置key的值  设置数组
this.$set(this.selectNode[0], "children", [data]);
this.$set(this.selectNode, 0, data);




