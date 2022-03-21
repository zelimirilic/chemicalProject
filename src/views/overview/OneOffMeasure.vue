<template>
	<div class="externalMain d-flex">
		<div class="imgLarge d-flex flex-column justify-content-center align-items-center">
			<div class="logoIntro"></div>
			<div class="card">
				<MainLoader v-if="measure == null" />
				<template v-else>
					<template v-if="isFormVisible">
						<h3>{{ getTranslation('I00.00056720', 'Review measure') }}</h3>
						<h6 class="mb-0">{{ getTranslation('I00.00056730', 'There is a one-off mesaure that needs to be reviewd by you.') }}</h6>
						<div class="dataBox">
							<p>
								<b>{{ getTranslation('I00.00002940', 'DepartmenText') }}:</b>
								{{ measure.department }}
							</p>
							<p>
								<b>{{ getTranslation('I00.00005730', 'OneOfMeasuresText') }}:</b>
								{{ measure.task }}
							</p>
							<p>
								<b>{{ getTranslation('I00.00006930', 'TypeText') }}:</b>
								{{ measure.measureType ? getTranslation(measure.measureType, 'TextOfMeasureType') : '' }}
							</p>
							<p>
								<b>{{ getTranslation('I00.00005970', 'In charge') }}:</b>
								{{ measure.responsiblePerson }}
							</p>
							<p>
								<b>{{ getTranslation('I00.00008620', 'Date') }}:</b>
								{{ measure.date }}
							</p>
						</div>
						<button class="btn primary bigBtn" @click="showConfirm()">{{ getTranslation('I00.00030850', 'Complete') }}</button>
					</template>

					<template v-if="isConfirmVisible">
						<h3>{{ getTranslation('I00.00056720', 'Review measure') }}</h3>
						<div class="dataBox">
							<h6 class="mb-0">{{ getTranslation('I00.00056100', 'Are you sure you want to complete this measure?') }}</h6>
						</div>
						<div class="form-inline justify-content-end">
							<ButtonOk class="primary" @click="showSuccess()" />
							<ButtonCancel @click="showForm()" />
						</div>
					</template>

					<div class="success d-flex flex-column justify-content-center" v-if="isSuccessVisible">
						<div class="checkCircle"></div>
						<h3>{{ getTranslation('I00.00011360', 'Thank you!') }}</h3>
						<h6 class="mb-0">{{ getTranslation('I00.00056750', 'You have successfully completed one-off-measure.') }}</h6>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import axios from '../../axios';

export default {
  props: {
    measureId: null,
    riskId: null,
    department: null,
    task: null,
    measureType: null,
    responsiblePerson: null,
    date: null
  },
  data: function () {
    return {
      measure: {},
      isFormVisible: true,
      isConfirmVisible: false,
      isSuccessVisible: false
    }
  },
  methods: {
    showConfirm() {
      this.isFormVisible = false;
      this.isConfirmVisible = true;
    },
    showSuccess() {
      axios.post('/ProductPage/SaveOneOffMeasures', { measureId: this.measure.measureId, riskId: this.measure.riskId, responsiblePerson: this.measure.responsiblePerson });
      this.isConfirmVisible = false;
      this.isSuccessVisible = true;
    },
    showForm() {
      this.isConfirmVisible = false;
      this.isFormVisible = true;
    }
  },
  mounted() {
    this.measure =
    {
      measureId: this.$route.query.measureId || "",
      riskId: this.$route.query.riskId || "",
      department: this.$route.query.department || "",
      task: this.$route.query.task || "",
      measureType: this.$route.query.measureType || "",
      responsiblePerson: this.$route.query.responsiblePerson || "",
      date: this.$route.query.date || ""
    };

    this.getTranslation('I00.00056100', 'Are you sure you want to complete this measure?');
    this.getTranslation('I00.00056110', 'There is a new one-off measure thet needs to be reviewed by you.');
    this.getTranslation('I00.00056120', 'One-off measure information');
    this.getTranslation('I00.00056130', 'View one-off measure');
    this.getTranslation('I00.00056140', 'Measure Type');
    this.getTranslation('I00.00056720', 'Review measure');
    this.getTranslation('I00.00056730', 'There is a one-off mesaure that needs to be reviewd by you.');
    this.getTranslation('I00.00056750', 'You have successfully completed one-off-measure.');
  }
}
</script>
