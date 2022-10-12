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
    <div class="flex article-add-wrap">
        <Preview :p_model="{...baseInfo, ...editorData, ...ruleSettings}" />
        <div class="right">
            <kdx-content-bar ref="content_bar" class="content-bar-right" :loading="loading">
                <Tabs v-model="value" :animated="false" name="article" style="background:#fff;min-height: 100%" @on-click="tabClick">
                    <TabPane :label="tab.baseInfo" name="baseInfo">
                        <keep-alive>
                            <!-- 基础信息 -->
                            <base-info ref="baseInfo" v-model="baseInfo" :disabled="disabled" :addressData="addressData" :id="id" class="detail-item"></base-info>
                        </keep-alive>
                    </TabPane>
                    <TabPane :label="tab.editorData" name="editorData">
                        <keep-alive>
                            <!-- 文章编辑 -->
                            <editor-data ref="editorData" v-model="editorData" :id="id" class="detail-item"></editor-data>
                        </keep-alive>
                    </TabPane>
                    <TabPane :label="tab.ruleSettings" name="ruleSettings">
                        <keep-alive>
                            <!-- 奖励规则 -->
                            <rule-settings ref="ruleSettings" v-model="ruleSettings" :id="id" :selectedMemberList="selectedMemberList" class="detail-item"></rule-settings>
                        </keep-alive>
                    </TabPane>
                </Tabs>
                <template #btn>
                    <Button v-show="value !== 'ruleSettings'" class="primary-long" @click="handleNextStep">下一步</Button>
                    <Button :disabled="noManagePerm" :class="`${value!=='ruleSettings'?'default-long':'primary-long'}`" @click="handleSave" :loading="submitLoading">保存</Button>
                </template>
            </kdx-content-bar>
        </div>
    </div>
</template>

