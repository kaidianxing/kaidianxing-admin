/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 

<template>
    <kdx-content-bar :loading="loading">
        <div class="article-settings">
            <kdx-form-title>功能设置</kdx-form-title>
            <Form ref="form" :model="model" :label-width="160" :rules="rule"  @submit.native.prevent>
                <FormItem class="title" label="文章标题栏自定义：" prop="title">
                    <Input
                        v-model="model.title"
                        type="text"
                        class="width-430" />
                    <kdx-hint-text>
                        支持专题页面名称自定义
                        <kdx-hint-tooltip
                            class="tooltip"
                            type="image"
                            :image="require('@/assets/image/example/article/article_title.png')">
                        </kdx-hint-tooltip>
                    </kdx-hint-text>
                </FormItem>
                <FormItem label="文章模板：" prop="template_type" class="r-form-item-checkbox" >
                    <RadioGroup class="radio-box" v-model="model.template_type" @on-change="handleChange">
                        <Radio label="1">
                            小图模式
                            <kdx-hint-tooltip
                                class="tooltip"
                                type="image"
                                hintText=""
                                :image="require('@/assets/image/example/article/article_small.png')">
                            </kdx-hint-tooltip>
                        </Radio>
                        <Radio label="2">
                            瀑布流
                            <kdx-hint-tooltip
                                class="tooltip"
                                type="image"
                                hintText=""
                                :image="require('@/assets/image/example/article/article_waterfall.png')">
                            </kdx-hint-tooltip>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="文章页面banner：" class="add-img" prop="banner">
                    <DragSortableItems class="banner-item" :list='model.banner' @delItem='delItem'>
                        <template v-slot='{item}'>
                            <AddImg :draggable="false" tip="图片宽度建议750px" :item='item' url='imgurl' link='linkurl' @change-img='changeImg' @change-link='changeLink'></AddImg>
                        </template>
                    </DragSortableItems>
                    <i-button v-if="model.banner.length < 5" :style='{width:"100%",color:$css["--brand-color"], marginTop: "10px"}' @click='addItem'>+添加图片</i-button>
                </FormItem>
                <FormItem label="文章详情页客服：" prop="customer">
