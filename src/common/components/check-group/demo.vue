<template>
	<div class="check-group">
		<h1>checkbox:</h1>
		<y-check-group :maxSelectedCount="2" :data="langList" v-model="langId" textField="label" name="voteType" type="checkbox" ref="langList" @click.native="handleLangClick"></y-check-group>
		<br/>
		<h1>radio:</h1>
		<y-check-group :data="foodList" name="vote" type="radio" ref="foodList" @click.native="handlefoodClick" :iconAfterText="true"></y-check-group>
	</div>
</template>
<script>

import YCheckGroup from './check-group'
export default {
	components: {
		YCheckGroup
	},
	data() {
		return {
			test: '',
			type: '1',
			foodId: null,
			langId: null,
			foodList: [{ text: '油条', id: '1' }, { text: '包子', id: '2', checked: true }],
			langList: [{ label: 'JS', id: 1 }, { label: 'Java', id: 2 }, { label: '.net', id: 3 }, {
				label: 'Go',
				id: 4,
				checked: true
			}]
		}
	},
	created() {
		this.langId = [2, 3];
		this.foodId = "1";
		setTimeout(() => {
			this.langId = [1];
			// this.foodId = "2";
			this.foodList[0].text = '变化'
			// this.langList = [{label: 'JSJS', id: 1}, {label: 'JavaJava', id: 2}, {label: '.netnet', id: 3, checked: true}]
		}, 2000);


		// this.foodId = "1";

	},
	watch: {
		foodId() {
			console.log('foodId', this.foodId)
		},
		langId() {
			console.log('langId', this.langId)
		}
	},
	methods: {
		handleLangClick() {
			console.log(JSON.stringify(this.$refs.langList.getSelectedItems()));
			console.log("this.langId", this.langId);

		},
		handlefoodClick(item) {
			console.log("item", item);
			console.log("this.foodId", this.foodId);
		}
	}

}
</script>