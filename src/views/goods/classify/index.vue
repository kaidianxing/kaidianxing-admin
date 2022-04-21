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
    <kdx-content-bar>
        <div class="good-classification">
            <div class="header">
                <Button type="primary" :disabled='noManagePerm' @click="addFirstClassify">+添加一级分类</Button>
                <Button v-if="true" :class="{'default-primary':!noManagePerm}" :disabled='noManagePerm' to="/goods/classify/setting-level">设置分类层级</Button>
                <Button class="default-primary" :icon="expand?'ios-arrow-up':'ios-arrow-down'"  @click="expandAll"
                        v-show="$store.state.createGoodClassification.level!=='0'">
                    {{expand?"全部折叠":"全部展开"}}
                </Button>
            </div>
            <div class="header-space"></div>
            <div class="content" v-loading="loading">
                <tree-table ref="tree_table" @on-refresh="handleRefresh"></tree-table>
            </div>
        </div>
        <template #btn>
            <div class="btn-bottom">
                <Button class="primary-long" :disabled='noManagePerm' @click="handleSave">保存</Button>
            </div>
        </template>
    </kdx-content-bar>
</template>

<script>
    import TreeTable from "./components/TreeTable";
    import {
        mapState,
        mapMutations
    } from 'vuex';

    export default {
        name: "index",
        components: {
            TreeTable,
        },
        inject:['returnToTop'],
        computed: {
            ...mapState('createGoodClassification', {
                list: state => state.list
            }),
            noManagePerm(){//管理权限
                return !this.$getPermMap('goods.category.manage')
            },
            expand() {
                let res = false;
                this.list.forEach(item => {
                    if (item.expand) {
                        res = true;
                    }
                    if (item.children && item.children.length > 0) {
                        item.children.forEach(childItem => {
                            if (childItem.expand) {
                                res = true;
                            }
                        });
                    }
                });
                return res;
            }
        },
        data() {
            return {
                loading: false
            };
        },
        methods: {
            ...mapMutations('createGoodClassification', ['setList', 'refreshList', 'setExpandAll', 'setLevel', 'addFirstClassify']),
            handleSave() {
                let valid = this.validate(this.list);
                if (valid) {
                    this.$Message.error('请填写完整的分类名称和分类图片');
                } else {
                    this.loading = true;
                    this.formatData(this.list);
                    this.$api.goodsApi.daveGoodClassify({
                        data: JSON.stringify(formatParams(JSON.parse(JSON.stringify(this.list))))
                    })
                        .then(res => {
                            this.loading = false;
                            if (res.error === 0) {
                                this.$Message.success('保存成功');
                                this.handleRefresh();
                            }
                        }).catch();
                }
            },
            // 折叠、展开所有
            expandAll() {
                this.setExpandAll(!this.expand);
            },
            handleRefresh() {
                this.returnToTop();
                this.loading = true;
                this.$api.goodsApi.goodClassifyList({})
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.setLevel(res.level || '0');
                            this.setList(res.list);
                            this.setExpandAll(true);
                        }
                    }).catch();
            },
            validate(list, flag = false) {
                let level = this.$store.state.createGoodClassification.level;
                for (let item of this.list) {
                    if (flag) break;
                    if (!item.name || !item.thumb) {
                        flag = true;
                        break;
                    } else if (level !== '0' && item.children && item.children.length > 0) {
                        for (let twoItem of item.children) {
                            if (flag) break;
                            if (!twoItem.name || !twoItem.thumb) {
                                flag = true;
                                break;
                            } else if (level === '2' && twoItem.children && twoItem.children.length > 0) {
                                for (let threeItem of twoItem.children) {
                                    if (!threeItem.name || !threeItem.thumb) {
                                        flag = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                return flag;
            },
            // 处理数据，将 自定义id 替换为 ''  /  手动修改新增分类的状态为显示中
            formatData(list = []) {
                list.forEach(item => {
                    if (item.id.indexOf('cus_') !== -1) {
                        // 将 自定义id 替换为 ''
                        item.id = ''
                        // 手动修改新增分类的状态为显示中
                        item.status = '1';
                    }
                    if (item.children && item.children.length > 0) {
                        this.formatData(item.children);
                    }
                });
            },
        },
        mounted() {
            this.handleRefresh();
        }
    };

    // 删除数据中空数组
    function formatParams(data) {
        data.forEach(item => {
            if (item.children) {
                if (item.children.length === 0) {
                    delete item.children;
                } else if (item.children.length > 0) {
                    formatParams(item.children);
                }
            }
        });
        return data;
    }
</script>

<style scoped lang="scss">
    .good-classification {
       // background-color: $background-color;
        min-height: 100%;
        box-sizing: border-box;
        /*padding-bottom: 73px;*/
        overflow: auto;
        /*margin:20px auto;*/
        margin-top: 20px;
        .header {
            padding: 20px 40px;
            background-color: #ffffff;

            .ivu-btn {
                margin-right: 20px;
            }
        }
        .header-space {
            height: 10px;
            width: 100%;
            background-color: $background-color;
        }

        .content {
            background-color: #ffffff;
            padding: 0 40px 40px 40px;
            position: relative;
        }

        .btn-bottom {
            padding: 20px 0 20px 170px;
            border-top: 1px solid $border-color;
            background-color: #ffffff;
            position: absolute;
            bottom: 0;
            left: 20px;
            right: 20px;
            z-index: 1000;

            > button {
                margin-right: 20px;
            }
        }
    }
</style>
