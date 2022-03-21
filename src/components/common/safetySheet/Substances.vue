<template>
	<section>
		<div class="header d-flex align-items-center">
			<h3>
				<span class="icons icon-atom mr-2"></span>
				<span>
					<b>{{ getTranslation('I00.00051740', 'Ingredients') }}</b>
				</span>
			</h3>
		</div>

		<div v-if="isActivitySS">
			<div v-for="(item, index) in activityItems" :key="index">
				<div class="tableName mt-3">
					<b>{{ getTranslation('I00.00039830', 'Product') }}:</b>
					{{ item.name }}
				</div>
				<table>
					<thead>
						<tr>
							<th class="w-30">{{ getTranslation('I00.00020580', 'Substance name') }}</th>
							<th class="w-15">{{ getTranslation('I00.00044260', 'CasNo') }}/{{ getTranslation('I00.00008780', 'EgNo') }}</th>
							<th class="w-15">{{ getTranslation('I00.00038150', 'Concentration') }}</th>
							<th>{{ getTranslation('I00.00014510', 'Classification') }}</th>
						</tr>
					</thead>
					<tbody>
						<template v-if="item.substances.length">
							<tr v-for="(substance, ind) in item.substances" :key="ind">
								<td class="w-30">{{ substance.substanceData.name }}</td>
								<td class="w-15">
									<p>{{ substance.substanceData.cas ? `${substance.substanceData.cas}` : '' }}</p>
									<p>{{ substance.substanceData.eg ? `${substance.substanceData.eg}` : '' }}</p>
								</td>
								<td class="w-15">{{ substance.countHigh + ' %' }}</td>
								<td>{{ getClassification(substance).join(', ') }}</td>
							</tr>
						</template>
						<tr v-else>
							<td colspan="4">{{ getTranslation('I00.00031050', 'No data available') }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<table v-else>
			<thead>
				<tr>
					<th class="w-30">{{ getTranslation('I00.00020580', 'Substance name') }}</th>
					<th class="w-15">{{ getTranslation('I00.00044260', 'CasNo') }}/{{ getTranslation('I00.00008780', 'EgNo') }}</th>
					<th class="w-15">{{ getTranslation('I00.00038150', 'Concentration') }}</th>
					<th>{{ getTranslation('I00.00014510', 'Classification') }}</th>
				</tr>
			</thead>
			<tbody>
				<template v-if="substances.length">
					<tr v-for="(substance, ind) in substances" :key="ind">
						<td class="w-30">{{ substance.substanceData.name }}</td>
						<td class="w-15">
							<p>{{ substance.substanceData.cas ? `${substance.substanceData.cas}` : '' }}</p>
							<p>{{ substance.substanceData.eg ? `${substance.substanceData.eg}` : '' }}</p>
						</td>
						<td class="w-15">{{ substance.countHigh + ' %' }}</td>
						<td>{{ getClassification(substance).join(', ') }}</td>
					</tr>
				</template>
				<tr v-else>
					<td colspan="4">{{ getTranslation('I00.00031050', 'No data available') }}</td>
				</tr>
			</tbody>
		</table>
	</section>
</template>

<script>
export default {
  props: ['substances', 'activityItems', 'isActivitySS'],
  methods: {
    getClassification(substance) {
      var newClassification = (substance.clpphrases || []).concat(substance.hphrases || []);
      if (newClassification.any()) return newClassification;
      return (substance.dangerCodes || []).concat(substance.riskPhrases || []);
    }
  }
}
</script>