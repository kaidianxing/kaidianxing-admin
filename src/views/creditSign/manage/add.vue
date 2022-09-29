/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="spell-group-index">
        <preview></preview>
        <div class="right">
            <kdx-content-bar>
                <div class="content">
                    <!-- 基本信息 -->
                    <basic-info ref="basicInfo" :data.sync="basicInfoData" :is-disabled="isDisabled" :type="type" :status="status"></basic-info>
                    <!-- 规则设置 -->
                    <rules-info ref="rulesInfo" :data="basicInfoData" :award_stage.sync="award_stage" :type="type" :status="status"
                                :is-disabled="isDisabled" @handleAdd="handleAdd" @handleDelete="handleDelete"></rules-info>
                    <!-- 规则说明 -->
                    <rule-description :is-disabled="isDisabled" :data.sync="basicInfoData" :ruleDescription.sync= "rule_description" ref="ruleDescription"></rule-description>
                    <!-- 页面设置-->
                    <activity-link :is-disabled="isDisabled" ref="activityLink" :pageSetup.sync ="page_setup" :type="type"></activity-link>
                </div>
                <template #btn>
                    <Button class="primary-long" type="primary" :disabled="isDisabled" :loading="submitLoading"
                            @click="handleSave">保存
                    </Button>
                    <Button class="default-long" to="/creditSign/manage/index">取消</Button>
                </template>
            </kdx-content-bar>
        </div>
    </div>
</template>

