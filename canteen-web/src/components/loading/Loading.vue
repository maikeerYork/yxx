<template>
    <div>
        <div class="model"></div>
        <div class="model-box">
              <div class="width-200 text-center p-10 el-text-primary">
                <div class="flex-row align-center">
                  <a class="font-size-32 " href="javascript:void(0)" title="loading" >
                    <i class="el-icon-loading"></i>
                  </a>
                  <slot>
                    <span class="font-size-14 ml-12">加载中...</span>
                  </slot>
                </div>
              </div>
        </div>
    </div>
</template>

<script>

export default {
    name:'Loading',

    data(){
        return{

        }
    }
}
</script>
