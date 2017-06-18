# 咕噜咕噜哒弹幕 Gulugulu Danmaku

## What
<ruby>
不只是在<a href="http://bilibili.com/">B站</a>可以吐槽，使用咕噜咕噜，连看网页也可以吐槽，只需要加入以下脚本到你的网站
<rt>if you like Tsukkomi on <a href="https://en.wikipedia.org/wiki/Niconico">niconico</a>, then good news, now you can Tsukkomi on any website, with gulugulu script</rt>
</ruby>

## How
```
<script src="https://oyanglul.us/gulugulu/public/main.min.js"></script>
```

<ruby>
或者安装 Chrome 插件，就可以在任何网页上吐槽
<rt>or with <a href="https://github.com/dashengSun/gulugulu-chrome">Chrome extension</a>, to Tsukkomi on any website which don't have gulugulu script installed</rt>
</ruby>

<p>
<ruby>
与B站不同的是，你浏览的网页不像视频，是没有时间轴的，因此所有发送的弹幕都会跟着Y轴
<rt>but there's one thing is different from Bilibili, unlike a video, it's easy to display danmaku on certain timeframe of a video, but for a web page, it's hard to introduce concept of timeframe.</rt>

</ruby>
</p>

<p>
<ruby>
也就是说Y轴相当于视频的进度条，你滚到哪，在那个地方发的弹幕就会出现。
<rt>so gulugulu place danmaku according to Y asix, which means if you shoot a danmaku on y=100px, then you will see it while you scroll to y=100px</rt>
</ruby>
</p>


## Privacy

<ruby>
所有数据存储在google firebase database，记录的数据只包含，网址，时间，Y轴，文字（将来可能会加入弹幕颜色）。
<rt>All data store at google firebase database, which only contains URI, time, y axis and danmaku text(and color maybe in future). <rt>
</ruby>

<ruby>
不涉及IP，登陆（当然我们也不需要登陆）等任何隐私信息，也不不以任何形式审核或分析数据。
<rt>we'll not collect any IP or login etc private information, and never analytic data in any form.</rt>
</ruby>

<ruby>
但请遵守当地法律以及<a href="http://www.bilibili.com/blackboard/help.html#d5">弹幕礼仪<a>。
<rt>please respecte your law in local and Danmaku manner</rt>
</ruby>

<br/>

<script src="public/main.min.js"></script>
