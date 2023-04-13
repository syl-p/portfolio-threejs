import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Experience from "./Experience";
import Sizes from "./Utils/Sizes";

export default class Renderer {
  experience: Experience
  instance!: THREE.WebGLRenderer;
  sizes: Sizes
  scene: THREE.Scene
  canvas: HTMLElement

  constructor(experience: Experience) {
    this.experience = experience
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.setInstance()
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })

    this.instance.physicallyCorrectLights = true
    this.instance.outputEncoding = THREE.sRGBEncoding
    this.instance.toneMapping = THREE.ReinhardToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFShadowMap
    // this.instance.setClearColor('#211d20')
    this.instance.autoClear = false
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    this.instance.render(this.scene, this.experience.camera.instance)
  }
}