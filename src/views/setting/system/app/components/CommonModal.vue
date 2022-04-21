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
    <div class="modal" v-show="value" @click.stop>
        <div class="modal-mask"></div>
        <div class="modal-content">
            <div class="close" @click="fnCloseModal" v-if="!loading">
                <Icon type="ios-close" :size="24" />
            </div>
            <div class="logo">
                <img :src="$utils.media(appData.logo)" alt="" @error="$utils.replaceImage($event)" />
            </div>
            <div class="tips">
                <span v-if="step== 0">是否要安装{{appData.name}}{{type=='shop'?'店铺类型':'应用'}}</span>
                <span v-else-if="status == 'wrong'">正在安装{{typeText}}</span>
                <span v-else-if="step > 0&&installPercent!=100">正在安装{{typeText}}  {{installPercent}}%</span>
                <span v-else-if="installPercent == 100">{{typeText}}安装完成</span>
            </div>
            <div class="check">
                <div class="progress" v-if="step > 0">
                    <div class="bg">
                        <div
                            class="current"
                            :style="`width: ${installPercent}%;`"
                        ></div>
                    </div>
                </div>
                 <kdx-hint-text style="text-align:center" v-if="message">{{ message }}</kdx-hint-text>
            </div>
           <div class="btn-wrap" v-if="installPercent == 100">
                <div class="type type2">
                    <Button type="primary" :loading="loading" :long="true" @click="execute">
                        确定
                    </Button>
                </div>
            </div>
            <div class="btn-wrap" v-else-if="step!=0 ">
                <div class="type type2" >
                    <Button type="primary" long :disabled="isPending" @click="resetInstall" :loading="loading">重新安装</Button>
                </div>
            </div>
            <div class="btn-wrap" v-else>
                <div class="type type1" v-if="step == 0">
                    <Button type="primary" :loading="loading" @click="startInstallApp">开始安装</Button>
                    <Button @click="fnCloseModal">取消</Button>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['type','value', 'appData' ],
    data() {
        return {
            step: 0, // 当前环节
            prevStep: 0, // 上次的环节
            message: '', // 安装消息
            status: 'active', // 安装状态
            installPercent: 0, // 安装进度条进度
            timer: null,
            percentTimer: null,
            duration: 1500,
            download: {
                download_page: 0,
                download_total_page: 1
            },
            loading: false,
            isPending: false, // 正在安装
        }
    },
    watch: {
        value(value){
              if(value){
                this.init()
            }
        }
    },
    computed: {
        typeText() {
            return this.type=='shop'? '': '应用'
        }
    },
    methods: {
        fnCloseModal() {
            this.$emit('input', false)
        },
        startInstallApp() {
            this.loading = true
            let params = { identity: this.appData?.identity, app_id: this.appData?.app_id}
            this.$api.systemApi.startInstallApp(params).then(res => {
                if (res.error === 0) {
                    this.startProgress()
                } else if(res.error === 191802) {
                    this.resetUpgrade()
                } else {
                    this.loading = false
                }
            })
        },
        startProgress() {
            this.init()
            this.getAppStatus()
            this.increment()
        },
        init() {
            this.step = 0
            this.prevStep = 0
            this.message = ''
            this.installPercent = 0
            this.status = 'active'
            this.duration = 200
        },
        clear() {
            this.loading = false
            clearTimeout(this.timer)
            clearTimeout(this.percentTimer)
        },
        getAppStatus() {
            this.$api.systemApi.getAppStatus().then(res => {
                let { error, message, step, download_page, download_total_page } = res
                    this.message = message
                // 存储上次进度
                this.prevStep = this.step
                this.step = step

                if ( error== -1) {
                    // 安装报错
                    this.fail()
                    this.clear()
                    // 安装进行中
                    if(step>0) {this.isPending = true}
                }  else if (error === -10002) {
                    // 未登录
                    clearTimeout(this.timer)
                    this.clear()
                } else {
                    if (this.step != 200) {
                        this.download = {
                            download_page,
                            download_total_page
                        }

                        this.timer = setTimeout(() => {
                            this.getAppStatus()
                        }, 1500);
                    } else {
                        this.duration = 100
                        clearTimeout(this.timer)
                    }
                }
            })
        },
        fail() {
            this.status = 'wrong'
        },
        increment() {
            /* 总上线为100 */
            if (this.installPercent + 1 >= 100) {
                this.installPercent = 100
                clearTimeout(this.percentTimer)
                this.loading = false
            }

            /* 当前进度小于应该到达进度 速度加快 */

            if (this.step == 30) {
                // 下载文件 请求速度加快, 采用真实进度对比
                let { download_page, download_total_page } = this.download
                if (download_total_page) {
                    let percent = 20 + parseFloat(60 * (download_page / download_total_page))
                    this.installPercent = +parseFloat(percent).toFixed(2)
                }
                this.duration = 500
            } else if (this.installPercent < this.getLimitPercent(this.step)) {
                this.installPercent++
            }

            /* 循环递增 */
            this.percentTimer = setTimeout(() => {
                clearTimeout(this.percentTimer)
                this.increment()
            }, this.duration);
        },
        getLimitPercent(step) {
            // 模拟当前进度对比总进度的占比
            switch (step) {
                //  20: 获取安装包
                case 20:
                    return 20
                //  30: 下载文件
                case 30:
                    return 80
                // 41: 下载完成
                case 31:
                    return 90
                // 40: 执行安装
                case 40:
                    return 86
                //  41: 执行安装(处理文件)
                case 41:
                    return 92
                // 42: 执行安装(处理数据表) 
                case 42:
                    return 97
                // 43: 执行安装(处理脚本) 
                case 43:
                    return 98
                // 200:安装完成
                case 200:
                    return 100
                default:
                    break;
            }
            return 0
        },
        resetInstall() { // 重新执行更新
            this.startInstallApp({reset: 1})
        },
        execute(){
            this.$emit('on-success')
            this.$emit('input',false)
        }
    },
}
</script>

<style lang="scss" scoped>
.modal {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .modal-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
    }
    .modal-content {
        position: relative;
        background-color: #fff;
        border-radius: 2px;
        padding: 40px 45px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .close {
            position: absolute;
            right: 20px;
            top: 20px;
        }
        .logo {
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .tips {
            font-size: 14px;
            line-height: 20px;
            color: #000000;
            margin-top: 24px;
            &.err {
                color: $danger-color;
            }
        }
        .check {
            padding-top: 10px;
            padding-bottom: 30px;
            .progress {
                width: 250px;
                padding-top: 10px;
                padding-bottom: 6px;
                .bg {
                    position: relative;
                    height: 4px;
                    border-radius: 2px;
                    background-color: #f4f6f8;
                    .current {
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 4px;
                        border-radius: 2px;
                        background: linear-gradient(
                            172.84deg,
                            #29bfff 0%,
                            #0b88fb 94.51%
                        );
                    }
                }
            }
        }
        .btn-wrap {
            width: 250px;
            .type {
                display: flex;
                justify-content: center;
            }
            .type1 {
                button {
                    width: 100px;
                }
                button:nth-child(2) {
                    margin-left: 10px;
                }
            }
        }
    }
}
</style>
