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
    <div class="system-base">
       <div class="system-base-box">
           <Form ref="form">
               <kdx-form-title>
                   检查队列
               </kdx-form-title>
               <FormItem>
                   <kdx-hint-alert class="hint-alert" :showIcon="true">
                       <div class="hint-alert-content">
                           <div class="text">检查系统队列以是否正常执行，保证系统部分业务正常进行，例如 系统数据每日更新、短信发送、消息模板等能够正常收发。</div>
                       </div>
                   </kdx-hint-alert>
                   <Button class="primary-long marginT-20" @click="checkQueue">检查队列</Button>
               </FormItem>

               <kdx-form-title>
                   清除缓存
               </kdx-form-title>
               <FormItem>
                   <kdx-hint-alert class="hint-alert" :showIcon="true">
                       <div class="hint-alert-content">
                           <div class="text">如数据读取有偏差时，清除缓存已确保数据同步。</div>
                       </div>
                   </kdx-hint-alert>
                   <div class="cacheData marginT-10">当前缓存数据：{{ cacheData }}</div>
                   <Button class="primary-long marginT-20" @click="clearCache">立即清除缓存</Button>
               </FormItem>
           </Form>
           <check-modal
               v-model="modalShowFlag"
               :loading="loading"
               :tipsText="tipsText"
               :step="step"
               @input="clickStop"
           />
           <modal-tip @on-ok="handleOk" @on-cancel="handleCancel" :value="modalShow">
               <div class="clearText">
                   确定清除缓存？
               </div>
           </modal-tip>
           <slot></slot>
       </div>
    </div>
</template>

<script>
import CheckModal from "./components/CheckModal";
import ModalTip from './components/ModalTip';
// import { getCacheData, checkQueue, clearCacheData, queueStatus } from '@/api/systemSetting'
export default {
    name: "index",
    components: {
        CheckModal,
        ModalTip
    },
    data() {
        return {
            cacheData: '',
            modalShowFlag: false,
            modalShow: false, // 清除缓存弹窗
            tipsText: '正在检测队列是否正常执行',
            step: '', //表示队列执行状态 0未开始 1执行成功 12执行中断
            loading: false,
            tmp_job_id: '', //队列启动id
            times: 0, //接口轮询次数
            timer: null,
            stopGet: true, //是否中途停止了队列检查
        }
    },
    created() {
        this.getCacheData()
    },
    methods: {
        getCacheData() {
            this.$api.systemApi.getCacheData().then((res) => {
                if (res.error === 0) {
                    this.cacheData = res.redis.used_memory_human
                }
            })
        },
        // 发送队列任务
        checkQueue() {
            this.loading = true
            this.step = '0'
            this.stopGet = true;
            this.modalShowFlag = true;
            this.times = 0;
            this.tipsText = '正在检测队列是否正常执行'
            this.$api.systemApi.checkQueue().then((data) => {
                if (data.error === 0) {
                    this.tmp_job_id = data.tmp_job_id
                    this.queueStatus()
                }
            })
        },
        // 获取队列状态
        queueStatus() {
            if (this.times++ > 50) {
                clearTimeout(this.timer)
                this.loading = false;
                this.step = '12'
                this.stopGet = true
                this.tipsText = '队列异常，请检查队列';
            } else {
                if (!this.stopGet && this.step != '1') {
                    clearTimeout(this.timer)
                    this.stopGet = true
                    this.loading = false
                    this.times = 0;
                    return
                }
                this.$api.systemApi.queueStatus(
                    {tmp_job_id: this.tmp_job_id},
                    {message: false}
                ).then((res) => {
                    if (res.error === 0) {
                        setTimeout(() => {
                            this.loading = false;
                            this.step = '1';
                            this.tipsText = '队列正常运行'
                        }, 1000)
                        clearTimeout(this.timer)
                    } else {
                        clearTimeout(this.timer)
                        this.step = '0'
                        this.timer = setTimeout(this.queueStatus, 1000)
                    }
                })
            }

        },
        // 清除缓存
        clearCache() {
            this.modalShow = true
        },
        handleOk() {
            this.$api.systemApi.clearCacheData({}).then(res => {
                if (res.error === 0) {
                    this.modalShow = false;
                    this.$Message.success('清除成功');
                    this.getCacheData()
                }
            })
        },
        handleCancel() {
            this.modalShow = false;
        },
        clickStop(val) {
            this.stopGet = this.times > 50 ? true : val
        }
    }
}
</script>

<style lang="scss" scoped>
.system-base {
    margin: 20px auto;
    .system-base-box{
        background: #ffffff;
        padding: 20px;
    }
    .form-item-level {
        background-color: $background-color;
        border-radius: 2px;
        padding: 30px 0;

        > div {
            margin-bottom: -30px;
        }
    }

    .marginT-20 {
        margin-top: 20px;
    }

    .marginL-120 {
        margin-left: 120px;
    }
}

.content .clearText {
    margin: 10px 0;
}

</style>