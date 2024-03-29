<template>

  <!-- I created my own select to set css correctly -->

  <div :id="'selectWrapper' + this.id"
    class='selectWrapper' 
    @focusout='this.handleOutClick()'
    tabindex="0">

    <div class="selectLabelWrapper" v-if="this.labelValue != ''">
      {{ this.labelValue }}
    </div>

    <div class="selectBoxWrapper">
      <div class='selectBox'
        :id="this.id"
        :name="this.name"
        ref='selectBox'
        :style="{
          'color': this.cFontColor,
          'background-color': this.cBackgroundColor,
          'border': (this.borderVisible ? '1px solid ' + this.cBorderColor : 'none'),
          'border-radius': (this.borderVisible ? '1px' : '0'),
          'padding': this.selectBoxPadding,
          'font-weight': this.cFontWeight,
          'font-size': this.cFontSize,
        }"
        @click="this.handleSelClick()">

        {{ this.actualOptSelected != null ? this.items[this.actualOptSelected].label : this.placeholder }}
        <font-awesome-icon v-if="this.iconVisible && !this.disabled"
          class='selchevron'
          icon='fa-solid fa-chevron-down'
        />
      
      </div>

      <div class='selectOpts' v-show="this.showOptsT"
        ref='selectOpts'
        :style="{
          'color': this.cFontColor,
          'background-color': this.cBackgroundColor,
          'border-color': this.cBorderColor,
          'min-width': this.selectOptsWidth,
          'font-weight': this.cFontWeight,
          'font-size': this.cFontSize,
          }">
        <ul ref='selectUl'>
          <li v-for="(item, index) in this.items" :key="index" ref='opts'
            class='selectOpt'
            :value="item.value"
            @mouseover="optMouseover(index)"
            @mouseout="optMouseout(index)"
            @click="this.handleOptClick(index)">

            {{item.label}}

          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script>

import Utils from '../js/utils.js'

export default {

  name: 'SelectCustom',

  props: {
    id: String,
    name: String,
    items: Array,
    labelValue: {
      default: '',
      type: String
    },
    customFontColor:{
      default: 'black1',
      type: String
    },
    customBackgroundColor:{
      default: 'white',
      type: String
    },
    customHoverFontColor:{
      default: 'white',
      type: String
    },
    customHoverBackgroundColor:{
      default: 'darkblue1',
      type: String
    },
    customBorderColor: {
      default: 'gray3',
      type: String
    },
    customFontSize: {
      default: 'normal',
      type: String
    },
    initialOptSelected: {
      default: null,
      type: Number
    },
    selectBoxPadding: {
      default: '6px 10px',
      type: String
    },
    display: {
      default: 'inner-block',
      type: String
    },
    borderVisible: {
      default: true,
      type: Boolean
    },
    iconVisible: {
      default: true,
      type: Boolean
    },
    placeholder: {
      default: '---',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },

  data() {
    return {
      actualOptSelected: null,
      showOptsT: false,
      selectOptsWidth: 'auto',
      cFontColor: 'black',
      cBackgroundColor: 'white',
      cHoverBackgroundColor: 'white',
      cBorderColor: 'none',
      cFontSize: 'inherit',
      cFontWeight: 'inherit'
    }
  },

  created(){
    
    this.cFontColor = Utils.handleColorSelection(this.customFontColor);
    this.cBackgroundColor = Utils.handleColorSelection(this.customBackgroundColor);
    this.cHoverFontColor = Utils.handleColorSelection(this.customHoverFontColor);
    this.cHoverBackgroundColor = Utils.handleColorSelection(this.customHoverBackgroundColor);
    this.cBorderColor = Utils.handleColorSelection(this.customBorderColor);
    
    let tmp = Utils.handleFontType(this.customFontSize);
    this.cFontSize = tmp[0];
    this.cFontWeight = tmp[1];

    if(this.initialOptSelected != null){
      this.actualOptSelected = this.initialOptSelected;
    }
  },

  methods:{
    showOpts(show){
      this.showOptsT = show;
      document.getElementById('selectWrapper' + this.id).focus();
    },
    getV(){
      return this.items[this.actualOptSelected].value;
    },
    setV(value){

      if(value == null){
        this.actualOptSelected = null;
      }
      else{
        this.items.forEach( (item, index) => {
          if(item.value == value){
            this.actualOptSelected = index;
          }
        });
      }
    },
    handleSelClick(){
      if(!this.disabled){
        this.selectOptsWidth = this.$refs.selectBox.offsetWidth + 'px';
        this.showOptsT = !this.showOptsT;
      }
    },
    handleOptClick(index){
      if(!this.disabled){
        this.actualOptSelected = index;
        this.showOptsT = !this.showOptsT;
        this.$emit('optClicked',this.items[index]['value']);
      }
    },
    optMouseover(index){
      if(!this.disabled){
        this.$refs['opts'][index].style['background-color'] = this.cHoverBackgroundColor;
        this.$refs['opts'][index].style['color'] = this.cHoverFontColor;
      }
    },
    optMouseout(index){
      if(!this.disabled){
        this.$refs['opts'][index].style['background-color'] = this.cBackgroundColor;
        this.$refs['opts'][index].style['color'] = this.cFontColor;
      }
    },
    handleOutClick(){
      if(!this.disabled){
        this.showOptsT = false;
      }
    }
  }
}

</script>

<!-- style applies only to this component -->
<style scoped>
.selectWrapper{
  position: relative;
  display: inline-block;
  text-align: left;
}
.selectWrapper > *{
  vertical-align: middle;
}
.selectLabelWrapper, .selectBoxWrapper{
  display: block;
  width: 100%;
}
.selectLabelWrapper{
  text-align: left;
  margin-bottom: 5px;
}
.selectBoxWrapper{
  margin: auto;
}
.selchevron{
  font-size: 11px;
  font-weight: bold;
  float: right;
  margin: 4px 2px 0px 2px;
  clear: both;
}
.selectOpts{
  position: absolute;
  border: 1px solid;
  border-radius: 3px;
  z-index: 50;
  overflow: visible;
}
.selectOpts ul{
  margin: 0px;
  padding: 0px;
  list-style: none;
  text-align: left;
}
.selectOpts ul li{
  padding: 3px 7px;
  cursor: default;
}
</style>