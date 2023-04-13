import EventEmitter from "../Utils/EventEmitter";
import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Resources extends EventEmitter {
  sources: {name: string, type: string, path: string[]|string}[];
  items: any = {}
  toLoad!: number
  loaded: number = 0
  loaders = {
    gltfLoader: new GLTFLoader(),
    textureLoader: new THREE.TextureLoader(),
    cubeTextureLoader: new THREE.CubeTextureLoader()
  }

  constructor(sources: {name: string, type: string, path: string[]|string}[]) {
    super()

    // Options
    this.sources = sources

    // Setup
    this.items = {}
    this.toLoad = this.sources.length
    this.startLoading()
  }

  startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case "gltfModel":
          this.loaders.gltfLoader.load(<string>source.path, (file: GLTF) => {
              this.sourceLoaded(source, file)
          })
          break;
        case "texture":
          this.loaders.textureLoader.load(<string>source.path, (file: THREE.Texture) => {
            this.sourceLoaded(source, file)
          })
          break;
        case "cubeTexture":
          this.loaders.cubeTextureLoader.load(<string[]>source.path, (file: THREE.CubeTexture) => {
            this.sourceLoaded(source, file)
          })
          break;
        default:
          break;
      }
    }
  }

  sourceLoaded(source: { name: string | number; }, file: THREE.Texture|GLTF|THREE.CubeTexture) {
    this.items[source.name] = file
    this.loaded++
    if(this.loaded === this.toLoad) {
      this.emit('ready')
    }
  }
}