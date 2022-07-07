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
    <kdx-modal-frame
            v-model="value"
            title="添加视频"
            :width="1000"
            :loading="loading"
            @on-cancel="handleCancel"
            @on-ok="handleOk"
            class-name="video-selector-modal"
    >
        <template #header>
            <div class="video-selector-header">
                <div class="title">
                    添加视频
                </div>
                <div class="storage-content" v-if="storageContent">
                    {{storageContent}}
                </div>
            </div>
        </template>
        <div class="image-selector-modal">
            <Tabs v-model="tab.name">
                <TabPane label="本地视频" name="local" tab="video">
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
                                        <Icon
                                                type="ios-close-circle"
                                                class="close"
                                                @click.stop="deleteVideo(item)"
                                        />
                                        <!--蒙层-->
                                        <div
                                                class="video-select-layer"
                                                v-show="item.checked"
                                        >
                                            <kdx-svg-icon type="icon-chenggong-shixin" class="checked"></kdx-svg-icon>
                                        </div>
                                    </div>
                                    <p class="text">{{ item.name }}</p>
                                    <p class="time">
                                        {{ item.created_at }}
                                    </p>
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
                                    @on-change="handlePageChange"
                            ></kdx-page-component>
                        </div>
                    </div>
                </TabPane>
                <TabPane v-if="!weixinControl.isHideMenu" label="网络提取" name="network" tab="video">
                    <div class="video-selector-network">
                        <Form inline @submit.native.prevent>
                            <FormItem>
                                <Input
                                        type="text"
                                        v-model="video.address"
                                        enter-button="提取视频"
                                        placeholder="请输入网络视频地址"
                                        class="width-800"
                                        search
                                        @on-search="videoOk"
                                        @on-click="clearAddress"
                                        icon="ivu-icon ivu-icon-ios-close"
                                />
                                <kdx-hint-text>目前视频来源仅支持腾讯视频, 添加完成后默认不自动播放</kdx-hint-text>
                            </FormItem>
                        </Form>
                        <div class="video-network">
                            <div class="preVideo" v-if="!networkAddress" :style="{backgroundColor: preContent.backgroundColor}">
                                <img :src="preContent.src" alt="">
                                <div>{{preContent.text}}</div>
                            </div>
                            <div class="playVideo" v-else @click="playVideo">
                                <img src="../../assets/image/video/play.png" alt="" v-show="!controls">
                                <video :src="networkAddress" :controls="controls" class="video-js"></video>
                            </div>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    </kdx-modal-frame>
</template>

