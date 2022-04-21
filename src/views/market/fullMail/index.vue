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
    <kdx-content-bar>
        <div class="market-full-mail">
            <kdx-form-title>满额包邮</kdx-form-title>
            <Form ref="form" :model="model" :rules="rules" :label-width="140" @submit.native.prevent>
                <FormItem label="满额包邮：" class="r-form-item-checkbox">
                    <RadioGroup v-model="model.state">
                        <Radio :disabled='noManagePerm' label="1">开启</Radio>
                        <Radio :disabled='noManagePerm' label="0">关闭</Radio>
                    </RadioGroup>
                    <div class="form-item-bg-box" v-show="model.state === '1'">
                        <FormItem label="满额包邮：" prop="order_enough" class="form-item-full">
                            <div class="flex">
                                <span class="ivu-input-group-prepend item-append">单笔订单满</span>
                                <kdx-rr-input
                                    :disabled='noManagePerm'
                                    v-model="model.order_enough"
                                    number :fixed="2" :min-value="0" :max-value="9999999.99"
                                    class="width-250"
                                />
                                <span class="ivu-input-group-append item-append">元</span>
                                <span class="marginL-10">包邮</span>
                            </div>
                        </FormItem>
                        <FormItem label="不参与包邮地区：">
                            <Button
                                :disabled='noManagePerm'
                                class="default-primary"
                                @click="showRegionModal"
                                style="display: block;"
                            >选择地区</Button>
                            <div class="region-text" style="margin-top:10px;" v-show="getAreaText">{{getAreaText}}</div>
                        </FormItem>
                        <FormItem label="指定商品：">
                            <RadioGroup v-model="model.is_participate" @on-change="radioChange">
                                 <Radio :disabled='noManagePerm' label="2">不限制</Radio>
                                <Radio :disabled='noManagePerm' label="0">以下商品不参与</Radio>
                                <Radio :disabled='noManagePerm' label="1">以下商品参与</Radio>
                            </RadioGroup>
                            <div v-if="model.is_participate!=='2'">
                                <Button
                                :disabled='noManagePerm'
                                class="default-primary"
                                @click="addShop"
                                style="display: block;margin-bottom: 10px"
                            >选择商品</Button>
                            <div v-show="selector.data.length" class="shop-list-box">
                                <shop-name-page-list
                                    ref="shop_name_list"
                                    :list="selector.data"
                                    @on-delete="handleDelete"
                                ></shop-name-page-list>
                            </div>
                            </div>
                        </FormItem>
                    </div>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :disabled='noManagePerm' @click="handleSave">保存</Button>
        </template>
        <!--地址选择器-->
        <selector-region
                :visible="region.modal"
                :list="region.data"
                @on-ok="regionSelectOk"
                @on-cancel="regionSelectCancel"
        ></selector-region>
        <!--商品选择器-->
        <goods-selector
                v-model="selector.modal"
                :multiple="true"
                :type="'0'"
                :current-list="selector.data"
                @on-change="selectorChange"
                @on-cancel="selectorCancel"
        ></goods-selector>
    </kdx-content-bar>
</template>

<script>
import SelectorRegion from '@/components/selector/Region'
import GoodsSelector from '@/components/selector/GoodsSelector'
import ShopNamePageList from "@/components/ShopNamePageList";

