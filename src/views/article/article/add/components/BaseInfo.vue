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
    <div>
        <Form ref="form" :model="model" :label-width="120" :rules="rule"  @submit.native.prevent>
            <kdx-form-title>基本信息</kdx-form-title>
            <FormItem label="文章标题：" prop="title">
                <Input
                    v-model="model.title"
                    type="textarea"
                    :autosize="{ minRows: 1 }"
                    maxlength="64"
                    show-word-limit
                    class="width-430 limit-input"
                    @on-blur="checkTitle"
                    placeholder="请输入文章标题" />
            </FormItem>
            <FormItem label="文章封面：" prop="cover">
                <kdx-image-video
                    type="image"
                    :limit="3"
                    :multiple="true"
                    :current-list="model.cover"
                    is-drag
                    @on-change="changeCover" >
                </kdx-image-video>
                <kdx-hint-text>
                    用于展示文章列表和装修显示，图片建议尺寸800*600像素，最多可上传3张用于三图样式，其他样式默认使用第一张，同时大图样式将对图片做裁剪处理。
                    <kdx-hint-tooltip
                        type="image"
                        :image="require('@/assets/image/example/article/article_cover.png')">
                    </kdx-hint-tooltip>
                </kdx-hint-text>
            </FormItem>
            <FormItem label="文章简介：" prop="digest">
                <Input
                    v-model="model.digest"
                    type="textarea"
                    :autosize="{ minRows: 1 }"
                    maxlength="120"
                    show-word-limit
                    class="width-430 limit-input"
                    placeholder="请输入文章简介"/>
                <kdx-hint-text>用于展示文章列表的简介信息。</kdx-hint-text>
            </FormItem>
            <FormItem label="选择分组：" prop="group_id">
                <Select
                    class="width-340"
                    v-model="model.group_id"
                    placeholder="请选择分组">
                    <Option
                        v-for="item in groupList"
                        :key="item.id"
                        :value="item.id">
                        {{ item.name }}
                        </Option>
                </Select>
                <Button class="add-group" :disabled="noManagePerm" type="text" @click="addGroup" >
                    新增分组
                    <!-- <span class="icon iconfont icon-line-right" ></span> -->
                </Button>
            </FormItem>
            <FormItem label="作者名称：" prop="author">
                <Input
                    v-model="model.author"
                    type="text"
                    maxlength="12"
                    show-word-limit
                    class="width-340 limit-input"
                    placeholder="请输入作者名称"/>
                <!-- <hint-text>用于展示文章列表上的简介信息</hint-text> -->
            </FormItem>
            <FormItem label="文章排序：" prop="display_order">
                <Input
                    v-model.number="model.display_order"
                    maxlength="4"
                    class="width-160"
                    placeholder="请输入文章排序"/>
                <kdx-hint-text>
                    最多4位数字, 数字越大, 排名越靠前,默认排序为创建时间
                </kdx-hint-text>
            </FormItem>
        </Form>
        <!-- 新增分组 -->
        <add-group-modal ref="groupModal" @success="getGroup"></add-group-modal>
    </div>
</template>

