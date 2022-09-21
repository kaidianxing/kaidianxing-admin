
 export default {
    title: '企业管理',
    name: '企业管理',
    show: false,
    path: '/wechatCustomerService/manage/company/index',
    perm: '',
    children: {
        wechatCustomerCompany: {
            title: '企业管理',
            name: '企业管理',
            path: '/wechatCustomerService/manage/company/index',
            perm: 'wechatCustomerService.company.view',
        },
        wechatCustomerService: {
            title: '客服管理',
            name: '客服管理',
            path: '/wechatCustomerService/manage/service/index',
            perm: 'wechatCustomerService.customer-service.view',
        },
    }
 }