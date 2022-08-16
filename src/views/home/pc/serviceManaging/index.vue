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
                    <kdx-form-title>基础设置</kdx-form-title>
                    <FormItem label="客服管理：" prop="status">
                        <RadioGroup v-model="model.status">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>开启</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="0">
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="客服名称：" prop="name">
                        <Input :disabled='noManagePerm' placeholder="请输入" maxlength="6" show-word-limit
                               class="width-300"
                               v-model="model.name"></Input>
                    </FormItem>
                    <!--<FormItem label="标题：">-->
                    <!--    <Input :disabled='noManagePerm' placeholder="请输入" maxlength="6" show-word-limit-->
                    <!--           class="width-300"-->
                    <!--           v-model="model.title"></Input>-->
                    <!--</FormItem>-->
                    <FormItem label="姓名显示：">
                        <RadioGroup v-model="model.service_name_show">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>显示</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="0">
                                <span>隐藏</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="客服姓名：">
                        <Input :disabled='noManagePerm' placeholder="请输入" maxlength="6" show-word-limit
                               class="width-300"
                               v-model="model.service_name"></Input>
                    </FormItem>
                    <FormItem label="QQ客服：">
                        <RadioGroup v-model="model.qq_show">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>显示</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="0">
                                <span>隐藏</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="标题：">
                        <div class="flex">
                            <div class="classFortItem">
                                <Input :disabled='noManagePerm' placeholder="请输入" maxlength="6" show-word-limit
                                       class="width-150"
                                       v-model="model.qq_title"></Input>
                            </div>
                            <div class="classFortItem">
                                <FormItem label="QQ号码：">
                                    <div class="flex">
                                        <Input :disabled='noManagePerm' placeholder="请输入" maxlength="10" show-word-limit
                                               class="width-300"
                                               v-model="model.qq_number"></Input>
                                    </div>
                                </FormItem>
                            </div>
                        </div>
                    </FormItem>
                    <FormItem label="微信客服：">
                        <RadioGroup v-model="model.wechat_show">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>显示</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="0">
                                <span>隐藏</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="标题：">
                        <Input :disabled='noManagePerm' placeholder="请输入" maxlength="6" show-word-limit
                               class="width-300"
                               v-model="model.wechat_title"></Input>
                    </FormItem>
                    <FormItem label="二维码：" v-error-item.logo>
                        <kdx-image-video
                            type="image"
                            @on-change="changeThumb($event,'wechat_qrcode')"
                            :current="model.wechat_qrcode"
                        ></kdx-image-video>
                        <kdx-hint-text>建议尺寸142*142</kdx-hint-text>
                    </FormItem>
                    <FormItem label="服务热线：">
                        <RadioGroup v-model="model.service_phone_show">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>显示</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="0">
                                <span>隐藏</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="标题：">
                        <div class="flex">
                            <div class="classFortItem">
                                <Input :disabled='noManagePerm' placeholder="请输入" maxlength="6" show-word-limit
                                       class="width-150"
                                       v-model="model.service_phone_title"></Input>
                            </div>
                            <div class="classFortItem">
                                <FormItem label="电话：">
                                    <div class="flex">
                                        <Input :disabled='noManagePerm' placeholder="请输入" maxlength="11" show-word-limit
                                               class="width-300"
                                               v-model="model.service_phone_number"></Input>
                                    </div>
                                </FormItem>
                            </div>
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
    name: 'serviceManaging',
    computed: {

        ...mapState('account', {
            shopId: state => state.shop.shopId
        }),
        noManagePerm() {//管理权限
            return !this.$getPermMap('pc.sysset.customer-service.manage')
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
            linkFlg: 0,
            showUnionSelect: false,
            currentModal: {},
            model: {
                "status": "",
                "name": "",
                "title": "",
                "service_name_show": "",
                "service_name": "",
                "qq_show": "",
                "qq_title": "",
                "qq_number": "",
                "wechat_show": "",
                "wechat_title": "",
                "wechat_qrcode": "",
                "service_phone_show": "",
                "service_phone_title": "",
                "service_phone_number": ""
            },
            rules: {
                status: [
                    {
                        required: true,
                        message: '请选择客服状态'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '请输入客服名称'
                    }
                ]
            },
            submitLoading: false,
        };
    },
    methods: {
        changeThumb(path, property) {
            this.$set(this.model, property, path);
        },
        getData() {
            this.$api.homeApi.servicGet({}).then(res => {
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
            this.validate(valid => {
                if (valid) {
                    this.$api.homeApi
                        .servicSet(this.model)
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('操作成功');
                                this.getData();
                            }
                        });
                }
            });
        },
    },
    mounted() {
        this.getData();
    }
};
</script>

<style scoped lang="scss">
.classFortItem {
    height: 32px;
}

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
    color: #576b95;
    margin-left: 10px;
}
</style>
