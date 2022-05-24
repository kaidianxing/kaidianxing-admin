let afterLocation = () => ({
    video_number_id:  [{
        required: true,
        message: '视频号ID必填',
        trigger: 'blur'
    }],
})
export default () => ({
    afterLocation: afterLocation(),
    beforeLocation(data) {
        if(data) {
            if (!data.params.video_number_id) {
                return new Error('视频号ID必填')
            }
        }
    }
})