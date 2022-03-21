<template>
	<div class="row">
		<div class="col-xl-6 col-12 mb-4">
			<div class="input-group">
				<label class="alert alert-danger w-100 mt-2" v-show="!isValid && errorMessage">{{ errorMessage }}</label>
			</div>
		</div>
	</div>
</template>

<script>
import SimplePickProduct from './SimplePickProduct';

export default {
  extends: SimplePickProduct,
  name: 'SimplePickProduct'
}
</script>