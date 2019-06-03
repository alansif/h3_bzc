<template>
    <v-layout align-center justify-center>
        <v-dialog v-model="dialog" persistent max-width="360">
            <v-card>
                <v-card-title>
                    <span class="title">修改密码</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" lazy-validation class="ml-4 mr-4">
                        <v-text-field label="旧密码" type="password" v-model="oldpass" required :rules="oldpassRules"></v-text-field>
                        <v-text-field label="新密码" type="password" v-model="newpass0" required :rules="newpass0Rules"></v-text-field>
                        <v-text-field label="重复输入" type="password" v-model="newpass1" required :rules="newpass1Rules"></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="dialog = false">关闭</v-btn>
                    <v-btn color="blue darken-1" flat @click="save">保存</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
                oldpass: '',
                newpass0: '',
                newpass1: '',
                oldpassRules: [
                    v => !!v || '密码不能为空',
                    v => !this.wrongpass || '密码错误'
                ],
                newpass0Rules: [
                    v => !!v || '密码不能为空'
                ],
                newpass1Rules: [
                    v => !!v || '密码不能为空',
                    v => v === this.newpass0 || '两次密码输入不一致'
                ],
                wrongpass: false
            }
        },
        methods: {
            show() {
                this.$refs.form.reset();
                this.dialog = true;
            },
            save() {
                this.wrongpass = false;
                if (!this.$refs.form.validate()) {
                    return;
                }
			    this.$axios.post('/api/passwd', {username:this.$root.username,oldpass:this.oldpass,newpass:this.newpass0})
                    .then(response => {
                        this.dialog = false;
                    })
                    .catch(error => {
                        if (error.response && error.response.status === 401) {
                            this.wrongpass = true;
                            this.$refs.form.validate();
                        } else {
                            console.error(error);
                        }
                    });
            }
        }
    }
</script>
