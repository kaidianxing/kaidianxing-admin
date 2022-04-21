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
    <kdx-content-bar v-loading="loading">
        <!-- 商品信息 -->
        <div class="good-info">
            <kdx-form-title>商品信息</kdx-form-title>
            <div class="goods">
                <div class="image">
                    <img :src="$utils.media(goodInfo.thumb)" alt="">
                </div>
                <div class="content flex-column">
                    <div class="good-title">
                        <span class="label">商品名称：</span>
                        <span class="mark more" v-if="1 === +goodInfo.has_option">多</span>
                        <span class="mark real" v-if="0 === +goodInfo.type">实</span>
                        <span class="mark virtual" v-else-if="1 === +goodInfo.type">虚</span>
                        <span class="mark card" v-else>密</span>
                        {{ goodInfo.title }}
                    </div>
                    <div class="marginT-10">
                        <span class="label">评价来源：</span>
                        <span>{{model.type == 3?'API抓取':model.type == 2?'手动创建':''}}</span>
                    </div>
                    <div class="flex marginT-10" v-if="model.type == 3">
                        <span class="label">渠道链接：</span>
                        <span class="rr-brand-color pointer grab-url" @click="jumpGood(model.grab_url)">{{model.grab_url}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="comment-view">
            <Form ref="form" :model="model" :rules="rules" :label-width="120">
                <kdx-form-title>评价信息</kdx-form-title>
                <FormItem label="评分等级：">
                    <div class="start pointer">
                        <i class="iconfont icon-xingji-shixin" :class="{'active': model.level>=item}" v-for="(item,index) in 5" :key="index" @click="chooseStart(item)"></i>
                    </div>
                </FormItem>
                <FormItem label="精选评价：">
                    <RadioGroup v-model="model.is_choice">
                        <Radio :label="1" :disabled="noManagePerm||!setData.choice_status">精选评价</Radio>
                        <Radio :label="0" :disabled="noManagePerm||!setData.choice_status">普通评价</Radio>
                    </RadioGroup>
                </FormItem>
                <div class="next-box"  v-if="model.is_choice===1">
                    <FormItem label="权重值：">
                        <kdx-rr-input v-model="model.sort_by" placeholder="请输入" number :fixed="0" :minValue="1" :maxValue="9999" :disabled="noManagePerm||!setData.choice_status" class="width-250"></kdx-rr-input>
                        <kdx-hint-text>最高9999, 数字越大, 排名越靠前</kdx-hint-text>
                    </FormItem>
                </div>
                <FormItem label="评价内容：" class="r-form-item-checkbox" prop="content">
                    <Input v-model="model.content" type="textarea" :autosize="{ minRows: 3 }" maxlength="500" show-word-limit :disabled="noManagePerm" class="width-430" placeholder="请输入评价"/>
                </FormItem>
                <FormItem label="评价图片：" class="r-form-item-checkbox">
                    <kdx-image-video class="swiper-img" type="image" :limit="9" :multiple="true" :current-list="model.images" @on-change="thumbAllChange"></kdx-image-video>
                    <kdx-hint-text>建议尺寸：640*640像素，最多上传9张</kdx-hint-text>
                </FormItem>
                <FormItem label="评价时间：" prop="created_at">
                    <DatePicker :value="model.created_at" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择" class="width-340" :disabled="noManagePerm" @on-change="changeDate"></DatePicker>
                    <kdx-hint-text>系统将在选择的时段内随机创建评价时间</kdx-hint-text>
                </FormItem>
                <FormItem label="评价会员：" class="r-form-item-checkbox">
                    <div class="comment-bg">
                        <FormItem label="会员昵称：" prop="nickname">
                            <Input v-model="model.nickname" :disabled="noManagePerm" class="width-340" placeholder="请输入" :maxlength="16" show-word-limit/>
                        </FormItem>
                        <FormItem label="会员头像：" class="r-form-item-checkbox" prop="avatar">
                            <kdx-image-video type="image" :current="model.avatar" @on-change="changeThumb"></kdx-image-video>
                        </FormItem>
                        <FormItem label="会员等级：">
                            <Select v-model="model.level_id" class="width-340" :disabled="noManagePerm">
                                <Option value="0">随机等级</Option>
                                <Option v-for="item in level_list" :key="item.id" :value="item.id">
                                    {{item.level_name}}
                                </Option>
                            </Select>
                        </FormItem>
                    </div>
                </FormItem>
                <FormItem label="显示状态：">
                    <RadioGroup v-model="model.status">
                        <Radio :label="1" :disabled="noManagePerm">显示</Radio>
                        <Radio :label="0" :disabled="noManagePerm">隐藏</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :loading="submitLoading" :disabled="noManagePerm" @click="handleSave">保存</Button>
            <Button class="default-long" @click="back">取消</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
    export default {
        name: "edit",
        components: {},
        props: {},
        data() {
            return {
                goodId: '',
                id: '',
                loading: false,
                submitLoading: false,
                setData: {
                    choice_status: 1, // 精选
                    comment_reward_status: 1, // 奖励
                }, // 设置权限
                model: {
                    level: 5,
                    is_choice: 0,
                    sort_by: '',
                    content: '',
                    images: [],
                    created_at: '',
                    nickname: '',
                    avatar: '',
                    level_id: '0',
                    status: 1,
                },
                level_list: [],
                goodInfo: {},
                rules: {
                    content: [
                        { required: true, message: '评价内容必填' }
                    ],
                    created_at: [
                        { required: true, message: '评价时间必填' }
                    ],
                    nickname: [
                        { required: true, message: '会员昵称必填' }
                    ],
                    avatar: [
                        { required: true, message: '头像必填' }
                    ],
                }
            }
        },
        computed: {
            noManagePerm() {
                return !this.$getPermMap('commentHelper.index.manage')
            }
        },
        created() {
            this.getSet()
        },
        mounted() {
            if (this.$route.query?.goodId) {
                this.goodId = this.$route.query?.goodId;
                this.id = this.$route.query?.id;
                this.getLevel();
                this.getGoodInfo();
            }
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
            getData() {
                this.$api.orderApi.getCommentData({ id: this.id }).then(res => {
                    if (res.error === 0) {
                        let defaultLevel = this.level_list.filter(item =>item.is_default === '1')
                        this.model = {
                            ...res.item,
                            level: +res.item.level,
                            is_choice: +res.item.is_choice,
                            status: +res.item.status,
                            images: Array.isArray(res.item.images)&&res.item.images.length?res.item.images:[],
                            level_id: this.level_list.some(item => item.id === res.item.level_id)?res.item.level_id:defaultLevel?.[0].id,
                        };
                    }
                })
            },
            getGoodInfo() {
                this.$api.commentHelperApi.getCommentGoodInfo({goods_id:this.goodId}).then((res) => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.goodInfo = res.data;
                    }
                })
            },
            chooseStart(data) {
                if (this.noManagePerm) {return}
                this.model.level = data
            },
            thumbAllChange(pathList) {
                if (this.noManagePerm) {return}
                this.model.images = pathList
            },
            getLevel() {
                this.$api.memberApi.getLevelList({is_all: 1}).then(res => {
                    if (res.error === 0) {
                        this.level_list = res.list;
                        this.getData()
                    }
                })
            },
            changeThumb(path) {
                if (this.noManagePerm) {return}
                this.model.avatar = path
                this.$refs.form.validateField('avatar')
            },
            changeDate(date) {
                this.model.created_at = date
            },
            handleSave() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.submit();
                    }
                })
            },
            submit() {
                let params = {
                    ...this.model,
                    id: this.id,
                    time: this.model.created_at
                };
                this.level_list.map(item => {
                    if (item.id === params.level_id) {
                        params.member_level_name = item.level_name
                    }
                });

                this.$api.commentHelperApi.editComment(params).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('保存成功');
                        this.$router.go(-1)
                    }
                })
            },
            back() {
                this.$router.go(-1)
            },
            jumpGood(url) {
                window.open(url,'_blank')
            }
        },
    }
