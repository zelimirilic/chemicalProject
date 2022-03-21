<template>
	<div>
		<div class="depIcon">
			<ul class="d-flex flex-row list-unstyled">
				<li v-for="(item, ind) in items" :key="item" class="p-3" :class="{ item: true, selectedIcn: activeIcon === item, 'ml-5': ind > 0 }" @click="activeIcon = item">
					<span :title="item.title" :class="item"></span>
				</li>
			</ul>
		</div>
		<div class="pt-4 text-right">
			<ButtonOk @click="$emit('ok', activeIcon)" />
			<ButtonCancel @click="$emit('cancel')" />
		</div>
	</div>
</template>

<script>
export default {
  props: ['title', 'items', 'icon'],
  data() {
    return {
      activeIcon: this.icon
    }
  },
};
</script>