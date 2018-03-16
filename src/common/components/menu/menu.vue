/**
*	Author: wangboning
*
*/
<template>
	<y-popup v-show="opened" :options="finalOptions" :class="classList">
		<div class="menu-list" :style="style">
			<y-check-group v-if="select" type="radio" :data="menu" @clickItem="handleSelected"></y-check-group>
			<template v-else>
				<div v-for="(item, index) of finalMenu" :key="index" @click="handleItemClicked(item.action)" class="menu-item">
					<span v-if="item.icon" class="iconfont" :class="`icon-${ item.icon }`"></span>{{ item.text }}
				</div>
			</template>
		</div>
	</y-popup>
</template>

<script type="text/javascript">
	import CheckGroup from '@/components/check-group';

	import Vue from 'vue';

	import popupMixin from '@/components/popup/mixin';

	export default {
		name: 'y-menu',

		mixins: [
			popupMixin
		],

		components: {
			[CheckGroup.name]: CheckGroup
		},

		props: {
			menu: {
				type: Array,
				required: true,
			},
			select: {
				type: Boolean,
				default: false
			},
			static: {
				type: Boolean,
				default: false
			}
		},

		data() {
			return {
				defaultOptions: {
					transparentMask: true,
					fixed: false,

					onTriggerClicked(trigger) {
						if (this.static) {
							return;
						}

						this.setPosition(trigger);
					}
				},
				style: {},
				defaultMenu: {
					'copy-url': {
						icon: 'clone-o',
						text: this.$R('menu-copy-url'),

						action: () => {
							this.$yryz.pasteboard({
								text: this.$utils.getShareUrl()
							})
							.then(() => {
								this.$toast(this.$R('copy-success'));
							});
						}
					},
					'share': {
						icon: 'share-o',
						text: this.$R('menu-share'),

						action: () => {
							// Waiting for external parameter.
						}
					},
					'index': {
						icon: 'home-o',
						text: this.$R('menu-index'),

						action: () => {
							this.$router.push('/');
						}
					},
					'refresh': {
						icon: 'refresh',
						text: this.$R('menu-refresh'),

						action: () => {
							let msg = {
								type: 'refresh'
							};
							this.$eventBus.$emit('global-message', msg);
						}
					}
				}
			};
		},

		computed: {
			classList() {
				return [
					'menu',
					{
						'menu--fixed': this.finalOptions.fixed
					}
				];
			},

			finalMenu() {
				if (!this.menu.length) {
					console.error('At least 1 menu item required.');
				}

				return this.menu.map((item) => {
					if (typeof item === 'object') {
						if (item.hasOwnProperty('name')) {
							return Object.assign({}, this.defaultMenu[item.name], item);
						} else {
							return item;
						}
					} else if (this.defaultMenu.hasOwnProperty(item)) {
						return this.defaultMenu[item];
					} else {
						console.error(`Menu action ${item} doesn't exist.`);
						return {};
					}
				});
			},
		},

		methods: {
			setPosition(trigger) {
				let right = 0;
				let top = 0;
				let {
					right: triggerRight,
					top: triggerTop
				} = trigger.getBoundingClientRect();
				right += document.body.clientWidth - triggerRight;
				top += triggerTop + trigger.offsetHeight;

				if (!this.finalOptions.fixed) {
					top += document.body.scrollTop + document.documentElement.scrollTop;
				}

				this.style = {
					right: `${right}px`,
					top: `${top}px`
				}
			},

			handleItemClicked(action) {
				action();
				this.close();
			},

			handleSelected(item) {
				this.$emit('selected', item);
				this.close();
			}
		}
	};
</script>

<style type="text/css">
	@import '#/css/var.css';

	:root {
		--menu-bg: color(#555a5f alpha(0.9));
		--menu-arrow-width: 0.3rem;
		--menu-arrow-height: 0.14rem;
		--menu-arrow-offset: 0.25rem;
	}

	.popup {
		&.menu {
			position: absolute;

			& .mask {
				position: fixed;
			}
			& .menu-list {
				position: absolute;
			}
		}
		&.menu--fixed {
			position: fixed;
		}
	}

	.menu-list {
		@apply --bg-alpha;
		line-height: 0.8rem;
		background: var(--menu-bg);
		border-radius: 0.1rem;
		margin-top: var(--menu-arrow-height);
		transform-origin: 90% -var(--menu-arrow-height);

		&::before {
			content: "";
			position: absolute;
			bottom: 100%;
			right: var(--menu-arrow-offset);
			border: solid transparent;
			border-width: var(--menu-arrow-height) calc(var(--menu-arrow-width) / 2);
			border-bottom-color: var(--menu-bg);
		}

		& .check_item {
			min-height: 0;
			line-height: inherit;
			border-bottom: none;

			&.checked .iconfont::before {
				content: "\e637";
				color: white;
			}
			& .iconfont {
				flex-basis: auto;
				width: auto;
				font-size: 1em;
				color: white;
			}
			& span {
				width: auto;
			}
			& .check_item-content {
				margin-left: 0;
			}
		}
	}

	.menu-item,
	.menu-list .check_item {
		width: 2rem;
		display: flex;
		align-items: center;
		white-space: nowrap;
		padding: 0 0.16rem;

		&:not(:first-child) {
			@apply --border-top;
			border-color: color(white alpha(0.5));
		}

		& .iconfont {
			width: auto;
			font-size: 0.4rem;
			margin-right: 0.12rem;
		}
	}

	.popup-enter,
	.popup-leave-active {
		& .menu-list {
			transform: scale(0.85);
		}
	}

	.popup-enter-active,
	.popup-leave-active {
		& .menu-list {
			transition: inherit;
			transition-property: transform;
		}
	}
</style>