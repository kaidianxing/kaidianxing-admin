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
    <div class="wechat-guide">
        <div class="header">
            <div>
                微信给不同类型公众号提供不同的接口，我们能提供的功能也不相同：
            </div>
            <div class="content">
                <div class="left">
                    我没有账号，
                    <Button type="text" target="_blank" to="https://mp.weixin.qq.com/">去设置</Button>
                </div>
                <div class="right">
                    <Button type="text" target="_blank" to="https://mp.weixin.qq.com/">了解更多区别</Button>
                </div>
            </div>
        </div>
        <div class="wechat-guide-content">
            <div class="table-header">
                <div v-for="(item, index) in columns" :key="index">{{item.title}}</div>
            </div>
            <div class="table-content">
                <div class="table-item" v-for="(item, index) in data" :key="index">
                    <div v-for="(column, columnIndex) in columns" :key="columnIndex">
                        <div class="icon iconfont icon-yes" v-if="item[`${column.key}Type`] === 'icon'"></div>
                        <div class="name" v-else>{{item[column.key] || ''}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <Button class="btn-success" to="/home/wechat/config/settings">手动添加公众号</Button>
        </div>
    </div>
</template>

<script>
const columns =  [
    {
        key: 'title',
        title: '',
    },
    {
        key: 'subscriptionNo',
        title: '未认证订阅号',
    },
    {
        key: 'subscription',
        title: '认证订阅号',
    },
    {
        key: 'serviceNo',
        title: '未认证服务号',
    },
    {
        key: 'service',
        title: '认证服务号',
    },
]
const data = [
    {
        title: '消息自动回复',
        subscriptionNoType: 'icon',
        subscriptionType: 'icon',
        serviceNoType: 'icon',
        serviceType: 'icon'
    },
        {
        title: '微信自定义菜单',
        subscriptionNo: '',
        subscriptionType: 'icon',
        serviceNoType: 'icon',
        serviceType: 'icon'
    },
        {
        title: '群发/定时群发',
        subscriptionNo: '',
        subscriptionType: 'icon',
        serviceNo: '',
        serviceType: 'icon'
    },
        {
        title: '高级客户管理',
        subscriptionNo: '',
        subscription: '部分功能',
        serviceNo: '',
        serviceType: 'icon'
    },
    {
        title: '消息自动回复',
        subscriptionNo: '',
        subscription: '',
        serviceNo: '',
        serviceType: 'icon'
    },
]
export default {
    name: "WechatGuide",
    data() {
        return {
            columns: columns,
            data: data
        };
    },
};
</script>

<style scoped lang="scss">
.wechat-guide {
}

.header {
    @include font-16-22;
    color: $text-first;
    padding-bottom: 10px;

    > .content {
        display: flex;
        justify-content: space-between;
    }
}

.wechat-guide-content {
    border: 1px solid #E9EDEF;

    .table-header {
        background-color: $background-color;
        display: flex;
        align-items: center;
        text-align: center;

        > div {
            padding: 16px;
            text-align: center;
            @include font-14-20-bold;
            color: $text-first;
            flex: 1;
        }
    }

    .table-content {
        .table-item {
            display: flex;
            align-items: center;
            min-height: 52px;
            padding: 14px 10px;
            @include font-14-20;
            color: $text-first;
            border-bottom: 1px solid #E9EDEF;
            >div {
                flex: 1;
                text-align: center;
            }

            &:last-child {
                border-bottom-width: 0;
            }

            .icon {
                font-size: 24px;
                color: $success-color;
            }
        }
    }
}

.footer {
    padding-top: 20px;

    .ivu-btn {
        padding: 6px 24px;
    }

    .btn-success {
        border-radius: 2px;
        background: #1BB723;
        color: #fff;
    }
}
</style>
