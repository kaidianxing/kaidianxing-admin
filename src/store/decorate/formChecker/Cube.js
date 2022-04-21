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

function dealPoint(x, y) {
    if (!x || !y) return
    //  取出起点与结束点坐标
    let [startX, startY] = x.split(',');
    let [endX, endY] = y.split(',');

    // 取出最小坐标(sx,sy)最大坐标(ex,ey)
    let sx, sy, ex, ey;
    sx = Math.min(startX, endX)
    ex = Math.max(startX, endX)
    sy = Math.min(startY, endY)
    ey = Math.max(startY, endY)

    let arr = [];

    for (let sx1 = sx; sx1 <= ex; sx1++) {
        for (let sy1 = sy; sy1 <= ey; sy1++) {
            let point = `${sx1},${sy1}`
            arr.push(point)
        }
    }

    // 存在选中坐标点返回上一次选中
    return arr;
}


let afterLocation = item => ({
    data: [{
        validator: (rule, value, callback) => {
            if (item.params.cubestyle !== 'custom') {
                if (item.data.some(v => !v.imgurl)) {
                    callback(new Error('请添加图片'))
                } else {
                    callback()
                }
            } else {
                let arr = []
                item.data.forEach(v => {
                    arr = arr.concat(dealPoint(v.startP, v.endP))
                })

                if (arr.length !== Math.pow(item.params.cubenum, 2)) {
                    callback(new Error('请填充满魔方列'))
                } else if (item.data.some(v => !v.imgurl)) {
                    callback(new Error('请添加图片'));
                } else {
                    callback()
                }
            }
        },
        trigger: 'blur'
    }],
})
export default item => ({
    afterLocation: afterLocation(item), //定位后的校验
    beforeLocation(data) { //定位前的校验
        if (data.params.cubestyle !== 'custom') {
            if (data.data.some(v => !v.imgurl)) {
                return new Error('请添加图片')
            }
        } else {
            let arr = []
            data.data.forEach(v => {
                arr = arr.concat(dealPoint(v.startP, v.endP))
            })

            if (arr.length !== Math.pow(data.params.cubenum, 2)) {
                return new Error('请填充满魔方列')
            } else if (data.data.some(v => !v.imgurl)) {
                return new Error('请添加图片');
            }
        }


    },

})