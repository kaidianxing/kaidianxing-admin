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
    <div>
        <div class="nav-bar">
            <div class="left">
                <div class="logo-box">
                    <div class="logo">
                        <img :src="defaultLogo" alt="">
                    </div>
                </div>
                <div class="left-content">
                    <Menu :active-name="activeName" class="menu_content" mode="horizontal">
                        <MenuItem v-for="(menu, key, index) in getMenuList" :key="index" :name="menu._pageId"
                                  :to='menu.path'
                                  v-show='menu.show!==false'>
                            <div v-if="isShrink">
                                <span class="name">{{ menu.title }}</span>
                            </div>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
            <div class="right">
                <Dropdown transfer @on-click="handleDropdown">
                    <div class="userBox">
                        <div class="user">
                            {{ user.name }}
                            <Icon type="ios-arrow-down" class="icon"></Icon>
                        </div>
                    </div>

                    <DropdownMenu slot="list" class="nav-bar-drown-box">
                        <template>
                            <DropdownItem class="default" name="settings">
                                <span style="font-weight: 600" class="iconfont icon-zujian-yemianshezhi"></span>
                                <span class="name">资料设置</span>
                            </DropdownItem>
                            <DropdownItem class="default" name="alone_logout">
                                <span class="iconfont icon-power"></span>
                                <span class="name">退出登录</span>
                            </DropdownItem>
                        </template>

                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
        <div class="starCrumbs" v-if="$route.path !== '/plugins/center/index'">
            <template>
                <div class="modal-name" :style="breadcrumbStyle">
                    <div
                        class="modal-name-back"
                        @click="goBack"
                        v-if="currentPage.showBackBtn"
                    >
                        <Icon type="md-arrow-back"/>
                        <span>返回</span>
                    </div>

                </div>
                <Breadcrumb class="breadcrumb">
                    <BreadcrumbItem
                        :to="item.path"
                        v-for="(item, index) in breadcrumb"
                        :key="index"
                    >{{ item.title }}
                    </BreadcrumbItem>
                </Breadcrumb>
            </template>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import permMapper from '@/router/router-permit/permMap.js'

export default {
    name: 'NavBar',
    props: {
        left: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            activeName: '首页',
            isShrink: true,
            breadcrumb: [],
            count: 0,
            breadcrumbStyle: {},
            defaultLogo:require('@/assets/image/alone/store/logo.png')
        }
    },
    computed: {
        ...mapGetters('menu', {
            getSecondLevelMenu: 'getSecondLevelMenu',
            menuNav: 'getFirstLevelMenu',
            getBreadcrumb: 'getBreadcrumb'
        }),
        ...mapState('layout', {
            isOpen: (state) => state.isOpen,
        }),
        ...mapState('config', {
            rightLink: (state) => state.right_top_link,
            user: (state) => state.user || {},
            baseSetting: (state) => state.baseSetting,
            platform: (state) => state.platform,
            permList: state => state.user?.perms || [],
        }),

        ...mapState('account', {
            shopId: (state) => state.shop.shopId,
            shopType: (state) => state.shop.shopType,
        }),
        adminPerm() {//只有超管可以进入系统设置
            return this.$store.state.config.user?.is_root == 1
        },
        getMenuList() {
            let arr = this.menuNav.map(item => {
                let newItem = {
                    ...item,
                };
                if (typeof item.show == 'undefined' || item.show !== false) {//show不是false就是true;还要取决于权限的true/false
                    newItem.show = newItem.perm;//判断有没有展示权限
                }
                if (newItem.show) {//如果子菜单一个都没有权限就隐藏该一级菜单
                    newItem.show = this.getSecondLevelMenu(item.path.split('/')[1]).filter(item => item.perm).filter(item => this.permMapper.hasPerm(item.path, false)).length > 0;
                }
                return newItem;
            });
            return arr;
        },
    },
    watch: {
        permList: {
            immediate: true,
            handler() {
                this.permMapper = permMapper.getPermsMap(this.permList)
            }
        },
        '$route.path': {
            immediate: true,
            handler() {
                this.breadcrumb = this.getBreadcrumb(this.$route.path)
                this.currentPage = this.breadcrumb[this.breadcrumb.length - 1]
                this.modalNameStyle()
                if (this.breadcrumb[0]) {
                    this.activeName = this.breadcrumb[0]._pageId;
                }
            }
        }
    },
    methods: {
        modalNameStyle() {
            // showBackBtn 返回按钮
            // showSubMenu 二级菜单
            let style = {}
            //
            if (!this.currentPage.show && this.currentPage.showBackBtn === false && !this.currentPage.showSubMenu) {//不显示2级菜单 并且没有返回按钮
                // console.log('全部不显示')
                style['width'] = '0px'
                style['margin-left'] = '0px'
            } else if (!this.currentPage.show && this.currentPage.showSubMenu === true && this.currentPage.showBackBtn === true) {//不显示2级菜单 有返回按钮
                // console.log('不显示2级菜单 有返回按钮')
                style['width'] = '150px'
                style['margin-left'] = '200px'
            }else if (this.currentPage.show === false && this.currentPage.showSubMenu === true && this.currentPage.showBackBtn === false) {//不显示2级菜单 无返回按钮
                console.log('不显示2级菜单 没有返回按钮')
                style['width'] = '150px'
                style['margin-left'] = '50px'
            } else if (!this.currentPage.show && this.currentPage.showSubMenu === false && this.currentPage.showBackBtn === true) {//不显示2级菜单 有返回按钮
                // console.log('全部不展示但有返回按钮')
                style['width'] = '150px'
                style['margin-left'] = '0px'
            } else if (this.currentPage.show === false) {
                // console.log('show为false')

                style['width'] = '0px'
                style['margin-left'] = '0px'
            } else if (this.currentPage.show) {
                // console.log('show为true')
                style['margin-left'] = '50px'
            }
            this.breadcrumbStyle = style
        },
        goBack() {
            if (
                typeof this.currentPage.backPath == 'string' &&
                this.currentPage.backPath.indexOf('/') == 0
            ) {
                this.$router.replace({
                    path: this.currentPage.backPath,
                })
            } else {
                this.$router.go(-1)
            }
        },
        jumpSystemSetting() {
            // 跳转管理后台页面
            this.$router.replace('/system/apps/install')
        },
        handleDropdown(name) {
            switch (name) {
                case 'alone_logout':
                    this.aloneLogout()
                    break;
                case 'settings':
                    this.settings()
                    break;
                default:
                    break;
            }
        },
        aloneLogout() {
            this.$store.dispatch('alone/loginOut').then(() => {
                this.$router.replace('/account/login')
            })
        },
        settings() {
            this.$router.push('/account/member')
        },
        // 首页跳转链接
        jumpLink(item) {
            window.open(`${item.scheme}${item.jump_url}`)
        },
    },
}
</script>

