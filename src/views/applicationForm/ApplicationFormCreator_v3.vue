<template>
	<MainLoader v-if="!application" />
	<div v-else>
		<div class="actionCard row mt-4" @mousemove="itemDragging.moved" @mouseup="itemDragging.dropped">
			<SmallLoader v-if="isSaving" />
			<template v-else>
				<Tickers class="col-12 mb-4" />
				<div class="col-8">
					<div class="form-inline">
						<label class="form-control-label mr-3">{{ getTranslation('I00.00028790', 'Choose') }}:</label>
						<SelectGroup :items="applicationTypes" :value="applicationTypes[activeFieldTab]" @input="(activeFieldTab = applicationTypes.indexOf($event)), (activeTab = 0)" />
					</div>
					<TabsContainer class="mt-4 readOnly" :areTabsDraggable="activeFieldTab === 1" :childs="children" v-model="activeTab" :isEdit="true" :dat="data" :canAdd="activeFieldTab !== 0" @set-selected="setSelected" @set-selected-container="setSelectedContainer" @add-tab="addTab('Review')" @remove-tab="removeTab" @grabbed="itemDragging.grabbed" />
				</div>
				<div class="col-4" v-if="selected == null">
					<Sticky class="card" :marginTop="10">
						<ul class="nav nav-tabs">
							<li class="nav-item" v-for="(tab, index) in tabs[activeFieldTab]" :key="index">
								<A class="nav-link tab" :class="{ active: fieldsTab === index }" @click="fieldsTab = index">
									<b>{{ tab.name }}</b>
								</A>
							</li>
						</ul>

						<div class="tab-content tabWrapper withSticky overflow">
							<div class="tab-pane active">
								<div class="p-3" v-if="!tabHasVisible(tabs[activeFieldTab][fieldsTab])">
									<p class="mb-0">{{ getTranslation('I00.00049500', 'All fields are already in use!') }}</p>
								</div>
								<div class="row no-gutters" v-if="filterVisible(tabs[activeFieldTab][fieldsTab].items).length > 0">
									<div class="col-4 py-3 position-relative borderRB text-center" v-for="(element, index) in filterVisible(tabs[activeFieldTab][fieldsTab].items)" :key="index">
										<div class="roundedBtn">
											<button type="button" class="btn btn-plain" @mousedown="addElement(element)"><span class="icons icon-plus accent"></span></button>
										</div>
										<p class="icons big mt-2 mb-0 cursorDrag" :class="getIcon(element.icon || element.template)" :title="element.name" @mousedown="itemDragging.grabbed(null, element, $event)"></p>
										<p class="mt-1 mb-0 pt-1 px-3 small">{{ element.name }}</p>
										<!-- <component :key="index" :is="element.template" :show-placeholder="true" v-bind="element.props" additionalClass="mt-3 px-4"></component> -->
									</div>
								</div>
							</div>
						</div>
					</Sticky>
				</div>
				<!-- @*Props*@ -->
				<div class="col-4" v-else>
					<Sticky class="card" :marginTop="10">
						<Properties :selected="selected" @close="selected = null" />
					</Sticky>
				</div>
				<!-- @*Preview*@ -->
				<ModalDialog additionalClass="w-80" :title="getTranslation('I00.00016540', 'Preview')" @close="showPreview = false" v-if="showPreview">
					<TabsContainer class="readOnly" :childs="children" v-model="activeTab" :dat="data" additionalClass="pt-3" />
				</ModalDialog>

				<div v-if="movingElement != null" :style="movingStyle" class="borderDashTRBL">
					<div class="position-relative borderRB text-center">
						<p class="my-0 cursorDrag" :class="movingElement.icon != null ? 'icons big ' + getIcon(movingElement.icon || movingElement.template) : 'movingTab'" :title="movingElement.name">{{ movingElement.icon != null ? '' : movingElement.props.text }}</p>
					</div>
				</div>

				<ModalDialog v-if="saveTemplateName != null" additional-class="wp-400" :title="getTranslation('I00.00045770', 'Insert name for new template!')" @close="saveTemplateName = null">
					<Input v-model="saveTemplateName" />
					<div class="d-flex pt-4 justify-content-end">
						<ButtonOk :class="{ disabled: isNullOrEmpty(saveTemplateName) }" @click="save(saveTemplateName)" />
						<ButtonCancel @click="saveTemplateName = null" />
					</div>
				</ModalDialog>
			</template>
		</div>
	</div>
