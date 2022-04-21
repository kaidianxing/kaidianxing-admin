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
    <div class="create">
        <!-- 直播步骤 -->
        <create-step :step="step"></create-step>
        <!-- 直播类型 -->
        <create-style
            @on-next="nextHandler"
            v-show="step == 0"
        ></create-style>
        <!-- 基本信息 -->
        <create-basic
            v-show="step == 1"
            @on-next="nextHandler"
            @on-back="backHandler"
        ></create-basic>
        <!-- 直播配置 -->
        <create-setting
            v-show="step == 2"
            :loading="loading"
            @on-next="nextHandler"
            @on-back="backHandler"
        ></create-setting>
        <!-- 直播间弹窗 -->
        <create-modal
            v-model="show"
            @on-success="handlerAction"
            @on-cancel="handleClose"
        ></create-modal>

        <!-- 商品货架 -->
        <goods-modal
            :modal-title="getModalInfo.modalTitle"
            :title="getModalInfo.title"
            :subtitle="getModalInfo.subtitle"
            :download="getModalInfo.download"
            :imgurl="codeImg"
            :value="showModal"
            @on-cancel="closeModal"
        ></goods-modal>
        <slot></slot>
    </div>
</template>

<script>
import CreateStep from './components/create/CreateStep'
import CreateBasic from './components/create/CreateBasic'
import CreateStyle from './components/create/CreateStyle'
import CreateSetting from './components/create/CreateSetting'
import CreateModal from './components/create/CreateModal'
import GoodsModal from './components/modal/GoodsModal'
export default {
    components: {
        CreateStep,
        CreateStyle,
        CreateBasic,
        CreateSetting,
        CreateModal,
        GoodsModal
    },
    data() {
        return {
            step: 0,
            show: false,
            model: {
                broadcast_type: '0',
                screen_type: '0',
                start_time: '',
                end_time: '',
                cover_img: '',
                cover_img_media_id: '',
                share_img: '',
                share_img_media_id: '',
                close_like: '0',
                close_goods: '0',
                close_comment: '0',
                title: '',
                anchor_name: '',
                anchor_wechat: ''
            },
            room_id: '',
            broadId: '',
            codeType: '',
            showModal: false,
            codeImg: '',
            loading: false
        }
    },
    computed: {
        getModalInfo() {
            if (this.codeType == 3) {
                return {
                    modalTitle: '小程序推流入口',
                    title: '主播可通过微信扫以下小程序码或搜一搜“小程序直播”进入主播小程序进行推流',
                    subtitle: '（小程序码7天内有效）',
                }
            } else {
                return {
                    modalTitle: '分享直播间',
                    title: this.model.title,
                    subtitle: '分享直播间（小直播间30天内有效）',
                    download: true,
                }
            }
        }
    },
    methods: {
        nextHandler(data) {
            this.model = { ...this.model, ...data }

            if (this.step == 2) {
                this.submitData()
            } else {
                this.step += 1;
            }
        },
        backHandler() {
            this.step -= 1;
        },
        submitData() {
            this.loading = true
            this.$api.liverApi.createLiver(this.model).then(res => {
                if (res.error === 0) {
                    this.room_id = res.id
                    this.broadId = res.broadcast_room_id
                    this.show = true
                }
            }).finally(() => {
                this.loading = false
            })
        },
        handlerAction(code) {
            this.show = false
            if (code == 2) {
                this.$router.push(
                    {
                        path: '/liver/action/operate',
                        query: {
                            id: this.room_id
                        }
                    })
            } else if (code == 3) {
                this.codeType = code
                this.codeImg = require('@/assets/image/liver/start_code.png')
                this.showModal = true
            } else {
                this.codeType = code
                this.handlerCode()
            }


        },
        // 获取二维码
        handlerCode() {
            this.$api.liverApi.getCodeImg({ room_id: this.room_id, broadcast_room_id: this.broadId }).then(res => {
                if (res.error == 0) {
                    this.codeImg = res.url
                    this.showModal = true
                }
            })

        },
        handleClose() {
            this.$router.go(-1)
        },
        closeModal() {
            this.showModal = false
            this.$router.go(-1)
        }
    },
}
</script>

<style lang="scss" scoped>
.create {
    margin-top: 20px;
}
</style>
