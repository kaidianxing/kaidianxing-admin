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
    <kdx-content-bar v-loading="loading">
        <div class="printer-task-index">
            <Form ref="form" :model="taskData" :rules="rules" :label-width="120">
                <kdx-form-title>{{id?'编辑打印任务':'添加打印任务'}}</kdx-form-title>
                <div class="level">
                    <FormItem label="打印任务：" prop="name">
                        <Input class="width-340" type="text" maxlength="30" show-word-limit v-model="taskData.name" placeholder="请输入"/>
                    </FormItem>
                    <FormItem class="r-form-item-checkbox" label="打印场景：" prop="scene">
                        <CheckboxGroup v-model="taskData.scene">
                            <Checkbox v-for="(item, index) in sceneList" :key="index" :label="item.value">{{item.name}}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem
                            label="物流方式："
                            prop="delivery"
                            class="r-form-item-checkbox"
                    >
                        <CheckboxGroup v-model="taskData.delivery">
                            <div class="logistics-box">
                                <Checkbox
                                        label="10"
                                        :disabled="dispatchEnable.express === 0"
                                >
                                    快递发货
                                    <span v-if="dispatchEnable.express === 0">
                            (当前不可用，请到
                            <span
                                    style="color: #2D8CF0;cursor: pointer;"
                                    @click="fnJumpOrdinaryExpress"
                            >
                                【配送方式】
                            </span>
                            管理中开启)
                        </span>
                                </Checkbox>
                            </div>
                        </CheckboxGroup>
                    </FormItem>
                </div>
                <kdx-form-title>打印模板设置</kdx-form-title>
                <div class="level">
                    <FormItem label="选择小票模板：" prop="template_id">
                        <Select class="width-340" v-model="taskData.template_id" placeholder="请选择小票模板">
                            <Option v-for="item in templateList" :key="item.id" :value="item.id">{{item.name}}</Option>
                        </Select>
                        <Button class="mL-20" type="text" @click="handlerRefresh">刷新</Button>
                        <Button class="mL-20" type="text" @click="handlerAdd">添加模板</Button>
                    </FormItem>
                    <FormItem class="r-form-item-checkbox" label="打印联数：" prop="ver">
                        <RadioGroup v-model="taskData.times" >
                            <Radio :label="1">1联</Radio>
                            <Radio :label="2">2联</Radio>
                            <Radio :label="3">3联</Radio>
                            <Radio :label="4">4联</Radio>
                        </RadioGroup>
                    </FormItem>
                </div>
                <kdx-form-title>打印机设置</kdx-form-title>
                <FormItem label="打印机：" required>
                    <div class="next-box">
                        <Button class="default-primary" @click="addPrinter">+添加打印机</Button>
                        <div class="printer-box">
                            <Table v-if="selector.list.length>0" ref="table" :columns="columns" :data="selector.list"></Table>
                        </div>
                    </div>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">保存</Button>
        </template>

        <!--打印机选择器-->
        <printer-selector v-model="selector.value" :multiple="true" :current-list="selector.list"
                         @on-change="changePrinterList" @on-cancel="cancelSelector"></printer-selector>
    </kdx-content-bar>
</template>

