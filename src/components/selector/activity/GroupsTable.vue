/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="table">
        <div class="search">
            <Input
                v-model="search.keyword"
                search
                enter-button="搜索"
                placeholder="请输入"
                @on-search="handleSearch"
                @on-enter="handleSearch"
                class="width-250"
            />
        </div>
        <Table
            ref="table"
            :columns="columns"
            :data="list"
            :loading="loading"
        >
            <template #type="{row}">
                <div>
                    <tag-label :type="row.presell_type === '1' ? 'info' : 'warning'">
                        {{ row.inner_type === '0' ? '普通拼团' : '阶梯拼团' }}
                    </tag-label>
                </div>
            </template>
            <template slot-scope="{ row }" slot="date">
                <div class="time">起：{{ row.start_time }}</div>
                <div class="time">止：{{ row.end_time }}</div>
            </template>
        </Table>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search: {
                keyword: "",
            },
            columns: [
                    {
                        title: '活动名称',
                        key: 'title',
                    },
                    {
                        title: '拼团方式',
                        slot: 'type',
                    },
                    {
                        title: '商品数量',
                        key: 'goods_count',
                    },
                    {
                        title: '活动时间',
                        slot: 'date',
                        width: 190,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 110,
                        render: (h, params) => {
                            return (
                                <div class="action">
                                    <Button class="default-primary"
                                            style={{ display: params.row.checked ? 'none' : 'block' }}
                                            onClick={() => {
                                                this.setChecked(params.index, true);
                                            }}
                                    >选择</Button>
                                    <Button type="primary"
                                            style={{ display: params.row.checked ? 'block' : 'none' }}
                                            onClick={() => {
                                                this.setChecked(params.index, false);
                                            }}
                                    >已选</Button>
                                </div>
                            );
                        }
                    }
                ],
        };
    },
    methods: {
        handleSearch() {
            this.$emit('on-search', this.search)
        },
        setChecked(index,status){
            this.$emit('on-change', {
                index,
                status
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.search {
    display: flex;
    padding-bottom: 20px;
    .label {
        display: inline-block;
        width: 100px;
        padding-top: 6px;
        text-align: right;
        color: $text-first;
        @include font-14-20;
    }
}
</style>
