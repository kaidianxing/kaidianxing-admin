<template>
    <div class="progress-bar">
        <div class="progress-bg">
            <div class="progress" :style="{width: `${progress}%`}" :class="{'success': progress === 100}"></div>
        </div>
        <div class="num" :class="{'success': progress === 100}">
            <span class="current">{{ current }}</span> / <span class="total">{{total}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProgressBar",
    props: {
        current: {
            type: [Number, String],
            default: 0
        },
        total: {
            type: [Number, String],
            default: 1
        }
    },
    computed: {
        progress() {
          return  parseInt((this.current / this.total) *100)
      }
    },
};
</script>

<style lang="scss" scoped>
.progress-bar {
    display: flex;
    align-items: center;
    .progress-bg {
        background-color: $border-color;
        width: 120px;
        height: 4px;
        border-radius: 4px;
        .progress {
            border-radius: 4px;
            width: 20%;
            height: 100%;
            background: linear-gradient(105.61deg, #29BFFF 0%, #0B88FB 94.51%);
            &.success {
                background: #43DBA3;
            }
        }
    }
    .num {
        padding-left: 10px;
        font-size: 12px;
        line-height: 16px;
        font-weight: bold;
        color: $text-first;
        .current {
            color: $brand-color;
        }
        &.success {
            color: $success-color;
            .current {
                color: $success-color;
            }
        }
    }
}
</style>