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
    <kdx-modal-frame
        :width="670"
        v-model="value"
        title="创建直播间"
        footerHide
        @on-cancel="visbileChange"
    >
        <div class="create-modal">
            <div class="create-modal-icon">
                <i class="iconfont icon-chenggong-shixin"></i>
            </div>
            <p class="create-modal-title">成功创建直播间</p>
            <div class="action">
                <div
                    class="action-item"
                    :class="actionIndex == action.id?'active': ''"
                    v-for="(action, index) in actions"
                    :key="index"
                    @click="clickItem(action.id)"
                >{{action.title}}</div>
            </div>
            <Button type="primary" @click="successHandler">完成</Button>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        showModal: {
            get(){
                return this.value
            },
            set(val){
                this.$emit('input', val)
            }
        }
    },
    data() {
        return {
            actions: [{
                id: 1,
                title: '分享此直播间'
            }, {
                id: 2,
                title: '去添加运营资源'
            }],
            actionIndex: 1
        }
    },
    methods: {
        clickItem(id){ 
            this.actionIndex  = id
        },
        successHandler(){
            this.$emit('on-success', this.actionIndex)
        },
        visbileChange(e){
            this.$emit('on-cancel', e)
        }
    }
}
</script>
<style lang="scss" scoped>
.create-modal {
    padding: 30px 0 20px;
    text-align: center;

    &-icon {
        margin-bottom: 20px;
        height: 64px;
        .iconfont {
            font-size: 64px;
            color: #19be6b;
        }
    }

    &-title {
        margin-bottom: 60px;
        font-size: 18px;
        line-height: 25px;
        color: #262b30;
    }

    .action {
        margin: 0 auto 60px;
        width: 520px;
        display: flex;
        justify-content: center;

        &-item {
            border: 1px solid #e9edef;
            border-radius: 2px;
            width: 160px;
            height: 60px;
            font-size: 12px;
            line-height: 60px;
            color: #636669;
            background-color: #fff;
            cursor: pointer;

            &.active {
                background: #fafdff;
                border: 1px solid $brand-color;
            }

            &:last-child {
                margin-left: 30px;
            }
        }
    }

    .ivu-btn {
        width: 100px;
    }
}
</style>