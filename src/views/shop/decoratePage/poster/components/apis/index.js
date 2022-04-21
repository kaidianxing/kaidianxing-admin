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
/* eslint-disable */
import {poster_pushsetting,poster_reward} from './getAsPageInfo'
let cache = {};
const pageTypeId = { //自定义页面的类型
    'goodposter': 10, //商品海报
    'commissionposter': 20, //分销海报
};

/**
 * 这里主要是页面的模板处理方法
 * 自定义组件的处理交由专门的自定义组件的处理对象处理
 *  
 */
export function getPage({
    pageId = '',
    type = '', //操作类型edit：编辑 ；add:添加
    tplId = '', //模板id
}) {
    cache = {
        pageId,
        type,
        tplId
    };
    if (tplId) { //编辑或者根据模板创建
        if (type == 'add' || type == '') { //根据模板新建
            this.$api.posterApi.getTempDetail({
                id: tplId
            }).then(res => {
                if(res.error==0){
                    this.pageInfo.title = res.data.name;
                    let content = res.data.content;
                    try {
                        content = JSON.parse(content)
                    } catch (err) {
                        content = [];
                    }
                    this.setPageList({
                        list: content,
                        pageId
                    })
                    
                    if(pageId=='followposter'){
                        this.clickTmp({id:'poster_pushsetting'})
                    }
                    this.clickTmp()
                }
            })
        } else {
            //   页面修改
            this.loading = true
            this.$api.posterApi.editPoster({
                id: tplId,
            }).then(res => {
                if (res.error == 0) {
                    let profile = res.data.profile
                    let {
                        content
                    } = profile
                    cache.id = profile.id;
                    cache.tmpId = profile.template_id
                    try {
                        content = JSON.parse(content)
                    } catch (err) {
                        content = [];
                    }
                    content = Array.isArray(content) ? content : []
                    this.setPageList({
                        list: content,
                        pageId
                    })
                    this.pageInfo.title = profile.name;
                    this.pageInfo.params = {
                        status: profile.status
                    }
                    if (profile.type == 20) {
                        this.pageInfo.params = {
                            ...this.pageInfo.params,
                            linkid: profile.visit_page
                        };
                    } else if (profile.type == 30) {
                        this.pageInfo.keywords= profile.keyword;
                        this.pageInfo.params = {
                            ...this.pageInfo.params,
                            linkid: profile.visit_page,
                            expire_start_time: profile.expire_start_time,
                            expire_end_time: profile.expire_end_time,
                            expire_time: profile.expire_time/24/3600,
                            access_type: profile.access_type,
                        };
                        this.asPageInfo.poster_pushsetting = poster_pushsetting(res)
                        this.asPageInfo.poster_reward= poster_reward(res)
                    }
                    this.clickTmp()
                }
            }).finally(() => {
                setTimeout(() => {
                    this.loading = false
                }, 500);
            })
        }
    } else { //创建空白页面
        if (this.$route.path == '/decorate/poster/followposter') {
            this.addModal({
                pageId: this.$route.params.page,
                list: [{
                    id: 'poster_pushsetting'
                }, {
                    id: 'poster_reward'
                }]
            })
        }
        this.clickTmp()
    }

}
/**
 * 这里主要是页面的模板处理方法
 * 自定义组件的处理交由专门的自定义组件的处理对象处理
 *  
 */
export function setPage(action, previewImage) {
    let {
        pageId = '', //
            type = '', //操作类型edit：编辑 ；add:添加
    } = cache;
    let pageInfo = {
        name: this.pageInfo.title,
        visit_page: this.pageInfo.params ?.linkid,
        keyword: this.pageInfo.keywords,
        expire_start_time: this.pageInfo.params.expire_start_time,
        expire_end_time: this.pageInfo.params.expire_end_time,
        expire_time: this.pageInfo.params.expire_time,
        access_type: this.pageInfo.params.access_type,
        status: this.pageInfo.params.status || 0
    }
    let poster_pushsetting = {}
    if (this.asPageInfo ?.poster_pushsetting) {
        let data = this.asPageInfo ?.poster_pushsetting
        poster_pushsetting = {
            push_type: data.params.type,
            push_title: data.params.title,
            push_thumb: data.params.thumb,
            push_desc: data.params.content,
            push_url: data.params.linkurl,
            push_url_name: data.params.linkurl_name,
        }
    }
    let poster_reward = {};
    if (this.asPageInfo ?.poster_reward) {
        let data = this.asPageInfo ?.poster_reward
        poster_reward = {
            award_status: data.params.open,
            rec_credit_enable: data.params.recommend.reward.indexOf('score') > -1 ? 1 : 0,
            rec_cash_enable: data.params.recommend.reward.indexOf('cash') > -1 ? 1 : 0,
            rec_coupon_enable: data.params.recommend.reward.indexOf('coupon') > -1 ? 1 : 0,
            rec_credit: data.params.recommend.score.num,
            rec_credit_limit: data.params.recommend.score.limit,
            rec_cash: data.params.recommend.cash.num,
            rec_cash_limit: data.params.recommend.cash.limit,
            rec_cash_type: data.params.recommend.cash.type == 'balance' ? 1 : 2,
            rec_coupon: data.params.recommend.coupon.list[0] ?.id,
            rec_coupon_limit: data.params.recommend.coupon.limit,
            sub_credit_enable: data.params.follower.reward.indexOf('score') > -1 ? 1 : 0,
            sub_cash_enable: data.params.follower.reward.indexOf('cash') > -1 ? 1 : 0,
            sub_coupon_enable: data.params.follower.reward.indexOf('coupon') > -1 ? 1 : 0,
            sub_credit: data.params.follower.score.num,
            sub_cash: data.params.follower.cash.num,
            sub_cash_type: data.params.follower.cash.type == 'balance' ? 1 : 2,
            sub_coupon: data.params.follower.coupon.list[0] ?.id,
        };
    }
    let params = {
        type: pageTypeId[pageId],
        thumb: previewImage,
        template_id: cache.tplId || 0,
        ...pageInfo,
        ...poster_pushsetting,
        ...poster_reward,
        content: JSON.stringify(this.pageList), //装修模板
    }
    if (action === 'publish') {
        params.status = '1'
    }
    if (type == 'edit') { //编辑 
        params.id = cache.id
        return this.$api.posterApi.savePoster(params)
    } else { //新建
        return this.$api.posterApi.addPoster(params)
    }
}