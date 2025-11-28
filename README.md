# high-light-contact-info
高亮页面上的联系人信息

<img width="2546" height="2166" alt="image" src="https://github.com/user-attachments/assets/c058bf95-5813-4b3c-9b9d-f6e92542fe01" />


# 面向GPT开发
开发故事 https://zelikk.blogspot.com/2025/12/high-light-contact-info.html  
```
有这样一个HTML页面
页面中可能包含 "first name", 也有可能 是在 input元素的 placeholder 属性中包含 "first name"
我需要查找并高亮这些 "first name" 
```

```
需要整合为可以在浏览器的 console 执行的 js 文件 
```

```
把 first name, firstname, full name, fullname, 全名, 姓名 归为一类, 显示同样的高亮颜色或边框颜色.
对于同一类关键字, 边框颜色和文字底色颜色应该一致.
```

```
把 first name, firstname, last name, lastname, full name, fullname, 全名, 姓名 归为一类, 显示同样的高亮颜色或边框颜色.
把 phone number, phone, 电话 归为一类.
把 street address, street, 街道地址, 街道 归为一类.
把 city, 城市 归为一类.
把 full state name, state, 州全称, 州 归为一类.
把 postcode, zip code, 邮编, 归为一类.
以上每一类, 都要使用独特鲜明的颜色, 不应该与其它任何一类颜色相同.
```

# 油猴插件
https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
