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
import html from './invoiceHtml';
// 竖版A4

export const styleA4 = function (data = [], info, order) {
    // let height = 3425 * (parseInt(order.order_goods.length / 6) + 1);
    let dom =  `
        ${html.getHtmlHeader()}
         ${html.getCss()}
    <div class="direction-vertical">
        ${getTemplate(data, info, order)}
        ${html.getFooter(info, order)}
    </div>
     ${html.getHtmlFooter()}
    `
    return dom;
}
// 横版A5
export const styleA5 = function (data = [], info, order) {
    let dom =  `
        ${html.getHtmlHeader()}
         ${html.getCss()}
    <div class="direction-horizontal">
       ${getTemplate(data, info, order)}
        ${html.getFooter(info, order)}
    </div>
        ${html.getHtmlFooter()}
    `
    return dom;
}
// 获取动态模板信息
function getTemplate(data, info, order) {
   let template =  data.map(item => {
       let checked = item.children.some(child => child.checked);
        if ((checked || item.logo)&& item.key === 'send_message') {
            return `
                ${html.getHeader(item.children, info, order)}
            `
        } else if (checked && item.key === 'order_message') {
            return `
                ${info.type == 0 ? html.getFormInfo(item.name) : ''}
                ${html.getOrder(item.children, info, order)}
            `
        } else if (checked && item.key === 'consignee_message') {
            return `
                ${info.type == 0  ? html.getFormInfo(item.name) : ''}
                ${html.userInfo(item.children, info, order)}
            `
        } else if (checked && item.key === 'goods_message') {
            return `
                ${info.type == 0 ? html.getFormInfo(item.name) : ''}
                ${html.getGoods(item.children, info, order)}
            `
        } else if (checked && item.key === 'price_message') {
            let style = '';
            if (info.type == 0  && order.order_goods.length >= 10 && order.order_goods.length < 13) {
                style = `page-break-before:always;padding-top: 80px;`
            }
            return `
            <div style="${style}">
                ${info.type == 0 ? html.getFormInfo(item.name) : ''}
                ${info.type == 0 ?html.getCharge(item.children, info, order) : html.getChargeHorizontal(item.children, info, order)}
            </div>
            `
        } else {
            return ' '
        }
    });
    return template.join(' ')
}
