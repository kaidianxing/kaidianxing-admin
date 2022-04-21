/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息
 */
/**
 * 注意组件名称等于文件名，等于组件id
 */
let pageTmp = require.context('./templates/', false, /\/.*\.vue$/); //获取当前全部路由
let posterTmp = require.context('./poster-templates/', false, /\/.*\.vue$/); //获取当前全部路由
let posterComs = {}
let pageComs = {}
pageTmp.keys().forEach(item => { //获取本级目录下的全部配置参数
    let name = item.replace(/.+\/(?:My)?([a-zA-Z0-9_.]+)\.vue/, 'Tpl$1'); //加My的name是为了区分原生html组件的名字
    if(name.indexOf('.')>0){
        let names=name.split('.');
        names.forEach((key,index)=>{
            if(index>0){
                pageComs['Tpl'+key] = pageTmp(item).default;
            }else{
                pageComs[key] = pageTmp(item).default;
            }
        })
    }else{
        pageComs[name] = pageTmp(item).default;
    }
    
});
posterTmp.keys().forEach(item => { //获取本级目录下的全部配置参数
    let name = item.replace(/.+\/(?:My)?(\w+).vue/, 'Tpl$1'); //加My的name是为了区分原生html组件的名字
    posterComs[name] = posterTmp(item).default;

});
export const posterComponents = posterComs
export const pageComponents = pageComs