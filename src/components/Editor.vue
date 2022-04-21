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
    <div class="tinymce-editor">
        <tinymce-editor v-model="content" :init="init" :disabled="isDisabled"></tinymce-editor>
        <!--图片选择器-->
        <image-selector
            ref="image"
            v-model="modal.image"
            :current-list="selector.image"
            :multiple="true"
            :limit="selector.limitImage"
            @on-cancel="handleCancel"
            @on-change="insertImage"
        ></image-selector>
        <!--视频选择器-->
        <video-selector
            ref="video"
            v-model="modal.video"
            :current="selector.video"
            @on-cancel="handleCancel"
            @on-change="insertVideo"
        ></video-selector>
    </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import TinymceEditor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/media' // 插入视频插件
import 'tinymce/plugins/table' // 插入表格插件
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/noneditable' // 不可编辑元素插件
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/plugins/link'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/code' // 源代码插件
import 'tinymce/plugins/paste'
import 'tinymce/plugins/quickbars' // 快捷工具栏
import ImageSelector from './selector/ImageSelector'
import VideoSelector from './selector/VideoSelector'
import {uploadFile} from '@/api/config/fileRequest';
import {accessoryApi} from '@/api/accessory';
import {mapState} from 'vuex'


export default {
    name: 'Editor',
    components: {
        TinymceEditor,
        ImageSelector,
        VideoSelector
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        height: {
            type: [Number, String],
            default: 300
        },
        plugins: {
            type: [String, Array],
            default: 'lists image media table wordcount link preview code paste quickbars noneditable'
        },
        toolbar: {
            type: [String, Array],
            default:
                'bold italic underline forecolor backcolor alignnone | formatselect fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | imageUpload videoUpload | bullist numlist outdent indent|removeformat code link'
        },
        menubar: {
            type: [String, Boolean],
            default: 'file edit'
        },
        // 富文本编辑器是否禁选
        isDisabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState('config', {
            maxImageSize: state => state.uploadSetting?.image?.max_size || 2048,
            imageType: state => (state?.uploadSetting?.image?.extensions || []).join('|')
        })
    },
    data() {
        let systemOutput = this.$store.state.config.systemOutput
        return {
            content: this.value,
            editor: '',
            selector: {
                image: [],
                video: {}
            },
            modal: {
                image: false,
                video: false,
                limitImage: 10
            },
            init: {
                language_url:
                    `${systemOutput}/static/dist/shop/tinymce/langs/zh_CN.js`,
                language: 'zh_CN',
                skin_url:
                    `${systemOutput}/static/dist/shop/tinymce/skins/ui/oxide`,
                // image_prepend_url: 'http://pic1.win4000.com/',
                // document_base_url: window.config.base_url.attachment_url,
                // images_upload_base_path: 'http://pic1.win4000.com/',
                content_css: `${systemOutput}/static/dist/shop/tinymce/tinymce.css`, // 富文本iframe内样式
                convert_urls: false,
                height: this.height,
                fontsize_formats: '12px 14px 16px 18px 20px',
                plugins: this.plugins,
                toolbar: this.toolbar,
                branding: false,
                menubar: this.menubar, // 菜单栏
                quickbars_selection_toolbar: 'bold italic underline forecolor | h2 h3 | imageUpload videoUpload',//
                quickbars_insert_toolbar: '',
                paste_data_images: true,
                font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;',
                images_upload_handler: (blobInfo, success) => { // 上传图片
                    let file = blobInfo.blob(),
                    size = file.size,
                    name = file.name,
                    reg = eval("/^(\\s|\\S)+("+ this.imageType +")+$/");
                    if (!reg.test(name.toLowerCase())) {
                        this.$Message.error('请粘贴正确的格式的图片');
                        success('');
                        return;
                    }
                    if (size > this.maxSize * 1024) {
                        this.$Message.error(`粘贴图片应小于${this.maxSize / 1024}M的`);
                        success('');
                        return;
                    }
                    let params = new FormData(); // 创建form对象
                    params.append('file', file); // 通过append向form对象添加数据
                    params.append('type', '10');
                    uploadFile(accessoryApi.uploadFile.api, params).then(res => {
                        if (res.error === 0) {
                            console.log('res', res, this.$media(res.path));
                            success(this.$media(res.path));
                        } else {
                            success('');
                        }
                    });
                },
                paste_preprocess: (plugin, args) => {
                    args.content = this.formedia(args.content)
                },
                setup: editor => {
                    //设置自定义功能的按钮
                    editor.ui.registry.addButton('imageUpload', {
                        //单个按钮，此处的uploading是该按钮的名称
                        tooltip: '选择图片', //鼠标放上去后现在是内容.
                        icon: 'image',
                        onAction: () => {
                            this.editor = editor
                            this.modal.image = true
                            this.$refs['image'].setValue(true)
                        }
                    })
                    // 选择视频
                    editor.ui.registry.addButton('videoUpload', {
                        tooltip: '选择视频',
                        icon: 'embed',
                        onAction: () => {
                            this.editor = editor
                            this.modal.video = true
                            this.$refs['video'].setValue(true)
                        }
                    }),
                    editor.on('keyup', () => {
                        setTimeout(() => {
                            this.$emit("change");
                        })
                    })
                },
            }
        }
    },
    watch: {
        value: {
            handler(newValue) {
                this.content = newValue
            },
            immediate: true
        },
        content(newValue) {
            this.$emit('input', newValue)
        }
    },
    methods: {
        insertHtml(html) {
            tinymce.execCommand('mceInsertContent', false, html);
        },
        insertImage(option) {
            let insertHtml = ''
            ;(option || []).forEach(item => {
                insertHtml = `${insertHtml}<img style="width:100% !important; vertical-align: top" src='${this.$media(
                    item
                )}'>`
            })
            this.editor.execCommand('mceInsertContent', false, insertHtml)
            this.handleCancel()
        },
        insertVideo(option) {
            if (option&&option.path) {
                // 适配腾讯视频
                let url = option.video_url || "",
                    path = option.type === "local" ? this.$media(option.path, 'video') : option.path;
                let insertHtml =
                    `<p><video src='${path}' style="width: 100% !important;height: 225px !important;" controls data-url="${url}"></video></p>`
                this.editor.execCommand('mceInsertContent', false, insertHtml)
            }
            this.handleCancel()
        },
        handleCancel() {
            this.modal.image = false
            this.modal.video = false
        },
        // 处理图片
        formedia(content) {
            if (content.indexOf('<img') !== -1) {
                return content.replace(/<img*/gi, function() {
                    return `<img style="width:100% !important; vertical-align: top"`
                });
            } else {
                return content
            }
        }
    },
    mounted() {
        tinymce.init({})
    }
}
</script>

<style scoped lang="scss">
.tinymce-editor {
}
</style>
