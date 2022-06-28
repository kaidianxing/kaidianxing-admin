export default {
    title: '一键发圈',
    name: '一键发圈',
    show: false,
    path: '/material/list',
    perm: '',
    children: {
        material: {
            title: '素材管理',
            name: '素材管理',
            path: '/material/list',
            pluginName: 'material',
            perm: "material.index.view"
        },
        materialAdd: {
            title: '添加素材',
            name: '添加素材',
            path: '/material/add',
            pluginName: 'material',
            showSubMenu: false,
            showBackBtn: true,
            show: false,
            perm: "material.index.view"
        },
        materialEdit: {
            title: '编辑素材',
            name: '编辑素材',
            path: '/material/edit',
            pluginName: 'material',
            showSubMenu: false,
            showBackBtn: true,
            show: false,
            perm: "material.index.view"
        },
        materialSettings: {
            title: '基础设置',
            name: '基础设置',
            path: '/material/settings',
            pluginName: 'material',
            perm: "material.setting.view",
        },
    }
}
