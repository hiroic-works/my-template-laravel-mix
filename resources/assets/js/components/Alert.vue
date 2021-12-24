<template>
	<div class="alert">
		<p>{{message}}</p>
		<p>APP_ENV: {{app_env}}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			message: 'I am an vue component.',
			app_env: process.env.APP_ENV
		}
	}
};
</script>

<style scoped lang="scss">
.alert {
	background: red;
	p {
		color: #fff;
	}
}
</style>