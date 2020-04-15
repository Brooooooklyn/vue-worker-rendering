<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  created: function() {
    this.now = performance.now()
  },
  
  mounted() {
    console.log(performance.now() - this.now)
  }
}
</script>
