<template>
    <div class="preview-index">
        <div class="preview-title">推广预览</div>
        <div class="preview-box">
            <div class="content">
                <img :src="previewTop" alt="">
                <div class="text-wrap">
                    <div class="text">
                        <div class="description">{{ model.description_type === "0" ? "📢 现在下单超划算，赶紧下单" : model.description }}</div>
                        <div class="goods" v-if="model.description_type === '0'">👍 衬衫男女长袖夏季日系ins风文艺薄款亚麻港风男士女士小清新棉麻条纹白衬女士</div>
                        <div class="item">💰 ￥50.99</div>
                        <div class="item">👉 购买链接：#小程序://后朴商城/商品/M1Ytw4mg7r7nB3a</div>
                    </div>
                </div>
                <img :src="previewBottom" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Preview",
        props: {
            model: {
                type: Object,
                default: () => {}
            },
        },
        data() {
            return {
                previewTop: require("@/assets/image/material/material-top.png"),
                previewBottom: require("@/assets/image/material/material-bottom1.png"),
            }
        },
        methods: {},
    }
</script>

<style lang="scss" scoped>
    .preview-index {
        width: 380px;
        height: calc(100vh - 130px);
        padding-bottom: 20px;
        box-sizing: border-box;
        overflow-y: scroll;
        background-color: #fff;
        flex-shrink: 0;
        margin-right: 20px;
        margin-top: 20px;
        .preview-title {
            padding: 40px 0;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
        }
        .preview-box {
            transform: scale(0.8);
            transform-origin: top;
            width: 375px;
            height: fit-content;
            margin: 0 auto;
            box-shadow: 0px 4px 8px rgba(133, 148, 162, 0.3);
            border-radius: 6px;
            background-size: cover;
            position: relative;
            .content {
                display: flex;
                flex-direction: column;
                width: 100%;
                min-height: 667px;
                .text-wrap {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    background: #fff;
                    padding: 0 12px;
                }
                .text {
                    flex: 1;
                    padding: 16px 12px;
                    background: #F5F5F5;
                    border-radius: 6px;
                    font-size: 14px;
                    line-height: 20px;
                    word-break: break-all;
                    .goods {
                        text-overflow: ellipsis;
                        word-break: break-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }
    }
</style>
