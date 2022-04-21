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
    <div class="comp-delivery-type">
        <div class="flex align-center space-between">
            <div class="left">
                <div class="flex left-box">
                    <div class="name" v-if="type === 'ordinaryExpress'">
                        普通快递
                    </div>
                     <div class="right" style="margin-left: 16px">
                        <i-switch
                            v-model="modelValue"
                            :true-value="1"
                            :false-value="0"
                            :disabled="noManagePerm"
                            @on-change="handleChange"
                        />
                        <div class="text" :class="{ active: modelValue === 1 }">
                            {{ modelValue === 1 ? '已开启' : '已关闭' }}
                        </div>
                    </div>
                </div>
                <div class="tips" v-if="type === 'ordinaryExpress'">
                    启用后，买家下单可以选择快递发货，由商家安排快递送货上门。
                    <span @click="showModal">
                        【运费计算规则】
                    </span>
                </div>
            </div>
           
        </div>
        <kdx-modal-frame
            :title="modalTitle"
            v-model="showModalFlag"
            :footerHide="true"
            @on-cancel="showModalFlag = false"
        >
            <div class="modal-frame-content" v-if="modalType === 'description'">
                <div class="title">组合运费</div>
                <ul>
                    <li>
                        <div class="item-title">
                            1. 不同商品设置同一运费模板：
                            <span>【相关所有商品按该模板设置的规则计算】</span>
                        </div>
                        <div class="item-content">
                            <div class="flex">
                                <div class="left note">注意</div>
                                <div class="right">
                                    不足续件或者续重的数目的时候，仍然按照续件或者续重的数目进行计算
                                </div>
                            </div>
                            <div class="flex">
                                <div class="left example">例子</div>
                                <div class="right">
                                    商品A，B都是用模板M（首3件10块，续2件5块）<br />
                                    同时购买商品2件A和2件B<br />
                                    运费=模板M的运费=10+5=15元
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-title">
                            2. 多种商品，分别设置不同金额的统一运费：
                            <span>【以最高运费金额收取】</span>
                        </div>
                        <div class="item-content">
                            <div class="flex">
                                <div class="left note">注意</div>
                                <div class="right">
                                    不足续件或者续重的数目的时候，仍然按照续件或者续重的数目进行计算
                                </div>
                            </div>
                            <div class="flex">
                                <div class="left example">例子</div>
                                <div class="right">
                                    商品E，F，G的统一运费分别为1元，2元和3元<br />
                                    同时购买E，F，G商品 ， 运费=最大统一运费=3元
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-title">
                            3. 不同商品设置不同的运费模板：
                            <span>【先计算Max首费模板运费+其他模板续费】</span>
                        </div>
                        <div class="item-content">
                            <div class="flex">
                                <div class="left note">注意</div>
                                <div class="right">
                                    <span>Max首费计算规则</span><br />
                                    1.先对比首费，取最大首费模板<br />
                                    2.首费一样时对比首费平均值，取最大首费平均值<br />
                                    3.首费平均值一样时，对比续费，取最大续费<br />
                                    4.续费一样时对比续费平均值，取最大续费平均值
                                </div>
                            </div>
                            <div class="flex">
                                <div class="left example">例子</div>
                                <div class="right">
                                    商品C（1kg）使用用模板N（首1kg，10块，续2kg，5块），商品D（0.5kg）使用模板O（首2kg，12块，续1kg，5块），<br />
                                    同时购买商品（2kg）C和（1kg）D
                                    ，运费=模板O的运费+模板N的续费=（12）+（5）=17元
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-title">
                            4. 统一运费商品和运费模板商品一同结算：
                            <span>
                                【单独计算统一运费商品应收运费，再累加运费模板应收运费】
                            </span>
                        </div>
                        <div class="item-content">
                            <div class="flex">
                                <div class="left example">例子</div>
                                <div class="right">
                                    同时购买商品2件A和2件B + （2kg）C和（1kg）D
                                    + E，F，G<br />
                                    运费=最大统一运费+模板O的运费+模板N的续费+模板M的续费=3+（12）+（5）+（5*2）=30元
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="modal-frame-content" v-if="modalType === 'tips'">
                <div class="modal-frame-content-tips">
                    需要开启快递发货店铺才能正常运营。
                </div>
            </div>
        </kdx-modal-frame>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    props: ['type'],
    data() {
        return {
            showModalFlag: false,
            modalTitle: '',
            modalType: '',
            modelValue: 0,
            deliveryType: {
                express: 0,
            },
        }
    },
    computed: {
        noManagePerm() { //管理权限
            return !this.$getPermMap('order.dispatch.manage')
        },
    },
    async created() {
        // 获取配送方式开启状态
        let deliveryType = await this.getDispatchEnable()
        this.deliveryType = {
            ...deliveryType,
        }
        if (this.type === 'ordinaryExpress') {
            this.modelValue = deliveryType?.express || 0
        }
    },
    methods: {
        ...mapActions('goodAddEdit', ['getDispatchEnable']),
        showModal() {
            this.modalTitle = '运费模板说明'
            this.modalType = 'description'
            this.showModalFlag = true // 显示弹窗
        },
        handleChange(value) {
            if (this.type === 'ordinaryExpress') {
                if (value === 0) {
                    if (this.deliveryType.intracity === 0) {
                        this.modalTitle = '系统提示'
                        this.modalType = 'tips'
                        this.showModalFlag = true
                        this.$nextTick(() => {
                            this.modelValue = 1
                        })
                        return
                    }
                }
                this.enableExpress()
            }
        },
        // 普通快递开启关闭
        enableExpress() {
            this.$api.orderApi
                .enableExpress({
                    enable: this.modelValue,
                })
                .then((res) => {
                    if (res.error === 0) {
                        this.$Message.success('修改成功')
                    }
                })
        },
    },
}
</script>

