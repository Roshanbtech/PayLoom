// src/theme.ts
import type { ThemeConfig } from 'antd';
import { theme as antdTheme } from 'antd';


export const PAYLOOM_COLORS = {
primary: '#16a34a', // emerald-600
primarySoft: '#0ea35b',
bgBase: '#0b1114', // deep ink/teal black
bgElevated: '#0f1a1c',
bgHeader: '#0f1e20',
bgSider: '#0d171a',
selected: '#122a1e',
textBase: '#e6f4ea'
};


export const themeConfig: ThemeConfig = {
algorithm: [antdTheme.darkAlgorithm],
token: {
colorPrimary: PAYLOOM_COLORS.primary,
colorInfo: PAYLOOM_COLORS.primary,
colorTextBase: PAYLOOM_COLORS.textBase,
colorBgBase: PAYLOOM_COLORS.bgBase,
borderRadius: 12
},
components: {
Layout: { headerBg: PAYLOOM_COLORS.bgHeader, siderBg: PAYLOOM_COLORS.bgSider, bodyBg: PAYLOOM_COLORS.bgBase },
Menu: { itemSelectedBg: PAYLOOM_COLORS.selected, itemActiveBg: PAYLOOM_COLORS.bgHeader },
Card: { colorBgContainer: PAYLOOM_COLORS.bgElevated },
Modal: { contentBg: PAYLOOM_COLORS.bgElevated, headerBg: PAYLOOM_COLORS.bgElevated },
Tabs: { itemSelectedColor: PAYLOOM_COLORS.textBase },
Tag: { defaultBg: '#11251b' }
}
};