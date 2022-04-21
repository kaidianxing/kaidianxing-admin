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
        <div class="content">
            <div class="title">
                <kdx-form-title>编辑角色</kdx-form-title>
            </div>
            <Form ref="form" :model="formData" :label-width="120" :rules="rule" @on-validate='onValidate'>
                <FormItem label="角色：" prop="name" v-error-item.name>
                    <Input
                        placeholder="请输入"
                        maxlength="15"
                        show-word-limit
                        class="width-340"
                        v-model="formData.name"
                    />
                </FormItem>
                <FormItem label="状态：">
                    <RadioGroup v-model="formData.status">
                        <Radio label="1">
                            <span>启用</span>
                        </Radio>
                        <Radio label="0">
                            <span>禁用</span>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text>
                        如果禁用，则当前角色的操作员全部会禁止使用
                    </kdx-hint-text>
                </FormItem>
                <FormItem
                    label="可用权限："
                    prop="perms"
                    v-if="formData.perms.length"
                >
                    <div class="all">
                        <Checkbox
                            border
                            :value="allSelectedFlag"
                            :indeterminate="indeterminate"
                            @on-change="changeAllSelectedFlag"
                        >
                            全部选择
                        </Checkbox>
                    </div>
                    <div class="collapse">
                        <ul>
                            <li
                                class="collapse-item"
                                v-for="(item, index) in formData.perms"
                                :key="index"
                            >
                                <div
                                    class="header"
                                >
                                     <span
                                             class="icon iconfont"
                                             :class="{
                                            'icon-full-right': !item.showFlag,
                                            'icon-full-down': item.showFlag,
                                        }"
                                             @click="item.showFlag = !item.showFlag"
                                     ></span>
                                    <Checkbox
                                        v-model="item.checked"
                                        :indeterminate="item.indeterminate"
                                        @on-change="changeChecked(index)"
                                    >
                                        {{ item.title }}
                                    </Checkbox>
                                </div>
                                <div
                                    class="body"
                                    :class="{ show: item.showFlag }"
                                >
                                    <ul>
                                        <li
                                            v-for="(secItem,
                                            secIndex) in item.children"
                                            :key="secIndex"
                                        >
                                            <div class="left">
                                                <Checkbox
                                                    v-model="secItem.checked"
                                                    :indeterminate="
                                                        secItem.indeterminate
                                                    "
                                                    @on-change="
                                                        changeSecChecked(
                                                            index,
                                                            secIndex
                                                        )
                                                    "
                                                >
                                                    {{ secItem.title }}
                                                </Checkbox>
                                            </div>
                                            <div class="right">
                                                <div
                                                    v-for="(thiItem,
                                                    thiIndex) in secItem.perm"
                                                    :key="thiIndex"
                                                >
                                                    <Checkbox
                                                        v-model="
                                                            thiItem.checked
                                                        "
                                                        @on-change="
                                                            changeThiChecked(
                                                                index,
                                                                secIndex,
                                                                thiIndex
                                                            )
                                                        "
                                                    >
                                                        {{ thiItem.title }}
                                                    </Checkbox>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :loading="submitLoading" @click="handleSave">
                保存
            </Button>
        </template>
    </kdx-content-bar>
</template>

