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
export const virtualAccountApi = {
    // 添加卡密库
    virtualAccountAdd: {
        method: 'post',
        api: 'manage/virtualAccount/index/add'
    },
    // 获取卡密库详情
    getVirtualAccount: {
        method: 'get',
        api: 'manage/virtualAccount/index/edit'
    },
    // 编辑卡密库
    virtualAccountEdit: {
        method: 'post',
        api: 'manage/virtualAccount/index/edit'
    },
    // 卡密库列表
    virtualAccountList: {
        method: 'get',
        api: 'manage/virtualAccount/index/index'
    },
    // 删除卡密库
    virtualAccountDelete: {
        method: 'post',
        api: 'manage/virtualAccount/index/delete'
    },
    // 卡密库名称-去重验证
    checkvirtualAccounName: {
        method: 'post',
        api: 'manage/virtualAccount/index/check-name'
    },

    /*----------------------------回收站-----------------------------------------*/
    recycleList: {
        method: 'get',
        api: 'manage/virtualAccount/virtual-account-recycle-bin/index'
    },
    recycleBinDelete: {
        method: 'post',
        api: 'manage/virtualAccount/virtual-account-recycle-bin/delete'
    },
    recycleBinRecover: {
        method: 'post',
        api: 'manage/virtualAccount/virtual-account-recycle-bin/restore'
    },


    // 卡密库-添加数据获取key结构
    getVirKey: {
        method: 'get',
        api: 'manage/virtualAccount/virtual-account-data/get-data'
    },
    // 卡密库-添加卡密数据
    addVirKeyData: {
        method: 'post',
        api: 'manage/virtualAccount/virtual-account-data/add'
    },
    // 卡密库-添加数据-下载模板
    downLoadVirtualTemp: {
        method: 'get',
        api: 'manage/virtualAccount/virtual-account-data/download'
    },


    // 卡密库-查看卡密数据
    getVirKeyData: {
        method: 'get',
        api: 'manage/virtualAccount/virtual-account-data/index'
    },
    // 卡密库-删除卡密数据及更新权重值
    changeVirtualSort: {
        method: 'post',
        api: 'manage/virtualAccount/virtual-account-data/update-data'
    },
    // 卡密库-快速更新卡密字段数据
    updateVirData: {
        method: 'post',
        api: 'manage/virtualAccount/virtual-account-data/update'
    },
    // 卡密库-获取设置
    getVirtualSet: {
        method: 'get',
        api: 'manage/virtualAccount/setting/get'
    },
    // 卡密库-保存设置
    setVirtualSet: {
        method: 'post',
        api: 'manage/virtualAccount/setting/set'
    }
}