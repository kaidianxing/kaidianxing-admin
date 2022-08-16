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
<template>
    <kdx-content-bar>
        <div class="container">
            <Form class="content" ref="form" :model="model" :rules="rules" :label-width="140" @on-validate='onValidate'>
                <div class="content-box">
                    <!-- 添加组块信息 -->
                    <kdx-form-title>添加组块信息</kdx-form-title>
                    <FormItem label="商品组块状态：" prop="mall_status">
                        <RadioGroup v-model="model.status">
                            <Radio :disabled='noManagePerm' :label="1">
                                <span>开启</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' :label="0">
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                        <kdx-hint-text>开启后，PC商城首页显示该商品组模块内容。</kdx-hint-text>
                    </FormItem>

                    <FormItem label="商品组块名称：" prop="name" v-error-item.name>
                        <Input :disabled='noManagePerm' placeholder="请输入" maxlength="10" show-word-limit
                               class="width-300"
                               v-model="model.name"></Input>
                        <div class="flex">
                            <kdx-hint-text content="PC商城 首页展示组块名称。"></kdx-hint-text>
                            <kdx-hint-tooltip
                                width="320px"
                                type="image"
                                :image="require('@/assets/image/channel/goodsGroupTitle.png')"
                            ></kdx-hint-tooltip>
                        </div>
                    </FormItem>
                    <FormItem label="主推图片：" prop="main_img" v-error-item.main_img>
                        <kdx-image-video
                            type="image"
                            @on-change="changeThumb($event,'main_img')"
                            :current="model.main_img"
                        ></kdx-image-video>
                        <kdx-hint-text>图片为长方形，建议尺寸472*400，用于商城首页分享的系统默认宣传图。</kdx-hint-text>
                    </FormItem>
                    <FormItem label=" 主图图跳转链接：" prop="main_img_url">
                        <Input
                            class="width-300"
                            v-model="model.main_img_url"
                            placeholder="请填写跳转pc页面的访问路径"
                        />
<!--                        <span-->
<!--                            :data-val="model.main_img_url"-->
<!--                            class="ck"-->
<!--                            @click="showSelect"-->
<!--                        >选择链接</span-->
<!--                        >-->
                    </FormItem>
                    <FormItem label="商品选择：">
                        <MyRadioGroup v-model="model.goods_type" :items='goodsList'>
                        </MyRadioGroup>
                        <!-- 选择商品的子模块 -->
                        <div class="width-600">
                            <FormItem :label-width='0' prop="goods_info" error="请选择商品" :show-message="goods_info_message">
                                <component :is='goodSelector' :key="model.goods_type" :currentInfo='model.goods_info'
                                           @validateGoodsForm='validateGoodsForm'
                                           @handleChange="handleChange"></component>
                            </FormItem>
                        </div>
                    </FormItem>
                    <FormItem label="商品组块排序：" prop="sort_order" v-error-item.name>
                        <Input :disabled='noManagePerm' type="number" maxlength="4" placeholder="请输入"
                               class="width-300"
                               v-model="model.sort_order"></Input>
                        <div class="flex">
                            <kdx-hint-text content="最多4位数字，数字越大，排名越靠前，默认排序为创建时间。"></kdx-hint-text>

                        </div>
                    </FormItem>


                    <kdx-form-title>广告设置</kdx-form-title>
                    <FormItem :label-width="0">
                        <kdx-hint-alert :show-icon="false">
                            说明：跟随商品组块可添加 广告，在商品组块上下均可添加1条广告图片。
                        </kdx-hint-alert>
                    </FormItem>

                    <FormItem label="顶部广告：">
                        <kdx-image-video
                            :height="67"
                            type="image"
                            @on-change="changeThumb($event,'top_advertise_img')"
                            :current="model.top_advertise_img"
                        ></kdx-image-video>
                        <kdx-hint-text>最多可添加1张，建议尺寸：1200*120</kdx-hint-text>
                    </FormItem>
                    <FormItem label=" 顶部广告跳转链接：">
                        <Input
                            class="width-300"
                            v-model="model.top_advertise_img_url"
                            placeholder="请填写跳转pc页面的访问路径"
                        />
<!--                        <span-->
<!--                            :data-val="model.mall_close_url"-->
<!--                            class="ck"-->
<!--                            @click="showSelect"-->
<!--                        >选择链接</span-->
<!--                        >-->
                    </FormItem>
                    <FormItem label="底部广告：" prop="login_show_img">
                        <kdx-image-video
                            :height="67"
                            type="image"
                            @on-change="changeThumb($event,'bottom_advertise_img')"
                            :current="model.bottom_advertise_img"
                        ></kdx-image-video>
                        <kdx-hint-text>最多可添加1张，建议尺寸：1200*120</kdx-hint-text>
                    </FormItem>
                    <FormItem label=" 底部广告跳转链接：">
                        <Input
                            class="width-300"
                            v-model="model.bottom_advertise_img_url"
                            placeholder="请填写跳转pc页面的访问路径"
                        />
