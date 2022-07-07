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
/*
 *  用于店铺装修功能，所有的装修组件的模板信息
 *  所有模板的组件数据
 */
import * as utils from '@/assets/helpers'
export const pageInfo = { //页面信息
    name: '未命名页面',
    title: '',
    keywords: '',
    description: '',
    thumb: '',
    background_color: '#F5F5F5',
    diy_menu: '0',
    menu_id: '',
    menu_name: '',
    id: 'pageInfo',
    type: 'pageInfo',
    params: {
        shareimg: '',
        sharecontent: '',
        limitlevel: '',
        limitlabel: '',
        browsepermlevels: [],
        browsepermlabels: [],
        navbgtype: 'color',
        navbgcolor: '#ffffff',
        navbgimg: '',
        titlecolor: '#212121',
        funbtncolor: 'black',
        linkid: 1,
        expire_start_time: '',
        expire_end_time: '',
        expire_time: 3,
        access_type: 0,
        showmenu: '0',
        sharetext: ''
    },
    style: {},
    data: []
}
export const notice = {
    id: "notice",
    type: 'notice',
    name: '公告',
    params: {
        'noticedata': '0',
        'speed': '5',
        'noticenum': '5',
        noticestyle: 1,
        noticeimg: '',
    },
    style: {
        'background': '#ffffff',
        'iconcolor': '#fd5454',
        'color': '#212121',
        'bordercolor': '#e2e2e2',
        margintop: 16,
        marginbottom: 0,
        marginleft: 24,
        topradius: 12,
        bottomradius: 12
    },
    data: [{
        title: '这里是第一条自定义公告的标题',
        linkurl: '',
        linkurl_name: '',
        wxappid: ''
    },
    {
        title: '这里是第二条自定义公告的标题',
        linkurl: '',
        linkurl_name: '',
        wxappid: ''
    }
    ]
};
export const poster = {
    id: 'poster',
    type: 'poster',
    name: '海报',
    params: {

    },
    style: {

    },
    data: []
}
export const poster_bgimg = {
    id: 'poster_bgimg',
    type: 'poster_bgimg',
    name: '背景图片',
    max: 1,
    isfixed: 1,
    params: {
        imgurl: '',
        imgscaletype: 0, //缩放方式：0等比缩放，1自定义宽高
        bgtype: '0', //0颜色 1图片
        draggable: false,
        resizable: false,
    },
    style: {
        zIndex: 0,
        bgcolor: '#f5f5f5',
        width: '100%',
        top: 0,
        left: 0,
        height: '100%',
    },
    data: []
}
export const poster_img = {
    id: 'poster_img',
    type: 'poster_img',
    name: '图片',
    isfixed: 1,
    params: {
        imgurl: '',
        imgscaletype: 0, //缩放方式：0等比缩放，1自定义宽高
        bordershow: 0,
        borderradius: 1,
    },
    style: {
        width: 200,
        height: 200,
        top: 24,
        left: 24,
        bordercolor: '#e6e7eb',
        borderwidth: 1,
    },
    data: []
}
export const poster_qrcode = {
    id: 'poster_qrcode',
    type: 'poster_qrcode',
    name: '二维码',
    isfixed: 1,
    params: {
        imgurl: '',
        imgscaletype: 0, //缩放方式：0等比缩放，1自定义宽高
        bordershow: 0,
    },
    style: {
        bgcolor: '#ffffff',
        bgopacity: '1',
        width: 200,
        height: 200,
        top: 24,
        left: 24,
        borderradius: 0,
        color: '#000000',
        bordercolor: '#e6e7eb',
        borderwidth: 1,
    },
    data: []
}
export const poster_goodimg = {
    id: 'poster_goodimg',
    type: 'poster_goodimg',
    name: '商品图片',
    isfixed: 1,
    params: {
        imgurl: '',
        imgscaletype: 0, //缩放方式：0等比缩放，1自定义宽高
        bordershow: 0,
        borderradius: 0
    },
    style: {
        width: 702,
        height: 702,
        top: 24,
        left: 24,
        borderradius: 0,
        bordercolor: '#e6e7eb',
        borderwidth: 1,
    },
    data: []
}
export const poster_shopname = {
    id: 'poster_shopname',
    type: 'poster_shopname',
    name: '店铺名称',
    isfixed: 1,
    params: {
        content: '',
        imgscaletype: 1, //缩放方式：0等比缩放，1自定义宽高
    },
    style: {
        textalign: 'left',
        fontsize: 28,
        fontweight: 400,
        color: '#969696',
        top: 904,
        left: 224,
        width: 210,
        height: 40,
        lineheight: 1.4
    },
    data: []
}
export const poster_shoplogo = {
    id: 'poster_shoplogo',
    type: 'poster_shoplogo',
    name: '店铺LOGO',
    isfixed: 1,
    params: {
        imgurl: '',
        imgscaletype: 0, //缩放方式：0等比缩放，1自定义宽高
    },
    style: {
        width: 200,
        height: 200,
        top: 24,
        left: 24,
    },
    data: []
}

