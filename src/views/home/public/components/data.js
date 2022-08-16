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
class DataSourceOption {
  constructor() {
    this.resetData();
    // 注册组建池
    this.registerComPool = [];
    // 当前选择menu的id对应的form - model
    this.currentFormInfoByMenuId = {};
    // 主标题控制所有栏位的一个标题
    this.publicName = {
      name: "",
    };

    // 限制添加数量
    this.maxX = 3;
    this.maxY = 5;
  }
  // 还原数据
  resetData() {
    // 菜单 总控菜单
    this.menuData = [];
    // 表单的 表单的数据体 拿菜单id进行关联
    this.formData = {};
    // 初始化菜单名称
    this.menuTitle = "菜单名称";
    // 初始化子菜单名称
    this.childMenuTitle = "二级菜单";
  }

  // 创建菜单的模版数据
  // 每次添加子类目需要带着parentId
  createMenuTemplateData(isChild = false, parentId = "") {
    return {
      id: parentId + Math.random(),
      title: isChild ? this.childMenuTitle : this.menuTitle,
      children: [],
    };
  }
  // 创建表单的默认模版数据 id 需要 遍历出链上的所有id - 分割
  // 表单的模版外边可以传进来也可以不传递
  createFormTemplateData(id = "", obj = {}) {
    if (id && obj) {
      this.formData[id] = obj;
      this.currentFormInfoByMenuId = obj;
      console.log("aaa");
      // call pool
      this.flushAllData();
    } else {
      return -1;
    }
  }
  // 注册组建
  regComponent(com = null) {
    if (com) {
      this.registerComPool.push(com);
    }
  }
  // 刷新组件的数据
  flushAllData() {
    // console.log(Object.keys(this.formData), "------------", this.formData);
    this.registerComPool.forEach((item) => {
      item.menuData = [...this.menuData];
      item.formData = { ...this.formData };
      item.currentFormInfoByMenuId = this.currentFormInfoByMenuId;
      item.publicName = this.publicName;
    });
  }
  // 编辑的时候需要初始化数据
  initData(menuData = [], formData = {}, currentFormInfoByMenuId = null) {
    // 菜单的信息
    this.menuData = menuData;
    // 表单的全信息
    this.formData = formData;
    // 当前模版的信息
    if (currentFormInfoByMenuId) {
      this.currentFormInfoByMenuId = currentFormInfoByMenuId;
    }

    this.flushAllData();
  }
  // 添加菜单的时候做验证
  addMenuChain() {
    let res = false;
    // todo 保留宽展功能
    return res;
  }
  // 增加menu
  addMenu(parentId = "", isChild = false) {
    const Temp = this.createMenuTemplateData(
      isChild,
      parentId ? parentId + "-" : ""
    );

    if (this.addMenuChain()) {
      return "";
    }

    if (!parentId) {
      if (this.menuData.length < this.maxX) {
        this.menuData.push(Temp);
      } else {
        return this.showError(`底部菜单个数必须小于等于${this.maxX}个`);
      }
    } else {
      // console.log(
      //   "ins===>>",
      //   parentId,
      //   this.menuData,
      //   "222",
      //   Temp,
      //   "yy===>>",
      //   this.getResById(parentId, this.menuData)
      // );
      // 如果有parentId先找到这个对象往这个对象的children里面加入
      //   console.log(parentId, this.menuData);
      const CHILD = this.getResById(parentId, this.menuData);
      if (CHILD.children.length < this.maxY) {
        if ("string" === typeof CHILD.children) {
          CHILD.children = JSON.parse(CHILD.children);
        }
        CHILD.children.unshift(Temp);
      } else {
        return this.showError(`菜单个数必须小于等于${this.maxY}个`);
      }
    }

    this.flushAllData();

    // 返回当前的创建对象
    return Temp;
  }

  // 根据id 找到对象
  getResById(id = "", list = []) {
    for (let i = 0; i < list.length; i++) {
      if (list[i]["id"] && id == list[i]["id"]) {
        // console.log(id, list, "===>>", list[i]["id"], "@@@", list[i]["id"]);
        return list[i];
      } else if (list[i]["id"] && 0 < list[i].children.length) {
        const RS = this.getResById(id, list[i].children);
        if (RS.id) {
          return RS;
        }
      }
    }
    return { children: [] };
  }

