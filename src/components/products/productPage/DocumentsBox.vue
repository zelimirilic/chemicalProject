<template>
	<InformationBox editIcon="icon-attach" :tooltipTtl="getTranslation('I00.00016670', 'Attach document')" :noRow="true" :title="getTranslation('I00.00013090', 'Documents')" @edit="$emit('edit')">
		<template v-if="documentCategories == 'departmentDocumentsOnly'">
			<SmallLoader @mounted="$emit('get-department-documents')" v-if="!departmentDocuments" />
			<DataTable tableWrapClass="mxhp-260" :tableData="depDoc" noFooter noHeader noSearch :perPage="1000" v-else>
				<template #head>
					<tr>
						<Th class="w-45" sort>{{ getTranslation('I00.00004270', 'Name') }}</Th>
						<Th sort defaultSort>{{ getTranslation('I00.00048640', 'Type') }}</Th>
						<Th sort>{{ getTranslation('I00.00007040', 'Language') }}</Th>
						<Th class="iconCol twoIcons">{{ getTranslation('I00.00055930', 'Action') }}</Th>
					</tr>
				</template>
				<template #body="prod">
					<tr>
						<td class="w-45">
							<div class="d-flex align-items-center">
								<span class="docType icon-sds"></span>
								<div class="ml-1">
									<p class="mb-0">
										<a class="secondaryTxt" :href="prod.item.url" target="_blank">
											<b>{{ prod.item.linkName }}</b>
										</a>
									</p>
									<p class="mb-0" v-if="prod.item.uploadDate">{{ parseDate(prod.item.uploadDate) }}</p>
								</div>
								<b></b>
							</div>
						</td>
						<td>
							{{ prod.item.docTypeObj ? `${prod.item.docTypeObj.name}` : '' }}
						</td>
						<td>
							{{ prod.item.docTypeObj && prod.item.documentLanguage ? `${prod.item.documentLanguage}` : '' }}
						</td>
						<td class="iconCol twoIcons">
							<span class="icons icon-delete smallIcn" v-tooltip="getTranslation('I00.00039230', 'Delete')" @click="removeDocument(prod.item)" withReadOnlyMode v-if="!prod.item.fromApplication"></span>
							<a class="icons icon-opentab" v-tooltip="getTranslation('I00.00055750', 'Document')" :href="prod.item.url" target="_blank"></a>
						</td>
					</tr>
				</template>
			</DataTable>
		</template>
		<template v-else>
			<Tabs class="plainTabs" :tabs="tabs" prop="text" :value="selectedTab" @input="tabChanged">
				<SmallLoader v-if="!(selectedTab == 0 ? fileLinksOwn : departmentDocuments) || deleteLoader" />
				<div v-if="selectedTab == 0 ? fileLinksOwn : departmentDocuments">
					<DataTable tableWrapClass="mxhp-260" :tableData="selectedTab == 0 ? ownDoc : depDoc" noFooter noHeader noSearch :perPage="1000">
						<template #head>
							<tr>
								<Th class="w-45" sort>{{ getTranslation('I00.00004270', 'Name') }}</Th>
								<Th sort defaultSort>{{ getTranslation('I00.00048640', 'Type') }}</Th>
								<Th sort>{{ getTranslation('I00.00007040', 'Language') }}</Th>
								<Th class="iconCol twoIcons">{{ getTranslation('I00.00055930', 'Action') }}</Th>
							</tr>
						</template>
						<template #body="prod">
							<tr>
								<td class="w-45">
									<div class="d-flex align-items-center">
										<span class="docType icon-sds"></span>
										<div class="ml-1">
											<p class="mb-0">
												<a class="secondaryTxt" :href="prod.item.url" target="_blank">
													<b>{{ prod.item.linkName }}</b>
												</a>
											</p>
											<p class="mb-0" v-if="prod.item.uploadDate">{{ parseDate(prod.item.uploadDate) }}</p>
										</div>
										<b></b>
									</div>
								</td>
								<td>
									{{ prod.item.docTypeObj ? `${prod.item.docTypeObj.name}` : '' }}
								</td>
								<td>
									{{ prod.item.docTypeObj && prod.item.documentLanguage ? `${prod.item.documentLanguage}` : '' }}
								</td>
								<td class="iconCol twoIcons">
									<span class="icons icon-delete smallIcn" v-tooltip="getTranslation('I00.00039230', 'Delete')" @click="removeDocument(prod.item)" withReadOnlyMode v-if="!prod.item.fromApplication && prod.item.fromProduct"></span>
									<a class="icons icon-opentab" v-tooltip="getTranslation('I00.00055750', 'Document')" :href="prod.item.url" target="_blank"></a>
								</td>
							</tr>
						</template>
					</DataTable>
				</div>
			</Tabs>
		</template>
	</InformationBox>
