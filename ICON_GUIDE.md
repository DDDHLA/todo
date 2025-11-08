# 应用图标生成指南

## 🎨 图标设计

我已经为你设计了一个优雅的应用图标，包含：
- 渐变紫色背景（品牌色）
- 白色卡片样式的待办列表
- 三个待办项目（两个未完成，一个已完成）
- 绿色的完成标记圆圈
- 现代化的圆角设计

## 📥 快速生成图标

### 方法一：使用网页工具（推荐 ✨）

1. **打开图标生成器**
   ```bash
   open create-icon.html
   ```
   （浏览器应该已自动打开）

2. **下载图标**
   - 点击页面上的"📥 下载图标"按钮
   - 保存文件名为 `icon.png`

3. **放置图标**
   - 将下载的 `icon.png` 移动到项目的 `assets` 文件夹
   
4. **打包应用**
   ```bash
   npm run build:mac
   ```
   electron-builder 会自动将 PNG 转换为 icns 格式

### 方法二：使用命令行工具

如果你已经有了 `icon.png` 在 assets 文件夹：

```bash
./build-icon.sh
npm run build:mac
```

## 📦 打包应用

运行以下命令打包成 DMG 安装包：

```bash
npm run build:mac
```

打包完成后，DMG 文件会生成在 `dist` 目录下。

## 🎯 图标规格

- **尺寸**: 1024×1024 像素
- **格式**: PNG（透明背景）
- **用途**: electron-builder 会自动生成 .icns（macOS）

## 🔧 如果遇到问题

### 问题1: 图标没有正确显示
- 确保 `assets/icon.png` 存在
- 检查图标尺寸是否为 1024×1024
- 清理构建缓存：`rm -rf dist`

### 问题2: 想自定义图标
- 编辑 `assets/icon.svg`
- 或者用任何图像编辑软件创建新的 1024×1024 PNG
- 保存为 `assets/icon.png`

## ✅ 完成检查清单

- [ ] 打开 `create-icon.html` 生成图标
- [ ] 下载并保存 `icon.png` 到 `assets` 文件夹
- [ ] 运行 `npm run build:mac` 打包应用
- [ ] 在 `dist` 文件夹找到生成的 DMG 文件
- [ ] 安装并测试应用

## 🚀 后续步骤

打包完成后：
1. 在 `dist` 目录找到 `待办事项-1.0.0.dmg`
2. 双击 DMG 文件
3. 将应用拖到 Applications 文件夹
4. 从启动台或应用程序文件夹打开应用

享受你的全新待办事项应用！🎉
