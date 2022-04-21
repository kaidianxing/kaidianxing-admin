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
            title="添加图片"
            :width="1000"
            @on-cancel="handleCancel"
            @on-ok="handleOk"
            :ok-text="tab.name === 'local' ? '确定' : '提取'"
            class="image-selector"
            :loading="loading"
    >
        <template #header>
            <div class="image-selector-header">
                <div class="title">
                    添加图片
                </div>
                <div class="storage-content" v-if="storageContent">
                    {{storageContent}}
                </div>
            </div>
        </template>
        <div class="image-selector-modal">
            <Tabs v-model="tab.name">
                <TabPane label="本地图片" name="local" tab="image">
                    <div class="image-selector-local">
                        <div class="group">
                            <div v-if="!weixinControl.isHideMenu" class="add-group">
                                <Poptip title="添加分组" v-model="group.value">
                                    <Button class="default-primary add-group-btn" @click="addGroup"
                                    >+添加分组
                                    </Button
                                    >
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
                                                {{ !isNaN(rtotal)?rtotal: group.list[0].total }}
                                            </p>
                                        </div>
                                    </li>
                                    <!--默认分组-->
                                    <li
                                            v-if="!weixinControl.isHideMenu"
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
                                    v-if="!weixinControl.isHideMenu"
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

                                                v-if="index > 3 && !weixinControl.isHideMenu"
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
                                    <Button type="primary" @click="selectFile"
                                    >+添加图片
                                    </Button
                                    >
                                    <!--                                <Button @click="selectFile" style="margin-bottom: 6px">文件上传</Button>-->
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
                                            <!--蒙层图片大小-->
                                            <div
                                                    class="layer"
                                                    :class="{
                                                'layer-disappear': item.checked
                                            }"
                                            >
                                                <!--图片删除-->
                                                <Icon
                                                        type="ios-close-circle"
                                                        class="close"
                                                        @click.stop="deleteImage('single',item)"
                                                />
                                                <!--图片大小-->
                                                <div class="image-size" v-if="item.extend.width && item.extend.height">
                                                    {{ item.extend.width }} x {{item.extend.height}}
                                                </div>
                                            </div>
                                            <!--蒙层--选中-->
                                            <div
                                                    class="image-select-layer"
                                                    v-show="item.checked"
                                            >
                                                <kdx-svg-icon type="icon-chenggong-shixin" class="checked"></kdx-svg-icon>
                                            </div>
                                        </div>
                                        <div class="text">
                                        <span>
                                            {{ item.name }}
                                        </span>
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
                                <div class="checkbox" v-show="list && list.length > 0">
                                    <Button
                                            :disabled="!selectNumber"
                                            @click="deleteImage('multiple')"
                                    >删除选中 <span v-show="selectNumber">({{selectNumber}})</span>
                                    </Button>
                                </div>
                                <kdx-page-component
                                        ref="page"
                                        :total="total"
                                        @on-change="handlePageChange"
                                ></kdx-page-component>
                            </div>
                        </div>
                    </div>
                </TabPane>
                <TabPane v-if="!weixinControl.isHideMenu" label="网络提取" name="network" tab="image">
                    <div class="image-selector-network">
                        <Form :label-width="120" inline @submit.native.prevent>
                            <FormItem label="图片地址：">
                                <Input
                                        type="text"
                                        v-model="image.address"
                                        enter-button="提取图片"
                                        placeholder="请在此处粘贴图片地址"
                                        class="width-670"
                                        search
                                        @on-search="handleOk"
                                />
                                <kdx-hint-text>需要http://.........{{hintTooltipText}}</kdx-hint-text>
                            </FormItem>
                        </Form>
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
        name: 'ImageSelector',
        props: {
            weixinControl:{
                type: Object,
                default: ()=>({}),
            },
            // 是否多选
            multiple: {
                type: Boolean,
                default: false
            },
            current: {
                type: [String, Object],
                default: () => {
                }
            },
            // 当前选中值
            currentList: {
                type: Array,
                default: () => []
            },
            limit: {
                type: Number,
                default: 9
            },
            is_select_file: { // 是否直接上传
                type: Boolean,
                default: false
            },
            /* 返回image数据的类型，string/object
             * 当为object时按照id进行比对
             */
            returnType: {
                type: String,
                default: 'string',
                validator: val =>  ['string', 'object'].includes(val)
            }
        },
        data() {
            return {
                value: false,
                // 当前选中值,存入的是地址
                selectRows: [],
                selectRow: '',
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
                total: 0,
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
                // 默认选中全部分类
                isActive: 'all',
                selectNumber: 0,
                search: {
                    createTime: []
                },
                rtotal: 0
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
        },
        methods: {
            adaption(path){
               const C = !this.weixinControl.isHideMenu ? this.$media : this.$utils.getWechatImg;
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
            setValue(value, selectRow) {
                if (value) {
                    this.value = value;
                } else {
                    this.value = !this.value;
                }
                if (this.value) {
                    this.$nextTick(() => {
                        this.isActive = 'all';
                        // 数据加载，初始化选中项
                        if (this.multiple) {
                            this.selectRows = [...this.currentList] || [];
                        } else {
                            this.selectRow = selectRow !== undefined ? selectRow : this.current || '';
                        }
                        this.tab.name = 'local';
                        this.image.address = '';
                        this.getImageGroup();
                        this.resetPage();
                    })
                }
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
                    pageSize: 10,
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


                        if(this.weixinControl.actionApi){
                            params.append('type', this.weixinControl.actionApi.getTypeNameByMsgType());
                        }else{
                            params.append('type', '10');
                        }


                        params.append('group_id', group_id);
                        if (this.is_select_file) {
                            params.append('save_databases', 0); // 是否入库
                        }
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
                        // console.log('@@@@@', res);
                        // console.log(res?.[0].data?.media_id);
                        let message = [];
                        res.forEach(item => {
                            if (item.error !== 0) {
                                message.push(item.message);
                                this.$Message.error(item.message);
                            }
                        });
                        if (this.is_select_file) {
                            this.$emit('on-change', res?.[0].path, res?.[0].data?.media_id);
                        }
                        this.loading = false;
                        if (message.length === 0&&!this.is_select_file) {
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
            addGroup() {
                // this.group.value = true;
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
                if (this.multiple) {
                    if (isChecked) {
                        if (this.selectRows.length === this.limit) {
                            this.$Message.warning('已达选择上限');
                            return;
                        }
                    }
                    this.$set(this.list[index], 'checked', isChecked);
                    // 多选
                    if (this.selectRows.length === 0) {
                        if (this.returnType === 'string') {
                            this.selectRows.push(this.list[index].path);
                        } else if (this.returnType === 'object') {
                            this.selectRows.push(this.list[index]);
                        }
                    } else {
                        if (isChecked) {
                            if (this.selectRows.length === this.limit) {
                                this.$Message.warning('已达选择上限');
                                return;
                            }
                            if (this.returnType === 'string') {
                                this.selectRows.push(this.list[index].path);
                            } else if (this.returnType === 'object') {
                                this.selectRows.push(this.list[index]);
                            }
                        } else {
                          this.selectRows =this.selectRows.filter(item=> item!==this.list[index].path)
                            if (this.returnType === 'string') {
                                this.selectRows =this.selectRows.filter(item=> item!==this.list[index].path)
                            } else if (this.returnType === 'object') {
                                this.selectRows =this.selectRows.filter(item=> item.id!==this.list[index].id)
                            }
                        }
                    }
                } else {
                    if (isChecked) {
                        this.list.forEach((item, i) => {
                            this.$set(this.list[i], 'checked', false);
                        });
                        this.$set(this.list[index], 'checked', isChecked);
                        if (this.returnType === 'string') {
                            this.selectRow = this.list[index].path;
                        } else if (this.returnType === 'object') {
                            this.selectRow = this.list[index];
                        }
                        this.ma =this.list[index].id;
                    } else {
                        this.$set(this.list[index], 'checked', isChecked);
                        this.selectRow = '';
                    }
                }
                this.getSelectNumber();
            },
            // 添加默认选中项
            defaultChecked() {
                if (this.multiple) {
                    // 多选
                    this.selectRows.forEach((select, index) => {
                        for (let item of this.list) {
                            if ((this.returnType === 'string' && !item.checked && select === item.path)
                                    || (this.returnType === 'object' && !item.checked && select.id === item.id)) {
                                item.checked = true;
                                item.index = index;
                                break;
                            }
                        }
                    });
                } else {
                    // 单选
                    if (this.selectRow) {
                        for (let item of this.list) {
                            if ((this.returnType === 'string' && item.path === this.selectRow)
                                    || (this.returnType === 'object' && item.id === this.selectRow.id)) {
                                item.checked = true;
                                break;
                            }
                        }
                    }
                }
                this.list = this.list.slice(0)
                this.getSelectNumber();
            },
            handleCancel() {
                this.setValue();
                this.$emit('on-cancel');
            },
            handleOk() {

                if (this.tab.name === 'local') {
                    if (this.multiple) {
                        this.$emit('on-change', this.selectRows);
                    } else {
                        console.log("lk", this.ma)
                        this.$emit('on-change', this.selectRow,this.ma);
                    }
                    this.setValue();
                } else {
                    if (!this.image.address) {
                        this.$Message.error('请填写网络图片地址');
                        return;
                    }
                    this.$api.accessoryApi.uploadFile({type: '10', remote: this.image.address, save_databases: this.is_select_file?0:1})
                        .then(res => {

                            if (res.error === 0) {
                                if (this.multiple) {
                                    this.$emit('on-change', [...this.selectRows, res.path]);
                                } else {
                                    this.$emit('on-change', res.path);
                                }
                                this.setValue();
                            }
                        });
                }
            },
            // 删除图片
            deleteImage(type, row) {
                let id;
                if (type === 'single') {
                    id = row.id;
                } else {
                    if (this.multiple) {
                        id = [];
                        if (this.returnType === 'string') {
                            this.list.forEach(item => {
                                if (this.selectRows.indexOf(item.path) > -1) {
                                    id.push(item.id);
                                }
                            });
                        } else if (this.returnType === 'object') {
                            id = this.selectRows.map(item => item.id)
                        }

                    } else {
                        if (this.returnType === 'string') {
                            for (let item of this.list) {
                                if (item.path === this.selectRow) {
                                    id = item.id;
                                    break;
                                }
                            }
                        } else if (this.returnType === 'object') {
                            id = this.selectRow.id || '';
                        }
                    }
                }

                (!this.weixinControl.actionApi ?this.$api.accessoryApi.deleteFile({id}):this.weixinControl.actionApi.deleteFile()({
                    media_id:id
                })).then(res => {
                        if (res.error === 0) {
                            this.$Message.success('图片删除成功');
                            this.getImageGroup();
                            this.getImageList();
                            this.selectRow = '';
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
                if(!this.weixinControl.actionApi){
                    this.$api.accessoryApi.getAccessoryList(params).then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.initImageList(res.list);
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
                                tmp._id = item.id;
                                tmp.id = item.media_id;
                                tmp.name = item.title;
                                tmp.path = item.url;

                                rs.push(tmp);
                            });


                            this.initImageList(rs);
                            this.total = r.total;
                            this.rtotal = r.total;
                            this.defaultChecked();
                        }
                    })
                }
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
                });
                this.list = list.slice(0);
            },
            // 清空选中项
            resetSelect() {
                this.selectRow = '';
                this.selectRows = [];
                this.getSelectNumber();
            },
            // 获取选中数量
            getSelectNumber() {
                if (this.multiple) {
                    if (this.selectRows?.length) {
                        this.selectNumber = this.selectRows.length;
                    } else {
                        this.selectNumber = 0;
                    }
                } else {
                    if (this.selectRow) {
                        this.selectNumber = this.selectRow ? 1 : 0;
                    } else {
                        this.selectNumber = 0;
                    }
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .image-selector-modal {
        height: 570px;
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
                    height: 460px;
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
                    height: 410px;
                    padding-top: 10px;
                    > ul {
                        display: flex;
                        flex-wrap: wrap;
                        margin-right: -10px;
                        > li {
                            padding: 0 10px 20px 0;
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
                                word-break: break-all;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 2;
                                overflow: hidden;
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
                    justify-content: space-between;
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
        // 网络图片
        .image-selector-network {
            display: flex;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
            height: 100%;
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
            .modal-frame-box {
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
