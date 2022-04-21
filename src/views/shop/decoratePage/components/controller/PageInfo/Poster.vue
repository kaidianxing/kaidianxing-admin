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
    <div class='poster'>
        <i-form ref="pageInfo" :label-width="110" :model="currentModal" :rules="validator">
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="海报名称：" style='margin-bottom:30px;'  required prop='title'>
                    <Input placeholder="商品海报" v-model='currentModal.title' :maxlength="20" show-word-limit style="width: 400px;" @on-change='tipError'>
                    </Input>
                </form-item>
                <form-item label="访问页面：" style='margin-bottom:10px;' v-if='pageId=="commissionposter"' prop=''>
                    <MyRadioGroup :items='linkid' v-model='currentModal.params.linkid'>
                    </MyRadioGroup>
                </form-item>
                <div v-if='pageId=="followposter"'>
                    <form-item label="获取关键词：" style='margin-bottom:30px;' required prop='keywords'>
                        <Input placeholder="商品海报" v-model='currentModal.keywords' :maxlength="20" show-word-limit style="width: 400px;"></Input>
                    </form-item>
                    <form-item label="获取有效期：" style='margin-bottom:24px;' required  prop='expire_start_time'>
                        <div style='display:flex;flex-wwap:nowrap'>
                            <DatePicker :value='currentModal.params.expire_start_time' type="date" format="yyyy-MM-dd" placeholder="选择日期" style="width: 187px;flex-shrink:0;" @on-change='getContent("expire_start_time",$event)'></DatePicker>
                            </Col><span style='display:inline-block;width:26px;text-align:center;flex-shrink:0;'>~</span>
                            <DatePicker :value='currentModal.params.expire_end_time' type="date" format="yyyy-MM-dd" placeholder="选择日期" style="width: 187px;flex-shrink:0;" @on-change='getContent("expire_end_time",$event)'></DatePicker>
                            </Col>
                        </div>
                    </form-item>
                    <form-item label="海报有效期：" style='margin-bottom:20px;' required prop='expire_time'>
                        <MyRadioGroup :items='expire_time' v-model='currentModal.params.expire_time'>
                        </MyRadioGroup>
                        <kdx-hint-text v-if="currentModal.params.expire_time=='-1'">一个公众号下最多生成10万个永久二维码，达到数量将无法再生成、同时无法清理已产生的二维码，请谨慎选择</kdx-hint-text>
                    </form-item>
                    <form-item label="获取对象：" style='margin-bottom:20px;'>
                        <MyRadioGroup :items='access_type' v-model='currentModal.params.access_type'>
                        </MyRadioGroup>
                    </form-item>
                </div>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from '../mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_img',
        computed: {
            pageId() {
                return this.$route.params.page
            }
        },
        data() {
            return {
                linkid: [{
                    label: '商城主页',
                    id: 1
                }],
                expire_time: [{
                    label: '3天',
                    id: 3
                }, {
                    label: '7天',
                    id: 7
                }, {
                    label: '15天',
                    id: 15
                }, {
                    label: '30天',
                    id: 30
                }, {
                    label: '永久',
                    id: -1
                }],
                access_type: [{
                    label: '不限制',
                    id: 0
                }, {
                    label: '分销商',
                    id: 1
                }],
            }
        },
        methods: {
            getContent(prop,date) {
                let datetime = new Date(date)
                let year = datetime.getFullYear()
                let month = datetime.getMonth() + 1;
                let day = datetime.getDate()
                this.currentModal.params[prop] = `${year}-${month>9?month:'0'+month}-${day>9?day:'0'+day}`
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '../common.scss';
</style>