### canvasplus.js

### 兼容性

- `typedArray` IE 11 +
- `ImageData` Constructor

### 使用之前
```
npm install
```
### command
###### 运行script压缩脚本
```
gulp 
```
###### 运行server
> 有些例子必须在server环境下运行

```
gulp server
```
### getting start

```js
plus  = new Canvasplus(CANVAS_DOM);

```
### doc

* plus.normalBrush() 初始化一个新的笔刷
* plus.rotate90(imagedata) 将选定区域逆时针旋转90度
	- @arguments imagedata
	- @return new imagedata
* plus.mxm(m1,m2) 矩阵乘法
	- @arguments matrix
	- @return matrix	
* plus.mxv(m,v) 矩阵乘以向量
* plus.dotproduct(v1,v2) 向量相乘
* plus.matrix(imagedata) 通过imagedata来构造矩阵
* plus.flat(m) 通过matrix来构造imagedata
* plus.trans(m) 矩阵转置	
