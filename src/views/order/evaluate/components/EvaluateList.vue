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
    <div class="order-evaluate-list">
        <Table ref="table" :columns="columns" :data="getData" @on-selection-change="selectChange"
               @on-select-all="selectAll">
            <template slot-scope="{ row }" slot="comment">
                <div class="comment">
                    <div class="content">
                        <span class="mark more" v-if="row.is_choice == 1">精选</span>
                        <span class="mark real" v-if="row.type == 0">默认</span>
                        <span class="mark real" v-if="row.type == 1">客评</span>
                        <span class="mark danger" v-if="row.type == 2">创建</span>
                        <span class="mark danger" v-if="row.type == 3">抓取</span>
                        <span class="word-break">{{row.content}}</span>
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
                    <Button v-if="(row.type ==2||row.type ==3)" class="marginR-10" type="text" :disabled="noViewPerm" @click="handleView(row)">详情</Button>
                    <Button v-else class="marginR-10" type="text" @click="handleView(row)">详情</Button>
                    <Button class="marginR-10" type="text"  @click="setSift(row)">精选</Button>
                    <Button class="marginR-10" type="text" v-if="(row.type ==2||row.type ==3)" :disabled="noManagePerm" @click="checkComment(row)">{{row.status == 1?'隐藏':'显示'}}</Button>
                    <Button class="marginR-10" type="text" v-if="row.type !=2&&row.type !=3" @click="handleReward(row)">奖励</Button>
                    <Button class="marginR-10" type="text" v-if="row.type ==0||row.type ==1" :disabled="noOrderManagePerm" @click="handleAudit(row)">审核</Button>
                    <Button class="marginR-10" type="text" @click="handleReplay(row)">回复</Button>
                    <Button type="text" :disabled="noOrderManagePerm" @click="handleDelete({type: 'single', id: row.id})">删除</Button>
                </div>
            </template>
        </Table>
        <div class="footer-action">
            <Checkbox v-model="isSelectAll" :disabled='noOrderManagePerm' @on-change="checkboxChange"></Checkbox>
            <Button :disabled="selectDisabled" @click="handleDelete({type: 'multiple'})">删除</Button>
        </div>
        <div class="footer-page">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>

        <!-- 精选奖励弹窗 -->
        <sift-comment  v-model="siftModel" :sift-data="siftData" @handleOk="siftOk"></sift-comment>
        <!-- 评价奖励发放 -->
        <reward-comment  v-model="rewardModel" :reward-data="rewardData" @handleOk="rewardOk"></reward-comment>
        <!-- 审核弹窗 -->
        <audit-comment v-model="auditModel" :audit-data="auditData" @handleOk="changeAuditStatus"></audit-comment>
        <!-- 商家回复 -->
        <kdx-modal-frame v-model="replayModal" title="商家回复" :width="520" @on-cancel="replayModalClose" @on-ok="replayModalOk">
            <div class="remark-modal">
                <Form>
                    <FormItem>
                        <Input type="textarea" v-model="replayData.reply_content" placeholder="请输入" maxlength="200" :autosize="{minRows:4}" show-word-limit :disabled="noOrderManagePerm"/>
                    </FormItem>
                </Form>
            </div>
        </kdx-modal-frame>

        <preview-img :imgList="previewImages || []" :currentIndex="current" v-show="imgModal" @on-close="previewImg(false)"/>
    </div>
</template>