export const poster_avatar = {
    id: 'poster_avatar',
    type: 'poster_avatar',
    name: '头像',
    isfixed: 1,
    params: {
        imgurl: '',
        imgscaletype: 0, //缩放方式：0等比缩放，1自定义宽高
        bordershow: 1
    },
    style: {
        width: 200,
        height: 200,
        top: 24,
        left: 24,
        borderradius: 0,
        bordercolor: '#e6e7eb',
        borderwidth: 1,
    },
    data: []
}
export const poster_nickname = {
    id: 'poster_nickname',
    type: 'poster_nickname',
    name: '昵称',
    isfixed: 1,
    params: {
        content: '',
        imgscaletype: 1, //缩放方式：0等比缩放，1自定义宽高
    },
    style: {
        textalign: 'left',
        fontsize: 28,
        fontweight: 400,
        color: '#212121',
        top: 704,
        left: 224,
        width: 210,
        height: 40,
        lineheight: 1.4
    },
    data: []
}
export const poster_pushsetting = {
    id: 'poster_pushsetting',
    type: 'poster_pushsetting',
    name: '推送设置',
    isfixed: 1,
    asPageInfo: true, //存入asPageInfo的组件
    params: {
        type: 1,
        thumb: '',
        title: '', //
        content: '',
        linkurl: '',
        linkurl_name: '',
        draggable: false,
        resizable: false,
        delable: false
    },
    style: {
        width: '100%',
        top: 0,
        left: 0,
        height: '100%',
    },
    data: []
}
export const poster_reward = {
    id: 'poster_reward',
    type: 'poster_reward',
    name: '奖励设置',
    isfixed: 1,
    asPageInfo: true, //存入asPageInfo的组件
    notemplate: true, //本身无模板的组件
    params: {
        open: 0,
        recommend: {
            reward: ['score', 'cash', 'coupon'],
            score: {
                num: 0,
                limit: ''
            },
            cash: {
                num: 0,
                limit: '',
                type: 'balance', //balance余额 redpackets红包
            },
            coupon: {
                list: [
                    // {
                    // id: val.id,
                    // coupon_name:val.coupon_name,
                    // content: val.content,
                    // coupon_sale_type:val.coupon_sale_type
                    // }
                ],
                limit: ''
            },
        },
        follower: {
            reward: ['score', 'cash', 'coupon'],
            score: {
                num: 0,
            },
            cash: {
                type: 'balance',
                num: 0
            },
            coupon: {
                list: [
                    // {
                    // id: val.id,
                    // coupon_name:val.coupon_name,
                    // content: val.content,
                    // coupon_sale_type:val.coupon_sale_type
                    // }
                ],
                limit: ''
            },
        }
    },
    style: {},
    data: []
}
export const poster_goodname = {
    id: 'poster_goodname',
    type: 'poster_goodname',
    name: '商品名称',
    isfixed: 1,
    params: {
        content: '2020年夏季新款韩版宽松显瘦黑色短款刺绣针织开衫短袖t恤上衣女 甜美 新款ins潮',
        imgscaletype: 1, //缩放方式：0等比缩放，1自定义宽高
    },
    style: {
        textalign: 'left',
        fontsize: 36,
        fontweight: 700,
        color: '#212121',
        top: 772,
        left: 24,
        width: 702,
        height: 88,
        lineheight: 1.43
    },
    data: []
}
export const poster_delprice = {
    id: 'poster_delprice',
    type: 'poster_delprice',
    name: '商品原价',
    isfixed: 1,
    params: {
        content: '1999.00',
        showdelline: '1',
        imgscaletype: 1, //缩放方式：0等比缩放，1自定义宽高
    },
    style: {
        textalign: 'left',
        fontsize: 28,
        fontweight: 400,
        color: '#969696',
        top: 904,
        left: 224,
        width: 150,
        height: 30,
        lineheight: 1

    },
    data: []
}
export const poster_sellprice = {
    id: 'poster_sellprice',
    type: 'poster_sellprice',
    name: '商品售卖价',
    isfixed: 1,
    params: {
        content: '1999.00',
        imgscaletype: 1, //缩放方式：0等比缩放，1自定义宽高
    },
    style: {
        textalign: 'left',
        fontsize: 36,
        fontweight: '700',
        color: '#FF3C29',
        top: 878,
        left: 48,
        width: 210,
        height: 50,
        lineheight: 1
    },
    data: []
}
export const poster_price = {
    id: 'poster_price',
    type: 'poster_price',
    name: '商品会员价',
    isfixed: 1,
    params: {
        content: '1999.00',
        imgscaletype: 1, //缩放方式：0等比缩放，1自定义宽高
    },
    style: {
        textalign: 'left',
        fontsize: 36,
        fontweight: '700',
        color: '#FF3C29',
        top: 878,
        left: 48,
        width: 210,
        height: 50,
        lineheight: 1
    },
    data: []
}
export const poster_text = {
    id: 'poster_text',
    type: 'poster_text',
    name: '文本',
    isfixed: 1,
    params: {
        content: '',
        imgscaletype: 1, //缩放方式：0等比缩放，1自定义宽高
    },
    style: {
        textalign: 'left',
        fontsize: 28,
        fontweight: 400,
        color: '#212121',
        top: 904,
        left: 224,
        width: 210,
        height: 40,
        lineheight: 1.6
    },
    data: []
}
export const poster_exptime = {
    id: 'poster_exptime',
    type: 'poster_exptime',
    name: '失效时间',
    isfixed: 1,
    params: {
        content: '2012-10-12',
        imgscaletype: 1, //缩放方式：0等比缩放，1自定义宽高
    },
    style: {
        textalign: 'left',
        fontsize: 28,
        fontweight: 400,
        color: '#969696',
        top: 24,
        left: 24,
        width: 160,
        height: 40,
        lineheight: 1.4
    },
    data: []
}
export const poster_commission = {
    id: 'poster_commission',
    type: 'poster_commission',
    name: '分销佣金',
    isfixed: 1,
    params: {
        commission: '0.00'
    },
    style: {
        fontsize: 28,
        fontweight: 400,
        bgcolor: '#FF3C29',
        borderradius: 60,
        color: '#ffffff',
        top: 24,
        left: 24,
        width: 320,
        height: 60,
        opacity: 1,
        lineheight: 1
    },
    data: []
}
export const sysform = {

}
export const banner = {
    id: "banner",
    type: 'banner',
    name: '图片轮播',
    params: {},
    style: {
        'dotstyle': 'round',
        'dotalign': 'left',
        'background': '#ffffff',
        'leftright': '24',
        'bottom': '16',
        'opacity': '0.54',
        'imgheight': 136.75,
        topradius: 12,
        bottomradius: 12,
        margintop: 16,
        marginbottom: 0,
        marginleft: 24
    },
    data: [{
        imgurl: '',
        linkurl: '',
        linkurl_name: '',
        wxappid: ''
    }, {
        imgurl: '',
        linkurl: '',
        linkurl_name: '',
        wxappid: ''
    }]
};
export const richtext = {
    id: "richtext",
    type: 'richtext',
    name: '富文本',
    params: {
        content: ''
    },
    style: {
        'background': '#ffffff',
        margintop: 16,
        marginbottom: 0,
        marginleft: 24,
        topradius: 12,
        bottomradius: 12,
        padding: 0
    },
    data: []
};
export const title = {
    id: "title",
    type: 'title',
    name: '标题栏',
    params: {
        'title': '标题',
        'icon': '', //要显示的icon
        'subTitle': '查看',
        'linkurl': '',
        'linkurl_name': '',
        righticon: 'iconfont-m- icon-m-right',
        wxappid: '',
        titleweight: 'normal',
        showmore: '1'
    },
    style: {
        'background': '#ffffff',
        'color': '#212121',
        'textalign': 'left',
        'fontsize': '32',
        'paddingtop': '16',
        'paddingbottom': '0',
        'paddingleft': '24',
        'subtitlecolor': '#969696',
        'iconcolor': '#212121',
        righticoncolor: '#969696',
        topradius: 12,
        bottomradius: 12,
        titlesize: 32,
    },
    data: []
};
export const search = {
    id: "search",
    type: 'search',
    name: '搜索框',
    max: 1,
    params: {
        'placeholder': '请输入关键字进行搜索',
        'goodstype': 0, //0商城商品  1積分商城
        searchtype: 'router',
        righticonlink: '',
        righticonlink_name: '',
        rightnav: '1',
        rightnavclick: '0',
        rightnavicon: 'iconfont-m- icon-m-erweima',
        bgstyle: '',
        bgcolor: '#ff3c29',
        showstyle: '1',
        locationicon: 1,
    },
    style: {
        'inputbackground': '#ffffff',
        'background': '#ffffff',
        'iconcolor': '#b6b6b6',
        'color': '#c2c2c2',
        'paddingtop': '16',
        'paddingbottom': '0',
        'paddingleft': '24',
        'textalign': 'left',
        'borderradius': 12,
        rightnavcolor: '#212121',
        bgstyle: '',
        bgcolor: '#ff3c29',
        locationiconcolor: '#FF3C29',
        locationcolor: '#969696'
    },
    data: []
};
export const line = {
    id: "line",
    type: 'line',
    name: '辅助线',
    params: {},
    style: {
        'height': '2',
        'background': '#ffffff',
        "bordercolor": "#E6E7EB",
        'padding': '10',
        'linestyle': 'solid'
    },
    data: []
};
export const blank = {
    id: "blank",
    type: 'blank',
    name: '辅助空白',
    params: {},
    style: {
        height: '16',
        background: '#f5f5f5'
    },
    data: []
};
export const menu = {
    id: "menu",
    type: 'menu',
    name: '按钮组',
    params: {},
    style: {
        'navstyle': 'circle',
        'background': '#ffffff',
        'rownum': '4',
        'showtype': '0',
        'pagenum': '1',
        'showdot': '1',
        'color': '#565656',
        topradius: 12,
        bottomradius: 12,
        margintop: 16,
        marginleft: 24,
        marginbottom: 0
    },
    data: [{
        imgurl: '',
        linkurl: '',
        linkurl_name: '',
        text: '按钮文字1',
        color: '#666666',
        wxappid: ''
    },
    {
        imgurl: '',
        linkurl: '',
        linkurl_name: '',
        text: '按钮文字2',
        color: '#666666',
        wxappid: ''
    },
    {
        imgurl: '',
        linkurl: '',
        linkurl_name: '',
        text: '按钮文字3',
        color: '#666666',
        wxappid: ''
    },
    {
        imgurl: '',
        linkurl: '',
        linkurl_name: '',
        text: '按钮文字4',
        color: '#666666',
        wxappid: ''
    }
    ]
};
export const menu2 = {
    id: "menu2",
    type: 'menu2',
    name: '按钮组2',
    params: {},
    style: {
        'background': '#ffffff',
        'iconcolor': '#212121',
        'textcolor': '#212121',
        'tip': '',
        'tipcolor': '#212121',
        topradius: 12,
        bottomradius: 12,
        margintop: 16,
        marginbottom: 0,
        marginleft: 24,
        dividercolor: '#e6e7eb',
    },
    data: [{
        text: '按钮1',
        iconclass: '',
        textcolor: '#666666',
        iconcolor: '#666666',
        linkurl: '',
        linkurl_name: '',
        wxappid: ''
    },
    {
        text: '按钮2',
        iconclass: '',
        textcolor: '#666666',
        iconcolor: '#666666',
        linkurl: '',
        linkurl_name: '',
        wxappid: ''
    }
    ]
};
export const picture = {
    id: "picture",
    type: 'picture',
    name: '单图组',
    params: {},
    style: {
        'paddingtop': '16',
        'paddingbottom': '0',
        'paddingleft': '24',
        'marginbottom': '16',
        topradius: 12,
        bottomradius: 12
    },
    data: [{
        imgurl: '',
        linkurl: '',
        linkurl_name: '',
        wxappid: ''
    }]
};
export const pictures = {
    id: "pictures",
    type: 'pictures',
    name: '图片展播',
    params: {
        hidetext: 0,
        showtype: '1',
        rownum: 3,
        showbtn: 0,
        imgheight: ''
    },
    style: {
        background: "#ffffff",
        paddingtop: "16",
        paddingbottom: '0',
        paddingleft: "24",
        titlealign: 'left',
        textalign: 'left',
        titlecolor: '#ffffff',
        textcolor: '#565656',
        topradius: 12,
        bottomradius: 12
    },
    data: [{
        imgurl: '',
        linkurl: '',
        linkurl_name: '',
        title: '这是上标题',
        text: '这是下标题',
        wxappid: ''
    },
    {
        imgurl: '',
        linkurl: '',
        linkurl_name: '',
        title: '这是上标题',
        text: '这是下标题',
        wxappid: ''
    },
    {
        imgurl: '',
        linkurl: '',
        linkurl_name: '',
        title: '这是上标题',
        text: '这是下标题',
        wxappid: ''
    },
    {
        imgurl: '',
        linkurl: '',
        linkurl_name: '',
        title: '这是上标题',
        text: '这是下标题',
        wxappid: ''
    }
    ]
};
export const goods = {
    id: "goods",
    type: 'goods',
    name: '商品组',
    params: {
        'goodstype': '0',
        'showprice': '1',
        'showtag': '0',
        'goodsdata': '0',
        'cateid': '',
        'catename': '',
        'catethumb': '',
        'groupid': '',
        'groupname': '',
        'goodssort': '0',
        'goodsnum': 50,
        'showicon': '0',
        'iconposition': 'left top',
        'productprice': '1',
        'showproductprice': '0',
        'showsales': '0',
        'productpricetext': '',
        'salestext': '销量',
        'productpriceline': '0',
        'pagetype': '',
        'seecommission': 0,
        'cansee': 0,
        'seetitle': '',
        'goodsscroll': '0',
        'goodsiconsrc': '',
        'icontype': '0',
        'customicontext': '',
        componentbg: '0',
        bgimg: '',
        commisionstyle: '-1',
        commisiontext: '赚',
    },
    style: {
        'customicontext': '',
        'background': '#ffffff',
        'liststyle': 'block two',
        'buystyle': 'buybtn-1',
        'goodsicon': 'recommand',
        'iconstyle': 'triangle',
        'pricecolor': '#FF3C29',
        'productpricecolor': '#969696',
        'iconpaddingtop': '0',
        'iconpaddingleft': '0',
        'buybtncolor': '#FF3C29',
        'iconzoom': 50,
        'titlecolor': '#212121',
        'tagbackground': '#fe5455',
        'salescolor': '#969696',
        marginleft: 24,
        margintop: 16,
        marginbottom: 0,
        topradius: 12,
        bottomradius: 12,
        bgcolor: '#ff3c29',
        commissionBackground: '#FF5555',
        commissionColor: '#FFFFFF',
        commisionopcaity: 100
    },
    data: []
};

