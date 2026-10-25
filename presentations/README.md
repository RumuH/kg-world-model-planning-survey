# 组会分享材料

日期：2026-10-25。约 20 分钟，20 页正文与 4 页备份。内容覆盖重点文献的方法、证据边界、项目适用条件和负责人咨询问题。项目具体需求仍待确认，材料中的建议均按条件讨论。

- [下载可编辑 PowerPoint](output/kg_world_model_lab_meeting_20261025.pptx)，内含逐页演讲者备注和来源。
- [逐页讲稿与分享节奏](../docs/09_组会逐页讲稿.md)。
- [负责人咨询清单与一页需求卡](../docs/08_项目负责人咨询清单.md)。

## 讲解顺序

| 页码 | 内容 | 建议用时 |
|---|---|---|
| 1–4 | 任务边界、知识增强位置和选文献理由 | 约 3 分钟 |
| 5–13 | Worldformer、RE-GCN、TLogic、AriGraph、DAVIS、KGLAMP，补充领域系统 | 约 10 分钟 |
| 14–20 | 项目条件映射、六项优先问题、需求卡和后续判断 | 约 7 分钟 |
| 21–24 | 参考文献与评价协议备份 | 按问答需要使用 |

如果只有 10 分钟，重点讲 2、5、7、9、12、14、15、20 页，其余作为备份。对方法细节的更多解释已放在备注中，无须把整段讲稿塞进页面。

## 素材来源

`assets/davis_query.png` 来自 Pham-Dinh et al., *DAVIS: Planning Agent with Knowledge Graph-Powered Inner Monologue*, arXiv:2410.09252v2，图3。原作者保留著作权，按 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 使用，未修改内容，仅等比例排版。

- [原文](https://arxiv.org/html/2410.09252v2#S1.F3)
- [原始图片](https://arxiv.org/html/2410.09252v2/img/query.png)

`assets/cover_network.png` 是本次通过内置 imagegen 生成的抽象封面配图，仅作装饰，不代表数据、实验结果或真实态势。

生成提示词：

> Use case: productivity-visual. Asset type: decorative cover artwork for a Chinese academic lab meeting PowerPoint on knowledge graph enhanced situation prediction and task planning. Create a quiet editorial scientific illustration, landscape 16:9, warm ivory background with a sparse conceptual network of teal and navy connected points above a subtle topographic surface. The connected points suggest relationships and possible future paths, with a restrained amber accent, no military objects. Composition: concentrate the artwork in the right 45 percent; left 55 percent nearly empty ivory for editable slide title. Professional academic tone, paper-like lighting, precise and understated. No text, no letters, no numbers, no charts claiming results, no logos, no watermark, no interface panels.

## 编辑源文件

- `source/slides.json`：页面内容、讲稿与来源。
- `source/build_in_session.js`：使用 Artifact Session 编排可编辑文字与原生比较表。先替换项目路径占位符，在空的 presentation session 中运行。
- `source/export_local.mjs`：使用配套 Artifact Tool 从已审阅的会话快照导出本地 PPTX，需要配置相应运行时路径。

本次没有开展论文工程安装、模型训练、推理或复现测试。制作演示文稿时的导出和版式核对不构成模型实验。
