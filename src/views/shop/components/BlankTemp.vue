<template>
    <div class="flex page-temp blank-temp">
        <i class="iconfont icon-tianjiakongbaimoban create-icon"></i>
        <span class="blank-desc">使用空白模板</span>
    </div>
</template>

<style lang="scss" scoped>
.page-temp {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #e9edef;
    border-radius: 4px;
    width: 225px;
    // height: 365px;
    background-color: #fafdff;
    cursor: pointer;
    // &.blank-temp {
    //     height: 347px;
    // }

     &:hover {
        box-shadow: 0px 1px 14px rgba(133, 148, 162, 0.2);
        transform: translateY(-5px);
        transition: all 0.3s linear;
    }

    .create-icon {
        font-size: 86px;
        color: #939799;
    }

    .blank-desc {
        @include font-14-20;
        margin-top: 20px;
        color: #939799;
    }
}
</style>