</template>

<script>
import { parseDate } from '../../../libraries/date';
import { idsAreEqual, errorDebug, ticker } from '../../../libraries/common';
import { nodeNamePath } from '../../../libraries/tree';
import InformationBox from './InformationBox';
import Tabs from '../../../components/common/tabs/Tabs';
import axios from '../../../axios';

export default {
  components: {
    Tabs,
    InformationBox,
  },
  props: ['risks', 'risksCount', 'product', 'docTypes', 'fileLinksOwn', 'departmentDocuments', 'documentCategories', 'orgId'],
  data() {
    return {
      selectedTab: 0,
      safetySheetOpened: false,
      SDSOpened: false,
      OwnDocumentOpened: false,
      DepartmentDocumentOpened: this.documentCategories == 'departmentDocumentsOnly',
      removeDoc: false
    };
  },
  methods: {
    tabChanged(tab) {
      this.selectedTab = tab;
      if (this.selectedTab == 1 && !this.departmentDocuments)
        this.$emit('get-department-documents')
    },
    getDepartmentNodeNamePath(item) {
      var nod = this.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, item.orgID));
      return nodeNamePath(nod);
    },
    parseDate: parseDate,
    removeDocument(item) {
      var deletedDocument = [...new Set([...(this.departmentDocuments || []), ...(this.fileLinksOwn || [])])].find(g => g.id === item.id);
      this.confirm(this.getTranslation('I00.00006310', 'Delete'), this.getTranslation('I00.00013240', 'Are you sure that you want to delete the document?'))
        .then(() => {
          this.removeDoc = true;
          axios.post('/Documents/DeleteDocument', { doc_id: item.id, fileID: item.fileID, prodid: this.product ? this.product.id.id : 0, prodidmdbid: this.product ? this.product.id.id_mdbID : 0 })
        })
        .then(() => {
          if (this.documentCategories == 'departmentDocumentsOnly')
            (this.departmentDocuments || []).splice(this.departmentDocuments.findIndex(x => x.id === deletedDocument.id), 1);
          else
            this.selectedTab == 0 ? (this.fileLinksOwn || []).splice(this.fileLinksOwn.findIndex(x => x.id === deletedDocument.id), 1) : (this.departmentDocuments || []).splice(this.departmentDocuments.findIndex(x => x.id === deletedDocument.id), 1);

          this.removeDoc = false;
          this.$nextTick(() => ticker.addSuccessMessage(this.getTranslation('I00.00022350', 'Success')));
          if (deletedDocument.typeOfDocID == 157)
            this.$emit('exposure-scenario-deleted');
        }).catch(this.errorDebug);
    },
    errorDebug(message) {
      return errorDebug(message);
    },
  },
  computed: {
    tabs() {
      return [
        { text: this.getTranslation('I00.00052070', 'Own documents'), id: 0, value: 0 },
        { text: this.getTranslation('I00.00055350', 'Department documents'), id: 1, value: 1 },
      ];
    },
    sds() {
      return this.documentCategories != 'departmentDocumentsOnly' ? this.product.fileLinks.filter(f => f.typeOfDocID === 100 && f.typeOfDocID_mdbID === 10 && f.activeSDS) : null;
    },
    ownDoc() {
      var root = this.sideTree.getAllData().getTopParent().item.orgID;
      return (this.fileLinksOwn || []).map(f => ({
        ...f,
        docTypeObj: (this.docTypes || []).find(g => g.id === f.typeOfDocID && g.id_mdbID === f.typeOfDocID_mdbID) || { name: this.getTranslation('I00.00044430', 'Other') }
      })).filter(f => f.orgID == root.id && f.orgID_mdbID == root.id_mdbID && !f.fromApplication);
    },
    depDoc() {
      var nodeSelected = this.orgId;
      return (this.departmentDocuments || []).map(f => ({
        ...f,
        docTypeObj: (this.docTypes || []).find(g => g.id === f.typeOfDocID && g.id_mdbID === f.typeOfDocID_mdbID) || { name: this.getTranslation('I00.00044430', 'Other') }
      })).filter(f => f.orgID == nodeSelected.id && f.orgID_mdbID == nodeSelected.id_mdbID);
    },
    deleteLoader() {
      return this.removeDoc;
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') window['thisDocumentBox'] = this;
    this.getTranslation('I00.00006310', 'Delete');
    this.getTranslation('I00.00013240', 'Are you sure that you want to delete the document?');
    this.getTranslation('I00.00022350', 'Success');
  },
};
</script>