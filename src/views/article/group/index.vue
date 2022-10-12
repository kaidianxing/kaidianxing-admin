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
    <kdx-content-bar>
        <!--应用过期提示-->
        <!-- <app-overdue-hint></app-overdue-hint> -->
        <div class="good-classification">
            <div class="header">
                <Button type="primary" :disabled="noManagePerm" @click="addGroup">+添加分组</Button>
            </div>
            <div class="header-space"></div>
            <div class="content" v-loading="loading">
                    <div class="table-header">
                        <div class="name">分组名称</div>
                        <div class="count">专题文章数量</div>
                        <div class="status">状态</div>
                        <div class="action">操作</div>
                    </div>
                    <div v-if="list.length > 0">
                        <div class="grag-sort-list">
                            <div ref="draggle">
                                <div v-for="(item,index) in list" :key="item.id">
                                    <div class="table-content">
                                        <div class="icon">
                                            <Icon type="md-menu" />
                                        </div>
                                        <div class="name">
                                            <Input v-model="item.name"
                                                   show-word-limit
                                                   :maxlength="8"></Input>
                                        </div>
                                        <div class="count">{{ item.article_count }}</div>
                                        <div class="status">
                                            <span :class="{show:item.status==1,hide:item.status!=1}">{{item.status==1?'显示':'隐藏'}}</span>
                                        </div>
                                        <div class="action">
                                            <Button type="text" :disabled="noManagePerm" @click="handleHide(item.id, item.status)">{{item.status==1?'隐藏':'显示'}}</Button>
                                            <Button type="text" :disabled="noManagePerm" @click="handleDelete(item.id,index)">删除</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div style="text-align: center">
                            暂无数据
                        </div>
                    </div>
            </div>
        </div>
        <!-- 新增分组 -->
        <add-group-modal ref="groupModal" @success="getGroupList"></add-group-modal>
        <template #btn>
            <div class="btn-bottom">
                <Button :disabled="noManagePerm" :loading="load" class="primary-long" @click="handleSave">保存</Button>
            </div>
        </template>
    </kdx-content-bar>
</template>

