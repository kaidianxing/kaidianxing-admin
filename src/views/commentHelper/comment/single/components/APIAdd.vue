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
    <div class="api-add">
        <!-- 抓取次数 -->
        <Form ref="form" :model="model" :rules="rules" :label-width="120">
            <FormItem label="渠道选择：">
                <div class="multi-select">
                    <RadioGroup v-model="model.type" @on-change="changType">
                        <Radio border label="taobao">
                            <div>
                                <img class="select-img" :src="require('@/assets/image/commentHelper/taobao.png')" alt="">
                            </div>
                            <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
                        </Radio>
                        <Radio border label="tmall">
                            <div>
                                <img class="select-img" :src="require('@/assets/image/commentHelper/tmall.png')" alt="">
                            </div>
                            <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
                        </Radio>
                        <Radio border label="suning">
                            <div>
                                <img class="select-img" :src="require('@/assets/image/commentHelper/suning.png')" alt="">
                            </div>
                            <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
                        </Radio>
                        <Radio border label="jd">
                            <div>
                                <img class="select-img" :src="require('@/assets/image/commentHelper/jd.png')" alt="">
                            </div>
                            <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text v-if="model.type === 'tmall'">天猫渠道API仅支持按默认顺序逐条抓取评价，不支持自定义条件抓取</kdx-hint-text>
                </div>
            </FormItem>

            <FormItem label="商品链接：" prop="url">
                <Input v-model="model.url" type="textarea" :autosize="{minRows: 6}" placeholder="请输入" class="width-430"/>
                <template v-if="model.type === 'taobao'">
                    <kdx-hint-text>
                        <p>例如商品链接为: http://item.taobao.com/item.htm?id=522155891308</p>
                        <p>将淘宝链接粘贴至输入框内，仅支持一条商品链接</p>
                    </kdx-hint-text>
                </template>
                <template v-else-if="model.type === 'tmall'">
                    <kdx-hint-text>
                        <p>例如商品链接为: https://www.tmall.com/?ali_trackid=2:mm_26632258_3504122_55934697:1587974850_126_1068622329</p>
                        <p>将天猫链接粘贴至输入框内，仅支持一条商品链接</p>
                    </kdx-hint-text>
                </template>
                <template v-else-if="model.type === 'jd'">
                    <kdx-hint-text>
                        <p>例如商品链接为: https://item.jd.com/65417738725.html</p>
                        <p>将京东链接粘贴至输入框内，仅支持一条商品链接</p>
                    </kdx-hint-text>
                </template>
                <template v-else-if="model.type === 'suning'">
                    <kdx-hint-text>
                        <p>例如商品链接为: https://product.suning.com/0000000000/10263045922.html</p>
                        <p>将苏宁链接粘贴至输入框内，仅支持一条商品链接</p>
                    </kdx-hint-text>
                </template>
            </FormItem>

            <FormItem label="抓取数量：" prop="num">
                <kdx-rr-input v-model="model.num" class="width-160" placeholder="请输入" number :fixed="0" :minValue="1" :maxValue="100">
                    <span slot="append">条</span>
                </kdx-rr-input>
                <kdx-hint-text>系统将以该商品展示的默认评价顺序进行抓取，最多抓取100条</kdx-hint-text>
            </FormItem>

            <FormItem label="抓取内容：">
                <RadioGroup v-model="model.content_type">
                    <div class="marginB-20">
                        <Radio :label="0">逐条抓取评价</Radio>
                        <kdx-hint-text>系统将以展示的默认评价顺序逐条抓取评价文字和对应的图片内容；评价内的视频将自动过滤不获取</kdx-hint-text>
                    </div>
                    <div class="marginB-20">
                        <Radio :label="1" :disabled="model.type === 'tmall'">仅抓取好评</Radio>
                        <kdx-hint-text>系统将以展示的默认评价顺序逐条抓取好评；评价内的视频内容将自动过滤不获取</kdx-hint-text>
                    </div>
                    <div class="marginB-20">
                        <Radio :label="2" :disabled="model.type === 'tmall'">仅抓取带图评价</Radio>
                        <kdx-hint-text>图片将自动存储在图片库内，如果可抓取的带图评价数量低于设置的抓取数量，将自动抓取无图评价内容；评价内的视频内容将自动过滤不获取</kdx-hint-text>
                    </div>
                    <div>
                        <Radio :label="3" :disabled="model.type === 'tmall'">仅抓取评价文字</Radio>
                        <kdx-hint-text>系统将以展示的默认评价顺序逐条抓取评价内的文字内容</kdx-hint-text>
                    </div>
                </RadioGroup>
            </FormItem>

            <FormItem label="评分等级：">
                <div class="start pointer">
                    <i class="iconfont icon-xingji-shixin" :class="{'active': model.level>=item}" v-for="(item,index) in 5" :key="index" @click="chooseStart(item)"></i>
                </div>
            </FormItem>

            <FormItem label="评价会员等级：">
                <Select v-model="model.level_id" class="width-340">
                    <Option value="0">随机等级</Option>
                    <Option v-for="item in level_list" :key="item.id" :value="item.id">
                        {{item.level_name}}
                    </Option>
                </Select>
                <Button type="text" class="marginR-10 marginL-10" @click="getLevel">刷新</Button>
                <Button type="text" @click="jumpLevel">创建会员等级</Button>
            </FormItem>

            <FormItem label="评价时段：" prop="start_time">
                <DatePicker :value="model.date" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择" @on-change="changeDate" class="width-340"></DatePicker>
                <kdx-hint-text>系统将在选择的时段内随机创建评价时间</kdx-hint-text>
            </FormItem>

            <FormItem label="显示状态：">
                <RadioGroup v-model="model.status">
                    <Radio :label="1">显示</Radio>
                    <Radio :label="0">隐藏</Radio>
                </RadioGroup>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        name: "APIAdd",
        components: {},
        data() {
            return {
                model: {
                    type: 'taobao',
                    url: '',
                    num: '',
                    content_type: 0,
                    level: 5,
                    level_id: '0',
                    date: [],
                    start_time: '',
                    end_time: '',
                    status: 1
                },
                level_list: [],
                rules: {
                    url: [
                        { required: true, message: '商品链接必填' }
                    ],
                    num: [
                        { required: true, message: '抓取数量必填' }
                    ],
                    start_time: [
                        { required: true, message: '评价时间必填' }
                    ],
                }
            }
        },
        computed: {},
        created() {
            this.getLevel()
        },
        mounted() {
        },
        methods: {
            getLevel() {
                this.$api.memberApi.getLevelList({is_all: 1}).then(res => {
                    if (res.error === 0) {
                        this.level_list = res.list;
                    }
                })
            },
            changType(type) {
                if (type === 'tmall') {
                    this.model.content_type = 0
                }
            },
            jumpLevel() {
                this.$utils.openNewWindowPage('/member/grade/add')
            },
            toRecharge() {
                this.$utils.openNewWindowPage('/commentHelper/set/index')
            },
            changeDate(date) {
                this.model.start_time = date[0]
                this.model.end_time = date[1]
            },
            chooseStart(data) {
                this.model.level = data
            },
            validateForm() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.handleParams();
                    }
                })
            },
            handleParams() {
                this.$emit('submit', this.model)
            },
            reset() {
                this.model = {
                    type: 'taobao',
                    url: '',
                    num: '',
                    content_type: 0,
                    level: 5,
                    level_id: '0',
                    date: [],
                    start_time: '',
                    end_time: '',
                    status: 1
                };
                this.$refs['form'].resetFields()
            }
        },
    }
