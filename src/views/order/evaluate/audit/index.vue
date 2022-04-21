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
    <kdx-content-bar >
        <div class="action">
            <kdx-hint-alert style="margin-bottom: 10px" v-if="!setData.comment_reward_status||!setData.choice_status">
                <div>
                    <span v-if="!setData.comment_reward_status">【评价奖励发放】</span><span v-if="!setData.choice_status">【精选评价设置】</span> 当前不可用，请到
                    <Button type="text" @click="handleClick('toSet')">【评价助手】</Button>应用中开启
                </div>
            </kdx-hint-alert>
            <Button class="btn" type="primary" @click="handleAudit">{{data.status == 1?'审核通过':data.status == 0?'待审核':'审核拒绝'}}</Button>
            <Button class="btn mL-20 mR-20"  type="primary" @click="handleReward">{{data.is_reward == 1?'已发放奖励':'评价奖励发放'}}</Button>
            <Button class="btn" type="primary" @click="setSift">精选评价设置</Button>
        </div>

        <div class="order-evaluate-audit">
            <div class="content">
                <kdx-form-title>评价审核</kdx-form-title>
                <Form :label-width="120">
                    <FormItem label="订单号：" class="r-form-item-checkbox">
                        <span class="click-hover" @click="openDetailPage(data.order_info.status)">{{
                            data.order_info ? data.order_info.order_no : ''
                        }}</span>
                    </FormItem>
                    <FormItem label="评价商品：">
                        <div class="goods">
                            <div class="image" @click="handleClick('goods')">
                                <img :src="$media(data.goods_info.thumb)" alt="" @error="replaceImage">
                            </div>
                            <div class="content">
                                <span class="mark more" v-if="1 === +data.goods_info.has_option">多</span>
                                <span class="mark real" v-if="0 === +data.goods_info.type">实</span>
                                <span class="mark virtual" v-else-if="1 === +data.goods_info.type">虚</span>
                                <span class="mark card" v-else>密</span>
                                <span class="click-hover" @click="handleClick('goods')">{{ data.goods_info.title }}</span>
                            </div>
                        </div>
                    </FormItem>
                    <FormItem label="评价会员：">
                        <div class="valuator">
                            <div class="valuator-image" @click="handleClick('vip')">
                                <img :src="data.avatar" alt="" @error="replaceImage($event, 'avatar')"/>
                            </div>
                            <div class="valuator-name click-hover" @click="handleClick('vip')">
                                {{ data.nickname }}
                            </div>
                        </div>
                    </FormItem>
                    <FormItem label="评价等级：">
                        <div class="start pointer">
                            <i class="iconfont icon-xingji-shixin" :class="{'active': data.level>=item}" v-for="(item,index) in 5" :key="index"></i>
                        </div>
                    </FormItem>
                    <FormItem label="评价内容：" class="r-form-item-checkbox">
                        <div class="paragraph">{{ data.content }}</div>
                        <template v-if="data.images.length > 0">
                            <div class="image-box">
                                <div
                                    v-for="(item, index) in data.images"
                                    :key="index"
                                    class="image"
                                >
                                    <img
                                        :src="$media(item)"
                                        alt=""
                                        @error="replaceImage"
                                    />
                                    <div
                                        class="shade"
                                        @mousedown="previewImg(true, index)"
                                    >
                                        <div class="shade-content">
                                            <p>
                                                <Icon type="ios-search" />
                                            </p>
                                            <p>查看</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </FormItem>
                </Form>
            </div>
        </div>
        <template #btn>
            <Button class="default-long" @click="getBack">返回</Button>
        </template>
        <preview-img
            :imgList="previewImages || []"
            :currentIndex="current"
            v-show="imgModal"
            @on-close="previewImg(false)"
        />
        <!-- 精选奖励弹窗 -->
        <sift-comment  v-model="siftModel" :sift-data="siftData" @handleOk="siftOk"></sift-comment>
        <!-- 评价奖励发放 -->
        <reward-comment  v-model="rewardModel" :reward-data="rewardData" @handleOk="rewardOk"></reward-comment>
        <!-- 审核弹窗 -->
        <audit-comment v-model="auditModel" :audit-data="auditData" @handleOk="changeAuditStatus"></audit-comment>
    </kdx-content-bar>
</template>

