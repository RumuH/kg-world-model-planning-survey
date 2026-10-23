"""Generate review indexes from curated data; Python 3.9+, no dependencies."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main():
    papers = json.loads((ROOT / 'data/papers.json').read_text())
    with (ROOT / 'data/papers.csv').open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=list(papers[0]), lineterminator='\n')
        writer.writeheader()
        writer.writerows(papers)
    lines = ['# 论文卡片', '', '核验日期：2026-10-23。P0/P1/P2 为本课题阅读优先级，不是质量评级。代码栏可能为项目页或资料列表；未核实的地址不补猜。', '']
    for p in papers:
        lines += [f"## {p['id']} · {p['title']}", '',
                  f"- 年份 / 出处：{p['year']}；{p['venue']}",
                  f"- 类别 / 优先级：{p['category']}；{p['priority']}",
                  f"- 来源：[原始页面]({p['url']})"]
        if p['pdf']:
            lines.append(f"- PDF：[原始下载链接]({p['pdf']})")
        lines += [f"- 代码或资料：{p['code'] or '本轮未确认'}",
                  f"- 方法：{p['method']}", f"- 与课题的关系：{p['relevance']}",
                  f"- 局限：{p['limitation']}", f"- 核验深度：{p['review_level']}", '']
    (ROOT / 'docs/02_论文卡片.md').write_text('\n'.join(lines), encoding='utf-8')
    roles = {
        'AIRI-Institute/AriGraph': ('作者代码：图记忆与代理', '优先查看 pipeline_arigraph.py、graphs、prompts；需要文本环境与 LLM。'),
        'zjunlp/WKM': ('作者代码：参数化知识模型', '包含知识构建、训练和评估说明；涉及模型权重与训练算力。'),
        'minhphd/DAVIS': ('作者代码：科学任务图记忆规划', '需要 ScienceWorld、模型接口及相应知识；论文明确讨论调用成本。'),
        'Lee-zix/RE-GCN': ('作者代码：时序图预测', '优先复现历史图到未来事件；旧版依赖和数据格式需要实际核对。'),
        'liu-yushan/TLogic': ('作者代码：规则预测', '适合提取可检查的时序规则；运行成本取决于图规模和规则搜索。'),
        'dimitrisdoumanas19/DSS-ARESKG': ('作者工件：领域决策支持', '包含 CSV、场景 PDF、DOCX 查询脚本等；不是可一键启动的完整服务。'),
        'getzep/graphiti': ('通用组件：时间知识记忆', '动态事实、有效时间和证据来源；需要模型服务及图存储，不自带未来预测器。'),
        'microsoft/graphrag': ('通用组件：图检索增强', '适合资料检索与综合问答；索引构建有模型调用成本，不自带规划闭环。'),
        'maitrix-org/llm-reasoners': ('通用框架：世界模型与搜索', '可定制 WorldModel、SearchConfig 和搜索算法；需要自行定义状态、动作及评估。'),
        'shenyangHuang/TGB': ('评测基础设施：时序图基准', '适合统一预测协议；数据规模、下载及资源需求按所选数据集检查。'),
        'danijar/dreamerv3': ('作者代码：潜在世界模型强化学习', '作为世界模型基础参照；涉及交互环境、加速器及训练，不是图谱系统。')
    }
    repos = json.loads((ROOT / 'data/repositories.json').read_text())
    lines = ['# 工程索引', '', '核验日期：2026-10-23。以下均只核验工程页面/API，尚未安装、运行或复现。用途与门槛为本轮整理。', '',
             '| 工程 | 角色 | API 识别许可 | 核验提交 |', '|---|---|---|---|']
    for r in repos:
        name = r['repository']
        lines.append(f"| [{name}]({r['url']}) | {roles[name][0]} | {r['license']} | [{r['commit'][:10]}]({r['url']}/commit/{r['commit']}) |")
    lines += ['', '`UNSPECIFIED` 仅表示 API 未识别许可，不能据此授权复制代码。工程可读性不代表依赖可用或指标可复现。', '']
    for r in repos:
        lines += [f"## {r['repository']}", '', roles[r['repository']][1], '',
                  f"- 默认分支：{r['default_branch']}；核验时是否归档：{r['archived']}。",
                  f"- 状态：`{r['execution_status']}`。实际复现时固定上表 SHA，并按笔记模板记录环境、数据、命令与日志。", '']
    (ROOT / 'docs/03_工程索引.md').write_text('\n'.join(lines), encoding='utf-8')
    print(f'Generated indexes: {len(papers)} papers, {len(repos)} repositories')


if __name__ == '__main__':
    main()
