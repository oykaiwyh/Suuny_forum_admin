<template>
  <div>
    <Card>
      <tables
        ref="tables"
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
        @on-selection-change="handleSelect"
        @searchEvent="handleSearch"
      >
        <template v-slot:table-header>
          <Button @click="handleAddUser" class="search-btn" type="primary">
            <Icon type="md-person-add" />&nbsp;&nbsp;新增用户
          </Button>
        </template>
      </tables>
      <Row type="flex" justify="space-between" align="middle">
        <Col class="ctrls">
          <Button @click="handleDeleteBatch()">批量删除</Button>
          <Button @click="handleSetBatch()">批量设置</Button>
          <Button style="margin: 10px 0" type="primary" @click="exportExcel">
            <Icon type="md-download"></Icon>导出表格
          </Button>
        </Col>
        <Col>
          <Page
            :total="total"
            :current="page"
            :page-size="limit"
            :page-size-opts="pageArr"
            show-elevator
            show-sizer
            show-total
            @on-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
          />
        </Col>
      </Row>
    </Card>
    <EditModel
      :isShow="showEdit"
      :item="currentItem"
      :roles="roles"
      @editEvent="handleItemEdit"
      @changeEvent="handleChangeEvent"
    ></EditModel>
    <AddModel
      :isShow="showAdd"
      :roles="roles"
      @editEvent="handleItemAdd"
      @changeEvent="handleAddChangeEvent"
    ></AddModel>
    <BatchSet
      :isShow="showSet"
      :roles="roles"
      @editEvent="handleItemSet"
      @changeEvent="handleSetChangeEvent"
    ></BatchSet>
  </div>
</template>