export default {
    name: 'index',
    components: {
        SelectorRegion,
        GoodsSelector,
        ShopNamePageList
    },
    data() {
        const validator = (filed, val, callback) => {
            if (this.model.state === '1') {
                if (!val || val === '0') {
                    callback(new Error('请正确填写满额包邮的费用'))
                } else if (val < 0) {
                    callback(new Error('满额包邮的费用最小值为0'))
                } else if (val >= Math.pow(10, 8)) {
                    callback(new Error('满额包邮的费用需小于1千万'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        return {
            model: {
                state: '0',
                order_enough: null,
                enough_areas_code: null,
                is_participate: '0'
            },
            shop: {
                data: [],
                defaultNumber: 10 // 商品列表默认显示商品数量
            },
            region: {
                modal: false,
                data: {}
            },
            selector: {
                modal: false,
                data: []
            },
            showMore: false,
            rules: {
                order_enough: [{ required: true, validator }]
            },
            submitStatus: false
        }
    },
    computed: {
        noManagePerm() { //管理权限
            return !this.$getPermMap('sale.basic.free.manage')
        },
        getAreaText() {
            let enough_areas_code = this.model.enough_areas_code
            if (enough_areas_code) {
                return enough_areas_code.text
            } else {
                return false
            }
        },
        getLimitStatus() {
            if (this.showMore) {
                return true
            }
            return this.selector.data.length > this.shop.defaultNumber
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        // 添加商品
        addShop() {
            this.selector.modal = true
        },
        // 商品删除
        handleDelete(index) {
            this.selector.data.splice(index, 1)
            this.$nextTick(() => {
                this.$refs['shop_name_list']?.reset();
            });
        },
        handleSave() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    let data = {
                        order_enough: this.model.order_enough,
                    }
                    let state = this.model.state
                    if (state === '0') {
                        data = {
                            state
                        }
                        this.postData(data)
                        return
                    }

                    if (state === '1' && !this.submitStatus) {
                        this.submitStatus = true
                        this.$refs.form.validate(valid => {
                            this.submitStatus = false

                            if (valid) {
                                data.state = state
                                data.is_participate =this.model.is_participate
                                if (this.selector.data.length&& data.is_participate!='2') {
                                    data.goods_ids = this.selector.data.map(v => v.id)
                                }

                                if (this.model.enough_areas_code) {
                                    data.enough_areas_code = JSON.stringify(
                                        this.model.enough_areas_code
                                    )
                                }
                                this.postData(data)
                            }
                        })
                    }
                }
            })
        },
        postData(data) {
            this.$api.marketApi.editMailFree(data).then(res => {
                if (res.error === 0) {
                    this.getData()
                    this.$Message.success('保存成功')
                }
            })
        },
        // 新增region
        showRegionModal() {
            this.region.data = this.model.enough_areas_code || {}
            this.region.modal = true
        },
        // 区域选择完成
        regionSelectOk(data) {
            if (data.provinces.length) {
                this.model.enough_areas_code = data
            } else {
                this.model.enough_areas_code = null
            }
            this.regionSelectCancel()
        },
        regionSelectCancel() {
            this.region.modal = false
        },
        // 商品选择器
        selectorChange(list) {
            this.selector.data = list
            this.$nextTick(() => {
                this.$refs['shop_name_list']?.reset();
            });
        },
        selectorCancel() {
            this.selector.modal = false
        },
        // 更多商品
        moreShop() {
            this.showMore = true
            this.shop.data = this.selector.data
        },
        stringToNum(num) {
            if (typeof num === 'string') {
                return parseFloat(num)
            } else {
                return null
            }
        },
        //获取数据
        getData() {
            this.$api.marketApi.getMailFree().then(res => {
                let {
                    error,
                    enough_areas_code,
                    goods,
                    order_enough,
                    state,
                    is_participate
                } = res
                if (error === 0) {
                    if (!goods) {
                        goods = []
                    }

                    if (enough_areas_code) {
                        enough_areas_code = JSON.parse(enough_areas_code)
                    } else {
                        enough_areas_code = null
                    }

                    this.model = {
                        ...this.model,
                        enough_areas_code: enough_areas_code,
                        state,
                        order_enough: this.stringToNum(order_enough),
                        is_participate:is_participate || '0'
                    }
                    this.selectorChange(goods, true)
                }
            })
        },
        radioChange(){
            this.selector.data = []
        }
    }
}
</script>

<style scoped lang="scss">
.market-full-mail {
    background-color: #ffffff;
    padding: 40px;
    min-height: 100%;
    margin-top: 20px;

    /deep/ .ivu-form-item .ivu-form-item .ivu-form-item-content {
        overflow: hidden;
    }
    /deep/.ivu-form-item .form-item-full .ivu-form-item-content {
        overflow: inherit;
        .ivu-form-item-error-tip {
            padding-left: 140px;
        }
    }

    .item-append {
        display: inline-block;
        padding: 0 7px;
        width: auto;
        height: 32px;
        line-height: 32px;
    }

    /deep/ .ivu-input-number {
        flex: 1;
        border-radius: 0;
    }

    .form-item-bg-box {
        overflow: hidden;
        margin-top: 10px;
        padding: 30px 20px 0;
        background-color: $background-color;

        .shop-list-box {
            margin-top: 10px;
            background-color: #ffffff;
            width: 610px;
            border-radius: 2px;
        }

        .more-btn {
            padding: 16px 10px;
        }
    }
}
</style>
