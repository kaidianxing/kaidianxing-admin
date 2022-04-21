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
    <div class="good-label-add">
        <kdx-content-bar>
            <div class="label-content">
                <kdx-form-title>{{type}}</kdx-form-title>
                <Form ref="form" :model="model" :rules="rules" :label-width="120">
                    <FormItem label="排序：" prop="sort_by">
                        <Input v-model="model.sort_by" maxlength="4" placeholder="排序" class="width-160" />
                    </FormItem>
                    <FormItem label="标签组名称：" prop="name">
                        <Input type="text" v-model="model.name" :disabled="isDefault" placeholder="标签组名称" class="width-160" />
                    </FormItem>
                    <FormItem label="添加标签：" prop="label">
                        <Button class="default-primary" @click="addLabel" :disabled="isDefault" style="display: block">+添加标签</Button>
                        <div class="label-tag-box" v-if="model.label && model.label.length> 0">
                            <kdx-tag-label class="label-tag" :closable="!isDefault"  v-for="(item, index) in model.label" :key="index" @on-close="closeLabel(index)" @label-click="addLabel(index)">
                                {{item.name}}</kdx-tag-label>
                        </div>
                    </FormItem>
                    <FormItem label="是否启用：" prop="status" class="r-form-item-checkbox">
                        <RadioGroup v-model="model.status">
                            <Radio label="1">是</Radio>
                            <Radio label="0">否</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </div>
            <template #btn>
                <Button class="primary-long" @click="handleSave">保存</Button>
                <Button class="default-long" @click="goBack">返回列表</Button>
            </template>
        </kdx-content-bar>
        <add-modal v-model="addModal" :disabled="isDefault" :item="getItem" @on-submit="submitAdd"></add-modal>
    </div>
</template>

<script>    
    import AddModal from '../components/AddModal'
    export default {
        name: "index",
        components: {
            AddModal
        },
        data() {
            return {
                model: {
                    sort_by: '',
                    name: '',
                    label: [],
                    status: '1'
                },
                rules: {
                    sort_by: [{
                        pattern: /^(0|[1-9][0-9]*)$/,
                        message: '排序为数字类型，最长为4位数'
                    }],
                    name: [{
                        required: true,
                        message: '标签组名称必填'
                    }],
                    label: [{
                        required: true,
                        type: 'array',
                        message: '标签必填'
                    }]
                },
                label: [],
                itemLabel: {
                    name: ''
                },
                id: 0,
                loading: false,
                type: '添加标签组',
                addModal: false,
                checkIndex: -1
            };
        },
        computed: {
            getItem(){
                if(this.checkIndex>=0){
                    return this.model.label[this.checkIndex]??null
                }
                return null
            },
            isDefault(){
                return this.model.is_default =='1'
            }
        },
        methods: {
            addLabel(index) {
                this.checkIndex = typeof index == 'number'? index: -1
                this.addModal = true;
            }, 
            submitAdd(data){
                if(this.checkIndex>=0){
                    Object.assign(this.model.label[this.checkIndex],data)
                } else {
                    this.model.label.push(data)
                }
                this.addModal = false
            },
            getData() {
                this.$api.goodsApi.getLabelGroup({
                        id: this.id
                    })
                    .then(res => {
                        if (res.error === 0) {
                            this.model = res.data;
                        }
                    });
            },
            init() {
                this.id = this.$route.query.id || 0;
                if (this.id) {
                    this.getData();
                    this.type = '修改标签组';
                } else {
                    this.type = '添加标签组';
                    this.model = {
                        name: '',
                        status: '1',
                        label: []
                    };
                }
            },
            closeLabel(index) {
                this.model.label.splice(index, 1);
            },
            handleSave() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        if (this.id) {
                            let params = Object.assign({
                                id: this.id
                            }, this.model);
                            this.$api.goodsApi.editLabelGroup(params)
                                .then(res => {
                                    this.loading = false;
                                    if (res.error === 0) {
                                        this.$Message.success('标签组修改成功');
                                        this.$router.go(-1);
                                    }
                                });
                        } else {
                            this.$api.goodsApi.addLabelGroup(this.model)
                                .then(res => {
                                    this.loading = false;
                                    if (res.error === 0) {
                                        this.$Message.success('标签组新增成功');
                                        this.$router.go(-1);
                                    }
                                });
                        }
                    }
                });
            },
            goBack() {
                this.$router.go(-1);
            }
        },
        mounted() {
            this.init();
        }
    };
</script>

<style scoped lang="scss">
    .good-label-add {
        height: 100%;
        background-color: $background-color;
        position: relative;
        .label-content {
            margin: 20px auto 0;
            height: 100%;
            padding: 40px;
            background: #ffffff;

            .label-tag-box {
                margin-top: 10px;
            }

            .label-tag{
                margin-right: 8px;
                margin-bottom: 8px;
                cursor: pointer;
            }
        }
    }
</style>
