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
        <Table ref="table" :columns="columns" :data="data" @on-selection-change="selectChange">
            <template #nickname="{row}">
                <div class="nickname">
                    <div class="logo">
                        <img :src="$utils.media(row.avatar)" alt="" @error="replaceImage('avatar')">
                    </div>
                    <div class="name">
                        {{row.nickname}}
                    </div>
                </div>
            </template>
            <template #fans_label="{row}">
                <div class="line-hide">{{getLabelName(row.tag)}}</div>
            </template>
            <template #attention_status="{row}">
                <kdx-status-text type="success" v-if="1 === +row.is_follow">已关注</kdx-status-text>
                <kdx-status-text type="danger" v-else>取消关注</kdx-status-text>
            </template>
            <template #unfollow_time="{row}">
                <div>{{row.unfollow_time && row.unfollow_time !== '0000-00-00 00:00:00' ? row.unfollow_time : '-'}}</div>
            </template>
            <template #action="{row}">
                <Button type="text" :disabled="noManagePerm" @click="addLabel({row})">打标签</Button>
                <Button type="text" :disabled="noManagePerm" class="marginL-10" @click="setBlack({row, is_black: 1})" v-if="0 === +row.is_black">加入黑名单</Button>
                <Button type="text" :disabled="noManagePerm" class="marginL-10" @click="setBlack({row, setBlack: 0})" v-else>移除黑名单</Button>
            </template>
        </Table>
        <div class="footer-action" v-show="data.length > 0">
            <Checkbox v-model="isSelectAll" @on-change="checkboxChange"></Checkbox>
            <Button :disabled="!isChecked || noManagePerm" @click="addLabel({type: 'multiple'})">打标签</Button>
            <Button :disabled="!isChecked || noManagePerm" @click="setBlack({type: 'multiple', is_black: 1})" v-if="tab === '0'">加入黑名单</Button>
            <Button :disabled="!isChecked || noManagePerm" @click="setBlack({type: 'multiple', is_black: 0})" v-else-if="tab === '1'">移除黑名单</Button>
        </div>
        <div class="footer-page" v-show="total > 10">
            <kdx-page-component :current='current' :pageSize='pageSize' ref="page" :total="total"
                            @on-change="changePage"></kdx-page-component>
        </div>
        <!--打标签-->
        <fans-label ref="fans_label" :id="checkedId" :current-list="tabList" @on-refresh="handleRefresh"></fans-label>
    </div>
</template>

<script>
import FansLabel from "./FansLabel";

export default {
    name: "TableList",
    components: {
        FansLabel
    },
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
        tab: {
            type: String
        }
    },
    data() {
        return {
            columns: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center',
                },
                {
                    title: '粉丝名称',
                    slot: 'nickname'
                },
                {
                    title: '粉丝标签',
                    slot: 'fans_label'
                },
                {
                    title: '关注状态',
                    slot: 'attention_status'
                },
                {
                    title: '关注时间',
                    key: 'follow_time'
                },
                {
                    title: '取关时间',
                    slot: 'unfollow_time'
                },
                {
                    title: '操作',
                    slot: 'action'
                }
            ],
            isSelectAll: false,
            selectRows: [],
            checkedId: [],
            tabList: []
        };
    },
    computed: {
        isChecked() {
            return !!this.selectRows.length;
        },
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("channel.wechat.manage");
        },
    },
    methods: {
        handleRefresh() {
            this.$emit('on-refresh');
        },
        changePage(page) {
            this.$emit('on-change-page', page);
        },
        resetPage() {
            this.$refs['page']?.reset();
        },
        checkboxChange() {
            this.$emit('on-checkbox', this.isSelectAll);
            if (this.isSelectAll) {
                this.selectRows = this.data.map(item => item);
            } else {
                this.selectRows = [];
            }
        },
        resetChecked() {
            this.isSelectAll = false;
            this.selectRows = [];
        },
        // 打标签
        addLabel({type = 'single', row}) {
            if (type === 'single') {
                this.checkedId = [row.id];
                this.tabList = (row.tag || []).map(item => {
                    item.id = item.fans_id;
                    return item;
                });
            } else {
                this.checkedId = this.selectRows.map(item => item.id);
                this.tabList = [];
            }
            this.$nextTick(() => {
                this.$refs['fans_label'].setValue();
            })
        },
        getLabelName(list = []) {
            return list?.length ? list.map(item => item.tag_name).join(',') || '-' : '-'
        },
        // 选中项发生变化
        selectChange(selection) {
            this.selectRows = selection;
            this.isSelectAll = this.selectRows.length === this.data.length;
        },
        // 设置/移除黑名单状态
        setBlack({row, is_black}) {
            let content, message, fans_id = row ? [row.id] : this.selectRows.map(item => item.id);
            // 移入黑名单
            if (is_black === 1) {
                content = '加入黑名单后，你将无法接收该用户发来的消息，且该用户无法接收公众号发出的消息，无法参与留言和赞赏，确认加入黑名单？';
                message = '加入黑名单成功';
            } else {
                content = '是否移除黑名单';
                message = '移除黑名单成功';
            }
            this.$Modal.confirm({
                title: '提示',
                content,
                onOk: () => {
                    this.$api.homeApi.setWechatBlackStatus({is_black, fans_id}).then(res => {
                        if (res.error === 0) {
                            this.$Message.success(message);
                            this.handleRefresh();
                        }
                    })
                }
            })
        }
    },
};
</script>

<style scoped lang="scss">
.table-list {
    padding: 0 20px 20px 20px;
    position: relative;
    /deep/ .ivu-table {
        .ivu-table-header tr th {
            background-color: #F4F6F8;
        }
    }
    .footer-page {
        border-top: 1px solid $border-color;
        padding-bottom: 0;
    }
    .nickname {
        display: flex;
        align-items: center;
        .logo {
            width: 44px;
            height: 44px;
            border-radius: 100%;
            flex-shrink: 0;
            img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
            }
        }
        .name {
            padding-left: 10px;
        }
    }
}
</style>
