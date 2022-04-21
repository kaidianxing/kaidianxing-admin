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
export default {
    title: '秒杀抢购',
    name: '秒杀抢购',
    show: false,
    path: '/seckill/activityData/index',
    perm:'',
    children: {
        seckillActivityData: {
            title: '统计数据',
            name: '统计数据',
            path: '/seckill/activityData/index',
            pluginName: 'seckill',
            perm: ($router, $store) => {
                if (20 === +$store.state?.account?.shop?.shopType) {
                    return false;
                }else {
                    return ['seckill.statistics.view'].some(item => $store.state.config.user?.perms?.indexOf(item) > -1)
                }
            }
        },
        seckillActivity: {
            title: '秒杀抢购',
            name: '秒杀抢购',
            path: '/seckill/activity/list',
            pluginName: 'seckill',
            perm: '',
            children: {
                basic: {
                    title: '秒杀抢购',
                    name: '秒杀抢购',
                    path: '/seckill/activity/index',
                    pluginName: 'seckill',
                    perm: '',
                    show: false,
                    showSubMenu: true,
                    showBackBtn: true,
                },
                activityData: {
                    title: '秒杀抢购',
                    name: '秒杀抢购',
                    path: '/seckill/activity/data',
                    pluginName: 'seckill',
                    perm: '',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
            },
        },
        seckillSetting: {
            title: '秒杀设置',
            name: '秒杀设置',
            path: '/seckill/set/index',
            pluginName: 'seckill',
            perm: '',
        }
    }
}