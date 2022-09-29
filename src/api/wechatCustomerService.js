/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
export const customerApi = {
    // 企业管理--------------------------------------


    //添加企业
    addCompany: {
        method: 'post',
        api: 'manage/wechatCustomerService/company/add'
    },
    // 获取企业列表
    getCompanyList: {
        method: 'get',
        api: 'manage/wechatCustomerService/company/list'
    },
    // 编辑企业
    editCompany: {
        method: 'post',
        api: 'manage/wechatCustomerService/company/edit'
    },
    // 删除企业
    delCompany: {
        method: 'post',
        api: 'manage/wechatCustomerService/company/delete'
    },

    //客服管理------------------------------------

    // 添加客服
    addService: {
        method: 'post',
        api: 'manage/wechatCustomerService/customer-service/add'
    },
    // 获取客服列表
    getServiceList: {
        method: 'get',
        api: 'manage/wechatCustomerService/customer-service/list'
    },
    // 编辑客服
    editService: {
        method: 'post',
        api: 'manage/wechatCustomerService/customer-service/edit'
    },
    // 删除客服
    delService: {
        method: 'post',
        api: 'manage/wechatCustomerService/customer-service/delete'
    },


}