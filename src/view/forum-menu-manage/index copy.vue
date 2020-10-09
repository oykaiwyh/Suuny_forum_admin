<template>
  <!--  因为使用了iview-loader,所有组件都可以以 i- 开头 Input >>>  i-input -->
  <div>
    <Row :gutter="10">
      <Col span="6" :lg="5" :md="9" :sm="24" :xs="24">
        <Card :dis-hover="true" :shadow="true">
          <i-row type="flex" align="middle" justify="center">
            <ButtonGroup class="sunny-btn-group" :class="{ editing: isEdit }">
              <Button size="small" :disabled="isEdit">
                <Dropdown @on-click="addMenu">
                  <a href="javascript:void(0)">
                    <Icon type="md-add"></Icon>
                    <span class="sunny-dropdown">新增</span>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="bro">兄弟节点</DropdownItem>
                    <DropdownItem name="child" :disabled="menuData.length === 0"
                      >子节点</DropdownItem
                    >
                  </DropdownMenu>
                </Dropdown>
              </Button>
              <!-- <Button size="small" icon="md-add" @click="addMenu"></Button> -->
              <Button
                type="primary"
                size="small"
                icon="ios-create"
                @click="editMenu"
                :disabled="isEdit"
                >修改</Button
              >
              <Button
                type="error"
                size="small"
                icon="md-trash"
                @click="deleteMenu"
                :disabled="isEdit"
                >删除</Button
              >
            </ButtonGroup>
          </i-row>
          <Tree :data="menuData" @on-select-change="handleTreeChange"></Tree>
        </Card>
      </Col>
      <Col span="18" :lg="19" :md="15" :sm="24" :xs="24">
        <Card
          :dis-hover="true"
          :shadow="true"
          icon="ios-options"
          :title="$t('Menu Options')"
          style="margin-bottom: 10px"
        >
          <Form
            :disabled="!isEdit"
            ref="form"
            :model="formData"
            :rules="formRules"
            :label-width="80"
          >
            <FormItem label="菜单标题" prop="name">
              <i-input
                v-model="formData.name"
                placeholder="请输入菜单名称"
              ></i-input>
            </FormItem>
            <FormItem label="路径" prop="path">
              <i-input
                v-model="formData.path"
                placeholder="请输入菜单路由"
              ></i-input>
            </FormItem>
            <FormItem label="菜单类型">
              <Select v-model="formData.type" placeholder="请选择菜单类型">
                <Option value="menu">目录</Option>
                <Option value="resouce">资源</Option>
                <Option value="link">链接</Option>
              </Select>
            </FormItem>
            <FormItem label="组件" prop="component">
              <i-input
                v-model="formData.component"
                placeholder="请输入前端组件名称"
              >
                <span slot="prepend">()=>import('@</span>
                <span slot="append">.vue')</span>
              </i-input>
            </FormItem>
            <FormItem label="排序">
              <i-input
                v-model="formData.sort"
                placeholder="组件默认排序"
              ></i-input>
            </FormItem>
            <FormItem label="面包屑">
              不显示
              <Switch v-model="formData.hideInBread" />显示
            </FormItem>
            <FormItem label="菜单显示">
              不显示
              <Switch v-model="formData.hideInMenu" />显示
            </FormItem>
            <FormItem label="页面缓存">
              是
              <!-- Method 1 未配置iview-loader 需要使用i-switch-->
              <!-- <i-switch v-model="formData.notCache"></i-switch> -->
              <Switch v-model="formData.notCache" />否
            </FormItem>
            <FormItem label="图标">
              <i-input
                v-model="formData.icon"
                placeholder="请输入前端组件名称"
              ></i-input>
            </FormItem>
            <FormItem label="重定向">
              <i-input
                v-model="formData.redirect"
                placeholder="重定向组件"
              ></i-input>
            </FormItem>
            <FormItem v-if="isEdit">
              <Button type="primary" @click="submit()">确定</Button>
              <Button style="margin-left: 8px" @click="cancel()">取消</Button>
            </FormItem>
          </Form>
        </Card>
        <Card :dis-hover="true" :shadow="true" :title="$t('resources')">
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
              <Button @click="handleAdd" class="search-btn" type="primary">
                <Icon type="md-person-add" />&nbsp;&nbsp;添加
              </Button>
            </template>
          </tables>
          <Row type="flex" justify="space-between" align="middle">
            <Col class="ctrls" v-if="isEdit">
              <Button @click="handleDeleteBatch()">批量删除</Button>
              <Button @click="handleSetBatch()">批量设置</Button>
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
      </Col>
    </Row>
  </div>
</template>

<script>
import { sortObj } from "@/libs/util";
import Tables from "_c/tables";

export default {
  components: {
    Tables,
  },
  data() {
    return {
      // 菜单编辑状态
      isEdit: false,
      selectNode: [],
      type: "",
      // 菜单
      menuData: [],
      // 表单
      formData: {
        title: "",
        name: "", // 组件名称
        path: "",
        component: "",
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: "",
        sort: 0,
        redirect: "",
        type: "menu",
        link: "",
        operations: [],
      },
      formRules: {
        title: [
          {
            required: true,
            message: "菜单名称不得为空",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "组件名称不得为空",
            trigger: "blur",
          },
        ],
        path: [
          {
            required: true,
            message: "路由路径不得为空",
            trigger: "blur",
          },
        ],
        component: [
          {
            required: true,
            message: "前端组件不得为空",
            trigger: "blur",
          },
        ],
      },
      //表格
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          hidden: true,
        },
        {
          title: "资源名称",
          key: "name",
          search: {
            type: "input",
          },
          align: "center",
        },
        {
          title: "资源路径",
          key: "path",
          search: {
            type: "input",
          },
          align: "center",
        },
        {
          title: "请求类型",
          key: "method",
          search: {
            type: "input",
          },
          align: "center",
          render: (h, params) => {
            return h("div", params.row.method.toUpperCase());
          },
        },
        {
          title: "资源类型",
          key: "type",
          search: {
            type: "radio",
            options: [
              {
                key: "全部",
                value: "",
              },
              {
                key: "接口",
                value: "api",
              },
              {
                key: "按钮",
                value: "btn",
              },
            ],
          },
          align: "center",
        },
        {
          title: "资源描述",
          key: "regmark",
          search: {
            type: "input",
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
      // 分页
      total: 0,
      page: 1,
      limit: 10,
      pageArr: [10, 20, 30, 50, 100],

      // 标签组件
      showSet: false,
      selection: [],
    };
  },
  mounted() {
    window.vue = this;
  },
  methods: {
    // 菜单栏
    addMenu(type) {
      this.type = type;
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.isEdit = true;
      } else {
        this.$Message.error("请选择菜单节点后再添加！");
      }
    },
    editMenu() {
      if (this.selectNode.length > 0) {
        this.isEdit = true;
        this.formData = { ...this.selectNode[0] };
      } else {
        this.$Message.error("请选择菜单节点后再编辑！");
      }
    },
    deleteMenu() {
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.$Modal.confirm({
          title: "确定删除吗？",
          content: `删除${this.selectNode[0].title}的菜单项吗？`,
          onOk: () => {
            const deleteNode = (tree, node) => {
              for (let index = 0; index < tree.length; index++) {
                const currentNode = tree[index];
                if (currentNode.nodeKey === node.nodeKey) {
                  tree.splice(index, 1);
                  return tree;
                } else {
                  if (currentNode.children && currentNode.children.length > 0) {
                    deleteNode(currentNode.children, node);
                  }
                }
              }
              return tree;
            };
            this.menuData = deleteNode(this.menuData, this.selectNode[0]);
            this.selectNode = [];
          },
        });
      } else {
        this.$Message.error("请选择菜单节点后再添加！");
      }
    },
    handleTreeChange(item) {
      this.selectNode = item;
    },

    // 表格
    handleRowEdit() {},
    handleRowRemove() {},
    handleSelect() {},
    handleSearch() {},
    submit() {
      // 1、获取formData中的数据 -> menuData
      //     a、type -> 数据插入的节点
      //     b、数据需要按照tree的数据格式进行格式化 -> title name
      // 2. 提交对应的数据到后台接口

      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            ...this.formData,
            title: this.formData.name,
            expand: true,
          };

          if (this.type === "bro") {
            // 兄弟节点
            if (this.menuData.length === 0) {
              this.menuData.push(data);
              this.isEdit = false;
              this.$refs.form.resetFields();
            } else {
              const selectNode = this.selectNode[0];
              // this.menuData=this.menuData -> children -> ... -> selectNode
              //   1、 parent 2、selectNode -> new menuData
              const getMneu = (parent, select) => {
                // 1. 遍历parent -> select push
                // 2.children -> push child
                // 3.renturn parent

                for (let index = 0; index < parent.length; index++) {
                  const item = parent[index];
                  // 去重
                  if (item.name === select.name) {
                    parent.push(data);
                    // 排序
                    parent = sortObj(parent, "sort");
                    return parent;
                  } else {
                    if (item.children && item.children.length > 0) {
                      getMneu(item.children, select);
                    }
                  }
                }
                return parent;
              };
              this.menuData = getMneu(this.menuData, selectNode);
            }
          } else if (this.type === "child") {
            // 子节点
            if (typeof this.selectNode[0].children === "undefined") {
              // this.$set(data,key,value) 1. 要设置的数据源 2.key 3.要设置key的值
              this.$set(this.selectNode[0], "children", [data]);
            } else {
              // 排序
              let arr = [...this.selectNode[0].children, data];
              arr = sortObj(arr, "sort");

              this.$set(this.selectNode[0], "children", arr);
            }
          } else {
            // 更新菜单节点
            const updateNode = (tree, node) => {
              for (let index = 0; index < tree.length; index++) {
                const currentNode = tree[index];
                if (currentNode.nodeKey === node.nodeKey) {
                  //   tree[index] = node;
                  tree.splice(index, 1, node);
                  return tree;
                } else {
                  if (currentNode.children && currentNode.children.length > 0) {
                    updateNode(currentNode.children, node);
                  }
                }
              }
              return tree;
            };
            this.menuData = updateNode(this.menuData, data);

            //method 1 this.selectNode[0] = data;
            // method 2
            this.$set(this.selectNode, 0, data);
          }
          // 恢复表单默认状态
          this.initFields();
        } else {
          this.$Message.error("请检验表单数据！");
        }
      });
    },
    cancel() {
      this.initFields();
    },
    // 初始化表单数据
    initFields() {
      this.isEdit = false;
      this.$refs.form.resetFields();
      this.formData = {
        title: "",
        name: "", // 组件名称
        path: "",
        component: "",
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: "",
        sort: 0,
        redirect: "",
        type: "menu",
        link: "",
        operations: [],
      };
      this.type = "";
    },
    // 分页
    onPageChange(page) {
      this.page = page;
    },
    onPageSizeChange(size) {
      this.limit = size;
    },

    // 添加资源
    handleAdd() {},

    // 批量设置相关
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
  },
};
</script>

<style lang="scss" >
// 弹性布局可能出现的问题：
// @media设置的尺寸 和 栅格布局临界的尺寸如果接近相等时，可能会出现两个之间的切换闪烁问题
// 1、调整栅格比例 2、调整media尺寸大小
@media screen and (max-width: 1380px) {
  .sunny-btn-group {
    .ivu-icon {
      & + span {
        display: none;
      }
    }
    .sunny-dropdown {
      display: none;
    }
  }
}
.sunny-btn-group {
  // 两者等价
  //   .ivu-icon + span {
  //     margin-left: 0px;
  //   }
  //   + ：相邻的下一个元素
  //   & : 父级元素
  .ivu-icon {
    & + span {
      margin-left: 0;
    }
  }
  &.editing {
    a {
      color: #dcdee2;
    }
    .ivu-btn-primary {
      border-color: #dcdee2 !important;
    }
    button:first-child {
      border-right: 0;
    }
  }
}
</style>