<style scoped lang="scss">
.nav-bar {
    /*position: fixed;*/
    /*left: 150px;*/
    /*top: 0;*/
    /*right: 0;*/
    height: 64px;
    background: var(--theme-navBackground);
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 0 0;
    transition: all 0.2s ease-in-out;
    z-index: 1000;
    min-width: 1000px;
    border-bottom: 1px solid $border-color;

    .left {
        display: flex;
        align-items: center;

        .logo-box {
            width: 200px;

            .logo {
                padding:0 10px;
                height: 50px;
                box-sizing: border-box;
                position: relative;
                text-align: center;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;

                > img {
                    max-width: 100%;
                    max-height: 100%;
                    //width: 200px;
                    //height: 100px;
                }

                h1 {
                    font-size: 22px;
                    margin-left: 10px;
                    color: #FFFFFF;
                }
            }
        }

        .left-content {
            display: flex;
            flex-wrap: nowrap;
            height: 100%;

            & > .menu_content {
                transition: all 0.2s ease-in-out;
                background: var(--theme-navBackground);

                > li,
                > a {
                    font-size: 16px;
                    color: #ffffff;
                    text-align: center;
                    padding: 0 16px;

                    div {
                        box-sizing: border-box;
                        height: 61px;
                    }

                    .name {
                        @include font-16-22;
                        vertical-align: text-bottom;
                    }
                }

            }

            .ivu-menu-horizontal.ivu-menu-light:after {
                display: none;
            }

            .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover {
                border: none !important;

                span {
                    font-weight: bold;
                }

                div {
                    border-bottom: 3px solid #ffffff;
                }
            }

            .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item {
                border: none;
            }

            .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active {
                border: none !important;

                span {
                    font-weight: bold;
                }

                div {
                    border-bottom: 3px solid #ffffff;
                }
            }


        }
    }

    .right {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        color: #ffffff;

        .userBox {
            display: flex;
            align-items: center;

        }

        > .search {
            display: flex;
            align-items: center;
            width: 250px;
            height: 32px;
            border-radius: 44px;
            background-color: $background-color;
            overflow: hidden;

            > .icon {
                padding-left: 20px;
                padding-right: 10px;
                font-size: 18px;
                line-height: 32px;
            }

            /deep/ .ivu-auto-complete {
                display: inline-block;
                width: 190px;
                /*height: 20px;*/
                .ivu-input {
                    border: none;
                    background-color: $background-color;

                    &:focus {
                        box-shadow: none;
                    }
                }
            }
        }

        // 用户
        /deep/ .ivu-dropdown {
            &.padMar {
                padding-left: 20px;
                margin-left: 20px;
            }

            .user {
                cursor: pointer;
                .icon{
                    font-size: 18px;
                }
                &:hover {
                    //color: $brand-color;
                    .icon {
                        transform: rotate(
                                180deg
                        ); // transform: translateY(-50%);
                        /*animation: turn 1s linear infinite;*/
                    }
                }

                .icon {
                    padding-left: 5px;
                    padding-right: 5px;
                    transition: all 0.6s ease-in-out;
                }
            }
        }

        > .get-out {
            padding: 0 15px;
            font-size: 14px;
            color: $text-first;
            cursor: pointer;
        }

        > .ivu-dropdown {
            .user {
                padding-left: 10px;

                .user-img {
                    width: 26px;
                    height: 26px;
                    margin-right: 12px;
                }
            }
        }
    }
}
</style>

