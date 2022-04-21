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
    <div class="menu_nav flex-column" :style="{ width: isShrink ? '120px' : '60px' }">
<!--        <div class="logo">-->
<!--            <img :src="$media($store.state.config.baseSetting.logo)" alt="">-->
<!--        </div>-->
        <div class="menu_box flex1">
            <!--为收缩时的menu-->
            <Menu :active-name="activeName" class="menu_content" mode="horizontal">
                <MenuItem v-for="(menu, key, index) in getMenuList" :key="index" :name="menu._pageId" :to='menu.path'
                          v-show='menu.show!==false'>
                <div v-if="isShrink">
                    <i v-if="menu.icon !== 'icon-zuocedaohang-yingyong'" class="iconfont" :class="[menu.icon]"></i>
                    <kdx-svg-icon v-else type="icon-zuocedaohang-yingyong" class="iconfont"></kdx-svg-icon>
                    <span class="name">{{ menu.title }}</span>
                </div>
                </MenuItem>
            </Menu>
        </div>
        <div>
            <!--系统设置-->
            <Button class="menu_setting" type="default" ghost @click="jumpSystemSetting" v-if='adminPerm'>系统设置</Button>
        </div>
    </div>
</template>

<script>
    import {
        mapGetters,
        mapState
    } from 'vuex';
    import permMapper from '@/router/router-permit/permMap.js'

    export default {
        data() {
            return {
                activeName: '首页',
                isShrink: true,
                breadcrumb: [],
                count: 0
            };
        },
        computed: {
            ...mapState('config',{
                permList: state => state.user?.perms || [],
            }),
            ...mapGetters('menu', {
                getSecondLevelMenu:'getSecondLevelMenu',
                menuNav: 'getFirstLevelMenu',
                getBreadcrumb: 'getBreadcrumb'
            }),
            adminPerm(){//只有超管可以进入系统设置
                return this.$store.state.config.user?.is_root==1
            },
            getMenuList() {
                let arr = this.menuNav.map(item => {
                    let newItem =  {
                            ...item,
                        };
                    if (typeof item.show == 'undefined'||item.show !==false) {//show不是false就是true;还要取决于权限的true/false
                        newItem.show = newItem.perm;//判断有没有展示权限
                    }
                    if(newItem.show){//如果子菜单一个都没有权限就隐藏该一级菜单
                        newItem.show=this.getSecondLevelMenu(item.path.split('/')[1]).filter(item=>item.perm).filter(item=>this.permMapper.hasPerm(item.path,false)).length>0;
                    }
                    return newItem;
                });
                return arr;
            },
        },
        watch: {
            permList:{
                immediate: true,
                handler() {
                    this.permMapper=permMapper.getPermsMap(this.permList)
                }
            },
            '$route.path': {
                immediate: true,
                handler() {
                    this.breadcrumb = this.getBreadcrumb(this.$route.path);
                    if (this.breadcrumb[0]) {
                        this.activeName = this.breadcrumb[0]._pageId;
                    }
                }
            }
        },

        mounted() {
        },
        methods: {
            jumpSystemSetting() {
                // 跳转管理后台页面
                this.$router.replace('/system/apps/install')
            }
        }
    };
</script>

<style scoped lang="scss">
    .menu_nav {
        width: 100%;
        border: 1px solid red;
        overflow-x: hidden;
        background-color: #1C2C3C;
        transition: all 0.2s ease-in-out;
        flex-shrink: 0;
        .logo {
            padding: 10px;
            width: 100%;
            height: 56px;
            box-sizing: border-box;
            border-bottom: 1px solid #111216;
            position: relative;
            text-align: center;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            >img {
                max-width: 100%;
                max-height: 100%;
            }
        }
        .menu_box {
            /*height: calc(100vh - 144px);*/
            overflow-y: auto;
            background-color: #1C2C3C;
            width: 126px!important;
            padding-top: 10px;
            .iconfont {
                font-size: 20px;
                display: inline-block;
                margin-right: 8px;
                color: #ffffff;
            }
            > .menu_content {
                width: 120px !important;
                background-color: #1C2C3C;
                .menu_item{
                    width: 120px !important;
                }
                > li,
                > a {
                    color: #ffffff;
                    padding: 14px 12px;
                    margin-left: 6px;
                    border-radius: 2px 0 0 2px;
                    text-align: center;
                    >div {
                      transform: translateX(-10px);
                    }
                    &:hover {
                        background-color: #26394B;
                    }
                    .name {
                        @include font-14-20;
                        vertical-align: text-bottom;
                    }
                }
                .ivu-menu-item {
                    white-space: nowrap;
                }
                > .ivu-menu-item-active {
                    background-color: $brand-color;
                    &:hover {
                        background-color: $brand-color;
                    }
                    .iconfont {
                        color: #ffffff;
                    }
                }
            }
            .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after {
                background: #1C2C3C;
                width: 0;
            }
        }
        .menu_setting {
            position: relative;
            width: 100%;
            height: 44px;
            display: block;
            margin: 0 auto;
            border: none;
            background-color: #15222F;
            /deep/ .ivu-dropdown-rel {
                // display: flex;
                // justify-content:center;
                // .ivu-btn{
                //     margin:auto;
                // }
            }
            .ivu-btn {
                background-color: $menu-nav-bg-color;
                color: #ffffff;
            }
            .badge {
                position: absolute;
                min-width: 15px;
                height: 15px;
                padding: 0 4px;
                line-height: 15px;
                top: 2px;
                right: 10px;
                font-size: 12px;
                background: $danger-color;
                border-radius: 10px;
                color: #fff;
                text-align: center;
            }
        }
    }
</style>
