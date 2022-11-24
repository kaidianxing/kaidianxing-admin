<template>
    <div class="video video-selector-modal">
        <div class="image-selector-modal" v-loading="loading">
            <div class="video-selector-content">
                <div class="video-header">
                    <div class="add-video">
                        <Button type="primary" @click="selectFile"
                        >+添加视频
                        </Button>
                        <input
                            ref="upload_input"
                            type="file"
                            :accept="limitType"
                            multiple
                            @change="changeFile"
                            style="display: none"
                        />
                        <span class="text">{{hintMaxText}}</span>
                        <kdx-hint-tooltip>
                            {{hintTooltipText}}
                        </kdx-hint-tooltip>
                    </div>
                    <div class="search">
                        <DatePicker
                            v-model="search.createTime"
                            type="datetimerange"
                            confirm
                            format="yyyy-MM-dd HH:mm"
                            placeholder="请选择上传时间"
                            @on-ok="handleSearch"
                            class="width-340"
                        ></DatePicker>
                    </div>
                </div>
                <!-- 批量操作 -->
                <div class="multiple">
                    <div class="checkbox flex" v-show="video.list.length">
                        <Checkbox
                            border
                            class="marginR-10"
                            :value="multipleCheck"
                            :indeterminate="indeterminate"
                            @on-change="changeAllSelected"
                        >
                            当页全选
                        </Checkbox>
                        <span style="color: #B8B9BD">|</span>
                        <div class="marginL-10">已选{{ selectNumber }}项</div>
                        <Button class="marginL-10" :disabled="!selectNumber" @click="deleteVideo('multiple')">彻底删除</Button>
                    </div>
                </div>
                <div class="video-list">
                    <ul v-if="video.list.length > 0">
                        <li
                            v-for="(item, index) in video.list"
                            :key="item.id"
                            @click.stop="checkVideo(index, !item.checked)"
                        >
                            <div
                                class="video-content"
                                :class="{ 'video-content-checked': item.checked }"
                            >
                                <video :src="$media(item.path, 'video')" :controls="false"></video>
                                <div class="video-time" v-if="item.time">
                                    {{ item.time }}
                                </div>
                                <!--蒙层-->
                                <div
                                    class="video-select-layer"
                                    v-show="item.checked"
                                >
                                    <kdx-svg-icon type="icon-chenggong-shixin" class="checked"></kdx-svg-icon>
                                </div>
                            </div>
                            <p class="text">{{ item.name }}</p>
                            <div class="second flex flex-between">
                                <div class="time">{{ item.created_at| formadateTime }}</div>
                                <div class="action flex" :class="{check: item.checked}">
                                    <Button
                                        type="text"
                                        @click.stop="deleteVideo('single',item)"
                                    >删除</Button>
                                    <span class="line">|</span>
                                    <span class="more" @click.stop="clickMore(item)" >
                                            更多
                                        </span>
                                    <div class="tips" v-if="item.showMore" @mouseleave="mouseleave(item)">
                                        <div class="arrow"></div>
                                        <div class="tool flex-column">
                                            <div class="text" @click.stop="seeVideo(item)">查看</div>
                                            <div class="text" @click.stop="resetName(item)">重命名</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </li>
                    </ul>
                    <div class="video-list-none" v-else>
                        <div>
                            <div class="icon">
                                <span class="iconfont icon-fenxiao-leijiyongjin-"></span>
                            </div>
                            <div class="btn">
                                暂无数据，
                                <Button type="text"  @click="selectFile">去添加</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="video-page">
                    <kdx-page-component
                        ref="page"
                        :total="total"
                        :pageSize="page.pageSize"
                        :pageSizeOption="pageSizeOption"
                        @on-change="handlePageChange"
                    ></kdx-page-component>
                </div>
            </div>
        </div>
        <kdx-modal-frame v-model="editName" title="重命名" :width="610" @on-cancel="nameCancel" @on-ok="nameOk">
            <div class="group-modal">
                <Form ref="name" :label-width="120" :model="groupModel" :rules="groupRules" @submit.native.prevent>
                    <FormItem label="视频名称：" prop="name">
                        <Input
                            v-model="groupModel.name"
                            type="text"
                            maxlength="20"
                            show-word-limit
                            class="width-430 limit-input"
                            placeholder="请输入视频名称"
                        />
                    </FormItem>
                </Form>
            </div>
        </kdx-modal-frame>
    </div>
