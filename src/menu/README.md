本目录下创建的.js文件,good.js导出一个对象；
****自动引入index.js,不需要其他配置；****
 各个js导出的对象以文件名为key，最终合并成一个大对象，进入store/menu.js是
### 这里的层级关系影响 面包屑 的展示顺序 ，不代表路由的真实层级关系 ###
对象中至少要有title；name相当于id，可有可无；但name值不可重复，优先作为当前菜单的name
### 建议加上name，并且name值不要重复 ###
對象中的任何属性均可是function，路由切换时会将function的结果付给该属性；


zIndex是菜单的排序权重，大在下；
zIndex只在同父级的兄弟间进行比较



<!-- 字段介绍 -->
##### show   显示控制 #################################
菜单是否显示该字段的控制字段_________   
value:
1.true：显示 ；false:隐藏;  
2.function($router，$store){}：结果返回true、false,控制显示隐藏  
3.undefined默认为true

##### perm   权限控制 #################################
菜单是否显示的控制字段_________  
该字段的隐藏权重高于show字段；显示权重低于show

value：
1.true：显示 ；false:隐藏;  
2.function($router，$store){}：结果返回true、false,控制显示隐藏  
3.'finance.recharge.view' 权限字段；  
4.undefined默认为true
