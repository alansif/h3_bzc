<template>
	<v-app>
		<v-toolbar app clipped-left>
			<v-toolbar-title class="headline">
				<span class="font-weight-light">华三商务</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
<!--
			<v-btn flat
				href="https://github.com/vuetifyjs/vuetify/releases/latest"
				target="_blank"
			>
-->

			<v-btn flat>
				<span class="mr-2">{{ username }}</span>
			</v-btn>
		</v-toolbar>

		<v-navigation-drawer app clipped permanent width="160">

			<v-divider></v-divider>

			<v-list dense class="pt-0">
				<v-list-tile
					v-for="item in items"
					:key="item.title"
					:to="item.route"
				>
					<v-list-tile-action>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-tile-action>

					<v-list-tile-content>
						<v-list-tile-title>{{ item.title }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>

		<v-content>
		<Login></Login>
<!--			<v-container fluid>  -->
				<transition name="fade">
					<router-view></router-view>
				</transition>
<!--			</v-container> -->
		</v-content>
		<v-footer app></v-footer>
	</v-app>
</template>

<script>
import Login from './components/Login'
export default {
	components: {
		Login
	},
	data () {
		return {
				items: [
					{ title: '编辑', icon: 'edit', route: '/' },
					{ title: '日志', icon: 'history', route: '/logs' }
				],
				username: ''
		}
	},
	mounted() {
		this.$root.$on('username', msg => {
			this.username = msg;
			this.$root.username = msg;
		});
	}
}
</script>

<style>
*{ text-transform: none !important; } /* 避免v-btn内容变成大写字母 */

.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .15s;
}

.fade-enter-active {
  transition-delay: .15s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>