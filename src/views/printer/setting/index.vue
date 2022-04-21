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
        <div class="content">
            <kdx-form-title>打印设置</kdx-form-title>
            <Form
                :model="model"
                :label-width="120"
                ref="form"
                @submit.native.prevent
            >
            </Form>
        </div>
        <template #btn>
            <Button
                type="primary"
                class="btn"
                @click="submitData"
            >保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
export default {
    data() {
        return {
            model: {
                time: []
            }
        }
    },
    mounted() {
        this.getInfo()
    },
    methods: {
        getInfo() {
            this.$api.printerApi.getPrintSet().then(res=> {
                if(res.error == 0) {
                    console.log(res)
                }
            })
        },
        submitData() {
            this.$api.printerApi.setPrintSet(this.model).then(res=> {
                if(res.error == 0) {
                    this.$Message.success('操作成功')
                    this.getInfo()
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    background-color: #fff;
    padding: 30px 40px;
    min-height: 100%;
    margin: 0 auto 0;

    /deep/ .ivu-form-item-label {
        line-height: 32px;
        padding: 0 10px 0 0;
    }
}
</style>