<template>
	<div class="backdrop" tabindex="0">
		<div class="modalCard">
			<div class="card" :class="additionalClass">
				<div class="card-header">
					<h5 class="innerTtl">{{ title }}</h5>
					<button class="btn btn-plain" type="button" @click="$emit('close')" v-if="!propToBool(hideClose)"><span class="icons icon-close xsmallIcn"></span></button>
				</div>
				<slot v-if="withFooter == true"></slot>
				<div class="card-body" v-else>
					<slot></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ModalDialog from '../../common/modal/ModalDialog';


export default {
  extends: ModalDialog,
  name: 'ModalDialog'
}
</script>