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
    <Modal v-model="openModel" width="700" style="z-index:10000" @on-cancel="saveAsModel('cancel')">
        <p slot="header" style="height:29px;font-weight:bold;font-size:16px;padding:0 4px;line-height:30px;">另存为模板</p>
        <div class="save-model-body" style="height:351px;">
            <Form ref="formValidate" :model="formItem" :rules="rules" :label-width="114" @submit.native.prevent>
                <FormItem label="模板名称：" prop="tpl_name" required>
                    <Input style="width:430px;" placeholder="请输入模板名称" v-model="formItem.tpl_name" @on-blur='onBlur'></Input>
                </FormItem>
                <FormItem label="缩略图：">
                    <div class="preview-img-box">
                        <img :src="previewImage" alt />
                    </div>
                </FormItem>
            </Form>
        </div>
        <div class="save-model-footer" slot="footer">
            <Button type="default" class="cancel btn" @click="saveAsModel('cancel')">取消</Button>
            <Button type="primary" class="save btn" @click="saveAsModel('save')">保存</Button>
        </div>
    </Modal>
</template>

<script>
    import {
        mapState
    } from 'vuex'
    const pageTypeId = {
        //自定义页面的类型
        index: 10, //首页
        'goods-detail': 11, //商品详情
        'vip-center': 12, //会员中心
        'distribution': 20, //分销页面
    }
    export default {
        computed: {
            ...mapState('decorate', {
                pageInfo: state => state.pageInfo,
                pageList: state => state.pageList,
            }),
        },
        data() {
            return {
                rules: {
                    tpl_name: [{
                        validator: (rule, value, callback) => {
                            if(!this.formItem.tpl_name){
                                callback(new Error("请填写模板名称"))
                            }else{
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }]
                },
                openModel: false,
                formItem: {
                    tpl_name: '',
                    thumb: ''
                },
                previewImage: '',
                resolve: null,
                reject: null
            }
        },
        methods: {
            onBlur(){
                this.$refs.formValidate.validate()
            },
            toggleModal(thumb) {
                this.previewImage = thumb
                this.openModel = !this.openModel
                return new Promise((resolve, reject) => {
                    this.resolve = resolve
                    this.reject = reject
                })
            },
            saveAsModel(type) {
                if (type == 'save') {
                    let pageId = this.$route.params.page
                    let { ...common
                    } = this.pageInfo
                    if(!this.formItem.tpl_name){
                        this.$refs.formValidate.validate()
                        this.$Message.error('请填写模板名称')
                        return
                    }
                    let params = {
                        type: pageTypeId[pageId],
                        id: undefined,
                        name: this.formItem.tpl_name,
                        thumb: this.previewImage,
                        common: JSON.stringify(common),
                        content: JSON.stringify(this.pageList)
                    }
                    this.$api.decorateApi
                        .saveNewTpl(params)
                        .then(res => {
                            if (res.error == 0) {
                                this.resolve(res)
                                this.$Message.success('保存模板成功')
                            } else {
                                this.reject(res)
                            }
                        }).catch(err => {
                            this.reject(err)
                        })
                }else{
                    this.reject()
                }
                this.openModel = false
            },
        }
    }
</script>

<style lang="scss" scoped>
    .save-model-body {
        overflow-y: auto;
        padding-top: 20px;
    }
    .save-model-footer {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        .btn {
            width: 100px;
            height: 32px;
            margin: auto 10px;
        }
    }
    .preview-img-box {
        width: 112px;
        height: 160px;
        overflow: hidden;
        border-radius: 2px;
        img {
            width: 100%;
        }
    }
</style>