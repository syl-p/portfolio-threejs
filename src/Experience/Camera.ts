import gsap from 'gsap';
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


    this.experience.resources.on('loaded', () => {
      if (this.experience.world.ruby) {
        const target = this.experience.world.ruby?.scene.position.clone()
        this.moveTo(target, new THREE.Vector3(0.1, 0.1, 0.1))
      }
    })

    this.experience.sectionEmitter.on('entered', (id) => {
      switch (id) {
        case 'intro':
          break;
        case 'services':
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
    this.instance.position.set(-0.3, -0.2, 0.8)
    this.scene.add(this.instance)
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
    this.controls.enabled = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  moveTo(target: THREE.Vector3, offset = new THREE.Vector3()) {
    gsap.to(this.instance.position, {
      duration: 2, // Durée de l'animation en secondes
      x: target.x + offset.x,
      y: target.y + offset.y,
      z: target.z + offset.z,
      ease: "linear"
    });

    gsap.to(this.controls.target, {
      duration: 2, // Durée de l'animation en secondes
      x: target.x,
      y: target.y,
      z: target.z,
      ease: "linear"
    });           
  }

  update() {
    this.controls.update()
  }
}