<template>
    <div class="image">
        <div class="image-selector-modal" v-loading="loading">
            <div class="image-selector-local">
                <div class="group">
                    <div class="add-group">
                        <Poptip title="添加分组" v-model="group.value">
                            <Button class="default-primary add-group-btn">+添加分组</Button>
                            <template #content>
                                <div class="image-selector-poptip-content">
                                    <Input
                                        v-model="group.name"
                                        placeholder="请填入分组名称"
                                        @on-enter="addGroupOk"
                                    />
                                    <div class="action-btn">
                                        <Button
                                            @click="addGroupCancel"
                                        >取消
                                        </Button>
                                        <Button
                                            type="primary"
                                            @click="addGroupOk"
                                        >确定
                                        </Button>
                                    </div>
                                </div>
                            </template>
                        </Poptip>
                    </div>
                    <div class="group-content">
                        <ul v-if="group.list && group.list.length > 0">
                            <!--全部-->
                            <li
                                class="all"
                                :class="{
                                        'group-active':
                                            isActive == group.list[0].id
                                    }"
                                @click="checkGroup(group.list[0].id)"
                            >
                                <div class="group-list">
                                    <p class="title">
                                        {{ group.list[0].name }}
                                    </p>
                                    <p class="number">
                                        {{ rtotal?rtotal: group.list[0].total }}
                                    </p>
                                </div>
                            </li>
                            <!--默认分组-->
                            <li
                                class="all"
                                :class="{
                                        'group-active':
                                            isActive == group.list[1].id
                                    }"
                                @click="checkGroup(group.list[1].id)"
                            >
                                <div class="group-list">
                                    <p class="title">
                                        {{ group.list[1].name }}
                                        <span class="system-label">系统</span>
                                    </p>
                                    <p class="number">
                                        {{ group.list[1].total }}
                                    </p>
                                </div>
                            </li>
                            <!--商品助手-->
                            <li
                                class="all"
                                :class="{
                                        'group-active':
                                            isActive == group.list[2].id
                                    }"
                                @click="checkGroup(group.list[2].id)"
                            >
                                <div class="group-list">
                                    <p class="title">
                                        {{ group.list[2].name }}
                                        <span class="system-label">系统</span>
                                    </p>
                                    <p class="number">
                                        {{ group.list[2].total }}
                                    </p>
                                </div>
                            </li>
                            <!--评价助手-->
                            <li
                                class="all"
                                :class="{
                                        'group-active':
                                            isActive == group.list[3].id
                                    }"
                                @click="checkGroup(group.list[3].id)"
                            >
                                <div class="group-list">
                                    <p class="title">
                                        {{ group.list[3].name }}
                                        <span class="system-label">系统</span>
                                    </p>
                                    <p class="number">
                                        {{ group.list[3].total }}
                                    </p>
                                </div>
                            </li>
                            <!--其他-->
                            <template v-for="(list, index) in group.list">
                                <li

                                    v-if="index > 3"
                                    :key="list.id"
                                    :class="{
                                            'group-active': isActive == list.id,

                                        }"
                                >
                                    <Poptip title="修改分组" :value="group.updateId === list.id"
                                            @on-popper-hide="editGroupCancel">
                                        <div class="group-list group-other"
                                             @click.stop="checkGroup(list.id)">
                                            <p class="title">
                                                {{ list.name }}
                                            </p>
                                            <p class="number">
                                                {{ list.total }}
                                            </p>
                                            <p class="btn">
                                                <Button
                                                    type="text"
                                                    @click.stop="editGroup(list)"
                                                >
                                                    编辑
                                                </Button>
                                                |
                                                <Button
                                                    type="text"
                                                    @click.stop="deleteGroup(list)"
                                                >
                                                    删除
                                                </Button>
                                            </p>
                                        </div>
                                        <template #content>
                                            <div class="image-selector-poptip-content">
                                                <Input
                                                    v-model="group.updateName"
                                                    placeholder="请填入分组名称"
                                                    @on-enter="editGroupOk"
                                                />
                                                <div class="action-btn">
                                                    <Button
                                                        @click="editGroupCancel"
                                                    >取消
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        @click="editGroupOk"
                                                    >确定
                                                    </Button>
                                                </div>
                                            </div>
                                        </template>
                                    </Poptip>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
                <div class="image-content">
                    <div class="image-header">
                        <div class="btn">
                            <Button type="primary" @click="selectFile">+添加图片</Button>
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
                        <div class="checkbox flex" v-show="list && list.length > 0">
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
                            <Button class="marginL-10" :disabled="!selectNumber" @click="editGroups">修改分组</Button>
                            <Button class="marginL-10" :disabled="!selectNumber" @click="deleteImage('multiple')">彻底删除</Button>
                        </div>
                    </div>
                    <div class="image-list"  ref='scrollBox'>
                        <ul v-if="list && list.length > 0">
                            <li
                                v-for="(item, index) in list"
                                :key="item.id"
                                @click="checkImage(index, !item.checked)"
                            >
                                <div class="image">
                                    <img
                                        :src="adaption(item.path)"
                                        alt=""
                                        @error="replaceImage"
                                    />
                                    <!--蒙层--选中-->
                                    <div
                                        class="image-select-layer"
                                        v-show="item.checked"
                                    >
                                        <kdx-svg-icon type="icon-chenggong-shixin" class="checked"></kdx-svg-icon>
                                    </div>
                                </div>
                                <div class="text"><span>{{ item.name }}</span></div>
                                <div class="second flex flex-between">
                                    <div class="time">{{ item.created_at| formadateTime }}</div>
                                    <div class="action flex" :class="{check: item.checked}">
                                        <Button
                                            type="text"
                                            @click.stop="deleteImage('single',item)"
                                        >删除</Button>
                                        <span class="line">|</span>
                                        <span class="more" @click.stop="clickMore(item)" >
                                            更多
                                        </span>
                                        <div class="tips" v-if="item.showMore" @mouseleave="mouseleave(item)">
                                            <div class="arrow"></div>
                                            <div class="tool flex-column">
                                                <div class="text" @click.stop="seeImage(item)">查看</div>
                                                <div class="text" @click.stop="resetName(item)">重命名</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="image-list-none" v-else style="text-align: center">
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
                    <div class="image-footer">
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
        </div>
        <kdx-modal-frame v-model="editValue" title="修改分组" :width="610" @on-cancel="editCancel" @on-ok="editOk">
            <div class="group-modal">
                <Form ref="form" :label-width="120" :model="groupModel" :rules="groupRules" @submit.native.prevent>
                    <FormItem label="所在分组：" prop="group_id">
                        <Select class="width-340" v-model="groupModel.group_id" placeholder="请选择分组">
                            <Option v-for="item in groupList" :key="item.id" :value="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
        </kdx-modal-frame>
        <kdx-modal-frame v-model="editName" title="重命名" :width="610" @on-cancel="nameCancel" @on-ok="nameOk">
            <div class="group-modal">
                <Form ref="name" :label-width="120" :model="groupModel" :rules="groupRules" @submit.native.prevent>
                    <FormItem label="图片名称：" prop="name">
                        <Input
                            v-model="groupModel.name"
                            type="text"
                            maxlength="20"
                            show-word-limit
                            class="width-430 limit-input"
                            placeholder="请输入图片名称"
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
    name: 'ImageSelector',
    data() {
        return {
            value: false,
            // 当前选中值,存入的是地址
            selectRows: [],
            tab: {
                name: 'local'
            },
            loading: false,
            group: {
                name: '',
                value: false,
                updateId: '',
                updateName: '',
                list: []
            },
            image: {
                address: ''
            },
            list: [],

            // 默认选中全部分类
            isActive: 'all',
            selectNumber: 0,
            search: {
                createTime: []
            },
            rtotal: 0,
            pageSizeOption: [20,50,100],
            page: {
                pageSize: 50,
                pageNumber: 1
            },
            total: 0,
            multipleCheck: false,
            indeterminate: false,
            editValue: false, //分组弹窗
            editName: false, //重命名弹窗
            groupModel: {
                group_id: '', // 修改分组
                name: '', //重命名
            },
            groupRules: {
                group_id: [
                    { required: true, message: '所在分组必填' },
                ],
                name: [
                    { required: true, message: '图片名称必填' },
                ],
            },
            groupList: [], //修改分组list
            nameId: '', //重命名图片id
        };
    },
    computed: {
        maxSize() {
            return this.toFixed(this.$store.state?.config?.uploadSetting?.image?.max_size) || 2048;
        },
        limitType() {
            let type = (this.$store.state?.config?.uploadSetting?.image?.extensions || []).map(item => {
                if (item === 'jpg') {
                    return `image/jpeg`;
                } else {
                    return `image/${item}`;
                }
            }).join(',');
            return type || 'image/png';
        },
        hintMaxText() {
            let size = this.toFixed(this.maxSize / 1024);
            return `大小不要超过${size}M`;
        },
        hintTooltipText() {
            let type = (this.$store.state?.config?.uploadSetting?.image?.extensions || []).join(',') || 'png';
            return `${this.hintMaxText},支持图片类型${type}`;
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
        this.$nextTick(() => {
            this.isActive = 'all';
            this.selectRows = [];
            this.image.address = '';
            this.getImageGroup();
            this.resetPage();
        })
    },
    methods: {
        adaption(path){
            const C =  this.$media;
            return C(path);
        },
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
        // 页码改变
        handlePageChange(page) {
            this.page = page;
            this.getImageList();

            try {
                this.$refs.scrollBox.scrollTop=0
            }catch (e) {
                console.log(e)
            }
        },
        // 重置页码
        resetPage() {
            this.page = {
                pageSize: 50,
                pageNumber: 1
            };
            this.$refs['page']?.reset();
            this.getImageList();
        },
        // 重置分组
        resetGroup() {
            this.isActive = 'all';
            this.getImageGroup();
        },
        // 上传图片选择
        selectFile() {
            this.$refs['upload_input'].click();
        },
        // 图片选择
        changeFile(e) {
            if (e) {
                this.loading = true;
                let fileArr = e.target.files, paramsArr = [];
                let group_id = this.isActive === 'all' ? '' : this.isActive;
                for (let file of fileArr) {
                    if (file.size > this.maxSize * 1024) {
                        this.$Message.error(`图片应选择小于${this.toFixed(this.maxSize / 1024)}M的`);
                        break;
                    }
                    let type = (this.$store.state?.config?.uploadSetting?.image?.extensions || []).join('|');
                    let reg2 =eval("/^(\\s|\\S)+("+ type +")+$/");
                    if (!reg2.test(file.name.toLowerCase())) {
                        this.$Message.error('请选择正确的格式的图片');
                        break;
                    }
                    let params = new FormData(); // 创建form对象
                    params.append('file', file); // 通过append向form对象添加数据
                    params.append('type', '10');


                    params.append('group_id', group_id);
                    paramsArr.push(params);
                }
                if (paramsArr.length < fileArr.length) {
                    this.$refs['upload_input'].value = '';
                    this.loading = false;
                    return;
                }
                let uploadFun = paramsArr.map(params => {
                    return uploadFile(accessoryApi.uploadFile.api, params);
                });
                Promise.all(uploadFun).then(res => {
                    // console.log('@@@@@', res);
                    // console.log(res?.[0].data?.media_id);
                    let message = [];
                    res.forEach(item => {
                        if (item.error !== 0) {
                            message.push(item.message);
                            this.$Message.error(item.message);
                        }
                    });
                    this.loading = false;
                    if (message.length === 0) {
                        this.$Message.success('图片上传成功');
                    }
                    if (message.length === res.length) {
                        this.$refs['upload_input'].value = '';
                        return;
                    }
                    this.getImageGroup();
                    this.resetPage();
                    this.$refs['upload_input'].value = '';
                }).catch(err => {
                    console.log('err', err);
                });
            }
        },
        // 确定添加分组
        addGroupOk() {
            if (!this.group.name) {
                this.$Message.error('请填写要添加的分组名称');
                return;
            }
            this.$api.accessoryApi.addImageGroup({name: this.group.name, type: '10'})
                .then(res => {
                    if (res.error === 0) {
                        this.$Message.success('分组添加成功');
                        this.group.name = '';
                        this.addGroupCancel();
                        this.resetGroup();
                        this.resetPage();
                    }
                });
        },
        addGroupCancel() {
            this.group.value = false;
        },
        // 切换分组
        checkGroup(id) {
            this.isActive = id;
            this.resetPage();
        },
        editGroup(row) {
            this.group.updateId = row.id;
            this.group.updateName = row.name;
        },
        // 确定修改分组
        editGroupOk() {
            let params = {
                id: this.group.updateId,
                name: this.group.updateName
            };
            this.$api.accessoryApi.editImageGroup(params)
                .then(res => {
                    if (res.error === 0) {
                        this.$Message.success('分组名称修改成功');
                        this.group.updateId = '';
                        this.group.updateName = '';
                        this.resetGroup();
                        this.resetPage();
                    }
                });
        },
        // 取消修改分组
        editGroupCancel() {
            this.group.updateId = '';
        },
        deleteGroup(row) {
            this.$Modal.confirm({
                title: "提示",
                content: "确定要删除该图片分组？",
                onOk: () => {
                    this.$api.accessoryApi.deleteImageGroup({id: row.id})
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('该图片分组删除成功');
                                this.resetGroup();
                                this.resetPage();
                            }
                        });
                },
                onCancel: () => {
                }
            });
        },
        // 图片选中
        checkImage(index, isChecked = false) {
            this.$set(this.list[index], 'checked', isChecked);
            // 多选
            if (this.selectRows.length === 0) {
                this.selectRows.push(this.list[index].id);
            } else {
                if (isChecked) {
                    this.selectRows.push(this.list[index].id);
                } else {
                    this.selectRows =this.selectRows.filter(item=> item!==this.list[index].id)
                }
            }
            this.getSelectNumber();
            this.handleCheckAll()
        },
        // 删除图片
        deleteImage(type, row) {
            let id;
            if (type === 'single') {
                id = row.id;
            }else {
                id = this.selectRows
            }
            this.$api.accessoryApi.deleteFile({id}).then(res => {
                if (res.error === 0) {
                    this.$Message.success('图片删除成功');
                    this.getImageGroup();
                    this.getImageList();
                    this.selectRows = [];
                    // 当为多选删除时情况选中项
                    if (type === 'more') {
                        this.resetSelect();
                    }
                }
            });
        },
        // 搜索
        handleSearch() {
            this.resetPage();
            this.getImageList();
        },
        // 获取图片list
        getImageList() {
            this.loading = true;
            let created_at = this.search.createTime;
            if (created_at[0]) {
                created_at[0] = this.$utils.formatDate(new Date(created_at[0]), 'yyyy-MM-dd hh:mm:ss');
                created_at[1] = this.$utils.formatDate(new Date(created_at[1]), 'yyyy-MM-dd hh:mm:ss');
            } else {
                created_at = '';
            }
            let group_id = this.isActive === 'all' ? '' : this.isActive;
            let params = Object.assign({
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                type: '10',
                group_id,
                created_at
            });
            this.$api.accessoryApi.getAccessoryList(params).then(res => {
                this.loading = false;
                if (res.error === 0) {
                    this.initImageList(res.list);
                    this.total = res.total;
                    this.defaultChecked();
                }
            });
        },

        // 添加默认选中项
        defaultChecked() {
            // 多选
            this.selectRows.forEach((select, index) => {
                for (let item of this.list) {
                    if ((!item.checked && select === item.id)) {
                        item.checked = true;
                        item.index = index;
                        break;
                    }
                }
            });
            this.list = this.list.slice(0)
            this.getSelectNumber();
            this.handleCheckAll();
        },
        // 获取图片分组
        getImageGroup() {
            this.$api.accessoryApi.getImageGroup({type: '10'})
                .then(res => {
                    let {error, list = []} = res;
                    if (error === 0) {
                        list[0].id = 'all';
                        this.group.list = list || [];
                    }
                });
        },
        // 初始化图片list
        initImageList(list = []) {
            list.forEach(item => {
                item.checked = false;
                item.showMore = false;
            });
            this.list = list.slice(0);
        },
        // 清空选中项
        resetSelect() {
            this.selectRows = [];
            this.getSelectNumber();
            this.handleCheckAll();
        },
        // 获取选中数量
        getSelectNumber() {
            if (this.selectRows?.length) {
                this.selectNumber = this.selectRows.length;
            } else {
                this.selectNumber = 0;
            }
        },
        // 修改分组
        editGroups() {
            this.editValue = true;
            this.getImageGroup();
            this.groupList = this.group.list.filter(item => item.id!='all')
        },
        editCancel() {
            this.groupModel.group_id = ''
            this.editValue = false;
            this.$refs.form.resetFields()
        },
        editOk() {
            return new Promise(() => {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.$api.accessoryApi.changeImageGroup({ids: this.selectRows.join(','), group_id: this.groupModel.group_id}).then(res=> {
                            if(res.error === 0) {
                                this.$Message.success('操作成功');
                                this.editCancel();
                                this.getImageGroup();
                                this.getImageList();
                                this.resetSelect()
                            }
                        })
                    }
                })
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
                                this.getImageGroup();
                                this.getImageList();
                            }
                        })
                    }
                })
            })
        },
        seeImage(item) {
            item.showMore = !item.showMore;
            window.open(this.adaption(item.path),'_blank')
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
            this.list.forEach((item) => {
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
            let checkLen = this.list.filter(item=>item.checked==true).length;
            if(this.selectNumber>0) {
                if(this.page.pageSize == checkLen || this.list.length == checkLen) {
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
.image {
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
    height: calc(100vh - 150px);
    overflow: hidden;
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
    // 本地图片
    .image-selector-local {
        display: flex;
        flex-wrap: nowrap;
        // 分组
        .group {
            min-width: 200px;
            max-width: 200px;
            padding: 20px 0;
            border-right: 1px solid $border-color;
            overflow-x: hidden;
            overflow-y: auto;
            .add-group {
                padding: 0 20px;
                .add-group-btn {
                    margin-bottom: 8px;
                    width: 159px;
                }
            }
            .group-content {
                height: calc(100vh - 175px);
                overflow-x: hidden;
                overflow-y: auto;
                > ul {
                    > li {
                        /deep/ .ivu-poptip {
                            display: block;
                            .ivu-poptip-rel {
                                display: block;
                            }
                        }
                        .btn {
                            padding-right: 10px;
                            color: $brand-color;
                            white-space: nowrap;
                            display: none;
                            font-size: 12px;
                            > .ivu-btn {
                                font-size: 12px;
                            }
                        }
                        .group-list {
                            display: flex;
                            justify-content: space-between;
                            flex-wrap: nowrap;
                            /*padding: 12px 0 12px 30px;*/
                            align-items: center;
                            color: $text-first;
                            height: 40px;
                            overflow: hidden;
                            cursor: pointer;
                            .title {
                                width: 130px;
                                padding-left: 20px;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                font-size: 12px;
                                .system-label {
                                    margin-left: 4px;
                                    display: inline-block;
                                    width: 28px;
                                    height: 18px;
                                    line-height: 18px;
                                    font-size: 12px;
                                    color: $brand-color;
                                    border: 1px solid $brand-color;
                                    border-radius: 2px;
                                }
                            }
                            .number {
                                font-size: 12px;
                                padding-right: 20px;
                            }
                            &:hover {
                                background-color: #f0faff;
                                color: $brand-color;
                            }
                        }
                        .group-other {
                            .title {
                                padding-left: 30px;
                            }
                            &:hover {
                                .btn {
                                    display: block;
                                }
                                .number {
                                    display: none;
                                }
                            }
                        }
                        .group-update {
                            display: flex;
                            justify-content: space-between;
                            flex-wrap: nowrap;
                            /*padding: 12px 0 12px 30px;*/
                            align-items: center;
                            //color: $text-first;
                            height: 40px;
                            overflow: hidden;
                            cursor: pointer;
                            .ivu-input-wrapper {
                                flex: 1;
                                width: 0;
                                .ivu-input {
                                    border: none;
                                    box-shadow: none;
                                }
                            }
                            .btn {
                                display: inline-block;
                            }
                        }
                    }
                    .all {
                        .title {
                            padding-left: 20px;
                            width: 140px;
                        }
                        &:hover {
                            .number {
                                display: block;
                            }
                        }
                    }
                    .group-active {
                        border-right: 2px solid $brand-color;
                        background-color: #f0faff;
                        .group-list {
                            color: $brand-color;
                        }
                    }
                }
            }
        }
        // 图片列表
        .image-content {
            padding: 0 20px;
            width: 100%;
            overflow-y: auto;
            > .image-header {
                padding-top: 20px;
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                padding-bottom: 10px;
                > .btn {
                    flex: 1;
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
            > .image-list {
                overflow-y: auto;
                overflow-x: hidden;
                height: calc(100vh - 340px);
                padding-top: 20px;
                > ul {
                    display: flex;
                    flex-wrap: wrap;
                    margin-right: -10px;
                    > li {
                        padding: 0 10px 20px 0;
                        &:hover {
                            .second .action {
                                display: block;
                            }
                        }
                        > .image {
                            position: relative;
                            width: 138px;
                            height: 138px;
                            border: 1px solid $border-color;
                            border-radius: 2px;
                            cursor: pointer;
                            background-color: $background-color;
                            &:hover {
                                > .layer {
                                    display: block;
                                    > .close {
                                        /*display: block;*/
                                        color: $text-zhushi;
                                    }
                                }
                            }
                            > img {
                                width: 100%;
                                height: 100%;
                            }
                            > .layer {
                                display: none;
                                > .close {
                                    position: absolute;
                                    top: -10px;
                                    right: -10px;
                                    font-size: 20px;
                                    color: $text-zhushi;
                                    &:hover {
                                        color: $text-second;
                                    }
                                }
                                > .image-size {
                                    position: absolute;
                                    bottom: 0;
                                    left: 0;
                                    right: 0;
                                    height: 20px;
                                    line-height: 20px;
                                    text-align: center;
                                    background-color: rgba(
                                            0,
                                            0,
                                            0,
                                            0.7
                                    );
                                    color: #ffffff;
                                    font-size: 12px;
                                }
                            }
                            > .layer-disappear {
                                display: none;
                                > .close {
                                    display: none;
                                }
                                > .image-size {
                                    display: none;
                                }
                            }
                            > .image-select-layer {
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
                        > .text {
                            @include font-12-16;
                            color: $text-first;
                            margin-top: 10px;
                            width: 138px;
                            word-break: keep-all;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
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
                .image-list-none {
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
            > .image-footer {
                display: flex;
                flex-wrap: nowrap;
                justify-content: center;
                padding: 10px 0;
                background-color: #ffffff;
                > .checkbox {
                    .ivu-checkbox-wrapper {
                        margin-right: 10px;
                    }
                }
            }
        }
    }
}
.image-selector-header {
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
.group-modal {
    padding-top: 30px;
}
</style>
<style lang="scss">
// poptip
.ivu-poptip-body-content {
    .image-selector-poptip-content {
        .action-btn {
            text-align: right;
            padding-top: 10px;
            .ivu-btn {
                margin-left: 10px;
            }
        }
    }
}
@media only (max-width: 1550px) {
    .image-selector {
        .kdx-modal-frame-box {
            .ivu-modal {
                .ivu-modal-content {
                    .ivu-modal-body {
                        .content {
                            max-height: calc(100vh - 110px - 40px)!important;
                        }
                    }
                }
            }
        }
    }
}
</style>
