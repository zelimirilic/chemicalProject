<template>
	<div class="chemsoft-login loginMain d-flex">
		<div class="imgLarge d-flex justify-content-center align-items-center">
			<div class="row no-gutters">
				<div class="textIntro col">
					<div class="imgSmall d-flex justify-content-center align-items-center">
						<div class="welcomeTxt">
							<h2 class="welcomeTtl mb-4">{{ welcomeMainTxt }}</h2>
							<p class="infoTxt">{{ welcomeSubTxt }}</p>
						</div>
					</div>
				</div>
				<slot></slot>
			</div>
		</div>
	</div>
</template>
<script>
export default {
  props: ['welcomeMainTxt', 'welcomeSubTxt']
}
</script>