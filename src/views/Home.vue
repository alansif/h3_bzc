<template>
  <div>
    <v-toolbar dense>
      <v-btn small color="primary" @click="addRecord()"><v-icon small left>add</v-icon>添加</v-btn>
      <v-btn small color="primary" @click="delRecord()"><v-icon small left>delete</v-icon>删除</v-btn>
      <v-spacer></v-spacer>
      <v-btn small color="primary" @click="$refs.grid.save()"><v-icon small left>done</v-icon>保存</v-btn>
    </v-toolbar>
    <Grid ref="grid"/>
    <v-snackbar v-model="snackbar" color="error" :timeout="3000" top>请先保存后再操作
      <v-btn flat @click="snackbar = false"><v-icon small right>highlight_off</v-icon></v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import Grid from '../components/Grid'

  export default {
    data() {
      return {
        snackbar: false
      }
    },
    components: {
      Grid
    },
    methods: {
      addRecord() {
        if (!this.$refs.grid.add()) {
          this.snackbar = true;
        }
      },
      delRecord() {
        if (!this.$refs.grid.del()) {
          this.snackbar = true;
        }
      }
    },
    mounted() {
      if (!!this.$root.username) this.$refs.grid.setUserData('user', this.$root.username);
      this.$root.$on('username', username => {
        this.$refs.grid.setUserData('user', username);
      });
    }
  }
</script>
