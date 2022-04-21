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
    <div class="submenu" v-show="isDisappear&&currentPage.showSubMenu!==false">
        <Menu ref="submenu" :active-name="activeName" :open-names="openName" @on-select="handleSelect"
              class="menu_content">
            <template v-for="(menu, key) in getSunMenuList">
                <keep-alive :key="key" v-if="menu.show !== false">
                    <!-- 系统设置单独处理-->
                    <div v-if="menu.title === '系统设置'">
                        <div class="settingsLine"></div>
                        <Submenu :name="key">
                            <div class="settingLine"></div>
                            <template #title>
                                <div class="submenuTitle">
                                <span v-if="menu.icon !== 'icon-zuocedaohang-yingyong'" class="iconfont"
                                      :class="[menu.icon]"></span>
                                    {{ menu.title }}
                                </div>
                            </template>
                            <template v-for="(child, childKey) in menu.children">
                                <MenuItem :name="child._pageId" :key="childKey" v-if="child.show !== false">
                                    {{ child.title }}
                                </MenuItem>
                            </template>
                        </Submenu>
                    </div>
                    <!--有三级菜单-->
                    <Submenu v-else-if="haveChildrenShow(menu.children)" :name="key">
                        <template #title>
                            <div class="submenuTitle">
                                <span v-if="menu.icon !== 'icon-zuocedaohang-yingyong'" class="iconfont"
                                      :class="[menu.icon]"></span>
                                {{ menu.title }}
                            </div>
                        </template>
                        <template v-for="(child, childKey) in menu.children">
                            <MenuItem :name="child._pageId" :key="childKey" v-if="child.show !== false">
                                {{ child.title  }}
                            </MenuItem>
                        </template>
                    </Submenu>
                    <!--没有三级菜单-->
                    <MenuItem :name="menu._pageId" v-else>
                        <div class="submenuTitle">
                            <span v-if="menu.icon !== 'icon-zuocedaohang-yingyong'" class="iconfont"
                                  :class="[menu.icon]"></span>
                            {{ menu.title }}
                        </div>
                    </MenuItem>
                </keep-alive>
            </template>
        </Menu>

    </div>
</template>

<script>
import {
    mapGetters,
} from 'vuex'

export default {
    data() {
        return {
            menuNav: [],
            activeName: null,
            oldActiveName: null,
            openName: [],
            breadcrumb: [],
            allSubMenu: [],
            currentPage: {},
        }
    },
    computed: {
        ...mapGetters('menu', [
            'getSecondLevelMenu',
            'getBreadcrumb',
            'getAllSubMenu'
        ]),
        getSunMenuList() {
            let list = [];
            for (let item of this.menuNav) {
                list.push(item)
            }
            list = list.sort((a, b) => {
                return (a.zIndex || 0) - (b.zIndex || 0)
            })
            return list;
        },
        isDisappear() {
            let isDisappear = false //是否显示
            if (this.menuNav) {
                for (let k in this.menuNav) {
                    if (this.menuNav[k].show !== false) {
                        isDisappear = true
                    }
                }
            }
            return isDisappear
        }
    },
    methods: {
        haveChildrenShow(children) {
            let show = false
            for (let k in children) {
                if (children[k].show !== false) {
                    show = true
                    break
                }
            }
            return show
        },
        handleSelect(name) {
            let path = ''
            let menu = {}
            for (let key in this.allSubMenu) {
                menu = this.allSubMenu[key]
                if (name == menu._pageId) {
                    path = menu.redirect || menu.path
                }
                if (path && path != this.$route.path) {
                    this.$router.push({
                        path
                    })
                    break
                }
            }
        },
    },
    watch: {
        '$route.path': {
            immediate: true,
            handler(path) {
                this.breadcrumb = this.getBreadcrumb(this.$route.path);
                this.currentPage = this.breadcrumb[this.breadcrumb.length - 1];
                this.menuNav = this.getSecondLevelMenu(path.split('/')[1]);
                let openName = []
                let activeName = ''
                let menu = {}
                let haveChildrenShow = false;
                this.$nextTick(() => {
                    if (this.breadcrumb.length > 1) {
                        //二级菜单
                        let val = this.breadcrumb[1]
                        if(this.breadcrumb.length > 2 && this.breadcrumb[0].name === "应用" && this.breadcrumb[1].name !== "应用中心") {
                            val = this.breadcrumb[2]
                        }
                        for (let key in this.getSunMenuList) {
                            menu = this.getSunMenuList[key]
                            if (val._pageId === menu._pageId) {
                                for (let k in menu.children) {
                                    if (menu.children[k].show !== false) {
                                        haveChildrenShow = true;
                                        break;
                                    }
                                }
                                if (haveChildrenShow) {
                                    openName = [key * 1]
                                }
                                activeName = val._pageId
                                break
                            }
                        }
                    }
                    let allSubMenu = this.getAllSubMenu(path.split('/')[1])
                    this.allSubMenu = allSubMenu
                    if (this.breadcrumb.length > 2 && haveChildrenShow) {
                        //三级菜单
                        let val = this.breadcrumb[2]
                        if(this.breadcrumb.length > 2 && this.breadcrumb[0].name === "应用" && this.breadcrumb[1].name !== "应用中心") {
                            val = this.breadcrumb[3]
                        }
                        for (let key in allSubMenu) {
                            menu = allSubMenu[key]
                            if (val._pageId === menu._pageId && menu.show === true) {
                                activeName = val._pageId
                                break
                            } else {//隐藏的菜单不改变选中状态
                                activeName = this.oldActiveName
                            }
                        }
                    }
                    this.openName = openName
                    this.$nextTick(() => {
                        this.activeName = activeName
                        this.oldActiveName = activeName//上次选择的菜单
                        this.$refs.submenu.updateOpened()
                    })
                })
            }
        }
    }
}
</script>