<!--                        <span-->
<!--                            :data-val="model.bottom_advertise_img_url"-->
<!--                            class="ck"-->
<!--                            @click="showSelect"-->
<!--                        >选择链接</span-->
<!--                        >-->
                    </FormItem>
                </div>
            </Form>
        </div>
        <template #btn>
            <Button class="handler-btn primary-long" :disabled='noManagePerm' @click="handleSave">保存</Button>
        </template>
        <div v-if="showUnionSelect">
            <union-selector
                v-model="showUnionSelect"
                :tab-name="chooseTabs"
                :current="linkInfo"
                :disabledLink="['wx_service']"
                @on-cancel="showSelect"
                @on-change="changeLink"
            ></union-selector>
        </div>
    </kdx-content-bar>

</template>
<script>
import {mapState} from 'vuex'
import UnionSelector from "@/components/selector/LinkUnionSelector";
import MyRadioGroup from '@/components/decorate/RadioGroup'
import {dealClassifyList} from '@/assets/helpers';

export default {
    name: 'index',
    components: {
        UnionSelector,
        MyRadioGroup,
        GoodSelector1: () => import ("./components/SelectGood1.vue"),
        GoodSelector2: () => import ("./components/SelectGood2.vue"),
        GoodSelector3: () => import ("./components/SelectGood3.vue"),
    },
    computed: {

        ...mapState('account', {
            shopId: state => state.shop.shopId
        }),
        noManagePerm() {//管理权限
            return !this.$getPermMap('pc.goods-group.manage')
        },
        isRoot() { // 是否是管理员
            return this.$store.state.config?.user?.is_root == 1
        },
        goodSelector() {
            if (this.model.goods_type == 1 || this.model.goods_type == 2 || this.model.goods_type == 3) {
                return "GoodSelector" + this.model.goods_type
            }
            return ''
        },
        addGoods() {
            return !this.goodsList.some(item => {
                return this.model.goods_type && this.model.goods_type == item.id
            })
        },
    },
    data() {
        return {
            linkFlg: 0,
            showUnionSelect: false,
            currentModal: {},
            goods_info_message:false,
            groupId:'',
            model: {
                status: 1,
                name: '',
                main_img: '',//广告主图
                main_img_url: '',//广告主图url
                goods_type: '1',//商品选择类型
                goods_info: [],//商品详细
                sort_order: '',//排序
                top_advertise_img: '',//顶部图片
                top_advertise_img_url: '',//顶部图片url
                bottom_advertise_img: '',//底部图片
                bottom_advertise_img_url: '',///底部图片url
            },
            rules: {
                status: [
                    {
                        required: true,
                        message: '请选择商城状态'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '请输入商品组块名称'
                    }
                ],
                main_img: [
                    {
                        required: true,
                        message: '请上传商城主推图',
                        trigger: 'change'
                    }
                ],
                main_img_url: [
                    {
                        required: true,
                        message: '请输入主推图链接',
                        trigger: 'change'
                    }
                ],
                goods_type: [
                    {
                        required: true,
                        message: '请选择商品类型',
                        trigger: 'change'
                    }
                ],
                sort_order: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if(value.length > 4){
                                callback(new Error('最多为4位数'));
                            }else if(!value){
                                callback(new Error('请输入商品组排序'));
                            }
                            else{
                                callback();
                            }
                        }
                    }
                ]
            },
            submitLoading: false,
            goodsList: [{
                label: '自选商品',
                id: '1'
            }, {
                label: '商品分类',
                id: '2'
            }, {
                label: '商品分组',
                id: '3'
            }],
        };
    },
    created() {
        // 获取商品分类
        this.getCategory()
    },
    methods: {
        // 商品分类
        getCategory() {
            this.$api.homeApi.goodsGroupTypes().then((res) => {
                if (res.error === 0) {
                    let arr = []
                    res.data.forEach(item => {
                        arr.push({
                            label: item.val,
                            id: item.key
                        })
                    })
                    this.goodsList = dealClassifyList(arr)
                }
            })
        },
        handleChange(data) {
            this.goods_info_message = false
            this.model.goods_info = data
            this.$set(this.model, 'goods_info', data)
            console.log('被赋值', this.model.goods_info)


        },
        validateGoodsForm() {
            console.log('3456')

        },
        getLabelField() {
            let sort = {
                0: {
                    key: '',
                    by: 'desc'
                },
                1: {
                    key: 'sales',
                    by: 'desc'
                },
                2: {
                    key: 'price',
                    by: 'desc'
                },
                3: {
                    key: 'price',
                    by: 'asc'
                }
            }
            if (isNaN(this.goodsSelectType * 1)) { //按照营销属性查询
                let params = {
                    pageCount: 1,
                    pagesize: 50,
                    status: 1,
                    label_field: this.goodsSelectType,
                    sort: sort[this.currentModal.params.goodssort].key,
                    by: sort[this.currentModal.params.goodssort].by,
                }
                this.$api.goodsApi.goodsList(params)
                    .then(res => {
                        if (res.error === 0) {
                            this.currentModal.data = res.list.map(val => {
                                return {
                                    thumb: val.thumb,
                                    price: val.price,
                                    productprice: val.original_price,
                                    sales: val.sales,
                                    title: val.title,
                                    sub_title: val.sub_title,
                                    gid: val.id,
                                    bargain: 0,
                                    credit: 0,
                                    ctype: 0,
                                    type: val.type
                                }
                            })

                            this.refreshCurrentModal();
                        }
                    }).catch();
            }
        },
        changeLink(e) {
            this.model.mall_close_url = e.url;
        },
        showSelect() {
            this.showUnionSelect = !this.showUnionSelect
        },
        changeThumb(path, property) {
            console.log(path, property)
            this.$set(this.model, property, path);

        },
        getData() {
            this.$api.homeApi.goodsGroupDetail({id:this.groupId}).then(res => {
                // let {error, shop_info, ...info} = res;
                if (res.error === 0) {
                    console.log(res.data.goods_info)
                    res.data.goods_info = JSON.parse(res.data.goods_info)
                    this.model = Object.assign({},res.data)

                    console.log( this.model,' this.model')
                }
            });
        },
        onValidate(prop, status) {
            this.cacheError = {
                ...this.cacheError,
                [prop]: status
            }
        },
        validate(fn = () => {
        }) {
            return new Promise(resolve => {
                this.$refs['form'].validate(valid => {
                    if((Array.isArray( this.model.goods_info) && this.model.goods_info.length <= 0) || (!Array.isArray( this.model.goods_info) && !this.model.goods_info.hasOwnProperty('data') ) ){
                        this.goods_info_message = true
                    }
                    resolve(valid);
                    fn(valid);
                    this.$nextTick(() => {
                        if (!valid) {
                            for (let k in this.cacheError) {
                                if (!this.cacheError[k]) {
                                    this.$focusError(k);
                                    break;
                                }
                            }
                        }
                    })
                });
            });
        },
        handleSave() {
            console.log(this.model, 'model')
            this.validate().then((valid) => {
                if(valid && !this.goods_info_message){
                    let apiName = 'goodsGroupEdit'//编辑保存
                    if(this.groupId == '')apiName = 'goodsGroupAdd'//添加保存
                    this.model.id = this.groupId
                    this.$api.homeApi[apiName](this.model).then(res=>{
                        if(res.error === 0){
                            this.$Message.success('保存成功');
                            setTimeout(()=>{
                                this.$router.go(-1)
                            },1000)
                        }else{
                            this.$Message.error(res.message);
                        }
                        console.log('保存成功',res)
                    })
                }

            })
        },

    },
    mounted() {
        if(this.$route.query.hasOwnProperty('id')){
            this.groupId = this.$route.query.id
            this.getData();

        }
    }
};
</script>

