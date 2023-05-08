<template>
    <div class="my-table-sort">
      <a href="javascript:void(0)" @click="ascendingHandel()">
        <i :class="isAscending === true ? 'sort-caret ascending-active' : 'sort-caret ascending'"></i>
      </a>
      <a href="javascript:void(0)" @click="descendingHandel()">
        <i :class="isDescending === true ? 'sort-caret descending-active' : 'sort-caret descending'" ></i>
      </a>
    </div>
</template>

<script>
  export default {
    name: 'myTableSort',
    data() {
      return {
         isAscending: false,
         isDescending: false
      }
    },
    methods: {
      ascendingHandel() {
        this.isAscending = !this.isAscending
        this.isDescending = false
        this.sortChange()
      },
      descendingHandel() {
        this.isDescending = !this.isDescending
        this.isAscending = false
        this.sortChange()
      },
      sortChange() {
        if(!this.isAscending && !this.isDescending) {
          this.$emit('sortChange',null)
        }else {
          this.$emit('sortChange',this.isAscending === true ?  'ascending' : 'descending')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.my-table-sort {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 34px;
  width: 24px;
  vertical-align: middle;
  cursor: pointer;
  overflow: initial;
  position: relative;
  .sort-caret {
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    left: 7px;
  }
  .ascending {
    border-bottom-color: #C0C4CC;
    top: 5px;
  }
  .ascending-active {
    border-bottom-color: #409EFF;
    top: 5px;
  }
  .descending {
    border-top-color: #C0C4CC;
    bottom: 7px;
  }
  .descending-active {
    border-top-color: #409EFF;
    bottom: 7px;
  }
}
</style>
