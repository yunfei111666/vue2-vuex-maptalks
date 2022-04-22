<template>
  <div id="chart"></div>
</template>

<script>
import { Column } from "@antv/g2plot";

export default {
  name: "Chart-column",
  props: {
    column: {
      type: Array,
      default() {
        return [];
      },
    },
    type: Number,
  },
  data() {
    return {
      data: [
        { type: "get", value: 16 },
        { type: "post", value: 15 },
        { type: "put", value: 24 },
        { type: "delete", value: 10 },
      ],
    };
  },
  methods: {
    init() {
      this.data = this.column;

      const columnPlot = new Column(document.getElementById("chart"), {
        title: {
          visible: true,
          text: "接口类型统计",
          position: "middle",
          style: {
            fontSize: 12,
            stroke: "#2d8cf0",
            lineWidth: 1,
            strokeOpacity: 0.5,
          },
        },
        colorField: "type",
        color: ["#2db7f5", "#19be6b", "#ff9900", "#ed4014"],
        forceFit: true,
        data: this.data,
        xField: "type",
        yField: "value",
        height: 300,
        meta: {
          value: {
            alias: " ",
          },
          type: {
            alias: " ",
          },
        },
        legend: {
          visible: true,
          position: "right",
        },
      });

      columnPlot.render();
    },

    oldInit() {
      const columnPlot = new Column(document.getElementById("chart"), {
        title: {
          visible: true,
          text: "接口类型统计",
          position: "middle",
          style: {
            fontSize: 12,
            stroke: "#2d8cf0",
            lineWidth: 1,
            strokeOpacity: 0.5,
          },
        },
        colorField: "type",
        color: ["#2db7f5", "#19be6b", "#ff9900", "#ed4014"],
        forceFit: true,
        data: this.data,
        xField: "type",
        yField: "value",
        height: 300,
        meta: {
          value: {
            alias: " ",
          },
          type: {
            alias: " ",
          },
        },
        legend: {
          visible: true,
          position: "right",
        },
      });

      columnPlot.render();
    },
  },
  mounted() {
    if (this.type) {
      this.init();
    }
  },
  created() {},
  watch: {
    column: function(n, o) {
      console.log(n, o);
      this.init();
    },
  },
};
</script>

<style></style>
