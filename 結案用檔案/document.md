# 使用手冊

## 常見問題

- Q：閱讀本手冊的電腦與手機平板硬體需求？
A：本手冊支援Windows以及macOS和各種Linux，但建議透過支援新網頁技術的最新版[Google Chrome瀏覽器](https://www.google.com/chrome/)開啟，以達最佳顯示效果。iOS及Android平板手機使用內建瀏覽器應可正常閱覽，推薦iOS 8.0以及Android 5.0以上。
- Q：提供幾種閱讀方式，各有什麼分別？
A：本手冊提供「EPUB線上瀏覽」、「EPUB下載」以及「HTML版」三種閱讀方式。你可以透過EPUB線上瀏覽直接開啟電子書，或將EPUB下載到裝置上離線閱讀；EPUB下載後建議使用macOS以及iOS的iBooks程式閱讀，Android可使用[Google Play Books](https://play.google.com/store/apps/details?id=com.google.android.apps.books&hl=zh_TW)、[BookWalker](https://play.google.com/store/apps/details?id=tw.com.bookwalker&hl=zh_TW)、[樂天Kobo](https://play.google.com/store/apps/details?id=com.kobobooks.android.tw&hl=zh_TW)等對於EPUB 3固定版面格式支援較佳的閱讀程式，Windows與Linux系統則建議安裝Google Chrome的應用程式[Readium](https://chrome.google.com/webstore/detail/readium/fepbnnnkkadjhjahcafoaglimekefifl?hl=zh-TW)閱讀。HTML版本則是供一般瀏覽器直接閱讀使用。
- Q：本手冊有哪些特別功能？
A：於「壹、國語注音符號體式表」的聲符與韻符說明表格提供兩項功能。點選黃色底色格可朗讀注音符號讀音，藍底色格則會顯示筆順動畫。顯示筆順動畫時，點選外圍灰色處，即可關閉動畫。
- Q：若要列印怎麼辦？是否提供PDF版本？
A：若您要列印或需要PDF版本，請以瀏覽器開啟「HTML版」，使用內建的列印功能即可印出或者轉存為PDF檔案，可關閉「標頭與註腳」來得到更好的列印效果。
- 其他已知問題與限制
	- 以IE 11瀏覽器開啟HTML版時，注音符號讀音無法朗讀。
	- 以Safari、Firefox等瀏覽器開啟線上閱讀版時，注音筆順動畫顯示效果不正確。
	- 在部分版本較舊的Android裝置上以Google Play Books App開啟EPUB 3時，嵌入字體無法正常顯示。

## 安裝方式

請將以下檔案與資料夾移動至伺服器空間，預設index.html為首頁，即可使用。

    /epub
    /html_ch
    /html_en
    index.html

若伺服器使用微軟iis服務，則可能需要額外追加以下檔案類型（mimetype）：

    .epub  application/epub+zip
    .ttf  application/octet-stream
    .woff  application/font-woff
    .svg  image/svg+xml

## 自由軟體資訊

- EPUB以及HTML中使用[教育部標準楷書](http://depart.moe.edu.tw/ed2400/News_Content.aspx?n=8940E5C0456177C3&sms=893AAA1CBFE149DE&s=DFBE7BE3EE0DB6AE)以及[教育部標準宋體](http://depart.moe.edu.tw/ed2400/News_Content.aspx?n=8940E5C0456177C3&sms=893AAA1CBFE149DE&s=161DEBC9EACEA333)，將使用到的文字製作成子集（Subset）後轉換為網頁字型WOFF格式。兩字型皆使用[Creative Common BY-ND 3.0 TW授權](https://creativecommons.org/licenses/by-nd/3.0/tw/)。
- 線上EPUB閱讀程式使用Readium基金會開發之[Readium JS套件](https://github.com/readium/readium-js-viewer)建置，本套件使用[BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause)授權。

## 授權方式