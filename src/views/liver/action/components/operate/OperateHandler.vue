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
    <div class="oprate-handler">
        <div class="left">
            <Button
                @click="openModal"
                type="primary"
                v-if="total<200"
            >从商品库导入商品（{{total|| 0}}/200）</Button>
        </div>
        <div class="right">
            <div class="right-label">商品信息：</div>
            <Input
                @on-enter="handleSearch"
                v-model="model.title"
                placeholder="请输入商品名称"
                class="width-340"
            />
            <div class="btn-group">
                <Button
                    type="primary"
                    @click="handleSearch"
                >搜索</Button>
                <Button
                    type="text"
                    @click="handleReset"
                >重置</Button>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        total: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            model: {
                title: ''
            }
        }
    },
    methods: {
        // 搜索
        handleSearch() {
            this.$emit('on-search', this.model)
        },
        handleReset() {
            this.model.title = ''
            this.$emit('on-search', this.model)
        },
        openModal() {
            this.$emit('on-open')
        }
    }
}
</script>

<style lang="scss" scoped>
.oprate-handler {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;

    .left {
        /deep/ .ivu-btn-primary.ivu-btn-ghost {
            margin-left: 20px;
            color: #57a3f3;
            background: rgba(245, 249, 254, 0.5);
        }
    }

    .right {
        display: flex;
        align-items: center;

        &-label {
            text-align: right;
            width: 100px;
            flex-shrink: 0;
        }

        .btn-group {
            display: flex;

            /deep/ .ivu-btn {
                margin-left: 20px;
            }
        }
    }
}
</style>