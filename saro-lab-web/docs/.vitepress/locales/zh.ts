import type { Messages } from './index'

export const zh: Messages = {
  label: '中文',
  lang: 'zh',
  link: '/zh/',
  description: 'SARO Lab 的开源项目 — 分布式系统、开发者工具与函数库。MIT 许可证。',

  menu_docs: '文档',
  menu_projects: '项目',
  menu_tool: '工具',
  nav_prev: '上一篇',
  nav_next: '下一篇',
  page_not_found: '页面未找到',
  open_site: '访问网站',
  open_github: 'GitHub',
  open_npm: 'npm',
  external_link: '在新标签页中打开',
  copy_code: '复制',

  home_tagline: 'SARO Lab 开源项目',
  home_projects: '项目',
  home_tools: '工具',

  proj_dat_tag: '分布式访问令牌',
  proj_dat_desc:
    '面向无状态 HTTP 服务的分布式访问令牌系统。通过支持独立的认证密钥签发系统解决固定密钥问题，同时默认支持数据加密；采用二进制格式而非 JSON，带来最优的轻量化与速度。',

  proj_ticketing_tag: '分布式锁服务器',
  proj_ticketing_desc:
    '精确控制服务器与进程执行顺序的高性能开源分布式锁服务。彻底阻断限量超卖、座位重复分配、优惠券并发使用等流量瞬间涌入时出现的并发故障。',

  proj_nabi_tag: 'WYSIWYG 编辑器',
  proj_nabi_desc:
    '彻底摆脱框架依赖的 WYSIWYG 编辑器，从原生 JS 到 React、Vue、Svelte，任何环境都能灵活接入。除文本编辑、文件上传、表格对齐等丰富的基础功能外，还支持添加自定义功能与完全自由的样式定制。',

  proj_unixtime_tag: '无限 Unix time',
  proj_unixtime_desc:
    '能够精确处理从公元前到无限未来所有时间范围的时区与日期处理函数库。所有对象保持不可变，杜绝过去日期上的地方平均时 (LMT) 误差；支持各类格式解析与时区功能，在 npm 与原生打包环境中都能灵活使用。',

  live: '实时',
  now: '现在',
  year: '年',
  month: '月',
  day: '日',
  hour: '时',
  minute: '分',
  second: '秒',
  seconds: '秒',
  millisecond: '毫秒',

  doc_reference: 'API 文档',
  doc_install: '安装',

  unixtime_timezone: '时区偏移',
  unixtime_timezone_note:
    '不使用时区数据库。所有 API 接收以分钟为单位的固定偏移，符号与 Date.prototype.getTimezoneOffset 一致。因此地方平均时不会混入旧日期。',
  unixtime_create: '创建',
  unixtime_parse: '解析',
  unixtime_parse_note:
    '解析遵循与格式化相同的格式。格式不匹配时不会猜测，而是抛出异常。',
  unixtime_read: 'Unixtime',
  unixtime_read_note: '默认返回 bigint，使用 $ 则返回 number。',
  unixtime_detail: '日期时间、时间',
  unixtime_detail_note:
    '需要多个字段时，用它而不是逐个 getter。进位只计算一次，负时间戳下取值也不会错位。',
  unixtime_format: '格式化',
  unixtime_relative: '相对时间',
  unixtime_relative_note:
    'toRelative 返回相对于当前时间的相对时间。',
  unixtime_date: '日期',
  unixtime_date_note: '所有取值都以偏移作为最后一个参数，省略时使用浏览器时区。',
  unixtime_week: '星期与周次',
  unixtime_week_note:
    '普通周次以周日为起始、每周至少 1 天，ISO 周次以周一为起始、每周至少 4 天。',
  unixtime_time: '时间',
  unixtime_move: '移动',
  unixtime_move_note: '实例不可变，每次调用都会产生新值。按月、按年移动会保留日期，若该日不存在则调整为当月最后一天。',
  unixtime_compare: '比较',
  unixtime_compare_note: '比较函数接受工厂函数能接受的任何值，因此无需转换 Date 或数字。',
  unixtime_types: '类型',
}
