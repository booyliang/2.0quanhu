<template>
	<span class="question_tag" :class="typeClass">
		<slot></slot>
	</span>
</template>
<script>
	export default {
		name: 'question-tag',
		props: {
			type: String
		},
		computed: {
			'typeClass': function () {
				return this.type || ''
			}
		}
	}
</script>

<style>
    @import '#/css/var.css';
	.question_tag {
		margin-right: .04rem;
		padding: 0 .1rem;
		font-size: .24rem;
		text-align: center;
		border-radius: 3px;
		&.privacy {
			border: 1px solid #0185ff;
			color: #0185ff;
		}
		&.rejected {
			border: 1px solid #fd4452;
			color: #fd4452;
		}
		&.invalid {
			border: 1px solid #999;
			color: #999;
		}
	}
</style>

