/**
*	Author: aiqingmin
*
*/
<template>
	<div class="check_group" v-model="value">
		<div :class="['check_item',{'iconAfter': iconAfterText}, {'checked': item[checkedField]}, {'disabled': item[disabledField]}]"
			 @click="handleClick(item, index)"
			 v-for="(item, index) in itemList"
			 :key="item.id">
			<i class="iconfont icon-check-b"></i>
			<div class="check_item-content">
				<slot v-bind="item">
					<span>{{item[textField]}}</span>
				</slot>
			</div>
		</div>
	</div>
</template>
<script>


export default {
	name: 'y-check-group',
	props: {
		value: [String, Number, Array],
		type: String,
		data: Array,
		maxSelectedCount: Number,
		idField: {type: String, default: 'id'},
		textField: {type: String, default: 'text'},
		disabledField: {type: String, default: 'disabled'},
		checkedField: {type: String, default: 'checked'},
		iconAfterText: {
			default: false,
			type: Boolean
		},
	},
	data() {
		return {
			checkedValues: this.value,			
		}
	},
	watch: {		
		value() { this.checkedValues = this.value;}
	},
	computed: {
		itemList() {
			let itemList = [];					
			for (let item of this.data) {
				let checkItem = null;
				if (typeof item === 'object') {
					checkItem = Object.assign({}, item);
				} else {
					checkItem = {text: item, id: item, checked: false, disabled: false};
				}					
				this.setItemChecked(checkItem)
				itemList.push(checkItem);
			}
			return itemList;
		}
		
	},

	methods: {
		// 如果设置v-model ，则用v-model判断选中状态，否则用item的checked属性	
		setItemChecked(checkItem) {
			if (this.checkedValues !== undefined && this.checkedValues !== null && this.checkedValues !== '') {
				let id = checkItem[this.idField];
				let checkedValues = this.checkedValues;	
				if (this.type === 'radio') 
					checkedValues = [checkedValues];
				checkItem[this.checkedField] = checkedValues.some( (val) => val === id) 	
			}														
		},		
		handleClick(currItem, index) {			
			if (currItem[this.disabledField])
				return;
			if (this.type === 'radio') {
				this.itemList.forEach((item, index) => {
					item[this.checkedField] = item[this.idField] === currItem[this.idField];
					this.itemList.splice(index, 1, item);
				})
			}
			else if (currItem[this.checkedField]) {
				currItem[this.checkedField] = false;

			} else {
				if (this.maxSelectedCount) {
					let selectedCount = 0;
					for (let item of this.itemList) {
						if (item[this.checkedField])
							selectedCount++;
					}
					// 修改人： 胡亮
					// 修改原因：如果设置了多选数量，用户超出选择，应该给出提示。
					// Toast('最多只能选择' + this.checkedItems.length + '项')
					if (this.maxSelectedCount <= selectedCount)
						return this.$emit('clickToast')
				}
				currItem[this.checkedField] = true;
			}	
			let value = this.getSelectedIds();
			if (this.type === 'radio') {
				value = value[0];
			}			
			this.checkedValues = value;
			this.$emit('clickItem', currItem);
			this.$emit('input', value);
			

		},
		getSelectedIds() {
			return this.getSelectedItems().map((item) => item[this.idField])
		},
		getSelectedTexts() {
			return this.getSelectedItems().map((item) => item[this.textField])
		},
		getSelectedItems() {
			return this.itemList.filter((item) => item[this.checkedField])
		},
		getSelectedActiveItems() {
			return this.itemList.filter((item) => item[this.checkedField] && !item[this.disabledField])
		}
	},	
}
</script>
<style>
@import '#/css/var.css';
.check_item.checked .icon-check-b:before {
	content: "\e65a";
	color: var(--theme-color);
 }

 .check_item.checked.disabled .icon-check-b:before {
	content: "\e65a";
	color: #BFBFBF;
 }

.check_item {
	display: flex;
	align-items: center;
	@apply --border-bottom;
	min-height: 1.14rem;
	&.disabled {
		color: #BFBFBF;
	}
	& i {
		flex: 0 0 .5rem;
		color: #BFBFBF;
		font-size: .36rem;
	}
	& span {
		flex: 1;
		line-height: 0.4rem;
	}
	& .check_item-content {
		flex: 1;
		margin-left: .2rem;
	}
	&.iconAfter {
		flex-direction: row-reverse;
		& .check_item-content {
			margin-left: 0;
		}
	}
	& .checked {
		color: var(--theme-color);
	}
}
</style>