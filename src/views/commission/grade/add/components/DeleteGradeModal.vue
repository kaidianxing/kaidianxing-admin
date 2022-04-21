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
    <kdx-modal-frame v-model="value" title="删除分销商等级" width="480" @on-cancel="handleCancel" @on-ok="handleOk">
        <div class="delete-commission-grade-modal">
            <Form ref="form" :model="model" :label-width="0">
                <FormItem class="r-form-item-checkbox">
                    <RadioGroup v-model="model.type">
                        <Radio :disabled='noManagePerm' label="1">分销商移入其他等级</Radio>
                        <Radio :disabled='noManagePerm' label="2">删除等级并删除分销商佣金比例</Radio>
                    </RadioGroup>
                    <div class="level-select" v-if="model.type == '1'">
                        <Select v-model="model.level_id" placeholder="请选择" class="width-340">
                            <Option :disabled='noManagePerm' v-for="item in level" :key="item.id" :value="item.id">{{item.name}}
                            </Option>
                        </Select>
                    </div>
                </FormItem>
            </Form>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "DeleteCouponsModal",
        computed: {
            noManagePerm() { //管理权限
                return !this.$getPermMap('commission.level.manage')
            },
        },
        props: {
            id: {
                type: [Number, String],
                default: '0'
            }
        },
        data() {
            return {
                model: {
                    type: '1',
                    level_id: '',
                },
                value: false,
                level: []
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
                if (this.value) {
                    this.type = '1';
                    this.getAllLevel();
                }
            },
            handleCancel() {
                this.setValue();
            },
            handleOk() {
                let params = {id: this.id, type: this.model.type};
                if (this.model.type == '1') {
                    if (!this.model.level_id) {
                        this.$Message.error('请选择要移入的分销商');
                        return;
                    } else {
                        params.level_id = this.model.level_id;
                    }
                }
                this.$api.commissionApi.deleteAgentGrade(params)
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('分销商等级删除成功');
                            this.setValue();
                            this.$router.go(-1);
                        }
                    });
            },
            getAllLevel() {
                this.$api.commissionApi.getAgentGradeAllList()
                    .then(res => {
                        if (res.error === 0) {
                            this.level = [];
                            res.list.forEach(item => {
                                if (item.id != this.id) {
                                    this.level.push(item);
                                }
                            })
                        }
                    });
            }
        }
    };
</script>

<style scoped lang="scss">
    .delete-commission-grade-modal {
        padding: 30px;
        .ivu-form {
            .ivu-form-item {
                margin-bottom: 20px;
                .ivu-form-item-label {
                    padding-right: 0;
                }
                .level-select {
                    padding-top: 10px;
                }
            }
        }
    }
</style>