<!--                    <MyRadioGroup -->
<!--                        v-if="customerList.length"-->
<!--                        :items='customerList' -->
<!--                        v-model="model.customer" -->
<!--                        key="index" -->
<!--                        @change="chooseCustomer">-->
<!--                    </MyRadioGroup>-->
                    <MyRadioGroup 
                        class="customer-radio"
                        v-if="customerList.length"
                        :items='customerList' 
                        v-model="model.customer" 
                        key="index" 
                        @change="chooseCustomer">
                        <div v-if='model.customer=="wechat"'>
                            <FormItem prop="link_url" style='margin-bottom:0;' :label-width="0">
                                <WxCustomerService  :currentUrl="model" @on-change="selectCustomerLink"></WxCustomerService>
                            </FormItem>
                        </div>
                    </MyRadioGroup>
                </FormItem>
                <!-- <FormItem label="一键保存图片：" prop="click_save_type" class="r-form-item-checkbox" >
                    <RadioGroup class="radio-box" v-model="model.click_save_type">
                        <Radio label="1">
                            开启
                        </Radio>
                        <Radio label="0">
                            关闭
                        </Radio>
                    </RadioGroup>
                    <hint-text>开启后会员访问小程序商城时，可一键保存文章详情中文本编辑上传的所有图片至相册</hint-text>
                </FormItem> -->
                <FormItem class="time" label="转发奖励时间：" prop="reward_time_limit" >
                    被分享者阅读
                    <kdx-rr-input
                        v-model="model.reward_time_limit" 
                        placeholder="请输入" 
                        number
                        :fixed="0" 
                        :min-value="10" 
                        :max-value="60" 
                        class="time-input width-100">
                        <span slot="append">秒</span>
                    </kdx-rr-input>
                    进行奖励发放
                </FormItem>
                <FormItem label="文章页面菜单：" prop="bottom_menu" class="r-form-item-checkbox" >
                    <RadioGroup class="radio-box" v-model="model.bottom_menu">
                        <Radio label="1">
                            显示
                        </Radio>
                        <Radio label="0">
                            隐藏
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text>支持专题文章列表页面自定义显示商城默认底部导航</kdx-hint-text>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :disabled="noManagePerm" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
import MyRadioGroup from '@/components/decorate/RadioGroup'
import DragSortableItems from "@/components/decorate/DragSortableItems"
import AddImg from '@/components/decorate/AddImg'
import WxCustomerService from '@/views/shop/decoratePage/components/controller/WxCustomerServices'
const SERVICEMAP = {
    'renxinyun': 'rr',
    'wx_service': 'wx',
    'customer_service': 'tx',
    'wechat_customer_service': 'wechat'
};
export default {
    provide: {
        'chooseTab': 'article'
    },
    components: {
        MyRadioGroup,
        DragSortableItems,
        AddImg,
        WxCustomerService
    },
    data() {
        return {
            loading: false,
            model: {
                title: "",
                template_type: "1",
                bottom_menu: "0",
                banner: [
                    {
                        imgurl: "",
                        linkurl: ""
                    }
                ],
                customer: '0', // 选择的客服
                customerChannel: '0', // 人信云客服渠道
                link_url: '',
                customerName: "",
                reward_time_limit: 15,
                click_save_type: "0"
            },
            rule: {
                title: [{ required: true, message: "专题页面名称必填" }],
                banner: [{ 
                    validator: (rule, value, callback) => {
                        let res = false;
                        value.forEach(item => {
                            if(item.linkurl && !item.imgurl) {
                                res = true
                            }
                        });
                        if (res) {
                            callback(new Error('图片必选'))
                        } else {
                            callback();
                        }
                    }
                }],
                reward_time_limit: [{ required: true, message: "转发奖励时间必填" }],
                customer: [{ required: true, message: "请选择文章详情页客服" }],
                link_url: [{ required: true, message: "请选择客服" }],
            },
            customer_service: null,
            customerList: [],
            customerChannelList: [
                {
                    label: "原生客服",
                    id: "0"
                },
                {
                    label: "企业微信客服",
                    id: "1"
                }
            ]
        };
    },
    created() {
        this.getCustomerLink();
        this.getData();
    },
    computed: {
        noManagePerm() {
            // 无管理权限
            return !this.$getPermMap('article.settings.manage')
        },
    },
    methods: {
        clear() {
            this.$Modal.confirm({
                title: '提示',
                content: '确定清除附件缓存',
                onOk: () => {
                    this.$api.articleApi.clearData().then((res) => {
                        if(res.error === 0) {
                            this.$Message.success('清除成功')
                        }
                    })
                }
            })
        },
        getData() {
            this.loading = true;
            this.$api.articleApi.getArticleSettings().then((res) => {
                if (res.error === 0) {
                    res.data.customerChannel = res.data.customer_channel;
                    res.data.customerName = res.data.customer_name;
                    delete res.data.customer_channel;
                    delete res.data.customer_name;
                    this.model = res.data;
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        handleChange(e) {
            if(e == "2") {
                this.$Modal.info({
                    title: "提示",
                    content: "切换模式可能会导致封面图片适配问题，如有问题，请前往文章进行相应编辑",
                });
            }
        },
        delItem(item) {
            for (let i = 0; i < this.model.banner.length; i++) {
                if (item === this.model.banner[i]) {
                    this.model.banner.splice(i, 1);
                    break;
                }
            }
        },
        addItem() {
            if(this.model.banner.length < 5) {
                this.model.banner.push({
                    imgurl: '',
                    linkurl: '',
                })
            }
        },
        changeLink(val, item) {
            item.linkurl = val.url;
            item.linkurl_name = val.name;
        },
        changeImg(val, item) {
            item.imgurl = val;
        },
        handleSave() {
            this.loading = true;
            this.$refs['form'].validate(valid => {
                if (valid) {
                    let banner = this.model.banner.map((item) => {
                        return {
                            imgurl: item.imgurl,
                            linkurl: item.linkurl,
                            linkurl_name: item.linkurl_name
                        }
                    })
                    let params = {
                        ...this.model
                    };
                    params.banner = banner;
                    params.customer_channel = params.customerChannel;
                    params.customer_name = params.customerName;
                    delete params.customerChannel;
                    delete params.customerName;
                    this.$api.articleApi.setArticleSettings({
                        data: JSON.stringify(params)
                    }).then(res => {
                        if (res.error === 0) {
                            this.$Message.success('操作成功');
                            this.getData()
                        }
                    });
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        // 选择客服
        getCustomerLink() {
            this.$api.shopApi.getLinkList().then(res => {
                if (res.error === 0) {
                    this.customerList = [];
                    for (let key in res.service) {
                        this.customerList.push({
                            id: SERVICEMAP[key],
                            label: res.service[key].name
                        })
                    }
                    this.customerList.push({
                        id: '0',
                        label: "关闭"
                    })
                    this.customer_service = res?.service?.customer_service?.url || null;
                }
            });
        },
        chooseCustomer(val) {
            if (val === 'wx') {
                this.model.link_url='wx_service';
            } else if (val === 'rr') {
                if (this.model.customerChannel === '0') {
                    this.model.link_url='/pagesCustomer/index';
                } else {
                    this.model.link_url='';
                    this.model.customerName='';
                }
            } else if (val === 'tx') {
                this.model.link_url=this.customer_service;
            } else if(val == 'wechat') {
                this.model.link_url='';
                this.model.customerName='';
            }
        },
        chooseCustomerChannel(val) {
            this.model.customerChannel = val;
            if (val === '0') {
                this.model.link_url='/pagesCustomer/index';
            } else {
                this.model.link_url='';
                this.model.customerName='';
            }
        },
        selectCustomerLink(val) {
            if(val.link) {
                this.model.link_url=val.link;
                this.model.customerName = val.username || val.name
            }else {
                this.model.link_url="";
                this.model.customerName = ""
            }
        },
    },
};
</script>
<style lang='scss'>
/deep/.select-good {
    display: none;
}
</style>
<style lang='scss' scoped>
.article-settings {
    margin: 20px 0;
    padding: 40px;
    background: #fff;
    min-height: 100%;
}
.add-img {
    width: calc(160px + 500px);
}
/deep/.ivu-form-item-error .ivu-input-group-append, /deep/.ivu-form-item-error .ivu-input-group-prepend, /deep/.ivu-form-item-error .ivu-input {
    border-color: var(--border-color);
}
.title.ivu-form-item-error /deep/.ivu-input {
        border-color: #ed4014;
}
.time.ivu-form-item-error {
    /deep/.ivu-input-group-append, /deep/.ivu-input {
        border-color: #ed4014;
    }
}
/deep/.hint-tooltip .hint-tooltip-tooltip .icon-shili {
    padding-left: 6px;
}
.hint-box {
    display: flex;
    /deep/.hint-tooltip .hint-tooltip-tooltip .icon-shili {
        padding-left: 10px;
    }
}
.time {
    /deep/ .ivu-form-item-content {
        display: flex;
    }
    .time-input {
        margin: 0 10px;
    }
}
/deep/.drag-sort-item:last-child {
    margin-bottom: 0;
}
.hintAlert {
    margin-bottom: px2rpx(10);
}
.customer-radio /deep/.content {
    width: 500px;
}
.hint {
    margin-left: 100px;
}
</style>