export const listmenu = {
    id: "listmenu",
    type: 'listmenu',
    name: '列表导航',
    params: {
        righticon: 'iconfont-m- icon-m-right',
        showmore: '1',
        remark: ''
    },
    style: {
        'background': '#ffffff',
        'iconcolor': '#212121',
        'textcolor': '#212121',
        'remarkcolor': '#969696',
        righticoncolor: '#969696',
        topradius: 12,
        bottomradius: 12,
        margintop: 16,
        marginbottom: 0,
        marginleft: 24,
        dividercolor: '#e6e7eb'
    },
    data: [{
        text: '文字1',
        textcolor: '#212121',
        linkurl: '',
        iconclass: '',
        iconcolor: '#212121',
        linkurl_name: '',
        wxappid: '  '
    },
    {
        text: '文字2',
        textcolor: '#212121',
        linkurl: '',
        iconclass: '',
        iconcolor: '#212121',
        linkurl_name: '',
        wxappid: '  '
    },
    {
        text: '文字3',
        textcolor: '#212121',
        linkurl: '',
        iconclass: '',
        iconcolor: '#212121',
        linkurl_name: '',
        wxappid: '  '
    }
    ]

};

export const member = {
    id: "member",
    type: 'member',
    name: '会员信息',
    max: 1,
    params: {
        style: 'default1',
        levellink: '/kdxMember/level/index',
        levellink_name: '会员等级说明',
        level_wxappid: '',
        seticon: '',
        shopicon:'iconfont-m- icon-m-dianpu',
        setlink: '/kdxMember/memberInfo/index',
        set_wxappid: '',
        setlink_name: "我的资料",
        bgstyle: 'color',
        cardbgstyle: 'color',
        bgimg: '',
        cardbgimg: '',
        levelicon: 'iconfont-m- icon-m-huangguan2',
        financeBtn: ['0', '1', '2','3'],
        btntext:'我的店铺'
    },
    style: {
        nickcolor: '#ffffff',
        bgcolor: '#ff3c29',
        cardbgcolor: '#ffffff',
        headstyle: '',
        numcolor: '#ffffff',
        titlecolor: '#ffffff',
        levelbgcolor: '#31312D',
        levelcolor: '#F2DCAC',
        setbtncolor: '#ffffff',
        setbtncolor2:'#000000',
        linecolor: '#ffffff'
    },
    info: {
        avatar: '',
        nickname: '',
        levelname: 'VIP1',
        textmoney: '余额',
        textcredit: '积分',
        money: '0',
        credit: '0',
        cardnum: 2,
        coupon: '0',
    },
    data: []
};
export const distributor = {
    id: "distributor",
    type: 'distributor',
    name: '分销商信息',
    max: 1,
    params: {
        style: 'default1',
        levellink: '',
        levellink_name: '',
        seticon: 'iconfont-m- icon-m-right',
        shopicon:'iconfont-m- icon-m-dianpu',
        setlink: '',
        leftnav: '充值',
        leftnavlink: '',
        rightnav: '兑换',
        rightnavlink: '',
        show_recommender: '1',
        avatar: '',
        nickname: '商城分销商一商城分销商',
        levelname: '分销一级超级大分销商',
        withdraw: '199.00',
        pending: '100',
        havemoney: '190000',
        levelid: '',
        level: '9',
        recommender: '推荐人：兔子压倒窝边草一兔子压倒窝边草',
        moneytext: '佣金',
        withdrawtext: '提现'
    },
    style: {
        'background': '#FF6F29',
        'nicknamecolor': '#ffffff',
        'recommendercolor': '#ffffff',
        'titlecolor': '#212121',
        'moneycolor': '#212121',
        'hightlightcolor': '#FF3C29',
        'headstyle': ''
    },
    data: []
};
export const icongroup = {
    id: "icongroup",
    type: 'icongroup',
    name: '图标组',
    params: {
        rownum: '4',
        border: '1',
        bordertop: '1',
        borderbottom: '1',
    },
    style: {
        background: '#ffffff',
        bordercolor: '#ffffff',
        textcolor: '#565656',
        iconcolor: '#565656',
        dotcolor: '#FF3C29',
        topradius: 12,
        bottomradius: 12,
        margintop: 16,
        marginbottom: 0,
        marginleft: 24
    },
    data: [{
        iconclass: 'icon-m-cart iconfont-m-',
        text: '待付款',
        linkurl: '',
        linkurl_name: '',
        dotnum: 0,
        wxappid: ''
    },
    {
        iconclass: 'iconfont-m- icon-m-shangpinxiangqing-kuaidi',
        text: '待发货',
        linkurl: '',
        linkurl_name: '',
        dotnum: 1,
        wxappid: ''
    },
    {
        iconclass: 'iconfont-m- icon-m-shouhuodizhi',
        text: '待收货',
        linkurl: '',
        linkurl_name: '',
        dotnum: 0,
        wxappid: ''
    },
    {
        iconclass: 'iconfont-m- icon-m-tuihuotuikuan',
        text: '退换货',
        linkurl: '',
        linkurl_name: '',
        dotnum: 0,
        wxappid: ''
    }
    ]
};
export const bindmobile = {
    id: "bindmobile",
    type: 'bindmobile',
    name: '绑定手机',
    max: 1,
    params: {
        linkurl: '',
        title: '绑定手机号',
        text: '如果您用手机号注册过会员或您想通过微信外购物请绑定您的手机号码',
        iconclass: 'iconfont-m- icon-m-mobile',
        btntext: '立即绑定',
    },
    style: {
        margintop: '10',
        marginbottom: '8',
        background: '#ffffff',
        titlecolor: '#ff5555',
        textcolor: '#999999',
        iconcolor: '#999999',
        btncolor: '#ff5555',
        btntextcolor: '#ffffff',
        btnbackground: '#ff3c29',
        topradius: 12,
        bottomradius: 12,
        marginleft: 24
    },
    data: []
};
export const logout = {
    id: "logout",
    type: 'logout',
    name: '退出登录',
    max: 1,
    params: {
        bindurl: '',
        logouturl: '',
        delable: false,
    },
    style: {
        subcolor: '#ffffff',
        maincolor: '',
        margintop: '16',
        marginbottom: '0'
    },
    data: []
};
export const video = {
    id: "video",
    type: 'video',
    name: '视频组',
    style: {
        ratio: 0,
        topradius: 12,
        bottomradius: 12,
        marginleft: 24,
        margintop: 16,
        marginbottom: 0

    },
    params: {
        videourl: '',
        poster: ''
    },
    data: []
};
export const memberc = {
    id: "memberc",
    type: 'memberc',
    name: '会员信息',
    max: 1,
    params: {
        style: 'default1',
        seticon: 'icon-settings',
        shopicon:'iconfont-m- icon-m-dianpu',
        setlink: '',
        leftnav: '提现1',
        leftnavlink: '',
        rightnav: '提现2',
        rightnavlink: '',
        centernav: '提现',
        centernavlink: '',
        hideup: 0
    },
    style: {
        background: '#fe5455',
        textcolor: '#ffffff',
        textlight: '#ffffff'
    },
    data: []
};
export const commission_block = {
    id: "commission_block",
    type: 'commission_block',
    name: "佣金信息",
    style: {
        background: '#ffffff',
        pricecolor: '#ff8000',
        textcolor: '#000000',
        btncolor: '#ff8000',
    },
    max: 1,
    params: {},
    data: []
};
export const commission_sharecode = {
    id: "commission_sharecode",
    type: 'commission_sharecode',
    name: "邀请码",
    style: {
        background: '#ffffff',
        textcolor: '#000000',
        iconcolor: '#ff8000',
        margintop: '8',
        marginbottom: '8',
        marginleft: '24',
    },
    params: {
        title: '文字1',
        linkurl: '',
        linkurl_name: '',
        subtitle: '',
        iconclass: 'icon-m-erweima iconfont-m-',
        showicon: 1,
        topborderradius: 'round',
        bottomborderradius: 'round'
    },
    max: 1,
    data: []
};
export const blockgroup = {
    id: "blockgroup",
    type: 'blockgroup',
    name: '图标块',
    params: {
        rownum: 3,
        newstyle: 1,
        sorttype: 'col'
    },
    style: {
        background: '#ffffff',
        tipcolor: '#feb312'
    },
    data: [{
            iconclass: 'iconfont-m- icon-m-yongjin',
            iconcolor: '#FFDD44',
            text: '分销佣金',
            textcolor: '#212121',
            linkurl: '',
            linkurl_name: '',
            tipnum: '0.00',
            tiptext: '元'
        },
        {
            iconclass: 'iconfont-m- icon-m-fenxiaodingdan',
            iconcolor: '#54A3FE',
            text: '分销订单',
            textcolor: '#212121',
            linkurl: '',
            linkurl_name: '',
            tipnum: '50',
            tiptext: '笔'
        },
        {
            iconclass: 'iconfont-m- icon-m-tixianmingxi',
            iconcolor: '#FF8243',
            text: '提现明细',
            textcolor: '#212121',
            linkurl: '',
            linkurl_name: '',
            tipnum: '10',
            tiptext: '笔'
        },
        {
            iconclass: 'iconfont-m- icon-m-xiaxian',
            iconcolor: '#A46AFF',
            text: '我的下线',
            textcolor: '#212121',
            linkurl: '',
            linkurl_name: '',
            tipnum: '2',
            tiptext: '人'
        },
        {
            iconclass: 'iconfont-m- icon-m-dengjishuoming',
            iconcolor: '#00E28F',
            text: '等级说明',
            textcolor: '#212121',
            linkurl: '',
            linkurl_name: '',
            tipnum: '',
            tiptext: ''
        },
        {
            iconclass: 'iconfont-m- icon-m-paiming',
            iconcolor: '#FF715F',
            text: '佣金排名',
            textcolor: '#212121',
            linkurl: '',
            linkurl_name: '',
            tipnum: '',
            tiptext: ''
        }
    ]
};
export const detail_tab = {
    id: "detail_tab",
    type: 'detail_tab',
    name: "选项卡",
    max: 1,
    params: {
        goodstext: "商品",
        detailtext: "详情"
    },
    style: {
        background: "#f7f7f7",
        textcolor: "#666666",
        activecolor: "#ef4f4f"
    },
    data: []
};
export const detail_swipe = {
    id: "detail_swipe",
    type: 'detail_swipe',
    name: "商品图",
    max: 1,
    params: {
        "video": "", //商品视频
        "video_thumb": '', //视频封面
    },
    style: {
        dotstyle: 'round',
        dotalign: 'center',
        background: '#ffffff',
        leftright: '5',
        bottom: '5',
        opacity: '0.8'
    },
    data: [{
            imgurl: utils.staticImg('decorate/default_goods1.jpg'),
            linkurl: '1',
            linkurl_name: '',
        },
        {
            imgurl: utils.staticImg('decorate/default_goods2.jpg'),
            linkurl: '',
            linkurl_name: '',
        }, {
            imgurl: utils.staticImg('decorate/default_goods3.jpg'),
            linkurl: '',
            linkurl_name: '',
        }
    ]
};
export const detail_info = {
    id: "detail_info",
    type: 'detail_info',
    name: "商品信息",
    max: 1,
    params: {
        hideshare: '1',
        share_link: "",
        linkurl_name: '',
        share_icon: "iconfont-m- icon-m-shangpinxiangqing-fenxiang",
        title: '衬衫男女长袖夏季日系ins风文艺薄款亚麻港风男士女士小清新棉麻条纹白衬女士',
        desc: '条纹棉麻衬衫，慵随性饭，自然、舒适、透气、吸湿散湿快，可单穿当外套搭配T恤都很好看，整个春夏都可以穿着搭配',
        price: 115,
        delPrice: 334,
        timeBuyCountDown: 1000,
        expressFee: '¥10',
        sales: 3660,
        level_name: '白金会员',
        commisionMax: 5,
        hidecomsission: '1',
        canbuy: true,
        stock: 1000
    },
    style: {
        margintop: 0,
        marginbottom: 0,
        background: "#ffffff",
        titlecolor: "#212121",
        subtitlecolor: "#565656",
        pricecolor: "#FF3C29",
        textcolor: "#cccccc",
        timecolor: "#fff2e2",
        timetextcolor: "#ef4f4f",
        linepriceColor: '#969696',
        expresscolor: '#565656',
        sellcolor: '#565656',
        stockcolor: '#565656',
        commissionBackground: '#FF5555',
        commissionColor: '#FFFFFF'
    },
    data: []
};
export const detail_sale = {
    id: "detail_sale",
    type: 'detail_sale',
    name: "营销信息",
    max: 1,
    params: {
        label_style: '0'
    },
    style: {
        margintop: 16,
        marginbottom: 0,
        titlecolor: "#969696",
        couponBackground: "#FF3C29",
        background: "#ffffff",
        textcolor: "#212121",
        numcolor: "#ff3c29",
        activeTagColor: "#FF3C29",
        servercolor: '#fff3f5',
        serverTextColor: '#ff3c29'
    },
    data: [{
            label: '优惠券',
            name: "可用优惠券",
            type: "coupon",
            items: [{
                content: '满100满20'
            }, {
                content: '满200满50'
            }],
            url: 'coupon'
        },
        {
            label: '活动',
            name: "活动",
            type: "active",
            items: [
                // {
                //     name: '满减',
                //     type: 'full',
                //     enough: 100,
                //     deduct: 20
                // },
                {
                    name: '包邮',
                    type: 'freeExpress',
                    classify: 'full_free_dispatch',
                    value: 100
                },
                {
                    name: '积分',
                    type: 'score',
                    score: 12,
                    deduction_type: 1,
                    deduction_price: 50
                },
                {
                    name: '余额',
                    type: 'balance',
                    score: 12,
                    deduction_type: '1',
                    deduction_price: 50
                },
            ],
            url: 'active'
        },
        {
            label: '服务',
            name: "服务",
            type: "biaoqian",
            items: [{
                name: '货到付款'
            }, {
                name: '正品保证'
            }, {
                name: '支持发票'
            }],
            url: 'service'
        },
        {
            label: '不配送',
            name: "不配送区域",
            type: "bupeisong",
            content: {
                value: '无不配送区域'
            },
            url: 'bupeisong'
        },

        // { label: '二次购买', name: "二次购买", type: "erci", content: { discount: 10 }, url: 'erci' },
        // { label: '会员价', name: "会员价", type: "huiyuan", content: { discount: 10 } },
        // { label: '优惠', name: "优惠", type: "youhui", content: { discount: 10 }, url: 'youhui' },
        // { label: '积分', name: "积分", type: "jifen", content: { discount: 10 }, url: 'jifen' },
        // { label: '赠品', name: "赠品", type: "zengpin", content: { discount: 10 }, url: 'zengpin' },
        // { label: '全返', name: "全返", type: "fullback", content: { discount: 10 }, url: 'fullback' },

    ]


};
export const detail_spec = {
    id: "detail_spec",
    type: 'detail_spec',
    name: "商品规格",
    max: 1,
    params: {
        specs: ''
    },
    style: {
        titlecolor: '#969696',
        arrowcolor: '#969696',
        background: "#ffffff",
        textcolor: "#212121",
        margintop: 8,
        marginbottom: 8,
    },
    data: []
};

