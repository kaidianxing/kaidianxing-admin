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
 * 文件导出
 * @description 根据文件地址和文件参数下载导出文件
 * @author Gao
 */
import { config as settings } from '@/api/config/settings.js';
import qs from 'qs';
import { getUserInfo } from './getUserInfo';
import Responsibility from '@/api/config/filter/api.filter';

export const Export = (downloadPath = '', params = {}) => {
    console.log(downloadPath, "---------downloadPath")
    if (downloadPath) {
        let sendUrl = '';
        if (-1 === downloadPath.indexOf(settings.base_url)) {
            let options = {
                baseURL: settings.base_url,
                url: downloadPath
            }
            Responsibility(options)
            sendUrl = options.baseURL + options.url;
        } else {
            sendUrl = downloadPath;
        }
        sendUrl = sendUrl.indexOf('?') > -1 ? sendUrl : sendUrl + '?';

        params = { ...params, ...getUserInfo() };

        sendUrl += `&${qs.stringify(params)}`;
        window.open(sendUrl);
    }
}
