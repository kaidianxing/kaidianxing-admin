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
    <kdx-modal-frame
        :value="value"
        title="链接选择器"
        :width="970"
        @on-cancel="handleCancel"
        @on-ok="handleOk"
    >
        <div v-if="mennuShow" class="link-selector_box noAnimate select-default">
            <div class="link-selector_left">
                <Menu :active-name="defaultName" width="140" :open-names="[defaultId]" @on-select="onSelect"
                >
                    <Submenu :name="Submenu.id" v-for="(Submenu,index) in mennuListFilter" :key="index">
                        <template slot="title">
                            {{ Submenu.title }}
                        </template>
                        <div v-for="(item,i) in Submenu.menuItem" :key="i">
                            <MenuItem :name="item.type">
                                <span class="link-selector_subtitle">{{ item.name }}</span>
                            </MenuItem>
                        </div>
                    </Submenu>
                </Menu>
            </div>
            <div class="link-selector_right ivu-tabs-content">

                <keep-alive>
                    <component :is='tab.name'
                               :key='tab.name'
                               :value="value"
                               :current="selectRow"
                               :disabledLink="disabledLink"
                               @on-change="handleChange"></component>
                </keep-alive>
            </div>
        </div>

    </kdx-modal-frame>
</template>

<script>
import allTemplates from "./allTemplates";
import mennuList from "./menuList"

let comps = {}
Object.keys(allTemplates).forEach(item => {
    let key = item.replace('Link', '')
    comps[item] = () =>
        import ('./components/' + key + '.vue')
})

const MAP_LIST = {//旧版本映射
    store: 'LinkStorePageLink',
    goods: 'LinkGoodsLink',
    liver: 'LinkLiverLink',
    coupon: 'LinkCouponLink',
    customLink: 'LinkCustomLink',
    goodsClassify: 'LinkGoodsClassifyLink',
    wxapplink: 'LinkWxAppLink',
    merchants: 'LinkMerchants',
    videoLive: 'LinkVideoLiveLink',
    videoRam: 'LinkVideoRamLink',
    creditShop: 'LinkCreditShopLink',
}

export default {
    name: "LinkUnionSelector",
    components: {
        ...comps
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        current: {
            type: Object,
            default: () => {
            }
        },
        // 默认展示的tab name
        name: {
            type: String,
            default: 'LinkStorePageLink'
        },
        // 默认tab显示的tab列
        tabName: {
            type: String,
            default: 'LinkStorePageLink,LinkCouponLink,LinkCustomLink,LinkCreditShopLink,LinkGoodsClassifyLink,LinkGoodsGroupLink,LinkGoodsLink,LinkLiverLink,LinkMarketingPage,LinkMerchants,LinkWxAppLink,LinkApplicationPlug,LinkVideoLiveLink,LinkVideoRamLink'
        },
        disabledLink: {
            type: Array,
            default: () => []
        },//右侧按钮控制是否显示

    },
    data() {
        return {
            defaultName: 'LinkStorePageLink',
            defaultId: '1',
            mennuShow: false,//延迟关闭
            tab: {
                name: 'LinkStorePageLink'
            },
            mennuListFilter: [],//鉴权后左侧菜单栏
            selectRow: {},
        };
    },
    watch: {
        value: {
            handler(val) {
                if (val) {
                    this.mennuShow = true
                    this.$nextTick(() => {
                        this.selectRow = {...this.current};
                        this.tab.name = this.mennuListFilter[0].menuItem[0].type || this.tabName.split(',')[0];
                    })
                }
                if (!val) {
                    if (this.mennuShow === true) {
                        setTimeout(() => {//延时关闭
                            this.mennuShow = false
                        }, 200)
                    }
                }
            },
            immediate: true,
            deep: true
        },
        name: {
            handler(name) {
                this.tab.name = name;
            },
            immediate: true
        },
        tabName: {
            immediate: true,
            handler(tabNameList) {
                if (tabNameList) {
                    console.log(tabNameList,'tabNameList')
                    console.log(mennuList,'mennuList')
                    let copyObj = JSON.parse(JSON.stringify(mennuList))
                    let list = tabNameList.split(',')
                    if (list.length > 0 && list[0].indexOf('Link') == -1) {
                        //旧版的权限表没有LINK 开头
                        let newArr = []
                        list.forEach((item) => {
                            if (MAP_LIST[item]) {
                                newArr.push(MAP_LIST[item])
                            }
                        })
                        list = JSON.parse(JSON.stringify(newArr))
                    }
                    //通过tabName传过来的权限，控制是否显示

                    this.mennuListFilter = copyObj.filter((item) => {
                        item.menuItem = item.menuItem.filter(el => {
                            return list.indexOf(el.type) > -1
                        })
                        return item.menuItem.length > 0
                    })
                    this.defaultName = this.mennuListFilter[0]?.menuItem[0]?.type || 'LinkStorePageLink'
                    this.defaultId = this.mennuListFilter[0]?.id || '1'

                }
            },
        }
    },
    methods: {
        onSelect(name) {
            this.tab.name = name
        },
        handleChange(data) {
            this.selectRow = data;
        },
        handleOk() {
            this.$emit('on-change', this.selectRow);
            this.handleCancel();
            console.log(this.selectRow, '>>>>>>>>')
        },
        handleCancel() {
            this.$emit('on-cancel');
            this.tab.name = this.defaultName
        },
        tabClick(name) {
            this.tab.name = name;
            this.$emit('turn-tab', name)
        }
    }
};
</script>
<style scoped lang="scss">
.link-selector_box {
    height: 580px;
    display: flex;
    align-items: flex-start;

    ::-webkit-scrollbar {
        width: 3px;
    }

    .link-selector_left {
        width: 140px;
        overflow-y: scroll;
        height: 580px;


        /deep/ .ivu-menu-submenu-title {
            font-weight: 600;
            font-size: 14px;
            line-height: 20px;
            color: #262B30;
            padding: 10px 0 10px 30px;
            height: 40px;
        }

        /deep/ .ivu-menu-submenu-title-icon {
            right: 13px;
            margin-right: 0;
        }

        /deep/ .ivu-menu-item {
            padding: 12px 0 12px 30px !important;
        }

        .link-selector_subtitle {
            font-size: 12px;
            line-height: 16px;
            color: #262B30;
        }
    }

    .link-selector_right {
        flex: 1;
        overflow-y: scroll;
        height: 580px;
    }
}

.link-union-selector {

    /deep/ .ivu-tabs {
        .ivu-tabs-bar {
            margin-bottom: 0;

            .ivu-tabs-tab {
                padding: 12px 20px;
            }
        }

        .ivu-tabs-content {
            max-height: calc(100vh - 110px - 160px - 44px);
            height: 556px;
            overflow-y: auto;
            overflow-x: hidden;


        }

        .ivu-tabs-nav-next, .ivu-tabs-nav-prev {
            top: 6px;

        }
    }
}
</style>
