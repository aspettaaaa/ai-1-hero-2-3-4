export const profile = {
  name: '张子薇',
  role: '视觉设计师',
  phone: '136 8128 6470',
  email: 'ziiiwwww@icloud.com',
  intro:
    '具备从0到1搭建品牌VI体系、IP形象全案与全场景视觉统筹的复合型设计能力。擅长将机器人硬件、技术白皮书、产品宣传等复杂内容转译为清晰、有传播力的视觉语言，并以数据反馈推动设计迭代。',
  heroTitle: '从策略到落地，让视觉真正解决问题。',
  heroSubtitle:
    'Brand systems / cultural creative / illustration / AI-assisted creative workflows.',
  aboutIntro: [
    '视觉设计师｜品牌体系 · 全案创意 · 项目落地',
    '985高校视觉传达硕士，具备品牌视觉体系从0-1搭建与项目落地经验',
    '擅长跨团队协作、项目推进与供应商管理',
    '能将复杂信息转化为清晰、有传播力的视觉内容',
    '覆盖VI、IP、UI界面、宣传物料、社媒、展陈与动态视觉全案设计',
    '熟悉从需求分析到落地验收的全流程，善于用AI提升设计效率与品牌一致性',
  ],
};

export const metrics = [
  { value: '40+', label: '国内外设计奖项' },
  { value: '95%+', label: '创意方案采纳率' },
];

export const heroDetails = [
  { value: '兰州大学', label: '视觉传达设计 / 硕士' },
  { value: '中共党员', label: '政治面貌' },
  { value: '视觉设计', label: '求职方向' },
];

