<template>
	<div class="row align-items-center mx-0 mb-3">
		<div class="searchProdBox col-10" :class="appSettings.bastaSearch ? 'pl-0 pr-3' : 'px-0'">
			<div class="row align-items-center">
				<div class="col-5">
					<div class="input-group roundedInpWrap searchWrap">
						<Input class="form-control" v-model="searchWord" @keydown.enter="submitSearch" focus ref="input" />
						<button class="input-group-append" @click="submitSearch">
							<span class="input-group-text icon-search" :class="{ disabled: searchButtonDisabled }"></span>
						</button>
					</div>
				</div>
				<div class="col-5">
					<Select :items="searchData" prop="text" v-model="searchCategory" compareByHash />
				</div>
				<div class="col-2">
					<Select :items="countries" :class="{ disabled: !countries }" prop="CountryName" :value="country" @input="$emit('countryChanged', $event)" />
					<!-- <Animation smallAnimation v-if="!countries.any()"/> -->
				</div>
			</div>
		</div>
		<div class="col-2 ml-auto pl-3" v-if="appSettings.bastaSearch">
			<A onclick="window.open('https://www.bastaonline.se','Basta Search');">
				<img class="img-fluid" :src="appSettings.imageFolder + 'bastaLogo.png'" alt="BastaSearch" />
			</A>
		</div>
	</div>
</template>

<script>
import Search from './Search';
import Input from '../../common/form/input/Input_v3';
import Select from '../../common/form/select/Select_v3';
import A from '../../common/others/A_v3';
//import { isNullOrEmpty } from '../../../libraries/common_v3';

export default {
  extends: Search,
  name: 'Search',
  components: {
    Input,
    Select,
    A
  }
}
</script>