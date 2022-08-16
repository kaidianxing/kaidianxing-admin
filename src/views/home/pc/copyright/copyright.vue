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
                    <!-- 底部版权设置 -->
                    <kdx-form-title>底部版权设置</kdx-form-title>
                    <FormItem label="自定义导航1：" prop="navigation_1" v-error-item.name>
                        <Input :disabled='noManagePerm' placeholder="请输入"
                               class="width-300"
                               v-model="model.navigation_1"></Input>
                    </FormItem>
                    <FormItem label=" 导航跳转链接：">
                        <Input
                            :disabled='noManagePerm'
                            class="width-300"
                            v-model="model.navigation_1_url"
                            placeholder="请填写跳转pc页面的访问路径"
                        />
<!--                        <span-->
<!--                            :data-val="model.navigation_1_url"-->
<!--                            class="ck"-->
<!--                            @click="showSelect"-->
<!--                        >选择链接</span-->
<!--                        >-->
                    </FormItem>
                    <br>
                    <FormItem label="自定义导航2：" prop="navigation_2">
                        <Input :disabled='noManagePerm' placeholder="请输入"
                               class="width-300"
                               v-model="model.navigation_2"></Input>
                    </FormItem>
                    <FormItem label=" 导航跳转链接：">
                        <Input
                            :disabled='noManagePerm'
                            class="width-300"
                            v-model="model.navigation_2_url"
                            placeholder="请填写跳转pc页面的访问路径"
                        />
<!--                        <span-->
<!--                            :data-val="model.navigation_2_url"-->
<!--                            class="ck"-->
<!--                            @click="showSelect"-->
<!--                        >选择链接</span-->
<!--                        >-->
                    </FormItem>

                    <FormItem label="底部版权：" prop="mall_status">
                        <RadioGroup v-model="model.copyright_status">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>开启</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="0">
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="pc端版权信息：" prop="copyright_info">
                        <editor v-model="model.copyright_info" :height="300"></editor>
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
import Editor from '@/components/Editor';


export default {
    name: 'copyright',
    components: {
        Editor
    },
    computed: {

        ...mapState('account', {
            shopId: state => state.shop.shopId
        }),
        noManagePerm() {//管理权限
            return !this.$getPermMap('pc.sysset.copyright.manage')
        },
        isRoot() { // 是否是管理员
            return this.$store.state.config?.user?.is_root == 1
        },
    },
    data() {
        return {
            showUnionSelect: false,
            model: {
                "navigation_1": "",
                "navigation_1_url": "",
                "navigation_2": "",
                "navigation_2_url": "",
                "copyright_status": "",
                "copyright_info": ""
            },
            rules: {
                navigation_1: [
                    {
                        required: true,
                        message: '请输入导航'
                    }
                ],
                navigation_2: [
                    {
                        required: true,
                        message: '请输入导航'
                    }
                ]
            },
        };
    },
    methods: {
        // contentInput() {
        //     if (this.model.copyright_info.trim() === '') {
        //         this.model.copyright_info = 'pc端版权信息';
        //     }
        // },
        showSelect() {
            this.showUnionSelect = !this.showUnionSelect
        },
        getData() {
            this.$api.homeApi.copyrightGet({}).then(res => {
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
                    this.$api.homeApi
                        .copyrightSet(this.model)
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
    color: #ffffff;
    margin-left: 0px;
    padding: 5px 10px;
    background-color: var(--theme-navBackground);
}
</style>
