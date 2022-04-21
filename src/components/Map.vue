/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息
 */
<template>
    <div class="amap">
        <div id="container" class="amap-box"></div>
    </div>
</template>

<script>
import { MapLoader } from '@/helpers/amap.js'
var AMap = null
var map = null
var marker = null
export default {
    props: ['value', 'aMapKey', 'division_way', 'location', 'addMapClickEvent', 'formItemTip'],
    data() {
        return {
            circleList: [],
            polygonList: [],
        }
    },
    watch: {
        aMapKey: {
            handler(value) {
                if (value) {
                    this.$nextTick(() => {
                        map && map.destroy()
                        this.initMap(value).then(() => {
                            console.log(
                                'this.division_way-----------',
                                this.division_way
                            )
                            if (this.division_way === 0) {
                                this.$emit('addCircle')
                            } else if (this.division_way === 1) {
                                this.$emit('addPolygon')
                            }
                        })
                    })
                } else {
                    map && map.destroy()
                }
            },
            immediate: true,
        },
        location: {
            handler(value) {
                if (value) {
                    this.geocoder('getLocation')
                }
            },
            immediate: true,
        },
    },
    beforeDestroy() {
        map && map.destroy()
    },
    methods: {
        // 初始化地图
        initMap(value) {
            return new Promise((resolve, reject) => {
                MapLoader(value).then(
                    (aMap) => {
                        console.log('地图加载成功')
                        AMap = aMap
                        map = new AMap.Map('container', {
                            // mapStyle: 'amap://styles/b09e6a89f89336a5e701771d06332411', // 马卡龙地图
                            zoom: 13,
                            resizeEnable: true,
                        })
                        resolve()
                        this.$emit('aMapInitFinished')
                        // 添加地图控件
                        this.addPlugin()
                        // 添加地图点击事件
                        if (this.addMapClickEvent) {
                            map.on('click', (ev) => {
                                // 触发事件的地理坐标，AMap.LngLat 类型
                                let lnglat = ev.lnglat
                                this.addMarker(lnglat.lng, lnglat.lat)
                                // 获取地址信息
                                console.log(lnglat.lng, lnglat.lat,'ssssssssssssssssss')
                                this.geocoder('getAddress', [
                                    lnglat.lng,
                                    lnglat.lat,
                                ])
                            })
                        }
                    },
                    (e) => {
                        console.log('地图加载失败', e)
                        this.$Message.error('地图加载失败')
                        reject(e)
                        this.$emit('aMapInitFinished')
                    }
                )
            })
        },
        // 添加地图控件
        addPlugin() {
            AMap.plugin(
                [
                    'AMap.ToolBar',
                    'AMap.Scale',
                    'AMap.OverView',
                    'AMap.MapType',
                    'AMap.Geolocation',
                    'AMap.Autocomplete',
                    'AMap.PlaceSearch'
                ],
                () => {
                    
                    // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
                    map.addControl(new AMap.ToolBar())
                    // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
                    map.addControl(new AMap.Scale())
                    // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
                    // map.addControl(new AMap.OverView({ isOpen: true }))
                    // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
                    // map.addControl(new AMap.MapType())
                    // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
                    // map.addControl(new AMap.Geolocation())
                    map.addControl(new AMap.PlaceSearch())
                    map.addControl(new AMap.Autocomplete())
                     //实例化Autocomplete
                    var autoOptions = {
                        //city 限定城市，默认全国
                        city: '全国'
                    }
                    var autoComplete= new AMap.Autocomplete(autoOptions);
                    autoComplete.search('', function(status, result) {
                        console.log(status,result);
                        // 搜索成功时，result即是对应的匹配数据
                    })
                }
            )
        },
        // 正向地理编码(地址转化为经纬度)/逆向地理编码(经纬度转化为地址)
        geocoder(type, lnglat) {
            AMap.plugin('AMap.Geocoder', () => {
                let geocoder = new AMap.Geocoder({})
                if (type === 'getLocation') {
                    geocoder.getLocation(this.location, (status, result) => {
                        if (status === 'complete' && result.info === 'OK') {
                            // result中对应详细地理坐标信息
                            let lng = result.geocodes[0].location.lng
                            let lat = result.geocodes[0].location.lat
                            let formattedAddress =
                                result.geocodes[0].formattedAddress

                            map.setCenter([lng, lat])
                            this.addMarker(lng, lat, formattedAddress)
                            this.$emit('getAddress', {
                                lng,
                                lat,
                            })
                        } else if (status === 'error') {
                            if(result === 'INVALID_USER_KEY' && this.formItemTip) {
                                this.$emit('fail-search')
                            } else {
                                this.$Message.error(result)
                            }
                        }
                    })
                } else if (type === 'getAddress') {
                    geocoder.getAddress(lnglat, (status, result) => {
                        if (status === 'complete' && result.info === 'OK') {
                            // result为对应的地理位置详细信息
                            let selectedAddress = [
                                result.regeocode?.addressComponent?.province,
                                result.regeocode?.addressComponent?.city,
                                result.regeocode?.addressComponent?.district,
                            ]
                            let reg = new RegExp(
                                `${result.regeocode?.addressComponent?.province}${result.regeocode?.addressComponent?.city}${result.regeocode?.addressComponent?.district}`
                            )
                            let address = result.regeocode?.formattedAddress.replace(
                                reg,
                                ''
                            )
                            let lng = lnglat[0]
                            let lat = lnglat[1]
                            this.$emit('getAddress', {
                                selectedAddress,
                                address,
                                lng,
                                lat,
                            })
                        } else if (status === 'error') {
                            this.$Message.error(result)
                        }
                    })
                }
            })
        },
        // 添加圆形
        addCircle(data, index) {
            let circle = new AMap.Circle({
                center: new AMap.LngLat(
                    data.model.center_lng,
                    data.model.center_lat
                ), // 圆心位置
                radius: data.model.radius * 1000, // 圆半径
                fillColor: data.color.backgroundColor, // 圆形填充颜色
                strokeColor: data.color.borderColor, // 描边颜色
                strokeWeight: 2, // 描边宽度
            })
            map.add(circle)
            map.setFitView([circle])
            // 添加圆编辑器
            let circleEditor = null
            map.plugin(['AMap.CircleEditor'], () => {
                circleEditor = new AMap.CircleEditor(map, circle)

                this.circleList.push({
                    id: index,
                    circle,
                    circleEditor,
                })

                // 注册事件
                this.circleList.forEach((item, circleList_index) => {
                    // 移动（调整圆心）
                    item.circleEditor.on('move', (event) => {
                        // console.log('触发事件：move', event)
                        this.circleEditorEventFun(event, circleList_index)
                    })
                    // 调整大小
                    item.circleEditor.on('adjust', (event) => {
                        // console.log('触发事件：adjust', event)
                        this.circleEditorEventFun(event, circleList_index)
                    })
                    // 点击
                    item.circle.on('click', () => {
                        // console.log('触发事件：click', event)
                        let $this = this
                        function outerFn() {
                            let cacheIndex = circleList_index
                            return function innerFn() {
                                $this.showCircleEditor(cacheIndex)
                                $this.$emit('changeRegionSelected', cacheIndex)
                            }
                        }
                        outerFn()()
                    })
                })
            })
        },
        // 圆编辑器事件处理函数
        circleEditorEventFun(event, index) {
            let $this = this
            function outerFn() {
                let cacheIndex = index
                return function innerFn() {
                    let regionList = $this.value.map((item, i) => {
                        if (event.type === 'move') {
                            return {
                                ...item,
                                model: {
                                    ...item.model,
                                    center_lng:
                                        i === cacheIndex
                                            ? event.lnglat.lng
                                            : item.model.center_lng,
                                    center_lat:
                                        i === cacheIndex
                                            ? event.lnglat.lat
                                            : item.model.center_lat,
                                },
                            }
                        } else if (event.type === 'adjust') {
                            return {
                                ...item,
                                model: {
                                    ...item.model,
                                    radius:
                                        i === cacheIndex
                                            ? event.radius / 1000
                                            : item.model.radius,
                                },
                            }
                        }
                    })
                    $this.$emit('input', regionList)
                }
            }
            outerFn()()
        },
        // 移除圆形
        removeCircle(index) {
            // 关闭编辑器
            this.circleList[index].circleEditor.close()
            map.remove(this.circleList[index].circle)
            this.circleList.splice(index, 1)
        },
        // 设置圆形半径
        changeCircleRadius(data, index) {
            this.circleList[index].circle.setRadius(data.model.radius * 1000)
        },
        // 显示圆编辑器
        showCircleEditor(index) {
            this.circleList.forEach((item) => {
                item.circleEditor.close()
            })
            this.circleList[index].circleEditor.open()
        },
        // 添加多边形
        addPolygon(data, index) {
            let path = data.model.location.map((item) => {
                return new AMap.LngLat(item.lng, item.lat)
            })
            let polygon = new AMap.Polygon({
                path: path,
                fillColor: data.color.backgroundColor, // 多边形填充颜色
                strokeColor: data.color.borderColor, // 线条颜色
                borderWeight: 2, // 线条宽度
            })

            map.add(polygon)
            map.setFitView([polygon])
            // 添加多边形编辑器
            let polyEditor
            map.plugin(['AMap.PolyEditor'], () => {
                polyEditor = new AMap.PolyEditor(map, polygon)
                
                this.polygonList.push({
                    id: index,
                    polygon,
                    polyEditor,
                })

                // 注册事件
                this.polygonList.forEach((item, polygonList_index) => {
                    // 通过鼠标在折线上增加一个节点或在多边形上增加一个顶点时触发此事件
                    item.polyEditor.on('addnode', (event) => {
                        // console.log('触发事件：addnode', event)
                        this.polyEditorEventFun(item, event, polygonList_index)
                    })
                    // 通过鼠标在折线上删除一个节点或在多边形上删除一个顶点时触发此事件
                    item.polyEditor.on('removenode', (event) => {
                        // console.log('触发事件：removenode', event)
                        this.polyEditorEventFun(item, event, polygonList_index)
                    })
                    // 鼠标调整折线上某个节点或多边形上某个顶点的位置时触发此事件
                    item.polyEditor.on('adjust', (event) => {
                        // console.log('触发事件：adjust', event)
                        this.polyEditorEventFun(item, event, polygonList_index)
                    })
                    // 点击
                    item.polygon.on('click', () => {
                        // console.log('触发事件：click', event)
                        let $this = this
                        function outerFn() {
                            let cacheIndex = polygonList_index
                            return function innerFn() {
                                $this.showPolyEditor(cacheIndex)
                                $this.$emit('changeRegionSelected', cacheIndex)
                            }
                        }
                        outerFn()()
                    })
                })
            })
        },
        // 多边形编辑器事件处理函数
        polyEditorEventFun(polygonItem, event, index) {
            let $this = this
            function outerFn() {
                let cacheIndex = index
                return function innerFn() {
                    let lnglat = polygonItem.polygon.getPath().map((item) => {
                        return {
                            lng: item.lng,
                            lat: item.lat,
                        }
                    })
                    console.log(lnglat)
                    let regionList = $this.value.map((item, i) => {
                        return {
                            ...item,
                            model: {
                                ...item.model,
                                location:
                                    i === cacheIndex
                                        ? [...lnglat]
                                        : item.model.location,
                            },
                        }
                    })
                    $this.$emit('input', regionList)
                }
            }
            outerFn()()
        },
        // 移除多边形
        removePolygon(index) {
            // 关闭编辑器
            this.polygonList[index].polyEditor.close()
            map.remove(this.polygonList[index].polygon)
            this.polygonList.splice(index, 1)
        },
        // 显示多边形编辑器
        showPolyEditor(index) {
            this.polygonList.forEach((item) => {
                item.polyEditor.close()
            })
            this.polygonList[index].polyEditor.open()
        },
        // 添加点标记
        addMarker(lng, lat, formattedAddress) {
            if (marker) {
                // 移除已创建的 marker
                map.remove(marker)
            }
            let _params = {
                position: new AMap.LngLat(lng, lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            }
            if (formattedAddress) {
                _params = {
                    ..._params,
                    title: formattedAddress,
                }
            }
            // 创建一个 Marker 实例：
            marker = new AMap.Marker(_params)
            // 将创建的点标记添加到已有的地图实例：
            map.add(marker)
        },
        // 设置中心点
        setCenter(lng, lat) {
            map.setCenter([lng, lat])
        },
    },
}
</script>
<style lang="scss" scoped>
.amap-box {
    width: 100%;
    height: 500px;
}
</style>
