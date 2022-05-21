<template>
    <div class="maptools-view">
        <el-dropdown trigger="click" class="maptools-item" @command="handleCommand">
            <span class="el-dropdown-link">地图测量<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-plus" command="distance">距离测量</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus" command="area">面积测量</el-dropdown-item>
                <el-dropdown-item icon="el-icon-edit" command="diymeasurement_distance"
                    >自定义测量(长度)</el-dropdown-item>
                <el-dropdown-item icon="el-icon-edit" command="diymeasurement_area">自定义测量(面积)</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import config from './config';

export default {
    name: 'MapTools',
    // mounted: function () {
    //     const checkView = setInterval(() => {
    //         if (this.$store.getters._getDefaultMapView) {
    //             this._initSketchTool();
    //             clearInterval(checkView);
    //         }
    //     }, 200);
    // },
    methods: {
        //初始化绘制工具
        // async _initSketchTool() {
        //     const _self = this;
        //     const view = _self.$store.getters._getDefaultMapView;
        //     //1、绘制面状区域
        //     const [SketchViewModel, GraphicsLayer] = await loadModules(
        //         ['esri/widgets/Sketch/SketchViewModel', 'esri/layers/GraphicsLayer'],
        //         config.options,
        //     );

        //     const resultLayer = view.map.findLayerById('polygonGraphicLayer');
        //     if (resultLayer) view.map.remove(resultLayer);

        //     _self.graphicsLayer = new GraphicsLayer({
        //         id: 'polygonGraphicLayer',
        //         elevationInfo: {
        //             mode: 'on-the-ground',
        //         },
        //     });
        //     view.map.add(_self.graphicsLayer);

        //     const polygonSymbol = {
        //         type: 'simple-fill',
        //         color: 'rgba(216,30,6, 0.4)',
        //         style: 'solid',
        //         outline: {
        //             color: '#d81e06',
        //             width: 1,
        //         },
        //     };
        //     _self.sketchViewModel = new SketchViewModel({
        //         updateOnGraphicClick: false,
        //         view,
        //         layer: _self.graphicsLayer,
        //         polygonSymbol,
        //     });
        // },
        handleCommand(command) {
            switch (command) {
                case 'distance':
                    this.initDistanceMap();
                    break;
                case 'area':
                    this.initAreaMap();
                    break;
                case 'diymeasurement_distance':
                    this.initDIYMeasurement('distance');
                    break;
                case 'diymeasurement_area':
                    this.initDIYMeasurement('area');
                    break;
                default:
                    break;
            }
        },
        //地图距离量算
        async initDistanceMap() {
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;
            console.log(view);
            const [DistanceMeasurement2D] = await loadModules(['esri/widgets/DistanceMeasurement2D'], config.options);
            if (this.measurementWidget) this.measurementWidget.destroy();
            this.measurementWidget = new DistanceMeasurement2D({
                view: view,
            });
            view.ui.add(this.measurementWidget, 'top-left');
        },
        //地图面积量算
        async initAreaMap() {
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;
            const [AreaMeasurement2D] = await loadModules(['esri/widgets/AreaMeasurement2D'], config.options);
            if (this.measurementWidget) this.measurementWidget.destroy();
            this.measurementWidget = new AreaMeasurement2D({
                view: view,
            });
            view.ui.add(this.measurementWidget, 'top-left');
        },
        //自定义测量
        async initDIYMeasurement(type) {
          
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;
            const resultLayer = view.map.findLayerById('measurementGraphicLayer');
            if (resultLayer) view.map.remove(resultLayer);
            const [
                SketchViewModel,
                Graphic,
                GraphicsLayer,
                GeometryService,
                LengthsParameters,
                AreasAndLengthsParameters,
            ] = await loadModules(
                [
                    'esri/widgets/Sketch/SketchViewModel',
                    'esri/Graphic',
                    'esri/layers/GraphicsLayer',
                    'esri/tasks/GeometryService',
                    'esri/tasks/support/LengthsParameters',
                    'esri/tasks/support/AreasAndLengthsParameters',
                ],
                config.options,
            );
            const graphicsLayer = new GraphicsLayer({
                id: 'measurementGraphicLayer',
                elevationInfo: {
                    mode: 'on-the-ground',
                },
            });
            view.map.add(graphicsLayer);

            if (type === 'distance') {
                const polylineSymbol = {
                    type: 'simple-line',
                    color: '#d81e06',
                    width: '2',
                    style: 'solid',
                };
                const sketchViewModel = new SketchViewModel({
                    updateOnGraphicClick: false,
                    view: view,
                    layer: graphicsLayer,
                    polylineSymbol,
                });
                sketchViewModel.create('polyline');

                sketchViewModel.on('create-complete', function (event) {
                    const graphic = new Graphic({
                        geometry: event.geometry,
                        symbol: sketchViewModel.graphic.symbol,
                    });
                    graphicsLayer.add(graphic);
                });
                sketchViewModel.on('create', function (event) {
                    if (event.state === 'complete') {
                        console.log(graphicsLayer);
                        console.log(event);

                        //获取线段长度
                        const geometryService = new GeometryService({
                            url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer',
                        });

                        const lengthsParameters = new LengthsParameters();
                        lengthsParameters.polylines = event.graphic.geometry;
                        lengthsParameters.lengthUnit = 9036;
                        lengthsParameters.geodesic = true;

                        geometryService.lengths(lengthsParameters).then(function (result) {
                            console.log('长度', result);
                        });
                    }
                });
            } else if (type === 'area') {
                const polygonSymbol = {
                    type: 'simple-fill',
                    color: 'rgba(216,30,6, 0.4)',
                    style: 'solid',
                    outline: {
                        color: '#d81e06',
                        width: 1,
                    },
                };
                const sketchViewModel = new SketchViewModel({
                    updateOnGraphicClick: false,
                    view: view,
                    layer: graphicsLayer,
                    polygonSymbol,
                });
                sketchViewModel.create('polygon');

                sketchViewModel.on('create-complete', function (event) {
                    const graphic = new Graphic({
                        geometry: event.geometry,
                        symbol: sketchViewModel.graphic.symbol,
                    });
                    graphicsLayer.add(graphic);
                });
                sketchViewModel.on('create', function (event) {
                    if (event.state === 'complete') {
                        console.log(graphicsLayer);
                        console.log(event);

                        //获取周长和面积
                        const geometryService = new GeometryService({
                            url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer',
                        });

                        const areasAndLengthsParameters = new AreasAndLengthsParameters();
                        areasAndLengthsParameters.polygons = event.graphic.geometry;
                        areasAndLengthsParameters.areaUnit = 'square-kilometers';
                        areasAndLengthsParameters.lengthUnit = 'kilometers';

                        geometryService.areasAndLengths(areasAndLengthsParameters).then(function (result) {
                            console.log('周长和面积', result);
                        });
                    }
                });
            }
        },
    }
};
</script>

<style>
.maptools-view {
    position: absolute;
    padding: 0 15px;
    height: 30px;
    top: 20px;
    right: 15px;
    background-color: #fff;
}
.maptools-item {
    line-height: 30px;
    margin-left: 15px;
    color: black;
    font-size: 15px;
    cursor: pointer;
}
.maptools-item:hover {
    color: #409eff;
}
.maptools-item:first-child {
    margin-left: 0;
}
</style>
