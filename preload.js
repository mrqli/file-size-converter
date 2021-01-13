'use strict';

const placeholder = "Paste the file size with measurement unit here";
const numReg = /\d+.?\d*/;
const unitReg = /[a-z]+/;
const unitMap = {
   'B': ['bytes', 'b'],
   'KB': ['kilobytes', 'kb'],
   'MB': ['megabytes', 'mb'],
   'GB': ['gigabytes', 'gb'],
   'TB': ['terabytes', 'tb']
};
const units = ['B', 'KB', 'MB', 'GB', 'TB'];

var onEnter = (action, callbackSetList) => {
   callbackSetList([]);
};

var handleInput = (searchWord) => {
   let num = searchWord.match(numReg)?.[0];
   let inputUnit = searchWord.match(unitReg)?.[0];

   for (let key of Object.keys(unitMap)) {
      if (unitMap[key].includes(inputUnit)) {
         return {
            valid: !isNaN(num),
            num: num,
            unit: key
         };
      }
   }

   return {
      valid: false,
      num: '',
      unit: ''
   };
};

var convert = (data) => {
   let level = units.indexOf(data.unit);
   let num = data.num;
   if (num < 1 && level > 0) {
      while (num < 1 && level > 0) {
         num *= 1024;
         level--;
      }
   }
   else {
      while (num > 1024 && level < units.length) {
         num /= 1024;
         level++;
      }
   }
   return num + ' ' + units[level];
};

var onSearch = (action, searchWord, callbackSetList) => {
   let data = handleInput(searchWord.toLowerCase());

   callbackSetList([
      {
         title: searchWord,
         description: data.valid ? convert(data) : ''
      }
   ])  
};

window.exports = {
   "file_size_converter": { // 注意：键对应的是 plugin.json 中的 features.code
      mode: "list",  // 列表模式
      args: {
         // 进入插件时调用（可选）
         enter: (action, callbackSetList) => {
            // 如果进入插件就要显示列表数据
            onEnter(action, callbackSetList);
         },
         // 子输入框内容变化时被调用 可选 (未设置则无搜索)
         search: (action, searchWord, callbackSetList) => {
            // 获取一些数据
            // 执行 callbackSetList 显示出来
            onSearch(action, searchWord, callbackSetList);

         },
         // 用户选择列表中某个条目时被调用
         select: (action, itemData, callbackSetList) => {
            window.utools.hideMainWindow();
            window.utools.outPlugin();
         },
         // 子输入框为空时的占位符，默认为字符串"搜索"
         placeholder: placeholder
      } 
   }
}