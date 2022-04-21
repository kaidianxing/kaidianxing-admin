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
    <kdx-content-bar :loading="pageLoading">
        <div class="content">
            <kdx-form-title>您正在向【{{name}}】添加卡密数据</kdx-form-title>
            <kdx-hint-alert style="margin-bottom: 30px">
                <p class="bold">自动填充功能说明：</p>
                <p>1. 仅应用于字段1（key）值，其他字段不可自动填充；</p>
                <p>2.自动填充将根据当前表格的数值，自动填充其下方已展开的表格，空白则自动写入，若已有数据则覆盖（如：填入1，下方表格填入5，在1处点击自动填充，5将被修改为2）;</p>
                <p>3.自动填充仅适用于这些格式：00000001(纯数字)、C00000001(字母开头数字结尾)、C000SDD00001(字母数字混合，以数字结尾)，末尾连续数字不能超过16位，需要注意位数变化。其他格式请手动填写或者Excel导入。</p>
                <p class="bold" style="margin-top: 10px;">注意：</p>
                <p>1.每个字段下的数据，最长50个字符。</p>
                <p>2.添加数据时，保持位数相同，如该卡密库开启排重时，如有相同的数据时，重复数据不可导入添加。</p>
                <p>3.批量新增字段，一次最多支持50条数据。</p>
                <p>4.Excel导入数据一次最多支持1000条。</p>
            </kdx-hint-alert>
            <kdx-header-bar type="little">
                <template #header>
                    <div class="flex">
                        <kdx-rr-input class="width-250" v-model="addNum" number :fixed="0" :max-value="50">
                            <span slot="prepend">新增</span>
                            <span slot="append">条数据</span>
                        </kdx-rr-input>
                        <Button :loading="addLoading" class="mL-20" type="primary" @click="addData">添加</Button>
                    </div>
                </template>
                <div class="ivu-form-item-btn">
                    <Button class="mR-20" type="primary" @click="fastImportModel=true">快速导入数据</Button>
                    <Button class="mR-20" type="primary" @click="selectExcelFile">Excel导入</Button>
                    <Button class="mR-20" type="text" @click="handleDownLoad">下载模板</Button>
                </div>
            </kdx-header-bar>
            <Form ref="form" :label-width="0">
                <div class="table-list" v-loading="loading">
                    <Table ref="table" border :columns="handleColumn" :data="data" :row-class-name="rowClassName">
                        <template slot-scope="{ row, index }" slot="sort">
                            <FormItem>
                                <kdx-rr-input v-model="data[index].sort" number :fixed="0" class="width-70" placeholder="请输入字段名称"/>
                            </FormItem>
                        </template>
                        <template slot-scope="{ row, index, column }" slot="key">
                            <FormItem>
                                <div v-if="column._index === 2">
                                    <Input :ref="`input_key${index}`" v-model="data[index][`value${column._index-1}`]"
                                           :class="{error: data[index].errorKey&&column._index === 2}"
                                           maxlength="50"
                                           class="table-input" placeholder="请输入" @on-blur="handleBlur(index)">
                                        <span class="auto-fill" v-if="column._index === 2&&firstKeyType===0" type="text" slot="append" @click="autoFill(row.value1, index)">自动填充</span>
                                    </Input>
                                </div>
                                <div v-else>
                                    <Input v-model="data[index][`value${column._index-1}`]" class="table-input" maxlength="50" placeholder="请输入"></Input>
                                </div>
                            </FormItem>
                        </template>
                    </Table>
                </div>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :loading="submitLoading" @click="handleSave">保存</Button>
        </template>

        <input ref="upload_excel_input" class="upload-input-file" type="file"
               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
               @change="changeExcel">

        <!-- 快速导入弹窗 -->
        <fast-import v-model="fastImportModel" @ok="handleImport"></fast-import>
    </kdx-content-bar>
</template>