export const detail_comment = {
    id: "detail_comment",
    type: 'detail_comment',
    name: "商品评价",
    max: 1,
    params: {
        total: 10, //总评价数
        praise: 10, //好评条数
        showtype: '1', // 0 普通 1 滑动
        showcommentnum: '1', // 评价条数
        showmore: '0', // 查看更多
        moretext: '查看更多',
        showarrow: '1',
        arrowicon: 'iconfont-def icon-def-jiantou-you1',
        showlevel: '1',
        showstar: '1',
        showspec: '1',
        showtime: '1',
        showimg: '1',
        showall: '1',
        alltext: '更多评论',
    },
    style: {
        titlebgcolor: '#ffffff',
        titlecolor: '#212121',
        commentnumcolor: '#212121',
        morecolor: '#969696',
        arrowcolor: '#969696',
        titledividercolor: '#e6e7eb',
        usercolor: '#212121',
        levelcolor: '#f2dcac',
        levelbgcolor: '#31312d',
        starcolor: '#FF3C29',
        nostarcolor: '#e6e7eb',
        commentcolor: '#212121',
        speccolor: '#969696',
        timecolor: '#969696',
        dividercolor: '#e6e7eb',
        background: "#ffffff",
        margintop: 8,
        marginbottom: 8,
        allcolor: "#969696",
        commentbgcolor: "#f5f5f5",
        bordercolor: "#e6e7eb",
        betweenmargin: 24,
    },
    data: [{
        starnum: 4, //星星数
        username: 'Arthur', //用户名
        time: '2016-12-12 12:12',
        content: '衬衫收到了，质量很好,面料柔软，穿着舒服，与卖家描述的完全一致,发货速度非常快,包装非常仔细,严实,物流公司服务态度很好,非常满意',
        praise: 1, //1好评，0差评
        spec: '黑色/L',
        avart: utils.staticImg('decorate/default_user1.jpg'),
        levelname: '会员等级',
        images: [
            utils.staticImg('decorate/default_goods1.jpg'),
            utils.staticImg('decorate/default_goods2.jpg'),
            utils.staticImg('decorate/default_goods3.jpg'),
        ]
    }]
};
export const detail_buyshow = {
    id: "detail_buyshow",
    type: 'detail_buyshow',
    name: "购买可见",
    max: 1,
    params: {},
    style: {
        background: "#ffffff",
        margintop: 10,
        marginbottom: 8
    },
    data: []
};
export const detail_store = {
    id: "detail_store",
    type: 'detail_store',
    name: "适用门店",
    max: 1,
    params: {},
    style: {
        background: "#ffffff",
        margintop: 10,
        marginbottom: 8,
        titlecolor: "#333333",
        shopnamecolor: "#333333",
        shopinfocolor: "#666666",
        navtelcolor: "#008000",
        navlocationcolor: "#ff9900",
    },
    data: []
};
export const detail_package = {
    id: "detail_package",
    type: 'detail_package',
    name: "相关套餐",
    max: 1,
    params: {},
    style: {
        background: "#ffffff",
        margintop: 10,
        marginbottom: 8,
        textcolor: "#000000"
    },
    data: []
};
export const detail_pullup = {
    id: "detail_pullup",
    type: 'detail_pullup',
    name: "商品详情",
    max: 1,
    params: {
        delable: false,
        content: '',
        hidecomsission: '1',
        comsissiontitle: '预计佣金',
        params_switch: '1'
    },
    data: [{
        key: 'size',
        value: '200mm'
    }],
    style: {
        margintop: 8,
        background: "#ffffff",
        textcolor: "#333333"
    }
};
export const detail_navbar = {
         id: "detail_navbar",
         type: "detail_navbar",
         name: "底部导航",
         isbottom: 2, //置底
         max: 1,
         params: {
           customericonclass: 'iconfont-def icon-def-kefu1-1',
           customertext: "客服",
           customerlink: "wx_service",
           customerWeixinLink: "",  //微信客服链接
           customerWeixinName: "",  //微信客服名称
           customerChannel: "0",    //客服渠道
           hidelike: 0,
           hideshop: 0,
           hidecart: 0,
           hidecartbtn: 0,
           hidecustomer: -4,
           textbuy: "立刻购买",
           goodstext: "商品",
           liketext: "关注",
           likeiconclass: "iconfont-m- icon-like",
           likelink: "",
           likelink_name: "",
           like_wxappid: "",
           shoplink: "",
           shoplink_name: "",
           shop_wxappid: "",
           cartlink: "",
           cartlink_name: "",
           cart_wxapp_id: "",
           favor: 0, //是否已经关注
           shoptext: "店铺",
           shopiconclass: "iconfont-m- icon-shop",
           carttext: "购物车",
           carticonclass: "iconfont-m- icon-cart",
           badge: 1,
           has_seckill: false,
         },
         style: {
           background: "#ffffff",
           textcolor: "#999999",
           iconcolor: "#999999",
           cartcolor: "#212121",
           buycolor: "#FF3C29",
           dotcolor: "#ff0011",
           dividercolor: "#e6e7eb",
         },
         data: [],
       };
