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
