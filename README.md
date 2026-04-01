# @yanglt/my-mark-demo

一个简单的Node.js CLI工具，使用TypeScript编写，能够在命令行界面中接收用户输入的问题，并回复问题内容加上当前东八区时间戳。

## 功能特性

- 使用TypeScript开发，提供类型安全
- 简单的CLI界面，支持用户输入问题
- 回复包含用户问题和东八区时间戳
- 可全局安装使用

## 开发流程

### 1. 项目初始化
```bash
# 创建项目目录并进入，此时会自动创建一个新的npm项目，包含package.json文件
npm init -y
```

### 2. 安装依赖
```bash
# 此命令的作用是安装TypeScript编译器和Node.js类型定义文件作为开发依赖
npm install --save-dev typescript @types/node
```

### 3. 配置TypeScript
创建 `tsconfig.json` 文件，此文件的作用是配置TypeScript编译器的选项，指定编译目标、模块系统、输出目录等设置：
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. 编写代码
创建 `src/index.ts` 文件：
```typescript
#!/usr/bin/env node

// 导入readline模块，用于创建命令行界面
import * as readline from 'readline';

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 处理Ctrl+C信号
rl.on('SIGINT', () => {
  console.log('\n再见！');
  rl.close();
  process.exit(0);
});

// 递归函数：持续询问用户输入
function askQuestion() {
  rl.question('请输入您的问题（输入 /exit 退出）：', (question) => {
    // 检查是否要退出
    if (question.trim() === '/exit') {
      console.log('再见！');
      rl.close();
      return;
    }

    // 获取当前时间戳，使用东八区时区
    const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

    // 输出用户的问题和时间戳
    console.log(`您的问题：${question} - 时间戳：${timestamp}\n`);

    // 继续询问下一个问题
    askQuestion();
  });
}

// 开始询问
askQuestion();
```

### 5. 配置package.json
更新 `package.json` 中的bin字段：
```json
{
  "name": "@yanglt/my-mark-demo",
  "version": "1.0.0",
  "description": "A simple CLI tool that responds to user questions with timestamps",
  "main": "dist/index.js",
  "bin": {
    "mark": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 6. 构建项目
```bash
# 运行TypeScript编译器，将src目录下的TypeScript代码编译到dist目录
npm run build
```

### 7. 本地测试
```bash
# 通过npm link命令将当前项目链接到全局，这样就可以在命令行中直接使用mark命令来测试工具
npm link
mark
# 使用后卸载mark命令的步骤是：npm unlink -g
```

## 使用方法

### 安装
```bash
npm install -g @yanglt/my-mark-demo
```

### 运行
```bash
mark
```
然后按提示输入您的问题，工具会回复问题内容和当前东八区时间戳。

### 示例输出
```
请输入您的问题（输入 /exit 退出）：什么是TypeScript？
您的问题：什么是TypeScript？ - 时间戳：2026/4/1 10:30:15

请输入您的问题（输入 /exit 退出）：Node.js是什么？
您的问题：Node.js是什么？ - 时间戳：2026/4/1 10:30:25

请输入您的问题（输入 /exit 退出）：/exit
再见！
```

## 部署流程

### 1. 推送到GitHub
```bash
git init
git add .
git commit -m "Initial commit"
gh repo create my-mark-demo --public --source=. --remote=origin --push
```

### 2. 发布到npm
```bash
npm login
npm publish
```

### 3. 验证安装
```bash
npm install -g @yanglt/my-mark-demo
mark
```

## 项目结构
```
my-mark-demo/
│── src/
│   └── index.ts          # TypeScript源代码
├── dist/
│   └── index.js          # 编译后的JavaScript
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
├── README.md             # 项目说明文档
└── .gitignore            # Git忽略文件
```

## 技术栈
- Node.js
- TypeScript
- readline (内置模块)

## 许可证
MIT
