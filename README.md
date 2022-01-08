# 网址小尾巴终结者

<p align="center">
  <img src="https://user-images.githubusercontent.com/11046969/148644184-7f80795e-296e-495a-ac69-2126393cdff4.png">
  <br />

Chrome 商店：<a href="https://chrome.google.com/webstore/detail/%E7%BD%91%E5%9D%80%E5%8F%82%E6%95%B0/maimchndejhjkbgkodinoggclbbbeenh">插件地址</a>

</p>

---

在我们日常的开发调试中，会在 URL 上添加一些特殊的小尾巴 用来显示调试界面或者开启一些特殊功能，当你接触了越来越多的系统后，你需要使用的小尾巴就变得越来越多，记忆和使用成本非常大，以及含有小尾巴的网址 在跳来跳去的过程中小尾巴可能丢失等问题，迫切需要解决。

于是做了下面的小工具，如下图所示：

<p align="center"><img src="https://user-images.githubusercontent.com/11046969/148644050-078a0fee-1629-4218-b95a-96904ba601e2.png" width="300" /></p>

详细文档：[请点击此处](https://blog.csdn.net/lecepin/article/details/112435516)

---

### 匹配实现

匹配实现代码如下：

```js
urlMatch == window.location.host || window.location.href.indexOf(urlMatch) == 0;

// 例如：
// 当前网址 https://github.com/lecepin
// 工具中的 URL:
//              ✅ github.com      // urlMatch == window.location.host
//              ✅ https://github  // window.location.href.indexOf(urlMatch) == 0
```

应该可以解决你使用中的疑惑。

当匹配到当前网址时，会判断有没有配置的 query，如果有 则不做任何处理，如果没有 则拼接 URL，并重新加载页面。

![image](https://user-images.githubusercontent.com/11046969/148644494-c30bc212-f966-4010-89d0-1012a5354a6d.png)


### 配置结构

界面上的配置，底层存储结构如下：

```ts
type Config = Array<{
  enable: Boolean;
  urlMatch: String;
  querys: Array<{
    key: String;
    value: String;
  }>;
}>;
```

示例：

```json
[
  {
    "enable": false,
    "querys": [
      {
        "key": "__superModel"
      }
    ],
    "urlMatch": "https://github.com/lecepin"
  },
  {
    "enable": true,
    "querys": [
      {
        "key": "__lp_logger_level",
        "value": "log"
      }
    ],
    "urlMatch": "myweb.com"
  }
]
```
