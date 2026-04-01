# npm包发布指南 - 解决403 Forbidden错误

本文档记录了发布 `@yanglt/my-mark-demo` 包时遇到的403错误及解决方案，供未来参考。

## 问题描述

执行 `npm publish --access public` 时报错：

```
npm error code E403
npm error 403 403 Forbidden - PUT https://registry.npmjs.org/@yanglt%2fmy-mark-demo - Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
npm error 403 In most cases, you or one of your dependencies are requesting
npm error 403 a package version that is forbidden by your security policy, or
npm error 403 on a server you do not have access to.
```

## 错误原因分析

npm现在强制要求**所有包发布**必须满足以下条件之一：

1. **启用双因素认证（2FA）** - 账户级别的安全要求
2. **使用具有绕过2FA权限的自动化令牌** - 专门用于CI/CD等自动化场景

即使将包从作用域包（`@username/package-name`）改为非作用域包（`package-name`），2FA要求仍然存在。

## 解决方案

### 方案一：启用npm账户2FA（推荐用于个人账户）

1. 访问 [npmjs.com](https://www.npmjs.com)，登录账户
2. 点击右上角头像 → "Account Settings" → "Security"
3. 启用"Two-Factor Authentication"
4. 选择模式："Authorization and publishing"（授权和发布）
5. 使用认证应用（如Google Authenticator、Authy）扫描二维码
6. 保存生成的恢复代码（重要！）

启用后即可正常使用 `npm publish` 命令。

### 方案二：创建自动化令牌（适用于CI/CD或绕过2FA）

如果不想启用2FA，可以创建专门的自动化令牌：

1. 访问 [npmjs.com](https://www.npmjs.com)，登录
2. 进入"Access Tokens"页面：https://www.npmjs.com/settings/~<username>/tokens
3. 点击"Generate New Token"
4. 选择类型："Automation"（可绕过2FA）
5. 权限选择："Read and Publish"
6. 点击"Generate Token"，复制生成的令牌

在命令行中配置令牌：
```bash
npm set //registry.npmjs.org/:_authToken <你的令牌>
```

## 实际解决步骤

### 第1步：检查当前状态
```bash
# 检查npm登录状态
npm whoami

# 检查包是否已存在
npm view @yanglt/my-mark-demo 2>&1

# 检查账户2FA状态
npm profile get | grep "two-factor"
```

输出显示：
```
two-factor auth: disabled
```
说明并没有开启双因子2FA。

### 第2步：保持作用域包名（重要经验）
**经验教训**：最初错误地将作用域包改为非作用域包，但后来发现作用域包同样可以发布，无需修改包名。

作用域包（`@username/package-name`）和非作用域包（`package-name`）在发布要求上完全相同：
- 都需要2FA或自动化令牌
- 发布命令都是 `npm publish --access public`
- 作用域包的默认访问权限是私有的，必须明确指定 `--access public`

正确的做法是保持原有的作用域包名：
```json
// package.json
{
  "name": "@yanglt/my-mark-demo",  // 保持作用域包名
  // ... 其他配置
}
```

**注意**：如果改为非作用域包名，可能会与已存在的包名冲突，且失去了作用域包的组织归属感。

### 第3步：创建自动化令牌
在npm网站创建"Automation"类型令牌，权限为"Read and Publish"。

### 第4步：设置令牌并发布
```bash
# 设置新令牌
npm set //registry.npmjs.org/:_authToken [REDACTED_NPM_TOKEN]

# 发布包
npm publish --access public
```

### 第5步：验证发布
```bash
# 检查包是否成功发布
npm view @yanglt/my-mark-demo

# 测试全局安装
npm install -g @yanglt/my-mark-demo
mark
```

## 成功输出
```
npm notice package: @yanglt/my-mark-demo@1.0.0
npm notice Tarball Contents
...
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access
+ @yanglt/my-mark-demo@1.0.0
```

## 常见问题排查

### 1. 权限不足
- 确认令牌类型为"Automation"而非"Publish"
- 确认令牌权限包含"Publish"
- 确认账户有发布权限

### 2. 包名冲突
```bash
# 检查包名是否已被占用
npm view <package-name> 2>&1 | grep "not found"
```

### 3. 构建问题
确保项目已正确构建：
```bash
npm run build
ls -la dist/
```

### 4. 网络/代理问题
检查npm registry配置：
```bash
npm config get registry
```

## 最佳实践

### 1. 令牌管理
- 自动化令牌应妥善保存，不要提交到版本控制
- 定期轮换令牌（每6-12个月）
- 在`.gitignore`中添加`.npmrc`

### 2. 版本管理
```bash
# 发布前更新版本号
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# 然后发布
npm publish
```

### 3. 作用域包发布要点
作用域包（`@username/package-name`）发布注意事项：

1. **权限要求**：个人作用域包（`@your-username`）你自动拥有发布权限，无需加入组织
2. **访问权限**：作用域包默认是**私有**的，必须使用 `--access public` 参数发布为公共包
3. **2FA要求**：作用域包和非作用域包的2FA要求完全相同
4. **发布命令**：`npm publish --access public`（必须包含 `--access public`）
5. **命名优势**：作用域包可以避免包名冲突，体现作者身份

**经验总结**：不要因为害怕权限问题而将作用域包改为非作用域包，作用域包完全可以正常发布。

### 4. CI/CD集成
在GitHub Actions等CI/CD环境中：
```yaml
steps:
  - uses: actions/setup-node@v4
    with:
      registry-url: 'https://registry.npmjs.org/'

  - run: npm publish
    env:
      NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 安全注意事项

1. **令牌安全**：自动化令牌具有发布权限，等同于密码
2. **作用域限制**：可以为令牌设置IP白名单（CIDR范围）
3. **定期审计**：定期检查npm账户的活跃令牌
4. **最小权限原则**：仅为令牌授予必要的权限

## 参考链接

- [npm官方文档 - 发布包](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [npm 2FA要求](https://docs.npmjs.com/configuring-two-factor-authentication)
- [创建访问令牌](https://docs.npmjs.com/creating-and-viewing-access-tokens)

---

*最后更新：2026-04-01*
*问题解决者：Claude Code*
*包名：@yanglt/my-mark-demo@1.0.0*