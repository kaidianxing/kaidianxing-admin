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
/**
 * 会员中心的装修项
 */
export default{
    vipCenter: [
        {
            type: 'member',
            name: '会员信息',
            icon: 'ivu-icon ivu-icon-md-timer'
        }, {
            type: 'bindmobile',
            name: '绑定手机',
            icon: 'ivu-icon ivu-icon-logo-twitch'
        },
        {
            type: 'listmenu',
            name: '列表导航',
            icon: 'ivu-icon ivu-icon-md-reorder'
        }, {
            type: 'icongroup',
            name: '图标组',
            icon: 'ivu-icon ivu-icon-logo-windows'
        }, {
            type: 'menu2',
            name: '按钮组2',
            icon: 'ivu-icon ivu-icon-ios-cube-outline'
        },{
            type: 'logout',
            name: '退出登录',
            icon: 'ivu-icon ivu-icon-logo-twitch',
            show: false
        },
    ],
    base: [//基础组件
        {
            type: 'goods',
            name: '商品组',
            icon: 'iconfont icon-shangpinzu'
        }, {
            type: 'title',
            name: '标题栏',
            icon: 'ivu-icon ivu-icon-ios-contract'
        }, {
            type: 'search',
            name: '搜索框',
            svg: 'sousuo1'
        }, {
            type: 'picture',
            name: '单图组',
            svg: 'dantuzu'
        }, {
            type: 'menu',
            name: '按钮组',
            svg: 'anniuzu'
        },
        // {
        //     type: 'tabbar',
        //     name: '标签页',
        //     svg: 'xuanxiangka'
        // },
        {
            type: 'blank',
            name: '辅助空白',
            svg: 'fuzhukongbai'
        }, {
            type: 'line',
            name: '辅助线',
            icon: 'ivu-icon ivu-icon-ios-crop'
        },
        {
            type: 'video',
            name: '视频',
            svg: 'shipinzu'
        }, {
            type: 'pictures',
            name: '图片展播',
            svg: 'tupianzhanbo'
        }, {
            type: 'richtext',
            name: '富文本',
            svg: 'fuwenben'
        },
        {
            type: 'cube',
            name: '魔方',
            svg: 'cube'
        },
        {
            type: 'hot_area',
            name: '热区',
            svg: 'hot_area'
        },
        {
            type: 'customer',
            name: '客服',
            svg: 'customer'
        }
    ],
    market: [//营销组件
        {
            type: 'coupon',
            name: '优惠券',
            icon: 'ivu-icon ivu-icon-md-timer'
        }, {
            type: 'notice',
            name: '公告',
            icon: 'ivu-icon ivu-icon-logo-twitch'
        },
        {
            type: 'liver',
            name: '小程序直播',
            svg: 'liver'
        },
        {
            type: 'seckill',
            name: '秒杀',
            svg: 'seckill'
        },
        {
            type: 'wxTransaction',
            name: '视频号直播',
            icon: 'iconfont icon-zhibo-mian'
        },
    ],
    other: [{
        type: 'gotop',
        name: '返回顶部',
        icon: 'iconfont icon-fanhuidingbu'
    },{
        type: 'followbar',
        name: '关注条',
        icon: 'iconfont icon-guanzhutiao'
    }]
}
