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
/**
 * @Description:海报
 * @author Gao
 * @date 2021/12/16
 */
export const posterApi = {
    // 添加海报
    addPoster: {
        method: 'post',
        api: 'manage/poster/list/add'
    },
    // 编辑海报
    editPoster: {
        method: 'get',
        api: 'manage/poster/list/edit'
    },
    posterList:{
        method: 'get',
        api: 'manage/poster/list'
    },
    //保存海报
    savePoster:{
        method: 'post',
        api: 'manage/poster/list/save'
    },
    //应用中海报列表
    usingPosterList:{
        method: 'get',
        api: 'manage/poster/list/using'
    },
    //禁用海报
    forbiddenPoster:{
        method: 'post',
        api: 'manage/poster/list/forbidden'
    },
    //启用海报
    enablePoster:{
        method: 'post',
        api: 'manage/poster/list/active'
    },
    //删除海报
    delPoster:{
        method: 'post',
        api: 'manage/poster/list/delete'
    },
    //系统海报模板
    getSysTempList:{
        method: 'get',
        api: 'manage/poster/template/system-list'
    },
    //系统海报模板
    getTempDetail:{
        method: 'get',
        api: 'manage/poster/template/get'
    }
}