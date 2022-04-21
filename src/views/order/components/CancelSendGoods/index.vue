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
    <kdx-modal-frame v-model="value" title="取消发货" :width="700" class-name="cancel-send-goods" @on-cancel="handleCancel"
                 @on-ok="handleOk">
        <kdx-hint-alert :show-icon="false" type="info" class="marginB-10">选择需要取消发货的包裹</kdx-hint-alert>
        <div class="table-list">
            <select-table-list :data="data.packages" :multiple="true" @on-change="selectChange"></select-table-list>
        </div>
        <div class="remark">
            <Input v-model="model.reason" type="textarea" placeholder="请输入取消原因"/>
        </div>
    </kdx-modal-frame>
</template>

<script>
    import SelectTableList from "@/views/order/components/SelectTableList";

    export default {
        name: "index",
        components: {SelectTableList},
        props: {
            id: {
                type: [String, Number],
                required: true
            }
        },
        data() {
            return {
                model: {
                    reason: '',
                    goodsId: []
                },
                value: false,
                data: {}
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
                if (this.value) {
                    this.reset();
                    this.getData();
                }
            },
            handleCancel() {
                this.setValue();
            },
            handleOk() {
                if (this.model.goodsId.length === 0) {
                    this.$Message.error('请选择要取消发货的包裹');
                    return;
                }
                let params = {
                    package_id: this.model.goodsId,
                    reason: this.model.reason,
                    order_id: this.id
                };
                this.$api.orderApi.setCancelSendGoods(params)
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('取消发货成功');
                            this.setValue();
                            this.$emit('on-refresh');
                        }
                    });
            },
            selectChange(index, row) {
                let idIndex = this.model.goodsId.indexOf(row.id);
                if (idIndex > -1) {
                    this.model.goodsId.splice(idIndex, 1);
                } else {
                    this.model.goodsId.push(row.id);
                }
                this.initGoodsData();
            },
            // 初始化data,添加选中属性
            initGoodsData() {
                this.data.packages.forEach((item, index) => {
                    if (this.model.goodsId.indexOf(item.id) > -1) {
                        this.$set(this.data.packages[index], 'checked', true);
                    } else {
                        this.$set(this.data.packages[index], 'checked', false);
                    }
                });
            },
            getData() {
                this.$api.orderApi.getSendPackage({order_id: this.id})
                    .then(res => {
                        if (res.error === 0) {
                            this.data = res;
                        }
                    });
            },
            reset() {
                this.model = {
                    reason: '',
                    goodsId: []
                };
            }
        }
    };
</script>

<style lang="scss">
    .cancel-send-goods {
        .content {
            padding: 20px;

            .table-list {
                padding-bottom: 10px;
            }
        }
    }
</style>
