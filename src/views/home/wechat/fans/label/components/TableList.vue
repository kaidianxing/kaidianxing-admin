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
    <div class="table-list" v-loading="loading">
        <div class="sync-time">
            上次同步时间：<span class="time">{{ lastSyncTime || '00-00-00 00:00:00' }}</span>
        </div>
        <Table ref="table" :columns="columns" :data="data">
            <template #action="{row}">
                <Button :disabled="noManagePerm" type="text" @click="editName(row)">修改名称</Button>
                <Button :disabled="noManagePerm" type="text" class="marginL-10" @click="deleteLabel(row)">删除</Button>
            </template>
        </Table>
        <div class="footer-page" v-show="total > 10">
            <kdx-page-component :current='current' :pageSize='pageSize' ref="page" :total="total"
                            @on-change="changePage"></kdx-page-component>
        </div>
    </div>
</template>

<script>
export default {
    name: "TableList",
    props: {
        data: {
            type: Array,
            default: () => []
        },
        total: {
            type: Number,
            default: 0
        },
        current: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 10
        },
        loading: {
            type: Boolean,
            default: false
        },
        lastSyncTime: {
            type: String
        }
    },
    data() {
        return {
            columns: [
                {
                    title: '标签名称',
                    key: 'tag_name'
                },
                {
                    title: '粉丝数量',
                    key: 'fans_num'
                },
                {
                    title: '操作',
                    slot: 'action'
                }
            ]
        };
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("channel.wechat.manage");
        },
    },
    methods: {
        editName(row) {
            this.$emit('on-action', row, 'edit')
        },
        deleteLabel(row) {
            this.$Modal.confirm({
                title: '提示',
                content: '删除标签后，该标签下的所有用户将失去该标签属性。是否确定删除？',
                onOk: () => {
                    this.$emit('on-action', row, 'delete')
                }
            })
        },
        changePage(page) {
            this.$emit('on-change-page', page)
        },
        resetPage() {
            this.$refs['page'].reset();
        }
    }
};
</script>

<style scoped lang="scss">
.table-list {
    padding: 0 20px 20px 20px;
    background-color: #ffffff;
    border-radius: 2px;
    /deep/ .ivu-table {
        .ivu-table-header tr th {
            background-color: #F4F6F8;
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
            color: $text-first;
            font-weight: bold;
        }
    }
    .footer-page {
        padding-bottom: 0;
    }
}
</style>
