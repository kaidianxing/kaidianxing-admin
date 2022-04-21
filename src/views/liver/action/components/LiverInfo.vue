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
<template>
    <div class="action-liver">
        <kdx-form-title>直播间信息</kdx-form-title>
        <div class="liver">
            <img
                v-if="info.share_img"
                :src="$utils.getWechatImg(info.share_img)"
                class="liver-thumb"
            />
            <Row class="liver-info">
                <Col
                    class="cell"
                >
                <div class="cell-list">
                    <span class="label">直播间标题：</span>
                    <span>{{info.title}}</span>
                </div>
                <div class="cell-list">
                    <span class="label">主播昵称：</span>
                    <span>{{info.anchor_name || '-'}}</span>
                </div>
                </Col>
                <Col
                    class="cell"
                >
                <div class="cell-list">
                    <span  class="label">主播微信号：</span>
                    <span>{{info.anchor_wechat || '-'}}</span>
                </div>
                 <div class="cell-list">
                    <span  class="label">直播时间：</span>
                    <span>{{info.start_time}} - {{info.end_time}}</span>
                </div>
              
                
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {

            }
        }
    }
}
</script>

<style lang="scss" scoped>
.action-liver {
    margin-bottom: 10px;
    border-radius: 2px;
    padding: 40px;
    background-color: #fff;

    .liver {
        display: flex;

        &-thumb {
            margin: 0 50px 20px 40px;
            width: 120px;
            height: 96px;
            border: 4px solid #ffffff;
            box-shadow: 0px 4px 10px rgba(0, 82, 169, 0.2);
            border-radius: 2px;
        }

        &-info {
            flex: 1;
            padding: 6px 0 4px 0;
            font-size: 14px;
            line-height: 20px;
            height: 80px;
            color: #262b30;
            display: flex;
            justify-content: flex-start;

            .cell {
                margin-right: 120px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .label {
                    display: inline-block;
                    width: 100px;
                    text-align: right;
                }
            }
        }
    }
}
</style>