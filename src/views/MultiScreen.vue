<template>
  <div class="multi-screen">
    <div class="view" id="map-hybrid"></div>
    <div class="view" id="map-osm"></div>
    <div class="view" id="map-oceans"></div>
    <div class="view" id="map-satellite"></div>
  </div>
</template>

<script>
import {loadModules} from 'esri-loader'
import options from 'components/config'

export default {
  name: "MultiScreen",
  mounted() {
    this._initViews()
  },
  methods: {
    async _initViews() {
      const [Map, MapView] = await loadModules([
        'esri/Map',
        'esri/views/MapView'
      ], options)

      const basemaps = ['hybrid', 'osm', 'oceans', 'terrain']
      const viewDivs = ['map-hybrid', 'map-osm', 'map-oceans', 'map-satellite']
      const views = []
      for (let i = 0;i < basemaps.length;i++) {
        const view = new MapView({
          map: new Map({
            basemap: basemaps[i]
          }),
          container: viewDivs[i],
          center: [121.508,31.289],
          zoom: 8,
          ui: {
            components: []
          }
        })
        views.push(view)
      }

      let activeView = views[0]
      views.forEach((view) => {
        view.watch('interacting', () => {
          if (view.interacting) {
            activeView = view
            // console.log(views.indexOf(view));
            // views[2].center = activeView.center
          }
        })
      })

      views.forEach((view) => {
        view.watch(['center', 'scale', 'rotation'], (newvalue, oldvalue, propertyName,) => {
          if (view === activeView) {
            views.forEach((v) => {
              if (v !== activeView) {
                v[propertyName] = newvalue
              }
            })
            // const unactiveViews = views.filter((v) => v !== activeView)
            // unactiveViews.forEach((u) => {
            //   u[propertyName] = activeView[propertyName]
            // })
          }
        })
      })
      
      // activeView.watch(['center', 'scale', 'rotation'], (newValue, oldValue, propertyName) => {
      //   views.forEach((view) => {
      //     if (view !== activeView) {
      //       view[propertyName] = newValue
      //     }
      //   })
      // })

      // views.forEach((view) => {
      //   view.on('focus', () => {
      //     console.log(views.indexOf(view));
      //   })
      // })
    }
  }
}
</script>

<style>
  .multi-screen {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row wrap;
  }

  .view {
    width: 50%;
    height: 50%;
  }
</style>