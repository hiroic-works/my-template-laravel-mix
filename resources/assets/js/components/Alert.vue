<template>
	<div class="alert">
		<p>{{message}}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			message: 'I am an vue component.'
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