<template>
	<div class="miniapp-debugbar-container">
		<!-- Button -->
		<button
			v-show="!isActive"
			class="miniapp-debugbar-btn"
			@click="openDebugbar"
		>
			Debugbar
		</button>

		<!-- Debugbar -->
		<div v-if="isActive" class="miniapp-debugbar">
			<!-- Options -->
			<ul class="miniapp-debugbar__options">
				<li
					v-for="option in options"
					:key="option.id"
					class="miniapp-debugbar__option"
					:class="{
						'miniapp-debugbar__option--active': isActiveOption(option)
					}"
					@click="selectOption(option)"
				>
					{{ option.name }}
				</li>
			</ul>

			<!-- Active option -->
			<div class="miniapp-debugbar__body">
				<component :is="activeOption.component"></component>
			</div>

			<button
				class="miniapp-debugbar__btn-close"
				@click="hideDebugbar"
			></button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { type Component, shallowRef, ref } from 'vue';
import ConsoleOption from '@/components/options/ConsoleOption.vue';
import NetworkOption from '@/components/options/NetworkOption.vue';
import { useConsole } from '@/shared/composables';

interface DebugbarOption {
	id: string;
	name: string;
	component: Component;
}

const { initConsole } = useConsole();
initConsole();

const options: DebugbarOption[] = [
	{
		id: 'console',
		name: 'Console',
		component: ConsoleOption
	},
	{
		id: 'network',
		name: 'Network',
		component: NetworkOption
	}
];

const isActive = ref(false);
const activeOption = shallowRef<DebugbarOption>(options[0]);

const selectOption = (option: DebugbarOption) => {
	if (activeOption.value === option) {
		return;
	}

	activeOption.value = option;
};

const isActiveOption = (option: DebugbarOption) => {
	return activeOption.value === option;
};

const openDebugbar = () => (isActive.value = true);
const hideDebugbar = () => (isActive.value = false);
</script>

<style lang="scss">
.miniapp-debugbar {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;

	&__btn-close {
		position: absolute;
		top: 20px;
		right: 16px;
		display: block;
		width: 24px;
		height: 24px;
		background: url('@/assets/cross.svg') center no-repeat;
	}

	&-container {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		top: 0;
		z-index: 999;
		font-family: 'Sirius', Inter, system-ui, Avenir, Helvetica, Arial,
			sans-serif;
		line-height: 1.5;
		font-weight: 400;
		font-synthesis: none;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-text-size-adjust: 100%;

		a {
			color: inherit;
			text-decoration: inherit;
		}

		a:hover {
			color: inherit;
		}

		button {
			font-family: inherit;
			border: none;
			cursor: pointer;
		}

		button:hover {
			border-color: none;
		}

		button:focus,
		button:focus-visible {
			outline: none;
		}
	}

	&-btn {
		position: fixed;
		color: #fff;
		font-size: 14px;
		line-height: 1;
		font-weight: 700;
		padding: 8px 16px;
		border-radius: 12px 12px 0 0;
		background: #f91f01;
		transform: rotateZ(-90deg);
		right: -32px;
		bottom: 64px;
	}

	&__options {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		padding-top: 16px;
	}

	&__option {
		font-size: 16px;
		padding: 4px 16px;
		background: #f3eeee;
		border-top-right-radius: 12px;
		margin-right: 4px;
		transition: 0.25s ease-out;

		&--active {
			color: #fff;
			background: #f91f01;
		}
	}

	&__body {
		flex-grow: 1;
		overflow: auto;
		margin-top: 12px;
		padding-bottom: 16px;
	}
}
</style>
