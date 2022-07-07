<template>
    <div class="spell-group-index">
        <preview :activityData="activityData"></preview>
        <div class="right">
            <kdx-content-bar>
                <div class="content">
                    <!-- 基本信息 -->
                    <basic-info ref="basicInfo" :type="type" :data.sync="basicInfoData" :status="status" :is-disabled="isDisabled"></basic-info>
                    <!-- 规则设置 -->
                    <rules-info ref="rulesInfo" :type="type" :activityData.sync="activityData"
                                :basic-info="basicInfoData" :id="id"
                                :is-disabled="isDisabled"></rules-info>
                </div>
                <template #btn>
                    <Button class="primary-long" type="primary" :disabled="isSaveBtnDisabled" :loading="submitLoading" @click="handleSave">保存</Button>
                    <Button class="default-long" to="/groups/activity/list">取消</Button>
                </template>
            </kdx-content-bar>
        </div>
    </div>
</template>

<script>
import preview from "./components/Preview";
import basicInfo from "./components/BasicInfo";
import rulesInfo from "./components/RulesInfo";

export default {
    name: "index",
    components: {preview, basicInfo, rulesInfo},
    data() {
        return {
            activityData: {
                inner_type: '0',
                hour: '',
                minute: '',
                is_preheat: '0',
                preheat_time: '',
                rules: {
                    success_num: 2,
                    virtual_success: '0',
                    virtual_success_num: '',
                    is_commission: '0',
                    use_coupon: '0',
                    limit_type: '0',
                    single_buy: '1',
                    use_platform_coupon: '0', // 优惠券
                },
                goods_info: [],
                group_num_list: [
                    {
                        num: 2
                    }
                ]
            },
            basicInfoData: {
                title: '',
                client_type: [],
                start_time: '',
                end_time: '',
            },
            loading: false,
            submitLoading: false,
            id: '', // 活动id
            type: '', // 类型  add/view/edit
            status: '',// 活动状态
        };
    },
    created() {
        let {id, type} = this.$route.query;
        this.id = id;
        this.type = type;
        if (this.id) {
            this.getGroupsActivityDetail();
        }
    },
    computed: {
        isDisabled() {
            return this.type !== 'add' && this.type !== 'copy';
        },
        isSaveBtnDisabled() {
            return this.type != 'copy' &&((-1 === +this.activityData?.status || -2 === +this.activityData?.status) || this.type=='view') ;
        }
    },
    methods: {
        getGroupsActivityDetail() {
            const params = {id: this.id}
            if(this.type == 'copy') {
                params.copy = 1
            }
            this.loading = true;
            this.$api.groupsApi.getGroupsActivityDetail(params).then((res) => {
                this.loading = false;
                if (res.error === 0) {
                    if(this.type == 'copy') {
                        res.data.title = `副本-${res.data.title}`
                    }
                    let {title, client_type, start_time, end_time, preheat_time, rules, goods_info, ...other} = res.data;
                    if (preheat_time == '0000-00-00 00:00:00') {
                        preheat_time = '';
                    }
                    // 限购次数
                    rules.limit_num1 = '';
                    rules.limit_num2 = '';
                    if (rules.limit_type == 1) {
                        rules.limit_num1 = rules.limit_num;
                    } else if (rules.limit_type == 2) {
                        rules.limit_num2 = rules.limit_num;
                    }
                    this.activityData = {
                        rules,
                        ...other,
                        preheat_time,
                        goods_info,
                    };
                    this.activityData.hour = Math.floor(this.activityData.rules.limit_time / 60);
                    this.activityData.minute = this.activityData.rules.limit_time % 60;
                    this.formatLadderInfo();
                    this.status =other.status
                    this.basicInfoData = {
                        title: title,
                        client_type: client_type?.split(',') || [],
                        start_time,
                        end_time
                    };
                }
            });
        },
        async handleSave() {
            try {
                if (!this.id) {
                    await this.$refs.basicInfo.validateForm();
                }
                await this.$refs.rulesInfo.validateForm();
                let baseInfo = this.$refs.basicInfo.getParams(),
                    rulesInfo = this.$refs.rulesInfo.getParams();
                if (this.id && this.type != 'copy') {
                    let params = {
                        id: this.id,
                        is_preheat: rulesInfo.is_preheat,
                        preheat_time: rulesInfo.is_preheat == 1 ? rulesInfo.preheat_time : '',
                        end_time: baseInfo.end_time
                    };
                    this.editActivity(params);
                } else {
                    let params = Object.assign(baseInfo, rulesInfo);
                    this.saveActivity(params);
                }
            } catch (e) {
                this.submitLoading = false;
            }
        },
        saveActivity(params) {
            this.submitLoading = true;
            this.$api.groupsApi.addGroupsActivity(params).then(res => {
                if (res.error === 0) {
                    this.$Message.success('保存成功');
                    this.$router.replace({
                        path: '/groups/activity/list'
                    });
                }
            }).finally(() => {
                this.submitLoading = false;
            });
        },
        editActivity(params) {
            this.submitLoading = true;
            this.$api.groupsApi.editGroupsActivity(params).then(res => {
                if (res.error === 0) {
                    this.$Message.success('编辑成功');
                    this.$router.replace({
                        path: '/groups/activity/list'
                    });
                }
            }).finally(() => {
                this.submitLoading = false;
            });
        },
        formatLadderInfo() {
            let rules = this.activityData.rules,
                goods_info = this.activityData.goods_info;
            // 阶梯
            if (this.activityData.inner_type == 1) {
                this.activityData.group_num_list = Object.keys(rules.success_num).map(index => {
                    return {
                        num: rules.success_num[index]
                    };
                });
            }
            goods_info.forEach(item => {
                if (!item.has_option) {
                    item.leader_price = item.leader_price == -1 ? '' : item.leader_price;
                    if (this.activityData.inner_type == 1) {
                        Object.keys(item.ladder_price).forEach(key => {
                            item[`activity_price${key}`] = item.ladder_price[key];
                        });
                    }
                }
            });
        }
    },
};
</script>

<style scoped lang="scss">
.spell-group-index {
    display: flex;

    .right {
        flex: 1;
        height: calc(100vh - 110px);
        overflow-y: auto;
    }
}

.content {
    padding: 40px;
    background: #fff;
    min-height: 100%;
}
</style>