<script>
    import PreviewImg from '@/components/PreviewImg'
    import SiftComment from "@/views/commentHelper/components/SiftComment";
    import RewardComment from "@/views/commentHelper/components/RewardComment";
    import AuditComment from "@/views/commentHelper/components/AuditComment";
    export default {
    name: 'index',
    components: {
        PreviewImg,
        SiftComment,
        RewardComment,
        AuditComment,
    },
    data() {
        return {
            data: {
                status: '',
                goods_info: '',
                images: []
            },
            id: 0,
            previewImages: [],
            imgModal: false,
            current: 0,

            siftModel: false,
            siftData: {},

            rewardModel: false,
            rewardData: {},

            auditModel: false,
            auditData: {},

            setData: {
                choice_status: 1, // 精选
                comment_reward_status: 1, // 奖励
            },
        }
    },
    computed: {},

    mounted() {
        this.id = this.$route.query.id
        this.getEvaluateData()
        // this.getSet()
    },
    methods: {
        getSet() {
            this.$api.commentHelperApi.getSetting({}).then(res => {
                if (res.error === 0) {
                    this.setData = {
                        choice_status: +res.data.choice_status,
                        comment_reward_status: +res.data?.comment_reward_status
                    }
                }
            })
        },
        handleSave() {
            this.$api.orderApi
                .checkComment({ id: this.id, status: this.data.status })
                .then(res => {
                    if (res.error === 0) {
                        this.$Message.success('审核评论操作成功')
                        this.$router.go(-1)
                    }
                })
        },
        getEvaluateData() {
            this.$api.orderApi.getCommentData({ id: this.id }).then(res => {
                if (res.error === 0) {
                    this.data = res.item
                    this.data.level = parseInt(res.item.level) || 0
                    // 处理预览图片
                    this.previewImages = this.data.images.map(item => {
                        return this.$media(item)
                    })
                }
            })
        },
        getBack() {
            this.$router.go(-1)
        },
        previewImg(status, index) {
            if (index) {
                this.current = index
            }
            this.imgModal = status
        },
        handleClick(type) {
            let url, query = {};
            if (type === 'vip') {
                url = '/member/detail';
                query = {
                    id: this.data.member_id
                }
            } else if (type === 'goods') {
                if (this.data?.goods_info?.is_deleted == 2) {
                    this.$Message.error('商品不存在')
                    return
                }
                url = '/goods/add';
                query = {
                    id: this.data.goods_id,
                    operate: 'edit',
                    status: this.data.goods_info.status // 商品状态
                }
            } else if (type === 'toSet') {
                url = '/commentHelper/set/index';
            }
            this.$utils.openNewWindowPage(url, query);
        },
        // 根据状态打开不同的状态路由
        openDetailPage(status) {
            let path = '',
                query = {
                    id: this.data.order_id
                };
            if (status == '10' || status == '11') {
                path = '/order/detail/send'
            } else if (status == '0') {
                path = '/order/detail/payment'
            } else if (status == '20') {
                path = '/order/detail/receive'
            } else if (status == '30') {
                path = '/order/detail/achieve'
            } else if (status == '-1') {
                path = '/order/detail/close'
            }
            this.$utils.openNewWindowPage(path, query);
        },
        setSift() {
            this.siftData = {
                sort_by: this.data.sort_by,
                is_choice: +this.data.is_choice,
                id: this.data.id
            };
            this.siftModel = true;
        },
        siftOk(data) {
            this.$api.commentHelperApi.setChoice(data).then(res => {
                if (res.error === 0) {
                    this.$Message.success('修改成功');
                    this.getEvaluateData()
                }
            })
        },
        handleReward() {
            this.rewardData = {
                id: this.data.id,
                member_id: this.data.member_id,
                is_reward: this.data?.is_reward || 0,
                reward_content: this.data?.reward_content || null
            };
            this.rewardModel = true
        },
        rewardOk(data) {
            this.$api.commentHelperApi.saveReward(data).then(res => {
                if (res.error === 0) {
                    this.$Message.success('保存成功');
                }
            })
        },
        handleAudit() {
            this.auditData = {
                id: this.data.id,
                status: +this.data.status,
            };
            this.auditModel = true
        },
        changeAuditStatus(data) {
            this.$api.orderApi.checkComment(data).then(res => {
                if (res.error === 0) {
                    this.$Message.success('修改成功');
                }
            })
        },
    },
}
</script>

<style scoped lang="scss">
    .action {
        padding: 20px 30px;
        background-color: #fff;
        .btn {
            width: 160px;
            height: 50px;
            font-size: 16px;
        }
    }
.order-evaluate-audit {
    background-color: #FFFFFF;
    margin-top: 10px;
    min-height: 100%;
    > .content {
        padding: 40px;

        .click-hover {
            cursor: pointer;
            &:hover {
                color: $brand-color;
            }
        }

        .ivu-form {
            .ivu-form-item {
                // 商品
                .goods {
                    display: flex;
                    align-items: center;
                    max-width: 420px;

                    .image {
                        width: 60px;
                        height: 60px;
                        border: 1px solid #E9EDEF;
                        box-sizing: border-box;
                        border-radius: 2px;
                        overflow: hidden;
                        flex-shrink: 0;

                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .content {
                        padding-left: 10px;
                        @include font-14-20;
                        color: $text-first;
                        @include font-multiple-omit(2);

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

                // 评价者
                .valuator {
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;

                    > .valuator-image {
                        line-height: 0;
                        width: 46px;
                        height: 46px;
                        border: 1px solid $border-color;
                        border-radius: 100%;
                        overflow: hidden;

                        > img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    > .valuator-name {
                        padding-left: 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                // 等级
                .image-box {
                    margin-top: 10px;
                    display: flex;
                    flex-wrap: wrap;
                    margin-right: -20px;

                    .image {
                        width: 60px;
                        height: 60px;
                        border: 1px solid $border-color;
                        border-radius: 2px;
                        overflow: hidden;
                        box-sizing: border-box;
                        overflow: hidden;
                        margin-right: 20px;
                        position: relative;
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

                // 段落
                .paragraph {
                    max-width: 420px;
                    @include font-14-20;
                }
            }
        }
        .start {
            i {
                margin-right: 10px;
                font-size: 20px;
                color: $border-bg-color;
                &.active {
                    color: #FF9900;
                }
            }
        }
    }
}
</style>
