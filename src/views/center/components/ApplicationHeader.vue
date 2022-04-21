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
    <div class="header">
        <kdx-header-bar type="little">
            <template #header>
                <div class="box">
                    <div class="box-tit">应用</div>
                    <div class="box-desc">应用营销插件  助力商城运营</div>
                </div>
            </template>
            <Form ref="form" :label-width="100" inline @submit.native.prevent>
                <FormItem label="应用名称：">
                    <Input
                        type="text"
                        class="width-340"
                        placeholder="应用名称"
                        v-model="searchData.keywords"
                        @on-enter="handleSearch"
                    />
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
    </div>
</template>

<script>
export default {
    props: ['keywords'],
    data() {
        return {
            searchData: {
                keywords: '',
                type: '',
            },
            statusList: [
                {
                    id: 'all',
                    name: '全部'
                },
                {
                    id: '',
                    name: '业务插件'
                },
                {
                    id: '',
                    name: '营销玩法'
                },
                {
                    id: '',
                    name: '辅助工具'
                }
            ],
        }
    },
    watch: {
        keywords(value) {
            this.searchData.keywords = value
        },
    },
    methods: {
        // 搜索
        handleSearch() {
            let model = {...this.searchData};
            model.type = model.type === 'all' ? '' : model.type;
            this.$emit('handleSearch', model)
        },
        // 重置
        handleReset() {
            this.$emit('handleReset')
        },
    },
}
</script>

<style lang="scss" scoped>
.header {
    background: #FAFAFF;
    overflow: hidden;
    /deep/ .header-bar {
        margin-bottom: 0;
    }
    /deep/ .header-bar .little {
        height: 60px;
        background-color: transparent;
        padding: 0 30px 0 20px;
    }
    .box {
        height: 34px;
        display: flex;
        align-items: flex-end;
        color: #1C2C3C;
        .box-tit {
            font-weight: bold;
            font-size: 24px;
            line-height: 34px;
        }
        .box-desc {
            font-size: 14px;
            line-height: 26px;
            margin-left: 20px;
        }
    }
}
</style>
