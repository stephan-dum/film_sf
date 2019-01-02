export default {
  namespaced : true,
  state() {
    return {
      min : 0,
      max : 100,
      step : 1,
      minValue : 0,
      maxValue : 100,
      name : "",
      aria : "",
      type : "number"
    };
  },
  mutations : {
    init(state, attrs) {
      let {
        min,
        max,
        step,
        name,
        ["min-value"] : minValue,
        ["max-value"] : maxValue,
        ["aria-label"] : aria
      } = attrs;

      if("min" in attrs) {
        this.min = parseInt(attrs.min);
      }
      if("max" in attrs) {
        this.max = parseInt(attrs.max);
      }
      if("step" in attrs) {
        this.min = parseInt(attrs.step);
      }
      if("name" in attrs) {
        this.name = [attrs.name];
      }
      if("min-value" in attrs) {
        this.minValue = parseInt(attrs["min-value"]);
      }
      if("max-value" in attrs) {
        this.maxValue = parseInt(attrs["max-value"]);
      }
      if("aria-label" in attrs) {
        this.aria = attrs["aria-label"];
      }
    },
    toMultiRange(state) {
      state.type="range";
    }
  }
}
