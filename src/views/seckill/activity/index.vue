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
    <div class="flex activity-add-wrap" v-loading="loading">
        <preview :activityData="basicInfoData" :show_commission="show_commission"></preview>
        <div class="right">
            <kdx-content-bar>
                <div class="content">
                    <!-- 基本信息 -->
                    <basic-info ref="basicInfo" :editabled="editabled" :type="type" v-model="basicInfoData"></basic-info>
                    <!-- 规则设置 -->
                    <rules-info ref="rulesInfo" @is_commission="radio_commission" :type="type" :basic-info="basicInfoData" :activityData.sync="activityData.rules"></rules-info>
                </div>
                <template #btn>
                    <Button class="primary-long" :disabled="disabled" type="primary" :loading="submitLoading"  @click="handleSave">保存</Button>
                    <Button class="default-long" to="/seckill/activity/list">取消</Button>
                </template>
            </kdx-content-bar>
        </div>
    </div>
</template>

<script>
    import preview from "./components/index/Preview";
    import basicInfo from './components/index/BasicInfo';
    import rulesInfo from  './components/index/RulesInfo'

    export default {
        components: { preview, basicInfo, rulesInfo },
        data() {
            return {
                activityData: {
                    rules: {
                        is_commission: '0', // 是否参与分销
                        limit_type: '0',
                        limit_num: '0',
                        is_preheat: '0',
                        preheat_time: '',
                    },
                },
                basicInfoData: {
                    title: '活动名称1',
                    client_type: [],
                    // activity_time: [], // 活动期限
                    start_time: '',
                    end_time: '',
                    goods_list: [], // 
                    goods_info: [], // 商品规则
                },
                loading: false,
                submitLoading: false,
                id: '', // 活动id
                type: '', // 类型  add/view/edit
                status: '',// 活动状态
                show_commission: '0',
            }
        },
        computed: {
            editabled(){
                return  (this.status =='0' ||this.status =='1') && this.type=='edit' || this.type == 'view'
            },
            disabled(){
                return (this.id && !this.editabled)
            }
        },
        created() {
            let { id, type } = this.$route.query;
            this.id = id;
            this.type = type;
            if (this.id) {
                this.getSeckillDetail()
            }
        },
        methods: {
            getSeckillDetail() {
                this.loading = true;
                this.$api.seckillApi.getSeckillDetail({id: this.id}).then((res) => {
                    this.loading = false;
                    if (res.error === 0) {
                        res.data.client_type = res.data?.client_type.split(',');
                        let {rules,title,client_type,goods_info,start_time,end_time,preheat_time,is_preheat,status} = res.data;
                        if(preheat_time == '0000-00-00 00:00:00') {
                            preheat_time = ''
                        }
                        this.activityData = {
                            rules: {
                                ...rules,
                                preheat_time,is_preheat,
                                limit_num1: rules.limit_type=='1'?rules.limit_num: null,
                                limit_num2: rules.limit_type=='2'?rules.limit_num: null,
                            }
                        };
                        this.status = status
                        this.basicInfoData = {
                            title: title,
                            client_type: client_type,
                            goods_list: goods_info,
                            // activity_time: [start_time,end_time],
                            start_time,end_time,
                            status
                        };
                    }
                })
            },
            async handleSave() {
                this.submitLoading = true;

                try {
                    this.basicInfoData.goods_info = await this.$refs.basicInfo.validateForm();
                    await this.$refs.rulesInfo.validateForm();
                    if(!this.id){
                        this.formatParams();
                    } else {
                        this.submieEdit()
                    }
                    
                } catch (e) {
                    this.submitLoading = false;
                }
            },
            submit(params) {
                this.$api.seckillApi.addSeckillActivity(params).then((res) => {
                    this.submitLoading = false;
                    if (res.error == 0) {
                        this.$Message.success('保存成功');
                        this.$router.replace({
                            path: '/seckill/activity/list'
                        })
                    }
                })
            },
            // 修改活动
            async  submieEdit(){
                this.submitLoading = true;
                try {
                    await this.$refs.rulesInfo.validateForm();
                    let {preheat_time,is_preheat} = this.activityData.rules;
                    let {end_time} = this.basicInfoData
                    let params = {
                        id: this.id,
                        is_preheat,
                        end_time
                    }
                    if(is_preheat=='1'){
                        params.preheat_time = preheat_time
                    }

                    this.$api.seckillApi.editSeckillActivity(params).then(res=>{
                        if (res.error == 0) {
                            this.$Message.success('保存成功');
                            this.$router.replace({
                                path: '/seckill/activity/list'
                            })
                        }
                    }).finally(()=> {
                        this.submitLoading = false;
                    })
                    } catch (error) {
                        console.log(error)
                        this.submitLoading = false;
                    }
               
            },
            formatParams() {
                let {start_time,end_time,goods_info,client_type,title} = this.basicInfoData 
                let {limit_num1,limit_num2,is_preheat,preheat_time,...info} = this.activityData.rules;
                let params = {
                    start_time,end_time,title,
                    is_preheat,
                    rules: {...info},
                    goods_info: JSON.stringify(goods_info),
                    client_type: client_type.join(','),
                };

                if(is_preheat=='1'){
                    params.preheat_time = preheat_time;
                }

                switch (params.rules.limit_type) {
                    case '0':
                        break;
                    case '1':
                        params.rules.limit_num = limit_num1;
                        break;
                    default:
                        params.rules.limit_num = limit_num2
                        break;
                }
                
                // 取出参加活动的商品id
                let goods_ids = goods_info.map(item=>item.goods_id).join(',');
                // 取出参与活动的商品规格id
                let option_arr =[]
                goods_info.forEach(item=> {
                    if(item.rules) {
                        item.rules?.forEach(item1=> {
                            if(item1.is_join=='1') {
                                option_arr.push(item1.option_id)
                            }
                        })
                    }
                    
                })
                let option_ids = option_arr.join(',')
                params = {...params,goods_ids,option_ids}
                this.submit(params)
            },
            radio_commission(data) {
                this.show_commission = data
            }
        },
    }
</script>

<style scoped lang="scss">
    .activity-add-wrap {
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