</template>

<script>
import TabsContainer from '../../components/applicationForm/TabsContainer_v3';
import Section from '../../components/applicationForm/Section_v3';
import Container from '../../components/applicationForm/Container_v3';
import Properties from '../../components/applicationForm/Properties_v3';
import Sticky from '../../components/common/sticky/Sticky_v3';
import MainLoader from '../../components/common/loaders/MainLoader_v3';
import SmallLoader from '../../components/common/loaders/SmallLoader_v3';
import SelectGroup from '../../components/common/form/select/SelectGroup_v3';
import A from '../../components/common/others/A_v3';
import ModalDialog from '../../components/common/modal/ModalDialog_v3';
import Input from '../../components/common/form/input/Input_v3';
import ButtonOk from "../../components/common/button/button/ButtonOk_v3";
import ButtonCancel from "../../components/common/button/button/ButtonCancel_v3";
import Tickers from "../../components/ticker/Tickers_v3";
import { deepClone, isNullOrEmpty, isBetween, getAllChildrens, ticker, errorDebug, hashCode } from '../../libraries/common_v3';
import { createOtherFunctions, createValidationFunctions, defaultData, requestFields, reviewFields } from '../../libraries/applicationFormData_v3';
import { validators } from '../../libraries/forms_v3';
import eqnode from 'eqnode';
import { getAllChildren } from '../../libraries/vue_v3';
import '../../libraries/array_v3';
import axios from '../../axios';
import { guid } from '../../libraries/string';