export const detail_seckill = {
    id: "detail_seckill",
    type: 'detail_seckill',
    name: "秒杀条",
    max: 1,
    params: {
        buybtntext: "原价购买"
    },
    style: {
        theme: 'red'
    },
    data: []
};

export const seckill = {
    id: "seckill",
    type: 'seckill',
    name: "秒杀",
    params: {
        activityGoodsType: '1', // 活动商品来源 0 商户 1 平台
        addGoodsType: '0',
        bgstyle: 'color', // 背景
        bgimg: '',
        showacttitle: '1',
        titlebg: 'color',
        titlebgimg: '',
        titletype: 'texticon', // 标题类型
        titleimg: '',
        titlename: '限时秒杀',
        titleicon: 'iconfont-def icon-def-miaosha2-1',
        titleweight: 'bold',
        showmore: '1',
        showtag: '1',
        tagtext: '秒杀价',
        showsales: '0', // 销量
        showprice: '1', // 商品原价
        salestext: '销量',
        showbtn: '1',
        btntext: '马上抢',
        showbadge: '0',
        badgetext: '限时秒杀',
        badgeicon: 'iconfont-m- icon-m-shandian',
        activityData: {},
        goodsnum: 20,
        current: 0
    },
    style: {
        listtype: 'scroll',
        bgcolor: '#ffffff',
        titlecolor: '#ffffff',
        titlebgcolor: '#ff3c29',
        titleiconcolor: '#ffffff',
        titlesize: 32,
        textcolor: '#ffffff',
        numcolor: '#ff3c29',
        countbgcolor: '#ffffff',
        morecolor: '#ffffff',
        goodsbgcolor: '#ffffff',
        goodscolor: '#212121',
        subtitlecolor: '#969696',
        seckillcolor: '#ff3c29',
        tagtextcolor: '#ffffff',
        tagbgcolor: '#ff3c29',
        tagbordercolor: '#ff3c29',
        salescolor: '#969696',
        pricecolor: '#969696', // 商品原价
        btncolor: '#ff3c29',
        btntextcolor: '#ffffff',
        badgetextcolor: '#ffffff',
        badgecolor: '#ffffff',
        badgebgcolor: '#ff3c29',
        marginleft: 24,
        margintop: 16,
        marginbottom: 0,
        topradius: 12,
        bottomradius: 12
    },
    data: [],
}

