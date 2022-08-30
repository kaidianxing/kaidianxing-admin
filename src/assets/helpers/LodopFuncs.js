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
import { Modal } from 'view-design'
//==本JS是加载Lodop插件及CLodop服务的综合示例，可直接使用，建议看懂后融进自己页面程序==

var CreatedOKLodopObject, CLodopIsLocal, CLodopJsState

//==判断是否需要CLodop(那些不支持插件的浏览器):==
export function needCLodop() {
    try {
        var ua = navigator.userAgent
        if (ua.match(/Windows\sPhone/i)) return true
        if (ua.match(/iPhone|iPod|iPad/i)) return true
        if (ua.match(/Android/i)) return true
        if (ua.match(/Edge\D?\d+/i)) return true

        var verTrident = ua.match(/Trident\D?\d+/i)
        var verIE = ua.match(/MSIE\D?\d+/i)
        var verOPR = ua.match(/OPR\D?\d+/i)
        var verFF = ua.match(/Firefox\D?\d+/i)
        var x64 = ua.match(/x64/i)
        if (!verTrident && !verIE && x64) return true
        else if (verFF) {
            verFF = verFF[0].match(/\d+/)
            if (verFF[0] >= 41 || x64) return true
        } else if (verOPR) {
            verOPR = verOPR[0].match(/\d+/)
            if (verOPR[0] >= 32) return true
        } else if (!verTrident && !verIE) {
            var verChrome = ua.match(/Chrome\D?\d+/i)
            if (verChrome) {
                verChrome = verChrome[0].match(/\d+/)
                if (verChrome[0] >= 41) return true
            }
        }
        return false
    } catch (err) {
        return true
    }
}

//==加载引用CLodop的主JS,用双端口8000和18000(以防其中一个被占):==
function loadCLodop() {
    if (CLodopJsState == 'loading' || CLodopJsState == 'complete') return
    CLodopJsState = 'loading'
    var head =
        document.head ||
        document.getElementsByTagName('head')[0] ||
        document.documentElement
    var JS1 = document.createElement('script')
    var JS2 = document.createElement('script')
    JS1.src = 'http://localhost:8000/CLodopfuncs.js?priority=1'
    JS2.src = 'http://localhost:18000/CLodopfuncs.js'
    JS1.onload = JS2.onload = function() {
        CLodopJsState = 'complete'
    }
    JS1.onerror = JS2.onerror = function() {
        CLodopJsState = 'complete'
    }
    head.insertBefore(JS1, head.firstChild)
    head.insertBefore(JS2, head.firstChild)
    CLodopIsLocal = !!(JS1.src + JS2.src).match(/\/\/localho|\/\/127.0.0./i)
}

if (needCLodop()) {
    loadCLodop()
} //加载