<script>
import addGroupModal from "../../../components/addGroupModal";
export default {
    components: { 
        addGroupModal,
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        value: {
            type: Object,
            default: () => {}
        },
        addressData: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            web_key: "",
            amap_key: "",
            amap_code: "",
            location: '', // 位置
            model: {
                type: "0",
                title: "",
                activity_start_time: "",
                activity_end_time: "",
                sign_start_time: "",
                sign_end_time: "",
                telephone: "",
                selectedAddress: [],
                detail: "",
                lng: "",
                lat: "",
                check_mobile: "0",
                check_form: '0',
                form_id: '',
                form_name: '',
                cover: [],
                digest: "",
                group_id: "",
                author: "",
                display_order: "",
            },
            groupList: [],
        };
    },
    created() {
        this.getGroup();
        this.getAMapKey();
    },
    watch: {
        value: {
            handler(newValue) {
                this.model = newValue
            },
            immediate: true,
            deep: true,
        },
        model: {
            handler(newValue) {
                this.$emit('input', newValue);
            },
            deep: true
        },
    },
    computed: {
        noManagePerm(){
            return !this.$getPermMap('article.group.manage')
        },
        //自定义表单应用权限
        appFormPerm(){
            return this.$getAppPermMap('diyform')
        },
        rule() {
            let message = "文章标题必填";
            let maxMessage = "文章标题长度不能大于64位";
            return {
                title: [{ required: true, message, }, { max: 64, message: maxMessage }],
                activity_start_time: [{ required: true, message: '报名开始时间必填' }],
                activity_end_time: [
                    { required: true, message: '报名结束时间必填' },
                    { validator: (rule, value) => this.model.activity_start_time && new Date(value) >= new Date(this.model.activity_start_time), message: '结束时间要大于开始时间'}
                ],
                sign_start_time: [
                    { required: true, message: '签到开始时间必填' },
                    { validator: (rule, value) => this.model.activity_end_time && new Date(value) >= new Date(this.model.activity_end_time), message: '签到开始时间不得早于报名结束时间'}
                ],
                sign_end_time: [
                    { required: true, message: '签到结束时间必填' },
                    { validator: (rule, value) => this.model.sign_start_time && new Date(value) >= new Date(this.model.sign_start_time), message: '结束时间要大于开始时间'}
                ],
                telephone: [{required: true, message: '联系电话必填'}],
                selectedAddress: [{ required: true, message: '活动地址必选' }],
                detail: [{ required: true, message: '详细地址必填' }],
                cover: [{ required: true, message: "文章封面必选" }],
                digest: [{ max: 120, message: '文章简介长度不能大于120位' }],
                author: [{ max: 12, message: '作者名称长度不能大于12位' }],
                group_id: [{ required: true, message: "文章分组必选" }],
                form_id: [{ required: true, message: "报名表单必选" }],
                display_order: [
                    {
                        pattern: /^(0|[1-9][0-9]{0,4})$/,
                        message: "文章排序为数字类型，最长为4位数",
                    },
                ],
            }
        }
    },
    methods: {
        // 获取全局设置中的高德key
        getAMapKey() {
            this.$api.orderApi.getContactDetail({}).then((res) => {
                if(res.error == 0) {
                    this.amap_key = res?.data?.amap_key || '';
                    this.amap_code = res?.data?.amap_code || '';
                    this.web_key = res?.data?.web_key || '';
                    setTimeout(() => {
                        if(this.$refs.amap) {
                            this.$refs.amap.changeKey(this.amap_key, this.amap_code)
                        }
                    }, 500)
                }
            })
        },
        // 搜索地图
        searchMap() {
            setTimeout(()=> {
                this.location = `${this.model.selectedAddress.join('')}${
                    this.model.detail
                }`
                if(this.location) {
                    this.$nextTick(()=> {
                        this.$refs.amap.geocoder('getLocation')
                    })
                }
            },800)
        },
        // 获取地址信息
        getAddress(data) {
            if (data.selectedAddress) {
                this.model.selectedAddress = [...data.selectedAddress]
            }
            if (data.address) {
                this.model.detail = data.address
            }
            this.model.lng = data.lng
            this.model.lat = data.lat
            // 校验地址是否发生变化
            if (
                (this.model.lng !== this.cacheModel?.address?.lng &&
                    this.cacheModel?.address?.lng) ||
                (this.model.lat !== this.cacheModel?.address?.lat &&
                    this.cacheModel?.address?.lat)
            ) {
                this.$Message.warning('店铺地址发生变化，注意及时保存哦')
            }
        },
        // 高德初始化完成
        aMapInitFinished() {
            // 添加标记
            if (this.model.lng && this.model.lat) {
                // 存在地址信息，初始化
                let formattedAddress = `${this.model.selectedAddress.join('')}${
                    this.model.detail
                }`
                this.$refs['amap'].addMarker(
                    this.model.lng,
                    this.model.lat,
                    formattedAddress
                )
                this.$refs['amap'].setCenter(this.model.lng, this.model.lat)
            }
        },
        // 文章封面
        changeCover(path) {
            this.model.cover = path;
        },
        // 检查标题重复
        checkTitle() {
            if(!this.model.title) {{
                return
            }}
            let params = {
                article_id: this.id,
                title: this.model.title,
            };
            this.$api.articleApi.checkArticleTitle(params);
        },
        changeTime(key, time) {
            this.model[key] = time
        },
        // 获取分组
        getGroup() {
            this.$api.articleApi.getGroupList({
                status: 1
            }).then((res) => {
                if(res.error === 0) {
                    this.groupList = res.list
                }
            })
        },
        checkGoodsForm() {
            this.$refs['form_selector'].toggle().then(res => {
                this.model.form_name = res.name;
                this.model.form_id = res.id;
            })
        },
        // 新增分组
        addGroup() {
            this.$refs.groupModal.setValue();
        },
        validateForm() {
            return new Promise((resolve) => {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        resolve(valid);
                    } else {
                        resolve(valid);
                    }
                })
            })
        }
    },
};
</script>
<style lang='scss' scoped>
.add-group {
    margin-left: 10px;
    .icon {
        font-size: 12px;
        font-weight: bold;
        color: var(--brand-color);
    }
}

