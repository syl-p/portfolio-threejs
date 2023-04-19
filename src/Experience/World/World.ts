import GUI from 'lil-gui';
import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import Experience from "../Experience";
import Debug from '../Utils/Debug';
import Environment from './Environment';
import Resources from './Resources';

export default class World {
  experience: Experience
  scene: THREE.Scene
  environment!: Environment
  resources: Resources
  debug: Debug

  // My World objects
  human?: GLTF
  ruby?: GLTF
  animation: {
    animationMixer: THREE.AnimationMixer | null, 
    actions: any,
    play: (name: string) => void
  } = {
    actions: {},
    animationMixer: null,
    play: function (): void {
      throw new Error('Function not implemented.');
    }
  }
  humanDebug!: GUI;
  
  constructor(experience: Experience) {
    this.experience = experience
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    // Prepare Debug
    if(this.debug.active) {
      this.humanDebug = this.debug.ui.addFolder('human')
    }

    // Setup element
    this.resources.on('ready', () => {
      // this.setFloor()
      this.setHuman()

      // Start environment
      this.environment = new Environment(this.experience)
    })
  }

  setHuman() {
    // Set Model 
    this.human = this.resources.items.websylvain

    if (this.human) {
      this.scene.add(this.human.scene)
  
      this.human.scene.traverse((child) => {
        if(child instanceof THREE.Mesh) {
          child.castShadow = true
        }
      })
      
      // Récupérer la scène glTF
      const bbox = new THREE.Box3().setFromObject(this.human.scene);
      const height = bbox.max.y - bbox.min.y;
      this.human.scene.position.y -= height * 0.9

      this.setRuby(new THREE.Vector3(
        this.human.scene.position.x,
        this.human.scene.position.y + height * 0.9,
        this.human.scene.position.z + 0.4
      ))

      // Debug
      if(this.debug.active) {

      }
    }
  }

  setRuby(humanPosition: THREE.Vector3) {
    this.ruby = this.resources.items.ruby
    const material = new THREE.MeshStandardMaterial({ color: 'red' })

    if (this.ruby) {
      this.ruby.scene.scale.set(0.08, 0.08, 0.08)
      this.ruby.scene.position.set(
        humanPosition.x, 
        humanPosition.y,
        humanPosition.z
      )

      this.scene.add(this.ruby.scene)
  
      this.ruby.scene.traverse((child) => {
        if(child instanceof THREE.Mesh) {
          child.castShadow = true
          child.material = material
        }
      })

      // Debug
      if(this.debug.active) {

      }
    }
  }

  update() {
    if (this.animation.animationMixer)
      this.animation.animationMixer.update(this.experience.time.delta * 0.001)

    if (this.ruby)
      this.ruby.scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.experience.time.delta * 0.001)
  }
}

