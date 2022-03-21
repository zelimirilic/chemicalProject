<template>
	<footer class="d-flex flex-row">
		<div class="mr-2" v-if="risk.signed">
			<p class="subTtl dateTtl">
				<b>{{ getTranslation('I00.00016290', 'Print date') }}:</b>
			</p>
			<p class="date noWrap">{{ parseDate(new Date()) }}</p>
		</div>
		<div class="mr-2" v-if="!risk.signed && risk.createdDate">
			<p class="subTtl dateTtl">
				<b>{{ getTranslation('I00.00054670', 'Created date') }}:</b>
			</p>
			<p class="date noWrap">{{ parseDate(risk.createdDate) }}</p>
		</div>
		<div>
			<p class="subTtl dateTtl">
				<b>{{ getTranslation('I00.00012370', 'Signed by') }}:</b>
			</p>
			<p class="date noWrap" v-if="risk.signed">{{ risk.signedBy }}</p>
			<p class="date noWrap" v-else>{{ getTranslation('I00.00010090', 'Not signed') }}</p>
		</div>
	</footer>
</template>

<script>
import { parseDate } from '../../../libraries/date';
export default {
  props: ['risk'],
  methods: {
    parseDate: parseDate
  }
}
</script>