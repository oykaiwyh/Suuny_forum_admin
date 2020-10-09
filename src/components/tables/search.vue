<template>
  <div class="wrapper">
    <template v-if="item.type === 'radio'">
      <RadioGroup @on-change="handleChange" :value="inputValue">
        <Radio
          :label="obj.value"
          v-for="(obj, index) in finalRadio"
          :key="'search-radio-' + index"
        >
          <span>{{ obj.key }}</span>
        </Radio>
      </RadioGroup>
    </template>

    <template v-else-if="item.type === 'date'">
      <DatePicker
        type="daterange"
        placement="bottom-end"
        placeholder="请选择时间段"
        style="width: 200px"
        @on-change="handleChange"
      ></DatePicker>
    </template>

    <template v-else-if="item.type === 'select'">
      <Select
        v-model="selection"
        multiple
        style="width: 260px"
        :value="inputValue"
        @on-change="handleChange"
      >
        <Option
          v-for="obj in item.options"
          :value="obj.value"
          :key="obj.value"
          >{{ obj.key }}</Option
        >
      </Select>
    </template>

    <!-- 默认类型 -->
    <template v-else="item.type === 'input'">
      <Input
        :value="inputValue"
        @on-change="handleChange"
        clearable
        placeholder="输入关键字搜索"
        class="search-input"
      />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Array, Number],
      default: "",
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      radioOptions: [
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
      selection: [],
    };
  },
  computed: {
    inputValue() {
      return this.value;
    },
    finalRadio() {
      let result = {};
      if (this.item.type === "radio") {
        if (this.item.options) {
          result = this.item.options;
        } else {
          result = this.radioOptions;
        }
      }
      return result;
    },
  },
  methods: {
    handleClear(e) {
      if (e.target.value === "") this.insideTableData = this.value;
    },
    handleChange(value) {
      console.log(value);
      this.$emit("changeEvent", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: inline-block;
  margin: 0 10px;
}
</style>