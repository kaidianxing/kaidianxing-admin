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
            <Form ref="form" :model="formData" :label-width="120" :rules="rules">
                <kdx-form-title>{{ id ? '编辑' : '添加' }}操作员</kdx-form-title>
                <div v-if="!notAutoSet">
                    <FormItem
                        label="操作员用户名："
                        prop="username"
                    >
                        <i-input
                            placeholder="请输入"
                            class="width-430"
                            :disabled="!!id"
                            v-model="formData.username"
                            @on-change="changeUsername"
                        />
                        <kdx-hint-text v-if="!id && formData.uid">
                            检测到该操作员存在其他身份。
                        </kdx-hint-text>
                    </FormItem>
                    <FormItem
                        label="操作员密码："
                        prop="password"
                        v-if="!id && !formData.uid"
                    >
                        <i-input
                            placeholder="请输入"
                            class="width-160"
                            type="password"
                            :disabled="!canModifyPassword"
                            v-model="formData.password"
                        />
                    </FormItem>
                </div>
                <FormItem
                        label="所属角色："
                        prop="role_id"
                >
                    <Select
                            v-model="formData.role_id"
                            class="width-430"
                    >
                        <Option
                                v-for="(item, index) in roleList"
                                :key="index"
                                :value="item.id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                    <Button
                            type="text"
                            class="mL-20"
                            @click="getRoleList"
                    >刷新
                    </Button>
                    <Button
                            type="text"
                            class="mL-20"
                            @click="createUser"
                    >立即创建角色
                    </Button>
                    <kdx-hint-text>
                        如果您选择了角色，则此用户本身继承了此角色的所有权限
                    </kdx-hint-text>
                </FormItem>
                <FormItem label="操作员状态：">
                    <RadioGroup v-model="formData.status">
                        <Radio label="1">
                            <span>启用</span>
                        </Radio>
                        <Radio label="0">
                            <span>禁用</span>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text>
                        用户可以在此角色权限的基础上附加其他权限
                    </kdx-hint-text>
                </FormItem>
                <kdx-form-title>操作员信息</kdx-form-title>
                <FormItem
                        label="操作员姓名："
                        prop="name"
                >
                    <i-input
                            placeholder="请输入"
                            class="width-250"
                            v-model="formData.name"
                    />
                </FormItem>
                <FormItem
                        label="操作员手机号："
                        prop="contact"
                >
                    <i-input
                            placeholder="请输入"
                            class="width-250"
                            v-model="formData.contact"
                    />
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button
                    class="primary-long"
                    :loading="submitLoading"
                    @click="handleSave"
            >
                保存
            </Button>
        </template>

        <vip-selector
                ref="VipSelector"
                :current="user"
                :passId="userId"
                @on-change="memberChange"
                :restParams="restParams"
        ></vip-selector>

    </kdx-content-bar>
</template>

