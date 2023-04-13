import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from "./Experience";
import Sizes from './Utils/Sizes';

export default class Camera {
  experience: Experience
  instance!: THREE.PerspectiveCamera;
  sizes: Sizes
  scene: THREE.Scene
  canvas: HTMLElement
  controls!: OrbitControls;


  constructor(experience: Experience) {
    this.experience = experience
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.setInstance()
    this.setOrbitControls()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      75, this.sizes.width / this.sizes.height, 0.1, 100
    )

    this.instance.position.set(-0.45, 0, 0.65)
    this.scene.add(this.instance)
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls.update()
  }
}