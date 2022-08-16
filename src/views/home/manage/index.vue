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
    <kdx-content-bar :loading="loading">
        <div class="channel-manage">
            <div class="manage-box" v-if="list.length > 0">
                <kdx-form-title :hasMargin="false">渠道管理</kdx-form-title>
                <channel-list :data="list" @on-buy="buyChannel" @on-config="handleConfig" @on-manage="handleMessage"
                              @on-change="changeStatus"></channel-list>
            </div>
        </div>
    </kdx-content-bar>
</template>

<script>
import ChannelList from './components/ChannelList'

export default {
    name: 'index',
    components: {ChannelList},
    data() {
        return {

            list: [],
            loading: false,
            buy: {
                data: {}
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        buyChannel(item) {
            this.buy.data = item;
            this.$nextTick(() => {
                this.$refs['app_recharge'].setValue();
            })
        },
        getList() {
            this.loading = true;
            this.$api.homeApi.getChannelList().then(res => {
                this.loading = false;
                if (res.error === 0) {
                    this.list = res.list || [];
                }
            })
        },
        handleConfig(type) {
            if (type === 'wechat') {
                this.$router.push({
                    path: '/home/wechat/config/not',
                })
            } else {
                this.$router.push({
                    path: `/home/config/${type}`,
                })
            }
        },
        handleMessage(type) {
            let url = ''
            switch (type) {
                case 'wx':
                    url = '/home/config/wx'
                    break;
                case 'wechat':
                    url = '/home/wechat/config/achieve'
                    break;
                case 'pc':
                    url = '/home/pc/goods/list'
                    break;
                case 'douyin':
                    url = '/home/config/douyin'
                    break;
                case 'tt':
                    url = '/home/config/tt'
                    break;
                default:
                    url = `/home/config/${type}`
                    break;
            }
            this.$router.push({
                path: url,
            })
        },
        // 修改h5渠道状态
        changeStatus(params) {
            this.loading = true
            this.$api.homeApi.setChannelStatus(params).then((res) => {

                if (res.error === 0) {
                    this.$Message.success('渠道状态修改成功')
                    this.getList()
                }
            }).finally(() => {
                this.loading = false
            })
        },
    }
}
</script>

<style scoped lang="scss">
.channel-manage {
    background-color: #ffffff;
    padding: 40px 40px 0 40px;
    min-height: 100%;
    margin-top: 20px;

    .manage-box {
        padding-bottom: 60px;
    }
}
</style>
