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
        <div class="wechat-config">
            <kdx-hint-alert :show-icon="false">
                一个店铺只能绑定一个微信公众号，为保证所有功能正常，授权时请保持默认选择，把权限同意授权给我们平台，如果解除公众号绑定，将不能使用微信系统部分功能
            </kdx-hint-alert>
            <div class="line"></div>
            <div class="top-image flex">
                <div class="channel-img">
                    <img src="@/assets/image/home/wechat.png" alt=""/>
                </div>
                <div class="channel-desc">
                    <div class="title">绑定微信公众号，把店铺和微信进行数据打通
                    <span class="title-label">{{status === 0 ? '未绑定' : '已绑定'}}</span> </div>
                    <div class="desc" v-if="status === 0">绑定后即可在这里管理您的公众号，我们提供比微信官方后台更强大的功能！</div>
                    <div class="desc" v-else>
                        您的店铺已获得该公众号的所有接口权限,可以正常对接微信，如果使用中发现接口有异常
                        手动授权请 <Button type="text" @click="testConfig">点击测试</Button> 是否成功
                    </div>
                </div>
            </div>
            <div class="wachat-content">
                <!--未绑定时显示-->
                <wechat-guide v-if="status === 0"></wechat-guide>
                <!--已绑定时显示-->
                <wechat-info v-else :data="data"></wechat-info>
            </div>
        </div>
    </kdx-content-bar>
</template>

<script>
import WechatGuide from "@/views/home/wechat/config/components/WechatGuide";
import WechatInfo from "@/views/home/wechat/config/components/WechatInfo";
export default {
    name: "index",
    components: {
        WechatGuide,
        WechatInfo
    },
    data() {
        return {
            status: 1,
            data: {}
        };
    },
    created() {
        this.status = this.$route.path === '/home/wechat/config/achieve' ? 1 : 0;
        if (this.status === 1) {
            this.getWechatConfig();
        } else {
            this.addQuery();
        }
    },
    methods: {
        testConfig() {
            let params = {
                app_id: this.data.app_id,
                secret: this.data.secret
            }
            this.$api.homeApi.testWechatConfig(params).then(res => {
                if (res.error === 0) {
                    this.$Message.success('手动授权成功');
                }
            })
        },
        getWechatConfig() {
            this.$store.dispatch('channel/getWechatInfo', true).then(({data}) => {
                this.data = data || {};
                // 当app_id和secret不存在时，则代表没有绑定
                if (!this.data.app_id && !this.data.secret) {
                    this.status = 0;
                }
                this.addQuery();
            })

        },
        addQuery() {
            let path = this.status === 1 ? '/home/wechat/config/achieve' : '/home/wechat/config/not';
           (path !== this.$route.path) && this.$router.replace({
                path
            });
        }
    }
};
</script>

<style scoped lang="scss">
.wechat-config {
    //height: 10px;
    background-color: #ffffff;
    height: 100%;
    .line {
        height: 10px;
        background-color: $background-color;
    }

    .top-image {
        align-items: center;
        width: 100%;
        height: 120px;
        overflow: hidden;
        border: 1px solid $border-color;
        box-sizing: border-box;
        border-radius: 4px;
        background-size: cover;
        background-image: url("~@/assets/image/home/bg-wx.png");
        background-color: #1BB723;

        .channel-img {
            display: flex;
            align-items: flex-end;
            height: 100%;
            padding-left: 70px;
        }

        .channel-desc {
            margin-left: 50px;
            color: #ffffff;

            .title {
                font-weight: bold;
                font-size: 22px;
                line-height: 34px;
            }
            .title-label {
                //margin-left: 10px;
                background-color: #2AA000;
                padding: 1px 3px;
                font-size: 14px;
            }

            .desc {
                margin-top: 10px;
                line-height: 22px;
                font-size: 14px;
                opacity: 0.8;
            }
        }
    }
    .wachat-content {
        padding: 30px 40px;
    }
}
</style>
