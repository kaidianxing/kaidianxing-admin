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
    <div class="refund-record">
        <kdx-header-bar>
            <Form
                ref="form"
                :model="searchData"
                :label-width="100"
                inline
                @submit.native.prevent
            >
                <FormItem label="关键词：">
                    <Input
                        type="text"
                        placeholder="昵称/姓名/手机号/订单号"
                        class="width-340"
                        v-model="searchData.keyword"
                        @on-enter="handleSearch"
                    />
                </FormItem>
                <FormItem label="会员等级：">
                    <Select v-model="searchData.level_id" class="width-160">
                        <Option
                            v-for="(item, index) in levels"
                            :key="index"
                            :value="item.id"
                            >{{ item.level_name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="退款类型：">
                    <Select v-model="searchData.type" class="width-160">
                        <Option
                            v-for="(item, index) in typeList"
                            :key="index"
                            :value="item.key"
                            >{{ item.text }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="退款状态：">
                    <Select v-model="searchData.status" class="width-160">
                        <Option
                            v-for="(item, index) in statusList"
                            :key="index"
                            :value="item.id"
                            >{{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="退款时间：">
                    <DatePicker
                        class="width-340"
                        placeholder="请选择"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm"
                        :confirm="true"
                        v-model="selectDate"
                    ></DatePicker>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                    <Button type="text" @click="handleExport">导出</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="list-wrap" v-loading="loading">
            <Table ref="table" :columns="columns" :data="list"></Table>
            <div class="footer-page">
                <kdx-page-component
                    ref="page"
                    :total="total"
                    @on-change="changePage"
                ></kdx-page-component>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import { formatDate } from "@/assets/helpers/index";
// import { config as settings } from "@/api/config/settings.js";
import {Export} from '@/helpers/export';

export default {
    inject: ["returnToTop"],
    components: {},
    props: {},
    data() {
        return {
            total: 0,
            page: 1,
            pagesize: 10,
            list: [],
            selectDate: ["", ""],
            // 搜索信息
            searchData: {
                start_time: "",
                end_time: "",
                level_id: "all",
                keyword: "",
                export: "",
                type: "all",
                status: "all",
            },
            levels: [], // 用户等级
            typeList: [], // 退款类型列表
            statusList: [
                {
                    id: "all",
                    name: "全部",
                },
                {
                    id: "1",
                    name: "成功",
                },
                { id: "0", name: "失败" },
            ], //退款状态列表
            loading: false,
            columns: [
                {
                    title: "会员",
                    key: "nickname",
                    minWidth: 160,
                    maxWidth: 300,
                    render: (h, params) => {
                        // 用户来源 10: h5;20: 微信公众号;21: 微信小程序;30:头条小程序;31:抖音小程序;5:支付宝小程序;
                        let component;
                        if (params.row.source == "20") {
                            // 公众号
                            component = (
                                <span class="iconfont icon-weixin icon"></span>
                            );
                        } else if (params.row.source == "21") {
                            // 微信小程序
                            component = (
                                <span class="iconfont icon-weixinxiaochengxu icon"></span>
                            );
                        } else if (params.row.source == "30") {
                            // 头条小程序 字节跳动小程序
                            component = (
                                <kdx-svg-icon
                                    class="iconfont"
                                    type="icon-qudao-toutiao2"
                                ></kdx-svg-icon>
                            );
                        } else if (params.row.source == "32") {
                            // 头条小程序 字节跳动小程序
                            component = (
                                <kdx-svg-icon
                                    class="iconfont"
                                    type="icon-qudao-toutiaojisuban"
                                ></kdx-svg-icon>
                            );
                        } else if (params.row.source == "31") {
                            // 抖音小程序 字节跳动小程序
                            component = (
                                <kdx-svg-icon
                                    class="iconfont"
                                    type="icon-douyin"
                                ></kdx-svg-icon>
                            );
                        }
                        // else if (params.row.source == '5') {
                        //     // 支付宝小程序
                        //     component = (
                        //         <span class="iconfont icon-zhifubaoxiaochengxu icon"></span>
                        //     );
                        // }
                        else if (params.row.source == "10") {
                            // h5
                            component = (
                                <span class="iconfont icon-H icon"></span>
                            );
                        }
                        else if (params.row.source == '70') {
                            // h5
                            component = (
                                <span style="color:#12aa9c;font-size:16px" class="iconfont icon-PCduan"></span>
                            )
                        }
                        // 百度小程序
                        // <span v-if="list.create_from === '0'" class="iconfont icon-baiduxiaochengxu icon"></span>
                        return (
                            <div class="vip">
                                <div class="vip-image">
                                    <img
                                        src={this.$media(params.row.avatar)}
                                        onError={(e) => {
                                            this.replaceImage(e, "avatar");
                                        }}
                                    />
                                </div>
                                <div class="vip-content">
                                    <div
                                        class="vip-name"
                                        onClick={() => {
                                            this.jumpVip(params.row.member_id);
                                        }}
                                    >
                                        {params.row.nickname || "-"}
                                    </div>
                                    <div class="vip-platform">{component}</div>
                                </div>
                            </div>
                        );
                    },
                },
                {
                    title: "会员等级",
                    key: "level_name",
                    minWidth: 120,
                    maxWidth: 200,
                    render: (h, params) => {
                        if (params.row[params.column.key]) {
                            return (
                                <div class="vip-grade">
                                    <div class="icon">
                                        {params.row.is_default == "1" ? (
                                            ""
                                        ) : (
                                            <kdx-svg-icon type="icon-huiyuan-bg"></kdx-svg-icon>
                                        )}
                                    </div>
                                    <div class="text">
                                        {params.row[params.column.key]}
                                    </div>
                                </div>
                            );
                        } else {
                            return <div>普通会员</div>;
                        }
                    },
                },
                {
                    title: "退款类型",
                    key: "type_text",
                    minWidth: 120
                },
                {
                    title: "退款金额",
                    key: "money",
                    minWidth: 120,
                },
                {
                    title: "退款时间",
                    key: "created_at",
                    minWidth: 120,
                },
                {
                    title: "退款商品订单号",
                    key: "order_no",
                    minWidth: 150,
                },
                {
                    title: "状态",
                    key: "status",
                    minWidth: 100,
                    maxWidth: 150,
                    render: (h, params) => {
                        let type =params.row.status == "1" ?'success': 'danger';
                        return (
                            <kdx-status-text type={type}>{params.row.status_text}</kdx-status-text>
                        );

                    },
                },
                {
                    title: "操作",
                    key: "action",
                    minWidth: 100,
                    maxWidth: 170,
                    render: (h, params) => {
                        return <div>
                        <Button
                            type="text"
                            onClick={() => {
                                this.jumpOrder(params.row);
                            }}
                        >
                            查看订单
                        </Button>
                        <Button
                            class="member-btn"
                            type="text"
                            onClick={() => {
                                this.jumpMember(params.row);
                            }}
                        >
                            查看会员
                        </Button></div>;
                    },
                },
            ],
        };
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("finance.recharge.manage");
        },
    },
    watch: {
        selectDate: {
            handler(value) {
                this.searchData.start_time =
                    value[0] === ""
                        ? ""
                        : formatDate(new Date(value[0]), "yyyy-MM-dd hh:mm:ss");
                this.searchData.end_time =
                    value[1] === ""
                        ? ""
                        : formatDate(new Date(value[1]), "yyyy-MM-dd hh:mm:ss");
            },
            deep: true,
            immediate: true,
        },
    },
    created() {
        this.getMemberLevel();
        this.getSearch();
        this.getRefundList();
    },
    methods: {
        getSearch() {
            this.$api.financeApi.getRefundType().then((res) => {
                if (res.error == 0) {
                    res.data.unshift({
                        key: "all",
                        text: "全部",
                    });
                    this.typeList = res.data;
                }
            });
        },
        getMemberLevel() {
            this.$api.memberApi.getLevelList({ isall: 1 }).then((res) => {
                if (res.error === 0) {
                    res.list.unshift({
                        id: "all",
                        level_name: "全部",
                    });
                    this.levels = res.list;
                }
            });
        },
        // 退款记录列表
        getRefundList() {
            this.returnToTop();
            let keys = ["level_id", "type", "status"];
            let _params = {
                ...this.searchData,
                page: this.page,
                pagesize: this.pagesize,
            };

            keys.forEach((key) => {
                _params[key] =
                    this.searchData[key] == "all" ? "" : this.searchData[key];
            });

            this.loading = true;
            this.$api.financeApi.getRefundList(_params).then((res) => {
                if (res.error == 0) {
                    this.loading = false;
                    this.total = res.total;
                    this.list = [...res.list];
                }
            });
        },
        // 点击搜索按钮
        handleSearch() {
            this.page = 1;
            this.pagesize = 10;
            this.$refs["page"].reset();
            this.getRefundList();
        },
        // 点击重置按钮
        handleReset() {
            this.searchData = {
                start_time: "",
                end_time: "",
                level_id: "all",
                keyword: "",
                export: "",
                status: "all",
                type: "all",
            };
            this.selectDate = ["",""];
            this.page = 1;
            this.pagesize = 10;
            this.$refs["page"].reset();
            this.getRefundList();
        },
        // 点击导出按钮
        handleExport() {
            // const base_url = settings.base_url;
            let level_id = this.searchData.level_id === "all" ? "" : this.searchData.level_id;
            let type = this.searchData.type === "all" ? "" : this.searchData.type;
            let status = this.searchData.status === "all" ? "" : this.searchData.status;
            let keyword = this.searchData.keyword;
            // let page = this.page;
            // let pagesize = this.pagesize;
            let params = {
                type,
                status,
                level_id,
                keyword,
                export: 1
            }
            // let downloadurl = `${base_url}manage/finance/refund-log/list&type=${type}&status=${status}&level_id=${level_id}&keyword=${keyword}&page=${page}&pagesize=${pagesize}&export=1`;
            if (this.searchData.startTime) {
                // downloadurl = `${downloadurl}&created_at[0]=${this.searchData.start_time}`;
                params.created_at[0] = this.searchData.startTime;
            }
            if (this.searchData.end_time) {
                // downloadurl = `${downloadurl}&created_at[1]=${this.searchData.ent_time}`;
                params.created_at[1] = this.searchData.end_time;
            }

            Export('manage/finance/refund-log/list', params)
        },
        // 切换页码
        changePage(page) {
            this.page = page.pageNumber;
            this.pagesize = page.pageSize;
            this.getRefundList();
        },
        // 跳转会员详情
        jumpVip(id) {
            this.$utils.openNewWindowPage("/member/detail", { id: id });
        },
        // 查看订单
        jumpOrder(data) {
            this.$utils.openNewWindowPage('/order/detail/close', {id: data.order_id})
            // this.$router.push({
            //     path: '/order/detail/close',
            //     query: {
            //         id: data.order_id
            //     }
            // })
        },
        jumpMember(data){
            this.$utils.openNewWindowPage('/member/detail', {id: data.member_id})
            // this.$router.push({
            //     path: '/member/detail',
            //     query: {
            //         id: data.member_id
            //     }
            // })
        }
    },
};
</script>

<style lang="scss" scoped>
.refund-record {
    background-color: #f4f6f8;
    margin: 20px auto;
}

.list-wrap {
    padding: 0 20px;
    background: #fff;
    position: relative;

    .money {
        @include font-14-20-bold;
    }

    /deep/ .ivu-table {
        // 会员
        .vip {
            display: flex;
            flex-wrap: nowrap;

            > .vip-image {
                display: flex;
                align-items: center;

                > img {
                    border: 1px solid $border-color;
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                }
            }

            > .vip-content {
                padding-left: 10px;

                > .vip-name {
                    width: 100%;
                    padding-bottom: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: $brand-color;
                    cursor: pointer;
                }

                > .vip-platform {
                    > .icon {
                        font-size: 18px;
                        margin-right: 10px;
                        vertical-align: middle;
                    }

                    .icon-weixin {
                        color: $success-color;
                    }

                    .icon-weixinxiaochengxu {
                        color: #677de0;
                    }

                    .icon-toutiaoxiaochengxu {
                        color: #239bff;
                    }

                    .icon-zhifubaoxiaochengxu {
                        color: #2094e7;
                    }

                    .icon-baiduxiaochengxu {
                        color: #306cff;
                    }

                    .icon-H {
                        color: #ff6004;
                    }
                }
            }
        }

        // 会员等级
        .vip-grade {
            display: flex;
            flex-wrap: nowrap;

            .icon {
                flex-shrink: 0;

                .svg-icon {
                    font-size: 20px;
                    padding-right: 4px;
                    vertical-align: bottom;
                }
            }

            .text {
                width: 0;
                flex: 1;
            }
        }

        // 充值方式
        .pay-type-text {
            .icon {
                font-size: 20px;
                padding-right: 2px;
                vertical-align: middle;
            }

            .text {
            }

            .icon-wechatpay {
                color: #00ac1c;
            }

            .icon-alipay {
                color: #00a0ee;
            }

            .icon-zhifu-houtaizhifu {
                color: $warning-color;
            }
        }

        // 会员等级
        .vip-grade {
            .text {
                padding-left: 4px;
                vertical-align: text-bottom;
            }
        }
    }
}

.ivu-form .ivu-form-item {
    margin-bottom: 0;

    &:nth-child(4) {
        margin-right: 20px;
    }
}

/deep/ .member-btn {
    margin-left: 10px;
}

.footer-page {
    background: #fff;
}
</style>
