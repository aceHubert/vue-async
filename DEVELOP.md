## 开发注意事项

### changelog

`lerna-changelog`基于`pr`来为项目生成`changelog`

<strong>使用步骤</strong>

1、从`master`分支切换出`feature`/`bugfix`等分支。  
2、完成开发后进行`commit`，推荐使用`commitizen`来规范`commit msg`，同时有助于对后续子项目生成`changelog`。  
3、将新分支`push`到`remote`端。  
4、创建`pr`，并打上`label`，此处一定要打上`label`，`learn-changelog`就是根据 label 来确定该`pr`属于`feature`/`bugfix`/`document`等。  
5、切记要在`merge`之前打上`label`。  
6、进行`merge` `pr`操作。
7、本地切换到`master`分支并进行`pull操`作。  
8、执行`lerna-changelog`，既可得到一份`changeling`。

<strong>注意</strong>

1、`pr`的`label`并不能随意设置，一定要在项目中声明对应才生效。  
官方默认支持`breaking`/`enhancement`/`bug`/`documentation`/`internal`，如果想用其他，则需要在 package.json 中进行相应的配置。

```json
{
  "changelog": {
    "labels": {
      "feat": ":rocket: New Feature",
      "bug": ":bug: Bug Fix",
      "doc": ":memo: Documentation",
      "internal": ":house: Internal",
      "breaking": ":boom: Breaking Change"
    }
  }
}
```

2、src/version 在 publish 时自动更新版本号，不需要手动修改。发布后不需要签入。

<br>

### 子项目的 changelog

具体还需参考[README](https://github.com/lerna/lerna/blob/514bc57a53/commands/version/README.md#--conventional-commits)
