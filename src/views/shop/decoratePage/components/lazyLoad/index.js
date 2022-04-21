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
export class ViewPort {
    viewport = null
    viewportEle = null
    eleList = []
    portList = []
    callback = null;
    constructor(callback) {
        let throttle = null;
        this.getViewPort()
        this.callback = callback
        window.addEventListener('resize', () => {
            this.getViewPort()
            callback(this.getViewableEles())
        })
        document.getElementsByClassName('phone-area')[0].onscroll = () => {
            clearTimeout(throttle)
            throttle = setTimeout(() => {
                this.throttle = null;
                this.getViewPort()
                this.getViewableEles()
            }, 500)
        }
    }
    getViewPort() { //可视区
        this.viewportEle = this.viewportEle || document.getElementsByClassName('phone-area')[0];

        this.viewport = {
            top: this.viewportEle.scrollTop,
            bottom: this.viewportEle.scrollTop + this.viewportEle.clientHeight,
        }
        return this
    }
    getEleScrollHeight() {
        this.eleList = document.getElementsByClassName('lazy-load-box')
        let len = this.eleList.length;
        let item = null;
        this.portList = []
        for (let i = 0; i < len; i++) {
            item = this.eleList[i];
            this.portList.push({
                top: item.offsetTop,
                bottom: item.offsetTop + item.clientHeight,
            })
        }
        return this
    }
    getViewableEles() {
        let list = this.portList;
        if (!list.length) {
            list = this.getEleScrollHeight()
        }
        let len = list.length;
        let item = null;
        let start = 0;
        let end = 0;
        for (let i = 0; i < len; i++) {
            item = list[i];
            if (item.top == this.viewport.top || (item.top < this.viewport.top && item.bottom >= this.viewport.top)) {
                start = i;
            }
            end = i;
            if ((item.top < this.viewport.bottom && item.bottom >= this.viewport.bottom) || item.bottom == this.viewport.bottom) {
                break;
            }
        }
        if (this.callback) {
            let obj={};
            for (let i = start; i <=end;i++){
                obj[i]=true
            }
            this.callback(obj)
        }
        return this;
    }
}