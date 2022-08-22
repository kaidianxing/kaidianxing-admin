<template>
    <kdx-content-bar :loading="loading">
        <div class="remote-storage">
            <div class="header">
                <kdx-form-title :has-margin="false">
                    全局配置
                    <template #text>默认所有店铺使用此远程存储</template>
                </kdx-form-title>
                <kdx-hint-alert :show-icon="false">
                    <div class="alert-box">
                        <div class="left title">
                            温馨提示：
                        </div>
                        <div class="right">
                            <p class="title success-title">推荐使用远程存储</p>
                            <p>
                                对接FTP和七牛存等任意远程存储器，将降低对服务器加载图片的压力，提升商城的运行加载速度
                            </p>
                        </div>
                    </div>
                </kdx-hint-alert>
            </div>
                        <storage-info ref="storage_info" :type.sync="type"></storage-info>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
import StorageInfo from "./storageInfo/index";
export default {
    name: 'index',
    components: {
        StorageInfo,
    },
    data() {
        return {
            type: 'local',
            loading: false,
        }
    },
    created() {
        this.getData()
    },
    methods: {
        setLabelStatus(type) {
            this.type = type
        },
        getData() {
            this.loading = true
            this.$api.systemApi.getStorage().then((res) => {
                this.loading = false
                if (res.error === 0) {
                    let {type, ...other} = res.settings
                    this.type = type
                    this.$refs['storage_info'].resetData(other);
                }
            })
        },
        handleSave() {
            if (this.type === 'local') {
                this.$api.systemApi.setStorage({type: this.type}).then((res) => {
                    if (res.error === 0) {
                        this.$Message.success('本地存储保存成功')
                        this.getData()
                    }
                })
            } else {
                this.$refs['storage_info'].validate().then((valid) => {
                    if (valid) {
                        let model = {
                            [this.type]: this.$refs['storage_info'].getModel(),
                            type: this.type,
                        }
                        this.$api.systemApi.setStorage(model).then((res) => {
                            if (res.error === 0) {
                                this.$Message.success('本地存储保存成功')
                                this.getData()
                            }
                        })
                    }
                })
            }
        },
    },
}
</script>

<style scoped lang="scss">
.remote-storage {
    padding: 40px;
    min-height: 100%;
    margin-top: 20px;
    background: #FFFFFF;
    .header {
        margin-bottom: 30px;

        .hint-alert-component {
            margin-top: 10px;

            .alert-box {
                display: flex;
                flex-wrap: nowrap;

                .title {
                    @include font-12-24;
                }

                .success-title {
                    color: $success-color;
                }
            }
        }
    }

    .check-label {
        /deep/ .label-item {
            width: 100px;
        }
    }

    .label-box {
        padding: 0 20px;
    }
}
</style>
