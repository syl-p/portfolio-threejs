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
  fox?: GLTF
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
  FoxDebug!: GUI;
  
  constructor(experience: Experience) {
    this.experience = experience
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    // Prepare Debug
    if(this.debug.active) {
      this.FoxDebug = this.debug.ui.addFolder('fox')
    }

    // Setup element
    this.resources.on('ready', () => {
      // this.setFloor()
      this.setFox()

      // Start environment
      this.environment = new Environment(this.experience)
    })
  }

  setFloor() {
    const textures: {color: THREE.Texture, normal: THREE.Texture} = {
      color: this.resources.items.grassColorTexture,
      normal: this.resources.items.grassNormalTexture
    }

    textures.color.encoding = THREE.sRGBEncoding
    textures.color.repeat.set(1.5, 1.5)
    textures.color.wrapS = THREE.RepeatWrapping
    textures.color.wrapT = THREE.RepeatWrapping

    textures.normal.repeat.set(1.5, 1.5)
    textures.normal.wrapS = THREE.RepeatWrapping
    textures.normal.wrapT = THREE.RepeatWrapping

    const floorMesh = new THREE.Mesh(
      new THREE.CircleGeometry(5, 64),
      new THREE.MeshStandardMaterial({
        map: this.resources.items.grassColorTexture,
        normalMap: this.resources.items.grassNormalTexture
      })
    )
    
    floorMesh.receiveShadow = true
    floorMesh.rotateX(- Math.PI * 0.5)
    this.scene.add(floorMesh)
  }

  setFox() {
    // Set Model 
    this.fox = this.resources.items.websylvain

    if (this.fox) {
      // this.fox.scene.scale.set(0.02, 0.02, 0.02)
      this.fox.scene.position.set(0, -1.55, 0)
      // this.fox.scene.position.set(0, 0, 0)
      this.scene.add(this.fox.scene)
  
      this.fox.scene.traverse((child) => {
        if(child instanceof THREE.Mesh) {
          child.castShadow = true
        }
      })

      // Debug Animation
      if(this.debug.active) {
      }
    }
  }

  update() {
    if (this.animation.animationMixer)
      this.animation.animationMixer.update(this.experience.time.delta * 0.001)
  }
}

