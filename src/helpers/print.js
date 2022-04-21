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
import { Message } from 'view-design'
import { getLodop } from '@/assets/helpers/LodopFuncs'

let LODOP,
    P_ID = '',
    TaskID1,
    TaskID2,
    t,
    c = 0 //声明为全局变量

// 预览 options配置参数
/***
 *
 * @param html
 * @param lodop
 * @param options 选填 里面是一些特殊特殊配置 {key：{value： ‘’}}
 * @returns {Promise<unknown>}
 */
export const preview = (html = [], lodop, options) => {
    return new Promise((resolve) => {
        // let LODOP
        if (lodop) {
            LODOP = lodop
        } else {
            LODOP = getLodop()
        }
        if (LODOP) {
            LODOP.PRINT_INIT('') //初始化在循环外
            LODOP.SET_PRINT_PAGESIZE(0)
            html.forEach((item) => {
                LODOP.NewPageA()
                console.log('options?.ADD_PRINT_HTM', options, options?.ADD_PRINT_HTM)
                if (options?.ADD_PRINT_HTM) {
                    LODOP.ADD_PRINT_HTM('0', '0', '100%', '100%', item)
                } else {
                    LODOP.ADD_PRINT_HTML('0', '0', '100%', '100%', item)
                }
            })
            // 设置打印完毕是否自动关闭预览窗口
            LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', true)
            // 设置是否进行对后台服务的打印状态进行捕获
            LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true)
            // 设置打印的缩放
            options?.PRINT_PAGE_PERCENT && LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', options?.PRINT_PAGE_PERCENT.value)
            if (LODOP.CVERSION) {
                LODOP.On_Return = function(TaskID, Value) {
                    P_ID = Value
                    console.log('该任务走的是c-lodop方式，job代码为' + P_ID)
                    if (P_ID !== '') {
                        c = 0
                        C_WaitFor(() => {
                            resolve()
                        })
                    } else {
                        // 关闭了预览窗口，没打印
                        resolve('cancle')
                    }
                }
                LODOP.PREVIEW()
            } else {
                Message.error('打印控件出现问题，重新安装')
            }
            // else {
            //     P_ID = LODOP.PREVIEW()
            //     console.log('该任务走的是lodop插件方式，job代码为' + P_ID)
            //     if (P_ID != '') {
            //         c = 0
            //         WaitFor()
            //     }
            // }
        }
    })
}

function C_WaitFor(callback) {
    c = c + 1
    console.log('正等待(JOB代码是' + P_ID + ')打印结果：' + c + '秒')
    t = setTimeout(C_WaitFor, 1000, callback)
    LODOP.On_Return_Remain = true
    LODOP.On_Return = function(TaskID, Value) {
        if (TaskID == TaskID1) {
            if (Value == 1) {
                // alert(TaskID + ' ' + Value)
                clearTimeout(t)
                console.log('走的c-lodop方式：PRINT_STATUS_OK判断为打印成功')
                c = 0
                // alert('打印成功！')
                Message.success('打印成功')
                callback()
            }
        } else if (TaskID == TaskID2) {
            if (Value == 0) {
                clearTimeout(t)
                console.log(
                    '走的c-lodop方式：判断该该任务已经不在队列，已成功或删除任务'
                )
                c = 0
                // alert('打印任务不在队列，成功或删除')
                Message.success('打印成功')
                callback()
            }
        }
    }
    TaskID1 = LODOP.GET_VALUE('PRINT_STATUS_OK', P_ID)
    TaskID2 = LODOP.GET_VALUE('PRINT_STATUS_EXIST', P_ID)
    if (c > 50) {
        clearTimeout(t)
        console.log('打印超过50秒没捕获到成功状态！')
        c = 0
        // alert('打印超过50秒没捕获到成功状态！')
        Message.error('打印超过50秒没捕获到成功状态！')
    }
}

// function WaitFor() {
//     c = c + 1
//     console.log('正等待(JOB代码是' + P_ID + ')打印结果：' + c + '秒')
//     t = setTimeout('WaitFor()', 1000)
//     if (LODOP.GET_VALUE('PRINT_STATUS_OK', P_ID)) {
//         clearTimeout(t)
//         console.log('走的lodop插件方式：PRINT_STATUS_OK判断为打印成功')
//         c = 0
//         alert('打印成功！')
//     }
//     if (!LODOP.GET_VALUE('PRINT_STATUS_EXIST', P_ID) && c > 0) {
//         clearTimeout(t)
//         console.log(
//             '走的lodop插件方式：判断该该任务已经不在队列，已成功或删除任务'
//         )
//         c = 0
//         alert('打印任务不在队列，成功或删除')
//     } else if (c > 50) {
//         clearTimeout(t)
//         console.log('打印超过50秒没捕获到成功状态！')
//         c = 0
//         alert('打印超过50秒没捕获到成功状态！')
//     }
// }