<style lang="scss">
.navbar-shop-list {
    .ivu-drawer-body {
        padding: 28px 20px;
    }

    .shop {
        margin-bottom: 10px;
        height: 72px;
        display: flex;
        background-color: #EFF4FD;
        border: 1px solid transparent;
        cursor: pointer;
        border-radius: 6px;

        &:hover {
            border: 1px solid #2d8cf0;
        }

        &.merchant-shop {
            background-color: #eff0fd;
        }

        &.merchant-shop:hover {
            border: 1px solid #5D60F6;
        }

        img {
            width: 40px;
            height: 40px;
            border: 0.5px solid #e9edef;
            box-sizing: border-box;
            border-radius: 50%;
            margin: auto 10px auto 20px;
        }

        .name {
            width: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            justify-content: center;

            .name-text {
                margin-bottom: 4px;
                font-size: 14px;
                line-height: 20px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                width: 156px;
                font-weight: 600;
                color: $text-first;
            }

            .name-type {
                display: flex;
                height: 16px;
                line-height: 16px;
                width: fit-content;
                /*padding: 0 4px;*/
                border-radius: 2px;
                transform: scale(0.9) translateX(-4px);

                .name-type-shop {
                    margin-left: 4px;
                    color: #fff;
                    background-color: #5D60F6;
                }

                .merchant {
                    color: #fff;
                    background-color: #2d8cf0;
                }

                > span {
                    padding: 0 2px;
                    font-size: 12px;
                    display: flex;
                    border-radius: 2px;
                    /*transform: scale(0.85);*/
                }

                .shop-status {
                    margin-top: -1px;
                    margin-left: 6px;
                    flex-shrink: 0;
                }

                /deep/ .tag-label .label-content {
                    padding: 0 2px;
                }
            }
        }

        .active-icon {
            width: 24px;
            height: 24px;
            line-height: 24px;
            font-size: 24px;
            text-align: center;
            margin: auto 20px;
            color: #5D60F6;
        }
    }
}

.nav-bar-drown-box {
    background-color: #ffffff;

    .ivu-dropdown-item {
        border-bottom: 1px solid $border-color;

        a {
            color: $text-second;
        }

        &:last-child {
            border: none;
        }

        &:hover {
            color: $brand-color;
            background-color: #ffffff;

            a {
                color: $brand-color;
            }

            .iconfont {
                color: $brand-color;
            }
        }

        .iconfont {
            font-size: 18px;
            padding-right: 10px;
        }
    }

    .theme {
        &:hover {
            color: $danger-color;

            a {
                color: $danger-color;
            }

            .iconfont {
                color: $danger-color;
            }
        }

        .theme-title {
            padding: 0 15px;
        }

        .theme-body {
            padding-top: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .theme-list {
                width: 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 2px;
                overflow: hidden;
            }

            i {
                width: 12px;
                height: 24px;
            }
        }
    }

    .default {
        padding: 14px 20px;
        width: 180px;
        margin: 0 10px;

        &:hover {
            color: $danger-color;

            a {
                color: $danger-color;
            }

            .iconfont {
                color: $danger-color;
            }
        }
    }
}

.starCrumbs {
    height: 46px;
    background: #FFFFFF;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;

    & > .modal-name {
        transition: all 0.2s ease-in-out;
        margin-left: 200px;
        box-sizing: border-box;
        width: 150px;
        height: 46px;
        line-height: 46px;
        text-align: center;
        border-right: 1px solid #e9edef;
        color: #000;

        .modal-name-back {
            cursor: pointer;
        }
    }

    .breadcrumb {
        margin-left: 20px;

        & > span a:hover {
            color: var(--theme-color)
        }

        & > span:last-child {
            a {
                font-weight: normal;
                color: var(--theme-color)
            }

        }
    }

    > .welcome-index {
        display: flex;
        align-items: center;
        padding-left: 20px;
        @include font-18-25-bold;

        /deep/ .date-name {
            color: $warning-color;
        }
    }
}
</style>