<script>
    import SiftComment from "@/views/commentHelper/components/SiftComment";
    import RewardComment from "@/views/commentHelper/components/RewardComment";
    import AuditComment from "@/views/commentHelper/components/AuditComment";
    import PreviewImg from '@/components/PreviewImg'


    export default {
        name: "EvaluateList",
        components: {
            SiftComment,
            RewardComment,
            AuditComment,
            PreviewImg
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
        },
        computed: {
            getData(){
                return this.data.map(item=>{
                    item._disabled=this.noOrderManagePerm;
                    return item
                })
            },
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
        data() {
            return {

                siftModel: false,
                siftData: {},

                rewardModel: false,
                rewardData: {},

                auditModel: false,
                auditData: {},

                replayModal: false,
                replayData: {
                    id: '',
                    reply_content: '',
                },

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
                        title: '商品',
                        key: 'shop',
                        minWidth: 180,
                        render: (h, params) => {
                            return h('div', {
                                class: {
                                    shop: true
                                }
                            }, [
                                h('div', {
                                    class: {
                                        'shop-image': true
                                    }
                                }, [
                                    h('img', {
                                        attrs: {
                                            src: this.$media(params.row.thumb)
                                        },
                                      on: {
                                          error: e=> {
                                            this.replaceImage(e)
                                          }
                                      }
                                    })
                                ]),
                                h('div', {
                                    class: {
                                        'shop-information': true
                                    }
                                }, [
                                    h('div', {
                                        class: {
                                            title: true
                                        }
                                    }, params.row.title)
                                ])
                            ]);
                        }
                    },
                    {
                        title: '评价信息',
                        key: 'content',
                        slot: 'comment',
                        minWidth: 200,
                    },
                    {
                        title: '评分等级',
                        key: 'level',
                        slot: 'level',
                        minWidth: 120,
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
                        title: '来源',
                        key: 'type',
                        minWidth: 40,
                        render: (h, params) => {
                            let type_text = '';
                            switch (+params.row.type) {
                                case 0:
                                    type_text = '默认'
                                    break
                                case 1:
                                    type_text = '客户'
                                    break
                                case 2:
                                    type_text = '手动'
                                    break
                                case 3:
                                    type_text = '抓取'
                                    break
                            }
                            return (
                                <div>{type_text}</div>
                            )
                        }
                    },
                    {
                        title: '评价时间',
                        key: 'created_at',
                        minWidth: 120
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 140,
                        slot: 'action'
                    },
                ],
                selectRows: [],
                isSelectAll: false,
            };
        },
        methods: {
            // 重置页码
            reset(page) {
                this.$refs['page'].reset(page);
                this.selectRows = [];
                this.isSelectAll = false;
            },
            changePage(page) {
                this.$emit('on-page-change', page);
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
            // 选中项发生变化
            selectChange(selection) {
                this.selectRows = selection;
                this.isSelectAll = this.selectRows.length === this.data.length;
            },
            selectAll(selection, status) {
                console.log('all', selection, status);
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
                this.$api.orderApi.deleteComment({id: idArr})
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('评论删除成功');
                            this.$emit('on-refresh');
                        }
                    });
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
                        goodId: row.goods_id
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
            getList() {
                this.$emit('on-refresh');
            },
            handleReplay(row) {
                this.replayModal = true;
                this.replayData = {
                    id: row.id,
                    reply_content: row.reply_content
                }
            },
            replayModalClose() {
                this.replayModal = false;
            },
            replayModalOk() {
                this.replayModal = false;
                if (!this.replayData.reply_content){return}
                this.$api.orderApi.replayComment({...this.replayData}).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('评价回复成功')
                        this.getList()
                    }
                });
            },
            routerPath(id) {
                this.$utils.openNewWindowPage('/member/detail', {id});
            }
        }
    };
</script>

<style scoped lang="scss">
    .order-evaluate-list {
        /deep/ .ivu-table {
            td {
                // 商品
                .shop {
                    display: flex;
                    flex-wrap: nowrap;

                    > .shop-image {
                        width: 60px;
                        height: 60px;
                        margin-right: 10px;
                        box-sizing: border-box;
                        border: 1px solid $border-color;
                        border-radius: 2px;
                        overflow: hidden;
                        flex-shrink: 0;

                        > img {
                            width: 100%;
                            height: 100%;
                            border-radius: 2px;
                        }
                    }

                    > .shop-information {
                        > .title {
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 3;
                            overflow: hidden;
                            height: 60px;
                        }

                        > .shop-label {
                            color: #197BE1;
                            @include font-12-16;
                            padding-top: 4px;

                            > span {
                                background-color: $brand-light;
                                border-radius: 2px;
                                padding: 2px 8px;
                            }
                        }
                    }
                }

                // 评价者
                .valuator {
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;

                    > .valuator-image {
                        width: 46px;
                        height: 46px;
                        border: 1px solid $border-color;
                        border-radius: 100%;
                        box-sizing: border-box;
                        overflow: hidden;
                        flex-shrink: 0;

                        > img {
                            width: 100%;
                            height: 100%;
                            border-radius: 100%;
                        }
                    }

                    > .valuator-name {
                        padding-left: 10px;
                        flex: 1;
                        width: 0;
                        >.name {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: $brand-color;
                            cursor: pointer;
                        }
                        > .iconfont {
                            font-size: 18px;
                            margin-right: 10px;
                            vertical-align: middle;
                        }

                        .icon-weixin {
                            color: $success-color;
                        }
                        .icon-weixinxiaochengxu {
                            color: #677DE0;
                        }
                        .icon-toutiaoxiaochengxu {
                            color: #239BFF;
                        }

                        .icon-zhifubaoxiaochengxu {
                            color: #2094E7;
                        }

                        .icon-baiduxiaochengxu {
                            color: #306CFF;
                        }

                        .icon-H {
                            color: #FF6004;
                        }
                    }
                    > .merchant-name {
                        padding-left: 10px;
                        flex: 1;
                        width: 0;
                        >.name {
                            color: $text-first;
                            cursor: default;
                        }
                    }
                }

                // 评价状态
                .evaluate-status {
                    > .evaluate-first {
                        color: $success-color;
                    }
                }

                // 审核状态
                .audit-status {
                    > .auditing {
                        color: $warning-color;
                    }

                    > .audit-archive {
                        color: $success-color;
                    }
                }

                // 操作
                .action-btn {
                    > .ivu-btn {
                        margin-right: 8px;
                    }
                }
            }
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
        .footer-action {
            padding: 16px 0;

            .ivu-checkbox-default {
                margin-right: 0;
                width: 40px;
                text-align: center;

                > span {
                    /*&:last-child {*/
                    /*    display: none;*/
                    /*}*/
                }
            }

            .ivu-btn-default {
                width: inherit;
                margin-left: 10px;
            }
        }
        .footer-page {
            border-top: 1px solid $border-color;
        }
    }
    .remark-modal {
        padding: 40px;
    }
</style>
