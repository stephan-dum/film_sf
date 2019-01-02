export default {
  props : {
    min : {
      type : Number,
      default : 0
    },
    max : {
      type : Number,
      default : 100
    },
    step : {
      type : Number,
      default : 1
    },
    name : {
      type : String,
      required : true
    },
    "aria-min" : String,
    "aria-max" : String
  },
  data() {
    let {
      ["min-value"] : minValue,
      ["max-value"] : maxValue,
    } = this.$attrs;

    if(!minValue) {
      minValue = this.min;
    }
    if(maxValue) {
      maxValue = this.max;
    }

    return {
      type : "number",
      minValue,
      maxValue
    };
  },
  computed : {
    output() {
      return parseInt(this["minValue"])+' - '+parseInt(this["maxValue"]);
    },
    minUsage() {
      return this.getUsage("minValue");
    },
    maxUsage() {
      return 100-this.getUsage("maxValue");
    },
    style() {
      return {
        left: this.minUsage+"%",
        right: this.maxUsage+"%"
      }
    }
  },
  mounted() {
    this.type = "range";
  },
  methods : {
    getUsage(property) {
      let value = parseFloat(this[property]);
      let { min, max } = this;

      return ((value-min)/(max-min))*100;
    },
    minInput(event) {
      let value = parseInt(event.target.value);

      this["minValue"] = value;

      if(value <= this.max && this["maxValue"] <= value) {
        this["maxValue"] = value;
      }
    },
    maxInput(event) {
      let value = parseFloat(event.target.value);

      this["maxValue"] = value;

      if(value >= this.min && this["minValue"] >= value) {
        this["minValue"] = value;
      }
    }
  }
}
