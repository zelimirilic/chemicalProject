<template>
	<div>
		<div v-if="dat.vattenfallDangerSymbols.any()">
			<img class="iconPx24 m-1" v-for="arr in dat.vattenfallDangerSymbols" :src="arr.imageURL" :title="arr.userDefined ? arr.phrase : arr.code" :key="arr.imageName" />
		</div>
		<div v-if="dat.oldLawNotVattenfallDangerSymbols.any()">
			<img class="iconPx24 m-1" v-for="arr in dat.oldLawNotVattenfallDangerSymbols" :src="arr.imageURL" :title="arr.userDefined ? arr.phrase : arr.code" :key="arr.imageName" />
		</div>
		<div v-if="dat.newLawDangerSymbols.any()">
			<img class="iconPx24 m-1" v-for="arr in dat.newLawDangerSymbols" :src="arr.imageURL" :title="arr.userDefined ? arr.phrase : arr.code" :key="arr.imageName" />
		</div>
		<template v-if="!hasAny()">-</template>
	</div>
</template>

<script>
export default {
  props: ['dat'],
  methods: {
    hasAny() {
      return (this.dat.vattenfallDangerSymbols.length + this.dat.oldLawNotVattenfallDangerSymbols.length + this.dat.newLawDangerSymbols.length) !== 0;
    }
  },
}
</script>