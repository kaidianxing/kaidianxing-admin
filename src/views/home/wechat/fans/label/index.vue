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
    <div class="fans-label" v-loading="loading">
        <kdx-header-bar type="little">
            <template #header>
                <div class="header-btn">
                    <Button :disabled="noManagePerm" type="primary" @click="createFans">+创建粉丝标签</Button>
                    <Button :disabled="noManagePerm" class="primary-border marginL-10" @click="syncFans">同步粉丝标签</Button>
                </div>
            </template>
            <Form ref="form" :label-width="100" inline @submit.native.prevent>
                <FormItem label="标签名称：">
                    <Input type="text" v-model="search.tag_name" placeholder="请输入标签名称" @on-enter="handleSearch"
                           class="width-172"></Input>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="resetSearch">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <table-list ref="table_list" :data="table.data" :total="table.total" :current="page.pageNumber" :page-size="page.pageSize"
                    :loading="table.loading" :last-sync-time="lastSyncTime"
                    @on-action="handleTableAction" @on-change-page="changePage"></table-list>
        <!--创建/修改标签-->
        <label-modal ref="label_modal" :id="table.id" :name="table.name" @on-refresh="handleRefresh"></label-modal>
        <!--微信公众号类型错误-->
        <wechat-empty v-if="!isIdentifyService"></wechat-empty>
    </div>
</template>

<script>
import TableList from "./components/TableList";
import LabelModal from "./components/LabelModal";
import WechatEmpty from "@/views/home/wechat/components/WechatEmpty";

export default {
    name: "index",
    components: {
        TableList,
        LabelModal,
        WechatEmpty,
    },
    data() {
        return {
            search: {
                tag_name: ''
            },
            table: {
                data: [],
                total: 0,
                loading: false,
                id: '',
                name: ''
            },
            page: {
                pageSize: 10,
                pageNumber: 1
            },
            isIdentifyService: false,
            loading: false,
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
        getList() {
            this.table.loading = true;
            let params = {
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                ...this.search
            };
            this.$api.homeApi.getWechatFansLabelList(params).then(res => {
                if (res.error === 0) {
                    this.table.data = res.list || [];
                    this.table.total = res.total || 0;
                    this.lastSyncTime = res.last_sync_time || '';
                }
            }).finally(() => {
                this.table.loading = false;
            });
        },
        createFans() {
            this.table.id = '';
            this.table.name = '';
            this.$nextTick(() => {
                this.$refs['label_modal'].setValue();
            })
        },
        syncFans() {
            this.loading = true;
            this.$api.homeApi.syncWechatFansLabel().then(res => {
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
                        return;
                    } else if (1 === +res.data?.status) {
                        this.$Message.success('同步成功');
                        this.loading = false;
                        this.handleRefresh();
                        return;
                    } else if (2 === +res.data?.status) {
                        this.$Message.error('同步失败');
                        return;
                    }
                }
                this.loading = false;
            })
        },
        handleSearch() {
            this.handleRefresh();
        },
        resetSearch() {
            this.search = {
                tag_name: ''
            };
            this.handleRefresh();
        },
        handleRefresh() {
            this.resetPage();
            this.getList();
        },
        handleTableAction(row, type) {
            switch (type) {
                case 'edit':
                    this.table.name = row.tag_name;
                    this.table.id = row.wechat_tag_id;
                    this.$nextTick(() => {
                        this.$refs['label_modal'].setValue();
                    });
                    break;
                case 'delete':
                    this.deleteLabel(row);
                    break;
            }
        },
        deleteLabel(row) {
            console.log('delete', row)
            this.$api.homeApi.deleteWechatFansLabel({wechat_tag_id: row.wechat_tag_id}).then(res => {
                if (res.error === 0) {
                    this.$Message.success('粉丝标签删除成功');
                    this.handleRefresh();
                }
            });
        },
        resetPage() {
            this.page = {
                pageSize: 10,
                pageNumber: 1
            };
            this.$refs['table_list'].resetPage();
        },
        changePage(page) {
            this.page = page;
            this.getList();
        }
    }
};
</script>

<style scoped lang="scss">
.fans-label {
    margin: 20px auto;
}
</style>
