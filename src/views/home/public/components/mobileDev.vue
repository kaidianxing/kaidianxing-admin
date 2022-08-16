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
  <div>
    <div class="device-wrap">
      <div class="hd">{{ tith }}</div>
      <div class="ct"></div>
      <div class="sub_menu">
        <ul class="m">
          <draggable
            v-model="menuData"
            group="menu"
            @start="drag = true"
            @end="syncToCenter"
          >
            <li
              v-for="(e, i) in menuData"
              :key="e.id"
              :class="i == menuData.length - 1 ? 'lst' : ''"
            >
              <div
                :class="{ ac: upFlg == e.id }"
                class="tith"
                @click="selectMenu(e.id, e.title)"
              >
                <div class="sp">{{ e.title }}</div>
              </div>

              <ul v-if="upFlg.includes(e.id)" class="sub_menu_wrap">
                <li
                  @click="selectMenu(j.id, j.title)"
                  :class="{
                    ac: upFlg.includes(j.id),
                    lst: i == menuData.length - 1,
                  }"
                  v-for="j in e.children"
                  :key="j.id"
                >
                  <div class="tith">
                    <div class="sp">{{ j.title }}</div>
                  </div>
                </li>

                <li v-if="5 > e.children.length" :data-key="e.id" @click="addSubMenu" class="add">+</li>
              </ul>
            </li>
          </draggable>
        </ul>
      </div>
    </div>
    <div class="btns-group">
      <button style="margin-right:24px;border:1px solid #2d8cf0; color:#2d8cf0" @click="add">添加</button>
      <button @click="del">删除</button>
    </div>
  </div>
</template>
<script>
import DataSourceOption from "./data";
import draggable from "vuedraggable";
export default {
  created() {
    // 注册
    DataSourceOption.regComponent(this);

    this.showFirstMenu();
  },
  computed: {
    onload() {
      return this.$route.query.id && this.menuData[0]?.id;
    },
  },
  watch: {
    onload: {
      handler() {
        this.selectMenu(this.menuData[0].id, this.menuData[0].title);
      },
    },
  },
  props: {
    tith: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      menuData: [],
      formData: {},
      // 控制底部弹起来的互斥关系 默认就第一个显示
      upFlg: "0",
    };
  },
  components: {
    draggable,
  },
  methods: {
    showFirstMenu(){
      if(0 == DataSourceOption.menuData.length){
        this.add();
        // console.log(this.menuData[0],this.menuData[0].id,this.menuData[0].title);
        this.$nextTick(() => {
          this.selectMenu(this.menuData[0].id, this.menuData[0].title);
        });
      }
    },
    del() {
      DataSourceOption.delMenu(this.upFlg);
    },
    selectMenu(id, menuName) {
      if("" == this.currentFormInfoByMenuId.menuName){
        let rs = "";
        
        if(!id.includes("-")){
          rs = "菜单名称"
        }else{
          rs = "二级菜单"
        }

        this.currentFormInfoByMenuId.menuName = rs;
      }
      this.upFlg = id + "";
      // console.log(this.upFlg, '@@@@@@@@@@@-------------');
      // 上报中心数据做了切换操作
      DataSourceOption.selectMenu(id, menuName);
    },
    addSubMenu(e) {
      const OBJ = DataSourceOption.addMenu(e.target.dataset.key, true);
      const ID = OBJ.id;
      // 根据当前id 来创建子菜单
      if (ID) {
        this.selectMenu(ID, OBJ.title);
      }
    },
    add() {
      const OBJ = DataSourceOption.addMenu();
      const ID = OBJ.id;
      //   console.log("ID=======>>>", ID);
      if (ID) {
        this.selectMenu(ID, OBJ.title);
      }

      // 赋值默认id选择项
      //   this.upFlg = this.menuData[0].id;
    },
    // 拖拽完了同步到中心
    syncToCenter() {
      console.log(this.formData, this.menuData);

      DataSourceOption.initData(this.menuData, this.formData);
    },
  },
};
</script>
<style scoped lang="scss">
.device-wrap {
  width: 296px;
  height: 582px;
  display: flex;
  flex-direction: column;
  .hd {
    background: url("~@/assets/image/channel/head.png") no-repeat;
    background-size: 100%;
    height: 60px;
    line-height: 80px;
    color: #ffffff;
    text-align: center;
    font-size: 18px;
  }
  .ct {
    flex: 1;
    border: 1px solid #e7e7eb;
    border-top: 0;
    border-bottom: 0;
  }
  .sub_menu {
    background: url("~@/assets/image/channel/footer.png") no-repeat;
    height: 50px;
    line-height: 50px;
    border: 1px solid #e7e7eb;
    padding-left: 44px;
    .m > div {
      display: flex;
      align-items: center;
      text-align: center;
      .sp {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: 90px;
        margin: 0 auto;
        padding: 0 10px;
      }
      li {
        .tith {
          &.ac {
            color: #2d8cf0;
          }
          cursor: pointer;
        }
        position: relative;
        flex: 1;
        border-right: 1px solid #e7e7eb;
        .lst,
        &.lst {
          border: 0;
        }
      }
      .sub_menu_wrap {
        li {
          display: flex;
          flex-direction: column;
          border: 1px solid #e7e7eb;
          border-bottom: 0;
          &.ac,
          &:hover {
            background: #fafafa;
          }
          &.ac {
            color: #2d8cf0;
          }
        }
        left: -1px;
        right: -1px;
        bottom: 51px;
        position: absolute;
      }
    }
  }
}
.btns-group {
  padding: 24px 0;
  display: flex;
  button {
    flex: 1;
    border: 1px solid #e7e7eb;
    height: 32px;
    background: transparent;
  }
}
</style>