export default {
  name: 'ApplicationFormCreator',
  components: {
    Sticky,
    TabsContainer,
    Properties,
    MainLoader,
    SmallLoader,
    SelectGroup,
    A,
    ModalDialog,
    Input,
    ButtonOk,
    ButtonCancel,
    Tickers
  },
  data(self) {
    var data = defaultData();
    var tabs = [requestFields.call(self), reviewFields.call(self)];
    tabs.mapMany(f => f.mapMany(g => g.items))
      .filter(f => f.props.validations).mapMany(f => f.props.validations)
      .forEach(f => f.fnc = (new Function('data, validators, value', f.strFnc).bind(self, data, validators)));

    return {
      data,
      application: null,
      selected: null,
      selectedTab: null,
      showPreview: false,
      showTemplate: true,
      activeTab: 0,
      fieldsTab: 0,
      movingElement: null,
      movingStyle: {
        position: 'fixed',
        backgroundColor: '#fff',
        zIndex: 999,
        opacity: .8,
        left: 'px',
        top: '0px',
      },
      tabs,
      activeFieldTab: 0,
      saveTemplateName: null,
      isSaving: false,
      startHash: null,
    };
  },
  methods: {
    getNewApplication() {
      return {
        template: {
          request: {
            children: [{
              template: 'TabsContainer',
              props: { id: guid(), text: this.getTranslation('I00.00009540', 'Application') },
              children: [{
                template: 'Section',
                props: { id: guid(), text: this.getTranslation('I00.00055480', 'Section name'), isSelected: true },
                children: []
              }]
            }],
          },
          review: {
            children: [{
              template: 'TabsContainer',
              props: { id: guid(), text: this.getTranslation('I00.00009630', 'Review') },
              children: [{
                template: 'Section',
                props: { id: guid(), text: this.getTranslation('I00.00055480', 'Section name'), isSelected: true },
                children: []
              }]
            }]
          },
          propNum: 0
        },
      };
    },
    addElement(element) {
      ticker.removeMessage(this.getTranslation('I00.00054190', 'You must add section first.'));
      ticker.removeMessage(this.getTranslation('I00.00054200', 'No container component is selected.'));

      var clone = this.cloneElementForAdding(element);

      if (element.name === this.getTranslation('I00.00037700', 'Section'))
        this.activeCollection.children.push(clone);
      else {
        var selected = this.getFieldContainers()
          .find(f => f.props.isSelected);
        if (!selected) {
          if (!this.activeCollection.children.any())
            ticker.addWarningMessage(this.getTranslation('I00.00054190', 'You must add section first.'));
          else ticker.addWarningMessage(this.getTranslation('I00.00054200', 'No container component is selected.'));
        } else selected.children.push(clone);
      }

      if (element.children)
        this.setSelectedContainer(clone);
    },
    cloneElementForAdding(element) {
      var clone = deepClone(element);
      if (isNullOrEmpty(clone.props.dataProp))
        clone.props.dataProp = 'dynamic.' + clone.props.propRoot + this.application.template.propNum++;
      //   clone.props.isHidden = false;
      clone.props.id = guid();
      return clone;
    },
    setSelected(element) {
      this.selected = {
        template: element.template + 'Props',
        props: element.props
      };
    },
    setSelectedContainer(element) {
      this.getFieldContainers()
        .forEach(f => this.$set(f.props, 'isSelected', false));

      element.props.isSelected = true;
    },
    getManyChildren(dat) {
      return [dat].pushMany(getAllChildrens(dat));
    },
    getFieldContainers() {
      return this.getManyChildren(this.children[this.activeTab])
        .filter(f => [Section, Container].includes(f.template) > -1);
    },
    getAllUsedFields(tab) {
      return this.getManyChildren({ children: this.options[tab].children }).tail();
    },
    getNodes() {
      function req(el) {
        var nod = new eqnode(el);
        if (el.children && el.children.length > 0) {
          el.children.forEach(function (f) {
            nod.addChild(req(f));
          });
        }
        return nod;
      }
      var nod = req({ children: this.children });
      var vueChildren = getAllChildren(this).filter(f => f.$el.id);

      var mapElements = (nod, vue) => {
        if (vue)
          nod.item.htmlElement = () => vue.$el.hasAttribute('component') ? vue.$el.parentNode.parentNode : vue.$el.parentNode;

        nod.children.forEach(child => {
          var el = vueChildren.find(f => f.$el.id == child.item.props.id);
          mapElements(child, el);
        })
      };

      mapElements(nod, this);
      return nod;
    },
    filterVisible(arr) {
      return this.filteredFields(arr, this.activeFieldTab);
    },
    filteredFields(arr, tab) {
      var usedFields = this.getAllUsedFields(tab);
      return arr.filter(f => !f.canBeOnlyOne || !usedFields.any(g => (g.template === f.template || g.template.__file === f.template.__file) && g.props.dataProp === f.props.dataProp));
    },
    tabHasVisible(tab) {
      return this.filterVisible(tab.items).any();
    },
    componentExists() {
      //   return Vue.options.components[template] != null;
    },
    getRelativePosition(target, event) {
      var rect = target.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    },
    findMouseOnElement(nodes, event) {
      var filtered = nodes.filterAny(f => {
        if (!f.item.htmlElement) return false;
        var bnd = f.item.htmlElement() != null ? f.item.htmlElement().getBoundingClientRect() : null;
        return bnd != null ? isBetween(event.clientX, bnd.left, bnd.right) && isBetween(event.clientY, bnd.top, bnd.bottom) : false;
      });
      if (!filtered) return null;
      return nodes.find(f => f.item === filtered.toArray().last());
    },
    findMouseOnTabElement(nodes, event) {
      var tabs = event.currentTarget.getElementsByClassName('tabWidthIcns');

      for (var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        var bnd = tab.getBoundingClientRect();

        if (isBetween(event.clientX, bnd.left, bnd.right) && isBetween(event.clientY, bnd.top, bnd.bottom)) {
          return nodes.children.filter(f => f.item.props.text === tab.children[0].text.replaceAll('\n', '').replaceAll('\t', ''))[0];
        }
      }

      return null;
    },
    findBeforeElementIndex(node, event) {
      var filtered = node.children
        .filter(f => f.item.htmlElement && f.item.htmlElement().getBoundingClientRect().top < event.clientY)
        .sortBy(f => f.item.htmlElement().getBoundingClientRect(), (f, g) => f.top < g.top || f.left < g.left);

      if (!filtered) return -1;
      return node.children.indexOf(filtered.first());
    },
    // onMouseUpFnc() { return () => null; },
    addTab(name) {
      this.children.push({
        template: 'TabsContainer',
        props: { id: guid(), text: `${name} step` },
        children: [{
          template: 'Section',
          props: { id: guid(), text: 'Section name:', isSelected: true },
          children: []
        }]
      });
    },
    removeTab(tab) {
      this.children.remove(tab);
      this.activeTab = Math.min(this.activeTab, this.children.length - 1);
    },
    getIcon(template) {
      return 'icon-' + (template.name || template).camelCase().toLowerCase();
    },
    newApplication() {
      var promise = this.isChanged ?
        this.confirm(this.getTranslation('I00.00053950', 'Unsaved data'), this.getTranslation('I00.00053960', 'You have unsaved data. Are you sure you want to proceed?')) :
        this.confirm(this.getTranslation('I00.00054360', 'Clear the form'), this.getTranslation('I00.00054370', 'Are you sure you want to clear the form?'));

      promise
        .then(() => this.application = this.getNewApplication())
        .catch(errorDebug);
    },
    loadTemplate() {
      axios.get('/ApplicationFormCreator/FormCreator')
        .then(response => {
          var application = response.data || this.getNewApplication();

          if (application.isPublished) {
            application.id = 0;
            application.name = null;
          }
          this.application = application;
          this.startHash = this.applicationHash;

          var { request, review } = application.template;
          createValidationFunctions.call(this, [request, review].mapMany(f => getAllChildrens(f)));
          createOtherFunctions.call(this, [request, review].mapMany(f => getAllChildrens(f)));
        }).catch(errorDebug);
    },
    startSaving(isPublished) {
      this.application.isPublished = isPublished;
      if (this.application.name)
        this.save(this.application.name);
      else this.saveTemplateName = '';
    },
    save(name) {
      this.isSaving = true;
      axios.post('/ApplicationFormCreator/Save', { ...this.application, name, numOfSteps: this.application.template.review.children.length, jsonTemplate: JSON.stringify(this.application.template) })
        .then(response => {
          if (response.data.isSaved) {
            if (this.application.isPublished) {
              ticker.addSuccessMessage(this.getTranslation('I00.00016700', 'Published'));
              this.application.id = 0;
              this.application.name = null;
            } else {
              this.application.id = response.data.templateID;
              this.application.name = name;
            }
            this.saveTemplateName = null;
            this.isSaving = false;
            this.startHash = this.applicationHash;
          }
        }).catch(err => {
          this.isSaving = false;
          errorDebug(err)
        });
    },
    publish() {
      ticker.clearMessages();
      for (var i = 0; i < this.tabs.length; i++) {
        if (this.filteredFields(this.tabs[i][0].items, i).any()) {
          ticker.addErrorMessage(this.getTranslation('I00.00054330', 'You must use all mandatory fields for').format(this.applicationTypes[i]));
          return;
        }
      }
      this.startSaving(true);
    },
    isNullOrEmpty,
  },
  computed: {
    applicationTypes() {
      return [this.getTranslation('I00.00010290', 'Request'), this.getTranslation('I00.00009540', 'Application')]
    },
    options() {
      return [this.application.template.request, this.application.template.review];
    },
    children() {
      return this.options[this.activeFieldTab].children;
    },
    itemDragging() {
      var self = this;

      var retObj = {
        grabbed(grabCol, element, event) {
          //   element.props.isHidden = true;
          self.movingElement = JSON.parse(JSON.stringify({ ...element }));
          self.movingElement.props.dataProp = undefined;

          var calculatePosition = event => {
            var pos = self.getRelativePosition(document.body, event);

            return {
              left: pos.x - 10,
              top: pos.y - document.body.parentElement.scrollTop - 10
            };
          };

          var elPos = calculatePosition(event);

          self.movingStyle.left = elPos.left + 'px';
          self.movingStyle.top = elPos.top + 'px';

          retObj.moved = event => {
            event.preventDefault();
            var elPos = calculatePosition(event);

            self.movingStyle.left = elPos.left + 'px';
            self.movingStyle.top = elPos.top + 'px';
          };
          retObj.dropped = event => {
            var isSection = element.template === 'Section';
            var isTab = element.template === 'TabsContainer';
            self.movingElement = null;
            // element.props.isHidden = false;

            var nodes = self.getNodes();
            var sectionsNodes = nodes.filterAny(f => f.item.template === 'Section');
            if (isSection) {
              nodes = sectionsNodes;
              if (!nodes) {
                self.addElement(element);
                return;
              }
            } else if (!sectionsNodes) {
              ticker.addWarningMessage(self.getTranslation('I00.00054190', 'You must add section first.'));
            }

            var onElement = self.findMouseOnElement(nodes, event);
            var onTab = isTab ? self.findMouseOnTabElement(nodes, event) : null;
            var onTabIndex = isTab ? onElement.children.indexOf(onTab) : -1;

            if (!onElement || onElement.item === element || (!isTab && !onElement.getParent)) return;

            if (grabCol) {
              // making sure only tab element can be dropped on tab element or non-tab element on non-tab element
              if ((isTab && onElement.children.filter(x => x.item.template === 'TabsContainer').length > 0) || (!isTab && onElement.children.filter(x => x.item.template === 'TabsContainer').length == 0))
                grabCol.remove(element);
            }
            else
              element = self.cloneElementForAdding(element);

            var bnd = onElement.item.htmlElement().getBoundingClientRect();

            if (onElement.item.children && !isSection) {
              // making sure only tab element can be dropped on tab element or non-tab element on non-tab element
              if (!isTab && onElement.children.filter(x => x.item.template === 'TabsContainer').length == 0)
                onElement.item.children.pushAt(element, self.findBeforeElementIndex(onElement, event) + 1);
              else if (isTab && onElement.children.filter(x => x.item.template === 'TabsContainer').length > 0)
                onElement.item.children.pushAt(element, onTabIndex);
            } else if (!isTab) {
              var arr = onElement.getParent().item.children;
              var addNum = bnd.top + bnd.height / 2 < event.clientY ? 1 : 0;

              arr.pushAt(element, arr.filter(f => f !== element).indexOf(onElement.item) + addNum);
            }

            retObj.moved = () => null;
            retObj.dropped = () => null;
            // self.onMouseUpFnc = function () { return function () { }; };
          };
        },
        moved: () => null,
        dropped: () => null,
      };

      return retObj;
    },
    activeCollection() {
      return this.children[this.activeTab];
    },
    isChanged() {
      return this.startHash !== this.applicationHash;
    },
    applicationHash() {
      if (this.application) {
        var req = el => {
          var nod = new eqnode({ ...el, children: undefined, props: { ...el.props, id: undefined, isSelected: undefined, dataProp: undefined } });
          if (el.children && el.children.length > 0) {
            el.children.forEach(function (f) {
              nod.addChild(req(f));
            });
          }
          return nod;
        }

        var striped = this.options.map(req);
        return hashCode(striped);
      } else return null;
    }
  },
  mounted() {
    this.loadTemplate();
    if (process.env.NODE_ENV === 'development') window['thisApplicationFormCreator'] = this;
    this.getTranslation('I00.00054190', 'You must add section first.');
    this.getTranslation('I00.00054200', 'No container component is selected.');
    this.getTranslation('I00.00016700', 'Published');
    this.getTranslation('I00.00054330', 'You must use all mandatory fields for');
    this.getTranslation('I00.00054360', 'Clear the form');
    this.getTranslation('I00.00054370', 'Are you sure you want to clear the form?');
    this.$store.state.hasMenu = true;
    this.$emit('updated');
  },
  beforeDestroy() {
    this.$store.state.hasMenu = false;
  },
  beforeRouteLeave(to, from, next) {
    if (this.application && !this.isSaving && this.isChanged) {
      this.confirm(this.getTranslation('I00.00053950', 'Unsaved data'), this.getTranslation('I00.00053960', 'You have unsaved data. Are you sure you want to proceed?'))
        .then(() => next())
        .catch(errorDebug);
    } else next();
  },
  updated() {
    this.$emit('updated');
  }
}


// 	temporaryScripts.SetDatepickerV4 = function () {
// 		$("#startDate').datepicker({
// 			showOn: "both",
// 			buttonImageOnly: true,
// 			buttonImage: "../~master/new_style_images/v4/icons/calendar.png",
// 			dateFormat: "yy-mm-dd"
// 		});

// 		var lang = getClientLocalization();
// 		if ($.datepicker.regional[lang] == null)
// 			lang = "sv";

// 		$.datepicker.setDefaults($.datepicker.regional[lang]);
// 	}
// 	temporaryScripts.Back = function () { HistoryGoBack(); };
// 	temporaryScripts.Preview = function() {
// 		vm.showPreview = !vm.showPreview;
// 	};
// 	temporaryScripts.New = function () {
// 		loadedTemplate = null;
// 		var temp = getNewApplication();
// 		vm.request = temp.request;
// 		vm.review = temp.review;
// 		vm.activeTab = 0;
// 	}


// 	RegisterDynamicScripts(window, window.temporaryScripts);
</script>