<script>

    import PrinterSelector from "@/components/selector/PrinterSelector";
    import {mapActions} from "vuex";
    import {modelMap, stateMap} from "@/views/goods/add/base/components/binders";
    export default {
        name: "index",
        components: {
            PrinterSelector,
        },
        props: {},
        data() {
            return {
                id: '',
                loading: false,
                taskData: {
                    name: '',
                    scene: [1],
                    template_id: '',
                    times: 1,
                    printer_id: [],
                    delivery: [], // 物流方式
                },
                dispatchEnable: {}, //物流方式显示
                templateList: [],
                selector: {
                    value: false,
                    list: []
                },
                sceneList: [],
                columns: [
                    {
                        title: '打印机名称',
                        key: 'name',
                    },
                    {
                        title: '打印机品牌',
                        key: 'brand',
                    },
                    {
                        title: '打印机位置',
                        key: 'location',
                        render: (h, params) => {
                            return (
                                <div>{params.row.location||'-'}</div>
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            if (params.row.status == 0) {
                                return (
                                    <div>
                                        <Button class="marginR-10" type="text" disabled>已禁用</Button>
                                        <Button class="marginR-10" type="text" onClick={() => {this.handleEditPrinter(params.row.id)}}>编辑</Button>
                                        <Button type="text" onClick={() => {this.handleDeletePrinter(params.index)}}>删除</Button>
                                    </div>
                                )
                            } else {
                                return (
                                    <div>
                                        <Button class="marginR-10" type="text" onClick={() => {this.handleEditPrinter(params.row.id)}}>编辑</Button>
                                        <Button type="text" onClick={() => {this.handleDeletePrinter(params.index)}}>删除</Button>
                                    </div>
                                )
                            }
                        }
                    },
                ],
                rules: {
                    name: [
                        {required: true, message: '请输入打印机名称'}
                    ],
                    template_id: [
                        {required: true, message: '请选择小票模板'}
                    ],
                    scene: [
                        {required: true, type: 'array', min: 1, message: '请选择打印场景'},
                    ],
                    times: [
                        {required: true, message: '请选择打印联数'}
                    ],
                    delivery: [
                        {
                            required: true,
                            message: '物流方式必选',
                            min:1,
                            type: "array",
                        },
                    ],
                }
            }
        },
        computed: {
            ...modelMap(),
            ...stateMap(['dispatchList']),
        },
        created() {
            this.getInfo()
        },
        mounted() {
            this.getPrinterScene();
            this.getPrinterTemList();
            if (this.$route?.query.id) {
                this.id = this.$route?.query.id || '';
                this.getData()
            }
        },
        methods: {
            ...mapActions('goodAddEdit', ['getDispatchEnable']),
            async getInfo() {
                this.dispatchEnable = await this.getDispatchEnable()
                let { express } = this.dispatchEnable;
                if(express) {
                    this.taskData.delivery.push('10')
                }
            },
            // 物流支持是否选中 1 普通快递
            expressSelected(code) {
                return new Set(this.$store.state.goodAddEdit.model.logistics_support).has(code)
            },
            getPrinterScene() {
                this.loading = true;
                this.$api.printerApi.getPrinterScene().then(res => {
                    if (res.error == 0) {
                        this.loading = false;
                        this.sceneList = res.data
                    }
                })
            },
            getPrinterTemList() {
                this.$api.printerApi.getPrinterTemList({only_list: 1}).then(res => {
                    if (res.error == 0) {
                        this.templateList = res.data
                    }
                })
            },
            getData() {
                this.$api.printerApi.editPrinterTaskList({id: this.id}).then(res => {
                    if (res.error == 0) {
                        console.log(res);
                        this.taskData = {
                            name: res.data.name,
                            scene: res.data.scene,
                            template_id: res.data.template_id.toString(),
                            times: res.data.times,
                            delivery: res.data.delivery,
                            printer_id: res.data.printer_id.map((item) => item.id),
                        };
                        this.selector.list = res.data.printer_id;
                    }
                })
            },
            handlerRefresh() {
                this.getPrinterTemList()
            },
            handlerAdd() {
                this.$router.push({
                    path: '/printer/template/add'
                });
            },
            addPrinter() {
                this.selector.value = true;
            },
            changePrinterList(list) {
                this.selector.list = list;
                this.cancelSelector();
            },
            cancelSelector() {
                this.selector.value = false;
            },
            handleEditPrinter(id) {
                let path = '/printer/manage/edit';
                let query = {id};
                this.$utils.openNewWindowPage(path, query);
            },
            handleDeletePrinter(index) {
                this.selector.list.splice(index,1)
            },
            handleSave() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.submit()
                    }
                });
            },
            submit() {
                if (this.selector.list.length<=0) {
                    this.$Message.error('请选择打印机')
                    return
                }
                let ids = this.selector.list.map((item) => item.id);
                let obj = {
                    ...this.taskData,
                    printer_id: ids.join(','),
                    scene: this.taskData.scene.join(','),
                };
                if (this.id) {
                    obj.id = this.id
                }
                this.$api.printerApi[this.id?'savePrinterTaskList':'addPrinterTaskList'](obj).then(res => {
                    if (res.error == 0) {
                        this.$Message.success('保存成功');
                        this.$router.replace({
                            path: '/printer/task/list',
                        })
                    }
                })
            },
            // 跳转普通快递
            fnJumpOrdinaryExpress() {
                this.$utils.openNewWindowPage('/order/ordinary-express');
            },
            choosePlace() {
                this.$refs.selector.setValue()
            },
        },
    }
</script>

<style lang="scss" scoped>
    .printer-task-index {
        padding: 40px;
        /*margin-top: 20px;*/
        min-height: 100%;
        background-color: #fff;
        .level {
            padding-bottom: 30px;
        }
        .logistics-box {
            margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
        }
        .next-box {
            margin-top: 10px;
            background-color: #f4f6f8;
            padding: 30px 20px;
            border-radius: 2px;
            font-size: 14px;
            line-height: 20px;
            color: #262b30;
            /deep/ .ivu-form-item:last-child {
                margin-bottom: 0;
            }
            /deep/ .ivu-form-item-error-tip {
                padding-left: 120px !important;
            }
            .marginL-160 {
                margin-left: 160px;
            }
            .printer-box {
                margin-top: 10px;
                max-width: 800px;
                padding: 0 20px;
                background-color: #ffffff;
            }
        }
        .nest-box /deep/ .ivu-form-item-error-tip {
            margin-left: 120px;
        }
        .nest-box {
            &-table {
                margin-top: 10px;
                width: 810px;
                padding: 0 20px;
                background: #fff;
                border-radius: 2px;
            }
            /deep/ .ivu-form-item-error {
                .ivu-select-selection {
                    border-color: $border-color;
                    border-radius: 2px;
                }

                .ivu-select-arrow {
                    color: #808695;
                }
            }
        }
    }
</style>