</template>

<script>
import {uploadFile} from '@/api/config/fileRequest';
import {accessoryApi} from '@/api/accessory';
import { formatDate } from "@/assets/helpers";

export default {
    name: 'videos',
    props: {
        // 当前选中值
        current: {
            type: [String, Object]
        },
        weixinControl:{
            type: Object,
            default: ()=>({}),
        },
    },
    data() {
        return {
            value: true,
            total: 0,
            page: {
                pageSize: 50,
                pageNumber: 1 // 页码
            },
            selectNumber: 0,
            pageSizeOption: [20,50,100],
            multipleCheck: false,
            indeterminate: false,
            video: {
                select: {}, //选中值
                list: [],
                address: '', // 视频提取网络地址
                url: ''
            },
            networkAddress: '', // 腾讯视频解析后地址
            search: {
                createTime: []
            },
            loading: false,
            selectRows: [],
            tab: {
                name: 'local'
            },
            preContent: { // 视频提取出的参数
                backgroundColor: '#E9EDEF',
                src: require('@/assets/image/video/pre.png'),
                text: '视频预览区'
            },
            controls: false, // 是否显示播放控件,
            editName: false, //重命名弹窗
            nameId: '', //重命名图片id
            groupModel: {
                name: '', //重命名
            },
            groupRules: {
                name: [
                    { required: true, message: '视频名称必填' },
                ],
            },
        };
    },
    computed: {
        maxSize() {
            return this.toFixed(this.$store.state?.config?.uploadSetting?.video?.max_size) || 2048;
        },
        limitType() {
            let type = (this.$store.state?.config?.uploadSetting?.video?.extensions || []).map(item => {
                return `video/${item}`;
            }).join(',');
            return type || 'image/png';
        },
        hintMaxText() {
            let size = this.toFixed(this.maxSize / 1024);
            return `大小不要超过${size}M`;
        },
        hintTooltipText() {
            let type = (this.$store.state?.config?.uploadSetting?.video?.extensions || []).join(',');
            return `${this.hintMaxText},支持视频类型${type}`;
        },
        storageContent() {
            let shopStorage = this.$store.state.config.shopStorage;
            let type = {
                local: '本地存储',
                ftp: 'ftp存储',
                qiniu: '七牛云存储',
                oss: '阿里云OSS',
                cos: '腾讯云COS'
            }
            if (10 === +shopStorage.storage_model) {
                return `（当前托管方式：托管存储${type[shopStorage.type]}）`
            } else {
                return `（当前托管方式：独立存储${type[shopStorage.type]}）`
            }
        }
    },
    created() {
        this.$store.dispatch('config/getUploadSetting');
        this.selectRow = this.current || '';
        this.resetPage();
        this.networkAddress = ''
        this.preContent= {
            backgroundColor: '#E9EDEF',
            src: require('@/assets/image/video/pre.png'),
            text: '视频预览区'
        }
    },
    methods: {
        /* 保留两位小数
         * num 传入数值
         * return 返回两位小数值
         */
        toFixed(num) {
            let times = Math.pow(10,2)
            let des = num * times + 0.5
            des = parseInt(des,10) / times;
            return des + '';
        },
        // 获取选中数量
        getSelectNumber() {
            if (this.selectRows?.length) {
                this.selectNumber = this.selectRows.length;
            } else {
                this.selectNumber = 0;
            }
        },
        // 页码改变
        handlePageChange(page) {
            this.page = page;
            this.getList();
            try {
                this.$refs.scrollBox.scrollTop=0
            }catch (e) {
                console.log(e)
            }
        },
        resetPage() {
            this.page = {
                pageSize: 50,
                pageNumber: 1
            };
            this.getList();
        },
        // 搜索
        handleSearch() {
            this.resetPage();
            this.getList();
        },
        getList() {
            this.loading = true;
            let created_at = this.search.createTime;
            if (created_at[0]) {
                created_at[0] = this.$utils.formatDate(new Date(created_at[0]), 'yyyy-MM-dd hh:mm:ss');
                created_at[1] = this.$utils.formatDate(new Date(created_at[1]), 'yyyy-MM-dd hh:mm:ss');
            } else {
                created_at = '';
            }
            let params = Object.assign({
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                type: '20',
                created_at
            });
            this.$api.accessoryApi.getAccessoryList(params).then(res => {
                this.loading = false;
                if (res.error === 0) {
                    res.list?.length>0 ? res.list.forEach(item=>{item.showMore = false}) : []
                    this.video.list = res.list || [];
                    this.total = res.total;
                    this.defaultChecked();
                }
            });
        },
        // 上传视频选择
        selectFile() {
            this.$refs['upload_input'].click();
        },
        // 视频选择
        changeFile(e) {
            if (e) {
                this.loading = true;
                let fileArr = e.target.files, paramsArr = [];
                let group_id = this.isActive === 'all' ? '' : this.isActive;
                for (let file of fileArr) {
                    if (file.size > this.maxSize * 1024) {
                        this.$Message.error(`视频应选择小于${this.toFixed(this.maxSize / 1024)}M的`);
                        break;
                    }
                    let type = (this.$store.state?.config?.uploadSetting?.video?.extensions || []).join('|');
                    let reg2 =eval("/^(\\s|\\S)+("+ type +")+$/");
                    if (!reg2.test(file.name.toLowerCase())) {
                        this.$Message.error('请选择正确的格式的视频');
                        break;
                    }
                    let params = new FormData(); // 创建form对象
                    params.append('file', file); // 通过append向form对象添加数据

                    if(this.weixinControl.actionApi){
                        // todo video_title video_description 怎么来的
                        params.append("video_title", "todo");
                        params.append("video_description", "todo");
                        params.append('type', this.weixinControl.actionApi.getTypeNameByMsgType());
                    }else{
                        params.append('type', '20');
                    }
                    params.append('group_id', group_id);
                    paramsArr.push(params);
                }
                if (paramsArr.length < fileArr.length) {
                    this.$refs['upload_input'].value = '';
                    this.loading = false;
                    return;
                }
                let uploadFun = paramsArr.map(params => {
                    if(this.weixinControl.actionApi){
                        return uploadFile(this.weixinControl.actionApi.uploadFile(), params);
                    }else{
                        return uploadFile(accessoryApi.uploadFile.api, params);
                    }
                });
                Promise.all(uploadFun).then(res => {
                    this.loading = false;
                    console.log(res, 99)
                    if (res.length === paramsArr.length) {
                        let success = true
                        res.forEach((item) => {
                            if(item.error != 0) {
                                success = false
                                this.$Message.error(item.message);
                            }
                        })
                        success && this.$Message.success('视频上传成功');
                        this.resetPage();
                        this.$refs['upload_input'].value = '';
                    }
                }).catch(err => {
                    console.log('err', err);
                });
            }
        },
        // 选中视频
        checkVideo(index, isChecked = false) {
            this.$set(this.video.list[index], 'checked', isChecked);
            // 多选
            if (this.selectRows.length === 0) {
                this.selectRows.push(this.video.list[index]?.id);
            } else {
                if (isChecked) {
                    this.selectRows.push(this.video.list[index]?.id);
                } else {
                    this.selectRows = this.selectRows.filter(item=> item!==this.video.list[index]?.id)
                }
            }
            this.getSelectNumber();
            this.handleCheckAll();
        },
        // 默认选中
        defaultChecked() {
            this.selectRows.forEach((select, index) => {
                for (let item of this.video.list) {
                    if ((!item.checked && select === item.id)) {
                        item.checked = true;
                        item.index = index;
                        break;
                    }
                }
            });
            this.getSelectNumber();
            this.handleCheckAll();
        },
        // 删除视频
        deleteVideo(type,row) {
            let id;
            if(type==='single') {
                id = row.id
            }else {
                id = this.selectRows
            }
            this.$Modal.confirm({
                title: '提示',
                content: '是否要删除该视频？',
                onOk: () => {
                    this.$api.accessoryApi.deleteFile({id}).then(res => {
                        if (res.error === 0) {
                            this.$Message.success('视频删除成功');
                            this.resetPage();
                        }
                    });
                }
            })
        },
        // 图片重命名
        resetName(item) {
            this.editName = true;
            this.nameId = item.id;
            item.showMore = !item.showMore;
        },
        nameCancel() {
            this.groupModel.name = '';
            this.editName = false;
            this.$refs.name.resetFields()
        },
        nameOk() {
            return new Promise(() => {
                this.$refs['name'].validate(valid => {
                    if (valid) {
                        this.$api.accessoryApi.changeImageName({id: this.nameId, name: this.groupModel.name}).then(res=> {
                            if(res.error === 0) {
                                this.$Message.success('操作成功');
                                this.nameCancel();
                                this.getList();
                            }
                        })
                    }
                })
            })
        },
        seeVideo(item) {
            item.showMore = !item.showMore;
            window.open(this.$media(item.path, 'video'),'_blank')
        },
        clickMore(item) {
            item.showMore = !item.showMore;
        },
        mouseleave(item) {
            item.showMore = !item.showMore;
        },

        // 全选
        changeAllSelected(value) {
            this.multipleCheck = value;
            this.indeterminate = false;
            this.video.list.forEach((item) => {
                item.checked = value;
                if (value) {
                    this.selectRows.push(item.id);
                } else {
                    this.selectRows =this.selectRows.filter(child=> child!==item.id)
                }
            })
            this.getSelectNumber()
        },
        handleCheckAll() {
            let checkLen = this.video.list.filter(item=>item.checked==true).length;
            if(this.selectNumber>0) {
                if(this.page.pageSize == checkLen || this.video.list.length == checkLen) {
                    this.multipleCheck = true;
                    this.indeterminate = false;
                }else if(checkLen==0) {
                    this.multipleCheck = false;
                    this.indeterminate = false;
                }else {
                    this.multipleCheck = false;
                    this.indeterminate = true;
                }
            }else {
                this.multipleCheck = false;
                this.indeterminate = false;
            }
        },
    },
    filters: {
        formadateTime(val) {
            return formatDate(new Date(val), "yyyy-MM-dd")
        }
    }
};
</script>

