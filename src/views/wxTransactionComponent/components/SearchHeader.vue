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
    <div class="search-header">
        <kdx-header-bar>
            <template #header>
                <div class="header-btn">
                    <Button type="primary" :disabled="noManagePerm " @click="handleAction('add')">+添加商品</Button>
                    <Button class="primary-border" :disabled="noManagePerm" @click="handleAction('refresh') ">同步刷新</Button>
                    <Button type="text" @click="handleAction('explain')">自定义交易组件说明</Button>
                </div>
            </template>
            <Form ref="form" :model="model" :label-width="100" inline @submit.native.prevent>
                <FormItem label="商品名称：">
                    <Input type="text" v-model="model.keywords" placeholder="请输入商品名称" @on-enter="handleSearch"
                           class="width-172"></Input>
                </FormItem>
                <FormItem label="商品状态：">
                    <Select v-model="model.goods_status" class="width-160">
                        <Option
                            v-for="item in optionData.status"
                            :key="item.field"
                            :value="item.field"
                        >{{ item.title }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="审核状态：">
                    <Select v-model="model.wx_status" class="width-160">
                        <Option
                            v-for="item in optionData.auditStatus"
                            :key="item.field"
                            :value="item.field"
                        >{{ item.title }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="提交时间：">
                    <DatePicker
                        v-model="createTime"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm"
                        placeholder="提交时间"
                        class="width-340"
                        @on-change="changeDate"
                    ></DatePicker>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
    </div>
</template>

<script>
export default {
    name: "SearchHeader",

    data() {
        return {
            model: {
                keywords: '',
                start_time: '',
                end_time: '',
                goods_status: 'all',
                wx_status: 'all',
            },
            createTime: [],
            optionData: {
                status: [
                    {
                        field: 'all',
                        title: '全部'
                    },
                    {
                        field: 1,
                        title: '出售中'
                    },
                    {
                        field: 2,
                        title: '已售罄'
                    },
                    {
                        field: 3,
                        title: '仓库中'
                    },
                    {
                        field: 4,
                        title: '回收站'
                    }
                ],
                auditStatus: [
                    {
                        field: 'all',
                        title: '全部',
                    },
                    {
                        field: 20,
                        title: '审核中',
                    },
                    {
                        field: 30,
                        title: '审核成功',
                    },
                    // {
                    //     field: 10,
                    //     title: '审核撤销',
                    // },
                    {
                        field: 40,
                        title: '审核失败',
                    },
                ]
            }
        };
    },
    computed: {
        noManagePerm(){//无管理权限
            return !this.$getPermMap('wxTransactionComponent.index.manage')
        },
    },
    methods: {
        handleSearch() {
            let params = {
                ...this.model
            }
            if (params.goods_status === 'all') {
                params.goods_status = '';
            }
            if (params.wx_status === 'all') {
                params.wx_status = '';
            }
            this.$emit('on-search', params);
        },
        changeDate(date) {
            this.model.start_time = date?.[0] || ''
            this.model.end_time = date?.[1] || ''
        },
        reset() {
            this.model = {
                keywords: '',
                start_time: '',
                end_time: '',
                goods_status: 'all',
                wx_status: 'all',
            }
            this.createTime = [];
        },
        handleReset() {
            this.$emit('on-search', {});
            this.reset();
        },
        handleAction(type) {
            this.$emit('on-action', type)
        }
    }
};
</script>

<style scoped lang="scss">
.header-btn {
    /deep/ .ivu-btn {
        margin-right: 10px;
    }
}
</style>
