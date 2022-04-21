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
    <div class="invoice-add-form-info">
        <Form ref="form" :model="model" :rules="rules" :label-width="120">
           <div class="form-item">
               <kdx-form-title>基本信息</kdx-form-title>
               <FormItem label="模板名称：" prop="name">
                   <Input v-model="model.name" maxlength="20" show-word-limit placeholder="请输入模板名称" class="width-340" @on-blur="handleChange('name', model.name)" />
               </FormItem>
               <FormItem label="快递公司：" prop="express_code">
                   <Select v-model="model.express_code" class="width-340" @on-change="handleChange('express_code', $event)">
                       <Option
                               v-for="item in expressList"
                               :key="item.code"
                               :value="item.code"
                       >
                           {{ item.name }}
                       </Option>
                   </Select>
               </FormItem>
               <FormItem label="选择样式：">
                   <RadioGroup v-model="model.type" @on-change="handleChange('type', $event)">
                       <Radio :label="0">
                           <span>竖版</span>
                       </Radio>
                       <Radio :label="1">
                           <span>横版</span>
                       </Radio>
                   </RadioGroup>
                   <kdx-hint-text v-if="model.type == 0">尺寸为210*290mm(A4)</kdx-hint-text>
                   <kdx-hint-text v-else>尺寸为210*140mm(A5)</kdx-hint-text>
               </FormItem>
           </div>
            <div class="form-item">
                <kdx-form-title>展示内容</kdx-form-title>
                <FormItem label="发货单标题：" prop="send_title">
                    <Input v-model="model.send_title" maxlength="10" show-word-limit placeholder="请输入模板名称" class="width-340" @on-blur="handleChange('title', model.title)"/>
                </FormItem>
                <FormItem label="发货单LOGO：">
                    <kdx-image-video type="image" :current="model.logo" @on-change="handleChange('logo', $event)"></kdx-image-video>
                </FormItem>
                <div class="checkbox-data">
                    <checkbox-data :list="list" :checked-key="checkedKey" @on-change="changeList" @on-change-key="changeKey"></checkbox-data>
                </div>
                <FormItem label="二维码链接：">
                    <Input v-model="model.qr_code" placeholder="请输入二维码链接" class="width-340" @on-blur="handleChange('qr_code', model.qr_code)"/>
                </FormItem>
                <FormItem label="底部信息：">
                    <Input v-model="model.footer" type="textarea" :rows="2" maxlength="40" show-word-limit placeholder="请输入" class="width-340" @on-blur="handleChange('footer', model.footer)"/>
                </FormItem>
            </div>
        </Form>
    </div>
</template>

<script>
    import CheckboxData from "./CheckboxData";

    export default {
        name: "FormInfo",
        components: {
            CheckboxData
        },
        props: {
            expressList: {
                type: Array,
                default: () => []
            },
            model: {
                type: Object,
                default: () => {}
            },
            list: {
                type: Array,
                default: () => []
            },
            checkedKey: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                rules: {
                    name: [
                        {required: true, message: '模板名称不能为空'}
                    ],
                    express_code: [
                        {required: true, message: '快递公司必填'}
                    ],
                    send_title: [
                        {required: true, message: '发货单标题必填'}
                    ]
                },
            };
        },

        methods: {
            changeThumb(image) {
                this.model.logo = image;
                this.$emit('on-change', this.model);
            },
            changeStyle(type) {
                this.model.type = type;
                this.$emit('on-change', this.model);
            },
            handleChange(key, value) {
              this.model[key] = value;
              this.$emit('on-change', this.model);
            },
            changeList(list) {
              this.$emit('on-change-list', list);
            },
            // 当前操作的key值
            changeKey(key) {
              this.$emit('on-change-key', key);
            },
            validate() {
                return new Promise(resolve => {
                    this.$refs['form'].validate(valid => {
                        resolve(valid)
                    })
                })
            }
        }
    };
</script>

<style scoped lang="scss">
    .invoice-add-form-info {
        min-width: 560px;
        background-color: #ffffff;
        padding: 40px;
        overflow-y: auto;
        flex: 1;
        .form-item {
            padding-bottom: 30px;
        }
        .checkbox-data {
            margin-bottom: 30px;
        }
    }
</style>
