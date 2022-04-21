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
    <kdx-content-bar :loading="loading">
        <div class="grade-add">
            <commission-rate ref="rate" :level="level" :setting="setting" :is-default="is_default"></commission-rate>
            <upgrade-mode ref="mode" v-if="!is_default"></upgrade-mode>
        </div>
        <template #btn>
            <Button class="primary-long" :disabled='noManagePerm' @click="handleSave">保存</Button>
            <Button class="default-long" :disabled='noManagePerm' to="/commission/grade">取消</Button>
            <Button v-if="!is_default&&id" :disabled='noManagePerm' class="default-error-long" @click="deleteGrade">删除分销等级</Button>
        </template>
        <delete-grade-modal ref="delete_grade" :id="id"></delete-grade-modal>
    </kdx-content-bar>
</template>

<script>
    import CommissionRate from "./components/CommissionRate";
    import UpgradeMode from "./components/UpgradeMode";
    import DeleteGradeModal from "./components/DeleteGradeModal";

    export default {
        name: "index",
        components: {
            CommissionRate,
            UpgradeMode,
            DeleteGradeModal
        },
        computed: {
            noManagePerm() { //管理权限
                return !this.$getPermMap('commission.level.manage')
            },
        },
        data() {
            return {
                id: '',
                level: [],
                setting: {
                    commission_level: '3'
                },
                levelCurrent: '',
                is_default: false,
                loading: false,
            };
        },
        methods: {
            // 获取使用的等级
            getUsedLevel() {
                this.$api.commissionApi.getAgentGradeUse()
                    .then(res => {
                        if (res.error === 0) {
                            this.level = res.level || [];
                            if (this.levelCurrent) {
                                let index = this.level.indexOf(this.levelCurrent);
                                this.level.splice(index, 1);
                            }
                        }
                    });
            },
            // 获取等级数据
            getData() {
                this.loading = true;
                this.$api.commissionApi.getAgentGradeDetail({id: this.id})
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            if (res.data.is_default && res.data.is_default == '1') {
                                this.is_default = true;
                            } else {
                                this.is_default = false;
                            }
                            this.$refs['rate'].resetModel(res.data);
                            !this.is_default && this.$refs['mode'].resetModel(res.data);
                            this.levelCurrent = res.data.level;
                            this.getUsedLevel();
                        }
                    });
            },
            // 新增
            addGrade(params) {
                this.$api.commissionApi.addAgentGrade(params)
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('分销商等级新增成功');
                            this.$router.go(-1);
                        }
                    });
            },
            // 修改
            editGrade(params) {
                Object.assign(params, {id: this.id});
                this.$api.commissionApi.editAgentGrade(params)
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('分销商等级修改成功');
                            this.$router.go(-1);
                        }
                    });
            },
            handleSave() {
                this.$refs['rate'].validate()
                    .then((valid) => {
                        if(valid) {
                            if (this.is_default) {
                                return true;
                            } else {
                                return this.$refs['mode'].validate();
                            }
                        }else {
                            return Promise.reject()
                        }
                    }).then(() => {
                    let params = {
                        ...this.$refs['rate'].getModel()
                    };
                    if (!this.is_default) {
                        Object.assign(params, this.$refs['mode'].getModel());
                    }
                    if (this.id) {
                        this.editGrade(params);
                    } else {
                        this.addGrade(params);
                    }
                });
            },
            deleteGrade() {
                this.$refs['delete_grade'].setValue();
            },
            // 获取分销设置
            getCommissionSetting() {
                this.$api.commissionApi.getSettings()
                    .then(res => {
                        if (res.error == 0) {
                            this.setting = res.settings;
                            console.log('setting', this.setting);
                        }
                    });
            }
        },
        mounted() {
            this.id = this.$route.query.id || '';
            this.getCommissionSetting();
            if (this.id) {
                this.getData();
            } else {
                this.getUsedLevel();
            }
        }
    };
</script>

<style scoped lang="scss">
    .grade-add {
        /*margin-top: 20px;*/
        padding: 40px;
        background-color: #FFFFFF;
        min-height: 100%;
    }
</style>