<style scoped lang="scss">
.comp-delivery-type {
    background-color: #fff;
    border-radius: 2px;
    padding: 20px;
    margin-bottom: 10px;
    .name {
        font-weight: bold;
        color: #262b30;
        font-size: 18px;
        line-height: 25px;
    }
    .tips {
        font-size: 12px;
        line-height: 16px;
        color: #939799;
        margin-top: 8px;
        span {
            color: $brand-color;
            font-weight: bold;
            cursor: pointer;
        }
    }
    .right {
        display: flex;
        align-items: center;
        .text {
            margin-left: 6px;
            font-weight: bold;
            font-size: 14px;
            line-height: 20px;
            color: #939799;
            &.active {
                color: $brand-color;
            }
        }
    }
}
.modal-frame-content {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
    .title {
        padding-left: 12px;
        font-weight: bold;
        font-size: 14px;
        line-height: 20px;
        color: #262b30;
    }
    ul {
        li {
            padding: 20px 0 20px 34px;
            border-bottom: 1px solid #e9edef;
            .item-title {
                font-weight: bold;
                font-size: 14px;
                line-height: 20px;
                color: #262b30;
                span {
                    font-weight: normal;
                }
            }
            .item-content {
                .flex {
                    margin-top: 10px;
                    padding-left: 18px;
                    .left {
                        width: 40px;
                        height: 20px;
                        border-radius: 2px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        line-height: 16px;
                        margin-top: 1px;
                        &.note {
                            color: #ff1f2c;
                            background-color: #fff1f2;
                        }
                        &.example {
                            color: $brand-color;
                            background-color: #f0faff;
                        }
                    }
                    .right {
                        padding-left: 10px;
                        font-size: 12px;
                        line-height: 24px;
                        color: #262b30;
                        span {
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }
    .modal-frame-content-tips {
        padding-bottom: 20px;
        font-size: 14px;
        line-height: 20px;
        color: #262b30;
        text-align: center;
        font-weight: bold;
    }
   
}
.left-box {
    height: 22px;
    align-items: center;

    .name {
        line-height:1;
    }
}
</style>
