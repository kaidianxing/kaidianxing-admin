/**
* 开店星商城系统1.0
* @author 青岛开店星信息技术有限公司
* @copyright Copyright (c) 2015-2021 Qingdao ShopStar Information Technology Co., Ltd.
* @link https://www.kaidianxing.com
* @warning This is not a free software, please get the license before use.
* @warning 这不是一个免费的软件，使用前请先获取正版授权。
*/
<template>
    <div class="layout">
        <!--        <Header></Header>-->
        <div class="layout-content" :style="{'background-image':`url('${getLoginBg}')`}">
            <router-view></router-view>
            <div class="copyright">
                <p><a href="https://www.kaidianxing.com" target="_blank">青岛开店星信息技术有限公司提供技术支持</a></p>
                <p v-if="setting.icp_code"><a href="https://beian.miit.gov.cn"
                                                  target="_blank">
                    <br/>
                    网站备案号:{{ setting.icp_code || '' }}</a></p>
            </div>
        </div>

    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    data() {
        return {
            setting: {},
        }
    },
    created() {
        this.getInit()
    },
    computed: {
        getLogo() {
            return this.setting?.logo
        },
        ...mapState('config', {
            baseSetting: state => state.baseSetting
        }),
        ...mapState('alone', {
            qrcode_url: state => state.qrcode_url
        }),
        getLoginBg() {
            if (this.setting.login_show_img) {
                return this.setting?.login_show_img.length == '0' ? require('@/assets/image/alone/store/login_bg.png') : this.$utils.media(this.setting?.login_show_img, 'manage')
            } else {
                return require('@/assets/image/alone/store/login_bg.png')
            }
        },
    },
    mounted() {
        document.querySelector('link[rel="icon"]').href = this.$utils.media(this.$store.state?.alone?.setting?.logo);
    },
    methods: {
        getInit() {
            this.$store.dispatch('alone/getInitInfo').then(res => {
                this.setting = res || {}
            })
        },
    }
}
</script>

<style lang="scss" scoped>
@mixin boxshaow-color($color:#333333, $opacity: 0.3) {
    box-shadow: 0px 17px 19px rgba($color, $opacity);;
}

.layout {
    min-height: 100vh;

    &-content {
        display: flex;
        flex-direction: column;
        position: relative;
        min-height: 100vh;
        padding-bottom: 20px;
        overflow-y: scroll;
        //background-image: url("../../../assets/image/alone/member/login_bg.jpg");
        //background-image: url("../../../assets/image/alone/store/bg.png");
        //background-image: url("https://s3-alpha-sig.figma.com/img/a78f/aac7/f3674564f7ed255c777f733d054d5e1d?Expires=1642377600&Signature=hbCdvGwOGe09QXGKzTzREaAb~wddiadgsiMMSzRAYxiMyCoDcaV~hJ-VXxFl19dTkuANZOpTZh5f0cS9I0otFll9fcTLkd~6Yhu3WWuBcQZKRwrMosKFrYR1Mp1uuTnQwVOj7yGiaetfmvoFpK5nCpwM2Id2iCIEHdJGT7Aodayi5CEwl0AKLOci11VsuB1qND1UjCHHrW6Nc~ILADFuKb~KQzkUBiSkjIVqq7Hc4VuFlWa6hnIbsi-JT6G7W52iQZTIWHPVtYVbNtcxOLCkxZI2nUG6020KBXmwKqqtAJWKNqETJXUqw1exFLYmOSFIrUgIk5DZlJyAb44xsZWLVQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA");
        background-color: #f5f7fa;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        box-sizing: border-box;
    }

    /deep/ .login-form {
        .ivu-form .ivu-form-item {
            margin-bottom: 30px;

            &-label {
                padding: 0 0 10px 0;
                font-weight: bold;
                color: #1D2129;
                font-size: 14px;
            }
        }

        .form-input {
            width: 370px;
            position: relative;

            &:focus {
                border: 1px solid red;
            }

            .ivu-input-group-append {
                background: #ffffff;
                width: 50px;
                height: 48px;
                position: absolute;
                z-index: 10;
                top: 1px;
                display: flex;
                border: none;
                align-items: center;
                justify-content: center;
                right: 1px;

                border-left: 1px solid #C9CDD4;
                color: #C9CDD4;
                font-size: 16px;
                font-weight: 600;

            }

            .ivu-input-suffix {
                right: 50px;
                width: 50px;
                z-index: 20;

            }

            .ivu-input {
                border-radius: 2px;
                height: 50px;
                background: #ffffff;
                border-color: #C9CDD4;
                //border: none;
                padding-left: 20px;
                position: relative;
                box-sizing: border-box;

            }


            .ivu-input-suffix i {
                font-size: 22px;
                line-height: 50px;
                cursor: pointer;
                font-size: 22px;
                color: #B8B9BD;

            }

            .ivu-input:focus {
                box-shadow: none;
            }
        }
    }

    .copyright {
        padding-bottom: 20px;
        margin: 20px auto 0;
        text-align: center;
        /deep/ a {
            color: $text-zhushi;
        }
    }
}
</style>>
