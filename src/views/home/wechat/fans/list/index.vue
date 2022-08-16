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
    <div class="fans-list" v-loading="loading">
        <kdx-header-bar type="little">
            <template #header>
                <div class="header-btn">
                    <Button type="primary" :disabled="noManagePerm" @click="syncFans">同步所有粉丝</Button>
                </div>
            </template>
            <Form ref="form" :label-width="100" inline @submit.native.prevent>
                <FormItem label="粉丝信息：">
                    <Input type="text" v-model="search.nickname" placeholder="请输入粉丝名称" @on-enter="handleSearch"
                           class="width-172"></Input>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="resetSearch">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="table-content">
            <ul class="app-content-tab">
                <li
                        :class="{ active: tab === item.id }"
                        v-for="item in tabList"
                        :key="item.id"
                        @click="tabClick(item.id)"
                >
                    {{ item.name }}
                    <div class="active-line"></div>
                </li>
            </ul>
            <div class="sync-time">
                上次同步时间：<span class="time">{{ lastSyncTime || '00-00-00 00:00:00' }}</span>
            </div>
            <table-list ref="table_list" :data="table.list" :total="table.total" :current="page.pageNumber"
                        :loading="table.loading" :page-size="page.pageSize" :tab="tab"
                        @on-change-page="changePage" @on-refresh="handleRefresh" @on-checkbox="changeCheckbox"
            ></table-list>
        </div>
        <!--微信公众号类型错误-->
        <wechat-empty v-if="!isIdentifyService"></wechat-empty>
    </div>
</template>

<script>
import TableList from "./components/TableList";
import WechatEmpty from "@/views/home/wechat/components/WechatEmpty";

export default {
    name: "index",
    components: {
        TableList,
        WechatEmpty
    },
    data() {
        return {
            search: {
                nickname: ''
            },
            tab: '0',
            table: {
                list: [],
                total: 0,
                loading: false
            },
            page: {
                pageSize: 10,
                pageNumber: 1
            },
            tabList: [
                {
                    id: '0',
                    name: '粉丝'
                },
                {
                    id: '1',
                    name: '黑名单'
                }
            ],
            loading: false,
            isIdentifyService: false, // 是否是认证服务号
            lastSyncTime: '', // 上次同步时间
        };
    },
    created() {
        this.$store.dispatch('channel/getWechatInfo').then(({isIdentifyService}) => {
            this.isIdentifyService = isIdentifyService;
            if (isIdentifyService) {
                this.getList();
            }
        })
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("channel.wechat.manage");
        },
    },
    methods: {
        tabClick(tab) {
            this.tab = tab;
            this.handleRefresh();
        },
        syncFans() {
            this.loading = true;
            this.$api.homeApi.syncWechatFans().then(res => {
                if (res.error === 0) {
                    this.getTaskInfo(res.task_id);
                } else {
                    this.loading = false;
                }
            })
        },
        getTaskInfo(task_id) {
            this.$api.homeApi.getTaskInfo({task_id}).then(res => {
                if (res.error === 0) {
                    // 0 进行中 1成功 2失败
                    if (0 === +res.data?.status) {
                        setTimeout(() => {
                            this.getTaskInfo(task_id);
                        }, 3000);
                    } else if (1 === +res.data?.status) {
                        this.$Message.success('同步成功');
                        this.handleRefresh();
                        this.loading = false;
                    } else if (2 === +res.data?.status) {
                        this.$Message.error('同步失败');
                        this.loading = false;
                    } else {
                        this.loading = false;
                    }
                } else {
                    this.loading = false;
                }
            })
        },
        getList() {
            this.table.loading = true;
            let params = {
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                is_black: this.tab === '0' ? 0 : 1,
                ...this.search
            };
            this.$api.homeApi.getWechatFansList(params).then(res => {
                if (res.error === 0) {
                    this.table.list = res.list || [];
                    this.table.total = res.total;
                    this.lastSyncTime = res.last_sync_time || '';
                }
            }).finally(() => {
                this.table.loading = false;
                this.$refs['table_list'].resetChecked();
            });
        },
        handleRefresh() {
            this.resetPage();
            this.getList();
        },
        handleSearch() {
            this.handleRefresh();
        },
        resetSearch() {
            this.search = {
                nickname: ''
            };
            this.handleRefresh();
        },
        changePage(page) {
            this.page = page;
            this.getList();
        },
        resetPage() {
            this.page = {
                pageSize: 10,
                pageNumber: 1
            }
            this.$refs['table_list'].resetPage();
        },
        changeCheckbox(checked) {
            this.table.list.forEach((item, index) => {
                this.$set(this.table.list[index], '_checked', checked)
            })
            // this.table.list = this.table.list.map(item => {
            //     item._checked = checked;
            // })
            console.log('table-list', this.table.list)
        }
    },
};
</script>

<style scoped lang="scss">
.fans-list {
    margin: 20px auto;
    position: relative;
}
.table-content {
    background-color: #ffffff;
}
.app-content-tab {
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;

    > li {
        margin-left: 40px;
        font-size: 18px;
        line-height: 24px;
        font-weight: 600;
        padding: 12px 0;
        cursor: pointer;
        position: relative;

        .active-line {
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 3px;
            background-color: $brand-color;
            display: none;
        }

        &.active {
            color: $brand-color;

            .active-line {
                display: inline-block;
            }
        }
    }
}
.sync-time {
    padding: 20px 20px 10px 20px;
    font-size: 14px;
    @include font-14-20;
    color: $text-second;
    .time {
        @include font-14-20;
        padding-left: 10px; 
        font-weight: bold;
    }
}
</style>