<script>

    import FastImport from "../components/FastImport";
    import { Export } from '@/helpers/export';
    import {uploadFile} from "@/api/config/fileRequest";
    import { config as settings } from '@/api/config/settings.js';

    export default {
        name: "index",
        components: {
            FastImport
        },
        props: {},
        data() {
            return {
                pageLoading: false,
                addLoading: false,
                submitLoading: false,
                loading: false,
                addNum: '', // 新增数据
                virtual_account_id: '', // 卡密库id
                is_repeat: 1,
                name: '',
                firstKeyType: 0, // 第一个字段的key是文本还是超链接 0 文本 1 超链接
                fastImportModel: false, // 快速导入弹窗
                errIndex: [],
                tableHeader: [], // 表头
                data: [],
                columns: [
                    {
                        title: ' ',
                        key: 'icon',
                        align: 'center',
                        width: 20,
                    },
                    {
                        title: '权重',
                        key: 'sort',
                        width: 80,
                        slot: 'sort'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 70,
                        fixed: 'right',
                        render: (h, params) => {
                            if (params.index === 0) {
                                return (<div></div>)
                            } else {
                                return (
                                    <div style="text-align: center;"><Button type="text" onClick={() => this.handleDelete(params.index)}>删除</Button></div>
                                )
                            }
                        }
                    }
                ],
            }
        },
        computed: {
            handleColumn() {
                let result = this.tableHeader.map(item=> {
                    return {
                        title: '',
                        key: 'value',
                        slot: 'key',
                        minWidth: 170,
                        renderHeader: ()=>{
                            return (
                                <div>{item}</div>
                            )
                        },
                    }
                });
                let columns = [...this.columns];
                columns.splice(2, 0, ...result);
                return columns
            }
        },
        created() {
            this.pageLoading = true;
            if (this.$route.query?.id) {
                this.virtual_account_id = this.$route.query?.id;
                this.getKey()
            }
        },
        mounted() {
        },
        methods: {
            getKey() {
                // 获取表头
                this.$api.virtualAccountApi.getVirKey({virtual_account_id:this.virtual_account_id}).then((res) => {
                    this.pageLoading = false;
                    if (res.error === 0) {
                        this.tableHeader = res.data.config.map(item=>item.key);
                        this.firstKeyType = +res.data.config?.[0].type;
                        // 判断文本还是超链接
                        this.is_repeat = +res.data.repeat;
                        this.name = res.data.name;
                        this.data.push(this.defaultData());
                    }
                })
            },
            defaultData() {
                let obj = {sort: '1'};
                for (let i = 0; i < this.tableHeader.length; i++) {
                    obj = {
                        ...obj,
                        [`value${i+1}`]: '',
                        errorKey: false
                    }
                }
                return obj
            },
            addData() {
                this.addLoading = true;
                if (!this.addNum) {
                    this.addLoading = false;
                    return
                }
                let obj = this.defaultData();
                for (let i = 0; i < this.addNum; i++) {
                    this.data.push({...obj})
                }
                this.addLoading = false;
            },
            handleDelete(index) {
                this.data.splice(index, 1)
            },
            // 快速导入
            handleImport(data) {
                // 判断最后一条是否为空
                let last_data = this.data[this.data.length-1],
                    empty = false;
                delete last_data.errorKey;
                let {sort, ...valueData} = last_data;
                if (sort === '1') {
                    empty = !Object.values(valueData).some(item => item)
                }
                let arr = [];
                for (let i = 0; i < data.length; i++) {
                    let obj = {
                        sort: '1',
                    };
                    Object.keys(valueData).map((item,index) => {
                        obj[item] = data[i][index] || ''
                    });
                    arr.push(obj)
                }
                if (empty) {
                    this.data.splice(-1,1,...arr)
                } else {
                    this.data = this.data.concat(arr)
                }
            },
            // 下载模板
            handleDownLoad() {
                let params = {virtual_account_id: this.virtual_account_id};
                console.log(this.$api.commissionApi.orderList.api)
                Export("manage/virtualAccount/virtual-account-data/download", params);
            },
            // 导入
            selectExcelFile() {
                this.$refs['upload_excel_input'].click();
            },
            changeExcel(e) {
                if (e) {
                    let name = e.target?.files[0]?.name;
                    let reg = /^.*\.(?:xls|xlsx)$/i;//文件名可以带空格
                    if (!reg.test(name)) {//校验不通过
                        this.$Message.error('请上传csv文件');
                        return
                    }
                    let params = new FormData();
                    params.append('virtual_account_id', this.virtual_account_id);
                    params.append('file', e.target.files[0]);
                    uploadFile('manage/apps/virtualAccount/virtual-account-data/import', params).then(res => {
                        if (res.error === 0) {
                            if (res.data.error_count) {
                                this.$Modal.confirm({
                                    title: '提示',
                                    content: `已成功导入 <span class="success-color">${res.data.success_count}</span> 条卡密数据, 发现 <span class="danger-color">${res.data.error_count}</span> 条数据为重复数据，请修改后继续导入`,
                                    cancelText: '立即下载',
                                    okText: '取消',
                                    onCancel: () => {
                                        this.$refs['upload_excel_input'] && (this.$refs['upload_excel_input'].value = '')
                                        let url = settings.public_url+res.data?.file_path;
                                        window.open(url)
                                    },
                                    onOk: () => {
                                        this.$refs['upload_excel_input'] && (this.$refs['upload_excel_input'].value = '')
                                    }
                                })
                            } else {
                                this.$Modal.success({
                                    title: '提示',
                                    content: `已成功导入 <span class="success-color">${res.data.success_count}</span> 条卡密数据`,
                                    onOk: () => {
                                        this.$refs['upload_excel_input'] && (this.$refs['upload_excel_input'].value = '')
                                    }
                                });
                            }
                        } else {
                            this.$refs['upload_excel_input'] && (this.$refs['upload_excel_input'].value = '')
                            this.$Message.error(res.message)
                        }
                    })
                }
            },
            // 自动填充
            async autoFill(value1, index) {
                let key = value1;
                let reg = /^[0-9a-zA-Z]*[0-9]{1,16}$/; // 验证末尾是否以数字结尾,并且末尾数字连续不能超过16位
                if (!reg.test(key)) {
                    return
                }
                let tmp = key.split(/[a-zA-Z]/g);
                let lastNum = tmp[tmp.length-1]; // 截取出末尾的数字
                let numLen = lastNum.replace(/./g, '9')-lastNum; // 数字可增加的最大长度
                let len = this.data.length - 1 - index; // 数组的长度
                let canFill = Math.min(len, numLen); // 可填充的长度
                let counter = 1;
                let numReplace = ''; //替换成。。。

                for (let i = index + 1; i <= index+canFill; i++) {
                    numReplace = '' + (lastNum * 1 + counter++);
                    for (let j = numReplace.length; j < lastNum.length; j++) {
                        numReplace = '0' + numReplace;
                    }
                    this.data[i].value1 = key.replace(/[0-9]+$/, numReplace);
                }

                console.log(numLen, len,'........', index, canFill);

                if (numLen < len) {
                    // 弹窗提示
                    let result = await this.handleModal();
                    if (result === 'cancel') {
                        this.data[index+canFill].errorKey = true;
                        this.$refs[`input_key${index+canFill}`].focus({
                            preventScroll: true
                        });
                    } else if (result === 'ok') {
                        // 继续添加
                        // 变化位数
                        this.data[index+canFill+1].value1 = key.replace(/[0-9]+$/, Number(lastNum)+canFill+1);
                        setTimeout(() => {
                            setTimeout(() => {
                                this.autoFill(this.data[index + canFill + 1].value1, index + canFill+1)
                            },100)
                        },0)
                    }
                }
                this.data = [...this.data];
            },
            handleBlur(index) {
                this.data[index].errorKey = false;
            },
            handleModal() {
                return new Promise(resolve => {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '添加字段位数发生改变，是否继续添加。',
                        cancelText: '取消添加',
                        okText: '继续添加',
                        // loading: true,
                        onCancel: () => {
                            resolve('cancel')
                        },
                        onOk: () => {
                            resolve('ok')
                        }
                    });
                });
            },
            async handleSave() {
                this.submitLoading = true;
                // 重复验证
                await this.repeatValidate().then(() => {
                    // 处理数据结构
                    let params = this.formatParams();
                    // 提交
                    this.submit(params)
                }).catch(err => {
                    if (err === 'is_required') {
                        this.$Message.error('字段必填');
                    } else if (err === 'is_repeat') {
                        this.rowClassName();
                        this.$Message.error('字段重复');
                    }
                    this.submitLoading = false;
                });
            },
            repeatValidate() {
                return new Promise((resolve, reject) => {
                    let is_required = false;
                    // 验证必填
                    for (let i = 0; i < this.data.length; i ++) {
                        delete this.data[i].errorKey;
                        if (Object.values(this.data[i]).some(val => !val)) {
                            is_required = true;
                            reject('is_required');
                            break
                        }
                    }
                    if (is_required){return}
                    if (this.is_repeat === 1) {
                        // 验证重复
                        let result = this.data.map(item => {
                            delete item.errorKey;
                            // 验证重复
                            let data = {...item};
                            delete data.sort;
                            return Object.values(data)
                        });
                        let arr = [];
                        if (result&&result.length) {
                            for (let i = 0; i < result.length -1; i++) {
                                for (let j = i+1; j < result.length; j++) {
                                    console.log(i, j,'.......');
                                    if (result[i].toString() == result[j].toString()) {
                                        if(!arr.includes(i)) {
                                            arr.push(i)
                                        }
                                        if(!arr.includes(j)){
                                            arr.push(j)
                                        }
                                        reject('is_repeat');
                                    }
                                }
                            }
                        }
                        this.errIndex = arr.sort();
                    }
                    resolve()
                })
            },
            rowClassName(row, index) {
                if (this.errIndex&&this.errIndex.length) {
                    if (this.errIndex.includes(index)) {
                        return 'table-error-min-row'
                    }
                }
                return '';
            },
            formatParams() {
                return this.data.map(item => {
                    delete item.errorKey;
                    let {sort, ...data} = item;
                    return {
                        sort,
                        data: JSON.stringify(data)
                    }
                });
            },
            submit(params) {
                this.$api.virtualAccountApi.addVirKeyData({data: params, virtual_account_id:this.virtual_account_id}).then(res => {
                    if (res.error === 0) {
                        this.tipModal(res.data)
                    }
                }).finally(() => {
                    this.submitLoading = false;
                })
            },
            tipModal(data) {
                if (data.length) {
                    let success_count = this.data.length - data.length;
                    this.$Modal.warning({
                        title: '提示',
                        content: `已成功导入 <span class="success-color">${success_count}</span> 条卡密数据, 发现 <span class="danger-color">${data.length}</span> 条数据为重复数据，请修改后继续导入`,
                        onOk: () => {
                            this.loading = true;
                            this.data = [];
                            this.data = data.map(item => {
                                let {sort, ...data}= item;
                                return {
                                    sort,
                                    ...JSON.parse(data.data),
                                    errorKey: false
                                }
                            });
                            for (let i = 0; i < data.length; i ++) {
                                this.errIndex.push(i)
                            }
                            this.loading = false;
                        }
                    });
                } else {
                    this.$Modal.success({
                        title: '提示',
                        content: `已成功导入 <span class="success-color">${this.data.length}</span> 条数据`,
                        onOk: () => {
                            // 刷新页面
                            this.loading = true;
                            this.data = [this.defaultData()];
                            this.loading = false;
                        }
                    });
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .content {
        background-color: #fff;
        padding: 30px 40px;
        min-height: 100%;
        margin: 0 auto 0;
        border-radius: 2px;
        /deep/ .ivu-alert .ivu-alert-icon {
            top: 6px;
        }
        /deep/ .form-title.hasMargin {
            margin-bottom: 10px;
        }
        /deep/ .header-bar > .little {
            padding: 0;
            height: 100%;
        }
        .ivu-form .ivu-form-item {
            margin-bottom: 0;
        }
        .table-list {
            margin-top: 10px;
            /*max-width: 813px;*/
            .ivu-btn {
                width: 100%;
                padding-top: 16px;
                padding-bottom: 16px;
                height: inherit;
                transform: translateY(-1px);
            }
            .error {
                /deep/ .ivu-input {
                    border-color: #ff1f2c;
                }
            }
            /deep/ .ivu-table-fixed-header thead tr th {
                padding: 7px 0;
                background-color: $background-color;
            }
            /deep/ .ivu-table {
                th, td {
                    border-right: none;
                    border-color: $border-color;
                }
                .ivu-table-cell {
                    padding: 10px 15px;
                }
                td:last-child {
                    position: relative;
                    z-index: 4;
                    right: 1px;
                }
                .table-error-min-row, .table-error-min-row:nth-child(n) + .table-error-min-row:nth-child(n+1){
                    td {
                        border-color: #ff1f2c;
                        border-top: 0;
                    }
                }
                .table-error-min-row td {
                    border-top: 1px solid #ff1f2c;
                }

                .table-error-min-row td:first-child {
                    border-left: 1px solid #ff1f2c;
                }
                .table-error-min-row td:last-child {
                    border-right: 1px solid #ff1f2c;
                }
                .ivu-table-header {
                    thead tr th {
                        background-color: $background-color;
                    }
                    .ivu-table-cell {
                        padding: 16px 0;
                    }
                }
                .ivu-input-group-append {
                    background-color: #fff;
                    .auto-fill {
                        color: $brand-color;
                        cursor: pointer;
                    }
                }
                .ivu-table-body {
                    .ivu-table-cell {
                        padding: 10px 10px 10px 0;
                        .edit-table-input {
                            padding-right: 10px;
                        }
                    }
                }
                .table-input {
                    width: 100%;
                    /*max-width: 50%;*/
                }
            }
        }
        .upload-input-file {
            display: none;
        }
    }
</style>