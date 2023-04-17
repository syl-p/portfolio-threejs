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

    this.experience.sectionEmitter.on('entered', (id) => {
      console.log(id)
      switch (id) {
        case 'intro':
          this.instance.position.set(-0.45, 0.1, 0.65)
          break;
        case 'services':
          this.instance.position.set(-0.45, 2, 0.65)
          break;
        default:
          break;
      }
    })
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      75, this.sizes.width / this.sizes.height, 0.1, 100
    )

    this.instance.position.set(-0.45, 0.1, 0.65)
    this.scene.add(this.instance)
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
    this.controls.enabled = false
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls.update()
  }
}