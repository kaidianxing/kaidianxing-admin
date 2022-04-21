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
    <div class="container">
        <kdx-header-bar>
            <Form
                        ref="form"
                        :model="searchData"
                        :label-width="100"
                        inline
                        @submit.native.prevent
                    >
                        <FormItem label="关键字：">
                            <Input
                                type="text"
                                v-model="searchData.keyword"
                                placeholder="可搜索操作员用户名"
                                class="width-340"
                                @on-enter="handleSearch"
                            />
                        </FormItem>
                        <FormItem label="操作时间：">
                            <DatePicker
                                v-model="selectDate"
                                type="datetimerange"
                                format="yyyy-MM-dd HH:mm"
                                placeholder="操作时间"
                                class="width-340"
                                :confirm="true"
                            ></DatePicker>
                        </FormItem>
                        <div class="ivu-form-item-btn">
                            <Button
                                    class="mL-20"
                                    type="primary"
                                    @click="handleSearch"
                            >
                                搜索
                            </Button>
                            <Button class="mL-20" type="text" @click="handleReset">
                                重置
                            </Button>
                        </div>
                    </Form>
        </kdx-header-bar>
        <div class="list-wrap" v-loading="loading">
            <Table ref="table" :columns="columns" :data="list">
                <template slot-scope="{ row }" slot="content">
                    <div v-if="row.content && row.content.length > 200">
                        {{ `${row.content.slice(0, 200)}...` }}
                        <Tooltip
                            placement="top"
                            theme="light"
                            :max-width="700"
                            :content="row.content"
                        >
                            更多
                        </Tooltip>
                    </div>
                    <div v-else>
                        {{ row.content }}
                    </div>
                </template>
            </Table>
            <div class="footer-page">
                <kdx-page-component
                    ref="page"
                    :total="total"
                    :pageSize="pagesize"
                    @on-change="changePage"
                ></kdx-page-component>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import { formatDate } from '@/assets/helpers/index'

export default {
    inject:['returnToTop'],
    components: {},
    props: {},
    data() {
        return {
            total: 0,
            selectDate: ['', ''],
            // 搜索信息
            searchData: {
                keyword: '',
                startTime: '',
                endTime: ''
            },
            columns: [
                {
                    title: 'ID',
                    width: 100,
                    key: 'id'
                },
                {
                    title: '操作员',
                    width: 160,
                    key: 'username'
                },
                {
                    title: '操作IP',
                    width: 160,
                    key: 'ip'
                },
                {
                    title: '操作时间',
                    width: 120,
                    key: 'created_at'
                },
                {
                    title: '操作类型',
                    width: 300,
                    key: 'title'
                },
                {
                    title: '操作内容',
                    slot: 'content'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 80,
                    render: (h, params) => {
                        return (
                            <Button type="text" onClick={() => {
                                this.detail(params.row.id);
                            }}>查看</Button>
                        );
                    }
                }
            ],
            page: 1,
            pagesize: 10,
            list: [],
            loading: false
        }
    },
    watch: {
        selectDate: {
            handler(value) {
                this.searchData.startTime =
                    value[0] === ''
                        ? ''
                        : formatDate(new Date(value[0]), 'yyyy-MM-dd hh:mm:ss')
                this.searchData.endTime =
                    value[1] === ''
                        ? ''
                        : formatDate(new Date(value[1]), 'yyyy-MM-dd hh:mm:ss')
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        this.getLogList()
    },
    methods: {
        // 获取日志列表
        getLogList() {
            this.returnToTop();
            this.loading = true;
            let _params = {
                page: this.page,
                pagesize: this.pagesize
            }
            if (this.searchData.keyword) {
                _params['name'] = this.searchData.keyword
            }
            if (this.searchData.startTime) {
                _params['created_at[0]'] = this.searchData.startTime
            }
            if (this.searchData.endTime) {
                _params['created_at[1]'] = this.searchData.endTime
            }
            this.$api.settingApi.getOperateLogList(_params).then(res => {
                this.loading = false;
                if (res.error == 0) {
                    this.total = res.total
                    this.list = [...res.list]
                }
            })
        },
        // 点击搜索按钮
        handleSearch() {
            this.page = 1
            this.pagesize = 10
            this.$refs['page']?.reset()
            this.getLogList()
        },
        // 点击重置按钮
        handleReset() {
            this.selectDate = ['', '']
            this.searchData.startTime = ''
            this.searchData.endTime = ''
            this.searchData.keyword = ''
            this.page = 1
            this.pagesize = 10
            this.$refs['page']?.reset()
            this.getLogList()
        },
        // 切换页码
        changePage(page) {
            this.page = page.pageNumber
            this.pagesize = page.pageSize
            this.getLogList()
        },
        detail(id) {
            this.$router.push({
                path: '/setting/systemAuthority/operationLog/detail',
                query: {id}
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #f4f6f8;
    margin: 20px auto;
}

.list-wrap {
    padding: 0 20px;
    background-color: #ffffff;
    border-radius: 2px;
    position: relative;
}

.ivu-form .ivu-form-item {
    margin-bottom: 0;
}

.ivu-tooltip {
    cursor: pointer;
    color: $brand-color;
}
</style>
