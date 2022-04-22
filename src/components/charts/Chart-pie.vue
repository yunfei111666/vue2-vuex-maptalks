<template>
  <div id="container"></div>
</template>

<script>
import { Pie } from "@antv/g2plot";

export default {
  name: "chart-pie",
  props: {
    pie: {
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
        { type: "正常", value: 19 },
        { type: "异常", value: 10 },
      ],
    };
  },
  methods: {
    init() {
      this.data = this.pie;

      const piePlot = new Pie(document.getElementById("container"), {
        forceFit: true,
        height: 300,

        title: {
          visible: true,
          text: "接口状态",
          position: "middle",
          style: {
            fontSize: 12,
            stroke: "#2d8cf0",
            lineWidth: 1,
            strokeOpacity: 0.5,
          },
        },
        color: ["#2db7f5", "#ed4014"],

        radius: 0.9,
        data: this.pie,
        angleField: "value",
        colorField: "type",
        label: {
          visible: true,
        },
        legend: {
          position: "right",
        },
      });
      piePlot.render();
    },
  },
  mounted() {
    if (this.type) {
      this.init();
    }
  },
  created() {},
  watch: {
    pie: function(n, o) {
      this.init();
    },
  },
};
</script>

<style></style>
