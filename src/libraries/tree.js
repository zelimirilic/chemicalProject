import Vue from 'vue';
import axios from '../axios';
import { hashCode, idsAreEqual } from './common';
import eqnode from 'eqnode';

export const getOrganisationTreeData = () => axios
	.get('/OrganizationTree/GetTreeData')
	.then(response => convertToEqNode(response.data.organisationTree));

const convertToEqNode = (treeData) => {
	var node = new eqnode(parseDepartment(treeData.item));
	var fnc = function fnc(node, children) {
		if (children && children.length) {
			children.forEach(f => {
				var it = new eqnode(parseDepartment(f.item));
				node.addChild(it);
				fnc(it, f.children);
			});
		}
	};
	fnc(node, treeData.children);
	node.forEach(f => f.item.id = idFnc(f.item));

	return node;
}

var productTypeTreeData = null;
export const getProductTypeTreeData = () => {
	if (productTypeTreeData)
		return Promise.resolve(productTypeTreeData);
	else
		return axios
			.get('/ProducttypeTree/GetCompleteTreeData')
			.then(response => {
				productTypeTreeData = convertToEqNodeProductTree(response.data)
				return productTypeTreeData;
			});
}

const convertToEqNodeProductTree = (treeData) => {
	var node = new eqnode(parseProductType(treeData.item));
	var fnc = function fnc(node, children) {
		if (children && children.length) {
			children.forEach(f => {
				var it = new eqnode(parseProductType(f.item));
				node.addChild(it);
				fnc(it, f.children);
			});
		}
	};
	fnc(node, treeData.children);
	node.forEach(f => f.item.id = Math.random());

	return node;
}
const parseDepartment = (item) => {
	var it = {
		...item,
		orgID: {
			id: item.keyID,
			id_mdbID: item.keyID_mdbID
		},
		icon: undefined,
		children: undefined,
		keyID: undefined,
		keyID_mdbID: undefined
	};
	Object.keys(it).filter(key => it[key] === undefined)
		.forEach(key => delete it[key]);
	return it;
}

const parseProductType = (item) => {
	var it = {
		...item,
		orgID: {
			id: item.keyID,
			id_mdbID: item.keyID_mdbID
		},
		children: undefined,
		keyID: undefined,
		keyID_mdbID: undefined
	};
	Object.keys(it).filter(key => it[key] === undefined)
		.forEach(key => delete it[key]);
	return it;
}

export const idFnc = f => Math.abs(hashCode(f.nodePath + f.oastartDate));

// const getNodeIcon = (nod) => {
// 	var icon = "tree-department";
// 	if (nod.icon)
// 		icon = nod.icon.endsWith('.gif') ? icon.substring(0, icon.length - 4) : nod.icon;
// 	return icon + (nod.deleted ? "_grey" : "");
// }

export const defineState = (state, data, prop, val) => {
	Vue.set(state, data.id, state[data.id] || {});
	Vue.set(state[data.id], prop, val);
}

export const isBelowOrgId = (nod, parentId) => [nod, ...nod.getParents()].find(f => idsAreEqual(f.item.orgID, parentId));

export const nodeNameWithParent = (node) => node.getParents().length ? (node.getParents().first().item.name + ' \\ ' + node.item.name) : node.item.name;
export const nodeNamePath = (node) => [...node.getParents().reverse().map(f => f.item.name), node.item.name].join(' \\ ');

export const findNodeNamePath = orgID => nodeNamePath(Vue.prototype.sideTree.getAllData().find(f => idsAreEqual(f.item.orgID, orgID)));

export const checkIfNodeIsUnderRoot = (node, root) => {
	var rootNodeNamePath = root.nodeNamePath.join("/");
	return (node.nodeNamePath.join("/")).includes(rootNodeNamePath);
}