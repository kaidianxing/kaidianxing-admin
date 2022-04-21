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
    <kdx-content-bar>
        <div class="single-index flex-column">
            <!-- 商品信息 -->
            <div class="good-info">
                <kdx-form-title>商品信息</kdx-form-title>
                <div class="goods">
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
            </div>
            <!-- 创建 -->
            <div class="tab-content">
                <Tabs v-model="tabPoint" :animated="false" name="comment">
                    <TabPane label="手动创建" name="manual">
                        <manual-add ref="manual" @submit="submit"></manual-add>
                    </TabPane>
                    <TabPane label="API抓取" name="API">
                        <API-add ref="API" @submit="submit"></API-add>
                    </TabPane>
                </Tabs>
            </div>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">{{tabPoint === 'manual'?'立即创建':'立即获取'}}</Button>
        </template>

        <progress-bar ref="progress_bar" :type="tabPoint" :status="progress.status" :current="progress.current" :count="progress.count"
                      @on-reset="handleReset" @readComment="readComment" ></progress-bar>

    </kdx-content-bar>
</template>

<script>

    import ManualAdd from "./components/ManualAdd";
    import APIAdd from "./components/APIAdd";
    import ProgressBar from "../../components/ProgressBar";

    export default {
        name: "index",
        components: {
            ManualAdd,
            APIAdd,
            ProgressBar
        },
        props: {},
        data() {
            return {
                loading: false,
                goodId: '', // 商品id
                goodInfo: {},
                tabPoint: 'manual',
                progress: {
                    status: 'active',
                    current: 0,
                    count: 0,
                },
            }
        },
        computed: {},
        created() {
            this.loading = true;
            if (this.$route.query?.goodId) {
                this.goodId = this.$route.query?.goodId;
                this.tabPoint = this.$route.query.type || 'manual';
                this.getGoodInfo()
            }
        },
        mounted() {},
        methods: {
            getGoodInfo() {
                this.$api.commentHelperApi.getCommentGoodInfo({goods_id:this.goodId}).then((res) => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.goodInfo = res.data;
                    }
                })
            },
            handleSave() {
                this.$refs[this.tabPoint].validateForm()
            },
            submit(params) {
                if (this.tabPoint === 'manual') {
                    params.goods_id = this.goodId;
                    this.$api.commentHelperApi.saveManualCreate(params).then(res => {
                        if (res.error === 0) {
                            this.$refs['progress_bar'].setValue();
                        }
                    })
                    return
                }

                if (this.tabPoint === 'API') {
                    this.progress = {
                        current: 0,
                    };
                    this.$refs['progress_bar'].setValue();
                }
                params.goods_id = this.goodId;
                this.$api.commentHelperApi.saveAPI(params).then(res => {
                    if (res.error === 0) {
                        this.progress = {
                            current: 100,
                            status: 'success',
                            count: res.data.count
                        };
                    } else {
                        this.progress = {
                            current: 100,
                            status: 'error'
                        };
                    }
                })

            },
            handleReset() {
                // 刷新页面
                this.loading = true;
                this.$refs[this.tabPoint].reset()
            },
            readComment() {
                this.$router.replace({
                    path: '/commentHelper/comment/single/list',
                    query: {
                        goodId: this.goodId,
                        type: this.tabPoint
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .single-index {
        .good-info {
            flex-shrink: 0;
            padding: 40px 40px 60px;
            margin-bottom: 10px;
            background-color: #fff;
            .goods {
                padding-left: 40px;
                display: flex;
                align-items: center;
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
                    //@include font-18-25;
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
        }

        .tab-content {
            flex: 1;
            background-color: #ffffff;
            border-radius: 2px;

            /deep/ .ivu-tabs-bar {
                margin-bottom: 0;
                padding: 0 30px;
                .ivu-tabs-tab {
                    padding: 12px 30px;
                    @include font-18-25-bold;
                }
            }
        }
    }
</style>