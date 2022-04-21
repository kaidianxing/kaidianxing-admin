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
    title: '商品',
    name: '商品',
    path: '/goods/list/inSale',
    show: true,
    icon: 'icon-zuocedaohang-shangpin',
    zIndex:30,
    perm:'',
    children: {
        goodList: {
            title: '商品管理',
            name: '商品管理',
            path: '/goods/list/inSale',
            icon: "icon-kaidianxing-shangpinguanli",
            perm:'goods.index.view',
            children: {
                addGood: {
                    title: '添加商品',
                    name: '添加商品',
                    path: '/goods/add',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                    backPath:-1,
                    perm:'goods.index.manage',
                },
                inSale: {
                    title: '出售中',
                    name: '出售中',
                    path: '/goods/list/inSale',
                    show: true,
                    perm:'',
                },
                soldOut: {
                    title: '已售罄',
                    name: '已售罄',
                    path: '/goods/list/soldOut',
                    show: true,
                    perm:'',
                },
                inStock: {
                    title: '仓库中',
                    name: '仓库中',
                    path: '/goods/list/inStock',
                    show: true,
                    perm:'',
                },
                inRecycle: {
                    title: '回收站',
                    name: '回收站',
                    path: '/goods/list/inRecycle',
                    show: true,
                    perm:'',
                }
            }
        },
        classifySetting: {
            title: '商品分类',
            name: '商品分类',
            path: '/goods/classify',
            icon: "icon-kaidianxing-shangpinfenlei",
            perm:'goods.category.view',
            children: {
                classify: {
                    title: '商品分类',
                    name: '商品分类',
                    path: '/goods/classify',
                    show: true,
                    perm:'',
                    children: {
                        addClassify: {
                            title: '广告设置',
                            name: '广告设置',
                            path: '/goods/classify/setting-ad',
                            perm:'goods.category.manage',
                            show: false,
                            showSubMenu:true,
                            showBackBtn:true,
                        }
                    }
                },
                settingLevel: {
                    title: '设置分类层级',
                    name: '设置分类层级',
                    path: '/goods/classify/setting-level',
                    perm:'goods.category.manage',
                    show: true
                }
            }
        },
        group: {
            title: '商品分组',
            name: '商品分组',
            path: '/goods/group',
            show: true,
            icon: "icon-kaidianxing-shangpinfenzu",
            perm:'goods.group.view',
            children: {
                addGoodGroup: {
                    title: '新增商品分组',
                    name: '新增商品分组',
                    path: '/goods/group/add',
                    perm:'goods.group.manage',
                    show: false,
                    showSubMenu: true,
                    showBackBtn: true,
                },
                editGoodGroup: {
                    title: '修改商品分组',
                    name: '修改商品分组',
                    path: '/goods/group/edit',
                    perm:'goods.group.manage',
                    show: false,
                    showSubMenu: true,
                    showBackBtn: true,
                }
            }
        },
        label: {
            title: '标签管理',
            name: '标签管理',
            path: '/goods/label',
            show: true,
            icon: "icon-kaidianxing-biaoqianguanli",
            perm:'goods.label_group.view',
            children: {
                addGoodLabel: {
                    title: '添加标签组',
                    name: '添加商品标签',
                    path: '/goods/label/add',
                    perm:'goods.label_group.manage',
                    showSubMenu:true,
                    showBackBtn:true,
                    show: false
                },
                editGoodLabel: {
                    title: '修改标签组',
                    name: '修改商品标签',
                    path: '/goods/label/edit',
                    perm:'goods.label_group.manage',
                    show: false,
                    showSubMenu: true,
                    showBackBt: true,
                }
            }
        }
    }
};

