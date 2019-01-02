<template>
  <input
    :type="type"
    :step="step"
    :min="min"
    :max="max"
    :value="value"
    :name="name+'['property']'"
    :style="'width:'+width"
    @input="input"
  >
</template>
<script>
  export default {
  /*  props : {
      min : {
        type : Number,
        default : 0
      },
      max : {
        type : Number,
        default : 100
      },
      */
      step : {
        type : Number,
        default : 1
      },
      name : {
        type : String,
        required : true
      },
      property : {
        type : String,
        required : true
      }
    },
    computed : {
      usage() {
        if(this.property == "min") {
          return this.max/this.value;
        }

        return 1-this.max/this.value;
      },
      /*min() {
        if(
          this.property == "min"
          || this.type == "number"
        ) {
          return this.min;
        }


      },
      max() {
        if(
          this.property == "max"
          || this.type == "number"
        ) {
          return this.max;
        }

        this.value

        this.max
      },*/
      value() {
        return this._value;
      }
    },
    data() {
      let {
        min = 0,
        max = 100,
        value
      } = this.$attrs;

      this.computed.usage.call(this);

      return {
        type : "number",
        _width:  50,
        _max,
        _min,
        _value
      }
    }
  }
</script>
