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
    <div class="manual-add">
        <Form ref="form" :model="model" :rules="rules" :label-width="120">
            <FormItem label="评分等级：">
                <div class="start pointer">
                    <i class="iconfont icon-xingji-shixin" :class="{'active': model.level>=item}" v-for="(item,index) in 5" :key="index" @click="chooseStart(item)"></i>
                </div>
            </FormItem>
            <FormItem label="评价内容：" class="r-form-item-checkbox" required>
                <div class="comment-bg">
                    <div class="comment-table">
                        <Table ref="table" :columns="columns" :data="model.comment_data">
                            <template slot-scope="{ row, index }" slot="content">
                                <FormItem :prop="'comment_data.' + index + '.content'" :rules="{required: true, message: ' '}" style="margin-bottom: 0">
                                    <Input v-model="model.comment_data[index].content" type="textarea" autosize maxlength="500" show-word-limit class="width-600" placeholder="请输入评价"/>
                                </FormItem>
                            </template>
                            <template slot-scope="{ row, index }" slot="images">
                                <kdx-image-video class="swiper-img" type="image" :width="40" :height="40" :limit="9" :multiple="true" :current-list="model.comment_data[index].images" @on-change="thumbAllChange($event, index)"></kdx-image-video>
                            </template>
                        </Table>
                        <Button type="text" @click="addComment">+添加评价</Button>
                    </div>
                </div>
            </FormItem>
            <FormItem label="评价会员：">
                <RadioGroup v-model="model.member_type">
                    <Radio :label="0">自定义创建单个评价会员</Radio>
                    <Radio :label="1">读取商城会员</Radio>
                </RadioGroup>
            </FormItem>
            <div class="next-box vip">
                <!-- 自定义创建 -->
                <div v-if="model.member_type === 0">
                    <FormItem label="会员昵称：" prop="nickname">
                        <Input v-model="model.nickname" class="width-340" placeholder="请输入" :maxlength="16" show-word-limit/>
                    </FormItem>
                    <FormItem label="会员头像：" class="r-form-item-checkbox" prop="avatar">
                        <kdx-image-video type="image" @on-change="changeThumb" :current="model.avatar"></kdx-image-video>
                    </FormItem>
                    <FormItem label="会员等级：">
                        <Select v-model="model.level_id" class="width-340">
                            <Option value="0">随机等级</Option>
                            <Option v-for="item in level_list" :key="item.id" :value="item.id">
                                {{item.level_name}}
                            </Option>
                        </Select>
                        <Button type="text" class="marginR-10 marginL-10" @click="getLevel">刷新</Button>
                        <Button type="text" @click="jumpLevel">创建会员等级</Button>
                    </FormItem>
                </div>
                <!-- 读取商城会员 -->
                <div class="vip-selector" v-else>
                    <FormItem label="" :label-width="0" prop="member_id">
                        <Button class="default-primary" @click="showSelector">{{model.member_id?'重新选择':'选择会员'}}</Button>
                        <div class="marginT-10" v-if="model.member_id">已选择{{vipList.length}}位会员</div>
                        <kdx-hint-text>建议选择的会员数量与评价文字条数对应匹配，每条评价对应一个会员；数量不对应时随机匹配</kdx-hint-text>
                    </FormItem>
                </div>
            </div>
            <FormItem label="评价时段：" prop="start_time">
                <DatePicker v-model="model.date" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择" @on-change="changeDate" class="width-340"></DatePicker>
                <kdx-hint-text>系统将在选择的时段内随机创建评价时间</kdx-hint-text>
            </FormItem>
            <FormItem label="显示状态：">
                <RadioGroup v-model="model.status">
                    <Radio :label="1">显示</Radio>
                    <Radio :label="0">隐藏</Radio>
                </RadioGroup>
            </FormItem>
        </Form>

        <vip-selector ref="VipSelector" :currentList="vipList" multiple @on-change="getVipList"></vip-selector>
    </div>
</template>

