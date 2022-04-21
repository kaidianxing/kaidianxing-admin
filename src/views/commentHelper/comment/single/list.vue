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
    <div class="single-list">
        <div class="goods" :style="{backgroundImage:'url(' + require('@/assets/image/channel/bg-toutiao.png') + ')'}">
            <div class="image">
                <img :src="$utils.media(goodInfo.thumb)" alt="">
            </div>
            <div class="content">
                <span class="mark more" v-if="1 === +goodInfo.has_option">多</span>
                <span class="mark real" v-if="0 === +goodInfo.type">实</span>
                <span class="mark virtual" v-else-if="1 === +goodInfo.type">虚</span>
                <span class="mark card" v-else>密</span>
                {{ goodInfo.title }}
            </div>
        </div>

        <kdx-header-bar type="little">
            <template #header>
                <Button type="primary" :disabled="noManagePerm" @click="jumpAdd">+创建评价</Button>
            </template>
            <Form ref="form" :model="search" :label-width="100" inline @submit.native.prevent>
                <FormItem label="评价会员：">
                    <Input type="text" v-model="search.keyword" placeholder="请输入" class="width-160" @on-enter="handleSearch"/>
                </FormItem>
                <FormItem label="评价来源：">
                    <Select v-model="search.type" placeholder="全部" class="width-160">
                        <Option v-for="item in sourceList" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="显示状态：">
                    <Select v-model="search.status" placeholder="全部" class="width-160">
                        <Option v-for="item in statusList" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="table-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data" @on-selection-change="selectChange">
                <template slot-scope="{ row }" slot="comment">
                    <div class="comment">
                        <div class="content">
                            <span class="mark more" v-if="row.is_choice == 1">精选</span>
                            <span class="mark real" v-if="row.type == 0">默认</span>
                            <span class="mark real" v-if="row.type == 1">客评</span>
                            <span class="mark danger" v-if="row.type == 2">创建</span>
                            <span class="mark danger" v-if="row.type == 3">抓取</span>
                            <span>{{row.content}}</span>
                        </div>
                        <template v-if="Array.isArray(row.images)&&row.images.length">
                            <div class="image-box">
                                <div v-for="(item, index) in row.images.slice(0,5)" :key="index" class="image">
                                    <img :src="$media(item)" alt="" @error="replaceImage"/>
                                    <div class="shade" @mousedown="previewImg(true, row.images, index)">
                                        <div class="shade-content">
                                            <p><Icon type="ios-search" /></p>
                                            <p>查看</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="level">
                    <div class="start pointer">
                        <i class="iconfont icon-xingji-shixin" :class="{'active': row.level>=item}" v-for="(item,index) in 5" :key="index"></i>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <div>
                        <Button class="marginR-10" type="text" :disabled="noViewPerm" @click="handleView(row)">详情</Button>
                        <Button class="marginR-10" type="text" @click="setSift(row)">精选</Button>
                        <Button class="marginR-10" type="text" v-if="row.type ==2||row.type ==3" :disabled="noManagePerm" @click="checkComment(row)">{{row.status == 1?'隐藏':'显示'}}</Button>
                        <Button class="marginR-10" type="text" v-if="row.type !=2&&row.type !=3" @click="handleReward(row)">奖励</Button>
                        <Button class="marginR-10" type="text" v-if="row.type ==0||row.type ==1" :disabled="noOrderManagePerm" @click="handleAudit(row)">审核</Button>
                        <Button type="text" :disabled="noOrderManagePerm" @click="handleDelete({type: 'single', id: row.id})">删除</Button>
                    </div>
                </template>
            </Table>
            <div class="footer-action" v-if="data.length > 0">
                <Checkbox v-model="isSelectAll" :disabled='noOrderManagePerm' @on-change="checkboxChange"></Checkbox>
                <Button :disabled="selectDisabled" @click="handleDelete({type: 'multiple'})">删除</Button>
            </div>
            <div class="footer-page" :class="{'line':data.length>0}">
                <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
            </div>
        </div>
        <slot></slot>

        <!-- 精选奖励弹窗 -->
        <sift-comment v-model="siftModel" :sift-data="siftData" @handleOk="siftOk"></sift-comment>
        <!-- 评价奖励发放 -->
        <reward-comment v-model="rewardModel" :reward-data="rewardData" @handleOk="rewardOk"></reward-comment>
        <!-- 审核弹窗 -->
        <audit-comment v-model="auditModel" :audit-data="auditData" @handleOk="changeAuditStatus"></audit-comment>

        <preview-img :imgList="previewImages || []" :currentIndex="current" v-show="imgModal" @on-close="previewImg(false)"/>

    </div>
