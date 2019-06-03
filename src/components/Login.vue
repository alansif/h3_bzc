<template>
<v-layout align-center justify-center>
    <v-dialog v-model="dialog" persistent max-width="360">
		<v-card class="pb-3">
        	<v-toolbar dark color="primary">
				<v-toolbar-title>登录</v-toolbar-title>
			</v-toolbar>
			<v-card-text class="pl-5 pr-5">
        <v-form ref="form" lazy-validation>
					<v-text-field prepend-icon="person" name="login" label="用户名"
						type="text" v-model="username" required :rules="usernameRules"></v-text-field>
          <v-text-field prepend-icon="lock" name="password" label="密码"
						id="password" type="password" v-model="password" required :rules="passwordRules"></v-text-field>
				</v-form>
			</v-card-text>
			<v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login">登录</v-btn>
                <v-spacer></v-spacer>
      </v-card-actions>
		</v-card>
	</v-dialog>
</v-layout>
</template>

<script>
export default {
/*
	props: {
		showdlg: {
			type: Boolean,
			default: true
		}
	},
	watch: {
		dialog() {
			this.dialog = this.showdlg;
		}
	},
*/
	data() {
		return {
			dialog: true,
			username: '',
			password: '',
			usernameRules: [
        v => !!v || '用户名不能为空'
      ],
			passwordRules: [
				v => !!v || '密码不能为空',
				v => this.authed || '用户名或密码错',
				v => this.svrok || '连接服务器出错了'
			],
			authed: true,
			svrok: true
		}
	},
	methods: {
		show() {
			this.$refs.form.reset();
			this.dialog = true;
		},
		login() {
			this.authed = true;
			this.svrok = true;
			if (!this.$refs.form.validate()) {
				return;
			}
			this.$axios.post('/api/login', {username:this.username,password:this.password})
				.then(response => {
					this.dialog = false;
					this.$root.username = this.username;
					this.$root.$emit('username', this.username);
				})
				.catch(error => {
					if (error.response && error.response.status === 401) {
						this.authed = false;
						this.$refs.form.validate();
					} else {
						this.svrok = false;
						this.$refs.form.validate();
						console.dir(error);
					}
				});
		}
	}
}
</script>
