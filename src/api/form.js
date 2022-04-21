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
export const formApi = {
    // 获取系统表单列表
    getSystemFormList: {
        method: 'get',
        api: 'manage/form/list'
    },
    // 删除表单
    deleteSystemForm: {
        method: 'get',
        api: 'manage/form/list/delete'
    },
   // 设置系统表单禁用
    setSystemDisabled: {
        method: 'get',
        api: 'manage/form/list/forbidden'
    },
    // 设置系统表单启用
    setSystemActive: {
        method: 'get',
        api: 'manage/form/list/active'
    },
    // 获取系统表单
    getSystem: {
        method: 'get',
        api: 'manage/form/list/edit'
    },
    // 修改系统表单
    editSystem: {
        method: 'post',
        api: 'manage/form/list/edit'
    },
    // 系统更新数据
    updateSystemFormData: {
        method: 'get',
        api: 'manage/form/list/update'
    },
    // 删除表单数据
    removeFormData: {
        method: 'post',
        api: 'manage/form/list/delete-log'
    },
    // 系统表单详情
    getSystemFormDetail: {
        method: 'get',
        api: 'manage/form/list/detail'
    },
    // 创建系统表单
    createSystemForm: {
        method: 'post',
        api: 'manage/form/list/add'
    }
}
