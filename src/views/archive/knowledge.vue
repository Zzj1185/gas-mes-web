<template>
  <archive-cmpt v-if="loaded" :archive_type="archive_type" :category_id="category_id" />
</template>

<script>
import archiveCmpt from '@/components/archiveCmpt.vue'

export default {
  components: { archiveCmpt },
  name: 'archive',
  data() {
    return {
      loaded: false,
    }
  },
  mounted() {
    this.loaded = true
  },
  computed: {
    category_id() {
      return this.$route.params.id
    },
    archive_type() {
      return this.$route.params.type
    },
  },
  watch: {
    category_id() {
      this.loaded = false
      this.$nextTick(() => {
        this.loaded = true
      })
    },
  },
}
</script>