<script>
import {
  getUserList,
  updateUsertById,
  deleteUserById,
  addUser,
  updateUsertBatchById,
  getRoleNames,
} from "@/api/admin";
import Tables from "_c/tables";
import EditModel from "./edit";
import AddModel from "./add";
import BatchSet from "./batchSet";
import dayjs from "dayjs";
export default {
  name: "user_management",
  components: {
    Tables,
    EditModel,
    AddModel,
    BatchSet,
  },
  data() {
    return {
      // 表格数据
      page: 1,
      limit: 10,
      total: 40,
      roles: [],
      pageArr: [10, 20, 30, 50, 100],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          hidden: true,
        },
        {
          title: "用户昵称",
          key: "name",
          minWidth: 140,
          search: {
            type: "input",
          },
        },
        {
          title: "登录名",
          key: "username",
          minWidth: 160,
          search: {
            type: "input",
          },
        },
        {
          title: "角色",
          key: "roles",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            const roleNames = params.row.roles
              .map((o) => this.roleNames[o])
              .join(",");
            return h("div", [h("span", roleNames)]);
          },
          search: {
            type: "select",
            options: [
              {
                key: "超级管理员",
                value: "super_admin",
              },
              {
                key: "管理员",
                value: "admin",
              },
              {
                key: "普通用户",
                value: "user",
              },
            ],
          },
        },
        {
          title: "积分",
          key: "favs",
          align: "center",
          hidden: true,
          minWidth: 80,
        },
        {
          title: "是否禁用",
          key: "status",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h("span", params.row.status === "0" ? "否" : "是"),
            ]);
          },
          search: {
            type: "radio",
            options: [
              {
                key: "全部",
                value: "",
              },
              {
                key: "否",
                value: "0",
              },
              {
                key: "是",
                value: "1",
              },
            ],
          },
        },
        {
          title: "是否是VIP",
          key: "isVip",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            return h("div", [
              h("span", params.row.isVip === "0" ? "否" : "是"),
            ]);
          },
          search: {
            type: "radio",
            options: [
              {
                key: "全部",
                value: "",
              },
              {
                key: "否",
                value: "0",
              },
              {
                key: "是",
                value: "1",
              },
            ],
          },
        },
        {
          title: "创建时间",
          key: "created",
          align: "center",
          minWidth: 180,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                dayjs(params.row.created).format("YYYY-MM-DD HH:mm:ss")
              ),
            ]);
          },
          search: {
            type: "date",
          },
        },
        {
          title: "设置",
          key: "settings",
          slot: "action",
          hidden: true,
          fixed: "right",
          width: 100,
          align: "center",
        },
      ],
      tableData: [],
      //编辑组件model
      showEdit: false,
      showAdd: false,
      showSet: false,
      currentItem: {},
      currentIndex: 0,
      // 标签组件
      showSet: false,
      selection: [],
      // 搜索
      options: [],
    };
  },
  computed: {
    roleNames() {
      const tmp = {};
      this.roles.forEach((item) => {
        tmp[item.role] = item.name;
      });
      return tmp;
    },
  },
  mounted() {
    this._getList();
    this._getRoleNames();
  },
  methods: {
    _getList() {
      getUserList({
        page: this.page - 1,
        limit: this.limit,
        option: this.options,
      }).then((res) => {
        this.tableData = res.data;
        this.total = res.total;
      });
    },
    // 获取角色名称
    _getRoleNames() {
      getRoleNames().then((res) => {
        if (res.code === 200) {
          this.roles = res.data;
        }
      });
    },
    // 导出excel
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`,
      });
    },
    //批量删除
    handleDeleteBatch() {
      if (this.selection.length === 0) {
        this.$Message.info("请选择需要删除的数据！");
        return;
      }
      const msg = this.selection.map((o) => o.username).join(",");
      this.$Modal.confirm({
        title: "确定删除用户吗？",
        content: `删除${msg}的用户`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id);
          deleteUserById(arr).then((res) => {
            if (res.code === 200) {
              this.tableData = this.tableData.filter(
                (item) => !arr.includes(item._id)
              );

              this.$Message.success("删除成功！");
            }
          });
          //   userDispatch.use("delete", { ids: arr }).then(res => {
          //     // this.tableData.splice(index, 1)
          //     this.tableData.filter(item => !arr.includes(item._id));
          //     this.$Message.success("删除成功！");
          //     //  this._getList()
          //   });
        },
        onCancel: () => {
          this.$Message.info("取消操作！");
        },
      });
    },
    //批量设置 vip 禁言 角色
    handleSetBatch() {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info("请选择需要设置的数据！");
        return;
      }
      // 批量进行设置 -> vip, 禁言, 角色
      this.showSet = true;
    },

    // 编辑用户
    handleRowEdit(row, index) {
      this.showEdit = true;
      this.currentIndex = index;
      this.currentItem = { ...row };
    },
    //删除用户
    handleRowRemove(row, index) {
      this.$Modal.confirm({
        title: "确定删除该用户嘛？",
        content: `删除${row.name}的用户`,
        onOk: () => {
          deleteUserById(row._id)
            .then((res) => {
              if (res.code === 200) {
                this.$Message.info("成功删除！");
                // 只是页面显示少一，不去重新请求接口
                this.tableData = this.tableData.filter(
                  (item) => item._id !== row._id
                );
                // this.tableData.splice(index, 1)
              }
            })
            .catch((err) => {
              this.$Message.info("删除失败！原因：" + err);
            });
        },
        onCancel: () => {
          this.$Message.info("取消操作！");
        },
      });
    },
    // 全选用户
    handleSelect(selection) {
      this.selection = selection;
    },
    // 分页
    onPageChange(page) {
      this.page = page;
      this._getList();
    },
    onPageSizeChange(size) {
      this.limit = size;
      this._getList();
    },

    /**
     * 编辑用户
     */
    handleChangeEvent(value) {
      this.showEdit = value;
    },
    handleItemEdit(item) {
      updateUsertById(item).then((res) => {
        if (res.code === 200) {
          this.tableData.splice(this.currentIndex, 1, item);
        }
      });
      this.showEdit = false;
    },
    // 新增用户
    handleAddUser() {
      this.showAdd = true;
    },

    handleAddChangeEvent(value) {
      this.showAdd = value;
    },
    // 添加用户
    handleItemAdd(item) {
      addUser(item).then((res) => {
        if (res.code === 200) {
          // this.tableData[this.currentIndex] = item
          this.tableData.splice(0, 0, res.data);
        }
      });
      //   userDispatch.use("add", item).then(res => {
      //     if (res.code === 200) {
      //       // this.tableData[this.currentIndex] = item
      //       this.tableData.splice(0, 0, res.data);
      //     }
      //   });
    },
    // 批量设置模态框
    handleItemSet(settings) {
      const msg = this.selection.map((o) => o.username).join(",");
      this.$Modal.confirm({
        title: "确定修改用户吗？",
        content: `修改${msg}的用户`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id);
          //   userDispatch.use("batch", { ids: arr, settings }).then(res => {
          updateUsertBatchById({ ids: arr, settings }).then((res) => {
            // this.tableData.splice(index, 1)
            this.tableData.map((item) => {
              if (arr.includes(item._id)) {
                for (var keys of Object.keys(settings)) {
                  item[keys] = settings[keys];
                }
              }
            });
            this.$Message.success("批量设置成功！");
            //  this._getList()
          });
        },
        onCancel: () => {
          this.$Message.info("取消操作！");
        },
      });
    },
    // 批量设置显示框
    handleSetChangeEvent(value) {
      this.showSet = value;
    },
    // 搜索
    handleSearch(value) {
      // 判断是否有新的查询内容的传递，把分页数据归0
      console.log(value);
      console.log(this.option);
      if (
        (typeof this.options.search !== "undefined" &&
          value.search !== this.options.search) ||
        this.options === {}
      ) {
        this.page = 1; // 从1开始
      }
      this.options = value;
      this._getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.ctrls {
  button {
    margin-right: 10px;
  }
}
</style>