  // 执行删除操作
  doDel(id = "", obj = null) {
    if (id) {
      const TYPE = Object.prototype.toString.call(obj).slice(8, -1);
      switch (TYPE) {
        case "Array":
          // 递归
          for (let i = 0; i < obj.length; i++) {
            if (id === obj[i].id) {
              obj.splice(i, 1);
              break;
            } else if (0 < obj[i].children.length) {
              this.doDel(id, obj[i].children);
            }
          }
          break;
        case "Object":
          console.log("obj", obj);
          for (let i in obj) {
            if (i.includes(id)) {
              delete obj[i];
            }
          }

          break;
        default:
          break;
      }
    }
  }

  // 删除menu 带上parent的id
  delMenu(id = "") {
    if (id) {
      // 过滤出当前对应的id
      this.doDel(id, this.menuData);
      // 关联的删除form的对应数据
      this.doDel(id, this.formData);
      // 清除form model
      this.currentFormInfoByMenuId = {};

      this.flushAllData();
    }
  }

  // 修改数据menu
  updateMenu(id, data = {}) {
    let obj = this.getResById(id, this.menuData);
    for (let i in data) {
      obj[i] = data[i];
    }

    this.flushAllData();
  }

  // 表单修改同步数据
  asyncFormData(id = "", data = {}) {
    const BASE = this.formData[id] || {};

    for (let i in data) {
      BASE[i] = data[i];
    }

    this.flushAllData();
  }

  // 同步表单的修改到菜单上，创建管道。
  asyncFormDataToMenu(id = "", obj = {}) {
    const OBJ = this.getResById(id, this.menuData);

    // 如果存在OBJ直接渲染数据
    if (OBJ.id) {
      for (let key in obj) {
        OBJ[key] = obj[key];
      }
    }

    this.flushAllData();
  }

  // 客户端选择切换上报
  selectMenu(id = "", menuName = "") {
    // 获取资源
    const SOURCE = this.formData[id];

    if (SOURCE) {
      // 如果存在向form下发当前的model信息
      this.currentFormInfoByMenuId = SOURCE;
      SOURCE.menuName = menuName;
      this.flushAllData();
    } else {
      // 如果不存在直接创建
      this.createFormTemplateData(id, {
        menuName, // 菜单的名字
        id, // 当前表单的
        content: "0", // 菜单内容的类型默认0 发送消息 1 跳转网页 2 跳转小程序
        sourceByContent: {
          // 发送消息的内容
          "0": {
            type: "2",
            // 图文消息
            "0": {
              // 图文的时间
              date: "04月29日",
              // 图文的图片
              image: "",
              // 图文的描述
              des: "描述",
              media_id: "",
            },
            // 文字
            "1": {
              // 文本+emoji
              text: "",
            },
            // 图片
            "2": {
              image: "",
              media_id: "",
            },
            // 音频
            "3": {
              audio: "",
              media_id: "",
            },
            // 视频
            "4": {
              video: "",
              media_id: "",
            },
            // 关键字
            "5": {
              keyword: "",
            },
          },
          // 跳转网页
          "1": {
            url: "",
          },
          // 跳转小程序
          "2": {
            appId: "",
            pageUrl: "",
            url: "",
          },
        },
      });
    }
  }

  // 打印错误消息
  showError(msg = "") {
    this.registerComPool[0].$Message.error(msg);
    return {};
  }

