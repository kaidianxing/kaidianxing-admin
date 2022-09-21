<template>
  <kdx-content-bar>
    <kdx-header-bar class="header">
      <Button type="primary" @click="isShow = true" :disabled="noManagePerm"
        >+添加客服</Button
      >
      <Form ref="form" class="form_wraps" inline :label-width="120"  @submit.native.prevent>
        <FormItem label="客服名称：" prop="service_name">
          <Input
            type="text"
            v-model="service_name"
            placeholder="请输入客服名称"
            @on-enter="handleSearch"
          ></Input>
        </FormItem>
        <div class="ivu-form-item-btn">
          <Button type="primary" @click="handleSearch">搜索</Button>
          <Button type="text" @click="handleReset">重置</Button>
        </div>
      </Form>
    </kdx-header-bar>
    <div class="content">
      <div class="table-list">
        <Table
          ref="table"
          :columns="columns"
          :data="data"
          :loading="loading"
        ></Table>
      </div>
      <div class="footer-page">
        <kdx-page-component
          :current="page.page"
          ref="page"
          :total="total"
          @on-change="handlePageChange"
        ></kdx-page-component>
      </div>
    </div>
    <kdx-modal-frame
      :value="isShow"
      title="创建客服"
      width="700"
      :ok-text="model.id ? '保存' : '创建'"
      ok-cancel="取消"
      @on-ok="save"
      @on-cancel="hide"
    >
      <div class="service_modal_wrap">
        <Form
          ref="form_modal"
          class="form_wraps"
          :model="model"
          :rules="rules"
          inline
          :label-width="120"
        >
          <FormItem label="选择企业：" prop="company_id">
            <Select v-model="model.company_id" class="width-500">
              <Option
                v-for="item in companyList"
                :value="item.id"
                :key="item.id"
                >{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="客服名称：" prop="name">
            <Input
              maxlength="30"
              show-word-limit
              type="text"
              v-model="model.name"
              placeholder="请输入企业名称"
              class="width-500"
            ></Input>
          </FormItem>
          <FormItem label="客服链接：" prop="link">
            <Input
              type="textarea"
              v-model="model.link"
              placeholder="请输入客服链接"
              class="width-500"
            ></Input>
            <kdx-hint-text
              >请输入正确有效的企业微信客服账号链接，若已经正式对外绑定到商城，更换链接<br />时需要重新进行选择</kdx-hint-text
            >
          </FormItem>
        </Form>
      </div>
    </kdx-modal-frame>
  </kdx-content-bar>
</template>

<script>
export default {
  name: "servie_manage",
  props: {},
  data() {
    return {
      companyList: [],
      isShow: false,
      service_name: "",
      model: {
        company_id: "",
        name: "",
        link: "",
        id: "",
      },
      columns: [
        {
          title: "企业名称",
          key: "company_name",
        },
        {
          title: "客服名称",
          key: "name",
        },
        {
          title: "客服链接",
          key: "link",
        },
        {
          title: "创建时间",
          key: "create_time",
        },
        {
          title: "操作",
          key: "action",
          with: 150,
          render: (h, params) => {
            return (
              <div>
                <a
                  class={this.noManagePerm ? "disabled-btn" : "btn-item"}
                  onClick={() => {
                    if (this.noManagePerm) return;
                    this.editShow(params.row);
                  }}
                >
                  编辑
                </a>
                <a
                  onClick={() => {
                    if (this.noManagePerm) return;
                    this.delConfirm(params.row.id);
                  }}
                  class={this.noManagePerm ? "disabled-btn" : "btn-item"}
                >
                  删除
                </a>
              </div>
            );
          },
        },
      ],
      data: [],
      total: 0,
      page: {
        pagesize: 10,
        page: 1,
      },
      loading: false,

      rules: {
        company_id: [{ required: true, message: "请选择企业名称" }],
        name: [{ required: true, message: "请输入客服名称" }],
        link: [{ required: true, message: "请输入客服链接" }],
      },
    };
  },

  computed: {
    noManagePerm() {
      //管理权限
      return !this.$getPermMap("wechatCustomerService.customer-service.manage");
    },
  },
  created() {
    this.getList();
    this.getCompanyList();
  },
  methods: {
    //添加企业
    save() {
      this.$refs.form_modal.validate((valid) => {
        if (!valid) return;
        this.model.id ? this.editService() : this.addService();
      });
    },
    addService() {
      this.$api.customerApi.addService(this.model).then((res) => {
        const { error } = res;
        if (error == 0) {
          this.$Message.success("创建成功");
          this.hide();
          this.getList();
        }
      });
    },

    //编辑
    editShow(sevicesitem) {
      this.isShow = true;
      const hasCom = this.companyList.filter(item => item.id == sevicesitem.company_id)
      console.log('hasCom-------------------',sevicesitem.link.indexOf('?'),sevicesitem);
      sevicesitem.link = sevicesitem.link.slice(0,sevicesitem.link.indexOf('?'))
      
      if(!hasCom[0]) {
        sevicesitem.company_id = ""
      }
      this.model = { ...sevicesitem };
    },
    editService() {
      this.$api.customerApi.editService(this.model).then((res) => {
        const { error } = res;
        if (error == 0) {
          this.$Message.success("编辑成功");
          this.hide();
          this.getList();
        }
      });
    },

    hide() {
      this.isShow = false;
      this.$refs.form_modal.resetFields()
      this.model = {
        company_id: "",
        name: "",
        link: "",
        id: "",
      }
      
    },

    //删除
    delConfirm(id) {
      this.$Modal.confirm({
        title: "您确定要删除当前客服？",
        content:
          "<div style='color:#ff0000c7;'>如果咨询入口已正式对外，建议先下掉咨询入口后再删除账号</div>",
        onOk: () => {
          this.del(id);
        },
      });
    },
    del(id) {
      this.$api.customerApi.delService({ id: id }).then((res) => {
        const { error } = res;
        if (error == 0) {
          console.log(res);
          this.getList();
          this.$Message.success("删除成功");
        }
      });
    },

    /*
     * 页码改变
     *@params {page} 页码改变对象
     */
    handlePageChange(page) {
      this.page.page = page.pageNumber;
      this.page.pagesize = page.pageSize;
      this.getList();
    },
    handleSearch() {
      this.getList();
    },

    handleReset() {
      this.service_name = "";
      this.page.page = 1;
      this.getList();
    },

    getList() {
      console.log("--------------a---");
      const params = {
        name: this.service_name,
        ...this.page,
      };
      this.$api.customerApi.getServiceList(params).then((res) => {
        const {
          error,
          data: { list, total },
        } = res;
        if (error == 0) {
          this.data = list;
          this.total = total;
        }
      });
    },

    getCompanyList() {
      const params = {
        only_list: 1,
      };
      this.$api.customerApi.getCompanyList(params).then((res) => {
        const {
          error,
          data: { list },
        } = res;
        if (error == 0) {
          this.companyList = list;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.search .content {
  width: 100%;
  padding: 0 20px;
}
.form_wraps {
  float: right;
}
/deep/.btn-item {
  margin-left: 10px;
}
/deep/.disabled-btn {
  margin-left: 10px;
  color: #262b3099;
}
.service_modal_wrap {
  margin: 40px 0 80px;
}
.header {
    margin-top: 20px;
}
.content {
    padding: 0 20px;
    background: #fff;
}
</style>