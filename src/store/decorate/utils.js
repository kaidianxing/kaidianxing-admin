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
export function  scrollTo(item) {//滚动到对应模板的位置的方法
    // 解决装修滚动到底部bug
    let noAtionItem = ['diymenu']
    if(noAtionItem.includes(item.id)) {
        return
    }
    
    let ele = null;
    let time = 0;
    let phoneArea = document.getElementsByClassName('phone-area')[0];
    let phoneTop = 0;
    let phoneBottom = phoneArea.clientHeight;
    let eleTop = 0,
        eleBottom = 0;
    return new Promise((resolve, reject) => {
        function scrollTo(from, to) {
            let scrollStartTime = 0;
            let start = phoneArea.scrollTop;
            let time = 300
            function scroll() {
                requestAnimationFrame(timestamp => {
                    if (scrollStartTime === 0) {
                        scrollStartTime = timestamp
                    } else if (timestamp - scrollStartTime > time) {
                        phoneArea.scrollTop = to;
                        return
                    }
                    let scrollLength = (timestamp - scrollStartTime) / time * (to - from)
                    phoneArea.scrollTop = start + scrollLength;
                    scroll()
                })
            }
            scroll()
        }

        function check() {//查找对应组件的位置
            requestAnimationFrame(timestamp => {
                if (time === 0) {
                    time = timestamp
                } else if (timestamp - time > 5000) {
                    reject()
                }
                if (timestamp - time < 5000) {
                    ele = document.getElementsByClassName(item._comIndex_)[0];
                    if (!ele) {
                        check()
                    } else {
                        eleTop = ele.offsetTop + 105;
                        eleBottom = eleTop;
                        phoneTop = phoneArea.scrollTop;
                        phoneBottom = phoneArea.scrollTop + phoneArea.clientHeight / 2 - 75;
                        if (eleTop < phoneTop) {
                            scrollTo(phoneArea.scrollTop, eleTop)
                        } else if (eleBottom > phoneBottom) {
                            scrollTo(phoneArea.scrollTop, phoneArea.scrollTop + (eleBottom - phoneBottom))
                        }
                        resolve();
                    }
                }
            })
        }
        if (typeof item == 'number') {//输入的是滚动终点坐标
            scrollTo(phoneArea.scrollTop, item)
        } else if (item.id == 'pageInfo') {//输入值是页面顶部
            scrollTo(phoneArea.scrollTop, 0)
        } else if (item._comIndex_) {
            check()
        } else {
            reject()
        }
    })
}
export function setHtml2canvasing(state,status){//优化HTML2canvas截图时间
    if(status===false){
        state.html2canvasing =-1;
        return
    }
    let dragItems = document.querySelectorAll('.drag-item');
    if (dragItems.length) {
        let top = dragItems[0].getBoundingClientRect().top
        for (let i = 0; i < dragItems.length; i++) {
            /*
            * 用原生方法获取模块距离顶部高度 并且不大设定高度
            * 设置不能与 将要画的海报（535）等高
            * 否则超出的模块会被直接删除 导致画布插件不会读取到 导致画布画出来是空白的
            */
            let BoxShowMaxHeight = 900
            if (dragItems[i].getBoundingClientRect().bottom - top > BoxShowMaxHeight) {
                if(state.html2canvasing<0){
                    state.html2canvasing=i
                }else{
                    dragItems[i].setAttribute('data-html2canvas-ignore', true)
                }
            } else {
                dragItems[i].removeAttribute('data-html2canvas-ignore');
            }
        }
    }
}
export function showOperBtn(perm){
console.log(perm)
}
