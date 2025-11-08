const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 开始生成应用图标...\n');

// 检查是否安装了 imagemagick
try {
  execSync('which convert', { stdio: 'pipe' });
  console.log('✓ 检测到 ImageMagick');
} catch (error) {
  console.log('⚠️  未检测到 ImageMagick');
  console.log('请使用以下命令安装：');
  console.log('brew install imagemagick');
  console.log('\n或者手动使用在线工具转换 assets/icon.svg 为 icon.png (1024x1024)');
  console.log('然后运行：npm run build:mac\n');
  process.exit(1);
}

const svgPath = path.join(__dirname, 'assets/icon.svg');
const iconsetPath = path.join(__dirname, 'assets/icon.iconset');

// 创建 iconset 目录
if (!fs.existsSync(iconsetPath)) {
  fs.mkdirSync(iconsetPath, { recursive: true });
}

// 需要的图标尺寸
const sizes = [
  { size: 16, scale: 1 },
  { size: 16, scale: 2 },
  { size: 32, scale: 1 },
  { size: 32, scale: 2 },
  { size: 128, scale: 1 },
  { size: 128, scale: 2 },
  { size: 256, scale: 1 },
  { size: 256, scale: 2 },
  { size: 512, scale: 1 },
  { size: 512, scale: 2 }
];

console.log('🎨 生成不同尺寸的 PNG 图标...');

sizes.forEach(({ size, scale }) => {
  const actualSize = size * scale;
  const filename = scale === 1 
    ? `icon_${size}x${size}.png`
    : `icon_${size}x${size}@2x.png`;
  
  const outputPath = path.join(iconsetPath, filename);
  
  try {
    execSync(
      `convert -background none -resize ${actualSize}x${actualSize} "${svgPath}" "${outputPath}"`,
      { stdio: 'pipe' }
    );
    console.log(`  ✓ ${filename}`);
  } catch (error) {
    console.error(`  ✗ 生成 ${filename} 失败:`, error.message);
  }
});

console.log('\n🔨 生成 .icns 文件...');

const icnsPath = path.join(__dirname, 'assets/icon.icns');

try {
  execSync(`iconutil -c icns "${iconsetPath}" -o "${icnsPath}"`, { stdio: 'pipe' });
  console.log('  ✓ icon.icns 生成成功');
  
  // 清理 iconset 目录
  fs.rmSync(iconsetPath, { recursive: true, force: true });
  console.log('  ✓ 清理临时文件');
  
  console.log('\n✅ 图标生成完成！');
  console.log('📍 图标位置: assets/icon.icns');
  console.log('\n现在可以运行打包命令：npm run build:mac\n');
} catch (error) {
  console.error('  ✗ 生成 .icns 失败:', error.message);
  process.exit(1);
}