.multi-select {
    margin-bottom: 60px;
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
        width: 140px;
        height: 60px;
        font-size: 14px;
        line-height: 20px;
        border-radius: 2px;
        margin-right: 10px;
        &:last-child {
            margin-right: 0;
        }
        .tit {
            font-size: 14px;
            line-height: 20px;
            font-weight: bold;
            color: #262b30;
        }
        .desc {
            font-size: 12px;
            line-height: 16px;
            color: #636669;
            margin-top: 2px;
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
        background-color: #fff;
        border-width: 2px;
        border-color: $brand-color;
        .tit {
            color: $brand-color;
        }
        .icon {
            display: inline-block;
        }
    }
    .permModel {
        display: none;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 20px;
        background: #F4F6F8;
        cursor: pointer;
        &.is_perModel {
            display: flex;
        }
        p {
            font-size: 12px;
            color: #939799;
            line-height: 20px;
            text-align: center;
            display: flex;
            justify-content: center;
            .iconfont {
                font-size: 12px;
                color: #939799;
                line-height: 20px;
            }
            &:hover {
                color: #2D8CF0;
                .iconfont:hover{
                    color: #2D8CF0;
                }
            }
        }
    }
}
/deep/.slide-image-add {
    margin-bottom: 0!important;
}
.date-range {
    display: flex;
    align-items: center;
    /deep/ .ivu-form-item {
        display: flex;
        margin-bottom: 0;
        .ivu-form-item-content {
            .ivu-form-item-error-tip {
                margin-left: 0 !important;
            }
            .ivu-date-picker {
                    .ivu-input-icon-validate {
                    display: none;
                }
            }

        }
    }
}
.search {
    cursor: pointer;
}
.nest-box {
    padding: 30px 20px;
    margin-top: 10px;
    background-color: $background-color;
    .single-one {
        display: flex;
        flex-wrap: wrap;
            .ivu-form-item {
            display: flex !important;
        }
    }
    .ivu-radio-group-vertical .ivu-radio-wrapper{
        height: auto;
        .radio-item {
            display: inline-block;
            &.limit1 {
                margin-bottom: 20px;
            }
            &.limit2 {
                margin-bottom: 0px;
            }
            .hint-text {
                padding-top: 10px;
            }
            /deep/ .ivu-form-item-error-tip {
                padding-top: 3px;
            }
        }
    }
}
.form-input {
    /deep/.ivu-input-wrapper {
        &:hover {
            .ivu-input {
                border-color: $border-color;
            }
        }
        .ivu-input {
            &:disabled {
                background-color: #FFFFFF;
            }
        }
            .ivu-input-group-prepend,
            .ivu-input-group-append {
            background-color: #FFFFFF;
        }
    }
}
.nest-box-form {
    /deep/ .ivu-form-item-error-tip {
        padding-left: 120px;
    }
}
</style>