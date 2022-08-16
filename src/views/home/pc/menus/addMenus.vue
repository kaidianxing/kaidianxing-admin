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
                    <!-- 基本设置 -->
                    <kdx-form-title>基本设置</kdx-form-title>
                    <FormItem label="菜单状态：" prop="status">
                        <RadioGroup v-model="model.status">
                            <Radio :disabled='noManagePerm' :label="1">
                                <span>开启</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' :label="0">
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                        <kdx-hint-text>开启后，PC商城首页顶部菜单会显示。</kdx-hint-text>
                    </FormItem>

                    <FormItem label="菜单名称：" prop="name">
                        <Input :disabled='noManagePerm' placeholder="请输入" maxlength="6" show-word-limit
                               class="width-300"
                               v-model="model.name"></Input>
                    </FormItem>
                    <FormItem label="底部支持：" v-if="addType == '2'" prop="img">
                        <kdx-image-video
                            type="image"
                            @on-change="changeThumb($event,'img')"
                            :current="model.img"
                        ></kdx-image-video>
                        <kdx-hint-text>最多可添加1张，建议尺寸：100*100</kdx-hint-text>
                    </FormItem>
                    <FormItem label=" 菜单跳转链接：" prop="url">
                        <Input
                            class="width-300"
                            v-model="model.url"
                            placeholder="请填写跳转pc页面的访问路径"
                        />
<!--                        <span-->
<!--                            :data-val="model.url"-->
<!--                            class="ck"-->
<!--                            @click="showSelect"-->
<!--                        >选择链接</span-->
<!--                        >-->
                    </FormItem>

                    <FormItem label="菜单排序：" prop="sort_order">
                        <Input :disabled='noManagePerm' type="number" placeholder="请输入数字"
                               class="width-300"
                               v-model="model.sort_order"></Input>
                        <div class="flex">
                            <kdx-hint-text content="最多4位数字，数字越大，排名越靠前，默认排序为创建时间。"></kdx-hint-text>

                        </div>
                    </FormItem>
                </div>
            </Form>
        </div>
        <template #btn>
            <Button class="handler-btn primary-long" :disabled='noManagePerm' @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>

</template>
<script>
import {mapState} from 'vuex'

export default {
    name: 'index',
    computed: {

        ...mapState('account', {
            shopId: state => state.shop.shopId
        }),
        noManagePerm() {//管理权限
            return !this.$getPermMap('pc.menus.manage')
        },
        isRoot() { // 是否是管理员
            return this.$store.state.config?.user?.is_root == 1
        },
        goodSelector() {
            if (this.goodsSelectType == 0 || this.goodsSelectType == 1 || this.goodsSelectType == 2) {
                return "GoodSelector" + this.goodsSelectType
            }
            return ''
        },
        addGoods() {
            return !this.goodsList.some(item => {
                return this.goodsSelectType && this.goodsSelectType == item.id
            })
        },
    },
    data() {
        return {
            showUnionSelect: false,
            menusId: '',
            addType:'1',//添加类型
            model: {
                status: 1,
                id: '',
                name: "",
                sort_order: '',
                url: "",
                img:'',
            },
            rules: {
                status: [
                    {
                        required: true,
                        message: '请选择菜单状态'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '请输入菜单名称'
                    }
                ],
                img: [
                    {
                        required: true,
                        message: '请上传菜单图片'
                    }
                ],
                url: [
                    {
                        required: true,
                        message: '请输入跳转链接',
                        trigger: 'blue'
                    }
                ],
                sort_order: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if(value.length > 4){
                                callback(new Error('最多为4位数'));
                            }else if(!value){
                                callback(new Error('请输入菜单排序'));
                            }
                            else{
                                callback();
                            }
                        }
                    }
                ],
            },
        };
    },
    methods: {
        changeLink(e) {
            this.model.mall_close_url = e.url;
        },
        changeThumb(path, property) {
            this.$set(this.model, property, path);
        },
        showSelect() {
            this.showUnionSelect = !this.showUnionSelect
        },
        getData() {
            this.$api.homeApi.menuDetail({id: this.menusId}).then(res => {
                if (res.error === 0) {
                    this.model = Object.assign({}, res.data)
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
            this.validate(valid => {
                if (valid) {
                    let apiName = 'menuEdit'//编辑保存
                    if (this.menusId == '') apiName = 'menuAdd'//添加保存
                    this.model.id = this.menusId
                    this.model.type = this.$route.query.type
                    this.$api.homeApi[apiName](this.model)
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('保存成功');
                                setTimeout(() => {
                                    this.$router.go(-1)
                                }, 1000)
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                }
            });
        },
    },
    mounted() {
        this.addType = this.$route.query.type || '1'
        if (this.$route.query.hasOwnProperty('id')) {
            this.menusId = this.$route.query.id
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
    padding: 5px 10px;
    background-color: var(--theme-navBackground);
}
</style>
