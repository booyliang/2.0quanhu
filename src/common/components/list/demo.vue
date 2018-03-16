<template>
	<y-list>
		<y-item title="item"></y-item>
		<y-item title="item" subtitle="with subtitle"></y-item>
		<y-item title="item" placeholder="set your value please"></y-item>
		<y-item title="item" value="this is value"></y-item>
		<y-item title="item (vertical)" value="this is value" vertical></y-item>
		<y-item title="item (clickable)" clickable @click="handleClick"></y-item>
		<y-item title="item with link" to="/"></y-item>
		<y-item title="item with split" split></y-item>
		<y-item title="item">
			<y-button slot="head">item with custom head</y-button>
		</y-item>
		<y-item title="item">
			<y-button slot="foot">custom foot</y-button>
		</y-item>
		<y-item title="item with addon" clickable>
			<p slot="addon">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</y-item>
		<y-item>
			<p>(custom all content)<br>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</y-item>
	</y-list>
</template>

<script type="text/javascript">
import List from '@/components/list';
import Item from '@/components/item';
import Button from '@/components/button';

export default {
	components: {
		[List.name]: List,
		[Item.name]: Item,
		[Button.name]: Button,
	},

	methods: {
		handleClick() {
			console.log('Clicked.');
		}
	}
};
</script>