<script>
    import {uploadFile} from '@/api/config/fileRequest';
    import {accessoryApi} from '@/api/accessory';

    export default {
        name: 'VideoSelector',
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
                value: false,
                total: 0,
                page: {
                    pageSize: 10,
                    pageNumber: 1 // 页码
                },
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
                selectRow: '',
                tab: {
                    name: 'local'
                },
                preContent: { // 视频提取出的参数
                    backgroundColor: '#E9EDEF',
                    src: require('@/assets/image/video/pre.png'),
                    text: '视频预览区'
                },
                controls: false, // 是否显示播放控件,
                okSure: false, // 是否可以保存腾讯视频
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
            setValue(value) {
                if (value) {
                    this.value = value;
                } else {
                    this.value = !this.value;
                }
                if (this.value) {
                    this.selectRow = this.current || '';
                    this.resetPage();
                    this.networkAddress = ''
                    this.preContent= {
                        backgroundColor: '#E9EDEF',
                            src: require('@/assets/image/video/pre.png'),
                            text: '视频预览区'
                    }
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
                    pageSize: 10,
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

                if(!this.weixinControl.actionApi){
                this.$api.accessoryApi.getAccessoryList(params).then(res => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.video.list = res.list || [];
                        this.total = res.total;
                        this.defaultChecked();
                    }
                });
                }else{
                    // 处理参数为微信专用
                    // console.log("not result", params);
                    this.weixinControl.actionApi.getList()({...params,
                    type: this.weixinControl.actionApi.getTypeNameByMsgType()})
                    .then(r => {
                        this.loading = false;
                        if(0 == r.error){
                            console.log("res", r);
                            // 通过现在的数据格式对接原有的数据格式
                            let rs = [];
                            let tmp = {
                                checked: false,
                                created_at:"",
                                ext: "",
                                extend: {
                                    height: "",
                                    width: "",
                                },
                                id: "",
                                name: "",
                                path: "",
                                size: "",
                            };

                            r.list.forEach(item => {
                                tmp = {...tmp,...item};
                                tmp.created_at = item.created_at;
                                tmp.id = item.media_id;
                                tmp.name = item.title;
                                tmp.path = item.url;

                                rs.push(tmp);
                            });


                            this.video.list = rs;
                            this.total = r.total;
                            this.defaultChecked();
                        }
                    })
                }
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
                        if (res.length === paramsArr.length) {
                            this.$Message.success('视频上传成功');
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
                if (isChecked) {
                    this.video.list.forEach((item, i) => {
                        this.$set(this.video.list[i], 'checked', false);
                    });
                    this.$set(this.video.list[index], 'checked', isChecked);
                    this.selectRow = this.video.list[index].path;
                    this.ma = this.video.list[index]?.id
                } else {
                    this.$set(this.video.list[index], 'checked', isChecked);
                    this.selectRow = '';
                }
            },
            // 默认选中
            defaultChecked() {
                this.video.list.forEach((item, index) => {
                    if (item.path === this.selectRow) {
                        this.$set(this.video.list[index], 'checked', true);
                    } else {
                        this.$set(this.video.list[index], 'checked', false);
                    }
                });
            },
            handleCancel() {
                this.setValue();
                this.video.address = ''
            },
            handleOk() {
                if (this.tab.name === 'local') {
                    let itemLocal = {
                        path: this.selectRow,
                        type: this.tab.name,
                        media_id: this.ma,
                    }
                    this.$emit('on-change', itemLocal);
                    this.setValue();
                } else {
                    this.videoOk()
                    if(this.okSure) {
                        this.okSure = false
                        this.setValue();
                        setTimeout(() => {
                            let item = {
                                path: this.networkAddress,
                                type: this.tab.name,
                                video_url: this.video.url
                            }
                            this.$emit('on-change',item);
                        },300)
                    }else {
                        this.setValue()
                    }
                    this.video.address = '';
                }
            },
            // 提取视频
            videoOk() {
                if (this.tab.name === 'network') {
                    if (!this.video.address && !this.networkAddress) {
                        this.$Message.error('请输入网络视频地址');
                        return;
                    }
                    let url = this.video.address;
                    this.$api.accessoryApi.getVideoNetwork({ url})
                        .then(res => {
                            if(res.error===0) {
                                this.networkAddress = ''
                                this.video.url = url
                                this.networkAddress = res.data
                                this.okSure = true
                            }else {
                                this.networkAddress = ''
                                this.preContent = {
                                    backgroundColor: '#262B30',
                                    src: require('@/assets/image/video/error.png'),
                                    text: '视频提取失败'
                                }
                                this.okSure = false
                            }
                        });
                }
            },
            // 播放提取视频
            playVideo() {
                this.controls = true
            },
            // 删除视频
            deleteVideo(row) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否要删除该视频？',
                    onOk: () => {
                        (!this.weixinControl.actionApi ?this.$api.accessoryApi.deleteFile({id: row.id}):this.weixinControl.actionApi.deleteFile()({
                    media_id:row.id
                })).then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('视频删除成功');
                                    this.resetPage();
                                }
                            });
                    }
                })
            },
            // 清楚提取视频
            clearAddress() {
                this.video.address = ''
            },
        }
    };
</script>

<style scoped lang="scss">
    .image-selector-modal {
        height: 660px;
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
    // 提取腾讯视频
    .video-selector-network {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
        justify-content: center;
        margin-top: 40px;
        align-items: center;
        /deep/ .ivu-input-icon {
            margin-right: 92px;
            cursor: pointer;
        }
        .width-800 {
            width: 800px;
        }
        .video-network {
            width: 800px;
            height: 450px;
            .preVideo {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                img {
                    width: 40px;
                    height: 40px;
                }
                div {
                    margin-top: 10px;
                    font-size: 12px;
                    line-height: 16px;
                    color: #939799;
                }
            }
            .playVideo {
                height: 100%;
                width: 100%;
                position: relative;
                img {
                    width: 50px;
                    height: 50px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-left: -25px;
                    margin-top: -25px;
                }
            }
            video {
                width: 100%;
                height: 100%;
            }
        }
    }
    .video-selector-modal {
        .ivu-modal-body {
            padding: 0;
            > .content {
                padding: 0;
                .video-selector-content {
                    padding: 20px;
                    > .video-header {
                        display: flex;
                        flex-wrap: nowrap;
                        justify-content: space-between;
                        padding-bottom: 20px;
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
                        max-height: 457px;
                        overflow-y: auto;
                        height: calc(100vh - 110px - 160px - 50px - 82px - 62px);
                        > ul {
                            display: flex;
                            flex-wrap: wrap;
                            > li {
                                position: relative;
                                margin: 0 10px 40px 0;
                                width: 180px;
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
                                    white-space: nowrap; /*规定段落中的文本不进行换行 */
                                    @include font-12-16;
                                    color: $text-first;
                                    padding-top: 10px;
                                    padding-bottom: 5px;
                                }
                                > .time {
                                    @include font-12-16;
                                    color: $text-third;
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
            }
        }
    }

    video:focus{
        outline: 0;      //去掉选中蓝框
    }
    video {
        object-fit:cover;
    }
    .video-selector-header {
        padding: 3px 4px;
        height: 20px;
        display: flex;
        align-items: center;
        .title {
            @include font-16-22-bold;
            color: $text-first;
        }
        .storage-content {
            padding-left: 20px;
            @include font-14-20;
            color: $text-third;
        }
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
