/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
import Vue from 'vue';
let errorBox = {}; //滚动容器组件；父组件
let throttle = {}; //节流
let errorItems = {}; //缓存错误元素；子组件 

export const clearErrorCache=()=>{
    errorBox={}
    for(let k in throttle){
        clearTimeout(throttle[k])
    }
    throttle={}
    errorItems={}
}
export function $focusError(...data) {
    let position = '';
    let box='ContentBar'
    if(data.length==1){
        position=data[0]
    }else if(data.length==2){
        position=data[1]
        box=data[0]
    }else{
        console.error('定位参数错误！')
        return
    }

    clearTimeout(throttle[box]);
    throttle[box] = setTimeout(() => { 
        let errorEle = null;
        if (errorBox[box]) {
            if(typeof position=='string'&&position) {
                errorEle=errorItems[box][position];
            }else if(typeof position=='number') {
                errorBox[box].scrollTop=position
                return 
            }else if(position instanceof HTMLElement){
                errorEle=position
            }else{
                console.error('定位出错了！')
                return
            }
            
            let errorPos =null;
            let viewPort = errorBox[box].getBoundingClientRect();
            let viewPortHeight=viewPort.top+viewPort.bottom
            if(errorEle){
                errorPos=errorEle.getBoundingClientRect().top;
                if(errorPos<0||errorPos>viewPort.bottom){
                    let scrollTop= errorBox[box].scrollTop;
                    errorBox[box].scrollTop=errorPos+scrollTop-viewPort.top-viewPortHeight/2
                }
            }
        }
    }, 100)
}

Vue.directive('error-box', {
    // 当被绑定的元素插入到 DOM 中时……
    componentUpdated: function(el, binding) {
        // 聚焦元素
        errorBox[binding.value] = el;
        errorItems[binding.value]=errorItems[binding.value]||{};
    }
})
Vue.directive('error-item', {
    // 当被绑定的元素插入到 DOM 中时……
    componentUpdated: function(el, binding) {
        let keys = Object.keys(binding.modifiers)
        let  box=binding.arg||'ContentBar';
        if (keys.length > 0) {
            keys.forEach(item => {
                if(errorItems[box]){
                    errorItems[box][item] = el;
                }else{
                    errorItems[box]={[item]: el};
                }
            })
        }
        if(binding.value){
            errorItems[box][binding.value] = el;
        }
    }
})