<script>
export default {
    data() {
        return {
            id: '', // 角色id
            formData: {
                name: '',
                status: '1',
                perms: [],
            },
            rule: {
                name: [{ required: true, message: '请填写角色名称' }],
            },
            submitLoading: false,
        }
    },
    computed: {
        allSelectedFlag() {
            return !this.formData.perms.some((item) => {
                return item.checked === false || item.indeterminate === true
            })
        },
        indeterminate() {
            const flag1 = this.formData.perms.some((item) => {
                return item.indeterminate === true
            })
            const flag2 = this.formData.perms.some((item) => {
                return item.checked === false
            })
            const flag3 = this.formData.perms.some((item) => {
                return item.checked === true
            })
            return flag1 || (flag2 && flag3)
        },
    },
    created() {
        if (this.$route.query.id) {
            // 编辑角色
            this.id = this.$route.query.id
            this.editRole()
        } else {
            this.getAllPerms()
        }
    },
    methods: {
        // 获取所有权限
        getAllPerms() {
            this.$api.settingApi.getAllPerms({}).then((res) => {
                if (res.error == 0) {
                    res.data.forEach((item) => {
                        item['checked'] = false
                        item['showFlag'] = false
                        item.children.forEach((secItem) => {
                            secItem['checked'] = false
                            secItem.perm.forEach((thiItem) => {
                                thiItem['checked'] = false
                            })
                        })
                    })
                    this.formData.perms = [...res.data]
                }
            })
        },
        // 获取编辑角色信息
        editRole() {
            this.$api.settingApi
                .editRole({
                    id: this.id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        res.data.all_perm.forEach((item) => {
                            // 关闭折叠
                            item['showFlag'] = false
                            if (item.children && item.children.length > 0) {
                                item.children.forEach((secItem) => {
                                    if (
                                        secItem.perm &&
                                        secItem.perm.length > 0
                                    ) {
                                        secItem.perm.forEach((thiItem) => {
                                            if (
                                                res.data.has_perm.includes(
                                                    thiItem.perm_key
                                                )
                                            ) {
                                                thiItem.checked = true
                                            } else {
                                                thiItem.checked = false
                                            }
                                        })
                                        const flag1 = secItem.perm.some(
                                            (thiItem) => {
                                                return thiItem.checked === false
                                            }
                                        )
                                        const flag2 = secItem.perm.some(
                                            (thiItem) => {
                                                return thiItem.checked === true
                                            }
                                        )
                                        secItem.indeterminate = flag1 && flag2
                                        secItem.checked = !flag1
                                    } else {
                                        secItem.checked = false
                                    }
                                })
                                const flag3 = item.children.some((secItem) => {
                                    return secItem.indeterminate === true
                                })
                                const flag4 = item.children.some((secItem) => {
                                    return secItem.checked === false
                                })
                                const flag5 = item.children.some((secItem) => {
                                    return secItem.checked === true
                                })
                                item.indeterminate = flag3 || (flag4 && flag5)
                                item.checked = !flag4
                            } else {
                                item.checked = false
                            }
                        })
                        this.formData = {
                            ...this.formData,
                            name: res.data.name,
                            status: res.data.status + '',
                            perms: [...res.data.all_perm],
                        }
                    }
                })
        },
        // 切换全选
        changeAllSelectedFlag(value) {
            this.formData.perms.forEach((item) => {
                item.checked = value
                item.indeterminate = false
                item.children.forEach((secItem) => {
                    secItem.checked = value
                    secItem.indeterminate = false
                    secItem.perm.forEach((thiItem) => {
                        thiItem.checked = value
                        thiItem.indeterminate = false
                    })
                })
            })
        },
        // 一级切换
        changeChecked(index) {
            this.formData.perms[index].indeterminate = false
            const value = this.formData.perms[index].checked
            // 改变子级状态，和自身一致
            this.formData.perms[index].children.forEach((secItem) => {
                secItem.indeterminate = false
                secItem.checked = value
                secItem.perm.forEach((thiItem) => {
                    thiItem.checked = value
                })
            })
            // 强制更新视图
            this.formData.perms = this.formData.perms.slice(0)
        },
        // 二级切换
        changeSecChecked(index, secIndex) {
            this.formData.perms[index].children[secIndex].indeterminate = false
            const value = this.formData.perms[index].children[secIndex].checked
            // 改变子级状态，和自身一致
            this.formData.perms[index].children[secIndex].perm.forEach(
                (thiItem) => {
                    thiItem.checked = value
                }
            )
            // 一级状态
            this.handleCheckedChange(index)
        },
        // 三级切换
        changeThiChecked(index, secIndex, thiIndex) {
            const value = this.formData.perms[index].children[secIndex].perm[
                thiIndex
            ].checked
            // 有管理必有查看，有查看不一定有管理
            const perm = this.formData.perms[index].children[secIndex].perm
            const perm_key = perm[thiIndex].perm_key
            const perm_key_arr = perm_key.split('.')
            if (!value) {
                if (new Set(perm_key_arr).has('view')) {
                    const should_selected_perm_key = perm_key.replace(
                        /view/g,
                        'manage'
                    )
                    const should_selected_index = perm.findIndex((permItem) => {
                        return permItem.perm_key === should_selected_perm_key
                    })
                    if (should_selected_index !== -1) {
                        this.formData.perms[index].children[secIndex].perm[
                            should_selected_index
                        ].checked = value
                    }
                }
            } else {
                if (new Set(perm_key_arr).has('manage')) {
                    const should_selected_perm_key = perm_key.replace(
                        /manage/g,
                        'view'
                    )
                    const should_selected_index = perm.findIndex((permItem) => {
                        return permItem.perm_key === should_selected_perm_key
                    })
                    if (should_selected_index !== -1) {
                        this.formData.perms[index].children[secIndex].perm[
                            should_selected_index
                        ].checked = value
                    }
                }
            }
            // 二级状态
            const flag1 = this.formData.perms[index].children[
                secIndex
            ].perm.some((thiItem) => {
                return thiItem.checked === false
            })
            const flag2 = this.formData.perms[index].children[
                secIndex
            ].perm.some((thiItem) => {
                return thiItem.checked === true
            })
            this.formData.perms[index].children[secIndex].indeterminate =
                flag1 && flag2
            this.formData.perms[index].children[secIndex].checked = !flag1
            // 一级状态
            this.handleCheckedChange(index)
        },
        // 提取一级状态选择公共部分
        handleCheckedChange(index) {
            // 一级状态
            const flag1 = this.formData.perms[index].children.some(
                (secItem) => {
                    return secItem.indeterminate === true
                }
            )
            const flag2 = this.formData.perms[index].children.some(
                (secItem) => {
                    return secItem.checked === false
                }
            )
            const flag3 = this.formData.perms[index].children.some(
                (secItem) => {
                    return secItem.checked === true
                }
            )
            this.formData.perms[index].indeterminate = flag1 || (flag2 && flag3)
            this.formData.perms[index].checked = !flag2
            // 强制更新视图
            this.formData.perms = this.formData.perms.slice(0)
        },
        onValidate(prop, status){
            this.cacheError={
                ...this.cacheError,
                [prop]: status
            }
        },
        validate() {
            return new Promise(resolve => {
                this.$refs['form'].validate(valid => {
                    resolve(valid);
                    this.$nextTick(() => {
                        if(!valid){
                            for(let k in this.cacheError){
                                if(!this.cacheError[k]){
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
            this.validate().then((valid) => {
                if (valid) {
                    this.submitLoading = true
                    if (this.id) {
                        this.saveRole()
                    } else {
                        this.createRole()
                    }
                }
            })
        },
        // 更改角色保存
        saveRole() {
            // 处理选中权限
            let perms = []
            this.formData.perms.forEach((item) => {
                if (item.children && item.children.length > 0) {
                    item.children.forEach((secItem) => {
                        if (secItem.perm && secItem.perm.length > 0) {
                            secItem.perm.forEach((thiItem) => {
                                if (thiItem.checked) {
                                    perms.push(thiItem.perm_key)
                                }
                            })
                        }
                    })
                }
            })
            let obj = {
                id: this.id,
                name: this.formData.name,
                status: this.formData.status,
                perms: perms.join('|'),
            }
            this.$api.settingApi.saveRole({ ...obj }).then((res) => {
                this.submitLoading = false
                if (res.error == 0) {
                    this.$Message.success('保存成功')
                    this.$router.go(-1)
                }
            })
        },
        // 创建角色
        createRole() {
            // 处理选中权限
            let perms = []
            this.formData.perms.forEach((item) => {
                if (item.children && item.children.length > 0) {
                    item.children.forEach((secItem) => {
                        if (secItem.perm && secItem.perm.length > 0) {
                            secItem.perm.forEach((thiItem) => {
                                if (thiItem.checked) {
                                    perms.push(thiItem.perm_key)
                                }
                            })
                        }
                    })
                }
            })
            let obj = {
                name: this.formData.name,
                status: this.formData.status,
                perms: perms.join('|'),
            }
            this.$api.settingApi.createRole({ ...obj }).then((res) => {
                this.submitLoading = false
                if (res.error == 0) {
                    this.$Message.success('保存成功')
                    this.$router.go(-1)
                }
            })
        },
    },
}
</script>

<style scoped lang="scss">
.content {
    padding: 40px;
    background: #fff;
    min-height: 100%;
    margin: 20px auto 0;
    .all {
        .ivu-checkbox-wrapper {
            line-height: 30px;
        }
    }
}
// 折叠面板
.collapse {
    .collapse-item {
        margin-top: 10px;
        color: #262b30;
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 56px;
            background-color: #f4f6f8;
            border: 1px solid #e9edef;
            font-weight: bold;
            position: relative;
            .icon {
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 18px;
                color: $text-zhushi;
                cursor: pointer;
                &:hover {
                    color: $brand-color;
                }
            }
        }
        .body {
            height: 0;
            overflow: hidden;
            transition: height 0.3s linear;
            &.show {
                height: auto;
            }
            li {
                display: flex;
                line-height: 20px;
                .left {
                    display: flex;
                    align-items: center;
                    width: 240px;
                    padding-left: 56px;
                    box-sizing: border-box;
                    flex-shrink: 0;
                    font-weight: bold;
                    /deep/ .ivu-checkbox-wrapper {
                        margin-right: 0;
                    }
                }
                .right {
                    flex: 1;
                    border-right: 1px solid #e9edef;
                    padding-left: 20px;
                    display: flex;
                    flex-wrap: wrap;
                    padding-bottom: 0;
                    .ivu-checkbox-wrapper {
                        min-width: 200px;
                        margin-bottom: 12px;
                        margin-right: 0;
                        &.ivu-checkbox-wrapper-checked {
                            color: $brand-color;
                        }
                    }
                }
                > div {
                    border-left: 1px solid #e9edef;
                    border-bottom: 1px solid #e9edef;
                    padding-top: 12px;
                    padding-bottom: 12px;
                }
            }
        }
        /deep/.ivu-checkbox {
            margin-right: 6px;
        }
    }
}
</style>
