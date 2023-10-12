<template>
	<div class="network-option">
		<template v-if="!requests.length">No requests</template>

		<template v-else>
			<!-- Requests -->
			<ul class="network-option__requests">
				<li
					v-for="req in requests"
					:key="req.startDate.toString()"
					class="network-option__request"
				>
					<div class="network-option__request-block">
						<span
							v-if="req.statusCode"
							class="network-option__status network-option__important"
							:class="getStatusCodeClass(req.statusCode)"
						>
							{{ req.statusCode }}
						</span>

						<span class="network-option__important">
							{{ getDate(req.startDate) }}
						</span>
						>
						{{ req.method.toUpperCase() }} {{ getReqUrl(req) }}
					</div>

					<details>
						<summary class="network-option__important">Headers</summary>
						<pre class="network-option__code">{{ req.headers }}</pre>
					</details>

					<details v-if="req.body" class="network-option__request-block">
						<summary class="network-option__important">Body</summary>
						<pre class="network-option__code">{{ req.body }}</pre>
					</details>


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

			<!-- Clear button -->
			<div class="network-option__clear">
				<button
					class="network-option__btn network-option__btn-clear"
					@click="clearRequests"
				>
					Clear requests
				</button>
			</div>
		</template>
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

const { requests, clearRequests } = useNetwork();
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

const getReqUrl = (req: NetworkRequest) => {
	let url = req.url;

	if (req.params) {
		if (typeof req.params === 'object') {
			for (const key of Object.keys(req.params)) {
				const value = req.params[key];
				if (value) {
					if (!url.includes('?')) {
						url += '?';
					}

					const pre = url[url.length - 1] === '?' ? '' : '&';
					url += `${pre}${key}=${value}`;
				}
			}
		}
	}

	return url;
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

	&__clear {
		position: sticky;
		z-index: 1;
		bottom: 0;
		right: 0;
		padding: 8px 0;
	}

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
		line-break: anywhere;
		border-radius: 4px;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-bottom: 1px solid #00b2ff;

		&:last-child {
			margin-bottom: 0;
		}

		&-block {
			margin-bottom: 4px;
			overflow: auto;

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

		&-clear {
			display: block;
			min-height: 32px;
			padding: 8px;
			margin-left: auto;
			color: #333;
			background: #fff;
			border: 1px solid #333 !important;
			border-radius: 8px;
		}

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
		overflow: auto;
	}

	&__status {
		padding-right: 5px;
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