<script>
import Sortable from 'sortablejs';
import addGroupModal from "../components/addGroupModal";
export default {
    components: {
        addGroupModal,
    },
    data() {
        return {
            load:false,
            loading: false,
            list: []
        };
    },
    mounted() {
        this.getGroupList().then(() => {
            if (this.list.length) {
                this.initSortable()
            }
        })
    },
    computed: {
        noManagePerm(){
            return !this.$getPermMap('article.group.manage')
        }
    },
    methods: {
        // 新增分组
        addGroup() {
            // this.$refs.groupModal.setValue();
            this.list.push({
                name:'',
                article_count:'0',
                status:'1'
            })
        },
        // 初始化拖动功能
        initSortable() {
            this.$nextTick(() => {
                let el = this.$refs['draggle'];
                new Sortable(el, {
                    handle: '.icon',
                    dataIdAttr: 'data-id',
                    onEnd: this.endSortable,
                    animation: 150,
                    ghostClass: 'blue-background-class'
                });
            })
        },
        endSortable(e) {
            let moveRow = this.list[e.oldIndex];
            this.list.splice(e.oldIndex, 1);
            this.list.splice(e.newIndex, 0, moveRow);
            let orderList = this.list.map((item, index) => {
                return index
            }).reverse()
            this.list.forEach((item, index) => {
                item.display_order = orderList[index]
            })
        },
        // 保存顺序
        handleSave() {
            let save = true
            this.load = true
            this.list.forEach(item=>{
                if(item.name == ''){
                    this.$Message.error('分组名称不能为空');
                    save = false
                    setTimeout(()=>{
                        this.load = false
                    },2000)
                    return
                }
            })
            if(save){
                let data = JSON.stringify(this.list);
                this.$api.articleApi.saveArticleGroup({
                    data,
                }).then((res) => {
                    if(res.error === 0) {
                        this.$Message.success("操作成功");
                        this.load = false
                        this.getGroupList();
                    }
                })
                .finally(()=>{
                    setTimeout(()=>{
                        this.load = false
                    },2000)
                })
            }
        },
        // 获取分组列表
        getGroupList() {
            this.loading = true;
            return this.$api.articleApi.getGroupList({
                get_article_count: 1
            }).then((res) => {
                if(res.error === 0) {
                    this.list = res.list
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        // 隐藏，显示
        handleHide(id, status) {
            let content = "确认显示该分组吗？";
            console.log(status)
            if(status == "1") {
                content = "确认隐藏该分组吗？"
            }
            this.$Modal.confirm({
                title: "提示",
                content,
                onOk: () => {
                    this.changeStatus(id, status);
                },
                onCancel: () => {},
            });
        },
        // 改变分组状态
        changeStatus(id, currentStatus) {
            let status = Number(!Number(currentStatus))
            this.$api.articleApi.changeHideArticleGroup({
                id,
                status
            }).then((res) => {
                if(res.error === 0) {
                    this.$Message.success("操作成功");
                    this.getGroupList()
                }
            })
        },
        // 删除
        handleDelete(id,index) {
            this.$Modal.confirm({
                title: "提示",
                content: "确认删除该分组吗？",
                onOk: () => {
                    this.deleteGroup(id,index);
                },
                onCancel: () => {},
            });
        },
        // 删除分组
        deleteGroup(id,index) {
            if(id){
                this.$api.articleApi.deleteArticleGroup({
                    id,
                }).then((res) => {
                    if(res.error === 0) {
                        this.$Message.success("操作成功");
                        this.getGroupList()
                    }
                })
            }else {
                this.list.splice(index,1)
            }
        },
        refreshTable() {
            this.getGroupList();
        },
    },
};
</script>
<style lang='scss' scoped>
.good-classification {
    min-height: 100%;
    box-sizing: border-box;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .header {
        padding: 20px 40px;
        background-color: #ffffff;
    }
    .header-space {
        height: 10px;
        width: 100%;
        background-color: $background-color;
    }
    .content {
        flex: 1;
        background-color: #ffffff;
        padding: 0 40px 40px 40px;
        position: relative;
        overflow: auto;
        .table-header {
            height: 60px;
            @include font-14-20-bold;
            color: $text-first;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            width: 100%;
            .name {
                min-width: 400px;
                padding-left: calc(80px + 54px);
                flex: 1;
            }
            .count {
                max-width: 600px;
                min-width: 100px;
                padding: 0 10px;
                flex: 1;
            }
            .status {
                width: 150px;
                padding: 0 10px;
            }
            .action {
                min-width: 120px;
                max-width: 200px;
                padding: 0 10px;
                flex: 1;
            }
        }
        .grag-sort-list {
            width: 100%;
            .table-content {
                width: 100%;
                display: flex;
                flex-wrap: nowrap;
                background-color: #F4F6F8;
                border: 1px solid var(--border-color);
                margin-bottom: 10px;
                padding: 25px 0;
                .icon {
                    padding: 0 20px;
                    cursor: move;
                } 
                .name {
                    min-width: 346px;
                    padding-left: 80px;
                    padding-right: 80px;
                    flex: 1;
                }
                .count {
                    max-width: 600px;
                    min-width: 100px;
                    padding: 0 10px;
                    flex: 1;
                }
                .status {
                    width: 150px;
                    padding: 0 10px;
                    .show {
                        color: #19BE6B;
                    }
                    .hide {
                        color: #939799;
                    }
                }
                .action {
                    min-width: 120px;
                    max-width: 200px;
                    padding: 0 10px;
                    flex: 1;
                    .ivu-btn-text {
                        margin-right: 10px;
                    }
                }
            }
        }
    }
    .btn-bottom {
        padding: 20px 0 20px 170px;
        border-top: 1px solid $border-color;
        background-color: #ffffff;
        position: absolute;
        bottom: 0;
        left: 20px;
        right: 20px;
        z-index: 1000;
        button {
            margin-right: 20px;
        }
    }
}
</style>