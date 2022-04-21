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
import {media, formatDate} from '@/assets/helpers';
import Qrious from 'qrious';
import JsBarcode from 'jsbarcode';

export default {
    getHeader(data, info, order) {
        function getTemplate(data, info) {
            return data.map(item => {
                if (item.key === 'send_title' && item.checked) {
                    return `
                        <div class="title">
                            ${info[item.key]}
                        </div> 
                    `;
                } else if (item.key === 'print_time'  && item.checked) {
                    return `
                        <div class="time">
                            ${formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')}
                        </div> 
                    `;
                } else if (item.key === 'send_code' && item.checked) {
                    let box = document.createElement('img');
                    JsBarcode(box, order[item.key], {
                        format: 'CODE39',
                        lineColor: '#000',
                        background: '#ffffff',
                        width: 2,
                        height: 100,
                        displayValue: false
                    });
                    let url = box.src;
                    return `
                       <div class="js-barcode">
                         <div class="image">
                            <img src="${url}" alt="">
                        </div>
                        <div class="text item-text">
                            ${item.name}：${order[item.key]}
                        </div>
                        </div>
                    `;
                }
            });
        }
        let logo = ' '
        if (info.logo) {
            let logoUrl = media(info.logo);
            logo = ` <div class="logo">
                        <img src="${logoUrl}" alt="">
                    </div>`
        }
        return `
    <div class="header-info" style="position: relative">
       ${getTemplate(data, info).join(' ')}
       ${logo}
    </div>
    `;
    },
    // 订单信息
    getOrder(data, info, order) {
        let res = ' '
        res = data.map(item => {
            if (item.checked) {
                return `
                <div class="item-text">
                    ${item.name}：${order[item.key] || '-'}
                </div>
                `;
            } else {
                return ' '
            }

        }).join(' ');
        if (res) {
            return `
                <div class="border-box">
                    <div class="order-info">
                        ${res}
                    </div>
                </div>
            `;
        } else {
            return ' '
        }
    },
    // 收货人信息
    userInfo(data, info, order) {
        let template = [], message = ' ';
        data.forEach(item => {
            if (item.checked) {
                if (item.key !== 'buyer_remark') {
                    template.push(
                        `<div class="item-text ${item.key === 'address_code' ? 'item-address' : ''}">
                        ${item.name}：${order[item.key] || '-'}
                    </div>
                        `
                    );
                } else {
                    message = `
                     <div class="user-info-bottom">
                       <div class="item-text">
                        ${item.name}：${order[item.key] || '-'}
                    </div>
                    </div>
                    `
                }
            }
        });
        return `
        <div class="border-box">
            <div class="user-info">
              <div class="user-info-top">
                ${template.join(' ')}
              </div>
                ${message}
            </div>
        </div>
      `;
    },
    // 商品信息
    getGoods(data, info, order) {
        let templateHeader = [], templateContent = [];
        templateHeader = data.map(item => {
            if (item.checked) {
                return `
             <th class="${item.key}">
                ${item.name}
            </th>
            `;
            } else {
                return ' '
            }
        });
        templateContent = order.order_goods.map((goods, index) => {
            let arr = data.map(item => {
                if (item.checked) {
                    let content = ' ';
                    if (item.key === 'title' || item.key === 'option_title' || item.key === 'short_name') {
                        content = `
                                <div class="goods-two-line-hide">${goods[item.key] || '-'}</div>
                        `
                    } else {
                        content = `${item.key === 'price_unit' || item.key === 'price' ? '￥' : ''}${item.key === 'number' ? index + 1 : goods[item.key] || '-'}`
                    }
                    return `
                 <td class="${item.key}">
                    <div>
                        ${content}
                    </div>
                </td>
                `;
                } else {
                    return ' '
                }
            });
            return `
                <tr>${arr.join(' ')}</tr>
            `;
        });
        return `
        <div class="border-box">
          <div class="table-info">
            <div class="shop-table-list">
                <table width="100%">
                    <thead class="table-header">
                        <tr>
                        ${templateHeader.join(' ')}
                        </tr>
                    </thead>
                    <tbody class="table-content">
                        ${templateContent.join(' ')}
                    </tbody>
                </table>
            </div>
           </div>
        </div>
        `;
    },
    // 费用统计 A4
    getCharge(data, info, order) {
        let template = [], total = ' ';
        data.forEach(item => {
            if (item.checked) {
                if (item.key === 'goods_price' || item.key === 'dispatch_price') {
                    template.push(
                        `
                    <div class="item">
                         <div class="label">
                            ${item.name}：
                        </div>
                        <div class="content">
                            ￥${order[item.key] || '-'}
                        </div>
                    </div>
                    `
                    );
                } else if (item.key === 'discount_price' && order[item.key]) {
                    template.push(`
                    <div class="item">
                         <div class="label">
                            ${item.name}：
                        </div>
                        <div class="content">
                            -￥${order[item.key]}
                        </div>
                    </div>
                    `);
                } else if (item.key === 'pay_price') {
                    template.push(`
                    <div class="item payment">
                        <div class="label">
                            ${item.name}：
                        </div>
                        <div class="content">
                            <span style="font-size: 12px;line-height: 17px;">￥</span>${order[item.key]}
                        </div>
                    </div>
                    `);
                } else if (item.key === 'goods_count') {
                    total = `
                 <div class="left">
                    商品件数合计：${order.goods_count}
                </div>
            `
                }
            }
        });
        return `
        <div class="border-box">
            <div class="charge-info">
               ${total}
                <div class="right">
                    <div class="item-box">
                        ${template.join(' ')}
                    </div>
                </div>
            </div>
        </div>
      `;
    },
    // 费用统计 横版 A5
    getChargeHorizontal(data, info, order) {
        let template = [], total = ' ', paymentClassName = 'right';
        data.forEach(item => {
            if (item.checked) {
                // 商品小计、运费
                if (item.key === 'goods_price' || item.key === 'dispatch_price') {
                    template.push(
                        `
                    <div class="item-text">
                         <span class="label">
                                ${item.name}：
                        </span>
                        <span class="content">
                            ￥${order[item.key]}
                        </span>
                    </div>
                    `
                    ); // 优惠
                } else if (item.key === 'discount_price' && order[item.key]) {
                    template.push(`
                    <div class="item-text">
                         <span class="label">
                             ${item.name}：
                        </span>
                        <span class="content">
                            -￥${order[item.key]}
                        </span>
                    </div>
                    `); // 实付款
                } else if (item.key === 'pay_price') {
                    if (order[item.key].length > 10) paymentClassName = 'right-long right'
                    template.push( `
                    <div class="payment-horizontal">
                        <div class="label">${item.name}：</div>
                        <div class="content">
                            <span style="font-size: 12px;line-height: 17px;display: inline-block">￥</span>${order[item.key]}
                        </div>
                    </div>
                `);
                } else if (item.key === 'goods_count') {
                    total = `
                 <div class="left">
                    商品件数合计：${order.goods_count}
                </div>
            `
                }
            }
        });
        return `
        <div class="border-box">
            <div class="charge-info">
               ${total}
                <div class="${paymentClassName}">
                    <div class="item-box-horizontal">
                        ${template.join(' ')}
                    </div>
                </div>
            </div>
        </div>
      `;
    },
    // footer
    getFooter(info, order) {
        if (!info.qr_code && !info.footer) {
            return ''
        }
        let qrCode, footer;
        if (info.qr_code) {
            let size = info.type == 0 ? 300 : 150;
            let qr = new Qrious(
                {
                    value: info.qr_code,
                    background: '#fff',
                    level: 'H',
                    size: size,
                });
            let url = qr.toDataURL();
            qrCode = `
                <div class="footer-qr-code">
                    <img src="${url}" alt="">
                </div>
                `;
        }
        if (info.footer) {
            footer = ` 
                <div class="footer-text">
                    ${info.footer}
                </div>
                `;
        }
        let style = '';
        if (info.type == 0 && qrCode && order.order_goods.length >= 6 && qrCode && order.order_goods.length <= 10) {
            style = `page-break-before:always;padding-top: 80px;`
        }
        return `
            <div class="footer-info" id="qr_code" style="${style}">
                ${qrCode || ' '}
             ${footer || ' '}
            </div>
        `;
    },
    // form-info
    getFormInfo(title) {
        return `
            <div class="form-info">
                ${title}
            </div>
        `;
    },
    // border-box
    borderBox() {
        return `
       <div style="border: 1px solid #636669"></div>  
        `;
    },
    //html--header
    getHtmlHeader() {
        return `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Title</title>
                </head>
                <body>
        `;
    },
    getHtmlFooter() {
        return `
            </body>
        </html>
      `;
    },
    getCss() {
        return `
        <style>
            body {
                color: #000000;
                font-family: "PingFang SC", "SimHei", "黑体", "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
            }
            .border-box {
                border: 1px solid #636669;
                width: 100%;
            }
            .item-text {
                font-size: 12px;
                line-height: 17px;
            }
            .goods-two-line-hide {
                word-break:break-all;
                overflow: hidden;
                box-sizing: border-box;
            }
            .direction-horizontal,
            .direction-vertical {
                position: relative;
                padding: 30px 20px;
                box-sizing: border-box;
                width: 760px;
                /*page-break-before:always;*/
            }
            .direction-vertical {
                /*height: 3425px;*/
            }
            .form-info {
                font-size: 16px;
                line-height: 22px;
                font-weight: 500;
                padding-top: 20px;
                padding-bottom: 10px;
                font-weight: bold;
            }
            .header-info {
                position: relative;
                min-height: 56px;
            }
            .header-info .title {
                font-size: 28px;
                line-height: 39px;
                font-weight: 600;
                text-align: center
            }
            .header-info .time {
                font-size: 12px;
                line-height: 17px;
                text-align: center
            }
            .header-info .logo {
                position: absolute;
                top: 0;
                left: 0;
                height: 50px;
                max-width: 100%;
                overflow: hidden;
            }
            .header-info .logo img {
                max-width: 100%;
                max-height: 100%;
            }
            .header-info .js-barcode {
                position: absolute;
                top: 0;
                right: 0;
                /*max-width: 500px;*/
            }
            .header-info .js-barcode .image {
                max-width: 100%;
                height: 36px;
            }
            .header-info .js-barcode .image img {
                max-width: 100%;
                max-height: 100%;
            }
            .header-info .js-barcode .text {
                text-align: right;
            }
            .order-info {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                padding: 12px 12px 6px 12px;
            }
            .order-info .item-text {
                padding-bottom: 6px;
                width: 33.3%;
            }
            .user-info-top {
                display: flex;
                align-items: center;
                padding: 12px 12px 6px 12px;
                flex-wrap: wrap;
            }
            .user-info-top .item-text {
                padding-bottom: 6px;
                width: 33.3%;
            }
            .user-info-top .item-text.item-address {
                padding-bottom: 6px;
                width: 100%;
            }
            .user-info-bottom {
                border-top: 1px solid #636669;
                padding: 12px;
            }
            .table-info .shop-table-list {
                border-collapse:collapse
            }
            .table-info .shop-table-list thead {
                background-color: #f4f6fb;
                width: 100%;
            }
            .table-info .shop-table-list table {
                border-collapse:collapse;
            }
            table tr {
                /*display: flex;*/
            }
            table tr th,
            table tr td >div {
                /*flex: 1;*/
                padding: 10px 20px 10px 0;
                text-align: left;
                font-size: 12px;
                line-height: 17px;
            }
            table tr td >div {
                 padding: 4px 20px 4px 0;
            }
            table tr th:first-child,
            table tr td:first-child{
                padding-left: 12px;
            } 
            table tr th:last-child,
            table tr td:last-child div{
                padding-right: 12px;
            }
            table tbody th {
                font-weight: normal;
            }
            table tbody td {
                border-top: 1px solid #636669;
            }
            table tbody td.number div,
            table thead th.number {
                padding-right: 12px;
            }
            table .number {
                width: 30px;
            }
            table .title{
                min-width: 100px;
            }
            table .title .goods-two-line-hide {
                max-height: 32px;
            }
            table .short_name {
                min-width: 60px;
            }
             table .short_name .goods-two-line-hide {
                max-height: 32px;
            }
            table .goods_sku {
                min-width: 80px;
                /*max-width: 150px;*/
            }
            table .option_title{
                min-width: 100px;
            }
            table .option_title .goods-two-line-hide {
                max-height: 32px;
            }
            table .price_unit {
                min-width: 70px;
            }
            table .total {
                min-width: 30px;
            }
            table .price {
                min-width: 70px;
            }
            /*费用统计*/
            .charge-info {
                display: flex;
                align-items: center;
            }
            .charge-info .left {
                width: 40%;
                flex-shrink: 0;
                text-align: center;
                font-size: 18px;
                line-height: 25px;
            }
            .charge-info .right {
                flex: 1;
                display: flex;
                justify-content: flex-end;
                padding: 12px 12px 6px 12px;
                border-left: 1px solid #636669;
            }
            .charge-info .right .item {
                display: flex;
                align-items: center;
                font-size: 12px;
                line-height: 17px;
                padding-bottom: 6px;
            }
            .charge-info .right .item .label {
                width: 80px;
                text-align: right;
            }
            .charge-info .right .item .content {
                min-width: 80px;
            }
            .charge-info .right .payment .label {
                font-size: 14px;
                line-height: 20px;
            }
            .charge-info .right .payment .content {
                font-size: 20px;
                line-height: 28px;
                font-weight: 600;
            }
            /*footer*/
            .footer-info {
                padding-top: 70px;
            }
            .footer-info .footer-qr-code {
                width: 108px;
                height: 108px;
                margin: 0 auto;
            }
            .footer-info .footer-qr-code img{
                max-width: 100%;
                max-height: 100%;
            }
            .footer-info .footer-text {
                padding-top: 6px;
                font-size: 12px;
                line-height: 17px;
                text-align: center;
            }
            /*横版*/
            .direction-horizontal .border-box {
                border-bottom: none;
            }
            /*.direction-horizontal .border-box:last-child {*/
            /*    border-bottom: 1px solid #636669;*/
            /*}*/
            .direction-horizontal .header-info {
                padding-bottom: 30px;
            }
            .direction-horizontal .user-info {
                display: flex;
            }
            .direction-horizontal .user-info .user-info-top {
                display: flex;
                flex-wrap: wrap;
            }
            .direction-horizontal .user-info .user-info-top .item-text {
                width: 48.4%;
            } 
            .direction-horizontal .user-info .user-info-top .item-text.item-address {
                width: 100%;
            }
            .direction-horizontal .user-info .user-info-top {
                width: 70%;
            }
            .direction-horizontal .user-info .user-info-bottom {
                width: 30%;
                border-top: none;
                border-left: 1px solid #636669;
            }
            .direction-horizontal .charge-info {
                border-bottom: 1px solid #636669;
            }
            .direction-horizontal .charge-info .left {
                width: 25%;
            }
            .direction-horizontal .charge-info .right{
                display: flex;
                justify-content: flex-end;
                align-items: center;
                /*height: 41px;*/
                box-sizing: border-box;
                width: 70%;
                padding: 0 12px 0 12px;
            }
            .direction-horizontal .charge-info .right.right-long .item-box-horizontal .item-text {
                padding-bottom: 0;
            } 
            .direction-horizontal .charge-info .right.right-long .item-box-horizontal div::nth-last-child(2) {
                padding-right: 0;
            }
            .direction-horizontal .charge-info .item-box-horizontal{
                display: flex;
                align-items: center;
                justify-content: flex-end;
                flex-wrap: wrap;
            }
            .direction-horizontal .charge-info .item-box-horizontal .item-text{
                padding: 12px 20px 12px 0;
               /*padding-right: 20px;*/
               display: flex;
            }
            .direction-horizontal .charge-info .payment-horizontal {
                display: flex;
                align-items: center;
                 padding: 6px 0;
            }
            .direction-horizontal .charge-info .payment-horizontal .label{
               font-size: 14px;
                line-height: 20px;
            }
             .direction-horizontal .charge-info .payment-horizontal .content{
                   font-size: 20px;
                    line-height: 28px;
                    font-weight: bold;
                }
            .direction-horizontal .footer-info {
                padding-top: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .direction-horizontal .footer-info .footer-qr-code {
                margin: 0;
                width: 45px;
                height: 45px;
            }
            .direction-horizontal .footer-info .footer-text {
                padding-top: 0;
                padding-left: 10px;
            }
        </style>
        `;
    }
};