export const coupon = {
    id: "coupon",
    type: 'coupon',
    name: '优惠券组',
    params: {
        couponstyle: '3',
        num_row: 2
    },
    style: {
        background: '#ffffff',
        margintop: '16',
        marginleft: '24',
        marginbottom: '16',
        topradius: 12,
        bottomradius: 12
    },
    data: [
        // {
        //     name: "优惠券名称",
        //     desc: "满100元可用",
        //     price: "89.90",
        //     couponid: "",
        //     background: '#fd5454',
        //     bordercolor: '#fd5454',
        //     textcolor: '#ffffff',
        //     couponcolor: '#55b5ff',
        //     coupon_sale_type:1
        // },
    ]
};
export const fixedsearch = {
    id: "fixedsearch",
    type: 'fixedsearch',
    name: '固定搜索框',
    istop: 2,
    max: 1,
    params: {
        lefticonlink: '',
        lefticonlink_name: '',
        lefticon_wxappid: '',
        leftimglink: '',
        leftimglink_name: '',
        leftimg_wxappid: '',
        righticonlink: '',
        righticonlink_name: '',
        righticon_wxappid: '',
        rightimglink: '',
        rightimglink_name: '',
        leftnav: '0',
        rightnav: '0',
        rightnavclick: '0',
        leftnavicon: 'iconfont-m- icon-m-iconfontshop',
        rightnavicon: 'iconfont-m- icon-m-erweima',
        searchstyle: 'radius',
        placeholder: '输入关键字进行搜索',
        imgurl_left: utils.staticImg('decorate/goods_col2.png'),
        imgurl_right: utils.staticImg('decorate/goods_col2.png'),
        leftwidth: 0,
        bgstyle: 'color',
        textalign: 'left',
        locationicon: 1,
        showstyle: '1',
    },
    style: {
        background: '#ffffff',
        opacity: 1,
        opacityinput: 1,
        leftnavcolor: '#B6B6B6',
        rightnavcolor: '#B6B6B6',
        searchbackground: '#f6f6f6',
        searchtextcolor: '#c2c2c2',
        borderradius: 12,
        searchiconcolor: '#B6B6B6',
        locationiconcolor: '#FF3C29',
        locationcolor: '#969696'
    },
    data: []
};