<script>
import Preview from "./components/Preview";
import BaseInfo from "./components/BaseInfo";
import EditorData from "./components/EditorData";
import RuleSettings from "./components/RuleSettings";
export default {
    name: "articleDetail",
    components: { 
        Preview, 
        BaseInfo, 
        EditorData,
        RuleSettings,
    },
    props: {},
    computed: {
        noManagePerm(){
            return !this.$getPermMap('article.article.manage')
        },
        tab() {
            return {
                baseInfo: () => {
                    let icon;
                    if (this.validateTab.indexOf("baseInfo") > -1) {
                        icon = <span class="iconfont icon-tishi-prompt"></span>;
                    }
                    return (
                        <div>
                            <span>基本信息</span>
                            {icon}
                        </div>
                    );
                },
                editorData: () => {
                    let icon;
                    if (this.validateTab.indexOf("editorData") > -1) {
                        icon = <span class="iconfont icon-tishi-prompt"></span>;
                    }
                    return (
                        <div>
                            <span>文章编辑</span>
                            {icon}
                        </div>
                    );
                },
                ruleSettings: () => {
                    let icon;
                    if (this.validateTab.indexOf("ruleSettings") > -1) {
                        icon = <span class="iconfont icon-tishi-prompt"></span>;
                    }
                    return (
                        <div>
                            <span>奖励规则</span>
                            {icon}
                        </div>
                    );
                },
            };
        },
        addressData() {
            return this.$store.state.config.address;
        },
    },
    data() {
        return {
            loading: false, //保存时loading
            submitLoading: false,
            disabled: false,
            id: "", // 文章id
            activity_id: "", // 活动文章id
            value: "baseInfo", //校验的地方
            validateTab: [], //校验tab切换问题
            tabDefault: ['baseInfo'], //默认校验的tab
            baseInfo: {
                type: "0",
                title: "",
                activity_start_time :"",
                activity_end_time :"",
                sign_start_time :"",
                sign_end_time :"",
                telephone: "",
                selectedAddress: [],
                detail: "",
                lng: "",
                lat: "",
                check_mobile: "0",
                check_form: '0',
                form_id: '',
                form_name: '',
                cover: [],
                digest: "",
                group_id: "",
                author: "",
                display_order: "",
            },
            editorData: {
                top_thumb_type: "0",
                top_thumb: "",
                top_thumb_all: [],
                content: {},
                content_origin: "",
                goods_ids: [],
                coupon_ids: [],
            },
            ruleSettings: {
                read_number_status: "1",
                read_number_init: "",
                read_number_step: "",
                thumps_up_status: "1",
                thumps_up_number_init: "",
                member_level_limit_type: "0",
                member_level_limit_ids: [],
                member_level_limit_list: [],
                commission_level_limit_type: "0",
                commission_level_limit_ids: [],
                reward_type: "0",
                reward_rule: {},
                creditOnce: "",
                creditMax: "",
                balanceOnce: "",
                balanceMax: "",
                status: "1",
                coupon: [],
                rule_coupon_ids: "",
            },
            selectedMemberList: {
                levelList: [], // 等级
                labelList: [], // 标签
            },
        }
    },
    created() {
        this.validateTab = []
        this.$store.dispatch('config/getAddress')
    },
    mounted() {
        let { id, data, type } = this.$route.query;
        this.id = id;
        if(this.id) {
            this.disabled = true;
        }
        if(type) {
            this.baseInfo.type = type;
        }
        this.baseInfo.title = data?.title || "";
        this.baseInfo.author = data?.author || "";
        this.baseInfo.digest = data?.digest || "";
        // this.baseInfo.cover = data?.cover;
        this.editorData.content_origin = data?.content || "";
        if (this.id) {
            this.getArticleDetail();
        }
    },
    methods: {
        // 获取文章详情
        getArticleDetail() {
            this.loading = true;
            this.$api.articleApi.getArticleDetail({
                article_id: this.id,
            }).then((res) => {
                this.loading = false;
                if (res.error == 0) {
                    // 兼容老数据
                    res.data.cover = res.data.cover.split(",");
                    res.data = {
                        ...res.data,
                        ...res.data?.activity
                    }
                    if(!res.data.top_thumb_all) {
                        res.data.top_thumb_all = [];
                    }
                    for(let key in this.baseInfo) {
                        let obj = {};
                        obj[key] = res.data[key];
                        Object.assign(this.baseInfo, obj);
                    }
                    if (res.data.province && res.data.city && res.data.area) {
                        let arr = [res.data.province, res.data.city, res.data.area]
                        this.baseInfo.selectedAddress = [...arr]
                    } else {
                        this.baseInfo.selectedAddress = []
                    }
                    for(let key in this.editorData) {
                        let obj = {};
                        obj[key] = res.data[key];
                        Object.assign(this.editorData, obj);
                    }
                    for(let key in this.ruleSettings) {
                        let obj = {};
                        obj[key] = res.data[key];
                        Object.assign(this.ruleSettings, obj);
                    }
                    if(res.data.group_id === "0") {
                        this.baseInfo.group_id = "";
                    }
                    if(!this.baseInfo?.type) {
                        this.baseInfo.type = '0';
                    }
                    if(this.baseInfo?.type == '1') {
                        this.activity_id = res.data?.activity.id;
                    }
                    this.ruleSettings.creditOnce = res.data.reward_rule?.credit?.once;
                    this.ruleSettings.creditMax = res.data.reward_rule?.credit?.max;
                    this.ruleSettings.balanceOnce = res.data.reward_rule?.balance?.once;
                    this.ruleSettings.balanceMax = res.data.reward_rule?.balance?.max;
                    this.ruleSettings.coupon = res.data.reward_rule?.coupon?.coupon || [];
                    this.ruleSettings.rule_coupon_ids = res.data.reward_rule?.coupon?.coupon_id || "";
                    this.editorData.top_thumb_all = JSON.parse(this.editorData.top_thumb_all);
                    this.ruleSettings.member_level_limit_list = JSON.parse(this.ruleSettings.member_level_limit_list);
                    this.$refs.editorData.handleChange()
                    if (this.ruleSettings.member_level_limit_type === '1') {
                        this.selectedMemberList.levelList = [...this.ruleSettings.member_level_limit_list]
                    } else if (this.ruleSettings.member_level_limit_type === '2') {
                        this.selectedMemberList.labelList = [...this.ruleSettings.member_level_limit_list]
                    }
                }
            });
        },
        tabClick() {
            this.validateArticle();
        },
        // 点击下一步出现校验必填
        handleNextStep() {
            this.$refs['content_bar']?.returnToTop();
            switch (this.value) {
                case "baseInfo":
                    this.value = "editorData";
                    break;
                case "editorData":
                    this.value = "ruleSettings";
                    break;
            }
            // 添加必填提醒
            this.validateArticle(true);
        },
        handleSave() {
            this.submitLoading = true;
            this.validateArticle(true,'save').then(valid => {
                // 校验通过
                if (valid) {
                    this.submit()
                }
            })
        },
        /*
        * 各tab校验及点击下一步跳转
        * isJump true表示必填项必须全部填写方可跳转下一步 false可以直接跳转
        * source 表示保存按钮点击时 校验全部tab下的选项
        * */
        validateArticle(isJump,source) {
            return new Promise((resolve) => {
                let validateFn = [this.$refs.baseInfo.validateForm()],
                    validateType = [],
                    tabName = ['baseInfo', 'editorData', 'ruleSettings'];
                if(this.tabDefault.indexOf('editorData')>-1) {
                    validateFn.push(this.$refs.editorData.validateForm())
                }
                if(this.tabDefault.indexOf('ruleSettings')>-1) {
                    validateFn.push(this.$refs.ruleSettings.validateForm())
                }
                if(source=='save') {
                    validateFn = [this.$refs.baseInfo.validateForm(),this.$refs.editorData.validateForm(),this.$refs.ruleSettings.validateForm()];
                }
                this.tabDefault.indexOf(this.value)>-1 ? '' : this.tabDefault.push(this.value);
                Promise.all(validateFn).then(result => {
                    result.forEach((res, index)=> {
                        if (!res) {
                            validateType.push(tabName[index]);
                        }
                    });
                    console.log(validateType, 88)
                    this.validateTab = validateType;
                    if (validateType?.length) {
                        isJump && (this.value = validateType[0]);
                        if (isJump) {
                            this.value = validateType[0];
                        }
                        this.submitLoading = false;
                        resolve(false)
                    } else {
                        resolve(true);
                    }
                }).catch(error => {
                    this.submitLoading = false;
                    if (isJump) {
                        this.value = error
                    }
                })
            })
        },
        submit() {
            let params = this.formatParams();
            if(this.id) {
                params.article_id = this.id
            }
            console.log(params, "---------params")
            this.$api.articleApi.saveArticle(params).then((res) => {
                if (res.error == 0) {
                    this.$Message.success("操作成功");
                    this.$router.replace({
                        path: "/article/article/list",
                    });
                }
            }).finally(() => {
                this.submitLoading = false;
            });
        },
        formatParams() {
            this.editorData.content_origin = this.$utils.alterVideo(this.editorData.content_origin);
            let params = {
                ...this.baseInfo,
                ...this.editorData,
                ...this.ruleSettings,
            };
            let contentList = this.editorData.content_origin.split(/<!-- article-item-.*? -->/);
            params.content = contentList.map((item) => {
                if(item.indexOf("<!-- goods -->") !== -1) {
                    let id = item.substring(item.indexOf(`data-goods-id="`) + 15, item.indexOf(`" data-goods-id-end`));
                    return {
                        type: "goods",
                        id,
                    }
                }else if(item.indexOf("<!-- coupon -->") !== -1) {
                    let id = item.substring(item.indexOf(`data-coupon-id="`) + 16, item.indexOf(`" data-coupon-id-end`));
                    return {
                        type: "coupon",
                        id,
                    }
                }else {
                    return {
                        type: "text",
                        value: item
                    }
                }
            });
            if(params.read_number_status === "0") {
                params.read = 0;
                params.read_number_step = 0;
            }
            if(params.thumps_up_status === "0") {
                params.thumps_up_number_init = 0;
            }
            if(params.member_level_limit_type === "0") {
                params.member_level_limit_ids = [];
            }
            if(params.commission_level_limit_type === "0") {
                params.commission_level_limit_ids = [];
            }
            if(params.check_form === "0") {
                params.form_id = "0";
                params.form_name = "";
            }
            if(params.download_limit_type === "0") {
                params.download_limit_ids = [];
            }
            if(params.reward_type === "0") {
                params.creditOnce = 0;
                params.creditMax = 0;
                params.balanceOnce = 0;
                params.balanceMax = 0;
            }else if(params.reward_type === "1") {
                params.balanceOnce = 0;
                params.balanceMax = 0;
            }else if(params.reward_type === "2") {
                params.creditOnce = 0;
                params.creditMax = 0;
            }
            params.reward_rule = {
                credit: {
                    once: this.ruleSettings.creditOnce || 0,
                    max: this.ruleSettings.creditMax || 0
                },
                balance: {
                    once: this.ruleSettings.balanceOnce || 0,
                    max: this.ruleSettings.balanceMax || 0
                },
                coupon: {
                    coupon_id: this.ruleSettings.rule_coupon_ids,
                    coupon: this.ruleSettings.coupon
                },
            };
            let pItem, cItem, aItem;
            if(params.selectedAddress.length) {
                let [pName, cName, aName] = params.selectedAddress
                for (pItem of this.addressData) {
                    if (pItem.name === pName) {
                        break;
                    }
                }
                for (cItem of pItem.children) {
                    if (cItem.name === cName) {
                        break;
                    }
                }
                for (aItem of cItem.children) {
                    if (aItem.name === aName) {
                        break;
                    }
                }
            }
            if(this.baseInfo.type == 1) {
                params.activity_start_time = this.$utils.formatDate(new Date(params.activity_start_time), 'yyyy-MM-dd hh:mm:ss');
                params.activity_end_time = this.$utils.formatDate(new Date(params.activity_end_time), 'yyyy-MM-dd hh:mm:ss')
                params.sign_start_time = this.$utils.formatDate(new Date(params.sign_start_time), 'yyyy-MM-dd hh:mm:ss')
                params.sign_end_time = this.$utils.formatDate(new Date(params.sign_end_time), 'yyyy-MM-dd hh:mm:ss')
                if(!params.lng) {
                    params.lng = "0"
                }
                if(!params.lat) {
                    params.lat = "0"
                }
                params.activity = {
                    activity_start_time: params.activity_start_time,
                    activity_end_time: params.activity_end_time,
                    sign_start_time: params.sign_start_time,
                    sign_end_time: params.sign_end_time,
                    telephone: params.telephone,
                    detail: params.detail,
                    lng: params.lng,
                    lat: params.lat,
                    check_mobile: params.check_mobile,
                    check_form: params.check_form,
                    form_id: params.form_id,
                    form_name: params.form_name,
                    province: pItem?.label,
                    province_code: pItem?.id,
                    city: cItem?.label,
                    city_code: cItem?.id,
                    area: aItem?.label,
                    area_code: aItem?.id,
                }
                if(this.activity_id) {
                    params.activity.id = this.activity_id
                }
                delete params.activity_start_time;
                delete params.activity_end_time;
                delete params.sign_start_time;
                delete params.sign_end_time;
                delete params.telephone;
                delete params.selectedAddress;
                delete params.detail;
                delete params.lng;
                delete params.lat;
                delete params.check_mobile;
                delete params.check_form;
                delete params.form_id;
                delete params.form_name;
            }
            delete params.coupon;
            delete params.rule_coupon_ids;
            params.cover = params.cover.join(",");
            params.content = JSON.stringify(params.content);
            params.goods_ids = JSON.stringify(params.goods_ids);
            params.coupon_ids = JSON.stringify(params.coupon_ids);
            params.member_level_limit_ids = JSON.stringify(params.member_level_limit_ids);
            params.member_level_limit_list = JSON.stringify(params.member_level_limit_list);
            params.commission_level_limit_ids = JSON.stringify(params.commission_level_limit_ids);
            params.reward_rule = JSON.stringify(params.reward_rule);
            params.display_order = params.display_order || 0;
            params.read_number_init = params.read_number_init || 0;
            params.read_number_step = params.read_number_step === "" ? 1 : params.read_number_step;
            params.thumps_up_number_init = params.thumps_up_number_init || 0;
            params.download_limit_ids = JSON.stringify(params.download_limit_ids);
            params.download_limit_list = JSON.stringify(params.download_limit_list);
            params.top_thumb_all = JSON.stringify(params.top_thumb_all);
            return params;
        }
    },
}
</script>

<style lang="scss" scoped>
.article-add-wrap {
    .right {
        flex: 1;
        height: calc(100vh - 110px);
        overflow-y: auto;
        padding-top: 20px;
        .content-bar-right {
            /deep/ .app-overdue {
                margin-top: 0;
            }
        }
    }
}
.detail-item {
    padding: 0 40px 56px;
}
/deep/ .ivu-tabs-bar {
    margin-bottom: 40px;
    padding: 0 30px;
    .ivu-tabs-tab {
        padding: 12px 30px;
        @include font-18-25-bold;
        .icon-tishi-prompt {
            position: absolute;
            right: 10px;
            color: $danger-color;
            font-size: 18px;
        }
    }
}

/deep/ .ivu-form-item-label {
    padding-right: 10px !important;
}
</style>