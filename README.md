# 知识图谱增强的态势预测与指挥决策调研

围绕 **世界模型 / 时序知识图谱 / 任务规划 / 决策支持** 整理公开论文与工程，供多人协作阅读、补充和复现。

首轮调研：**2026-10-23**。当前包含 **21 项论文资料、11 个工程索引、3 篇可再分发的 CC BY 4.0 论文 PDF**。首轮以来源核验和研究路线梳理为主，尚未运行作者项目或复现实验。

## 从这里开始

- [调研报告：术语、路线、研究问题与实验设计](docs/01_调研报告.md)
- [21 项论文卡片：方法、相关性、局限、阅读深度](docs/02_论文卡片.md)
- [11 个工程：用途、许可证、复现门槛](docs/03_工程索引.md)
- [检索方法、去重规则与待核验事项](docs/04_检索与证据说明.md)
- [收录的 PDF、作者署名、来源与许可证](papers/README.md)
- [协作方式](CONTRIBUTING.md) · [论文笔记模板](notes/TEMPLATE.md)
- [结构化论文数据](data/papers.csv) · [JSON](data/papers.json) · [工程快照](data/repositories.json)

## 首轮结论

这个方向适合沿着“**图状态表示 → 未来事件或状态转移预测 → 约束规划 → 执行反馈**”组织。知识图谱问答、未来链接预测和行动后的状态模拟需要分别评价。

建议阅读顺序：世界模型综述 → Worldformer → AriGraph / DAVIS → RE-GCN / TLogic → KGLAMP → E-KELL / ARES-KG。具体来源均在论文卡片中。

GraphRAG、动态图记忆和图数据库可以成为支撑组件；仅接入这些组件不足以证明系统具备未来预测或任务规划能力。这是本调研对各项工作功能边界的归纳。

## 协作与维护

新增论文先查 `data/papers.json`，以 DOI / arXiv ID 去重。提交笔记、核验修正和复现记录使用 Pull Request；待查资料和认领工作可使用 Issues。维护者在 GitHub 仓库设置中添加需要写权限的协作者。

本轮没有复制第三方工程代码。工程索引记录了核验时的提交 SHA，便于复现时固定版本。数据中的 `UNSPECIFIED` 表示 GitHub API 未识别许可证，需进一步核查，不能理解为可任意使用。

```bash
python3 scripts/build_indexes.py
python3 scripts/validate.py
# 从已核验的 CC BY 4.0 来源重新下载收录 PDF
python3 scripts/fetch_open_papers.py
```

`build_indexes.py` 由结构化数据生成论文卡片、工程索引与 CSV；手工分析放在调研报告和独立笔记中。

## 资料权利

自撰调研文字采用 [CC BY 4.0](LICENSE.md)。第三方论文、数据与代码保留各自权利，不能套用本仓库文字许可。收录 PDF 均保留原件，并在 `papers/README.md` 标出作者、来源和 CC BY 4.0 许可证；其他论文仅提供链接。
