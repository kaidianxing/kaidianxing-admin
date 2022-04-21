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
    <div class="system-form">
        <div class='system-form-main'>
            <div class="diyphone">
                <DiyPhone :type="type"></DiyPhone>
            </div>
            <div class="form-setter" ref="form_setter">
                <kdx-content-bar ref="content_bar" v-loading="loading">
                    <Form ref="form" :model="model" :rules="rules" :label-width="120" class="form-setter-item">
                        <kdx-form-title>基本信息</kdx-form-title>
                        <BaseInfo :id="id"></BaseInfo>
                        <div class="form-adder-box" :style="styleBox">
                            <div ref="form_adder" :style="styles">
                                <kdx-form-title>添加字段</kdx-form-title>
                                <ItemAdder :items='formItems'></ItemAdder>
                            </div>
                        </div>
                        <kdx-form-title>表单设置</kdx-form-title>
                        <ItemSetter></ItemSetter>
                    </Form>
                    <template #btn>
                        <Button class="primary-long" @click="handleSave">保存</Button>
                        <Button class="default-long" @click="goBack">返回</Button>
                    </template>
                </kdx-content-bar>
            </div>
        </div>
    </div>
</template>

<script>
    import BaseInfo from '@/views/form/components/baseInfo.vue'
    import ItemAdder from '@/views/form/components/FormItemAdder.vue'
    import ItemSetter from '@/views/form/components/FormItemSetter.vue'
    import formItems from '@/store/form/systemForm.js'
    import DiyPhone from '@/views/form/components/diyPhone/systemForm'
    import {
        mapState
    } from 'vuex'

    export default {
        components: {
            BaseInfo,
            ItemAdder,
            ItemSetter,
            DiyPhone
        },
        data() {
            return {
                formItems: formItems.global,
                rules: {
                    title: [
                        {required: true, message: '表单名称必填'}
                    ]
                },
                styles: {},
                styleBox: {},
                type: '',
                loading: false,
                id: ''
            }
        },
        computed: {
            ...mapState('form', {
                model: state => state.model
            })
        },
        methods: {
            handleSave() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        let form = this.$store.state.form;
                        if (!form.formItems?.length) {
                            this.$Message.error('请选择表单');
                            return;
                        }
                        let type = {
                            order: 1,
                            commission: 2,
                            vip: 3,
                            goods: 4,
                        }
                        let params = {
                            name: this.$store.state.form.model.title,
                            content: JSON.stringify(this.$store.state.form.formItems),
                            type: type[this.type]
                        }
                        if (this.id) {
                            this.loading = true;
                            params.id = this.id;
                            this.$api.formApi.editSystem(params).then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('系统表单修改成功');
                                    this.$router.push({
                                        path: '/systemForm/list'
                                    })
                                }
                            }).finally(() => {
                                this.loading = false
                            })
                        } else {
                            this.loading = true;
                            this.$api.formApi.createSystemForm(params).then(res => {
                                if (res.error === 0) {
                                    this.loading = false;
                                    this.$Message.success('系统表单添加成功');
                                    this.$router.push({
                                        path: '/systemForm/list'
                                    })
                                }
                            }).finally(() => {
                                this.loading = false;
                            })
                        }
                    } else {
                        this.$Message.error('请填写表单名称');
                    }
                })
            },
            goBack() {
                this.$Modal.confirm({
                    title: '确认离开',
                    content: '系统可能不会保存您所做的操作？',
                    onOk: () => {
                        this.$router.push({
                            path: '/systemForm/list'
                        })
                    }
                })
            }
        },
        mounted() {
            this.$store.commit('form/initForm');
            this.type = 'order';
            this.id = this.$route.query.id;
            if (this.id) {
                this.loading = true;
                this.$api.formApi.getSystem({id: this.id})
                    .then(res => {
                        if (res.error === 0) {
                            this.$store.commit('form/setFormItems', JSON.parse(res.data.content));
                            this.$store.commit('form/setTitle', res.data.name)
                        }
                    }).finally(() => {
                    this.loading = false;
                })
            }
            let lastLeft = 0, isDif = false;
            this.$nextTick(() => {
                this.$refs['content_bar'].handleScroll(e => {
                    let elBox = this.$refs['form_adder'];
                    let left = elBox.getBoundingClientRect().left,
                        width = this.$refs['form_setter'].clientWidth - 86,
                        styles = elBox.getBoundingClientRect();
                    this.styleBox = {
                        height: `${styles.height + 30}px`
                    }
                    if (lastLeft !== left) {
                        lastLeft = left;
                        isDif = true;
                    } else {
                        isDif = false;
                    }
                    if (e.target.scrollTop >= 200 || (isDif && e.target.scrollTop >= 200)) {
                        this.styles = {
                            position: 'fixed',
                            width: `${width}px`,
                            top: '110px',
                            left: `${left}px`,
                            background: '#ffffff',
                            'border-bottom': '1px solid #e9edef',
                            zIndex: 10
                        }
                    } else {
                        this.styles = {}
                    }
                })
            });
        }
    }
</script>

<style lang="scss" scoped>
    .system-form {
        width: 100%;
        /*height: calc(100% + 40px);*/
        .system-form-main {
            display: flex;
            width: 100%;
            /*height: calc(100% - 40px);*/
            box-sizing: border-box;
            /*padding: 20px 0 0 0;*/
            overflow: hidden;
        }
        .diyphone {
            /*width: 375px;*/
            height: calc(100vh - 76px);
            flex-shrink: 0;
            margin-right: 20px;
            background: #fff;
            /*padding: 40px;*/
            padding-top: 40px;
            overflow-y: auto;
            margin-top: 20px;
        }
        .form-setter {
            flex: 1;
            height: calc(100vh - 110px);
            overflow-y: auto;
            .form-setter-item {
                min-height: 100%;
                margin-top: 20px;
                padding: 40px;
                background-color: #FFFFFF;
            }
        }
        .form-adder-flex {
            position: fixed;
            top: 60px;
            background-color: #FFFFFF;
            right: 0;
            width: 100%;
            z-index: 10;
            margin-top: 20px;
        }
        .form-adder-box {
            width: 100%;
            background-color: #FFFFFF;
        }
    }
</style>