<script>

    import VipSelector from '@/components/selector/VipSelector'

    export default {
        name: "ManualAdd",
        components: {
            VipSelector
        },
        props: {},
        data() {
            return {
                model: {
                    level: 5,
                    member_type: 0,
                    nickname: '', // 会员昵称
                    avatar: '', // 会员昵称
                    level_id: '0',
                    member_id: '',
                    date: [],
                    start_time: '',
                    end_time: '',
                    status: 1,
                    comment_data: [
                        {
                            content: '',
                            images: []
                        }
                    ],
                },
                level_list: [],
                vipList: [],
                rules: {
                    start_time: [
                        { required: true, message: '评价时间必填' }
                    ],
                    nickname: [
                        { required: true, message: '会员昵称必填' }
                    ],
                    avatar: [
                        { required: true, message: '头像必填' }
                    ],
                    member_id: [
                        { required: true, message: '会员必选' }
                    ],
                },
                columns: [
                    {
                        title: '评价文字',
                        key: 'content',
                        slot: 'content'
                    },
                    {
                        title: '评价图片',
                        key: 'images',
                        slot: 'images',
                        width: 270,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 60,
                        render: (h, params) => {
                            if (params.index===0) {
                                return (
                                    <div></div>
                                )
                            }
                            return (
                                <Button type="text" onClick={()=> {this.handleDelete(params.index)}}>删除</Button>
                            )
                        }
                    }
                ]
            }
        },
        computed: {},
        created() {
            this.getLevel()
        },
        mounted() {
        },
        methods: {
            chooseStart(data) {
                this.model.level = data
            },
            changeDate(date) {
                this.model.start_time = date[0]
                this.model.end_time = date[1]
            },
            getLevel() {
                this.$api.memberApi.getLevelList({is_all: 1}).then(res => {
                    if (res.error === 0) {
                        this.level_list = res.list;
                    }
                })
            },
            jumpLevel() {
                this.$utils.openNewWindowPage('/member/grade/add')
            },
            changeThumb(path) {
                this.model.avatar = path
                this.$refs.form.validateField('avatar')
            },
            showSelector() {
                this.$refs['VipSelector'].setValue();
            },
            getVipList(data) {
                let ids = data.map(item => item.id);
                this.model.member_id = ids.join();
                this.vipList = data;
            },
            thumbAllChange(pathList, index) {
                this.model.comment_data[index].images = pathList;
            },
            addComment() {
                this.model.comment_data.push({
                    content: '',
                    images: []
                })
            },
            handleDelete(index) {
                this.model.comment_data.splice(index, 1)
            },
            validateForm() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.handleParams();
                    }
                })
            },
            handleParams() {
                let params = this.model;
                if (params.member_type === 1) {
                    delete params.nickname
                    delete params.avatar
                    delete params.level_id
                } else if (params.member_type === 0) {
                    delete params.member_id
                }
                delete params.date;
                this.$emit('submit', params)
            },
            reset() {
                this.model = {
                    level: 5,
                    member_type: 0,
                    nickname: '', // 会员昵称
                    avatar: '', // 会员昵称
                    level_id: '0',
                    member_id: '',
                    date: [],
                    start_time: '',
                    end_time: '',
                    status: 1,
                    comment_data: [
                        {
                            content: '',
                            images: []
                        }
                    ],
                }
                this.$refs['form'].resetFields()
            }
        },
    }
</script>

<style lang="scss" scoped>
    .manual-add {
        padding: 40px;
        min-height: 100%;
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
            .vip-selector {
                margin-left: 20px;
                .marginT-10 {
                    line-height: 20px;
                }
            }
            &.vip {
                /*/deep/ .show-img ul > li {
                    margin-bottom: 0;
                }*/
            }
        }
        .comment-bg {
            padding: 20px;
            background-color: #f4f6f8;
            border-radius: 2px;
            .comment-table {
                padding: 0 20px;
                max-width: 988px;
                background-color: #fff;
            }
            .ivu-btn {
                width: 100%;
                padding-top: 16px;
                padding-bottom: 16px;
                height: inherit;
            }
            .swiper-img {
                /deep/ .slide-image {
                    ul {
                        margin-bottom: 0;
                        > .img-li{
                            line-height: 40px;
                            margin-right: 10px;
                            margin-bottom: 10px;
                            &:nth-child(5n) {
                                margin-right: 0;
                            }
                        }
                    }
                    .slide-image-add {
                        margin-bottom: 0;
                        border: 1px solid $border-color;
                        background-color: #fff;
                        .text-icon .icon {
                            display: block;
                            padding-bottom: 0;
                            font-size: 16px;
                            color: $text-third;
                        }
                        .text-icon > span {
                            display: none;
                        }
                    }
                }
            }
        }
        /deep/ .show-img ul{
            margin-bottom: 0;
            li {
                margin-bottom: 0;
            }
            > .add {
                margin-bottom: 0;
                background-color: #fff;
                border: 1px solid $border-color;
            }
        }
    }
</style>