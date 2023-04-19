import * as THREE from 'three'
import Camera from "./Camera";
import Renderer from './Renderer';
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Resources from './World/Resources';
import World from './World/World';
import sources from './sources'
import Debug from './Utils/Debug';
import EventEmitter from './Utils/EventEmitter';
import { gsap } from 'gsap';

export default class Experience {
  canvas: HTMLElement
  sizes: Sizes
  time: Time
  scene: THREE.Scene
  camera: Camera
  renderer: Renderer
  world: World
  resources: Resources
  debug: Debug;
  overlay!: THREE.Mesh
  sectionEmitter = new EventEmitter()
  progressBar!: HTMLElement

  constructor(canvas: HTMLElement) {
    // @ts-ignore
    window.experience = this // Global access
    this.canvas = canvas
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()

    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera(this)
    this.renderer = new Renderer(this)
    this.world = new World(this)

    this.sizes.on('resize', () => {
      this.resize()
    })

    this.time.on('tick', () => {
      this.update()
    })

    if(this.debug.active) {
      this.scene.add( new THREE.AxesHelper( 5 ) );
    }

    // Overlay progression
    this.setOverlay()
    this.progressBar = document.querySelector('.loading-bar') as HTMLElement
    if(this.progressBar) {
      this.progressBar.style.transform = "scaleX(0)"
    }

    this.resources
      .on('loaded', () => {
        // @ts-ignore
        gsap.to(this.overlay.material.uniforms.uAlpha, {duration: 3, value: 0, delay: 1})
        if (this.progressBar) {
          window.setTimeout(() => {
          this.progressBar.style.transform = "scaleX(0)"
          this.progressBar.style.transformOrigin = "100% 0"
          this.progressBar.style.transition = "transform 1.5s ease-in-out"
          }, 500)
        }
      })
      
    this.resources
      .on('progress', (arg: { itemsLoaded: number; itemsTotal: number; }) => {
        if(this.progressBar && arg) {
          const progressRatio = (arg.itemsLoaded / arg.itemsTotal).toFixed(2)
          this.progressBar.style.transform = `scaleX(${progressRatio})`
        }
      })
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.update()
    this.renderer.update()
    this.world.update()
  }

  destroy() {
    this.sizes.off('resize')
    this.time.off('tick')


    // Traverse the scene
    this.scene.traverse((child) => {
      if(child instanceof THREE.Mesh) {
        child.geometry.dispose()
        for(const key in child.material) {
          const value = child.material[key]
          // Test if there is a dispose function
          if(value && typeof value.dispose === 'function')
          {
              value.dispose()
          }
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()
    if(this.debug.active)
      this.debug.ui.destroy()
  }


  setOverlay() {
    this.overlay = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 10, 10),  
      new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          uAlpha: {value: 1.0}
        },
        vertexShader: `
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uAlpha;
          void main() {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
          }
        `
      })
    )

    this.scene.add(this.overlay)
  }
}