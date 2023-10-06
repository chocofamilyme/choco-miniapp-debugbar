<template>
	<div class="network-option">
		<template v-if="!requests.length">No requests</template>

		<ul v-else class="network-option__requests">
			<li
				v-for="req in requests"
				:key="req.startDate.toString()"
				class="network-option__request"
			>
				<div class="network-option__request-block">
					<span class="network-option__important">
						{{ getDate(req.startDate) }}
					</span>
					>
					{{ req.method.toUpperCase() }} {{ req.url }}
					<span
						v-if="req.statusCode"
						class="network-option__status network-option__important"
						:class="getStatusCodeClass(req.statusCode)"
					>
						{{ req.statusCode }}
					</span>
				</div>

				<div class="network-option__request-block">
					<span class="network-option__important">Headers:</span>
					<pre class="network-option__code">{{ req.headers }}</pre>
				</div>

				<div v-if="req.body" class="network-option__request-block">
					<span class="network-option__important">Body:</span>
					{{ req.body }}
				</div>

				<div class="network-option__request-block">
					<button
						class="network-option__btn network-option__btn-clipboard"
						@click="saveReqToClipboard(req)"
					>
						Copy
					</button>
				</div>

				<div class="network-option__request-block">
					<div
						v-if="!req.response"
						class="network-option__important network-option__pending"
					>
						Pending details...
					</div>

					<div v-else>
						<button
							class="network-option__btn network-option__btn-details network-option__important"
							:class="{
								'network-option__btn-details--active': isDetailsActive(req.id)
							}"
							@click="onDetailsClick(req.id)"
						>
							Details ({{ getReqDuration(req) }} ms)
						</button>

						<div v-if="isDetailsActive(req.id)">
							<pre class="network-option__code">{{ req.response }}</pre>
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useNetwork } from '@/shared/composables';
import { getDate } from '@/shared/utils';
import { NetworkRequest } from '@/types';

const HTTP_STATUS_TYPES: { [key: string]: string } = {
	'1': 'info',
	'2': 'success',
	'3': 'redirect',
	'4': 'err',
	'5': 'err'
};

const { requests } = useNetwork();
const openedRequestIds: string[] = reactive([]);

const isDetailsActive = (id: string) => {
	return openedRequestIds.includes(id);
};

const onDetailsClick = (id: string) => {
	if (!isDetailsActive(id)) {
		return addOpenedRequest(id);
	}

	removeOpenedRequest(id);
};

const addOpenedRequest = (id: string) => {
	openedRequestIds.push(id);
};

const removeOpenedRequest = (id: string) => {
	const idx = openedRequestIds.findIndex(i => i === id);
	if (idx >= 0) {
		openedRequestIds.splice(idx, 1);
	}
};

const saveReqToClipboard = (req: NetworkRequest) => {
	navigator.clipboard.writeText(JSON.stringify(req));
};

const getReqDuration = (req: NetworkRequest) => {
	if (req.endDate) {
		const diff = req.startDate.valueOf() - req.endDate.valueOf();
		return String(Math.abs(diff));
	}

	return '...';
};

const getStatusCodeClass = (code: number) => {
	const codeString = String(code);
	const className = 'network-option__status--';
	const classModifier = HTTP_STATUS_TYPES[codeString[0]] || 'err';
	return className + classModifier;
};
</script>

<style lang="scss">
.network-option {
	padding: 0 16px;

	&__requests {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	&__request {
		margin-bottom: 4px;
		padding: 8px;
		font-size: 14px;
		line-height: 16px;
		text-align: left;
		border-radius: 4px;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-bottom: 1px solid #00b2ff;

		&:last-child {
			margin-bottom: 0;
		}

		&-block {
			margin-bottom: 4px;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}

	&__important {
		font-weight: 700;
	}

	&__pending {
		height: 24px;
		line-height: 24px;
	}

	&__btn {
		padding: 0;
		background: none;
		font-size: 14px;
		line-height: 1;

		&-clipboard {
			display: inline-flex;
			align-items: center;
			padding: 4px 8px;
			color: #fff;
			background: #333;
			border-radius: 8px;

			&:after {
				content: '';
				display: block;
				width: 24px;
				height: 24px;
				background: url('@/assets/copy-simple.svg') center no-repeat;
			}
		}

		&-details {
			display: inline-flex;
			align-items: center;

			&:after {
				content: '';
				display: block;
				width: 24px;
				height: 24px;
				background: url('@/assets/angle-bottom.svg') center no-repeat;
			}

			&--active:after {
				transform: rotate(180deg);
			}
		}
	}

	&__code {
		margin: 0;
	}

	&__status {
		&--info {
			color: #ffa100;
		}

		&--success {
			color: #05bf0d;
		}

		&--redirect {
			color: #ffa100;
		}

		&--err {
			color: #f91f01;
		}
	}
}
</style>
