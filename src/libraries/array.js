import { isFunction } from './common';
import { propToFnc } from './vue';

if (!Array.prototype.remove) {
	Array.prototype.remove = function (dat) {
		var ind = this.indexOf(dat);
		if (ind >= 0)
			this.splice(ind, 1);
		return this;
	}
}
if (!Array.prototype.removeAt) {
	Array.prototype.removeAt = function (ind) {
		if (ind >= 0)
			this.splice(ind, 1);
		return this;
	}
}
if (!('find' in Array.prototype)) {
	Array.prototype.find = function (find, that /*opt*/) {
		var v;
		for (var i = 0, n = this.length; i < n; i++)
			if (i in this && find.call(that, v = this[i], i, this))
				return v;
		return undefined;
	};
}
if (!Array.prototype.mapMany)
	Array.prototype.mapMany = function (mapper) {
		return this.reduce(function (prev, curr) {
			return prev.pushMany(mapper(curr));
		}, []);
	};
if (!('pushMany' in Array.prototype)) {
	Array.prototype.pushMany = function (arr) {
		var self = this;
		arr.forEach(function (f) { self.push(f); });
		return self;
	};
}
if (!('pushAt' in Array.prototype))
	Array.prototype.pushAt = function (obj, ind) {
		var self = this;
		self.splice(ind, 0, obj);
		return self;
	};
if (!Array.prototype.first)
	Array.prototype.first = function () {
		return this[0];
	};
if (!Array.prototype.firstOrDefault)
	Array.prototype.firstOrDefault = function () {
		return this.length == 0 ? null : this.first();
	};
if (!Array.prototype.last)
	Array.prototype.last = function () {
		return this[this.length - 1];
	};
if (!Array.prototype.lastOrDefault)
	Array.prototype.lastOrDefault = function () {
		return this.length == 0 ? null : this.last();
	};
if (!('head' in Array.prototype)) {
	Array.prototype.head = function () {
		var self = this;
		return self.filter(function (f, ind) { return ind < self.length - 1 });
	};
}
if (!('tail' in Array.prototype)) {
	Array.prototype.tail = function () {
		var self = this;
		return self.filter(function (f, ind) { return ind > 0 });
	};
}
if (!('any' in Array.prototype)) {
	Array.prototype.any = function (fnc) {
		var self = this;
		if (fnc == null) return self.length > 0;
		return self.find(fnc) !== undefined;
	};
}
if (!('all' in Array.prototype)) {
	Array.prototype.all = function (fnc) {
		var self = this;
		return self.filter(fnc).length === self.length;
	};
}
if (!('take' in Array.prototype)) {
	Array.prototype.take = function (max) {
		var self = this;
		return self.filter(function (f, ind) { return ind < max });
	};
}
if (!('takeFromTo' in Array.prototype)) {
	Array.prototype.takeFromTo = function (from, to) {
		var self = this;
		return self.filter(function (f, ind) { return ind >= from && ind <= to; });
	};
}
if (!('takeInGroups' in Array.prototype)) {
	Array.prototype.takeInGroups = function (numOfElInGroup) {
		var self = this;
		return self.filter(function (f, ind) { return ind % numOfElInGroup === 0; })
			.map(function (f, ind) { return self.takeFromTo(ind * numOfElInGroup, (ind + 1) * numOfElInGroup - 1) });
	};
}
if (!('mapToObject' in Array.prototype)) {
	Array.prototype.mapToObject = function (key, value) {
		if (!isFunction(key))
			key = function (f) { return f[key] };
		if (!isFunction(value))
			value = function (f) { return f[value] };

		var retObj = {};

		this.forEach(function (f) {
			retObj[key(f)] = value(f);
		});
		return retObj;
	};
}

if (!Array.prototype.sortBy) {
	Array.prototype.sortBy = function (prop, sortfnc) {
		if (sortfnc == null)
			sortfnc = function (f, g) { return f > g; };
		var propfnc = propToFnc(prop);

		var retdata = this.map(function (f) { return f; });
		for (var i = 0; i < retdata.length - 1; i++)
			for (var j = i + 1; j < retdata.length; j++)
				if (sortfnc(propfnc(retdata[i]), propfnc(retdata[j]))) {
					var temp = retdata[i];
					retdata[i] = retdata[j];
					retdata[j] = temp;
				}
		return retdata;
	}
}

if (!Array.prototype.groupBy)
	Array.prototype.groupBy = function (prop) {
		var propFnc = propToFnc(prop);
		return this.reduce(function (groups, item) {
			var val = propFnc(item);
			var find = groups.find(function (f) { return f.key == val; });
			if (find != null)
				find.items.push(item);
			else
				groups.push({ key: val, items: [item] });
			return groups;
		}, []);
	};
if (!Array.prototype.unique)
	Array.prototype.unique = function (propFnc) {
		return this.groupBy(propFnc)
			.filter(function (f) { return f != null })
			.map(function (f) { return f.items.first(); });
	};

if (!Array.prototype.toggle)
	Array.prototype.toggle = function (item, add) {
		var hasItem = this.indexOf(item) !== -1;
		if (add == null) {
			!hasItem ? this.push(item) : this.remove(item);
		} else {
			if (add && !hasItem)
				this.push(item);
			else if (!add && hasItem)
				this.remove(item);
		}
		return this;
	};

if (!('deleted' in Array.prototype)) {
	Array.prototype.deleted = function () {
		return this.filter(f => f.deleted);
	};
}

if (!('notDeleted' in Array.prototype)) {
	Array.prototype.notDeleted = function () {
		return this.filter(f => !f.deleted);
	};
}