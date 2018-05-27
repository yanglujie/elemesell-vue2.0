<template>
	<div class="ratingselect">
	  <div class="rating-type">
         <span class="item" :class="{'active':myselectType===2}" @click="select(2,$event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
         <span class="item" :class="{'active':myselectType===0}" @click="select(0,$event)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
         <span class="item bad" :class="{'badActive':myselectType===1}" @click="select(1,$event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
	  </div>
	  <div class="switch" @click="toggleContent($event)">
        <span class="icon-check_circle" :class="{'on':giveContent.onlyContent}"></span>
        <span class="text">只看有内容的评价</span>
	  </div>
	</div>
</template>
<script>
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
	export default{
      props: {
      	ratings: {
      		type: Array,
      		default() {
      			return [];
      		}
      	},
      	selectType: {
           type: Number,
           default: ALL
      	},
      	giveContent: {
      		type: Object,
      		default() {
             return {
               onlyContent: true
            };
          }
      	},
      	desc: {
      		type: Object,
      		default() {
      			return {
      				all: '全部',
      				positive: '满意',
      				negative: '不满意'
      			};
      		}
      	}
      },
      data: function() {
      	return {
      		myselectType: this.selectType
      	};
      },
      watch: {
      	selectType(val) {
      		this.myselectType = val;
      	},
      	myselectType(val) {
      		this.$emit('select-change', val);
      	}
      },
      computed: {
        positives() {
          return this.ratings.filter((rating) => {
            return rating.rateType === POSITIVE;
          });
        },
        negatives() {
          return this.ratings.filter((rating) => {
                return rating.rateType === NEGATIVE;
          });
        }
      },
      methods: {
      	select(type, event) {
         if (!event._constructed) {
           	return;
           }
            this.myselectType = type;
           // this.selectType = type;
           // this.$emit('update:select-type', type);
      	},
        toggleContent(event) {
           if (!event._constructed) {
            return;
           }
           this.giveContent.onlyContent = !this.giveContent.onlyContent;
           this.$emit('contentchange', this.giveContent.onlyContent);
        }
      }
	};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ratingselect
   .rating-type
      padding 18px 0
      margin 0 18px
      border-bottom 1px solid rgba(7,17,27,0.1)
      font-size 0
      .item
        display inline-block
        font-size 12px
        padding 8px 12px
        line-height 16px
        background rgba(0,160,220,0.2)
        color rgb(77,85,95)
        margin-right 8px
        border-radius: 1px
        .count
          font-size 8px
          padding-left 2px
        &.active
          color white
          background rgb(0,169,220)
        &.bad
          background rgba(77,85,93,0.2)
        &.badActive
          color white
          background #4d555d
    .switch
      font-size 12px
      width 100%
      padding 12px 0 12px 18px
      color rgb(147,153,159)
      border-bottom 1px solid rgba(7,17,27,0.1)
      .icon-check_circle
        margin-right 4px
        font-size 24px
        vertical-align middle
        &.on
          color #00c850
</style>