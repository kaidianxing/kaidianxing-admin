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
        <template #header>
            <Button  type="primary"  @click="showAddGoodsModal">+添加商品</Button>
        </template>
        <Form
            ref="form"
            :model="model"
            :label-width="100"
            inline
            @submit.native.prevent
        >
            <template>
                <FormItem label="商品名称：">
                    <Input
                        type="text"
                        v-model="model.keywords"
                        placeholder="商品名称/编码/条码"
                        @on-enter="handleSearch"
                        class="width-340"
                    />
                </FormItem>

                <FormItem label="营销标签：">
                    <Select v-model="model.label_field" class="width-160">
                        <Option
                            v-for="item in optionData.label_field"
                            :key="item.field"
                            :value="item.field"
                            >{{ item.title }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="商品分类：">
                    <tree-select
                        class="width-160 tree-select"
                        v-model="model.category_id"
                        placeholder="全部"
                        :data="category"
                        transfer
                        multiple
                        showCheckbox
                        @change-data="changeData"
                    ></tree-select>
                </FormItem>
                <FormItem label="创建时间：">
                    <DatePicker
                        v-model="model.created_at"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm"
                        placeholder="商品创建时间"
                        @on-change="changeDate"
                        class="width-340"
                    ></DatePicker>
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
            </template>

            <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                    <Button type="text" @click="handleExport">导出</Button>
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
                sub_shop_name: '',
                keywords: '',
                label_field: 'all',
                category_id: [],
                created_at: '',
                sh: '',
                audit_created_at: '',
                type: 'all',
                audit_status: 'all',
                audit_time: '',
            },
            category: [],
            optionData: {
                // 营销标签
                label_field: [
                    {
                        field: 'all',
                        title: '全部',
                    },
                    {
                        field: 'is_hot',
                        title: '热卖',
                    },
                    {
                        field: 'is_new',
                        title: '新品',
                    },
                    {
                        field: 'is_recommand',
                        title: '推荐',
                    },
                ],
            },
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
                    }
                ]
            },
        }
    },
    created() {
        // console.log(this, '----->>')
        // 获取商品分类
        this.getCategory()
    },
    methods: {
        // 商品分类
        getCategory() {
            this.$api.goodsApi.goodClassifyList().then((res) => {
                if (res.error === 0) {
                    this.category = dealClassifyList(res.list)
                }
            })
        },
        // 添加商品
        showAddGoodsModal() {
            this.$emit('showAddGoodsModal')
        },
        // 搜索
        handleSearch() {
            let params = {
                ...this.model,
            }
            if (this.model.label_field === 'all') {
                params = {
                    ...params,
                    label_field: '',
                }
            }
            if (this.model.type === 'all') {
                params = {
                    ...params,
                    type: '',
                }
            }

            if (this.model.audit_status === 'all') {
                params = {
                    ...params,
                    audit_status: '',
                }
            }
            this.$emit('on-search', params)
        },
        reset(data) {
            data=data||{}
            this.model = {
                keywords: data.keywords||'',
                label_field: !data.label_field?'all':data.label_field,
                category_id: data.category_id||[],
                created_at: data.created_at||'',
                type:  data.type===undefined?'all':data.type,
                audit_status: (data.audit_status===undefined||data.audit_status==='')?'all':data.audit_status*1,
                sub_shop_name: data.sub_shop_name||'',
                audit_created_at: data.audit_created_at||'',
                audit_time: data.audit_time||'',
                sh:data.sh||'',
            }
        },
        handleReset() {
            this.$emit('on-search', {})
            this.reset()
        },
        handleExport() {
            this.$emit('on-export')
        },
        changeDate(date) {
            if (date[0]) {
                this.model.created_at = date
            } else {
                this.model.created_at = ''
            }
        },

        // 日期
        changeDateSh(e){
            this.model.audit_time = e;
        },
        changeDateaudit_created_at(e){
            this.model.audit_created_at = e;
        },

        changeData(list) {
            // 处理select多选取消选中问题
            function deep(arr = []) {
                if (Array.isArray(arr)) {
                    arr.forEach((item) => {
                        if (item.children && item.children.length > 0) {
                            item.indeterminate = item.children.some(
                                (subItem) => {
                                    return subItem.checked === true
                                }
                            )
                            deep(item.children)
                        }
                    })
                }
            }
            deep(list)
            this.category = list
        },
    },
}
</script>
<style lang="scss" scoped>
.tree-select {
    /deep/ .ivu-select-selection {
        height: 32px;
        overflow: hidden;
    }
}
</style>