<script>
    import preview from "./components/Preview";
    import basicInfo from "./components/BasicInfo";
    import rulesInfo from "./components/RulesInfo";
    import ruleDescription from "./components/RuleDescription";
    import activityLink from "./components/ActivityLink";
    const AWARD = {
        day_reward:'',//日签奖励
        increasing:{
            status: '0',
            integral: '',
            day: ''
        },
        continuity:{
            status: '0',
            info: [
                {
                    showFlag: true,
                    couponSelector: {//优惠卷信息
                        data: [],
                        value: false
                    },
                    day:'',
                    award: {
                        select: ['credit'],
                        coupon: '',
                        credit: '',
                    },
                }
            ]
        },
        supplementary:{
            status:'0',
            num:'',
            consume:''
        }//补签设置
    };

    export default {
        name: "index",
        components: {
            preview,
            basicInfo,
            rulesInfo,
            ruleDescription,
            activityLink
        },
        data() {
            return {
                basicInfoData: {
                    activity_name: '',
                    start_time: '',
                    end_time: '',
                    client_type:[]
                },
                award_stage: JSON.parse(JSON.stringify(AWARD)),
                page_setup: {
                    link_name: "",
                    activity_link: "",
                    activity_title: "",
                    content: "",
                    link_url: "",
                },
                rule_description: {
                    rule:""
                },
                loading: false,
                submitLoading: false,
                id: '', // 活动id
                type: '', // 类型  add/view/edit
                status:'', //进行状态
            };
        },
        created() {
            let {id, type} = this.$route.query;
            this.id = id;
            this.type = type;
            if (this.id) {
                this.getData();
            }
        },
        computed: {
            isDisabled() {
                return this.type === 'view';
            },
        },
        methods: {
            getData() {
                this.$api.creditSignApi.editActivity({id: this.id}).then((res) => {
                    if (res.error == 0) {
                        this.loading = true;
                        let {activity_name, client_type, end_time, start_time, ext_field, status} = res.data
                        res.data.ext_field.continuity.info = res.data.ext_field.continuity.info.map(item=>{
                            item.award.select = item.award.select.split(",")
                            return {
                                ...item
                            }
                        })
                            client_type = client_type.split(',')
                            this.status = status
                            this.award_stage = ext_field
                            this.award_stage.continuity.info = this.award_stage.continuity.info.map(item=>{
                                if(item.coupon_info){
                                    return {
                                        ...item,
                                        showFlag: true,
                                        couponSelector: {
                                            data: item.coupon_info,
                                            value: false
                                        },
                                    }
                                }else {
                                    return {
                                        ...item,
                                        showFlag: true,
                                        couponSelector: {
                                            data: [],
                                            value: false
                                        },
                                    }
                                }

                            })
                            this.rule_description.rule = ext_field.rule_description.rule
                            this.page_setup = ext_field.page_setup
                        if (this.type == 'copy') {
                            this.basicInfoData = {
                                activity_name: `副本-${activity_name}`,
                                start_time: '',
                                end_time: '',
                                client_type
                            };
                            // 截取活动名称前20字符， 防止超出
                            this.basicInfoData.activity_name = this.basicInfoData.activity_name.slice(0, 20)
                            delete res.id;
                            delete res.stop_time;
                            delete res.status;
                            delete res.create_time;
                            delete res.is_delete
                        }else {
                            this.basicInfoData = {
                                activity_name,
                                start_time,
                                end_time,
                                client_type
                            };
                            console.log(this.basicInfoData,"basicInfoData----")
                        }
                    }
                });
            },

            async handleSave() {
                try {
                    await this.$refs.basicInfo.validateForm();
                    await this.$refs.rulesInfo.validateForm();
                    await this.$refs.ruleDescription.validateForm();
                    await this.$refs.activityLink.validateForm();
                    this.handleParams()
                } catch (e) {
                    this.submitLoading = false;
                }
            },

            handleParams() {
                // if(this.status == '1' && this.type == 'edit'){
                //     delete this.basicInfoData.start_time
                // }
                if(this.award_stage.continuity.status == '0'){
                    this.award_stage.continuity.info = AWARD.continuity.info
                }
                if(this.award_stage.increasing.status == '0'){
                    this.award_stage.increasing.integral = ''
                    this.award_stage.increasing.day = ''
                }
                if(this.award_stage.supplementary.status == '0'){
                    this.award_stage.supplementary.num = ''
                    this.award_stage.supplementary.consume = ''
                }
                //处理优惠劵、积分缓存问题
                this.award_stage.continuity.info.forEach(item=>{
                    if(!new Set(item.award.select).has('credit')){
                        item.award.credit = ''
                    }
                    if(!new Set(item.award.select).has('coupon')){
                        item.award.coupon = ''
                    }
                })
                let params = {
                    ...this.basicInfoData,
                    ext_field: JSON.parse(JSON.stringify(this.award_stage))
                };
                params.ext_field.page_setup = this.page_setup
                params.ext_field.rule_description = this.rule_description
                params.ext_field.continuity.info.forEach(item => {
                    delete item.showFlag;
                    delete item.couponSelector;
                    delete item.coupon_info;
                    item.award.select = item.award.select.join(",")
                });
                params.ext_field = JSON.stringify(params.ext_field)
                if(this.id && this.type != 'copy'){
                    params.id = this.id
                    this.editActivity(params)//添加编辑接口
                }else {
                    this.saveActivity(params)
                }
            },
            saveActivity(params) {
                this.submitLoading = true;
                this.$api.creditSignApi.addCreditSign(params).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('保存成功');
                        this.$router.replace({
                            path: '/creditSign/manage/index'
                        });
                    }
                }).finally(() => {
                    this.submitLoading = false;
                });
            },
            editActivity(params) {
                this.submitLoading = true;
                this.$api.creditSignApi.editCreditSign(params).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('修改成功');
                        this.$router.replace({
                            path: '/creditSign/manage/index'
                        });
                    }
                }).finally(() => {
                    this.submitLoading = false;
                });
            },
            handleAdd() {
                if (this.award_stage.continuity.info.length >= 7) {
                    return
                }
                this.award_stage.continuity.info.push(
                        {
                            showFlag: true,
                            couponSelector: {
                                data: [],
                                value: false
                            },
                            day:'',
                            award: {
                                select: ['credit'],
                                coupon: '',
                                credit: '',
                            },
                        }
                )
            },
            handleDelete(index) {
                this.award_stage.continuity.info.splice(index, 1)
            }
        },
    };
</script>

<style scoped lang="scss">
    .spell-group-index {
        display: flex;

        .right {
            flex: 1;
            height: calc(100vh - 130px);
            margin-top: 20px;
            overflow-y: auto;
        }
    }

    .content {
        padding: 40px;
        background: #fff;
        min-height: 100%;
    }
</style>