export const contacts = [
  { label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replaceAll(' ', '')}` },
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'Location', value: '深圳 / 成都', href: null },
];

export const experiences = [
  {
    company: '零次方机器人',
    role: '视觉设计师',
    period: '2025-2026',
    points: [
      '01｜品牌视觉体系｜从0到1搭建品牌与IP资产体系，主导公司VI及数字资产体系建设，统一品牌色彩、字体、图形与版式规范；统筹IP从概念、造型到动作/表情及应用延展，建立品牌SOP与规范手册，推动视觉标准在多部门落地，夯实品牌资产与辨识度。',
      '02｜全场景品牌设计｜连接产品技术与用户表达统筹官网、社媒、展会、空间及宣传物料等全场景视觉设计，建立从创意到落地的设计闭环；理解机器人硬件与技术逻辑，将复杂技术转化为易理解的图文及内容，提升产品传播效率与品牌专业度。',
      '03｜AI视觉工作流｜推动品牌设计效率升级搭建ComfyUI / Stable Diffusion AI设计工作流，通过模型训练、LoRA及提示词工程实现IP与品牌视觉资产高效延展；沉淀可复用的模型、流程与资产体系，提升创意验证与内容生产效率。',
    ],
  },
  {
    company: '运城职业技术大学',
    role: '辅导员兼艺术设计专任教师',
    period: '2024.08 - 2025.06',
    points: [
      '项目设计与商业转化｜文旅IP全案统筹牵头壶口瀑布文旅IP设计项目，统筹创意策划、视觉设计、供应链及产品落地，推动项目从概念提案到商业化交付的完整闭环；文创产品单月销量300+，创集团同期最佳业绩，具备设计项目统筹、跨部门协作与商业转化能力。',
      'AI视觉与内容创新｜前沿技术融入设计实践将AI技术融入课程与视觉内容开发，探索生成式AI在创意策划、视觉表达及内容生产中的应用，具备将行业趋势转化为实际视觉方案与内容的能力；同时承担5个班级235名学生日常管理工作，有极强沟通协调与组织管理能力。',
    ],
  },
  {
    company: '北京博乐科技',
    role: '设计实习生',
    period: '2023',
    points: [
      '品牌雇主设计｜校招品牌全案与视觉整合主导校招品牌全案视觉设计，统筹主KV、H5、Banner及运营视觉等核心触点，建立统一的雇主品牌视觉语言；主视觉点击率达80%，创年度新高，H5传播量1000+，形成二次传播。',
      '视觉创意与项目统筹｜品效合一设计落地统筹20+雇主品牌项目从创意策划、视觉设计到落地执行的完整流程，构建线上线下联动的活动视觉体系；线上创意方案带动日活增长70%，线下场景化设计推动参与人数超预期80%，实现品牌表达与业务传播效果协同。',
    ],
  },
  {
    company: '个人工作室',
    role: '独立设计与跨媒介视觉实验',
    period: '2021-至今',
    points: [
      '持续主导IP、插画、卡牌及游戏等独立项目，完成从概念、视觉语言到场景应用与最终落地的全流程设计。',
      '结合AI辅助创作探索视觉生成与快速迭代，持续拓展品牌、内容与互动体验的设计边界，形成从策略创意到视觉落地的完整项目思维。',
    ],
  },
];

export const projects = [
  {
    title: '零次方机器人从0-1品牌视觉体系建立',
    category: 'Brand System / IP Design',
    image: '/assets/zero-brand-cover.webp',
    detailSlug: 'zerith-brand-system',
    cta: '查看项目详情',
    summary:
      '从0→1搭建机器人品牌视觉体系，统筹VI规范、数字资产与IP开发，覆盖官网、移动端及线上线下应用，建立统一、可延展的品牌视觉语言。',
    stats: ['0→1品牌体系', 'IP资产开发', '品牌SOP'],
    detail: {
      eyebrow: 'ZERITH / Embodied Intelligence',
      subtitle: '零次方机器人品牌视觉体系',
      displayTitle: '零次方机器人\n从0-1\n建立品牌视觉体系',
      role: '品牌视觉体系构建 / IP资产开发 / 全触点设计延展',
      period: '2025-2026',
      overview:
        '围绕零次方机器人品牌从0→1构建完整视觉体系，将具身智能、机器人硬件与品牌年轻化表达转化为统一的视觉语言。\n从VI基础系统、IP资产到Web / Mobile及线下物料，建立可持续延展的品牌设计体系，推动品牌形象从单点视觉输出升级为完整的视觉资产系统。',
      highlights: [
        '定义品牌视觉语言：建立紫色科技感核心视觉方向，完善色彩、字体、图形与版式系统，夯实品牌识别基础。',
        '统筹全场景视觉落地：覆盖展陈、传播、Web / Mobile、户外及品牌物料，建立从概念到应用的统一设计规范。',
        '构建IP延展体系：主导“小零 Zerry”IP从造型设定到三视图、动作表情及衍生应用，提升品牌资产的延展与复用能力。'
      ],
      responsibilities: '品牌策略视觉化 / VI体系 / IP开发 / 数字触点 / 应用落地',
      meta: [
        { label: 'PROJECT', value: '品牌视觉体系构建' },
        { label: 'SCOPE', value: 'VI/IP/Web\nMobile\nCampaign' },
        { label: 'DESIGN LANGUAGE', value: '科技感/年轻化\n克制/可信' },
      ],
      images: [
        {
          src: '/assets/robot-zero-brand-overview.webp',
          alt: '零次方机器人品牌视觉体系总览长图',
          caption: '品牌定位、Logo规范、色彩系统与基础视觉语言',
        },
        {
          src: '/assets/robot-zero-brand-applications.webp',
          alt: '零次方机器人品牌应用延展长图',
          caption: '品牌物料、官网、移动端、展陈与宣传触点延展',
        },
        {
          src: '/assets/robot-zero-ip-system.webp',
          alt: '小零Zerry IP形象系统长图',
          caption: '小零IP设定、三视图、场景主视觉、表情包与衍生品',
        },
      ],
      // 有此项时，「延展视觉」右侧文字栏改为用 HTML 排版这张流程图（替代 MY ROLE 文案块）。
      // kind 决定该节的版式：cards 图标卡 / collab 协同网络 / parallel 并行流 / supplier 上下游。
      followupWorkflow: {
        kicker: 'MY ROLE',
        title: '品牌视觉体系全链路建设',
        subtitle: '以品牌为核心，以协作为纽带，以交付为结果',
        sections: [
          {
            no: '01',
            title: '项目启动与需求对齐',
            meta: '策划方向 · 锁定目标 · 建立计划',
            kind: 'cards',
            items: [
              { icon: 'ClipboardList', title: '项目需求梳理' },
              { icon: 'Target', title: '品牌目标与应用场景确认' },
              { icon: 'LayoutGrid', title: '设计范围拆解' },
              { icon: 'CalendarCheck', title: '项目计划与交付标准确认' },
            ],
          },
          {
            no: '02',
            title: '跨部门协同',
            meta: '需求对齐 · 信息融合 · 评审反馈 · 标准统一',
            kind: 'collab',
            hub: {
              label: '项目负责人',
              meta: '协同 · 推进 · 交付',
              ring: ['需求对齐', '信息融合', '设计评审', '标准统一'],
            },
            teams: [
              {
                icon: 'Palette',
                name: '品牌设计',
                tag: '核心角色',
                points: ['视觉策略', '风格定义', '规范输出', '资产沉淀'],
              },
              {
                icon: 'Boxes',
                name: '产品团队',
                points: ['产品需求', '应用场景', '功能确认'],
              },
              {
                icon: 'Cpu',
                name: '研发团队',
                points: ['技术条件', '实现边界', '落地可行性确认'],
              },
              {
                icon: 'Megaphone',
                name: '市场团队',
                points: ['传播目标', '市场反馈', '落地效果确认'],
              },
            ],
            outputs: ['需求汇总', '方案评审', '信息同步', '迭代优化'],
          },
          {
            no: '03',
            title: '多工作流并行推进',
            meta: '统一标准 · 关联交付',
            kind: 'parallel',
            tracks: ['品牌VI规范', 'IP形象与应用资产', '数字传播触点', '线下传播物料'],
            flow: ['方案设计', '前期评审', '修改优化', '交付文档'],
          },
          {
            no: '04',
            title: '外部供应商协调',
            meta: '需求清晰 · 质量把关 · 进度推进',
            kind: 'supplier',
            from: '内部设计团队',
            to: '外部供应商',
            tags: ['协同沟通', '同步步调', '质量检查', '交付确认'],
          },
          {
            no: '05',
            title: '质量控制与项目闭环',
            meta: '检查验收 · 规范沉淀 · 持续复用',
            kind: 'cards',
            items: [
              { icon: 'ScanSearch', title: '图稿一致性检查' },
              { icon: 'PackageCheck', title: '应用验收' },
              { icon: 'FolderCheck', title: '设计文件归档' },
              { icon: 'BookMarked', title: 'SOP沉淀', note: '品牌SOP与规范手册形成' },
            ],
          },
        ],
        footer: {
          title: '统一品牌资产体系',
          note: '从事务交付到体系化沉淀再到持续复用',
        },
        brand: '零次方机器人',
      },
    },
  },
  {
    title: '博乐科技品牌运营项目',
    category: 'Employer Brand / Campaign',
    image: '/assets/bole-brand-cover.webp',
    detailSlug: 'bole-brand-operations',
    cta: '查看项目详情',
    summary:
      '围绕校招与雇主品牌传播，统筹主KV、H5、Banner及活动视觉，构建线上线下联动的传播体系，兼顾品牌识别与活动效果。',
    stats: ['20+项目', 'H5传播1000+', '主视觉点击率80%'],
    detail: {
      eyebrow: 'BOLE GAMES / EMPLOYER BRAND',
      subtitle: '博乐科技雇主品牌整合视觉',
      displayTitle: '博乐科技\n雇主品牌整合视觉',
      role: '雇主品牌 × 整合传播 × 全场景视觉',
      period: '2023',
      overview:
        '围绕博乐科技校招与品牌运营场景，构建兼具年轻感、游戏感与传播效率的雇主品牌视觉体系。\n从招聘主KV、H5、Banner到社交媒体内容及线下礼盒等触点，统一视觉语言并打通线上线下传播，推动品牌从单次活动视觉向持续内容资产延展。',
      highlights: [
        '主导校招品牌全案设计，完成主KV、H5、Banner、社交媒体内容与招聘物料的统一视觉延展。',
        '围绕“价值观领航员”等主题，设计可持续使用的图形、贴纸、角色与内容模板资产。',
        '通过鲜明的蓝色品牌基调、游戏化插画语言与模块化版式，提升招聘传播的识别度与参与感。',
      ],
      meta: [
        { label: 'PROJECT', value: '雇主品牌整合视觉' },
        { label: 'SCOPE', value: 'KV / H5 / Banner / Social / Event' },
        { label: 'IMPACT', value: '80%+ / 20+\n1000+' },
      ],
      images: [
        {
          src: '/assets/web/bole-brand-operations.webp',
          alt: '博乐科技品牌运营与招聘视觉项目长图',
          caption: '招聘主视觉、品牌物料、礼盒与线上线下触点延展',
        },
        {
          src: '/assets/bole-brand-value.webp',
          alt: '博乐科技品牌价值观与内容运营视觉长图',
          caption: '品牌价值观图形、内容栏目与社交媒体运营视觉',
        },
      ],
    },
  },
  {
    title: '安口窑文创设计项目',
    category: 'Cultural Creative / Product Design',
    image: '/assets/ankou-cultural-cover.webp',
    detailSlug: 'ankou-cultural-design',
    cta: '查看项目详情',
    summary:
      '提炼安口窑地域文化与传统纹样，转化为当代视觉语言，并延展至包装、画册、展陈及系列文创，形成从文化研究到产品应用的完整设计链路。',
    stats: ['文化提炼', '视觉转译', '文创延展'],
    detail: {
      eyebrow: 'ANKOU KILN / CULTURAL DESIGN',
      subtitle: '传统文化视觉转译',
      displayTitle: '安口窑\n传统文化视觉转译',
      role: '文化提炼 × 视觉转译 × 文创系统',
      period: '毕业设计项目',
      overview:
        '以安口窑地域文化与传统纹样为研究基础，提炼窑火、花卉、器物及民俗意象，建立具有当代审美特征的视觉语言。\n从核心图形与版式体系出发，延展至盲盒摆件、画册、贴纸、日历、展陈及系列衍生品，形成从文化内容提炼到视觉表达与产品应用的完整设计链路。',
      highlights: [
        '提炼安口窑地域文化与传统纹样，建立核心图形、色彩与装饰语言。',
        '构建统一视觉系统，并延展至包装、画册及系列文创产品。',
        '统一版式、展示与物料规范，推动文化内容向当代传播场景转化。',
      ],
      meta: [
        { label: 'PROJECT', value: '文化视觉与文创系统' },
        { label: 'SCOPE', value: '图形 / 纹样 / 包装 / 展陈 / 衍生品' },
        { label: 'DESIGN LANGUAGE', value: '传统文化 / 当代转译 / 系列化' },
      ],
      videos: [
        {
          src: '/assets/ankou-video-3.mp4',
          alt: '安口窑文创设计视频一',
        },
        {
          src: '/assets/ankou-video-1.mp4',
          alt: '安口窑文创设计视频二',
        },
        {
          src: '/assets/ankou-video-4.mp4',
          alt: '安口窑文创设计视频三',
        },
        {
          src: '/assets/ankou-video-10.mp4',
          alt: '安口窑文创设计视频四',
        },
      ],
      images: [
        {
          src: '/assets/web/ankou-board.webp',
          alt: '安口窑文创设计视觉体系长图',
          caption: '安口窑纹样、产品与文创视觉体系展示',
        },
        {
          src: '/assets/web/ankou-exhibition-board.webp',
          alt: '绮岁万象安口盲盒设计展板',
          caption: '“绮岁万象”安口盲盒设计、包装结构与系列产品展示',
        },
        {
          src: '/assets/ankou-return-to-nature-calendar.webp',
          alt: '归真月历与野餐垫文创设计展示',
          caption: '“归真”月历设计、野餐垫与安口文创产品应用展示',
        },
      ],
    },
  },
  {
    title: '个人工作室设计项目',
    category: 'Studio / Visual Experiment',
    image: '/assets/project-studio.webp',
    detailSlug: 'studio-visual-experiment',
    cta: '查看项目详情',
    summary:
      '围绕敦煌潮流IP、手绘卡牌与治愈系田园游戏，探索角色设计、插画、游戏UI及场景叙事，并结合AI辅助创作，持续拓展跨媒介视觉表达。',
    stats: ['IP开发', '游戏视觉', 'AI辅助创作'],
    detail: {
      eyebrow: 'STUDIO / VISUAL EXPERIMENT',
      subtitle: '跨媒介视觉实验',
      displayTitle: '个人工作室\n跨媒介视觉实验',
      role: '独立创作 × IP开发 × 游戏视觉 × AI实验',
      period: '持续更新中',
      overview:
        '以个人工作室为持续发生的创作场，探索IP、品牌、游戏视觉与AI辅助创作的跨媒介表达。\n从手绘卡牌、潮流IP到独立游戏，持续实验角色设计、视觉叙事、数字插画与互动体验，并将不同媒介中的方法沉淀为可复用的视觉创作能力。',
      highlights: [
        '独立完成从概念、视觉设定到最终输出的完整创作流程，覆盖IP、插画、卡牌及游戏视觉等不同媒介。',
        '通过角色设定、视觉叙事与场景构建，探索视觉语言在内容、品牌与互动体验中的应用。',
        '结合AI辅助创作进行快速探索与迭代，持续沉淀个人视觉资产与创作方法。',
      ],
      meta: [
        { label: 'PROJECT', value: '独立设计实践' },
        { label: 'CORE', value: 'IP / Illustration / Game / Card / AI' },
        { label: 'APPROACH', value: '角色叙事 / 视觉实验 / 跨媒介 / 风格探索' },
      ],
      images: [
        {
          src: '/assets/studio-cat-toys-web.webp',
          alt: 'C.A.T. TOYE个人工作室卡牌设计与图鉴设计长图',
          caption: 'C.A.T. TOYE个人工作室卡牌设计、图鉴设计与系列视觉实验',
        },
        {
          src: '/assets/atuan-where-did-you-go.webp',
          alt: '阿团去哪了IP角色与游戏视觉设计长图',
          caption: '“阿团去哪了”角色设定、场景视觉、UI界面与素材延展',
        },
        {
          src: '/assets/studio-xuanling-web.webp',
          alt: '玄翎IP角色设计与视觉应用长图',
          caption: '玄翎IP角色设定、三视图、表情包、主视觉与场景延展',
        },
      ],
      studioSections: [
        {
          title: '《今天阿团去哪啦》\n治愈系田园生活游戏',
          role: '游戏概念 × 玩法设计 × UI/UX × 视觉资产',
          overview:
            '以小水獭阿团为主角，融合农场经营、自然探索与旅行收藏，打造温暖治愈的轻游戏体验。以水彩绘本风格构建角色、场景与界面视觉。',
          flow: '种植 → 收获 → 补给 → 旅行 → 收藏',
          paragraphs: [
            '通过农场经营获取资源，在商店兑换种子与旅行券，前往海边或森林探索，并将旅途明信片收入相册，形成持续游玩的体验闭环。',
            '梳理农场、商店、旅行与相册的功能关系，串联资源获取、消耗与收藏反馈，形成完整的玩法逻辑。',
            '统一角色、场景、图标及界面风格，围绕核心玩法组织信息与交互，构建连贯的游戏体验。',
            '从概念构思到玩法逻辑、界面设计与视觉资产，展现完整的产品设计思维。',
          ],
        },
        {
          title: '玄翎\n敦煌文化潮流IP设计',
          role: '文化提炼 × 角色设计 × 视觉延展',
          overview:
            '以敦煌玄鸟意象为灵感，融合壁画色彩、传统纹样与潮玩美学，打造兼具东方文化底蕴与年轻潮流感的原创IP。',
          sections: [
            {
              title: '01 / CULTURAL DNA｜文化提炼',
              text: '提取敦煌壁画、传统纹样与神话意象，转化为角色的色彩、服饰与装饰语言。',
            },
            {
              title: '02 / CHARACTER DESIGN｜角色设计',
              text: '完善角色造型、三视图、动作与表情系统，建立具有辨识度的IP形象资产。',
            },
            {
              title: '03 / VISUAL EXTENSION｜视觉延展',
              text: '围绕敦煌主题主视觉，拓展潮流街景与多风格插画，探索IP在海报及数字内容中的应用。',
            },
          ],
          closing:
            '探索敦煌文化的年轻化表达，构建从文化转译、角色塑造到场景延展的完整IP设计体系。',
        },
      ],
    },
  },
];
export const strengths = [
  {
    title: '品牌视觉全链路',
    text: '能从策略、VI规范、IP形象、资产中台到组织培训，完成品牌语言的建立与规模化落地。',
  },
  {
    title: '技术内容视觉化',
    text: '将机器人硬件、白皮书、产品逻辑转译为公众易理解的图文、PPT、视频与传播物料。',
  },
  {
    title: '全场景统筹',
    text: '覆盖官网、Banner、社交媒体、展会全案、空间导视与宣传物料，保证多触点一致性。',
  },
  {
    title: 'AI辅助工作流',
    text: '熟悉ComfyUI、Stable Diffusion、LORA微调与Codex脚本自动化，提升视觉资产延展效率。',
  },
  {
    title: '跨维度表达',
    text: '熟练使用Ps、AI、Figma、C4D、Nomad、SketchUp、Procreate与Ae，兼具平面、三维与动态表达。',
  },
  {
    title: '数据驱动迭代',
    text: '以点击率、停留时长、参与人数、销售数据等指标反哺视觉方案，形成商业闭环。',
  },
];








