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
    <kdx-modal-frame v-model="value" :title="id ? '编辑类目' : '新增类目'" :width="650" :loading="loading" @on-cancel="handleCancel"
                 @on-ok="handleOk">
        <div class="add-goods">
            <Form ref="form" :model="model" :rules="rules" :label-width="100" @submit.native.prevent>
                <FormItem label="选择分类：" prop="classify">
                    <Cascader :value="Cascader" :data="classifyData" transfer filterable :disabled="!!id"
                              @on-change="changeClassify" class="width-340"></Cascader>
                    <kdx-hint-text>选择需要进行类目审核的商品分类</kdx-hint-text>
                </FormItem>
                <FormItem label="营业执照：" prop="business">
                    <kdx-image-video :current="model.business" :width="80" :height="80" @on-change="changeImage($event, 'business')"></kdx-image-video>
                    <kdx-hint-text>营业执照或组织机构代码证</kdx-hint-text>
                </FormItem>
                <FormItem label="资质材料：" prop="certificate">
                    <kdx-image-video :current-list="model.certificate" multiple :limit="50" :width="80" :height="80" @on-change="changeImage($event, 'certificate')"></kdx-image-video>
                    <kdx-hint-text :style="{'margin-top': model.certificate.length >= 50 ? '0' : '-20px'}">{{ certificateHint }}</kdx-hint-text>
                </FormItem>
            </Form>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: "AddGoods",
    props: {
        id: {
            type: [Number, String]
        }
    },
    data() {
        return {
            value: false,
            model: {
                classify: '',
                business: '',
                certificate: [],
            },
            Cascader: [],
            rules: {
                classify: [
                    {required: true, message: '分类必填'}
                ],
                business: [
                    {required: true, message: '营业执照必填'}
                ],
                certificate: [
                    {required: true, message: '资质材料必填'}
                ]
            },
            loading: false,
            classifyData: [],
            certificateHint: '',
            business: [],
            certificate: []
        };
    },
    methods: {
        async setValue() {
            this.value = !this.value;
            if (this.value) {
                this.loading = true;
                this.resetModel();
                await this.getCategory();
                this.id && await this.getDetail();
                this.loading = false;
            }
        },
        getCategory() {
            return new Promise(resolve => {
                this.$api.wxTransactionComponentApi.getCategory({sign: true}).then(res => {
                    if (res.error === 0) {
                        this.classifyData = res.data || [];
                    }
                }).finally(() => {
                    resolve();
                });
            })
        },
        getDetail() {
            return new Promise(resolve => {
                this.$api.wxTransactionComponentApi.getCategoryAuditDetail({id: this.id}).then(res => {
                    if (res.error === 0) {
                        this.getCascader(res.data.category_id, this.classifyData)
                        this.business = res.data.path?.license || [];
                        this.certificate = res.data.path?.certificate || [];
                        this.model = {
                            classify: res.data.category_id,
                            business: this.business?.[0]?.path || '',
                            certificate: this.certificate.map(item => item.path)
                        }
                    }
                }).finally(() => {
                    resolve();
                })
            })
        },
        // 编辑时获取分类选中项
        getCascader(id, list) {
            let res = [];
            for (let item of list) {
                res = [item.value]
                if (item.children?.length) {
                    for (let childItem of item.children) {
                        res = [res[0], childItem.value];
                        if (childItem.children) {
                            for (let child of childItem.children) {
                                if (child.value === id) {
                                    res.push(child.value);
                                    this.Cascader = res;
                                }
                            }
                        }
                    }
                }
            }
            for (let item of list) {
                if (item.value === this.Cascader[0]) {
                    this.certificateHint = item.qualification;
                    break;
                }
            }
        },
        handleOk() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.loading = true;
                    let params = {
                        cat_id: this.model.classify,
                        path: {
                            license: this.getPathParams(this.business, [this.model.business]),
                            certificate: this.getPathParams(this.certificate, this.model.certificate)
                        }
                    };
                    this.id && (params.id = this.id);
                    console.log('params', params, this.model.certificate)
                    this.$api.wxTransactionComponentApi.addCategoryAudit(params).then(res => {
                        if (res.error === 0) {
                            let message = this.id ? '类目编辑成功' : '类目添加审核成功';
                            this.$Message.success(message);
                            this.setValue();
                            this.$emit('on-refresh');
                        }
                    }).finally(() => {
                        this.loading = false;
                    });
                }
            });
        },
        /**
         * 获取image 路径的params
         * @param list  先前保存的值，如果不存在就不需要进行比对，直接返回新添加的image
         * @param data  选中的图片地址
         * @returns {(*|{path: *})[]|{path: *}[]}
         */
        getPathParams(list = [], data = []) {
            return data.map(path => {
                let res = list.filter(item => item.path === path);
                return res.length > 0 ? res[0] : {
                    path
                }
            })
            // if (list.length) {
            //     return list.map(item => {
            //         if (data.indexOf(item.path) > -1) {
            //             return item;
            //         }
            //         return {
            //             path: item
            //         }
            //     })
            // } else {
            //     return data.map(item => {
            //         return {
            //             path: item
            //         }
            //     })
            // }
        },
        handleCancel() {
            this.setValue();
        },
        changeClassify(list, data) {
            if (data?.length) {
                this.certificateHint = data[0].qualification;
            } else {
                data = this.getSelectClassify(list, this.classifyData);
            }
            let item = data[data.length - 1];
            this.model.classify = item.value;
            this.Cascader = list.map(item => parseInt(item));
        },
        getSelectClassify(list, classifyData, data = []) {
            classifyData.forEach(item => {
                if (item.value === +list[data?.length || 0]) {
                    data.push(item);
                    item.children?.length && this.getSelectClassify(list, item.children, data);
                    item.qualification && (this.certificateHint = item.qualification);
                }
            })
            return data;
        },
        resetModel() {
            // this.model = {
            //     classify: '',
            //     business: '',
            //     certificate: [],
            // };
            this.$refs['form'].resetFields();
            console.log('model', this.model)
            this.Cascader = [];
            this.certificateHint = '';
        },
        changeImage(data, type) {
            this.model[type] = data;
        }
    }
};
</script>

<style scoped lang="scss">
.add-goods {
    padding: 30px 20px 0 20px;
    /deep/ .slide-image {
        >ul {
            margin-bottom: 0;
            margin-right: -15px;
            li {
                margin-bottom: 15px !important;
                margin-right: 15px;
            }
        }
    }
}

.goods {
    display: flex;
    align-items: center;

    .image {
        width: 60px;
        height: 60px;
        border: 1px solid #E9EDEF;
        box-sizing: border-box;
        border-radius: 2px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .content {
        padding-left: 10px;
        @include font-14-20;
        color: $text-first;
        @include font-multiple-omit(2);

        .mark {
            padding: 1px 3px;
            @include font-12-16;
            border-radius: 2px;
            margin-right: 5px;
        }

        .real {
            background-color: $brand-light;
            color: $brand-color;
        }

        .more {
            background-color: $warning-light;
            color: $warning-color;
        }

        .virtual {
            color: #00C5C5;
            background-color: #E6FFF9;
        }

        .fruit {
            color: $danger-color;
            background-color: $danger-light;
        }
    }

    .price {
        font-weight: bold;
    }
}
</style>
