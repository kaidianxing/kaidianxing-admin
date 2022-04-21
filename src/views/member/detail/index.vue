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
    <div>
        <kdx-content-bar>
            <div class="vip-detail" v-loading="loading">
                <Alert type="warning" v-if="memberData.member.is_black == 1">
                    <i class="iconfont icon-huiyuan-heimingdan"></i>
                    提示：该会员已被加入至黑名单
                </Alert>
                <Alert type="error" v-if="memberData.member.is_deleted == 1">
                    <i class="iconfont icon-huiyuan-shanchu"></i>
                    提示：该会员已被删除
                </Alert>

                <div
                    class="block"
                    v-if="
					memberData.member.is_black == 1 ||
						memberData.member.is_deleted == 1
				"
                ></div>

                <TopInfo :memberData="memberData" @getDetail="getDetail"></TopInfo>
                <Tabs
                    style="margin-top:10px;background-color:#fff;"
                    v-model="tab.name"
                    :animated="false"
                    name="floor1"
                >
                    <TabPane label="基本信息" name="base">
                        <detail-base
                            :memberData="memberData"
                            :levels="levels"
                            :groups="groups"
                            :form="form"
                            @getDetail="getDetail"
                        ></detail-base>
                    </TabPane>
                    <TabPane
                        label="分销商信息"
                        name="commission"
                        v-if="memberData.member.is_deleted != 1">
                        <commission-info
                            @reload="getDetail"
                            :info="commissionInfo"
                            :basicInfo="memberData"
                            :form="commissionForm"
                        ></commission-info>
                    </TabPane>
                </Tabs>
            </div>
        </kdx-content-bar>
        <div class="footer-btn" v-if="memberData.member && memberData.member.is_deleted != 1">
            <Button
                class="default-error-padding100 black"
                :disabled="noManagePerm"
                @click="changeBlackStatus"
            >{{ memberData.member.is_black == 1 ? "移除黑名单" : "加入黑名单" }}
            </Button
            >
            <Button
                class="default-error-padding100"
                :disabled="noManagePerm"
                @click="deleteVip"
            >删除会员
            </Button
            >
        </div>
    </div>
</template>

<script>
import DetailBase from "./base/index";
import TopInfo from "./base/TopInfo";
import CommissionInfo from "./commission/index";
import {mapActions} from "vuex";

