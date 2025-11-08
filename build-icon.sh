#!/bin/bash

# 待办事项应用图标构建脚本

echo "📦 待办事项应用图标构建工具"
echo "================================"
echo ""

# 检查是否存在 icon.png
if [ ! -f "assets/icon.png" ]; then
    echo "❌ 错误：未找到 assets/icon.png"
    echo ""
    echo "请按以下步骤操作："
    echo "1. 在浏览器中打开 create-icon.html"
    echo "2. 点击'下载图标'按钮"
    echo "3. 将下载的 icon.png 保存到 assets 文件夹"
    echo "4. 重新运行此脚本"
    exit 1
fi

echo "✓ 找到 icon.png"
echo ""

# 创建 iconset 目录
echo "📁 创建 iconset 目录..."
mkdir -p assets/icon.iconset

# 生成不同尺寸的图标
echo "🎨 生成不同尺寸的图标..."

sips -z 16 16     assets/icon.png --out assets/icon.iconset/icon_16x16.png > /dev/null 2>&1
sips -z 32 32     assets/icon.png --out assets/icon.iconset/icon_16x16@2x.png > /dev/null 2>&1
sips -z 32 32     assets/icon.png --out assets/icon.iconset/icon_32x32.png > /dev/null 2>&1
sips -z 64 64     assets/icon.png --out assets/icon.iconset/icon_32x32@2x.png > /dev/null 2>&1
sips -z 128 128   assets/icon.png --out assets/icon.iconset/icon_128x128.png > /dev/null 2>&1
sips -z 256 256   assets/icon.png --out assets/icon.iconset/icon_128x128@2x.png > /dev/null 2>&1
sips -z 256 256   assets/icon.png --out assets/icon.iconset/icon_256x256.png > /dev/null 2>&1
sips -z 512 512   assets/icon.png --out assets/icon.iconset/icon_256x256@2x.png > /dev/null 2>&1
sips -z 512 512   assets/icon.png --out assets/icon.iconset/icon_512x512.png > /dev/null 2>&1
sips -z 1024 1024 assets/icon.png --out assets/icon.iconset/icon_512x512@2x.png > /dev/null 2>&1

echo "  ✓ 生成完成"
echo ""

# 生成 icns 文件
echo "🔨 生成 .icns 文件..."
iconutil -c icns assets/icon.iconset -o assets/icon.icns

if [ -f "assets/icon.icns" ]; then
    echo "  ✓ icon.icns 生成成功"
    echo ""
    
    # 清理临时文件
    echo "🧹 清理临时文件..."
    rm -rf assets/icon.iconset
    echo "  ✓ 清理完成"
    echo ""
    
    echo "✅ 图标构建完成！"
    echo ""
    echo "📍 图标位置: assets/icon.icns"
    echo ""
    echo "下一步："
    echo "  运行 npm run build:mac 打包应用"
    echo ""
else
    echo "  ❌ 生成 icns 失败"
    exit 1
fi