</script>

<style lang="scss" scoped>
    .api-add {
        padding: 30px 40px;
        min-height: 100%;
        .residue-package {
            display: flex;
            align-items: center;
            background-color: $brand-hover;
            padding: 19px 39px;
            border: 1px solid $brand-color;
            border-radius: 2px;
            margin-bottom: 30px;
            .image {
                width: 48px;
                height: 48px;
                >img {
                    width: 100%;
                    height: 100%;
                }
            }
            > .content {
                padding-left: 20px;
                .title {
                    @include font-18-25-bold;
                    color: $brand-color;
                    padding-bottom: 4px;
                }
                .text {
                    @include font-14-20;
                    color: $text-first;
                    .number {
                        @include font-18-25-bold;
                        color: $brand-color;
                    }
                }
            }
        }
        .multi-select {
            /deep/ .ivu-radio {
                display: none;
            }
            /deep/ .ivu-radio-group {
                display: flex;
                align-items: center;
            }
            .ivu-radio-group-item {
                position: relative;
                box-sizing: border-box;
                padding-left: 0;
                padding-right: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 150px;
                height: 48px;
                font-size: 14px;
                /*line-height: 20px;*/
                border-radius: 2px;
                margin-right: 10px;
                &:last-child {
                    margin-right: 0;
                }
                .select-img {
                    position: relative;
                    top: 2px;
                    /*width: 148px;*/
                    height: 44px;
                }
                .icon {
                    position: absolute;
                    font-size: 24px;
                    bottom: -2px;
                    right: 0;
                    color: $brand-color;
                    display: none;
                }
            }
            .ivu-radio-wrapper-disabled {
                background-color: $background-color;
            }
            .ivu-radio-wrapper-checked {
                border-width: 2px;
                .icon {
                    display: inline-block;
                }
                &.ivu-radio-wrapper-disabled {
                    border-color: $brand-color;
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
</style>