<script>
    import VipSelector from '@/components/selector/VipSelector';

    export default {
        components: {
            VipSelector,
        },
        data() {
            return {
                canModifyPassword: true, // 是否可以修改密码
                notAutoSet:true,//防止谷歌浏览器自动填充账户密码
                id: '', // 操作员id
                formData: {
                    username: '',
                    password: '',
                    role_id: '',
                    uid: '',
                    status: '1',
                    name: '',
                    contact: '',
                    member_id: '',
                },
                restParams: {
                    bind_setter: ''
                },
                placeList: [],
                rules: {
                    username: [{required: true, message: '请填写操作员用户名'}],
                    password: [{required: true, message: '请设置操作员密码'}],
                    role_id: [{required: true, message: '请选择所属角色'}],
                    name: [{required: true, message: '请填写操作员姓名'}],
                    contact: [{required: true, message: '请填写操作员手机号'}],
                    member_id: [{required: true, message: '请选择会员'}],
                },
                user: {},
                roleList: [], // 角色下拉列表
                submitLoading: false,
                userId: '',
            }
        },
        computed: {
            getMember() {
                return this.user.id ? [this.user] : []
            },
        },
        created() {
            this.getRoleList()
            const {id} = this.$route.query;
            if (id) {
                this.id = id
                this.canModifyPassword = false // 不允许修改密码
                this.editOperator()
            }
        },
        mounted(){
          setTimeout(()=>{
              this.notAutoSet = false
              console.log(  this.notAutoSet,'  this.notAutoSet')
          },100)
        },
        methods: {
            // 获取角色列表
            getRoleList() {
                this.$api.settingApi.getRoleList({}).then((res) => {
                    if (res.error == 0) {
                        this.roleList = [...res.list]
                    }
                })
            },
            // 获取编辑操作员信息
            editOperator() {
                this.$api.settingApi
                    .editOperator({
                        id: this.id,
                    })
                    .then((res) => {
                        if (res.error == 0) {
                            // 处理后台数据
                            if (res.member_id == '0') {
                                res.member_id = ''
                            }
                            this.formData = {
                                ...this.formData,
                                id: res.id,
                                uid: res.uid,
                                is_root: res.is_root,
                                username: res.user?.username || '',
                                password: res.user?.password || '',
                                role_id: res.role_id,
                                status: res.status,
                                name: res.name,
                                contact: res.contact,
                                member_id: res.member_id || '',
                            }
                            if (res.member?.id) {
                                this.user = res.member
                                this.userId = res.member.id
                            }
                        }
                    })
            },
            // 用户名改变
            changeUsername(value) {
                if (!this.id) {
                    if (value) {
                        this.checkUser()
                    }
                }
            },
            // 校验用户是否存在
            checkUser() {
                this.$api.settingApi
                    .checkUser({
                        username: this.formData.username,
                    })
                    .then((res) => {
                        if (res.error == 0) {
                            this.formData.uid = res.data?.uid || ''
                        }
                    })
            },
            handleSave() {
                this.$refs['form'].validate().then((valid) => {
                    if (valid) {
                        this.submitLoading = true
                        if (this.id) {
                            this.saveOperator()
                        } else {
                            this.createOperator()
                        }
                    }
                })
            },
            // 创建操作员
            createOperator() {
                let {username, role_id, status, name, contact, member_id} = this.formData
                let obj = {
                    username,
                    role_id,
                    status,
                    name,
                    contact,
                }
                if (this.formData.uid) {
                    obj.uid = this.formData.uid
                } else {
                    obj.password = this.formData.password
                }

                if (this.hasRXYRole) {
                    obj.member_id = member_id;
                }
                this.$api.settingApi.createOperator({...obj}).then((res) => {
                    this.submitLoading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                        setTimeout(() => {
                            this.$router.go(-1)
                        }, 1500)
                    }
                })
            },
            // 更改操作员保存
            saveOperator() {
                let {id, role_id, status, name, contact, is_root, member_id} = this.formData
                let obj = {
                    id,
                    role_id,
                    status,
                    name,
                    contact,
                    is_root,
                }
                if (this.hasRXYRole) {
                    obj.member_id = member_id;
                }
                this.$api.settingApi.saveOperator({...obj}).then((res) => {
                    this.submitLoading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                        setTimeout(() => {
                            this.$router.go(-1)
                        }, 1500)
                    }
                })
            },
            createUser() {
                this.$utils.openNewWindowPage('/setting/systemAuthority/roleManagement')
            },
            addMember() {
                this.$refs.VipSelector.setValue()
            },
            memberChange(e) {
                this.user = e
                this.formData.member_id = e.id
            },
        },
    }
</script>

<style scoped lang="scss">
    .content {
        padding: 40px;
        background-color: #ffffff;
        margin-top: 20px;
        min-height: 100%;

        .btn-wrap {
            .ivu-btn {
                margin-left: 10px;
            }
        }

        .form-item-bg-box {
            padding: 30px 20px;
            margin-top: 10px;
            background-color: $background-color;

            .member-list {
                width: 610px;
            }
        }

        .point-list {
            margin-top: 10px;
            width: 810px;
            padding: 0 20px;
            background: #fff;
            border-radius: 2px;
        }
    }
</style>
