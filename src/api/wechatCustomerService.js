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