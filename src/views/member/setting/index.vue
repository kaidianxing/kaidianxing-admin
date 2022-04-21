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
        <div class="vip-setting">
            <div class="content">
                <kdx-form-title>
                    会员升级设置
                </kdx-form-title>
                <RadioGroup v-model="type" vertical style="margin-left: 20px" class="r-form-item-checkbox">
                    <Radio label="1">
                        <span>订单完成后</span>
                        <remind-label title="推荐"></remind-label>
                    </Radio>
                    <Radio label="2">
                        <span>付款后</span>
                        <kdx-hint-text style="display: inline-block;" errContent="【风险】用户在付款后申请维权，来刷取会员等级的折扣"></kdx-hint-text>
                    </Radio>
                </RadioGroup>
            </div>
        </div>
        <template #btn>
            <Button type="primary" :loading="submitLoading" :disabled="noManagePerm" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
    import RemindLabel from '@/components/little/RemindLabel';

    export default {
        name: "index",
        components: {
            RemindLabel
        },
        data() {
            return {
                type: '1',
                submitLoading: false,
            };
        },
        computed: {
            noManagePerm() { //管理权限
                return !this.$getPermMap('member.level_upgrade.manage')
            },
        },
        created() {
        },
        mounted() {
            this.getDetail()
        },
        methods: {
            getDetail() {
                this.$api.memberApi.getUpgrade({}).then(res => {
                    if (res.error == 0) {
                        this.type = res.type
                    }
                })
            },
            handleSave() {
                this.submitLoading = true;
                this.$api.memberApi.setUpgrade({update_type: this.type}).then(res => {
                    if (res.error == 0) {
                        this.getDetail();
                        this.$Message.success('保存成功')
                    }
                    this.submitLoading = false;
                })
            }
        }
    };
</script>

<style scoped lang="scss">
    .vip-setting {
        background:#ffffff;
        height: 100%;
        margin: 20px auto 0;
        > .content {
            padding: 40px;
            /deep/ .ivu-radio-group-item {
                margin-bottom: 30px;
            }
        }
    }
</style>