</script>

<style lang="scss" scoped>
    .good-info {
        flex-shrink: 0;
        padding: 40px 40px 60px;
        margin-bottom: 10px;
        background-color: #fff;
        .goods {
            padding-left: 40px;
            display: flex;
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
                justify-content: center;
                color: $text-first;
                .label {
                    display: inline-block;
                    width: 120px;
                    margin-right: 10px;
                    text-align: right;
                }
                .good-title {
                    max-width: 635px;
                    @include font-14-20;
                    @include font-multiple-omit(1);
                }

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
                .grab-url {
                    word-break: break-word;
                }
                .label {
                    flex-shrink: 0;
                }
            }
        }
    }
    .comment-view {
        background-color: #fff;
        padding: 40px;
        margin: 0 auto;
        border-radius: 2px;
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
        .next-box {
            margin: -20px 0 30px 120px;
            background-color: #f4f6f8;
            padding: 30px 0;
            border-radius: 2px;
            /deep/ .ivu-form-item:last-child {
                margin-bottom: 0;
            }
        }
        .comment-bg {
            padding: 30px 0;
            background-color: #f4f6f8;
            border-radius: 2px;
            /deep/ .ivu-form-item:last-child {
                margin-bottom: 0;
            }
        }
        /deep/ .show-img ul > .add {
            background-color: #fff;
            border: 1px solid $border-color;
        }
    }
</style>