</template>

<script>

    import SiftComment from "../../components/SiftComment";
    import RewardComment from "../../components/RewardComment";
    import AuditComment from "../../components/AuditComment";
    import PreviewImg from '@/components/PreviewImg'

    export default {
        name: "list",
        components: {
            SiftComment,
            RewardComment,
            AuditComment,
            PreviewImg
        },
        props: {},
        data() {
            return {
                goodId: '',
                loading: false,

                siftModel: false,
                siftData: {},

                rewardModel: false,
                rewardData: {},

                auditModel: false,
                auditData: {},

                goodInfo: {}, // 商品
                total: 1,
                page: {
                    pageSize: 10,
                    pageNumber: 1,
                },
                search: {
                    keyword: '',
                    type: 'all',
                    status: 'all',
                },
                isSelectAll: false,
                selectRows: [], // 选中项
                sourceList: [
                    {
                        id: 'all',
                        name: '全部'
                    },
                    {
                        id: 0,
                        name: '默认评价'
                    },
                    {
                        id: 1,
                        name: '客户评价'
                    },
                    {
                        id: 2,
                        name: '手动创建'
                    },
                    {
                        id: 3,
                        name: 'API抓取'
                    },
                ],
                statusList: [
                    {
                        id: 'all',
                        name: '全部'
                    },
                    {
                        id: 1,
                        name: '显示'
                    },
                    {
                        id: 0,
                        name: '隐藏'
                    }
                ],
                data: [],
                previewImages: [],
                imgModal: false,
                current: 0,
                columns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '精选权重',
                        key: 'sort_by',
                        width: 100,
                        render: (h, params) => {
                            return (
                                <div>{+params.row.sort_by||'-'}</div>
                            )
                        }
                    },
                    {
                        title: '评价信息',
                        key: 'content',
                        slot: 'comment',
                        minWidth: 300,
                    },
                    {
                        title: '评分等级',
                        key: 'level',
                        slot: 'level',
                        minWidth: 100,
                    },
                    {
                        title: '评价时间',
                        key: 'created_at',
                        minWidth: 80,
                    },
                    {
                        title: '评价状态',
                        key: 'status',
                        minWidth: 40,
                        render: (h, params) => {
                            return (
                                <div class={params.row.status != 1?'disabled-color':''}>{params.row.status == 1?'显示':'隐藏'}</div>
                            )
                        }
                    },
                    {
                        title: '审核状态',
                        key: 'status',
                        minWidth: 40,
                        render: (h, params) => {
                            if (params.row.type ==2||params.row.type ==3) {
                                return (
                                    <div>-</div>
                                )
                            } else {
                                return (
                                    <div class={
                                        params.row.status == 1?'success-color':params.row.status == 0?'warning-color':'danger-color'
                                    }>{params.row.status == 1?'通过':params.row.status == 0?'审核中':'不通过'}</div>
                                )
                            }
                        }
                    },
                    {
                        title: '奖励状态',
                        key: 'is_reward',
                        minWidth: 40,
                        render: (h, params) => {
                            return (
                                <div class={params.row.is_reward == 1?'success-color':''}>{params.row.is_reward == 1?'已发放':'-'}</div>
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 180,
                        slot: 'action'
                    }
                ]
            }
        },
        computed: {
            // 下方按钮是否可操作
            selectDisabled() {
                return this.selectRows.length === 0;
            },
            noManagePerm(){ //无管理权限
                return !this.$getPermMap('commentHelper.index.manage')
            },
            noViewPerm(){ //无查看权限
                return !this.$getPermMap('commentHelper.index.view')
            },
            noOrderManagePerm(){ //无管理权限
                return !this.$getPermMap("order.comment.manage");
            },
        },
        created() {
            this.loading = true;
            if (this.$route.query?.goodId) {
                this.goodId = this.$route.query?.goodId;
                this.search.type = this.$route.query?.type === 'manual'?2:this.$route.query?.type === 'API'?3:'all';
                this.getGoodInfo()
                this.getList()
            }
        },
        mounted() {
        },
        methods: {
            getGoodInfo() {
                this.$api.commentHelperApi.getCommentGoodInfo({goods_id:this.goodId}).then((res) => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.goodInfo = res.data;
                    }
                })
            },
            getList() {
                let params = {
                    goods_id: this.goodId,
                    ...this.search,
                    type: this.search.type == 'all'?'':this.search.type,
                    status: this.search.status == 'all'?'':this.search.status,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                };
                this.$api.commentHelperApi.getCommentGoodList(params).then((res) => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.data = res.list;
                        this.total = res.total
                    }
                })
            },
            handleSearch() {
                this.refreshTable()
            },
            handleReset() {
                this.search = {
                    keyword: ''
                };
                this.refreshTable()
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1,
                };
                this.$refs['page'].reset();
                this.getList()
            },
            // 选中项发生变化
            selectChange(selection) {
                this.selectRows = selection;
                this.isSelectAll = this.selectRows.length === this.data.length;
            },
            // 表格下方全选按钮
            checkboxChange(status) {
                this.$refs['table'].selectAll(status);
                this.data.forEach((item, index) => {
                    this.$set(this.data[index], '_checked', status);
                });
                if (status) {
                    this.selectRows = this.data;
                } else {
                    this.selectRows = [];
                }
            },
            // 初始化下方的checkbox
            initFooterData() {
                this.isSelectAll = false;
                this.selectRows = [];
            },
            changePage(page) {
                this.page = page;
                this.getList();
                this.initFooterData()
            },
            // 删除
            handleDelete({type, id}) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认彻底删除评论？',
                    onOk: () => {
                        let idArr = [];
                        if (type === 'multiple') {
                            idArr = this.selectRows.map(item => item.id);
                        } else {
                            idArr = [id];
                        }
                        this.deleteComment(idArr);
                    },
                    onCancel: () => {
                    }
                });
            },
            deleteComment(idArr) {
                this.$api.orderApi.deleteComment({id: idArr}).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('评论删除成功');
                        this.getList()
                    }
                });
            },
            jumpAdd() {
                this.$router.push({
                    path: '/commentHelper/comment/single/index',
                    query: {
                        goodId: this.goodId
                    }
                })
            },
            previewImg(status, imgList, index) {
                this.previewImages = imgList || [];
                this.current = index || 0;
                this.imgModal = status
            },
            setSift(row) {
                this.siftData = {
                    sort_by: row.sort_by,
                    is_choice: +row.is_choice,
                    id: row.id
                };
                this.siftModel = true;
            },
            siftOk(data) {
                this.$api.commentHelperApi.setChoice(data).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('修改成功');
                        this.getList()
                    }
                })
            },
            handleReward(row) {
                this.rewardData = {
                    id: row.id,
                    member_id: row.member_id,
                    is_reward: row?.is_reward || 0,
                    reward_content: row?.reward_content || null
                };
                this.rewardModel = true
            },
            rewardOk(data) {
                this.$api.commentHelperApi.saveReward(data).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('保存成功');
                        this.getList()
                    }
                })
            },
            checkComment(row) {
                let status = row.status == 1?0:1;
                this.$Modal.confirm({
                    title: '提示',
                    content: `确定${status == 0?'隐藏':'显示'}此条评价`,
                    onOk: () => {
                        this.changeStatus({id: row.id, status})
                    },
                    onCancel: () => {},
                });
            },
            handleAudit(row) {
                this.auditData = {
                    id: row.id,
                    status: +row.status,
                };
                this.auditModel = true
            },
            changeStatus(data) {
                this.$api.commentHelperApi.changeStatus(data).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('修改成功');
                        this.getList()
                    }
                })
            },
            changeAuditStatus(data) {
                this.$api.orderApi.checkComment(data).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('修改成功');
                        this.getList()
                    }
                })
            },
            handleView(row) {
                // 查看详情
                let path = '/commentHelper/comment/single/edit';
                if (row.type == '1'||row.type == '0') {
                    path = '/order/evaluate/audit'
                }
                this.$router.push({
                    path,
                    query: {
                        id: row.id,
                        goodId: this.goodId
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .single-list {
        margin: 20px auto;
        background-color: $background-color;
        .goods {
            padding: 30px 40px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            background-color: $brand-hover;
            background-size: cover;
            border: 1px solid #2D8CF0;
            border-radius: 2px;
            .image {
                width: 80px;
                height: 80px;
                border-radius: 2px;
                overflow: hidden;
                flex-shrink: 0;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .content {
                padding-left: 20px;
                @include font-14-20;
                color: $text-first;
                @include font-multiple-omit(1);

                .mark {
                    padding: 1px 3px;
                    @include font-12-16;
                    border-radius: 2px;
                    margin-right: 5px;
                }

                .real {
                    background-color: $brand-light;
                    color: $brand-color;
                }

                .more {
                    background-color: $warning-light;
                    color: $warning-color;
                }

                .virtual {
                    color: #00C5C5;
                    background-color: #E6FFF9;
                }

                .card {
                    color: $danger-color;
                    background-color: $danger-light;
                }
            }
        }
        .table-list {
            background-color: #ffffff;
            padding: 40px 20px 0;
            margin-top: 10px;
            border-radius: 2px;
            position: relative;
            /deep/ .ivu-table-header thead tr th {
                background-color: $background-color;
            }
            .comment {
                .content {
                    @include font-14-20;
                    color: $text-first;
                    @include font-multiple-omit(2);
                }
                .mark {
                    padding: 1px 3px;
                    @include font-12-16;
                    border-radius: 2px;
                    margin-right: 5px;
                }
                .more {
                    background-color: $warning-light;
                    color: $warning-color;
                }
                .real {
                    background-color: $brand-light;
                    color: $brand-color;
                }
                .danger {
                    background-color: $danger-light;
                    color: $danger-color;
                }
                .image-box {
                    display: flex;
                    margin-top: 10px;
                    .image {
                        flex-shrink: 0;
                        position: relative;
                        margin-left: 6px;
                        width: 60px;
                        height: 60px;
                        border: 1px solid $border-color;
                        border-radius: 2px;
                        overflow: hidden;
                        box-sizing: border-box;
                        &:first-child {
                            margin-left: 0;
                        }
                        &:hover {
                            .shade {
                                display: flex;
                            }
                        }
                        > img {
                            width: 100%;
                            height: 100%;
                        }
                        // 遮罩
                        .shade {
                            position: absolute;
                            left: 0;
                            right: 0;
                            top: 0;
                            bottom: 0;
                            background-color: $shade-color;
                            border-radius: 2px;
                            color: #ffffff;
                            @include font-12-16;
                            display: none;
                            cursor: pointer;
                            align-items: center;
                            justify-content: center;
                            > .shade-content {
                                > p {
                                    text-align: center;
                                }
                                .ivu-icon {
                                    font-size: 20px;
                                }
                            }
                        }
                    }
                }

            }
            .start {
                i {
                    margin-right: 4px;
                    font-size: 20px;
                    color: $border-bg-color;
                    &.active {
                        color: #FF9900;
                    }
                }
            }
        }
        .footer-page.line {
            border-top: 1px solid $border-color;
        }
    }
</style>