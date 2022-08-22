<template>
    <div class="storage-info">
        <check-label
            v-for="item in option"
            :key="item.key"
            show-icon
            :checked="type === item.key"
            @on-change="setLabelStatus(item.key)"
        >{{ item.name }}
        </check-label>
        <div class="label-box">
            <div class="local" v-if="type === 'local' && mode === 'shop' && oldStorageUrl.length">
                <kdx-hint-alert :show-icon="false">
                    <div class="old-url-box">
                        <div class="label">
                            当前店铺的附件地址：
                        </div>
                        <div class="old-url">
                            <div class="old-url-item" v-for="(item, index) in oldStorageUrl" :key="index">
                                {{item}}；
                            </div>
                        </div>
                    </div>
                </kdx-hint-alert>
            </div>
            <ftp ref="ftp" v-if="type === 'ftp'" :mode="mode" :oldStorageUrl="oldStorageUrl"></ftp>
            <qi-niu ref="qiniu" v-else-if="type === 'qiniu'" :mode="mode" :oldStorageUrl="oldStorageUrl"></qi-niu>
            <ali ref="oss" v-else-if="type === 'oss'" :mode="mode" :oldStorageUrl="oldStorageUrl"></ali>
            <tencent ref="cos" v-else-if="type === 'cos'" :mode="mode" :oldStorageUrl="oldStorageUrl"></tencent>
        </div>
    </div>
</template>

<script>
import CheckLabel from "./components/CheckLabel";
import Ftp from './components/Ftp'
import QiNiu from './components/QiNiu'
import Ali from './components/Ali'
import Tencent from './components/Tencent'

export default {
    name: "index",
    components: {
        CheckLabel,
        Ftp,
        QiNiu,
        Ali,
        Tencent,
    },
    props: {
        type: {
            type: String,
            default: 'local'
        },
        mode: { // 存储方式
            type: String,
            default: ''
        },
        oldStorageUrl: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            data: {
                ftp: {},
                qiniu: {},
                oss: {},
                cos: {}
            },
            option: [
                {
                    key: 'local',
                    name: '本地存储',
                },
                {
                    key: 'ftp',
                    name: 'FTP',
                },
                {
                    key: 'qiniu',
                    name: '七牛云存储',
                },
                {
                    key: 'oss',
                    name: '阿里云OSS',
                },
                {
                    key: 'cos',
                    name: '腾讯云COS',
                },
            ],
        }
    },
    watch: {
        type: {
            handler() {
                this.setData();
            },
            immediate: true
        }
    },
    methods: {
        setLabelStatus(type) {
            this.$emit('update:type', type)
        },
        resetData(data) {
            this.data = data;
            this.setData();
        },
        validate() {
            return this.$refs[this.type].validate();
        },
        getModel() {
            return this.$refs[this.type].getModel();
        },
        setData() {
            if (this.type !== 'local') {
                this.$nextTick(() => {
                    this.$refs[this.type].resetModel(this.data[this.type]);
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.storage-info {
    margin-top: 20px;
    .check-label {
        /deep/ .label-item {
            width: 100px;
        }
    }
    .old-url-box {
        font-size: 12px;
        line-height: 20px;
        color: $text-second;
        display: flex;
        .old-label {
            flex-shrink: 0;
        }
        .old-url {
            flex: 1;
            display: flex;
        }
    }
}
</style>