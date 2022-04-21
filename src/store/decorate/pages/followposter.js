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
 * 首页的装修项
 */
export default {
    base: [ //基础组件
        {
            type: 'poster_bgimg',
            name: '背景图片',
        },  {
            type: 'poster_qrcode',
            name: '二维码',
        }, {
            type: 'poster_shoplogo',
            name: '店铺LOGO',
            icon: 'iconfont icon-haibao-logo'
        },
        {
            type: 'poster_shopname',
            name: '店铺名称',
            icon: 'iconfont icon-haibao-dianpumingcheng'
        },  {
            type: 'poster_avatar',
            name: '头像',
            icon: 'iconfont icon-shuju-huiyuanshu'
        },
        {
            type: 'poster_nickname',
            name: '昵称',
            icon: 'iconfont icon-haibao-yonghunicheng'
        }, {
            type: 'poster_img',
            name: '图片',
            icon: 'iconfont icon-datuzu'
        }, {
            type: 'poster_text',
            name: '文本',
            icon: 'iconfont icon-biaotilan'
        },  {
            type: 'poster',
            name: '商品海报',
            show: false,
            icon: 'iconfont icon-zujian-yemianshezhi'
        },  {
            type: 'poster_exptime',
            name: '失效时间',
            icon: 'iconfont icon-clock'
        }, {
            type: 'poster_pushsetting',
            name: '推送设置',
            icon: 'iconfont icon-haibao-tuisongshezhi-right',
            show: false,
        },{
            type: 'poster_reward',
            name: '奖励设置',
            icon: 'iconfont icon-haibao-jianglishezhi-right',
            show: false,
        },
    ]
}