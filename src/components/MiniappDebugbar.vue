<template>
	<div class="miniapp-debugbar-container">
		<!-- Button -->
		<button
			v-show="!isActive"
			class="miniapp-debugbar-btn"
			@click="isActive = true"
		>
			Debugbar
		</button>

		<!-- Debugbar -->
		<div v-if="isActive" class="miniapp-debugbar">
			<!-- Options -->
			<ul class="miniapp-debugbar__options">
				<li
					class="miniapp-debugbar__option"
					v-for="option in options"
					:key="option.id"
					@click="selectOption(option)"
				>
					{{ option.name }}
				</li>
			</ul>

			<!-- Active option -->
			<div class="miniapp-debugbar__body">
				<component :is="activeOption.component"></component>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { type Component, shallowRef, ref } from 'vue';
import ConsoleOption from '@/components/options/ConsoleOption.vue';
import { useConsole } from '@/shared/composables';

interface DebugbarOption {
	id: string;
	name: string;
	component: Component;
}

const { init } = useConsole();
init();

const options: DebugbarOption[] = [
	{
		id: 'console',
		name: 'Console',
		component: ConsoleOption
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
</script>

<style lang="scss">
.miniapp-debugbar {
	padding: 16px 0;

	&-container {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		top: 0;
		z-index: 999;
	}

	&-btn {
		position: fixed;
		color: #fff;
		font-size: 14px;
		line-height: 1;
		font-weight: bold;
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
	}

	&__option {
		font-size: 16px;
		padding: 4px 16px;
		background: #f3eeee;
		border-top-right-radius: 12px;
		margin-right: 4px;
	}

	&__body {
		margin-top: 12px;
	}
}
</style>
