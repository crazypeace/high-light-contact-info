// ==UserScript==
// @name         高亮美国人信息
// @namespace    http://tampermonkey.net/
// @version      2025-11-28
// @description  try to take over the world!
// @author       You
// @include      *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=racknerd.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // --- 1. 配置关键字类别和颜色 ---
    const highlightCategories = [
        {
            keywords: ['first name', 'firstname', 'last name', 'lastname', 'full name', 'fullname', '全名', '姓名', '名字', '姓氏'],
            textBgColor: 'red',
            textColor: 'white',
            borderColor: 'red',
            className: 'highlight-name'
        },
        {
            keywords: ['phone number', 'phone', '电话', '電話號碼'],
            textBgColor: 'blue',
            textColor: 'white',
            borderColor: 'blue',
            className: 'highlight-phone'
        },
        {
            keywords: ['street address', 'street', '街道地址', '街道'],
            textBgColor: 'green',
            textColor: 'white',
            borderColor: 'green',
            className: 'highlight-address'
        },
        {
            keywords: ['city', '城市'],
            textBgColor: 'purple',
            textColor: 'white',
            borderColor: 'purple',
            className: 'highlight-city'
        },
        {
            keywords: ['full state name', 'state', '州全称', '州'],
            textBgColor: 'orange',
            textColor: 'black',
            borderColor: 'orange',
            className: 'highlight-state'
        },
        {
            keywords: ['postcode', 'zip code', '邮编', '郵遞區號'],
            textBgColor: 'cyan',
            textColor: 'black',
            borderColor: 'cyan',
            className: 'highlight-postcode'
        }
    ];

    // --- 2. 注入 CSS 样式 ---
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    let styles = '';

    highlightCategories.forEach(category => {
        // 文字高亮样式 (使用 !important 确保覆盖页面原有样式)
        styles += `
        .${category.className}-text {
            background-color: ${category.textBgColor} !important;
            font-weight: bold !important;
            color: ${category.textColor} !important;
        }
        `;
        // Input/Placeholder 边框高亮样式
        styles += `
        .${category.className}-input {
            border: 3px solid ${category.borderColor} !important;
            /* 使用 box-shadow 实现发光效果 */
            box-shadow: 0 0 8px ${category.borderColor}, 0 0 10px ${category.borderColor} inset !important;
        }
        `;
    });

    styleElement.textContent = styles;
    document.head.appendChild(styleElement);


    // --- 3. 核心高亮逻辑 ---

    highlightCategories.forEach(category => {
        const textClassName = `${category.className}-text`;
        const inputClassName = `${category.className}-input`;

        // 创建总的正则表达式：允许有空格或没有空格
        const keywordPattern = category.keywords.map(kw => {
            let safeKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (kw.includes(' ')) {
                 safeKw = safeKw.replace(/ /g, '(?: |)');
            }
            return safeKw;
        }).join('|');

        // 使用不区分大小写（i）和全局（g）匹配的正则表达式
        const regex = new RegExp(`(${keywordPattern})`, 'gi');

        // --- A. 高亮可见文本节点 ---

        // 使用 document.createTreeWalker 遍历文本节点，效率更高
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        const nodesToReplace = [];

        while (node = walker.nextNode()) {
            if (node.parentNode &&
                // 排除不应修改文本内容的元素，且确保该节点尚未被高亮处理（即不包含在已添加的 span 中）
                !['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'SELECT', 'NOSCRIPT', 'A', 'BUTTON'].includes(node.parentNode.tagName) &&
                !node.parentNode.classList.contains(textClassName) &&
                node.nodeValue.trim().length > 0 &&
                node.nodeValue.match(regex))
            {
                nodesToReplace.push(node);
            }
        }

        nodesToReplace.forEach(node => {
            const text = node.nodeValue;

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            // 使用 replaceCallback 细粒度地创建元素
            text.replace(regex, (match, p1, offset) => {
                // 1. 添加匹配前普通文本
                if (offset > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex, offset)));
                }

                // 2. 添加高亮 span
                const span = document.createElement('span');
                span.className = textClassName;
                span.textContent = match;
                fragment.appendChild(span);

                lastIndex = offset + match.length;
            });

            // 3. 添加匹配后剩余文本
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
            }

            // 用新的片段替换原始文本节点
            node.parentNode.replaceChild(fragment, node);
        });

        // --- B. 查找并标记 input/textarea 的 placeholder 属性 ---

        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(inputElement => {
            const placeholderText = inputElement.getAttribute('placeholder');

            // 检查是否匹配关键字且尚未被该类高亮标记
            if (placeholderText && placeholderText.match(regex) && !inputElement.classList.contains(inputClassName)) {
                // 在 placeholder 中找到匹配，为元素添加类来提供视觉反馈 (只添加一次)
                inputElement.classList.add(inputClassName);
                console.log(`[Highlighter: ${category.className}] Found "${placeholderText}" in placeholder. Marked input element.`);
            }
        });
    });

    console.log(`[Highlighter] All six categories processed and highlighted.`);

})();