export const tabbar = {
    id: "tabbar",
    type: 'tabbar',
    name: '标签页',
    params: {
        current: 0
    },
    style: {
        background: "#ffffff",
        activebgcolor: '#ffffff',
        textcolor: "#212121",
        activecolor: "#ff3c29",
        margininside: '0',
        margintop: '16',
        marginbottom: '0',
        marginleft: '24',
        topradius: 12,
        bottomradius: 12
    },
    data: [{
        title: '标签1',
        goods
    }, {
        title: '标签2',
        goods
    }]

};
export const topmenu = {
    id: 'topmenu',
    type: 'topmenu',
    name: '顶部菜单',
    istop: 1,
    max: 1,
    global: true,
    params: {
        current: 0
    },
    style: {
        background: "#ffffff",
        activebgcolor: '#ffffff',
        textcolor: "#212121",
        activecolor: "#ff3c29",
    },
    data: [{
            title: '首页',
            linkurl: '/pages/index/index',
            linkurl_name: '商城首页',
            disabled: true
        },
        {
            title: '选项2',
            linkurl: '',
            linkurl_name: '',
        },
        {
            title: '选项3',
            linkurl: '',
            linkurl_name: '',
        },
        {
            title: '选项4',
            linkurl: '',
            linkurl_name: '',
        },
        {
            title: '选项5',
            linkurl: '',
            linkurl_name: '',
        }
    ]
}

export const gotop = {
    id: 'gotop',
    type: 'gotop',
    name: '返回顶部',
    isfixed: 1,
    max: 1,
    params: {
        'gotoptype': '0',
        'gotopclick': '0',
        'imgurl': utils.staticImg('decorate/gotop.png'),
        'linkurl': '',
        linkurl_name: '',
        'iconposition': 'right bottom',
        'iconclass': 'iconfont-m- icon-m-up',
        'gotopheight': '300',
        show: true,
        wxappid: ''
    },
    style: {
        'iconcolor': '#ffffff',
        'background': '#000000',
        'opacity': '0.5',
        'width': '60',
        'top': 32,
        'left': '10'
    },
    data: []
}

export const diymenu = {
    id: "diymenu",
    type: 'diymenu',
    name: '未命名自定义菜单',
    isbottom: 3,
    app_type: '0',
    cart_bgcolor: "#ff3c29",
    cart_number: "1",
    cart_num: 0,
    icon_position: "top",
    icon_type: "0",
    style: {
        'bgcolor': '#ffffff',
        bordercolor: '#eeeeee',
        'bgcoloron': '#ffffff',
        'iconcolor': '#565656',
        'iconcoloron': '#ff3c29',
        'textcolor': '#565656',
        'textcoloron': '#212121',
        'childtextcolor': '#212121',
        'childbgcolor': '#ffffff',
        'childactivebgcolor': '#e6e7eb',
    },
    items: [{
        "icon_url": "",
        "icon_url_0": "",
        "icon_url_1": "",
        "icon_url_1_on": "",
        "icon_cache": "",
        "target_url": "/pages/index/index",
        "target_url_name": "商城首页",
        "iconclass": "iconfont-m- icon-m-iconfontshop",
        "text": "首页",
        "active": false,
        "showsubmenu": false,
        "badge": "",
        "child": [],
        "_sortId": "1587704700088_0.6977493779760124"
    }, {
        "icon_url": "",
        "icon_url_0": "",
        "icon_url_1": "",
        "icon_url_1_on": "",
        "icon_cache": "",
        "target_url": "/kdxGoods/categoryList/index",
        "target_url_name": "分类导航",
        "iconclass": "iconfont-m- icon-m-iconfontshop",
        "text": "分类",
        "active": false,
        "showsubmenu": false,
        "badge": "",
        "child": [],
        "_sortId": "1587704700088_0.6682435169802112"
    }, {
        "icon_url": "",
        "icon_url_0": "",
        "icon_url_1": "",
        "icon_url_1_on": "",
        "icon_cache": "",
        "target_url": "/kdxCart/index",
        "target_url_name": "购物车",
        "iconclass": "iconfont-m- icon-m-iconfontshop",
        "text": "购物车",
        "active": false,
        "showsubmenu": false,
        "badge": 4,
        "child": [],
        "_sortId": "1587704700088_0.3497304022500296"
    }, {
        "icon_url": "",
        "icon_url_0": "",
        "icon_url_1": "",
        "icon_url_1_on": "",
        "target_url": "/kdxMember/index/index",
        "target_url_name": "会员中心",
        "iconclass": "iconfont-m- icon-m-iconfontshop",
        "text": "我的",
        "active": false,
        "showsubmenu": false,
        "badge": "",
        "child": [],
        "_sortId": "1587704700088_0.7749125012000802"
    }],
    params: {},
    data: []
}

