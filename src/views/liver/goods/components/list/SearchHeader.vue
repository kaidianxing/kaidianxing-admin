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
            :label-width="100"
            inline
            style="min-width:1200px;overflow:auto;"
            @submit.native.prevent
        >
            <FormItem label="商品名称：">
                <Input
                    type="text"
                    v-model="model.title"
                    placeholder="请输入商品名称"
                    class="width-340"
                    @on-enter="handleSearch"
                />
            </FormItem>
            <!-- <FormItem label="商品状态：">
                <Select
                    v-model="model.status"
                    class="width-160"
                >
                    <Option
                        v-for="(item,index) in statusList"
                        :key="index"
                        :value="item.type"
                    >{{ item.text }}
                    </Option>
                </Select>
            </FormItem> -->
            <FormItem label="商品类型：">
                <Select
                    v-model="model.goods_type"
                    class="width-160"
                >
                    <Option
                        v-for="item in optionData.label_field"
                        :key="item.id"
                        :value="item.id"
                    >{{ item.text }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="审核状态：">
                <Select
                    v-model="model.bro_goods_status"
                    class="width-160"
                >
                    <Option
                        v-for="item in approvalStatus"
                        :key="item.id"
                        :value="item.id"
                    >{{ item.text }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="商品分类：">
                <tree-select
                    class="width-160 tree-select"
                    v-model="model.category_id"
                    placeholder="全部"
                    :data="categoryList"
                    transfer
                    multiple
                    showCheckbox
                    @change-data="changeData"
                ></tree-select>
            </FormItem>
            <FormItem label="商品分组：">
                <Select
                    v-model="model.group_id"
                    class="width-160"
                >
                    <Option
                        v-for="item in groupList"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>

            <div class="ivu-form-item-btn">
                <Button
                    type="primary"
                    @click="handleSearch"
                >搜索</Button>
                <Button
                    type="text"
                    @click="handleReset"
                >重置</Button>
            </div>
        </Form>
    </kdx-header-bar>
</template>

<script>
import TreeSelect from '@/components/tree-select/index.vue'
import { dealClassifyList } from '@/assets/helpers'

const statusObj = {
    'all': '',
    applySuc: '2',
}


export default {
    name: 'SearchHeader',
    components: {
        TreeSelect,
    },
    data() {
        return {
            model: {
                title: '',
                category_id: '',
                group_id: [],
                bro_goods_status: 'all',
                goods_type: 'all'
            },
            categoryList: [],
            groupList: [],
            statusList: [
                {
                    text: '全部',
                    type: 'all',
                },
                {
                    text: '出售中',
                    type: '0',
                }

            ],
            optionData: {
                // 营销标签
                label_field: [
                    {
                        text: '全部',
                        id: 'all',
                    },
                    {
                        text: '实体',
                        id: '0',
                    },
                    {
                        text: '虚拟',
                        id: '1',
                    },
                ],
            },
            approvalStatus: [
                { text: '全部', id: 'all' },
                { text: '未审核', id: '0' },
                { text: '审核中', id: '1' },
                { text: '审核通过', id: '2' },
                { text: '审核驳回', id: '3' },
            ]
        }
    },
    created() {
        // 获取商品分类
        this.getCategory()
        // 获取商品分组
        this.goodGroupList()
    },
    watch: {
        '$route': {
            handler(newVal) {
                this.model = {
                    title: '',
                    category_id: 'all',
                    goods_type: 'all',
                    group_id: 'all',
                    bro_goods_status: statusObj[newVal.params.status]
                }
                this.$emit('on-search', this.model)
            },
            immediate: true
        }
    },
    methods: {
        // 获取商品分类
        getCategory() {
            this.$api.goodsApi.goodClassifyList().then((res) => {
                if (res.error === 0) {
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
                title: '',
                category_id: 'all',
                goods_type: 'all',
                group_id: 'all',
                bro_goods_status: 'all'
            }
        },
        changeTime(date) {
            if (!date[0]) {
                this.model.created_at = '';
            } else {
                this.model.created_at = date;
            }
        },
        handleReset() {
            this.reset()
            this.$emit('on-search', this.model)
        },
    },
}
</script>
<style lang="scss" scoped>
.btn-group {
    margin: 0 0 20px 30px;
}
</style>