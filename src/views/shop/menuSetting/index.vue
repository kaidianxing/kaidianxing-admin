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
    <kdx-content-bar :loading="loading">
        <div class="shop-menu-setting">
            <kdx-form-title>菜单设置</kdx-form-title>
            <menu-setting-list type="replace" :data="menu.data"
                               @on-replace="replaceMenu"></menu-setting-list>
            <menu-selector ref="menu_selector" :current="current" @on-change="changeMenu"></menu-selector>
        </div>
    </kdx-content-bar>
</template>

<script>
    import MenuSettingList from "./components/MenuSettingList";
    import MenuSelector from "@/components/selector/MenuSelector";

    export default {
        name: "index",
        components: {
            MenuSettingList,
            MenuSelector
        },
        data() {
            return {
                menu: {
                    data: []
                },
                loading: false,
                current: {},
                type: ''
            };
        },
        methods: {
            replaceMenu(row) {
                this.type = row.type;
                this.current = row;
                this.$nextTick(() => {
                    this.$refs['menu_selector'].setValue();
                })
            },
            changeMenu(row) {
                this.$api.shopApi.replaceMenu({type: this.type, id: row.id})
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('菜单替换成功');
                            this.getList();
                        }
                    });
            },
            getList() {
                this.loading = true;
                this.$api.shopApi.getMenuList()
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.menu.data = res.list.filter(item => {
                                return item.is_used == '1';
                            });
                        }
                    });
            }
        },
        mounted() {
            this.getList();
        }
    };
</script>

<style scoped lang="scss">
    .shop-menu-setting {
        position: relative;
        padding: 40px;
        background-color: #ffffff;
        margin:20px auto;
    }
</style>