<style scoped lang="scss">
.container {
    min-height: 100%;
    padding-top: 20px;
    border-radius: 2px;
}

.renew-btn {
    margin-left: 10px;
    cursor: pointer;
    color: var(--danger-color);
}

.meal-info {
    /deep/ .ivu-form-item-label {
        padding: 0px 10px 0px 0;
        line-height: 32px;
    }
}

.content {
    padding: 40px;
    overflow: auto;
    background: #fff;

    /deep/ .show-img + .ivu-form-item-error-tip {
        top: 84%;
    }

    .content-box {
        padding-bottom: 30px;
    }

    .agree-input {
        margin-right: 10px;
        width: 340px;
    }

    .example {
        color: #939799;

        &:hover {
            color: #2b85e4;
        }
    }

    .danger {
        background: var(--danger-color);
        border: 1px solid var(--danger-color);
    }


}

/deep/ .ivu-btn-error {
    background: #fff;
}

.pass-model {
    /deep/ .ivu-modal {
        .content {
            padding: 20px;
        }
    }

    .tip {
        margin-bottom: 10px;
        color: var(--danger-color);
    }

    .check-box {
        margin-right: 10px;
    }
}

.ck {
    cursor: pointer;
    color: #ffffff;
    margin-left: 0px;
    padding:5px 10px;
    background-color: var(--theme-navBackground);
}
</style>
