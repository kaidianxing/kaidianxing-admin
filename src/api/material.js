export const materialApi = {
    getMaterialList: {
        method: 'get',
        api: 'manage/material/index/list'
    },
    getMaterialInfo: {
        method: 'get',
        api: 'manage/material/index/info'
    },
    deleteMaterial: {
        method: 'post',
        api: 'manage/material/index/delete'
    },
    addMaterial: {
        method: 'post',
        api: 'manage/material/index/add'
    },
    editMaterial: {
        method: 'post',
        api: 'manage/material/index/edit'
    },
    getMaterialSetting: {
        method: 'get',
        api: 'manage/material/setting/get-setting'
    },
    setMaterialSetting: {
        method: 'post',
        api: 'manage/material/setting/set-setting'
    },
}
