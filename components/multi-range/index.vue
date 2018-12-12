<!--
  credit to:
    https://css-tricks.com/sliding-nightmare-understanding-range-input/
    http://www.simple.gy/blog/range-slider-two-handles/
-->
<template>
  <div class="multirange">

    <label
      :aria-label="aria"
      @input="setValue"
      @mousedown="setValue"
    >
      <input
        :name="name+'_min'"
        :style="minstyle"
        :value="minstyle['--val']"
        :step="step"
        :min="minstyle['--min']"
        :max="minstyle['--max']"
        data-id="min"
        type="range"
      >
      <input
        :name="name+'_max'"
        :style="maxstyle"
        :value="maxstyle['--val']"
        :step="step"
        :min="maxstyle['--min']"
        :max="maxstyle['--max']"
        data-id="max"
        type="range"
      >
    </label>
    <output
      :value="minstyle['--val']+' - '+maxstyle['--val']"
    />

  </div>
</template>
<style lang="scss" scoped>
  $track-h: .25em;
  $thumb-d: 1.5em;

  @mixin track($fill, $left, $right) {
  	box-sizing: border-box;
  	border: none;
    height: $track-h;
  	background: $color_main;

  	@if $fill == 1 {
  		.js & {
  			background: linear-gradient($left, $left)
  				0/ var(--sx) 100% no-repeat $right;
  		}
  	}
  }

  @mixin thumb() {
  	box-sizing: border-box;
  	border: none;
  	width: $thumb-d;
    height: $thumb-d;
  	border-radius: 50%;
  	background: $color_main;
  }

  .multirange {
    position:relative;

    output:before {
      content: attr(value);
      display: block;
      position:absolute;
      top:-0.25em;
      right:0;
      padding:0.5em;
      box-sizing:border-box;
      transform: translateY(-100%);
      color:$color_white;
      background-color:$color_main;
      border-radius:0.25em;
    }
  }

  .js .multirange > label {
    display:flex;
  }

  [type="range"] {
    min-width: 0;
    outline: none;
  	margin: 0;
  	padding: 0;
    height: $thumb-d;
  	background: transparent;
    width:100%;

    --range: calc(var(--max) - var(--min));
  	--ratio: calc((var(--val) - var(--min))/var(--range));
  	--sx: calc(.5*#{$thumb-d} + var(--ratio)*(100% - #{$thumb-d}));

    &, &::-webkit-slider-thumb {
  		-webkit-appearance: none;
      margin: 0;
      padding: 0;
  	}

  	&[data-id="min"]::-webkit-slider-runnable-track {
  		@include track(1, $color_dark_gray, $color_main)
  	}


  	&[data-id="max"]::-webkit-slider-runnable-track {
  		@include track(1, $color_main, $color_dark_gray)
  	}

    &[data-id="min"]::-moz-range-track,
  	&[data-id="min"]::-ms-track {
      @include track(0, $color_dark_gray, $color_main)
    }


  	&[data-id="max"]::-moz-range-track,
  	&[data-id="max"]::-ms-track {
      @include track(0, $color_main, $color_dark_gray)
    }

    &::-ms-fill-lower,
  	&::-moz-range-progress {
      height: $track-h;
    	background: $color_dark_gray
    }

  	&::-webkit-slider-thumb {
  		margin-top: .5*($track-h - $thumb-d);
  		@include thumb
  	}

  	&::-moz-range-thumb { @include thumb }
  	&::-ms-thumb {
  		margin-top: 0;
  		@include thumb
  	}

  	&::-ms-tooltip { display: none }
  }
</style>
<script>
  export default {
    data() {
      let {
        min = 0,
        max = 100,
        step = 1,
        name = "",
        ["min-value"] : minValue,
        ["max-value"] : maxValue,
        ["aria-label"] : aria = ""
      } = this.$attrs;

      min = parseInt(min);
      max = parseInt(max);

      if(!minValue) {
        minValue = min;
      }
      if(!maxValue) {
        maxValue = max;
      }

      let mid = Math.floor((max-min)/2)+min;

      return {
        max,
        min,
        step,
        name,
        aria,
        minstyle : {
          "--val" : minValue,
          "--min" : min,
          "--max" : mid
        },
        maxstyle : {
          "--val" : maxValue,
          "--min" : mid+1,
          "--max" : max
        },
      };
    },
    methods : {
      setValue(event) {
        let target = event.target;


        let pivot;

        if(target.dataset.id == "min") {
          if (target.valueAsNumber >= Number(target.max)) {
      	    pivot = Math.min(this.max - 1, Number(target.max) + 2);
          }
        }

        if(target.dataset.id == "max") {
          if(target.valueAsNumber <= Number(target.min)) {
          	pivot = Math.max(this.min + 1, Number(target.min) - 2);
          }
        }

        if(pivot != null) {
        	this.minstyle['--max'] = pivot-1;
          this.maxstyle['--min'] = pivot + 1;
        }

        this.minstyle["flex-grow"] = this.minstyle['--max']-this.minstyle['--min']+1;
        this.maxstyle["flex-grow"] = this.maxstyle['--max']-this.maxstyle['--min']+1;

        this[target.dataset.id+"style"]['--val'] = target.value;

      }
    }
  }
</script>