<style scoped lang="scss">
.video {
    .multiple {
        padding: 16px 0;
        border-bottom: 1px solid #e9edef;
    }
    .checkbox {
        line-height: 32px;
        /deep/ .ivu-checkbox-border {
            padding-left: 0;
            border: none;
            margin: 0;
            line-height: 32px;
        }
    }
}
.image-selector-modal {
    /deep/ .ivu-tabs {
        // tabs样式修改
        .ivu-tabs-bar {
            margin-bottom: 0;
            .ivu-tabs-nav-scroll {
                display: flex;
                justify-content: center;

                .ivu-tabs-nav {
                    .ivu-tabs-tab {
                        padding: 12px 50px;
                        @include font-18-25-bold;
                        color: $text-first;
                    }

                    .ivu-tabs-tab-active {
                        color: $brand-color;
                    }
                }
            }
        }
    }
}
.video-selector-modal {
    .video-selector-content {
        padding: 20px;
        > .video-header {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            padding-bottom: 14px;
            > .add-video {
                > button {
                    margin-right: 10px;
                }
            }
            > .search {
                > button {
                    margin-left: -1px;
                }
            }
        }
        > .video-list {
            padding-top: 20px;
            padding-bottom: 10px;
            overflow-y: auto;
            height: calc(100vh - 370px);
            > ul {
                display: flex;
                flex-wrap: wrap;
                > li {
                    position: relative;
                    margin: 0 10px 40px 0;
                    width: 180px;
                    &:hover {
                        .second .action {
                            display: block;
                        }
                    }
                    > .video-content {
                        position: relative;
                        width: 180px;
                        height: 100px;
                        border: 1px solid $border-color;
                        border-radius: 2px;
                        cursor: pointer;
                        &:hover {
                            > .close {
                                display: block;
                                color: $text-zhushi;
                            }
                        }
                        > video {
                            width: 100%;
                            height: 100%;
                        }
                        > .video-time {
                            position: absolute;
                            bottom: 5px;
                            right: 5px;
                            @include font-12-16;
                            color: #ffffff;
                            background-color: rgba(0, 0, 0, 0.54);
                            border-radius: 11px;
                            padding: 1px 5px;
                        }
                        > .close {
                            position: absolute;
                            top: -10px;
                            right: -10px;
                            font-size: 20px;
                            display: none;
                            color: $text-zhushi;
                            &:hover {
                                color: $text-second;
                            }
                        }
                        > .video-select-layer {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            background-color: rgba(0, 0, 0, 0.7);
                            display: flex;
                            border-radius: 2px;
                            > .checked {
                                display: inline-block;
                                margin: auto;
                                color: $brand-color;
                                font-size: 30px;
                            }
                        }
                    }
                    // 选中
                    > .video-content-checked {
                        > .video-time {
                            display: none;
                        }
                        > .close {
                            display: none;
                        }
                        &:hover {
                            > .close {
                                display: none;
                            }
                        }
                    }
                    > .text {
                        overflow: hidden; /*超出部分隐藏*/
                        text-overflow: ellipsis; /* 超出部分显示省略号 */
                        word-break: keep-all;
                        white-space: nowrap;
                        @include font-12-16;
                        color: $text-first;
                        padding-top: 10px;
                        padding-bottom: 5px;
                    }
                    >.second {
                        font-size: 12px;
                        font-weight: 400;
                        line-height: 16px;
                        margin-top: 4px;
                        .time {
                            color: #939799;
                        }
                        .action {
                            height: 16px;
                            display: none;
                            color: $brand-color;
                            position: relative;
                            &.check{
                                display: block;
                            }
                            /deep/ .ivu-btn {
                                @include font-12-16;
                            }
                            .line {
                                margin: 0 5px;
                                color: $text-zhushi;
                            }
                            .more {
                                position: relative;
                                display: inline-block;
                                cursor: pointer;
                            }
                            .tips {
                                position: absolute;
                                top: -70px;
                                left: 50%;
                                margin-left: -18px;
                                will-change: top, left;
                                z-index: 100;
                                background: #fff;
                                color: #636669;
                                width: 76px;
                                text-align: center;
                                border-radius: 2px;
                                padding: 10px 0;
                                box-shadow: 0px 2px 10px rgba(27, 67, 169, 0.1);
                                .arrow {
                                    position: absolute;
                                    top: 62px;
                                    height: 7px;
                                    &:after {
                                        content: " ";
                                        bottom: 1px;
                                        margin-left: 30px;
                                        display: block;
                                        width: 0;
                                        height: 0;
                                        box-sizing: border-box;
                                        position: absolute;
                                        border-color: transparent;
                                        border-style: solid;
                                        border-width: 7px;
                                        border-bottom-width: 0;
                                        border-top-width: 7px;
                                        border-top-color: #ffffff;
                                    }
                                }
                                .text {
                                    @include font-12-16;
                                    font-weight: 400;
                                    cursor: pointer;
                                    margin-top: 10px;
                                    &:first-child {
                                        margin-top: 0;
                                        color: $brand-color;
                                    }
                                    &:hover {
                                        color: $brand-color;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // 没有数据时显示
            .video-list-none {
                width: 100%;
                height: 100%;
                margin: auto;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                div{
                    > .icon {
                        .iconfont {
                            font-size: 80px;
                        }
                    }
                    > .btn {
                        color: $text-second;
                        @include font-14-20;
                    }
                }
            }
        }
        > .video-page {
            text-align: center;
            padding-top: 30px;
        }
    }

    .ivu-modal-body {
        padding: 0;
        > .content {
            padding: 0;
        }
    }
}

video:focus{
    outline: 0;      //去掉选中蓝框
}
video {
    object-fit:cover;
}

.group-modal {
    padding-top: 30px;
}
</style>

<style lang="scss">
.video-selector-modal {
    .ivu-modal-body {
        padding: 0;
        > .content {
            padding: 0;
        }
    }
}
</style>
