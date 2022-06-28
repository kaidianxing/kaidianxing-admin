<template>
    <kdx-header-bar>

        <template #header>
            <Button :disabled="noManagePerm" type="primary" @click="addCard">+添加素材</Button>
        </template>
        <Form ref="form" :model="model" :label-width="100" inline @submit.native.prevent>
            <FormItem label="商品信息：">
                <i-input type="text" v-model="model.title" placeholder="请输入商品信息" @on-enter="handleSearch" class="width-340"/>
            </FormItem>
            <FormItem label="推广文案：">
                <i-input type="text" v-model="model.description" placeholder="请输入推广文案" @on-enter="handleSearch" class="width-340"/>
            </FormItem>
            <FormItem label="添加时间：">
                <DatePicker v-model="model.create_time" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择添加时间" class="width-340"></DatePicker>
            </FormItem>
            <div class="ivu-form-item-btn">
                <Button type="primary" @click="handleSearch">搜索</Button>
                <Button type="text" @click="handleReset">重置</Button>
            </div>
        </Form>
    </kdx-header-bar>
</template>

<script>
    export default {
        data() {
            return {
                model: {
                    description: '',
                    title: '',
                    create_time: [],
                },
                typeList: [
                    {
                        value: '全部',
                        label: '全部',
                    },
                    {
                        value: 0,
                        label: '图片',
                    },
                    {
                        value: 1,
                        label: '视频',
                    },
                ],
            }
        },
        computed: {
            noManagePerm() {
                return !this.$getPermMap('material.index.manage')
            },
        },
        methods: {
            // 创建
            addCard() {
                this.$router.push({
                    path: '/material/add',
                })
            },
            // 搜索
            handleSearch() {
                let params = {
                    ...this.model,
                    // type: this.model.type === '全部'?'':this.model.type,
                };
                this.$emit('on-search', params)
            },
            // 重置
            handleReset() {
                this.reset();
                this.handleSearch()
            },
            reset() {
                this.model = {
                    description: '',
                    title: '',
                    create_time: [],
                };
            },
        },
    }
</script>
<style lang="scss" scoped></style>
