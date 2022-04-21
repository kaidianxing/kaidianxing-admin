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
export const printerApi = {
    // 打印机列表
    printerList: {
        method: 'get',
        api: 'manage/printer/index/list'
    },
    // 获取打印机类型
    getPrinterType: {
        method: 'post',
        api: 'manage/printer/setting/get-type'
    },
    // 获取打印场景
    getPrinterScene: {
        method: 'post',
        api: 'manage/printer/setting/get-scene'
    },
    // 添加打印机
    addPrinter: {
        method: 'post',
        api: 'manage/printer/index/add'
    },
    // 启用打印机
    printerActive: {
        method: 'get',
        api: 'manage/printer/index/active'
    },
    // 禁用打印机
    printerForbidden: {
        method: 'get',
        api: 'manage/printer/index/forbidden'
    },
    // 删除打印机
    deletePrinter: {
        method: 'get',
        api: 'manage/printer/index/delete'
    },
    // 编辑打印机
    editPrinter: {
        method: 'get',
        api: 'manage/printer/index/edit'
    },
    // 保存打印机
    savePrinter: {
        method: 'post',
        api: 'manage/printer/index/save'
    },
    // 打印-测试打印
    testPrinter: {
        method: 'post',
        api: 'manage/printer/index/test'
    },
    // 取消打印机未打印任务
    cancelPrinter: {
        method: 'post',
        api: 'manage/printer/index/cancel'
    },
    // 任务列表
    getPrinterTaskList: {
        method: 'get',
        api: 'manage/printer/task/list'
    },
    // 添加打印机任务
    addPrinterTaskList: {
        method: 'post',
        api: 'manage/printer/task/add'
    },
    // 编辑打印机任务
    editPrinterTaskList: {
        method: 'get',
        api: 'manage/printer/task/edit'
    },
    // 保存打印机任务
    savePrinterTaskList: {
        method: 'post',
        api: 'manage/printer/task/save'
    },
    // 删除打印机任务
    deletePrinterTaskList: {
        method: 'get',
        api: 'manage/printer/task/delete'
    },
    // 打印机模板列表
    getPrinterTemList: {
        method: 'get',
        api: 'manage/printer/template/list'
    },
    // 添加打印机模板
    addPrinterTem: {
        method: 'post',
        api: 'manage/printer/template/add'
    },
    // 保存打印机模板
    savePrinterTem: {
        method: 'post',
        api: 'manage/printer/template/save'
    },
    // 编辑打印机模板
    editPrinterTem: {
        method: 'get',
        api: 'manage/printer/template/edit'
    },
    // 删除打印模板
    deletePrinterTem: {
        method: 'get',
        api: 'manage/printer/template/delete'
    },
    // 打印任务-手动触发
    executePrinter: {
        method: 'post',
        api: 'manage/printer/task/execute'
    },
    // 获取打印设置
    getPrintSet: {
        method: 'get',
        api: 'manage/printer/'
    },
    // 保存打印设置
    setPrintSet: {
        method: 'post',
        api: 'manage/printer/'
    }

}