export const followbar = { //关注条
    id: 'followbar',
    type: 'followbar',
    max: 1,
    istop: 3,
    params: {
        'imgurl_logo': utils.staticImg('decorate/goods_col2.png'),
        'icontype': '2',
        'imgurl_icon': utils.staticImg('decorate/goods_col2.png'),
        'iconstyle': 'radius',
        'defaulttext': '',
        'sharetext': '欢迎访问商城，点击关注我们哦~',
        'btntext': '点击关注',
        'btnicon': 'icon-m-iconfontshop iconfont-m-',
        'btnclick': '0',
        'btnlinktype': '1',
        'btnlink': '',
        'qrcodetype': '0',
        'qrcodeurl': '',
        'imgurl_share': utils.staticImg('decorate/avatar_mobile.png'),
        showtype: '1',
        wxappid: ''
    },
    style: {
        'background': '#ffffff',
        'textcolor': '#212121',
        'btnbgcolor': '#ff3c29',
        'btncolor': '#ffffff',
        'highlight': '#212121'
    },
    data: []
}


export const liver = { // 直播组件
    id: 'liver',
    type: 'liver',
    style: {
        background: '#FFFFFF',
        titlecolor: '#212121',
        livertitlecolor: '#ffffff',
        cardcolor: '#FF3C29',
        nicknamecolor: '#ffffff',
        firstcolor: '#ff3c29',
        secondcolor: '#969696',
        margintop: 16,
        marginbottom: 16,
        marginleft: 24,
        topradius: 12,
        bottomradius: 12
    },
    params: {
        liverstyle: 'big_pic',
        livernum: 20,
        addtype: '1',
        showgoods: '0',
        showstatus: '0',
        shownickname: '0',
        showlivertitle: '0',
        showtitle: '0',
        showsubtitle: '0',
        firsttitle: '这是标题',
        subtitle: '这是副标题'
    },
    data: []
}

export const cube = { // 魔方组件
    id: 'cube',
    type: 'cube',
    style: {
        margininside: 0,
        margintop: 0,
        marginbottom: 0,
        marginleft: 24,
        topradius: 0,
        bottomradius: 0
    },
    params: {
        cubestyle: 'cell_two',
        cubenum: 4,
        imgheight: '',
        imgwidht: ''
    },
    data: [{
        linkurl: '',
        linkurl_name: '',
        imgurl: '',
        left: '',
        top: '',
        width: '',
        height: '',
        wxappid: ''
    },
    {
        linkurl: '',
        linkurl_name: '',
        imgurl: '',
        left: '',
        top: '',
        width: '',
        height: '',
        wxappid: ''
    }]
}

export const hot_area = { // 热区
    id: 'hot_area',
    type: 'hot_area',
    style: {
        margintop: 0,
        marginbottom: 0,
        marginleft: 24,
        topradius: 12,
        bottomradius: 12
    },
    params: {
        imgurl: '',
    },
    data: []
}

export const customer = {
    id: 'customer',
    type: 'customer',
    name: '客服',
    max: 1,
    isfixed: 1,
    opacity: '0.25',
    style: {
        styleType: 'one',  // 显示样式-样式一
        showType: '0',  // 显示类型-图文
        iconcolor: '#0267ff',
        titlecolor: '#ffffff',
        bgcolor: '#0267ff',
        bordercolor: '#0267ff',
        width: '104',
        offset_up_down: '144', // 上下
        offset_left_right: '24', // 左右
    },
    position: 'left bottom',
    data: [],
    params: {
        customer: 'wx', // 选择的客服
        link_url: 'wx_service',
        customerName: "",
        wxappid: '',
        customerType: '0',
        iconclass: 'iconfont-def icon-def-kefu3',
        imgurl: '',
        titlename: '咨询客服',
        img: '', // 纯图显示
    },
};
export const wxTransaction = {
    id: "wxTransaction",
    type: 'wxTransaction',
    name: '视频号直播',
    max: 1,
    params: {
        video_number_id: '', // 视频号ID
        bgstyle: 'color',
        bgimg: '',
    },
    style: {
        bgcolor: '#FFFFFF',
        background: '#FF3C29',
        titlecolor: '#4D4D4D',
        advancecolor: '#4D4D4D',
        statuscolor: '#FFFFFF',
        statusBgcolor: '#FF3C29',
        btncolor: '#FFFFFF',
        btnBgcolor: '#FF3C29',
        margintop: '16',
        marginleft: '24',
        marginbottom: '0',
        topradius:'12',
        bottomradius: '12',
    },
    data: []
};
export const groups = {
    id: "groups",
    type: 'groups',
    name: "拼团",
    params: {
        activityGoodsType: '1', // 活动商品来源 0 商户 1 平台
        listtype: 'scroll',
        addGoodsType: '0',
        bgstyle: 'color', // 背景
        bgimg: '',
        showacttitle: '1',
        titlebg: 'color',
        titlebgimg: '',
        titletype: 'texticon', // 标题类型
        titleimg: '',
        titlename: '多人拼团',
        titleicon: 'iconfont-def icon-def-pintuan2-1',
        titleweight: 'bold',
        showsales: '0', // 销量
        showprice: '1', // 商品原价
        pricetext: '单买价',
        showbtn: '1',
        btnstyle: '0',
        btntext: '马上拼',
        showbadge: '0',
        badgetext: '多人拼团',
        badgeicon: 'iconfont-def icon-def-pintuan2-1',
        activityData: {},
        goodsnum: 20,
        pricegrouptext: '拼团价',
        activitygoodscount: 1, // 活动商品数量
    },
    style: {
        bgcolor: '#ffffff',
        titlecolor: '#212121',
        titlebgcolor: '#ffffff',
        titleiconcolor: '#ff6f29',
        textcolor: '#212121',
        titlesize: 32,
        numcolor: '#ffffff',
        countbgcolor: '#ff6f29',
        morecolor: '#969696',
        goodsbgcolor: '#ffffff',
        goodscolor: '#212121',
        subtitlecolor: '#969696',
        pricecolor: '#969696', // 商品原价
        btncolor: '#ff6f29',
        btntextcolor: '#ffffff',
        badgetextcolor: '#ffffff',
        badgeiconcolor: '#ffffff',
        badgebgcolor: '#ff6f29',
        marginleft: 24,
        margintop: 16,
        marginbottom: 0,
        topradius: 12,
        bottomradius: 12,
        pricegroupcolor: '#ff3c29',
    },
    data: [],
}


