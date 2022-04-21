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
    <kdx-modal-frame :value="value" title="快速导入数据" cancelText="关闭" okText="导入" @on-cancel="handleCancel" @on-ok="handleOk">
        <div class="content">
            <kdx-hint-alert style="margin-bottom: 10px">
                <p>一条数据为一行，一条数据内包含多个字段时需要用英文“, ”隔开。添加多条时需要进行换行添加。</p>
            </kdx-hint-alert>
            <Input v-model="data" type="textarea" :autosize="{minRows: 12}" placeholder=""/>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "FastImport",
        components: {},
        props: {
            value: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                data: ''
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            handleCancel() {
                this.$emit('input', false)
            },
            handleOk() {
                if (!this.data) {
                    // 关闭弹窗
                    this.handleCancel();
                    return
                }
                // 确定导入
                let dataArr = this.data.split(/[\n\r]/g); // 获取填写的数据
                let result = dataArr.map(item => {
                    return [...item.split(',').filter(val => val&&val.trim())]
                });
                result = result.filter(item => item.length);
                // 关闭弹窗
                this.handleCancel();
                this.$emit('ok', result); // 传递数据
            }
        },
    }
</script>

<style lang="scss" scoped>
    .content {
        padding: 10px 20px 60px;
    }
</style>