<style scoped lang="scss">
.settingsLine{
    height: 40px;
    position: relative;
    &:before{
        content: '';
        border-top: 1px solid #E5E5E5;
        width: 100%;
        position: absolute;
        left: 0;
        top: 50%;
    }
}
.submenu {
    position: relative;
    /*margin-top: 56px;*/
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    height: calc(100vh - 64px);
    margin-top: -46px;
    transition: all 0.2s ease-in-out;
    flex-shrink: 0;

    /deep/ .menu_content {
        width: 100% !important;
        height: 100%;
        overflow-y: auto;
        padding-top: 10px;
        box-shadow: $shadow-card;

        li {
            width: 200px !important;
        }

        .submenuTitle {
            display: flex;
            align-items: center;
            font-weight: bold;
            font-size: 15px;
            //color: red;

            span {
                font-size: 15px;
                padding-right: 6px;
                font-weight: bold;
                color: #1D2129;
            }

            &:hover {
                color: var(--theme-color);

                i {
                    color: var(--theme-color);
                }

                span {
                    color: var(--theme-color);
                }
            }
        }

        .ivu-menu-submenu {
            padding: 0;
            width: 100%;
            min-height: 46px;

            .ivu-menu-submenu-title {
                height: 46px;
                line-height: 46px;
                box-sizing: border-box;
                padding: 0 20px;
                color: #1D2129;
                font-weight: bold;

                &:hover {

                    i {
                        color: var(--theme-color);
                    }

                }

                i {
                    font-weight: bold;
                    color: #1D2129;
                }
            }
        }

        .ivu-menu-submenu.ivu-menu-opened {


            i {
                font-weight: bold;
                color: #1D2129;
                transform: translateY(-50%) rotate(0);
            }
        }

        .ivu-menu-item {
            height: 50px;
            color: #1D2129;

            &:hover {
                color: var(--theme-color);

                span {
                    color: var(--theme-color);
                }
            }

            &.ivu-menu-item-active:not(.ivu-menu-submenu) {
                span {
                    color: var(--theme-color);
                }

                background-color: var(--theme-submenuBackground);
                font-weight: bold;
            }
        }

        li,
        a {
            padding: 16px 20px;
            font-size: 14px;
            line-height: 17px;

            .ivu-menu-submenu-title {
                padding: 0;
                position: relative;
                font-size: 16px;

                i {
                    transition: all 0.2s;
                    position: absolute;
                    right: 10px;
                    margin: 0;
                    top: 50%;
                    transform: translateY(-50%) rotate(-90deg);
                    font-size: 16px;
                }
            }

            .ivu-menu {
                > .ivu-menu-item {
                    display: flex;
                    align-items: center;
                    padding-left: 40px !important;
                    line-height: 50px;

                    &.ivu-menu-item-active {
                        &:not(.ivu-menu-item-submenu) {
                            background-color: var(--theme-submenuBackground);
                            font-weight: 400;
                        }
                    }
                }
            }
        }
    }
}
</style>
