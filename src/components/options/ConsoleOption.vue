<template>
	<div class="console-option">
		<template v-if="!logs.length">No logs</template>

		<ul v-else class="console-option__logs">
			<li
				v-for="log in logs"
				:key="log.date.toString()"
				class="console-option__log"
				:class="`console-option__log--${log.type}`"
			>
				<span class="console-option__time">{{ getDate(log.date) }}</span>
				>
				{{ log.log.join('') }}
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { useConsole } from '@/shared/composables';
import { getDate } from '@/shared/utils';

const { logs } = useConsole();
</script>

<style lang="scss">
.console-option {
	padding: 0 16px;

	&__logs {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	&__log {
		margin-bottom: 4px;
		padding: 4px;
		font-size: 14px;
		line-height: 16px;
		text-align: left;
		border-radius: 4px;

		&--logs {
			border-bottom: 1px solid #00b2ff;
			border-radius: 0;
		}

		&--warn {
			background: #ffa100;
		}

		&--error {
			color: #fff;
			background: #f91f01;
		}

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__time {
		font-weight: 700;
	}
}
</style>