//==获取LODOP对象主过程,判断是否安装、需否升级:==
export function getLodop(oOBJECT, oEMBED) {
    // var strHtmInstall =
    //     "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
    // var strHtmUpdate =
    //     "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>"
    // var strHtm64_Install =
    //     "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
    // var strHtm64_Update =
    //     "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>"
    // var strHtmFireFox =
    //     "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>"
    // var strHtmChrome =
    //     "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>"
    // var strCLodopInstall_1 =
    //     "<br><font color='#FF00FF'>Web打印服务CLodop未安装启动，点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>下载执行安装</a>"
    // var strCLodopInstall_2 =
    //     "<br>（若此前已安装过，可<a href='CLodop.protocol:setup' target='_self'>点这里直接再次启动</a>）"
    // var strCLodopInstall_3 = '，成功后请刷新本页面。</font>'
    // var strCLodopUpdate =
    //     "<br><font color='#FF00FF'>Web打印服务CLodop需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>"
    var LODOP
    try {
        var ua = navigator.userAgent
        var isIE = !!ua.match(/MSIE/i) || !!ua.match(/Trident/i)
        if (needCLodop()) {
            try {
                LODOP = window.getCLodop()
            } catch (err) {
                throw new Error(err)
            }
            if (!LODOP && CLodopJsState !== 'complete') {
                let _content = ''
                if (CLodopJsState == 'loading') {
                    _content = '网页还没下载完毕，请稍等一下再操作。'
                } else {
                    _content = '没有加载CLodop的主js，请先调用loadCLodop过程。'
                }
                Modal.confirm({
                    title: '提示',
                    content: _content,
                })
                return
            }
            if (!LODOP) {
                let _content = 'Web打印服务CLodop未安装启动（CLodop_Setup_for_Win32NT.exe）'
                if (CLodopIsLocal) {
                    _content = `${_content}（若此前已安装过，请先启动）`
                }
                _content = `${_content}，成功后请刷新本页面。`
                Modal.confirm({
                    title: '提示',
                    content: _content,
                    okText: '前往下载',
                    onOk: () => {
                        window.open('http://www.lodop.net/download.html')
                    },
                })
                return
            } else {
                if (window.CLODOP.CVERSION < '4.0.9.9') {
                    let _content = 'Web打印服务CLodop需升级!请下载安装最新 CLodop_Setup_for_Win32NT.exe，升级后请刷新页面。'
                    Modal.confirm({
                        title: '提示',
                        content: _content,
                        okText: '前往下载',
                        onOk: () => {
                            window.open('http://www.lodop.net/download.html')
                        },
                    })
                }
                if (oEMBED && oEMBED.parentNode)
                    oEMBED.parentNode.removeChild(oEMBED) //清理旧版无效元素
                if (oOBJECT && oOBJECT.parentNode)
                    oOBJECT.parentNode.removeChild(oOBJECT)
            }
        } else {
            var is64IE = isIE && !!ua.match(/x64/i)
            //==如果页面有Lodop就直接使用,否则新建:==
            if (oOBJECT || oEMBED) {
                if (isIE) LODOP = oOBJECT
                else LODOP = oEMBED
            } else if (!CreatedOKLodopObject) {
                LODOP = document.createElement('object')
                LODOP.setAttribute('width', 0)
                LODOP.setAttribute('height', 0)
                LODOP.setAttribute(
                    'style',
                    'position:absolute;left:0px;top:-100px;width:0px;height:0px;'
                )
                if (isIE)
                    LODOP.setAttribute(
                        'classid',
                        'clsid:2105C259-1E0C-4534-8141-A753534CB4CA'
                    )
                else LODOP.setAttribute('type', 'application/x-print-lodop')
                document.documentElement.appendChild(LODOP)
                CreatedOKLodopObject = LODOP
            } else LODOP = CreatedOKLodopObject
            //==Lodop插件未安装时提示下载地址:==
            if (!LODOP || !LODOP.VERSION) {
                let _content = ''
                if (ua.indexOf('Chrome') >= 0) {
                    _content =
                        '(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）打印控件未安装!请下载安装'
                }
                if (ua.indexOf('Firefox') >= 0) {
                    _content =
                        '（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）打印控件未安装!'
                }
                _content = is64IE
                    ? `${_content} install_lodop64.exe,安装后请刷新页面或重新进入。`
                    : `${_content} install_lodop32.exe,安装后请刷新页面或重新进入。`
                Modal.confirm({
                    title: '提示',
                    content: _content,
                    okText: '前往下载',
                    onOk: () => {
                        window.open('http://www.lodop.net/download.html')
                    },
                })
                return LODOP
            }
        }
        // 提示升级
        if (LODOP.VERSION < '6.2.2.6') {
            if (!needCLodop()) {
                let _content = is64IE
                    ? '打印控件需要升级!请下载安装 install_lodop64.exe 完成升级,升级后请重新进入。'
                    : '打印控件需要升级!请下载安装 install_lodop32.exe 完成升级,升级后请重新进入。'
                Modal.confirm({
                    title: '提示',
                    content: _content,
                    okText: '前往下载',
                    onOk: () => {
                        window.open('http://www.lodop.net/download.html')
                    },
                })
            }
        }
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):==

        //=======================================================
        return LODOP
    } catch (err) {
        Modal.confirm({
            title: '提示',
            content:
                '检测到您尚未安装打印控件Lodop，是否前去下载安装?安装后请刷新页面或重新进入。',
            okText: '前往下载',
            onOk: () => {
                window.open('http://www.lodop.net/download.html')
            },
        })
    }
}
