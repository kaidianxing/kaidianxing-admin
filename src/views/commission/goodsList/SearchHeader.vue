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
    <kdx-header-bar>
        <Form
            ref="form"
            :label-width="110"
            inline
            style="min-width:1200px;overflow:auto;"
            @submit.native.prevent
        >
            <FormItem label="商品名称：">
                <Input
                    type="text"
                    v-model="model.keywords"
                    placeholder="商品名称/编码/条码"
                    class="width-340"
                    @on-enter="handleSearch"
                />
            </FormItem>
            <FormItem label="商品分类：">
                <tree-select
                    class="width-160"
                    v-model="model.category_id"
                    :transfer="true"
                    :data="categoryList"
                    @change-data="changeData"
                ></tree-select>
            </FormItem>
            <FormItem label="商品分组：">
                <Select v-model="model.group_id" class="width-160">
                    <Option
                        v-for="item in groupList"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="商品状态：">
                <Select v-model="model.status" class="width-160">
                    <Option
                        v-for="item in statusList"
                        :key="item.type"
                        :value="item.type"
                    >
                        {{ item.text }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="商品类型：">
                <Select v-model="model.type" class="width-160">
                    <Option
                            v-for="item in goodsType.label_field"
                            :key="item.field"
                            :value="item.field"
                    >{{ item.title }}
                    </Option>
                </Select>
            </FormItem>
            <div class="ivu-form-item-btn">
                <Button type="primary" @click="handleSearch">搜索</Button>
                <Button type="text" @click="handleReset">重置</Button>
            </div>
        </Form>
    </kdx-header-bar>
</template>

<script>
import TreeSelect from '@/components/tree-select/index.vue'
import { dealClassifyList } from '@/assets/helpers'
export default {
    name: 'SearchHeader',
    components: {
        TreeSelect,
    },
    data() {
        return {
            model: {
                keywords: '',
                category_id: 'all',
                status: 'all',
                group_id: 'all',
                type: 'all', //商品类型
            },
            categoryList: [],
            groupList: [],
            statusList: [
                {
                    text: '全部',
                    type: 'all',
                },
                {
                    text: '上架',
                    type: '1',
                },
                {
                    text: '售磬',
                    type: '2',
                },
                {
                    text: '下架',
                    type: '3',
                },
                {
                    text: '回收站',
                    type: '4',
                },
            ],
            // 商品类型
            goodsType: {
                label_field: [
                    {
                        field: 'all',
                        title: '全部',
                    },
                    {
                        field: 0,
                        title: '实体商品',
                    },
                    {
                        field: 1,
                        title: '虚拟商品',
                    },
                    {
                        field: 2,
                        title: '虚拟卡密',
                    },
                ]
            },
        }
    },
    created() {
        // 获取商品分类
        this.getCategory()
        // 获取商品分组
        this.goodGroupList()
    },
    methods: {
        // 获取商品分类
        getCategory() {
            this.$api.goodsApi.goodClassifyList().then((res) => {
                if (res.error === 0) {
                    res.list.unshift({
                        id: 'all',
                        name: '全部',
                    })
                    this.categoryList = dealClassifyList(res.list)
                }
            })
        },
        // 获取商品分组
        goodGroupList() {
            this.$api.goodsApi
                .goodGroupList({
                    pager: 0,
                })
                .then((res) => {
                    if (res.error == 0) {
                        this.groupList = res.list
                        this.groupList.unshift({
                            id: 'all',
                            name: '全部',
                        })
                    }
                })
        },
        changeData(list) {
            this.categoryList = list
        },
        // 搜索
        handleSearch() {
            this.$emit('on-search', this.model)
        },
        reset() {
            this.model = {
                keywords: '',
                category_id: 'all',
                status: 'all',
                group_id: 'all',
                type: 'all', // 商品分类
            }
        },
        handleReset() {
            this.reset()
            this.$emit('on-search', this.model)
        },
    },
}
</script>
