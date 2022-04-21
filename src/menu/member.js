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
 *  title: '商品',左侧菜单中的名称
 *  name: '商品管理'
 *  path: '/goods',//点击后跳转的地址，没有则作为分组
 *  show: true,//是否在菜单中显示,不写默认true
 *  children:‘’//子菜单
 *  components: 文件路径
 * 需要添加其他参数随意添加
 */
export default {
    title: '会员',
    name: '会员管理',
    show: true,
    icon: 'icon-zuocedaohang-huiyuan',
    path: '/member/list',
    zIndex:50,
    perm:'',
    children: {
        list: {
            title: '会员列表',
            name: '会员列表',
            path: '/member/list',
            icon: "icon-kaidianxing-huiyuanliebiao",
            perm:'member.list.view',
            children: {
                detail: {
                    title: '会员详情',
                    name: '会员详情',
                    path: '/member/detail',
                    showSubMenu:true,
                    showBackBtn:true,
                    perm:'member.list.view',
                    show: false
                }
            }
        },
        grade: {
            title: '会员等级',
            name: '会员等级',
            path: '/member/grade/list',
            icon: "icon-kaidianxing-huiyuandengji",
            perm:'member.level.view',
            children: {
                addGrade: {
                    title: '添加会员等级',
                    name: '添加会员等级',
                    path: '/member/grade/add',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                    perm:'member.level.manage',
                },
                editGrade: {
                    title: '编辑会员等级',
                    name: '编辑会员等级',
                    path: '/member/grade/edit',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                    perm:'member.level.manage',
                },
            }
        },
        labelGroup: {
            title: '标签组',
            name: '标签组',
            path: '/member/group/list',
            icon: "icon-kaidianxing-biaoqianzu",
            perm:'member.group.view',
        },
        vipInformation: {
            title: '数据统计',
            name: '数据统计',
            path: '/member/vip',
            show: true,
            icon: "icon-kaidianxing-huiyuanxinxi",
            perm:'statistics.member.view',
            children: {
                vip: {
                    title: '会员统计',
                    name: '会员统计',
                    path: '/member/vip',
                    perm:'',
                    show: true
                },
                consume: {
                    title: '消费排行',
                    name: '消费排行',
                    path: '/member/consume',
                    perm:'',
                    show: true
                }
            }
        },
        setting: {
            title: '设置',
            name: '设置',
            icon: "icon-xitongshezhi",
            perm:'member.level_upgrade.view',
            path: '/member/setting'
        }
    }
};