  // 格式化数据 - 对接https://developers.weixin.qq.com/doc/offiaccount/Custom_Menus/Creating_Custom-Defined_Menu.html
  formatDataEncode() {
    let res = {
      button: [],
    };

    // 因为本框架采用的地址改变,所有无需传入参数直接针对 menuData formData 来进行处理.
    // menuData 左侧菜单的数据 formData 保存了所有的表单 left join.
    let R = this._deepMergeSourceToWeixinEncode(
      this.menuData,
      this.formData,
      []
    );

    console.log(R, "最终的结果集", this.publicName);
    res.button = R;
    res.name = this.publicName.name;

    return res;
  }
  // 合并本地数据格式化出来微信需要的数据
  // menuArray 元数据的菜单 formObj 关联表 res 结果集
  _deepMergeSourceToWeixinEncode(menuArray = [], formObj = {}, res = []) {
    // 获取格式化资源的工具
    const SOURCE_CONTROL = this.registerComPool[0].$utils;

    console.log(menuArray, formObj, "mmmm===>>>@@@@", SOURCE_CONTROL, res);

    const LEN = menuArray.length;

    // 定义结束条件
    if (0 == LEN) {
      return [];
    }

    // 开启循环暴力查找
    for (let i = 0; i < LEN; i++) {
      // 菜单
      const MENU_OBJ = menuArray[i];
      // 关联处formdata 也可以用定义的那个现成的
      const LEFT_JOIN_FORMOBJ = formObj[MENU_OBJ.id];
      // 获取操作的哪个表单
      const TYPE = LEFT_JOIN_FORMOBJ.content;
      // 获取表单对应的真是数据 如果REL_DATA.type 存在拿下面真是存在的数据  其余的根据Type 拼装
      const REL_DATA = LEFT_JOIN_FORMOBJ.sourceByContent[TYPE];

      // 后台返回如果是字符串的children直接解析
      if ("string" === typeof MENU_OBJ.children) {
        MENU_OBJ.children = JSON.parse(MENU_OBJ.children);
      }

      // 根据 MENU_OBJ 以及查询出来的 LEFT_JOIN_FORMOBJ 构造 结果集
      let R = {
        name: MENU_OBJ["title"],
        type: this._getMediaTypeByClientCode(TYPE, REL_DATA.type),
        // todo key 先不传了 基本上除了click没用后面加在研究。
        ...(MENU_OBJ.children.length > 0
          ? {}
          : this._fmtData(TYPE, REL_DATA.type, REL_DATA, SOURCE_CONTROL)),
      };

      let tmp =
        MENU_OBJ.children.length > 0
          ? this._deepMergeSourceToWeixinEncode(MENU_OBJ.children, formObj, [])
          : [];
      if (tmp.length > 0) {
        R.sub_button = tmp;
      }

      res.push(R);
      //   console.log(R, LEFT_JOIN_FORMOBJ, MENU_OBJ, REL_DATA, TYPE);
    }

    return res;
  }

  // 查询媒体类型
  // outType 外层的类型 inType 内层的类型
  // return 返回 真正的微信知道的类型
  _getMediaTypeByClientCode(outType = -1, inType = 0) {
    if (-1 == outType || -1 == inType) return;
    // 定义二维矩阵存储对应的类型
    const G = [];
    // 初始化矩阵对应二维空间
    for (let i = 0; i < this._getFormMemoryLimit(); i++) {
      G[i] = [];
    }
    // 这个过程有点矬手动把字典写死在这里了。
    G[0][1] = "click";
    G[0][2] = "media_id";
    G[0][3] = "click";
    G[0][4] = "media_id";
    G[0][0] = "media_id";
    // 关键字文档没有 - todo 音频也需要研究
    G[0][5] = "click";

    G[1][0] = "view";

    G[2][0] = "miniprogram";

    let res = G[outType][inType];

    // console.log(outType, inType);

    return res;
  }
  // 根据 TYPE REL_DATA.type 后去最后要传出去的数据
  _fmtData(outType = -1, inType = 0, rel = {}, control = {}) {
    if (-1 == outType || -1 == inType) return {};
    // 定义二维矩阵存储对应的类型
    const G = [];
    // 初始化矩阵对应二维空间
    for (let i = 0; i < this._getFormMemoryLimit(); i++) {
      G[i] = [];
    }

    G[0][0] = { key: "media_id", to: "media_id", need: 0 }; // todo 图文的需要研究下
    G[0][1] = { key: "text", to: "key" };
    G[0][2] = { key: "media_id", to: "media_id", need: 0 };
    G[0][3] = { key: "audio", to: "value", need: 1 }; // todo音频
    G[0][4] = { key: "media_id", to: "media_id", need: 0 };
    G[0][5] = { key: "keyword", to: "key" };
    G[1][0] = { key: "url", to: "url", need: 0 };

    let res = {};

    if (2 != outType) {
      res = {
        [G[outType][inType].to]: G[outType][inType].need
          ? control.media((rel[inType] || rel)[G[outType][inType].key])
          : (rel[inType] || rel)[G[outType][inType].key],
      };
    } else {
      // todo
      res = {
        url: rel.url,
        appid: rel.appId,
        pagepath: rel.pageUrl,
      };
    }

    console.log(outType, inType, rel, "------->>>>>");

    return res;
  }
  _getFormMemoryLimit() {
    return Math.max(Object.keys(this.formData).length, 10);
  }

  // 反解析
  decode(r = {}) {
    let res = {
      // 得到菜单
      menuData: [],
      // 得到表单
      formData: {},
    };

    this.publicName = r.publicName;
    this.initData(r.menuData, r.formData, r.currentFormInfoByMenuId);

    console.log(r, "-------->>>>>>");

    return res;
  }
}

export default new DataSourceOption();
