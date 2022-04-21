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
    <div class="vip-grade">
        <kdx-header-bar type="little">
            <template #header>
                <div class="flex space-between">
                    <Button type="primary" :disabled="noManagePerm" @click='toAddGrade'>+添加会员等级</Button>
                    <div class="flex">
                        <Form ref="form" :model="search" :label-width="100" inline @submit.native.prevent>
                            <FormItem label="等级名称：">
                                <Input type="text" v-model="search.keyword" placeholder="关键词查询" class="width-160" @on-enter="handleSearch"/>
                            </FormItem>
                            <FormItem label="等级状态：">
                                <Select :value="search.state" class="width-160" @on-change="handleChange">
                                    <Option v-for="item in grade" :key="item.value" :value="item.value">
                                        {{item.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Form>
                        <div class="btn">
                            <Button class="mL-20" type="primary" @click="handleSearch">搜索</Button>
                            <Button class="mL-20" type="text" @click="handleReset">重置</Button>
                        </div>
                    </div>
                </div>
            </template>
        </kdx-header-bar>
        <div class="table-list" v-loading="loading">
            <table-list ref='tableList' :data="list" :total="total" @getList="getList" @on-page-change="changePage"></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import TableList from "./components/TableList";

    export default {
        name: "index",
        inject:['returnToTop'],
        components: {
            TableList
        },
        data() {
            return {
                search: {
                    state: 'all',
                    keyword: ''
                },
                grade: [
                    {
                        value: 'all',
                        name: '全部'
                    },
                    {
                        value: '1',
                        name: '启用'
                    },
                    {
                        value: '0',
                        name: '禁用'
                    }
                ],
                list: [],
                total: 0,
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
                loading: false
            };
        },
        computed: {
            noManagePerm() { //管理权限
                return !this.$getPermMap('member.level.manage')
            },
        },
        created() {
        },
        mounted() {
            this.$history.setRoute(this.$route).getData(history=>{
                this.$nextTick(()=>{
                    this.search=history.search||{
                        state: 'all',
                        keyword: ''
                    }
                    this.page=this.$utils.deepCopy(history.page)|| {
                        pageSize: 10,
                        pageNumber: 1
                    }
                    this.$refs.tableList.reset(this.page)
                    this.getList()
                })
            })
        },
        methods: {
            handleChange(value){
                this.search.state=value
            },
            toAddGrade() {
                this.$router.push({
                    path: "/member/grade/add"
                })
            },
            getList() {
                this.returnToTop();
                this.loading = true;
                let obj = {
                    ...this.search,
                    state: this.search.state == 'all'?'':this.search.state,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                };
                this.$history.setData({
                    search:this.$utils.deepCopy(this.search),
                    page:this.page
                })

                this.$api.memberApi.getLevelList(obj).then(res => {
                    this.loading = false;
                    if (res.error == 0) {
                        this.list = res.list;
                        this.total = res.total;
                    }
                })
            },
            addLabelGrade() {

            },
            handleSearch() {
                this.getList()
            },
            // 重置
            handleReset() {
                this.search = {
                    state: '',
                    keyword: ''
                };
                this.getList()
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
        }
    };
</script>

<style scoped lang="scss">
    .vip-grade {
        background-color: $background-color;
        margin: 20px auto;
        .table-list {
            background-color: #ffffff;
            padding: 0 20px;
            margin-top: 10px;
            border-radius: 2px;
            position: relative;
        }

        .header-bar {
            .ivu-form .ivu-form-item {
                margin-bottom: 0;
            }
        }
    }
</style>
