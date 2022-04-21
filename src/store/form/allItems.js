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
export const pictures = {
    id: "pictures",
    type: 'pictures',
    name: '图片',
    params: {
       title:'图片',
        explain: '',
        maxNumber: 10,
        value: [],
        required: true
    },
    style: {

    },
    data: []
};
export const singlelinetext = {
    id: "singlelinetext",
    type: 'singlelinetext',
    name: '单行文本',
    params: {
        title: '单行文本',
        value: '',
        tip: '请输入',
        explain: '',
        required: true
    },
    style: {

    },
    data: []
};
export const multilinetext = {
    id: "multilinetext",
    type: 'multilinetext',
    name: '多行文本',
    params: {
        title: '多行文本',
        value: '',
        tip: '请输入',
        explain: '',
        required: true
    },
    style: {

    },
    data: []
};
export const selector = {
    id: "selector",
    type: 'selector',
    name: '下拉选项',
    params: {
        title: '下拉选项',
        value: '',
        explain: '',
        tip: '请选择',
        required: true
    },
    style: {

    },
    data: [{
            name: '选项1'
        },
        {
            name: '选项2'
        }
    ]
};
export const radios = {
    id: "radios",
    type: 'radios',
    name: '单选',
    params: {
        title: '单选',
        value: '',
        explain: '',
        required: true
    },
    style: {

    },
    data: [{
            name: '选项1'
        },
        {
            name: '选项2'
        }
    ]
};
export const checkboxes = {
    id: "checkboxes",
    type: 'checkboxes',
    name: '多选',
    params: {
        title: '多选',
        value: [],
        explain: '',
        required: true
    },
    style: {

    },
    data: [{
            name: '选项1'
        },
        {
            name: '选项2'
        }
    ]
};
export const city = {
    id: "city",
    type: 'city',
    name: '地区',
    params: {
        title: '地区',
        status: 2,
        province: '',
        city: '',
        area: '',
        explain: '',
        tip: '请选择地区',
        required: true
    },
    style: {

    },
    data: []
};
export const datepicker = {
    id: "datepicker",
    type: 'datepicker',
    name: '日期',
    params: {
        title: '日期',
        tip: '选择日期',
        status: 0,
        value: '',
        explain: '',
        required: true
    },
    style: {

    },
    data: []
};
export const daterange = {
    id: "daterange",
    type: 'daterange',
    name: '日期范围',
    params: {
        title: '日期范围',
        explain: '',
        start: {
            tip: '请选择开始日期',
            status: 0,
            value: ''
        },
        end: {
            tip: '请选择结束日期',
            status: 0,
            value: ''
        },
        required: true
    },
    style: {

    },
    data: []
};
export const identity = {
    id: "identity",
    type: 'identity',
    name: '身份证号码',
    params: {
        title: '身份证号码',
        tip: '请填写18位身份证号码',
        value: '',
        explain: '',
        required: true
    },
    style: {

    },
    data: []
};
export const timer = {
    id: "timer",
    type: 'timer',
    name: '时间',
    params: {
        title: '时间',
        tip: '请选择时间',
        status: 0,
        value: '',
        explain: '',
        required: true
    },
    style: {

    },
    data: []
};
export const timerange = {
    id: "timerange",
    type: 'timerange',
    name: '时间范围',
    params: {
        title: '时间范围',
        explain: '',
        start: {
            tip: '请选择开始时间',
            status: 0,
            value: ''
        },
        end: {
            tip: '请选择结束时间',
            status: 0,
            value: ''
        },
        required: true
    },
    style: {

    },
    data: []
};
export const telephone = {
    id: "telephone",
    type: 'telephone',
    name: '手机号码',
    params: {
        title: '手机号码',
        tip: '请填写11位手机号码',
        value: '',
        explain: '',
        required: true
    },
    style: {

    },
    data: []
};