export default {
    name: "index",
    components: {
        DetailBase,
        CommissionInfo,
        TopInfo,
    },
    data() {
        return {
            tab: {
                name: "base",
            },
            id: "", // 会员id
			form_id: '', // 表单id
            memberData: {
                member: {
                    is_black: 0,
                },
            },
            commissionInfo: {}, //分销商信息
            groups: [], // 标签组列表
            levels: [], // 会员组列表
            loading: true,
            form: {}, // 表单信息
            commissionForm: {},
        };
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("member.list.manage");
        },

    },
    created() {
        // 获取分销设置
        this.getSettings();
    },
    mounted() {
        this.id = this.$route.query.id;
        let type = this.$route.query?.type;
		this.form_id = this.$route.query?.form_id || '';
        if (type) {
            this.tab.name = type;
        }
        this.getDetail();
    },
    methods: {
        ...mapActions('commission/settings', ["getSettings"]),
        getDetail() {
            this.loading = true;
			let obj = {
				id: this.id
			}
			if (this.form_id) {
				obj.form_id = this.form_id
			}
            this.$api.memberApi
				.getMemberDetail(obj)
                .then(res => {
                    this.loading = false;
                    if (res.error == 0) {
                        let {member, order_info} = res;
                        this.memberData = {
                            member,
                            order_info,
                        };

                        let {form, ...commission_info} = res.commission_info;
                        this.commissionInfo = commission_info;
                        this.commissionForm = {
                            id: form?.id,
                            content: form?.content
                                ? JSON.parse(form.content)
                                : "",
                        };
                        this.groups = res.groups;
                        this.levels = res.levels;
                        this.form = {
                            id: res.form?.id,
                            content: res.form?.content
                                ? JSON.parse(res.form.content)
                                : "",
                        };
                    }
                });
        },
        // 修改黑名单状态
        changeBlackStatus() {
            console.log(this.memberData.member?.is_black, "this.user.is_black");
            let obj = {
                    id: this.memberData.member.id,
                    is_black: this.memberData.member?.is_black == 1 ? "0" : "1",
                },
                message =
                    this.memberData.member?.is_black == 1
                        ? "移出黑名单成功"
                        : "加入黑名单成功";
            this.$Modal.confirm({
                title: "提示",
                render: () => {
                    if (this.memberData.member?.is_black == 1) {
                        return (
                            <div>
                                <p>
                                    您确认要把“
                                    <span class="danger-color">
										{this.memberData.member?.nickname ||
                                        this.memberData.member?.mobile ||
                                        "-"}
									</span>
                                    ”移出黑名单吗？
                                </p>
                            </div>
                        );
                    } else {
                        return (
                            <div>
                                <p>
                                    您确认要把“
                                    <span class="danger-color">
										{this.memberData.member?.nickname ||
                                        this.memberData.member?.mobile ||
                                        "-"}
									</span>
                                    ”加入黑名单吗？
                                </p>
                                <p class="danger-color">
                                    拉黑后，该账号将无法访问店铺
                                </p>
                            </div>
                        );
                    }
                },
                onOk: () => {
                    this.$api.memberApi.setMemberBlackStatus(obj).then(res => {
                        if (res.error == 0) {
                            this.getDetail();
                            this.$Message.success(message);
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                },
                onCancel: () => {
                },
            });
        },
        deleteVip() {
            this.$Modal.confirm({
                title: "提示",
                content:
                    '<p class="danger-color">是否要删除该用户？如果删除该用户所有信息也将会被删除。删除后不可找回。</p>',
                onOk: () => {
                    this.bus.$emit("passwordModal", true);
                },
                onCancel: () => {
                    this.bus.$emit("passwordModal", false);
                },
            });
        },

    },
};
</script>

<style scoped lang="scss">
.vip-detail {
    box-sizing: border-box;
    min-height: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;

    .contentWrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    /deep/ .ivu-tabs {
        flex: 1;
        display: flex;
        flex-direction: column;

        /deep/ .ivu-tabs-content {
            flex: 1;
            display: flex;
            flex-direction: column;

            /deep/ .ivu-tabs-tabpane {
                flex: 1;
                display: flex;
                flex-direction: column;

                /deep/ .vip-detail-base {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
            }
        }
    }

    /deep/ .ivu-tabs-bar {
        margin-bottom: 40px;
        padding: 0 30px;

        .ivu-tabs-tab {
            padding: 12px 30px;
            @include font-18-25-bold;
        }
    }

    .block {
        height: 10px;
        background-color: $background-color;
    }

    .ivu-alert {
        margin-bottom: 0;
        padding: 10px 48px 10px 16px;
        line-height: 20px;
        color: $text-first;
        font-weight: 700;
        border-radius: 2px;

        .icon-huiyuan-heimingdan {
            color: $danger-color;
        }
    }

    .ivu-alert-error {
        background-color: $danger-light;
        border: 1px solid #ffcdd0;

        .icon-huiyuan-shanchu {
            color: $danger-color;
        }
    }

    /deep/ .ivu-tabs {
        position: inherit;
    }

    .ivu-tabs-tabpane {
        /*height: inherit;*/
    }

}

.footer-btn {
    position: fixed;
    bottom: 0;
    width: calc(100% - 160px);
    padding: 16px 0;
    text-align: center;
    border-top: 1px solid $border-color;
    background: #fff;

    .black {
        padding: 6px 100px;
        margin-right: 16px;
        background: linear-gradient(90deg, #4a505c 0%, #45525f 100%),
        #ff9900;
        color: #fff;
        border: 0;
    }
}


/deep/ .content-bar {
    padding-bottom: 65px;
}

</style>
